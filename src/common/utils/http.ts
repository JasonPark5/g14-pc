import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { get, merge } from 'lodash-es'

import {
  getAccessExpiredCode,
  getAccessToken,
  getNewToken,
  getPassPasswordCode,
  getRefreshExpiredCode,
  getWrongPasswordCode,
  removeAccessToken,
  removeRefreshToken,
  removeToken
} from '@/common/auth'
import { getLang } from '@utils/common'
import commMessage from '@utils/message'

import { useLoadingStore } from '@stores/loading'

// 로딩바 보이지 않게 할 URL 목록
const hideLoadingUrlList = [
  '/api/sys/appr/list/mycnt',
  '/api/sys/favorites',
  '/api/sys/favorite',
  '/api/sys/main/notices',
  '/api/hea/checkup/examine/tempUpload',
  '/api/openapi/weathers'
]

// 무한 루프 방지 플래그
let isClearing = false
// 토큰 갱신 중 플래그
let isRefreshing = false
// 토큰 갱신 대기 중인 요청들
let pendingRequests: Array<() => void> = []

/**
 * 토큰 삭제 및 로그인 페이지로 이동
 * - loginStore를 사용하지 않고 직접 처리 (순환 참조 방지)
 */
function clearAndRedirect() {
  if (isClearing) {
    console.log('### [http.ts] 이미 로그아웃 진행 중')
    return
  }

  isClearing = true
  console.log('### [http.ts] 토큰 삭제 및 로그인 페이지로 이동')

  // 토큰 직접 삭제 (loginStore 사용 안함)
  removeToken()
  removeAccessToken()
  removeRefreshToken()
  window.sessionStorage.removeItem('defaultPlantCd')

  // 로그인 페이지로 이동
  window.location.href = '/login'
}

/**
 * 대기 중인 요청들 처리
 */
function processPendingRequests() {
  pendingRequests.forEach((callback) => callback())
  pendingRequests = []
}

/** 요청 인스턴스 생성 */
function createService() {
  const service = axios.create()

  service.interceptors.request.use(
    (config) => {
      const params = config.params || {}
      params.lang = getLang()
      params.plantCdList = params.plantCdList || ['1000']
      params.plantCd = params.plantCd || '1000'
      config.params = params
      return config
    },
    (error) => Promise.reject(error)
  )

  service.interceptors.response.use(
    (response) => {
      const loading = useLoadingStore()
      loading.loadingHide()
      return response
    },
    async (error) => {
      const loading = useLoadingStore()
      const status = get(error, 'response.status')
      const originalRequest = error.config

      if (status === 401) {
        const returnCode = get(error, 'response.data.returnCode')

        console.log('### [http.ts] 401 에러, returnCode:', returnCode)

        // Access Token 만료 - 갱신 시도
        if (returnCode === getAccessExpiredCode()) {
          // 이미 갱신 중이면 대기
          if (isRefreshing) {
            return new Promise((resolve) => {
              pendingRequests.push(() => {
                const newToken = getAccessToken()
                if (originalRequest.headers && newToken) {
                  originalRequest.headers['X-Authorization'] = newToken
                }
                resolve(service(originalRequest))
              })
            })
          }

          isRefreshing = true

          try {
            await getNewToken()
            isRefreshing = false

            // 새 토큰으로 헤더 업데이트
            const newToken = getAccessToken()
            if (originalRequest.headers && newToken) {
              originalRequest.headers['X-Authorization'] = newToken
            }

            // 대기 중인 요청들 처리
            processPendingRequests()

            // 원래 요청 재시도
            return service(originalRequest)
          } catch (refreshError) {
            isRefreshing = false
            pendingRequests = []
            console.error('### [http.ts] 토큰 갱신 실패:', refreshError)
            clearAndRedirect()
            return Promise.reject(refreshError)
          }
        }

        // Refresh Token 만료
        else if (returnCode === getRefreshExpiredCode()) {
          console.log('### [http.ts] Refresh Token 만료')
          clearAndRedirect()
        }

        // 비밀번호 관련 (로그인 실패 등)
        else if (returnCode === getWrongPasswordCode() || returnCode === getPassPasswordCode()) {
          // 별도 처리 없음 - 로그인 화면에서 처리
        }

        // 기타 401 에러 (토큰 없음, 잘못된 토큰 등)
        else {
          console.log('### [http.ts] 기타 401 에러, 로그인 페이지로 이동')
          clearAndRedirect()
        }
      } else {
        // 401 이외의 에러
        const errorResponse = get(error, 'response')
        const errorMessage = get(error, 'response.data.message')
        const errorDetail = {
          status: errorResponse?.status,
          cause: errorResponse?.data?.cause,
          causeDetail: errorResponse?.data?.causeDetail,
          url: errorResponse?.data?.url,
          config: {
            method: errorResponse?.config?.method,
            url: errorResponse?.config?.url
          }
        }

        if (import.meta.env.MODE !== 'production') {
          commMessage.exceptionNotify({
            title: '[개발자 안내]',
            message: errorMessage,
            errorDetail: errorDetail,
            type: 'error',
            duration: 0
          })
        } else {
          commMessage.alert({
            title: '에러',
            message: '서비스 처리 중 오류가 발생하였습니다.\n관리자에게 문의바랍니다.',
            type: 'error',
            duration: 0
          })
        }
      }

      loading.loadingAllHide()
      return Promise.reject(error)
    }
  )

  return service
}

// 토큰 없이 호출 가능한 API 목록 (백엔드 WebSecurityConfig의 permitAll과 동기화)
const noAuthUrlList = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/user/changepw',
  '/api/auth/user/nextChangePw',
  '/api/auth/partner/login',
  '/api/auth/partner/logout',
  '/api/auth/partner/refresh',
  '/api/auth/partner/changepw',
  '/api/auth/partner/nextChangePw',
  '/api/auth/sso',
  '/api/auth/sso-test',
  '/api/system/langs',
  '/api/openapi/',
  '/api/mdm/cim/vendor/chgId',
  '/api/com/fileToVods/'
]

/**
 * 토큰 불필요 API인지 확인
 */
function isNoAuthUrl(url: string | undefined): boolean {
  if (!url) return false
  return noAuthUrlList.some((noAuthUrl) => url.startsWith(noAuthUrl))
}

/** 요청 방법 생성 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = config.headers?.refreshToken || getAccessToken() || ''
    const url = config.url || ''

    // 토큰 불필요 API가 아닌데 토큰이 없으면 요청 중단
    if (!isNoAuthUrl(url) && (!token || !token.includes('Bearer '))) {
      console.warn('### [http.ts] 유효한 토큰 없음, 요청 중단:', url)
      return Promise.reject(new Error('No valid access token'))
    }

    const defaultConfig = {
      headers: {
        'Cache-Control': 'no-cache',
        'X-Authorization': token || ''
      },
      timeout: config.timeout || 20000,
      baseURL: import.meta.env.VITE_API_URL,
      data: {}
    }

    const mergeConfig = merge(defaultConfig, config)

    if (mergeConfig.data && typeof mergeConfig.data === 'object') {
      mergeConfig.data.plantCd = mergeConfig.data.plantCd || '1000'
    }

    const loading = useLoadingStore()

    if (hideLoadingUrlList.indexOf(String(config.url)) < 0) {
      loading.loadingShow()
    }

    return service(mergeConfig)
  }
}

const service = createService()
export const $http = createRequest(service)

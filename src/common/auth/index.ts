import { accessRouterData } from '@/stores/permission'
import axios from 'axios'
import Cookies from 'js-cookie'
import { uid } from 'quasar'

// token은 user_id를 가져오고 있음
const TokenKey = 'jwtToken'
const RefreshTokenKey = 'refreshToken'
const accessTokenKey = 'accessToken'

const accessExpiredCode = 'ACCESS_EXPIRED'
const refreshExpiredCode = 'REFRESH_EXPIRED'
const wrongPasswordCode = 'WRONG_PASSWORD'
const notUserCode = 'NOT_USER_ID'
const passPasswordCode = 'PASS_PASSWORD'
const concurrentExpiredCode = 'CONCURRENT_EXPIRED'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * Access Token 조회
 * 저장 시 'Bearer ' 접두사가 포함되어 있으므로 그대로 반환
 * @returns 'Bearer {token}' 형식의 토큰 또는 undefined
 */
export function getAccessToken() {
  return Cookies.get(accessTokenKey)
}

/**
 * Access Token 저장
 * 'Bearer ' 접두사를 붙여서 저장
 * @param accessToken - 순수 토큰 문자열 (Bearer 없이)
 */
export function setAccessToken(accessToken: string) {
  // 이미 Bearer가 붙어있으면 그대로 저장, 아니면 붙여서 저장
  const tokenToStore = accessToken.startsWith('Bearer ') ? accessToken : 'Bearer ' + accessToken
  return Cookies.set(accessTokenKey, tokenToStore)
}

export function removeAccessToken() {
  return Cookies.remove(accessTokenKey)
}

/**
 * Refresh Token 조회
 * 저장 시 'Bearer ' 접두사가 포함되어 있으므로 그대로 반환
 * @returns 'Bearer {token}' 형식의 토큰 또는 undefined
 */
export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

/**
 * Refresh Token 저장
 * 'Bearer ' 접두사를 붙여서 저장
 * @param refreshToken - 순수 토큰 문자열 (Bearer 없이)
 */
export function setRefreshToken(refreshToken: string) {
  // 이미 Bearer가 붙어있으면 그대로 저장, 아니면 붙여서 저장
  const tokenToStore = refreshToken.startsWith('Bearer ') ? refreshToken : 'Bearer ' + refreshToken
  return Cookies.set(RefreshTokenKey, tokenToStore)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function getNewToken() {
  const uniqId = uid()
  const refToken = getRefreshToken()

  const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000
  })
  const validRefreshCall = service
    .get('/api/auth/refresh', {
      headers: {
        // 요청 헤더 - getRefreshToken()이 이미 'Bearer ' 포함하여 반환
        'X-Authorization': refToken
      }
    })
    .then((response) => {
      const data = response.data
      console.log(uniqId, '# data: ', data)
      // 응답으로 받은 토큰은 순수 토큰이므로 setAccessToken/setRefreshToken에서 Bearer 추가
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      return Promise.resolve(true)
    })
    .catch((error) => {
      return Promise.reject(error)
    })
  console.log(uniqId, '# validRefreshCall: ', validRefreshCall)
  return validRefreshCall
}

export function getAccessExpiredCode() {
  return accessExpiredCode
}

export function getRefreshExpiredCode() {
  return refreshExpiredCode
}

export function getWrongPasswordCode() {
  return wrongPasswordCode
}

export function getConcurrentExpiredCode() {
  return concurrentExpiredCode
}
export function getNotUserCode() {
  return notUserCode
}
export function getPassPasswordCode() {
  return passPasswordCode
}

export function haveRoute(routers: Array<accessRouterData>, path: string) {
  if (!routers || routers.length === 0) return false
  for (let i = 0; i < routers.length; i++) {
    const routerPath = routers[i].path
    // 정확한 매칭
    if (routerPath === path) {
      return true
    }
    // 파라미터가 포함된 경로 매칭 (예: /a/b/c 가 /a/b/c/param1 의 기본 경로인 경우)
    if (routerPath && path.startsWith(routerPath + '/')) {
      return true
    }
  }
  return false
}

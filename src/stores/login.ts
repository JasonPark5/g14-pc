import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'

import { useLangTranStore } from '@stores/langTran'
import { useStoreApiStore } from '@stores/storeApi'
import { useUserStore } from '@stores/user'

import {
  getAccessToken,
  getToken,
  removeAccessToken,
  removeRefreshToken,
  removeToken,
  setAccessToken,
  setRefreshToken,
  setToken
} from '@/common/auth'

interface loginData {
  userId: string
  password: string
  connIp: string
  otppassword?: string
}

export const useLoginStore = defineStore('login', () => {
  const storeApi = useStoreApiStore()
  const userStore = useUserStore()
  const langStore = useLangTranStore()

  const token = ref(getToken())
  const accessToken = ref('')
  const refreshToken = ref('')

  function sso() {
    return new Promise((_resolve, reject) => {
      console.warn('sso() deprecated')
      reject(new Error('Use handleOktaCallback'))
    })
  }

  async function handleOktaCallback(data: {
    userId: string
    accessToken: string
    refreshToken: string
  }): Promise<boolean> {
    console.log('### [handleOktaCallback] 시작')

    if (!data.userId || !data.accessToken || !data.refreshToken) {
      throw new Error('필수 인증 정보 누락')
    }

    // Bearer 제거
    const pureAccessToken = data.accessToken.replace(/^Bearer\s+/i, '').trim()
    const pureRefreshToken = data.refreshToken.replace(/^Bearer\s+/i, '').trim()

    token.value = data.userId
    accessToken.value = pureAccessToken
    refreshToken.value = pureRefreshToken

    // 쿠키 저장
    setToken(data.userId)
    setAccessToken(pureAccessToken)
    setRefreshToken(pureRefreshToken)

    console.log('### [handleOktaCallback] 쿠키 저장 완료')

    await nextTick()

    const savedToken = getAccessToken()
    console.log('### [handleOktaCallback] 저장 확인:', savedToken?.substring(0, 40))

    if (!savedToken || !savedToken.includes('Bearer')) {
      throw new Error('토큰 저장 실패')
    }

    return true
  }

  async function LoginByUserAccount(userInfo: loginData) {
    const userId = userInfo.userId.trim()
    try {
      const response: any = await storeApi.loginByUserAccount(
        userId,
        userInfo.password,
        userInfo.connIp,
        userInfo.otppassword
      )
      const data = response.data
      token.value = data.userId
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken

      setToken(response.data.userId)
      setAccessToken(response.data.accessToken)
      setRefreshToken(response.data.refreshToken)

      await userStore.refetchUser()
      await langStore.refetchLang()

      return true
    } catch (error: any) {
      throw error
    }
  }

  function LogOut() {
    return new Promise((resolve, reject) => {
      storeApi
        .logout()
        .then(() => {
          clear()
          resolve(true)
        })
        .catch((error) => {
          clear()
          reject(error)
        })
    })
  }

  function clear() {
    token.value = ''
    accessToken.value = ''
    refreshToken.value = ''
    removeToken()
    removeAccessToken()
    removeRefreshToken()
    window.sessionStorage.removeItem('defaultPlantCd')
  }

  function UpdateTokenByRefreshToken() {
    return new Promise((resolve, reject) => {
      storeApi
        .updateTokenByRefreshToken()
        .then(() => resolve(true))
        .catch((error) => {
          if (error.response?.data?.message) {
            window.alert(error.response.data.message)
          }
          reject(error)
        })
    })
  }

  function ValidCheckToken() {
    return new Promise((resolve, reject) => {
      storeApi
        .validToken()
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  return {
    token,
    accessToken,
    refreshToken,
    sso,
    handleOktaCallback,
    LoginByUserAccount,
    LogOut,
    UpdateTokenByRefreshToken,
    ValidCheckToken
  }
})

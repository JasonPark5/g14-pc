import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getAccessToken, getToken } from '@/common/auth'
import { userType } from '@/types/user'

interface fetchUserType {
  auths: Array<string> | null
  user: userType
  depts: Array<any>
  users: Array<any>
  vendors: Array<any>
}

export const useUserStore = defineStore('user', () => {
  const user = ref<userType>({
    id: '',
    jobCd: '',
    jobName: '',
    loginId: '',
    loginPwd: '',
    mobileNo: '',
    oripassword: '',
    password: '',
    deptCd: '',
    deptName: '',
    email: '',
    empNo: '',
    enterDate: '',
    birthDate: '',
    plantCd: '',
    plantCds: '',
    plantName: '',
    recommendationFlag: '',
    remark: '',
    retireDate: '',
    retireFlag: '',
    seniorName: '',
    seniorityName: '',
    sexCd: '',
    sexName: '',
    spotCd: '',
    spotName: '',
    typeName: '',
    userId: '',
    oldUserId: '',
    userName: '',
    menuNm: '',
    dashboardId: '',
    approveSignature: '',
    url: '',
    checkupBatchCycleCd: '',
    checkupComeDate: '',
    checkupCycleCd: '',
    checkupOccCycleCd: '',
    checkupRecentDate: '',
    checkupScheduleDate: '',
    checkupStatus: '',
    defectManageFlag: '',
    hazardNames: '',
    deptUserName: ''
  })

  const auths = ref<Array<string> | null>([])
  const depts = ref([])
  const vendors = ref([])
  const roles = ref([])
  const isLoggingOut = ref(false)

  const userVueQuery = ref({
    isStale: true,
    isFetching: false,
    refetch: null as (() => Promise<void>) | null
  })

  // API 호출 함수
  async function fetchUserInfo(): Promise<fetchUserType | null> {
    const token = getAccessToken()

    if (!token || !token.includes('Bearer')) {
      console.warn('### [fetchUserInfo] 유효한 토큰 없음')
      return null
    }

    console.log('### [fetchUserInfo] API 호출 시작')

    const response = await axios.get<fetchUserType>(selectConfig.auth.userInfo.url, {
      headers: {
        'Cache-Control': 'no-cache',
        'X-Authorization': token
      },
      baseURL: import.meta.env.VITE_API_URL,
      params: {
        deviceTypeCd: 'P'
      }
    })

    return response.data
  }

  // 사용자 정보 새로고침
  async function refetchUser(): Promise<void> {
    const token = getAccessToken()

    if (!token || !token.includes('Bearer')) {
      console.warn('### [refetchUser] 유효한 토큰 없음, 중단')
      return
    }

    userVueQuery.value.isFetching = true

    try {
      const data = await fetchUserInfo()

      if (data) {
        const currentToken = getToken()
        const fetchedUserId = data.user?.userId

        // 토큰 불일치 체크
        if (currentToken && fetchedUserId && fetchedUserId !== currentToken) {
          if (!isLoggingOut.value) {
            console.warn('### [refetchUser] 토큰 불일치')
            isLoggingOut.value = true

            const { useLoginStore } = await import('@stores/login')
            const loginStore = useLoginStore()
            await loginStore.LogOut()
            isLoggingOut.value = false
            window.location.href = '/login'
          }
          return
        }

        auths.value = data.auths
        user.value = data.user
        userVueQuery.value.isStale = false
        console.log('### [refetchUser] 완료:', user.value.userId)
      }
    } catch (error) {
      console.error('### [refetchUser] 오류:', error)
    } finally {
      userVueQuery.value.isFetching = false
    }
  }

  userVueQuery.value.refetch = refetchUser

  return {
    user,
    userVueQuery,
    auths,
    depts,
    vendors,
    roles,
    refetchUser
  }
})

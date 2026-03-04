<template>
  <div class="login-callback-container">
    <div class="loading-content">
      <q-spinner-dots size="80px" color="primary" />
      <div class="q-mt-md text-weight-bold status-message">{{ statusMessage }}</div>
      <div v-if="errorMessage" class="q-mt-sm text-negative error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAccessToken } from '@/common/auth'
import { useLangTranStore } from '@stores/langTran'
import { useLoginStore } from '@stores/login'
import { usePermissionStore } from '@stores/permission'
import { useUserStore } from '@stores/user'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'LoginCallback' })

const route = useRoute()
const router = useRouter()
const loginStore = useLoginStore()
const userStore = useUserStore()
const langStore = useLangTranStore()
const permissionStore = usePermissionStore()

const statusMessage = ref('보안 인증 처리 중...')
const errorMessage = ref('')

/** 권한 메뉴 로드 완료 대기 (최대 5초) */
function waitForMenuLoad(): Promise<void> {
  return new Promise((resolve) => {
    // 이미 로드 완료된 경우
    if (permissionStore.addRouters && permissionStore.addRouters.length > 0) {
      resolve()
      return
    }

    const timeout = setTimeout(() => {
      console.warn('### [LoginCallback] 메뉴 로드 타임아웃, 계속 진행')
      unwatch()
      resolve()
    }, 5000)

    const unwatch = watch(
      () => permissionStore.addRouters,
      (newRouters) => {
        if (newRouters && newRouters.length > 0) {
          clearTimeout(timeout)
          unwatch()
          resolve()
        }
      },
      { immediate: true }
    )
  })
}

onMounted(async () => {
  try {
    const userId = route.query.userId as string
    const accessToken = route.query.accessToken as string
    const refreshToken = route.query.refreshToken as string

    console.log('### [LoginCallback] 파라미터 확인:', { userId, hasToken: !!accessToken })

    if (!userId || !accessToken || !refreshToken) {
      throw new Error('필수 파라미터 누락')
    }

    // 1. 토큰 저장
    statusMessage.value = '인증 정보 저장 중...'
    await loginStore.handleOktaCallback({ userId, accessToken, refreshToken })

    // 2. 토큰 저장 확인
    const savedToken = getAccessToken()
    console.log('### [LoginCallback] 저장된 토큰:', savedToken?.substring(0, 50))

    if (!savedToken || !savedToken.includes('Bearer')) {
      throw new Error('토큰 저장 실패')
    }

    // 3. 사용자 정보 로드 (명시적 호출)
    statusMessage.value = '사용자 정보 확인 중...'
    await userStore.refetchUser()

    // 4. 언어 정보 로드
    await langStore.refetchLang()

    // 5. 권한 메뉴 로드 대기 (최대 5초)
    statusMessage.value = '메뉴 권한 확인 중...'
    await waitForMenuLoad()

    statusMessage.value = '로그인 성공!'

    // 6. 이동
    let targetUrl = '/'
    const savedPath = localStorage.getItem('checkToPath')

    if (savedPath && !['/login-callback', '/login', ''].includes(savedPath)) {
      targetUrl = savedPath
    } else if (userStore.user?.url && userStore.user.url !== '/login-callback') {
      targetUrl = userStore.user.url
    }

    console.log('### [LoginCallback] 이동:', targetUrl)
    router.replace(targetUrl)
  } catch (error: any) {
    console.error('### [LoginCallback] 오류:', error)
    statusMessage.value = '로그인 실패'
    errorMessage.value = error.message || '알 수 없는 오류'
    setTimeout(() => router.replace('/login'), 2000)
  }
})
</script>

<style scoped>
.login-callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.loading-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.status-message {
  font-size: 16px;
  color: #333;
}
.error-message {
  font-size: 14px;
}
</style>

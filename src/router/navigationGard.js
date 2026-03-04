import router from '@/router'
import { storeToRefs } from 'pinia'

import { getToken, haveRoute } from '@/common/auth'
import transactionConfig from '@utils/transactionConfig'
import { $http } from '@utils/http'

import { useAppStore } from '@stores/app'
import { usePermissionStore } from '@stores/permission'
import { useUserStore } from '@stores/user'
import { useLoginStore } from '@stores/login'

/** 인증 없이 접근 가능한 경로 */
const whiteList = ['/login', '/404', '/sessionTimeOut', '/login-callback']

/** 토큰 검증을 건너뛸 경로 */
const skipTokenValidationList = ['/login-callback']

router.beforeEach(async (to, from, next) => {
  const app = useAppStore()
  const permission = usePermissionStore()
  const { addRouters } = storeToRefs(permission)
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  const login = useLoginStore()

  app.setLoading(true)

  // 1. 404 페이지
  if (to.path === '/404') {
    next()
    return
  }

  // 2. SSO 콜백 특별 처리
  if (to.path === '/login-callback') {
    const hasParams = to.query.userId && to.query.accessToken && to.query.refreshToken
    if (hasParams) {
      console.log('### [Guard] SSO 콜백 진입 허용')
      next()
    } else {
      console.warn('### [Guard] SSO 파라미터 없음')
      next('/login')
    }
    return
  }

  // 3. 라우트 권한 체크
  if (addRouters.value && addRouters.value.length > 0) {
    if (whiteList.indexOf(to.path) === -1 && !haveRoute(addRouters.value, to.path)) {
      next({ path: '/404' })
      return
    }
  }

  // 4. 경로 저장 (login-callback 제외)
  if (to.path !== '/login-callback') {
    window.localStorage.setItem('checkToPath', to.path)
  }

  // 5. 토큰 확인
  const isToken = getToken()

  if (isToken && isToken !== 'undefined') {
    // 메뉴 로그 (운영환경)
    if (
      to.name &&
      user.value.userId &&
      user.value.userId !== 'U000000001' &&
      to.meta.menulog === undefined &&
      import.meta.env.MODE === 'otherproduction'
    ) {
      $http({
        url: transactionConfig.sys.log.menulog.insert.url,
        method: 'POST',
        data: {
          sysMenuId: to.name,
          url: to.path,
          userId: user.value.userId,
          userName: user.value.userName,
          deviceType: 'P'
        }
      }).catch(() => {})
    }

    // 로그인 페이지 접근 시 메인으로 리다이렉트
    if (to.path === '/login') {
      let targetPath = user.value.url || '/'
      if (targetPath === '/login-callback' || targetPath === '/login') {
        targetPath = '/'
      }
      next({ path: targetPath })
      return
    }

    // 토큰 검증 스킵 경로
    if (skipTokenValidationList.includes(to.path)) {
      next()
      return
    }

    // 토큰 유효성 검증
    try {
      await login.ValidCheckToken()
      next()
    } catch {
      try {
        await login.UpdateTokenByRefreshToken()
        next()
      } catch {
        console.error('### [Guard] 토큰 갱신 실패')
        await clearAndRedirect(login, next)
      }
    }
  } else {
    // 토큰 없음
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to) => {
  const app = useAppStore()
  const permission = usePermissionStore()

  if (to.path !== '/login-callback') {
    permission.findOpenMenus(to.name)
  }

  app.setLoading(false)
})

async function clearAndRedirect(login, next) {
  try {
    await login.LogOut()
  } catch (e) {
    console.error('### [Guard] 로그아웃 오류:', e)
  } finally {
    next('/login')
  }
}

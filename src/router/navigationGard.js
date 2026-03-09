import router from '@/router'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

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
      // redirect 쿼리 파라미터가 있으면 우선 사용
      const redirectPath = to.query.redirect
      if (redirectPath && String(redirectPath) !== '/login' && String(redirectPath) !== '/login-callback') {
        next({ path: String(redirectPath) })
        return
      }
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
      await ensureUserAndRoutes(user, userStore, addRouters, permission, to, next)
    } catch {
      try {
        await login.UpdateTokenByRefreshToken()
        await ensureUserAndRoutes(user, userStore, addRouters, permission, to, next)
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

/**
 * 사용자 정보 및 동적 라우트 로드를 보장한 후 네비게이션 진행
 * 라우트가 새로 등록된 경우 재네비게이션하여 Vue Router가 라우트를 re-resolve하도록 함
 */
async function ensureUserAndRoutes(user, userStore, addRouters, permission, to, next) {
  const routesWereEmpty = addRouters.value.length === 0

  // 새로고침/로그인 시: 사용자 정보가 없으면 로드
  if (!user.value.empNo) {
    await userStore.refetchUser()
  }

  // 동적 라우트가 아직 미등록이면 메뉴 로드 대기 (최대 5초)
  if (routesWereEmpty && user.value.empNo) {
    await waitForRoutes(permission, 5000)
  }

  // 라우트 권한 재확인 (메뉴 로드 후)
  if (addRouters.value.length > 0 && whiteList.indexOf(to.path) === -1 && !haveRoute(addRouters.value, to.path)) {
    next({ path: '/404' })
    return
  }

  // 라우트가 이번 네비게이션 중 새로 등록된 경우:
  // Vue Router는 push 시점에 라우트를 resolve하므로, 등록 전에 push된 경우
  // to.matched가 비어있음 → next()로는 컴포넌트가 렌더링되지 않음
  // 재네비게이션하여 라우트를 다시 resolve해야 함
  if (routesWereEmpty && addRouters.value.length > 0) {
    next({ path: to.path, query: to.query, hash: to.hash })
    return
  }

  next()
}

async function clearAndRedirect(login, next) {
  try {
    await login.LogOut()
  } catch (e) {
    console.error('### [Guard] 로그아웃 오류:', e)
  } finally {
    next('/login')
  }
}

/** 동적 라우트 등록 완료 대기 (최대 timeout ms) */
function waitForRoutes(permission, timeout) {
  return new Promise((resolve) => {
    if (permission.addRouters && permission.addRouters.length > 0) {
      resolve()
      return
    }

    const timer = setTimeout(() => {
      console.warn('### [Guard] 라우트 로드 타임아웃')
      unwatch()
      resolve()
    }, timeout)

    const unwatch = watch(
      () => permission.addRouters,
      (val) => {
        if (val && val.length > 0) {
          clearTimeout(timer)
          unwatch()
          resolve()
        }
      }
    )
  })
}

import { createRouter, createWebHistory } from 'vue-router'

import FullLayout from '@layouts/fullLayout.vue'

export const asyncRouterMap = [
  {
    path: '/login',
    name: 'loginP',
    hidden: true,
    component: FullLayout,
    children: [{ name: 'login', path: '', component: () => import('@views/login/Login.vue') }],
    meta: { editable: true, layout: 'full', menulog: 'N' }
  },
  // login-callback: 독립 라우트로 설정 (Breadcrumb 문제 해결)
  {
    path: '/login-callback',
    name: 'LoginCallback',
    hidden: true,
    component: () => import('@/views/login/LoginCallback.vue'),
    meta: {
      auth: false,
      editable: true,
      layout: 'full',
      menulog: 'N',
      noCache: true,
      noBreadcrumb: true
    }
  },
  {
    path: '/',
    name: 'mainRouter',
    hidden: true,
    component: () => import('@views/main/mainRouter.vue'),
    meta: { editable: true, menulog: 'N', layout: 'default' }
  },
  {
    path: '/main/index',
    name: 'defaultRouter',
    hidden: true,
    component: () => import('@views/main/indexDirector.vue'),
    meta: { editable: true, menulog: 'N', layout: 'default' }
  },
  {
    path: '/404',
    name: '404P',
    hidden: true,
    component: FullLayout,
    children: [{ name: '404', path: '', component: () => import('@views/error/404.vue') }],
    meta: { editable: true, layout: 'full', menulog: 'N' }
  },
  {
    path: '/ram/compare/compareScenario',
    name: 'compareScenario',
    hidden: true,
    title: '이전평가결과조회',
    component: FullLayout,
    children: [
      {
        name: 'compare',
        path: '',
        component: () => import('@views/ram/compare/compareScenario.vue')
      }
    ],
    meta: { menulog: 'N', editable: true, layout: 'full' }
  },
  {
    path: '/sys/menu/manualPage',
    name: 'manualP',
    hidden: true,
    title: '매뉴얼',
    component: FullLayout,
    children: [
      { name: 'manual', path: '', component: () => import('@views/sys/menu/manualPage.vue') }
    ],
    meta: { editable: true, layout: 'full', menulog: 'N' }
  },
  {
    path: '/sys/um/userManualPage',
    name: 'manualPage',
    hidden: true,
    title: '사용자매뉴얼',
    component: FullLayout,
    children: [
      { name: 'userManual', path: '', component: () => import('@views/sys/um/userManualPage.vue') }
    ],
    meta: { editable: true, layout: 'full', menulog: 'N' }
  },
  {
    path: '/sop/edu/result/educationResultVodDetail',
    name: 'vodPlay',
    hidden: true,
    title: '교육 VOD',
    component: FullLayout,
    children: [
      {
        name: 'vod',
        path: '',
        component: () => import('@views/sop/edu/result/educationResultVodDetail.vue')
      }
    ],
    meta: { editable: true, layout: 'full', menulog: 'N' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: asyncRouterMap
})

export function addAuthRouter(authRouters: Array<any>) {
  const forEachData = _.filter(authRouters, (item) => {
    return _.findIndex(router.getRoutes(), { name: item.name }) === -1
  })
  _.forEach(forEachData, (menuInfo) => {
    router.addRoute(menuInfo)
  })
}

export default router

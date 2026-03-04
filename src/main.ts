import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { VueQueryPlugin } from 'vue-query'

import App from '@/App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from '@/router'
import '@/router/navigationGard'
/** plugin load */
import { loadPlugins } from '@/config/plugins'

/** Layout */
import { loadLayouts } from '@/config/layouts'

/** utils set Global variables */
import { setGlobalVariableUtils, loadUtils } from '@/common/utils'

/** CSS */
import '@assets/style/main.scss'

/** Vue3 App create */
const app = createApp(App)

/** pinia use */
app.use(createPinia())

/** vue-query use */
app.use(VueQueryPlugin)

/** vue-router use */
app.use(router)

/** plugins */
loadPlugins(app)

/** layouts */
loadLayouts(app)

/** utils */
setGlobalVariableUtils(app)
loadUtils(app)

const systemInfo = useSystemInfoStore()

async function init() {
  await router.isReady()

  const publicPages = [
    'loginP',
    'login',
    'mainRouter',
    'defaultRouter',
    '404P',
    '404',
    'compareScenario',
    'manualP',
    'manual',
    'manualPage',
    'userManual',
    'vodPlay',
    'vod'
  ] // 로그인/공용 라우트 이름
  const currentRoute = router.currentRoute.value

  if (!publicPages.includes(String(currentRoute.name))) {
    try {
      await Promise.all([systemInfo.refetchUser(), systemInfo.refetchDept()])
    } catch (e) {
      console.warn('systemInfo 초기화 실패', e)
      router.push({ name: 'login' })
    }
  }

  app.mount('#app')
}

/** Directive */
// app.directive('table-resizable', tableResizable)

/** ASDF Component use */

init()

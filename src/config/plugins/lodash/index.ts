import { type App } from 'vue'
import * as lodash from 'lodash-es'

export function loadLodash(app: App) {
  /** lodash global variable */
  app.provide('$_', lodash)
  app.config.globalProperties.$_ = lodash
}

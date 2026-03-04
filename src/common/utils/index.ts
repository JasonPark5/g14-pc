import { type App } from 'vue'
// import { $http } from '@utils/http'
import * as comm from '@utils/common'
// import message from '@utils/message'
import multiLanguage from '@utils/multiLanguage'

export function setGlobalVariableUtils(app: App) {
  /** Global variables */
  // app.provide('$http', $http)
  // app.provide('$commMessage', message)
  app.config.globalProperties.$comm = comm
}

export function loadUtils(app: App) {
  /** load */
  app.use(multiLanguage)
}

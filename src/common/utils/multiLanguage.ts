import { type App } from 'vue'

import { getLanguage } from '@utils/common'
import { GetTranLanguageFunction } from '@/types/language'

/**
 * 국가에 따른 언어값 반환
 * @param {*} message
 * @returns 국가에 따른 언어값 반환
 */
const getTranLanguage: GetTranLanguageFunction = (message: string, format?: string) => {
  return getLanguage(message, format)
}

export default {
  install(app: App) {
    app.provide('$language', getTranLanguage)
    app.config.globalProperties.$language = getTranLanguage
  }
}

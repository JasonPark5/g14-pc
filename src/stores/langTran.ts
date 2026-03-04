import axios from 'axios'
import Cookies from 'js-cookie'
import { concat } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getAccessToken } from '@/common/auth'
import {
  enLanguageMap,
  jaLanguageMap,
  krLanguageMap,
  zhcnLanguageMap,
  zhtwLanguageMap
} from '@/common/lang'
import { getLanguageJsonApi } from '@utils/common'

interface langData {
  lang: string | undefined
}

interface langJson {
  conversionLanguage: string
  languageKey: string
}

export const useLangTranStore = defineStore('langTran', () => {
  const langs = ref<langJson[]>([])

  const langVueQuery = ref({
    isStale: true,
    isFetching: false
  })

  async function fetchLangsApi(): Promise<langJson[]> {
    const token = getAccessToken()
    if (!token || !token.includes('Bearer')) {
      return []
    }

    const response = await axios.get<langJson[]>(getLanguageJsonApi(), {
      headers: {
        'Cache-Control': 'no-cache',
        'X-Authorization': token
      },
      baseURL: import.meta.env.VITE_API_URL
    })
    return response.data
  }

  async function refetchLang(): Promise<void> {
    const token = getAccessToken()
    if (!token || !token.includes('Bearer')) {
      console.warn('### [refetchLang] 유효한 토큰 없음')
      return
    }

    langVueQuery.value.isFetching = true

    try {
      const data = await fetchLangsApi()

      const lang = Cookies.get('language') || 'kr'
      let _langs: any = []
      switch (lang) {
        case 'kr':
          _langs = krLanguageMap
          break
        case 'en':
          _langs = enLanguageMap
          break
        case 'ja':
          _langs = jaLanguageMap
          break
        case 'zh_cn':
          _langs = zhcnLanguageMap
          break
        case 'zh_tw':
          _langs = zhtwLanguageMap
          break
        default:
          _langs = krLanguageMap
      }

      if (data && data.length > 0) {
        _langs = concat(_langs, data)
      }
      langs.value = _langs
      langVueQuery.value.isStale = false
    } catch (error) {
      console.error('### [refetchLang] 오류:', error)
    } finally {
      langVueQuery.value.isFetching = false
    }
  }

  function GetNonAuthLangInfo(data: langData) {
    return new Promise((resolve, reject) => {
      const lang = data.lang || 'kr'
      let _langs: any = []
      switch (lang) {
        case 'kr':
          _langs = krLanguageMap
          break
        case 'en':
          _langs = enLanguageMap
          break
        case 'ja':
          _langs = jaLanguageMap
          break
        case 'zh_cn':
          _langs = zhcnLanguageMap
          break
        case 'zh_tw':
          _langs = zhtwLanguageMap
          break
        default:
          _langs = krLanguageMap
      }
      langs.value = _langs
      if (_langs) resolve(true)
      else reject()
    })
  }

  return { langs, GetNonAuthLangInfo, refetchLang }
})

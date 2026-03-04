import { inject } from 'vue'

import commMessage from '@utils/message'

import {
  AlertFunction,
  ConfirmFunction,
  MultiConfirmFunction,
  RequestSuccessFunction,
  RequestErrorFunction,
  ExceptionNotifyFunction,
  ValidErrorFunction,
  alertOptionData,
  toastrOptionData
} from '@/types/message'
import { GetTranLanguageFunction } from '@/types/language'

export const useMessageStore = defineStore('message', () => {
  const $language = inject('$language') as GetTranLanguageFunction

  const alert: AlertFunction = (option: alertOptionData) => {
    commMessage.alert({
      title: option.title || $language('안내'),
      message: option.message,
      type: option.type || 'info',
      buttonLabel: option.buttonLabel
    })
  }
  const confirm: ConfirmFunction = (option: toastrOptionData) => {
    commMessage.confirm(option)
  }
  const multiConfirm: MultiConfirmFunction = (option: toastrOptionData) => {
    commMessage.multiConfirm(option)
  }
  const requestSuccess: RequestSuccessFunction = (_message?: string) => {
    alert({
      message: _message ? $language(_message) : $language('정상적으로 처리되었습니다.'), // '정상적으로 처리되었습니다.'
      type: 'success'
    })
  }
  const requestError: RequestErrorFunction = (message: string, returnCode: string) => {
    if (!message) return
    const _bol = returnCode
      ? returnCode != 'INIT_PASSWORD' && returnCode != 'UNDER_CONSTRUCTION'
      : true
    if (_bol) {
      alert({
        title: $language('에러'),
        message: message,
        type: 'error',
        buttonLabel: 'OK'
      })
    }
  }
  const exceptionNotify: ExceptionNotifyFunction = (option: toastrOptionData) => {
    commMessage.exceptionNotify(option)
  }
  const validError: ValidErrorFunction = () => {
    alert({
      title: $language('필수항목 미입력'),
      message: '', // _message ? _message : '유효성 검사 중 오류가 발생했습니다. \n재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.',
      type: 'error',
      buttonLabel: 'OK'
    })
  }

  return {
    /** state */
    /** action */
    alert,
    confirm,
    multiConfirm,
    requestSuccess,
    requestError,
    exceptionNotify,
    validError
  }
})

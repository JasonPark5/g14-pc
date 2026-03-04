import { getLanguage, convertEnter } from '@utils/common'
import swal from 'sweetalert2'
import toastr from 'toastr'
import 'sweetalert2/src/sweetalert2.scss'

import { toastrOptionData } from '@/types/message'

// interface toastrOptionData {
//   title: string
//   message: string
//   type: SweetAlertIcon
//   buttonLabel?: string
//   errorDetail?: {
//     status: string
//     cause: string
//     causeDetail: string
//     url: string
//     config?: {
//       method: string
//       url: string
//     }
//   }
//   duration?: number
//   confirmCallback?: Function
//   cancelCallback?: Function
// }

const commMessage = {
  notify: (_option: toastrOptionData): void => {},
  exceptionNotify: (_option: toastrOptionData): void => {},
  alert: (_option: toastrOptionData): void => {},
  multiConfirm: (_option: toastrOptionData): void => {},
  confirm: (_option: toastrOptionData): void => {},
  toast: (_option: toastrOptionData): void => {}
}

const Toast = swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', swal.stopTimer)
    toast.addEventListener('mouseleave', swal.resumeTimer)
  }
})

const Alert = swal.mixin({
  confirmButtonColor: '#334048',
  customClass: {
    cancelButton: 'swal-custom-cancel-btn'
  }
})

/**
 * @function name : notify
 * @desc : 오른쪽 상단에 표시되는 알림이며 일정시간이 지날시 사라짐
 * @parameters
 *  _option :
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - duration : 표시되는 시간 (단위 ms)
 */
commMessage.notify = function (_option: toastrOptionData) {
  if (!_option) {
    _option = {
      title: '안내',
      message: getLanguage('관리자에게 문의바랍니다.'),
      type: 'error'
    }
  }
  if (import.meta.env.MODE === 'production') {
    // 운영 서버인 경우에는
    // [''] ** 현재는 notify를 exception발생하였을 경우에만 사용함으로 이후에 notify를 추가로 사용하는 경우 default문구 생성
    // 라는 문구의 메시지가 뜨도록 설정
    _option.message = getLanguage('관리자에게 문의바랍니다.')
  }
  toastr.options.closeButton = true
  toastr.options.progressBar = true
  toastr.options.positionClass = 'toast-top-right'
  toastr.options.timeOut = 10000
  toastr.error(_option.message)
}

/**
 * @function name : exceptionNotify
 * @desc : 오른쪽 상단에 표시되는 알림이며 예외상항에 대해 표시한다.
 *         일정시간이 지날시 사라짐
 *         ##개발모드인 경우에만 사용##
 * @parameters
 *  _option :
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - duration : 표시되는 시간 (단위 ms)
 */
commMessage.exceptionNotify = function (_option: toastrOptionData) {
  let _errMsg: string = ''

  if (_option.message === 'Network Error') {
    this.alert({
      title: getLanguage('네트워크 접속오류'),
      message: getLanguage(
        '네트워크 접속문제로 요청된 정보를 찾을 수 없습니다.\n관리자에게 문의해 주시기 바랍니다.'
      ),
      type: 'error'
    })
    return
  }
  if (_option && _option.message) {
    _errMsg = '<table class="table table-bordered"><tbody>'
    _errMsg +=
      '<tr><th scope="row" class="q-pa-sm">Status</th><td colspan="3">' +
      _option.errorDetail?.status +
      '</td>'
    _errMsg +=
      '<tr><th scope="row" class="q-pa-sm">Message</th><td colspan="3">' +
      _option.message +
      '</td></tr>'
    _errMsg +=
      '<tr><th scope="row" class="q-pa-sm">Cause</th><td colspan="3">' +
      _option.errorDetail?.cause +
      '</td></tr>'
    _errMsg +=
      '<tr><th scope="row" class="q-pa-sm">CauseDetail</th><td colspan="3">' +
      _option.errorDetail?.causeDetail +
      '</td></tr>'
    _errMsg +=
      '<tr><th scope="row" class="q-pa-sm">Url</th><td colspan="3">' +
      (_option.errorDetail?.url
        ? _option.errorDetail?.url
        : _option.errorDetail?.config
          ? '[' + _option.errorDetail.config.method + '] ' + _option.errorDetail.config.url
          : '') +
      '</td></tr>'
    _errMsg += '</tbody></table>'
  } else {
    _errMsg = '관리자에게 문의해 주시기 바랍니다.'
  }

  this.notify({
    title: getLanguage(_option.title),
    message: _errMsg,
    type: _option.type,
    duration: _option.duration ? _option.duration : 3000
  })
}

/**
 * @function name : alert
 * @desc : 중앙에 표시되는 알림이며 confirm button 클릭 시 사라짐
 * @parameters
 *  _option :
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 */
commMessage.alert = function (_option: toastrOptionData) {
  if (_option.type === 'success') {
    Toast.fire({
      title: getLanguage('안내'), // Alert의 경우 '안내' title을 사용
      html: convertEnter(getLanguage(_option.message)),
      icon: _option.type,
      confirmButtonText: _option.buttonLabel ? _option.buttonLabel : getLanguage('확인')
    })
  } else {
    Alert.fire({
      title: getLanguage(_option.title),
      html: convertEnter(getLanguage(_option.message)),
      icon: _option.type,
      confirmButtonText: _option.buttonLabel ? _option.buttonLabel : getLanguage('확인')
    })
  }
}
/**
 * @function name : multiConfirm
 * @desc : 중앙에 표시되는 확인창
 * @parameters
 *  _option :
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - confirmCallback : 확인 시 진행할 function
 *    - cancelCallback : 취소 시 진행할 function
 */
commMessage.multiConfirm = function (_option: toastrOptionData) {
  Alert.fire({
    title: getLanguage(_option.title),
    html: convertEnter(getLanguage(_option.message)),
    icon: 'question',
    confirmButtonText: '예',
    denyButtonText: '아니오',
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: getLanguage('취소'),
    cancelButtonColor: '#b5b1b1'
    // didOpen: () => Alert.getConfirmButton().focus()
  }).then((_result) => {
    if (_result.isConfirmed) {
      typeof _option.confirmCallback === 'function' ? _option.confirmCallback() : null
    } else if (_result.isDenied) {
      typeof _option.denyCallback === 'function' ? _option.denyCallback() : null
    } else {
      typeof _option.cancelCallback === 'function' ? _option.cancelCallback() : null
    }
  })
}
/**
 * @function name : confirm
 * @desc : 중앙에 표시되는 확인창
 * @parameters
 *  _option :
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - confirmCallback : 확인 시 진행할 function
 *    - cancelCallback : 취소 시 진행할 function
 */
commMessage.confirm = function (_option: toastrOptionData) {
  Alert.fire({
    title: getLanguage(_option.title),
    html: convertEnter(getLanguage(_option.message)),
    icon: 'question',
    confirmButtonText: getLanguage('적용'),
    showCancelButton: true,
    cancelButtonText: getLanguage('취소'),
    cancelButtonColor: '#b5b1b1'
    // didOpen: () => Alert.getConfirmButton().focus()
  }).then((_result) => {
    if (_result.isConfirmed) {
      typeof _option.confirmCallback === 'function' ? _option.confirmCallback() : null
    } else {
      typeof _option.cancelCallback === 'function' ? _option.cancelCallback() : null
    }
  })
}

/**
 * @function name : toast
 * @desc : 간단한 내용을 올리는 알림창
 * @parameters
 *  _option :
 *    - title : 상단 표시 라벨
 *    - icon : success / info / warning / error / question
 */
commMessage.toast = function (_option: toastrOptionData) {
  Toast.fire({
    title: _option.title,
    icon: _option.type
  })
}

export default commMessage

<!--
  TODO : 버튼 공통 모듈
-->
<template>
  <q-btn-group outline>
    <c-btn
      v-show="isBtnApprRetrieve && editable"
      label="결재회수"
      icon="refresh"
      color="red"
      @btnClicked="apprRetrieve"
    />
    <c-btn
      v-show="isBtnApprHis && editable"
      label="결재이력"
      icon="history"
      @btnClicked="openApprHistoryPop"
    />
    <c-btn
      v-show="isBtnApprReReq"
      label="재상신"
      icon="check"
      color="purple-custom"
      @btnClicked="apprReturnSave"
    />
    <c-btn
      v-show="isBtnApprReq && approvalInfo.approvalUrl"
      :isSubmit="approvalInfo.isApproval"
      :url="approvalInfo.approvalUrl"
      :param="approvalInfo.param"
      mappingType="PUT"
      label="결재요청"
      icon="check"
      color="purple-custom"
      @beforeAction="beforeAction"
      @btnCallback="btnCallback"
    />
    <c-btn
      v-show="isBtnApprReq && !approvalInfo.approvalUrl"
      label="결재요청"
      icon="check"
      color="purple"
      @btnClicked="apprRequestPop"
    />
    <c-dialog :param="popupApprOptions" />
  </q-btn-group>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
//  shallowRef, defineAsyncComponent <- target 정의할 때 주석 제거하기.
import { ref } from 'vue'
import { filter } from 'lodash-es'
import $format from 'string-format'

import { $http } from '@utils/http'
import transactionConfig from '@utils/transactionConfig'
import selectConfig from '@utils/selectConfig'

import { popupParamType } from '@/types/popupParam'
import { apprInfoType } from '@/types/approval'
import { arrayObject } from '@/types/variable'

import { useUserStore } from '@stores/user'
import apprHistoryPop from '@popups/appr/apprHistoryPop.vue'

/******************************
 * @import_선언
 * TODO 아래 순서에 맞추어 import (각 순서 마다 띄우기)
 *  * 1. Dependency
 *  * 2. Utils
 *  * 3. Types
 *  * 4. Stores
 *  * 5. Vue
 *  * 6. Etc (생길 시 얘기.)
 *******************************/

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CApprBtn'
})
/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/

const emits = defineEmits(['beforeApprAction', 'callbackApprAction', 'requestAfterAction'])
/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  editable?: boolean
  approvalInfo?: apprInfoType
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: '',
  editable: true,
  approvalInfo: (): apprInfoType => ({
    sysApprovalRequestId: '', // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: '',
    apprEditable: false, // 결재버튼 활성화 기준
    param: {}, // 결재 param
    approvalUrl: '', // 결재 url
    isApproval: false, // 결재 submit
    approvalParamValue: {
      // 결재상세화면 파라미터
      isApprContent: true
    },
    approvalTypeCd: '',
    approvalRequestName: '', // 결재요청명 (문서 title)
    approvalConnId: '' // 결재연결용 업무일련번호 (문서 key)
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupApprOptions = ref<popupParamType>({
  isFull: true,
  isApproval: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const lineList = ref<arrayObject>([])

/******************************
 * @Computed_선언
 *******************************/
const isBtnApprHis = computed(() => Boolean(props.approvalInfo.sysApprovalRequestId))
const isBtnApprReReq = computed(
  () => props.editable && props.approvalInfo.approvalStatusCd == 'ASC0000002'
)
const isBtnApprReq = computed(
  () =>
    props.editable && props.approvalInfo.apprEditable && !props.approvalInfo.sysApprovalRequestId
)
const isBtnApprRetrieve = computed(
  () =>
    props.editable &&
    props.approvalInfo.apprEditable &&
    lineList.value &&
    lineList.value.length === 1
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.approvalInfo.sysApprovalRequestId,
  () => {
    getLines()
  }
)
watch(
  () => props.approvalInfo,
  () => {},
  { deep: true }
)
/******************************
 * @Life_cycle_선언
 *******************************/

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 결재라인 조회
 *******************************/
function getLines() {
  $http({
    url: selectConfig.sys.appr.line.list.url,
    method: 'GET',
    params: {
      sysApprovalRequestId: props.approvalInfo.sysApprovalRequestId
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      const filterList = _result.data.filter((x: any) => {
        return x.approvalStatusCd == 'ASC0000002' || x.approvalStatusCd == 'ASC9999999'
      })
      if (filterList.length === 0) {
        lineList.value = filter(_result.data, {
          approvalStatusCd: 'ASC0000000',
          approvalUserId: user.value.userId
        })
      }
    } else {
      lineList.value = []
    }
  })
}
/******************************
 * TODO (목적): 결재요청 버튼 beforeAction
 *******************************/
function beforeAction() {
  emits('beforeApprAction')
}
/******************************
 * TODO (목적): 결재요청 버튼 callback
 *******************************/
function btnCallback() {
  emits('callbackApprAction')
}
/******************************
 * TODO (목적): 결재이력 팝업
 *******************************/
function openApprHistoryPop() {
  popupApprOptions.value.title = '결재이력 상세'
  popupApprOptions.value.isFull = false
  popupApprOptions.value.param = {
    sysApprovalRequestId: props.approvalInfo.sysApprovalRequestId
  }
  popupApprOptions.value.target = shallowRef(apprHistoryPop)
  popupApprOptions.value.width = '80%'
  popupApprOptions.value.visible = true
  popupApprOptions.value.closeCallback = closeApprHistoryPopup
}
/******************************
 * TODO (목적): 결재이력 팝업 callback
 *******************************/
function closeApprHistoryPopup() {
  popupApprOptions.value.target = null
  popupApprOptions.value.visible = false
}
/******************************
 * TODO (목적): 결재재상신 팝업
 *******************************/
function apprReturnSave() {
  popupApprOptions.value.title = '결재 재상신'
  popupApprOptions.value.isFull = true
  popupApprOptions.value.param = {
    sysApprovalRequestId: props.approvalInfo.sysApprovalRequestId,
    approvalTypeCd: props.approvalInfo.approvalTypeCd // 결재유형코드
  }
  popupApprOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sys/appr/apprRequest.vue`))
  )
  popupApprOptions.value.visible = true
  popupApprOptions.value.closeCallback = closeApprPopup
}
/******************************
 * TODO (목적): 결재요청 팝업
 *******************************/
function apprRequestPop() {
  // 결재요청 팝업
  props.approvalInfo.approvalParamValue.isApprContent = true
  popupApprOptions.value.title = '결재요청 상세'
  popupApprOptions.value.isFull = true
  popupApprOptions.value.param = {
    approvalParamValue: props.approvalInfo.approvalParamValue, // // 결재상세화면 파라미터
    approvalTypeCd: props.approvalInfo.approvalTypeCd, // 결재유형코드
    approvalRequestName: props.approvalInfo.approvalRequestName, // 결재요청명
    approvalConnId: props.approvalInfo.approvalConnId // 결재연결용 업무일련번호
  }
  popupApprOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sys/appr/apprRequest.vue`))
  )
  popupApprOptions.value.visible = true
  popupApprOptions.value.closeCallback = closeApprPopup
}
/******************************
 * TODO (목적): 결재 팝업 callback
 *******************************/
function closeApprPopup() {
  popupApprOptions.value.target = null
  popupApprOptions.value.visible = false
  emits('requestAfterAction')
}
/******************************
 * TODO (목적): 결재회수
 *******************************/
function apprRetrieve() {
  message.confirm({
    title: '확인',
    message: '결재요청된 결재 건을 회수하시겠습니까?',
    // TODO : 필요시 추가하세요.
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(
          transactionConfig.sys.appr.request.retrieve.url,
          props.approvalInfo.sysApprovalRequestId
        ),
        method: 'DELETE'
      }).then((_result: any) => {
        emits('requestAfterAction')
        lineList.value = []
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ apprRequestPop })
</script>

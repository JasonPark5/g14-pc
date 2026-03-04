<template>
  <div>
    <div v-if="editable" class="col float-right">
      <q-btn-group outline>
        <!-- [S]결재관련 버튼 -->
        <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
        <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
        <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
        <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
        <c-appr-btn
          ref="apprBtn"
          name="vendor-assess-appr-btn"
          :editable="editable && param.selfInspectionResultId != ''"
          :approvalInfo="approvalInfo"
          @beforeApprAction="saveDataAppr"
          @callbackApprAction="approvalCallback"
          @requestAfterAction="getInfo"
        />
        <!-- [E]]결재관련 버튼 -->
        <!-- <c-btn
          v-show="editable && param.selfInspectionResultId && param.selfInspectionStatusCd == 'SISC000002'"
          :url="saveUrl"
          :isSubmit="isSave"
          :param="data"
          :mappingType="mappingType"
          label="실행완료"
          icon="assignment_turned_in"
          color="orange-6"
          @beforeAction="saveDataEnd"
          @btnCallback="saveCallbackEnd" /> -->
      </q-btn-group>
    </div>
    <c-tab type="vertical" :tabItems="tabItems" :height="newHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component :is="tab.component" :popupParam="param" :research="research" />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { auditType } from '../audit'

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
  name: 'complianceRun'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStore = useUserStore()
// const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
// const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull // 평가항목 개정번호
    count?: numberNull
  }
  height?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: '', // 평가항목 개정번호
      count: 0
    }
  },
  height: ''
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const audit = ref<auditType>({
  selfInspectionResultId: '', // 자체감사 계획 일련번호
  selfInspectionTitle: '', // 감사명
  selfInspectionYear: '', // 감사년도
  selfInspectionTypeCd: null, // 감사종류
  plantCd: null, // 해당사업장
  remark: '', // 감사대상 개요
  selfInspectionStartDt: '', // 감사기간-시작일
  selfInspectionEndDt: '', // 감사기간-종료일
  selfInspectionStatusCd: '', // 감사진행상태-계획중,계획완료,감사완료
  selfInspectionResultOpinion: '', // 감사원소견
  selfInspectionResultTotalOpinion: '', // 감사 결과 종합의견
  selfInspectionResultCorrect: '', // 시정 및 권고 요약
  selfInspectionDt: [],
  sysRevision: '', // 평가항목 개정번호
  chgUserId: '',
  sysApprovalRequestId: '',
  approvalTypeCd: '',
  approvalStatusCd: '',
  approvalStatusName: ''
})
const editable = ref(true)
const updateUrl = ref('')
const infoUrl = ref('')
// const saveUrl = ref(transactionConfig.sop.pca.result.info.planend.url)
// const mappingType = ref('PUT')
// const isSave = ref(false)
const isApproval = ref(false)
const tab = ref('run')
const apprBtn = ref<any>(null)
const newHeight = ref('')
const research = ref<any>({
  impr: '',
  item: ''
})

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => [
  {
    key: uid(),
    name: 'run',
    icon: 'check_circle_outline',
    label: '감사실행',
    component: defineAsyncComponent(() => import(`./runExec.vue`))
  },
  {
    key: uid(),
    name: 'runInfo',
    icon: 'info',
    label: '감사의견 및<br/> 관련자료',
    component: defineAsyncComponent(() => import(`./runInfo.vue`))
  }
])
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: audit.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: audit.value.approvalStatusCd,
    apprEditable: audit.value.selfInspectionStatusCd === 'SISC000002', // 결재버튼 활성화 기준
    param: audit.value, // 결재 param
    approvalUrl: updateUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000006', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      selfInspectionResultId: audit.value.selfInspectionResultId,
      sysRevision: audit.value.sysRevision,
      isApprContent: true
    },
    approvalRequestName: '자체감사 [' + audit.value.selfInspectionTitle + ']', // 결재요청명 (문서 title)
    approvalConnId: audit.value.selfInspectionResultId // 결재연결용 업무일련번호 (문서 key)
  }
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  infoUrl.value = selectConfig.sop.pca.result.info.get.url
  updateUrl.value = transactionConfig.sop.pca.result.info.update.url
  // code setting
  newHeight.value = parseInt(props.height, 10) - 24 + 'px'
  // list setting
  getInfo()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getInfo() {
  $http({
    url: infoUrl.value,
    method: 'GET',
    params: { selfInspectionResultId: props.param.selfInspectionResultId }
  }).then((_result: any) => {
    audit.value = _result.data
    audit.value.sysRevision = audit.value.sysRevision + ''
    props.param.selfInspectionStatusCd = audit.value.selfInspectionStatusCd
  })
}
/******************************
 * TODO (목적): 결재관련 결재요청버튼 callback
 *******************************/
function approvalCallback() {
  apprBtn.value.apprRequestPop()
}

/******************************
 * TODO (목적): 결재요청 진행
 *******************************/
function saveDataAppr() {
  message.confirm({
    title: '확인',
    message: '결재요청을 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      const promises = [{ func: approvalValue }]
      orderedPromise(promises)
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function approvalValue() {
  // 결재여부 체크
  return new Promise((resolve) => {
    isApproval.value = !isApproval.value
    resolve(true)
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
// function saveDataEnd() {
//   const saveMsg = '감사를 완료하시겠습니까?'
//   message.confirm({
//     title: '확인',
//     message: saveMsg,
//     type: 'info', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       audit.value.selfInspectionResultId = props.param.selfInspectionResultId
//       audit.value.selfInspectionStatusCd = 'SISC000003'
//       audit.value.regUserId = user.value.userId
//       isSave.value = !isSave.value
//     },
//     // 취소 callback 함수
//     cancelCallback: () => {}
//   })
// }
// function saveCallbackEnd() {
//   message.requestSuccess()
//   // stepper 이동
//   emits('emitStep', {
//     name: 'currentStep',
//     param: 'SISC000003'
//   })
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

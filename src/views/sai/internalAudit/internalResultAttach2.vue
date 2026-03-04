<template>
  <div>
    <q-form ref="editForm">
      <c-card class="cardClassDetailForm" title="상세">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="plan"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="savePlan"
              @btnCallback="savePlanCallback"
            />
            <c-appr-btn
              v-if="!apprMode"
              ref="apprBtn"
              name="internal-result-appr-btn"
              :editable="editable"
              :approvalInfo="approvalInfo"
              @beforeApprAction="approvalResult"
              @callbackApprAction="approvalResultCallback"
              @requestAfterAction="research"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-12">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="10"
              :maxlength="1000"
              :counter="true"
              label="결과요약"
              name="resultRemark"
              v-model:value="plan.resultRemark"
            />
          </div>
          <div class="col-12 q-mt-md">
            <c-upload
              label="결과보고서"
              :attachInfo="attachResultInfo"
              :editable="editable && !disabled"
            />
          </div>
        </template>
      </c-card>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

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
import { internalActionType } from './internalAudit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'internalResultAttach'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['keySetting', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiInternalActionId: stringNull
    stepCd?: stringNull
    searchProcess: any | null | undefined
  }
  plan: internalActionType
  disabled?: boolean
  apprMode?: boolean
  attachResultInfo?: attachSettingType
  contentHeight?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      saiInternalActionId: '',
      stepCd: null,
      searchProcess: {
        flag: '',
        isSearch: false
      }
    }
  },
  plan: () => {
    return {
      saiInternalActionId: '', // 내부심사 수행계획서 일련번호
      plantCd: '', // 사업장코드
      actionName: '', // 실시계획명
      actionStartDate: '', // 심사시작일
      actionEndDate: '', // 심사종료일
      period: [],
      saiInternalActionStepCd: '', // 내부심사 수행계획서 진행상태
      internalAuditStepCd: null, // 내부심사 진행상태
      saiInternalActionTypeCd: null, // 심사구분
      auditPurposeScope: '', // 심사 목적 및 범위
      auditPreRequire: '', // 심사 준비 요청사항
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '', // 결재관련 결재요청코드
      reviewUserId: '', // 검토자
      approvalUserId: '', // 승인자
      regDtStr: '',
      regUserName: '', // 등록자
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      actionPlans: [], // 실시계획
      deleteActionPlans: [], // 실시계획 [삭제]
      targetDepts: [], // 피심사팀
      deleteTargetDepts: [], // 피심사팀 [삭제]
      resultRemark: '', // 결과요약
      resultSysApprovalRequestId: '', // 결과 결재요청번호
      resultApprovalTypeCd: '', // 결과 결재유형코드
      resultApprovalStatusCd: '', // 결과 결재상태코드
      resultApprovalStatusName: '' // 결과 결재상태명
    }
  },
  attachResultInfo: () => {
    return {
      isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
      taskClassCd: 'INTERNAL_AUDIT',
      taskKey: ''
    }
  },
  disabled: false,
  apprMode: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const isSave = ref(false)
const isApproval = ref(false)
const saveUrl = ref('')
const editForm = ref<any>(null)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: props.plan.resultSysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: props.plan.resultApprovalStatusCd,
    apprEditable: props.plan.saiInternalActionId && props.plan.internalAuditStepCd !== 'IA00010', // 결재버튼 활성화 기준
    param: props.plan, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000026', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiInternalActionId: props.plan.saiInternalActionId,
      isApprContent: true
    },
    approvalRequestName: `[${props.plan.actionName}] 내부심사 결과`, // 결재요청명 (문서 title)
    approvalConnId: props.plan.saiInternalActionId // 결재연결용 업무일련번호 (문서 key)
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
  saveUrl.value = transactionConfig.sai.internal.action.update.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 저장
 *******************************/
function savePlan() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.plan.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function savePlanCallback(_result: any) {
  message.requestSuccess()
  emits('keySetting', _result.data)
}
/******************************
 * TODO (목적): 결재요청 전 수행계획 목록에서 필수값 및 데이터 하나 이상 있는지 체크
 *******************************/
function approvalResult() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.plan.chgUserId = user.value.userId
          isApproval.value = !isApproval.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function approvalResultCallback() {
  apprBtn.value.apprRequestPop()
}
/******************************
 * TODO (목적): 결재요청 후 부모의 getDetail 함수 호출
 *******************************/
function research() {
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-tab
      type="vertical"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :action="plan"
          :disabled="disabled"
          :isOld="isOld"
          :apprMode="true"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { internalActionType } from '@views/sai/internalAudit/internalAudit'

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
  name: 'internalPlan'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  contentHeight?: stringNull
  popupParam: {
    saiInternalActionId: stringNull
    stepCd?: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      saiInternalActionId: '',
      stepCd: null
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const plan = ref<internalActionType>({
  saiInternalActionId: '', // 내부심사 수행계획서 일련번호
  plantCd: '', // 사업장코드
  actionName: '', // 실시계획서명
  actionStartDate: '', // 심사시작일
  actionEndDate: '', // 심사종료일
  period: [],
  saiInternalActionStepCd: '', // 내부심사 수행계획서 진행상태
  internalAuditStepCd: '', // 내부심사 진행상태
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
  deleteTargetDepts: [] // 피심사팀 [삭제]
})
const detailUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const editable = ref(true)
const tab = ref('actionPlan')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiInternalActionId))
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 810
    ? Number(props.contentHeight) + 'px'
    : '810px'
)
const disabled = computed(
  () => plan.value.internalAuditStepCd === 'IA00005' || plan.value.approvalStatusCd === 'ASC0000001'
)
const tabItems = computed(
  () =>
    [
      {
        key: uid(),
        name: 'actionPlan',
        icon: 'info',
        label: '기본정보',
        component: defineAsyncComponent(
          () => import(`@views/sai/internalAudit/internalActionInfo2.vue`)
        ),
        disabled: false
      },
      {
        key: uid(),
        name: 'checklist',
        icon: 'info',
        label: '체크리스트',
        component: defineAsyncComponent(
          () => import(`@views/sai/internalAudit/internalActionChecklist2.vue`)
        ),
        disabled: props.popupParam.saiInternalActionId ? false : true
      }
    ] as tabItemsType[]
)

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
  detailUrl.value = selectConfig.sai.internal.action.get.url
  deleteUrl.value = transactionConfig.sai.internal.action.delete.url
  completeUrl.value = transactionConfig.sai.internal.action.complete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiInternalActionId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(plan.value, _result.data)
      plan.value.period = [plan.value.actionStartDate, plan.value.actionEndDate]
      if (plan.value.actionPlans && plan.value.actionPlans.length > 0) {
        _.forEach(plan.value.actionPlans, (item) => {
          item.dates = [item.startDate, item.endDate]
        })
      }
    })
  } else {
    // 신규등록인 경우
    plan.value.internalAuditStepCd = 'IA00001' // 직성중
    plan.value.regDtStr = getToday() // 작성일
    plan.value.regUserName = user.value.userName // 작성자
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

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
          :plan="plan"
          :popupParam="popupParam"
          :imprTabInfo="imprTabInfo"
          :attachResultInfo="attachResultInfo"
          :disabled="disabled"
          :contentHeight="contentHeight"
          :apprMode="true"
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
  name: 'internalResultDetail2'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  popupParam: {
    saiInternalActionId: stringNull
    stepCd?: stringNull
  }
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
      stepCd: null
    }
  },
  contentHeight: null
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
})
const tabItems = ref<Array<tabItemsType>>([
  {
    key: uid(),
    name: 'checklist',
    icon: 'info',
    label: '심사결과',
    component: markRaw(
      defineAsyncComponent(() => import(`@views/sai/internalAudit/internalResultChecklist2.vue`))
    )
  },
  {
    key: uid(),
    name: 'improvement',
    icon: 'info',
    label: '감소대책 및 시정조치',
    component: markRaw(defineAsyncComponent(() => import(`@/views/common/ibm/imprTab.vue`)))
  },
  {
    key: uid(),
    name: 'result',
    icon: 'info',
    label: '결과/첨부',
    component: markRaw(
      defineAsyncComponent(() => import(`@views/sai/internalAudit/internalResultAttach2.vue`))
    )
  }
])
const research = ref<any>({
  impr: '',
  item: ''
})
const editable = ref(true)
const detailUrl = ref('')
const tab = ref('checklist')
const attachResultInfo = ref({
  isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
  taskClassCd: 'INTERNAL_AUDIT',
  taskKey: ''
})
const filter = ref<stringNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 740
    ? Number(props.contentHeight) + 'px'
    : '740px'
)
const disabled = computed(() => plan.value.internalAuditStepCd === 'IA00010')
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.saiInternalActionId,
    ibmTaskTypeCd: 'ITT0000150',
    ibmTaskUnderTypeCd: 'ITTU000150',
    requestContents: plan.value.actionName,
    disabled: disabled.value,
    isOld: true,
    gridItem: {
      listUrl: '',
      param: null,
      title: '체크리스트 별 개선사항 목록',
      merge: [
        { index: 0, colName: 'deptCd' },
        { index: 1, colName: 'saiInternalAuditChecklistSystemId' }
      ],
      data: _.flatMap(plan.value.targetDepts, (dept) =>
        _.filter(dept.checklist, (item) => Boolean(item?.sopImprovementIds))
      ),
      columns: [
        {
          name: 'deptName',
          field: 'deptName',
          label: '피심사팀',
          align: 'center',
          style: 'width:100px',
          sortable: true
        },
        {
          name: 'sortOrder1',
          field: 'sortOrder1',
          label: '요소순번',
          align: 'center',
          style: 'width:30px',
          sortable: false
        },
        {
          name: 'systemElementsName',
          field: 'systemElementsName',
          label: '시스템 요소',
          align: 'left',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'sortOrder',
          field: 'sortOrder',
          label: '순번',
          align: 'center',
          style: 'width:30px',
          sortable: false
        },
        {
          name: 'itemName',
          field: 'itemName',
          label: '심사항목',
          align: 'left',
          style: 'width:300px',
          sortable: false,
          type: 'html'
        },
        {
          name: 'result',
          field: 'result',
          label: '내부심사결과',
          child: [
            {
              name: 'sar0000001',
              field: 'sar0000001',
              label: '적합',
              align: 'center',
              style: 'width:50px',
              sortable: false,
              type: 'check',
              true: 'Y',
              false: 'N',
              checkIcon: 'task_alt',
              uncheckIcon: 'radio_button_unchecked',
              color: 'green',
              disableTarget: 'result',
              disableCon: ''
            },
            {
              name: 'sar0000005',
              field: 'sar0000005',
              label: '부적합',
              align: 'center',
              style: 'width:50px',
              sortable: false,
              type: 'check',
              true: 'Y',
              false: 'N',
              checkIcon: 'task_alt',
              uncheckIcon: 'radio_button_unchecked',
              color: 'green',
              disableTarget: 'result',
              disableCon: ''
            },
            {
              name: 'sar0000010',
              field: 'sar0000010',
              label: '관찰사항',
              align: 'center',
              style: 'width:50px',
              sortable: false,
              type: 'check',
              checkIcon: 'task_alt',
              uncheckIcon: 'radio_button_unchecked',
              true: 'Y',
              false: 'N',
              color: 'green'
            },
            {
              name: 'sar0000015',
              field: 'sar0000015',
              label: '비적용',
              align: 'center',
              style: 'width:50px',
              sortable: false,
              type: 'check',
              checkIcon: 'task_alt',
              uncheckIcon: 'radio_button_unchecked',
              true: 'Y',
              false: 'N',
              color: 'green'
            }
          ]
        },
        {
          name: 'observation',
          field: 'observation',
          label: '관찰내용',
          align: 'left',
          style: 'width:180px',
          sortable: false
        }
      ],
      research: research.value
    },
    gridOther: {
      title: '항목외 개선 목록'
    }
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
  detailUrl.value = selectConfig.sai.internal.action.get.url
  // code setting
  if (plan.value.targetDepts && plan.value.targetDepts.length > 0) {
    const _idx = _.findIndex(plan.value.targetDepts, {
      saiInternalActionTargetDeptId: filter.value
    })
    filter.value =
      _idx === -1
        ? plan.value.targetDepts[0].saiInternalActionTargetDeptId
        : plan.value.targetDepts[_idx].saiInternalActionTargetDeptId
  } else filter.value = null
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.saiInternalActionId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiInternalActionId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(plan.value, _result.data)
      attachResultInfo.value.taskKey = props.popupParam.saiInternalActionId
    })
  }
}
</script>

<template>
  <div>
    <c-table
      ref="table1"
      class="q-mt-md"
      title="개선요청"
      :columns="grid2.columns"
      :gridHeight="gridHeight"
      :data="imprs"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            label="추가"
            :showLoading="false"
            icon="add"
            @btnClicked="addImpr(1)"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="table2"
      title="즉시조치"
      :columns="grid.columns"
      :gridHeight="gridHeight"
      :data="imprImms"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            label="추가"
            :showLoading="false"
            icon="add"
            @btnClicked="addImpr(2)"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { evalPlanType } from './jobStress'

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
  name: 'jobStressAssessmentResultImpr'
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
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
interface propType {
  contentHeight?: stringNull
  popupParam: {
    heaJobStressPlanId: stringNull
  }
  plan: evalPlanType
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
      heaJobStressPlanId: ''
    }
  },
  plan: () => {
    return {
      heaJobStressPlanId: '', // 직무스트레스 계획 일련번호
      plantCd: null, // 사업장
      planYear: '', // 년도
      jobStressPlanName: '', // 평가계획명
      assessmentStartDate: '', // 평가 시작일
      assessmentEndDate: '', // 평가 종료일
      period: [], // 평가기간
      remarks: '', // 비고
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      users: [], // 평가자
      centers: [], // 중앙값
      depts: [], // 중앙값
      imprs: [], // 중앙값
      resultTable: []
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'actionContents',
      field: 'actionContents',
      label: '조치내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteDate',
      field: 'actionCompleteDate',
      label: '조치완료일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'improveRequestContents',
      field: 'improveRequestContents',
      label: '요청내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteRequestDate',
      field: 'actionCompleteRequestDate',
      label: '조치완료 요청일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const imprData = ref(null)
const listUrl = ref('')
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const list = ref<Array<any>>([])

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 500
    ? Number(props.contentHeight) / 2 - 40 + 'px'
    : 'auto'
)
const imprs = computed(() =>
  props.plan.imprs!.length > 0 ? _.filter(props.plan.imprs, { ibmClassCd: 'IC00000001' }) : []
)
const imprImms = computed(() =>
  props.plan.imprs!.length > 0 ? _.filter(props.plan.imprs, { ibmClassCd: 'IC00000005' }) : []
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
  listUrl.value = selectConfig.hea.jobStress.impr.list.url
  // code setting
  // list setting
}

/******************************
 * TODO (목적): 개선목록 조회
 *******************************/
function getImprs() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { heaJobStressPlanId: props.popupParam.heaJobStressPlanId }
  }).then((_result: any) => {
    props.plan.imprs = _result.data
  })
}

/******************************
 * TODO (목적): 개선요청 or 즉시조치 요청 상세팝업
 *******************************/
function addImpr(num?: numberNull) {
  popupOptions.value.title = num === 1 ? '개선요청' : '즉시조치'
  popupOptions.value.target =
    num === 1
      ? shallowRef(defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`)))
      : shallowRef(defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`)))
  popupOptions.value.param = {
    requestContents: props.plan.jobStressPlanName,
    relationTableKey: props.popupParam.heaJobStressPlanId,
    ibmTaskTypeCd: 'ITT0000185',
    ibmTaskUnderTypeCd: 'ITTU000215'
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = num === 1 ? closeImprPopup1 : closeImprPopup2
}
function closeImprPopup1() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImprs()
}
function closeImprPopup2(result?: any, flag?: stringNull) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    if (flag !== 'delete') _.extend(imprData.value, result.col1)
    else list.value = _.reject(list.value, { sopImprovementId: result.col1.sopImprovementId })
  }
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  imprData.value = row
  popupOptions.value.param = { sopImprovementId: row.sopImprovementId }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  if (row.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
    )
    popupOptions.value.closeCallback = closeImprPopup1
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
    )
    popupOptions.value.closeCallback = closeImprPopup2
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

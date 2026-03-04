<template>
  <div>
    <c-table
      ref="tableRisk"
      title="위험등록부 목록"
      tableId="riskRegister01"
      :columns="gridRisk.columns"
      :data="riskReduce.riskbooks"
      :merge="gridRisk.merge"
      gridHeightAuto
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
    >
      <template v-slot:customArea="{ props, col }">
        <component
          :is="imprComponent"
          :col="col"
          :props="props"
          :inputEditable="false"
          :requestContentsCols="requestContentsCols"
          tableKey="ramKpsrAssessScenarioId"
          ibmTaskTypeCd="ITT0000005"
          ibmTaskUnderTypeCd="ITTU000005"
          @imprChange="imprChange"
        />
      </template>
    </c-table>
    <c-table
      ref="tableImpr"
      title="개선 목록"
      tableId="impr01"
      :columns="gridImpr.columns"
      :data="riskReduce.imprs"
      :merge="gridImpr.merge"
      gridHeightAuto
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    />
    <c-dialog :param="popupOptions" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'kpsrRiskRegisterTL'
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
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
  }
  height?: stringNull
}
interface gridType {
  columns: tableColumnType
  data?: Array<any>
  height?: stringNull
  merge?: tableMergeType
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
      ramRiskAssessmentPlanId: '',
      ramStepCd: ''
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const tableRisk = ref<any>(null)
const tableImpr = ref<any>(null)
const imprData = ref<any>(null)
const listUrl = ref('')
const riskReduce = ref({
  imprs: [],
  riskbooks: []
}) as any
const gridRisk = ref<gridType>({
  merge: [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'processDiagram' },
    { index: 2, colName: 'processDiagramNode' },
    { index: 3, colName: 'processDiagramNodeRisk' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      fix: true
    },
    {
      name: 'diagramTitle',
      field: 'diagramTitle',
      description: 'diagramNo',
      label: '도면명',
      align: 'center',
      style: 'width:130px',
      sortable: false,
      fix: true
    },
    {
      name: 'nodeTitle',
      field: 'nodeTitle',
      description: 'nodeCd',
      label: '노드',
      align: 'center',
      style: 'width:130px',
      sortable: false,
      fix: true
    },
    {
      name: 'riskTypName',
      field: 'riskTypName',
      label: '위험형태',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      fix: true
    },
    {
      name: 'riskOccurrenceCause',
      field: 'riskOccurrenceCause',
      label: '원인',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      fix: true
    },
    {
      name: 'riskOccurrenceResult',
      field: 'riskOccurrenceResult',
      label: '결과',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      fix: true
    },
    {
      name: 'relationLaw',
      field: 'relationLaw',
      label: '관련법규',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'relationProblem',
      field: 'relationProblem',
      label: '관련문제사항',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'currentSafetyMeasures',
      field: 'currentSafetyMeasures',
      label: '현재안전조치',
      align: 'left',
      style: 'width:170px',
      sortable: false
    },
    {
      name: 'assessDate',
      field: 'assessDate',
      label: '평가일',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'assessUserName',
      field: 'assessUserName',
      label: '평가자',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선진행',
      align: 'center',
      child: [
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:130px',
          type: 'custom',
          sortable: false
        },
        {
          name: 'improvementMeasures',
          field: 'improvementMeasures',
          label: '개선대책',
          align: 'left',
          style: 'width:200px',
          sortable: false
        }
      ]
    }
  ],
  data: [],
  height: '500px'
})
const gridImpr = ref<gridType>({
  merge: [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'processDiagram' },
    { index: 2, colName: 'processDiagramNode' },
    { index: 3, colName: 'processDiagramNodeRisk' },
    { index: 4, colName: 'ramKpsrAssessScenarioId' },
    { index: 5, colName: 'ramKpsrAssessScenarioId' }
  ],
  columns: [],
  height: '500px'
})
/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['riskTypName', 'riskOccurrenceCause']
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
  listUrl.value = selectConfig.ram.kpsr.riskReduce.list.url
  // code setting
  getStepItems('IBM_STEP_CD').then((_result) => {
    gridImpr.value.columns = [
      {
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false,
        fix: true
      },
      {
        name: 'diagramTitle',
        field: 'diagramTitle',
        description: 'diagramNo',
        label: '도면명',
        align: 'center',
        style: 'width:100px',
        sortable: false,
        fix: true
      },
      {
        name: 'nodeTitle',
        field: 'nodeTitle',
        description: 'nodeNo',
        label: '노드',
        align: 'center',
        style: 'width:120px',
        sortable: false,
        fix: true
      },
      {
        name: 'riskTypName',
        field: 'riskTypName',
        label: '위험형태',
        align: 'center',
        style: 'width:100px',
        sortable: false,
        fix: true
      },
      {
        name: 'riskOccurrenceCause',
        field: 'riskOccurrenceCause',
        label: '원인',
        align: 'left',
        style: 'width:200px',
        sortable: false,
        fix: true
      },
      {
        name: 'riskOccurrenceResult',
        field: 'riskOccurrenceResult',
        label: '결과',
        align: 'left',
        style: 'width:200px',
        sortable: false,
        fix: true
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'ibmTitle',
        field: 'ibmTitle',
        label: '제목',
        align: 'left',
        type: 'link',
        style: 'width:300px',
        sortable: true
      },
      {
        name: 'ibmStepCd',
        field: 'ibmStepCd',
        label: '진행상태',
        align: 'center',
        style: 'width:100px',
        type: 'tag',
        colorItems: _result,
        sortable: false
      },
      {
        name: 'improveRequest',
        field: 'improveRequest',
        label: '요청부서정보',
        align: 'center',
        style: 'width:250px',
        sortable: true
      },
      {
        name: 'actionCompleteRequestDate',
        field: 'actionCompleteRequestDate',
        label: '조치완료요청일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'actionDeptName',
        field: 'actionDeptName',
        label: '조치부서',
        align: 'center',
        style: 'width:100px',
        sortable: true
      }
    ]
  })
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    riskReduce.value = _result.data
  })
}
function imprChange() {
  tableRisk.value.compoTable.resetVirtualScroll()
}
function linkClick(_row: any) {
  imprData.value = _row
  popupOptions.value.title = '개선'
  popupOptions.value.param = {
    sopImprovementId: _row.sopImprovementId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/sop/ibm/imprDetail.vue'))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function closeImprPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.col1) {
    _.extend(imprData.value, _result.col1)
    tableImpr.value.compoTable.resetVirtualScroll()
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

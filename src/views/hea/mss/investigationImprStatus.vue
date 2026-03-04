<template>
  <div>
    <c-table
      ref="table"
      title="개선 목록"
      :editable="false"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      gridHeight="760px"
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
  name: 'musculImpr'
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
    heaInvestigationPlanId: stringNull
    stepCd: stringNull
  }
  height: stringNull
}

interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
  param: () => ({
    heaInvestigationPlanId: '',
    stepCd: ''
  }),
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'heaInvestigationPlanId' },
    { index: 1, colName: 'heaInvestigationPlanId' },
    { index: 2, colName: 'heaInvestigationPlanId' },
    { index: 3, colName: 'heaMuscleSopId' },
    { index: 4, colName: 'heaMuscleSopResultId' },
    { index: 5, colName: 'heaMuscleSopResultId' },
    { index: 6, colName: 'heaMuscleSopResultId' },
    { index: 7, colName: 'heaMuscleSopResultId' }
  ],
  columns: [],
  data: []
})
const editable = ref(true)
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

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
  listUrl.value = selectConfig.hea.muscleSystem.muscleSopResultImpr.list.url
  // code setting
  getStepItems('IBM_STEP_CD').then((_result) => {
    grid.value.columns = [
      {
        name: 'sopName',
        field: 'sopName',
        label: '단위작업',
        align: 'center',
        sortable: false,
        style: 'width:120px'
      },
      {
        name: 'heaAssessmentToolName',
        field: 'heaAssessmentToolName',
        label: '작업분석․평가도구',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'resultName',
        field: 'resultName',
        label: '평가결과',
        align: 'left',
        style: 'width:150px',
        sortable: false,
        type: 'html'
      },
      {
        name: 'judgment',
        field: 'judgment',
        label: '판정',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'workerOpinion',
        field: 'workerOpinion',
        label: '근로자의견',
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

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세보기 팝업_
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '개선'
  popupOptions.value.param = { sopImprovementId: row.sopImprovementId }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>

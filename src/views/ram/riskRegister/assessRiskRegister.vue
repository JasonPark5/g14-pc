<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="none" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="6M"
            label="평가기간"
            name="assessmentDates"
            v-model:value="searchParam.assessmentDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_ASSESS_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramAssessTypeCd"
            label="평가구분-정기/수시/최초"
            v-model:value="searchParam.ramAssessTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_TECHNIQUE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramTechniqueCd"
            label="평가기법"
            v-model:value="searchParam.ramTechniqueCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            label="공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            stepperGrpCd="IBM_STEP_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="ibmStepCd"
            label="개선진행단계"
            v-model:value="searchParam.ibmStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="위험등록부 목록"
      tableId="riskRegister01"
      :columns="gridRisk.columns"
      :data="gridRisk.data"
      :merge="gridRisk.merge"
      :editable="editable"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :isImmShow="false"
            :inputEditable="false"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
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
  name: 'assessRiskRegister'
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
  columns: tableColumnType
  data: Array<any>
  merge: tableMergeType
}
interface searchParamType {
  plantCd: stringNull
  assessmentDates: Array<any>
  ramAssessTypeCd: stringNull
  ramTechniqueCd: stringNull
  processCd: stringNull
  ibmStepCd: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  plantCd: null,
  assessmentDates: [],
  ramAssessTypeCd: null,
  ramTechniqueCd: null,
  processCd: null,
  ibmStepCd: null
})
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})

const gridRisk = ref<gridType>({
  merge: [
    { index: 0, colName: 'ramTechniqueCd' },
    { index: 1, colName: 'ramRiskAssessmentPlanId' },
    { index: 2, colName: 'ramRiskAssessmentPlanId' },
    { index: 3, colName: 'processCd' },
    { index: 4, colName: 'assessItem' }
  ],
  data: [],
  columns: [
    {
      name: 'ramTechniqueName',
      field: 'ramTechniqueName',
      label: '평가기법',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'assessmentName',
      field: 'assessmentName',
      label: '평가명',
      align: 'left',
      style: 'width:130px',
      sortable: false
    },
    {
      name: 'ramAssessTypeName',
      field: 'ramAssessTypeName',
      label: '평가구분',
      align: 'center',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'assessItem',
      field: 'assessItem',
      label: '평가항목(위험요인)',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'afterRisk',
      field: 'afterRisk',
      label: '개선 후 위험도',
      align: 'center',
      style: 'width:70px',
      color: 'red',
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
      style: 'width:80px'
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
          style: 'width:150px',
          type: 'custom',
          sortable: false
        }
      ]
    }
  ]
})

/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
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
  listUrl.value = selectConfig.ram.riskRegister.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridRisk.value.data = _result.data
  })
}
function imprChange(_data: any) {
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

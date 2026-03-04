<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            type="year"
            label="년도"
            name="years"
            v-model:value="searchParam.years"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            stepperGrpCd="HEA_MUSCLE_SOP_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="heaMuscleSopStepCd"
            label="진행단계"
            v-model:value="searchParam.heaMuscleSopStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="근골격계 조사 목록"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
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
  name: 'hazardInvestigation'
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  years: [],
  heaMuscleSopStepCd: null
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'heaInvestigationPlanId' },
    { index: 1, colName: 'heaInvestigationPlanId' },
    { index: 2, colName: 'heaInvestigationPlanId' },
    { index: 3, colName: 'heaInvestigationPlanId' },
    { index: 4, colName: 'heaMuscleSopId' },
    { index: 5, colName: 'heaMuscleSopId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'investigationPlanName',
      field: 'investigationPlanName',
      label: '조사계획명',
      align: 'left',
      sortable: false,
      style: 'width:250px'
    },
    {
      name: 'year',
      field: 'year',
      label: '년도',
      align: 'center',
      sortable: false,
      style: 'width:80px'
    },
    {
      name: 'heaInvestigationStepName',
      field: 'heaInvestigationStepName',
      label: '진행단계',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'sopName',
      field: 'sopName',
      label: '단위작업',
      align: 'left',
      sortable: false,
      style: 'width:120px'
    },
    {
      name: 'heavyWorkName',
      field: 'heavyWorkName',
      label: '부담작업No',
      align: 'center',
      sortable: false,
      style: 'width:90px'
    },
    {
      name: 'detailJobContents',
      field: 'detailJobContents',
      label: '작업내용',
      align: 'left',
      sortable: false,
      style: 'width:200px'
    },
    {
      name: 'workTime',
      field: 'workTime',
      label: '작업시간',
      align: 'center',
      sortable: false,
      style: 'width:70px'
    },
    {
      name: 'workCnt',
      field: 'workCnt',
      label: '횟수',
      align: 'center',
      sortable: false,
      style: 'width:70px'
    },
    {
      name: 'result',
      field: 'result',
      label: '결과',
      child: [
        {
          name: 'workTotal',
          field: 'workTotal',
          label: '총노출시간',
          align: 'center',
          sortable: false,
          style: 'width:70px'
        },
        {
          name: 'assessResult',
          field: 'assessResult',
          label: '평가결과',
          align: 'center',
          sortable: false,
          style: 'width:70px'
        }
      ]
    }
  ],
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
  listUrl.value = selectConfig.hea.muscleSystem.muscleSop.invest.list.url
  // code setting
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
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
</script>

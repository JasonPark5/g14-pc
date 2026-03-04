<template>
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
          stepperGrpCd="HEA_INVESTIGATION_STEP_CD"
          itemText="stepperMstNm"
          itemValue="stepperMstCd"
          name="heaInvestigationStepCd"
          label="진행단계"
          v-model:value="searchParam.heaInvestigationStepCd"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    title="근골격계 조사계획 목록"
    tableId="lawMakingCheck"
    :columns="grid.columns"
    :data="grid.data"
    @linkClick="linkClick"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
  name: 'investigationPlan'
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
  data: Array<any>
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
const searchParam = ref({
  plantCd: null,
  years: [],
  heaInvestigationStepCd: null
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
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
      style: 'width:300px',
      type: 'link'
    },
    {
      name: 'year',
      field: 'year',
      label: '년도',
      align: 'center',
      sortable: false,
      style: 'width:120px'
    },
    {
      name: 'investigationPeriod',
      field: 'investigationPeriod',
      label: '조사기간',
      align: 'center',
      sortable: false,
      style: 'width:180px'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '담당자',
      align: 'center',
      sortable: false,
      style: 'width:120px'
    },
    {
      name: 'investigationDeptName',
      field: 'investigationDeptName',
      label: '조사부서',
      align: 'center',
      sortable: false,
      style: 'width:250px'
    },
    {
      name: 'heaInvestigationStepName',
      field: 'heaInvestigationStepName',
      label: '진행단계',
      align: 'center',
      sortable: false,
      style: 'width:100px'
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
  listUrl.value = selectConfig.hea.muscleSystem.investigationPlan.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 근골격계 조사계획 목록 조회
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

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./investigationPlanHazardDetail.vue`))
  )
  popupOptions.value.title = '근골격계 조사 상세'
  popupOptions.value.param = {
    heaInvestigationPlanId: row ? row.heaInvestigationPlanId : '',
    stepCd: row ? row.heaInvestigationStepCd : 'HI00000001'
  }
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>

<template>
  <div>
    <q-form ref="editForm">
      <c-search-box @enter="getList">
        <template v-slot:search>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              label="사용년도"
              name="usageYear"
              type="year"
              v-model:value="searchParam.usageYear"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-task-target
              label="배출시설"
              name="envAirMstDischargeId"
              :customPopupParam="{ targetKey: 'airDischarge' }"
              v-model:value="searchParam.envAirMstDischargeId"
            />
          </div>
        </template>
      </c-search-box>
      <c-table
        ref="table"
        title="연료사용량"
        tableId="grid"
        :columns="grid.columns"
        :data="grid.data"
        :usePaging="false"
        :isExcelDown="false"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && grid.data.length > 0"
              label="SEMS 다운로드"
              icon="download"
              @btnClicked="excelDownLoad"
            />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
      </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'iepsFuelUsage'
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
const searchParam = ref({
  plantCd: null,
  usageYear: '',
  envAirMstDischargeId: '',
  useFlag: ''
})
const monthColumns = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1
  return {
    name: `usageVolume${month}`,
    field: `usageVolume${month}`,
    label: `사용량${month}월`,
    type: 'cost',
    style: 'width:70px',
    align: 'center',
    sortable: false
  }
})
const grid = ref<gridType>({
  columns: [
    {
      fix: true,
      name: 'usageYear',
      field: 'usageYear',
      label: '사용년도',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      fix: true,
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구일련번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      fix: true,
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      fix: true,
      name: 'preventiveSemsId',
      field: 'preventiveSemsId',
      label: '방지시설일련번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      fix: true,
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      fix: true,
      name: 'dischargeSemsId',
      field: 'dischargeSemsId',
      label: '배출시설일련번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      fix: true,
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설명',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      fix: true,
      name: 'envAirMstFuelName',
      field: 'envAirMstFuelName',
      label: '사용연료명',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      fix: true,
      name: 'airFuelUnitName',
      field: 'airFuelUnitName',
      label: '사용량단위',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'caloricValue',
      field: 'caloricValue',
      label: '발열량',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'caloricValueUnitName',
      field: 'caloricValueUnitName',
      label: '발열량단위',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'sulphurizeValue',
      field: 'sulphurizeValue',
      label: '황함량',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    ...monthColumns
  ],
  data: []
})
const editable = ref(true)
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
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
  listUrl.value = selectConfig.env.air.sems.fuelUsage.list.url
  // code setting
  searchParam.value.useFlag = 'Y'
  searchParam.value.usageYear = getThisYear()
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

/******************************
 * TODO (목적): 엑셀 다운로드
 *******************************/
function excelDownLoad() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'IEPS 연료사용량.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

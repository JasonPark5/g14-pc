<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="보수기간"
            name="srchDts"
            :range="true"
            v-model:value="searchParam.srchDts"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="방지시설"
            name="envAirMstPreventiveId"
            :customPopupParam="{ targetKey: 'airPreventive' }"
            v-model:value="searchParam.envAirMstPreventiveId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="시설보수사항"
      tableId="grid"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="true"
      :columnSetting="false"
      :filtering="true"
      :isExcelDown="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn
            v-if="editable && grid.data.length > 0"
            label="SEMS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          /> -->
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'airPreventiveMaintenance'
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
const searchParam = ref({
  plantCd: null,
  srchDts: [],
  envAirMstPreventiveId: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구<br>일련번호',
      align: 'center',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '허가증상<br>배출구번호',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'preventiveSemsId',
      field: 'preventiveSemsId',
      label: '방지시설<br>일련번호',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'preventivePermitNo',
      field: 'preventivePermitNo',
      label: '허가증상<br>방지시설번호',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'period',
      field: 'period',
      label: '보수기간',
      child: [
        {
          name: 'startDt',
          field: 'startDt',
          label: '시작일자',
          style: 'width:60px',
          align: 'center',
          sortable: false
        },
        {
          name: 'endDt',
          field: 'endDt',
          label: '마침일자',
          style: 'width:60px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'userName',
      field: 'userName',
      label: '보수자',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '보수명세',
      style: 'width:150px',
      align: 'center',
      sortable: false
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
  listUrl.value = selectConfig.env.air.sems.preventiveMaintenance.list.url
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
// /******************************
//  * TODO (목적): 상세보기 팝업
//  *******************************/
// function downLoadSems() {
//   $http({
//     url: listUrl.value + '/excel',
//     method: 'GET',
//     params: searchParam.value
//   }).then((_result: any) => {
//     const link = document.createElement('a')
//     link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
//     link.download = 'SEMS보수사항엑셀양식.xlsx'
//     link.click()
//   })
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

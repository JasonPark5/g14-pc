<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="기준년도"
            name="srchYear"
            type="year"
            default="today"
            v-model:value="searchParam.srchYear"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="원료사용량"
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
          <c-btn
            v-if="editable && grid.data && grid.data.length > 0"
            label="SEMS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          />
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
  name: 'airSems05'
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
  srchYear: null as stringNull,
  srchDts: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'envAirMstMaterialName',
      field: 'envAirMstMaterialName',
      label: '사용원료명',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'airMaterialUnitName',
      field: 'airMaterialUnitName',
      label: '사용량단위',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'mon01',
      field: 'mon01',
      label: '사용량1월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon02',
      field: 'mon02',
      label: '사용량2월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon03',
      field: 'mon03',
      label: '사용량3월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon04',
      field: 'mon04',
      label: '사용량4월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon05',
      field: 'mon05',
      label: '사용량5월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon06',
      field: 'mon06',
      label: '사용량6월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon07',
      field: 'mon07',
      label: '사용량7월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon08',
      field: 'mon08',
      label: '사용량8월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon09',
      field: 'mon09',
      label: '사용량9월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon10',
      field: 'mon10',
      label: '사용량10월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon11',
      field: 'mon11',
      label: '사용량11월',
      type: 'cost',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'mon12',
      field: 'mon12',
      label: '사용량12월',
      type: 'cost',
      style: 'width: 80px',
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
  listUrl.value = selectConfig.env.air.sems.materials.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (!searchParam.value.srchYear) searchParam.value.srchYear = getThisYear()
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
function downLoadSems() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = searchParam.value.srchYear + '_SEMS원료사용량엑셀양식.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

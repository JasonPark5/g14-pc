<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="일자"
            name="srchDts"
            :range="true"
            v-model:value="searchParam.srchDts"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="시설운전사항"
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
  name: 'airSems03'
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
  srchYear: '',
  srchDts: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'dailyResultDt',
      field: 'dailyResultDt',
      label: '일자',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstOutletName',
      field: 'envAirMstOutletName',
      label: '배출구일련번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstOutletSems',
      field: 'envAirMstOutletSems',
      label: '허가증상배출구번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstOutletNm',
      field: 'envAirMstOutletNm',
      label: '배출구명',
      align: 'left',
      sortable: false
    },
    {
      name: 'envAirMstPreventiveNo',
      field: 'envAirMstPreventiveNo',
      label: '방지시설일련번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstPreventiveNum',
      field: 'envAirMstPreventiveNum',
      label: '사내고유방지시설번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstPreventiveName',
      field: 'envAirMstPreventiveName',
      label: '방지시설명',
      align: 'center',
      sortable: false
    },
    {
      name: 'wattmeterFlag',
      field: 'wattmeterFlag',
      label: '전력계부착여부',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstWattmeterNo',
      field: 'envAirMstWattmeterNo',
      label: '적산전력계번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'wattmeterMagnification',
      field: 'wattmeterMagnification',
      label: '전력계배율',
      align: 'center',
      sortable: false
    },
    {
      name: 'todayScore',
      field: 'todayScore',
      label: '전력 검침량(kWh)',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug1Name',
      field: 'envAirMstDrug1Name',
      label: '약품명1',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug1Volume',
      field: 'envAirMstDrug1Volume',
      label: '사용량1',
      align: 'center',
      sortable: false
    },
    {
      name: 'airDrugUnitName1',
      field: 'airDrugUnitName1',
      label: '단위1',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug2Name',
      field: 'envAirMstDrug2Name',
      label: '약품명2',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug2Volume',
      field: 'envAirMstDrug2Volume',
      label: '사용량2',
      align: 'center',
      sortable: false
    },
    {
      name: 'airDrugUnitName2',
      field: 'airDrugUnitName2',
      label: '단위2',
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
  listUrl.value = selectConfig.env.air.sems.oprequips.list.url
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
    link.download = 'SEMS시설운전사항엑셀양식.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

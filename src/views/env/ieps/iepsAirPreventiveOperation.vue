<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            required
            label="운전년월"
            name="operationMonth"
            type="month"
            v-model:value="searchParam.operationMonth"
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
      title="대기 방지시설 운영현황 목록"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :columnSetting="false"
      :isExcelDown="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="IEPS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          />
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
  name: 'iepsAirPreventiveOperation'
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
interface searchParamType {
  plantCd: stringNull
  operationMonth: stringNull
  envAirMstPreventiveId: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  operationMonth: '',
  envAirMstPreventiveId: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'operationDate',
      field: 'operationDate',
      label: '운영일자',
      style: 'width:100px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'processNo',
      field: 'processNo',
      label: '공정번호',
      style: 'width:80px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정명',
      style: 'width:150px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'preventiveIepsNo',
      field: 'preventiveIepsNo',
      label: '방지시설관리번호',
      style: 'width:100px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      style: 'width:240px',
      align: 'left',
      sortable: false,
      fix: true
    },
    {
      name: 'preventiveIepsPlantMgtNo',
      field: 'preventiveIepsPlantMgtNo',
      label: '사업장관리번호',
      style: 'width:100px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'hourCnt',
      field: 'hourCnt',
      label: '가동시간',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'operationMin',
      field: 'operationMin',
      label: '가동분',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      name: 'powerUsage',
      field: 'powerUsage',
      label: '전력사용량(Kwh)',
      style: 'width:80px',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      name: 'actualTreatmentCapacity',
      field: 'actualTreatmentCapacity',
      label: '처리용량(㎥/hr)',
      style: 'width:70px',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      name: 'preventiveTypeCd',
      field: 'preventiveTypeCd',
      label: '방지시설 분류코드',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'preventiveTypeName',
      field: 'preventiveTypeName',
      label: '방지시설분류명',
      style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'pressureDiff',
      field: 'pressureDiff',
      label: '입출구압력차(△P)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'pressureDiffUnitCd',
      field: 'pressureDiffUnitCd',
      label: '압력차 단위코드',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      name: 'pressureDiffUnitName',
      field: 'pressureDiffUnitName',
      label: '압력차단위코드명',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'temperature',
      field: 'temperature',
      label: '온도',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      name: 'ph',
      field: 'ph',
      label: 'PH',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugName1',
      field: 'drugName1',
      label: '사용약품명-1',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume1',
      field: 'usageVolume1',
      label: '사용약품량-1 (kg/일 또는 L/일)',
      style: 'width:95px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugName2',
      field: 'drugName2',
      label: '사용약품명-2',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume2',
      field: 'usageVolume2',
      label: '사용약품량-2 (kg/일 또는 L/일)',
      style: 'width:95px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugName3',
      field: 'drugName3',
      label: '사용약품명-3',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume3',
      field: 'usageVolume3',
      label: '사용약품량-3 (kg/일 또는 L/일)',
      style: 'width:95px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const table = ref<any>(null)

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
  listUrl.value = selectConfig.env.ieps.air.preventiveOperation.list.url
  // code setting
  searchParam.value.operationMonth = getThisMonth()
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
function downLoadSems() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'IEPS 방지시설 운영현황.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

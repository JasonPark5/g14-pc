<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="자가측정 년도"
            name="measureYear"
            type="year"
            v-model:value="searchParam.measureYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{
              targetKey: 'airOutlet',
              param: {
                searchParam: { selfMeasureExemptionFlag: 'N' }
              }
            }"
            label="대기 배출구"
            name="envAirMstOutletId"
            v-model:value="searchParam.envAirMstOutletId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="SEMS 대기 자가측정 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data!.length > 0"
            label="SEMS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'exceedFlag'">
          <span
            v-if="
              props.row.legalStandard > 0 &&
              props.row.inspectItemValue !== 'ND' &&
              Number(props.row.inspectItemValue) > props.row.legalStandard
            "
            style="color: tomato"
          >
            {{ $language('초과') }}</span
          >
          <span
            v-else-if="props.row.inspectItemValue && props.row.legalStandard"
            class="text-grey-5"
            >{{ $language('이하') }}</span
          >
        </template>
        <template v-else-if="col.name === 'noStandardFlag' && props.row.envAirMstInspectItemId">
          <span v-if="props.row.legalStandard && props.row.legalStandard > 0" class="text-grey-5">{{
            'N'
          }}</span>
          <span v-else style="color: tomato">{{ 'Y' }}</span>
        </template>
        <template v-else-if="col.name === 'legalStandard'">
          <span v-if="props.row[col.name] && props.row[col.name] > 0">{{
            props.row[col.name]
          }}</span>
        </template>
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
  name: 'selfAirMeasure2'
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
  measureYear: getThisYear(),
  plantCd: null,
  envAirMstOutletId: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구번호',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      fix: true
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '배출구허가번호',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      fix: true
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      fix: true
    },
    {
      name: 'measureDt',
      field: 'measureDt',
      label: '측정일',
      align: 'center',
      style: 'width: 120px',
      fix: true
    },
    {
      name: 'measureMethodName',
      field: 'measureMethodName',
      label: '자가측정 방법',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'inspectorName',
      field: 'inspectorName',
      label: '검사기관',
      align: 'center',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'gasSpeed',
      field: 'gasSpeed',
      label: '배출가스 속도(m/s)',
      align: 'center',
      style: 'width: 130px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'gasTemperature',
      field: 'gasTemperature',
      label: '배출가스 온도(℃)',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'moisture',
      field: 'moisture',
      label: '수분량(%)',
      align: 'center',
      style: 'width: 80px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'measuredOxygen',
      field: 'measuredOxygen',
      label: '실측산소농도(%)',
      align: 'center',
      style: 'width: 120px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'standardOxygenName',
      field: 'standardOxygenName',
      label: '표준산소농도(%)',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'gasAmount',
      field: 'gasAmount',
      label: '배출가스 유량(S ㎥/min)',
      align: 'center',
      style: 'width: 160px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'semsWeatherName',
      field: 'semsWeatherName',
      label: '기상',
      align: 'center',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'temperature',
      field: 'temperature',
      label: '기온(℃)',
      align: 'center',
      style: 'width: 80px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'humidity',
      field: 'humidity',
      label: '습도(%)',
      align: 'center',
      style: 'width: 80px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'pressure',
      field: 'pressure',
      label: '기압(mmHg)',
      align: 'center',
      style: 'width: 100px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'windDirectionName',
      field: 'windDirectionName',
      label: '풍향',
      align: 'center',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'windSpeed',
      field: 'windSpeed',
      label: '풍속(m/sec)',
      align: 'center',
      style: 'width: 100px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'inspectItemSemsCd',
      field: 'inspectItemSemsCd',
      label: '오염물질코드',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'envAirMstInspectItemName',
      field: 'envAirMstInspectItemName',
      label: '오염물질명',
      align: 'left',
      // type: 'custom',
      style: 'width: 180px',
      sortable: false,
      currentDay: true
    },
    {
      name: 'inspectItemValue',
      field: 'inspectItemValue',
      label: '오염물질농도',
      align: 'right',
      style: 'width: 100px',
      type: 'cost',
      sortable: false,
      currentDay: true
    },
    {
      name: 'airInspectUnitName',
      field: 'airInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '배출허용기준농도',
      align: 'center',
      style: 'width: 120px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'noStandardFlag',
      field: 'standardFlag',
      label: '배출허용기준없음',
      align: 'center',
      style: 'width: 120px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'exceedFlag',
      field: 'exceedFlag',
      label: '초과여부',
      align: 'center',
      style: 'width: 60px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'fuelName',
      field: 'fuelName',
      label: '연료명 및 사용량(일)',
      align: 'left',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'rawName',
      field: 'rawName',
      label: '원료명 및 사용량<br/>(특정대기유해물질 배출원 포함)',
      align: 'left',
      style: 'width: 180px',
      sortable: false
    },
    {
      name: 'technician',
      field: 'technician',
      label: '환경기술인',
      align: 'center',
      style: 'width: 80px',
      sortable: false,
      setHeader: true
    },
    {
      name: 'opinion',
      field: 'opinion',
      label: '환경기술인 의견',
      align: 'left',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'machine',
      field: 'machine',
      label: '검사 기기명',
      align: 'left',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'method',
      field: 'method',
      label: '검사 방법',
      align: 'left',
      style: 'width: 100px',
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
  listUrl.value = selectConfig.env.sems.air.self.measure.sublist.url
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
    link.download = 'SEMS 대기 자가측정.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

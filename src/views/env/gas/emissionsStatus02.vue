<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="none"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getList"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            type="year"
            :range="true"
            defaultStart="-1y"
            defaultEnd="0y"
            label="비교년도"
            name="years"
            v-model:value="searchParam.years"
            @datachange="getList"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="온실가스별 배출량"
          :columnSetting="false"
          :usePaging="false"
          :filtering="false"
          :hideBottom="true"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="708px"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="background: #fff">
        <apexchart
          ref="chartHTML"
          type="radar"
          height="600"
          :options="chart.options"
          :series="chart.series"
        />
      </div>
    </div>
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
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'emissionsStatus02'
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
  startYear: null as stringNull,
  endYear: null as stringNull,
  years: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '온실가스',
      align: 'left',
      sortable: false
    },
    {
      name: 'maxChangeScoring',
      field: 'maxChangeScoring',
      label: 'GWP',
      helpcomment:
        '지구온난화지수(Global Warming Potential)로, 온실가스 배출량에 곱하여 이산화탄소 환산량(CO2e)을 계산하는 데 사용된다. <br/>이산화탄소를 제외한 다른 온실가스를 이산화탄소 기준으로 환산해 비교하는 데 사용된다.',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'col2021',
      field: 'col2021',
      label: '2021년',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'col2022',
      field: 'col2022',
      label: '2022년',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: [
    {
      itemMstName: 'CO2',
      maxChangeScoring: '1',
      col2021: '123',
      col2022: '100'
    },
    {
      itemMstName: 'CH4',
      maxChangeScoring: '21',
      col2021: '98',
      col2022: '104'
    },
    {
      itemMstName: 'N2O',
      maxChangeScoring: '131',
      col2021: '120',
      col2022: '110'
    },
    {
      itemMstName: 'HFCs',
      maxChangeScoring: '111',
      col2021: '80',
      col2022: '70'
    },
    {
      itemMstName: 'PFCs',
      maxChangeScoring: '181',
      col2021: '110',
      col2022: '210'
    },
    {
      itemMstName: 'SF6',
      maxChangeScoring: '231',
      col2021: '180',
      col2022: '150'
    }
  ]
})
const chart = ref<apexChartType>({
  options: {
    title: { text: '년도별 온실가스 배출량 비교' },
    chart: {
      height: 600,
      type: 'radar',
      // dropShadow: {
      //   enabled: true,
      //   color: '#000',
      //   top: 18,
      //   left: 7,
      //   blur: 10,
      //   opacity: 0.2
      // },
      toolbar: { show: true },
      zoom: { enabled: false }
    },
    plotOptions: {
      radar: {
        size: 250,
        polygons: {
          strokeColors: '#e9e9e9',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    stroke: { width: 2 },
    fill: { opacity: 0.1 },
    markers: {
      size: 5,
      hover: { size: 10 },
      discrete: []
    },
    xaxis: { categories: ['CO2', 'CH4', 'N2O', 'HFCs', 'PFCs', 'SF6'] },
    yaxis: {
      min: 0,
      tickAmount: 5
    },
    tooltip: {
      enabled: false
    }
  },
  series: [
    {
      name: '2021년 배출량',
      data: [123, 98, 120, 80, 110, 180]
    },
    {
      name: '2022년 배출량',
      data: [100, 104, 110, 70, 210, 150]
    }
  ]
})
const editable = ref(true)
const listUrl = ref('')
const chartHTML = ref<any>(null)

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
  listUrl.value = selectConfig.sop.pca.result.graph.list.url
  // code setting
  if (searchParam.value.years) {
    searchParam.value.startYear = searchParam.value.years[0]
    searchParam.value.endYear = searchParam.value.years[1]
  } else {
    searchParam.value.startYear = String(Number(getThisYear()) - 2)
    searchParam.value.endYear = getThisYear()
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 그래프에 들어갈 데이터들 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {})
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

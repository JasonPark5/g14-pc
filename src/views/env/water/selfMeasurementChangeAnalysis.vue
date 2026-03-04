<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="datachange"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            required
            :range="true"
            label="기간"
            name="period"
            type="month"
            defaultStart="-6M"
            defaultEnd="0M"
            v-model:value="period"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="WATER_MEASURE_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            label="측정구분"
            name="waterMeasureTypeCd"
            v-model:value="searchParam.waterMeasureTypeCd"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :comboItems="measurelocItems"
            itemText="envWaterMstMeasurelocName"
            itemValue="envWaterMstMeasurelocId"
            name="envWaterMstMeasurelocId"
            label="측정위치"
            v-model:value="searchParam.envWaterMstMeasurelocId"
            @datachange="datachange2"
          />
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
          style="padding-top: 29px !important"
        >
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </div>
      </template>
    </c-search-box>
    <q-card flat bordered>
      <div class="col-12" style="background: #fff; padding: 30px">
        <apexchart
          ref="chartHTML"
          type="line"
          :height="chart.height"
          :options="chart.options"
          :series="chart.series"
        />
      </div>
    </q-card>
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
  name: 'selfMeasurementChangeAnalysis'
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

/******************************
 * @Interface_선언
 *******************************/
interface waterSeriesType {
  envWaterMstInspectItemId: string
  name: string
  data: number[]
}
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

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
  plantCd: '',
  startYmd: '',
  endYmd: '',
  waterMeasureTypeCd: null,
  envWaterMstMeasurelocId: null
})

const chartHTML = ref<any>(null)
const chart = ref<{
  options: apexChartType['options']
  series: waterSeriesType[]
  height: string
}>({
  options: {
    title: { text: '검사항목별 평균 추이분석' },
    annotations: {
      yaxis: []
    },
    chart: {
      height: 530,
      type: 'line',
      // dropShadow: {
      //   enabled: true,
      //   color: '#000',
      //   top: 18,
      //   left: 7,
      //   blur: 10,
      //   opacity: 0.2
      // },
      toolbar: { show: true },
      zoom: { enabled: false },
      width: '80%'
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: { categories: [] },
    yaxis: {
      title: { text: '항목수치' },
      min: 0,
      max: 10
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    fill: { opacity: 1 },
    markers: { size: 1 },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    }
  },
  series: [
    {
      name: '항목수치',
      data: [],
      envWaterMstInspectItemId: ''
    }
  ],
  height: '680'
})
const period = ref([])
const measurelocItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const itemListUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
// watch(
//   () => chart.value.height,
//   () => {
//     chart.value.height = window.innerHeight + 100
//   }
// )

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
  // url setting
  listUrl.value = selectConfig.env.water.self.measure.graph.url
  itemListUrl.value = selectConfig.env.water.mst.measureloc.list.url
  // code setting
  // list setting
  getItems()
  getList()
}

/******************************
 * TODO (목적): searchParam 중 검사항목 목록 조회
 *******************************/
function getItems() {
  $http({
    url: itemListUrl.value,
    method: 'GET',
    params: {
      plantCd: searchParam.value.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    measurelocItems.value = _result.data
  })
}

/******************************
 * TODO (목적): 목록조회
 *******************************/
function getList() {
  // chartHTML.value.updateOptions({
  //   annotations: {
  //     yaxis: []
  //   }
  // })
  if (chart.value?.options?.yaxis) delete chart.value.options?.yaxis?.max

  if (period.value) {
    if (period.value) {
      searchParam.value.startYmd = period.value[0]
      searchParam.value.endYmd = period.value[1]
    }
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      chart.value.series = []
      const xaxis: any[] = []

      if (searchParam.value.envWaterMstMeasurelocId) {
        const len = _result.data.filter(
          (_item: any, _idx: any) =>
            _result.data.findIndex(
              (__item: any, __idx: any) =>
                _item.envWaterSelfMeasureMstId === __item.envWaterSelfMeasureMstId
            ) === _idx
        ).length

        _.forEach(_result.data, (_item) => {
          const idx = xaxis.indexOf(_item.measureDt)
          if (idx === -1) xaxis.push(_item.measureDt)
          if (_item.envWaterMstInspectItemIds) {
            if (
              _.findIndex(chart.value.series, {
                envWaterMstInspectItemId: _item.envWaterMstInspectItemIds
              }) === -1
            ) {
              chart.value.series.push({
                envWaterMstInspectItemId: _item.envWaterMstInspectItemIds,
                name: _item.envAirMstInspectItemNames,
                data: Array.from({ length: len }, () => 0)
              })
            }
            const seriesIndex = _.findIndex(chart.value.series, {
              envWaterMstInspectItemId: _item.envWaterMstInspectItemIds
            })
            if (seriesIndex !== -1) {
              chart.value.series[seriesIndex].data[idx] = _item.measures
            }
          }
        })

        chartHTML.value.updateOptions({
          xaxis: {
            categories: xaxis
          },
          yaxis: {
            title: { text: $language('항목수치') }
          },
          title: {
            text: $language('측정위치별 검사항목 추이분석')
          }
        })
      } else {
        // series.data length 구하기
        const len = _result.data.filter(
          (_item: any, _idx: any) =>
            _result.data.findIndex(
              (__item: any, __idx: any) =>
                _item.envWaterSelfMeasureMstId === __item.envWaterSelfMeasureMstId
            ) === _idx
        ).length

        _.forEach(_result.data, (_item) => {
          const idx = xaxis.indexOf(_item.measureDt)
          if (idx === -1) xaxis.push(_item.measureDt)
          if (_item.envWaterMstInspectItemIds) {
            if (
              _.findIndex(chart.value.series, {
                envWaterMstInspectItemId: _item.envWaterMstInspectItemIds
              }) === -1
            ) {
              chart.value.series.push({
                envWaterMstInspectItemId: _item.envWaterMstInspectItemIds,
                name: _item.envAirMstInspectItemNames,
                data: Array.from({ length: len }, () => 0)
              })
            }
            const seriesIndex = _.findIndex(chart.value.series, {
              envWaterMstInspectItemId: _item.envWaterMstInspectItemIds
            })
            if (seriesIndex !== -1) {
              chart.value.series[seriesIndex].data[idx] = _item.measures
            }
          }
        })
        chartHTML.value.updateOptions({
          title: {
            text: $language('검사항목별 평균 추이분석')
          },
          xaxis: {
            categories: xaxis
          }
        })
      }
      setTimeout(() => {
        chartHTML.value.updateOptions({
          chart: {
            width: '100%'
          }
        })
      }, 200)
    })
  } else {
    message.alert({
      title: '안내',
      message: '기간을 선택하세요',
      type: 'warning' // success / info / warning / error
    })
  }
}

/******************************
 * TODO (목적): 검색조건 값 변경시
 *******************************/
function datachange() {
  $http({
    url: itemListUrl.value,
    method: 'GET',
    params: {
      plantCd: searchParam.value.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    searchParam.value.envWaterMstMeasurelocId = null
    measurelocItems.value = _result.data
    getList()
  })
}
function datachange2() {
  searchParam.value.waterMeasureTypeCd = null
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.el-cascader-menu__wrap
  height: calc(var(--cascader-height-var)) !important
.dashborad
  .customCardbody
    padding: 0px !important
    margin: 0px !important
.grid-menu [class*=col-]
  border-width: 0 !important
  padding: 0px !important
.widget-chart
  padding: 5px !important
.widget-chart .widget-numbers
  margin: 12px !important

.none-bottom
  .q-field--with-bottom
    padding-bottom: 0px !important

.app-main__inner .riskassess-dashboard
  .row [class*=col-]
    padding: 0px !important
</style>
<style scoped>
.blinking {
  -webkit-animation: blink 1s ease-in-out infinite alternate;
  -moz-animation: blink 1s ease-in-out infinite alternate;
  animation: blink 1s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

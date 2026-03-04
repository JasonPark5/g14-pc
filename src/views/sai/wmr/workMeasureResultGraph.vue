<template>
  <div class="row bg-white">
    <div class="col-12">
      <c-search-box>
        <template v-slot:search>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-plant
              type="search"
              name="plantCd"
              v-model:value="searchParam.plantCd"
              @datachange="getList"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              name="measYear"
              type="year"
              :range="true"
              label="측정년도"
              defaultStart="-3y"
              defaultEnd="0y"
              v-model:value="searchParam.measYear"
              @datachange="getList"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              type="search"
              codeGroupCd="WORK_MEAS_QUARTER_CD"
              itemText="codeName"
              itemValue="code"
              label="상/하반기"
              name="measQuarter"
              v-model:value="searchParam.measQuarter"
              @update:value="getList"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              type="search"
              :comboItems="[
                { code: '1', codeName: '소음' },
                { code: '5', codeName: '고열' },
                { code: '2', codeName: '분진' },
                { code: '4', codeName: '금속류' },
                { code: '6', codeName: '가스상물질류' }
              ]"
              itemText="codeName"
              itemValue="code"
              label="유해인자 구분"
              name="workAreaGradeCd"
              v-model:value="searchParam.workAreaGradeCd"
              @update:value="getList"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              label="유해인자"
              name="hazardNames"
              v-model:value="searchParam.hazardNames"
              @dataChange="getList"
            />
          </div>
        </template>
      </c-search-box>
      <div class="col-12">
        <apexchart
          ref="chartHTML"
          class="wmr"
          height="720"
          :options="chart.options"
          :series="chart.series"
        />
      </div>
    </div>
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
import { apexChartType } from '@/types/apexChart'
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'workMeasureResultGraph'
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

const searchParam = ref<any>({
  measQuarter: null,
  measYear: [],
  startYmd: '',
  endYmd: '',
  workAreaGradeCd: null,
  hazardNames: ''
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const chartHTML = ref<any>(null)
const chart = ref<apexChartType>({
  options: {
    title: { text: '작업환경측정치 통계' },
    chart: {
      height: 720,
      toolbar: { show: true },
      zoom: { enabled: false },
      width: '80%'
    },
    dataLabels: {
      enabled: false
    },
    stroke: { width: [0, 5], curve: 'smooth' },
    xaxis: { categories: [] },
    yaxis: {
      title: { text: '항목수치' }
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
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: {
        width: 10,
        height: 10
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '10px'
      },
      onDatasetHover: {
        highlightDataSeries: true
      },
      offsetY: -60
    }
  },
  series: [
    {
      name: '최대측정',
      type: 'column',
      data: []
    },
    {
      name: '노출기준',
      type: 'line',
      data: []
    }
  ]
})

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
  // url setting
  listUrl.value = selectConfig.sai.workmeas.result.chart.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록조회
 *******************************/
function getList() {
  if (!searchParam.value.measYear || searchParam.value.measYear.length < 2) {
    message.alert({
      title: '안내',
      message: '측정년도를 선택하세요',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  ;[searchParam.value.startYmd, searchParam.value.endYmd] = searchParam.value.measYear
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    chart.value.series = []
    const xaxis: any[] = []
    const len = _.uniqBy(_result.data, 'workMeasurementPlanId').length
    // 유해인자별 고유 색상을 할당하기 위한 맵
    const colorMap = new Map()

    _.forEach(_result.data, (_item, idx) => {
      xaxis.push(_item.measPlanContent)
      if (_item.twaCurr) {
        _.forEach(_item.twaCurr, (__item) => {
          if (!colorMap.has(__item.hazardCd))
            colorMap.set(__item.hazardCd, generateColor(__item.hazardCd))
          const selectedColor = colorMap.get(__item.hazardCd)

          const columnSeriesName = `${__item.hazardCd}_${__item.unit}_최대측정치`
          const lineSeriesName = `${__item.hazardCd}_${__item.unit}_노출기준`
          // 최대측정치 (column) 처리
          const columnIndex = _.findIndex(chart.value.series, { name: columnSeriesName })
          if (columnIndex === -1) {
            chart.value.series.push({
              name: columnSeriesName,
              type: 'column',
              color: selectedColor,
              data: Array(len).fill(0)
            })
            chart.value.series[chart.value.series.length - 1].data[idx] =
              Number(__item.twaCurr) || 0
          } else {
            chart.value.series[columnIndex].data![idx] = Number(__item.twaCurr) || 0
          }
          // 노출기준 (line) 처리
          const lineIndex = _.findIndex(chart.value.series, { name: lineSeriesName })
          if (lineIndex === -1) {
            chart.value.series.push({
              name: lineSeriesName,
              type: 'line',
              color: selectedColor,
              data: Array(len).fill(0)
            })
            chart.value.series[chart.value.series.length - 1].data[idx] =
              Number(__item.exposureStandard) || 0
          } else {
            // 이미 존재하면 동일한 노출기준 값으로 채움
            chart.value.series[lineIndex].data![idx] = Number(__item.exposureStandard) || 0
          }
        })
      }
    })
    chartHTML.value.updateOptions({
      xaxis: {
        categories: xaxis
      }
    })
  })
}
function generateColor(str: stringNull) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }
  return color
}
// /******************************
//  * TODO (목적): 유해인자 검색해서 가져오기
//  *******************************/
// function searchPop() {
//   popupOptions.value = getPopupOptions('hazardFactor', popupOptions.value, closeHazardPopup, {
//     type: 'multiple',
//     searchParam: { workEnvFlag: 'Y' }
//   })
// }
// function closeHazardPopup(data: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   let sum = 0
//   if (data && data.length > 0) {
//     _.forEach(data, (_item) => {
//       if (_.findIndex(searchParam.value.hazardList, { hazardCd: _item.hazardCd }) === -1) {
//         sum++
//         if (sum === 1) {
//           searchParam.value.hazardCds += _item.hazardCd
//           searchParam.value.hazardNames += _item.hazardName
//         } else if (_item.length !== sum) {
//           searchParam.value.hazardCds += ', ' + _item.hazardCd
//           searchParam.value.hazardNames += ', ' + _item.hazardName
//         }
//       }
//     })
//     getList()
//   }
// }
// /******************************
//  * TODO (목적): 유해인자 검색해서 가져오기
//  *******************************/
// function removeHazard() {
//   searchParam.value.hazardCds = ''
//   searchParam.value.hazardNames = ''
//   getList()
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.wmr
  .apexcharts-tooltip
    font-size: 9px !important
    line-height: 1.6em !important
    display: flex !important
    flex-direction: column !important
    max-height: 500px !important
    overflow-y: auto !important
    pointer-events: auto !important

  .apexcharts-tooltip-series-group
    padding: 1px 4px !important
    min-height: 14px !important
    justify-content: flex-start !important

  .apexcharts-tooltip-text
    padding: 0 4px !important

  .apexcharts-tooltip-marker
    width: 8px !important
    height: 8px !important
    margin-right: 5px !important

  .apexcharts-legend
    padding: 0 40px !important
</style>

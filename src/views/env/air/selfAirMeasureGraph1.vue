<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="datachange"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="edit"
            required
            codeGroupCd="AIR_INSPECT_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            label="측정구분"
            name="airInspectTypeCd"
            v-model:value="searchParam.airInspectTypeCd"
            @update:value="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            v-show="isYear"
            required
            :range="true"
            :clearable="false"
            label="기간"
            type="year"
            name="period"
            defaultStart="-3y"
            defaultEnd="0y "
            v-model:value="period2"
            @datachange="datachange"
          />
          <c-datepicker
            v-show="!isYear"
            required
            :range="true"
            :clearable="false"
            defaultStart="-36M"
            defaultEnd="-1M"
            label="기간"
            name="period"
            type="month"
            v-model:value="period"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="배출구"
            name="envAirMstOutletId"
            :customPopupParam="{ targetKey: 'airOutlet' }"
            v-model:value="searchParam.envAirMstOutletId"
            @dataChange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            v-if="searchParam.envAirMstOutletId"
            :comboItems="inspectItems"
            type="search"
            itemText="envAirMstInspectItemName"
            itemValue="envAirMstInspectItemId"
            name="envAirMstInspectItemId"
            label="검사항목"
            v-model:value="searchParam.envAirMstInspectItemId"
            @update:value="datachange2"
          />
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"
          style="position: relative; top: 24px; text-align: center"
        >
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
    </c-search-box>
    <q-card flat bordered>
      <div class="col-12" style="background: #fff; padding: 30px">
        <apexchart
          ref="chartHTML"
          type="line"
          height="680"
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
  name: 'selfAirMeasureGraph1'
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
  airInspectTypeCd: 'AITC000001',
  envAirMstOutletId: '',
  outletName: '',
  envAirMstInspectItemId: null,
  envAirMstInspectItemName: ''
})
const chartHTML = ref<any>(null)
const chart = ref<apexChartType>({
  options: {
    title: { text: '검사항목별 평균 추이분석' },
    annotations: {
      yaxis: []
    },
    chart: {
      height: 430,
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
      min: 0
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
      data: []
    }
  ],
  chartWidth: '80%'
})
const isYear = ref(false)
const period = ref(['', ''])
const period2 = ref(['', ''])
const inspectItems = ref<Array<codeMasterType>>([])
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
  listUrl.value = selectConfig.env.air.self.measure.graph.url
  itemListUrl.value = selectConfig.env.air.mst.inspect.plant.url
  // code setting
  const [year, month] = getThisMonth().split('-').map(Number) // 'YYYY-MM'을 숫자로 변환
  const startYear = year - 3 // 3년 전 계산
  period.value = [`${startYear}-${month.toString().padStart(2, '0')}`, getThisMonth()]
  // list setting
  getItems()
  getList()
}

/******************************
 * TODO (목적): 목록조회
 *******************************/
function getList() {
  // chartHTML.value?.updateOptions({
  //   annotations: { yaxis: [] },
  //   yaxis: {
  //     min: undefined,
  //     max: undefined
  //   }
  // })
  // delete chart.value.options.yaxis.max
  if (period.value?.length > 1 || period2.value?.length > 1) {
    searchParam.value.startYmd = isYear.value ? period2.value[0] : period.value[0]
    searchParam.value.endYmd = isYear.value ? period2.value[1] : period.value[1]

    if (searchParam.value.airInspectTypeCd) {
      $http({
        url: listUrl.value,
        method: 'GET',
        params: searchParam.value
      }).then((_result: any) => {
        chart.value.series = []
        const newCategories: any[] = []

        if (searchParam.value.envAirMstOutletId) {
          const seriesData = [] as Array<any>
          _.forEach(_result.data, (_item) => {
            newCategories.push(_item.envAirSelfMeasureMstName)
            if (_item.envAirMstInspectItemIds) {
              let count = 0
              const ids = _.split(_item.envAirMstInspectItemIds, ',')
              const names = _.split(_item.envAirMstInspectItemNames, ',')
              const measures = _.split(_item.measures, ',')

              _.forEach(ids, (__item) => {
                seriesData.push({
                  envAirSelfMeasureMstId: _item.envAirSelfMeasureMstId,
                  envAirMstInspectItemId: __item,
                  name: names[count],
                  measure: measures[count]
                })
                if (_.findIndex(chart.value.series, { envAirMstInspectItemId: __item }) === -1) {
                  chart.value.series.push({
                    envAirMstInspectItemId: __item,
                    name: names[count],
                    data: []
                  })
                }
                count++
              })
            }
          })
          chartHTML.value?.updateOptions({
            xaxis: {
              categories: newCategories
            },
            yaxis: {
              title: { text: $language('항목수치') }
            },
            title: {
              text:
                $language('배출구별 검사항목 추이분석') + ' (' + searchParam.value.outletName + ')'
            }
          })
          let minMeasure = 0
          let maxMeasure = 0
          _.forEach(chart.value.series, (_item) => {
            const realSeriesData = _.filter(seriesData, {
              envAirMstInspectItemId: _item.envAirMstInspectItemId
            })
            _.forEach(realSeriesData, (__item) => {
              if (minMeasure > Number(__item.measure)) minMeasure = Number(__item.measure)
              if (maxMeasure < Number(__item.measure)) maxMeasure = Number(__item.measure)
              _item.data!.push(Number(__item.measure))
            })
          })
          if (chart.value.series.length > 0) {
            if (searchParam.value.envAirMstInspectItemId) {
              chartHTML.value?.updateOptions({
                title: {
                  text:
                    $language('배출구별 검사항목 추이분석') +
                    ' (' +
                    searchParam.value.outletName +
                    ' / ' +
                    searchParam.value.envAirMstInspectItemName +
                    ')'
                }
              })
              const anos = _.filter(inspectItems.value, {
                envAirMstInspectItemId: searchParam.value.envAirMstInspectItemId
              })
              const _datas = []
              _.forEach(chart.value.series, (_items) =>
                _.forEach(_items.data, (_item) => _datas.push(parseFloat(_item)))
              )
              if (anos.length > 0) {
                const _legalStandard = anos[0].legalStandard
                const _innerStandard = anos[0].innerStandard
                if (minMeasure > Number(_legalStandard)) minMeasure = Number(_legalStandard)
                if (maxMeasure < Number(_legalStandard)) maxMeasure = Number(_legalStandard)
                if (minMeasure > Number(_innerStandard)) minMeasure = Number(_innerStandard)
                if (maxMeasure < Number(_innerStandard)) maxMeasure = Number(_innerStandard)
                chartHTML.value?.updateOptions({
                  annotations: {
                    yaxis: [
                      {
                        y: _legalStandard,
                        borderColor: '#e53935',
                        label: {
                          borderColor: '#e53935',
                          style: {
                            color: '#fff',
                            background: '#e53935'
                          },
                          text: $language('법적기준') + ' : ' + _legalStandard
                        }
                      },
                      {
                        y: _innerStandard,
                        borderColor: '#ffd600',
                        label: {
                          borderColor: '#ffd600',
                          style: {
                            color: '#000',
                            background: '#ffd600'
                          },
                          text: $language('내부기준') + ' : ' + _innerStandard
                        }
                      }
                    ]
                  }
                })
              }
            } else {
              chartHTML.value?.updateOptions({
                annotations: {
                  yaxis: []
                }
              })
            }
            chartHTML.value?.updateOptions({
              yaxis: {
                min: minMeasure,
                max: maxMeasure
              }
            })
          } else {
            chartHTML.value?.updateOptions({
              annotations: {
                yaxis: []
              },
              yaxis: {
                max: undefined,
                min: undefined
              }
            })
            // delete chart.value.options.yaxis.max
            // delete chart.value.options.yaxis.min
          }
        } else {
          // series.data length (_result.data 배열에서 envAirSelfMeasureMstId 값이 고유한 항목들의 개수) 구하기
          const uniqueX = _.uniqBy(_result.data, 'envAirSelfMeasureMstId') // x축 고유 ID
          const newCategories = uniqueX.map((item: any) => item.envAirSelfMeasureMstName)
          const seriesMap: Record<
            string,
            {
              envAirMstInspectItemId: string
              name: string
              data: number[]
            }
          > = {}
          // 시리즈 초기화
          _.forEach(_result.data, (_item) => {
            const key = _item.envAirMstInspectItemIds
            const name = _item.envAirMstInspectItemNames
            if (key && !seriesMap[key]) {
              seriesMap[key] = {
                envAirMstInspectItemId: key,
                name: name,
                data: Array.from({ length: newCategories.length }, () => 0)
              }
            }
            // x축 index 위치 구해서 값 삽입
            const xIdx = newCategories.indexOf(_item.envAirSelfMeasureMstName)
            if (key && xIdx !== -1) seriesMap[key].data[xIdx] = Number(_item.measures)

            // 차트 데이터로 변환
            chart.value.series = Object.values(seriesMap)
          })
          chartHTML.value?.updateOptions({
            title: {
              text: $language('검사항목별 평균 추이분석')
            },
            xaxis: {
              categories: newCategories
            }
          })
        }
        setTimeout(() => {
          chart.value.chartWidth = '100%'
        }, 200)
      })
    } else {
      message.alert({
        title: '안내',
        message: '측정구분을 선택하세요',
        type: 'warning' // success / info / warning / error
      })
    }
  } else {
    message.alert({
      title: '안내',
      message: '기간을 선택하세요',
      type: 'warning' // success / info / warning / error
    })
  }
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
      airInspectTypeCd: searchParam.value.airInspectTypeCd
    }
  }).then((_result: any) => {
    inspectItems.value = _result.data
  })
}

/******************************
 * TODO (목적): 검색조건 값 변경시
 *******************************/
function datachange(data1?: any, data2?: any, data3?: any) {
  searchParam.value.envAirMstInspectItemId = null
  isYear.value = searchParam.value.airInspectTypeCd === 'AITC000001' ? false : true

  if (data3) {
    searchParam.value.envAirMstInspectItemId = null
    searchParam.value.envAirMstOutletId = data3.envAirMstOutletId
    searchParam.value.outletName = data3.outletName

    chartHTML.value?.updateOptions({
      title: {
        text: $language('배출구별 검사항목 추이분석') + ' (' + data3.outletName + ')'
      }
    })
  }
  getItems()
  getList()
}
function datachange2(_data: any) {
  searchParam.value.envAirMstInspectItemName = _data.label
  chartHTML.value?.updateOptions({
    title: {
      text:
        $language('배출구별 검사항목 추이분석') +
        ' (' +
        searchParam.value.outletName +
        ' / ' +
        _data.label +
        ')'
    }
  })
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

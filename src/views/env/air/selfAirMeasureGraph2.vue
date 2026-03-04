<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            type="none"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getMeasure"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="측정년도"
            type="year"
            name="measureYear"
            default="today"
            v-model:value="searchParam.measureYear"
            @datachange="getMeasure"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="none"
            codeGroupCd="AIR_INSPECT_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            label="측정구분"
            name="airInspectTypeCd"
            v-model:value="searchParam.airInspectTypeCd"
            @datachange="getMeasure"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="measureItems"
            required
            type="edit"
            itemText="envAirSelfMeasureMstName"
            itemValue="envAirSelfMeasureMstId"
            name="envAirSelfMeasureMstId"
            label="측정 회차"
            v-model:value="searchParam.envAirSelfMeasureMstId"
            @update:value="getList"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="inspectItems"
            type="search"
            itemText="envAirMstInspectItemName"
            itemValue="envAirMstInspectItemId"
            name="envAirMstInspectItemId"
            label="검사항목"
            v-model:value="searchParam.envAirMstInspectItemId"
            @update:value="getList"
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
          :height="chart.height"
          :options="chart.options"
          :series="chart.series"
        />
      </div>
    </q-card>
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
  name: 'selfAirMeasureGraph2'
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
  measureYear: '',
  airInspectTypeCd: 'AITC000001',
  envAirSelfMeasureMstId: null as stringNull,
  envAirMstInspectItemId: null
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
const chartHTML = ref<any>(null)
const chart = ref<apexChartType>({
  options: {
    title: { text: '측정회차별 추이분석' },
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
      horizontalAlign: 'center'
    }
  },
  series: [
    {
      name: '항목수치',
      data: []
    }
  ],
  height: '680'
})
const inspectItems = ref<Array<codeMasterType>>([])
const measureItems = ref<Array<codeMasterType>>([])
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
  listUrl.value = selectConfig.env.air.self.measure.graph.url + '2'
  itemListUrl.value = selectConfig.env.air.mst.inspect.plant.url
  // code setting
  searchParam.value.envAirSelfMeasureMstId = 'SM00000011'
  // list setting
  getMeasure()
}
/******************************
 * TODO (목적): 목록조회
 *******************************/
function getList() {
  if (chart.value?.options?.yaxis) delete chart.value.options.yaxis.max
  if (searchParam.value.envAirSelfMeasureMstId) {
    const _mstsId = searchParam.value.envAirMstInspectItemId
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      chart.value.series = []
      const xaxis: any[] = []
      _.forEach(_result.data, (_item1) => {
        if (xaxis.indexOf(_item1.envAirMstOutletName) === -1) xaxis.push(_item1.envAirMstOutletName)
      })
      if (!_mstsId) {
        _.forEach(inspectItems.value, (_item2) => {
          const seriesData = [] as Array<any>
          _.forEach(_result.data, (_item3) => {
            if (_item3.envAirMstInspectItemId === _item2.envAirMstInspectItemId) {
              seriesData.push(_item3.measure)
            }
          })
          chart.value.series.push({
            envAirMstInspectItemId: _item2.envAirMstInspectItemId,
            name: _item2.envAirMstInspectItemName,
            data: seriesData
          })
        })
      } else {
        const seriesData = [] as Array<any>
        _.forEach(_result.data, (_item3) => {
          if (_item3.envAirMstInspectItemId === _mstsId) seriesData.push(_item3.measure)
        })
        chart.value.series.push({
          envAirMstInspectItemId: _mstsId,
          name: '측정값',
          data: seriesData
        })
      }
      chartHTML.value.updateOptions({
        xaxis: {
          categories: xaxis
        },
        title: {
          text: $language('측정회차별 추이분석')
        }
      })
      if (chart.value.series.length > 0 && _mstsId !== null) {
        const anos = _.filter(inspectItems.value, { envAirMstInspectItemId: _mstsId })
        const _datas = [] as Array<any>
        _.forEach(chart.value.series, (_items) => {
          _.forEach(_items.data, (_item) => _datas.push(parseFloat(_item)))
        })
        const _maxVal = Math.max.apply(null, _datas)
        const _legalStandard = anos[0].legalStandard
        const _innerStandard = anos[0].innerStandard
        if (_legalStandard > _innerStandard) {
          if (_maxVal > _legalStandard) {
            chartHTML.value.updateOptions({
              yaxis: { max: _maxVal }
            })
          } else {
            chartHTML.value.updateOptions({
              yaxis: { max: _legalStandard }
            })
          }
        } else {
          if (_maxVal > _innerStandard) {
            chartHTML.value.updateOptions({
              yaxis: { max: _maxVal }
            })
          } else {
            chartHTML.value.updateOptions({
              yaxis: { max: _innerStandard }
            })
          }
        }

        if (anos.length > 0) {
          chartHTML.value.updateOptions({
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
        chartHTML.value.updateOptions({
          annotations: {
            yaxis: []
          }
        })
        delete chart.value.options.yaxis.max
      }
    })
  } else {
    message.alert({
      title: '안내',
      message: '측정 회차를 선택하세요',
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
    getList()
  })
}
/******************************
 * TODO (목적): searchParam 중 측정회차 목록 조회
 *******************************/
function getMeasure() {
  $http({
    url: selectConfig.env.air.self.measure.list.url,
    method: 'GET',
    params: {
      plantCd: searchParam.value.plantCd,
      airInspectTypeCd: searchParam.value.airInspectTypeCd,
      measureYear: searchParam.value.measureYear
    }
  }).then((_result: any) => {
    measureItems.value = _result.data
    // searchParam.value.envAirSelfMeasureMstId = null
    searchParam.value.envAirMstInspectItemId = null
    getItems()
  })
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

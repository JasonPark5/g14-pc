<template>
  <div>
    <div class="row maindashboard-director">
      <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <div class="cardcontents">
          <div class="card-header">
            {{ $language('안전준비태세(SAFCON) 경보단계') }}
          </div>
          <div class="card-body" style="height: 336px">
            <div class="row">
              <div class="col-4 safcon-left" style="text-align: center !important">
                <q-icon :name="safconImg" :color="faceColor" size="7em" />
                <br />
                <div :class="safconTextClass">{{ $language(safconText) }}</div>
              </div>
              <div class="col-8 safcon-right" style="text-align: center !important">
                <div class="row">
                  <div class="col-3" style="text-align: center !important">
                    <div :class="safconTextClass1">{{ $language('무사고') }}</div>
                  </div>
                  <div class="col-3" style="text-align: center !important">
                    <div :class="safconTextClass2">{{ $language('주의') }}</div>
                  </div>
                  <div class="col-3" style="text-align: center !important">
                    <div :class="safconTextClass3">{{ $language('경계') }}</div>
                  </div>
                  <div class="col-3" style="text-align: center !important">
                    <div :class="safconTextClass4">{{ $language('심각') }}</div>
                  </div>
                  <div class="col-12 safconDate" style="text-align: center !important">
                    {{ safconData.startDt }} ~ {{ safconData.endDt }}
                  </div>
                  <div class="col-12 safconTeam" style="text-align: center !important">
                    <div class="row">
                      <div class="col-12">
                        {{ $language('안전사고') }}
                        <span class="safconbox">{{ safconData.total }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} A
                        <span class="safconbox">{{ safconData.team1 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} B
                        <span class="safconbox">{{ safconData.team2 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} C
                        <span class="safconbox">{{ safconData.team3 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} D
                        <span class="safconbox">{{ safconData.team4 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} E
                        <span class="safconbox">{{ safconData.team5 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} F
                        <span class="safconbox">{{ safconData.team6 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('생산팀') }} G
                        <span class="safconbox">{{ safconData.team7 }}</span
                        >{{ $language('건') }}
                      </div>
                      <div class="col-6">
                        {{ $language('기타') }} <span class="safconbox">{{ safconData.etc }}</span
                        >{{ $language('건') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="col-12">
        <div class="cardcontents">
          <div class="card-header">
            {{ $language('통합개선 이행률 현황') }}
            <div class="card-more main-header-input main-header-input2">
              <c-datepicker
                type="year"
                default="today"
                name="actionCompleteRequestDate"
                @datachange="getImprStatus"
                v-model:value="actionCompleteRequestDate"
              />
            </div>
          </div>
          <div class="card-body">
            <apexcharts
              ref="imprChartRef"
              height="280px"
              type="bar"
              @dataPointSelection="selectedBarImp"
              :width="imprChart.chartWidth"
              :options="imprChart.options"
              :series="imprChart.series"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents">
          <div class="card-header">
            <span class="cursor-pointer" @click="kpiLink">{{ $language('연간 KPI 현황') }}</span>
            <div
              class="card-more main-header-input main-header-input2"
              style="width: 140px !important"
            >
              <c-datepicker
                :appendToBody="false"
                type="year"
                default="today"
                name="kpiYear"
                v-model:value="kpiYear"
                @datachange="getKpi"
              />
            </div>
          </div>
          <div class="card-body" style="height: 460px; padding: 0 !important">
            <c-table
              class="kpi"
              :columns="gridKpi.columns"
              :data="gridKpi.data"
              gridHeight="450px"
              :striped="true"
              :isTitle="false"
              :isDashboard="true"
              :columnSetting="false"
              :usePaging="false"
              :filtering="false"
              :isFullScreen="false"
              :hideBottom="true"
            >
              <template v-slot:customArea="{ props }">
                <div style="padding: 12px">
                  <apexcharts
                    height="50px"
                    type="line"
                    :options="props.row.chartOptions"
                    :series="props.row.chartSeries"
                  />
                </div>
              </template>
            </c-table>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div ref="main-dashborad" class="cardcontents directorMainLayer">
          <div class="card-header non-label-icon mapheader">
            {{ $language('작업허가서 현황') }}
            <div class="card-more main-header-input main-header-input2 main-header-input2-director">
              <c-datepicker
                v-show="mapObj.activeTask === 1"
                :range="true"
                :appendToBody="false"
                name="workPermitPeriod"
                v-model:value="mapObj.taskParam.workPermitPeriod"
                @datachange="getMapData"
              />
            </div>
          </div>
          <div class="card-body" ref="carousel">
            <q-carousel
              v-if="mapObj.maps && mapObj.maps.length > 0"
              class="workPermit-carousel"
              swipeable
              animated
              transition-prev="slide-right"
              transition-next="slide-left"
              arrows
              infinite
              control-type="regular"
              control-color="grey-6"
              v-model="mapObj.slide"
            >
              <q-carousel-slide
                v-for="(map, idx) in mapObj.maps"
                :key="idx"
                :name="idx"
                :img-src="map.mapSrc"
              >
                <q-chip
                  square
                  outline
                  dense
                  color="blue"
                  style="z-index: 10; position: absolute; right: -20px"
                  :label="map.mapName"
                />
                <div class="mapWorkIcons">
                  <q-expansion-item
                    dense
                    class="shadow-1 overflow-hidden"
                    style="border-radius: 10px"
                    icon=""
                    :label="$language('범례')"
                    header-class="bg-default text-white"
                    expand-icon-class="text-white"
                    expand-icon="expand_less"
                    expanded-icon="expand_more"
                    default-opened
                  >
                    <q-card>
                      <q-card-section>
                        <ul>
                          <li v-for="(icon, iconIdx) in swpIconItems" :key="iconIdx">
                            <q-icon :name="icon.icon" class="text-red" size="16px" />
                            {{ $language(icon.name) }}
                          </li>
                        </ul>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </div>
                <!-- 작업허가서 -->
                <template v-if="mapObj.activeTask === 1">
                  <VueDraggableResizable
                    v-for="(item, idx) in map.maps"
                    :key="idx"
                    ref="markImage"
                    class="mainMarkImage"
                    :class="item.idx === mapObj.activeMarked ? 'selected' : ''"
                    :resizable="false"
                    :parent="true"
                    :draggable="false"
                    :x="item.locationXcoordinate * mapRate * mapObj.ratio * 1.05"
                    :y="item.locationYcoordinate * mapRate * mapObj.ratio * 1.09"
                    :w="40"
                    :h="40"
                    :grid="[20, 20]"
                    @activated="onMarkedInfo(item)"
                  >
                    <c-map-marker :isSelected="item.idx === mapObj.activeMarked" />
                    <q-menu
                      :ref="
                        (el: any) => {
                          markedRefArray[item.idx] = el
                        }
                      "
                      :content-class="'mainMapMenuLayer'"
                      anchor="top right"
                      self="top left"
                      style="z-index: inherit !important"
                    >
                      <q-card
                        v-for="(workPermit, idx) in mapObj.selectedWorkPermit.workPermits"
                        :key="idx"
                        flat
                        bordered
                        @click="openWorkPermitPop(workPermit)"
                        :class="[
                          'main-work-permit-card main-work-permit-card-cursor',
                          setStepClass(workPermit.swpStepCd)
                        ]"
                      >
                        <q-item class="main-work-permit-card-section main-work-permit-card-item">
                          <q-item-section avatar>
                            <q-chip
                              square
                              outline
                              dense
                              size="0.9em"
                              :color="setStepColor(workPermit.swpStepCd)"
                              :label="workPermit.swpStepName"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>
                              <q-icon
                                v-for="(icon, iconIdx) in setTypeIcons(workPermit.sopWorkTypeCd)"
                                :key="iconIdx"
                                :name="icon"
                                class="text-red"
                                size="25px"
                              />
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-card-section class="main-work-permit-card-section2">
                          <b>{{ workPermit.workSummary }}</b>
                        </q-card-section>
                        <q-card-section class="main-work-permit-card-section1">
                          {{ workPermit.workTime }}
                        </q-card-section>
                      </q-card>
                    </q-menu>
                  </VueDraggableResizable>
                </template>
              </q-carousel-slide>
            </q-carousel>
            <q-img v-else src="@images/no-image.png" class="no-image">
              <div class="absolute-bottom text-subtitle1 text-center">
                {{ $language('등록된 지도가 없습니다.') }}
              </div>
            </q-img>
          </div>
        </div>
        <!-- 작업허가 현황 [E]-->
      </div>
    </div>
    <c-dialog :param="popupOptions" />
    <c-notice-popup />
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
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'indexDirector'
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
  columns: tableColumnType
  data: Array<any>
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
const editable = ref(true)
const mapObj = ref<any>({
  activeTask: 1,
  activeMarked: 0,
  selectedWorkPermit: {
    workPermits: []
  },
  envUrl: '',
  markInfoUrl: '',
  url: '',
  taskParam: {
    workPermitPeriod: []
  },
  location: {
    mdmLocationId: '',
    locationName: '',
    depts: [],
    chemprods: [],
    equips: [],
    hazardChems: []
  },
  maps: [],
  orignMaps: [],
  slide: 0,
  height: 800,
  ratio: 1,
  orignRatio: 1,
  endIdx: 1,
  loading: false
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const imprChartRef = ref<any>(null)
const imprChart = ref<apexChartType>({
  options: {
    annotations: {
      xaxis: []
    },
    title: {
      // text: '업무별 개선 현황'
    },
    chart: {
      type: 'bar',
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    dataLabels: {
      enabled: true
    },
    stroke: {
      show: true
    },
    xaxis: {
      categories: [],
      labels: {
        style: { fontSize: '0.8em' }
      }
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 건'
        }
      }
    },
    colors: ['#FFC107', '#00BCD4', '#F44336'],
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 10
    }
  },
  series: [],
  chartWidth: '100%'
})
const kpiChart = ref<apexChartType>({
  options: {
    annotations: {
      xaxis: []
    },
    chart: {
      type: 'line',
      stacked: true
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0 // 점의 크기를 0으로 만들어 숨김
    },
    stroke: {
      show: true
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 건'
        }
      }
    },
    fill: {
      opacity: 1
    }
  },
  series: [],
  chartWidth: '100%'
})
const plantCdImpr = ref<any>(null)
const rate = ref<any>([])
const rateUrl = ref('')
const ibmTaskTypeCdList = ref<any>([])
const actionCompleteRequestDate = ref('')
const interval = ref<any>(null)
const safconUrl = ref('')
const markedRefArray = ref<Array<any>>([])
const carousel = ref<any>(null)
const kpiGetUrl = ref('')
const kpiYear = ref('')
const saiKpiId = ref<stringNull>(null)
const selectedLawCode = ref('SHTC000002')
const selectedLawName = ref('안전보건')

const gridKpi = ref<gridType>({
  columns: [
    {
      name: 'kpi',
      field: 'kpi',
      label: 'KPI',
      style: 'width:24%',
      align: 'left',
      sortable: false
    },
    // {
    //   name: 'definition',
    //   field: 'definition',
    //   label: 'Definition',
    //   type: 'html',
    //   align: 'left',
    //   sortable: false
    // },
    // {
    //   name: 'month1',
    //   field: 'month1',
    //   label: 'Jan',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month2',
    //   field: 'month2',
    //   label: 'Feb',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month3',
    //   field: 'month3',
    //   label: 'Mar',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month4',
    //   field: 'month4',
    //   label: 'Apr',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month5',
    //   field: 'month5',
    //   label: 'May',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month6',
    //   field: 'month6',
    //   label: 'Jun',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month7',
    //   field: 'month7',
    //   label: 'Jul',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month8',
    //   field: 'month8',
    //   label: 'Aug',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month9',
    //   field: 'month9',
    //   label: 'Sep',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month10',
    //   field: 'month10',
    //   label: 'Oct',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month11',
    //   field: 'month11',
    //   label: 'Nov',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    // {
    //   name: 'month12',
    //   field: 'month12',
    //   label: 'Dec',
    //   style: 'width: 3%',
    //   align: 'center',
    //   sortable: false
    // },
    {
      name: 'sum',
      field: 'sum',
      label: 'Total',
      style: 'width: 3%',
      align: 'right',
      sortable: false
    },
    {
      name: 'graph',
      field: 'graph',
      label: 'Previous 12 Months',
      // style: 'width: 3%',
      type: 'custom',
      align: 'right',
      sortable: false
    }
  ],
  data: []
})
/******************************
 * @Computed_선언
 *******************************/
const swpIconItems = computed(() => {
  return [
    {
      icon: 'engineering',
      name: '메인'
    },
    {
      icon: 'local_fire_department',
      name: '화기'
    },
    {
      icon: 'masks',
      name: '밀폐공간'
    },
    {
      icon: 'directions_car',
      name: '차량'
    },
    {
      icon: 'science',
      name: '유해위험물질'
    },
    {
      icon: 'bolt',
      name: '전기'
    },
    {
      icon: 'radar',
      name: '방사선'
    },
    {
      icon: 'forest',
      name: '환경'
    },
    {
      icon: 'stairs',
      name: '고소'
    },
    {
      icon: 'thermostat',
      name: '고온'
    },
    {
      icon: 'forklift',
      name: '중장비/굴착/크레인'
    },
    {
      icon: 'construction',
      name: '기타'
    }
  ]
})

const mapRate = computed(() => {
  return 0.87
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})
// onActivated(() => {
//   getMapData()
// })
onDeactivated(() => {
  // clearInterval(mapObj.value.interval.obj)
  clearInterval(interval.value)
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
  rateUrl.value = selectConfig.main.imprChart.url
  safconUrl.value = selectConfig.main.safcon.url
  kpiGetUrl.value = selectConfig.sai.kpi.get.url
  mapObj.value.url = selectConfig.main.map.url
  mapObj.value.processUrl = selectConfig.main.mapProcess.url
  mapObj.value.envUrl = selectConfig.main.env.url
  // code setting
  kpiYear.value = getThisYear()
  actionCompleteRequestDate.value = getThisYear()
  // kpiYear.value = getThisYear()
  // actionCompleteRequestDate.value = getThisYear()
  selectedLawCode.value = 'SHTC000002'
  selectedLawName.value = '안전보건'
  imprChart.value.series = [
    {
      id: 'actioning',
      name: $language('조치중'),
      data: []
    },
    {
      id: 'complete',
      name: $language('개선완료(총합)'),
      data: []
    },
    {
      id: 'overAction',
      name: $language('지연 건수'),
      data: []
    }
  ]
  // list setting
  getMapData()
  getImprStatus()
  getMapPriodParam()
  getKpi()
}
function getKpi() {
  $http({
    url: kpiGetUrl.value,
    method: 'GET',
    params: { year: kpiYear.value }
  }).then((_result: any) => {
    saiKpiId.value = _result.data.saiKpiId
    gridKpi.value.data = _result.data.results.slice(0, 5).map((row: any) => {
      const monthlyData = [
        row.month1,
        row.month2,
        row.month3,
        row.month4,
        row.month5,
        row.month6,
        row.month7,
        row.month8,
        row.month9,
        row.month10,
        row.month11,
        row.month12
      ]
      return {
        ...row,
        chartOptions: {
          ...kpiChart.value.options,
          chart: {
            type: 'line',
            sparkline: { enabled: true }
          },
          stroke: { width: 3 },
          tooltip: { enabled: true }
        },
        chartSeries: [
          {
            name: row.kpi,
            data: monthlyData
          }
        ]
      }
    })
  })
}
function getMapPriodParam() {
  // 초기 지도 정보를 불러올 때에는 기간 정보가 넘어가지 않게 처리
  $http({
    url: mapObj.value.envUrl,
    method: 'GET'
  }).then((_result: any) => {
    // mapObj.value.taskParam.workPermitPeriod = ['2024-01-01', '2024-12-31']
    mapObj.value.taskParam.workPermitPeriod = [_result.data[0].start, _result.data[0].end]
  })
}
function getMapData(loading?: any) {
  clearInterval(interval.value)
  const defaultPlantCd = window.sessionStorage.getItem('defaultPlantCd')

  $http({
    url: mapObj.value.url,
    method: 'GET',
    params: {
      plantCd: defaultPlantCd,
      workPermitPeriod: mapObj.value.taskParam.workPermitPeriod
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      // 지도는 1개
      _.forEach(_result.data, (item) => {
        mapObj.value.endIdx = 1
        if (item.otherMaps && item.otherMaps.length > 0) {
          _.forEach(item.otherMaps, (map) => {
            map.idx = mapObj.value.endIdx
            mapObj.value.endIdx++
          })
        }
        if (item.maps && item.maps.length > 0) {
          _.forEach(item.maps, (map) => {
            map.idx = mapObj.value.endIdx
            mapObj.value.endIdx++
          })
        }
      })
      mapObj.value.maps = _.cloneDeep(_result.data)
      mapObj.value.orignRatio = mapObj.value.maps[0].ratio

      carousel.value.style.setProperty('--map-ratio', mapObj.value.maps![0].ratio)
      mapObj.value.height = 510
      const resizeRatio = Math.round((mapObj.value.height / 575) * 100) / 100
      const _height = mapObj.value.height * mapRate.value
      carousel.value.style.setProperty('--map-height', String(_height) + 'px')
      mapObj.value.ratio = resizeRatio
      // 로딩바 제거
      if (loading) mapObj.value.loading = false
      let _idx = 0
      const _idx2 = 0
      interval.value = setInterval(() => {
        if (mapObj.value.activeTask === 1) {
          if (markedRefArray.value[_idx - 1]) markedRefArray.value[_idx - 1].hide()
          if (markedRefArray.value[_idx]) {
            if (mapObj.value.maps[0].maps[_idx]) {
              mapObj.value.selectedWorkPermit.workPermits =
                mapObj.value.maps[0].maps[_idx].resultTypes
            }
            markedRefArray.value[_idx].show()
          }
          if (mapObj.value.maps[0].maps.length + 1 == _idx) _idx = 0
          mapObj.value.activeMarked = _idx
          _idx++
        }
      }, 3000)
    }
  })
}
function onMarkedInfo(markedInfo: any) {
  mapObj.value.selectedWorkPermit.workPermits = markedInfo.resultTypes
  mapObj.value.activeMarked = markedInfo.idx
}
function setStepColor(swpStepCd: any) {
  let color = ''
  switch (swpStepCd) {
    case 'SS00000005':
      color = 'light-blue'
      break
    case 'SS00000010':
      color = 'amber'
      break
    case 'SS00000020':
      color = 'light-green'
      break
    default:
      color = 'blue'
  }
  return color
}
function setStepClass(swpStepCd: any) {
  let _class = ''
  switch (swpStepCd) {
    case 'SS00000005':
      _class = 'main-work-permit-card-light-blue'
      break
    case 'SS00000010':
      _class = 'main-work-permit-card-amber'
      break
    case 'SS00000020':
      _class = 'main-work-permit-card-light-green'
      break
  }
  return _class
}
function setTypeIcons(sopWorkTypeCds: any) {
  const icons = [] as any
  const typeArray = sopWorkTypeCds && sopWorkTypeCds.length > 0 ? sopWorkTypeCds.split(',') : []
  if (typeArray && typeArray.length > 0) {
    _.forEach(typeArray, (type) => {
      switch (type) {
        case 'SPT0000001': // 정상
        case 'SPT0000005': // 긴급
        case 'SPT0000010': // 자체
          icons.push('engineering')
          break
        case 'SSWTC00001': // 차량
          icons.push('directions_car')
          break
        case 'SSWTC00101': // 화기
        case 'SSWTC00205': // 화기
          icons.push('local_fire_department')
          break
        case 'SSWTC00201': // 밀폐공간
        case 'SSWTC00202': // 밀폐공간
          icons.push('masks')
          break
        case 'SSWTC00102': // 유해위험물질
        case 'SSWTC00203': // 유해위험물질
          icons.push('science')
          break
        case 'SSWTC00003': // 전기
          icons.push('bolt')
          break
        case 'SSWTC00005': // 방사선
          icons.push('radar')
          break
        case 'SSWTC00006': // 환경
          icons.push('forest')
          break
        case 'SSWTC00104': // 고소
          icons.push('stairs')
          break
        case 'SSWTC00105': // 고온
        case 'SSWTC00206': // 고온
          icons.push('thermostat')
          break
        case 'SSWTC00103': // 중장비
        case 'SSWTC00204': // 굴착
        case 'SSWTC00207': // 크레인
          icons.push('forklift')
          break
        default:
          icons.push('construction')
      }
    })
  }
  return icons
}
function openWorkPermitPop(item: any) {
  if (!item) return
  popupOptions.value.isFull = true
  popupOptions.value.title = '작업허가서 상세'
  popupOptions.value.param = {
    sopWorkPermitId: item.sopWorkPermitId,
    permitTypeCd: item.permitTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/swp/safeWorkPermitDetail14.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePermitPopup
}
function closePermitPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function getImprStatus() {
  let dates = [] as any
  if (actionCompleteRequestDate.value !== null) {
    dates = [actionCompleteRequestDate.value + '-01-01', actionCompleteRequestDate.value + '-12-31']
  }
  $http({
    url: rateUrl.value,
    method: 'GET',
    params: {
      plantCd: plantCdImpr.value,
      actionCompleteRequestDates: dates
    }
  }).then((_result: any) => {
    let taskIdx = 0
    _.forEach(_result.data, (task) => {
      _.forEachRight(imprChart.value.series, (item) => {
        if (!rate.value[taskIdx] && task[item.id] > 0) {
          rate.value[taskIdx] =
            task.requestTotal > 0
              ? String(_.round((task.complete / task.requestTotal) * 100)) + '%'
              : '0%'
        }
      })
      ibmTaskTypeCdList.value.push({
        code: task.ibmTaskTypeCd,
        codeName: task.ibmTaskTypeName
      })
      taskIdx++
    })
    _.forEach(imprChart.value.series, (item) => {
      item.data = _.map(_result.data, item.id)
    })
    const xaxis = _.map(_result.data, 'ibmTaskTypeName')
    const annotations = [] as any
    rate.value.forEach((r: any, idx: any) => {
      // xaxis[idx] += (r ? '(' + r + ')' : '');
      annotations[idx] = {
        x: xaxis[idx],
        strokeDashArray: 0,
        borderColor: '#EEEEEE',
        borderWidth: 0,
        label: {
          borderColor: 'transparent',
          orientation: 'horizontal',
          style: {
            color: '#775DD0',
            fontSize: '12px',
            background: 'transparent'
          },
          text: r ? r : ''
          // text: r ? '이행률 : ' + r : '',
        }
      }
    })
    xaxis.forEach((x, idx) => {
      if (!annotations[idx]) {
        annotations[idx] = {
          x: x,
          strokeDashArray: 0,
          borderColor: '#EEEEEE',
          borderWidth: 0,
          // borderColor: '#775DD0',
          label: {
            borderColor: 'transparent',
            orientation: 'horizontal',
            style: {
              color: '#775DD0',
              fontSize: '12px',
              background: 'transparent'
            },
            text: ''
          }
        }
      }
    })
    imprChartRef.value.updateOptions({
      xaxis: {
        categories: xaxis
      },
      annotations: {
        xaxis: annotations
      }
    })
  })
}
function selectedBarImp(e: any, chart: any, opts: any) {
  let stepGubun = ''
  switch (opts.w.config.series[opts.seriesIndex].name) {
    case '조치중':
      stepGubun = 'actioning'
      break
    case '개선완료(총합)':
      stepGubun = 'complete'
      break
    case '지연 건수':
      stepGubun = 'overAction'
      break
    default:
      break
  }
  popupOptions.value.width = '90%'
  popupOptions.value.isFull = false
  popupOptions.value.title = '개선목록 (업무별 현황)'
  popupOptions.value.param = {
    plantCd: plantCdImpr.value,
    ibmTaskTypeCd: _.filter(ibmTaskTypeCdList.value, {
      codeName: imprChart.value.options.xaxis.categories[opts.dataPointIndex]
    })[0].code,
    actionCompleteRequestDates: [
      actionCompleteRequestDate.value + '-01-01',
      actionCompleteRequestDate.value + '-12-31'
    ],
    stepGubun: stepGubun
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/impr.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function kpiLink() {
  if (saiKpiId.value) {
    popupOptions.value.title = '연간 KPI 상세'
    popupOptions.value.param = { saiKpiId: saiKpiId.value }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sai/kpi/kpiDetail.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closePopup
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.kpi
  table.q-table
    thead th, tbody td
      font-size: 0.86em !important
</style>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
      <!-- <div class="dashboard-sub-title">위험요인 제거 방안 마련</div> -->
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5" style="padding: 0px !important">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">
                  <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
                </span>
                {{ '순회 & 안전관리자점검 진행상황(최근 1년)' }}
              </div>
              <div class="card-body" style="height: auto !important; padding-bottom: 5px">
                <apexcharts
                  ref="inspChart"
                  height="230"
                  :width="inspChartOptions"
                  :options="inspChartOptions.options"
                  :series="inspChartOptions.series"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">
                  <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
                </span>
                {{ '아차사고 발굴 현황(최근 1년)' }}
              </div>
              <div class="card-body" style="height: auto !important; padding-bottom: 3px">
                <component :is="nearComponents" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7" style="padding: 0px !important">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">
                  <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
                </span>
                {{ '작업환경측정 현황(최근)' }}
              </div>
              <div class="card-body" style="height: auto !important; padding-bottom: 5px">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <apexcharts
                      ref="locationMeasureChartRef"
                      height="220"
                      :width="locationMeasureChart"
                      :options="locationMeasureChart.options"
                      :series="locationMeasureChart.series"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <apexcharts
                      ref="measureCheckChartRef"
                      height="220"
                      type="bar"
                      :options="measureCheckChart.options"
                      :series="measureCheckSeries"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">
                  <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
                </span>
                {{ '금년도 유해위험기계기구 안전검사 진행 현황' }}
              </div>
              <div class="card-body safeCheck" style="height: auto !important; padding-bottom: 5px">
                <div class="committee-info">
                  <div class="stats-grid inspection-grid" style="padding: 0">
                    <div class="row">
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="inspection-card target" style="padding: 5px 8px">
                          <div class="inspection-header" style="margin-bottom: 6px">
                            <q-icon name="build" size="xs" color="orange" />
                            <span class="text-orange">검사 대상</span>
                          </div>
                          <div class="inspection-value" style="margin: 4px 0px; font-size: 13px">
                            {{ hazardEquip.targetCount }}건
                            <span class="sub-text" style="font-size: 12px">전체</span>
                          </div>
                          <q-linear-progress size="4px" :value="1" color="orange" class="q-mt-sm" />
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="inspection-card completed" style="padding: 5px 8px">
                          <div class="inspection-header" style="margin-bottom: 6px">
                            <q-icon name="task_alt" size="24px" color="positive" />
                            <span class="text-green">검사 완료</span>
                          </div>
                          <div class="inspection-value" style="margin: 4px 0px; font-size: 13px">
                            {{ hazardEquip.completeCount }}건
                            <span class="sub-text" style="font-size: 12px" />
                          </div>
                          <q-linear-progress
                            size="4px"
                            :value="0.5"
                            color="positive"
                            class="q-mt-sm"
                          />
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="inspection-card upcoming" style="padding: 7px 8px">
                          <div class="inspection-header" style="margin-bottom: 6px">
                            <q-icon name="event" size="24px" color="primary" />
                            <span class="text-primary">검사 예정</span>
                          </div>
                          <div class="inspection-value" style="margin: 4px 0px; font-size: 13px">
                            {{ hazardEquip.expectedCount }}건
                            <span class="sub-text" style="font-size: 12px">30일 이내</span>
                          </div>
                          <q-linear-progress
                            size="4px"
                            :value="0.3"
                            color="primary"
                            class="q-mt-sm"
                          />
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="inspection-card overdue" style="padding: 5px 8px">
                          <div class="inspection-header" style="margin-bottom: 6px">
                            <q-icon name="warning" size="24px" color="negative" />
                            <span class="text-negative">검사 지연</span>
                          </div>
                          <div class="inspection-value" style="margin: 4px 0px; font-size: 13px">
                            {{ hazardEquip.delayCount }}건
                            <span class="sub-text" style="font-size: 12px">조치 필요</span>
                          </div>
                          <q-linear-progress
                            size="4px"
                            :value="0.1"
                            color="negative"
                            class="q-mt-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">
                  <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
                </span>
                {{ '년도별 유소견자 발생 추이분석' }}
              </div>
              <div class="card-body" style="height: auto !important; padding-bottom: 5px">
                <div class="committee-info">
                  <apexcharts
                    ref="diagnosisUserChartRef"
                    height="150"
                    :width="diagnosisUserChart"
                    :options="diagnosisUserChart.options"
                    :series="diagnosisUserChart.series"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <div class="cardcontents evalcard">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '자체감사 현황(최근 1년)' }}
          </div>
          <div class="card-body self" style="height: auto !important">
            <component :is="complianceComponents" />
          </div>
        </div>
      </div>
      <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 chemical-dashboard">
        <div class="cardcontents chemical-card">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '유해화학물질(자재)' }}
          </div>
          <div class="card-body chemical-body" style="height: auto !important">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div class="chemical-stats-container">
                  <div class="stats-grid">
                    <div class="stats-total">
                      <div class="stats-header">규제대상 물질</div>
                      <div class="stats-value">
                        {{
                          chemMaterial.regulCount1 +
                          chemMaterial.regulCount2 +
                          chemMaterial.regulCount3 +
                          chemMaterial.regulCount4
                        }}<span class="unit">건</span>
                      </div>
                      <div class="stats-breakdown">
                        <div class="breakdown-item">
                          <span class="label">화평법:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.regulCount1 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">산안법:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.regulCount2 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">화관법:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.regulCount3 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">위안법:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.regulCount4 }}</span
                            >건</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div class="chemical-stats-container">
                  <div class="stats-grid">
                    <div class="stats-total">
                      <div class="stats-header">제품 분류</div>
                      <div class="stats-value">
                        {{
                          chemMaterial.productCount1 +
                          chemMaterial.productCount2 +
                          chemMaterial.productCount3 +
                          chemMaterial.productCount4 +
                          chemMaterial.productCount5 +
                          chemMaterial.productCount6
                        }}<span class="unit">건</span>
                      </div>
                      <div class="stats-breakdown">
                        <div class="breakdown-item">
                          <span class="label">제조:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.productCount1 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">수입,구매:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{
                              chemMaterial.productCount2 + ',' + chemMaterial.productCount3
                            }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">사용:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.productCount4 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">수출,판매:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{
                              chemMaterial.productCount5 + ',' + chemMaterial.productCount6
                            }}</span
                            >건</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div class="chemical-stats-container">
                  <div class="stats-grid">
                    <div class="stats-total">
                      <div class="stats-header">유해화학물질 포함</div>
                      <div class="stats-value">
                        {{
                          chemMaterial.harmfulnessCount1 +
                          chemMaterial.harmfulnessCount2 +
                          chemMaterial.harmfulnessCount3 +
                          chemMaterial.harmfulnessCount4
                        }}<span class="unit">건</span>
                      </div>
                      <div class="stats-breakdown">
                        <div class="breakdown-item">
                          <span class="label">유독물질:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.harmfulnessCount1 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">허가물질:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.harmfulnessCount2 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">제한물질:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.harmfulnessCount3 }}</span
                            >건</span
                          >
                        </div>
                        <div class="breakdown-item">
                          <span class="label">금지물질:</span>
                          <span class="text-grey-7"
                            ><span class="value">{{ chemMaterial.harmfulnessCount4 }}</span
                            >건</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="stats-facilities-row">
                  <div class="facility-item">
                    <div class="facility-icon">🏭</div>
                    <div class="facility-details">
                      <div class="facility-label">취급시설</div>
                      <div class="facility-value">
                        {{ chemMaterial.handlingFacilityCount }}<span class="unit">건</span>
                      </div>
                    </div>
                  </div>
                  <div class="facility-item">
                    <div class="facility-icon">🏪</div>
                    <div class="facility-details">
                      <div class="facility-label">위험물 저장소</div>
                      <div class="facility-value">
                        {{ chemMaterial.dangerStorageCount }}<span class="unit">건</span>
                      </div>
                    </div>
                  </div>
                  <div class="facility-item">
                    <div class="facility-icon">📑</div>
                    <div class="facility-details">
                      <div class="facility-label">MSDS</div>
                      <div class="facility-value">
                        {{ chemMaterial.msdsCount }}<span class="unit">건</span>
                      </div>
                    </div>
                  </div>
                  <div class="facility-item">
                    <div class="facility-icon">⚖️</div>
                    <div class="facility-details">
                      <div class="facility-label">인허가 대상</div>
                      <div class="facility-value">
                        {{ chemMaterial.licenseCount }}<span class="unit">건</span>
                      </div>
                    </div>
                  </div>
                  <div class="facility-item">
                    <div class="facility-icon">⚠️</div>
                    <div class="facility-details">
                      <div class="facility-label">PSM</div>
                      <div class="facility-value">
                        {{ chemMaterial.psmCount }}<span class="unit">건</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { apexChartType } from '@/types/apexChart'

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
  name: 'identifyRiskFactors'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
interface propType {
  title: string
  commonSearchParam: {
    plantCd: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  title: '',
  commonSearchParam: () => {
    return {
      plantCd: null
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)

const locationMeasureChart = ref<apexChartType>({
  series: [
    {
      name: '가장 높은 노출기준 측정치',
      type: 'column',
      data: []
    },
    {
      name: '개선 건 수',
      type: 'line',
      data: []
    }
  ],
  options: {
    title: {
      text: '공정별 작업환경측정치/개선 분석',
      style: {
        color: '#616161', // 색상
        fontSize: '14px', // 폰트 크기
        fontWeight: 'bold', // 폰트 굵기
        fontFamily: 'Arial', // 폰트 패밀리
        cssClass: 'apexcharts-title' // 커스텀 CSS 클래스
      }
    },
    chart: {
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true
    },
    stroke: {
      width: [0, 5]
    },
    plotOptions: {
      bar: {
        borderRadius: 0 // 🔥 막대 모서리를 직각으로 설정 (기본값 10)
      }
    },
    xaxis: {
      categories: [],
      title: {}
    },
    markers: {
      size: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 10
    }
  }
})

const measureCheckSeries = ref([])
const measureCheckChartRef = ref<any>(null)
const locationMeasureChartRef = ref<any>(null)
const diagnosisUserChartRef = ref<any>(null)
const measureCheckChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    title: {
      text: '측정치값이 초과된 유해인자 현황',
      style: {
        color: '#616161', // 색상
        fontSize: '14px', // 폰트 크기
        fontWeight: 'bold', // 폰트 굵기
        fontFamily: 'Arial', // 폰트 패밀리
        cssClass: 'apexcharts-title' // 커스텀 CSS 클래스
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '70%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
        dataLabels: {
          // orientation: 'vertical',
          position: 'bottom'
        }
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: function (val: number, opts: any) {
        return opts.config.xaxis.categories[opts.dataPointIndex]
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#F1F3F4']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.4,
        gradientToColors: ['#42A5F5'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    colors: ['#1a73e8']
  },
  series: [
    {
      name: '',
      data: [] as any[]
    }
  ]
})

const diagnosisUserChart = ref<apexChartType>({
  series: [
    {
      name: '유소견자',
      data: []
    }
  ],
  options: {
    title: {
      text: '',
      align: 'left'
    },
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#1e90ff'],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: [],
      title: {}
    },
    markers: {
      size: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  }
})
const inspChart = ref<any>(null)
const inspChartOptions = ref<apexChartType>({
  series: [
    {
      name: '순회점검',
      data: []
    },
    {
      name: '안전관리자점검',
      data: []
    }
  ],
  options: {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '65%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: {
      // enabled: true
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월'
      ]
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 10
    }
  },
  chartWidth: '95%'
})
const hazardEquip = ref({
  targetCount: 0,
  completeCount: 0,
  expectedCount: 0,
  delayCount: 0
})
const chemMaterial = ref({
  dangerStorageCount: 0,
  handlingFacilityCount: 0,
  harmfulnessCount1: 0,
  harmfulnessCount2: 0,
  harmfulnessCount3: 0,
  harmfulnessCount4: 0,
  harmfulnessSumCount: 0,
  licenseCount: 0,
  msdsCount: 0,
  productCount1: 0,
  productCount2: 0,
  productCount3: 0,
  productCount4: 0,
  productCount5: 0,
  productCount6: 0,
  productSumCount: 0,
  psmCount: 0,
  regulCount1: 0,
  regulCount2: 0,
  regulCount3: 0,
  regulCount4: 0,
  regulSumCount: 0
})
const workMeasureStatusUrl = ref('')
const patrolSafetyListUrl = ref('')
const hazardEquipSafetyCheckUrl = ref('')
const diagnosisUserStatusUrl = ref('')
const chemMaterialStatusUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const nearComponents = computed(() => {
  const components = defineAsyncComponent(() => import(`./nearAccidentDiscovering.vue`))
  return components
})

const complianceComponents = computed(() => {
  const components = defineAsyncComponent(() => import(`./complianceGraphDashboard.vue`))
  return components
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
  chemMaterialStatusUrl.value = selectConfig.monitor.chemMaterialStatus.url
  workMeasureStatusUrl.value = selectConfig.monitor.workMeasureStatus.url
  patrolSafetyListUrl.value = selectConfig.monitor.patrolSafety.url
  hazardEquipSafetyCheckUrl.value = selectConfig.monitor.hazardEquipSafetyCheck.url
  diagnosisUserStatusUrl.value = selectConfig.monitor.diagnosisUserStatus.url
  // code setting
  // list setting
  getWorkMeasureStatus()
  getPatrolSafetyStatus()
  gethazardEquipStatus()
  getDiagnosUserStatus()
  getChemMaterialStatus()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getChemMaterialStatus() {
  $http({
    url: chemMaterialStatusUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    chemMaterial.value = _result.data
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getDiagnosUserStatus() {
  $http({
    url: diagnosisUserStatusUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    setTimeout(() => {
      diagnosisUserChartRef.value.updateSeries([
        {
          name: '유소견자',
          data: _.map(_result.data, 'userCount')
        }
      ])
      diagnosisUserChartRef.value.updateOptions({
        xaxis: {
          categories: _.map(_result.data, 'diagnosisYear')
        }
      })
    }, 100)
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getWorkMeasureStatus() {
  $http({
    url: workMeasureStatusUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    setTimeout(() => {
      locationMeasureChartRef.value.updateSeries([
        {
          name: '가장 높은 노출기준 측정치',
          type: 'column',
          data: _.map(_result.data.locationMeasureList, 'maxMeasValue')
        },
        {
          name: '개선 건 수',
          type: 'line',
          data: _.map(_result.data.locationMeasureList, 'imprCount')
        }
      ])
      locationMeasureChartRef.value.updateOptions({
        xaxis: {
          categories: _.map(_result.data.locationMeasureList, 'locationName')
        }
      })
      const items = _result.data.hazardMeasureList.map((item: any) => ({
        x: item.hazardName,
        y: item.maxMeasValue,
        goals: [
          {
            name: '노출기준',
            value: item.maxExposureStandard,
            strokeLineCap: 'round',
            strokeHeight: 11,
            strokeWidth: 4,
            strokeColor: '#FFD94D'
          }
        ]
      }))
      measureCheckChartRef.value.updateSeries([
        {
          name: '측정치',
          data: items
        }
      ])
      measureCheckChartRef.value.updateOptions({
        xaxis: {
          categories: _.map(_result.data.hazardMeasureList, 'hazardName')
        }
      })
    }, 100)
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getPatrolSafetyStatus() {
  $http({
    url: patrolSafetyListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    const patrolMonthData: any = new Array(12).fill(0)
    _.forEach(_result.data.patrolList, (_item) => {
      _result.data.patrolList.forEach((patrol: any) => {
        const monthIndex = parseInt(patrol.month) - 1
        patrolMonthData[monthIndex] = patrol.patrolCount
      })
    })
    const safetyMonthData: any = new Array(12).fill(0)
    _.forEach(_result.data.safetyList, (_item) => {
      _result.data.safetyList.forEach((safety: any) => {
        const monthIndex = parseInt(safety.month) - 1
        safetyMonthData[monthIndex] = safety.safetyCount
      })
    })
    inspChart.value.updateSeries([
      {
        name: '순회점검',
        data: patrolMonthData
      },
      {
        name: '안전관리자점검',
        data: safetyMonthData
      }
    ])
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function gethazardEquipStatus() {
  $http({
    url: hazardEquipSafetyCheckUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    hazardEquip.value = _result.data
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style scoped>
.chemical-stats-container {
  padding: 0;
  background: #fff;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  gap: 16px;
  padding: 4px;
}

.stats-breakdown {
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.label {
  color: #666;
  font-weight: 500;
}
.stats-facilities {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.facility-details {
  flex: 1;
}

.facility-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a73e8;
}
.chemical-dashboard {
  padding: 1rem;
}

.chemical-card {
  background: linear-gradient(145deg, #ffffff, #f6f9fc);
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stats-total {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  padding: 8px 16px;
  border-radius: 8px;
}

.stats-header {
  color: #2c3e50;
  font-size: 0.85rem;
  margin-bottom: 8px;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7eaf3;
  font-weight: 600;
  text-align: center;
  background-color: #f1f8ff; /* 배경색 강조 */
}

.stats-value {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(45deg, #1a73e8, #34a853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  color: #1a73e8;
}

.breakdown-item {
  background: white;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  justify-content: space-between;
  align-items: center;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  span.text-grey-7 {
    color: #9e9e9e !important;
  }
}
.label {
  color: #5f6368;
  font-size: 0.8rem;
  font-weight: 600;
}

.value {
  color: #1a73e8;
  font-weight: 600;
  font-size: 0.8rem;
  margin-right: 5px;
}

.facility-icon {
  font-size: 2rem;
  margin-right: 1.25rem;
  opacity: 0.9;
}

.facility-label {
  font-size: 0.8rem;
  color: #5f6368;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 600;
  background-color: #f0f4ff; /* 배경색 강조 */
}

.facility-value {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  color: #1a73e8;
}

.unit {
  font-size: 0.85rem;
  color: #5f6368;
  margin-left: 0.5rem;
  font-weight: normal;
}

@media (max-width: 768px) {
  .chemical-dashboard {
    padding: 0.5rem;
  }

  .chemical-body {
    padding: 1rem !important;
  }

  .stats-value {
    font-size: 2rem;
  }

  .facility-item {
    padding: 1rem;
  }
}

.chemical-stats-container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chemical-stats-container:not(:last-child) {
  border-bottom: 1px solid #e7eaf3;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.stats-facilities-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.facility-item {
  flex: 1;
  min-width: 120px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.facility-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-facilities-row::-webkit-scrollbar {
  height: 4px;
}

.stats-facilities-row::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.stats-facilities-row::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>

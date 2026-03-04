<template>
  <div class="dashboard-container risk">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <div class="cardcontents risk">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('순회 & 안전점검 진행현황') }}
            <div style="display: inline-block; float: right; font-size: 0.8rem; color: #3f3f3f">
              <q-icon name="circle" color="lightgreen" />
              {{ $language('완료') }}
              <q-icon name="circle" color="lightblue" />
              {{ $language('진행중') }}
              <q-icon name="circle" color="grey" />
              {{ $language('진행X') }}
            </div>
          </div>
          <div class="card-body row" style="height: auto !important">
            <div
              v-for="(deptCheck, deptCheckIdx) in deptChecks"
              :key="deptCheck.deptName"
              class="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4"
              style="
                text-align: center;
                padding: 7px !important;
                margin: 4px 0 !important;
                border: 1px solid rgba(26, 54, 126, 0.125);
              "
              :style="{
                'border-left':
                  (deptCheckIdx + 1) % 3 === 2 ? '1px solid rgba(26, 54, 126, 0.125)' : 'none',
                'border-right':
                  (deptCheckIdx + 1) % 3 === 2 ? '1px solid rgba(26, 54, 126, 0.125)' : 'none'
              }"
            >
              <div style="font-weight: bold; font-size: 0.85rem">{{ deptCheck.deptName }}</div>
              <q-separator />
              <div class="row" style="font-size: 0.8rem">
                <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                  <q-icon
                    name="circle"
                    size="1rem"
                    :color="
                      deptCheck.patrol === 'Y'
                        ? 'lightgreen'
                        : deptCheck.patrol === 'N'
                          ? 'lightblue'
                          : 'grey'
                    "
                  />
                  순회
                </div>
                <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                  <q-icon
                    name="circle"
                    size="1rem"
                    :color="
                      deptCheck.safetyCheck === 'Y'
                        ? 'lightgreen'
                        : deptCheck.safetyCheck === 'N'
                          ? 'lightblue'
                          : 'grey'
                    "
                  />
                  안전점검
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <q-list class="checkImprList">
                    <q-item v-ripple style="min-height: 10px; margin-bottom: 4px">
                      <q-item-section>
                        <q-item-label style="color: #1b1b1b">도출된 개선 건 수 :</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <ICountUp
                          style="font-size: 0.9rem; font-weight: bold; color: #1b1b1b"
                          :startVal="0"
                          :endVal="deptCheck.impr.imprTotal"
                          :decimals="0"
                          :duration="4"
                          :options="{
                            useEasing: true,
                            useGrouping: true,
                            separator: ',',
                            decimal: '.',
                            prefix: '',
                            suffix: '건'
                          }"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple style="min-height: 10px">
                      <q-item-section>
                        <q-linear-progress
                          size="15px"
                          :value="deptCheck.impr.imprComplete / deptCheck.impr.imprTotal"
                          color="green"
                        >
                          <div class="absolute-full flex flex-center">
                            <q-badge
                              style="
                                background-color: transparent !important;
                                padding: 0 !important;
                              "
                              text-color="black"
                              :label="
                                Math.round(
                                  (deptCheck.impr.imprComplete / deptCheck.impr.imprTotal) * 100
                                ) + '%'
                              "
                            />
                          </div>
                        </q-linear-progress>
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 16px;
                            margin-top: 4px;
                            color: #1b1b1b;
                          "
                        >
                          <div>
                            <span>진행 : </span
                            ><span style="color: #42a5f5">{{ deptCheck.impr.imprIng }}</span>
                          </div>
                          <div>
                            <span>지연 : </span
                            ><span style="color: #ff7f50">{{ deptCheck.impr.imprDelay }}</span>
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('2025년 공정사고 / 아차사고 현황') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
              <!-- 추이분석 -->
              <apexcharts
                ref="nearAccidentChartRef"
                height="140"
                type="line"
                :options="accidentChart.options"
                :series="nearAccidentSeries"
              />
              <apexcharts
                ref="accidentImprCostChartRef"
                height="140"
                type="line"
                :options="accidentChart.options"
                :series="accidentImprCostSeries"
              />
              <apexcharts
                ref="accidentImprChartRef"
                height="140"
                type="line"
                :options="accidentChart.options"
                :series="accidentImprSeries"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
              <!-- 사고 circle -->
              <!-- <apexcharts
                ref="accidentWeatherChartRef"
                height="140"
                type="bar"
                :options="accidentBarChart.options"
                :series="accidentWeatherSeries"
              /> -->
              <apexcharts
                ref="accidentCountChartRef"
                height="140"
                type="bar"
                :options="accidentBarChart.options"
                :series="accidentCountSeries"
              />
              <apexcharts
                ref="accidentGradeChartRef"
                height="140"
                type="bar"
                :options="accidentBarChart.options"
                :series="accidentGradeSeries"
              />
              <apexcharts
                ref="accidentCauseChartRef"
                height="140"
                type="bar"
                :options="accidentBarChart.options"
                :series="accidentCauseSeries"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <div class="cardcontents q-mt-sm" style="margin-top: 0px !important">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('유해위험기계기구 현황') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <!-- <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"> -->
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <apexcharts
                ref="hazardEquipChartRef"
                height="320"
                type="bar"
                :options="hazardEquipChart.options"
                :series="hazardEquipChart.series"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <div class="cardcontents q-mt-sm" style="margin-top: 0px !important">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('유해인자 현황') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <apexcharts
                ref="measureCheckChartRef"
                height="320"
                type="bar"
                :options="measureCheckChart.options"
                :series="measureCheckSeries"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <apexcharts
                ref="checkupChartRef"
                height="320"
                type="radialBar"
                :options="checkupCricleChart.options"
                :series="checkupCricleChart.series"
              />
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
import {
  getCheckData,
  getAccidentData,
  getHazardEquipData,
  getHazardMeasureData,
  getHazardCheckupData
} from './riskFactorGuidanceData'
import ICountUp from 'vue-countup-v3'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskFactorGuidance'
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
interface propType {
  title: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  title: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const deptChecks = ref<Array<any>>([])
const nearAccidentChartRef = ref<any>(null)
const accidentImprCostChartRef = ref<any>(null)
const accidentImprChartRef = ref<any>(null)
const nearAccidentSeries = ref([
  {
    name: '2024년',
    type: 'area',
    data: [] as any[]
  },
  {
    name: '2025년',
    type: 'line',
    data: [] as any[]
  }
])
const accidentImprCostSeries = ref([
  {
    name: '2024년',
    type: 'area',
    data: [] as any[]
  },
  {
    name: '2025년',
    type: 'line',
    data: [] as any[]
  }
])
const accidentImprSeries = ref([
  {
    name: '2024년',
    type: 'area',
    data: [] as any[]
  },
  {
    name: '2025년',
    type: 'line',
    data: [] as any[]
  }
])
const accidentChart = ref<apexChartType>({
  options: {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [2, 3]
    },
    fill: {
      opacity: [0.5, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    markers: {
      size: 0
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  },
  series: [
    {
      name: '건 수',
      data: [] as any[]
    }
  ]
})
// const accidentWeatherChartRef = ref<any>(null)
const accidentCountChartRef = ref<any>(null)
const accidentGradeChartRef = ref<any>(null)
const accidentCauseChartRef = ref<any>(null)
// const accidentWeatherSeries = ref([])
const accidentCountSeries = ref([])
const accidentGradeSeries = ref([])
const accidentCauseSeries = ref([])
const accidentBarChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top' // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758']
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
    fill: {
      opacity: 1
    },
    colors: ['#42A5F5', '#00e396'],
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' 건'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  },
  series: [
    {
      name: '건 수',
      data: [] as any[]
    }
  ]
})
const hazardEquipChartRef = ref<any>(null)
const hazardEquipChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '100%',
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
      formatter: function (val: number, opts: any) {
        return val + '건, ' + opts.config.xaxis.categories[opts.dataPointIndex]
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#1B1B1B']
      }
    },
    // stroke: {
    //   show: true,
    //   width: 1,
    //   colors: ['transparent']
    // },
    xaxis: {
      // labels: {
      //   show: false,
      //   rotate: -90
      // },
      categories: [
        '이동식 크레인',
        '천장주행 및 갠트리크레인, 호이스트',
        '산업용로봇',
        '컨베이어',
        '건설작업용 리프트',
        '기계식 프레스,전단기',
        '압력용기',
        '곤돌라',
        '국소배기장치',
        '원심기',
        '화학설비',
        '건조설비',
        '롤러기',
        '사출성형기',
        '고소작업대',
        '액압식 프레스,전단기',
        '지브형 크레인',
        '일반작업용 리프트',
        '이삿짐운반용 리프트',
        '산업용 리프트'
      ]
    },
    yaxis: {
      title: {
        text: '유해위험기계기구 유형'
      },
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
    colors: ['#80D6FF']
  },
  series: [
    {
      name: '',
      data: [] as any[]
    }
  ]
})
const measureCheckChartRef = ref<any>(null)
// const measureCheckDeptChartRef = ref<any>(null)
const measureCheckSeries = ref([])
// const measureCheckDeptSeries = ref([])
const measureCheckChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
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
        return val + '건, ' + opts.config.xaxis.categories[opts.dataPointIndex]
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#1B1B1B']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      // labels: {
      //   show: false,
      //   rotate: -90
      // },

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
    colors: ['#80D6FF']
  },
  series: [
    {
      name: '',
      data: [] as any[]
    }
  ]
})
const checkupChartRef = ref<any>(null)
// const checkupDeptChartRef = ref<any>(null)
const checkupCricleChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '20%',
          background: 'transparent',
          image: undefined
        },
        dataLabels: {
          name: {
            show: true
          },
          value: {
            show: true,
            fontSize: '18px',
            fontWeight: 600,
            offsetY: 5
          },
          total: {
            show: true,
            fontSize: '16px',

            label: '유소견자',
            formatter: function (w: any) {
              return _.sum(_.takeRight(_.dropRight(w.config.series, 2), 6)) + '%'
            }
          }
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8, // 텍스트를 오른쪽으로 이동하여 간격 조정
          fontSize: '12px',
          formatter: function (seriesName: string, opts: any) {
            return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex]
          }
        }
      }
    },
    colors: [
      '#85A947',
      '#3E7B27',
      '#0084ff',
      '#39539E',
      '#0077B5',
      '#EB5A3C',
      '#DF9755',
      '#E7D283',
      '#997C70',
      '#685752'
    ],
    labels: ['A', 'B', 'C1', 'C2', 'CN', 'D1', 'D2', 'DN', 'R', 'U'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }
    ]
  },
  series: [
    {
      name: '',
      data: [] as any[]
    }
  ]
})
// const checkupChart = ref<apexChartType>({
//   options: {
//     chart: {
//       type: 'bar',
//       toolbar: {
//         show: false
//       }
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '55%',
//         borderRadius: 5,
//         borderRadiusApplication: 'end',
//         dataLabels: {
//           // orientation: 'vertical',
//           position: 'bottom'
//         }
//       }
//     },
//     dataLabels: {
//       enabled: true
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent']
//     },
//     xaxis: {
//       labels: {
//         rotate: -90
//       },
//       categories: []
//     },
//     yaxis: {
//       title: {
//         text: '개수'
//       }
//     },
//     fill: {
//       opacity: 1
//     }
//   },
//   series: [
//     {
//       name: '',
//       data: [] as any[]
//     }
//   ]
// })

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
  // code setting
  // list setting
  getDeptChecks()
  getAccidents()
  getHazardEquips()
  getHazardMeasures()
  getHazardCheckup()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getDeptChecks() {
  deptChecks.value = getCheckData()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getAccidents() {
  const accidentChartData = getAccidentData()
  setTimeout(() => {
    nearAccidentChartRef.value.updateSeries([
      {
        name: '2024년',
        type: 'area',
        data: accidentChartData.nearAccident.post
      },
      {
        name: '2025년',
        type: 'line',
        data: accidentChartData.nearAccident.current
      }
    ])
    accidentImprCostChartRef.value.updateSeries([
      {
        name: '2024년',
        type: 'area',
        data: accidentChartData.accidentImprCost.post
      },
      {
        name: '2025년',
        type: 'line',
        data: accidentChartData.accidentImprCost.current
      }
    ])
    accidentImprChartRef.value.updateSeries([
      {
        name: '2024년',
        type: 'area',
        data: accidentChartData.accidentImpr.post
      },
      {
        name: '2025년',
        type: 'line',
        data: accidentChartData.accidentImpr.current
      }
    ])
    nearAccidentChartRef.value.updateOptions({
      title: {
        text: '작년대비 아차사고  건 수'
      }
    })
    accidentImprCostChartRef.value.updateOptions({
      title: {
        text: '작년대비 예방대책 개선비용 (백만원 단위)'
      }
    })
    accidentImprChartRef.value.updateOptions({
      title: {
        text: '작년대비 예방대책 개선 도출 건 수'
      }
    })

    // accidentWeatherChartRef.value.updateSeries(accidentChartData.bar.weather)
    accidentCountChartRef.value.updateSeries(accidentChartData.bar.count)
    accidentGradeChartRef.value.updateSeries(accidentChartData.bar.grade)
    accidentCauseChartRef.value.updateSeries(accidentChartData.bar.cause)
    // accidentWeatherChartRef.value.updateOptions({
    //   title: {
    //     text: '날씨'
    //   },
    //   xaxis: {
    //     categories: ['맑음', '흐림', '비', '눈']
    //   }
    // })
    accidentCountChartRef.value.updateOptions({
      title: {
        text: '공정사고 연간 발생 건 수'
      },
      xaxis: {
        categories: ['2022년', '2023년', '2024년', '2025년']
      }
    })
    accidentGradeChartRef.value.updateOptions({
      title: {
        text: '위험도'
      },
      xaxis: {
        categories: ['A등급', 'B등급', 'C등급']
      }
    })
    accidentCauseChartRef.value.updateOptions({
      title: {
        text: '사고원인'
      },
      xaxis: {
        categories: [
          '기타',
          '감전',
          '폭발',
          '화재',
          '떨어짐',
          '넘어짐',
          '깔림',
          '부딪힘',
          '맞음',
          '무너짐'
        ]
      }
    })
  }, 100)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getHazardEquips() {
  const hazardEquipData = getHazardEquipData()
  setTimeout(() => {
    // const annotations = Array.from({ length: 20 }, (_, idx) => {
    //   return {
    //     y: hazardEquipChartRef.value.options.xaxis.categories[idx],
    //     // y2: hazardEquipChartRef.value.options.xaxis.categories[idx + 1],
    //     strokeDashArray: 0,
    //     borderColor: '#EEEEEE',
    //     borderWidth: 0,
    //     // offsetY: 5,
    //     label: {
    //       borderColor: 'transparent',
    //       orientation: 'horizontal',
    //       // offsetY: 15,
    //       // offsetY: 15,
    //       style: {
    //         color: '#775DD0',
    //         fontSize: '15px',
    //         background: 'transparent'
    //       },
    //       text: hazardEquipData[0].data[idx]
    //     }
    //   }
    // })
    hazardEquipChartRef.value.updateSeries(hazardEquipData)
    // hazardEquipChartRef.value.updateOptions({
    //   annotations: {
    //     yaxis: annotations
    //   }
    // })
  }, 100)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getHazardMeasures() {
  const hazardMeasureChartData = getHazardMeasureData()
  setTimeout(() => {
    measureCheckChartRef.value.updateSeries(hazardMeasureChartData.measures)
    // measureCheckDeptChartRef.value.updateSeries(hazardMeasureChartData.measureDepts)
    measureCheckChartRef.value.updateOptions({
      title: {
        text: '측정치값이 초과된 유해인자 현황'
      },
      xaxis: {
        categories: [
          'o-톨리딘[119-93-7] 및 그 염(o-Tolidine and its salts)',
          '황화니켈류(Nickel sulfides; 12035-72-2, 16812-54-7)',
          '석영(Quartz; 14808-60-7 등)',
          '크리스토발라이트(Cristobalite; 14464-46-1)',
          '트리디마이트(Trydimite; 15468-32-3)',
          '고열',
          '소음',
          '유기화합물 물질을 용량비율 1퍼센트 이상 ',
          '금속류 규정에 따른 물질을 중량비율 1퍼센트 이상 함유한 혼합물',
          '산 및 알칼리류 물질들을 중량비율 1퍼센트 이상 함유한 혼합물'
        ]
      }
    })
    // measureCheckDeptChartRef.value.updateOptions({
    //   title: {
    //     text: '초과된 유해인자가 많이 발생한 부서 현황'
    //   },
    //   xaxis: {
    //     categories: ['생산팀 B', '생산팀 C', '기술팀 B']
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false
    //     }
    //   },
    //   dataLabels: {
    //     formatter: function (val: number) {
    //       return val
    //     },
    //     style: {
    //       fontSize: '13px',
    //       fontWeight: 'bold',
    //       colors: ['#ffffff']
    //     }
    //   }
    // })
  }, 100)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getHazardCheckup() {
  const hazardCheckupChartData = getHazardCheckupData()
  setTimeout(() => {
    checkupChartRef.value.updateSeries(hazardCheckupChartData.circle)
    // checkupDeptChartRef.value.updateSeries(hazardCheckupChartData.bar)
    checkupChartRef.value.updateOptions({
      title: {
        text: '건강구분별 인원 현황'
      }
    })
    // checkupDeptChartRef.value.updateOptions({
    //   title: {
    //     text: '부서별 유소견자 현황'
    //   },
    //   xaxis: {
    //     categories: ['생산팀 B', '생산팀 C', '기술팀 B']
    //   }
    // })
  }, 100)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.checkImprList {
  color: #666;
  font-weight: bold;
  .q-item {
    padding: 0 !important;
  }
  .q-item__section--side {
    padding: 0 !important;
    justify-content: center;
  }
}
</style>

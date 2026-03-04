<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
      <div class="dashboard-sub-title">2025년도 안전보건 경영방침 (게시일: 2025-01-02)</div>
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents card-auto-height evalcard" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('안전보건 목표 실적') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
              <apexcharts
                ref="lawChartRef"
                class="lawChart"
                height="180"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartTotalSeries"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4" style="text-align: center">
              <div style="font-size: 1.5rem; color: #1b1b1b">전체 달성율</div>
              <ICountUp
                class="totcount"
                :startVal="0"
                :endVal="lawRate"
                :decimals="0"
                :duration="4"
                :options="{
                  useEasing: true,
                  useGrouping: true,
                  separator: ',',
                  decimal: '.',
                  prefix: '',
                  suffix: '%'
                }"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData1Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData1Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData2Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData2Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData3Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData3Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData4Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData4Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData5Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData5Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData6Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData6Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData7Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData7Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData8Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData8Series"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <apexcharts
                ref="lawChartData9Ref"
                class="lawChart"
                height="150"
                type="line"
                :width="lawChart.chartWidth"
                :options="lawChart.options"
                :series="lawChartData9Series"
              />
            </div>
          </div>
        </div>
        <div class="cardcontents card-auto-height">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('조직관리') }}
          </div>
          <div class="card-body" style="height: auto !important; padding: 5px">
            <div class="row">
              <div
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                style="text-align: center"
              >
                <div style="font-weight: bold; font-size: 0.95rem">안전보건관리담당자</div>
                <div style="font-size: 0.85rem">안전보건팀 홍길동</div>
                <div style="font-size: 0.8rem">
                  <q-icon name="call" color="blue" /> 010-0000-0000
                </div>
                <div style="font-size: 0.8rem">
                  <q-icon name="mail_outline" color="blue" /> honggd@andami.co.kr
                </div>
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                style="text-align: center"
              >
                <div style="font-weight: bold; font-size: 0.95rem">안전관리자</div>
                <div style="font-size: 0.85rem">안전보건팀 김안전</div>
                <div style="font-size: 0.8rem">
                  <q-icon name="call" color="blue" /> 010-0000-0000
                </div>
                <div style="font-size: 0.8rem">
                  <q-icon name="mail_outline" color="blue" /> safety@andami.co.kr
                </div>
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                style="text-align: center"
              >
                <div style="font-weight: bold; font-size: 0.95rem">관리감독자</div>
                <div style="font-size: 0.85rem">생산팀 이관리</div>
                <div style="font-size: 0.8rem">
                  <q-icon name="call" color="blue" /> 010-0000-0000
                </div>
                <div style="font-size: 0.8rem">
                  <q-icon name="mail_outline" color="blue" /> manage@andami.co.kr
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents card-auto-height">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('2025년 예산편성') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div
              v-for="(budgetYear, idx) in budgetYears"
              :key="idx"
              :class="
                ['교육', '기타'].indexOf(budgetYear.budgetTypeName) === -1
                  ? 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12'
                  : 'col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
              "
            >
              <q-toolbar class="toolbar-title" style="min-height: 15px; font-size: 0.8rem">
                <q-toolbar-title>{{ budgetYear.budgetTypeName }}</q-toolbar-title>
              </q-toolbar>
              <q-list bordered class="row">
                <q-item
                  v-for="budgetItem in budgetYear.budgetItems"
                  :key="budgetItem.budgetItemName"
                  :class="
                    ['교육', '기타'].indexOf(budgetYear.budgetTypeName) > -1
                      ? 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12'
                      : 'col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
                  "
                  clickable
                  v-ripple
                  style="height: 105px"
                >
                  <q-item-section>
                    <q-item-label style="font-weight: bold">{{
                      budgetItem.budgetItemName
                    }}</q-item-label>
                    <q-item-label caption lines="1">
                      <template v-if="budgetItem.isNew">
                        <q-badge color="orange"> New </q-badge>
                      </template>
                      <template v-else-if="budgetItem.comparedToLastYear < 0">
                        작년대비
                        <span class="text-red-10" style="font-weight: bold"
                          >{{ budgetItem.comparedToLastYear }} 만원</span
                        >
                        <q-icon name="arrow_downward" color="red-10" />
                      </template>
                      <template v-else-if="budgetItem.comparedToLastYear > 0">
                        작년대비
                        <span class="text-green-10" style="font-weight: bold"
                          >+ {{ budgetItem.comparedToLastYear }} 만원</span
                        >
                        <q-icon name="arrow_upward" color="green-10" />
                      </template>
                    </q-item-label>
                    <div
                      style="
                        display: grid;
                        align-items: center;
                        word-break: break-all;
                        grid-template-columns: 30px 1fr;
                        gap: 16px;
                      "
                    >
                      실적
                      <ICountUp
                        style="
                          font-size: 0.9rem;
                          font-weight: bold;
                          color: #1b1b1b;
                          display: inline-block;
                        "
                        :startVal="0"
                        :endVal="budgetItem.budgetActionAmt"
                        :decimals="0"
                        :duration="4"
                        :options="{
                          useEasing: true,
                          useGrouping: true,
                          separator: ',',
                          decimal: '.',
                          prefix: '',
                          suffix: '만원'
                        }"
                      />
                    </div>
                    <div
                      style="
                        display: grid;
                        align-items: center;
                        word-break: break-all;
                        grid-template-columns: 30px 1fr;
                        gap: 16px;
                      "
                    >
                      예산
                      <ICountUp
                        style="
                          font-size: 0.9rem;
                          font-weight: bold;
                          color: #1b1b1b;
                          display: inline-block;
                        "
                        :startVal="0"
                        :endVal="budgetItem.budgetPlanAmt"
                        :decimals="0"
                        :duration="4"
                        :options="{
                          useEasing: true,
                          useGrouping: true,
                          separator: ',',
                          decimal: '.',
                          prefix: '',
                          suffix: '만원'
                        }"
                      />
                    </div>
                  </q-item-section>

                  <q-item-section side>
                    <apexcharts
                      height="100"
                      type="radialBar"
                      class="budgetItemCircleChart"
                      :options="{
                        chart: {
                          height: 100,
                          type: 'radialBar'
                        },
                        plotOptions: {
                          radialBar: {
                            hollow: {
                              size: '50%'
                            },
                            dataLabels: {
                              name: {
                                show: false
                              },
                              value: {
                                offsetY: 5,
                                fontSize: '18px'
                              }
                            }
                          }
                        },
                        labels: ['']
                      }"
                      :series="[
                        Math.round((budgetItem.budgetActionAmt / budgetItem.budgetPlanAmt) * 100)
                      ]"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
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
import ICountUp from 'vue-countup-v3'
import { getLawChartData, getBudgetYearData } from './managementLeadershipData'
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'managementLeadership'
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
const lawChartRef = ref<any>(null)
const lawChartTotalSeries = ref([])
const lawChartData1Ref = ref<any>(null)
const lawChartData2Ref = ref<any>(null)
const lawChartData3Ref = ref<any>(null)
const lawChartData4Ref = ref<any>(null)
const lawChartData5Ref = ref<any>(null)
const lawChartData6Ref = ref<any>(null)
const lawChartData7Ref = ref<any>(null)
const lawChartData8Ref = ref<any>(null)
const lawChartData9Ref = ref<any>(null)
const lawChartData1Series = ref([])
const lawChartData2Series = ref([])
const lawChartData3Series = ref([])
const lawChartData4Series = ref([])
const lawChartData5Series = ref([])
const lawChartData6Series = ref([])
const lawChartData7Series = ref([])
const lawChartData8Series = ref([])
const lawChartData9Series = ref([])
const lawRate = ref(0)
const lawChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'line',
      height: 200,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'straight'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
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
    }
  },
  series: [
    {
      name: '건 수',
      data: [] as any[]
    }
  ],
  chartWidth: '100%'
})
const budgetYears = ref<any>([])

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
  getLawCharts()
  getBudgetYears()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getLawCharts() {
  const lawChartData = getLawChartData()
  lawRate.value = lawChartData.rate
  setTimeout(() => {
    lawChartRef.value.updateSeries([lawChartData.total])
    lawChartData1Ref.value.updateSeries([lawChartData.data1])
    lawChartData2Ref.value.updateSeries([lawChartData.data2])
    lawChartData3Ref.value.updateSeries([lawChartData.data3])
    lawChartData4Ref.value.updateSeries([lawChartData.data4])
    lawChartData5Ref.value.updateSeries([lawChartData.data5])
    lawChartData6Ref.value.updateSeries([lawChartData.data6])
    lawChartData7Ref.value.updateSeries([lawChartData.data7])
    lawChartData8Ref.value.updateSeries([lawChartData.data8])
    lawChartData9Ref.value.updateSeries([lawChartData.data9])

    lawChartRef.value.updateOptions({
      title: {
        text: lawChartData.total.name
      }
    })
    lawChartData1Ref.value.updateOptions({
      title: {
        text: lawChartData.data1.name
      }
    })
    lawChartData2Ref.value.updateOptions({
      title: {
        text: lawChartData.data2.name
      }
    })
    lawChartData3Ref.value.updateOptions({
      title: {
        text: lawChartData.data3.name
      }
    })
    lawChartData4Ref.value.updateOptions({
      title: {
        text: lawChartData.data4.name
      }
    })
    lawChartData5Ref.value.updateOptions({
      title: {
        text: lawChartData.data5.name
      }
    })
    lawChartData6Ref.value.updateOptions({
      title: {
        text: lawChartData.data6.name
      }
    })
    lawChartData7Ref.value.updateOptions({
      title: {
        text: lawChartData.data7.name
      }
    })
    lawChartData8Ref.value.updateOptions({
      title: {
        text: lawChartData.data8.name
      }
    })
    lawChartData9Ref.value.updateOptions({
      title: {
        text: lawChartData.data9.name
      }
    })
  }, 300)
}
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function getBudgetYearCharts() {
//   getBudgetYearChartData().then((chartData: any) => {
//     budgetYearChartRef.value.updateSeries(chartData.series)
//     budgetYearChartRef.value.updateOptions({
//       xaxis: {
//         categories: chartData.xaxisCategories
//       }
//     })
//   })
// }
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getBudgetYears() {
  getBudgetYearData().then((data: any) => {
    budgetYears.value = data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

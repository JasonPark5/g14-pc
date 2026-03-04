<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
      <div class="dashboard-sub-title">2025년도 안전보건 경영방침 (게시일: 2025-01-02)</div>
    </div>
    <div class="row maindashboard-director" style="align-items: stretch">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents card-auto-height evalcard" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('중대산업재해 의무 이행평가') }}
            <div
              style="
                display: flex;
                float: right;
                font-size: 0.9rem;
                color: #3f3f3f;
                align-items: center;
                gap: 8px;
              "
            >
              <div>
                <!-- <c-svg-icon name="smile" /> -->
                <q-icon name="check_circle_outline" color="green" />
                {{ $language('양호 (전체 만족)') }}
              </div>
              <div>
                <q-icon name="error_outline" color="orange" />
                {{ $language('부족 (1 ~ 2건 불만족)') }}
              </div>
              <div>
                <q-icon name="highlight_off" color="red" />
                {{ $language('위험 (3건 이하 불만족)') }}
              </div>
            </div>
          </div>
          <div class="card-body" style="height: auto !important; overflow: unset">
            <div
              style="
                display: grid;
                align-items: center;
                justify-content: center;
                grid-template-columns: 1fr 33.333%;
              "
            >
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <apexcharts
                  ref="evalKeyElementChartRef"
                  class="evalKeyElementChart"
                  height="200"
                  type="bar"
                  :options="evalKeyElementChart.options"
                  :series="evalKeyElementChart.series"
                />
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                style="text-align: center"
              >
                <q-list>
                  <q-item
                    v-for="evalKeyElement in evalKeyElements.filter(
                      (item: any) => item.key === '7. 평가 및 개선'
                    )"
                    :key="evalKeyElement.key"
                    clickable
                    v-ripple
                    style="padding: 0px"
                  >
                    <q-item-section>
                      <q-item-label style="border: 1px solid rgba(0, 0, 0, 0.12)">
                        <q-toolbar class="toolbar-title2">
                          <q-toolbar-title>{{ evalKeyElement.key }}</q-toolbar-title>
                        </q-toolbar>
                        <div style="display: grid; grid-template-columns: 110px 1fr">
                          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                            <c-swt-icon
                              nomargin
                              :type="evalKeyElement.data.icon"
                              style="position: relative; height: 120px"
                            />
                          </div>
                          <div
                            class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5"
                            style="margin: auto"
                          >
                            <ICountUp
                              style="
                                font-size: 1.8rem;
                                font-weight: bold;
                                color: #1b1b1b;
                                display: inline-block;
                              "
                              :startVal="0"
                              :endVal="evalKeyElement.data.value"
                              :decimals="0"
                              :duration="4"
                              :options="{
                                useEasing: true,
                                useGrouping: true,
                                separator: ',',
                                decimal: '.',
                                prefix: '',
                                suffix: ' / 11'
                              }"
                            />
                          </div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
              style="padding: 0px !important"
            >
              <q-list class="row">
                <q-item
                  v-for="evalKeyElement in evalKeyElements.filter(
                    (item: any) => item.key !== '7. 평가 및 개선'
                  )"
                  :key="evalKeyElement.key"
                  class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                  clickable
                  v-ripple
                >
                  <q-item-section>
                    <q-item-label style="border: 1px solid rgba(0, 0, 0, 0.12)">
                      <q-toolbar class="toolbar-title2">
                        <q-toolbar-title>{{ evalKeyElement.key }}</q-toolbar-title>
                      </q-toolbar>
                      <div style="display: grid; grid-template-columns: 110px 1fr">
                        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                          <c-swt-icon
                            nomargin
                            :type="evalKeyElement.data.icon"
                            style="position: relative; height: 120px"
                          />
                        </div>
                        <div
                          class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5"
                          style="margin: auto"
                        >
                          <ICountUp
                            style="
                              font-size: 1.8rem;
                              font-weight: bold;
                              color: #1b1b1b;
                              display: inline-block;
                              padding: 0px !important;
                            "
                            :startVal="0"
                            :endVal="evalKeyElement.data.value"
                            :decimals="0"
                            :duration="4"
                            :options="{
                              useEasing: true,
                              useGrouping: true,
                              separator: ',',
                              decimal: '.',
                              prefix: '',
                              suffix: ' / 11'
                            }"
                          />
                        </div>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
        <div class="cardcontents card-auto-height q-mt-sm evalcard">
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
                :options="lawChart.options"
                :series="lawChartTotalSeries"
              />
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 to-col"
              style="text-align: center"
            >
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
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents card-auto-height evalcard">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('부서별 개선 이행율') }}
          </div>
          <div class="card-body" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <q-list style="border: 0px" class="row">
                <q-item
                  v-for="imprDept in imprDepts"
                  :key="imprDept.deptName"
                  class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                  clickable
                  v-ripple
                  style="height: 105px"
                >
                  <q-item-section
                    style="
                      display: grid;
                      align-items: center;
                      grid-template-columns: 100px 80px 1fr 1fr;
                      gap: 24px;
                      height: 103px;
                    "
                  >
                    <div>
                      <q-item-section avatar>
                        <apexcharts
                          height="100"
                          type="radialBar"
                          class="imprDetpCircleChart"
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
                          :series="imprDept.circle"
                        />
                      </q-item-section>
                    </div>
                    <div>
                      <q-item-label style="font-size: 1rem; font-weight: bold"
                        >{{ imprDept.deptName }}
                      </q-item-label>
                    </div>
                    <div style="display: flex; flex-direction: column; text-align: center">
                      미완
                      <ICountUp
                        style="
                          font-size: 1rem;
                          font-weight: bold;
                          color: #1b1b1b;
                          display: inline-block;
                        "
                        :startVal="0"
                        :endVal="imprDept.deplay"
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
                    </div>
                    <div style="display: flex; flex-direction: column; text-align: center">
                      보완
                      <ICountUp
                        style="
                          font-size: 1rem;
                          font-weight: bold;
                          color: #1b1b1b;
                          display: inline-block;
                        "
                        :startVal="0"
                        :endVal="imprDept.complement"
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
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
        <div class="cardcontents card-auto-height evalcard q-mt-sm">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('개선 도출 현황') }}
          </div>
          <div class="card-body" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <apexcharts
                ref="imprChartRef"
                height="343"
                type="bar"
                :options="imprChart.options"
                :series="imprChart.series"
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
import ICountUp from 'vue-countup-v3'
import {
  getEvalKeyElementData,
  getImprDeptData,
  getImprChartData
} from './evaluationImprovementData'
import { getLawChartData } from './managementLeadershipData'
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'evaluationImprovement'
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
const evalKeyElementChartRef = ref<any>(null)
const evalKeyElementChart = ref<apexChartType>({
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
    xaxis: {
      categories: [
        '1. 경영자의 리더십',
        '2. 근로자의 참여',
        '3. 위험요인 파악',
        '4. 위험요인 제거·대체 및 통제',
        '5. 비상조치계획 수립',
        '6. 도급·용역·위탁 시 안전보건 확보',
        '7. 평가 및 개선'
      ]
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
    colors: ['#80D6FF'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    }
  },
  series: [
    {
      name: '건 수',
      data: [] as any[]
    }
  ]
})
const evalKeyElements = ref<Array<any>>([])
const imprDepts = ref<Array<any>>([])
const imprChartRef = ref<any>(null)
const imprChart = ref<apexChartType>({
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
        columnWidth: '80%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#1B1B1B']
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
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -5,
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
const lawRate = ref(0)
const lawChartRef = ref<any>(null)
const lawChartTotalSeries = ref([])
const lawChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'line',
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
  // code setting
  // list setting
  getEvalKeyElements()
  getImprDepts()
  getLawCharts()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getEvalKeyElements() {
  const evalKeyElementCardChartDatas = getEvalKeyElementData()
  evalKeyElements.value = evalKeyElementCardChartDatas.card
  setTimeout(() => {
    evalKeyElementChartRef.value.updateSeries(evalKeyElementCardChartDatas.chart)
  }, 100)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getImprDepts() {
  imprDepts.value = getImprDeptData()
  setTimeout(() => {
    imprChartRef.value.updateSeries(getImprChartData())
  }, 100)
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
  }, 300)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

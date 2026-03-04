<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('전체') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">contents</div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('1. 경영자의 리더십') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <apexcharts
                ref="budgetChartRef"
                height="160"
                type="line"
                :options="budgetChart.options"
                :series="budgetChart.series"
              />
              <q-separator spaced />

              <q-list>
                <q-item-label header style="font-weight: bold; color: #000000">
                  안전보건목표 실적
                  <span style="float: right">
                    <ICountUp
                      style="font-size: 0.9rem; font-weight: bold; display: inline-block"
                      :startVal="0"
                      :endVal="lawAllAchievementRate"
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
                  /></span>
                </q-item-label>

                <q-item
                  v-for="law in laws"
                  :key="law.name"
                  style="padding: 0 7px !important; min-height: auto"
                >
                  <q-item-section style="font-size: 0.7rem">{{ law.name }}</q-item-section>
                  <q-item-section>
                    <q-linear-progress size="15px" :value="law.value" color="accent">
                      <div class="absolute-full flex flex-center">
                        <q-badge color="white" text-color="accent" :label="`${law.value * 100}%`" />
                      </div>
                    </q-linear-progress>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('2. 근로자의 참여') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <apexcharts
                ref="participationChartRef"
                height="160"
                type="line"
                :options="participationChart.options"
                :series="participationChart.series"
              />
              <q-separator spaced />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('3. 위험요인 파악') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">contents</div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('4. 위험요인 제거 대체 및 통제') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">contents</div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('5. 비상조치계획 수립') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">contents</div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('6. 도급 용역 위탁 시 안전보건 확보') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">contents</div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents card-auto-height" style="margin-bottom: 8px">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ $language('7. 평가 및 개선') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">contents</div>
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
import { getBudgetChartData, getLawData } from './sapaPreviewData'
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sapaPreview'
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
const budgetChartRef = ref<any>(null)
const budgetChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    title: {
      text: '안전보건 예산 / 실적 (백만원 단위)'
    },
    dataLabels: {
      enabled: true
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
    labels: ['안전/보건 인력', '안전조치', '보건조치', '교육', '기타'],
    markers: {
      size: 0
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
const laws = ref<Array<any>>([])
const lawAllAchievementRate = ref(0)
const participationChartRef = ref<any>(null)
const participationChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    title: {
      text: '산안위 & 협의체 현황'
    },
    dataLabels: {
      enabled: true
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
  getBudgets()
  getLaws()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getBudgets() {
  setTimeout(() => {
    budgetChartRef.value.updateSeries(getBudgetChartData())
  }, 100)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getLaws() {
  laws.value = getLawData()
  lawAllAchievementRate.value = Math.round((_.sum(_.map(laws.value, 'value')) / 9) * 100)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

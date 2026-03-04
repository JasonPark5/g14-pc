<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="cardcontents card-auto-height evalcard">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ $language('유해·위험요인 발굴 활동 (최근 1년)') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div
              class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 text-primary"
              style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
            >
              <div
                style="
                  font-size: 1.1rem;
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                "
              >
                <q-icon name="today" /> 일상 활동
              </div>
              <div class="row day-media" style="gap: 8px">
                <div
                  v-for="excavation in excavations.daily"
                  :key="excavation.name"
                  class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-card"
                  style="text-align: center"
                >
                  <div class="col-card-header">{{ excavation.name }}</div>
                  <div class="col-card-body">
                    <ICountUp
                      :startVal="0"
                      :endVal="excavation.count"
                      :decimals="0"
                      :duration="4"
                      :options="{
                        useEasing: true,
                        useGrouping: true,
                        separator: ',',
                        decimal: '.',
                        prefix: ''
                      }"
                    />
                    <span class="number">건</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 text-orange"
              style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
            >
              <div
                style="
                  font-size: 1.1rem;
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                "
              >
                <q-icon name="history" />
                주기 활동
              </div>
              <div class="row week-media" style="gap: 8px">
                <div
                  v-for="excavation in excavations.weekly"
                  :key="excavation.name"
                  class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-card"
                  style="text-align: center"
                >
                  <div class="col-card-header">{{ excavation.name }}</div>
                  <div class="col-card-body">
                    <ICountUp
                      :startVal="0"
                      :endVal="excavation.count"
                      :decimals="0"
                      :duration="4"
                      :options="{
                        useEasing: true,
                        useGrouping: true,
                        separator: ',',
                        decimal: '.',
                        prefix: ''
                      }"
                    />
                    <span class="number">건</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 text-primary"
              style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
            >
              <div
                style="
                  font-size: 1.1rem;
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                "
              >
                <q-icon name="calendar_month" />
                연간 활동
              </div>
              <div class="row year-media" style="gap: 8px">
                <div
                  v-for="excavation in excavations.yearly"
                  :key="excavation.name"
                  class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-card"
                  style="text-align: center"
                >
                  <div class="col-card-header">{{ excavation.name }}</div>
                  <div class="col-card-body">
                    <ICountUp
                      :startVal="0"
                      :endVal="excavation.count"
                      :decimals="0"
                      :duration="4"
                      :options="{
                        useEasing: true,
                        useGrouping: true,
                        separator: ',',
                        decimal: '.',
                        prefix: ''
                      }"
                    />
                    <span class="number">건</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 text-cyan">
              <div
                style="
                  font-size: 1.1rem;
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                "
              >
                <q-icon name="error_outline" /> 발생 활동
              </div>
              <div class="row occ-media" style="gap: 8px">
                <div
                  v-for="excavation in excavations.happens"
                  :key="excavation.name"
                  class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-card"
                  style="text-align: center"
                >
                  <div class="col-card-header">{{ excavation.name }}</div>
                  <div class="col-card-body">
                    <ICountUp
                      :startVal="0"
                      :endVal="excavation.count"
                      :decimals="0"
                      :duration="4"
                      :options="{
                        useEasing: true,
                        useGrouping: true,
                        separator: ',',
                        decimal: '.',
                        prefix: ''
                      }"
                    />
                    <span class="number">건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents card-auto-height">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ $language('중대재해처벌법 자율준수평가표 (최근)') }}
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <apexcharts
                ref="evalKeyElementChartRef"
                class="evalKeyElementChart"
                height="400"
                type="bar"
                :options="evalKeyElementChart.options"
                :series="evalKeyElementChart.series"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents card-auto-height">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ $language('관계법령 의무사항 이행현황 (최근)') }}
            <div class="card-header-example">
              <q-icon name="circle" color="red" />
              {{ $language('미진행') }}
              <q-icon name="circle" color="yellow" />
              {{ $language('진행') }}
              <q-icon name="circle" color="green" />
              {{ $language('완료') }}
            </div>
          </div>
          <div class="card-body row" style="height: auto !important">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <component :is="relationLawComponent" />
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
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sapaSummary'
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
  commonSearchParam: {
    plantCd: stringNull
  }
}
interface excavationType {
  daily: Array<excavationItemType>
  weekly: Array<excavationItemType>
  yearly: Array<excavationItemType>
  happens: Array<excavationItemType>
}
interface excavationItemType {
  name: string
  count: number
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
    xaxis: {
      categories: [
        '1. 경영자의 리더십',
        '2. 근로자의 참여',
        '3. 위험요인 파악',
        ['4. 위험요인', '제거·대체 및 통제'],
        '5. 비상조치계획 수립',
        ['6. 도급·용역·위탁 시', '안전보건 확보'],
        '7. 평가 및 개선'
      ],
      title: {
        text: '문항 개수'
      }
    },
    yaxis: {
      showAlways: true,
      logBase: 30,
      title: {
        text: '핵심요소'
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
    colors: ['#1a73e8'],
    stroke: {
      show: true,
      width: 10,
      colors: ['transparent']
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
const relationLawComponent = ref(
  shallowRef(defineAsyncComponent(() => import(`./relationLawPortlet.vue`)))
)
const excavations = ref<excavationType>({
  daily: [],
  weekly: [],
  yearly: [],
  happens: []
})
const excavationListUrl = ref('')
const selfEvaluationListUrl = ref('')

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
  excavationListUrl.value = selectConfig.monitor.excavationTask.url
  selfEvaluationListUrl.value = selectConfig.monitor.selfEvaluation.url
  // code setting
  // list setting
  getEvalKeyElements()
  getExcavations()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getExcavations() {
  $http({
    url: excavationListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    excavations.value = _result.data
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getEvalKeyElements() {
  $http({
    url: selfEvaluationListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    evalKeyElementChartRef.value.updateSeries([
      {
        name: '측정치',
        data: _.map(_result.data, (item) => {
          return {
            x: item.selfEvaluationClassName,
            y: item.measure,
            goals: [
              {
                name: '내부기준',
                value: item.innerStandard,
                strokeHeight: 11,
                strokeWidth: 5,
                strokeColor: '#FFD94D'
              }
            ]
          }
        })
      }
    ])
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.text-primary
  color: #249efa !important
  .col-card-header
    color: #616161 !important
  .col-card-body
    .countup-wrap
      span
        color: #249efa
.text-orange
  color: #ff9800
  .col-card-header
    color: #616161 !important
  .col-card-body
    .countup-wrap
      span
        color: #ff9800
.text-cyan
  color: #00acc1 !important
  .col-card-header
    color: #616161 !important
  .col-card-body
    .countup-wrap
      span
        color: #00acc1
</style>

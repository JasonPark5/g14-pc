<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="cardcontents card-auto-height evalcard" style="margin-bottom: 0px">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ $language('안전보건 목표 실적') }}
          </div>
          <div class="card-body row" style="height: auto !important; align-items: center">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <q-list
                class="row"
                style="
                  grid-template-columns: repeat(9, 1fr);
                  display: grid;
                  align-items: self-end;
                  gap: 16px;
                "
              >
                <q-item
                  v-for="(safetyHealthyTarget, shtIndex) in safetyHealthyTargets"
                  :key="safetyHealthyTarget.targetName"
                  class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 subTitle"
                  v-ripple
                  style="width: 150px"
                >
                  <q-item-section>
                    <q-item-label
                      style="
                        font-weight: bold;
                        text-align: center;
                        font-size: 0.9rem;
                        word-break: keep-all;
                        height: 35px;
                      "
                    >
                      {{ safetyHealthyTarget.targetName }}
                    </q-item-label>
                    <div>
                      <apexcharts
                        height="130"
                        type="radialBar"
                        class="budgetItemCircleChart"
                        :options="{
                          chart: {
                            height: 130,
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
                          labels: [''],
                          fill: {
                            colors: [
                              [
                                '#ff9800',
                                '#ff9800',
                                '#ff9800',
                                '#ff9800',
                                '#ff9800',
                                '#ff9800',
                                '#ff9800',
                                '#ff9800',
                                '#ff9800'
                              ][shtIndex]
                            ]
                          }
                        }"
                        :series="[safetyHealthyTarget.achievementRate]"
                      />
                    </div>
                    <div class="countbefore safe">
                      <div
                        style="
                          display: grid;
                          grid-template-columns: 35px 1fr;
                          align-items: center;
                          text-align: center;
                        "
                      >
                        실적
                        <span
                          style="
                            font-size: 0.9rem;
                            font-weight: bold;
                            color: #1b1b1b;
                            display: inline-block;
                            text-align: left;
                            padding-left: 8px;
                          "
                        >
                          <ICountUp
                            style="
                              font-size: 0.9rem;
                              font-weight: bold;
                              color: #1b1b1b;
                              display: inline-block;
                              text-align: left;
                              padding-left: 8px;
                            "
                            :startVal="0"
                            :endVal="safetyHealthyTarget.performanceGoal"
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
                        </span>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="cardcontents card-auto-height evalcard">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ $language('안전보건 예산 편성') }}
          </div>
          <div class="card-body row" style="height: auto !important; align-items: center">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-table
                title="항목별 예산편성"
                customClass="main-dashboard-table"
                :columns="gridBudgetYear.columns"
                :data="gridBudgetYear.data"
                :merge="gridBudgetYear.merge"
                gridHeightAuto
                :isTitle="false"
                :columnSetting="false"
                :expandAll="false"
                :isFullScreen="false"
                :usePaging="false"
                :hideBottom="true"
                :filtering="false"
              >
                <template v-slot:customArea="{ props, col }">
                  <template v-if="col.name === 'budgetTypeName'">
                    <b>{{ props.row[col.name] }}</b>
                  </template>
                </template>
              </c-table>
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1 budget text-grey-7"
              style="text-align: center; margin-bottom: 60px"
            >
              <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px">전체 실적</div>
              <ICountUp
                class="totcount"
                :startVal="0"
                :endVal="budgetYearRate"
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
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <q-list
                class="row"
                style="
                  grid-template-columns: repeat(5, 1fr);
                  display: grid;
                  align-items: center;
                  gap: 16px;
                "
              >
                <q-item
                  v-for="budgetYear in budgetYears"
                  :key="budgetYear.budgetTypeName"
                  class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 subTitle"
                  v-ripple
                  style="width: 150px"
                >
                  <q-item-section>
                    <q-item-label style="font-weight: bold; text-align: center; font-size: 0.9rem">
                      {{ budgetYear.budgetTypeName }}
                    </q-item-label>
                    <div>
                      <apexcharts
                        height="150"
                        type="radialBar"
                        class="budgetItemCircleChart"
                        :options="{
                          chart: {
                            height: 150,
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
                        :series="[budgetYear.amtPercent]"
                      />
                    </div>
                    <div class="countbefore">
                      <div
                        style="
                          display: grid;
                          grid-template-columns: 35px 1fr;
                          align-items: center;
                          text-align: center;
                        "
                      >
                        실적
                        <ICountUp
                          style="
                            font-size: 0.9rem;
                            font-weight: bold;
                            color: #1b1b1b;
                            display: inline-block;
                            text-align: left;
                            padding-left: 8px;
                          "
                          :startVal="0"
                          :endVal="budgetYear.budgetResultAmt"
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
                          grid-template-columns: 35px 1fr;
                          align-items: center;
                          text-align: center;
                        "
                      >
                        예산
                        <ICountUp
                          style="
                            font-size: 0.9rem;
                            font-weight: bold;
                            color: #1b1b1b;
                            display: inline-block;
                            text-align: left;
                            padding-left: 8px;
                          "
                          :startVal="0"
                          :endVal="budgetYear.budgetPlanAmt"
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
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <component :is="noAccidentComponent" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '제안의견' }}
          </div>
          <div class="card-body">
            <apexcharts
              ref="proposalChart"
              height="280"
              :options="proposalChartOptions.options"
              :series="proposalChartOptions.series"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '산업안전보건위원회' }}
          </div>
          <div class="card-body1">
            <div class="committee-info">
              <!-- 회의 주기 정보 -->
              <div class="row">
                <div class="grid-temp">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="commitee-card">
                      <div class="frequency-header">
                        <q-icon name="event" size="24px" color="blue-5" />
                        <span class="frequency-title">정기회의 현황</span>
                      </div>
                      <div class="frequency-content flex-fre">
                        <q-chip
                          class="frequency-chip"
                          color="blue-5"
                          text-color="white"
                          icon="schedule"
                          style="margin: 2px"
                        >
                          {{ oshProceeding?.cycle?.cycleName }}
                        </q-chip>
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            flex-direction: column;
                            gap: 4px;
                          "
                        >
                          <div class="next-meeting">
                            <q-badge
                              class="permit-badge"
                              color="orange"
                              :label="`최근 : ${oshProceeding?.cycle?.maxProceedingsDate}`"
                            />
                          </div>
                          <div class="next-meeting">
                            <q-badge
                              class="permit-badge"
                              color="orange"
                              :label="`다음 : ${oshProceeding?.cycle?.nextProceedingsDate}`"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="commitee-card">
                      <div class="frequency-header">
                        <q-icon name="task_alt" size="24px" color="blue-5" />
                        <span class="frequency-title">의결사항 개선현황</span>
                      </div>
                      <div class="frequency-content">
                        <div class="progress-section">
                          <div class="status-item">
                            <span>조치완료</span>
                            <q-chip color="positive" text-color="white">
                              {{ oshProceeding?.impr?.completeCount || 0 }}건</q-chip
                            >
                          </div>
                          <div class="status-item">
                            <span>진행중</span>
                            <q-chip color="warning" text-color="white"
                              >{{ oshProceeding?.impr?.actionCount || 0 }}건</q-chip
                            >
                          </div>
                          <div class="status-item">
                            <span>접수중</span>
                            <q-chip color="grey" text-color="white"
                              >{{ oshProceeding?.impr?.requestCount || 0 }}건</q-chip
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '안전보건 협의체' }}
          </div>

          <div class="card-body1">
            <div class="committee-info">
              <div class="row">
                <div class="grid-temp">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="commitee-card">
                      <div class="frequency-header">
                        <q-icon name="event" size="24px" color="blue-5" />
                        <span class="frequency-title">정기회의 현황</span>
                      </div>
                      <div class="frequency-content flex-fre">
                        <q-chip
                          class="frequency-chip"
                          color="blue-5"
                          text-color="white"
                          icon="schedule"
                          style="margin: 2px"
                        >
                          {{ vendorCouncil?.cycle?.cycleName }}
                        </q-chip>
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            flex-direction: column;
                            gap: 4px;
                          "
                        >
                          <div class="next-meeting">
                            <q-badge
                              class="permit-badge"
                              color="orange"
                              :label="`최근 : ${vendorCouncil?.cycle?.maxCouncilDate}`"
                            />
                          </div>
                          <div class="next-meeting">
                            <q-badge
                              class="permit-badge"
                              color="orange"
                              :label="`다음 : ${vendorCouncil?.cycle?.nextCouncilDate}`"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="commitee-card">
                      <div class="frequency-header">
                        <q-icon name="task_alt" size="24px" color="blue-5" />
                        <span class="frequency-title">의결사항 개선현황</span>
                      </div>
                      <div class="frequency-content">
                        <div class="progress-section">
                          <div class="status-item">
                            <span>조치완료</span>
                            <q-chip color="positive" text-color="white"
                              >{{ vendorCouncil?.impr?.completeCount || 0 }}건</q-chip
                            >
                          </div>
                          <div class="status-item">
                            <span>진행중</span>
                            <q-chip color="warning" text-color="white"
                              >{{ vendorCouncil?.impr?.actionCount || 0 }}건</q-chip
                            >
                          </div>
                          <div class="status-item">
                            <span>접수중</span>
                            <q-chip color="grey" text-color="white"
                              >{{ vendorCouncil?.impr?.requestCount || 0 }}건</q-chip
                            >
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
  name: 'leadershipWorkParticipation'
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
interface safetyHealthyTargetType {
  targetName: string
  achievementRate: number
  performanceGoal: number
}
interface budgetYearType {
  budgetTypeName: string
  budgetPlanAmt: number
  budgetResultAmt: number
  amtPercent: number
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
const safetyHealthyTargets = ref<Array<safetyHealthyTargetType>>([])
const budgetYearRate = ref(0)
const budgetYears = ref<Array<budgetYearType>>([])
const gridBudgetYear = ref({
  merge: [{ index: 0, colName: 'budgetTypeName' }],
  columns: [
    {
      name: 'budgetTypeName',
      field: 'budgetTypeName',
      label: '구분',
      align: 'center',
      style: 'width: 120px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'budgetItemName',
      field: 'budgetItemName',
      label: '항목',
      align: 'left',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'budgetResultAmt',
      field: 'budgetResultAmt',
      label: '예산 집행금액(만원)',
      align: 'right',
      style: 'width: 150px',
      sortable: false,
      type: 'cost'
    }
  ],
  data: [] as Array<any>
})
const noAccidentComponent = ref(
  shallowRef(defineAsyncComponent(() => import(`./noAccidentPortlet.vue`)))
)
const proposalChart = ref<any>([])
const proposalChartOptions = ref<apexChartType>({
  series: [
    {
      name: '의견 건 수',
      data: []
    },
    {
      name: '개선 건 수',
      data: []
    }
  ],
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
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: {
      enabled: false
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
      stepSize: 1
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
  }
})
const oshProceeding = ref({
  cycle: {
    cycleName: '',
    maxProceedingsDate: '',
    nextProceedingsDate: ''
  },
  impr: {
    completeCount: 0,
    actionCount: 0,
    requestCount: 0
  }
})
const vendorCouncil = ref({
  cycle: {
    cycleName: '',
    maxCouncilDate: '',
    nextCouncilDate: ''
  },
  impr: {
    completeCount: 0,
    actionCount: 0,
    requestCount: 0
  }
})
const safetyHealthyTargetListUrl = ref('')
const budgetListUrl = ref('')
const boardListUrl = ref('')
const oshProceedingListUrl = ref('')
const vendorCouncilListUrl = ref('')

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
  safetyHealthyTargetListUrl.value = selectConfig.monitor.safetyHealthyTarget.url
  budgetListUrl.value = selectConfig.monitor.budget.url
  boardListUrl.value = selectConfig.monitor.board.url
  oshProceedingListUrl.value = selectConfig.monitor.oshProceeding.url
  vendorCouncilListUrl.value = selectConfig.monitor.vendorCouncil.url

  // code setting
  // list setting
  getLawCharts()
  getBudgetYears()
  getBoards()
  getOshProceeding()
  getVendorCouncil()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getLawCharts() {
  $http({
    url: safetyHealthyTargetListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    safetyHealthyTargets.value = _result.data
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getBudgetYears() {
  $http({
    url: budgetListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    gridBudgetYear.value.data = _result.data?.tables
    const totalInfo = _.filter(_result.data?.charts, { budgetTypeName: 'TOTAL' })
    if (totalInfo && totalInfo.length > 0) {
      budgetYearRate.value = totalInfo[0].amtPercent
    }
    budgetYears.value = _.reject(_result.data?.charts, { budgetTypeName: 'TOTAL' })
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getBoards() {
  $http({
    url: boardListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    console.log('_result.data', _result.data)
    proposalChart.value.updateSeries([
      {
        name: '의견 건 수',
        data: _.map(_result.data, 'boardCount')
      },
      {
        name: '개선 건 수',
        data: _.map(_result.data, 'imprCount')
      }
    ])
    proposalChart.value.updateOptions({
      xaxis: {
        categories: _.map(_.reject(_result.data, { deptVendorName: null }), 'deptVendorName')
      }
    })
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getOshProceeding() {
  $http({
    url: oshProceedingListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    oshProceeding.value = _result.data
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getVendorCouncil() {
  $http({
    url: vendorCouncilListUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    vendorCouncil.value = _result.data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.subTitle
  .q-item__label
    color: #616161 !important
</style>

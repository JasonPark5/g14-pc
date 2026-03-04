<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
      <!-- <div class="dashboard-sub-title">위험요인 제거 방안 마련</div> -->
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <div class="cardcontents">
          <div
            class="card-header"
            style="display: flex; align-items: center; justify-content: space-between"
          >
            <div>
              <span class="card-icon">📅</span>
              {{ '교육과정별 참석 현황' }}
            </div>
            <q-badge color="primary" class="education-badge">
              <q-icon name="school" size="15px" class="q-mr-xs" />
              신규채용시 교육
            </q-badge>
          </div>
          <div class="card-body" style="height: auto !important">
            <div class="committee-info">
              <div class="row">
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                  <!-- <c-task-target
                    :required="true"
                    :customPopupParam="{ targetKey: 'eduCourse' }"
                    name="eduCourseId"
                    v-model:value="searchParam.eduCourseId"
                  /> -->
                  <apexcharts
                    type="radialBar"
                    height="250"
                    :options="donutOptions.options"
                    :series="donutOptions.series"
                  />
                </div>
                <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                  <div class="stats-grid">
                    <div class="stat-card">
                      <div class="stat-header">
                        <q-icon name="groups" size="24px" color="primary" />
                        <span style="width: 60px">내부</span>

                        <!-- width 조절 -->
                        <q-linear-progress
                          size="15px"
                          :value="0.857"
                          color="primary"
                          class="q-mt-sm"
                          style="margin: 0"
                        >
                          <div class="absolute-full flex flex-center">
                            <q-badge color="primary" text-color="white">120/140명</q-badge>
                          </div>
                        </q-linear-progress>
                      </div>
                    </div>

                    <div class="stat-card">
                      <div class="stat-header">
                        <q-icon name="groups" size="24px" color="blue-5" />
                        <span style="width: 60px">외부</span>

                        <!-- width 조절 -->
                        <q-linear-progress
                          size="15px"
                          :value="0.789"
                          color="blue-5"
                          class="q-mt-sm"
                          style="margin: 0"
                        >
                          <div class="absolute-full flex flex-center">
                            <q-badge color="blue-5" text-color="white">45/57명</q-badge>
                          </div>
                        </q-linear-progress>
                      </div>
                    </div>

                    <!-- 예정된 교육 -->
                    <div class="stat-card">
                      <div class="stat-header">
                        <q-icon name="event" size="24px" color="green" />
                        <span>다음 일정</span>
                        <q-chip icon="calendar_today" color="green" text-color="white">
                          2025-02-15
                        </q-chip>
                        <span class="training-name"> 안전보건교육 3차</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ '금년도 유해위험기계기구 안전검사 진행 현황' }}
          </div>
          <div class="card-body" style="height: auto !important">
            <div class="committee-info">
              <div class="stats-grid inspection-grid">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="inspection-card target">
                      <div class="inspection-header">
                        <q-icon name="build" size="24px" color="orange" />
                        <span>검사 대상</span>
                      </div>
                      <div class="inspection-value">
                        28건
                        <span class="sub-text">전체</span>
                      </div>
                      <q-linear-progress size="4px" :value="1" color="orange" class="q-mt-sm" />
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="inspection-card completed">
                      <div class="inspection-header">
                        <q-icon name="task_alt" size="24px" color="positive" />
                        <span>검사 완료</span>
                      </div>
                      <div class="inspection-value">
                        15건
                        <span class="sub-text" />
                      </div>
                      <q-linear-progress size="4px" :value="0.5" color="positive" class="q-mt-sm" />
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="inspection-card upcoming">
                      <div class="inspection-header">
                        <q-icon name="event" size="24px" color="primary" />
                        <span>검사 예정</span>
                      </div>
                      <div class="inspection-value">
                        8건
                        <span class="sub-text">30일 이내</span>
                      </div>
                      <q-linear-progress size="4px" :value="0.3" color="primary" class="q-mt-sm" />
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="inspection-card overdue">
                      <div class="inspection-header">
                        <q-icon name="warning" size="24px" color="negative" />
                        <span>검사 지연</span>
                      </div>
                      <div class="inspection-value">
                        2건
                        <span class="sub-text">조치 필요</span>
                      </div>
                      <q-linear-progress size="4px" :value="0.1" color="negative" class="q-mt-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ '년도별 유소견자 발생 추이분석' }}
          </div>
          <div class="card-body" style="height: auto !important">
            <div class="committee-info">
              <apexcharts
                ref="refChart"
                height="200"
                :width="chartOptions3.m"
                :options="chartOptions3.options"
                :series="chartOptions3.series"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <div class="row">
          <div
            class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
            style="padding: 0px !important; margin-bottom: 8px"
          >
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">💡</span>
                {{ '장소별 작업환경측정치/개선 분석' }}
              </div>
              <div class="card-body" style="height: auto !important">
                <div class="row">
                  <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <apexcharts
                      ref="refChart"
                      height="200"
                      :width="chartOptions.m"
                      :options="chartOptions.options"
                      :series="chartOptions.series"
                    />
                  </div> -->
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <apexcharts
                      ref="refChart"
                      height="200"
                      :width="chartOptions2.m"
                      :options="chartOptions2.options"
                      :series="chartOptions2.series"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
            style="padding: 0px !important"
          >
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">💡</span>
                {{ '년도별 위험성평가 추이분석' }}
              </div>
              <div class="card-body" style="height: auto !important">
                <apexcharts
                  ref="refChart"
                  height="200"
                  :width="chartOptions4.m"
                  :options="chartOptions4.options"
                  :series="chartOptions4.series"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apexChartType } from '@/types/apexChart'

interface propType {
  title: string
}
const props = withDefaults(defineProps<propType>(), {
  title: ''
})
// const searchParam = ref<any>({
//   eduCourseId: 'ECC0000011'
// })

// const chartOptions = ref<apexChartType>({
//   series: [
//     {
//       name: '유해인자1',
//       data: [28, 29, 33, 36]
//     },
//     {
//       name: '유해인자2',
//       data: [12, 11, 14, 18]
//     }
//   ],
//   options: {
//     title: {
//       text: '반기별 추이분석',
//       align: 'left'
//     },
//     chart: {
//       height: 350,
//       type: 'line',
//       zoom: {
//         enabled: false
//       },
//       toolbar: {
//         show: false
//       }
//     },
//     colors: ['#77B6EA', '#545454'],
//     dataLabels: {
//       enabled: true
//     },
//     stroke: {
//       curve: 'smooth'
//     },
//     xaxis: {
//       categories: ['2024-상', '2024-하', '2025-상', '2025-하'],
//       title: {}
//     },
//     markers: {
//       size: 1
//     },
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right',
//       floating: true,
//       offsetY: -25,
//       offsetX: -5
//     }
//   }
// })
const chartOptions2 = ref<apexChartType>({
  series: [
    {
      name: '가장 높은 노출기준 측정치',
      type: 'column',
      data: [50, 40, 60, 30]
    },
    {
      name: '개선 건 수',
      type: 'line',
      data: [10, 15, 12, 17]
    }
  ],
  options: {
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
      curve: 'smooth'
    },
    title: {
      text: '',
      align: 'left'
    },
    xaxis: {
      categories: ['장소1', '장소2', '장소3', '장소4'],
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

const chartOptions3 = ref<apexChartType>({
  series: [
    {
      name: '유소견자',
      data: [36, 33, 29, 28]
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
    colors: ['#eb1e4b'],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['2022', '2023', '2024', '2025'],
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

const chartOptions4 = ref<apexChartType>({
  series: [
    {
      name: '평가 발생 빈도 건 수',
      data: [76, 85, 101, 98]
    },
    {
      name: '위험등록부(고위험군) 건 수',
      data: [44, 55, 57, 56]
    },
    {
      name: '개선 건 수',
      data: [22, 34, 31, 25]
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
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: {
      enabled: true
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['2022', '2023', '2024', '2025']
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

const donutOptions = ref<apexChartType>({
  series: [78.5],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#64748b',
            fontSize: '14px'
          },
          value: {
            color: '#1e40af',
            fontSize: '24px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '%'
            }
          }
        }
      }
    },
    fill: {
      colors: ['#3b82f6']
    },
    labels: ['참석률'],
    stroke: {
      lineCap: 'round'
    }
  }
})

onDeactivated(() => {})

onMounted(() => {
  init()
})

function init() {}
</script>

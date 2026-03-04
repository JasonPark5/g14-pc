<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
      <!-- <div class="dashboard-sub-title">'안전보건'에 대한 의견을 자유롭게 제시</div> -->
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">💡</span>
            {{ '제안의견' }}
          </div>
          <div class="card-body" style="height: auto !important">
            <div class="committee-info">
              <div class="row">
                <div class="frequency-card col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div class="progress-header">
                    <q-icon name="trending_up" size="24px" color="blue-5" />
                    <span class="progress-title">의견/개선 분석</span>
                  </div>
                  <apexcharts
                    ref="refChart"
                    height="250"
                    :width="chartOptions.m"
                    :options="chartOptions.options"
                    :series="chartOptions.series"
                  />
                </div>
                <div class="impr-card col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div class="progress-header">
                    <q-icon name="grade" size="24px" color="yellow-5" />
                    <span class="progress-title">의견 결과 개선 이행율</span>
                  </div>
                  <div class="progress-content">
                    <div class="progress-grid">
                      <div
                        class="progress-item"
                        v-show="isVisible"
                        v-for="item in progressItems"
                        :key="item.id"
                      >
                        <span class="progress-label">{{ item.name }}</span>
                        <q-linear-progress
                          size="15px"
                          :value="item.value"
                          color="blue-5"
                          track-color="blue-1"
                          class="progress-bar"
                          animate
                        >
                          <div class="absolute-full flex flex-center">
                            <q-badge
                              style="background: #f48fb1"
                              text-color="white"
                              :label="`${Math.round(item.value * 100)}%`"
                            />
                          </div>
                        </q-linear-progress>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 no-padding">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="cardcontents" style="height: 450px !important">
              <div class="card-header">
                <span class="card-icon">👥</span>
                {{ '비상대응 훈련' }}
              </div>

              <div class="card-body1">
                <div class="committee-info">
                  <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div class="progress-header">
                        <q-icon name="people" size="24px" color="blue-5" />
                        <span class="progress-title">훈련구분별 참석 현황</span>
                      </div>
                      <apexcharts
                        type="radialBar"
                        height="350"
                        :options="emergencyTrainingOptions.options"
                        :series="emergencyTrainingOptions.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div class="progress-header">
                        <q-icon name="event" size="24px" color="blue-5" />
                        <span class="progress-title">최근 훈련</span>
                      </div>
                      <q-list bordered class="rounded-borders">
                        <q-item v-ripple>
                          <q-item-section>
                            <q-item-label>소방 대피 훈련</q-item-label>
                            <q-item-label caption>2024.01.15 | 참석률 92%</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-separator inset />
                        <q-item v-ripple>
                          <q-item-section>
                            <q-item-label>화학물질 누출 대응</q-item-label>
                            <q-item-label caption>2024.01.10 | 참석률 88%</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />
                        <q-item v-ripple>
                          <q-item-section>
                            <q-item-label>독성물질 유출 대응 훈련</q-item-label>
                            <q-item-label caption>2024.01.10 | 참석률 88%</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />
                        <q-item v-ripple>
                          <q-item-section>
                            <q-item-label>비상 대응 훈련</q-item-label>
                            <q-item-label caption>2024.01.10 | 참석률 88%</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />
                        <q-item v-ripple>
                          <q-item-section>
                            <q-item-label>밀폐공간 대처 훈련</q-item-label>
                            <q-item-label caption>2024.01.10 | 참석률 88%</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />
                        <q-item v-ripple>
                          <q-item-section>
                            <q-item-label>비상 대응 훈련</q-item-label>
                            <q-item-label caption>2024.01.10 | 참석률 88%</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 emerg">
                      <div class="progress-header">
                        <q-icon name="photo_library" size="24px" color="blue-5" />
                        <span class="progress-title">관련 사진</span>
                      </div>
                      <q-carousel
                        v-model="slide"
                        animated
                        infinite
                        autoplay
                        :arrows="false"
                        :navigation="false"
                        :autoplay-timeout="3000"
                        style="height: 330px !important; min-height: unset !important"
                        class="bg-white shadow-1 rounded-borders"
                        @mouseenter="autoplay = false"
                        @mouseleave="autoplay = true"
                      >
                        <q-carousel-slide :name="1" class="column no-wrap flex-center">
                          <img
                            :src="mapSrc1"
                            alt="훈련사진1"
                            class="q-mb-sm"
                            style="max-width: 100%"
                          />
                          <div class="text-center">
                            <div class="text-h6">소방대피 훈련</div>
                            <div class="text-subtitle1">2024.01.15</div>
                          </div>
                        </q-carousel-slide>

                        <q-carousel-slide :name="2" class="column no-wrap flex-center">
                          <img
                            :src="mapSrc2"
                            alt="훈련사진2"
                            class="q-mb-sm"
                            style="max-width: 100%"
                          />
                          <div class="text-center">
                            <div class="text-h6">화학물질 누출 대응</div>
                            <div class="text-subtitle1">2024.01.10</div>
                          </div>
                        </q-carousel-slide>
                      </q-carousel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <div class="cardcontents" style="height: 400px !important">
              <div class="card-header">
                <span class="card-icon">🏢</span>
                {{ '업체별 정기평가 현황' }}
              </div>
              <div class="card-body2">
                <div class="committee-info">
                  <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions5.options"
                        :series="donutOptions5.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions3.options"
                        :series="donutOptions3.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions2.options"
                        :series="donutOptions2.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions4.options"
                        :series="donutOptions4.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions1.options"
                        :series="donutOptions1.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions6.options"
                        :series="donutOptions6.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions1.options"
                        :series="donutOptions1.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions2.options"
                        :series="donutOptions2.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions3.options"
                        :series="donutOptions3.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions4.options"
                        :series="donutOptions4.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions5.options"
                        :series="donutOptions5.series"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <apexcharts
                        type="radialBar"
                        height="250"
                        :options="donutOptions6.options"
                        :series="donutOptions6.series"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
            <div class="cardcontents">
              <div class="card-header">
                <span class="card-icon">📊</span>
                {{ 'TBM 금일 현황' }}
              </div>
              <div class="card-body">
                <q-table
                  class="dashboard-table"
                  flat
                  bordered
                  :rows="rows"
                  :columns="columns"
                  row-key="name"
                  :hide-bottom="true"
                >
                  <template v-slot:body-cell="props">
                    <q-td :props="props">
                      <div class="cell-content">
                        <!-- TBM명 칼럼일 경우 -->
                        <template v-if="props.col.name === 'name'">
                          <q-badge class="tbm-badge" color="primary" :label="props.value" outline />
                        </template>

                        <!-- 작업시간 칼럼일 경우 -->
                        <template v-else-if="props.col.name === 'a'">
                          <div class="time-badge">
                            <q-icon name="schedule" size="16px" class="q-mr-xs" />
                            {{ props.value }}
                          </div>
                        </template>

                        <!-- 참석자 칼럼일 경우 -->
                        <template v-else-if="props.col.name === 'b'">
                          <div class="attendee-list">
                            <q-icon name="people" size="16px" class="q-mr-xs" />
                            {{ props.value }}
                          </div>
                        </template>

                        <!-- 작업허가서 칼럼일 경우 -->
                        <template v-else-if="props.col.name === 'c'">
                          <q-badge class="permit-badge" color="positive" :label="props.value" />
                        </template>
                      </div>
                    </q-td>
                  </template>
                </q-table>
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

const mapSrc1 = ref(new URL('@images/emer_1.jpg', import.meta.url).href)
const mapSrc2 = ref(new URL('@images/emer_2.jpg', import.meta.url).href)
const slide = ref(1)
const autoplay = ref(true)

const emergencyTrainingOptions = ref({
  series: [85, 92, 78, 88],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '16px'
          },
          value: {
            fontSize: '14px'
          },
          total: {
            show: true,
            label: '평균 참석률',
            formatter: function () {
              return '85%'
            }
          }
        }
      }
    },
    labels: ['소방/화재', '안전사고', '누출사고', '중대 폭발사고'],
    colors: ['#3b82f6', '#10B981', '#8B5CF6', '#de2509']
  }
})

const columns = [
  {
    name: 'name',
    field: 'name',
    required: true,
    label: '작업명',
    align: 'center',
    sortable: true
  },
  { name: 'a', align: 'center', label: '작업시간', field: 'a' },
  { name: 'b', label: '참석자', field: 'b', align: 'center' },
  { name: 'c', label: '작업허가서', field: 'c', align: 'center' }
] as any

const rows = [
  {
    name: 'TBM 1',
    a: '09:00 ~ 18:00',
    b: '홍길동, 김길동, 이길동',
    c: '작업허가서 1'
  },
  {
    name: 'TBM 2',
    a: '09:00 ~ 18:00',
    b: '홍길동',
    c: '작업허가서 2'
  },
  {
    name: 'TBM 3',
    a: '09:00 ~ 18:00',
    b: '홍길동, 김길동, 이길동',
    c: '작업허가서 3'
  },
  {
    name: 'TBM 4',
    a: '09:00 ~ 18:00',
    b: '홍길동, 이길동',
    c: '작업허가서 4'
  },
  {
    name: 'TBM 5',
    a: '09:00 ~ 18:00',
    b: '김길동, 홍길동',
    c: '작업허가서 5'
  }
]

const donutOptions1 = ref<any>({
  series: [78],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            color: '#64748b',
            fontSize: '10px',
            offsetY: -5
          },
          value: {
            color: '#1e40af',
            fontSize: '15px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '점(A)'
            },
            offsetY: 0
          }
        }
      }
    },
    fill: {
      colors: ['#3b82f6']
    },
    labels: ['업체'],
    stroke: {
      lineCap: 'round'
    }
  }
})
const donutOptions2 = ref<any>({
  series: [30],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            color: '#64748b',
            fontSize: '10px',
            offsetY: -5
          },
          value: {
            color: '#1e40af',
            fontSize: '15px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '점(C)'
            },
            offsetY: 0
          }
        }
      }
    },
    fill: {
      colors: ['#de2509']
    },
    labels: ['업체2'],
    stroke: {
      lineCap: 'round'
    }
  }
})
const donutOptions3 = ref<any>({
  series: [50],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            color: '#64748b',
            fontSize: '10px',
            offsetY: -5
          },
          value: {
            color: '#1e40af',
            fontSize: '15px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '점(B)'
            },
            offsetY: 0
          }
        }
      }
    },
    fill: {
      colors: ['#e6921e']
    },
    labels: ['업체3'],
    stroke: {
      lineCap: 'round'
    }
  }
})
const donutOptions4 = ref<any>({
  series: [70],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            color: '#64748b',
            fontSize: '10px',
            offsetY: -5
          },
          value: {
            color: '#1e40af',
            fontSize: '15px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '점(B)'
            },
            offsetY: 0
          }
        }
      }
    },
    fill: {
      colors: ['#1ee682']
    },
    labels: ['업체4'],
    stroke: {
      lineCap: 'round'
    }
  }
})
const donutOptions5 = ref<any>({
  series: [90],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            color: '#64748b',
            fontSize: '10px',
            offsetY: -5
          },
          value: {
            color: '#1e40af',
            fontSize: '15px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '점(A)'
            },
            offsetY: 0
          }
        }
      }
    },
    fill: {
      colors: ['#1e2fe6']
    },
    labels: ['업체5'],
    stroke: {
      lineCap: 'round'
    }
  }
})
const donutOptions6 = ref<any>({
  series: [40],
  options: {
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        track: {
          background: '#e2e8f0'
        },
        dataLabels: {
          name: {
            color: '#64748b',
            fontSize: '10px',
            offsetY: -5
          },
          value: {
            color: '#1e40af',
            fontSize: '15px',
            fontWeight: '600',
            formatter: function (val: number) {
              return val + '점(C)'
            },
            offsetY: 0
          }
        }
      }
    },
    fill: {
      colors: ['#fff700']
    },
    labels: ['업체6'],
    stroke: {
      lineCap: 'round'
    }
  }
})
const chartOptions = ref<apexChartType>({
  series: [
    {
      name: '의견 건 수',
      data: [76, 85, 101, 98]
    },
    {
      name: '개선 건 수',
      data: [44, 55, 57, 56]
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
      categories: ['업체A', '업체B', '업체C', '업체D']
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

const isVisible = ref(false)
const progressItems = ref([
  { id: 1, name: '업체A', value: 0 },
  { id: 2, name: '업체B', value: 0 },
  { id: 3, name: '업체C', value: 0 },
  { id: 4, name: '업체D', value: 0 },
  { id: 5, name: '업체A', value: 0 },
  { id: 6, name: '업체B', value: 0 },
  { id: 7, name: '업체C', value: 0 },
  { id: 8, name: '업체D', value: 0 },
  { id: 9, name: '업체E', value: 0 },
  { id: 10, name: '업체F', value: 0 },
  { id: 11, name: '업체G', value: 0 },
  { id: 12, name: '업체H', value: 0 }
])

// 최종 값 설정
const finalProgressValues = ref<any>({
  1: 0.579, // 57.9%
  2: 0.647, // 64.7%
  3: 0.523, // 52.3%
  4: 0.687, // 68.7%
  5: 0.564, // 56.4%
  6: 0.571, // 57.1%
  7: 0.634, // 63.4%
  8: 0.592, // 59.2%
  9: 0.592, // 59.2%
  10: 0.592, // 59.2%
  11: 0.592, // 59.2%
  12: 0.592 // 59.2%
})
onMounted(() => {
  isVisible.value = true

  const duration = 1500
  const steps = 60
  const interval = duration / steps

  const animate = () => {
    let currentStep = 0

    const timer = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(timer)
        return
      }

      progressItems.value = progressItems.value.map((item) => ({
        ...item,
        value: item.value + finalProgressValues.value[item.id] / steps
      }))

      currentStep++
    }, interval)
  }

  setTimeout(animate, 200)
})
</script>
<style scoped>
.schedule-section,
.agenda-section,
.resolution-section {
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #2d3748;
}

.progress-section {
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.next-badge {
  padding: 8px 12px;
  font-size: 14px;
}
.emerg .dashboard-display-carousel .q-carousel {
  height: 250px !important;
  min-height: auto !important;
}
</style>

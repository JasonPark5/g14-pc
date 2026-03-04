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
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div class="cardcontents" style="height: 450px !important">
              <div class="card-header">
                <span class="card-icon">🏢</span>
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
                          <div class="frequency-content">
                            <q-chip
                              class="frequency-chip"
                              color="blue-5"
                              text-color="white"
                              icon="schedule"
                            >
                              분기별 1회
                            </q-chip>
                            <div class="next-meeting">
                              <q-badge
                                class="permit-badge"
                                color="orange"
                                label="최근 : 2025-01-01 , 다음 : 2025-03-05"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="commitee-card" style="width: 200px">
                          <div class="frequency-header">
                            <q-icon name="task_alt" size="24px" color="blue-5" />
                            <span class="frequency-title">의결사항 처리현황</span>
                          </div>
                          <div class="frequency-content">
                            <div class="progress-section">
                              <div class="status-item">
                                <span>조치완료</span>
                                <q-chip color="positive" text-color="white">4건</q-chip>
                              </div>
                              <div class="status-item">
                                <span>진행중</span>
                                <q-chip color="warning" text-color="white">1건</q-chip>
                              </div>
                              <div class="status-item">
                                <span>예정</span>
                                <q-chip color="grey" text-color="white">2건</q-chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div class="cardcontents" style="height: 450px !important">
              <div class="card-header">
                <span class="card-icon">👥</span>
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
                          <div class="frequency-content">
                            <q-chip
                              class="frequency-chip"
                              color="blue-5"
                              text-color="white"
                              icon="schedule"
                            >
                              월 1회
                            </q-chip>
                            <div class="next-meeting">
                              <q-badge
                                class="permit-badge"
                                color="orange"
                                label="최근 : 2025-01-01 , 다음 : 2025-03-05"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="commitee-card" style="width: 200px">
                          <div class="frequency-header">
                            <q-icon name="task_alt" size="24px" color="blue-5" />
                            <span class="frequency-title">의결사항 처리현황</span>
                          </div>
                          <div class="frequency-content">
                            <div class="progress-section">
                              <div class="status-item">
                                <span>조치완료</span>
                                <q-chip color="positive" text-color="white">18건</q-chip>
                              </div>
                              <div class="status-item">
                                <span>진행중</span>
                                <q-chip color="warning" text-color="white">4건</q-chip>
                              </div>
                              <div class="status-item">
                                <span>예정</span>
                                <q-chip color="grey" text-color="white">2건</q-chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
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
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['부서A', '부서B', '업체A', '업체B']
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

const chartOptions2 = ref<apexChartType>({
  series: [
    {
      name: '내부 참석자 수',
      data: [7, 8, 10, 9]
    },
    {
      name: '업체 참석자 수',
      data: [4, 5, 5, 5]
    }
  ],
  options: {
    title: {
      text: '💡 참석자 현황'
    },
    chart: {
      type: 'bar',
      height: 350,
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: ['회의1', '회의2', '회의3', '회의4']
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },

    colors: [
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#3F51B5',
      '#03A9F4',
      '#4CAF50',
      '#F9CE1D',
      '#FF9800',
      '#A300D6',
      '#5653FE',
      '#1B998B',
      '#F86624',
      '#13D8AA'
    ]
  },
  chartWidth: '95%'
})
const isVisible = ref(false)
const progressItems = ref([
  { id: 1, name: '부서A', value: 0 },
  { id: 2, name: '부서B', value: 0 },
  { id: 3, name: '부서C', value: 0 },
  { id: 4, name: '부서D', value: 0 },
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
  gap: 16px;
}

.next-badge {
  padding: 8px 12px;
  font-size: 14px;
}
</style>

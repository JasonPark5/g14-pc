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
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <div class="cardcontents mapcard">
          <div class="card-header">
            <span class="card-icon">
              <q-icon name="map" class="q-mr-xs" color="orange" />
            </span>
            {{ !workPermitFlag ? 'LOTO 설비 위치 현황' : '밀폐/LOTO 위치 현황 (7일 기준)' }}
            <div style="display: inline-block; float: right; font-size: 0.8rem; color: #3f3f3f">
              <q-btn
                push
                size="10px"
                icon="autorenew"
                color="red"
                label=""
                @click="workPermitFlag = !workPermitFlag"
              />
            </div>
          </div>
          <div
            v-if="workPermitFlag"
            ref="carousel"
            class="card-body"
            style="padding: 15px !important; height: 500px"
          >
            <q-carousel
              v-if="mapObj.maps && mapObj.maps.length > 0"
              class="workPermit-carousel"
              swipeable
              animated
              transition-prev="slide-right"
              transition-next="slide-left"
              arrows
              infinite
              control-type="regular"
              control-color="grey-6"
              v-model="mapObj.slide"
            >
              <q-carousel-slide
                v-for="(map, idx) in mapObj.maps"
                :key="idx"
                :name="idx"
                :img-src="map.mapSrc"
              >
                <div class="mapTitleDiv" style="right: 5px" v-text="map.mapName" />
                <VueDraggableResizable
                  v-for="(item, idx) in map.maps"
                  :key="idx"
                  ref="markImage"
                  class="mainMarkImage"
                  :class="item.idx === mapObj.activeMarked ? 'selected' : ''"
                  :resizable="false"
                  :parent="true"
                  :draggable="false"
                  :x="item.locationXcoordinate * mapRate * mapObj.ratio"
                  :y="item.locationYcoordinate * 0.5 * mapObj.ratio"
                  :w="40"
                  :h="40"
                  :grid="[20, 20]"
                >
                  <img
                    v-if="item.loto"
                    src="https://s2.svgbox.net/materialui.svg?ic=lock&color=196df5"
                    width="32"
                    height="32"
                    class="marker-icon loto-icon"
                  />
                  <img
                    v-else
                    src="https://s2.svgbox.net/octicons.svg?ic=alert-bold&color=ff0000"
                    width="32"
                    height="32"
                    class="marker-icon alert-icon"
                  />
                  <!-- 작업 내용 팝업 -->
                  <div class="work-info">
                    <div class="work-info-header">
                      <q-badge
                        :color="item.loto ? 'blue' : 'red'"
                        :label="item.loto ? 'LOTO 정보' : '밀폐 정보'"
                      />
                      <span class="work-location">{{ item.locationName }}</span>
                    </div>
                    <div v-if="!item.loto" class="work-info-content">
                      <div class="info-row">
                        <q-icon name="schedule" size="16px" class="q-mr-xs" />
                        <span>{{ item.workTime || '09:00 ~ 18:00' }}</span>
                      </div>
                      <div class="info-row">
                        <q-icon name="person" size="16px" class="q-mr-xs" />
                        <span>{{ item.worker || '작업자: 홍길동' }}</span>
                      </div>
                      <div class="info-row">
                        <q-icon name="info" size="16px" class="q-mr-xs" />
                        <span>{{ 'A 구역' + idx }}</span>
                      </div>
                    </div>
                    <div v-else class="work-info-content">
                      <div class="info-row">
                        <q-icon name="search" size="16px" class="q-mr-xs" />
                        <span>{{ '설비유형 ' + idx }}</span>
                      </div>
                      <div class="info-row">
                        <q-icon name="build" size="16px" class="q-mr-xs" />
                        <span>{{ '설비명 ' + idx }}</span>
                      </div>
                      <div class="info-row">
                        <q-icon name="info" size="16px" class="q-mr-xs" />
                        <span>{{ 'A 구역' + idx }}</span>
                      </div>
                    </div>
                  </div>
                </VueDraggableResizable>
              </q-carousel-slide>
            </q-carousel>
            <q-img v-else src="@images/no-image.png" class="no-image">
              <div class="absolute-bottom text-subtitle1 text-center">
                {{ $language('등록된 지도가 없습니다.') }}
              </div>
            </q-img>
          </div>
          <div v-if="!workPermitFlag" class="card-body">
            <q-table
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
                    <template v-if="props.col.name === 'a'">
                      <q-badge class="work-badge" color="primary" :label="props.value" outline />
                    </template>

                    <template v-else-if="props.col.name === 'b'">
                      <div class="attendee-list">
                        <q-icon name="lock" size="16px" class="q-mr-xs" />
                        {{ props.value }}
                      </div>
                    </template>

                    <template v-else-if="props.col.name === 'c'">
                      <q-badge class="permit-badge" color="orange" :label="props.value" />
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
</template>

<script setup lang="ts">
import { apexChartType } from '@/types/apexChart'
import VueDraggableResizable from 'vue-draggable-resizable'

interface propType {
  title: string
}
const props = withDefaults(defineProps<propType>(), {
  title: ''
})
const workPermitFlag = ref(true)
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

const columns = [
  { name: 'a', label: '설비명', field: 'a', align: 'center' },
  { name: 'b', label: '잠금장치', field: 'b', align: 'center' },
  { name: 'c', label: '설비위치', field: 'c', align: 'center' }
]

const rows = [
  {
    name: '작업허가서 1',
    a: '설비 #00001',
    b: '안전 자물쇠',
    c: '1층-A구역'
  },
  {
    name: '작업허가서 2',
    a: '설비 #00002',
    b: '케이블 잠금장치',
    c: '1층-B구역'
  },
  {
    name: '작업허가서 3',
    a: '설비 #00003',
    b: '밸브 잠금장치',
    c: '1층-C구역'
  },
  {
    name: '작업허가서 4',
    a: '설비 #00004',
    b: '그룹 잠금장치',
    c: '1층-D구역'
  },
  {
    name: '작업허가서 5',
    a: '설비 #00005',
    b: '안전태그',
    c: '1층-E구역'
  }
]

const mapObj = ref<any>({
  activeTask: 1,
  activeMarked: 0,
  selectedWorkPermit: {
    workPermits: []
  },
  envUrl: '',
  markInfoUrl: '',
  url: '',
  taskParam: {
    workPermitPeriod: []
  },
  maps: [],
  orignMaps: [],
  slide: 0,
  height: 800,
  ratio: 1,
  orignRatio: 1,
  endIdx: 1,
  loading: false
})

const carousel = ref<any>(null)
const interval = ref<any>(null)
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

const mapRate = computed(() => {
  return 0.78
})

onDeactivated(() => {
  // clearInterval(mapObj.value.interval.obj)
  clearInterval(interval.value)
})

onMounted(() => {
  init()
})

function init() {
  mapObj.value.url = selectConfig.main.map.url
  getMapData()
}

function getMapData(loading?: any) {
  clearInterval(interval.value)
  const defaultPlantCd = window.sessionStorage.getItem('defaultPlantCd')

  $http({
    url: mapObj.value.url,
    method: 'GET',
    params: {
      plantCd: defaultPlantCd,
      workPermitPeriod: ['2022-01-21', '2024-01-21']
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      /**
       * 지도는 1개
       */
      _.forEach(_result.data, (item) => {
        mapObj.value.endIdx = 1
        if (item.otherMaps && item.otherMaps.length > 0) {
          _.forEach(item.otherMaps, (map) => {
            map.idx = mapObj.value.endIdx
            mapObj.value.endIdx++
          })
        }
        if (item.maps && item.maps.length > 0) {
          _.forEach(item.maps, (map) => {
            map.idx = mapObj.value.endIdx
            mapObj.value.endIdx++
          })
        }
      })

      mapObj.value.maps = _.cloneDeep(_result.data)

      _.forEach(mapObj.value.maps, (_item) => {
        _.forEach(_item.maps, (__item) => {
          const idx = _.findIndex(__item.resultTypes, {
            sopWorkTypeCd: 'SSWT000001'
          })
          const idx1 = _.findIndex(__item.resultTypes, {
            sopWorkTypeCd: 'SSWT000020'
          })
          if (idx1 > -1) {
            __item['loto'] = true
          }
          if (idx === -1 && idx1 === -1) {
            _item.maps = _.reject(_item.maps, { idx: __item.idx })
          }
        })
      })

      mapObj.value.orignRatio = mapObj.value.maps[0].ratio

      carousel.value.style.setProperty('--map-ratio', mapObj.value.maps![0].ratio)

      mapObj.value.height = 550
      const resizeRatio = Math.round((mapObj.value.height / 575) * 100) / 100
      const _height = mapObj.value.height * mapRate.value
      carousel.value.style.setProperty('--map-height', String(_height) + 'px')
      mapObj.value.ratio = resizeRatio

      // 로딩바 제거
      if (loading) {
        mapObj.value.loading = false
      }
      const _idx = 0
      // interval.value = setInterval(() => {
      //   if (mapObj.value.activeTask === 1) {
      //     if (markedRefArray.value[_idx - 1]) markedRefArray.value[_idx - 1].hide()
      //     if (markedRefArray.value[_idx]) {
      //       if (mapObj.value.maps[0].maps[_idx]) {
      //         mapObj.value.selectedWorkPermit.workPermits =
      //           mapObj.value.maps[0].maps[_idx].resultTypes
      //       }
      //       markedRefArray.value[_idx].show()
      //     }
      //     if (mapObj.value.maps[0].maps.length + 1 == _idx) _idx = 0
      //     mapObj.value.activeMarked = _idx
      //     _idx++
      //   }
      // }, 3000)
    }
  })
}
// function onMarkedInfo(markedInfo: any) {
//   mapObj.value.selectedWorkPermit.workPermits = markedInfo.resultTypes
//   mapObj.value.activeMarked = markedInfo.idx
// }

// function setStepColor(swpStepCd: any) {
//   let color = ''
//   switch (swpStepCd) {
//     case 'SS00000005':
//       color = 'light-blue'
//       break
//     case 'SS00000010':
//       color = 'amber'
//       break
//     case 'SS00000020':
//       color = 'light-green'
//       break
//   }
//   return color
// }
// function setStepClass(swpStepCd: any) {
//   let _class = ''
//   switch (swpStepCd) {
//     case 'SS00000005':
//       _class = 'main-work-permit-card-light-blue'
//       break
//     case 'SS00000010':
//       _class = 'main-work-permit-card-amber'
//       break
//     case 'SS00000020':
//       _class = 'main-work-permit-card-light-green'
//       break
//   }
//   return _class
// }
</script>

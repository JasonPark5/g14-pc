<template>
  <div class="row bg-white">
    <div class="col-12">
      <c-search-box>
        <template v-slot:search>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant
              class="none-bottom"
              type="search"
              name="plantCd"
              v-model:value="searchParam.plantCd"
              @datachange="plantChange"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              :range="true"
              label="기간"
              type="month"
              name="period"
              v-model:value="period"
              @datachange="plantChange"
            />
          </div>
          <!-- <div
            class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
            style="padding-top: 15px !important"
          >
            <c-btn label="검색" icon="search" @btnClicked="plantChange" />
          </div> -->
        </template>
      </c-search-box>
      <div class="row">
        <div class="col-6">
          <apexcharts
            ref="yearRef"
            height="350"
            type="bar"
            :options="yearOcuurChart.options"
            :series="yearOcuurChart.series"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="seasonRef"
            height="350"
            type="bar"
            :options="seasonOcuurChart.options"
            :series="seasonOcuurChart.series"
          />
        </div>
      </div>
      <div class="col-12">
        <apexcharts
          ref="hourRef"
          height="350"
          type="line"
          :options="hourOcuurChart.options"
          :series="hourOcuurChart.series"
        />
      </div>
      <div class="row">
        <div class="col-6">
          <apexcharts
            ref="kindRef1"
            height="420"
            type="bar"
            :options="kindOcuurChart1.options"
            :series="kindOcuurChart1.series"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="kindRef2"
            height="420"
            :options="kindOcuurChart2.options"
            :series="kindOcuurChart2.series"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { apexChartType } from '@/types/apexChart'

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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'accidentStatus'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  plantCd: stringNull
  accidentTypeCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  plantCd: '',
  accidentTypeCd: null,
  startYmd: '',
  endYmd: ''
})
const yearOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      text: '년도별 공정사고 발생 건수'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val
      },
      offsetY: 0,
      style: {
        fontSize: '12px',
        colors: ['#fcfafa']
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: [
      '#008FFB',
      '#00E396',
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
    ],
    labels: {
      style: {
        colors: [
          '#008FFB',
          '#00E396',
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
        ],
        fontSize: '12px'
      }
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: '건'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return +val + ' 건'
        }
      }
    }
  },
  series: [],
  chartWidth: '80%'
})
const hourOcuurChart = ref<apexChartType>({
  options: {
    title: {
      text: '시간대별 공정사고 발생 건수'
    },
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val
      },
      offsetY: 0,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    stroke: {
      width: [5, 7, 5],
      curve: 'straight',
      dashArray: [0, 8, 5]
    },
    xaxis: {
      categories: [
        '00시',
        '01시',
        '02시',
        '03시',
        '04시',
        '05시',
        '06시',
        '07시',
        '08시',
        '09시',
        '10시',
        '11시',
        '12시',
        '13시',
        '14시',
        '15시',
        '16시',
        '17시',
        '18시',
        '19시',
        '20시',
        '21시',
        '22시',
        '23시'
      ]
    },
    yaxis: {
      title: {
        text: '건'
      }
    },
    fill: {
      opacity: 1
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 건'
        }
      }
    }
  },
  series: [],
  chartWidth: '80%'
})
const seasonOcuurChart = ref<apexChartType>({
  options: {
    title: {
      text: '계절별 공정사고 발생 건수'
    },
    colors: [
      '#008FFB',
      '#00E396',
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
    ],
    labels: {
      style: {
        colors: [
          '#008FFB',
          '#00E396',
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
        ],
        fontSize: '12px'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val
      },
      offsetY: 0,
      style: {
        fontSize: '12px',
        colors: ['#fcfafa']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['봄', '여름', '가을', '겨울']
    },
    yaxis: {
      title: {
        text: '건'
      }
    },
    fill: {
      opacity: 1
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return +val + ' 건'
        }
      }
    }
  },
  series: [],
  chartWidth: '80%'
})
const kindOcuurChart1 = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      text: '사고 유형별 발생 건수'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val
      },
      offsetY: 0,
      style: {
        fontSize: '12px',
        colors: ['#fcfafa']
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: [
      '#008FFB',
      '#00E396',
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
    ],
    labels: {
      style: {
        colors: [
          '#008FFB',
          '#00E396',
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
        ],
        fontSize: '12px'
      }
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 건'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    }
  },
  series: [],
  //  21, 12, 12, 15, 21, 12],
  chartWidth: '100%'
})
const kindOcuurChart2 = ref<apexChartType>({
  options: {
    chart: {
      width: 380,
      type: 'pie'
    },
    title: {
      text: '발생원인별 발생 건수'
    },
    colors: [
      '#008FFB',
      '#00E396',
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
    ],
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  },
  series: []
})
const period = ref([])
const yearUrl = ref('')
const hourUrl = ref('')
const seasonUrl = ref('')
const kindUrl1 = ref('')
const kindUrl2 = ref('')
const yearRef = ref<any>(null)
const seasonRef = ref<any>(null)
const hourRef = ref<any>(null)
const kindRef1 = ref<any>(null)
const kindRef2 = ref<any>(null)
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  yearUrl.value = selectConfig.sop.iim.accident.status.year.url
  hourUrl.value = selectConfig.sop.iim.accident.status.hour.url
  seasonUrl.value = selectConfig.sop.iim.accident.status.season.url
  kindUrl1.value = selectConfig.sop.iim.accident.status.kind1.url
  kindUrl2.value = selectConfig.sop.iim.accident.status.kind2.url
  // code setting
  // list setting
  getYearList()
  getHourList()
  getSeasonList()
  getKindList1()
  getKindList2()
  setTimeout(() => {
    setChartLabel()
  }, 300)
}
/******************************
 * TODO (목적): 차트 라벨 세팅
 *******************************/
function setChartLabel() {
  yearRef.value.updateOptions({
    title: {
      text: $language('년도별 공정사고 발생 건수')
    }
  })
  hourRef.value.updateOptions({
    title: {
      text: $language('시간대별 공정사고 발생 건수')
    }
  })
  seasonRef.value.updateOptions({
    title: {
      text: $language('계절별 공정사고 발생 건수')
    },
    xaxis: {
      categories: [$language('봄'), $language('여름'), $language('가을'), $language('겨울')]
    }
  })
  kindRef1.value.updateOptions({
    title: {
      text: $language('사고 유형별 발생 건수')
    }
  })
  kindRef2.value.updateOptions({
    title: {
      text: $language('발생원인별 발생 건수')
    }
  })
}
/******************************
 * TODO (목적): 년도별 조회
 *******************************/
function getYearList() {
  $http({
    url: yearUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const yearSeries: any = []
    const yearCategories: any = []
    _.forEach(_result.data, (_item) => {
      // 년도에 따른 idx를 구하여 series.data의 위치 통일
      if (yearCategories.indexOf(_item.occurYear) === -1) {
        yearCategories.push(_item.occurYear)
      }
      const idx = yearCategories.indexOf(_item.occurYear)
      if (_.findIndex(yearSeries, { plantCd: _item.plantCd }) === -1) {
        const _data: any = []
        _.forEach(yearCategories, (_item) => {
          _data.push(0)
        })

        yearSeries.push({
          plantCd: _item.plantCd,
          name: _item.plantName,
          data: _data
        })
      }
      yearSeries[_.findIndex(yearSeries, { plantCd: _item.plantCd })].data[idx] = _item.yearCount
    })

    yearRef.value.updateOptions({
      xaxis: {
        categories: yearCategories
      }
    })
    yearRef.value.updateSeries(yearSeries)
  })
}
/******************************
 * TODO (목적): 시간별 조회
 *******************************/
function getHourList() {
  $http({
    url: hourUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const hourSeries: any = []

    _.forEach(_result.data, (_item) => {
      // 년도에 따른 idx를 구하여 series.data의 위치 통일
      const idx = hourOcuurChart.value.options.xaxis.categories.indexOf(_item.occurTime)
      if (_.findIndex(hourSeries, { plantCd: _item.plantCd }) === -1) {
        hourSeries.push({
          plantCd: _item.plantCd,
          name: _item.plantName,
          //24개
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
      }

      hourSeries[_.findIndex(hourSeries, { plantCd: _item.plantCd })].data[idx] = _item.timeCount
    })

    hourRef.value.updateSeries(hourSeries)
  })
}
/******************************
 * TODO (목적): 계절별 조회
 *******************************/
function getSeasonList() {
  $http({
    url: seasonUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const seasonrSeries: any = []

    _.forEach(_result.data, (_item) => {
      // 년도에 따른 idx를 구하여 series.data의 위치 통일
      let idx = 0
      if (_item.occurMonth === '12' || _item.occurMonth === '01' || _item.occurMonth === '02') {
        idx = 3
      } else if (
        _item.occurMonth === '03' ||
        _item.occurMonth === '04' ||
        _item.occurMonth === '05'
      ) {
        idx = 0
      } else if (
        _item.occurMonth === '06' ||
        _item.occurMonth === '07' ||
        _item.occurMonth === '08'
      ) {
        idx = 1
      } else if (
        _item.occurMonth === '09' ||
        _item.occurMonth === '10' ||
        _item.occurMonth === '11'
      ) {
        idx = 2
      }

      if (_.findIndex(seasonrSeries, { plantCd: _item.plantCd }) === -1) {
        seasonrSeries.push({
          plantCd: _item.plantCd,
          name: _item.plantName,
          data: [0, 0, 0, 0]
        })
      }
      seasonrSeries[_.findIndex(seasonrSeries, { plantCd: _item.plantCd })].data[idx] += Number(
        _item.monthCount
      )
    })

    seasonRef.value.updateSeries(seasonrSeries)
  })
}
/******************************
 * TODO (목적): 사고유형별 조회
 *******************************/
function getKindList1() {
  $http({
    url: kindUrl1.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    let kindSeries: any = []
    const kindCategories: any = []
    const _data: any = []
    _.forEach(_result.data, (_item) => {
      _.forEach(_item.accidentKindName.split(','), (__item) => {
        const idx = kindCategories.indexOf(__item)
        if (idx === -1) {
          kindCategories.push(__item)
          _data.push(Number(_item.kindCount))
        } else {
          _data[idx] = Number(_data[idx]) + Number(_item.kindCount)
        }
      })
    })
    kindSeries = [{ data: _data, name: $language('발생 건수') }]

    kindRef1.value.updateOptions({
      xaxis: {
        categories: kindCategories
      }
    })
    kindRef1.value.updateSeries(kindSeries)
  })
}
/******************************
 * TODO (목적): 발생원인별 조회
 *******************************/
function getKindList2() {
  $http({
    url: kindUrl2.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const kindSeries: any = []
    const kindLabels: any = []
    _.forEach(_result.data, (_item) => {
      kindLabels.push(_item.occurCauseName)
      kindSeries.push(Number(_item.occurCauseCount))
    })

    kindRef2.value.updateOptions({
      labels: kindLabels
    })
    kindRef2.value.updateSeries(kindSeries)
  })
}
/******************************
 * TODO (목적): 사업장 변경
 *******************************/
function plantChange() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  if (searchParam.value.plantCd.split(',').length > 1) {
    yearRef.value.updateOptions({
      plotOptions: {
        bar: {
          distributed: false
        }
      }
    })
    seasonRef.value.updateOptions({
      plotOptions: {
        bar: {
          distributed: false
        }
      }
    })
  } else {
    yearRef.value.updateOptions({
      plotOptions: {
        bar: {
          distributed: true
        }
      }
    })
    seasonRef.value.updateOptions({
      plotOptions: {
        bar: {
          distributed: true
        }
      }
    })
  }
  getYearList()
  getHourList()
  getSeasonList()
  getKindList1()
  getKindList2()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.el-cascader-menu__wrap
  height: calc(var(--cascader-height-var)) !important
.dashborad
  .customCardbody
    padding: 0px !important
    margin: 0px !important

// .el-cascader-node
//   padding: 0 30px 0 5px !important
// .el-cascader-menu
//   min-width: auto
// .el-cascader-node__label
//   padding: 0px !important
.grid-menu [class*=col-]
  border-width: 0 !important
  // border-right: #dee2e6 solid 0 !important
  // border-bottom: #dee2e6 solid 1px !important
  padding: 0px !important
.widget-yearOcuurChart
  padding: 5px !important
.widget-yearOcuurChart .widget-numbers
  margin: 12px !important

.none-bottom
  .q-field--with-bottom
    padding-bottom: 0px !important

.app-main__inner .riskassess-dashboard
  .row [class*=col-]
    padding: 0px !important

.accidentChart
  padding: 20px !important
  border: 1px solid #dee2e6
  border-top: 3px solid #dee2e6
</style>
<style scoped>
.blinking {
  -webkit-animation: blink 1s ease-in-out infinite alternate;
  -moz-animation: blink 1s ease-in-out infinite alternate;
  animation: blink 1s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

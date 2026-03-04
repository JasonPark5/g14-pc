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
              type="year"
              name="period"
              defaultStart="-2y"
              defaultEnd="0y"
              v-model:value="period"
              @datachange="plantChange"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3" style="padding-top:5px !important;">
            <c-btn label="검색" icon="search" @btnClicked="plantChange" />
          </div> -->
        </template>
      </c-search-box>
      <div class="row">
        <div class="col-12">
          <apexcharts
            ref="bountyRef"
            height="350"
            :options="bountyOcuurChart.options"
            :series="bountyOcuurChart.series"
          />
        </div>
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
            ref="kindRef"
            height="380"
            :options="kindOcuurChart.options"
            :series="kindOcuurChart.series"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="stateRef"
            height="350"
            :options="stateOcuurChart.options"
            :series="stateOcuurChart.series"
            @dataPointSelection="stateSelectedBar"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="stateDetailRef"
            height="350"
            :options="stateDetailOcuurChart.options"
            :series="stateDetailOcuurChart.series"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="largeFormRef"
            height="350"
            type="bar"
            :options="largeFormOcuurChart.options"
            :series="largeFormOcuurChart.series"
            @dataPointSelection="formSelectedBar"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="smallFormRef"
            height="350"
            type="bar"
            :options="smallFormOcuurChart.options"
            :series="smallFormOcuurChart.series"
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
  name: 'nearAccidentStatus'
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
const searchParam = ref({
  plantCd: '',
  startYmd: '',
  endYmd: '',
  iimUpOccurMasterId: ''
})
// const colors = ref([
//   '#008FFB',
//   '#00E396',
//   '#FEB019',
//   '#FF4560',
//   '#775DD0',
//   '#3F51B5',
//   '#03A9F4',
//   '#4CAF50',
//   '#F9CE1D',
//   '#FF9800',
//   '#A300D6',
//   '#5653FE',
//   '#1B998B',
//   '#F86624',
//   '#13D8AA'
// ])

const bountyOcuurChart = ref<apexChartType>({
  options: {
    title: {
      text: '부서별 포상금 통계'
    },
    chart: {
      height: 350,
      type: 'line',
      // dropShadow: {
      //   enabled: true,
      //   color: '#000',
      //   top: 18,
      //   left: 7,
      //   blur: 10,
      //   opacity: 0.2
      // },
      stacked: false,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined
    },
    stroke: {
      width: [0, 4]
    },
    xaxis: {
      categories: []
    },
    yaxis: [
      {
        min: 0,
        title: {
          text: '포상금 합계'
        }
      },
      {
        opposite: true,
        title: {
          text: '건 수'
        }
      }
    ],
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
          return +val.toFixed(0)
        }
      }
    }
  },
  series: [
    {
      name: '포상금 합계',
      type: 'column',
      data: []
    },
    {
      name: '건 수',
      type: 'line',
      data: []
    }
  ],
  chartWidth: '80%'
})

const yearOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      text: '년도별 아차사고 발생건수'
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
const kindOcuurChart = ref<apexChartType>({
  options: {
    title: {
      text: '종류별 아차사고 발생건수'
    },
    chart: {
      type: 'polarArea'
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
    legend: {
      position: 'bottom'
    },
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
    ],
    // fill: {
    //   type: 'gradient'
    // },
    yaxis: [
      {
        labels: {
          formatter: function (val: any) {
            return Number.isInteger(Number(val)) ? Number(val).toFixed(0) : Number(val).toFixed(1)
          }
        }
      }
    ]
  },
  series: [
    {
      name: '',
      data: []
    }
  ],
  chartWidth: '80%'
})
const stateOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      text: '사고발생시 상태별 발생건수'
    },
    subtitle: {
      text: '※그래프 막대 클릭시 오른쪽의 그래프를 조회하실 수 있습니다.',
      style: {
        color: '#FF4560'
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
      categories: ['인지기능', '사고기능', '감정', '설비요인', '관리요인']
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
  // '인지기능', '사고기능', '감정', '설비요인', '관리요인'
  series: [
    {
      name: '',
      data: []
    }
  ],
  chartWidth: '80%'
})
const stateDetailOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      // 사고발생시 상태분류별 발생건수
      text: '',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: undefined,
        color: '#263238'
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
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
      annotations: [],
      categories: []
    },
    yaxis: {
      // title: {
      //   text: '건'
      // }
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
  series: [
    {
      name: '',
      data: []
    }
  ],
  chartWidth: '80%'
})
const largeFormOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      text: '발생가능형태별(대분류) 발생건수'
    },
    subtitle: {
      text: '※그래프 막대 클릭시 오른쪽의 그래프를 조회하실 수 있습니다.',
      style: {
        color: '#FF4560'
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
      annotations: [],
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
  series: [
    {
      name: '',
      data: []
    }
  ],
  chartWidth: '80%'
})
const smallFormOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
    },
    title: {
      // 발생가능형태별(중분류) 발생건수
      text: ''
    },
    plotOptions: {
      bar: {
        horizontal: true,
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
      // title: {
      //   text: '건'
      // }
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
  series: [
    {
      name: '',
      data: []
    }
  ],
  chartWidth: '80%'
})
const period = ref(['', ''])
const yearUrl = ref('')
const kindUrl = ref('')
const stateUrl = ref('')
const bountyUrl = ref('')
const stateDetailUrl = ref('')
const largeFormUrl = ref('')
const smallFormUrl = ref('')
const codeGrpCd = ref('')
const upKey = ref('')
const nearCodeItems = ref([
  'IIM_NEARMISS_DISCERN',
  'IIM_NEARMISS_FUNCTION',
  'IIM_NEARMISS_FEEL',
  'IIM_NEARMISS_EQUIP',
  'IIM_NEARMISS_MANAGE'
])
const bountyRef = ref<any>(null)
const yearRef = ref<any>(null)
const kindRef = ref<any>(null)
const stateRef = ref<any>(null)
const stateDetailRef = ref<any>(null)
const largeFormRef = ref<any>(null)
const smallFormRef = ref<any>(null)
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
  bountyUrl.value = selectConfig.sop.iim.accident.near.status.bounty.url
  yearUrl.value = selectConfig.sop.iim.accident.near.status.year.url
  kindUrl.value = selectConfig.sop.iim.accident.near.status.kind.url
  stateUrl.value = selectConfig.sop.iim.accident.near.status.state.url
  stateDetailUrl.value = selectConfig.sop.iim.accident.near.status.statedetail.url
  largeFormUrl.value = selectConfig.sop.iim.accident.near.status.form.large.url
  smallFormUrl.value = selectConfig.sop.iim.accident.near.status.form.small.url
  // code setting
  const prevYear: stringNull = getPrevYear(2)
  const thisYear: stringNull = getThisYear()
  period.value = [prevYear, thisYear]
  searchParam.value.startYmd = period.value[0]
  searchParam.value.endYmd = period.value[1]
  // list setting
  setTimeout(() => {
    setChartLabel()
    getBountyList()
    getYearList()
    getKindList()
    getStateList()
    getLargeFormList()
  }, 300)
}
/******************************
 * TODO (목적): 차트 라벨 세팅
 *******************************/
function setChartLabel() {
  bountyRef.value.updateOptions({
    title: {
      text: $language('부서별 포상금 통계')
    },
    yaxis: [
      {
        title: {
          text: $language('포상금 합계')
        }
      },
      {
        title: {
          text: $language('건 수')
        }
      }
    ]
  })

  bountyRef.value.updateSeries([
    {
      name: $language('포상금 합계'),
      type: 'column',
      data: []
    },
    {
      name: $language('건 수'),
      type: 'line',
      data: []
    }
  ])

  yearRef.value.updateOptions({
    title: {
      text: $language('년도별 아차사고 발생건수')
    }
  })

  kindRef.value.updateOptions({
    title: {
      text: $language('종류별 아차사고 발생건수')
    }
  })

  stateRef.value.updateOptions({
    title: {
      text: $language('사고발생시 상태별 발생건수')
    },
    subtitle: {
      title: $language('※그래프 막대 클릭시 오른쪽의 그래프를 조회하실 수 있습니다.')
    },
    xaxis: {
      categories: [
        $language('인지기능'),
        $language('사고기능'),
        $language('감정'),
        $language('설비요인'),
        $language('관리요인')
      ]
    }
  })

  stateDetailRef.value.updateOptions({
    title: {
      text: $language('사고발생시 상태분류별 발생건수')
    }
  })

  largeFormRef.value.updateOptions({
    title: {
      text: $language('발생가능형태별(대분류) 발생건수')
    },
    subtitle: {
      title: $language('※그래프 막대 클릭시 오른쪽의 그래프를 조회하실 수 있습니다.')
    }
  })
  smallFormRef.value.updateOptions({
    title: {
      text: $language('발생가능형태별(중분류) 발생건수')
    }
  })
}

/******************************
 * TODO (목적): 보상금 차트 조회
 *******************************/
function getBountyList() {
  $http({
    url: bountyUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    bountyRef.value.updateOptions({
      xaxis: {
        categories: _.map(_result.data, 'deptName')
      }
    })
    bountyRef.value.updateSeries([
      {
        data: _.map(_result.data, 'bountyCost'),
        name: ''
      },
      {
        data: _.map(_result.data, 'bountyCnt'),
        name: ''
      }
    ])
  })
}
/******************************
 * TODO (목적): 년도별 차트 조회
 *******************************/
function getYearList() {
  $http({
    url: yearUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const yearSeries: any = []
    const yearCategories: any = []
    // this.$_.forEach(_result.data, _item => {
    //   yearCategories.push(_item.occurYear)
    // })
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
 * TODO (목적): 종류별 차트 조회
 *******************************/
function getKindList() {
  $http({
    url: kindUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    kindRef.value.updateOptions({
      labels: _.map(_result.data, 'iimNearKindName')
    })
    kindRef.value.updateSeries(_.map(_result.data, 'kindCount'))
  })
}
/******************************
 * TODO (목적): 상태별 차트 조회
 *******************************/
function getStateList() {
  $http({
    url: stateUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const data = _result.data
    if (data && data.length > 0) {
      stateRef.value.updateSeries([
        {
          data: [
            data[0].discernCount,
            data[0].functionCount,
            data[0].feelCount,
            data[0].equipCount,
            data[0].manageCount
          ],
          name: ''
        }
      ])
    }
  })
}
/******************************
 * TODO (목적): 상태상세별 차트 조회
 *******************************/
function getStateDetailList() {
  if (!codeGrpCd.value) return
  $http({
    url: stateDetailUrl.value,
    method: 'GET',
    params: {
      plantCd: searchParam.value.plantCd,
      startYmd: searchParam.value.startYmd,
      endYmd: searchParam.value.endYmd,
      codeGrpCd: codeGrpCd.value
    }
  }).then((_result: any) => {
    stateDetailRef.value.updateOptions({
      xaxis: {
        categories: _.map(_.reject(_result.data, { stateCd: '' }), 'stateName')
      }
    })
    stateDetailRef.value.updateSeries([
      {
        data: _.map(_result.data, 'stateCount'),
        name: ''
      }
    ])
  })
}
/******************************
 * TODO (목적): 대분류 차트 조회
 *******************************/
function getLargeFormList() {
  $http({
    url: largeFormUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    largeFormRef.value.updateOptions({
      xaxis: {
        categories: _.map(_result.data, 'occurName'),
        annotations: _.map(_result.data, 'iimOccurMasterId')
      }
    })
    largeFormRef.value.updateSeries([
      {
        data: _.map(_result.data, 'largeCount'),
        name: ''
      }
    ])
  })
}
/******************************
 * TODO (목적): 중분류 차트 조회
 *******************************/
function getSmallFormList() {
  if (!upKey.value) return
  $http({
    url: smallFormUrl.value,
    method: 'GET',
    params: {
      plantCd: searchParam.value.plantCd,
      startYmd: searchParam.value.startYmd,
      endYmd: searchParam.value.endYmd,
      iimUpOccurMasterId: upKey.value
    }
  }).then((_result: any) => {
    smallFormRef.value.updateOptions({
      xaxis: {
        categories: _.map(_result.data, 'occurName')
      }
    })
    smallFormRef.value.updateSeries([
      {
        data: _.map(_result.data, 'smallCount'),
        name: ''
      }
    ])
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
  getYearList()
  getKindList()
  getStateList()
  getLargeFormList()

  stateDetailRef.value.updateOptions({
    xaxis: {
      categories: []
    }
  })
  stateDetailRef.value.updateSeries([
    {
      data: [],
      name: ''
    }
  ])

  smallFormRef.value.updateOptions({
    xaxis: {
      categories: []
    }
  })
  smallFormRef.value.updateSeries([
    {
      data: [],
      name: ''
    }
  ])
}
/******************************
 * TODO (목적): 대분류 차트 클릭
 *******************************/
function formSelectedBar(e: any, chart: any, opts: any) {
  upKey.value = opts.w.config.xaxis.annotations[opts.dataPointIndex]
  getSmallFormList()
}
/******************************
 * TODO (목적): 상태 차트 클릭
 *******************************/
function stateSelectedBar(e: any, chart: any, opts: any) {
  codeGrpCd.value = nearCodeItems.value[opts.dataPointIndex]
  getStateDetailList()
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant required type="none" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            name="search"
            type="year"
            label="교육년도"
            default="today"
            v-model:value="searchParam.educationYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="EDU_KIND_FST_CD"
            type="none"
            default="first"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdLarge"
            label="교육종류1"
            v-model:value="searchParam.educationKindCdLarge"
            @setCodeData="getList"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1" style="margin-top: 24px">
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </div>
      </template>
    </c-search-box>
    <q-card flat bordered>
      <div class="col-12" style="background: #fff; padding: 20px">
        <apexcharts
          ref="eduRefChart"
          height="300"
          type="bar"
          :options="eduChart.options"
          :series="eduChart.series"
          @dataPointSelection="selectedBar"
        />
      </div>
    </q-card>
    <q-card flat bordered style="margin: 10px auto">
      <div class="col-12" style="background: #fff; padding: 20px">
        <apexcharts
          ref="eduRefChartDetail"
          height="350"
          type="bar"
          :options="eduChartDetail.options"
          :series="eduChartDetail.series"
        />
      </div>
    </q-card>
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
import { apexChartType } from '@/types/apexChart'
import { annualCommonSearchParamType } from '../annualEduPlan'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationTrendAnalysisGraph'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
const searchParam = ref<annualCommonSearchParamType>({
  plantCd: null,
  // educationYear: '2022',
  educationKindCdLarge: null
})
const eduChart = ref<apexChartType>({
  series: [
    {
      id: 'checkCompleteCnt',
      name: '이수',
      data: []
    },
    {
      id: 'checkCompleteCntNone',
      name: '미이수',
      data: []
    }
  ],
  options: {
    annotations: {
      xaxis: []
    },
    chart: {
      width: '100%',
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: ['#00BCD4', '#F44336'],
    stroke: {
      show: true
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 명'
        }
      }
    },
    title: {
      text: '교육과정별 이수/미이수 인원 현황',
      offsetX: 15
    },
    subtitle: {
      text: '[Bar를 클릭시 월별 이수/미이수 인원 현황을 볼 수 있습니다.]',
      offsetX: 15
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

  seriesQuarter: [
    {
      data: []
    }
  ]
})
const eduChartDetail = ref<apexChartType>({
  series: [
    {
      id: 'checkCompleteCnt',
      name: '이수',
      data: []
    },
    {
      id: 'checkCompleteCntNone',
      name: '미이수',
      data: []
    }
  ],
  options: {
    annotations: {
      xaxis: []
    },
    chart: {
      width: '100%',
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: ['#00BCD4', '#F44336'],
    stroke: {
      show: true
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 명'
        }
      }
    },
    title: {
      text: '월별 교육 이수/미이수 현황',
      offsetX: 15
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

  seriesQuarter: [
    {
      data: []
    }
  ]
})
const copyYear = ref('')
const listUrl = ref('')
const detailUrl = ref('')
const rate = ref<any>([])
const detailRate = ref<any>([])
const eduRefChart = ref<any>(null)
const eduRefChartDetail = ref<any>(null)
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
  listUrl.value = selectConfig.sop.edu.annual.trendgraph.list.url
  detailUrl.value = selectConfig.sop.edu.annual.trendgraph.get.url
  // code setting
  // list setting
  searchParam.value.educationYear = '2021'
  setTimeout(() => {
    setChart()
  }, 200)
}
/******************************
 * TODO (목적): 차트 커스텀
 *******************************/
function setChart() {
  eduRefChart.value.updateOptions({
    title: {
      text: $language('교육과정별 이수/미이수 인원 현황')
    },
    subtitle: {
      text: $language('[Bar를 클릭시 월별 이수/미이수 인원 현황을 볼 수 있습니다.]')
    }
  })
  eduRefChartDetail.value.updateOptions({
    title: {
      text: $language('월별 교육 이수/미이수 현황')
    }
  })

  eduRefChart.value.updateSeries([
    {
      id: 'checkCompleteCnt',
      name: $language('이수'),
      data: []
    },
    {
      id: 'checkCompleteCntNone',
      name: $language('미이수'),
      data: []
    }
  ])
  eduRefChartDetail.value.updateSeries([
    {
      id: 'checkCompleteCnt',
      name: $language('이수'),
      data: []
    },
    {
      id: 'checkCompleteCntNone',
      name: $language('미이수'),
      data: []
    }
  ])
  getList()
}
/******************************
 * TODO (목적): 교육과정별 이수현황 그래프 조회
 *******************************/
function getList() {
  if (!searchParam.value.educationYear) {
    message.alert({
      title: '안내',
      message: '교육년도를 선택하세요.', // 교육년도를 선택하세요.
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // 월별 현황 초기화
  _.forEach(eduChartDetail.value.series, (item) => {
    item.data = ['', '', '', '', '', '', '', '', '', '', '', '']
  })
  eduRefChartDetail.value.updateOptions({
    annotations: {
      xaxis: []
    }
  })
  rate.value = []
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    copyYear.value = _.cloneDeep(searchParam.value.educationYear)
    let taskIdx = 0
    _.forEach(_result.data, (task) => {
      _.forEachRight(eduChart.value.series, (item) => {
        if (!rate.value[taskIdx] && task[item.id] > 0) {
          rate.value[taskIdx] =
            task.checkCompleteTotal > 0
              ? String(_.round((task.checkCompleteCnt / task.checkCompleteTotal) * 100)) + '%'
              : '0%'
        }
      })
      taskIdx++
    })
    _.forEach(eduChart.value.series, (item) => {
      item.data = _.map(_result.data, item.id)
    })
    const xaxis = _.map(_result.data, 'educationCourseName')
    const ids = _.map(_result.data, 'eduCourseId')
    const annotations: any = []
    rate.value.forEach((r: any, idx: number) => {
      // xaxis[idx] += (r ? '(' + r + ')' : '');
      annotations[idx] = {
        x: xaxis[idx],
        id: ids[idx],
        strokeDashArray: 0,
        borderColor: '#EEEEEE',
        borderWidth: 0,
        label: {
          borderColor: 'transparent',
          orientation: 'horizontal',
          style: {
            color: '#775DD0',
            fontSize: '12px',
            background: 'transparent'
          },
          text: r ? r : ''
          // text: r ? '이행률 : ' + r : '',
        }
      }
    })
    xaxis.forEach((x, idx) => {
      if (!annotations[idx]) {
        annotations[idx] = {
          x: x,
          id: '',
          strokeDashArray: 0,
          borderColor: '#EEEEEE',
          borderWidth: 0,
          // borderColor: '#775DD0',
          label: {
            borderColor: 'transparent',
            orientation: 'horizontal',
            style: {
              color: '#775DD0',
              fontSize: '12px',
              background: 'transparent'
            },
            text: ''
          }
        }
      }
    })

    eduRefChart.value.updateOptions({
      annotations: {
        xaxis: annotations
      },
      xaxis: {
        categories: xaxis
      }
    })
  })
}
/******************************
 * TODO (목적): 교육과정별 이수현황 그래프 클릭 시 상세 조회
 *******************************/
function selectedBar(e: any, chart: any, opts: any) {
  detailRate.value = []
  $http({
    url: $format(
      detailUrl.value,
      copyYear.value,
      opts.w.config.annotations.xaxis[opts.dataPointIndex].id
    ),
    method: 'GET'
  }).then((_result: any) => {
    let taskIdx = 0
    const complete = _result.data.completeList
    const noComplete = _result.data.noCompleteList
    for (let i = 1; i <= 12; i++) {
      if (!detailRate.value[taskIdx]) {
        detailRate.value[taskIdx] =
          complete['cnt' + i] + noComplete['cnt' + i] > 0
            ? String(
                _.round((complete['cnt' + i] / (complete['cnt' + i] + noComplete['cnt' + i])) * 100)
              ) + '%'
            : ''
      }
      taskIdx++
    }
    _.forEach(eduChartDetail.value.series, (item) => {
      if (item.id === 'checkCompleteCnt') {
        item.data = [
          complete.cnt1,
          complete.cnt2,
          complete.cnt3,
          complete.cnt4,
          complete.cnt5,
          complete.cnt6,
          complete.cnt7,
          complete.cnt8,
          complete.cnt9,
          complete.cnt10,
          complete.cnt11,
          complete.cnt12
        ]
      } else {
        item.data = [
          noComplete.cnt1,
          noComplete.cnt2,
          noComplete.cnt3,
          noComplete.cnt4,
          noComplete.cnt5,
          noComplete.cnt6,
          noComplete.cnt7,
          noComplete.cnt8,
          noComplete.cnt9,
          noComplete.cnt10,
          noComplete.cnt11,
          noComplete.cnt12
        ]
      }
    })
    const xaxis = [
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
    const annotations: any = []
    detailRate.value.forEach((r: any, idx: number) => {
      // xaxis[idx] += (r ? '(' + r + ')' : '');
      annotations[idx] = {
        x: xaxis[idx],
        strokeDashArray: 0,
        borderColor: '#EEEEEE',
        borderWidth: 0,
        label: {
          borderColor: 'transparent',
          orientation: 'horizontal',
          style: {
            color: '#775DD0',
            fontSize: '12px',
            background: 'transparent'
          },
          text: r ? r : ''
          // text: r ? '이행률 : ' + r : '',
        }
      }
    })
    xaxis.forEach((x, idx) => {
      if (!annotations[idx]) {
        annotations[idx] = {
          x: x,
          strokeDashArray: 0,
          borderColor: '#EEEEEE',
          borderWidth: 0,
          // borderColor: '#775DD0',
          label: {
            borderColor: 'transparent',
            orientation: 'horizontal',
            style: {
              color: '#775DD0',
              fontSize: '12px',
              background: 'transparent'
            },
            text: ''
          }
        }
      }
    })

    eduRefChartDetail.value.updateOptions({
      annotations: {
        xaxis: annotations
      },
      xaxis: {
        categories: xaxis
      },
      title: {
        text: opts.w.config.annotations.xaxis[opts.dataPointIndex].x + ' ' + $language('월별 현황')
      }
    })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div class="row bg-white">
    <div class="col-12">
      <apexcharts
        ref="largeFormRef"
        height="150"
        type="bar"
        :options="largeFormOcuurChart.options"
        :series="largeFormOcuurChart.series"
      />
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
  name: 'nearAccidentDiscovering'
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

const largeFormOcuurChart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar'
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
      '#1E90FF', // DodgerBlue
      '#00BFFF', // DeepSkyBlue
      '#4682B4', // SteelBlue
      '#5F9EA0', // CadetBlue
      '#6495ED', // CornflowerBlue
      '#87CEEB', // SkyBlue
      '#40E0D0', // Turquoise
      '#20B2AA', // LightSeaGreen
      '#008B8B', // DarkCyan
      '#008080', // Teal
      '#00FA9A', // MediumSpringGreen
      '#00FF7F', // SpringGreen
      '#3CB371', // MediumSeaGreen
      '#2E8B57', // SeaGreen
      '#006400' // DarkGreen
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      show: false,
      offsetY: -25,
      offsetX: -5
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
const period = ref(['', ''])
const largeFormUrl = ref('')
const largeFormRef = ref<any>(null)
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
  largeFormUrl.value = selectConfig.sop.iim.accident.near.status.form.large.url
  // code setting

  // 데이터 있는 기준으로 23~25년
  const prevYear: stringNull = getPrevYear(2)
  const thisYear: stringNull = getThisYear()
  period.value = [prevYear, thisYear]
  searchParam.value.startYmd = period.value[0]
  searchParam.value.endYmd = period.value[1]
  // list setting
  setTimeout(() => {
    setChartLabel()
    getLargeFormList()
  }, 300)
}
/******************************
 * TODO (목적): 차트 라벨 세팅
 *******************************/
function setChartLabel() {}

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

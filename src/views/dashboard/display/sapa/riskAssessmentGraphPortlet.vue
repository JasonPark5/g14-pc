<template>
  <div class="row bg-white">
    <div class="col-12">
      <apexcharts
        ref="riskChartRef"
        height="300"
        type="line"
        :options="riskChart.options"
        :series="riskChart.series"
      />
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
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskAssessmentGraphPortlet'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  commonSearchParam: {
    plantCd: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
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
const editable = ref(true)
const riskChartRef = ref<any>(null)
const listUrl = ref('')
const riskChart = ref<apexChartType>({
  options: {
    annotations: {
      yaxis: []
    },
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: [
      '#1E90FF', // DodgerBlue
      '#FFA500', // Orange
      '#4169E1', // RoyalBlue
      '#FF8C00', // DarkOrange
      '#00BFFF' // DeepSkyBlue
    ],
    xaxis: {
      categories: []
    },
    yaxis: [
      {
        title: {
          text: $language('위험도')
        },
        labels: {
          formatter: function (val: any) {
            return Number.isInteger(val)
              ? val.toFixed(0) + $language(' 건')
              : val.toFixed(1) + $language(' 건')
          }
        }
      }
    ],
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    markers: {
      size: 1
    }
  },
  series: [] as any[]
})
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
  listUrl.value = selectConfig.monitor.krasRiskYear.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      const years = Object.keys(_result.data[0])
        .map((key) => {
          return key.indexOf('riskCount') > -1 && key.replace('riskCount', '')
        })
        .filter((data) => data !== false)
        .sort()
      riskChartRef.value.updateSeries(
        _.map(_result.data, (item) => {
          return {
            name: item.riskContents,
            data: _.map(years, (year) => {
              return item[`riskCount${year}`]
            })
          }
        })
      )
      riskChartRef.value.updateOptions({
        colors: _.map(_result.data, 'color'),
        xaxis: {
          categories: years
        }
      })
    } else {
      riskChartRef.value.updateSeries([])
      riskChartRef.value.updateOptions({
        colors: [],
        xaxis: {
          categories: []
        }
      })
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

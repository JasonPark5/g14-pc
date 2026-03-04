<template>
  <div>
    <apexcharts
      ref="vendorChartRef"
      height="250"
      :options="vendorChart"
      :series="vendorChart.series"
    />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'vendorEvaluationPortlet'
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
const vendorChart = ref({
  series: [
    {
      name: 'A등급',
      data: [44, 55, 41, 37, 22, 43, 21]
    },
    {
      name: 'B등급',
      data: [53, 32, 33, 52, 13, 43, 32]
    },
    {
      name: 'C등급',
      data: [12, 17, 11, 9, 15, 11, 20]
    },
    {
      name: 'D등급',
      data: [9, 7, 5, 8, 6, 9, 4]
    }
  ],
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    },
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
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014]
  },
  yaxis: {
    title: {
      text: undefined
    }
  },
  tooltip: {
    y: {
      formatter: function () {
        return ''
      }
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  }
})
const vendorChartRef = ref<any>(null)
const listUrl = ref('')

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
  listUrl.value = selectConfig.monitor.vendorEvaluationYear.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 도급업체 평가 차트 데이터 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      const years = Object.keys(_result.data[0])
        .map((key) => {
          return key.indexOf('evalCount') > -1 && key.replace('evalCount', '')
        })
        .filter((data) => data !== false)
        .sort()
      vendorChartRef.value.updateSeries(
        _.map(_result.data, (item) => {
          return {
            name: item.evaluationGradeName,
            data: _.map(years, (year) => {
              return item[`evalCount${year}`]
            })
          }
        })
      )
      vendorChartRef.value.updateOptions({
        xaxis: {
          categories: years
        }
      })
    } else {
      vendorChartRef.value.updateSeries([])
      vendorChartRef.value.updateOptions({
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

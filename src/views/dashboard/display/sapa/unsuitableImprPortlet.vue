<template>
  <div>
    <apexcharts
      ref="imprChartRef"
      height="250"
      type="bar"
      :options="imprChart.options"
      :series="imprChart.series"
    />
  </div>
</template>

<script setup lang="ts">
import { apexChartType } from '@/types/apexChart'

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
  name: 'unsuitableImprPortlet'
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
const imprChart = ref<apexChartType>({
  options: {
    annotations: {
      xaxis: []
    },
    title: {
      // text: '업무별 개선 현황'
    },
    chart: {
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
          return val + ' 건'
        }
      }
    },
    colors: ['#FFC107', '#00BCD4', '#F44336'],
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -5,
      offsetX: -5
    }
  },
  series: []
})
const imprChartRef = ref<any>(null)
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
  listUrl.value = selectConfig.monitor.unsuitableImprStatus.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 부적합 개선 이행율 차트 데이터 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    imprChartRef.value.updateSeries([
      {
        name: $language('조치중'),
        data: _.map(_result.data, 'actionCount')
      },
      {
        name: $language('개선완료'),
        data: _.map(_result.data, 'completeCount')
      },
      {
        name: $language('지연'),
        data: _.map(_result.data, 'delayCount')
      }
    ])
    imprChartRef.value.updateOptions({
      xaxis: {
        categories: _.map(_result.data, 'ibmTaskTypeName')
      },
      annotations: {
        xaxis: _.map(_result.data, (item) => {
          return {
            x: item.ibmTaskTypeName,
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
              text:
                item.totalCount > 0 &&
                (item.actionCount > 0 || item.delayCount > 0 || item.completeCount > 0)
                  ? String(Math.round((item.completeCount / item.totalCount) * 100)) + '%'
                  : ''
            }
          }
        })
      }
    })
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

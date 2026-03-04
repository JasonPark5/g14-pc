<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <apexcharts
      ref="takenActionDeptImprChartRef"
      height="240"
      :options="takenActionDeptImprChart"
      :series="takenActionDeptImprChart.series"
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
  name: 'takenActionDeptImprPortlet'
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
const takenActionDeptImprChart = ref<any>({
  series: [],
  legend: {
    show: false
  },
  chart: {
    toolbar: {
      show: false
    },
    width: 350,
    height: 350,
    type: 'treemap'
  },
  colors: [
    '#A8D5BA', // 연한 민트 그린
    '#B3D9A8', // 부드러운 올리브 그린
    '#80C7B1', // 청록색
    '#A3D9E4', // 라이트 블루
    '#98B5A6', // 연한 그린 그레이
    '#F8C471', // 밝은 오렌지
    '#FF914D', // 진한 오렌지
    '#F5A623', // 강한 오렌지
    '#B0E0A8', // 연한 잎사귀 녹색
    '#A6D1E6', // 밝은 하늘색
    '#C1D9D4', // 블루 그린
    '#D9731F' // 따뜻한 오렌지
  ],
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false
    }
  }
})
const takenActionDeptImprChartRef = ref<any>(null)
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
  listUrl.value = selectConfig.monitor.takenActionDeptImprStatus.url
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
    takenActionDeptImprChartRef.value.updateSeries([
      {
        data: _.map(_result.data, (item) => {
          return {
            x: `${item.actionDeptName} (${item.completeCount}건)`,
            y: item.completeCount
          }
        })
      }
    ])
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

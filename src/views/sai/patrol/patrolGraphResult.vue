<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            label="순회기간"
            defaultStart="-6M"
            defaultEnd="6M"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="공정"
            name="processCd"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="부서" name="vendorCd" v-model:value="searchParam.vendorCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="statusItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="patrolCompleteFlag"
            label="진행단계"
            v-model:value="searchParam.patrolCompleteFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-card title="점검항목별 점검결과 건수" class="cardClassDetailForm bodyOverflow-none">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-12">
          <apexcharts
            ref="chartHTML"
            type="bar"
            width="100%"
            :key="chartRenderKey"
            :height="chartHeight"
            :options="chart.options"
            :series="chart.series"
          />
        </div>
      </template>
    </c-card>
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
  name: 'patrolGraphMonth'
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
  plantCd: null,
  processCd: null,
  vendorCd: null,
  useFlag: 'Y',
  patrolCompleteFlag: '',
  patrolYear: '',
  startYmd: '',
  endYmd: '',
  period: []
})
const statusItems = ref([
  { code: 'N', codeName: '점검중' },
  { code: 'Y', codeName: '점검완료' }
])
const chartHTML = ref<any>(null)
const chartHeight = ref(560)
const chartRenderKey = ref(1)
const chart = ref<apexChartType>({
  options: {
    chart: {
      id: getLanguage('점검항목별_점검결과_건수'),
      type: 'bar',
      stacked: true
    },
    xaxis: {
      categories: [] as any[],
      labels: {
        formatter: function (value: string) {
          return `${value}건`
        }
      }
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    tooltip: {
      y: {
        formatter: function (value: string) {
          return `${value}건`
        }
      }
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
    title: {
      text: ''
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
  },
  series: [
    {
      id: 'PRCC000001',
      name: getLanguage('해당없음'),
      data: []
    },
    {
      id: 'PRCC000002',
      name: getLanguage('양호'),
      data: []
    },
    {
      id: 'PRCC000003',
      name: getLanguage('불량'),
      data: []
    },
    {
      id: 'PRCC000004',
      name: getLanguage('미흡'),
      data: []
    }
  ] as any[]
})
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
onBeforeMount(() => {
  // window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  // window.removeEventListener('resize', setSize)
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
  listUrl.value = selectConfig.sai.patrol.graph.itemresult.url
  // code setting
  searchParam.value.patrolYear = getThisYear()
  // list setting
  getList()
  // setChartLabel();
  setSize()
}
const getList = () => {
  if (searchParam.value.period) {
    searchParam.value.startYmd = searchParam.value.period[0]
    searchParam.value.endYmd = searchParam.value.period[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const newCategories = [] as any[]
    const resultList1 = [] as any[]
    const resultList2 = [] as any[]
    const resultList3 = [] as any[]
    const resultList4 = [] as any[]
    _.forEach(_result.data, (item) => {
      newCategories.push(item.patrolItemName)
      resultList1.push(item.cnt1)
      resultList2.push(item.cnt2)
      resultList3.push(item.cnt3)
      resultList4.push(item.cnt4)
    })

    chartHTML.value.updateOptions({
      xaxis: {
        categories: newCategories
      }
    })
    chart.value.series[0].data = resultList1
    chart.value.series[1].data = resultList2
    chart.value.series[2].data = resultList3
    chart.value.series[3].data = resultList4
  })
}

/******************************
 * TODO (목적): 브라우저 높이에 맞춰 그리드 높이 조절
 *******************************/
const setSize = () => {
  let height = window.innerHeight - 284
  height = height >= 400 ? height : 400
  chartHeight.value = height
  chartRenderKey.value++
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

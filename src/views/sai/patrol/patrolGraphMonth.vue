<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getList"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            type="year"
            label="기준년도"
            name="patrolYear"
            v-model:value="searchParam.patrolYear"
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
          <c-dept
            type="search"
            label="부서"
            name="vendorCd"
            :isFirstValue="false"
            v-model:value="searchParam.vendorCd"
          />
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-card title="월별 점검결과 건수" class="cardClassDetailForm bodyOverflow-none">
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
                @click="clickDataPoint"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-table
          ref="table"
          title="점검결과별 점검항목"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="770px"
          :usePaging="false"
          :filtering="false"
          :isExcelDown="false"
          :isFullScreen="false"
          :columnSetting="false"
        />
      </div>
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
import { patrolMasterType } from './patrolType'

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
interface gridType {
  columns: tableColumnType
  data: Array<patrolMasterType>
}

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
  vendorCd: null,
  processCd: null,
  useFlag: 'Y',
  patrolCompleteFlag: '',
  patrolYear: ''
})
const statusItems = ref([
  { code: 'N', codeName: '점검중' },
  { code: 'Y', codeName: '점검완료' }
])
const grid = ref<gridType>({
  columns: [
    {
      name: 'patrolDate',
      field: 'patrolDate',
      label: '순회일',
      align: 'center',
      sortable: true,
      style: 'width:120px'
    },
    {
      name: 'patrolItemName',
      field: 'patrolItemName',
      label: '점검항목',
      align: 'left',
      sortable: true
    },
    {
      name: 'patrolResultName',
      field: 'patrolResultName',
      label: '점검결과',
      align: 'center',
      sortable: true,
      style: 'width:120px'
    }
  ],
  data: []
})
const chartHTML = ref<any>(null)
const chartHeight = ref(500)
const chartRenderKey = ref(1)
const chart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar',
      // dropShadow: {
      //   enabled: true,
      //   color: '#000',
      //   top: 18,
      //   left: 7,
      //   blur: 10,
      //   opacity: 0.2
      // },
      toolbar: {
        show: true
      },
      zoom: {
        enabled: false
      }
    },
    xaxis: {
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      labels: {
        formatter: function (value: string) {
          return `${value}월`
        }
      }
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
    title: {
      text: ''
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    yaxis: {
      title: {
        text: ''
      }
    },
    fill: {
      opacity: 1
    },
    markers: {
      size: 1
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    redrawOnParentResize: true
  },
  series: [] as any[],
  chartWidth: '100%'
})
const listUrl = ref('')
const detailUrl = ref('')

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
  window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setSize)
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
  listUrl.value = selectConfig.sai.patrol.graph.result.url
  detailUrl.value = selectConfig.sai.patrol.graph.resultitem.url
  // code setting
  searchParam.value.patrolYear = getThisYear()
  // list setting
  getList()
  setSize()
}
const getList = () => {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = []
    chart.value.series = []
    _.forEach(_result.data, (item) => {
      chart.value.series.push({
        name: item.patrolResultName,
        code: item.patrolResultCd,
        data: [
          item.cnt1,
          item.cnt2,
          item.cnt3,
          item.cnt4,
          item.cnt5,
          item.cnt6,
          item.cnt7,
          item.cnt8,
          item.cnt9,
          item.cnt10,
          item.cnt11,
          item.cnt12
        ]
      })
    })
  })
}

/******************************
 * TODO (목적): 차트 클릭시 데이터 조회하여 그리드 데이터 할당
 * @param option: 클릭한 차트의 값
 *******************************/
const clickDataPoint = (event: object, context: object, option: any) => {
  if (option.seriesIndex === -1) return

  const selectData = option.globals.series[option.seriesIndex][option.dataPointIndex]
  const patrolResultCd = chart.value.series[option.seriesIndex].code
  const patrolMonth =
    option.dataPointIndex > 9 ? option.dataPointIndex + 1 : `0${option.dataPointIndex + 1}`

  if (selectData > 0) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        patrolResultCd: patrolResultCd,
        patrolYear: searchParam.value.patrolYear,
        patrolMonth: patrolMonth
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  } else {
    grid.value.data = []
  }
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

<template>
  <div>
    <div class="row">
      <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="padding: 0px !important">
        <c-table
          ref="table"
          customClass="main-dashboard-table"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="true"
          :filtering="false"
          :isTitle="false"
          :columns="grid.columns"
          gridHeightAuto
          :data="grid.data"
        />
      </div> -->
      <q-card flat class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <apexchart
          ref="chartHTML"
          type="radar"
          height="370"
          :options="chart.options"
          :series="chart.series"
        />
      </q-card>
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
  name: 'complianceGraph'
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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/
// const $language = inject('$language') as GetTranLanguageFunction

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
const searchParam = ref({
  plantCd: null,
  startYear: null,
  endYear: null,
  sysRevision: 1,
  selfInspectionTypeCd: 'SITC000001' // 정기자체감사
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const columnset = ref([
  {
    name: 'itemMstName',
    field: 'itemMstName',
    label: '항목',
    align: 'left',
    sortable: false
  },
  {
    name: 'maxChangeScoring',
    field: 'maxChangeScoring',
    label: '최고환산점수',
    align: 'center',
    style: 'width:80px',
    sortable: false
  }
])
const chart = ref<apexChartType>({
  options: {
    // title: { text: '자체감사결과 추이분석' },
    chart: {
      height: 340,
      type: 'radar',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      zoom: { enabled: false }
    },
    plotOptions: {
      radar: {
        size: 150,
        polygons: {
          strokeColors: '#e9e9e9',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    stroke: { width: 2 },
    fill: { opacity: 0.1 },
    markers: {
      size: 5,
      hover: { size: 10 },
      discrete: []
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: [
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b',
            '#1c1b1b'
          ]
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5
    },
    tooltip: {
      enabled: false
    }
  },
  series: []
})
const revisionItems = ref<Array<codeMasterType>>([])
const selfInspectionYear = ref<Array<stringNull>>([])
const editable = ref(true)
const listUrl = ref('')
const revisionUrl = ref('')
const chartHTML = ref<any>(null)

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
  listUrl.value = selectConfig.sop.pca.result.graph.list.url
  revisionUrl.value = selectConfig.sop.pca.item.revs.item
  // code setting
  // 데이터 있는 기준으로 22~25년
  selfInspectionYear.value = [String(Number(getThisYear()) - 3), getThisYear()]
  // list setting
  getRevision()
}
/******************************
 * TODO (목적): 개정버전 조회
 *******************************/
function getRevision() {
  $http({
    url: revisionUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    revisionItems.value = _result.data
    searchParam.value.sysRevision = revisionItems.value[0].code
    getList()
  })
}
/******************************
 * TODO (목적): 그래프에 들어갈 데이터들 조회
 *******************************/
function getList() {
  searchParam.value.startYear = selfInspectionYear.value[0]
  searchParam.value.endYear = selfInspectionYear.value[1]
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (_result.data.info.length > 0) {
      chart.value.options.xaxis.categories = []
      chart.value.options.markers.discrete = []
      chart.value.series = []
      grid.value.data = []
      grid.value.columns = [...columnset.value]

      const cate = [] as Array<any>
      _.forEach(_.filter(_result.data.list, { dataTypes: '0' }), (_item) => {
        cate.push(_item.itemMstName)
      })
      let j = 0
      _.forEach(_result.data.info, (item1) => {
        grid.value.columns.push(
          {
            name: item1.selfInspectionResultId,
            field: item1.selfInspectionResultId,
            label: '환산점수',
            align: 'center',
            style: 'width:80px',
            sortable: false
          },
          {
            name: item1.selfInspectionResultId2,
            field: item1.selfInspectionResultId2,
            label: '백분위점수',
            align: 'center',
            style: 'width:80px',
            sortable: false
          }
        )
        const serieses = [] as Array<any>
        _.forEach(_result.data.list, (item2) => {
          if (item1.selfInspectionResultId == item2.selfInspectionResultId) {
            serieses.push(item2.realScore)
          }
        })
        let i = 0
        _.forEach(serieses, (item3) => {
          if (Math.min.apply(null, serieses) == item3) {
            chart.value.options.markers.discrete.push({
              seriesIndex: j,
              dataPointIndex: i,
              fillColor: 'red',
              strokeColor: 'red',
              size: 6
            })
          }
          i++
        })
        chart.value.series.push({
          name: item1.selfInspectionTitle,
          data: serieses
        })
        j++
      })
      grid.value.data = _result.data.items
      chartHTML.value.updateOptions({
        xaxis: {
          categories: cate
        }
        // title: {
        //   text: $language('자체감사결과 추이분석')
        // }
      })
    } else {
      chart.value.options.xaxis.categories = []
      chart.value.options.markers.discrete = []
      chart.value.series = []
      grid.value.columns = []
      grid.value.data = []
      chartHTML.value.updateOptions({
        markers: {
          discrete: []
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            :isFirstValue="false"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-2M"
            defaultEnd="0M"
            label="기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <apexcharts
          class="accidentChart"
          ref="kindOcuurChart2Ref"
          height="550"
          :options="kindOcuurChart2.options"
          :series="kindOcuurChart2.series"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          title="업무별 신규데이터 현황"
          :columns="grid.columns"
          :data="grid.data"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'menuLog003'
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
interface searchParamType {
  period: Array<any>
  userId: stringNull
  plantCd: stringNull
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
const searchParam = ref<searchParamType>({
  period: [],
  userId: '',
  plantCd: null
})
const grid = ref({
  columns: [
    {
      name: 'menuNm',
      field: 'menuNm',
      label: '업무명',
      align: 'left',
      sortable: true
    },
    {
      name: 'cnt',
      field: 'cnt',
      label: '신규DATA 건수',
      type: 'cost',
      sortable: true,
      style: 'width:120px'
    }
  ],
  data: [] as any
})
const listUrl = ref('')

const kindOcuurChart2Ref = ref<any>(null)
const kindOcuurChart2 = ref<apexChartType>({
  options: {
    chart: {
      width: 380,
      type: 'pie'
    },
    title: {
      text: '메뉴별 접속건수 TOP 20'
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
    ]
  },
  series: []
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
  listUrl.value = selectConfig.sys.log.menulog.list.url + '/status/data'
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
    getChart()
  })
}
function getChart() {
  kindOcuurChart2.value.series = []
  kindOcuurChart2Ref.value.updateOptions({
    labels: []
  })
  const _data = [] as any
  const _labels = [] as any
  for (let i = 0; i < grid.value.data.length; i++) {
    _labels.push(i + 1 + ': ' + grid.value.data[i].menuNm)
    _data.push(Number(grid.value.data[i].cnt))
  }
  kindOcuurChart2Ref.value.updateOptions({
    labels: _labels
  })
  kindOcuurChart2.value.series = _data
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

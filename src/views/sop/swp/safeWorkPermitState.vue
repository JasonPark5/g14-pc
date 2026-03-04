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
            defaultStart="-2y"
            defaultEnd="0y"
            type="year"
            label="년도"
            name="years"
            v-model:value="searchParam.years"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="발급부서"
            name="issuedDeptCd"
            v-model:value="searchParam.issuedDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :plantCd="searchParam.plantCd"
            :customPopupParam="{ targetKey: 'process' }"
            label="단위공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="SWP_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="swpStepCd"
            label="진행단계"
            v-model:value="searchParam.swpStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="작업허가서 년도별 통계" class="cardClassDetailForm bodyOverflow-none">
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
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          :title="newTitle"
          :columns="grid.columns"
          :data="grid.data"
          :usePaging="false"
          :filtering="false"
          :isExcelDown="false"
          :isFullScreen="false"
          :columnSetting="false"
          @linkClick="linkClick"
        />
        <c-dialog :param="popupOptions" />
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
  name: 'safeWorkPermitState'
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  years: [],
  issuedDeptCd: null,
  processCd: null,
  swpStepCd: null
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'workSummary',
      field: 'workSummary',
      label: '작업개요',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width:250px'
    },
    {
      name: 'swpStepName',
      field: 'swpStepName',
      label: '진행단계',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'permitDate',
      field: 'permitDate',
      label: '허가일',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'permitTypeName',
      field: 'permitTypeName',
      label: '구분',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'issuedDeptName',
      field: 'issuedDeptName',
      label: '발급부서',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    }
  ],
  data: []
})
const listUrl = ref('')
const detailUrl = ref('')
const chartHTML = ref<any>(null)
const chartHeight = ref(500)
const chartRenderKey = ref(1)
const chart = ref<apexChartType>({
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: true
      },
      zoom: {
        enabled: false
      }
    },
    xaxis: {
      categories: []
      // labels: {
      //   formatter: function (value: string) {
      //     return `${value}`
      //   }
      // },
      // title: { text: 'Year' }
    },
    // colors: [
    //   '#A3C8FC',
    //   '#70A9E7',
    //   '#4B83C7',
    //   '#98E1D1',
    //   '#68C4A3',
    //   '#4A9D6F',
    //   '#FFB27B',
    //   '#FF8C42'
    // ],
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
        text: '개수'
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
const seriesData = ref<Record<string, number[]>>({
  fire: [],
  normal: [],
  confinedSpace: [],
  blackout: [],
  radiation: [],
  excavation: [],
  highPlace: [],
  heavyEquipment: []
})
const newTitle = ref('작업허가서 목록')

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
  listUrl.value = selectConfig.sop.swp.workPermit.state.url
  detailUrl.value = selectConfig.sop.swp.workPermit.list.url
  // code setting
  // list setting
  getList()
  setSize()
}
/******************************
 * TODO (목적): 작업허가서 통계 조회
 *******************************/
function getList() {
  if (searchParam.value.years && searchParam.value.years.length > 0 && !searchParam.value.years[0])
    searchParam.value.years = []

  grid.value.data = []
  chart.value.series = []
  chart.value.options.xaxis.categories = []
  seriesData.value = {
    fire: [],
    normal: [],
    confinedSpace: [],
    blackout: [],
    radiation: [],
    excavation: [],
    highPlace: [],
    heavyEquipment: []
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const xaxis: any[] = []
    _.forEach(_result.data, (_item) => {
      if (xaxis.indexOf(_item.workYear) === -1) xaxis.push(_item.workYear)
      seriesData.value.fire.push(_item.fire || 0)
      seriesData.value.normal.push(_item.normal || 0)
      seriesData.value.confinedSpace.push(_item.confinedSpace || 0)
      seriesData.value.blackout.push(_item.blackout || 0)
      seriesData.value.radiation.push(_item.radiation || 0)
      seriesData.value.excavation.push(_item.excavation || 0)
      seriesData.value.highPlace.push(_item.highPlace || 0)
      seriesData.value.heavyEquipment.push(_item.heavyEquipment || 0)
    })
    chart.value.series.push(
      { name: $language('화기'), code: 'fire', data: seriesData.value.fire },
      { name: $language('일반'), code: 'normal', data: seriesData.value.normal },
      {
        name: $language('밀폐공간'),
        code: 'confinedSpace',
        data: seriesData.value.confinedSpace
      },
      { name: $language('정전'), code: 'blackout', data: seriesData.value.blackout },
      {
        name: $language('방사선'),
        code: 'radiation',
        data: seriesData.value.radiation
      },
      {
        name: $language('굴착'),
        code: 'excavation',
        data: seriesData.value.excavation
      },
      {
        name: $language('고소'),
        code: 'highPlace',
        data: seriesData.value.highPlace
      },
      {
        name: $language('중장비'),
        code: 'heavyEquipment',
        data: seriesData.value.heavyEquipment
      }
    )
    if (xaxis!.length > 0) chart.value.options.xaxis.categories = xaxis
    chartRenderKey.value++ // 강제 렌더링 갱신
  })
}
/******************************
 * TODO (목적): 차트 클릭시 데이터 조회하여 그리드 데이터 할당
 * @param option: 클릭한 차트의 값
 *******************************/
const clickDataPoint = (event: object, context: object, option: any) => {
  if (option.seriesIndex === -1) return
  const selectData = option.globals.series[option.seriesIndex][option.dataPointIndex]
  let workTypeCd = null as stringNull
  let suppleTypeCd = null as stringNull
  switch (option.config.series[option.seriesIndex].code) {
    case 'normal':
      workTypeCd = 'SPT0000001'
      break
    case 'fire':
      workTypeCd = 'SPT0000005'
      break
    case 'confinedSpace':
      suppleTypeCd = 'SSWT000001'
      break
    case 'blackout':
      suppleTypeCd = 'SSWT000005'
      break
    case 'radiation':
      suppleTypeCd = 'SSWT000010'
      break
    case 'excavation':
      suppleTypeCd = 'SSWT000015'
      break
    case 'highPlace':
      suppleTypeCd = 'SSWT000020'
      break
    case 'heavyEquipment':
      suppleTypeCd = 'SSWT000025'
      break
  }
  if (selectData > 0) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        permitYear: option.config.xaxis.categories[option.dataPointIndex],
        plantCd: searchParam.value.plantCd,
        issuedDeptCd: searchParam.value.issuedDeptCd,
        processCd: searchParam.value.processCd,
        swpStepCd: searchParam.value.swpStepCd,
        permitTypeCd: workTypeCd,
        supplementWorkTypeCd: suppleTypeCd
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
      newTitle.value = `작업허가서 목록 | ${option.config.xaxis.categories[option.dataPointIndex]} | ${option.config.series[option.seriesIndex].name}`
    })
  } else grid.value.data = []
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
 * TODO (목적): 작업허가서 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '작업허가서 상세'
  popupOptions.value.param = {
    sopWorkPermitId: row.sopWorkPermitId,
    permitTypeCd: row.permitTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safeWorkPermitDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 작업허가서 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
  setSize()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-card title="차트" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div class="col-sm-12 col-md-8 col-lg-8">
          <apexcharts
            ref="imprRefChart"
            height="250"
            type="bar"
            :width="imprChart.chartWidth"
            :options="imprChart.options"
            :series="imprChart.series"
          />
        </div>
        <div class="col-sm-12 col-md-4 col-lg-4">
          <apexcharts
            ref="immRefChart"
            height="250"
            type="bar"
            :width="immChart.chartWidth"
            :options="immChart.options"
            :series="immChart.series"
          />
        </div>
      </template>
    </c-card>
    <c-tab
      class="q-mt-sm"
      type="tabcard"
      align="left"
      :inlineLabel="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
      @tabClick="tabClick"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :grid="grid"
          :curTab="curTab"
          :gridHeight="gridHeight"
          :label="tab.label"
        />
      </template>
    </c-tab>
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
  name: 'imprActionRateDetail'
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
interface propType {
  popupParam: imprActionRatePopupParamType
  contentHeight: string
}
interface imprActionRatePopupParamType {
  tab: stringNull
  clickInfo: stringNull
  data: objectStringNumber
  searchParam: any
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
  popupParam: () => {
    return {
      tab: 'task',
      clickInfo: '',
      data: [],
      searchParam: {
        plantCd: null,
        actionCompleteRequestDates: [],
        actionDeptCd: '',
        actionVendorCd: '',
        actionFlag: 'D'
      }
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
    chart: {
      id: 'chartId1'
    },
    title: {
      text: '개선처리'
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    xaxis: {
      categories: [] as any[]
    }
  },
  series: [
    {
      name: '건 수',
      data: [] as any[]
    }
  ],
  chartWidth: '80%'
})
const immChart = ref<apexChartType>({
  options: {
    title: {
      text: '즉시처리'
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    xaxis: {
      categories: [] as any[]
    }
  },
  series: [
    {
      name: '건 수',
      data: [] as any[]
    }
  ],
  chartWidth: '80%'
})
const curTab = ref('IS00000001')
const tab = ref('IS00000001')
const listUrl = ref('')
const tabItems = ref<tabItemsType>([])
const grid = ref<any>({
  columns: [],
  data: [],
  allData: []
})
const imprRefChart = ref<any>(null)
const immRefChart = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 370
      : 500
  if (height < 500) {
    height = 500
  }
  return String(height) + 'px'
})
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 440
      : 400
  if (height < 400) {
    height = 400
  }
  return String(height) + 'px'
})
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
  listUrl.value = selectConfig.sop.ibm.improve.status.list.url
  // code setting
  getStepItems('IBM_STEP_CD').then((_result: any) => {
    _.forEach(_result, (item) => {
      tabItems.value.push({
        name: item.stepperMstCd,
        label: item.stepperMstNm,
        icon: item.iconClass,
        component: shallowRef(
          defineAsyncComponent(() => import(`./imprActionRateDetailTabTable.vue`))
        )
      })
    })
    tabItems.value.push({
      name: 'immTotal',
      icon: 'task_alt',
      label: $language('즉시처리'),

      component: shallowRef(
        defineAsyncComponent(() => import(`./imprActionRateDetailTabTable.vue`))
      )
    })
    setChart(_.map(_result, 'stepperMstNm'))
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 차트 커스텀
 *******************************/
function setChart(_category: any) {
  imprRefChart.value.updateOptions({
    title: {
      text: $language('개선처리') + ' [' + props.popupParam.clickInfo + ']'
    },
    xaxis: {
      categories: _category
    }
  })
  imprRefChart.value.updateSeries([
    {
      data: [
        props.popupParam.data.requesting,
        props.popupParam.data.receipting,
        props.popupParam.data.actioning,
        props.popupParam.data.confirming,
        props.popupParam.data.complete
      ]
    }
  ])

  immRefChart.value.updateOptions({
    title: {
      text: $language('즉시처리') + ' [' + props.popupParam.clickInfo + ']'
    },
    xaxis: {
      categories: [$language('즉시처리건')]
    }
  })
  immRefChart.value.updateSeries([
    {
      data: [props.popupParam.data.immTotal]
    }
  ])

  // imprRefChart.value.refresh()
  // immRefChart.value.refresh()
}
/******************************
 * TODO (목적): 개선 이행률 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: props.popupParam.searchParam
  }).then((_result: any) => {
    grid.value.allData = _result.data
    tabClick({ name: tab.value })
  })
}
/******************************
 * TODO (목적): 개선 이행률 탭클릭
 *******************************/
function tabClick(tab: any) {
  curTab.value = tab.name
  if (tab.name !== 'immTotal') {
    // 개선처리건일 경우
    grid.value.columns = [
      {
        name: 'plantName',
        field: 'plantName',
        label: '사업장',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'ibmTaskTypeName',
        field: 'ibmTaskTypeName',
        label: '업무',
        align: 'center',
        style: 'width:120px',
        sortable: true
      },
      {
        name: 'ibmTitle',
        field: 'ibmTitle',
        label: '제목',
        align: 'left',
        style: 'width:250px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'improveRequestContents',
        field: 'improveRequestContents',
        label: '요청정보',
        align: 'center',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'actionCompleteRequestDate',
        field: 'actionCompleteRequestDate',
        label: '조치완료 요청일',
        align: 'center',
        style: 'width:100px',
        type: 'custom',
        sortable: true
      },
      {
        name: 'actionName',
        field: 'actionName',
        label: '조치부서/업체',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'actionUserNames',
        field: 'actionUserNames',
        label: '조치자',
        align: 'left',
        style: 'width:100px',
        sortable: true
      }
    ]
    // 개선완료인 경우
    if (tab.name === 'IS00000020') {
      grid.value.columns = _.concat(grid.value.columns, [
        {
          name: 'suppleFlagName',
          field: 'suppleFlagName',
          label: '적합/보완',
          align: 'center',
          style: 'width:80px',
          sortable: true
        },
        {
          name: 'ibmSuppleStepName',
          field: 'ibmSuppleStepName',
          label: '보완진행단계',
          align: 'center',
          style: 'width:100px',
          sortable: true
        },
        {
          name: 'suppleRequest',
          field: 'suppleRequest',
          label: '보완요청 내용',
          align: 'left',
          style: 'width:200px',
          sortable: true
        },
        {
          name: 'suppleScheduleDate',
          field: 'suppleScheduleDate',
          label: '보완완료 요청일',
          align: 'center',
          style: 'width:170px',
          sortable: true
        },
        {
          name: 'suppleCompleteDate',
          field: 'suppleCompleteDate',
          label: '보완완료일',
          align: 'center',
          style: 'width:90px',
          sortable: true
        }
      ])
    }
    grid.value.data = _.filter(grid.value.allData, {
      ibmStepCd: tab.name,
      ibmClassCd: 'IC00000001'
    })
  } else {
    // 즉시처리건일 경우
    grid.value.columns = [
      {
        name: 'plantName',
        field: 'plantName',
        label: '사업장',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'ibmTaskTypeName',
        field: 'ibmTaskTypeName',
        label: '업무',
        align: 'center',
        style: 'width:120px',
        sortable: true
      },
      {
        name: 'ibmTitle',
        field: 'ibmTitle',
        label: '제목',
        align: 'left',
        style: 'width:250px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'actionContents',
        field: 'actionContents',
        label: '조치내용',
        align: 'left',
        style: 'width:250px',
        sortable: true
      },
      {
        name: 'improveRequestContents',
        field: 'improveRequestContents',
        label: '요청정보',
        align: 'center',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'actionCompleteDate',
        field: 'actionCompleteDate',
        label: '조치완료일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      }
    ]
    grid.value.data = _.filter(grid.value.allData, { ibmClassCd: 'IC00000005' })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div class="row bg-white">
    <div class="col-12">
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
              :range="true"
              type="year"
              label="평가년도"
              name="assessmentYears"
              v-model:value="searchParam.assessmentYears"
              @datachange="yearchange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              type="none"
              itemText="codeName"
              itemValue="code"
              name="ramTechniqueCd"
              label="평가기법"
              :comboItems="riskAssessmentItems"
              v-model:value="searchParam.ramTechniqueCd"
              @datachange="getList"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              type="none"
              itemText="codeName"
              itemValue="code"
              name="afterRisk"
              label="위험도 기준"
              :comboItems="afterRiskItems"
              v-model:value="searchParam.afterRisk"
              @datachange="getList"
            />
          </div>
        </template>
      </c-search-box>
      <div class="row">
        <div class="col-6">
          <apexcharts
            ref="riskLevelChangeRef"
            height="380"
            type="line"
            :options="riskLevelChange.options"
            :series="riskLevelChange.series"
          />
        </div>
        <div class="col-6">
          <apexcharts
            ref="imprLevelChangeRef"
            height="380"
            type="line"
            :options="imprLevelChange.options"
            :series="imprLevelChange.series"
          />
        </div>
        <div class="col-12">
          <c-table
            ref="table"
            title="잔존 위험요인 리스트"
            :columns="gridColumnsComp"
            :data="grid.data"
            :merge="gridMergeComp"
            gridHeightAuto
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="false"
                  :requestContentsCols="imprPropsComp.requestContentsCols"
                  :tableKey="imprPropsComp.tableKey"
                  :ibmTaskTypeCd="imprPropsComp.ibmTaskTypeCd"
                  :ibmTaskUnderTypeCd="imprPropsComp.ibmTaskUnderTypeCd"
                />
              </template>
              <template v-if="col.name === 'afterRiskEstimation'">
                <span style="color: red">{{ props.row.afterRiskEstimation }}</span>
              </template>
              <template v-else-if="col.name === 'ramRiskLevelName'">
                <q-chip
                  :style="`background-color:${props.row.riskColor};color:white;`"
                  outline
                  square
                >
                  {{ props.row[col.name] }}
                </q-chip>
              </template>
            </template>
          </c-table>
        </div>
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
import { gridColumns, gridMerge, imprProps } from './riskScenarioComp'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskAssessmentAllStatus'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
  // plantCd: stringNull
  assessmentYears: arrayString | null
  ramAssessTypeCd: stringNull
  ramTechniqueCd: stringNull
  processCd: stringNull
  ibmStepCd: stringNull
  afterRisk: stringNull | numberNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
}

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
const imprLevelChangeRef = ref<any>(null)
const riskLevelChangeRef = ref<any>(null)
const searchParam = ref<searchParamType>({
  // plantCd: null,
  assessmentYears: [],
  ramAssessTypeCd: null,
  ramTechniqueCd: 'RT00000025',
  processCd: null,
  ibmStepCd: null,
  afterRisk: '7'
})
const riskChangeUrl = ref('')
const imprChangeUrl = ref('')
const riskAssessmentItems = ref<any>([])
const grid = ref<gridType>({
  columns: [],
  data: []
})
const afterRiskItems = ref<any>([
  { code: '1', codeName: '1 이상' },
  { code: '2', codeName: '2 이상' },
  { code: '3', codeName: '3 이상' },
  { code: '4', codeName: '4 이상' },
  { code: '5', codeName: '5 이상' },
  { code: '6', codeName: '6 이상' },
  { code: '7', codeName: '7 이상' },
  { code: '8', codeName: '8 이상' },
  { code: '9', codeName: '9 이상' },
  { code: '10', codeName: '10 이상' },
  { code: '11', codeName: '11 이상' },
  { code: '12', codeName: '12 이상' },
  { code: '13', codeName: '13 이상' },
  { code: '14', codeName: '14 이상' },
  { code: '15', codeName: '15 이상' },
  { code: '16', codeName: '16 이상' },
  { code: '17', codeName: '17 이상' },
  { code: '18', codeName: '18 이상' },
  { code: '19', codeName: '19 이상' },
  { code: '20', codeName: '20 이상' }
])
const riskLevelChange = ref<apexChartType>({
  options: {
    title: {
      text: $language('위험도')
    },
    annotations: {
      yaxis: []
    },
    chart: {
      height: 350,
      type: 'line',
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
    dataLabels: {
      enabled: true
    },
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
const imprLevelChange = ref<apexChartType>({
  options: {
    title: {
      text: $language('개선조치 추세 변화')
    },
    annotations: {
      yaxis: []
    },
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
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
    dataLabels: {
      enabled: true
    },
    labels: [],
    xaxis: {},
    yaxis: [
      {
        title: {
          text: $language('위험도/개선조치')
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
    width: [0, 4],
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
  series: [
    {
      name: $language('위험요인 건수'),
      type: 'column',
      data: []
    },
    {
      name: $language('개선조치 건수'),
      type: 'line',
      data: []
    }
  ] as any[]
})
/******************************
 * @Computed_선언
 *******************************/
const gridColumnsComp = computed(() => {
  return gridColumns(searchParam.value.ramTechniqueCd)
})
const gridMergeComp = computed(() => {
  return gridMerge(searchParam.value.ramTechniqueCd)
})
const imprPropsComp = computed(() => {
  return imprProps(searchParam.value.ramTechniqueCd)
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const residualRiskUrl = computed(() => {
  let url = ''
  if (searchParam.value.ramTechniqueCd === 'RT00000001') {
    // HAZOP
    url = selectConfig.ram.hazop.scenario.list.url
  } else if (searchParam.value.ramTechniqueCd === 'RT00000015') {
    // JRA
    url = selectConfig.ram.jsa.scenario.list.url
  } else if (searchParam.value.ramTechniqueCd === 'RT00000020') {
    // KRAS
    url = selectConfig.ram.kras.scenario.list.url
  } else if (searchParam.value.ramTechniqueCd === 'RT00000025') {
    // 4M
    url = selectConfig.ram.fm.scenario.list.url
  } else if (searchParam.value.ramTechniqueCd === 'RT00000030') {
    // CHARM
    url = selectConfig.ram.charm.scenario.result.url
  }
  return url
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
  riskChangeUrl.value = selectConfig.ram.status.riskLevel.url
  imprChangeUrl.value = selectConfig.ram.status.imprLevel.url
  // code setting
  getComboItems('RAM_TECHNIQUE_CD').then((_result: any) => {
    riskAssessmentItems.value = _.reject(_result, { attrVal1: 'N' })
  })

  searchParam.value.assessmentYears = [String(Number(getThisYear()) - 3), getThisYear()]
  setTimeout(() => {
    yearchange()
  }, 500)

  // list setting
}
function yearchange() {
  const startYear = Number(searchParam.value.assessmentYears[0])
  const lastYear = Number(searchParam.value.assessmentYears[1])

  const _category = ref<any>([])
  const _labels = ref<any>([])

  for (let year = startYear; year <= lastYear; year++) {
    if (year === startYear) {
      _category.value.push(String(year))
      _labels.value.push(String(year))
    } else if (year === lastYear) {
      _category.value.push(String(year))
      _labels.value.push(String(year))
    } else {
      _category.value.push(String(year))
      _labels.value.push(String(year))
    }
  }
  riskLevelChange.value.options.xaxis.categories = _category.value
  riskLevelChangeRef.value.updateOptions({
    xaxis: {
      categories: _category.value
    }
  })
  imprLevelChange.value.options.labels = _labels.value
  imprLevelChangeRef.value.updateOptions({
    labels: _labels.value
  })
  // imprLevelChange.value.options.labels = _labels.value
  getList()
}
function getList() {
  if (!searchParam.value.assessmentYears || searchParam.value.assessmentYears.length === 0) {
    message.alert({
      title: '안내',
      message: '평가년도를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  imprLevelChange.value.series[0].name = '위험도 ' + searchParam.value.afterRisk + '이상 건수'
  riskChange()
  imprChange()
  residualRiskList()
}
function riskChange() {
  riskLevelChange.value.series = []

  $http({
    url: riskChangeUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    // series.data length 구하기
    const len = riskLevelChange.value.options.xaxis.categories.length
    const _series = ref<any>([])
    _.forEach(_result.data, (_item: any) => {
      // 년도에 따른 idx를 구하여 series.data의 위치 통일
      const idx = riskLevelChange.value.options.xaxis.categories.indexOf(
        String(_item.assessmentYear)
      )
      if (
        _.findIndex(_series.value, {
          ramMatrixRiskStandardsId: _item.ramMatrixRiskStandardsId
        }) === -1
      ) {
        _series.value.push({
          ramMatrixRiskStandardsId: _item.ramMatrixRiskStandardsId,
          name: _item.riskContent,
          data: Array.from({ length: len }, () => 0)
        })
      }
      _series.value[
        _.findIndex(_series.value, {
          ramMatrixRiskStandardsId: _item.ramMatrixRiskStandardsId
        })
      ].data[idx] = _item.riskCount
    })
    riskLevelChangeRef.value.updateSeries(_series.value)
  })
}
function imprChange() {
  imprLevelChange.value.series[0].data = []
  imprLevelChange.value.series[1].data = []

  $http({
    url: imprChangeUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.forEach(_result.data, (_item: any) => {
      // 년도에 따른 idx를 구하여 series.data의 위치 통일
      const length = imprLevelChange.value.options.labels.length
      imprLevelChange.value.series[0].data = new Array(length)
      imprLevelChange.value.series[1].data = new Array(length)
      let num = 0
      _.forEach(imprLevelChange.value.options.labels, (_item) => {
        imprLevelChange.value.series[0].data[num] = 0
        imprLevelChange.value.series[1].data[num] = 0

        const rsltIdx = _.findIndex(_result.data, { assessmentYear: String(_item) })

        if (rsltIdx >= 0) {
          imprLevelChange.value.series[0].data[num] = _result.data[rsltIdx].riskCnt
          imprLevelChange.value.series[1].data[num] = _result.data[rsltIdx].imprCnt
        }
        num++
      })
    })
  })
}
function residualRiskList() {
  // 선택된 위험성평가 정보가 있는 경우
  $http({
    url: residualRiskUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _.reject(_result.data, { afterRisk: null })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

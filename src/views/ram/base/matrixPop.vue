<template>
  <div class="row" :style="popStyle">
    <div class="col-12">
      <c-card title="위험도" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn v-if="pageEditable" label="적용" icon="check" @btnClicked="accept" />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-12">
            <c-text
              :disabled="true"
              label="Selected"
              name="selectSeriesText"
              v-model:value="selectSeriesText"
            />
          </div>
          <div class="col-3">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>{{ $language('차트 Tooltip') }}</q-toolbar-title>
            </q-toolbar>
            <q-list bordered padding>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-deep-orange">
                    <q-icon name="crop_square" />
                    {{ $language('빈도') }}
                  </q-item-label>
                  <q-item-label caption>
                    <span v-html="frequencyData" />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-deep-orange">
                    <q-icon name="crop_square" />
                    {{ $language('강도') }}
                  </q-item-label>
                  <q-item-label caption>
                    <span v-html="strengtyData" />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-deep-orange">
                    <q-icon name="crop_square" />
                    {{ $language('위험도') }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ riskData }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-9">
            <apexchart
              ref="chartRisk"
              type="heatmap"
              :width="chart.chartWidth"
              :options="chart.options"
              :series="chart.series"
              @dataPointSelection="dataPointSelection"
              @dataPointMouseEnter="mouseMove"
            />
          </div>
        </template>
      </c-card>
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
import { matrixType } from './matrix'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'matrixPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['callback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  props: {
    row: any
  }
  editable: boolean
}
interface selectedValueType {
  f: stringNull
  s: stringNull
  r: stringNull
  ramMatrixRiskId: stringNull
  color?: stringNull
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
  props: () => {
    return {
      row: {}
    }
  },
  editable: false
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const matrix = ref<matrixType>({
  ramMatrixId: '', // matrix 번호
  matrixName: '', // matrix 명
  plantCd: '', // 사업장코드
  ramTechniqueCd: null, // 평가기법 코드
  remarks: '', // 비고
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  frequencies: [], // 빈도
  deleteFrequencies: [], // [삭제] 빈도
  strengties: [], // 강도
  deleteStrengties: [], // [삭제] 강도
  risks: [], // 위험도
  standards: [], // 위험도 기준
  deleteStandards: [] // [삭제] 위험도 기준
})
const rangeComp = ref<any>({
  min: 0,
  max: 0
})
const selectSeries = ref<selectedValueType>({
  f: '',
  s: '',
  r: '',
  ramMatrixRiskId: '',
  color: ''
})
const gseries = ref<Array<any>>([])
const selectSeriesText = ref('')
const chartRisk = ref<any>(null)
const frequencyData = ref('')
const strengtyData = ref('')
const riskData = ref('')
const detailUrl = ref('')
const delay = ref(180)
const clicks = ref(0)
const timer = ref<any>(null)
const haveRisk = ref<any>(false)
const chart = ref<apexChartType>({
  options: {
    chart: {
      toolbar: {
        show: false
      }
    },
    tooltip: {
      enabled: false
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      }
    },
    colors: ['#3f6ad8'],
    plotOptions: {
      heatmap: {
        enableShades: false
      }
    },
    xaxis: {
      type: 'category',
      tooltip: {
        enabled: false
      },
      title: {
        text: '강도'
      }
    },
    yaxis: {
      show: true,
      tooltip: {
        enabled: false
      },
      title: {
        text: '빈도',
        offsetX: 10
      }
    }
  },
  series: [] as any[],
  chartWidth: '100%'
})

/******************************
 * @Computed_선언
 *******************************/
const pageEditable = computed(() => {
  return props.editable && Boolean(route.meta.editable)
})
const popStyle = computed(() => {
  return 'width: 1000px; max-width: 1000px !important'
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
  // url setting
  detailUrl.value = selectConfig.ram.matrix.get.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.props.row.ramMatrixId) {
    $http({
      url: $format(detailUrl.value, props.props.row.ramMatrixId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(matrix.value, _result.data)
      if (matrix.value.standards && matrix.value.standards.length > 0) {
        _.forEach(matrix.value.standards, (_item: any) => {
          _item.checked = false
          _item.model = {
            min: _item.min,
            max: _item.max
          }
        })
        // $forceUpdate()
      }
      /**
       * risk를 가지고 있는지 판단 > 있을 시에 처음 데이터 가져와서 그릴때 참조
       *
       * 그 후에 빈도, 강도를 변경하여 새롭게 적용을 할 시에는 haveRisk의 값은 false 처리되어
       * 빈도와 강도에 따라 위험도가 다시 결정되게 처리
       */
      haveRisk.value = matrix.value.risks && matrix.value.risks.length > 0
      setChart()
    })
  }
}
function setChart() {
  rangeComp.value.max = 0
  const x = _.map(matrix.value.strengties, 'strength')
  const y = ref([]) as any

  chartRisk.value.updateOptions({
    xaxis: {
      categories: x
    }
  })
  _.forEach(matrix.value.frequencies, (_item: any) => {
    y.value.push({
      name: _item.frequency,
      data: generateData(matrix.value.strengties?.length, _item.frequency)
    })
  })
  chart.value.series = y
  const _ranges = [] as any
  if (matrix.value.standards && matrix.value.standards.length > 0) {
    _.forEach(matrix.value.standards, (range) => {
      _ranges.push({
        from: range.min,
        to: range.max,
        name: range.riskContents,
        color: range.color
      })
    })
  }

  chartRisk.value.updateOptions({
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: _ranges
        }
      }
    },
    dataLabels: {
      formatter: (_val: any, opts: any) => {
        return $language('위험도 : ') + opts.value
      }
    }
  })
  setTimeout(() => {
    chart.value.chartWidth = '100%'
  }, 300)

  // this.$refs['chart'].refresh()
}

function generateData(count: any, fData: any) {
  let i = 0
  gseries.value = []
  while (i < count) {
    const data = matrix.value.strengties[i]
    const risk = _.find(matrix.value.risks, {
      frequency: fData,
      strength: data.strength
    }) as any
    const _x = (i + 1).toString()
    let _y = 0

    if (haveRisk.value) {
      _y = Number(risk.risk)
      // 초반에 저장된 기준으로 matrix를 구성하기 위한 설정
      _.forEach(matrix.value.risks, (item) => {
        rangeComp.value.max =
          Number(item.risk) > Number(rangeComp.value.max)
            ? Number(item.risk)
            : Number(rangeComp.value.max)
      })
    } else {
      _y = !isNaN(data.strength) && !isNaN(fData) ? Number(data.strength) * Number(fData) : 0
      rangeComp.value.max = _y > rangeComp.value.max ? _y : rangeComp.value.max
    }

    gseries.value.push({
      x: _x,
      y: _y
    })
    i++
  }
  return gseries.value
}
function dataPointSelection(_event: any, _chartContext: any, _config: any) {
  clicks.value++
  const selecteValues = chart.value.series![_config.seriesIndex].data![_config.dataPointIndex]
  selectSeriesText.value =
    $language('빈도 : ') +
    matrix.value.frequencies[_config.seriesIndex].frequency +
    $language(' / 강도 : ') +
    matrix.value.strengties[_config.dataPointIndex].strength +
    $language(' / 위험도 : ') +
    selecteValues.y

  const _risk = _.find(matrix.value.risks, {
    frequency: matrix.value.frequencies[_config.seriesIndex].frequency,
    strength: matrix.value.strengties[_config.dataPointIndex].strength
  })
  selectSeries.value = {
    f: matrix.value.frequencies[_config.seriesIndex].frequency,
    s: matrix.value.strengties[_config.dataPointIndex].strength,
    r: selecteValues.y,
    ramMatrixRiskId: _risk?.ramMatrixRiskId
  }
  if (clicks.value === 1) {
    timer.value = setTimeout(function () {
      /** 행 클릭 */
      clicks.value = 0
    }, delay.value)
  } else {
    /** 행 더블 클릭 */
    clearTimeout(timer.value)
    if (pageEditable.value) {
      emits('callback', selectSeries.value, selectSeries.value.color)
    }
    clicks.value = 0
  }
}
function mouseMove(_event: any, _chartContext: any, _config: any) {
  if (_config.dataPointIndex > -1 && _config.seriesIndex > -1) {
    frequencyData.value = convertEnter(
      matrix.value.frequencies[_config.seriesIndex].frequencyContents
    )
    strengtyData.value = convertEnter(
      matrix.value.strengties[_config.dataPointIndex].strengthContents
    )

    riskData.value = _config.w.config.series[_config.seriesIndex].data[_config.dataPointIndex].y
  }
}
// function mouseLeave(_event: any, _chartContext: any, _config: any) {
//   frequencyData.value = ''
//   strengtyData.value = ''
//   riskData.value = ''
// }
function accept() {
  emits('callback', selectSeries.value, selectSeries.value.color)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

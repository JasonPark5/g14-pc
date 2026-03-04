<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
      <q-form ref="editForm">
        <c-card title="상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="matrix"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveMatrix"
                @btnCallback="saveMatrixCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-12">
              <c-plant
                :required="true"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="matrix.plantCd"
              />
            </div> -->
            <div class="col-12">
              <c-select
                :editable="editable"
                codeGroupCd="RAM_TECHNIQUE_CD"
                :required="true"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="ramTechniqueCd"
                label="평가기법"
                v-model:value="matrix.ramTechniqueCd"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable"
                :required="true"
                label="Matrix명"
                name="matrixName"
                v-model:value="matrix.matrixName"
              />
            </div>
            <div class="col-12">
              <c-textarea
                :editable="editable"
                label="비고"
                name="remarks"
                v-model:value="matrix.remarks"
              />
            </div>
            <div class="col-12">
              <c-radio
                :editable="editable"
                :comboItems="useFlagItems"
                label="사용여부"
                name="useFlag"
                v-model:value="matrix.useFlag"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
      <c-card title="위험도 기준" class="cardClassDetailForm risk-standards">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              label="적용"
              icon="check"
              @btnClicked="acceptStandardMatrixRisk"
            />
            <c-btn
              v-if="editable"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addR"
            />
            <c-btn
              v-if="editable"
              :showLoading="false"
              label="제외"
              icon="remove"
              @btnClicked="removeR"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-12" v-for="(range, idx) in matrix.standards" :key="idx">
            <q-item style="align-items: center" v-ripple>
              <q-item-section side top>
                <q-checkbox v-if="editable" v-model="range.checked" size="xs" />
              </q-item-section>
              <div
                class="cursor-pointer risk-name"
                style="min-width: 90px; max-width: 160px; font-size: 0.94em"
              >
                {{ range.riskContents }}
                <q-popup-edit
                  v-model="range.riskContents"
                  :disable="!editable"
                  class="matrix-risk-popedit"
                >
                  <q-input
                    dark
                    v-model="range.riskContents"
                    dense
                    autofocus
                    @update:model-value="(newValue: any) => datachange(range, newValue)"
                  >
                    <template v-slot:append>
                      <q-icon name="edit" />
                    </template>
                  </q-input>
                </q-popup-edit>
              </div>
              <q-range
                v-model="range.model"
                :disable="!editable"
                :min="rangeComp.min"
                :max="rangeComp.max"
                :step="1"
                label-always
                drag-range
                label
                markers
                snap
                class="q-mr-md"
                @update:model-value="datachange(range)"
              />
              <q-badge :style="{ 'background-color': range.color }" class="cursor-pointer">
                {{ $language('색상지정') }}
                <q-popup-proxy>
                  <q-color
                    v-model="range.color"
                    no-header
                    no-footer
                    class="my-picker"
                    @update:model-value="datachange(range)"
                  />
                </q-popup-proxy>
              </q-badge>
            </q-item>
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
      <c-card title="위험도" class="cardClassDetailForm risk" :noMarginPadding="true">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-text
              ref="selectSeriestxt"
              :editable="editable"
              :disabled="setSeriesDisabled"
              name="selectSeries"
              :beforeText="$language('선택된 셀 클릭 후 값을 변경하여 위험도 설정')"
              v-model:value="selectSeries.y"
              @dataChange="change"
            />
            <c-btn v-if="editable" label="빈도&강도 적용" icon="check" @btnClicked="accept" />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-4 matrix">
            <q-toolbar class="bg-dark text-white" style="min-height: 30px">
              <q-toolbar-title>{{
                Boolean(riskData)
                  ? `${$language('위험도 : ')} ${riskData}`
                  : $language('차트 Tooltip')
              }}</q-toolbar-title>
            </q-toolbar>
            <q-toolbar class="bg-grey-6 text-white" style="min-height: 30px">
              <q-toolbar-title>{{ $language('빈도') }}</q-toolbar-title>
            </q-toolbar>
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-grey" v-html="frequencyData" />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-toolbar class="bg-grey-6 text-white" style="min-height: 30px">
              <q-toolbar-title>{{ $language('강도') }}</q-toolbar-title>
            </q-toolbar>
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-grey" v-html="strengtyData" />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-8">
            <apexcharts
              ref="chartRisk"
              :width="chart.chartWidth"
              height="320"
              type="heatmap"
              :options="chart.options"
              :series="chart.series"
              @dataPointSelection="dataPointSelection"
              @dataPointMouseEnter="mouseMove"
            />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card title="Matrix 설정 영역" class="cardClassDetailForm" :noMarginPadding="true">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <c-table
              ref="tableF"
              title="빈도"
              tableId="f01"
              :hideBottom="true"
              :usePaging="false"
              :filtering="false"
              :columns="gridFColumns"
              :data="matrix.frequencies"
              :gridHeight="gridF.height"
              selection="multiple"
              rowKey="ramMatrixFrequencyId"
              :editable="editable"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="addF"
                  />
                  <c-btn
                    v-if="editable && Number(matrix.frequencies?.length) > 0"
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="removeF"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <c-table
              ref="tableS"
              title="강도"
              tableId="s01"
              :hideBottom="true"
              :usePaging="false"
              :filtering="false"
              :columns="gridSColumns"
              :data="matrix.strengties"
              :gridHeight="gridS.height"
              selection="multiple"
              rowKey="ramMatrixStrengthId"
              :editable="editable"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="addS"
                  />
                  <c-btn
                    v-if="editable && Number(matrix.strengties?.length) > 0"
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="removeS"
                  />
                </q-btn-group>
              </template>
            </c-table>
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
  name: 'matrixDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  popupParam: {
    ramMatrixId: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface selectedValueType {
  x: stringNull
  y: stringNull
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
      ramMatrixId: ''
    }
  },
  contentHeight: 'auto'
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
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
  deleteStandards: [], // [삭제] 위험도 기준
  matrixRiskStandardCd: null
})
const gridF = ref<any>({
  height: '320px'
})
const gridS = ref<any>({
  height: '320px'
})
const rangeComp = ref<any>({
  min: 0,
  max: 0
})
const selectSeries = ref<selectedValueType>({
  x: '',
  y: null
})
const chartRisk = ref<any>(null)
const tableF = ref<any>(null)
const tableS = ref<any>(null)
const frequencyData = ref('')
const strengtyData = ref('')
const riskData = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const haveRisk = ref<any>(false)
const mappingType = ref('POST')
const gseries = ref<Array<any>>([])
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
        colors: ['#000000']
      }
    },
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
const editForm = ref<any>(null)
const selectSeriestxt = ref<any>(null)
const isSelected = ref(false)
/******************************
 * @Computed_선언
 *******************************/
const setSeriesDisabled = computed(() => {
  return selectSeries.value.y >= 0 ? false : true
})
const gridFColumns = computed(() => {
  const cols = [
    {
      name: 'frequency',
      field: 'frequency',
      label: '빈도',
      align: 'center',
      style: 'width:50px',
      type: 'text',
      sortable: true,
      required: true
    },
    {
      name: 'frequencyContents',
      field: 'frequencyContents',
      label: '내용',
      align: 'left',
      style: 'width:300px',
      type: 'textarea',
      sortable: true,
      required: true
    }
  ]
  return cols
})
const gridSColumns = computed(() => {
  const cols = [
    {
      name: 'strength',
      field: 'strength',
      label: '강도',
      align: 'center',
      style: 'width:50px',
      type: 'text',
      sortable: true,
      required: true
    },
    {
      name: 'strengthContents',
      field: 'strengthContents',
      label: '내용',
      align: 'left',
      style: 'width:300px',
      type: 'textarea',
      sortable: true,
      required: true
    }
  ]
  return cols
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
  detailUrl.value = selectConfig.ram.matrix.get.url
  saveUrl.value = transactionConfig.ram.matrix.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.ramMatrixId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.ramMatrixId),
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
    const _x = i + 1
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
  const selecteValues = chart.value.series[_config.seriesIndex].data![_config.dataPointIndex]
  selectSeries.value.x = String(selecteValues.x)
  selectSeries.value.y = String(selecteValues.y)

  if (_config.dataPointIndex > -1 && _config.seriesIndex > -1) {
    frequencyData.value = convertEnter(
      matrix.value.frequencies[_config.seriesIndex].frequencyContents
    )
    strengtyData.value = convertEnter(
      matrix.value.strengties[_config.dataPointIndex].strengthContents
    )
    riskData.value = _config.w.config.series[_config.seriesIndex].data[_config.dataPointIndex].y
    isSelected.value = true
  }
}
function mouseMove(_event: any, _chartContext: any, _config: any) {
  if (isSelected.value) return
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
function change() {
  // this.$refs['chart'].refresh()
}
function addF() {
  matrix.value.frequencies?.push({
    ramMatrixFrequencyId: uid(),
    ramMatrixId: props.popupParam.ramMatrixId,
    frequency: '',
    frequencyContents: '', // 내용
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeF() {
  const selectData = tableF.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!matrix.value.deleteFrequencies) {
      matrix.value.deleteFrequencies = []
    }
    _.forEach(selectData, (item: any) => {
      if (
        _.findIndex(matrix.value.deleteFrequencies, {
          ramMatrixFrequencyId: item.ramMatrixFrequencyId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        matrix.value.deleteFrequencies?.push(item)
      }
      matrix.value.frequencies = _.reject(matrix.value.frequencies, {
        ramMatrixFrequencyId: item.ramMatrixFrequencyId
      })
    })
    tableF.value.compoTable.clearSelection()
  }
}
function addS() {
  matrix.value.strengties?.push({
    ramMatrixStrengthId: uid(),
    ramMatrixId: props.popupParam.ramMatrixId,
    strength: '',
    strengthContents: '', // 내용
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeS() {
  const selectData = tableS.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!matrix.value.deleteStrengties) {
      matrix.value.deleteStrengties = []
    }
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(matrix.value.deleteStrengties, {
          ramMatrixStrengthId: item.ramMatrixStrengthId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        matrix.value.deleteStrengties?.push(item)
      }
      matrix.value.strengties = _.reject(matrix.value.strengties, {
        ramMatrixStrengthId: item.ramMatrixStrengthId
      })
    })
    tableS.value.compoTable.clearSelection()
  }
}
function accept() {
  _.forEach(matrix.value.standards, (range) => {
    range.min = range.model.min
    range.max = range.model.max
  })
  haveRisk.value = false
  setChart()
}
function acceptStandardMatrixRisk() {
  const _aranges = [] as any
  if (matrix.value.standards && matrix.value.standards.length > 0) {
    _.forEach(matrix.value.standards, (_range) => {
      _range.min = _range.model.min
      _range.max = _range.model.max
      _aranges.push({
        from: _range.min,
        to: _range.max,
        name: _range.riskContents,
        color: _range.color
      })
    })
  }
  haveRisk.value = false

  chartRisk.value.updateOptions({
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: _aranges
        }
      }
    }
  })

  // this.$refs['chart'].refresh()
}
function addR() {
  matrix.value.standards?.push({
    ramMatrixRiskStandardsId: uid(),
    model: {
      min: 0,
      max: 0
    },
    min: 0,
    max: 0,
    checked: false,
    riskContents: '',
    color: '#c0c0c0',
    editFlag: 'C'
  })
}
function removeR() {
  const selectData = _.filter(matrix.value.standards, { checked: true })
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '하나 이상 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!matrix.value.deleteStandards) {
      matrix.value.deleteStandards = []
    }
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(matrix.value.deleteStandards, {
          ramMatrixRiskStandardsId: item.ramMatrixRiskStandardsId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        matrix.value.deleteStandards?.push(item)
      }
      matrix.value.standards = _.reject(matrix.value.standards, item)
    })
  }
}
function datachange(_range: any, _newValue?: stringNull) {
  if (_range.editFlag !== 'C') {
    _range.editFlag = 'U'
    _range.chgUserId = user.value.userId
  }
  if (_newValue) _range.riskContents = _newValue
}
function saveMatrix() {
  if (props.popupParam.ramMatrixId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.ram.matrix.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.ram.matrix.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      let saving = true
      const isF = matrix.value.frequencies && matrix.value.frequencies.length > 0
      const isS = matrix.value.strengties && matrix.value.strengties.length > 0
      // 빈도에서 행은 추가가 되어있지만 값이 안들어간 경우를 체크
      if (isF) {
        saving = validTable(gridFColumns.value, matrix.value.frequencies)
      }
      // 강도에서 행은 추가가 되어있지만 값이 안들어간 경우를 체크
      if (isS) {
        saving = validTable(gridSColumns.value, matrix.value.strengties)
      }
      // 빈도 강도에 맞게 위험도가 표시되어 있는지 체크
      if (isF && isS) {
        // 위험도 매트릭스가 그려진 경우 true
        saving = chart.value.series && chart.value.series.length > 0
        if (!saving) {
          message.alert({
            title: '안내',
            message:
              '빈도, 강도에 맞춰 위험도 Matrix가 만들어지지 않았습니다. 빈도&강도 적용 버튼을 통해 위험도 Matrix를 확인 후 저장하시기 바랍니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
        // series의 길이는 곧 빈도 길이, 빈도를 수정하여 행의 길이가 변경되었을 경우 > 위험도 또한 변경 내용이 적용되어야 true
        saving = chart.value.series.length === matrix.value.frequencies?.length
        if (!saving) {
          message.alert({
            title: '안내',
            message:
              '변경된 빈도가 위험도 Matrix에 적용되지 않았습니다. 빈도&강도 적용 버튼을 통해 위험도 Matrix를 확인 후 저장하시기 바랍니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
        // series 안에 존재하는 data의 길이는 곧 강도 길이, 강도를 수정하여 행의 길이가 변경되었을 경우
        // 위험도 또한 변경 내용이 적용되어야 true
        saving = chart.value.series[0].data!.length === matrix.value.strengties?.length
        if (!saving) {
          message.alert({
            title: '안내',
            message:
              '변경된 강도가 위험도 Matrix에 적용되지 않았습니다. 빈도&강도 적용 버튼을 통해 위험도 Matrix를 확인 후 저장하시기 바랍니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
      }
      // 위험도 기준을 변경한 후 변경된 내용을 적용하였는지
      if (matrix.value.standards && matrix.value.standards.length > 0) {
        _.forEach(matrix.value.standards, (item) => {
          if (item.max !== item.model.max || item.min !== item.model.min) {
            saving = false
            message.alert({
              title: '안내',
              message:
                '변경된 위험도기준이 위험도 Matrix에 적용되지 않았습니다. 적용 버튼을 통해 위험도 Matrix를 확인 후 저장하시기 바랍니다.',
              type: 'warning' // success / info / warning / error
            })
            return false
          }
        })
      }
      if (saving) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            matrix.value.regUserId = user.value.userId
            matrix.value.chgUserId = user.value.userId
            // 위험도 셋팅 : series에 담겨 있는 정보를 토대로 risks를 setting처리
            matrix.value.risks = [] // 처음 가져온 값은 초기화 처리
            let fIndex = 0
            _.forEach(chart.value.series, (item) => {
              let sIndex = 0
              const frequency = matrix.value.frequencies[fIndex].frequency
              _.forEach(item.data, (cell) => {
                matrix.value.risks.push({
                  risk: cell.y,
                  frequency: frequency,
                  strength: matrix.value.strengties[sIndex].strength
                })
                sIndex++
              })
              fIndex++
            })
            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
function saveMatrixCallback(_result: any) {
  props.popupParam.ramMatrixId = _result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.matrix
  .q-toolbar__title
    font-size: 1em !important
</style>

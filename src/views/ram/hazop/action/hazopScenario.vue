<template>
  <div>
    <q-tabs v-model="nodeTab" shrink stretch dense align="left" class="borderTop">
      <div
        class="q-pl-sm q-pr-sm bg-grey-4 text-primary"
        style="display: flex; align-items: center; line-height: 36px"
      >
        <b>
          <q-icon name="check" size="xs" />
          {{ $language('노드') }}
        </b>
      </div>
      <keep-alive v-for="(tab, idx) in tabItems" :key="idx">
        <q-tab :name="tab.name" :label="tab.label" v-on:click="tabClick(tab)" />
      </keep-alive>
    </q-tabs>
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        dense
        dark
        default-opened
        icon="place"
        header-class="bg-blue-grey-6 text-white"
        expand-icon-class="text-white"
        :label="$language('노드 정보')"
      >
        <q-separator />
        <q-card class="q-pa-sm">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text title="평가명" :value="assessPlan.assessmentName" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text title="공정명" :value="processData.processName" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text
                title="도면번호 / 도면명"
                :value="draw.diagramNo + ' / ' + draw.diagramTitle"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text
                title="노드번호 / 노드명"
                :value="node.nodeNo + ' / ' + node.nodeTitle"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text title="노드설명" :value="node.nodeDesc" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text title="설계조건" :value="node.designConditions" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text title="작동조건" :value="node.operatingConditions" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text title="설계의도" :value="node.designIntent" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3">
              <c-label-text
                title="검토기간"
                :value="node.startStudyDate + '~' + node.endStudyDate"
              />
            </div>
          </div>
        </q-card>
      </q-expansion-item>
    </q-list>
    <c-table
      ref="table"
      title="시나리오 목록"
      :columns="gridColumns"
      :gridHeight="gridHeight"
      :data="node.hazopScenarios"
      :merge="grid.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      :customTrClass="setTrClass"
      selection="multiple"
      rowKey="ramHazopAssessScenarioId"
      @innerBtnClicked="innerBtnClicked"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="isCompared"
            label="이전평가결과조회"
            icon="compare_arrows"
            @btnClicked="compareScenario"
          />
          <c-btn
            v-if="editable && !disabled"
            label="이탈추가"
            icon="add"
            @btnClicked="addRiskType"
          />
          <c-btn
            v-if="editable && !disabled && node.hazopScenarios && node.hazopScenarios.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeScenario"
          />
          <c-btn
            v-if="editable && !disabled && node.hazopScenarios && node.hazopScenarios.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="node.hazopScenarios"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveScenario"
            @btnCallback="saveScenarioCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled && Boolean(props.row.ramHazopAssessScenarioId)"
            :requestContentsCols="requestContentsCols"
            tableKey="ramHazopAssessScenarioId"
            ibmTaskTypeCd="ITT0000001"
            ibmTaskUnderTypeCd="ITTU000001"
            @imprChange="imprChange"
          />
        </template>
        <template v-else-if="col.name === 'afterRisk' || col.name === 'beforeRisk'">
          <q-btn
            v-if="editable && !disabled"
            flat
            size="12px"
            :color="disabled ? '' : 'blue-6'"
            :label="props.row[col.name] ? props.row[col.name] : '보기'"
          >
            <q-popup-proxy
              :breakpoint="1000"
              ref="popupProxy"
              :id="'proxy_' + props.rowIndex + '_' + col.name"
            >
              <component
                :is="col.component"
                :props="props"
                :col="col"
                :editable="editable"
                @callback="(data: any) => callbackProxy(data, props, col)"
              />
            </q-popup-proxy>
          </q-btn>
          <q-btn
            v-else
            flat
            size="12px"
            :color="disabled ? '' : 'blue-6'"
            :label="props.row[col.name] ? props.row[col.name] : ''"
          />
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
import { processDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazopScenario'
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
const emits = defineEmits(['research', 'assessComplete'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  processData: processDataType
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    ramTechniqueCd: stringNull
  }
  disabled: boolean
  draw: {
    ramRiskAssessmentPlanId: stringNull // 평가 일련번호
    processCd: stringNull // 단위공정 코드
    processName: stringNull // 단위공정 코드
    psiDiagramId: stringNull // 도면 일련번호
    ramTechniqueCd: stringNull // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
    diagramNo: stringNull // 도면번호
    diagramTitle: stringNull // 도면명
    nodes: Array<any>
  }
}
interface gridType {
  columns?: tableColumnType
  height?: stringNull
  merge?: tableMergeType
  data?: Array<any>
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
  draw: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정 코드
      psiDiagramId: '', // 도면 일련번호
      ramTechniqueCd: '', // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
      diagramNo: '', // 도면번호
      diagramTitle: '', // 도면명
      nodes: []
    }
  },
  processData: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정명
      ramProcessAssessStepCd: '', // 평가진행상태
      processExplainFeature: '', // 공정 특징 설명
      assessDeptCd: '', // 평가 부서 코드
      assessUserId: '', // 평가 담당자
      assessUserName: '', // 평가 담당자
      workCycleCd: null, // 작업발생주기코드
      workingTime: 0, // 작업시간(1회)
      vendorFlag: 0,
      temperature: null,
      workMeasurementPlanId: '',
      measPlanContent: '',
      workCycleName: '',
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      jobs: [],
      sops: [],
      drawNodes: [],
      draws: [],
      fmScenarios: [],
      hazopScenarios: [],
      scenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: [],
      reCheckedCnt: 0
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      ramTechniqueCd: ''
    }
  },
  disabled: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupProxy = ref<any>(null)
const nodeTab = ref('')
const node = ref<any>({
  ramAssessNodeId: '', // 노드 일련번호
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  ramTechniqueCd: '', // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
  processCd: '', // 단위공정 코드
  psiDiagramId: '', // 도면 일련번호
  nodeNo: '', // 노드 번호_수기입력
  nodeTitle: '', // 노드 타이틀
  nodeDesc: '', // 노드 설명
  designConditions: '', // 설계조건
  operatingConditions: '', // 작동조건
  designIntent: '', // 설계의도
  startStudyDate: '', // 검토 시작일
  endStudyDate: '', // 검토 종료일
  hazopScenarios: [],
  ramMatrixId: ''
})
const activeWinProps = ref<any>({
  processCd: '',
  ramHazopAssessScenarioId: ''
})
const guideWordItems = ref<codeMasterType>([])
const rowIndex = ref(0)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const detailUrl = ref('')
const table = ref<any>(null)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const assessPlan = ref<any>({
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  ramTechniqueCd: '', // 평가기법 코드_HAZOP/KRAS/JSA/CHECKLIST
  assessmentName: '' // 평가명
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'deviationName' }],
  data: [],
  height: '450px'
})
const checkChildClosed = ref<numberNull>(null)
const winPopup = ref<Window | null>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridColumns = computed(() => {
  return [
    {
      fix: true,
      name: 'deviationName',
      field: 'deviationName',
      label: '이탈',
      align: 'center',
      style: 'width:100px',
      innerBtn: true,
      btns: [
        {
          label: '',
          icon: 'add',
          color: 'light-blue',
          value: '1',
          tooltip: `${$language('가능한 원인 추가')} <span style="color:yellow"><b>${$language('(※ 관리되는 항목)')}'</b></span>`
        },
        { label: '', icon: 'add', color: 'orange', value: '2', tooltip: $language('원인 추가') }
      ],
      sortable: false
    },
    {
      fix: true,
      name: 'nodeVariableDesignIntent',
      field: 'nodeVariableDesignIntent',
      label: '설계의도',
      align: 'left',
      style: 'width:180px',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      name: 'riskOccurrenceCause',
      field: 'riskOccurrenceCause',
      label: '원인',
      align: 'left',
      style: 'width:180px',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      name: 'riskOccurrenceResult',
      field: 'riskOccurrenceResult',
      label: '결과',
      align: 'left',
      style: 'width:180px',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      name: 'relationLaw',
      field: 'relationLaw',
      label: '관련법규',
      align: 'left',
      style: 'width:120px',
      type: 'text',
      sortable: false
    },
    {
      name: 'currentSafetyMeasures',
      field: 'currentSafetyMeasures',
      label: '현재안전조치',
      align: 'left',
      style: 'width:170px',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      name: 'before',
      field: 'before',
      label: '개선전',
      align: 'center',
      child: [
        {
          name: 'beforeFrequency',
          field: 'beforeFrequency',
          label: '빈도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'beforeStrength',
          field: 'beforeStrength',
          label: '강도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'beforeRisk',
          field: 'beforeRisk',
          label: '위험도',
          align: 'center',
          style: 'width:70px',
          sortable: false,
          type: 'custom',
          component: riskPopComponent.value
        }
      ]
    },
    {
      name: 'after',
      field: 'after',
      label: '개선후',
      align: 'center',
      child: [
        {
          name: 'afterFrequency',
          field: 'afterFrequency',
          label: '빈도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'afterStrength',
          field: 'afterStrength',
          label: '강도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'afterRisk',
          field: 'afterRisk',
          label: '위험도',
          align: 'center',
          style: 'width:70px',
          sortable: false,
          required: true,
          type: 'custom',
          component: riskPopComponent.value
        }
      ]
    },
    {
      name: 'assessDate',
      field: 'assessDate',
      label: '평가일',
      align: 'center',
      type: 'date',
      style: 'width:130px',
      sortable: false,
      required: true
    },
    {
      name: 'assessUserName',
      field: 'assessUserName',
      label: '평가자',
      align: 'center',
      type: 'user',
      userId: 'assessUserId',
      style: 'width:100px',
      sortable: false,
      required: true
    },
    {
      name: 'riskbookFlag',
      field: 'riskbookFlag',
      label: '위험등록부',
      align: 'center',
      style: 'width:70px',
      sortable: true,
      type: 'check',
      true: 'Y',
      false: 'N',
      disableTarget: 'riskRegisterFlag',
      disableCon: false
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선진행',
      align: 'center',
      child: [
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:150px',
          type: 'custom',
          sortable: false
        },
        {
          name: 'improvementMeasures',
          field: 'improvementMeasures',
          label: '개선대책',
          align: 'left',
          style: 'width:180px',
          type: 'text',
          sortable: false
        }
      ]
    }
  ]
})
const gridHeight = computed(() => {
  return String(window.innerHeight - 570) + 'px'
})
const riskPopComponent = computed(() => {
  return shallowRef(defineAsyncComponent(() => import(`@/views/ram/base/matrixPop.vue`)))
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const isCompared = computed(() => {
  return props.processData.reCheckedCnt > 0
})
const tabItems = computed(() => {
  const data = [] as any
  _.forEach(props.draw.nodes, (node) => {
    data.push({
      name: node.ramAssessNodeId,
      label: node.nodeTitle + ' (' + node.nodeNo + ')',
      node: node
    })
  })
  return data
})
const requestContentsCols = computed(() => {
  return ['deviationName', 'nodeVariableDesignIntent']
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => winPopup.value,
  () => {
    if (!winPopup.value) return
    checkChildClosed.value = setInterval(() => {
      if (!winPopup.value || winPopup.value.closed) {
        activeWinProps.value.processCd = ''
        activeWinProps.value.ramHazopAssessScenarioId = ''
        clearInterval(checkChildClosed.value)
        winPopup.value = null // 상태 초기화
      }
    }, 500) // 2초마다 확인
  },
  { immediate: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})
onUnmounted(() => {
  clearInterval(checkChildClosed.value)
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
  listUrl.value = selectConfig.ram.hazop.scenario.list.url
  saveUrl.value = transactionConfig.ram.hazop.scenario.save.url
  deleteUrl.value = transactionConfig.ram.hazop.scenario.delete.url
  detailUrl.value = selectConfig.ram.assessPlan.get.url
  // code setting
  getComboItems('RAM_VARIABLE_GUIDEWORD_CD').then((_result: any) => {
    guideWordItems.value = _result
  })
  // list setting
  nodeTab.value = props.draw.nodes[0].ramAssessNodeId
  tabClick({ node: props.draw.nodes[0] })

  $http({
    url: $format(detailUrl.value, props.param.ramRiskAssessmentPlanId),
    method: 'GET'
  }).then((_result: any) => {
    assessPlan.value = _result.data
  })
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramAssessNodeId: node.value.ramAssessNodeId
    }
  }).then((_result: any) => {
    node.value.hazopScenarios = _result.data
    const idx = _.findIndex(props.draw.nodes, { ramAssessNodeId: node.value.ramAssessNodeId })
    props.draw.nodes[idx].hazopScenarios = _result.data
  })
}
function research() {
  emits('research')
}
function tabClick(_tab: any) {
  _.extend(node.value, _tab.node)
}
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
  research()
}
function innerBtnClicked(_col: any, _props: any, _btn: any) {
  if (_col.name === 'deviationName') {
    if (_btn.value === '1') {
      rowIndex.value = _props.rowIndex
      popupOptions.value.title = '가능한 원인'
      popupOptions.value.param = {
        ramVariableId: _props.row.ramVariableId,
        ramVariableGuidewordCd: _props.row.ramVariableGuidewordCd,
        deviationName: _props.row.deviationName
      }
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import('@views/ram/base/hazopCausePop.vue'))
      )
      popupOptions.value.width = '45%'
      popupOptions.value.isFull = false
      popupOptions.value.visible = true
      popupOptions.value.closeCallback = closeCausePopup
    } else {
      node.value.hazopScenarios?.splice(_props.rowIndex, 0, {
        ramHazopAssessScenarioId: uid(),
        ramAssessNodeId: node.value.ramAssessNodeId,
        ramVariableGuidewordId: _props.row.ramVariableGuidewordId,
        ramVariableId: _props.row.ramVariableId,
        ramVariableGuidewordCd: _props.row.ramVariableGuidewordCd,
        deviationName: _props.row.deviationName,
        nodeVariableDesignIntent: '',
        riskOccurrenceCause: '',
        riskOccurrenceResult: '',
        currentSafetyMeasures: '',
        beforeRamMatrixRiskId: '', // 전 위험도 no
        afterRamMatrixRiskId: '', // 후 위험도 no
        improvementMeasures: '', // 개선대책_개선요청과 별개로 수기 입력
        assessDate: getToday(),
        assessUserName: _props.row.assessUserName,
        assessUserId: _props.row.assessUserId,
        riskbookFlag: 'N',
        sopImprovementIds: '',
        ibmStepNames: '',
        editFlag: 'C',
        ramMatrixId: node.value.ramMatrixId,
        // 위험등록부 등재를 위한 prop
        ramRiskAssessmentPlanId: node.value.ramRiskAssessmentPlanId,
        processCd: node.value.processCd,
        riskRegisterFlag: false
      })
    }
  }
}
function closeCausePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      node.value.hazopScenarios.splice(rowIndex.value, 0, {
        ramHazopAssessScenarioId: uid(),
        ramAssessNodeId: node.value.ramAssessNodeId,
        ramVariableId: item.ramVariableId,
        ramVariableGuidewordCd: item.ramVariableGuidewordCd,
        ramVariableGuidewordId: item.ramVariableGuidewordId,
        deviationName: item.deviationName,
        nodeVariableDesignIntent: '',
        riskOccurrenceCause: item.causeName,
        riskOccurrenceResult: '',
        currentSafetyMeasures: '',
        beforeRamMatrixRiskId: '', // 전 위험도 no
        afterRamMatrixRiskId: '', // 후 위험도 no
        improvementMeasures: '', // 개선대책_개선요청과 별개로 수기 입력
        assessDate: getToday(),
        assessUserName: _.clone(props.processData.assessUserName),
        assessUserId: _.clone(props.processData.assessUserId),
        riskbookFlag: 'N',
        sopImprovementIds: '',
        ibmStepNames: '',
        editFlag: 'C',
        ramMatrixId: node.value.ramMatrixId,
        // 위험등록부 등재를 위한 prop
        ramRiskAssessmentPlanId: node.value.ramRiskAssessmentPlanId,
        processCd: node.value.processCd,
        riskRegisterFlag: false
      })
    })
  }
}
function callbackProxy(_data: any, _props: any, _col: any) {
  if (_col.name === 'beforeRisk') {
    node.value.hazopScenarios[_props.rowIndex].beforeFrequency = _data.f
    node.value.hazopScenarios[_props.rowIndex].beforeStrength = _data.s
    node.value.hazopScenarios[_props.rowIndex].beforeRisk = _data.r
    node.value.hazopScenarios[_props.rowIndex].beforeRamMatrixRiskId = _data.ramMatrixRiskId
  } else {
    node.value.hazopScenarios[_props.rowIndex].afterFrequency = _data.f
    node.value.hazopScenarios[_props.rowIndex].afterStrength = _data.s
    node.value.hazopScenarios[_props.rowIndex].afterRisk = _data.r
    node.value.hazopScenarios[_props.rowIndex].afterRamMatrixRiskId = _data.ramMatrixRiskId
  }
  if (node.value.hazopScenarios[_props.rowIndex].editFlag !== 'C') {
    node.value.hazopScenarios[_props.rowIndex].editFlag = 'U'
  }
  const refName = 'proxy_' + _props.rowIndex + '_' + _col.name
  const elements = document.getElementById(refName) as any
  if (elements) {
    elements.style.display = 'none'
  }
}
function addRiskType() {
  popupOptions.value.title = '가이드워드'
  popupOptions.value.param = {
    guideWordItems: guideWordItems.value,
    data: node.value.hazopScenarios,
    node: node.value,
    ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId,
    type: 'multiple'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/base/hazopGuidewordPop.vue'))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeRiskTypePopup
}
function closeRiskTypePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      _.forEach(guideWordItems.value, (gw) => {
        const name = item.variableName + ' - ' + gw.codeName
        const index = _.findIndex(node.value.hazopScenarios, { deviationName: name })
        if (item[gw.code] === 'Y' && index === -1) {
          node.value.hazopScenarios.push({
            ramHazopAssessScenarioId: uid(),
            ramAssessNodeId: node.value.ramAssessNodeId,
            ramVariableId: item.ramVariableId,
            ramVariableGuidewordCd: gw.code,
            ramVariableGuidewordId: item[gw.code + '_id'],
            deviationName: name,
            nodeVariableDesignIntent: '',
            riskOccurrenceCause: '',
            riskOccurrenceResult: '',
            currentSafetyMeasures: '',
            beforeRamMatrixRiskId: '', // 전 위험도 no
            afterRamMatrixRiskId: '', // 후 위험도 no
            improvementMeasures: '', // 개선대책_개선요청과 별개로 수기 입력
            assessDate: getToday(),
            assessUserName: _.clone(props.processData.assessUserName),
            assessUserId: _.clone(props.processData.assessUserId),
            riskbookFlag: 'N',
            sopImprovementIds: '',
            ibmStepNames: '',
            editFlag: 'C',
            ramMatrixId: node.value.ramMatrixId,
            // 위험등록부 등재를 위한 prop
            ramRiskAssessmentPlanId: node.value.ramRiskAssessmentPlanId,
            processCd: node.value.processCd,
            riskRegisterFlag: false
          })
        } else if (item[gw.code] === 'N' && index > -1) {
          node.value.hazopScenarios = _.reject(node.value.hazopScenarios, {
            deviationName: name
          })
        }
      })
    })
    const checkLists = [] as any
    _.forEach(guideWordItems.value, (gw) => {
      const filterData = _.filter(data, (item) => {
        return item[gw.code] === 'Y'
      })
      _.forEach(filterData, (fd) => {
        checkLists.push(fd.variableName + ' - ' + gw.codeName)
      })
    })
    const deleteLists = [] as any
    _.forEach(node.value.hazopScenarios, (gridItem) => {
      const index = _.indexOf(checkLists, gridItem.deviationName)
      if (index === -1) {
        deleteLists.push(gridItem.deviationName)
      }
    })
    if (deleteLists && deleteLists.length > 0) {
      _.forEach(deleteLists, (deleteItem) => {
        node.value.hazopScenarios = _.reject(node.value.hazopScenarios, {
          deviationName: deleteItem
        })
      })
    }
  }
}
function saveScenario() {
  if (validTable(gridColumns.value, node.value.hazopScenarios)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(node.value.hazopScenarios, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })

        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveScenarioCallback() {
  message.requestSuccess()
  research()
  getList()
}
function removeScenario() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            node.value.hazopScenarios.splice(_.findIndex(node.value.hazopScenarios, item), 1)
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function compareScenario() {
  const width = 1560
  const height = 700
  // 중앙 정렬 위치 계산
  const left = window.screenX + (window.innerWidth - width) / 2
  const top = window.screenY + (window.innerHeight - height) / 2
  const uri = `/ram/compare/compareScenario?ramTechniqueCd=${props.param.ramTechniqueCd}&ramRiskAssessmentPlanId=${props.param.ramRiskAssessmentPlanId}&processCd=${props.processData.processCd}&psiDiagramId=${node.value.psiDiagramId}&nodeNo=${node.value.nodeNo}`
  window.open(
    uri,
    'compareBefore',
    `width=${width}, height=${height}, menubar=no, status=no, toolbar=no, left=${left}, top=${top}`
  )
  // window.addEventListener('message', handleMessage)
}
;(window as any).receiveDataFromChild = (_data: any) => {
  activeWinProps.value.processCd = _data.processCd
  activeWinProps.value.ramHazopAssessScenarioId = _data.ramHazopAssessScenarioId
}
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramHazopAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramHazopAssessScenarioId = event.data.ramHazopAssessScenarioId
// }
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramHazopAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.borderTop
  border-top: 2px solid #d5d5d5 !important
  border-radius: 8px 0 0 0 !important
</style>

<template>
  <div>
    <q-tabs v-model="nodeTab" shrink stretch dense align="left">
      <div
        class="q-pl-sm q-pr-sm"
        style="
          background: #b2dfdb;
          color: #00695c;
          height: 100%;
          display: flex;
          align-items: center;
        "
      >
        <b>
          <q-icon name="sms" size="xs" />
          {{ $language('노드') }}
        </b>
      </div>
      <keep-alive v-for="(tab, idx) in tabItems" :key="idx">
        <q-tab :name="tab.name" :label="tab.label" v-on:click="tabClick(tab)" />
      </keep-alive>
    </q-tabs>
    <div class="row">
      <div class="col-12">
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
                  <c-label-text
                    title="도면번호 / 도면명"
                    :value="draw.diagramNo + ' / ' + draw.diagramTitle"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3">
                  <c-label-text
                    title="노드번호 / 노드명"
                    :value="node.nodeNo + ' / ' + node.nodeTitle"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3">
                  <c-label-text
                    title="검토기간"
                    :value="node.startStudyDate + '~' + node.endStudyDate"
                  />
                </div>
              </div>
              <div class="row">
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
              </div>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
    <c-table
      ref="table"
      title="시나리오 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="node.scenarios"
      :merge="grid.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      :customTrClass="setTrClass"
      selection="multiple"
      rowKey="ramKpsrAssessScenarioId"
      @innerBtnClicked="innerBtnClicked"
    >
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
            label="위험형태 추가"
            icon="add"
            @btnClicked="addRiskType"
          />
          <c-btn
            v-if="editable && !disabled && node.scenarios && node.scenarios.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeScenario"
          />
          <c-btn
            v-if="editable && !disabled && node.scenarios && node.scenarios.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="node.scenarios"
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
            :inputEditable="editable && Boolean(props.row.ramKpsrAssessScenarioId)"
            :requestContentsCols="requestContentsCols"
            tableKey="ramKpsrAssessScenarioId"
            ibmTaskTypeCd="ITT0000005"
            ibmTaskUnderTypeCd="ITTU000005"
            @imprChange="imprChange"
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
  name: 'kpsrScenario'
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
  ramKpsrAssessScenarioId: ''
})
const rowIndex = ref(0)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const detailUrl = ref('')
const table = ref<any>(null)
const winPopup = ref<any>(null)
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
  merge: [{ index: 0, colName: 'riskTypName' }],
  columns: [
    {
      fix: true,
      name: 'riskTypName',
      field: 'riskTypName',
      label: '위험형태',
      align: 'center',
      style: 'width:100px',
      innerBtn: true,
      btns: [
        {
          label: '',
          icon: 'add',
          color: 'light-blue',
          value: '1',
          tooltip: `위험형태별 원인 추가 <span style="color: yellow"><b>(※ 관리되는 항목)</b></span>`
        },
        { label: '', icon: 'add', color: 'orange', value: '2', tooltip: '위험형태별 원인 추가' }
      ],
      sortable: false
    },
    {
      fix: true,
      name: 'riskOccurrenceCause',
      field: 'riskOccurrenceCause',
      label: '원인',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      fix: true,
      name: 'riskOccurrenceResult',
      field: 'riskOccurrenceResult',
      label: '결과',
      align: 'left',
      style: 'width:200px',
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
      name: 'relationProblem',
      field: 'relationProblem',
      label: '관련문제사항',
      align: 'left',
      type: 'text',
      style: 'width:120px',
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
      style: 'width:80px',
      sortable: false,
      required: true
    },
    {
      name: 'riskbookFlag',
      field: 'riskbookFlag',
      label: '위험등록부',
      align: 'center',
      style: 'width:90px',
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
          style: 'width:130px',
          type: 'custom',
          sortable: false
        },
        {
          name: 'improvementMeasures',
          field: 'improvementMeasures',
          label: '개선대책',
          align: 'left',
          style: 'width:200px',
          type: 'text',
          sortable: false
        }
      ]
    }
  ],
  data: [],
  height: 'auto' //'480px'
})
const checkChildClosed = ref<numberNull>(null)

/******************************
 * @Computed_선언
 *******************************/
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
  return ['riskTypName', 'riskOccurrenceCause']
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
        activeWinProps.value.ram4mAssessScenarioId = ''
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
  listUrl.value = selectConfig.ram.kpsr.scenario.list.url
  saveUrl.value = transactionConfig.ram.kpsr.scenario.save.url
  deleteUrl.value = transactionConfig.ram.kpsr.scenario.delete.url
  detailUrl.value = selectConfig.ram.assessPlan.get.url
  // code setting
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
    node.value.scenarios = _result.data
    const idx = _.findIndex(props.draw.nodes, { ramAssessNodeId: node.value.ramAssessNodeId })
    props.draw.nodes[idx].scenarios = _result.data
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
  if (_col.name === 'riskTypName') {
    if (_btn.value === '1') {
      rowIndex.value = _props.rowIndex
      popupOptions.value.title = '위험형태별 원인'
      popupOptions.value.param = {
        ramRiskTypeId: _props.row.ramRiskTypeId,
        riskTypName: _props.row.riskTypName,
        type: 'multiple'
      }
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import('@views/ram/base/kpsrCausePop.vue'))
      )
      popupOptions.value.width = '60%'
      popupOptions.value.isFull = false
      popupOptions.value.visible = true
      popupOptions.value.closeCallback = closeCausePopup
    } else {
      node.value.scenarios.splice(_props.rowIndex, 0, {
        ramKpsrAssessScenarioId: uid(),
        ramAssessNodeId: node.value.ramAssessNodeId,
        ramRiskTypeId: _props.row.ramRiskTypeId,
        riskTypName: _props.row.riskTypName,
        riskOccurrenceCause: '',
        riskOccurrenceResult: '',
        relationProblem: '',
        currentSafetyMeasures: '',
        assessDate: getToday(),
        assessUserName: _.clone(props.processData.assessUserName),
        assessUserId: _.clone(props.processData.assessUserId),
        riskbookFlag: 'N',
        sopImprovementIds: '',
        ibmStepNames: '',
        improvementMeasures: '',
        editFlag: 'C',
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
      node.value.scenarios.splice(rowIndex.value, 0, {
        ramKpsrAssessScenarioId: uid(),
        ramAssessNodeId: node.value.ramAssessNodeId,
        ramRiskTypeId: item.ramRiskTypeId,
        riskTypName: item.riskTypName,
        riskOccurrenceCause: item.riskTypeCauseMainName + ' - ' + item.riskTypeCauseSubName,
        riskOccurrenceResult: '',
        relationProblem: '',
        currentSafetyMeasures: '',
        assessDate: getToday(),
        assessUserName: _.clone(props.processData.assessUserName),
        assessUserId: _.clone(props.processData.assessUserId),
        riskbookFlag: 'N',
        sopImprovementIds: '',
        ibmStepNames: '',
        improvementMeasures: '',
        editFlag: 'C',
        // 위험등록부 등재를 위한 prop
        ramRiskAssessmentPlanId: node.value.ramRiskAssessmentPlanId,
        processCd: node.value.processCd,
        riskRegisterFlag: false
      })
    })
  }
}
function addRiskType() {
  popupOptions.value.title = '위험형태'
  popupOptions.value.param = { type: 'multiple' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/base/kpsrGuidewordPop.vue'))
  )
  popupOptions.value.width = '40%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeRiskTypePopup
}
function closeRiskTypePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(node.value.scenarios, { ramRiskTypeId: item.ramRiskTypeId }) === -1) {
        node.value.scenarios!.splice(0, 0, {
          ramKpsrAssessScenarioId: uid(),
          ramAssessNodeId: node.value.ramAssessNodeId,
          ramRiskTypeId: item.ramRiskTypeId,
          riskTypName: item.riskTypName,
          riskOccurrenceCause: '',
          riskOccurrenceResult: '',
          relationProblem: '',
          currentSafetyMeasures: '',
          assessDate: getToday(),
          assessUserName: _.clone(props.processData.assessUserName),
          assessUserId: _.clone(props.processData.assessUserId),
          riskbookFlag: 'N',
          sopImprovementIds: '',
          ibmStepNames: '',
          improvementMeasures: '',
          editFlag: 'C',
          // 위험등록부 등재를 위한 prop
          ramRiskAssessmentPlanId: node.value.ramRiskAssessmentPlanId,
          processCd: node.value.processCd,
          riskRegisterFlag: false
        })
      }
    })
  }
}
function saveScenario() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      _.forEach(node.value.scenarios, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
      })

      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
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
            node.value.scenarios.splice(_.findIndex(node.value.scenarios, item), 1)
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
  winPopup.value = window.open(
    uri,
    'compareBefore',
    `width=${width}, height=${height}, menubar=no, status=no, toolbar=no, left=${left}, top=${top}`
  )
  // window.addEventListener('message', handleMessage)
}
;(window as any).receiveDataFromChild = (_data: any) => {
  activeWinProps.value.processCd = _data.processCd
  activeWinProps.value.ramKpsrAssessScenarioId = _data.ramKpsrAssessScenarioId
}
/******************************
 * TODO (목적): 메시지 수신 핸들러 함수 (중복 방지)
 ******************************/
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramHazopAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramHazopAssessScenarioId = event.data.ramHazopAssessScenarioId
// }
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramKpsrAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="table"
        title="평가대상 목록 - 도면/노드"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="processData.drawNodes"
        :merge="grid.merge"
        :columnSetting="false"
        :expandAll="false"
        :isFullScreen="false"
        :usePaging="false"
        :hideBottom="true"
        :filtering="false"
        :editable="editable && !disabled && isSelect"
        selection="multiple"
        rowKey="ramAssessNodeId"
        @innerBtnClicked="innerBtnClicked"
      >
        <template v-slot:table-button>
          <q-chip
            v-show="
              editable &&
              !disabled &&
              isSelect &&
              processData.drawNodes &&
              processData.drawNodes.length > 0
            "
            outline
            square
            clickable
            size="md"
            color="green"
            icon="contact_support"
            :label="$language('범례')"
            style="height: 26px; margin-right: 2px !important"
          >
            <q-popup-proxy>
              <q-banner>
                <q-icon
                  color="white"
                  name="add"
                  size="xs"
                  class="bg-green"
                  style="border-radius: 4px"
                />
                <span style="color: gray; margin-left: 10px"> : {{ $language('노드추가') }}</span>
              </q-banner>
            </q-popup-proxy>
          </q-chip>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="추가"
              icon="add"
              @btnClicked="addProcessDraw"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.drawNodes &&
                processData.drawNodes.length > 0
              "
              label="삭제"
              icon="remove"
              @btnClicked="removeDrawNode"
            />
            <c-btn
              v-show="false"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="drawNodeSave"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveDrawNode"
              @btnCallback="saveDrawNodeCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <q-chip
              color="amber"
              outline
              square
              :clickable="true"
              text-color="white"
              style="margin-bottom: 4px !important"
              @click.stop="
                () => {
                  rowClick(props.row, props.pageIndex)
                }
              "
            >
              {{ $language('수정') }}
            </q-chip>
          </template>
        </template>
      </c-table>
    </div>
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editForm">
          <c-card title="도면/노드 추가" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled && isSelect && isRowEditing"
                  :disabled="disabledNode"
                  label="저장"
                  icon="save"
                  @btnClicked="accepts"
                />
                <c-btn label="닫기" icon="close" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="공정"
                  name="processName"
                  v-model:value="drawNode.processName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="도면번호"
                  name="diagramNo"
                  v-model:value="drawNode.diagramNo"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="도면명"
                  name="diagramTitle"
                  v-model:value="drawNode.diagramTitle"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  label="노드번호"
                  name="nodeNo"
                  v-model:value="drawNode.nodeNo"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  label="노드"
                  name="nodeTitle"
                  v-model:value="drawNode.nodeTitle"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  label="노드설명"
                  name="nodeDesc"
                  v-model:value="drawNode.nodeDesc"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  label="설계조건"
                  name="designConditions"
                  v-model:value="drawNode.designConditions"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  label="작동조건"
                  name="operatingConditions"
                  v-model:value="drawNode.operatingConditions"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  label="설계의도"
                  name="designIntent"
                  v-model:value="drawNode.designIntent"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-12">
                <c-datepicker
                  :editable="editable"
                  :disabled="disabledNode || !isRowEditing"
                  :required="true"
                  :range="true"
                  label="검토기간"
                  name="studyPeriod"
                  v-model:value="drawNode.studyPeriod"
                  @dataChange="dataChange"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
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
import { processDataType, drawNodeType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'kpsrTargetPidNode'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['saveProcess'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  processData: processDataType
  disabled: boolean
}

interface gridType {
  columns: tableColumnType
  height: stringNull
  merge: tableMergeType
  data: Array<any>
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
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
      thirdScenarios: []
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
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'processCd' },
    { index: 1, colName: 'groupPsiDiagramId' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'diagramTitle',
      field: 'diagramTitle',
      description: 'diagramNo',
      label: '도면명',
      align: 'center',
      style: 'width:200px',
      sortable: true,
      innerBtn: true,
      btns: [{ label: '', icon: 'add', color: 'green' }]
    },
    {
      name: 'nodeTitle',
      field: 'nodeTitle',
      description: 'nodeNo',
      label: '노드',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '수정',
      align: 'center',
      style: 'width:40px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '480px'
})
const drawNode = ref<drawNodeType>({
  ramAssessNodeId: '', // 노드 일련번호
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  ramTechniqueCd: '', // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정명
  groupPsiDiagramId: '', // 도면 일련번호
  psiDiagramId: '', // 도면 일련번호
  diagramNo: '', // 도면번호
  diagramTitle: '', // 도면명
  nodeNo: '', // 노드 번호_수기입력
  nodeTitle: '', // 노드 타이틀
  nodeDesc: '', // 노드 설명
  designConditions: '', // 설계조건
  operatingConditions: '', // 작동조건
  designIntent: '', // 설계의도
  startStudyDate: '', // 검토 시작일
  endStudyDate: '', // 검토 종료일
  regUserId: '', // 작성자 ID
  chgUserId: '', // 수정자 ID
  studyPeriod: [], // 검토기간
  isHazop: false
})
const drawNodeSave = ref<any>({
  ramRiskAssessmentPlanId: '',
  processCd: '',
  draws: [],
  nodes: [],
  deleteNodes: []
})
const isSameNodeName = ref(false)
const isRowClick = ref(false)
const isRowAdd = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const rowIndex = ref(0)
const dialog = ref(false)
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return props.processData &&
    props.processData.processCd &&
    props.processData.ramProcessAssessStepCd !== 'RPA0000005'
    ? true
    : false
})
const disabledNode = computed(() => {
  return props.disabled || drawNode.value.isHazop || !isSelect.value
})
const isRowEditing = computed(() => {
  return isRowClick.value || isRowAdd.value
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
  listUrl.value = selectConfig.ram.drawNode.list.url
  saveUrl.value = transactionConfig.ram.drawNode.save.url
  deleteUrl.value = transactionConfig.ram.drawNode.delete.url
  // code setting
  // list setting
}
function getDrawNodes() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.drawNodes = _result.data
  })
}
function addProcessDraw() {
  popupOptions.value.title = '공정 도면 검색'
  popupOptions.value.param = {
    type: 'multiple', // multiple
    processCd: props.processData.processCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@popups/psi/diagramPop.vue'))
  )
  popupOptions.value.width = '70%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeSopPopup
}
function closeSopPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.processData.drawNodes, { psiDiagramId: item.psiDiagramId }) === -1) {
        props.processData.drawNodes.splice(0, 0, {
          ramAssessNodeId: uid(),
          // 도면정보
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
          processCd: props.processData.processCd,
          processName: props.processData.processName,
          ramTechniqueCd: 'RT00000005',
          groupPsiDiagramId: props.processData.processCd + '/' + item.psiDiagramId,
          psiDiagramId: item.psiDiagramId,
          diagramNo: item.diagramNo,
          diagramTitle: item.diagramTitle,
          // 노드정보
          nodeNo: '', // 노드 번호_수기입력
          nodeTitle: '', // 노드 타이틀
          nodeDesc: '', // 노드 설명
          designConditions: '', // 설계조건
          operatingConditions: '', // 작동조건
          designIntent: '', // 설계의도
          startStudyDate: '', // 검토 시작일
          endStudyDate: '', // 검토 종료일
          studyPeriod: [], // 검토기간
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
    saveDrawNode()
  }
}
function rowClick(row: any, index: any) {
  /**
   * 이후에 해당 정보를 클릭 한 후 수정하려고 할 수 있도록 열것임
   * 다만 해당 마다 존재하는 키값이 temp로 따진 키가 아닐 경우에만 한에서 열어줄것임
   * 도면seq, 노드seq
   */
  rowIndex.value = index
  isRowClick.value = true
  _.extend(drawNode.value, row)
  if (drawNode.value.editFlag !== 'C') {
    drawNode.value.editFlag = 'U'
    drawNode.value.chgUserId = user.value.userId
    drawNode.value.studyPeriod = [drawNode.value.startStudyDate, drawNode.value.endStudyDate]
  }
  dialog.value = true
}
function innerBtnClicked(col: any, props: any) {
  rowIndex.value = props.rowIndex
  isRowAdd.value = true
  if (col.name === 'diagramTitle') {
    addNode(props)
  }
}
function addNode(_props: any) {
  /**
   * 2022-01-24 KDH
   * 버튼 누를 경우 목록에 개행하도록 변경
   */
  const _drawNode = {
    ramAssessNodeId: uid(),
    // 도면정보
    ramRiskAssessmentPlanId: _props.row.ramRiskAssessmentPlanId,
    processCd: _props.row.processCd,
    processName: _props.row.processName,
    ramTechniqueCd: _props.row.ramTechniqueCd,
    groupPsiDiagramId: _props.row.processCd + '/' + _props.row.psiDiagramId,
    psiDiagramId: _props.row.psiDiagramId,
    diagramNo: _props.row.diagramNo,
    diagramTitle: _props.row.diagramTitle,
    // 노드정보
    nodeNo: '', // 노드 번호_수기입력
    nodeTitle: '', // 노드 타이틀
    nodeDesc: '', // 노드 설명
    designConditions: '', // 설계조건
    operatingConditions: '', // 작동조건
    designIntent: '', // 설계의도
    startStudyDate: '', // 검토 시작일
    endStudyDate: '', // 검토 종료일
    studyPeriod: [], // 검토기간
    regUserId: user.value.userId,
    editFlag: 'C'
  }
  rowClick(_drawNode, rowIndex.value)
}
function dataChange() {
  if (isRowAdd.value) {
    if (
      _.findIndex(props.processData.drawNodes, {
        groupPsiDiagramId: drawNode.value.groupPsiDiagramId,
        nodeTitle: drawNode.value.nodeTitle
      }) > -1
    ) {
      isSameNodeName.value = true
    } else {
      isSameNodeName.value = false
    }
  } else {
    if (
      _.findIndex(
        _.filter(props.processData.drawNodes, {
          groupPsiDiagramId: drawNode.value.groupPsiDiagramId
        }),
        { nodeTitle: drawNode.value.nodeTitle }
      ) > -1
    ) {
      isSameNodeName.value = true
    } else {
      isSameNodeName.value = false
    }
  }
}
function accepts() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (isSameNodeName.value) {
        message.confirm({
          title: '안내',
          message: '동일한 노드명이 존재합니다.',
          type: 'warning' // success / info / warning / error
        })
        isSameNodeName.value = false
        return
      }

      let isProgress = true
      if (!props.processData.drawNodes || props.processData.drawNodes.length === 0) {
        isProgress = false
        message.alert({
          title: '안내',
          message: '데이터가 없습니다.',
          type: 'warning' // success / info / warning / error
        })
      } else {
        if (isProgress) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              if (isRowAdd.value) {
                props.processData.drawNodes.splice(rowIndex.value, 0, _.clone(drawNode.value))
              } else {
                _.extend(props.processData.drawNodes[rowIndex.value], _.clone(drawNode.value))
              }

              isRowClick.value = false
              isRowAdd.value = false
              drawNode.value = {
                ramAssessNodeId: '', // 노드 일련번호
                ramRiskAssessmentPlanId: '', // 평가 일련번호
                ramTechniqueCd: '', // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
                processCd: '', // 단위공정 코드
                processName: '', // 단위공정명
                groupPsiDiagramId: '', // 도면 일련번호
                psiDiagramId: '', // 도면 일련번호
                diagramNo: '', // 도면번호
                diagramTitle: '', // 도면명
                nodeNo: '', // 노드 번호_수기입력
                nodeTitle: '', // 노드 타이틀
                nodeDesc: '', // 노드 설명
                designConditions: '', // 설계조건
                operatingConditions: '', // 작동조건
                designIntent: '', // 설계의도
                startStudyDate: '', // 검토 시작일
                endStudyDate: '', // 검토 종료일
                regUserId: '', // 작성자 ID
                chgUserId: '', // 수정자 ID
                studyPeriod: [] // 검토기간
              }
              dialog.value = false
              saveDrawNode()
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        }
      }
    } else {
      message.validError()
    }
  })
}
function closeDialog() {
  isSameNodeName.value = false
  isRowClick.value = false
  isRowAdd.value = false
  dialog.value = false
}
function saveDrawNode() {
  drawNodeSave.value.ramRiskAssessmentPlanId = props.processData.ramRiskAssessmentPlanId
  drawNodeSave.value.processCd = props.processData.processCd
  drawNodeSave.value.draws = []
  drawNodeSave.value.nodes = []
  _.forEach(props.processData.drawNodes, (_drawNode: any) => {
    if (_.findIndex(_drawNode.valueSave.draws, { psiDiagramId: _drawNode.psiDiagramId }) === -1) {
      _drawNode.valueSave.draws.push(drawNode)
    }
    // 저장된 데이터이며 수정하지 않은 경우 period 속성이 없음
    if (_drawNode.studyPeriod && _drawNode.studyPeriod.length > 0) {
      _drawNode.startStudyDate = _drawNode.studyPeriod[0]
      _drawNode.endStudyDate = _drawNode.studyPeriod[1]
    }
  })
  drawNodeSave.value.nodes = props.processData.drawNodes

  isSave.value = !isSave.value
}
function saveDrawNodeCallback() {
  message.requestSuccess()
  emits('saveProcess', props.processData.processCd)
  getDrawNodes()
}
function removeDrawNode() {
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
      message: '관련되어 있는 정보 및 개선사항, 위험등록부가 같이 삭제됩니다.\n\r삭제하시겠습니까?',
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
            props.processData.drawNodes = _.reject(props.processData.drawNodes, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

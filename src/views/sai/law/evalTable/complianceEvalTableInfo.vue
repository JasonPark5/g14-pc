<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <c-appr-btn
                  v-if="!popupParam.isApprContent"
                  ref="apprBtn"
                  name="work-permit-appr-btn"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalComEval"
                  @callbackApprAction="approvalComEvalCallback"
                  @requestAfterAction="emits('getDetail')"
                />
                <c-btn
                  v-if="inputEditable2 && !popupParam.isApprContent"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="inputEditable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="evalTable"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  :required="true"
                  :editable="inputEditable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="evalTable.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  type="edit"
                  :required="true"
                  :editable="inputEditable"
                  codeGroupCd="COMPLIANCE_EVAL_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="정기/비정기"
                  name="complianceEvalTypeCd"
                  v-model:value="evalTable.complianceEvalTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :required="true"
                  :editable="inputEditable"
                  type="edit"
                  codeGroupCd="LAW_REGISTER_ITEM_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="법령구분"
                  name="lawRegisterItemTypeCd"
                  v-model:value="evalTable.lawRegisterItemTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :editable="false"
                  default="today"
                  label="평가년도"
                  type="year"
                  name="evalYear"
                  v-model:value="evalTable.evalYear"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :editable="false"
                  type="edit"
                  codeGroupCd="HALF_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="상/하반기"
                  name="halfCd"
                  v-model:value="evalTable.halfCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="inputEditable"
                  label="평가일자"
                  name="startDt"
                  v-model:value="evalTable.startDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  :required="true"
                  :editable="inputEditable"
                  :isFirstValue="true"
                  type="edit"
                  label="평가대상부서"
                  name="targetDeptCd"
                  v-model:value="evalTable.targetDeptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  required
                  :editable="inputEditable"
                  type="dept_user"
                  label="평가자"
                  name="reviewUserId"
                  v-model:value="evalTable.reviewUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
                <c-text
                  :editable="inputEditable"
                  label="비고"
                  name="remark"
                  v-model:value="evalTable.remark"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <c-table
      ref="table"
      title="준수평가표"
      class="q-mt-sm"
      :columns="grid.columns"
      :data="filterCompliances"
      :merge="grid.merge"
      :gridHeight="gridHeight"
      :editable="inputEditable"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="saiComplianceEvalTableResultId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="inputEditable" label="추가" icon="add" @btnClicked="addTable" />
          <c-btn
            v-if="inputEditable && grid.data!.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="deleteTable"
          />
        </q-btn-group>
      </template>
      <template v-slot:table-chip>
        <q-chip
          v-for="(lawType, idx) in evalTable.compliancesTypes"
          outline
          square
          :key="idx"
          :removable="false"
          :color="lawType.selected ? 'orange' : 'grey-6'"
          icon="memory"
          :label="lawType.lawName"
          :selected="lawType.selected"
          @update:selected="(state: boolean) => selectedEvalLaw(state, lawType, idx)"
        />
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'lawName'">
          {{ props.row[col.name] }}
          <q-badge v-if="props.row.lawRecentInfo" align="top" color="red">
            {{ props.row.lawRecentInfo }}
          </q-badge>
        </template>
        <template v-else-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :isImmShow="true"
            :inputEditable="inputEditable"
            :requestContentsCols="requestContentsCols"
            tableKey="saiComplianceEvalTableResultId"
            ibmTaskTypeCd="ITT0000160"
            ibmTaskUnderTypeCd="ITTU000170"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
    <c-upload :attachInfo="attachInfo" :editable="inputEditable" label="평가서 파일" />
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
import {
  complianceEvalTablePopupType,
  complianceEvalTableResearchType,
  complianceEvalTableResultType,
  complianceEvalTableType,
  complianceTypesType
} from './complianceEvalTable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'complianceEvalTableInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: complianceEvalTablePopupType
  evalTable: complianceEvalTableType
  isOld: boolean
  inputEditable: boolean
  inputEditable2: boolean
  disabled: boolean
  research: complianceEvalTableResearchType
  contentHeight: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      saiComplianceEvalTableId: '',
      lawRegisterItemTypeCd: '',
      isApprContent: false
    }
  },
  evalTable: () => {
    return {
      saiComplianceEvalTableId: '', // 법규등록부 및 준수평가표 일련번호
      requirementName: '', // 법규/기타 요건명
      complianceEvalTypeCd: null, // 평가구분
      lawRegisterItemTypeCd: null, // 환경안전기타구분 업무구분
      lawRegisterItemTypeName: '',
      halfCd: null, // 상/하반기
      halfName: '',
      remark: '', // 비고
      evalYear: '', // 평가년도
      reviewUserId: '', // 검토자ID
      approvalUserId: '', // 승인자ID
      plantCd: '', // 사업장
      targetDeptCd: '', // 평가부서
      targetDeptName: '', // 평가부서
      saiComplianceEvalTableStepCd: '', // 진행상태(작성중)
      startDt: '', // 평가일자
      endDt: '', // 평가종료일
      compliances: [],
      deleteCompliances: [],
      compliancesTypes: []
    }
  },
  isOld: false,
  inputEditable: false,
  inputEditable2: false,
  disabled: true,
  research: () => {
    return {
      impr: '',
      item: ''
    }
  },
  contentHeight: null
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'COMPLIANCE_EVAL_RESULT',
  taskKey: ''
})
const grid = ref({
  merge: [
    { index: 0, colName: 'lawId' },
    { index: 1, colName: 'saiLawRegisterMasterId' }
  ],
  columns: [
    {
      name: 'lawName',
      field: 'lawName',
      label: '법령명',
      align: 'center',
      style: 'width:90px',
      sortable: false,
      type: 'custom',
      fix: true
    },
    {
      name: 'gubunName',
      field: 'gubunName',
      label: '구분',
      align: 'left',
      style: 'width:100px',
      sortable: false,
      fix: true
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '항목',
      align: 'left',
      style: 'width:120px',
      sortable: false,
      fix: true
    },
    {
      name: 'relevantClause',
      field: 'relevantClause',
      label: '관련조항',
      align: 'left',
      style: 'width:90px',
      sortable: false,
      fix: true
    },
    {
      name: 'requirements',
      field: 'requirements',
      label: '요구사항',
      align: 'left',
      style: 'width:350px',
      sortable: false,
      type: 'html'
    },
    {
      name: 'applyConstruction',
      field: 'applyConstruction',
      label: '적용사항',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      type: 'html'
    },
    {
      name: 'target',
      field: 'target',
      label: '적용대상',
      align: 'left',
      style: 'width:80px',
      sortable: false,
      type: 'html'
    },
    {
      name: 'relatedDocument',
      field: 'relatedDocument',
      label: '관련문서(기록)',
      align: 'left',
      style: 'width:80px',
      sortable: false,
      type: 'html'
    },
    {
      setHeader: true,
      name: 'saiComplianceResultCd',
      field: 'saiComplianceResultCd',
      label: '준수평가결과',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'SAI_COMPLIANCE_RESULT_CD'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선',
      align: 'center',
      style: 'width:100px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:150px',
      sortable: false,
      type: 'textarea'
    }
  ],
  data: []
})
const mappingType = ref('POST')
const resultUrl = ref('')
const revUrl = ref('')
const revlistUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const selectedEvalLawId = ref('')
const selectedEvalLawName = ref('')
const approvalUrl = ref('')
const isApproval = ref(false)
const table = ref<any>(null)
const editForm = ref<any>(null)
const apprBtn = ref<any>(null)
const halfItems = ref<Array<codeMasterType>>([])

/******************************
 * @Computed_선언
 *******************************/
const requestContentsCols = computed(() => [
  'lawName',
  'gubunName',
  'itemName',
  'relevantClause',
  'requirements'
])
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 270
      : 500
  if (height < 500) {
    height = 500
  }
  return String(height) + 'px'
})
const gridData = computed(() => {
  if (selectedEvalLawId.value == 'ALL') return { data: props.evalTable.compliances }
  else
    return {
      data: props.evalTable.compliances.filter((data) => data.lawId === selectedEvalLawId.value)
    }
})
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: props.evalTable.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: props.evalTable.approvalStatusCd,
    apprEditable: props.isOld && props.evalTable.saiComplianceEvalTableStepCd !== 'CETS000005', // 결재버튼 활성화 기준
    param: props.evalTable, // 결재 param
    approvalUrl: approvalUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000020', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiComplianceEvalTableId: props.popupParam.saiComplianceEvalTableId,
      isApprContent: true
    },
    approvalRequestName: `${props.evalTable.evalYear}년 ${props.evalTable.halfName} ${props.evalTable.targetDeptName} (${props.evalTable.lawRegisterItemTypeName}) 법규준수평가`, // 결재요청명 (문서 title)
    approvalConnId: props.popupParam.saiComplianceEvalTableId // 결재연결용 업무일련번호 (문서 key)
  }
})
const filterCompliances = computed(() => {
  if (selectedEvalLawId.value === 'ALL' || !selectedEvalLawId.value) {
    return props.evalTable.compliances
  }
  return props.evalTable.compliances.filter((item) => item.lawId === selectedEvalLawId.value)
})

/******************************
 * @Watch_선언
 *******************************/
// watch(
//   () => props.research.item,
//   () => {
//     getResults()
//   }
// )
watch(
  () => gridData.value.data,
  () => {
    setGridData(grid.value, gridData.value.data)
  }
)
watch(
  () => props.evalTable.startDt,
  () => {
    props.evalTable.evalYear = props.evalTable.startDt.split('-')[0]
    props.evalTable.halfCd = getHalf(props.evalTable.startDt, 'cd')
    props.evalTable.halfName = getHalf(props.evalTable.startDt, 'name')
  }
)
watch(
  () => props.evalTable.compliances,
  () => {
    props.evalTable.compliancesTypes = []
    props.evalTable.compliancesTypes.push({
      lawId: 'ALL',
      lawName: '전체',
      selected: true
    })
    _.forEach(props.evalTable.compliances, (item) => {
      if (_.findIndex(props.evalTable.compliancesTypes, { lawId: item.lawId }) === -1) {
        props.evalTable.compliancesTypes.push({
          lawId: item.lawId,
          lawName: item.lawName,
          selected: false
        })
      }
    })
  }
)

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
async function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  resultUrl.value = selectConfig.sai.evalTable.complianceEvalTable.results.url
  revlistUrl.value = selectConfig.sai.evalTable.complianceEvalTable.rev.url
  revUrl.value = selectConfig.com.revision.getversion
  saveUrl.value = transactionConfig.sai.evalTable.complianceEvalTable.insert.url
  approvalUrl.value = transactionConfig.sai.evalTable.complianceEvalTable.update.url
  deleteUrl.value = transactionConfig.sai.evalTable.complianceEvalTable.delete.url
  completeUrl.value = transactionConfig.sai.evalTable.complianceEvalTable.complete.url
  // code setting
  props.evalTable.lawRegisterItemTypeCd = props.popupParam.lawRegisterItemTypeCd
  // list setting
  const _result = await getComboItems('HALF_CD')
  halfItems.value = _result
  if (props.isOld) attachInfo.value.taskKey = props.popupParam.saiComplianceEvalTableId
}
function getHalf(_data: string, key: 'cd' | 'name') {
  if (!halfItems.value || halfItems.value.length === 0) return ''
  const month = Number(_data.split('-')[1])
  const index = month < 7 ? 0 : 1
  return key === 'cd' ? halfItems.value[index]?.code : halfItems.value[index]?.codeName
}
// function getResults() {
//   $http({
//     url: resultUrl.value,
//     method: 'GET',
//     params: {
//       saiComplianceEvalTableId: props.popupParam.saiComplianceEvalTableId
//     }
//   }).then((_result: any) => {
//     props.evalTable.compliances = _result.data
//   })
// }
/******************************
 * TODO (목적): 개선창 닫기 후
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function imprChange() {
  props.research.impr = uid()
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addTable() {
  popupOptions.value = getPopupOptions('lawRegister', popupOptions.value, closeTablePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeTablePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const injectData: Array<complianceEvalTableResultType> = _.cloneDeep(
      props.evalTable.compliances
    )
    _.forEachRight(data, (item) => {
      if (
        _.findIndex(injectData, {
          saiLawRegisterMasterItemId: item.saiLawRegisterMasterItemId
        }) === -1
      ) {
        injectData.push({
          saiComplianceEvalTableResultId: uid(), // 법규등록부 및 준수평가표 결과 일련번호
          saiComplianceEvalTableId: props.popupParam.saiComplianceEvalTableId, // 법규등록부 및 준수평가표 일련번호
          saiLawRegisterMasterItemId: item.saiLawRegisterMasterItemId, // 법규등록부 항목 일련번호
          saiComplianceResultCd: 'ETR0000001', // 준수평가결과
          remark: '', // 비고
          lawId: item.lawId,
          lawName: item.lawName,
          gubunName: item.gubunName,
          saiLawRegisterMasterId: item.saiLawRegisterMasterId,
          itemName: item.itemName,
          relevantClause: item.relevantClause,
          requirements: item.requirements,
          applyConstruction: item.applyConstruction,
          target: item.target,
          relatedDocument: item.relatedDocument,
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
    props.evalTable.compliances = injectData
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function deleteTable() {
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
      message: '제외하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        if (!props.evalTable.deleteCompliances) props.evalTable.deleteCompliances = []
        _.forEach(selectData, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(props.evalTable.deleteCompliances, {
              saiComplianceEvalTableResultId: item.saiComplianceEvalTableResultId
            })
          ) {
            props.evalTable.deleteCompliances.push(item)
          }
          props.evalTable.compliances = _.reject(
            props.evalTable.compliances,
            item
          ) as Array<complianceEvalTableResultType>
        })
        table.value.compoTable.clearSelection()
      },
      cancelCallback: () => {}
    })
  }
}
function saveData() {
  mappingType.value = props.isOld ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.evalTable.regUserId = user.value.userId
          props.evalTable.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.isOld) {
    props.popupParam.saiComplianceEvalTableId = result.data
    attachInfo.value.taskKey = result.data
    attachInfo.value.isSubmit = uid()
  }
  emits('getDetail')
}
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiComplianceEvalTableId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function selectedEvalLaw(state: boolean, lawType: complianceTypesType, idx: number) {
  selectedEvalLawId.value = lawType.lawId
  selectedEvalLawName.value = lawType.lawName
  if (state) {
    props.evalTable.compliancesTypes.forEach((item, index) => {
      item.selected = idx === index
    })
  } else props.evalTable.compliancesTypes[idx].selected = true
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function approvalComEval() {
  // 유효성 체크 : 1. 점검결과가 하나라도 입력되었는지?
  if (!props.evalTable.compliances || props.evalTable.compliances.length === 0) {
    message.alert({
      title: '안내',
      message: '준수평가대상을 하나이상 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    editForm.value.validate().then((_result: boolean) => {
      if (_result) {
        message.confirm({
          title: '확인',
          message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            props.evalTable.regUserId = user.value.userId
            props.evalTable.chgUserId = user.value.userId
            isApproval.value = !isApproval.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
    })
  }
}
function approvalComEvalCallback() {
  apprBtn.value.apprRequestPop()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

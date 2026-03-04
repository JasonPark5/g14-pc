<template>
  <div>
    <c-table
      ref="table"
      title="내부심사 체크리스트"
      class="table_vt_top"
      :columns="grid.columns"
      :data="checklistResult"
      :gridHeight="gridHeight"
      :merge="grid.merge"
      :editable="editable && !disabled"
      :isExcelDown="false"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      selection="multiple"
      rowKey="saiInternalActionChecklistResultId"
      @innerBtnClicked="innerBtnClicked"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline v-if="editable && !disabled">
          <c-btn label="직접추가" icon="add" @btnClicked="addDirect" />
          <c-btn label="추가" icon="add" @btnClicked="addChecklist" />
          <c-btn
            v-if="checklistResult && checklistResult.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteChecklist"
          />
          <c-btn
            v-if="checklistResult && checklistResult.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="checklistResult"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveChecklist"
            @btnCallback="saveChecklistCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:suffixTitle>
        <template v-if="hasTargetDepts">
          <span style="color: tomato; font-size: 0.9em" class="q-mx-sm">{{
            $language('※ 피심사팀을 선택하세요.')
          }}</span>
          <div class="internal-action-checklist-header-input">
            <q-chip
              v-for="(dept, idx) in options"
              outline
              square
              :key="idx"
              :removable="false"
              :color="dept.selected ? 'teal' : 'grey-6'"
              icon="memory"
              :label="$language(dept.codeName)"
              :selected="dept.selected"
              :model-value="dept.check"
              @update:selected="(state: any) => selectedDept(state, dept, idx)"
            />
            <!-- <c-select
              :comboItems="options"
              type="none"
              itemText="codeName"
              itemValue="code"
              name="filter"
              label=""
              v-model:value="filter"
            ></c-select> -->
          </div>
        </template>
        <template v-else>
          <span style="color: tomato; font-size: 0.9em">
            {{ $language('※ 수행계획을 추가 후 저장하세요.') }}
          </span>
        </template>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'systemElementsName'">
          <c-text-column
            :editable="editable && !disabled"
            :disabled="disabled"
            :col="col"
            :props="props"
            v-model:value="props.row[col.name]"
            @datachange="datachange(props.row)"
          />
          <div v-if="editable && !disabled">
            <q-btn-group outline class="ColumInnerBtnGroup">
              <q-btn
                icon="add"
                color="green"
                text-color="white"
                class="ColumInnerBtn"
                align="center"
                @click.prevent="innerBtnClicked(col, props)"
              >
                <q-tooltip>
                  {{ $language('항목추가') }}
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </div>
        </template>
        <template v-else-if="col.name === 'requirement'">
          <c-textarea-column
            v-if="props.row.saiInternalAuditChecklistId.length > 10"
            :editable="editable && !disabled"
            :col="col"
            :props="props"
            v-model:value="props.row[col.name]"
            @datachange="datachange(props.row)"
          />
          <span v-else v-html="convertEnter(props.row[col.name])" />
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
import { checklistType, internalActionType, targetDeptType } from './internalAudit'
import { convertEnter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'internalActionChecklist'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
interface propType {
  popupParam: {
    saiInternalActionId: stringNull
    stepCd?: stringNull
    searchProcess?: any | null | undefined
  }
  action: internalActionType
  disabled?: boolean
  height?: stringNull
  apprMode?: boolean
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
      saiInternalActionId: '',
      stepCd: '',
      searchProcess: {
        flag: '',
        isSearch: false
      }
    }
  },
  action: () => {
    return {
      saiInternalActionId: '', // 내부심사 수행계획서 일련번호
      plantCd: '', // 사업장코드
      actionName: '', // 실시계획명
      actionStartDate: '', // 심사시작일
      actionEndDate: '', // 심사종료일
      period: [],
      saiInternalActionStepCd: '', // 내부심사 수행계획서 진행상태
      saiInternalActionTypeCd: null, // 심사구분
      auditPurposeScope: '', // 심사 목적 및 범위
      auditPreRequire: '', // 심사 준비 요청사항
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '', // 결재관련 결재요청코드
      reviewUserId: '', // 검토자
      approvalUserId: '', // 승인자
      regDtStr: '',
      regUserName: '', // 등록자
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      actionPlans: [], // 실시계획
      deleteActionPlans: [], // 실시계획 [삭제]
      targetDepts: [], // 피심사팀
      deleteTargetDepts: [] // 피심사팀 [삭제]
    }
  },
  disabled: false,
  height: 'auto',
  apprMode: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'systemElementsName' },
    { index: 1, colName: 'systemElementsName' },
    { index: 2, colName: 'systemElementsName' }
  ],
  columns: [
    {
      name: 'sortOrder1',
      field: 'sortOrder1',
      label: '요소순번',
      align: 'center',
      style: 'width:40px',
      sortable: false,
      type: 'number'
    },
    {
      required: true,
      name: 'systemElementsName',
      field: 'systemElementsName',
      label: '시스템 요소',
      align: 'left',
      style: 'width:100px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'requirement',
      field: 'requirement',
      label: '요구사항',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:40px',
      sortable: false,
      type: 'number'
    },
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '점검항목',
      align: 'left',
      style: 'width:450px',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'aimMatter',
      field: 'aimMatter',
      label: '관련절차',
      align: 'left',
      sortable: false,
      style: 'width:160px',
      type: 'text'
    },
    {
      name: 'evidence',
      field: 'evidence',
      label: '증빙자료',
      align: 'left',
      sortable: false,
      style: 'width:160px',
      type: 'text'
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const filter = ref<stringNull>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 50 + 'px' : '680px'
)
const hasTargetDepts = computed(() => targetDepts.value && targetDepts.value.length > 0)
const targetDepts = computed(() =>
  _.filter(props.action.targetDepts, (dept) => dept.editFlag !== 'C')
)
const checklistResult = computed(() => {
  let _data = [] as Array<checklistType> | undefined
  if (hasTargetDepts.value) {
    // 저장된 피심사팀이 존재하는지? // && filter) { // 선택한 피심사팀이 있는지?
    const _targetDept = _.find(targetDepts.value, { saiInternalActionTargetDeptId: filter.value })
    _data = _targetDept ? _targetDept.checklist : []
  }
  return _data
})
const options = computed(() => {
  const _options = [] as codeMasterType
  if (targetDepts.value && targetDepts.value.length > 0) {
    let idx = 0
    _.forEach(targetDepts.value, (item) => {
      _options.push({
        code: item.saiInternalActionTargetDeptId,
        codeName: `${item.deptName}`,
        selected: idx === 0 ? true : false
      })
      idx++
    })
  }
  return _options
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.action.targetDepts,
  () => {
    getFilter()
  },
  { deep: true }
)
watch(
  () => props.popupParam.searchProcess.isSearch,
  () => {
    getFilter()
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
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.sai.internal.action.checklistResult.list.url
  saveUrl.value = transactionConfig.sai.internal.action.checklistResult.save.url
  deleteUrl.value = transactionConfig.sai.internal.action.checklistResult.delete.url
  // code setting
  getFilter()
  // list setting
}
/******************************
 * TODO (목적): 필터값 조회
 *******************************/
function getFilter() {
  if (props.action.targetDepts && props.action.targetDepts.length > 0) {
    const _idx = _.findIndex(props.action.targetDepts, {
      saiInternalActionTargetDeptId: filter.value
    })
    filter.value =
      _idx === -1
        ? props.action.targetDepts[0].saiInternalActionTargetDeptId
        : props.action.targetDepts[_idx].saiInternalActionTargetDeptId
  } else filter.value = null
}
/******************************
 * TODO (목적): 체크리스트 조회
 *******************************/
function getChecklist() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { saiInternalActionTargetDeptId: filter.value }
  }).then((_result: any) => {
    let _targetDept = {} as targetDeptType
    _targetDept = _.find(targetDepts.value, { saiInternalActionTargetDeptId: filter.value }) || {}
    _targetDept.checklist = _result.data
  })
}
/******************************
 * TODO (목적): 체크리스트 항목 삭제
 *******************************/
function deleteChecklist() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '삭제할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        const _deleteData = _.filter(selectData, (item) => item.editFlag !== 'C')
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(_deleteData)
        }).then(() => {
          message.requestSuccess()
          let _targetDept = {} as targetDeptType
          _targetDept =
            _.find(targetDepts.value, {
              saiInternalActionTargetDeptId: filter.value
            }) || {}
          _.forEach(selectData, (item) => {
            _targetDept.checklist = _.reject(_targetDept.checklist, item)
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
 * TODO (목적): 팝업에서 체크리스트 row 추가
 *******************************/
function addChecklist() {
  popupOptions.value = getPopupOptions(
    'internalAuditChecklist',
    popupOptions.value,
    closeChecklist,
    {
      type: 'multiple'
    }
  )
}
function closeChecklist(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    let _targetDept = {} as targetDeptType
    _targetDept = _.find(targetDepts.value, { saiInternalActionTargetDeptId: filter.value }) || {}
    _.forEach(_data, (item) => {
      if (
        _targetDept.checklist &&
        _.findIndex(_targetDept.checklist, {
          saiInternalAuditChecklistId: item.saiInternalAuditChecklistId
        }) === -1
      ) {
        _targetDept.checklist.splice(0, 0, {
          saiInternalActionChecklistResultId: uid(), // 내부심사 수행계획서 체크리스트 일련번호
          saiInternalActionTargetDeptId: _.clone(filter.value), // 내부심사 피심사팀 일련번호
          saiInternalAuditChecklistId: item.saiInternalAuditChecklistId, // 내부감사 체크리스트 항목 일련번호
          saiInternalAuditChecklistSystemId: item.saiInternalAuditChecklistSystemId,
          saiInternalAuditClassNameGubun:
            item.saiInternalAuditClassName + '/' + item.systemElementsName,
          saiInternalAuditClassName: item.saiInternalAuditClassName, // ISO 구분
          systemElementsName: item.systemElementsName, // 시스템 요소
          itemName: item.itemName, // 내부심사 항목
          aimMatter: item.aimMatter, // 내부심사 시 착안 사항
          saiInternalAuditResultCd: 'SAR0000001', // 내부심사 결과 양호로 고정
          observation: '', // 관찰사항
          sortOrder: item.sortOrder, // 순번
          checklistType: 'master', // 체크리스트 구분
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveChecklist() {
  if (checklistResult.value && validTable(grid.value.columns, checklistResult.value)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveChecklistCallback(_result: any) {
  message.requestSuccess()
  getChecklist()
}
/******************************
 * TODO (목적): 부서 선택시 해당 체크리스트 표시
 *******************************/
function selectedDept(state: any, dept: any, idx: number) {
  filter.value = dept.code
  if (state) {
    options.value.forEach(
      (item: any, index: number) => (item.selected = idx === index ? true : false)
    )
  } else options.value[idx].selected = true
}
/******************************
 * TODO (목적): 내부심사 항목 추가 버튼 클릭
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 *******************************/
function innerBtnClicked(col: tableColumnType, _props: any) {
  checklistResult.value!.splice(_props.rowIndex, 0, {
    saiInternalActionChecklistResultId: uid(), // 내부심사 수행계획서 체크리스트 일련번호
    saiInternalActionTargetDeptId: _.clone(filter.value), // 내부심사 피심사팀 일련번호
    saiInternalAuditChecklistId: uid(), // 내부감사 체크리스트 항목 일련번호
    saiInternalAuditChecklistSystemId: _props.row.saiInternalAuditChecklistSystemId,
    systemElementsName: _props.row.systemElementsName, // 시스템 요소
    itemName: '', // 내부심사 항목
    aimMatter: '', // 내부심사 시 착안 사항
    saiInternalAuditResultCd: 'SAR0000001', // 내부심사 결과 양호로 고정
    observation: '', // 관찰사항
    sortOrder: 0, // 순번
    sortOrder1: _props.row.sortOrder1,
    checklistType: 'master', // 체크리스트 구분
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 내부심사 항목 직접추가
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 *******************************/
function addDirect() {
  checklistResult.value!.splice(0, 0, {
    saiInternalActionChecklistResultId: uid(), // 내부심사 수행계획서 체크리스트 일련번호
    saiInternalActionTargetDeptId: _.clone(filter.value), // 내부심사 피심사팀 일련번호
    saiInternalAuditChecklistId: uid(), // 내부감사 체크리스트 항목 일련번호
    saiInternalAuditChecklistSystemId: uid(),
    systemElementsName: '', // 시스템 요소
    requirement: '',
    evidence: '',
    itemName: '', // 내부심사 항목
    aimMatter: '', // 가이드
    saiInternalAuditResultCd: 'SAR0000001', // 내부심사 결과 양호로 고정
    observation: '', // 관찰사항
    sortOrder: 1, // 순번
    sortOrder1: 1,
    checklistType: 'direct', // 체크리스트 구분
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}

/******************************
 * TODO (목적): 테이블 내 input 값 변경시 editFlag 변경
 *******************************/
function datachange(row: any) {
  if (row.editFlag !== 'C') {
    row.editFlag = 'U'
    row.chgUserId = user.value.userId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.internal-action-checklist-header-input
  float: right !important
  margin-top: -5px
  padding-right: 5px
  .customSelect
    padding-bottom: 0 !important
    .q-field__inner
      padding: 0 !important
</style>

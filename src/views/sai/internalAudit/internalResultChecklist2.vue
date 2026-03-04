<template>
  <div>
    <c-table
      ref="table"
      class="internal"
      title="체크리스트 심사결과"
      :columns="grid.columns"
      :data="checklistResult"
      :gridHeight="gridHeight"
      :merge="grid.merge"
      :usePaging="false"
      :editable="editable && !disabled"
      :isExcelDown="true"
      :filtering="false"
      :columnSetting="false"
      @table-data-change="tableDataChange"
    >
      <template v-slot:prefixContent>
        <span style="color: tomato">{{ statusByDept }}</span>
      </template>
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn 
            v-if="editable&&!disabled" 
            label="삭제" icon="remove" 
            @btnClicked="deleteChecklist" />
          <c-btn 
            v-if="editable&&!disabled" 
            label="추가" icon="add" 
            @btnClicked="addChecklist" /> -->
          <c-btn
            v-if="editable && !disabled && checklistResult && checklistResult.length > 0"
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
          <span style="color: tomato; font-size: 0.9em" class="q-ml-sm q-mr-sm">{{
            $language('※ 피심사팀을 선택하세요.')
          }}</span>
          <div class="internal-action-checklist-header-input">
            <q-chip
              v-for="(dept, idx) in options"
              outline
              square
              :key="idx"
              :removable="false"
              :color="dept.selected ? 'primary' : 'grey-6'"
              icon="memory"
              :label="$language(dept.codeName)"
              :selected="dept.selected"
              :model-value="dept.check"
              @update:selected="(state: any) => selectedDept(state, dept, idx)"
            />
          </div>
        </template>
        <template v-else>
          <span style="color: tomato; font-size: 0.9em">
            {{ $language('※ 피심사팀이 없습니다.') }}
          </span>
        </template>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled"
            :isImmShow="true"
            :requestContentsCols="['systemElementsName', 'sortOrder', 'itemName']"
            tableKey="saiInternalActionChecklistResultId"
            ibmTaskTypeCd="ITT0000150"
            ibmTaskUnderTypeCd="ITTU000155"
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
import { resultType, targetDeptType, internalActionType, checklistType } from './internalAudit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'internalResultChecklist'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
    searchProcess: any | null | undefined
  }
  plan: internalActionType
  disabled?: boolean
  apprMode?: boolean
  attachResultInfo?: attachSettingType
  height?: stringNull
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
      stepCd: null,
      searchProcess: {
        flag: '',
        isSearch: false
      }
    }
  },
  plan: () => {
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
      deleteTargetDepts: [], // 피심사팀 [삭제]
      resultRemark: '', // 결과요약
      resultSysApprovalRequestId: '', // 결과 결재요청번호
      resultApprovalTypeCd: '', // 결과 결재유형코드
      resultApprovalStatusCd: '', // 결과 결재상태코드
      resultApprovalStatusName: '' // 결과 결재상태명
    }
  },
  attachResultInfo: () => {
    return {
      isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
      taskClassCd: 'INTERNAL_AUDIT',
      taskKey: ''
    }
  },
  disabled: false,
  apprMode: false,
  height: null
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
    { index: 0, colName: 'saiInternalAuditChecklistSystemId' },
    { index: 1, colName: 'saiInternalAuditChecklistSystemId' },
    { index: 2, colName: 'saiInternalAuditChecklistSystemId' }
  ],
  columns: [
    // {
    //   name: 'targetDeptName',
    //   field: 'targetDeptName',
    //   label: '피심사팀',
    //   align: 'center',
    //   style: 'width:120px',
    //   sortable: false,
    // },
    // {
    //   name: 'saiInternalAuditClassName',
    //   field: 'saiInternalAuditClassName',
    //   label: 'ISO 구분',
    //   align: 'center',
    //   style: 'width:80px',
    //   sortable: false
    // },
    {
      name: 'sortOrder1',
      field: 'sortOrder1',
      label: '요소순번',
      align: 'center',
      style: 'width:40px',
      sortable: false
    },
    {
      name: 'systemElementsName',
      field: 'systemElementsName',
      label: '시스템요소',
      align: 'left',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'requirement',
      field: 'requirement',
      label: '요구사항',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'html'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:30px',
      sortable: false
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '심사항목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'html'
    },
    {
      name: 'aimMatter',
      field: 'aimMatter',
      label: '관련절차',
      align: 'left',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'evidence',
      field: 'evidence',
      label: '증빙자료',
      align: 'left',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'result',
      field: 'result',
      label: '내부심사결과',
      child: [
        {
          name: 'sar0000001',
          field: 'sar0000001',
          label: '양호',
          align: 'center',
          style: 'width:30px',
          sortable: false,
          type: 'check',
          checkIcon: 'task_alt',
          uncheckIcon: 'radio_button_unchecked',
          true: 'Y',
          false: 'N',
          color: 'green'
        },
        {
          name: 'sar0000005',
          field: 'sar0000005',
          label: '부적합',
          align: 'center',
          style: 'width:30px',
          sortable: false,
          type: 'check',
          checkIcon: 'task_alt',
          uncheckIcon: 'radio_button_unchecked',
          true: 'Y',
          false: 'N',
          color: 'green'
        },
        {
          name: 'sar0000010',
          field: 'sar0000010',
          label: '관찰',
          align: 'center',
          style: 'width:30px',
          sortable: false,
          type: 'check',
          checkIcon: 'task_alt',
          uncheckIcon: 'radio_button_unchecked',
          true: 'Y',
          false: 'N',
          color: 'green'
        },
        {
          name: 'sar0000015',
          field: 'sar0000015',
          label: '권고',
          align: 'center',
          style: 'width:30px',
          sortable: false,
          type: 'check',
          checkIcon: 'task_alt',
          uncheckIcon: 'radio_button_unchecked',
          true: 'Y',
          false: 'N',
          color: 'green'
        }
      ]
    },
    {
      name: 'observation',
      field: 'observation',
      label: '심사내용',
      align: 'left',
      style: 'width:120px',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:120px',
      type: 'custom',
      sortable: false
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
const listDeptUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const statusByDept = ref('')
const table = ref<any>(null)
const filter = ref<stringNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 50 + 'px' : '680px'
)
const imprComponent = computed(() => {
  return markRaw(defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`)))
})
const targetDepts = computed(() =>
  _.filter(props.plan.targetDepts, (dept) => dept.editFlag !== 'C')
)
const hasTargetDepts = computed(() => targetDepts.value && targetDepts.value.length > 0)
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
  () => props.plan.targetDepts,
  () => {
    getFilter()
  },
  { deep: true }
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
  listDeptUrl.value = selectConfig.sai.internal.action.checklistResult.depts.url
  // code setting
  getFilter()
  // list setting
}
/******************************
 * TODO (목적): 필터값 조회
 *******************************/
function getFilter() {
  if (props.plan.targetDepts && props.plan.targetDepts.length > 0) {
    const _idx = _.findIndex(props.plan.targetDepts, {
      saiInternalActionTargetDeptId: filter.value
    })
    filter.value =
      _idx === -1
        ? props.plan.targetDepts[0].saiInternalActionTargetDeptId
        : props.plan.targetDepts[_idx].saiInternalActionTargetDeptId
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
 * TODO (목적): 테이블 내 데이터 변경 반영
 *******************************/
function tableDataChange(_props: any, _col: any) {
  // let blackList = ['itemName', 'aimMatter', 'observation']
  const whiteList = ['sar0000001', 'sar0000005', 'sar0000010', 'sar0000015']
  if (whiteList.indexOf(_col.name) > -1 && _props.row[_col.name] === 'Y') {
    _.forEach(whiteList, (item) => {
      if (item !== _col.name) _props.row[item] = 'N'
    })
  }
}
// function deleteChecklist() {
//   const selectData = table.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '삭제할 행을 지정하세요.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'info', // success / info / warning / error
//       confirmCallback: () => {
//         const _deleteData = _.filter(selectData, (item) => item.editFlag !== 'C')
//         $http({
//           url: deleteUrl.value,
//           method: 'DELETE',
//           data: Object.values(_deleteData)
//         }).then(() => {
//           message.requestSuccess()
//           _.forEach(selectData, (item) => {
//             props.targetDept.checklist = _.reject(props.targetDept.checklist, item)
//           })
//           table.value.compoTable.clearSelection()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
// function addChecklist() {
//   popupOptions.value = getPopupOptions(
//     'internalAuditChecklist',
//     popupOptions.value,
//     closeChecklist,
//     {
//       type: 'multiple'
//     }
//   )
// }
// function closeChecklist(_data: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (_data && _data.length > 0) {
//     _.forEach(_data, (item) => {
//       if (
//         _.findIndex(props.targetDept.checklist, {
//           saiInternalAuditChecklistId: item.saiInternalAuditChecklistId
//         }) === -1
//       ) {
//         props.targetDept.checklist?.push({
//           saiInternalActionChecklistResultId: uid(), // 내부심사 수행계획서 체크리스트 일련번호
//           saiInternalActionTargetDeptId: props.targetDept.saiInternalActionTargetDeptId, // 내부심사 피심사팀 일련번호
//           saiInternalAuditChecklistId: item.saiInternalAuditChecklistId, // 내부감사 체크리스트 항목 일련번호
//           saiInternalAuditClassName: item.saiInternalAuditClassName,
//           saiInternalAuditClassNameGubun:
//             item.saiInternalAuditClassName + '/' + item.systemElementsName,
//           systemElementsName: item.systemElementsName, // 시스템 요소
//           itemName: item.itemName, // 내부심사 항목
//           aimMatter: item.aimMatter, // 내부심사 시 착안 사항
//           saiInternalAuditResultCd: 'SAR0000001', // 내부심사 결과
//           observation: '', // 관찰사항
//           sortOrder: item.sortOrder, // 순번
//           sar0000001: 'Y',
//           sar0000005: 'N',
//           sar0000010: 'N',
//           sar0000015: 'N',
//           editFlag: 'C',
//           regUserId: user.value.userId
//         })
//       }
//     })
//   }
// }
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
        const resultList: Array<resultType> = [
          'sar0000001',
          'sar0000005',
          'sar0000010',
          'sar0000015'
        ]
        _.forEach(checklistResult.value, (_check) => {
          _.forEach(resultList, (_item) => {
            if (_check[_item] === 'Y') {
              _check.saiInternalAuditResultCd = _.toUpper(_item)
              return false
            }
          })
        })
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
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
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

.internal .q-table
  tbody.q-virtual-scroll__content tr
    td.edittd-html
      padding: 10px !important
</style>

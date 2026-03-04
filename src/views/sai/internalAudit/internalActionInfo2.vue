<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card class="cardClassDetailForm" title="상세">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-appr-btn
                  v-if="editable && isOld && !apprMode"
                  ref="apprBtn"
                  name="internal-action-appr-btn"
                  :editable="editable"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalAction"
                  @callbackApprAction="approvalActionCallback"
                  @requestAfterAction="research"
                />
                <c-btn
                  v-if="editable && !disabled && isOld && !apprMode"
                  label="삭제"
                  icon="delete"
                  @btnClicked="deleteAction"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="action"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveAction"
                  @btnCallback="saveActionCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="내부심사명"
                  name="actionName"
                  v-model:value="action.actionName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-datepicker
                  :required="true"
                  :disabled="disabled"
                  :editable="editable"
                  :range="true"
                  label="기간"
                  name="period"
                  v-model:value="action.period"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-field
                  type="dept_user"
                  :disabled="disabled"
                  :editable="editable"
                  label="작성자"
                  name="regUserId"
                  v-model:value="action.regUserId"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-field
                  :disabled="disabled"
                  :editable="editable"
                  label="승인자"
                  name="approvalUserId"
                  v-model:value="action.approvalUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-plant
                  :required="true"
                  :disabled="disabled"
                  :editable="editable"
                  name="plantCd"
                  v-model:value="action.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-select
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="SAI_INTERNAL_ACTION_TYPE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="saiInternalActionTypeCd"
                  label="심사구분"
                  v-model:value="action.saiInternalActionTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  :rows="3"
                  label="심사 목적 및 범위"
                  name="auditPurposeScope"
                  v-model:value="action.auditPurposeScope"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  :rows="3"
                  label="심사 준비 요청사항"
                  name="auditPreRequire"
                  v-model:value="action.auditPreRequire"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <c-table
      ref="actionTable"
      title="내부심사 진행 일정"
      :columns="grid.columns"
      :data="action.actionPlans"
      :gridHeight="gridHeight"
      :editable="editable && !disabled"
      :usePaging="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="saiInternalActionPlanId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline v-if="editable && !disabled">
          <c-btn label="부서 추가" icon="add" @btnClicked="addDeptPlan" />
          <c-btn label="회의 추가" icon="add" @btnClicked="addDirectPlan" />
          <c-btn
            v-if="action.actionPlans && action.actionPlans.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="deletePlan"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'typeCd'">
          <span v-if="props.row['deptFlag'] === 'Y'">{{ props.row['typeName'] }}</span>
          <c-select
            v-else
            class="no-label-control"
            :editable="editable && !disabled"
            codeGroupCd="AUDIT_ACTION_PLAN_TYPE_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            :rejectItems="['AAP0000001']"
            name="ibmTaskTypeCd"
            label=""
            v-model:value="props.row.typeCd"
            @datachange="datachange(props.row)"
          />
        </template>
        <template v-else-if="col.name === 'userIds' && props.row.deptCd">
          <c-tag
            :editable="editable && !disabled"
            icon="person_outline"
            itemText="userName"
            itemValue="userId"
            name="userIds"
            v-model:value="props.row.userIds"
            @addTag="addManager(props.row)"
            @removeTag="(item: any) => removeManager(props.row, item)"
          />
        </template>
      </template>
    </c-table>
    <c-upload :attachInfo="attachPlanInfo" :editable="editable && !disabled" />
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
import { internalActionType, internalPlanType } from './internalAudit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'internalActionInfo'
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
const emits = defineEmits(['getDetail', 'closePopup', 'keySetting'])

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
  attachPlanInfo?: attachSettingType
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
  attachPlanInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'INTERNAL_PLAN',
      taskKey: ''
    }
  },
  disabled: false,
  apprMode: false,
  height: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'typeCd',
      field: 'typeCd',
      label: '구분',
      type: 'custom',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      deptCd: 'deptCd',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      setHeader: true,
      name: 'planDate',
      field: 'planDate',
      label: '일자',
      align: 'center',
      style: 'width:110px',
      sortable: false,
      type: 'date',
      required: true
    },
    {
      name: 'dates',
      field: 'dates',
      label: '시간',
      align: 'center',
      style: 'width:140px',
      sortable: false,
      type: 'datetime',
      minuteStep: 10,
      range: true,
      required: true
    },
    // {
    //   setHeader: true,
    //   name: 'managerUserName',
    //   field: 'managerUserName',
    //   label: '심사팀장',
    //   style: 'width:140px',
    //   align: 'center',
    //   type: 'user',
    //   userId: 'managerUserId',
    //   deptCd: 'managerDeptCd',
    //   deptName: 'managerDeptName',
    //   sortable: false
    // },
    {
      name: 'actionPlace',
      field: 'actionPlace',
      label: '장소',
      align: 'left',
      type: 'text',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'userIds',
      field: 'userIds',
      label: '내부심사자',
      align: 'left',
      type: 'custom',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'auditContents',
      field: 'auditContents',
      label: '비고',
      align: 'left',
      // style: 'width:300px',
      sortable: false,
      type: 'textarea'
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
const isApproval = ref(false)
const mappingType = ref('PUT')
const saveUrl = ref('')
const deleteUrl = ref('')
const approvalUrl = ref('')
const editForm = ref<any>(null)
const actionTable = ref<any>(null)
const apprBtn = ref<any>(null)
const row = ref<internalPlanType>({
  deptCd: '',
  deptName: '',
  dates: [],
  managerUserName: '',
  userIds: [],
  auditContents: ''
})

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 500 + 'px' : '500px'
)
const isOld = computed(() => Boolean(props.action.saiInternalActionId))
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: props.action.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: props.action.approvalStatusCd,
    apprEditable: isOld.value && props.action.internalAuditStepCd === 'IA00001', // 결재버튼 활성화 기준
    param: props.action, // 결재 param
    approvalUrl: approvalUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000011', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiInternalActionId: props.action.saiInternalActionId,
      isApprContent: true,
      searchProcess: {
        flag: '',
        isSearch: false
      }
    },
    approvalRequestName: `[${props.action.actionName}] 내부심사 계획`, // 결재요청명 (문서 title)
    approvalConnId: props.action.saiInternalActionId // 결재연결용 업무일련번호 (문서 key)
  }
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.action.period,
  () => {
    props.action.actionName = `${props.action.period![0].split('-')[0]}년 내부심사`
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
  saveUrl.value = transactionConfig.sai.internal.action.insert.url
  deleteUrl.value = transactionConfig.sai.internal.action.delete.url
  approvalUrl.value = transactionConfig.sai.internal.action.update.url
  // code setting
  if (!props.popupParam.saiInternalActionId) {
    props.action.regUserId = user.value.userId
  }
  // list setting
}
/******************************
 * TODO (목적): 결재요청 후 부모의 getDetail 함수 호출
 *******************************/
function research() {
  emits('getDetail')
}
/******************************
 * TODO (목적): 저장 / 결재요청 전 처리 과정
 *******************************/
function setSaveValue() {
  props.action.chgUserId = user.value.userId
  if (props.action.period) {
    props.action.actionStartDate = props.action.period[0]
    props.action.actionEndDate = props.action.period[1]
  }
  if (props.action.actionPlans && props.action.actionPlans.length > 1) {
    _.forEach(props.action.actionPlans, (plan) => {
      plan.regUserId = user.value.userId
      plan.chgUserId = user.value.userId
      if (plan.dates && plan.dates.length === 2) {
        plan.startDate = plan.dates[0]
        plan.endDate = plan.dates[1]
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveAction() {
  mappingType.value = props.popupParam.saiInternalActionId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (props.action.actionPlans && validTable(grid.value.columns, props.action.actionPlans!)) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            setSaveValue()
            isSave.value = !isSave.value
          },
          cancelCallback: () => {}
        })
      }
    } else message.validError()
  })
}
function saveActionCallback(_result: any) {
  message.requestSuccess()
  // props.popupParam.saiInternalActionId = _result.data
  props.popupParam.searchProcess.isSearch = true
  emits('keySetting', _result.data)
}
/******************************
 * TODO (목적): 결재요청 전 수행계획 목록에서 필수값 및 데이터 하나 이상 있는지 체크
 *******************************/
function approvalAction() {
  const _check = true
  // 심사자
  // _.forEach(props.action.actionPlans, (item) => {
  //   if (item.userIds?.length == 0) _check = false
  // })
  // if (!_check) {
  //   message.alert({
  //     title: '안내',
  //     message: '피심사팀별 심사자를 추가하시기 바랍니다.',
  //     type: 'warning' // success / info / warning / error
  //   })
  //   return
  // }
  let _checkchklist = true
  // 체크리스트
  _.forEach(props.action.targetDepts, (item) => {
    if (item.checklist?.length == 0) _checkchklist = false
  })
  if (!_checkchklist) {
    message.alert({
      title: '안내',
      message: '피심사팀별 체크리스트를 추가하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // 수행계획
  if (props.action.actionPlans && validTable(grid.value.columns, props.action.actionPlans)) {
    editForm.value.validate().then((_result: boolean) => {
      if (_result) {
        message.confirm({
          title: '확인',
          message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            setSaveValue()
            isApproval.value = !isApproval.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
    })
  }
}
/******************************
 * TODO (목적): 결재관련 결재요청버튼 callback
 *******************************/
function approvalActionCallback() {
  apprBtn.value.apprRequestPop()
}
/******************************
 * TODO (목적): 내부심사 수행계획서 삭제
 *******************************/
function deleteAction() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiInternalActionId),
        method: 'DELETE'
      }).then(() => {
        emits('closePopup')
        message.requestSuccess()
        // props.popupParam.searchProcess.isSearch = true
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 연간 정보를 따로 가져오게는 하지 않음. 자유롭게 선택하게 하고 이후 계획 대비 실적을 보여줄때 표시하게 처리
 *******************************/
function addDeptPlan() {
  popupOptions.value.title = '부서 조회'
  popupOptions.value.target = markRaw(
    defineAsyncComponent(() => import('@popups/dept/deptPop.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.width = '50%'
  popupOptions.value.closeCallback = closeDept
}
function closeDept(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      // 수행계획
      if (_.findIndex(props.action.actionPlans, { deptCd: item.deptCd }) === -1) {
        props.action.actionPlans?.push({
          saiInternalActionPlanId: uid(), // 내부심사 수행계획서 실시계획 일련번호
          saiInternalActionId: props.popupParam.saiInternalActionId, // 내부심사 수행계획서 일련번호
          deptCd: item.deptCd,
          deptName: item.deptName,
          planDate: '',
          startDate: '', // 시작일
          endDate: '', // 종료일
          actionPlace: '',
          deptFlag: 'Y',
          typeCd: 'AAP0000001',
          typeName: '피심사팀',
          dates: [], // 기간
          userIds: [],
          auditContents: '', // 내부심사내용
          remark: '', // 비고
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
      // 피심사팀
      if (_.findIndex(props.action.targetDepts, { deptCd: item.deptCd }) === -1) {
        props.action.targetDepts?.push({
          saiInternalActionTargetDeptId: uid(), // 내부심사 피심사팀 일련번호
          saiInternalActionId: props.popupParam.saiInternalActionId, // 내부심사 수행계획서 일련번호
          deptCd: item.deptCd, // 피심사부서코드
          deptName: item.deptName, // 피심사부서
          saiInternalActionTargetDeptStepCd: 'IATD000001', // 내부심사 피심사팀 진행상태
          managerUserId: '',
          userIds: [],
          resultRemark: '', // 결과요약
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
function addDirectPlan() {
  props.action.actionPlans?.push({
    saiInternalActionPlanId: uid(), // 내부심사 수행계획서 실시계획 일련번호
    saiInternalActionId: props.popupParam.saiInternalActionId, // 내부심사 수행계획서 일련번호
    deptCd: '',
    deptName: '',
    planDate: '',
    startDate: '', // 시작일
    endDate: '', // 종료일
    actionPlace: '',
    deptFlag: 'N',
    typeCd: null,
    typeName: '',
    dates: [], // 기간
    userIds: [],
    auditContents: '', // 내부심사내용
    remark: '', // 비고
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): row 삭제
 *******************************/
function deletePlan() {
  const selectData = actionTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '제외할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    // message.confirm({
    //   title: '확인',
    //   message: '피심사팀을 제외하면 체크리스트 정보 또한 같이 제외됩니다. 제외하시겠습니까?',
    //   type: 'info', // success / info / warning / error
    //   // 확인 callback 함수
    //   confirmCallback: () => {
    _.forEach(selectData, (item) => {
      // 수행계획
      if (!props.action.deleteActionPlans) props.action.deleteActionPlans = []
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.action.deleteActionPlans, {
          saiInternalActionPlanId: item.saiInternalActionPlanId
        }) === -1
      )
        props.action.deleteActionPlans.push(item)
      props.action.actionPlans = _.reject(props.action.actionPlans, item)
      // 피심사팀
      if (!props.action.deleteTargetDepts) props.action.deleteTargetDepts = []
      // 아직 해당 부서가 수행계획에 존재할시에는 진행 X
      const isExists = _.findIndex(props.action.actionPlans, { deptCd: item.deptCd }) > -1
      if (!isExists) {
        if (
          item.editFlag !== 'C' &&
          _.findIndex(props.action.deleteTargetDepts, { deptCd: item.deptCd }) === -1
        ) {
          const deleteData = _.find(props.action.targetDepts, { deptCd: item.deptCd })
          props.action.deleteTargetDepts.push({
            saiInternalActionTargetDeptId: deleteData?.saiInternalActionTargetDeptId
          })
        }
        props.action.targetDepts = _.reject(props.action.targetDepts, { deptCd: item.deptCd })
      }
    })
    actionTable.value.compoTable.clearSelection()
    //   },
    //   // 취소 callback 함수
    //   cancelCallback: () => {}
    // })
  }
}
/******************************
 * TODO (목적): row 내 심사자 추가
 *******************************/
function addManager(_row: any) {
  row.value = _row
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUser, {
    type: 'multiple'
  })
}
function closeUser(_data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(row.value.userIds, { userId: item.userId }) === -1
        // && _.findIndex(row.value.userIds, { teamDeptCd: item.deptCd }) === -1
        // && row.value.deptCd !== item.deptCd // 피심사팀과 심사자 소속팀이 같을 경우 추가 X
      ) {
        row.value.userIds?.push({
          userId: item.userId,
          userName: item.userName + '/' + item.deptName,
          deptCd: row.value.deptCd,
          teamDeptCd: item.deptCd,
          regUserId: user.value.userId
        })
      }
    })
    if (row.value.editFlag !== 'C') {
      row.value.editFlag = 'U'
      row.value.chgUserId = user.value.userId
    }
  }
}
/******************************
 * TODO (목적): row 내 심사자 삭제
 *******************************/
function removeManager(_row: internalPlanType, item: any) {
  _row.userIds = _.reject(_row.userIds, item)
  if (_row.editFlag !== 'C') {
    _row.editFlag = 'U'
    row.value.chgUserId = user.value.userId
  }
}
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

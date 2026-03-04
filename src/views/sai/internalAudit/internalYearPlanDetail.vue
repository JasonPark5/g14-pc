<template>
  <div>
    <q-form ref="editForm" class="q-mb-sm">
      <c-card class="cardClassDetailForm" title="상세">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-appr-btn
              ref="apprBtn"
              name="internal-year-plan-appr-btn"
              :editable="editable"
              :approvalInfo="approvalInfo"
              @beforeApprAction="approvalYear"
              @callbackApprAction="approvalYearCallback"
              @requestAfterAction="getDetail"
            />
            <c-btn
              v-if="editable && !disabled && isOld"
              label="삭제"
              icon="delete"
              @btnClicked="deleteYear"
            />
            <c-btn
              v-if="editable && !disabled"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="year"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveYear"
              @btnCallback="saveYearCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <c-text
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="실시계획명"
              name="planName"
              v-model:value="year.planName"
            />
          </div>
          <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2">
            <c-datepicker
              :required="true"
              :editable="editable && !disabled"
              default="today"
              type="year"
              label="년도"
              name="planYear"
              v-model:value="year.planYear"
            />
          </div>
          <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2">
            <c-dept
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="주관부서"
              name="deptCd"
              v-model:value="year.deptCd"
              @setDeptName="(_dn: string) => (year.deptName = _dn)"
            />
          </div>
          <!-- <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2">
            <c-plant
              :required="true"
              :disabled="disabled"
              :editable="editable"
              name="plantCd"
              v-model:value="year.plantCd"
            />
          </div> -->
          <div class="col-12">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="7"
              label="심사범위"
              name="auditScope"
              v-model:value="year.auditScope"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
        <c-table
          ref="table1"
          title="실시계획 목록"
          :columns="gridColumns"
          :data="grid.data"
          gridHeight="400px"
          :editable="editable && !disabled"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          selection="multiple"
          rowKey="deptCd"
          checkDisableColumn="deptFlag"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addRow(1)" />
              <c-btn
                v-if="editable && !disabled && grid.data && grid.data.length > 1"
                label="제외"
                icon="remove"
                @btnClicked="deleteRow(1)"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <q-checkbox
              v-if="props.rowIndex !== grid.data.length - 1"
              :disable="!editable || disabled"
              color="orange-custom"
              true-value="Y"
              false-value="N"
              dense
              :name="`${props.rowIndex}_${col.name}`"
              v-model="props.row[col.name]"
              @update:model-value="datachange(props, col, 'c')"
            />
            <c-textarea-column
              v-else
              :editable="editable && !disabled"
              :col="col"
              :props="props"
              class="text-left"
              @datachange="datachange(props, col, 't')"
            />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
        <c-table
          ref="table2"
          title="심사팀 목록"
          :columns="gridTeam.columns"
          :data="year.auditTeams"
          gridHeight="400px"
          :editable="editable && !disabled"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          selection="multiple"
          rowKey="userId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addRow(2)" />
              <c-btn
                v-if="editable && !disabled && year.auditTeams && year.auditTeams.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="deleteRow(2)"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { internalAuditType, monthType } from './internalAudit'

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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'planInfo'
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
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiInternalYearPlanId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<monthType>
  height?: stringNull
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
      saiInternalYearPlanId: ''
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const year = ref<internalAuditType>({
  saiInternalYearPlanId: '', // 연간 내부감사 일련번호
  plantCd: '', // 사업장코드
  planYear: '', // 심사년
  planName: '', // 실시계획서명
  auditScope: '', // 심사범위
  deptCd: '', // 주관부서코드
  deptName: '',
  saiInternalYearPlanStepCd: '', // 연간 내부심사 진행상태
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '', // 결재관련 결재요청코드
  auditMonth: [], // 심사월
  targetDepts: [], // 피심사팀
  deleteTargetDepts: [], // 피심사팀
  auditTeams: [], // 심사팀
  deleteAuditTeams: [] // 심사팀 [삭제]
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '피심사팀',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const gridTeam = ref<gridType>({
  columns: [
    {
      name: 'saiInternalAuditTeamRoleCd',
      field: 'saiInternalAuditTeamRoleCd',
      label: '역할',
      align: 'center',
      style: 'width:30%',
      type: 'select',
      codeGroupCd: 'SAI_INTERNAL_AUDIT_TEAM_ROLE_CD',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      align: 'center',
      style: 'width:30%',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '심사팀',
      align: 'center',
      style: 'width:40%',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const isApproval = ref(false)
const mappingType = ref('PUT')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const approvalUrl = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    year.value.saiInternalYearPlanStepCd === 'IYP0000005' ||
    year.value.approvalStatusCd === 'ASC0000001'
)
const isOld = computed(() => Boolean(props.popupParam.saiInternalYearPlanId))
const apprEditable = computed(
  () => isOld.value && year.value.saiInternalYearPlanStepCd === 'IYP0000001'
)
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: year.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: year.value.approvalStatusCd,
    apprEditable: apprEditable.value, // 결재버튼 활성화 기준
    param: year.value, // 결재 param
    approvalUrl: approvalUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000010', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiInternalYearPlanId: year.value.saiInternalYearPlanId,
      isApprContent: true
    },
    approvalRequestName: year.value.planName, // 결재요청명 (문서 title)
    approvalConnId: year.value.saiInternalYearPlanId // 결재연결용 업무일련번호 (문서 key)
  }
})
const gridColumns = computed(() => {
  const columns = _.cloneDeep(grid.value.columns) as Array<tableColumnType>
  for (let i = 1; i <= 12; i++) {
    columns.push({
      name: `mon${i}`,
      field: `mon${i}`,
      yearmonth: `${year.value.planYear}-${_.padStart(String(i), 2, '0')}`,
      label: $language(`${i}월`),
      align: 'center',
      style: 'width:70px',
      sortable: true,
      type: 'custom'
    })
  }
  return columns
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [year.value.planYear, year.value.deptCd],
  () => {
    if (!year.value.planName)
      year.value.planName = `${year.value.planYear}년 내부심사 연간실시계획 - ${year.value.deptName}`
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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.sai.internal.yearPlan.get.url
  saveUrl.value = transactionConfig.sai.internal.yearPlan.insert.url
  deleteUrl.value = transactionConfig.sai.internal.yearPlan.delete.url
  approvalUrl.value = transactionConfig.sai.internal.yearPlan.update.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 기본정보 상세 조회
 *******************************/
function getDetail() {
  const _auditmon: monthType = {
    deptFlag: true,
    deptName: $language('비고'),
    mon1: '',
    mon2: '',
    mon3: '',
    mon4: '',
    mon5: '',
    mon6: '',
    mon7: '',
    mon8: '',
    mon9: '',
    mon10: '',
    mon11: '',
    mon12: ''
  }
  if (props.popupParam.saiInternalYearPlanId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiInternalYearPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(year.value, _result.data)
      if (!year.value.targetDepts) year.value.targetDepts = []
      _.forEach(year.value.auditMonth, (month: any) => {
        let _mon = Number(_.replace(month.yearmonth, `${year.value.planYear}-`, ''))
        _mon = !isNaN(_mon) ? Number(_mon) : 0
        if (_mon) _auditmon[`mon${_mon}`] = month.remark
      })
      grid.value.data = []
      grid.value.data = _.concat(year.value.targetDepts, [_auditmon])
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  } else {
    // 신규등록인 경우
    year.value.saiInternalYearPlanStepCd = 'IYP0000001' // 직성중
    year.value.auditMonth = []
    _.forEach(gridColumns.value, (col) => {
      if (col.name === 'deptName') return
      year.value.auditMonth?.push({
        yearmonth: col.yearmonth,
        remark: '',
        editFlag: 'C',
        regUserId: user.value.userId
      })
    })
    grid.value.data = [_auditmon]
  }
}
/******************************
 * TODO (목적): 체크박스 체크 or textarea에 입력시 실행
 *******************************/
function datachange(_props: any, col: tableColumnType, type?: stringNull) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
  if (type === 't') {
    // textarea
    if (year.value.auditMonth && year.value.auditMonth.length > 0) {
      const _f_data = _.find(year.value.auditMonth, (month) => {
        return month.yearmonth === col.yearmonth
      })
      if (_f_data) {
        _f_data.remark = _props.row[col.name]
        if (_f_data.editFlag !== 'C') {
          _f_data.editFlag = 'U'
          _f_data.chgUserId = user.value.userId
        }
      }
    }
  }
}
/******************************
 * TODO (목적): 내부심사 실시계획 삭제
 *******************************/
function deleteYear() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiInternalYearPlanId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function setSaveValue() {
  year.value.regUserId = user.value.userId
  year.value.chgUserId = user.value.userId
  if (grid.value.data && grid.value.data.length > 1) {
    year.value.targetDepts = _.cloneDeep(grid.value.data.slice(0, -1)) // 피심사팀 데이터 복사
  }
}
function saveYear() {
  mappingType.value = props.popupParam.saiInternalYearPlanId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
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
    } else message.validError()
  })
}
function saveYearCallback(result: any) {
  message.requestSuccess()
  props.popupParam.saiInternalYearPlanId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 결재요청
 *******************************/
function approvalYear() {
  /**
   * 실시계획 목록
   *  - 피심사팀이 하나 이상인지?
   *  - 일정이 없는 피심사팀이 있는지?
   *
   * 심사팀 목록 - 심사팀원이 하나 이상있는지?
   */
  if (!grid.value.data || grid.value.data.length < 2) {
    message.alert({
      title: '안내',
      message: '실시계획에 피심사팀을 하나 이상 지정하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  let _ing = false
  _.forEach(grid.value.data.slice(0, -1), (item) => {
    _.forEach(gridColumns.value, (col: tableColumnType) => {
      if (col.name === 'deptName') return
      if (item[col.name] === 'Y') {
        _ing = true
        return false
      }
    })
    if (_ing) return false
  })
  if (!_ing) {
    message.alert({
      title: '안내',
      message: '일정이 없는 피심사팀이 있습니다. 일정을 체크하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  if (!year.value.auditTeams || year.value.auditTeams.length === 0) {
    message.alert({
      title: '안내',
      message: '심사팀을 구성하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          setSaveValue()
          isApproval.value = !isApproval.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function approvalYearCallback() {
  apprBtn.value.apprRequestPop() // 결재관련 결재요청버튼 callback
}
/******************************
 * TODO (목적): 심사대상 부서 및 심사팀원 추가
 *******************************/
function addRow(num?: number) {
  if (num === 1) {
    // popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDept, {
    //   type: 'multiple',
    //   searchParam: { plantCd: year.value.plantCd }
    // })
    popupOptions.value.title = '부서 조회'
    popupOptions.value.target = markRaw(
      defineAsyncComponent(() => import('@popups/dept/deptPop.vue'))
    )
    popupOptions.value.width = '50%'
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeDept
  } else if (num === 2) {
    popupOptions.value = getPopupOptions('user', popupOptions.value, closeUser, {
      type: 'multiple'
    })
  }
}
function closeDept(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(grid.value.data, { deptCd: item.deptCd }) === -1) {
        grid.value.data.splice(0, 0, {
          saiInternalYearPlanId: props.popupParam.saiInternalYearPlanId,
          deptCd: item.deptCd,
          deptName: item.deptName,
          mon1: 'N',
          mon2: 'N',
          mon3: 'N',
          mon4: 'N',
          mon5: 'N',
          mon6: 'N',
          mon7: 'N',
          mon8: 'N',
          mon9: 'N',
          mon10: 'N',
          mon11: 'N',
          mon12: 'N',
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
function closeUser(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const __data = [] as monthType
    _.forEach(_data, (item) => {
      if (_.findIndex(year.value.auditTeams, { userId: item.userId }) === -1) {
        year.value.auditTeams?.push({
          saiInternalYearPlanId: props.popupParam.saiInternalYearPlanId,
          deptCd: item.deptCd,
          deptName: item.deptName,
          userId: item.userId,
          userName: item.userName,
          saiInternalAuditTeamRoleCd: 'IATR000005',
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 선택 row 삭제
 *******************************/
function deleteRow(num?: number) {
  const selectData = num === 1 ? table1.value.getSelected() : table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '제외할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (num === 1) {
      _.forEach(selectData, (item) => {
        if (!year.value.deleteTargetDepts) year.value.deleteTargetDepts = []
        if (
          item.editFlag !== 'C' &&
          _.findIndex(year.value.deleteTargetDepts, { deptCd: item.deptCd }) === -1
        ) {
          year.value.deleteTargetDepts.push(item)
        }
        grid.value.data = _.reject(grid.value.data, item)
      })
      table1.value.compoTable.clearSelection()
    } else if (num === 2) {
      _.forEach(selectData, (item) => {
        if (!year.value.deleteAuditTeams) year.value.deleteAuditTeams = []
        if (
          item.editFlag !== 'C' &&
          _.findIndex(year.value.deleteAuditTeams, { userId: item.userId }) === -1
        ) {
          year.value.deleteAuditTeams.push(item)
        }
        year.value.auditTeams = _.reject(year.value.auditTeams, item)
      })
      table2.value.compoTable.clearSelection()
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

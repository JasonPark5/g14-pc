<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card class="cardClassDetailForm" title="상세">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled && isOld"
                label="삭제"
                icon="delete"
                @btnClicked="deleteOuternal"
              />
              <c-btn
                v-if="editable && !disabled"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="outernal"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveOuternal"
                @btnCallback="saveOuternalCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant
                :required="true"
                :disabled="disabled"
                :editable="editable"
                name="plantCd"
                v-model:value="outernal.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="외부심사명"
                name="outernalResultName"
                v-model:value="outernal.outernalResultName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="false"
                default="today"
                type="year"
                label="외부심사년도"
                name="year"
                v-model:value="outernal.year"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                :disabled="disabled"
                :editable="editable"
                :range="true"
                default="today"
                label="외부심사기간"
                name="period"
                v-model:value="outernal.period"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="주관심사기관"
                name="saiOuternalAuditAgency"
                v-model:value="outernal.saiOuternalAuditAgency"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-dept
                :required="true"
                type="edit"
                :disabled="disabled"
                :editable="editable"
                label="심사주관부서"
                name="auditDeptCd"
                v-model:value="outernal.auditDeptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-dept
                type="edit"
                :disabled="disabled"
                :editable="editable"
                :isFirstValue="false"
                label="심사대상부서"
                :required="true"
                name="auditTargetDeptCd"
                v-model:value="outernal.auditTargetDeptCd"
                @setDeptName="(val: any) => (outernal.auditTargetDeptName = val)"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :disabled="disabled"
                :editable="editable"
                label="심사목적"
                name="auditPurpose"
                v-model:value="outernal.auditPurpose"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          title="심사팀 목록(내부)"
          :columns="gridTeam.columns"
          :data="innerTeams"
          :gridHeight="gridTeam.height"
          :editable="editable && !disabled"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          selection="multiple"
          rowKey="saiOuternalResultAuditTeamId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled"
                label="추가"
                icon="add"
                @btnClicked="addUser('1')"
              />
              <c-btn
                v-if="editable && !disabled && innerTeams!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="removeUser('1')"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="심사팀 목록(외부)"
          :columns="gridTeam2.columns"
          :data="outTeams"
          :gridHeight="gridTeam2.height"
          :editable="editable && !disabled"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          selection="multiple"
          rowKey="saiOuternalResultAuditTeamId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled"
                label="추가"
                icon="add"
                @btnClicked="addUser('2')"
              />
              <c-btn
                v-if="editable && !disabled && outTeams!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="removeUser('2')"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card class="cardClassDetailForm" title="심사결과">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :disabled="disabled"
                :editable="editable"
                label="개선도출 항목"
                name="imprDerivedItems"
                type="number"
                :suffix="$language('건')"
                v-model:value="outernal.imprDerivedItems"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-select
                :disabled="disabled"
                :editable="editable"
                type="edit"
                codeGroupCd="OUTER_AUDIT_RESULT_CD"
                itemText="codeName"
                itemValue="code"
                label="심사결과"
                name="auditResult"
                v-model:value="outernal.auditResult"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :disabled="disabled"
                :editable="editable"
                :rows="2"
                label="심사결과 요약"
                name="auditResultSummary"
                v-model:value="outernal.auditResultSummary"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :disabled="disabled"
                :editable="editable"
                :rows="2"
                label="심사대상부서 검토의견"
                name="auditTargetDeptReviewOpinion"
                v-model:value="outernal.auditTargetDeptReviewOpinion"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-upload :attachInfo="attachInfo" :editable="editable && !disabled" label="첨부파일" />
      </div>
      <c-dialog :param="popupOptions" />
    </div>
  </q-form>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'outernalInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiOuternalResultId: stringNull
  }
  outernal: any
  attachInfo: any
  disabled: boolean
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
  height: stringNull
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
      saiOuternalResultId: ''
    }
  },
  outernal: () => {
    return {
      saiOuternalResultId: '', // 외부심사결과 일련번호
      plantCd: '', // 사업장코드
      outernalResultName: '', // 외부심사명
      auditStartDate: '', // 심사시작일
      auditEndDate: '', // 심사종료일
      period: [],
      year: '',
      auditTargetDeptCd: '', // 심사대상부서
      auditTargetDeptName: '',
      auditDeptCd: '', // 심사주관부서
      saiOuternalAuditAgency: '고용노동부', // 주관심사기관
      auditPurpose: '', // 심사목적
      imprDerivedItems: '', // 개선도출항목
      auditResult: null, // 심사결과
      auditResultSummary: '', // 심사결과요약
      auditTargetDeptReviewOpinion: '', // 심사대상부서검토의견
      regUserId: '',
      chgUserId: '',
      auditTeams: [], // 심사팀
      deleteAuditTeams: [], // 심사팀 [삭제]
      imprs: [] // 개선
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'OUTER_AUDIT_ATTACH',
      taskKey: ''
    }
  },
  disabled: false,
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
const saveUrl = ref('')
const mappingType = ref('POST')
const deleteUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const gridTeam = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      align: 'center',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '직책',
      align: 'center',
      sortable: false
    }
  ],
  data: [],
  height: '200px'
})
const gridTeam2 = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '소속',
      align: 'center',
      type: 'text',
      sortable: false,
      style: 'width:30%'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      align: 'center',
      type: 'text',
      sortable: false,
      style: 'width:40%'
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '직책',
      align: 'center',
      type: 'text',
      sortable: false,
      style: 'width:30%'
    }
  ],
  data: [],
  height: '200px'
})
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.saiOuternalResultId)
})
const innerTeams = computed(() => {
  return _.filter(props.outernal.auditTeams, { comInsideOutsideCd: '1' })
})
const outTeams = computed(() => {
  return _.filter(props.outernal.auditTeams, { comInsideOutsideCd: '2' })
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [props.outernal.period, props.outernal.auditTargetDeptCd],
  () => {
    if (!isOld) {
      props.outernal.year = props.outernal.period[0].split('-')[0]
      props.outernal.outernalResultName = `${props.outernal.year}년 ${props.outernal.auditTargetDeptName} 안전보건경영 외부심사 결과`
    }
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
  saveUrl.value = transactionConfig.sai.outernal.result.insert.url
  deleteUrl.value = transactionConfig.sai.outernal.result.delete.url
  // code setting
  // list setting
  if (!props.outernal.saiOuternalAuditAgency) props.outernal.saiOuternalAuditAgency = '고용노동부'
}
function addUser(flag: any) {
  if (flag === '1') {
    popupOptions.value.width = '60%'
    popupOptions.value.isFull = false
    popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
      type: 'multiple'
    })
  } else {
    props.outernal.auditTeams.splice(0, 0, {
      saiOuternalResultAuditTeamId: uid(), // 외부심사결과 심사팀 일련번호
      saiOuternalResultId: props.popupParam.saiOuternalResultId, // 외부심사결과 일련번호
      plantCd: props.outernal.plantCd, // 사업장
      deptName: '', // 부서(소속)
      jobName: '', // 직책
      userName: '', // 심사팀
      userId: '', // 심사팀id
      comInsideOutsideCd: '2', // 내외부 구분
      regUserId: user.value.userId, // 등록자 ID
      editFlag: 'C'
    })
  }
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const _data = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(props.outernal.auditTeams, { userId: item.userId }) === -1) {
        _data.push({
          saiOuternalResultAuditTeamId: uid(), // 외부심사결과 심사팀 일련번호
          saiOuternalResultId: props.popupParam.saiOuternalResultId, // 외부심사결과 일련번호
          plantName: item.plantName, // 사업장
          plantCd: item.plantCd, // 사업장
          deptName: item.deptName, // 부서(소속)
          jobName: item.jobName, // 직책
          userName: item.userName, // 심사팀
          userId: item.userId, // 심사팀id
          comInsideOutsideCd: '1', // 내외부 구분
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
    props.outernal.auditTeams = _.concat(props.outernal.auditTeams, _data)
  }
}
function removeUser(flag: any) {
  const selectData = flag === '1' ? table1.value.getSelected() : table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.outernal.deleteAuditTeams) {
        props.outernal.deleteAuditTeams = []
      }
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.outernal.deleteAuditTeams, {
          saiOuternalResultAuditTeamId: item.saiOuternalResultAuditTeamId
        })
      ) {
        props.outernal.deleteAuditTeams.push(item)
      }
      props.outernal.auditTeams = _.reject(props.outernal.auditTeams, item)
    })
    if (flag === '1') {
      table1.value.compoTable.clearSelection()
    } else {
      table2.value.compoTable.clearSelection()
    }
  }
}
function saveOuternal() {
  if (props.popupParam.saiOuternalResultId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.sai.outernal.result.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.sai.outernal.result.insert.url
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.outernal.regUserId = user.value.userId
          props.outernal.chgUserId = user.value.userId
          props.outernal.auditStartDate = props.outernal.period[0]
          props.outernal.auditEndDate = props.outernal.period[1]

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveOuternalCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.saiOuternalResultId = _result.data
  props.attachInfo.taskKey = _result.data
  props.attachInfo.isSubmit = uid()
  emits('getDetail')
}
function deleteOuternal() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiOuternalResultId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

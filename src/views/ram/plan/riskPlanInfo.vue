<template>
  <q-form ref="editForm">
    <c-card title="상세" class="cardClassDetailForm rpi">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="assessPlan"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveAssessPlan"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :required="true"
            :editable="editable"
            :disabled="disabled"
            label="평가명"
            name="assessmentName"
            v-model:value="assessPlan.assessmentName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :range="true"
            label="평가기간"
            name="assessmentPeriod"
            v-model:value="assessPlan.assessmentPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :editable="editable"
            :disabled="disabled"
            default="today"
            type="year"
            label="평가년도"
            name="assessmentYear"
            v-model:value="assessPlan.assessmentYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :required="true"
            :editable="editable"
            :disabled="disabled"
            codeGroupCd="RAM_ASSESS_TYPE_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="ramAssessTypeCd"
            label="평가구분-정기/수시/최초"
            v-model:value="assessPlan.ramAssessTypeCd"
          />
        </div>
        <!-- K-PSR, Check-list, 3단계판단법은 표시하지 않음 -->
        <div
          v-if="
            assessPlan.ramTechniqueCd !== 'RT00000005' &&
            assessPlan.ramTechniqueCd !== 'RT00000010' &&
            assessPlan.ramTechniqueCd !== 'RT00000035'
          "
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
        >
          <c-select
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :comboItems="matrixItems"
            type="edit"
            itemText="matrixName"
            itemValue="ramMatrixId"
            name="ramMatrixId"
            label="Matrix"
            v-model:value="assessPlan.ramMatrixId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-moc
            :editable="editable"
            :disabled="disabled"
            :isSubmit="saveCallData"
            :document="assessPlan"
            :documentId="
              assessPlan.ramRiskAssessmentPlanId
                ? assessPlan.ramRiskAssessmentPlanId
                : ramRiskAssessmentPlanId
            "
            documentTitle="assessmentName"
            mocRelatedTaskCd="RT00000005"
            label="MOC번호"
            name="sopMocId"
            v-model:value="assessPlan.sopMocId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :data="assessPlan"
            deptValue="assessmentManageDeptCd"
            type="dept_user"
            label="주관"
            name="assessmentManageUserId"
            v-model:value="assessPlan.assessmentManageUserId"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :required="true"
            :disabled="disabled"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="assessPlan.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="true"
            label="작성자/작성일"
            name="request"
            v-model:value="request"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :disabled="disabled"
            :editable="editable"
            :customPopupParam="{ targetKey: 'vendor' }"
            label="외부기관"
            name="vendorCd"
            v-model:value="assessPlan.vendorCd"
          />
        </div>
        <div
          v-if="assessPlan.ramTechniqueCd === 'RT00000015'"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
        >
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="작업지역"
            name="workArea"
            v-model:value="assessPlan.workArea"
          />
        </div>
        <div
          :class="[
            assessPlan.ramTechniqueCd === 'RT00000015'
              ? 'col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4'
              : 'col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
          ]"
        >
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="상세내용"
            name="remark"
            autogrow
            v-model:value="assessPlan.remark"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :editable="editable"
            :disabled="disabled"
            :data="assessPlan"
            type="user"
            label="검토자"
            name="reviewUserId"
            v-model:value="assessPlan.reviewUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :editable="editable"
            :disabled="disabled"
            :data="assessPlan"
            type="user"
            label="승인자"
            name="approvalUserId"
            v-model:value="assessPlan.approvalUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-task-target
            label="관련공사"
            name="sopConstructionId"
            :editable="editable"
            :disabled="disabled"
            :customPopupParam="{ targetKey: 'construction' }"
            v-model:value="assessPlan.sopConstructionId"
          />
        </div>
        <div v-if="isOcc && isOld" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table2"
            title="수시 변경/추가 내역"
            :columns="gridOcc.columns"
            :gridHeight="gridOcc.height"
            :data="assessPlan.occasions"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable && !disabled"
            selection="multiple"
            rowKey="ramAssessmentOccasionId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addOccasion"
                />
                <c-btn
                  v-if="
                    editable && !disabled && assessPlan.occasions && assessPlan.occasions.length > 0
                  "
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteAssessOccasion"
                />
                <c-btn
                  v-if="
                    editable && !disabled && assessPlan.occasions && assessPlan.occasions.length > 0
                  "
                  :isSubmit="isSaveOccasion"
                  :url="saveOccasionUrl"
                  :param="assessPlan.occasions"
                  mappingType="PUT"
                  label="저장"
                  icon="save"
                  @beforeAction="saveAssessOccasion"
                  @btnCallback="saveOccasionCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div v-if="isOld" class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
          <c-table
            ref="table1"
            title="평가팀 목록"
            :columns="grid.columns"
            :gridHeight="grid.height"
            :data="assessPlan.teams"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable && !disabled"
            selection="multiple"
            rowKey="ramAssessmentTeamId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  :showLoading="false"
                  label="부서원 일괄추가"
                  icon="add"
                  @btnClicked="addTeamAll"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addTeam"
                />
                <c-btn
                  v-if="editable && !disabled && assessPlan.teams && assessPlan.teams.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteAssessTeam"
                />
                <c-btn
                  v-if="editable && !disabled && assessPlan.teams && assessPlan.teams.length > 0"
                  :isSubmit="isSaveTeam"
                  :url="saveTeamUrl"
                  :param="assessPlan.teams"
                  mappingType="PUT"
                  label="저장"
                  icon="save"
                  @beforeAction="saveAssessTeam"
                  @btnCallback="saveTeamCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-upload ref="fileUpload" :attachInfo="attachInfo" :editable="editable && !disabled" />
        </div>
      </template>
    </c-card>
    <c-dialog :param="popupOptions" />
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
import { assessPlanType } from '../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskPlanInfo'
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
const emits = defineEmits(['loadAssess', 'saveCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  assessPlan: assessPlanType
  attachInfo: {
    isSubmit: stringNull
    taskClassCd: stringNull
    taskKey: stringNull
  }
  vendorFlag: boolean
  disabled: boolean
  disabled2: boolean
}

interface gridType {
  columns: tableColumnType
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
  assessPlan: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      plantCd: '', // 사업장 코드
      ramTechniqueCd: '', // 평가기법 코드_HAZOP/KRAS/JSA/CHECKLIST
      ramAssessTypeCd: '', // 평가구분_최초/정기/수시
      assessmentName: '', // 평가명
      assessmentStartDate: '', // 평가시작일
      assessmentEndDate: '', // 평가종료일
      assessmentPeriod: [],
      assessmentYear: '', // 평가년도
      ramStepCd: '', // 평가 진행단계 코드
      assessmentManageDeptCd: '', // 평가주관 부서 코드
      assessmentManageUserId: '', // 평가주관 담당자 ID
      ramMatrixId: null, // 위험메트릭스 번호
      sopMocId: '', // MOC 일련번호
      remark: '', // 상세내용
      workArea: '', // 작업지역
      regDtStr: '',
      regUserId: '', // 작성자 ID
      regUserName: '', // 작성자 ID
      reviewUserId: '', // 검토자 ID
      reviewDate: '', // 검토일
      approvalUserId: '', // 승인자 ID
      approvalDate: '', // 승인일
      vendorCd: '',
      sopConstructionId: '',
      chgUserId: '', // 수정자 ID
      teams: [], // 평가팀 목록
      delTeams: [],
      occasions: [], // 수시 변경/추가 내역 목록
      conferences: [], // 회의 목록
      relatedDocuments: [], // 관련자료 목록
      processes: [] // 대상공정 목록
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'RISK_PLAN',
      taskKey: ''
    }
  },
  vendorFlag: false,
  disabled: false,
  disabled2: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const matrixItems = ref([]) as any
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'ramRoleTypeCd',
      field: 'ramRoleTypeCd',
      label: '역할',
      align: 'center',
      style: 'width:20%',
      type: 'select',
      codeGroupCd: 'RAM_ROLE_TYPE_CD',
      sortable: false,
      required: true
    },
    {
      name: 'etcRole',
      field: 'etcRole',
      label: `기타 역할<div style="font-size:0.9em">(역할을 '기타'로 선택 시)</div>`,
      align: 'left',
      style: 'width:20%',
      type: 'text',
      sortable: false,
      disableTarget: 'ramRoleTypeCd',
      disableCon: 'RRT0000010'
    },
    {
      name: 'ramInsideOutsideCd',
      field: 'ramInsideOutsideCd',
      label: '내외부구분',
      align: 'center',
      style: 'width:20%',
      type: 'select',
      codeGroupCd: 'COM_INSIDE_OUTSIDE_CD',
      none: true,
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      align: 'center',
      style: 'width:20%',
      type: !props.vendorFlag ? 'user' : 'text',
      userId: 'userId',
      sortable: false,
      isInout: true,
      inoutCol: 'ramInsideOutsideCd',
      in: '1',
      out: '2',
      relationCols: ['deptCd', 'deptName'],
      required: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width:20%',
      sortable: false
    }
  ],
  height: '250px'
})
const gridOcc = ref<gridType>({
  columns: [
    {
      name: 'taskClassName',
      field: 'taskClassName',
      label: '업무',
      align: 'center',
      style: 'width:15%',
      sortable: false
    },
    {
      name: 'taskTitle',
      field: 'taskTitle',
      label: '제목',
      align: 'left',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '업무',
      align: 'left',
      style: 'width:55%',
      type: 'textarea',
      sortable: false
    }
  ],
  height: '250px'
})
const matrixListUrl = ref('')
const saveUrl = ref('')
const teamListUrl = ref('')
const saveTeamUrl = ref('')
const deleteTeamUrl = ref('')
const occasionListUrl = ref('')
const saveOccasionUrl = ref('')
const deleteOccasionUrl = ref('')
const isSave = ref(false)
const isSaveTeam = ref(false)
const isSaveOccasion = ref(false)
const mappingType = ref('POST')
const ramRiskAssessmentPlanId = ref('')
const saveCallData = ref('')
const editForm = ref<any>(null)
const fileUpload = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.assessPlan.ramRiskAssessmentPlanId)
})
const isOcc = computed(() => {
  return props.assessPlan.ramAssessTypeCd === 'RAT0000005'
})
const request = computed(() => {
  return props.assessPlan.regUserName + ' / ' + props.assessPlan.regDtStr.slice(0, 10)
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.assessPlan.plantCd,
  () => {
    setMatrixItems()
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
  matrixListUrl.value = selectConfig.ram.matrix.list.url
  saveUrl.value = transactionConfig.ram.assessPlan.insert.url
  teamListUrl.value = selectConfig.ram.assessTeam.list.url
  saveTeamUrl.value = transactionConfig.ram.assessTeam.update.url
  deleteTeamUrl.value = transactionConfig.ram.assessTeam.delete.url
  occasionListUrl.value = selectConfig.ram.assessOccasion.list.url
  saveOccasionUrl.value = transactionConfig.ram.assessOccasion.update.url
  deleteOccasionUrl.value = transactionConfig.ram.assessOccasion.delete.url
  // code setting
  setMatrixItems()
  // list setting
}

/******************************
 * TODO (목적): Matrix 종류 가져오기
 *******************************/
function setMatrixItems() {
  setTimeout(() => {
    // K-PSR은 위험도 측정을 하지 않음
    if (props.assessPlan.ramTechniqueCd === 'RT00000005') return
    if (matrixListUrl.value) {
      $http({
        url: matrixListUrl.value,
        method: 'GET',
        params: {
          plantCd: props.assessPlan.plantCd,
          ramTechniqueCd: props.assessPlan.ramTechniqueCd
        }
      }).then((_result: any) => {
        matrixItems.value = _result.data
      })
    }
  }, 200)
}
/******************************
 * TODO (목적): 심사팀 조회
 *******************************/
function getTeams() {
  $http({
    url: teamListUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    props.assessPlan.teams = _result.data
  })
}
/******************************
 * TODO (목적): 수시 변경추가내역 조회
 *******************************/
function getOccasions() {
  $http({
    url: occasionListUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    props.assessPlan.occasions = _result.data
  })
}
/******************************
 * TODO (목적): 계획 저장
 *******************************/
function saveAssessPlan() {
  if (props.assessPlan.ramRiskAssessmentPlanId) {
    saveUrl.value = transactionConfig.ram.assessPlan.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.ram.assessPlan.insert.url
    mappingType.value = 'POST'
    props.assessPlan.ramStepCd = 'RRS0000001' // 평가계획
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.assessPlan.regUserId = user.value.userId
          props.assessPlan.chgUserId = user.value.userId

          props.assessPlan.assessmentStartDate = props.assessPlan.assessmentPeriod[0]
          props.assessPlan.assessmentEndDate = props.assessPlan.assessmentPeriod[1]

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
/******************************
 * TODO (목적): 계획 저장 후 Callback
 *******************************/
function saveCallback(_result: any) {
  message.requestSuccess()
  ramRiskAssessmentPlanId.value = _result.data
  props.attachInfo.taskKey = _result.data
  fileUpload.value.submitFile().finally(() => {
    saveCallData.value = uid()
    emits('saveCallback', _result.data)
  })
}
/******************************
 * TODO (목적): 변경/추가 내역 추가 팝업
 *******************************/
function addOccasion() {
  popupOptions.value.title = '변경/추가 내역 검색'
  popupOptions.value.param = {
    type: 'multiple'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/riskOccasion.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '60%'
  popupOptions.value.closeCallback = closeOccasionPopup
}
/******************************
 * TODO (목적): 변경/추가 내역 추가 팝업 닫기
 *******************************/
function closeOccasionPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (_item: any) => {
      if (
        _.findIndex(props.assessPlan.occasions, {
          taskId: _item.taskId,
          taskClassName: _item.taskClassName
        }) === -1
      ) {
        props.assessPlan.occasions.splice(0, 0, {
          ramAssessmentOccasionId: uid(), // 수시 변경/추가 내역 번호
          ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId, // 평가 일련번호
          taskClassName: _item.taskClassName, // 설비, 기계기구, 공정, 화학자재, 사고
          taskId: _item.taskId, // 업무 id
          taskTitle: _item.taskTitle, // 업무 제목
          remarks: '', // 비고
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 변경/추가 내역 삭제
 *******************************/
function deleteAssessOccasion() {
  const selectData = table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: deleteOccasionUrl.value,
      method: 'DELETE',
      data: Object.values(selectData)
    }).then(() => {
      message.requestSuccess()
      _.forEach(selectData, (_item: any) => {
        props.assessPlan.occasions = _.reject(props.assessPlan.occasions, _item)
      })
      table2.value.compoTable.clearSelection()
    })
  }
}
/******************************
 * TODO (목적): 변경/추가 내역 저장
 *******************************/
function saveAssessOccasion() {
  if (validTable(gridOcc.value.columns, props.assessPlan.occasions)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.assessPlan.occasions, (_item: any) => {
          _item.chgUserId = user.value.userId
        })

        isSaveOccasion.value = !isSaveOccasion.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.validError()
  }
}
/******************************
 * TODO (목적): 변경/추가 내역 저장 CallBack
 *******************************/
function saveOccasionCallback() {
  message.requestSuccess()
  getOccasions()
}
/******************************
 * TODO (목적): 심사팀 추가
 *******************************/
function addTeam() {
  props.assessPlan.teams.push({
    ramAssessmentTeamId: uid(),
    ramInsideOutsideCd: '1',
    ramRoleTypeCd: null,
    userId: '',
    userName: '',
    deptName: '',
    etcRole: '',
    editFlag: 'C',
    regUserId: user.value.userId,
    ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
  })
}
/******************************
 * TODO (목적): 심사팀 삭제
 *******************************/
function deleteAssessTeam() {
  const selectData = table1.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: deleteTeamUrl.value,
      method: 'DELETE',
      data: Object.values(selectData)
    }).then(() => {
      message.requestSuccess()
      if (!props.assessPlan.delTeams) props.assessPlan.delTeams = []
      _.forEach(selectData, (item) => {
        if (
          _.findIndex(props.assessPlan.delTeams, {
            ramAssessmentTeamId: item.ramAssessmentTeamId
          }) === -1 &&
          item.editFlag !== 'C'
        ) {
          props.assessPlan.delTeams.push(item)
        }
        props.assessPlan.teams = _.reject(props.assessPlan.teams, item)
      })
      table1.value.compoTable.clearSelection()
    })
  }
}
/******************************
 * TODO (목적): 심사팀 저장
 *******************************/
function saveAssessTeam() {
  if (validTable(grid.value.columns, props.assessPlan.teams)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.assessPlan.teams, (_item: any) => {
          _item.chgUserId = user.value.userId
        })

        isSaveTeam.value = !isSaveTeam.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.validError()
  }
}
/******************************
 * TODO (목적): 심사팀 저장 CallBack
 *******************************/
function saveTeamCallback() {
  message.requestSuccess()
  getTeams()
}
function addTeamAll() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeUserPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(props.assessPlan.teams, { userId: item.userId }) === -1) {
        props.assessPlan.teams.push({
          ramAssessmentTeamId: uid(),
          ramInsideOutsideCd: '1',
          ramRoleTypeCd: null,
          userId: item.userId,
          userName: item.userName,
          deptName: item.deptName,
          etcRole: '',
          editFlag: 'C',
          regUserId: user.value.userId,
          ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
        })
      }
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

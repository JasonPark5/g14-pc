<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="비상대응훈련 상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="traning.sopEmergencyTrainingId != '' && !disabled && editable"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-if="traning.sopEmergencyTrainingId != '' && !disabled && editable"
                  :url="completeUrl"
                  :isSubmit="isComplete"
                  :param="traning"
                  mappingType="PUT"
                  label="완료"
                  icon="check"
                  @beforeAction="completePlan"
                  @btnCallback="completeCallback"
                />
                <c-btn
                  v-if="!disabled && editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="traning"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련명"
                  name="trainingName"
                  v-model:value="traning.trainingName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :disabled="disabled"
                  :editable="editable"
                  label="훈련시작일시"
                  type="datetime"
                  :minuteStep="10"
                  name="trainingStartDate"
                  v-model:value="traning.trainingStartDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :disabled="disabled"
                  :editable="editable"
                  :start="traning.trainingStartDate"
                  label="훈련종료일시"
                  type="datetime"
                  :minuteStep="10"
                  name="educationDate"
                  v-model:value="traning.trainingEndDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  required
                  :editable="editable && param.sopEmergencyTrainingId == ''"
                  :disabled="disabled && param.sopEmergencyTrainingId != ''"
                  codeGroupCd="EAP_EVAL_CLASS_CD"
                  itemText="codeName"
                  itemValue="code"
                  type="edit"
                  name="eapTrainingTypeCd"
                  label="훈련구분"
                  v-model:value="traning.eapTrainingTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련장소"
                  name="trainingArea"
                  v-model:value="traning.trainingArea"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-tag
                  :editable="editable"
                  :disabled="disabled"
                  itemText="userName"
                  itemValue="userId"
                  label="교관"
                  name="trainingInstructUserIds"
                  v-model:value="traning.trainingInstructUserIds"
                  icon="person"
                  @removeTag="removeInstructor"
                  @addTag="addInstructor"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련통제관"
                  name="trainingController"
                  v-model:value="traning.trainingController"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :disabled="disabled"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="traning.plantCd"
                  @datachange="plantChange"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-25">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="목적"
                  :rows="2"
                  name="checkPurpose"
                  v-model:value="traning.checkPurpose"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-25">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련개요"
                  :rows="2"
                  name="summary"
                  v-model:value="traning.summary"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-25">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련방법"
                  :rows="2"
                  name="trainingWay"
                  v-model:value="traning.trainingWay"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="훈련 시나리오 정보" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :afterIcon="
                    editable && !disabled
                      ? [
                          {
                            name: 'search',
                            click: true,
                            callbackName: 'searchPop',
                            color: 'teal'
                          },
                          {
                            name: 'close',
                            click: true,
                            callbackName: 'removeTraningScenario',
                            color: 'red'
                          }
                        ]
                      : null
                  "
                  :editable="editable"
                  :disabled="true"
                  label="훈련시나리오명"
                  name="trainingScenarioName"
                  v-model:value="traning.trainingScenarioName"
                  @searchPop="searchPop"
                  @removeTraningScenario="removeTraningScenario"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="Rev."
                  name="revisionNum"
                  v-model:value="traning.revisionNum"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="비상조치계획서명"
                  name="emergencyPlanName"
                  v-model:value="traning.emergencyPlanName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="true"
                  :rows="4"
                  label="훈련내용요약"
                  name="trainingContentsSummary"
                  v-model:value="traning.trainingContentsSummary"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="true"
                  :rows="4"
                  label="훈련시나리오개요"
                  name="trainingContentsOutline"
                  v-model:value="traning.trainingContentsOutline"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-textarea
                  :editable="editable"
                  :disabled="true"
                  :rows="5"
                  label="직접참가자 유의사항"
                  name="directlyNotice"
                  v-model:value="traning.directlyNotice"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-textarea
                  :editable="editable"
                  :disabled="true"
                  :rows="2"
                  label="간접참가자 유의사항"
                  name="indirectNotice"
                  v-model:value="traning.indirectNotice"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="true"
                  :rows="3"
                  label="준비물"
                  name="materials"
                  v-model:value="traning.materials"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="true"
                  :rows="3"
                  label="사전준비사항"
                  name="preRequisites"
                  v-model:value="traning.preRequisites"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="table2"
            title="훈련 상세 목록"
            :columns="gridDetail.columns"
            :data="traning.emergencyScenarioDetailModelList"
            :gridHeight="gridDetail.height"
            :filtering="false"
            :isExcelDown="false"
            :usePaging="false"
            :columnSetting="false"
            :editable="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="tableAttend"
            title="훈련참가자 목록"
            :columns="grid.columns"
            :data="traning.emergencyTrainingUsersModels"
            selection="multiple"
            :editable="editable && !disabled"
            :gridHeight="grid.height"
            :hideBottom="false"
            :isExcelDown="false"
            :usePaging="false"
            rowKey="attendUserId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  label="추가"
                  :showLoading="false"
                  icon="add"
                  @btnClicked="addItem"
                />
                <c-btn
                  v-if="editable && !disabled && traning.emergencyTrainingUsersModels.length > 0"
                  label="삭제"
                  :showLoading="false"
                  icon="remove"
                  @btnClicked="removeItem"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="훈련 사진" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-12">
                <c-upload
                  label="훈련 사진"
                  :attachInfo="attachInfo"
                  :editable="editable && !disabled"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'traningInfo'
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
const emits = defineEmits(['setRegInfo', 'insertTraningInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    sopEmergencyTrainingId: stringNull
    eapTrainingTypeCd: stringNull
    plantCd: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  height: stringNull
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
  param: () => {
    return {
      sopEmergencyTrainingId: '',
      eapTrainingTypeCd: '',
      plantCd: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'TRAINING_PICTURE',
  taskKey: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'attendUserName',
      field: 'attendUserName',
      label: '이름',
      align: 'center',
      style: 'width:140px',
      type: 'user',
      userId: 'attendUserId',
      sortable: false
    },
    {
      setHeader: true,
      name: 'eapAttendTypeCd',
      field: 'eapAttendTypeCd',
      label: '구분',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'EAP_TRAINING_USER_CLASS_CD'
    },
    {
      setHeader: true,
      name: 'completeFlag',
      field: 'completeFlag',
      label: '이수여부',
      align: 'center',
      style: 'width:80px',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'nonattendanceRemark',
      field: 'nonattendanceRemark',
      label: '비고(불참사유)',
      align: 'left',
      sortable: false,
      type: 'text'
    }
  ],
  data: [],
  height: '360px'
})
const traning = ref<any>({
  sopEmergencyTrainingId: '',
  plantCd: '',
  trainingName: '',
  eapTrainingTypeCd: null,
  checkPurpose: '',
  trainingStartDate: '',
  trainingStartTime: '',
  trainingEndDate: '',
  trainingEndTime: '',
  emergencyPlanName: '',
  summary: '',
  trainingWay: '',
  trainingArea: '',
  trainingInstructUserIds: [],
  trainingController: '',
  sopEmergencyPlanId: '',
  trainingScenarioNo: '',
  evaluationUserId: '',
  evaluationOpinon: '',
  trainingCompleteFlag: 'N',
  regUserId: '',
  chgUserId: '',
  emergencyScenarioDetailModelList: [],
  emergencyTrainingUsersModels: [],
  emergencyTrainingEvaluationModels: [],

  // 훈련시나리오
  trainingScenarioName: '',
  preRequisites: '',
  materials: '',
  // indirectNotice: '',
  // directlyNotice: '',
  trainingContentsOutline: '',
  trainingContentsSummary: '',
  revisionNum: ''
})
const gridDetail = ref<gridType>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:5%',
      sortable: false
    },
    {
      name: 'leadTime',
      field: 'leadTime',
      label: '소요시간',
      align: 'center',
      minuteStep: 10,
      style: 'width:10%',
      sortable: false
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '항목',
      align: 'center',
      style: 'width:14%',
      sortable: false
    },
    {
      name: 'trainingDetailContents',
      field: 'trainingDetailContents',
      label: '상세훈련내용',
      align: 'left',
      // style: 'width:40%',
      sortable: false
    },
    {
      name: 'managerUserName',
      field: 'managerUserName',
      label: '담당자',
      align: 'center',
      style: 'width:10%',
      userId: 'managerUserId',
      sortable: false
    }
  ],
  height: '400px',
  data: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const saveCall = ref<any>({
  saveCallData: ''
})
const saveUrl = ref('')
const saveType = ref('POST')
const getUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const getItemUrl = ref('')
const editable = ref(true)
const isSave = ref(false)
const disabled = ref(false)
const isComplete = ref(false)
const editForm = ref<any>(null)
const table2 = ref<any>(null)
const tableAttend = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

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
  getUrl.value = selectConfig.sop.eap.training.plan.get.url
  saveUrl.value = transactionConfig.sop.eap.training.plan.insert.url
  deleteUrl.value = transactionConfig.sop.eap.training.plan.delete.url
  getItemUrl.value = selectConfig.sop.eap.training.plan.getItem.url
  completeUrl.value = transactionConfig.sop.eap.training.plan.update.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.param.sopEmergencyTrainingId) {
    $http({
      url: $format(getUrl.value, props.param.sopEmergencyTrainingId),
      method: 'GET'
    }).then((_result: any) => {
      traning.value = _result.data
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
      if (traning.value.trainingCompleteFlag === 'Y') {
        disabled.value = true
      }
      props.param.eapTrainingTypeCd = _result.data.eapTrainingTypeCd
      props.param.plantCd = _result.data.plantCd
      attachInfo.value.taskKey = props.param.sopEmergencyTrainingId
    })
    saveCall.value.saveCallData = uid()
  }
}
// function plantChange() {
//   // 교관 정보 reset
//   traning.value.trainingInstructUserIds = []
// }
function addInstructor() {
  popupOptions.value.width = '60%'
  popupOptions.value.isFull = false
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (!traning.value.trainingInstructUserIds) traning.value.trainingInstructUserIds = []
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(traning.value.trainingInstructUserIds, { userId: item.userId }) === -1) {
        traning.value.trainingInstructUserIds.push({
          userId: item.userId,
          userName: item.userName
        })
      }
    })
  }
}
function removeInstructor(item: any) {
  traning.value.trainingInstructUserIds = _.reject(traning.value.trainingInstructUserIds, item)
}
function searchPop() {
  popupOptions.value = getPopupOptions(
    'trainingScenario',
    popupOptions.value,
    closeTraningScenarioPopup,
    {
      /** 원하는 parameter 정의 */
      type: 'single'
    }
  )
}
function closeTraningScenarioPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    traning.value.emergencyPlanName = data[0].emergencyPlanName
    traning.value.trainingScenarioName = data[0].trainingScenarioName
    traning.value.trainingContentsSummary = data[0].trainingContentsSummary
    traning.value.preRequisites = data[0].preRequisites
    traning.value.revisionNum = data[0].revisionNum
    // traning.value.directlyNotice = data[0].directlyNotice
    // traning.value.indirectNotice = data[0].indirectNotice
    traning.value.trainingContentsOutline = data[0].trainingContentsOutline
    traning.value.materials = data[0].materials
    traning.value.sopEmergencyPlanId = data[0].sopEmergencyPlanId
    traning.value.trainingScenarioNo = data[0].trainingScenarioNo
    traning.value.emergencyScenarioDetailModelList = []
    $http({
      url: $format(
        selectConfig.sop.eap.scenario.rev.get.url,
        data[0].sopEmergencyPlanId,
        data[0].trainingScenarioNo
      ),
      method: 'GET'
    }).then((_result: any) => {
      traning.value.emergencyScenarioDetailModelList = _result.data.emergencyScenarioDetailModelList
    })
  }
}
function removeTraningScenario() {
  traning.value.trainingScenarioName = ''
  traning.value.trainingContentsSummary = ''
  traning.value.preRequisites = ''
  traning.value.revisionNum = ''
  // traning.value.directlyNotice = ''
  // traning.value.indirectNotice = ''
  traning.value.trainingContentsOutline = ''
  traning.value.materials = ''
  traning.value.sopEmergencyPlanId = ''
  traning.value.trainingScenarioNo = ''
  traning.value.emergencyPlanName = ''
  traning.value.emergencyScenarioDetailModelList = []
}
function savePlan() {
  if (props.param.sopEmergencyTrainingId) {
    saveUrl.value = transactionConfig.sop.eap.training.plan.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.eap.training.plan.insert.url
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          traning.value.regUserId = user.value.userId
          traning.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.param.sopEmergencyTrainingId = _result.data
  attachInfo.value.taskKey = props.param.sopEmergencyTrainingId
  attachInfo.value.isSubmit = uid()
  emits('insertTraningInfo', _result.data)
  getDetail()
}
function completePlan() {
  if (props.param.sopEmergencyTrainingId) {
    saveUrl.value = transactionConfig.sop.eap.training.plan.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.eap.training.plan.insert.url
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          traning.value.regUserId = user.value.userId
          traning.value.chgUserId = user.value.userId
          traning.value.trainingCompleteFlag = 'Y'
          isComplete.value = !isComplete.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function completeCallback(_result: any) {
  message.requestSuccess()
  getDetail()
}
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, traning.value.sopEmergencyTrainingId),
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
function addItem() {
  popupOptions.value.title = '훈련참가자 검색' // 훈련참가자 검색
  popupOptions.value.width = '60%'
  popupOptions.value.isFull = false
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeItemPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeItemPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(traning.value.emergencyTrainingUsersModels, {
        attendUserId: _item.userId
      })
      if (index === -1) {
        traning.value.emergencyTrainingUsersModels.splice(0, 0, {
          sopEmergencyTrainingId: traning.value.sopEmergencyTrainingId,
          attendUserId: _item.userId,
          attendUserName: _item.userName,
          deptName: _item.deptName,
          eapAttendTypeCd: null,
          completeFlag: 'N',
          nonattendanceRemark: ''
        })
      }
    })
  }
}
function removeItem() {
  const selectData = tableAttend.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      traning.value.emergencyTrainingUsersModels = _.reject(
        traning.value.emergencyTrainingUsersModels,
        item
      )
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.mt-25
  margin-top: -20px !important
</style>

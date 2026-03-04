<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="밀폐공간작업 훈련계획 상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="training.sopEmergencyTrainingId != '' && !disabled && editable"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-if="training.sopEmergencyTrainingId != '' && !disabled && editable"
                  :url="completeUrl"
                  :isSubmit="isComplete"
                  :param="training"
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
                  :param="training"
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
                  v-model:value="training.trainingName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  required
                  :disabled="disabled"
                  :editable="editable"
                  label="훈련시작일시"
                  type="datetime"
                  :minuteStep="10"
                  name="trainingStartDate"
                  v-model:value="training.trainingStartDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  required
                  :disabled="disabled"
                  :editable="editable"
                  :start="training.trainingStartDate"
                  label="훈련종료일시"
                  type="datetime"
                  :minuteStep="10"
                  name="educationDate"
                  v-model:value="training.trainingEndDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  required
                  :editable="editable && param.sopEmergencyTrainingId == ''"
                  :disabled="true"
                  codeGroupCd="EAP_EVAL_CLASS_CD"
                  itemText="codeName"
                  itemValue="code"
                  type="edit"
                  name="eapTrainingTypeCd"
                  label="훈련구분"
                  v-model:value="training.eapTrainingTypeCd"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  required
                  :disabled="disabled"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="training.plantCd"
                  @datachange="(data: any) => (training.trainingInstructUserIds = [])"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'closedSpace' }"
                  :plantCd="training.plantCd"
                  label="훈련대상 밀폐공간"
                  name="heaClosedSpaceId"
                  v-model:value="training.heaClosedSpaceId"
                />
                <!-- <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련대상 밀폐공간"
                  name="trainingArea"
                  v-model:value="training.trainingArea"
                /> -->
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-tag
                  :editable="editable"
                  :disabled="disabled"
                  itemText="userName"
                  itemValue="userId"
                  label="교관"
                  name="trainingInstructUserIds"
                  v-model:value="training.trainingInstructUserIds"
                  icon="person"
                  @removeTag="removeInstructor"
                  @addTag="addUser(1)"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-25">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="목적"
                  autogrow
                  name="checkPurpose"
                  v-model:value="training.checkPurpose"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-25">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련개요"
                  autogrow
                  name="summary"
                  v-model:value="training.summary"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-25">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련방법"
                  autogrow
                  name="trainingWay"
                  v-model:value="training.trainingWay"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="훈련 시나리오 정보" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :afterIcon="
                    Boolean(training.trainingScenarioNo)
                      ? null
                      : [
                          {
                            name: 'search',
                            click: true,
                            callbackName: 'searchPop'
                          },
                          {
                            name: 'close',
                            click: true,
                            callbackName: 'removeScenario'
                          }
                        ]
                  "
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="훈련시나리오명"
                  name="trainingScenarioName"
                  v-model:value="training.trainingScenarioName"
                  @searchPop="searchPop"
                  @removeScenario="removeScenario"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" />
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="Rev."
                  name="revisionNum"
                  v-model:value="training.revisionNum"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="비상조치계획서명"
                  name="emergencyPlanName"
                  v-model:value="training.emergencyPlanName"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  required
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="훈련내용요약"
                  name="trainingContentsSummary"
                  v-model:value="training.trainingContentsSummary"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="훈련시나리오개요"
                  name="trainingContentsOutline"
                  v-model:value="training.trainingContentsOutline"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="직접참가자 유의사항"
                  name="directlyNotice"
                  v-model:value="training.directlyNotice"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="간접참가자 유의사항"
                  name="indirectNotice"
                  v-model:value="training.indirectNotice"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="준비물"
                  name="materials"
                  v-model:value="training.materials"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="사전준비사항"
                  name="preRequisites"
                  v-model:value="training.preRequisites"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="tableDetail"
            title="훈련 상세 목록"
            :columns="gridDetail.columns"
            :data="training.emergencyScenarioDetailModelList"
            gridHeightAuto
            :filtering="false"
            :isExcelDown="false"
            :usePaging="false"
            :columnSetting="false"
            :editable="editable && !disabled"
            selection="multiple"
            rowKey="trainingScenarioDescNo"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  label="추가"
                  icon="add"
                  @btnClicked="addScenarioDetail"
                />
                <c-btn
                  v-if="
                    editable && !disabled && training.emergencyScenarioDetailModelList!.length > 0
                  "
                  label="제외"
                  icon="remove"
                  @btnClicked="removeScenarioDetail"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="tableAttend"
            title="훈련참가자 목록"
            :columns="grid.columns"
            :data="training.emergencyTrainingUsersModels"
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
                  @btnClicked="addUser(2)"
                />
                <c-btn
                  v-if="editable && !disabled && training.emergencyTrainingUsersModels!.length > 0"
                  label="삭제"
                  :showLoading="false"
                  icon="remove"
                  @btnClicked="removeItem"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-">
          <c-upload label="훈련 사진" :attachInfo="attachInfo" :editable="editable && !disabled" />
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
import { trainingType } from './closedSpace'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'closedSpaceEduInfo'
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
const emits = defineEmits(['insertTraningInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    sopEmergencyTrainingId?: stringNull
    sopEmergencyPlanId?: stringNull
    eapTrainingTypeCd?: stringNull
    plantCd?: stringNull
  }
  contentHeight?: stringNull
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
  param: () => {
    return {
      sopEmergencyTrainingId: '',
      sopEmergencyPlanId: '',
      eapTrainingTypeCd: '',
      plantCd: ''
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
      style: 'width:150px',
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
  height: '396px'
})
const gridDetail = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:5%',
      sortable: false,
      type: 'number'
    },
    {
      required: true,
      name: 'leadTime',
      field: 'leadTime',
      label: '소요시간',
      align: 'center',
      minuteStep: 10,
      style: 'width:8%',
      sortable: false,
      type: 'datetime'
    },
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '항목',
      align: 'left',
      style: 'width:16%',
      sortable: false,
      type: 'text'
    },
    {
      required: true,
      name: 'trainingDetailContents',
      field: 'trainingDetailContents',
      label: '상세훈련내용',
      align: 'left',
      // style: 'width:40%',
      sortable: false,
      type: 'textarea'
    },
    {
      required: true,
      name: 'managerUserName',
      field: 'managerUserName',
      label: '담당자',
      align: 'center',
      style: 'width:10%',
      userId: 'managerUserId',
      sortable: false,
      setHeader: true,
      type: 'user'
    }
  ],
  height: '400px',
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
const training = ref<trainingType>({
  sopEmergencyTrainingId: '',
  plantCd: '',
  trainingName: '',
  eapTrainingTypeCd: 'EVCC000010',
  checkPurpose: '',
  trainingStartDate: '',
  trainingStartTime: '',
  trainingEndDate: '',
  trainingEndTime: '',
  emergencyPlanName: '',
  summary: '',
  trainingWay: '',
  trainingArea: '',
  heaClosedSpaceId: '',
  trainingInstructUserIds: [],
  userJoin: '',
  sopEmergencyPlanId: '',
  trainingScenarioNo: null,
  evaluationUserId: '',
  evaluationOpinon: '',
  trainingCompleteFlag: 'N',
  regUserId: '',
  chgUserId: '',
  emergencyScenarioDetailModelList: [],
  deleteEmergencyScenarioDetailModelList: [],
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
const saveCall = ref({
  saveCallData: ''
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const saveType = ref('POST')
const getUrl = ref('')
const saveUrl = ref(transactionConfig.sop.eap.training.plan.insert.url)
const completeUrl = ref('')
const deleteUrl = ref('')
const getItemUrl = ref('')
const editForm = ref<any>(null)
const tableAttend = ref<any>(null)
const tableDetail = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => training.value.trainingCompleteFlag === 'Y')

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
  deleteUrl.value = transactionConfig.sop.eap.training.plan.delete.url
  getItemUrl.value = selectConfig.sop.eap.training.plan.getItem.url
  completeUrl.value = transactionConfig.sop.eap.training.plan.update.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.param.sopEmergencyTrainingId) {
    $http({
      url: $format(getUrl.value, props.param.sopEmergencyTrainingId),
      method: 'GET'
    }).then((_result: any) => {
      training.value = _result.data
      props.param.eapTrainingTypeCd = _result.data.eapTrainingTypeCd
      props.param.plantCd = _result.data.plantCd
      attachInfo.value.taskKey = props.param.sopEmergencyTrainingId
    })
    saveCall.value.saveCallData = uid()
  }
}
/******************************
 * TODO (목적): 사업장 변경시 교관 정보 리셋
 *******************************/
// function plantChange(_data?: any) {
//   training.value.trainingInstructUserIds = []
// if (!training.value.plantCd) {
//   message.alert({
//     title: '안내',
//     message: '사업장을 선택하세요.',
//     type: 'warning' // success / info / warning / error
//   })
//   return
// }
// $http({
//   url: getItemUrl.value,
//   method: 'GET',
//   params: {
//     sopEmergencyTrainingId: props.param.sopEmergencyTrainingId || '',
//     trainingTypeCd: props.param.eapTrainingTypeCd,
//     plantCd: training.value.plantCd,
//     useFlag: 'Y',
//   }
// }).then((_result: any) => {
//   training.value.emergencyTrainingEvaluationModels = _result.data
// })
// }
/******************************
 * TODO (목적): 참석자 추가 (1: 교관, 2: 참석자)
 *******************************/
function addUser(num?: number) {
  popupOptions.value = getPopupOptions(
    'user',
    popupOptions.value,
    num === 1 ? closeUser1 : closeUser2,
    {
      type: 'multiple'
    }
  )
}
function closeUser1(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (!training.value.trainingInstructUserIds) training.value.trainingInstructUserIds = []
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(training.value.trainingInstructUserIds, { userId: item.userId }) === -1) {
        training.value.trainingInstructUserIds!.push({
          userId: item.userId,
          userName: item.userName
        })
      }
    })
  }
}
function closeUser2(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(training.value.emergencyTrainingUsersModels, { attendUserId: item.userId }) ===
        -1
      ) {
        training.value.emergencyTrainingUsersModels!.splice(0, 0, {
          sopEmergencyTrainingId: training.value.sopEmergencyTrainingId,
          attendUserId: item.userId,
          attendUserName: item.userName,
          deptName: item.deptName,
          eapAttendTypeCd: 'ETUCC00001', // 직접참가
          completeFlag: 'N',
          nonattendanceRemark: ''
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 교관 삭제
 *******************************/
function removeInstructor(item: any) {
  training.value.trainingInstructUserIds = _.reject(training.value.trainingInstructUserIds, item)
}
/******************************
 * TODO (목적): 훈련 시나리오 팝업으로 선택시
 *******************************/
function searchPop() {
  popupOptions.value = getPopupOptions('trainingScenario', popupOptions.value, closeScenario, {
    type: 'single'
  })
}
function closeScenario(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    training.value.emergencyPlanName = _data[0].emergencyPlanName
    training.value.trainingScenarioName = _data[0].trainingScenarioName
    training.value.trainingContentsSummary = _data[0].trainingContentsSummary
    training.value.preRequisites = _data[0].preRequisites
    training.value.revisionNum = _data[0].revisionNum
    // training.value.directlyNotice = _data[0].directlyNotice
    // training.value.indirectNotice = _data[0].indirectNotice
    training.value.trainingContentsOutline = _data[0].trainingContentsOutline
    training.value.materials = _data[0].materials
    training.value.sopEmergencyPlanId = _data[0].sopEmergencyPlanId
    // training.value.trainingScenarioNo = _data[0].trainingScenarioNo
    training.value.emergencyScenarioDetailModelList = []
    $http({
      url: $format(
        selectConfig.sop.eap.scenario.rev.get.url,
        _data[0].sopEmergencyPlanId,
        _data[0].trainingScenarioNo
      ),
      method: 'GET'
    }).then((_result: any) => {
      training.value.emergencyScenarioDetailModelList =
        _result.data.emergencyScenarioDetailModelList
    })
  }
}
function removeScenario() {
  training.value.trainingScenarioName = ''
  training.value.trainingContentsSummary = ''
  training.value.preRequisites = ''
  training.value.revisionNum = ''
  // training.value.directlyNotice = ''
  // training.value.indirectNotice = ''
  training.value.trainingContentsOutline = ''
  training.value.materials = ''
  training.value.sopEmergencyPlanId = ''
  training.value.trainingScenarioNo = null
  training.value.emergencyScenarioDetailModelList = []
}
/******************************
 * TODO (목적): 저장
 *******************************/
function savePlan() {
  saveType.value = props.param.sopEmergencyTrainingId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          training.value.regUserId = user.value.userId
          training.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
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
/******************************
 * TODO (목적): 완료
 *******************************/
function completePlan() {
  saveType.value = props.param.sopEmergencyTrainingId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          training.value.regUserId = user.value.userId
          training.value.chgUserId = user.value.userId
          training.value.trainingCompleteFlag = 'Y'
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback(_result: any) {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 훈련계획 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.sopEmergencyTrainingId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 참석자 row 삭제
 *******************************/
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
      training.value.emergencyTrainingUsersModels = _.reject(
        training.value.emergencyTrainingUsersModels,
        item
      )
    })
  }
}
/******************************
 * TODO (목적): 시나리오 상세 추가
 *******************************/
function addScenarioDetail() {
  const _maxNum = _.maxBy(training.value.emergencyScenarioDetailModelList, 'sortOrder') as any
  const maxNum = _maxNum && !isNaN(_maxNum.sortOrder) ? Number(_maxNum.sortOrder) + 1 : 1
  training.value.emergencyScenarioDetailModelList!.push({
    sopEmergencyPlanId: props.param.sopEmergencyTrainingId,
    trainingScenarioNo: training.value.trainingScenarioNo || null,
    revNo: 1,
    trainingScenarioDescNo: uid(),
    sortOrder: maxNum,
    leadTime: '',
    itemName: '',
    trainingDetailContents: '',
    managerUserId: '',
    managerUserName: '',
    editFlag: 'C'
  })
}
function removeScenarioDetail() {
  const selectData = tableDetail.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!training.value.deleteEmergencyScenarioDetailModelList) {
        training.value.deleteEmergencyScenarioDetailModelList = []
      }
      if (
        _.findIndex(training.value.deleteEmergencyScenarioDetailModelList, {
          trainingScenarioDescNo: item.trainingScenarioDescNo
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        training.value.deleteEmergencyScenarioDetailModelList.push(item)
      }
      training.value.emergencyScenarioDetailModelList = _.reject(
        training.value.emergencyScenarioDetailModelList,
        { trainingScenarioDescNo: item.trainingScenarioDescNo }
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

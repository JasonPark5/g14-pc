<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- <c-btn
                  v-show="Boolean(nearAccident.iimNearAccidentId) && !disabled && editable"
                  :url="completeUrl"
                  :isSubmit="isComplete"
                  :param="nearAccident"
                  mappingType="PUT"
                  label="완료"
                  icon="check"
                  @beforeAction="completeNearAccident"
                  @btnCallback="completeCallback" 
                /> -->
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <c-appr-btn
                  v-if="!isApprDisabled"
                  ref="apprBtn"
                  name="near-register-appr-btn"
                  :editable="editable"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="saveDataAppr"
                  @callbackApprAction="approvalCallback"
                  @requestAfterAction="getDetail"
                />
                <c-btn
                  v-if="
                    Boolean(nearAccident.iimNearAccidentId) &&
                    !isApprDisabled &&
                    !disabled &&
                    editable
                  "
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-show="!disabled && editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="nearAccident"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveNearAccident"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  required
                  :editable="editable"
                  name="iimNearAccidentName"
                  label="아차사고명"
                  v-model:value="nearAccident.iimNearAccidentName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  name="iimNearAccidentNo"
                  label="아차사고번호"
                  v-model:value="nearAccident.iimNearAccidentNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-multi-select
                  required
                  codeGroupCd="IIM_NEAR_KIND_CD"
                  :editable="editable"
                  :disabled="disabled"
                  :isArray="false"
                  itemText="codeName"
                  itemValue="code"
                  name="iimNearKindCds"
                  label="아차사고종류"
                  v-model:value="nearAccident.iimNearKindCds"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  type="datetime"
                  :disabled="disabled"
                  :minuteStep="10"
                  label="발생일시"
                  name="occurrenceDt"
                  v-model:value="nearAccident.occurrenceDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  label="공정"
                  required
                  :editable="editable"
                  :disabled="disabled"
                  name="processCd"
                  :customPopupParam="{ targetKey: 'process' }"
                  v-model:value="nearAccident.processCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  name="occurenceLocation"
                  label="발생가능장소"
                  v-model:value="nearAccident.occurrenceLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  codeGroupCd="IIM_GRADE_CD"
                  itemText="codeName"
                  itemValue="code"
                  name="iimGradeCd"
                  label="아차사고등급"
                  v-model:value="nearAccident.iimGradeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  :editable="editable"
                  :disabled="disabled"
                  :data="nearAccident"
                  label="보고자"
                  type="dept_user"
                  name="reportUserId"
                  v-model:value="nearAccident.reportUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :editable="editable"
                  :disabled="disabled"
                  type="datetime"
                  label="보고일시"
                  :minuteStep="10"
                  name="reportDt"
                  v-model:value="nearAccident.reportDt"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :disabled="disabled"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="nearAccident.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-radio
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="WEATHER_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="weatherCd"
                  label="날씨"
                  v-model:value="nearAccident.weatherCd"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  type="edit"
                  label="발굴부서"
                  name="occurrenceDeptCd"
                  v-model:value="nearAccident.occurrenceDeptCd">
                </c-dept>
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  label="위험성평가"
                  :editable="editable"
                  :disabled="disabled"
                  name="ramRiskAssessmentPlanId"
                  :customPopupParam="{ targetKey: 'riskAssessment' }"
                  v-model:value="nearAccident.ramRiskAssessmentPlanId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  type="edit"
                  label="부서"
                  name="occurrenceDeptCd"
                  v-model:value="nearAccident.occurrenceDeptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  autogrow
                  label="긴급조치사항"
                  name="emergencyMeasures"
                  v-model:value="nearAccident.emergencyMeasures"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  :isCheck="true"
                  autogrow
                  label="아차사고 개요"
                  name="overviewAccidentSituation"
                  v-model:value="nearAccident.overviewAccidentSituation"
                  @checkboxClick="checkboxClick"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="사고발생시 상태" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="IIM_NEARMISS_DISCERN"
                  :isArray="false"
                  itemText="codeName"
                  itemValue="code"
                  label="인지기능"
                  name="iimNearDiscernCds"
                  v-model:value="nearAccident.iimNearDiscernCds"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="IIM_NEARMISS_FUNCTION"
                  :isArray="false"
                  itemText="codeName"
                  itemValue="code"
                  label="사고기능"
                  name="iimNearFunctionCds"
                  v-model:value="nearAccident.iimNearFunctionCds"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="IIM_NEARMISS_FEEL"
                  :isArray="false"
                  itemText="codeName"
                  itemValue="code"
                  label="감정"
                  name="iimNearFeelCds"
                  v-model:value="nearAccident.iimNearFeelCds"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="IIM_NEARMISS_EQUIP"
                  :isArray="false"
                  itemText="codeName"
                  itemValue="code"
                  label="설비요인"
                  name="iimNearEquipCds"
                  v-model:value="nearAccident.iimNearEquipCds"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="IIM_NEARMISS_MANAGE"
                  itemText="codeName"
                  itemValue="code"
                  :isArray="false"
                  label="관리요인"
                  name="iimNearManageCds"
                  v-model:value="nearAccident.iimNearManageCds"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-card title="발생 가능형태">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-select
                  :editable="editable"
                  :disabled="disabled"
                  :comboItems="occFirstItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="occurrenceModeLargeCd"
                  label="대분류"
                  v-model:value="nearAccident.occurrenceModeLargeCd"
                  @datachange="occurDataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-select
                  :editable="editable"
                  :disabled="disabled"
                  :comboItems="occSecItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="occurrenceModeSmallCd"
                  label="중분류"
                  v-model:value="nearAccident.occurrenceModeSmallCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-card title="위험성평가" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  type="number"
                  name="frequencyRisk"
                  label="빈도"
                  v-model:value="nearAccident.frequencyRisk"
                  @update:value="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  type="number"
                  name="strengthRisk"
                  label="강도"
                  v-model:value="nearAccident.strengthRisk"
                  @update:value="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  type="number"
                  name="totalRisk"
                  label="위험도"
                  v-model:value="nearAccident.totalRisk"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-card title="포상금">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label=""
                  suffix="원"
                  type="number"
                  name="bounty"
                  v-model:value="nearAccident.bounty"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="사고발생 가능 원인" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  name="directCause"
                  label="직접원인"
                  v-model:value="nearAccident.directCause"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  name="indirectCause"
                  label="간접원인"
                  v-model:value="nearAccident.indirectCause"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  name="openning"
                  label="기인물"
                  v-model:value="nearAccident.openning"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  name="injurious"
                  label="가해물"
                  v-model:value="nearAccident.injurious"
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

import { nearAccidentPopupParamType, nearAccidentType } from './nearAccident'

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
  name: 'nearRegisterInfo'
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
const emits = defineEmits(['transInfo', 'changeStatus', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: nearAccidentPopupParamType
  isApprDisabled: boolean
  attachInfo1: attachSettingType
  attachInfo2: attachSettingType
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
      iimNearAccidentId: '',
      iimStatusNearCd: ''
    }
  },
  attachInfo1: () => {
    return {
      isSubmit: '',
      taskClassCd: 'NEAR_FIRST_PICTURE',
      taskKey: ''
    }
  },
  attachInfo2: () => {
    return {
      isSubmit: '',
      taskClassCd: 'NEAR_SECOND_PICTURE',
      taskKey: ''
    }
  },
  isApprDisabled: false
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
const nearAccident = ref<nearAccidentType>({
  iimNearAccidentId: '',
  plantCd: '',
  iimNearAccidentNo: '',
  iimNearAccidentName: '',
  iimStatusNearCd: '',
  reportUserId: '',
  reportDt: '',
  iimNearKindCds: '',
  iimGradeCd: null,
  occurrenceDt: '',
  occurrenceLocation: '',
  occurrenceDeptCd: '',
  weatherCd: 'WC000001',
  emergencyMeasures: '',
  overviewAccidentSituation: '',
  occurrenceModeLargeCd: null,
  occurrenceModeSmallCd: null,
  directCause: '',
  indirectCause: '',
  openning: '',
  injurious: '',
  iimNearDiscernCds: null,
  iimNearFunctionCds: null,
  iimNearFeelCds: null,
  iimNearEquipCds: null,
  iimNearManageCds: null,
  processCd: '',
  frequencyRisk: '',
  strengthRisk: '',
  totalRisk: '',
  ramRiskAssessmentPlanId: '',
  bounty: 0
})
const occFirstItems = ref<codeMasterType>([])
const occSecItems = ref<codeMasterType>([])
const saveType = ref('POST')
const isSave = ref(false)
const isApproval = ref(false)
const saveUrl = ref('')
const detailUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const occurUrl = ref('')
const editForm = ref<any>(null)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    (editable.value &&
      Boolean(nearAccident.value.iimStatusNearCd) &&
      nearAccident.value.iimStatusNearCd === 'ISNC000002') ||
    nearAccident.value.approvalStatusCd === 'ASC9999999'
)
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: nearAccident.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: nearAccident.value.approvalStatusCd,
    apprEditable: !disabled.value && props.popupParam.iimNearAccidentId, // 결재버튼 활성화 기준
    param: nearAccident.value, // 결재 param
    approvalUrl: transactionConfig.sop.iim.accident.near.update.url, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000016', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      iimNearAccidentId: props.popupParam.iimNearAccidentId,
      isApprContent: true
    },
    approvalRequestName:
      $language('아차사고') + ' [' + nearAccident.value.iimNearAccidentName + ']', // 결재요청명 (문서 title)
    approvalConnId: props.popupParam.iimNearAccidentId // 결재연결용 업무일련번호 (문서 key)
  }
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => nearAccident.value.occurrenceModeLargeCd,
  () => {
    if (!nearAccident.value.occurrenceModeLargeCd) return
    setSecondItems(nearAccident.value.occurrenceModeLargeCd)
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
  detailUrl.value = selectConfig.sop.iim.accident.near.get.url
  occurUrl.value = selectConfig.sop.iim.occurForm.list.url
  saveUrl.value = transactionConfig.sop.iim.accident.near.insert.url
  deleteUrl.value = transactionConfig.sop.iim.accident.near.delete.url
  completeUrl.value = transactionConfig.sop.iim.accident.near.complete.url
  // code setting
  // list setting
  setFirstItems()
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  //상세페이지 항목들에 저장된 값들을 가져오는 부분
  if (props.popupParam.iimNearAccidentId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.iimNearAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      nearAccident.value = _result.data
      props.attachInfo1.taskKey = props.popupParam.iimNearAccidentId
      props.attachInfo2.taskKey = props.popupParam.iimNearAccidentId
      emits('transInfo', _result.data)
      dataChange()
    })
  }
}
/******************************
 * TODO (목적): 대분류 조회
 *******************************/
function setFirstItems() {
  $http({
    url: occurUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y', //사용중인 것만 가져옴
      occurLevel: '1' //발생레벨(깊이)
    }
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      occFirstItems.value.splice(0, 0, {
        code: _item.iimOccurMasterId, //목록을 가져오는 부분
        codeName: _item.occurName //가져온 목록의 이름을 넣는 부분
      })
    })
  })
}

/******************************
 * TODO (목적): 소분류 조회
 *******************************/
function setSecondItems(_iimOccurMasterId: string) {
  $http({
    url: occurUrl.value,
    method: 'GET',
    params: {
      iimUpOccurMasterId: _iimOccurMasterId,
      useFlag: 'Y', //사용중인 것만 가져옴
      occurLevel: '2' //발생레벨(깊이)
    }
  }).then((_result: any) => {
    occSecItems.value = []
    _.forEach(_result.data, (_item) => {
      occSecItems.value.splice(0, 0, {
        code: _item.iimOccurMasterId,
        codeName: _item.occurName
      })
    })
  })
}
/******************************
 * TODO (목적): 위험도 계산
 *******************************/
function dataChange() {
  //유효성체크(숫자만 들어오게) frequencyRisk"strengthRisk
  if (nearAccident.value.frequencyRisk && nearAccident.value.strengthRisk) {
    nearAccident.value.totalRisk =
      Number(nearAccident.value.frequencyRisk) * Number(nearAccident.value.strengthRisk)
  }
}
/******************************
 * TODO (목적): 아차사고 저장
 *******************************/
function saveNearAccident() {
  if (props.popupParam.iimNearAccidentId) {
    saveUrl.value = transactionConfig.sop.iim.accident.near.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.iim.accident.near.insert.url
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          nearAccident.value.regUserId = user.value.userId
          nearAccident.value.chgUserId = user.value.userId
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
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.popupParam.iimNearAccidentId) {
    emits('changeStatus') //개선관리 탭을 추가하는 부분(Detail -> RegisterTab -> RegisterInfo 순으로 되어있음)
    props.popupParam.iimNearAccidentId = result.data
    // 관련사진에 사진을 저장하는 부분(없으면 상세조회 때 사진을 가져올 수 없음)
    props.attachInfo1.taskKey = result.data
    props.attachInfo2.taskKey = result.data
    props.attachInfo1.isSubmit = uid()
    props.attachInfo2.isSubmit = uid()
  }
  getDetail()
}
/*completeNearAccident() {
      this.$refs['editForm'].validate().then(_result => {
        if (_result) {
          message.confirm({
            title: '확인',
            message: '완료하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              nearAccident.value.regUserId = user.value.userId
              nearAccident.value.chgUserId = user.value.userId
              this.isComplete = !this.isComplete
            },
            // 취소 callback 함수
            cancelCallback: () => {
            },
          });
        } else {
          window.getApp.$emit('APP_VALID_ERROR');
        }
      });
    },
    completeCallback() {
      window.getApp.$emit('APP_REQUEST_SUCCESS');
      // 완료버튼을 눌러서 완료한 뒤 ISNC000002(등록완료)를 전달하는 부분
      this.$emit('changeComplete')
      this.getDetail();
    },*/
/******************************
 * TODO (목적): 아차사고 결재요청
 *******************************/
/* eslint-disable no-unused-vars */
function saveDataAppr() {
  message.confirm({
    title: '확인',
    message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      nearAccident.value.regUserId = user.value.userId
      nearAccident.value.chgUserId = user.value.userId
      const promises = [
        {
          func: approvalValue
        }
      ]
      orderedPromise(promises)
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
// [S] 결재관련
function approvalCallback() {
  // 결재관련 결재요청버튼 callback
  apprBtn.value.apprRequestPop()
}
function approvalValue() {
  return new Promise((resolve) => {
    isApproval.value = !isApproval.value
    resolve(true)
  })
}
/******************************
 * TODO (목적): 아차사고 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.iimNearAccidentId),
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
 * TODO (목적): 대분류 값 변경
 *******************************/
function occurDataChange() {
  if (!nearAccident.value.occurrenceModeLargeCd) {
    nearAccident.value.occurrenceModeSmallCd = null
    occSecItems.value = []
  } else {
    nearAccident.value.occurrenceModeSmallCd = null
    setSecondItems(nearAccident.value.occurrenceModeLargeCd)
  }
}
/******************************
 * TODO (목적): 육하원칙 내용 추가
 *******************************/
function checkboxClick(checkValue: stringNull) {
  if (checkValue === 'O') {
    nearAccident.value.overviewAccidentSituation =
      '- ' +
      $language('누가') +
      ' : \n' +
      '- ' +
      $language('누구에게') +
      ' : \n' +
      '- ' +
      $language('언제') +
      ' : \n' +
      '- ' +
      $language('어디서') +
      ' : \n' +
      '- ' +
      $language('무엇을') +
      ' : \n' +
      '- ' +
      $language('어떻게') +
      ' : \n' +
      '- ' +
      $language('왜') +
      ' : '
  } else {
    nearAccident.value.overviewAccidentSituation = ''
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div class="row">
    <div v-if="editable" class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
      <c-card class="cardClassDetailInfo" title="설비 기본정보">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && popupParam.noPlan === 'Y' && !updateMode && !disabled"
              label="선택"
              icon="add"
              @btnClicked="add"
            />
            <c-btn
              v-if="editable && updateMode && !disabled"
              :showLoading="false"
              label="완료"
              icon="save"
              color="blue"
              @btnClicked="resultComplete"
            />
            <c-btn
              v-if="editable && !disabled"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="result"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveInspection"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div v-if="editable && !result.equipmentCd" class="col-12">
            <c-label-text title="설비를 선택하세요." />
          </div> -->
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="사업장" :value="result.plantName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="설비유형" :value="result.equipmentTypeName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="설비코드" :value="result.equipmentCd" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="설비명" :value="result.equipmentName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="이전정비일" :value="result.recentMaintainDate" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="관련법규" :value="result.relatedLawsName" />
          </div>
          <div class="col-12" />
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
      <q-form ref="editForm">
        <c-card class="cardClassDetailForm" title="설비 정비결과" bgClass="">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                required
                :disabled="disabled"
                label="정비유형"
                codeGroupCd="MDM_MAINTENANCE_KIND_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                v-model:value="result.equipmentCheckTypeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :disabled="disabled"
                label="실제정비자"
                name="maintenanceUserId"
                type="user"
                v-model:value="result.maintenanceUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                required
                :disabled="disabled"
                :editable="editable"
                label="실제정비일"
                name="maintenanceDate"
                v-model:value="result.maintenanceDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                required
                :disabled="disabled"
                :editable="editable"
                codeGroupCd="MIM_CHECK_RESULT_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="inspResultAfterMemCd"
                label="정비후 정비결과"
                v-model:value="result.inspResultAfterMemCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :disabled="disabled"
                :editable="editable"
                label="정비시간"
                :range="true"
                :minuteStep="10"
                type="time"
                name="maintenanceTimeList"
                v-model:value="maintenanceTimeList"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :disabled="disabled"
                :editable="editable"
                label="운전정지시간"
                :range="true"
                :minuteStep="10"
                type="time"
                name="stopDrivingTimeList"
                v-model:value="stopDrivingTimeList"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :disabled="disabled"
                label="정비부서 입회자"
                name="memDeptEntrantUserId"
                type="user"
                v-model:value="result.memDeptEntrantUserId"
              />
            </div>
            <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-task-target
                :disabled="disabled"
                :editable="editable"
                label="MOC번호"
                :customPopupParam="{ targetKey: 'moc' }"
                name="sopMocId"
                v-model:value="result.sopMocId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                :disabled="disabled"
                label="정비자 자격사항"
                name="maintenanceQualifications"
                v-model:value="result.maintenanceQualifications"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                label="정비원인"
                :rows="2"
                name="maintenanceCause"
                v-model:value="result.maintenanceCause"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                label="정비내용"
                :rows="2"
                name="maintenanceContent"
                v-model:value="result.maintenanceContent"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                label="정비결과요약"
                :rows="2"
                name="maintenanceResultSummary"
                v-model:value="result.maintenanceResultSummary"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                label="관리자의 검토의견"
                :rows="2"
                name="reviewOpinionOfMananger"
                v-model:value="result.reviewOpinionOfMananger"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import {
  equipmentMaintenancePopupParamType,
  equipmentMaintenanceType
} from './equipmentMaintenance'

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
  name: 'equipmentMaintenanceResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: equipmentMaintenancePopupParamType
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
      title: '',
      disabled: false,
      noPlan: 'N',
      multiple: false,
      minEquipmentMaintenanceId: ''
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const result = ref<equipmentMaintenanceType>({
  minEquipmentMaintenanceId: '',
  plantCd: '',
  equipmentCd: '',
  maintenanceStatusCd: null,
  equipmentTypeCd: '',
  equipmentCheckTypeCd: null,
  memDeptEntrantUserId: '',
  maintenanceDueDate: '',
  maintenanceDueUserId: '',
  sopMocId: '',
  maintenanceUserId: '',
  maintenanceQualifications: '',
  maintenanceResultSummary: '',
  inspResultAfterMemCd: null,
  noPlanResultEnrollFlag: 'N',
  maintenanceCause: '',
  maintenanceContent: '',
  maintenanceStartTime: '',
  maintenanceEndTime: '',
  stopDrivingStartTime: '',
  stopDrivingEndTime: '',
  reviewOpinionOfMananger: '',
  workSummary: '',
  permitTypeCd: '',
  sopWorkPermitId: '',
  reportNo: '',
  managerConfirm: '',
  failureSeverity: '',
  failureMode: '',
  noUseTime: '',
  totalNumber: '',
  allDrivingTime: '',
  stopDrivingTimeList: [],
  maintenanceTimeList: [],
  allDrivingTimeList: [],
  noUseTimeList: [],
  disable: false
})
const title = ref('')
const updateMode = ref(false)
const getUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)
const stopDrivingTimeList = ref<any>([])
const maintenanceTimeList = ref<any>([])
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return result.value.maintenanceStatusCd === 'MCSC000015'
})
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
  saveUrl.value = transactionConfig.sop.min.maintenance.plan.insert.url
  getUrl.value = selectConfig.sop.min.maintenance.plan.get.url
  insertUrl.value = transactionConfig.sop.min.maintenance.result.insert.url
  updateUrl.value = transactionConfig.sop.min.maintenance.result.update.url
  completeUrl.value = transactionConfig.sop.min.maintenance.result.complete.url
  // code setting
  title.value = props.popupParam.title
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 무계획 정비 결과 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.minEquipmentMaintenanceId) {
    $http({
      url: $format(getUrl.value, props.popupParam.minEquipmentMaintenanceId),
      method: 'GET'
    }).then((_result: any) => {
      result.value = _result.data

      if (_result.data.stopDrivingStartTime && _result.data.stopDrivingEndTime) {
        stopDrivingTimeList.value = [
          _result.data.stopDrivingStartTime,
          _result.data.stopDrivingEndTime
        ]
      }
      if (_result.data.maintenanceStartTime && _result.data.maintenanceEndTime) {
        maintenanceTimeList.value = [
          _result.data.maintenanceStartTime,
          _result.data.maintenanceEndTime
        ]
      }
      updateMode.value = true
    })
  }
}
function add() {
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmentPopup, {
    /** 원하는 parameter 정의 */
    type: 'single'
  })
}
function closeEquipmentPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data) {
    result.value.minEquipmentMaintenanceId = ''
    result.value.plantCd = data[0].plantCd
    result.value.plantName = data[0].plantName
    ;(result.value.memDeptEntrantUserId = data[0].managementDepts),
      (result.value.memDeptEntrantUserName = data[0].managementDeptName)
    result.value.sopMocId = ''
    result.value.equipmentCheckTypeCd = null
    result.value.maintenanceStatusCd = 'MCSC000005'
    result.value.maintenanceDueUserName = ''
    result.value.maintenanceDueUserId = ''
    result.value.maintenanceDueDate = ''
    result.value.equipmentTypeCd = data[0].equipmentTypeCd
    result.value.equipmentTypeName = data[0].equipmentTypeName
    result.value.equipmentCd = data[0].equipmentCd
    result.value.equipmentName = data[0].equipmentName
    result.value.pmCycleName = data[0].pmCycleName
    result.value.pmCycleCd = data[0].pmCycleCd
    result.value.recentMaintainDate = data[0].recentMaintainDate
    result.value.noPlanResultEnrollFlag = 'N'
    result.value.relatedLawsName = data[0].relatedLawsName
    result.value.regUserId = user.value.userId
    result.value.chgUserId = user.value.userId
    result.value.editFlag = 'C'
  }
}
function saveInspection() {
  if (props.popupParam.minEquipmentMaintenanceId) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  if (props.popupParam.noPlan === 'Y') {
    result.value.noPlanResultEnrollFlag = 'Y'
  }
  if (!result.value.equipmentCd) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          if (maintenanceTimeList.value && maintenanceTimeList.value.length > 0) {
            result.value.maintenanceStartTime = maintenanceTimeList.value[0]
            result.value.maintenanceEndTime = maintenanceTimeList.value[1]
          }
          if (stopDrivingTimeList.value && stopDrivingTimeList.value.length > 0) {
            result.value.stopDrivingStartTime = stopDrivingTimeList.value[0]
            result.value.stopDrivingEndTime = stopDrivingTimeList.value[1]
          }
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
  props.popupParam.minEquipmentMaintenanceId = result.data
  getDetail()
}
function resultComplete() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '정비완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
        type: 'warning', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          result.value.maintenanceCompleteFlag = 'Y'
          if (maintenanceTimeList.value && maintenanceTimeList.value.length > 0) {
            result.value.maintenanceStartTime = maintenanceTimeList.value[0]
            result.value.maintenanceEndTime = maintenanceTimeList.value[1]
          }
          if (stopDrivingTimeList.value && stopDrivingTimeList.value.length > 0) {
            result.value.stopDrivingStartTime = stopDrivingTimeList.value[0]
            result.value.stopDrivingEndTime = stopDrivingTimeList.value[1]
          }
          $http({
            url: completeUrl.value,
            method: 'PUT',
            data: result.value
          }).then((_result: any) => {
            message.requestSuccess()
            getDetail()
          })
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

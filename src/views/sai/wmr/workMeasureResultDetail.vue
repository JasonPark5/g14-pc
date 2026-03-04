<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !popupParam.disabled"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="workMeasure"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-task-target
                label="공정"
                :editable="editable"
                :disabled="popupParam.disabled"
                :customPopupParam="{ targetKey: 'process' }"
                name="processCd"
                v-model:value="workMeasure.processCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-dept
                :editable="editable"
                :disabled="popupParam.disabled"
                type="edit"
                label="부서"
                name="deptCd"
                v-model:value="workMeasure.deptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                label="단위작업장소"
                :disabled="popupParam.disabled"
                name="workPlace"
                v-model:value="workMeasure.workPlace"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="작업환경측정결과 정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                required
                :editable="editable"
                :disabled="true"
                :afterIcon="
                  popupParam.disabled
                    ? null
                    : [
                        {
                          name: 'search',
                          click: true,
                          callbackName: 'searchPop',
                          color: 'teal'
                        },
                        { name: 'close', click: true, callbackName: 'removeHazard', color: 'red' }
                      ]
                "
                label="유해인자"
                name="hazardName"
                v-model:value="workMeasure.hazardName"
                @searchPop="searchPop"
                @removeHazard="removeHazard"
              />
            </div>
            <div
              v-if="
                popupParam.hazardClassFstCd === 'HCF0000005' ||
                popupParam.hazardClassFstCd === 'HCF0000010'
              "
              class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            >
              <c-text
                :editable="editable"
                :disabled="true"
                label="CAS NO."
                name="casNo"
                v-model:value="workMeasure.casNo"
              />
            </div>
            <div
              v-if="
                popupParam.hazardClassFstCd === 'HCF0000005' ||
                popupParam.hazardClassFstCd === 'HCF0000010'
              "
              class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            >
              <c-text
                :editable="editable"
                :disabled="true"
                label="화학물질명"
                name="chemName"
                v-model:value="workMeasure.chemName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                :disabled="popupParam.disabled"
                label="작업내용"
                name="workContents"
                v-model:value="workMeasure.workContents"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                suffix="명"
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="근로자수"
                name="workCount"
                v-model:value="workMeasure.workCount"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                :disabled="popupParam.disabled"
                label="근로형태 및 실제근로시간"
                name="shiftType"
                placeholder="O조O교대O시간"
                v-model:value="workMeasure.shiftType"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                v-if="
                  popupParam.hazardClassFstCd === 'HCF0000005' ||
                  popupParam.hazardClassFstCd === 'HCF0000010'
                "
                suffix="분"
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="유해인자발생시간(주기)"
                name="occurTime"
                v-model:value="workMeasure.occurTime"
              />
              <c-text
                v-else
                suffix="분"
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="발생 형태 및 발생시간(주기)"
                name="occurType"
                v-model:value="workMeasure.occurType"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-task-target
                :editable="editable"
                :disabled="popupParam.disabled"
                label="측정위치 (근로자명)"
                name="measPositionName"
                :customPopupParam="{ targetKey: 'user' }"
                v-model:value="workMeasure.measPositionName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="editable"
                :disabled="popupParam.disabled"
                label="측정시간"
                type="time"
                :minuteStep="10"
                :range="true"
                name="measTime"
                v-model:value="measTime"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                suffix="회"
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="측정횟수"
                name="measCount"
                v-model:value="workMeasure.measCount"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                :suffix="
                  popupParam.hazardClassFstCd === 'HCF0000005' ||
                  popupParam.hazardClassFstCd === 'HCF0000010'
                    ? ''
                    : workMeasure.hazardCd === 'C000000196'
                      ? 'dB'
                      : '℃'
                "
                required
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="측정치"
                name="measValue"
                v-model:value="workMeasure.measValue"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                :suffix="
                  popupParam.hazardClassFstCd === 'HCF0000005' ||
                  popupParam.hazardClassFstCd === 'HCF0000010'
                    ? ''
                    : workMeasure.hazardCd === 'C000000196'
                      ? 'dB'
                      : '℃'
                "
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="TWA-전회"
                :labelIcon="[
                  {
                    name: 'help',
                    tooltip: `시간가중 평균노출기준 TWA (Time Weighted Average) 란?<br/> 1일 8시간 작업을 기준으로 하여 유해요인의 측정치에 발생시간을 곱하여 8시간으로 나눈 값 (시간당 평균 측정값). <br/>해당 물질의 TWA 노출기준값은 MSDS 의 [8. 노출방지 및 개인보호구] 항목에 표기되어 있다.`
                  }
                ]"
                name="twaPrev"
                v-model:value="workMeasure.twaPrev"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                :suffix="
                  popupParam.hazardClassFstCd === 'HCF0000005' ||
                  popupParam.hazardClassFstCd === 'HCF0000010'
                    ? ''
                    : workMeasure.hazardCd === 'C000000196'
                      ? 'dB'
                      : '℃'
                "
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="TWA-금회"
                :labelIcon="[
                  {
                    name: 'help',
                    tooltip: `시간가중 평균노출기준 TWA (Time Weighted Average) 란?<br/> 1일 8시간 작업을 기준으로 하여 유해요인의 측정치에 발생시간을 곱하여 8시간으로 나눈 값 (시간당 평균 측정값). <br/>해당 물질의 TWA 노출기준값은 MSDS 의 [8. 노출방지 및 개인보호구] 항목에 표기되어 있다.`
                  }
                ]"
                name="twaCurr"
                v-model:value="workMeasure.twaCurr"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                :suffix="
                  popupParam.hazardClassFstCd === 'HCF0000005' ||
                  popupParam.hazardClassFstCd === 'HCF0000010'
                    ? ''
                    : workMeasure.hazardCd === 'C000000196'
                      ? 'dB'
                      : '℃'
                "
                :editable="editable"
                :disabled="popupParam.disabled"
                type="number"
                label="노출기준"
                name="exposureStandard"
                v-model:value="workMeasure.exposureStandard"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                label="측정치 평가결과"
                :disabled="false"
                :editable="false"
                name="exposureFlag"
                v-model:value="measureResult"
              />
              <!-- <c-select
                :disabled="popupParam.disabled"
                type="edit"
                codeGroupCd="WORK_EXPOSURE_TYPE_CD"
                itemText="codeName"
                itemValue="code"
                name="exposureFlag"
                label="측정치 평가결과"
                v-model:value="workMeasure.exposureFlag"
              /> -->
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <c-text
                :disabled="popupParam.disabled"
                :editable="editable"
                label="측정방법"
                name="measMethod"
                v-model:value="workMeasure.measMethod"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-textarea
                :disabled="popupParam.disabled"
                name="remark"
                label="비고"
                autogrow
                v-model:value="workMeasure.remark"
              />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { workMeasureType } from './workMeasure'

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
  name: 'workMeasureResultDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
    disabled?: boolean
    workMeasurementPlanId?: stringNull
    workMeasurementResultId?: stringNull
    hazardClassFstCd?: stringNull
    plantCd?: stringNull
    title?: stringNull
  }
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
      workMeasurementPlanId: '',
      workMeasurementResultId: '',
      hazardClassFstCd: null,
      title: '',
      disabled: false,
      plantCd: null
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const measTime = ref(['', ''])
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const detailUrl = ref('')
const saveUrl = ref('')
const editForm = ref<any>(null)
const workMeasure = ref<workMeasureType>({
  workMeasurementResultId: '',
  workMeasurementPlanId: '',
  hazardCd: '',
  hazardName: '',
  chemName: '',
  casNo: '',
  processCd: '',
  workAreaGradeCd: '',
  deptCd: '',
  workPlace: '',
  workContents: '',
  workCount: '',
  shiftType: '',
  occurType: '',
  occurTime: '',
  measPositionName: '',
  measCount: '',
  measValue: '',
  twaPrev: '',
  measPlaceName: '',
  twaCurr: '',
  exposureStandard: '',
  exposureFlag: null,
  measTemperature: '',
  measHumidity: '',
  measMethod: '',
  remark: '',
  regUserId: '',
  chgUserId: ''
})

/******************************
 * @Computed_선언
 *******************************/
const measureResult = computed(() =>
  (workMeasure.value.twaCurr || workMeasure.value.measValue) && workMeasure.value.exposureStandard
    ? Number(workMeasure.value.twaCurr || workMeasure.value.measValue) >
      Number(workMeasure.value.exposureStandard)
      ? $language('초과')
      : $language('미만')
    : $language('평가불가')
)

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
  detailUrl.value = selectConfig.sai.workmeas.result.get.url
  saveUrl.value = transactionConfig.sai.workmeas.result.insert.url
  // code setting
  if (props.popupParam.workMeasurementPlanId) {
    workMeasure.value.workMeasurementPlanId = props.popupParam.workMeasurementPlanId
  }
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 유해인자별 작업환경측정결과 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam?.workMeasurementResultId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.workMeasurementResultId),
      method: 'GET'
    }).then((_result: any) => {
      workMeasure.value = _result.data
      if (workMeasure.value.hazardCd === 'C000000196') workMeasure.value.exposureStandard = 80
      if (_result.data.measStartTime && _result.data.measEndTime) {
        measTime.value = [_result.data.measStartTime, _result.data.measEndTime]
      }
    })
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = props.popupParam.workMeasurementResultId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          workMeasure.value.regUserId = user.value.userId
          workMeasure.value.chgUserId = user.value.userId
          if (measTime.value && measTime.value.length > 0) {
            workMeasure.value.measStartTime = measTime.value[0]
            workMeasure.value.measEndTime = measTime.value[1]
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
  props.popupParam.workMeasurementResultId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 유해인자명 팝업에서 가져오기
 *******************************/
function searchPop() {
  popupOptions.value = getPopupOptions('hazardFactor', popupOptions.value, closeHazardPopup, {
    type: 'single',
    searchParam: {
      hazardClassFstCd: props.popupParam.hazardClassFstCd,
      workEnvFlag: 'Y'
    }
  })
}
function closeHazardPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    workMeasure.value.hazardCd = data[0].hazardCd
    workMeasure.value.chemName = data[0].chemName
    workMeasure.value.casNo = data[0].casNo
    workMeasure.value.hazardName = data[0].hazardClassSecName + '/' + data[0].hazardName
  }
}
/******************************
 * TODO (목적): 유해인자명 삭제
 *******************************/
function removeHazard() {
  workMeasure.value.hazardCd = ''
  workMeasure.value.hazardName = ''
}
</script>

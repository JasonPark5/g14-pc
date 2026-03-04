<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="!disabled"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="accidentInfo"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveAccident"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            required
            :editable="editable"
            :disabled="disabled"
            label="사고명"
            name="accidentName"
            v-model:value="accidentInfo.accidentName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :editable="editable"
            :disabled="true"
            label="사고번호"
            name="accidentNo"
            v-model:value="accidentInfo.accidentNo"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-multi-select
            required
            codeGroupCd="IIM_KIND_CD"
            :editable="editable"
            :disabled="disabled"
            :isArray="false"
            itemText="codeName"
            itemValue="code"
            maxValues="3"
            name="accidentKindCd"
            label="사고종류"
            v-model:value="accidentInfo.accidentKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            required
            :editable="editable"
            type="datetime"
            :disabled="disabled"
            :minuteStep="10"
            label="발생일시"
            name="occurrenceDate"
            v-model:value="accidentInfo.occurrenceDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :required="true"
            :editable="editable"
            :customPopupParam="{ targetKey: 'process' }"
            label="공정"
            name="processCd"
            v-model:value="accidentInfo.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            required
            :editable="editable"
            :disabled="disabled"
            label="발생장소"
            name="occurrenceLocation"
            v-model:value="accidentInfo.occurrenceLocation"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field
            required
            :editable="editable"
            :disabled="disabled"
            :data="accidentInfo"
            label="보고자"
            type="dept_user"
            name="reportUserId"
            v-model:value="accidentInfo.reportUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            required
            :editable="editable"
            :disabled="disabled"
            type="datetime"
            label="보고일시"
            :minuteStep="10"
            name="reportDate"
            v-model:value="accidentInfo.reportDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            required
            :editable="editable"
            :disabled="disabled"
            type="edit"
            codeGroupCd="IIM_GRADE_CD"
            itemText="codeName"
            itemValue="code"
            name="accidentGradeCd"
            label="사고등급"
            v-model:value="accidentInfo.accidentGradeCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            :required="true"
            :disabled="disabled"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="accidentInfo.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            :required="true"
            :editable="editable"
            :disabled="disabled"
            label="발생부서"
            name="occurrenceDeptCd"
            v-model:value="accidentInfo.occurrenceDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-radio
            :editable="editable"
            :disabled="disabled"
            :comboItems="weatherItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="weather"
            label="날씨"
            v-model:value="accidentInfo.weather"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :rows="8"
            label="긴급조치사항"
            name="emergencyMeasures"
            v-model:value="accidentInfo.emergencyMeasures"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :isCheck="true"
            :rows="8"
            label="사고사항개요"
            name="overviewAccidentSituation"
            v-model:value="accidentInfo.overviewAccidentSituation"
            @checkboxClick="checkboxClick"
          />
        </div>
      </template>
    </c-card>
    <!-- <c-card title="발생형태" class="cardClassDetailForm" bgClass="">
      <template slot="card-detail">
      </template>
    </c-card> -->
    <c-card title="사고원인" class="cardClassDetailForm" bgClass="">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :comboItems="occFirstItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="occurrenceModeLargeCd"
            label="대분류"
            v-model:value="accidentInfo.occurrenceModeLargeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :comboItems="occSecItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="occurrenceModeSmallCd"
            label="중분류"
            v-model:value="accidentInfo.occurrenceModeSmallCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-radio
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :comboItems="humanDamageItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="humanDamage"
            label="인적피해여부"
            v-model:value="accidentInfo.humanDamage"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="직접원인"
            name="directCause"
            v-model:value="accidentInfo.directCause"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="간접원인"
            name="indirectCause"
            v-model:value="accidentInfo.indirectCause"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="기인물"
            name="openning"
            v-model:value="accidentInfo.openning"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="가해물"
            name="injurious"
            v-model:value="accidentInfo.injurious"
          />
        </div>
      </template>
    </c-card>
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentPopupParamType, processAccidentType } from '../processAccident'

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
  name: 'processAccidentRegisterInfo'
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
const emits = defineEmits(['setReportTab', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: processAccidentPopupParamType
  accidentInfo: processAccidentType
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
      iimAccidentId: '',
      count: 0
    }
  },
  accidentInfo: () => {
    return {
      iimAccidentId: '',
      accidentTypeCd: '',
      plantCd: '',
      processCd: '',
      processName: '',
      accidentNo: '',
      accidentName: '',
      accidentStatusCd: '',
      reportUserId: '',
      reportDate: '',
      accidentKindCd: '',
      accidentGradeCd: null,
      occurrenceDate: '',
      occurrenceDeptCd: '',
      occurrenceLocation: '',
      weather: '',
      emergencyMeasures: '',
      overviewAccidentSituation: '',
      occurrenceModeLargeCd: null,
      occurrenceModeSmallCd: null,
      humanDamage: '',
      directCause: '',
      indirectCause: '',
      openning: '',
      injurious: '',
      materialDamageHistory: '',
      humanDamageHistory: '',
      toxicFlag: 'N',
      accidentVictimModelList: [], // 관련 사고자
      deleteAccidentVictimModelList: [], // 사고자 삭제 모델
      accidentMaterialModelList: [], // 관련설비 및 물질
      emergencyList: [], // 비상조치계획서
      damageClassCd: null,
      woundCd: null
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
const occFirstItems = ref<codeMasterType>([])
const occSecItems = ref<codeMasterType>([])
const weatherItems = ref<codeMasterType>([])
const humanDamageItems = ref<codeMasterType>([])
const saveUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const occurFormUrl = ref('')
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    editable.value &&
    Boolean(props.accidentInfo.accidentStatusCd) &&
    props.accidentInfo.accidentStatusCd === 'ISPC000005'
)
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.accidentInfo.occurrenceModeLargeCd,
  () => {
    setSecondItems()
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
  saveUrl.value = transactionConfig.sop.iim.accident.process.insert.url
  insertUrl.value = transactionConfig.sop.iim.accident.process.insert.url
  updateUrl.value = transactionConfig.sop.iim.accident.process.update.url
  deleteUrl.value = transactionConfig.sop.iim.accident.process.delete.url
  occurFormUrl.value = selectConfig.sop.iim.occurForm.list.url
  // code setting
  weatherItems.value = [
    { code: 'WC000001', codeName: $language('맑음') },
    { code: 'WC000002', codeName: $language('흐림') },
    { code: 'WC000003', codeName: $language('비') },
    { code: 'WC000004', codeName: $language('눈') }
  ]
  humanDamageItems.value = [
    { code: 'Y', codeName: $language('해당') },
    { code: 'N', codeName: $language('비해당') }
  ]
  // list setting
  setFirstItems()
}
/******************************
 * TODO (목적): 대분류 조회
 *******************************/
function setFirstItems() {
  $http({
    url: occurFormUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      occurLevel: '1'
    }
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      occFirstItems.value.splice(0, 0, {
        code: _item.iimOccurMasterId,
        codeName: _item.occurName
      })
    })
  })
}
/******************************
 * TODO (목적): 중분류 조회
 *******************************/
function setSecondItems() {
  if (props.accidentInfo.occurrenceModeLargeCd) {
    $http({
      url: occurFormUrl.value,
      method: 'GET',
      params: {
        iimUpOccurMasterId: props.accidentInfo.occurrenceModeLargeCd,
        useFlag: 'Y',
        occurLevel: '2'
      }
    }).then((_result: any) => {
      occSecItems.value = _.map(_result.data, (item) => {
        return {
          code: item.iimOccurMasterId,
          codeName: item.occurName
        }
      })
      if (
        _.findIndex(occSecItems.value, { code: props.accidentInfo.occurrenceModeSmallCd }) === -1
      ) {
        props.accidentInfo.occurrenceModeSmallCd = null
      }
    })
  } else {
    occSecItems.value = []
    props.accidentInfo.occurrenceModeSmallCd = null
  }
}
/******************************
 * TODO (목적): 사고 보고서 기본정보 저장
 *******************************/
function saveAccident() {
  if (props.popupParam.iimAccidentId) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
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
          if (!props.popupParam.iimAccidentId) props.accidentInfo.accidentStatusCd = 'ISPC000001'
          _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
            if (_item.expectTreatmentDate)
              _item.expectTreatmentDate = _item.expectTreatmentDate.join()
          })
          props.accidentInfo.regUserId = user.value.userId
          props.accidentInfo.chgUserId = user.value.userId
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
 * TODO (목적): 사고 보고서 기본정보 저장 콜백
 *******************************/
function saveCallback(result: any) {
  props.popupParam.iimAccidentId = result.data
  if (!props.popupParam.iimAccidentId) {
    emits('setReportTab', result.data)
  }
  message.requestSuccess()
  emits('getDetail', result.data)
}
/******************************
 * TODO (목적): 육하원칙 기본정보
 *******************************/
function checkboxClick(checkValue: string) {
  if (checkValue === 'O') {
    props.accidentInfo.overviewAccidentSituation =
      '- ' +
      '누가 : \n' + // 누가
      '- ' +
      '누구에게 : \n' + // 누구에게
      '- ' +
      '언제 : \n' + // 언제
      '- ' +
      '어디서 : \n' + // 어디서
      '- ' +
      '무엇을 : \n' + // 무엇을
      '- ' +
      '어떻게 : \n' + // 어떻게
      '- ' +
      '왜 : '
  } else {
    props.accidentInfo.overviewAccidentSituation = ''
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

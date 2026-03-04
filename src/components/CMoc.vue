<template>
  <div class="fix-height">
    <q-field
      ref="customField"
      class="customUserField"
      stack-label
      no-error-icon
      color="orange-custom"
      :rules="[validRule]"
      :validMessage="validMessage"
      :label="$language(label)"
      :disable="disabled || !editable"
      v-model="valueText"
    >
      <template v-slot:label v-if="label">
        <div class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
        </div>
      </template>
      <template v-slot:control>
        <span @click.stop="search" class="cursor-pointer">{{ valueText }}</span>
      </template>
      <template v-slot:append>
        <q-icon v-if="!disabled && editable" name="search" @click="search" class="cursor-pointer" />
        <q-icon v-if="!disabled && editable" name="close" @click="reset" class="cursor-pointer" />
      </template>
    </q-field>
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
import { propType, mocType } from '../views/sop/moc/moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CMoc'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['name', 'update:value', 'dataChange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: 'moc',
  value: '',
  label: '',
  editable: true,
  required: false,
  disabled: false,
  dense: true,
  plantCd: '',
  isSubmit: '',
  document: null,
  documentId: '',
  documentTitle: '',
  mocRelatedTaskCd: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const moc = ref<mocType>({
  sopMocId: '', // MOC 일련번호
  mocNo: '', // moc 관리번호
  plantCd: '', // 사업장 코드
  initiativeUserId: '', // 발의자 ID
  initiativeUserName: '', // 발의자 명
  initiativeDeptCd: '', // 발의 부서 코드
  initiativeDeptName: '', // 발의 부서명
  mocTitle: '', // 변경관리 제목
  mocSummary: '', // 변경 개요
  mocTypeCd: '', // 변경구분_공통코드(정상/비상/임시)
  mocTypeName: '', // 변경구분명(정상/비상/임시)
  mocWriteLevelCd: null, // 변경등급_작성
  mocConfirmLevelCd: null, // 변경등급_검토
  processSatefySecureMeasures: '', // 공정안전 확보 대책
  technicalBasisProcessDesign: '', // 변경계획에 대한 공정 및 설계의 기술근거
  safetyReliabilityImprovementEffect: '', // 안전성에 필요한 사항 및 신뢰성 향상 효과
  leaderOpinion: '', // 팀장의견
  relatedLaws: '', // 관련 볍령_텍스트
  processRiskAssessFlag: '', // 공정위험성 평가 여부
  jobRiskAssessFlag: '', // 작업위헝성 평가 여부
  mocPeriod: [],
  mocStartDate: '', // 변경 시작일
  mocEndDate: '', // 변경 종료일
  mocStepCd: '', // 변경관리 단계
  mocActionDeptCd: '', // 변경실행 부서코드
  mocActionResponsibilityUserId: '', // 변경실행 책임자 ID
  mocCompleteCheckUserId: '', // 변경완료 확인자 ID
  mocCompleteCheckDeptCd: '', // 변경완료 확인 부서 코드
  mocCompleteOpinion: '', // 변경완료 의견
  mocBenefitCds: '', // 변경관리 기대효과_복수
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})
const valueText = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const customField = ref<any>(null)
const setEvent = ref(false)
const detailUrl = ref('')
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.value,
  () => {
    getDetail()
  },
  { deep: true }
)
watch(
  () => props.disabled,
  () => {
    if (!setEvent.value && !props.disabled) {
      setEvent.value = true
      customField.value.$el
        .getElementsByClassName('q-field__native')[0]
        .addEventListener('click', openDetail)
    }
  },
  { deep: true }
)
watch(
  () => props.isSubmit,
  () => {
    saveRelatedWork()
  },
  { deep: true }
)
/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})
onMounted(() => {
  if (!props.disabled) {
    setEvent.value = true
    customField.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', search)
  }
})
onBeforeUnmount(() => {
  if (!props.disabled) {
    customField.value.$el
      .getElementsByClassName('q-field__native')[0]
      .removeEventListener('click', search)
  }
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
  // url setting
  detailUrl.value = selectConfig.sop.moc.change.get.url
  saveUrl.value = transactionConfig.sop.moc.relatedWorkDocument.save.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): MOC 상세정보
 *******************************/
function getDetail() {
  if (props.value) {
    $http({
      url: $format(detailUrl.value, props.value),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(moc.value, _result.data)
      // 변경 타입 / 관리번호
      if (props.value && moc.value) {
        valueText.value =
          moc.value.mocTitle + ' / ' + moc.value.mocTypeName + ' / ' + moc.value.mocNo
      }
    })
  } else {
    reset()
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  valueText.value = ''
  emits('update:value', '')
  emits('name', '')
  emits('dataChange', '')
}
/******************************
 * TODO (목적): 유효성 검증
 * @param (1): 값
 * @return (반환): true: 통과, 그 외 : 통과X
 *******************************/
function validRule(val: any) {
  let validCheck = true
  if (props.required) {
    validCheck = Boolean(val) && val.length > 0
  }

  if (validCheck && props.error) {
    validCheck = props.error(val)
  }
  return validCheck
}
function search() {
  popupOptions.value = getPopupOptions('moc', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: 'single',
    mocRelatedTaskCd: props.mocRelatedTaskCd
  })
}
function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    moc.value = data[0]
    valueText.value = data[0].mocTitle + ' / ' + data[0].mocTypeName + ' / ' + data[0].mocNo
    emits('update:value', data[0].sopMocId)
    emits('name', valueText.value)
    emits('dataChange', data[0].sopMocId)
  }
}
function openDetail() {
  if (props.value && moc.value) {
    popupOptions.value.title = 'MOC 상세'
    popupOptions.value.param = {
      sopMocId: props.value,
      mocTypeCd: moc.value.mocTypeCd,
      mocStepCd: moc.value.mocStepCd
    }
    // popupOptions.value.target = () => import(`${'@/pages/sop/moc/mocDetail.vue'}`)
    popupOptions.value.isFull = true
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeDetailPopup
  }
}
function closeDetailPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function saveRelatedWork() {
  $http({
    url: saveUrl.value,
    method: 'PUT',
    data: {
      sopChangeRelatedWorkDocumentId: '', // 관련업무 일련번호
      sopChangeRelatedWorkId: '', // 관련업무 일련번호
      documentId: props.documentId, // 문서 일련번호
      documentTitle: props.document[props.documentTitle], // 문서 제목
      documentRegUserId: '', // 등록자
      documentRegDt: props.document.regDt ? props.document.regDt : getToday(), // 등록일
      sopMocId: props.value,
      mocRelatedTaskCd: props.mocRelatedTaskCd
    }
  }).then((_result: any) => {})
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

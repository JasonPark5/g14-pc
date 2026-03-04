<template>
  <c-step
    stepperGrpCd="SELF_INSPECTION_RESULT"
    :currentStepCd="currentStatusCd"
    :param="popupParam"
    v-model:value="selfInspectionStatusCd"
    @currentStep="currentStep"
    @closePopup="closePopup"
    @stepClick="stepClick"
  />
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
  name: 'complianceDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
    count?: numberNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    selfInspectionResultId: '',
    selfInspectionStatusCd: '',
    sysRevision: '',
    count: 0
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const selfInspectionStatusCd = ref('') // 초기 스텝 값을 설정
const currentStatusCd = ref('')

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
 * TODO (목적): 초기 스테퍼 세팅
 *******************************/
function init() {
  if (
    !props.popupParam.selfInspectionStatusCd ||
    props.popupParam.selfInspectionStatusCd === 'SISC000001'
  ) {
    // 등록시 또는 계획중
    selfInspectionStatusCd.value = 'SIR0000001'
    currentStatusCd.value = 'SIR0000001'
  } else if (props.popupParam.selfInspectionStatusCd === 'SISC000002') {
    // 계획완료
    selfInspectionStatusCd.value = 'SIR0000002'
    currentStatusCd.value = 'SIR0000003'
  } else if (props.popupParam.selfInspectionStatusCd === 'SISC000003') {
    // 결재중
    selfInspectionStatusCd.value = 'SIR0000002'
    currentStatusCd.value = 'SIR0000003'
  } else if (props.popupParam.selfInspectionStatusCd === 'SISC000004') {
    // 감사완료
    selfInspectionStatusCd.value = 'SIR0000004'
    currentStatusCd.value = 'SIR0000004'
  }
}

/******************************
 * TODO (목적): 스텝 클릭시
 *******************************/
function stepClick() {
  props.popupParam.count++
}

/******************************
 * TODO (목적): 현재 스텝 설정
 *******************************/
function currentStep(step: stringNull) {
  if (!step || step === 'SISC000001') {
    selfInspectionStatusCd.value = 'SIR0000001'
    currentStatusCd.value = 'SIR0000001'
  } else if (step === 'SISC000002') {
    selfInspectionStatusCd.value = 'SIR0000002'
    currentStatusCd.value = 'SIR0000003'
  } else if (step === 'SISC000003') {
    selfInspectionStatusCd.value = 'SIR0000002'
    currentStatusCd.value = 'SIR0000003'
  } else {
    selfInspectionStatusCd.value = 'SIR0000004'
    currentStatusCd.value = 'SIR0000004'
  }
  props.popupParam.selfInspectionStatusCd = step
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

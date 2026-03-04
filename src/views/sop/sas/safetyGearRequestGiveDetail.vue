<template>
  <c-step
    stepperGrpCd="SAS_SAFETY_GEAR_STEP_CD"
    :stepRejectItems="stepRejectItems"
    :currentStepCd="currentStepCd"
    :param="popupParam"
    v-model:value="stepCd"
    @currentStep="currentStep"
    @closePopup="closePopup"
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
  name: 'safetyGearRequestGiveDetail'
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
    isRequest?: stringNull
    requestGiveInfoId?: stringNull
    stepCd?: stringNull
    plantCd?: stringNull
    giveTypeCd?: stringNull
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
    isRequest: 'Y',
    requestGiveInfoId: '',
    stepCd: '',
    plantCd: null,
    giveTypeCd: ''
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const stepCd = ref('') // 초기 스텝 값을 설정
const currentStepCd = ref('')
const stepRejectItems = ref<Array<stringNull>>([])

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
  if (!props.popupParam.stepCd || props.popupParam.stepCd === 'SSC0000001') {
    stepCd.value = 'SSG0000001'
    currentStepCd.value = 'SSG0000001'
  } else if (
    props.popupParam.stepCd === 'SSC0000005' ||
    props.popupParam.stepCd === 'SSC0000010' ||
    props.popupParam.stepCd === 'SSC0000015'
  ) {
    stepCd.value = 'SSG0000010'
    currentStepCd.value = 'SSG0000010'
  }
  stepRejectItems.value = []
  if (props.popupParam.isRequest == 'N') stepRejectItems.value = ['SSG0000001']
}
/******************************
 * TODO (목적): 현재 스텝 설정
 *******************************/
function currentStep(step: stringNull) {
  if (!step || step === 'SSC0000001') {
    stepCd.value = 'SSG0000001'
    currentStepCd.value = 'SSG0000001'
  } else if (step === 'SSC0000005' || step === 'SSC0000010' || step === 'SSC0000015') {
    stepCd.value = 'SSG0000010'
    currentStepCd.value = 'SSG0000010'
  }
  props.popupParam.stepCd = step
}
function closePopup() {
  emits('closePopup')
}
</script>

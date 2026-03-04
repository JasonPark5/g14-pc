<template>
  <c-step
    stepperGrpCd="LICENSE_REQUEST_STEP_CD"
    :param="param"
    :currentStepCd="stepCd"
    v-model:value="stepCd"
    @currentStep="currentStep"
    @setId="setId"
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
  name: 'licenseRequestStep'
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
    stepCd: stringNull
    limLicenseRequestId: stringNull
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
    stepCd: '',
    limLicenseRequestId: ''
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const stepCd = ref(props.popupParam.stepCd || 'LRSC000001') // 초기 스텝 값을 설정

/******************************
 * @Computed_선언
 *******************************/
const param = computed(() => ({
  limLicenseRequestId: props.popupParam.limLicenseRequestId
}))

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
    !props.popupParam.stepCd ||
    props.popupParam.stepCd === 'RSC0000001' ||
    props.popupParam.stepCd === 'RSC0999999'
  ) {
    stepCd.value = 'LRSC000001'
  } else stepCd.value = 'LRSC000002'
}

/******************************
 * TODO (목적): 키 아이디 세팅
 *******************************/
function setId(id: stringNull) {
  props.popupParam.limLicenseRequestId = id
}

/******************************
 * TODO (목적): 현재 스텝 설정
 *******************************/
function currentStep(step: stringNull) {
  props.popupParam.stepCd = step
  init()
}
function closePopup() {
  emits('closePopup')
}
</script>

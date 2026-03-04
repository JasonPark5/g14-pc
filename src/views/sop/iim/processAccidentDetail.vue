<template>
  <c-step
    stepperGrpCd="IIM_ACCIDENT_STEP_CD"
    :currentStepCd="currentStepCd"
    :param="popupParam"
    :stepSize="stepSize"
    v-model:value="stepCd"
    @currentStep="currentStep"
    @setReportTab="setReportTab"
    @closePopup="closePopup"
    @stepClick="stepClick"
  />
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentPopupParamType } from './processAccident'

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
  name: 'processAccidentDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setReportTab', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: processAccidentPopupParamType
  stepSize: numberNull
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
      iimAccidentId: '',
      stepCd: '',
      count: 0
    }
  },
  stepSize: 0
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const stepCd = ref('')
const currentStepCd = ref('')

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
  // code setting
  // list setting
  setStep()
}
/******************************
 * TODO (목적): 스탭 변경
 *******************************/
function setStep() {
  if (!props.popupParam.stepCd || props.popupParam.stepCd === 'ISPC000001') {
    stepCd.value = 'IASC000001'
    currentStepCd.value = 'IASC000001'
  } else if (props.popupParam.stepCd === 'ISPC000002') {
    stepCd.value = 'IASC000005'
    currentStepCd.value = 'IASC000010'
  } else if (props.popupParam.stepCd === 'ISPC000003') {
    stepCd.value = 'IASC000005'
    currentStepCd.value = 'IASC000010'
  } else if (props.popupParam.stepCd === 'ISPC000004') {
    stepCd.value = 'IASC000010'
    currentStepCd.value = 'IASC000010'
  } else {
    stepCd.value = 'IASC000015'
    currentStepCd.value = 'IASC000015'
  }
}
/******************************
 * TODO (목적): 현재 스탭
 *******************************/
function currentStep(step: string) {
  if (!step || step === 'ISPC000001') {
    stepCd.value = 'IASC000001'
    currentStepCd.value = 'IASC000001'
  } else if (step === 'ISPC000002') {
    stepCd.value = 'IASC000005'
    currentStepCd.value = 'IASC000010'
  } else if (step === 'ISPC000003') {
    stepCd.value = 'IASC000005'
    currentStepCd.value = 'IASC000010'
  } else if (step === 'ISPC000004') {
    stepCd.value = 'IASC000010'
    currentStepCd.value = 'IASC000010'
  } else {
    stepCd.value = 'IASC000015'
    currentStepCd.value = 'IASC000015'
  }
  props.popupParam.stepCd = step
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * TODO (목적): 스탭 클릭
 *******************************/
function stepClick() {
  props.popupParam.count!++
}
/******************************
 * TODO (목적): 사고보고서 탭 변경
 *******************************/
function setReportTab(data: any) {
  emits('setReportTab', data)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

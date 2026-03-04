<template>
  <c-step
    stepperGrpCd="EDU_STEP_CD"
    :currentStepCd="popupParam.stepCd"
    :param="param"
    v-model:value="popupParam.stepCd"
    @closePopup="closePopup"
    @currentStep="currentStep"
    @setRegInfo="setRegInfo"
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
  name: 'educationResultDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: EduResultPopupParamType
}

interface EduResultPopupParamType {
  plantCd: stringNull
  eduEducationId: stringNull
  eduCourseId: stringNull
  stepCd: stringNull
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
      plantCd: null,
      eduEducationId: '',
      eduCourseId: '',
      stepCd: ''
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
const searchResult = ref({
  flag: '',
  isSearch: false
})
const planUpdateBtnData = ref({
  title: '계획',
  flag: false,
  research: '',
  planResearch: ''
})

/******************************
 * @Computed_선언
 *******************************/
const param = computed(() => {
  return {
    plantCd: props.popupParam.plantCd,
    eduEducationId: props.popupParam.eduEducationId,
    eduCourseId: props.popupParam.eduCourseId,
    stepCd: props.popupParam.stepCd,
    searchResult: {
      flag: searchResult.value.flag,
      isSearch: searchResult.value.isSearch
    },
    planUpdateBtnData: planUpdateBtnData.value
  }
})
/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 현재 step
 *******************************/
function currentStep(data: any) {
  props.popupParam.stepCd = data.step
  props.popupParam.eduEducationId = data.key
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * TODO (목적): ??
 *******************************/
function setRegInfo(data: any) {
  emits('setRegInfo', data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <c-step
    stepperGrpCd="HEA_JOBSTRESS_STEP_CD"
    :currentStepCd="popupParam.stepCd"
    :param="param"
    v-model:value="stepCdStep"
    @closePopup="closePopup"
    @currentStep="currentStep"
    @keySetting="keySetting"
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
  name: 'jobStressDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaJobStressPlanId: stringNull
    stepCd?: stringNull
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
  popupParam: () => {
    return {
      heaJobStressPlanId: '',
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
const editable = ref(true)
const stepCdStep = ref('')
const searchProcess = ref<any>({
  flag: '', // 재조회가 필요한 파일(API가 포함된 곳)에서 watch를 반응하게 하는 용도
  isSearch: false // 저장/삭제 등 버튼의 이벤트가 일어날 때 true
})
/******************************
 * @Computed_선언
 *******************************/
const param = computed(() => {
  return {
    heaJobStressPlanId: props.popupParam.heaJobStressPlanId,
    stepCd: props.popupParam.stepCd,
    searchProcess: {
      flag: searchProcess.value.flag,
      isSearch: searchProcess.value.isSearch
    } as any
  }
})
/******************************
 * @Watch_선언
 *******************************/
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.popupParam.stepCd,
  () => {
    setStep()
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
 * TODO (목적): 현재 step
 *******************************/
/******************************
 * TODO (목적): Stepper 셋업
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
function setStep() {
  stepCdStep.value = _.clone(props.popupParam.stepCd)
}
function currentStep(data: any) {
  props.popupParam.stepCd = data.stepCd
  props.popupParam.heaJobStressPlanId = data.heaJobStressPlanId
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * TODO (목적): 키 세팅
 *******************************/
function keySetting(_data: any) {
  props.popupParam.heaJobStressPlanId = _data
}
function stepClick() {
  if (param.value.searchProcess.isSearch) {
    searchProcess.value.flag = uid()
    searchProcess.value.isSearch = false
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

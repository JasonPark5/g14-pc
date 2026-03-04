<template>
  <c-step
    stepperGrpCd="RAM_RISK_STEP_CD"
    :currentStepCd="popupParam.ramStepCd"
    :param="param"
    v-model:value="ramStepCdStep"
    @stepBystep="stepBystep"
    @keySetting="keySetting"
    @research="research"
    @stepClick="stepClick"
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
  name: 'riskDetail'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    vendorFlag: boolean
    isNew: stringNull
    ramTechniqueCd: stringNull
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
    ramRiskAssessmentPlanId: '',
    ramStepCd: '',
    vendorFlag: false,
    isNew: null,
    ramTechniqueCd: ''
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const ramStepCdStep = ref('')
const searchRiskReduce = ref<any>({
  flag: '',
  isSearch: false
})
const searchScenario = ref<any>({
  flag: '',
  isSearch: false
})
const planUpdateBtnData = ref<any>({
  title: '계획',
  flag: false,
  research: '',
  planResearch: ''
})

/******************************
 * @Computed_선언
 *******************************/
const param = computed(() => ({
  ramRiskAssessmentPlanId: props.popupParam.ramRiskAssessmentPlanId,
  ramStepCd: props.popupParam.ramStepCd,
  vendorFlag: props.popupParam.vendorFlag,
  ramTechniqueCd: props.popupParam.ramTechniqueCd,
  isNew: props.popupParam.isNew,
  searchRiskReduce: {
    flag: searchRiskReduce.value.flag,
    isSearch: searchRiskReduce.value.isSearch
  } as any,
  searchScenario: {
    flag: searchScenario.value.flag,
    isSearch: searchScenario.value.isSearch
  } as any,
  planUpdateBtnData: planUpdateBtnData.value as any
}))

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.popupParam.ramStepCd,
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
 * TODO (목적): Stepper 셋업
 *******************************/
function setStep() {
  /**
   * RRS0000005 RRS0000010 단계는 같은 단계로 취급
   * RRS0000005으로 데이터가 저장되지 않고 RRS0000010으로 저장
   * RRS0000010인 경우 팝업에서는 '평가실행'으로 표시되도록 RRS0000005으로 셋팅
   *  */
  if (props.popupParam.ramStepCd === 'RRS0000010') {
    ramStepCdStep.value = 'RRS0000005'
  } else {
    ramStepCdStep.value = _.clone(props.popupParam.ramStepCd)
  }
}
/******************************
 * TODO (목적): 스텝 이동
 *******************************/
function stepBystep(_stepCd: any) {
  props.popupParam.ramStepCd = _stepCd
}

/******************************
 * TODO (목적): 키 세팅
 *******************************/
function keySetting(_key: any) {
  props.popupParam.ramRiskAssessmentPlanId = _key
}
/******************************
 * TODO (목적): 재조회
 *******************************/
function research(_data: any) {
  if (_data.place === 'scenario') {
    searchRiskReduce.value.isSearch = true
  } else {
    searchScenario.value.isSearch = true
  }
}

/******************************
 * TODO (목적): 스텝 클릭 시 이벤트
 *******************************/
function stepClick(_step: any) {
  if (searchRiskReduce.value.isSearch) {
    searchRiskReduce.value.flag = uid()
    searchRiskReduce.value.isSearch = false
  } else if (searchScenario.value.isSearch) {
    searchScenario.value.flag = uid()
    searchScenario.value.isSearch = false
  }
}

/******************************
 * TODO (목적): 팝업닫기
 *******************************/
function closePopup() {
  emits('closePopup')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

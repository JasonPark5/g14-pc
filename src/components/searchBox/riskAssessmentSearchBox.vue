<template>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      codeGroupCd="RAM_TECHNIQUE_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="ramTechniqueCd"
      label="위험성평가 분류"
      v-model:value="searchParam.ramTechniqueCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-datepicker
      :range="true"
      defaultStart="-6M"
      defaultEnd="6M"
      label="평가기간"
      name="assessmentDates"
      v-model:value="searchParam.assessmentDates"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      codeGroupCd="RAM_ASSESS_TYPE_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="ramAssessTypeCd"
      label="평가구분-정기/수시/최초"
      v-model:value="searchParam.ramAssessTypeCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      stepperGrpCd="RAM_KPSR_STEP_CD"
      type="search"
      itemText="stepperMstNm"
      itemValue="stepperMstCd"
      name="ramStepCd"
      label="진행단계"
      v-model:value="searchParam.ramStepCd"
    />
  </div>
</template>

<script setup lang="ts">
/**
 *  1. defineOptions 수정
 *  2. popupParam 수정
 *  3. init 커스텀
 *  4. defineExpose 지우면 안됨.
 */

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
  name: 'riskAssessmentSearchBox'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  propsSearchParam: PopupParamType
}
type PopupParamType = {
  plantCd?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  propsSearchParam: () => {
    return {
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
const searchParam = ref({
  plantCd: null,
  assessmentDates: [],
  ramAssessTypeCd: null,
  ramTechniqueCd: null,
  ramStepCd: null
})

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
  // url setting
  // code setting
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-datepicker
      :range="true"
      defaultStart="-6M"
      defaultEnd="7d"
      label="작업기간"
      name="permitDates"
      v-model:value="searchParam.permitDates"
    />
  </div>
  <div
    v-if="!props.propsSearchParam.swpWorkPermitTypeCd"
    class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
  >
    <c-select
      type="search"
      codeGroupCd="SWP_WORK_PERMIT_TYPE_CD"
      itemText="codeName"
      itemValue="code"
      name="swpWorkPermitTypeCd"
      label="허가서구분"
      v-model:value="searchParam.swpWorkPermitTypeCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      type="search"
      codeGroupCd="SWP_SUPPLEMENT_WORK_TYPE_CD"
      itemText="codeName"
      itemValue="code"
      name="swpSupplementWorkTypeCd"
      label="보조작업"
      v-model:value="searchParam.swpSupplementWorkTypeCd"
    />
  </div>
</template>

<script setup lang="ts">
/**
 *  1. defineOptions 수정
 *  2. props.propsSearchParam 수정
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
  name: 'workPermitSearchBox'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  propsSearchParam: workPermitSearchParamType
}
interface workPermitSearchParamType {
  plantCd?: stringNull
  swpWorkPermitTypeCd?: stringNull
  regUserId?: stringNull
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
      plantCd: '',
      swpWorkPermitTypeCd: '',
      regUserId: ''
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
  permitDates: [],
  applicationDeptCd: null,
  issuedDeptCd: null,
  swpWorkPermitTypeCd: null,
  swpSupplementWorkTypeCd: null,
  swpStepCd: null,
  regUserId: ''
})
const editable = ref(true)

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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  // code setting
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
  if (props.propsSearchParam.swpWorkPermitTypeCd) {
    searchParam.value.swpWorkPermitTypeCd = props.propsSearchParam.swpWorkPermitTypeCd
  }
  if (props.propsSearchParam.regUserId) {
    searchParam.value.regUserId = props.propsSearchParam.regUserId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

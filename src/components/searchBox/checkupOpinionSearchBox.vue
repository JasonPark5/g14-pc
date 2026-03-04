<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-datepicker
      label="검진년도"
      default="today"
      type="year"
      name="year"
      v-model:value="searchParam.year"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-dept
      type="search"
      :isFirstValue="false"
      label="부서"
      name="deptCd"
      v-model:value="searchParam.deptCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-field label="대상자" name="userId" v-model:value="searchParam.userId" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkupOpinionSearchBox'
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
  propsSearchParam: {
    deptCd?: stringNull
    userId?: stringNull
    year?: stringNull
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
  propsSearchParam: () => {
    return {
      deptCd: null,
      userId: '',
      year: ''
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
  suspectFlag: 'Y',
  deptCd: null,
  userId: '',
  year: ''
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
  if (props.propsSearchParam.deptCd) searchParam.value.deptCd = props.propsSearchParam.deptCd
  if (props.propsSearchParam.userId) searchParam.value.userId = props.propsSearchParam.userId
  if (props.propsSearchParam.year) searchParam.value.year = props.propsSearchParam.year
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

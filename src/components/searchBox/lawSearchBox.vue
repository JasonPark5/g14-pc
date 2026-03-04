<template>
  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
    <c-select
      codeGroupCd="LAW_ID"
      type="search"
      itemText="codeName"
      itemValue="code"
      label="법령"
      name="lawId"
      v-model:value="searchParam.lawId"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-datepicker
      :range="true"
      defaultStart="-2y"
      defaultEnd="2M"
      label="공포기간"
      name="promulgationPeriod"
      v-model:value="searchParam.promulgationPeriod"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      :comboItems="[
        { code: 'Y', codeName: $language('검토') },
        { code: 'N', codeName: $language('미검토') }
      ]"
      type="search"
      itemText="codeName"
      itemValue="code"
      label="법령검토여부"
      name="lawCheck"
      v-model:value="searchParam.lawCheck"
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
  name: 'lawSearchBox'
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

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref({
  promulgationPeriod: [],
  lawId: '',
  lawCheck: ''
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
function init() {}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

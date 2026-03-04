<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-datepicker
      name="measYear"
      type="year"
      defaultStart="-3y"
      defaultEnd="0y"
      :range="true"
      label="측정년도"
      v-model:value="year"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      codeGroupCd="WORK_MEAS_QUARTER_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="measQuarter"
      label="분기"
      v-model:value="searchParam.measQuarter"
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
  name: 'workMeasureSearchBox'
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
    plantCd?: stringNull
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
      plantCd: ''
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
  measQuarter: null,
  measYear: '',
  startYmd: '',
  endYmd: '',
  measCompleteFlag: 'Y'
})
const year = ref<Array<string>>([])

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
  // url setting
  // code setting
  if (year.value!.length > 0) {
    searchParam.value.startYmd = year.value![0]
    searchParam.value.endYmd = year.value![1]
  }
  if (props.propsSearchParam.plantCd) searchParam.value.plantCd = props.propsSearchParam.plantCd
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

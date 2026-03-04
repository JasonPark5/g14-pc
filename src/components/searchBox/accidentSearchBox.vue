<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      type="search"
      codeGroupCd="IIM_GRADE_CD"
      itemText="codeName"
      itemValue="code"
      name="accidentGradeCd"
      label="사고등급"
      v-model:value="searchParam.accidentGradeCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
    <c-multi-select
      codeGroupCd="IIM_KIND_CD"
      itemText="codeName"
      itemValue="code"
      maxValues="3"
      name="accidentKindCdList"
      label="사고종류"
      v-model:value="searchParam.accidentKindCdList"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-task-target
      :customPopupParam="{ targetKey: 'process' }"
      label="공정"
      name="processCd"
      v-model:value="searchParam.processCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      type="search"
      stepperGrpCd="IIM_STATUS_PROCESS_CD"
      itemText="stepperMstNm"
      itemValue="stepperMstCd"
      name="accidentStatusCd"
      label="진행상태"
      v-model:value="searchParam.accidentStatusCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-dept
      type="search"
      name="occurrenceDeptCd"
      label="발생부서"
      v-model:value="searchParam.occurrenceDeptCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <!-- 발생일 -->
    <c-datepicker :range="true" name="period" label="발생일" v-model:value="period" />
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
  name: 'accidentSearchBox'
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
  propsSearchParam: popupParamType
}
type popupParamType = {
  plantCd?: stringNull
  startYmd?: stringNull
  endYmd?: stringNull
  accidentGradeCd?: stringNull
  occurrenceDeptCd?: stringNull
  accidentKindCdList?: Array<any>
  accidentStatusCd?: stringNull
  processCd?: stringNull
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
      plantCd: null,
      startYmd: '',
      endYmd: '',
      accidentGradeCd: null,
      occurrenceDeptCd: '',
      accidentKindCdList: [] as any,
      accidentStatusCd: null,
      processCd: ''
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
const searchParam = ref<any>({
  plantCd: null,
  startYmd: '',
  endYmd: '',
  accidentGradeCd: null,
  occurrenceDeptCd: '',
  accidentKindCdList: [] as any,
  accidentStatusCd: null,
  processCd: ''
})
const period = ref([]) as any

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
  if (period.value.length == 2) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  }
  if (props.propsSearchParam.accidentStatusCd) {
    searchParam.value.accidentStatusCd = props.propsSearchParam.accidentStatusCd
  }
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

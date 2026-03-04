<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :editable="editable"
      :comboItems="iepsFlagItem"
      label="IEPS시설여부"
      itemText="codeName"
      itemValue="code"
      name="iepsFlag"
      type="search"
      v-model:value="searchParam.iepsFlag"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :editable="editable"
      :comboItems="selfMeasureExemptionItem"
      label="자가측정면제여부"
      itemText="codeName"
      itemValue="code"
      name="selfMeasureExemption"
      type="search"
      v-model:value="searchParam.selfMeasureExemptionFlag"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-dept
      :editable="editable"
      label="관리부서"
      name="deptCd"
      type="search"
      v-model:value="searchParam.deptCd"
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
  name: 'airOutletSearchBox'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  propsSearchParam: {
    plantCd?: stringNull
    useFlag?: stringNull
    selfMeasureExemptionFlag?: stringNull
    iepsFlag?: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  propsSearchParam: () => {
    return {
      plantCd: null,
      useFlag: 'Y',
      selfMeasureExemptionFlag: '',
      iepsFlag: ''
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
  useFlag: 'Y',
  selfMeasureExemptionFlag: '',
  iepsFlag: '',
  deptCd: ''
})
const selfMeasureExemptionItem = ref<Array<any>>([
  { code: 'Y', codeName: $language('면제') },
  { code: 'N', codeName: $language('해당없음') }
])
const iepsFlagItem = ref<Array<any>>([
  { code: 'Y', codeName: $language('해당') },
  { code: 'N', codeName: $language('비해당') }
])
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
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  // code setting
  if (props.propsSearchParam.plantCd) searchParam.value.plantCd = props.propsSearchParam.plantCd
  if (props.propsSearchParam.selfMeasureExemptionFlag) {
    searchParam.value.selfMeasureExemptionFlag = props.propsSearchParam.selfMeasureExemptionFlag
  }
  if (props.propsSearchParam.iepsFlag) searchParam.value.iepsFlag = props.propsSearchParam.iepsFlag
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

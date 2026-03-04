<template>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :comboItems="gubunItems"
      type="none"
      itemText="codeName"
      itemValue="code"
      name="gubun"
      label="조회구분"
      v-model:value="searchParam.gubun"
      @datachange="datachange"
    />
  </div>
  <div v-if="searchParam.gubun === 'chemNm'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-text
      required
      :error="
        (val: any) => {
          return Boolean(val) && val.length >= 2
        }
      "
      validMessage="[검색조건] 화학물질영문명을 2자 이상 입력하세요."
      name="chemNm"
      label="화학물질영문명 (2자 이상 입력)"
      v-model:value="searchParam.chemNm"
    />
  </div>
  <div v-if="searchParam.gubun === 'casNo'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-text
      required
      :error="
        (val: any) => {
          return Boolean(val) && val.length >= 2
        }
      "
      validMessage="[검색조건] CAS No.를 2자 이상 입력하세요."
      name="casNo"
      label="CAS No. (2자 이상 입력)"
      v-model:value="searchParam.casNo"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :comboItems="regulFlagItems"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="regulFlag"
      label="규제물질 대상여부"
      v-model:value="searchParam.regulFlag"
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
  name: 'chemBaseSearchBox'
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
// interface propType {
//   propsSearchParam?: chemBasePopupParamType
//   targetKey?: string
// }
// type chemBasePopupParamType = {}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
// const props = withDefaults(defineProps<propType>(), {
//   propsSearchParam: () => {
//     return {}
//   },
//   targetKey: ''
// })

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref({
  gubun: 'casNo',
  casNo: '',
  chemNm: '',
  regulFlag: 'Y'
})
const gubunItems = ref<Array<codeMasterType>>([])
const regulFlagItems = ref<Array<codeMasterType>>([])

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
  gubunItems.value = [
    { code: 'casNo', codeName: $language('CAS No. 조회') },
    { code: 'chemNm', codeName: $language('화학물질영문명 조회') }
  ]
  regulFlagItems.value = [
    { code: 'Y', codeName: $language('규제O') },
    { code: 'N', codeName: $language('규제X') }
  ]
  // list setting
}
/******************************
 * TODO (목적): 조회조건 변경
 *******************************/
function datachange() {
  if (searchParam.value.gubun === 'casNo') {
    searchParam.value.chemNm = ''
  } else {
    searchParam.value.casNo = ''
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

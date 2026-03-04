<template>
  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
    <c-select
      codeGroupCd="RELATED_LAWS_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="relatedLawsCd"
      label="관련법규"
      v-model:value="searchParam.relatedLawsCd"
    />
  </div>
  <div
    v-if="targetKey === 'license' && !props.propsSearchParam.limLicenseKindId"
    class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
  >
    <c-text
      name="search"
      placeholder="인허가종류명"
      label="인허가종류명"
      v-model:value="searchParam.limLicenseKindName"
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
import { ref, onMounted } from 'vue' //shallowRef

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'licenseSearchBox'
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
  propsSearchParam: licensePopupParamType
  targetKey?: string
}
type licensePopupParamType = {
  plantCd?: stringNull
  relatedLawsCd?: stringNull
  limLicenseKindName?: stringNull
  useFlag?: stringNull
  limLicenseKindId?: stringNull
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
      relatedLawsCd: null,
      limLicenseKindName: '',
      useFlag: 'Y',
      limLicenseKindId: ''
    }
  },
  targetKey: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref({
  plantCd: null as stringNull,
  relatedLawsCd: null as stringNull,
  limLicenseKindName: '',
  limLicenseKindId: ''
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function init() {
  if (props.propsSearchParam.relatedLawsCd) {
    searchParam.value.relatedLawsCd = props.propsSearchParam.relatedLawsCd
  }
  if (props.propsSearchParam.limLicenseKindName) {
    searchParam.value.limLicenseKindName = props.propsSearchParam.limLicenseKindName
  }
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
  if (props.propsSearchParam.limLicenseKindId) {
    searchParam.value.limLicenseKindId = props.propsSearchParam.limLicenseKindId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

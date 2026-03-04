<template>
  <div v-if="targetKey === 'vendorUser'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-task-target
      :plantCd="searchParam.plantCd"
      name="vendor"
      label="수급업체"
      :customPopupParam="{ targetKey: 'vendor' }"
      v-model:value="searchParam.vendorCd"
    />
  </div>
  <div v-if="targetKey === 'vendor'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      codeGroupCd="VENDOR_CLASS_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="vendorClassCd"
      label="업체분류"
      v-model:value="searchParam.vendorClassCd"
    />
  </div>
  <div v-if="targetKey === 'vendor'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      codeGroupCd="VENDOR_TYPE_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="vendorTypeCd"
      label="업체유형"
      v-model:value="searchParam.vendorTypeCd"
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
  name: 'vendorSearchBox'
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
    type: string
    plantCd?: string | null
    vendorClassCd?: string | null
    vendorTypeCd?: stringNull
    vendorCd?: string | null
    vendorName?: string
  }
  targetKey?: string
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
      type: 'multi',
      plantCd: null,
      vendorClassCd: null,
      vendorTypeCd: null,
      vendorCd: null,
      vendorName: ''
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
  plantCd: null as string | null,
  vendorClassCd: null as string | null,
  vendorTypeCd: null as stringNull,
  vendorCd: null as string | null,
  vendorName: ''
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
  if (props.propsSearchParam.vendorCd) {
    searchParam.value.vendorCd = props.propsSearchParam.vendorCd
  }
  if (props.propsSearchParam.vendorClassCd) {
    searchParam.value.vendorClassCd = props.propsSearchParam.vendorClassCd
  }
  if (props.propsSearchParam.vendorTypeCd) {
    searchParam.value.vendorTypeCd = props.propsSearchParam.vendorTypeCd
  }
  if (props.propsSearchParam.vendorName) {
    searchParam.value.vendorName = props.propsSearchParam.vendorName
  }
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

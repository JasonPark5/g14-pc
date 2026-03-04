<template>
  <!-- 추가할 컴포넌트가 있으면 하기. -->
  <div
    v-for="cond in props.searchConditions"
    :key="cond.modelValue"
    class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
  >
    <c-plant
      v-if="cond['type'] === 'plant'"
      type="search"
      :name="cond['modelValue']"
      v-model:value="searchParam[cond['modelValue']]"
    />
    <c-dept
      v-else-if="cond['type'] === 'dept'"
      type="search"
      :label="cond['label']"
      :name="cond['modelValue']"
      v-model:value="searchParam[cond['modelValue']]"
    />
    <c-select
      v-else-if="cond['type'] === 'select'"
      type="search"
      itemText="codeName"
      itemValue="code"
      :codeGroupCd="cond['codeGroupCd'] ? cond['codeGroupCd'] : null"
      :comboItems="cond['comboItems'] ? cond['comboItems'] : null"
      :label="cond['label']"
      :name="cond['modelValue']"
      v-model:value="searchParam[cond['modelValue']]"
    />
    <c-text
      v-else-if="cond['type'] === 'text'"
      type="search"
      :label="cond['label']"
      :name="cond['modelValue']"
      v-model:value="searchParam[cond['modelValue']]"
    />
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
import { ref, onMounted } from 'vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipPop'
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
  searchConditions: arrayString | undefined | null
  searchParam: any
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  searchConditions: undefined,
  searchParam: {
    plantCd: null
  }
})
const route = useRoute()

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
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
  // if (props.equipmentTypeCd) {
  //   searchParam.value.equipmentTypeCd = props.popupParam.equipmentTypeCd
  // }
  // if (props.popupParam.grade) {
  //   searchParam.value.grade = props.popupParam.grade
  // }
  // if (props.popupParam.subProcessCd) {
  //   searchParam.value.subProcessCd = props.popupParam.subProcessCd
  // }
  // if (props.popupParam.plantCd) {
  //   searchParam.value.plantCd = props.popupParam.plantCd
  // }
  // if (props.popupParam.hazardousFlag) {
  //   searchParam.value.hazardousFlag = props.popupParam.hazardousFlag
  // }
  // list setting
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

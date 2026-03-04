<template>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      codeGroupCd="MATERIAL_KIND_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="materialKindCd"
      label="자재구분"
      v-model:value="searchParam.materialKindCd"
    />
  </div>
  <div v-if="targetKey === 'material'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-task-target
      name="materialType"
      label="자재분류"
      :customPopupParam="{ targetKey: 'materialType' }"
      v-model:value="searchParam.materialTypeCd"
    />
  </div>
  <div v-if="targetKey === 'material'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-text label="자재명" name="materialName" v-model:value="searchParam.materialName" />
  </div>
  <div v-if="targetKey === 'material'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-checkbox
      :isFlag="true"
      trueLabel="화학자재로 등록되지 않은 자재"
      falseLabel="모든 자재"
      label="중복제외"
      name="newChem"
      v-model:value="searchParam.newChem"
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
  name: 'materialSearchBox'
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
    materialTypeCd?: string
    materialKindCd?: string
    materialName?: string
    newChem?: string
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
      type: 'single',
      plantCd: null,
      materialTypeCd: '',
      materialKindCd: '',
      upMaterialTypeCd: '',
      materialName: '',
      newChem: ''
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
  materialTypeCd: '',
  materialKindCd: '',
  materialName: '',
  newChem: ''
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
  if (props.propsSearchParam.materialTypeCd) {
    searchParam.value.materialTypeCd = props.propsSearchParam.materialTypeCd
  }
  if (props.propsSearchParam.materialKindCd) {
    searchParam.value.materialKindCd = props.propsSearchParam.materialKindCd
  }
  if (props.propsSearchParam.materialName) {
    searchParam.value.materialName = props.propsSearchParam.materialName
  }
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
  if (props.propsSearchParam.newChem) {
    searchParam.value.newChem = props.propsSearchParam.newChem
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-dept label="관리부서" name="managementDepts" v-model:value="searchParam.managementDepts" />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      codeGroupCd="EQUIP_INSPECTION_TYPE_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="equipInspectionTypeCd"
      label="점검유형"
      v-model:value="searchParam.equipInspectionTypeCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :editable="editable"
      :comboItems="discardFlagItems"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="discardFlag"
      label="폐기여부"
      v-model:value="searchParam.discardFlag"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :editable="editable"
      :comboItems="flagItems"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="lawEquipmentFlag"
      label="법정설비여부"
      v-model:value="searchParam.lawEquipmentFlag"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-text label="설비명" name="equipmentName" v-model:value="searchParam.equipmentName" />
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
import { ref, onMounted, inject } from 'vue' //shallowRef
import { useRoute } from 'vue-router'

import { GetTranLanguageFunction } from '@/types/language'
import { codeMasterType } from '@/types/codeMaster'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipSearchBox'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  propsSearchParam: equipPopupParamType
}
type equipPopupParamType = {
  equipmentTypeCd?: string
  grade?: string
  hazardousFlag?: string
  subProcessCd?: string
  lawEquipmentFlag?: string
  plantCd?: string | null
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
      equipmentTypeCd: '',
      grade: '',
      hazardousFlag: 'N',
      subProcessCd: '',
      lawEquipmentFlag: '',
      plantCd: null
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
const discardFlagItems = ref<Array<codeMasterType>>([])
const searchParam = ref({
  plantCd: null as string | null,
  equipmentTypeCd: '',
  equipmentName: '',
  equipInspectionTypeCd: '',
  managementDepts: '',
  subProcessCd: '',
  hazardousFlag: '',
  discardFlag: 'N',
  lawEquipmentFlag: '',
  grade: ''
})

const flagItems = ref<Array<codeMasterType>>([])
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
  discardFlagItems.value = [
    { code: 'N', codeName: $language('미폐기') },
    { code: 'Y', codeName: $language('폐기') }
  ]
  flagItems.value = [
    { code: 'Y', codeName: $language('해당') },
    { code: 'N', codeName: $language('해당없음') }
  ]
  // url setting
  // code setting
  if (props.propsSearchParam.equipmentTypeCd) {
    searchParam.value.equipmentTypeCd = props.propsSearchParam.equipmentTypeCd
  }
  if (props.propsSearchParam.grade) {
    searchParam.value.grade = props.propsSearchParam.grade
  }
  if (props.propsSearchParam.subProcessCd) {
    searchParam.value.subProcessCd = props.propsSearchParam.subProcessCd
  }
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
  if (props.propsSearchParam.lawEquipmentFlag) {
    searchParam.value.lawEquipmentFlag = props.propsSearchParam.lawEquipmentFlag
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

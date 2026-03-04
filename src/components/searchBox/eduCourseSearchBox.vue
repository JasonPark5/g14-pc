<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-plant
      :isEnterprise="true"
      type="search"
      name="plantCd"
      v-model:value="searchParam.plantCd"
    />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      type="search"
      codeGroupCd="EDU_KIND_FST_CD"
      itemText="codeName"
      itemValue="code"
      name="educationKindCdLarge"
      label="교육종류1"
      v-model:value="searchParam.educationKindCdLarge"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      type="search"
      codeGroupCd="EDU_KIND_SEC_CD"
      itemText="codeName"
      itemValue="code"
      name="educationKindCdSmall"
      label="교육종류2"
      v-model:value="searchParam.educationKindCdSmall"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      type="search"
      codeGroupCd="EDU_CLASS_CD"
      itemText="codeName"
      itemValue="code"
      name="educationTypeCd"
      label="교육구분"
      v-model:value="searchParam.educationTypeCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      type="search"
      codeGroupCd="MDM_CHECK_KIND_CD"
      itemText="codeName"
      itemValue="code"
      label="법정교육여부"
      name="legalEduYn"
      v-model:value="searchParam.legalEduYn"
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
import { useRoute } from 'vue-router'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'eduCourseSearchBox'
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
  propsSearchParam: PopupParamType
}
type PopupParamType = {
  plantCd?: stringNull
  educationKindCdSmall?: stringNull
  educationKindCdLarge?: stringNull
  educationTypeCd?: stringNull
  legalEduYn?: stringNull
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
      educationKindCdSmall: null,
      educationKindCdLarge: null,
      educationTypeCd: null,
      legalEduYn: null
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
  plantCd: null as string | null,
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  useFlag: 'Y',
  legalEduYn: null
})

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
  if (props.propsSearchParam.plantCd) {
    searchParam.value.plantCd = props.propsSearchParam.plantCd
  }
  if (props.propsSearchParam.educationKindCdSmall) {
    searchParam.value.educationKindCdSmall = props.propsSearchParam.educationKindCdSmall
  }
  if (props.propsSearchParam.educationKindCdLarge) {
    searchParam.value.educationKindCdLarge = props.propsSearchParam.educationKindCdLarge
  }
  if (props.propsSearchParam.educationTypeCd) {
    searchParam.value.educationTypeCd = props.propsSearchParam.educationTypeCd
  }
  if (props.propsSearchParam.legalEduYn) {
    searchParam.value.legalEduYn = props.propsSearchParam.legalEduYn
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

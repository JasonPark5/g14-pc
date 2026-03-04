<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-plant type="edit" name="plantCd" v-model:value="searchParam.plantCd" />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-task-target
      :plantCd="searchParam.plantCd"
      name="eduCourseId"
      label="교육과정"
      :customPopupParam="{ targetKey: 'eduCourse' }"
      v-model:value="searchParam.eduCourseId"
    />
  </div>
  <div
    v-if="propsSearchParam.exceptDocumentStatusCd"
    class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
  >
    <c-select
      type="search"
      codeGroupCd="EDU_STATUS_CD"
      itemText="codeName"
      itemValue="code"
      name="documentStatusCd"
      label="진행상태"
      v-model:value="searchParam.documentStatusCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      :editable="editable"
      type="search"
      codeGroupCd="EDU_KIND_FST_CD"
      itemText="codeName"
      itemValue="code"
      name="educationKindCdLarge"
      label="교육종류1"
      v-model:value="searchParam.educationKindCdLarge"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      :editable="editable"
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
    <c-datepicker :range="true" label="교육기간" name="period" v-model:value="searchParam.period" />
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

// import { getFirstDayThisYear, getLastDayThisYear } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'eduSearchBox'
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
  exceptDocumentStatusCd?: stringNull
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
      exceptDocumentStatusCd: ''
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
  documentStatusCd: null,
  startYmd: '',
  endYmd: '',
  eduCourseId: '',
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  exceptDocumentStatusCd: null,
  period: []
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
  // searchParam.value.period = [getFirstDayThisYear(), getLastDayThisYear()]
  if (props.propsSearchParam.exceptDocumentStatusCd) {
    searchParam.value.exceptDocumentStatusCd = props.propsSearchParam.exceptDocumentStatusCd
  }
  // list setting
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

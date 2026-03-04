<template>
  <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-plant
      :isEnterprise="true"
      type="search"
      name="plantCd"
      v-model:value="searchParam.plantCd"
    />
  </div> -->
  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
    <c-select
      codeGroupCd="CLOSED_SPACE_TYPE_CD"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="closedSpaceTypeCd"
      label="밀폐공간 종류"
      v-model:value="searchParam.closedSpaceTypeCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-field label="관리자" name="managerId" v-model:value="searchParam.managerId" />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-task-target
      :customPopupParam="{ targetKey: 'workMap' }"
      :plantCd="searchParam.plantCd"
      label="지도명"
      name="sopMapId"
      v-model:value="searchParam.sopMapId"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
    <c-select
      :editable="editable"
      :comboItems="permitFlagItems"
      label="허가필요여부"
      itemText="codeName"
      itemValue="code"
      name="permitFlag"
      type="search"
      v-model:value="searchParam.permitFlag"
    />
  </div>
  <c-dialog :param="popupOptions" />
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
import { useRoute } from 'vue-router'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'closedSpaceSearchBox'
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
  closedSpaceTypeCd?: stringNull
  managerId?: stringNull
  permitFlag?: stringNull
  sopMapId?: stringNull
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
      closedSpaceTypeCd: null,
      managerId: null,
      permitFlag: null,
      sopMapId: ''
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
  plantCd: null as stringNull,
  closedSpaceTypeCd: null,
  managerId: null,
  permitFlag: null,
  useFlag: 'Y',
  sopMapId: null
})
const popupOptions = ref<popupParamType>({
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const permitFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('허가필요') },
  { code: 'N', codeName: $language('허가불필요') }
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
  if (props.propsSearchParam.closedSpaceTypeCd) {
    searchParam.value.closedSpaceTypeCd = props.propsSearchParam.closedSpaceTypeCd
  }
  if (props.propsSearchParam.managerId) {
    searchParam.value.managerId = props.propsSearchParam.managerId
  }
  if (props.propsSearchParam.permitFlag) {
    searchParam.value.permitFlag = props.propsSearchParam.permitFlag
  }
  if (props.propsSearchParam.sopMapId) {
    searchParam.value.sopMapId = props.propsSearchParam.sopMapId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>

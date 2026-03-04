<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 tabvertical">
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :attachInfo1="attachInfo1"
          :attachInfo2="attachInfo2"
          :isApprDisabled="isApprDisabled"
          :height="height"
          @closePopup="closePopup"
          @changeStatus="changeStatus"
          @changeComplete="changeComplete"
        />
      </template>
    </c-tab>
  </div>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { nearAccidentPopupParamType } from './nearAccident'

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
  name: 'nearRegisterTab'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['changeComplete', 'changeStatus', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: nearAccidentPopupParamType
  height: stringNull
  isApprDisabled: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      iimNearAccidentId: '',
      iimStatusNearCd: ''
    }
  },
  isApprDisabled: false,
  contentHeight: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('nearRegisterInfo')
const tabItems = ref([
  {
    name: 'nearRegisterInfo',
    icon: 'edit',
    label: '기본정보',
    component: shallowRef(defineAsyncComponent(() => import(`./nearRegisterInfo.vue`)))
  },

  {
    name: 'nearRelationPicture',
    icon: 'camera_enhance',
    label: '관련 사진',
    component: shallowRef(defineAsyncComponent(() => import(`./nearRelationPicture.vue`)))
  }
])
const attachInfo1 = ref({
  isSubmit: '',
  taskClassCd: 'NEAR_FIRST_PICTURE',
  taskKey: ''
})
const attachInfo2 = ref({
  isSubmit: '',
  taskClassCd: 'NEAR_SECOND_PICTURE',
  taskKey: ''
})

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  const numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 1000
  return numHeight - 24 + 'px'
})
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
  // list setting
}
/******************************
 * TODO (목적): 창닫기
 *******************************/
function closePopup(data: any) {
  emits('closePopup', data)
}
/******************************
 * TODO (목적): 상태변화(등록했을 경우 개선관리 탭을 추가해서 보여줌)
 *******************************/
function changeStatus() {
  emits('changeStatus')
}
/******************************
 * TODO (목적): 완료시 진행상태 코드 변경
 *******************************/
function changeComplete() {
  props.popupParam.iimStatusNearCd = 'ISNC000002'
  emits('changeComplete')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

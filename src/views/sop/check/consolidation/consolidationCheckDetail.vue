<template>
  <c-tab
    type="horizon"
    :inlineLabel="true"
    :dense="true"
    :height="tabHeight"
    :tabItems="tabItems"
    @tabClick="tabClick"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component
        :is="tab.component"
        :renewal="renewal"
        :isOld="isOld"
        :popupParam="popupParam"
        :contentHeight="contentHeight"
        @closePopup="closePopup"
      />
    </template>
  </c-tab>
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
import { consolidationCheckPopupParamType } from './consolidationCheck'
import { uid } from 'quasar'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'consolidationCheckDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: consolidationCheckPopupParamType
  contentHeight: string
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
      saiJointInspectionId: ''
    }
  },
  isOld: false,
  renewal: '',
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const tab = ref('councilInfo')
const editable = ref(true)
const renewal = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiJointInspectionId))
const tabItems = computed(() => {
  let _items: Array<tabItemsType> = [
    {
      name: 'councilInfo',
      icon: 'edit',
      label: '기본정보 및 참석자',
      component: defineAsyncComponent(() => import(`./consolidationCheckInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items = _.concat(_items, [
      {
        name: 'councilImpr',
        icon: 'construction',
        label: '개선관리',
        component: defineAsyncComponent(() => import(`./consolidationCheckImpr.vue`))
      }
    ])
  }
  return _items
})
const tabHeight = computed(() => {
  let height = !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) - 36 : 800
  if (height < 500) {
    height = 500
  }
  return String(height)
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
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * TODO (목적): 탭 클릭 event
 *******************************/
function tabClick() {
  renewal.value = uid()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-tab
      type="horizon"
      :tabItems="tabItems"
      :inlineLabel="true"
      v-model:value="tab"
      :dense="true"
      :height="tabHeight"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :param="popupParam"
          @closePopup="closePopup"
          @insertTraningInfo="updateMode"
          @setRegInfo="setRegInfo"
        />
      </template>
    </c-tab>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'traningDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopEmergencyTrainingId: stringNull
  }
  contentHeight: numberNull | stringNull
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
      sopEmergencyTrainingId: ''
    }
  },
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
const tab = ref('scenario')
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'scenario',
    icon: 'info',
    label: '비상대응훈련 상세',
    component: shallowRef(defineAsyncComponent(() => import(`./traningInfo.vue`)))
  }
])
const addTabItems = ref<Array<tabItemsType>>([
  {
    name: 'assess',
    icon: 'assessment',
    label: '훈련 평가',
    component: shallowRef(defineAsyncComponent(() => import(`./traningAssess.vue`)))
  }
])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight + 'px' : '700px'
)

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
  if (props.popupParam.sopEmergencyTrainingId) {
    tabItems.value = tabItems.value.concat(addTabItems.value)
  }
  // list setting
}
function updateMode(_sopEmergencyTrainingId: any) {
  props.popupParam.sopEmergencyTrainingId = _sopEmergencyTrainingId
  // addItems 수정
  if (tabItems.value.length > 1) {
    //
  } else {
    tabItems.value = tabItems.value.concat(addTabItems.value)
  }
}
function closePopup() {
  emits('closePopup')
}
function setRegInfo(data: any) {
  emits('setRegInfo', data)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

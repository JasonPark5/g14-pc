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
          :contentHeight="contentHeight"
          @closePopup="closePopup"
          @insertTraningInfo="updateMode"
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
  name: 'closedSpaceEduDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  contentHeight?: stringNull
  popupParam: {
    sopEmergencyTrainingId?: stringNull
    sopEmergencyPlanId?: stringNull
    eapTrainingTypeCd?: stringNull
    plantCd?: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      sopEmergencyTrainingId: '',
      sopEmergencyPlanId: '',
      eapTrainingTypeCd: '',
      plantCd: ''
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
const tab = ref('scenario')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 10 + 'px' : '680px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'scenario',
      icon: 'info',
      label: '밀폐공간작업 훈련계획 상세',
      component: defineAsyncComponent(() => import(`./closedSpaceEduInfo.vue`))
    }
  ]
  if (props.popupParam.sopEmergencyTrainingId) {
    _items.push({
      name: 'assess',
      icon: 'assessment',
      label: '훈련 평가',
      component: defineAsyncComponent(() => import(`./closedSpaceEduAssess.vue`))
    })
  }
  return _items
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
  // url setting
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 일괄저장할 때 이부분이 없으면 훈련평가 탭이 누를때마다 추가됨
 *******************************/
function updateMode(_sopEmergencyTrainingId: stringNull) {
  props.popupParam.sopEmergencyTrainingId = _sopEmergencyTrainingId
}
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

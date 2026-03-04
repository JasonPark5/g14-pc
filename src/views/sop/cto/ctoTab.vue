<template>
  <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
    <template v-slot:default="tab">
      <component
        :is="tab.component"
        :popupParam="popupParam"
        :cto="cto"
        :isOld="isOld"
        :disabled="disabled"
        @getDetail="getDetail"
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
import { ctoType } from './cto'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'ctoTab'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopCtoId: stringNull
  }
  cto: ctoType
  isOld: boolean
  disabled: boolean
  contentHeight: stringNull
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
      sopCtoId: ''
    }
  },
  cto: () => {
    return {
      sopCtoId: '',
      plantCd: '',
      ctoDate: '',
      ctoTime: '',
      observeUserId: '',
      observeCount: '',
      mdmSopId: '',
      workArea: '',
      ctoCompleteFlag: 'N',
      improveContents: '',
      priorityContents: '',
      managerUserId: '',
      sopName: '',
      processName: '',
      regUserId: '',
      chgUserId: '',
      workCharacteristics: '',
      humanFactors: '',
      coreActionItems: '',
      activityModels: [],
      ctoChecklistModels: [],
      ctoImproveModels: []
    }
  },
  isOld: false,
  disabled: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('ctoInfo')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => String(props.contentHeight - 25))
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    {
      name: 'ctoInfo',
      icon: 'edit',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./ctoInfo.vue`)),
      key: uid()
    }
  ]
  if (props.isOld) {
    items.push({
      name: 'ctoChecklist',
      icon: 'how_to_reg',
      label: '체크리스트',
      component: defineAsyncComponent(() => import(`./ctoChecklist.vue`)),
      key: uid()
    })
  }
  return items
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
function closePopup(data: object | any) {
  emits('closePopup', data)
}
function getDetail() {
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

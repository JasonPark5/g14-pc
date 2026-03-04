<template>
  <c-tab
    type="tabcard"
    :dense="true"
    :inlineLabel="true"
    :height="tabHeight"
    :tabItems="tabItems"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component :is="tab.component" :processCd="popupParam.processCd" />
    </template>
  </c-tab>
  <!-- <component :is="component" :processCd="popupParam.processCd" /> -->
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
  name: 'processInfoPop'
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
  popupParam: {
    processType: stringNull // P: 상위공정, C: 단위공정
    processCd: stringNull // 공정코드
  }
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
      processType: 'P', // P: 상위공정, C: 단위공정
      processCd: '' // 공정코드
    }
  },

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
const tab = ref('processDetail')
const component = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 600
    ? props.contentHeight + 'px'
    : '700px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'processDetail',
      icon: 'groups',
      label: '공정상세',
      component: defineAsyncComponent(() => import(`./processDetailPop.vue`))
    },
    {
      name: 'processUnit',
      icon: 'list',
      label: '단위공정',
      component: defineAsyncComponent(() => import(`./processUnitPop.vue`))
    }
  ]
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  // code setting
  if (props.popupParam.processType == 'C') {
    component.value = () => defineAsyncComponent(() => import(`./processUnitDetailPop.vue`))
  }
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

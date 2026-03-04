<template>
  <div>
    <c-tab
      :dense="true"
      type="pagetop"
      :tabItems="tabItems"
      :inlineLabel="true"
      align="left"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :sopFireFightingDocumentClassCd="tab.sopFireFightingDocumentClassCd"
          :gubun="tab.gubun"
          :contentHeight="contentHeight"
          :height="tabHeight"
          :label="tab.label"
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
  name: 'selfDefenseFireBrigade'
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
  contentHeight?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
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
const tab = ref('tab2')
const tabItems = ref<Array<tabItemsType>>([
  // {
  //   name: 'tab1',
  //   label: '화재발생시 행동요령',
  //   component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
  //   sopFireFightingDocumentClassCd: 'FFDC000001'
  // },
  {
    name: 'tab2',
    label: '화재진압',
    component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
    sopFireFightingDocumentClassCd: 'FFDC000002'
  },
  {
    name: 'tab3',
    label: '인명대피',
    component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
    sopFireFightingDocumentClassCd: 'FFDC000003'
  },
  {
    name: 'tab4',
    label: '화재 시뮬레이션',
    component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentTab.vue`))),
    gubun: 'simulation'
  },
  {
    name: 'tab5',
    label: '자위소방대',
    component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentTab.vue`))),
    gubun: 'self'
  }
])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 680
    ? Number(props.contentHeight) - 1 + 'px'
    : '820px'
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
  // list setting
}
</script>

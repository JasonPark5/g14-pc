<template>
  <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
    <template v-slot:default="tab">
      <component :is="tab.component" :key="tab.key" :param="param" height="750px" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'investigationComplete'
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
  param: {
    heaInvestigationPlanId: stringNull
    stepCd: stringNull
  }
  height: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => ({
    heaInvestigationPlanId: '',
    stepCd: ''
  }),
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  const numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 800
  return numHeight + 'px'
})
const tab = ref('onepage')
const tabItems = computed(() => {
  return [
    {
      key: '1',
      name: 'onepage',
      icon: 'plagiarism',
      label: '한눈에 보기',
      component: defineAsyncComponent(() => import(`./investigationOnepage.vue`))
    },
    {
      key: '2',
      name: 'impr',
      icon: 'auto_fix_high',
      label: '개선현황',
      component: defineAsyncComponent(() => import(`./investigationImprStatus.vue`))
    }
  ]
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

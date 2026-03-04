<template>
  <div>
    <c-tab type="vertical" :tabItems="tabItems" height="810px" v-model:value="tab">
      <template v-slot:default="tab">
        <component :is="tab.component" :popupParam="props.param" />
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
  name: 'complianceResult'
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
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull // 평가항목 개정번호
    count?: numberNull
  }
  height?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: '', // 평가항목 개정번호
      count: 0
    }
  },
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
const tab = ref('planInfo')

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => [
  {
    key: uid(),
    name: 'planInfo',
    icon: 'edit',
    label: '평가점수<br/>환산표',
    component: defineAsyncComponent(() => import(`./auditResultTable.vue`))
  },
  {
    key: uid(),
    name: 'team',
    icon: 'checklist',
    label: '평가항목별<br/>감사결과',
    component: defineAsyncComponent(() => import(`./resultReport.vue`))
  }
])

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

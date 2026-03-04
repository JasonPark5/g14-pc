<template>
  <c-tab
    type="pagetop"
    :tabItems="tabItems"
    :inlineLabel="true"
    :height="tabHeight"
    :dense="true"
    v-model:value="tab"
    align="left"
  >
    <template v-slot:default="tab">
      <component :is="tab.component" />
    </template>
  </c-tab>
</template>

<script setup lang="ts">
const tab = ref('company')
const tabHeight = ref('')
const tabItems = ref([
  {
    name: 'company',
    icon: 'list',
    label: '회사 관리',
    component: shallowRef(defineAsyncComponent(() => import(`@views/mdm/cpy/companyManage.vue`)))
  },
  {
    name: 'plant',
    icon: 'groups',
    label: '사업장 관리',
    component: shallowRef(defineAsyncComponent(() => import(`@views/mdm/cpy/plantManage.vue`)))
  }
])
/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  // url setting
  // code setting
  tabHeight.value = window.innerHeight - 100 + 'px'
  // list setting
}
</script>

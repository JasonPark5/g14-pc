<template>
  <c-tab
    type="horizon"
    :tabItems="tabItems"
    :inlineLabel="true"
    :dense="true"
    :height="tabHeight"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component :is="tab.component" />
    </template>
  </c-tab>
</template>

<script setup lang="ts">
const tabItems = ref([
  {
    name: '0',
    icon: 'info',
    label: '이득영 playground',
    component: shallowRef(defineAsyncComponent(() => import(`@views/test/ldy.vue`)))
  },
  {
    name: '1',
    icon: 'info',
    label: '김덕형 playground',
    component: shallowRef(defineAsyncComponent(() => import(`@views/test/kdh.vue`)))
  },
  {
    name: 'table',
    icon: 'info',
    label: 'table playground',
    component: shallowRef(defineAsyncComponent(() => import(`@views/test/kdh_table.vue`)))
  },
  {
    name: '2',
    icon: 'info',
    label: '엄태균 playground',
    component: shallowRef(defineAsyncComponent(() => import(`@views/test/etg.vue`)))
  },
  {
    name: '3',
    icon: 'info',
    label: '강이화 playground',
    component: shallowRef(defineAsyncComponent(() => import(`@views/test/kew.vue`)))
  }
])
const tab = ref('table')
const tabHeight = ref('800')
</script>

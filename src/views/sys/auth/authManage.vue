<template>
  <div>
    <c-tab
      :dense="true"
      type="pagetop"
      :tabItems="tabItems"
      :height="tabHeight"
      :inlineLabel="true"
      v-model:value="tab"
      align="left"
    >
      <template v-slot:default="tab">
        <component :is="tab.component" />
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
  name: 'authManage'
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

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('authGroup')
const tabHeight = ref('')

const tabItems = ref([
  {
    name: 'authGroup',
    icon: 'groups',
    label: '권한 관리',
    component: shallowRef(defineAsyncComponent(() => import(`@views/sys/auth/authGroup.vue`)))
  },
  {
    name: 'authGroupMenu',
    icon: 'list',
    label: '권한별 메뉴',
    component: shallowRef(defineAsyncComponent(() => import(`@views/sys/auth/authGroupMenu.vue`)))
  },
  {
    name: 'authGroupUser',
    icon: 'manage_accounts',
    label: '권한별 부서/사용자',
    component: shallowRef(defineAsyncComponent(() => import(`@views/sys/auth/authGroupUser.vue`)))
  },
  {
    name: 'authGroupByUser',
    icon: 'badge',
    label: '부서/사용자별 권한',
    component: shallowRef(defineAsyncComponent(() => import(`@views/sys/auth/authGroupByUser.vue`)))
  }
  // {
  //   name: 'authPlant',
  //   icon: 'home_work',
  //   label: '부서/사용자별 사업장권한',
  //   component: shallowRef(defineAsyncComponent(() => import(`@views/sys/auth/authGroupPlant.vue`)))
  // }
])

/******************************
 * @Computed_선언
 *******************************/

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
  tabHeight.value = String(window.innerHeight - 85)
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

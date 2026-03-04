<template>
  <c-search-box>
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          :comboItems="useFlagItems"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="useFlag"
          label="사용여부"
          v-model:value="searchParam.useFlag"
        />
      </div>
    </template>
  </c-search-box>
  <c-tab
    type="tabcard"
    align="left"
    :inlineLabel="true"
    :tabItems="tabItems"
    :height="tabHeight"
    v-model:value="tab"
    @tabClick="tabClick"
  >
    <template v-slot:default="tab">
      <component :is="tab.component" :searchParam="searchParam" :tabParam="tabParam" />
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
  name: 'emergencyRelationInfo'
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
const $language = inject('$language') as GetTranLanguageFunction

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
const searchParam = ref<any>({
  plantCd: '',
  dataTypeCd: '1',
  useFlag: 'Y',
  innerFlag: 'Y'
})
const tabParam = ref<any>({
  dataTypeCd: '1',
  title: '비상연락체계도'
})
const tab = ref('1')
const useFlagItems = ref<codeMasterType>([])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  return String(window.innerHeight - 200) + 'px'
})
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    // 비상연락체계도
    {
      name: '1',
      icon: 'folder',
      label: '비상연락체계도',
      component: defineAsyncComponent(() => import(`./emergencyRelationInfoDetail.vue`))
    },
    // 자위소방대조직도
    {
      name: '2',
      icon: 'folder',
      label: '자위소방대조직도',
      component: defineAsyncComponent(() => import(`./emergencyRelationInfoDetail.vue`))
    },
    // 반별임무
    {
      name: '3',
      icon: 'folder',
      label: '반별임무',
      component: defineAsyncComponent(() => import(`./emergencyRelationInfoDetail.vue`))
    },
    // 인근업체비상연락망
    {
      name: '4',
      icon: 'folder',
      label: '인근업체비상연락망',
      component: defineAsyncComponent(() => import(`./emergencyRelationInfoDetail.vue`))
    },
    // 집결지
    {
      name: '5',
      icon: 'folder',
      label: '집결지',
      component: defineAsyncComponent(() => import(`./emergencyRelationInfoDetail.vue`))
    },
    // 비상대피로
    {
      name: '6',
      icon: 'folder',
      label: '비상대피로',
      component: defineAsyncComponent(() => import(`./emergencyRelationInfoDetail.vue`))
    },
    // 응급상황 대응
    {
      name: '7',
      icon: 'phone_in_talk',
      label: '응급상황 대응',
      component: defineAsyncComponent(() => import(`@views/sop/eme/EmeContactManage.vue`))
    }
  ]

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
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
}
function tabClick(_tab: any) {
  searchParam.value.dataTypeCd = _tab.name
  tabParam.value.dataTypeCd = _tab.name
  tabParam.value.title = _tab.label
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

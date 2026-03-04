<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-datepicker
            :range="true"
            defaultStart="-2M"
            defaultEnd="2M"
            type="month"
            label="월(개선 - 요청일 기준 / 즉시조치 - 조치일 기준)"
            name="actionCompleteRequestDates"
            v-model:value="searchParam.actionCompleteRequestDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-dept
            type="search"
            label="조치부서"
            name="actionDeptCd"
            v-model:value="searchParam.actionDeptCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-tab
      type="tabcard"
      align="left"
      :height="tabHeight"
      :inlineLabel="true"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component :is="tab.component" :searchParam="searchParam" :tabParam="tabParam" />
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
  name: 'imprActionRate'
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
interface searchParamType {
  plantCd: stringNull
  actionCompleteRequestDates: arrayString | null
  actionDeptCd: stringNull
  actionVendorCd: stringNull
  actionFlag: stringNull
}

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
const searchParam = ref<searchParamType>({
  plantCd: null,
  actionCompleteRequestDates: [],
  actionDeptCd: '',
  actionVendorCd: '',
  actionFlag: 'D'
})
const tab = ref('task')
const tabParam = ref({
  search: ''
})
const tabItems = ref([
  {
    name: 'task',
    icon: 'task_alt',
    label: '업무별',
    component: shallowRef(defineAsyncComponent(() => import(`./imprTaskRate.vue`)))
  },
  {
    name: 'rqstDept',
    icon: 'campaign',
    label: '요청대상별',
    component: shallowRef(defineAsyncComponent(() => import(`./imprRqstDeptRate.vue`)))
  }
])
const tabHeight = ref('750')

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
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

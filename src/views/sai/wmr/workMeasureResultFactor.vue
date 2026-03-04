<template>
  <c-search-box>
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          name="measYear"
          type="year"
          :range="true"
          label="측정년도"
          defaultStart="-3y"
          defaultEnd="0y"
          v-model:value="searchParam.year"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          codeGroupCd="WORK_MEAS_QUARTER_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          label="상/하반기"
          name="measQuarter"
          v-model:value="searchParam.measQuarter"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          type="search"
          :comboItems="[{ code: '초과' }, { code: '미만' }]"
          itemText="code"
          itemValue="code"
          label="노출기준초과여부"
          name="exposureFlag"
          v-model:value="searchParam.exposureFlag"
        />
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          type="search"
          :comboItems="[
            { code: '1', codeName: '소음' },
            { code: '5', codeName: '고열' },
            { code: '2', codeName: '분진' },
            { code: '4', codeName: '금속류' },
            { code: '6', codeName: '가스상물질류' },
            { code: '3', codeName: '기타' }
          ]"
          itemText="codeName"
          itemValue="code"
          label="유해인자 구분"
          name="workAreaGradeCd"
          v-model:value="searchParam.workAreaGradeCd"
        />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-text label="유해인자" name="hazardNames" v-model:value="searchParam.hazardNames" />
      </div>
    </template>
  </c-search-box>
  <c-tab
    class="q-mt-sm"
    type="tabcard"
    align="left"
    :tabItems="tabItems"
    :inlineLabel="true"
    :height="tabHeight"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component
        :is="tab.component"
        :searchParam="searchParam"
        :workAreaGradeCd="tab.workAreaGradeCd"
        :title="tab.label"
        :unit="tab.unit"
        :height="tabHeight"
      />
    </template>
  </c-tab>
  <c-dialog :param="popupOptions" />
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
  name: 'workMeasureResultFactor'
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
// const $language = inject('$language') as GetTranLanguageFunction

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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  measQuarter: null,
  measYear: '',
  startYmd: '',
  endYmd: '',
  exposureFlag: null,
  workAreaGradeCd: '',
  hazardNames: '',
  year: ['', '']
})
const listUrl = ref('')
const editable = ref(true)
const tab = ref('resultInfo1')

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => [
  {
    name: 'resultInfo1',
    icon: 'groups',
    label: '소음',
    unit: 'dB(A)',
    workAreaGradeCd: '1',
    component: defineAsyncComponent(() => import(`./workMeasureResultFactorTab.vue`))
  },
  {
    name: 'resultInfo5',
    icon: 'groups',
    label: '고열',
    unit: '℃',
    workAreaGradeCd: '5',
    component: defineAsyncComponent(() => import(`./workMeasureResultFactorTab.vue`))
  },
  {
    name: 'resultInfo2',
    icon: 'groups',
    label: '분진',
    unit: 'mg/m3',
    workAreaGradeCd: '2',
    component: defineAsyncComponent(() => import(`./workMeasureResultFactorTab.vue`))
  },
  {
    name: 'resultInfo4',
    icon: 'groups',
    label: '금속류',
    unit: 'mg/m3',
    workAreaGradeCd: '4',
    component: defineAsyncComponent(() => import(`./workMeasureResultFactorTab.vue`))
  },
  {
    name: 'resultInfo6',
    icon: 'groups',
    label: '가스상물질류',
    unit: 'ppm',
    workAreaGradeCd: '6',
    component: defineAsyncComponent(() => import(`./workMeasureResultFactorTab.vue`))
  },
  {
    name: 'resultInfo3',
    icon: 'groups',
    label: '기타',
    unit: '',
    workAreaGradeCd: '3',
    component: defineAsyncComponent(() => import(`./workMeasureResultFactorTab.vue`))
  }
])
const tabHeight = computed(() => window.innerHeight - 190 + 'px')
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
  listUrl.value = selectConfig.sai.workmeas.result.factor.url
  // code setting
  // list setting
}
</script>

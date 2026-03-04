<template>
  <div>
    <c-tab
      type="vertical"
      tabClassVertical="leftTabAlign"
      :inlineLabel="true"
      :dense="true"
      align="left"
      :height="tabHeight"
      :tabItems="tabItems"
      :splitter="splitter"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component :is="tab.component" :popupParam="tab.param" :contentHeight="contentHeight" />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { surveyType } from './investigation'

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
  name: 'symptomSurveyStatusDetail'
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
  popupParam: {
    heaInvestigationPlanId: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      heaInvestigationPlanId: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const listUrl = ref('')
const tab = ref('')
const editable = ref(true)
const surveies = ref<Array<surveyType>>([])
const splitter = ref({ data: 120 })

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => {
  const _items: any[] = []
  if (surveies.value && surveies.value.length > 0) {
    _.forEach(surveies.value, (item: surveyType) => {
      _items.push({
        name: item.heaMuscleWorkerSurveyId,
        icon: '',
        label: item.userName,
        param: {
          heaMuscleWorkerSurveyId: item.heaMuscleWorkerSurveyId,
          readOnly: true
        },
        component: defineAsyncComponent(() => import(`./symptomSurveyDetail.vue`))
      })
    })
  }
  return _items
})
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) && props.contentHeight > 400 ? props.contentHeight + 'px' : '840px'
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
  listUrl.value = selectConfig.hea.muscleSystem.muscleSurvey.list.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 설문조사 결과 상세조회
 *******************************/
function getDetail() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { heaInvestigationPlanId: props.popupParam.heaInvestigationPlanId }
  }).then((_result: any) => {
    surveies.value = _result.data
    tab.value =
      surveies.value && surveies.value.length > 0 ? surveies.value[0].heaMuscleWorkerSurveyId : ''
  })
}
</script>

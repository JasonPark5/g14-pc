<template>
  <div class="q-pa-md" :style="[{ height: tabHeight }, { 'overflow-y': 'auto' }]">
    <q-timeline class="moc-timeline" color="green-4">
      <q-timeline-entry
        v-for="(item, idx) in items"
        :key="idx"
        :heading="item.heading"
        :class="{ 'q-pb-xs': item.heading }"
        :icon="item.icon"
      >
        <template v-if="item.title" v-slot:title>
          <b class="text-blue-14">[{{ item.title }}]</b>
        </template>
        <template v-if="item.subtitle" v-slot:subtitle>
          {{ item.subtitle }}
        </template>
        <q-slide-transition v-if="!item.heading">
          <div v-show="item.visible">
            <component :is="item.component" :param="param" @setAssessmentName="setAssessmentName" />
          </div>
        </q-slide-transition>
      </q-timeline-entry>
    </q-timeline>
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
  name: '4mOnePageDetail'
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
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    vendorFlag: boolean
  }
  height: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => ({
    ramRiskAssessmentPlanId: '',
    ramStepCd: '',
    vendorFlag: false
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
const assessmentName = ref('')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  const numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 600
  return numHeight + 'px'
})
const items = computed(() => {
  return [
    // 평가계획
    {
      title: $language('평가계획'),
      visible: true,
      component: defineAsyncComponent(() => import(`./timeline/4mPlanTL.vue`)),
      param: { disabled: true }
    },
    // 위험성 추정 및 결정
    {
      title: $language('위험성 추정 및 결정'),
      visible: true,
      component: defineAsyncComponent(() => import(`./timeline/4mScenarioTL.vue`)),
      param: { disabled: true }
    },
    // 감소대책 계획 및 실행
    {
      title: $language('감소대책 계획 및 실행'),
      visible: true,
      component: defineAsyncComponent(() => import(`./timeline/4mRiskRegisterTL.vue`)),
      param: { disabled: true }
    }
  ] as any
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
function setAssessmentName(_assessmentName: any) {
  assessmentName.value = _assessmentName
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

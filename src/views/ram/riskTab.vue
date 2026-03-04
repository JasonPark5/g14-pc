<template>
  <div>
    <template v-if="!param.vendorFlag">
      <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :key="tab.key"
            :riskReduce="riskReduce"
            :param="param"
            :height="height"
            @research="research"
          />
        </template>
      </c-tab>
    </template>
    <template v-else>
      <component
        :is="imprComponent"
        :riskReduce="riskReduce"
        :param="props.param"
        :height="props.height"
        @research="research"
      />
    </template>
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
  name: 'riskOnePage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

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
    ramTechniqueCd: stringNull
    searchRiskReduce: any | null | undefined
    searchScenario: any | null | undefined
    planUpdateBtnData: any | null | undefined
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
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      vendorFlag: false,
      ramTechniqueCd: '',
      searchRiskReduce: {
        flag: '',
        isSearch: false
      },
      searchScenario: {
        flag: '',
        isSearch: false
      },
      planUpdateBtnData: {
        title: '계획',
        flag: false,
        research: ''
      }
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
const tab = ref('impr')
const riskReduce = ref({
  imprs: [],
  riskbooks: []
}) as any

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  const numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 600
  return numHeight + 'px'
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/ram/4m/risk/4mImpr.vue`))
})
const tabItems = computed(() => {
  let imprComponent = null
  let riskComponent = null
  switch (props.param.ramTechniqueCd) {
    case 'RT00000001':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/hazop/risk/hazopImpr.vue`))
      riskComponent = defineAsyncComponent(
        () => import(`@views/ram/hazop/risk/hazopRiskRegister.vue`)
      )
      break // HAZOP
    case 'RT00000005':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/kpsr/risk/kpsrImpr.vue`))
      riskComponent = defineAsyncComponent(
        () => import(`@views/ram/kpsr/risk/kpsrRiskRegister.vue`)
      )
      break // K-PSR
    case 'RT00000010':
      imprComponent = defineAsyncComponent(
        () => import(`@views/ram/checklist/risk/checklistImpr.vue`)
      )
      riskComponent = defineAsyncComponent(
        () => import(`@views/ram/checklist/risk/checklistRiskRegister.vue`)
      )
      break // Check-list
    case 'RT00000015':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/jsa/risk/jsaImpr.vue`))
      riskComponent = defineAsyncComponent(() => import(`@views/ram/jsa/risk/jsaRiskRegister.vue`))
      break // JRA
    case 'RT00000020':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/kras/risk/krasImpr.vue`))
      riskComponent = defineAsyncComponent(
        () => import(`@views/ram/kras/risk/krasRiskRegister.vue`)
      )
      break // KRAS
    case 'RT00000025':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/4m/risk/4mImpr.vue`))
      riskComponent = defineAsyncComponent(() => import(`@views/ram/4m/risk/4mRiskRegister.vue`))
      break // 4M
    case 'RT00000030':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/charm/risk/charmImpr.vue`))
      riskComponent = defineAsyncComponent(
        () => import(`@views/ram/charm/risk/charmRiskRegister.vue`)
      )
      break // CHARM
    case 'RT00000035':
      imprComponent = defineAsyncComponent(() => import(`@views/ram/third/risk/thirdImpr.vue`))
      riskComponent = defineAsyncComponent(
        () => import(`@views/ram/third/risk/thirdRiskRegister.vue`)
      )
      break // 3단계 판단법
  }
  return [
    {
      key: uid(),
      name: 'impr',
      icon: 'construction',
      label: 'Punch List',
      component: imprComponent
    },
    {
      key: uid(),
      name: 'risk',
      icon: 'report_gmailerrorred',
      label: '위험등록부',
      component: riskComponent
    }
  ]
})
const listUrl = computed(() => {
  let url = null
  switch (props.param.ramTechniqueCd) {
    case 'RT00000001':
      url = selectConfig.ram.hazop.riskReduce.list.url
      break // HAZOP
    case 'RT00000005':
      url = selectConfig.ram.kpsr.riskReduce.list.url
      break // K-PSR
    case 'RT00000010':
      url = selectConfig.ram.checklist.riskReduce.list.url
      break // Check-list
    case 'RT00000015':
      url = selectConfig.ram.jsa.riskReduce.list.url
      break // JRA
    case 'RT00000020':
      url = selectConfig.ram.kras.riskReduce.list.url
      break // KRAS
    case 'RT00000025':
      url = selectConfig.ram.fm.riskReduce.list.url
      break // 4M
    case 'RT00000030':
      url = selectConfig.ram.charm.riskReduce.list.url
      break // CHARM
    case 'RT00000035':
      url = selectConfig.ram.third.riskReduce.list.url
      break // 3단계 판단법
  }
  return url
}) as any

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.searchRiskReduce.flag,
  () => {
    getList()
  }
)
watch(
  () => props.param.planUpdateBtnData.research,
  () => {
    getList()
  }
)

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
  getList()
}
/******************************
 * TODO (목적): 감소대책 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    _.extend(riskReduce.value, _result.data)
  })
}
/******************************
 * TODO (목적): 재조회
 *******************************/
function research() {
  emits('emitStep', {
    name: 'research',
    param: {
      place: 'riskReduce'
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

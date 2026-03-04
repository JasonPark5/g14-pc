<template>
  <div>
    <div class="col float-right">
      <q-btn-group outline>
        <c-btn label="출력" icon="print" @btnClicked="print" />
      </q-btn-group>
    </div>
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component :is="tab.component" :key="tab.key" :param="param" :task="task" height="750px" />
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
  name: 'riskTab'
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
    assessmentName?: stringNull
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
      assessmentName: '',
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
  height: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('onepage')
const task = ref({
  insertUrl: '',
  deleteUrl: ''
}) as any
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  const numHeight = Number(_.replace(props.height, 'px', ''))
  return !isNaN(numHeight) && numHeight > 500 ? numHeight - 25 + 'px' : '500px'
})
const tabItems = computed(() => {
  let oneComponent = null
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP
    oneComponent = defineAsyncComponent(() => import(`@views/ram/hazop/hazopOnePageDetail.vue`))
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR
    oneComponent = defineAsyncComponent(() => import(`@views/ram/kpsr/kpsrOnePageDetail.vue`))
  } else if (props.param.ramTechniqueCd === 'RT00000010') {
    // Check-list
    oneComponent = defineAsyncComponent(
      () => import(`@views/ram/checklist/checklistOnePageDetail.vue`)
    )
  } else if (props.param.ramTechniqueCd === 'RT00000015') {
    // JRA
    oneComponent = defineAsyncComponent(() => import(`@views/ram/jsa/jsaOnePageDetail.vue`))
  } else if (props.param.ramTechniqueCd === 'RT00000020') {
    // KRAS
    oneComponent = defineAsyncComponent(() => import(`@views/ram/kras/krasOnePageDetail.vue`))
  } else if (props.param.ramTechniqueCd === 'RT00000025') {
    // 4M
    oneComponent = defineAsyncComponent(() => import(`@views/ram/4m/4mOnePageDetail.vue`))
  } else if (props.param.ramTechniqueCd === 'RT00000030') {
    // CHARM
    oneComponent = defineAsyncComponent(() => import(`@views/ram/charm/charmOnePageDetail.vue`))
  } else if (props.param.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    oneComponent = defineAsyncComponent(() => import(`@views/ram/third/thirdOnePageDetail.vue`))
  }
  const items = [
    {
      key: '1',
      name: 'onepage',
      icon: 'plagiarism',
      label: '한눈에 보기',
      component: oneComponent
    },
    {
      key: '2',
      name: 'education',
      icon: 'edit_calendar',
      label: '관련 교육',
      component: defineAsyncComponent(() => import(`@views/ram/riskEducation.vue`))
    },
    // { key: '3', name: 'nearmiss', icon: 'local_hospital', label: '관련<br/>아차사고', component: () => import(`${'@/pages/ram/riskNearmissAccident.vue'}`) },
    // { key: '4', name: 'patrol', icon: 'directions_walk', label: '관련<br/>순회점검', component: () => import(`${'@/pages/ram/riskPatrol.vue'}`) },
    {
      key: '5',
      name: 'status',
      icon: 'equalizer',
      label: '통계',
      component: defineAsyncComponent(() => import(`@views/ram/riskStatus.vue`))
    }
  ]
  if (props.param.vendorFlag) {
    items.splice(1, 1)
  }
  return items
})
const printUrl = computed(() => {
  let url = null
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP
    url = selectConfig.ram.hazop.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR
    url = selectConfig.ram.kpsr.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000010') {
    // Check-list
    url = selectConfig.ram.checklist.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000015') {
    // JRA
    url = selectConfig.ram.jsa.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000020') {
    // KRAS
    url = selectConfig.ram.kras.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000025') {
    // 4M
    url = selectConfig.ram.fm.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000030') {
    // CHARM
    url = selectConfig.ram.charm.print.url
  } else if (props.param.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    url = selectConfig.ram.third.print.url
  }
  return url
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
  task.value.insertUrl = transactionConfig.ram.assessPlan.task.insert.url
  task.value.deleteUrl = transactionConfig.ram.assessPlan.task.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 출력
 *******************************/
function print() {
  $http({
    url: $format(selectConfig.ram.assessPlan.get.url, props.param.ramRiskAssessmentPlanId),
    method: 'GET'
  }).then((_result: any) => {
    props.param.assessmentName = _result.data.assessmentName
  })

  $http({
    url: $format(printUrl.value, props.param.ramRiskAssessmentPlanId),
    method: 'GET'
  }).then((_result: any) => {
    let preffix = ''
    switch (props.param.ramTechniqueCd) {
      case 'RT00000001':
        preffix = 'HAZOP_'
        break
      case 'RT00000005':
        preffix = 'K-PSR_'
        break
      case 'RT00000010':
        preffix = 'CheckList_'
        break
      case 'RT00000015':
        preffix = 'JRA_'
        break
      case 'RT00000020':
        preffix = 'KRAS_'
        break
      case 'RT00000025':
        preffix = '4M_'
        break
      case 'RT00000030':
        preffix = 'CHARM_'
        break
      case 'RT00000035':
        preffix = '3단계판단법_'
        break
    }
    const fileOrgNm = preffix + props.param.assessmentName + '_' + getToday() + '.xlsx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

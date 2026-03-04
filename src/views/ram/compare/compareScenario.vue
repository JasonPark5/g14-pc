<template>
  <c-table
    ref="table"
    title="위험성평가 시나리오 비교 목록"
    :columns="gridColumns(ramTechniqueCd)"
    :data="grid.data"
    :merge="gridMerge(ramTechniqueCd)"
    :editable="false"
    @rowClick="rowClick"
  >
    <template v-slot:customArea="{ props, col }">
      <template v-if="col.name === 'customCol'">
        <component
          :is="imprComponent"
          :col="col"
          :props="props"
          :inputEditable="false"
          :requestContentsCols="imprProps(ramTechniqueCd).requestContentsCols"
          :tableKey="imprProps(ramTechniqueCd).tableKey"
          :ibmTaskTypeCd="imprProps(ramTechniqueCd).ibmTaskTypeCd"
          :ibmTaskUnderTypeCd="imprProps(ramTechniqueCd).ibmTaskUnderTypeCd"
        />
      </template>
      <template v-else-if="col.name === 'ramRiskLevelName'">
        <q-chip :style="`color:${props.row.riskColor};`" outline square>
          {{ props.row[col.name] }}
        </q-chip>
      </template>
    </template>
  </c-table>
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
import { gridColumns, gridMerge, imprProps } from '@/views/ram/reCheckComp'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'compareScenario'
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
const charmTypeName = ref('')
const ramTechniqueCd = ref('')
const ramRiskAssessmentPlanId = ref('')
const processCd = ref('')
const psiDiagramId = ref('')
const nodeNo = ref('')
const jobName = ref('')
const ramCheckItemClassCd = ref('')
const checkItemName = ref('')
const grid = ref({
  data: []
})
const imprComponent = ref(defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`)))
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const listUrl = computed(() => {
  let url = ''
  if (ramTechniqueCd.value === 'RT00000001') {
    // HAZOP 아직..
    url = selectConfig.ram.hazop.compare.url
  } else if (ramTechniqueCd.value === 'RT00000005') {
    // K-PSR
    url = selectConfig.ram.kpsr.compare.url
  } else if (ramTechniqueCd.value === 'RT00000010') {
    // Check-list 아직..
    url = selectConfig.ram.checklist.compare.url
  } else if (ramTechniqueCd.value === 'RT00000015') {
    // JRA
    url = selectConfig.ram.jsa.compare.url
  } else if (ramTechniqueCd.value === 'RT00000020') {
    // KRAS
    url = selectConfig.ram.kras.compare.url
  } else if (ramTechniqueCd.value === 'RT00000025') {
    // 4M
    url = selectConfig.ram.fm.compare.url
  } else if (ramTechniqueCd.value === 'RT00000030') {
    // CHARM 아직..
    if (charmTypeName.value === 'estimation') url = selectConfig.ram.charm.compare.estimation.url
    else url = selectConfig.ram.charm.compare.result.url
    // url = selectConfig.ram.fm.compare.url
  } else if (ramTechniqueCd.value === 'RT00000035') url = selectConfig.ram.third.compare.url // 3단계 판단법
  return url
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  window.addEventListener('beforeunload', evtClose)
  init()
})
onBeforeUnmount(() => {
  alert(1)
  if (window.opener) (window.opener as any).g_winPopup = null
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
  if (window.opener) (window.opener as any).g_winPopup = window
  const query = window.location.search
  if (!query) {
    let nativeUrl = window.location.href
    nativeUrl = nativeUrl.replace('/#', '')
    const url = new URL(nativeUrl)
    const urlParams = url.searchParams

    ramTechniqueCd.value = urlParams.get('ramTechniqueCd') || ''
    charmTypeName.value = urlParams.get('charmTypeName') || ''
    ramRiskAssessmentPlanId.value = urlParams.get('ramRiskAssessmentPlanId') || ''
    processCd.value = urlParams.get('processCd') || ''
    psiDiagramId.value = urlParams.get('psiDiagramId') || ''
    nodeNo.value = urlParams.get('nodeNo') || ''
    jobName.value = urlParams.get('jobName') || ''
    ramCheckItemClassCd.value = urlParams.get('ramCheckItemClassCd') || ''
    checkItemName.value = urlParams.get('checkItemName') || ''
  } else {
    const param = new URLSearchParams(query)
    if (param) {
      ramTechniqueCd.value = param.get('ramTechniqueCd') || ''
      charmTypeName.value = param.get('charmTypeName') || ''
      ramRiskAssessmentPlanId.value = param.get('ramRiskAssessmentPlanId') || ''
      processCd.value = param.get('processCd') || ''
      psiDiagramId.value = param.get('psiDiagramId') || ''
      nodeNo.value = param.get('nodeNo') || ''
      jobName.value = param.get('jobName') || ''
      ramCheckItemClassCd.value = param.get('ramCheckItemClassCd') || ''
      checkItemName.value = param.get('checkItemName') || ''
    }
  }
  // list setting
  getList()
}

function getList() {
  // 선택된 위험성평가 정보가 있는 경우
  if (ramRiskAssessmentPlanId.value && ramRiskAssessmentPlanId.value) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        ramRiskAssessmentPlanId: ramRiskAssessmentPlanId.value,
        processCd: processCd.value,
        psiDiagramId: psiDiagramId.value,
        nodeNo: nodeNo.value,
        jobName: jobName.value,
        ramCheckItemClassCd: ramCheckItemClassCd.value,
        checkItemName: checkItemName.value
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
function rowClick(_row?: any) {
  if (!window.opener) return
  // let sendStr = JSON.stringify( sendObj )
  // 부모 창에 Message를 보냄
  // window.opener.postMessage(_row, '*')
  window.opener?.receiveDataFromChild(_row)
}
function evtClose(): string {
  if (window.opener) window.opener.postMessage('CLOSE', '*')
  // e.preventDefault()
  // e.returnValue = ''
  return 'bye'
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

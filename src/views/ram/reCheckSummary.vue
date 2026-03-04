<template>
  <!-- 위험성평가 시나리오 종합 목록 -->
  <c-table
    ref="table"
    title="위험성평가 시나리오 종합 목록"
    :columns="gridColumnsComp"
    :data="summary.data"
    :merge="gridMergeComp"
    :gridHeight="grid.height"
    rowKey="processCd"
    selection="multiple"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn label="선택" icon="check" @btnClicked="select" />
      </q-btn-group>
    </template>
    <template v-slot:customArea="{ props, col }">
      <template v-if="col.name === 'customCol'">
        <component
          :is="imprComponent"
          :col="col"
          :props="props"
          :inputEditable="false"
          :isImmShow="false"
          :requestContentsCols="imprPropsComp.requestContentsCols"
          :tableKey="imprPropsComp.tableKey"
          :ibmTaskTypeCd="imprPropsComp.ibmTaskTypeCd"
          :ibmTaskUnderTypeCd="imprPropsComp.ibmTaskUnderTypeCd"
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
import { gridColumns, gridMerge, imprProps } from './reCheckComp'

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
  name: 'reCheckSummary'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    ramRiskAssessmentPlanId: stringNull
    ramTechniqueCd: stringNull
  }
  summary: {
    data: Array<any>
  }
  ramRiskAssessmentPlanIds: Array<any>
  charmTypeName: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    ramRiskAssessmentPlanId: '',
    ramTechniqueCd: ''
  }),
  summary: () => ({
    data: []
  }),
  ramRiskAssessmentPlanIds: [] as any,
  charmTypeName: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)

const grid = ref({
  height: '550px',
  data: []
})
const imprComponent = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridColumnsComp = computed(() => {
  return gridColumns(props.popupParam.ramTechniqueCd)
})
const gridMergeComp = computed(() => {
  return gridMerge(props.popupParam.ramTechniqueCd)
})
const imprPropsComp = computed(() => {
  return imprProps(props.popupParam.ramTechniqueCd)
})

const listUrl = computed(() => {
  let url = ''
  if (props.popupParam.ramTechniqueCd === 'RT00000001') {
    // HAZOP 아직..
    url = selectConfig.ram.hazop.summary.url
  } else if (props.popupParam.ramTechniqueCd === 'RT00000005') {
    // K-PSR
    url = selectConfig.ram.kpsr.summary.url
  } else if (props.popupParam.ramTechniqueCd === 'RT00000010') {
    // Check-list 아직..
    url = selectConfig.ram.checklist.summary.url
  } else if (props.popupParam.ramTechniqueCd === 'RT00000015') {
    // JRA
    url = selectConfig.ram.jsa.summary.url
  } else if (props.popupParam.ramTechniqueCd === 'RT00000020') {
    // KRAS
    url = selectConfig.ram.kras.summary.url
  } else if (props.popupParam.ramTechniqueCd === 'RT00000025') {
    // 4M
    url = selectConfig.ram.fm.summary.url
  } else if (props.popupParam.ramTechniqueCd === 'RT00000030') {
    // CHARM
    url = selectConfig.ram.charm.summary.result.url
    // if (this.charmTypeName === 'estimation') {
    //   url = selectConfig.ram.charm.summary.estimation.url
    // } else {
    //   url = selectConfig.ram.charm.summary.result.url
    // }
  } else if (props.popupParam.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    url = selectConfig.ram.third.summary.url
  }
  return url
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.ramRiskAssessmentPlanIds,
  () => {
    getList()
  },
  { deep: true }
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
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  // 선택된 위험성평가 정보가 있는 경우
  if (props.ramRiskAssessmentPlanIds && props.ramRiskAssessmentPlanIds.length > 0) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        ramRiskAssessmentPlanId: props.popupParam.ramRiskAssessmentPlanId,
        ramRiskAssessmentPlanIds: props.ramRiskAssessmentPlanIds
      }
    }).then((_result: any) => {
      props.summary.data = _result.data
    })
  } else {
    props.summary.data = []
  }
}
/******************************
 * TODO (목적): 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData, props.summary.data)
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

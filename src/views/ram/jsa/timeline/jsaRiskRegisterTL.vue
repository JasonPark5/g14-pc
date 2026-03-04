<template>
  <div>
    <c-table
      ref="tableRisk"
      title="위험등록부 목록"
      tableId="riskRegister01"
      :columns="gridRisk.columns"
      :data="riskReduce.riskbooks"
      :merge="gridRisk.merge"
      gridHeightAuto
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'riskHazardPicture'">
          <q-icon
            style="font-size: 30px; cursor: pointer"
            class="text-success"
            name="image"
            @click.stop="openHazardPicture(props)"
          />
        </template>
        <template v-else-if="col.name === 'picture'">
          <q-icon
            style="font-size: 30px; cursor: pointer"
            class="text-primary"
            name="image"
            @click.stop="openImprPicture(props)"
          />
        </template>
        <template v-else-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="false"
            :requestContentsCols="requestContentsCols"
            tableKey="ramJsaAssessScenarioId"
            ibmTaskTypeCd="ITT0000015"
            ibmTaskUnderTypeCd="ITTU000020"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
    <c-table
      ref="tableImpr"
      title="개선 목록"
      :columns="gridImpr.columns"
      :data="riskReduce.imprs"
      :merge="gridImpr.merge"
      gridHeightAuto
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'riskHazardPicture'">
          <q-icon
            style="font-size: 30px; cursor: pointer"
            class="text-success"
            name="image"
            @click.stop="openHazardPicture(props)"
          />
        </template>
        <template v-else-if="col.name === 'picture'">
          <q-icon
            style="font-size: 30px; cursor: pointer"
            class="text-primary"
            name="image"
            @click.stop="openImprPicture(props)"
          />
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
  name: 'jsaRiskRegisterTL'
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
  }
  height?: stringNull
}
interface gridType {
  columns: tableColumnType
  data?: Array<any>
  height?: stringNull
  merge?: tableMergeType
  highLightInfo?: any
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
      ramStepCd: ''
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
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const tableRisk = ref<any>(null)
const tableImpr = ref<any>(null)
const imprData = ref<any>(null)
const listUrl = ref('')
const riskReduce = ref({
  imprs: [],
  riskbooks: []
}) as any
const gridRisk = ref<gridType>({
  merge: [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'processJob' },
    { index: 2, colName: 'processJobStep' },
    { index: 3, colName: 'processJobStepHazard' },
    { index: 4, colName: 'processJobStepHazard' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '작업',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'jobStepName',
      field: 'jobStepName',
      description: 'jobStepDesc',
      label: '작업단계',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'riskHazardPicture',
      field: 'riskHazardPicture',
      label: '사진',
      align: 'center',
      style: 'width:40px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '분류-유해위험요인',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'relationLaw',
      field: 'relationLaw',
      label: '관련법규',
      align: 'left',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'riskOccurrenceCause',
      field: 'riskOccurrenceCause',
      label: '원인',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'riskOccurrenceResult',
      field: 'riskOccurrenceResult',
      label: '결과',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'currentSafetyMeasures',
      field: 'currentSafetyMeasures',
      label: '현재안전조치',
      align: 'left',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'before',
      field: 'before',
      label: '개선전',
      align: 'center',
      child: [
        {
          name: 'beforeFrequency',
          field: 'beforeFrequency',
          label: '빈도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'beforeStrength',
          field: 'beforeStrength',
          label: '강도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'beforeRisk',
          field: 'beforeRisk',
          label: '위험도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        }
      ]
    },
    {
      name: 'picture',
      field: 'picture',
      label: '개선 전/후 사진',
      align: 'center',
      type: 'custom',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'improvementMeasures',
      field: 'improvementMeasures',
      label: '개선대책',
      align: 'left',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선진행',
      align: 'center',
      child: [
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:150px',
          type: 'custom',
          sortable: false
        }
      ]
    },
    {
      name: 'after',
      field: 'after',
      label: '개선후',
      align: 'center',
      child: [
        {
          name: 'afterFrequency',
          field: 'afterFrequency',
          label: '빈도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'afterStrength',
          field: 'afterStrength',
          label: '강도',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: 'afterRisk',
          field: 'afterRisk',
          label: '위험도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        }
      ]
    },
    {
      name: 'assessDate',
      field: 'assessDate',
      label: '평가일',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'assessUserName',
      field: 'assessUserName',
      label: '평가자',
      align: 'center',
      style: 'width:80px',
      sortable: false
    }
  ],
  data: [],
  height: 'auto' //'500px'
})
const gridImpr = ref<gridType>({
  merge: [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'processJob' },
    { index: 2, colName: 'processJobStep' },
    { index: 3, colName: 'processJobStepHazard' },
    { index: 4, colName: 'processJobStepHazard' },
    { index: 5, colName: 'ramJsaAssessScenarioId' },
    { index: 6, colName: 'ramJsaAssessScenarioId' },
    { index: 7, colName: 'ramJsaAssessScenarioId' },
    { index: 8, colName: 'ramJsaAssessScenarioId' },
    { index: 9, colName: 'ramJsaAssessScenarioId' }
  ],
  columns: [],
  height: '500px'
})
/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['jobStepName', 'riskHazardNameClass', 'riskOccurrenceCause']
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
  listUrl.value = selectConfig.ram.jsa.riskReduce.list.url
  // code setting
  getStepItems('IBM_STEP_CD').then((_result: any) => {
    gridImpr.value.columns = [
      {
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'jobStepName',
        field: 'jobStepName',
        description: 'jobStepDesc',
        label: '작업단계',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'riskHazardPicture',
        field: 'riskHazardPicture',
        label: '사진',
        align: 'center',
        style: 'width:40px',
        sortable: false,
        type: 'custom'
      },
      {
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '분류-유해위험요인',
        align: 'left',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'riskOccurrenceCause',
        field: 'riskOccurrenceCause',
        label: '원인',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'riskOccurrenceResult',
        field: 'riskOccurrenceResult',
        label: '결과',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'picture',
        field: 'picture',
        label: '개선 전/후 사진',
        align: 'center',
        type: 'custom',
        style: 'width:70px',
        sortable: false
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '개선대책',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'ibmTitle',
        field: 'ibmTitle',
        label: '제목',
        align: 'left',
        type: 'link',
        style: 'width:240px',
        sortable: true
      },
      {
        name: 'ibmStepCd',
        field: 'ibmStepCd',
        label: '진행상태',
        align: 'center',
        style: 'width:80px',
        type: 'tag',
        colorItems: _result,
        sortable: false
      },
      {
        name: 'improveRequest',
        field: 'improveRequest',
        label: '요청부서정보',
        align: 'center',
        style: 'width:250px',
        sortable: true
      },
      {
        name: 'actionCompleteRequestDate',
        field: 'actionCompleteRequestDate',
        label: '조치완료요청일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'actionDeptName',
        field: 'actionDeptName',
        label: '조치부서',
        align: 'center',
        style: 'width:100px',
        sortable: true
      }
    ]
  })
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    riskReduce.value = _result.data
  })
}
function imprChange() {
  tableRisk.value.compoTable.resetVirtualScroll()
}
function linkClick(_row: any) {
  imprData.value = _row
  popupOptions.value.title = '개선'
  popupOptions.value.param = {
    sopImprovementId: _row.sopImprovementId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/sop/ibm/imprDetail.vue'))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function closeImprPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.col1) {
    _.extend(imprData.value, _result.col1)
    tableImpr.value.compoTable.resetVirtualScroll()
  }
}
function openHazardPicture(_props: any) {
  popupOptions.value.title = '유해위험요인 사진'
  popupOptions.value.param = {
    ramRiskHazardId: _props.row.ramRiskHazardId,
    disabled: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/base/riskHazardPicture.vue'))
  )
  popupOptions.value.width = '50%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeHazardPicturePopup
}
function closeHazardPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function openImprPicture(_props: any) {
  popupOptions.value.title = '개선 전/후 사진'
  popupOptions.value.param = {
    ramJsaAssessScenarioId: _props.row.ramJsaAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    disabled: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/jsa/action/jsaScenarioImprPicture.vue'))
  )
  popupOptions.value.width = '60%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeScenarioImprPicturePopup
}
function closeScenarioImprPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

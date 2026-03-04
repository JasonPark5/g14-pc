<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="table"
        title="개선 목록"
        :columns="gridImpr.columns"
        :data="riskReduce.imprs"
        :merge="gridImpr.merge"
        :gridHeight="setheight"
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
    </div>
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
  name: '4mImpr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  riskReduce: {
    imprs: Array<any>
    riskbooks: Array<any>
  }
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
interface gridType {
  columns: tableColumnType
  data: Array<any>
  height: string
  merge: tableMergeType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  riskReduce: () => {
    return {
      imprs: [],
      riskbooks: []
    }
  },
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
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const imprData = ref(null)
const gridImpr = ref<gridType>({
  merge: [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'groupMdmSopId' },
    { index: 2, colName: 'ram4mRiskHazardClassGroup' },
    { index: 3, colName: 'ram4mAssessScenarioId' },
    { index: 4, colName: 'ram4mAssessScenarioId' },
    { index: 5, colName: 'ram4mAssessScenarioId' },
    { index: 6, colName: 'ram4mAssessScenarioId' },
    { index: 7, colName: 'ram4mAssessScenarioId' },
    { index: 8, colName: 'ram4mAssessScenarioId' }
  ],
  columns: [],
  data: [],
  height: '500px'
})
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const setheight = computed(() => {
  const pxRemove = props.height.replace('px', '')
  return props.height && props.height.indexOf('px') > -1 && !isNaN(pxRemove)
    ? Number(pxRemove) - 60 + 'px'
    : '500px'
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
  setHeader()
  // list setting
}

function setHeader() {
  if (!props.param.vendorFlag) {
    getStepItems('IBM_STEP_CD').then((_result: any) => {
      gridImpr.value.columns = [
        {
          name: 'processName',
          field: 'processName',
          label: '공정',
          align: 'left',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'jobName',
          field: 'jobName',
          label: '작업',
          align: 'left',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'ram4mRiskHazardClassName',
          field: 'ram4mRiskHazardClassName',
          label: '평가구분(4M)',
          align: 'center',
          style: 'width:90px',
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
          label: '유해위험요인',
          align: 'left',
          style: 'width:170px',
          sortable: false
        },
        {
          name: 'relationLaw',
          field: 'relationLaw',
          label: '관련법규',
          align: 'left',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'damageTargetName',
          field: 'damageTargetName',
          label: '피해대상',
          align: 'left',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'damageTypeName',
          field: 'damageTypeName',
          label: '재해형태',
          align: 'left',
          style: 'width:90px',
          sortable: false
        },
        {
          name: 'existingRiskManagementActivities',
          field: 'existingRiskManagementActivities',
          label: '현재안전조치',
          align: 'left',
          style: 'width:180px',
          sortable: false
        },
        {
          name: 'picture',
          field: 'picture',
          label: '개선 전/후 사진',
          align: 'center',
          type: 'custom',
          style: 'width:60px',
          sortable: false
        },
        {
          name: 'addingRiskManagementActivities',
          field: 'addingRiskManagementActivities',
          label: '추가 리스크관리 계획',
          align: 'left',
          style: 'width:180px',
          sortable: false
        },
        {
          name: 'ibmTitle',
          field: 'ibmTitle',
          label: '제목',
          align: 'left',
          type: 'link',
          style: 'width:200px',
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
          name: 'improveRequestDeptName',
          field: 'improveRequestDeptName',
          label: '요청부서',
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
        },
        {
          name: 'actionCompleteRequestDate',
          field: 'actionCompleteRequestDate',
          label: '조치완료요청일',
          align: 'center',
          style: 'width:100px',
          sortable: true
        }
      ]
    })
  } else {
    gridImpr.value.columns = [
      {
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'left',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'ram4mRiskHazardClassName',
        field: 'ram4mRiskHazardClassName',
        label: '평가구분(4M)',
        align: 'center',
        style: 'width:90px',
        sortable: false
      },
      {
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '유해위험요인',
        align: 'left',
        style: 'width:170px',
        sortable: false,
        type: 'custom'
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'damageTargetName',
        field: 'damageTargetName',
        label: '피해대상',
        align: 'left',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'damageTypeName',
        field: 'damageTypeName',
        label: '재해형태',
        align: 'left',
        style: 'width:90px',
        sortable: false
      },
      {
        name: 'existingRiskManagementActivities',
        field: 'existingRiskManagementActivities',
        label: '현재안전조치',
        align: 'left',
        style: 'width:180px',
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
        name: 'addingRiskManagementActivities',
        field: 'addingRiskManagementActivities',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:180px',
        sortable: false
      },
      {
        name: 'ibmTitle',
        field: 'ibmTitle',
        label: '제목',
        align: 'left',
        type: 'link',
        style: 'width:300px',
        sortable: true
      },
      {
        name: 'stepFlagName',
        field: 'stepFlagName',
        label: '진행상태',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'actionCompleteDate',
        field: 'actionCompleteDate',
        label: '조치일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      }
    ]
  }
}
function research() {
  emits('research')
}
function linkClick(_row: any, _col: any, _index: any) {
  imprData.value = _row
  popupOptions.value.title = '개선'
  if (!props.param.vendorFlag) {
    popupOptions.value.param = {
      sopImprovementId: _row.sopImprovementId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.param = {
      ram4mAssessImprId: _row.ram4mAssessImprId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/4m/risk/4mImprRiskReduceDetail.vue`))
    )
  }
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
    table.value.compoTable.resetVirtualScroll()
    research()
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
    ram4mAssessScenarioId: _props.row.ram4mAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    ram4mAssessImprIds: _props.row.ram4mAssessImprIds,
    disabled: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/4m/action/4mScenarioImprPicture.vue`))
  )
  popupOptions.value.width = '60%'
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

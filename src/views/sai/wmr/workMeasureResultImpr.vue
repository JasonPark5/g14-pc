<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="유해인자별 개선목록"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="300px"
          :columnSetting="false"
          :usePaging="false"
          :filtering="false"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'customCol'">
              <component
                :is="imprComponent"
                :col="col"
                :props="props"
                :inputEditable="false"
                :isImmShow="true"
                ibmTaskTypeCd="ITT0000175"
                ibmTaskUnderTypeCd="ITTU000200"
                @imprChange="imprChange"
              />
            </template>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="tableImpr"
          title="유해인자외 개선 목록"
          :columns="gridImpr.columns"
          :data="gridImpr.data"
          gridHeight="300px"
          :usePaging="false"
          :filtering="false"
          :columnSetting="false"
          @linkClick="linkClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled && workMeasure.workMeasurementPlanId"
                label="개선요청"
                :showLoading="false"
                icon="add"
                @btnClicked="addImpr(1)"
              />
              <c-btn
                v-if="editable && !disabled && workMeasure.workMeasurementPlanId"
                label="즉시조치"
                :showLoading="false"
                icon="add"
                @btnClicked="addImpr(2)"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
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
  name: 'workMeasureResultImpr'
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
  contentHeight: stringNull
  workMeasure: {
    workMeasurementPlanId: stringNull
    plantCd?: stringNull
    updateFlag?: stringNull
    measPlanContent?: stringNull
  }
  tabParam: {
    title: stringNull
    hazardClassFstCd: stringNull
  }
  disabled: boolean
  updateMode: boolean
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  workMeasure: () => {
    return {
      workMeasurementPlanId: '',
      plantCd: '',
      updateFlag: '',
      measPlanContent: ''
    }
  },
  tabParam: () => {
    return {
      title: '화학적인자',
      hazardClassFstCd: 'HCF0000005'
    }
  },
  disabled: false,
  updateMode: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '100%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'processCd',
      field: 'processCd',
      label: '단위사업체명',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서 및 업체',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'workPlace',
      field: 'workPlace',
      label: '단위작업장소',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'workAreaGradeName',
      field: 'workAreaGradeName',
      label: '구분',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'hazardCd',
      field: 'hazardCd',
      label: '유해인자',
      align: 'center',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:200px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const gridImpr = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'ibmClassName',
      field: 'ibmClassName',
      label: '구분',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'actionContents',
      field: 'actionContents',
      label: '조치내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteDate',
      field: 'actionCompleteDate',
      label: '조치완료일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const getUrl = ref('')
const impListUrl = ref('')
const table = ref<any>(null)
const tableImpr = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// 개선요청 Component
const imprComponent = computed(() =>
  markRaw(defineAsyncComponent(() => import(`@/views/common/ibm/tableImpr.vue`)))
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.workMeasure.workMeasurementPlanId,
  () => {
    getList()
  }
)
watch(
  () => props.workMeasure.updateFlag,
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
  getUrl.value = selectConfig.sai.workmeas.result.impr.url
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  // code setting
  // list setting
  getList()
  getImpList()
}

/******************************
 * TODO (목적): 유해인자별 / 유해인자외 개선목록 조회
 *******************************/
function getList() {
  $http({
    url: getUrl.value,
    method: 'GET',
    params: { workMeasurementPlanId: props.workMeasure.workMeasurementPlanId }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function getImpList() {
  if (props.workMeasure.workMeasurementPlanId) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: 'ITT0000175',
        ibmTaskUnderTypeCd: 'ITTU000195',
        relationTableKey: props.workMeasure.workMeasurementPlanId
      }
    }).then((_result: any) => {
      gridImpr.value.data = _result.data
    })
  }
}

/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.param = { sopImprovementId: row.sopImprovementId }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
  if (row.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
    )
  }
}
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
  getImpList()
}

/******************************
 * TODO (목적): 개선요청 or 즉시조치 요청
 *******************************/
function addImpr(num?: numberNull) {
  popupOptions.value.title = num === 1 ? '개선요청' : '즉시조치'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () =>
        import(num === 1 ? `@/views/sop/ibm/imprDetail.vue` : `@/views/sop/ibm/imprImmDetail.vue`)
    )
  )
  popupOptions.value.param = {
    requestContents: props.workMeasure.measPlanContent,
    relationTableKey: props.workMeasure.workMeasurementPlanId,
    ibmTaskTypeCd: 'ITT0000175',
    ibmTaskUnderTypeCd: 'ITTU000195'
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
</script>

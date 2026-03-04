<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="itemTable"
        title="점검항목별 개선목록"
        tableId="grid"
        :columnSetting="false"
        :usePaging="false"
        :filtering="false"
        :hideBottom="true"
        :columns="grid.columns"
        :data="grid.data"
        :gridHeight="itemGridHeight"
      >
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <component
              :is="imprComponent"
              :col="col"
              :props="props"
              :inputEditable="false"
              :isImmShow="true"
              :requestContentsCols="requestContentsCols"
              tableKey="jointInspectionResultId"
              ibmTaskTypeCd="ITT0000165"
              ibmTaskUnderTypeCd="ITTU000180"
              @imprChange="imprChange"
            />
          </template>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="imprTable"
        title="항목외 개선 목록"
        :columns="gridImpr.columns"
        :data="gridImpr.data"
        :usePaging="false"
        :filtering="false"
        :columnSetting="false"
        :gridHeight="etcGridHeight"
        @linkClick="etcLinkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              label="개선요청"
              :showLoading="false"
              icon="add"
              @btnClicked="addImpr"
            />
            <c-btn
              v-if="editable"
              label="즉시조치"
              :showLoading="false"
              icon="add"
              @btnClicked="addiimImpr"
            />
          </q-btn-group>
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
import { consolidationCheckPopupParamType } from './consolidationCheck'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'consolidationCheckImpr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  popupParam: consolidationCheckPopupParamType
  isOld: boolean
  renewal: stringNull
  contentHeight: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      saiJointInspectionId: ''
    }
  },
  isOld: false,
  renewal: '',
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const requestImprRow = ref<any>(null)
const imprData = ref(null)
const impListUrl = ref('')
const getInfoUrl = ref('')
const itemTable = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'jointItemName',
      field: 'jointItemName',
      label: '점검항목',
      align: 'left',
      style: 'width:30%',
      sortable: false
    },
    {
      required: true,
      name: 'jointResultName',
      field: 'jointResultName',
      label: '점검결과',
      align: 'center',
      style: 'width:10%',
      sortable: false
    },
    {
      setHeader: true,
      name: 'jointContents',
      field: 'jointContents',
      label: '비고',
      align: 'left',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:300px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const gridImpr = ref({
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
/******************************
 * @Computed_선언
 *******************************/
const itemGridHeight = computed(() => String(Number(props.contentHeight) - 550) + 'px')
const etcGridHeight = computed(() => String(Number(props.contentHeight) - 500) + 'px')
const requestContentsCols = computed(() => ['jointItemName'])
const imprComponent = computed(() => {
  const components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  return components
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.renewal,
  () => {
    getDetail()
    getImpList()
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
  getInfoUrl.value = selectConfig.sai.joint.impr.url
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  // code setting
  // list setting

  getDetail()
  getImpList()
}
/******************************
 * TODO (목적): 개선 목록 조회
 *******************************/
function getDetail() {
  if (props.popupParam.saiJointInspectionId) {
    $http({
      url: getInfoUrl.value,
      method: 'GET',
      params: {
        saiJointInspectionId: props.popupParam.saiJointInspectionId
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 항목외 개선 목록 조회
 *******************************/
function getImpList() {
  if (props.popupParam.saiJointInspectionId) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: 'ITT0000165',
        ibmTaskUnderTypeCd: 'ITTU000175',
        relationTableKey: props.popupParam.saiJointInspectionId
      }
    }).then((_result: any) => {
      gridImpr.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 상세 팝업 조회
 *******************************/
function linkClick(data: any, row: any) {
  requestImprRow.value = row
  imprData.value = data
  if (data.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.param = {
      sopImprovementId: data.sopImprovementId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
    )
    popupOptions.value.width = '80%'
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeImprPopup
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.param = {
      sopImprovementId: data.sopImprovementId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
    )
    popupOptions.value.width = '80%'
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeImprPopup
  }
}
function etcLinkClick(row: any) {
  linkClick(row, row)
}
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImpList()
}
// 개선창 닫기 후
function imprChange() {
  itemTable.value.compoTable.resetVirtualScroll()
  getDetail()
  getImpList()
}
function addImpr() {
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: '합동점검',
    relationTableKey: props.popupParam.saiJointInspectionId,
    ibmTaskTypeCd: 'ITT0000165',
    ibmTaskUnderTypeCd: 'ITTU000175'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
function addiimImpr() {
  popupOptions.value.title = '즉시조치'
  popupOptions.value.param = {
    requestContents: '합동점검',
    relationTableKey: props.popupParam.saiJointInspectionId,
    ibmTaskTypeCd: 'ITT0000165',
    ibmTaskUnderTypeCd: 'ITTU000175'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
function closeAddImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImpList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

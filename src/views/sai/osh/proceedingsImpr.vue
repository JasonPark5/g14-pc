<template>
  <div>
    <c-table
      ref="refGrid2"
      title="개선요청"
      :columns="grid2.columns"
      :gridHeight="grid2.height"
      :data="proceeding.imprs"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      @linkClick="imprlinkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addImpr"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="refGrid1"
      title="즉시조치"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="proceeding.imprImms"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      @linkClick="immlinkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addImprImm"
          />
        </q-btn-group>
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
import { proceedingsType } from './proceedings'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'proceedingsImpr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    proceedingsId: stringNull
  }
  proceeding: proceedingsType
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
      proceedingsId: ''
    }
  },
  proceeding: () => {
    return {
      proceedingsId: '',
      plantCd: '',
      proceedingsDate: '',
      proceedingsContents: '',
      proceedingsTitle: '',
      regUserId: '',
      chgUserId: '',
      attendeeInModels: [],
      attendeeOutModels: [],
      deleteAttendeeInModels: [],
      deleteAttendeeOutModels: [],
      imprs: [],
      imprImms: []
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
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
  height: '400px'
})
const grid2 = ref<any>({
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
      name: 'improveRequestContents',
      field: 'improveRequestContents',
      label: '요청내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteRequestDate',
      field: 'actionCompleteRequestDate',
      label: '조치완료 요청일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  height: '400px'
})
const imprData = ref<any>(null)
const refGrid1 = ref<any>(null)
const refGrid2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

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
/******************************
 * TODO (목적): 즉시조치
 *******************************/
function addImprImm() {
  popupOptions.value.title = '즉시조치'
  popupOptions.value.param = {
    requestContents: props.proceeding.proceedingsTitle,
    relationTableKey: props.proceeding.proceedingsId,
    ibmTaskTypeCd: 'ITT0000225',
    ibmTaskUnderTypeCd: 'ITTU000255'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function addImpr() {
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: props.proceeding.proceedingsTitle,
    relationTableKey: props.proceeding.proceedingsId,
    ibmTaskTypeCd: 'ITT0000225',
    ibmTaskUnderTypeCd: 'ITTU000255'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  emits('getDetail')
}
/* eslint-disable no-unused-vars */
function immlinkClick(row: any) {
  imprData.value = row
  popupOptions.value.title = '즉시조치 상세'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.param = {
    sopImprovementId: row.sopImprovementId
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImmDetailPopup
}
function closeImmDetailPopup(result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    _.extend(imprData.value, result.col1)
    refGrid1.value.compoTable.resetVirtualScroll()
  }
  emits('getDetail')
}
function imprlinkClick(row: any) {
  imprData.value = row
  popupOptions.value.title = '개선'
  popupOptions.value.param = {
    sopImprovementId: row.sopImprovementId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprDetailPopup
}
function closeImprDetailPopup(result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    _.extend(imprData.value, result.col1)
    refGrid2.value.compoTable.resetVirtualScroll()
  }
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

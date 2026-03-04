<template>
  <div>
    <c-table
      ref="table"
      :title="imprTabInfo.gridItem.title"
      :columns="gridItemColumns"
      :gridHeight="gridHeight"
      :data="gridItemData"
      :merge="imprTabInfo.gridItem.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="!imprTabInfo.disabled"
      @linkClick="(row: any) => linkClick(row, row.ibmClassCd, row.sopImprovementId, 'item')"
    >
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['sopImprovementIds'] && props.row['ibmStepNames']">
          <q-chip
            v-for="(item, index) in ibmTagItems(props.row)"
            outline
            square
            :key="index"
            :color="item.color"
            :clickable="true"
            text-color="white"
            style="margin-bottom: 4px !important"
            @click="linkClick(props.row, item.ibmClassCd, item.sopImprovementId, 'item')"
          >
            {{ item.title }}
            <c-assess-tooltip :ibmTooltip="item.ibmTooltip" :ibmClassCd="item.ibmClassCd" />
          </q-chip>
        </template>
      </template>
    </c-table>
    <c-table
      ref="tableOther"
      :title="imprTabInfo.gridOther.title"
      :columns="gridOther.columns"
      :data="gridOther.data"
      :gridHeight="gridHeight"
      :usePaging="false"
      :filtering="false"
      :columnSetting="false"
      @linkClick="(row: any) => linkClick(row, row.ibmClassCd, row.sopImprovementId, 'other')"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="!imprTabInfo.disabled && imprTabInfo.isOld"
            label="개선요청"
            icon="add"
            @btnClicked="addImpr"
          />
          <c-btn
            v-if="!imprTabInfo.disabled && imprTabInfo.isOld"
            label="즉시조치"
            icon="add"
            @btnClicked="addImmImpr"
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
import { ibmTagItems } from '@utils/common'

import { imprTabInfoType } from './imprTab'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprTab'
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
  imprTabInfo: imprTabInfoType
  disabled?: boolean
  contentHeight?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  imprTabInfo: () => {
    return {
      key: '',
      ibmTaskTypeCd: '',
      ibmTaskUnderTypeCd: '',
      requestContents: '',
      disabled: false,
      isOld: false,
      isTable: false,
      gridItem: {
        listUrl: '',
        param: null,
        title: '항목 별 개선사항 목록',
        data: [],
        merge: [],
        columns: [],
        research: {
          impr: '',
          item: ''
        }
      },
      gridOther: {
        title: '항목외 개선 목록'
      }
    }
  },
  disabled: false,
  contentHeight: null
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
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridItem = ref({
  data: []
})
const gridOther = ref({
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
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행상태',
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
const requestImprRow = ref<any>(null)
const impListUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 470
      : 360
  if (height < 300) height = 360
  return height + 'px'
})
const gridItemColumns = computed(() => {
  let cols = []
  if (!props.imprTabInfo.isTable) {
    cols = [
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선/진행상태',
        align: 'center',
        style: 'width:200px',
        type: 'custom',
        sortable: false
      }
    ]
  } else {
    cols = [
      {
        name: 'ibmClassName',
        field: 'ibmClassName',
        label: '구분',
        align: 'center',
        style: 'width:100px',
        sortable: true
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
        name: 'ibmStepName',
        field: 'ibmStepName',
        label: '진행상태',
        align: 'center',
        style: 'width:100px',
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
  }
  return _.concat(props.imprTabInfo.gridItem.columns, cols)
})
const gridItemData = computed(() =>
  props.imprTabInfo.gridItem.data && props.imprTabInfo.gridItem.data.length > 0
    ? props.imprTabInfo.gridItem.data
    : gridItem.value.data
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.imprTabInfo.gridItem.research.impr,
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
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  // code setting
  // list setting
  getList()
  getImprList()
}
/******************************
 * TODO (목적): 업무 항목에 따른 개선조회
 *******************************/
function getList() {
  if (props.imprTabInfo.gridItem.listUrl) {
    $http({
      url: props.imprTabInfo.gridItem.listUrl,
      method: 'GET',
      params: props.imprTabInfo.gridItem.param
    }).then((_result: any) => {
      gridItem.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 업무에 따른 개선 조회
 *******************************/
function getImprList() {
  if (props.imprTabInfo.key) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: props.imprTabInfo.ibmTaskTypeCd,
        ibmTaskUnderTypeCd: props.imprTabInfo.ibmTaskUnderTypeCd,
        relationTableKey: props.imprTabInfo.key
      }
    }).then((_result: any) => {
      gridOther.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 개선/즉시조치 팝업 표시
 * @param (1): 행 정보
 * @param (2): 개선 구분
 * @param (3): 개선 key
 * @param (4): 항목/업무 구분
 *******************************/
function linkClick(row: any, ibmClassCd: string, sopImprovementId: string, flag: string) {
  if (ibmClassCd === 'IC00000001') {
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
  popupOptions.value.param = {
    sopImprovementId: sopImprovementId
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  if (flag === 'item') {
    requestImprRow.value = row
    popupOptions.value.closeCallback = closeImprPopup
  } else {
    popupOptions.value.closeCallback = closeImprOtherPopup
  }
}
/******************************
 * TODO (목적): 개선/즉시조치 팝업 닫기
 * @param (1): 반환 값
 * @param (2): 삭제 여부
 *******************************/
function closeImprPopup(result: any, flag: string) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    if (props.imprTabInfo.gridItem.research) {
      props.imprTabInfo.gridItem.research.item = uid()
    }
    if (flag !== 'delete') {
      const splitId = _.split(requestImprRow.value.sopImprovementIds, ',')
      const splitStep = _.split(requestImprRow.value.ibmStepNames, ',')
      if (splitId && splitId.length > 0) {
        const idIndex = _.indexOf(splitId, result.col1.sopImprovementId)
        splitStep[idIndex] = result.col1.ibmStepName
        requestImprRow.value.ibmStepNames = splitStep.toString()
      }
    } else {
      const splitId = _.split(requestImprRow.value.sopImprovementIds, ',')
      const splitStep = _.split(requestImprRow.value.ibmStepNames, ',')
      const splitClass = _.split(requestImprRow.value.ibmClassCds, ',')
      const splitTooltip = _.split(requestImprRow.value.ibmTooltip, '│')
      if (splitId && splitId.length > 0) {
        const idIndex = _.indexOf(splitId, result.col1.sopImprovementId)
        splitId.splice(idIndex, 1)
        splitStep.splice(idIndex, 1)
        splitClass.splice(idIndex, 1)
        splitTooltip.splice(idIndex, 1)
        requestImprRow.value.sopImprovementIds = splitId.toString()
        requestImprRow.value.ibmStepNames = splitStep.toString()
        requestImprRow.value.ibmClassCds = splitClass.toString()
        requestImprRow.value.ibmTooltip = splitTooltip.join('│')
      }
    }
    table.value.compoTable.resetVirtualScroll()
    getList()
  }
}
/******************************
 * TODO (목적): 업무에 따른 개선 팝업 닫기
 *******************************/
function closeImprOtherPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImprList()
}
/******************************
 * TODO (목적): 개선 요청 팝업 표시 (신규)
 *******************************/
function addImpr() {
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: props.imprTabInfo.requestContents,
    relationTableKey: props.imprTabInfo.key,
    ibmTaskTypeCd: props.imprTabInfo.ibmTaskTypeCd,
    ibmTaskUnderTypeCd: props.imprTabInfo.ibmTaskUnderTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
/******************************
 * TODO (목적): 즉시조치 팝업 표시 (신규)
 *******************************/
function addImmImpr() {
  popupOptions.value.title = '즉시조치'
  popupOptions.value.param = {
    requestContents: props.imprTabInfo.requestContents,
    relationTableKey: props.imprTabInfo.key,
    ibmTaskTypeCd: props.imprTabInfo.ibmTaskTypeCd,
    ibmTaskUnderTypeCd: props.imprTabInfo.ibmTaskUnderTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
/******************************
 * TODO (목적): 개선요청/즉시조치 신규등록 팝업 닫기
 *******************************/
function closeAddImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImprList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

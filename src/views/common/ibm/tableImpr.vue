<template>
  <div>
    <template v-if="props.props.row['sopImprovementIds'] && props.props.row['ibmStepNames']">
      <q-chip
        v-for="(item, index) in ibmTagItems(props.props.row)"
        outline
        square
        :key="index"
        :color="String(item.color)"
        :clickable="true"
        style="margin-bottom: 4px !important"
        @click="openImprPop(item, props.props.row)"
      >
        {{ item.title }}
        <c-assess-tooltip :ibmTooltip="item.ibmTooltip" :ibmClassCd="item.ibmClassCd" />
      </q-chip>
    </template>
    <template v-else />
    <div v-if="inputEditable && props.props.row.editFlag !== 'C'">
      <q-btn-group outline class="ColumInnerBtnGroup">
        <q-icon
          name="add"
          class="cursor-pointer imp-inner-btn-req"
          @click.prevent="innerBtnClicked(props.props, '1')"
        >
          <q-tooltip>
            {{ $language('개선요청등록') }}
          </q-tooltip>
        </q-icon>
        <q-icon
          v-if="isImmShow"
          name="add"
          class="cursor-pointer imp-inner-btn-immi"
          @click.prevent="innerBtnClicked(props.props, '2')"
        >
          <q-tooltip>
            {{ $language('즉시조치등록') }}
          </q-tooltip>
        </q-icon>
      </q-btn-group>
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
import { ibmTagItems } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'tableImpr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['imprChange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  col: {
    taskClassCd: stringNull
    taskKey: stringNull
  }
  props: any
  isImmShow?: boolean
  inputEditable: boolean
  requestContentsCols?: Array<string>
  tableKeys?: Array<string>
  tableKey?: string
  vendorCd?: stringNull
  ibmTaskTypeCd?: string
  ibmTaskUnderTypeCd?: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  col: () => {
    return {
      taskClassCd: '',
      taskKey: ''
    }
  },
  props: () => {},
  isImmShow: false,
  inputEditable: false,
  requestContentsCols: () => [],
  tableKeys: () => [],
  tableKey: '',
  vendorCd: '',
  ibmTaskTypeCd: '',
  ibmTaskUnderTypeCd: ''
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
const requestImprRow = ref<any>(null)

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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function openImprPop(data: { ibmClassCd: string; sopImprovementId: string }, row: any) {
  requestImprRow.value = row
  if (data.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.param = {
      sopImprovementId: data.sopImprovementId,
      isSearch: !props.inputEditable
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.param = {
      sopImprovementId: data.sopImprovementId,
      isSearch: !props.inputEditable
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
    )
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeImprPopup(result: any, flag: string) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
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
    emits('imprChange')
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function innerBtnClicked(_props: any, btn: string) {
  requestImprRow.value = _props.row
  let requestContents = '개선'
  let _tablekey = ''
  if (props.requestContentsCols && props.requestContentsCols.length > 0) {
    requestContents = props.requestContentsCols
      .map((col: string) => _props.row[col])
      .join(' / ')
      .replace('\n', ' ')
  }
  if (props.tableKeys && props.tableKeys.length > 0) {
    _tablekey = props.tableKeys.map((col: string) => _props.row[col]).join('/')
  }
  if (btn === '1') {
    popupOptions.value.title = '개선요청'
    popupOptions.value.param = {
      requestContents: requestContents,
      relationTableKey: props.tableKeys.length > 0 ? _tablekey : _props.row[props.tableKey],
      ibmTaskTypeCd: props.ibmTaskTypeCd,
      ibmTaskUnderTypeCd: props.ibmTaskUnderTypeCd,
      vendorCd: props.vendorCd
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.param = {
      requestContents: requestContents,
      relationTableKey: props.tableKeys.length > 0 ? _tablekey : _props.row[props.tableKey],
      ibmTaskTypeCd: props.ibmTaskTypeCd,
      ibmTaskUnderTypeCd: props.ibmTaskUnderTypeCd
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
    )
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeAddImprPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data && data.col1) {
    const sData = requestImprRow.value.sopImprovementIds
      ? requestImprRow.value.sopImprovementIds
      : ''
    if (sData.indexOf(data.col1.sopImprovementId) === -1) {
      requestImprRow.value.sopImprovementIds = requestImprRow.value.sopImprovementIds
        ? requestImprRow.value.sopImprovementIds + ',' + data.col1.sopImprovementId
        : data.col1.sopImprovementId
      requestImprRow.value.ibmStepNames = requestImprRow.value.ibmStepNames
        ? requestImprRow.value.ibmStepNames + ',' + data.col1.ibmStepName
        : data.col1.ibmStepName
      requestImprRow.value.ibmClassCds = requestImprRow.value.ibmClassCds
        ? requestImprRow.value.ibmClassCds + ',' + data.col1.ibmClassCd
        : data.col1.ibmClassCd
      requestImprRow.value.ibmTooltip = requestImprRow.value.ibmTooltip
        ? requestImprRow.value.ibmTooltip + '│' + data.col1.ibmTooltip
        : data.col1.ibmTooltip
    }
    emits('imprChange')
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

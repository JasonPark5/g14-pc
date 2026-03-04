<template>
  <div>
    <template v-if="props.props.row['ram4mAssessImprIds'] && props.props.row['stepFlagNames']">
      <q-chip
        v-for="(item, index) in fmImprTagItems(props.props.row)"
        outline
        square
        :key="index"
        :color="String(item.color)"
        :clickable="true"
        text-color="white"
        style="margin-bottom: 4px !important"
        @click="openImprPop(item, props.props.row)"
      >
        {{ item.title }}
        <c-assess-tooltip isVendor :ibmTooltip="item.ibmFmTooltip" />
      </q-chip>
    </template>
    <template v-else />
    <div
      v-if="
        editable &&
        Boolean(props.props.row.ram4mAssessScenarioId) &&
        props.props.row.editFlag !== 'C' &&
        inputEditable
      "
    >
      <q-btn-group outline class="ColumInnerBtnGroup">
        <q-btn
          icon="add"
          color="red-6"
          text-color="white"
          class="ColumInnerBtn"
          align="center"
          @click.prevent="innerBtnClicked(props.props)"
        >
          <q-tooltip>
            {{ $language('개선등록') }}
          </q-tooltip>
        </q-btn>
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
import { fmImprTagItems } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: '4mTableImpr'
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
  isImmShow: boolean
  inputEditable: boolean
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
  inputEditable: false
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
function innerBtnClicked(_props: any) {
  requestImprRow.value = _props.row
  const requestContents =
    _props.row.jobName +
    ' / ' +
    _props.row.ram4mRiskHazardClassName +
    ' / ' +
    _props.row.riskHazardName
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: requestContents,
    relationTableKey: _props.row.ram4mAssessScenarioId,
    ibmTaskTypeCd: 'ITT0000023',
    ibmTaskUnderTypeCd: 'ITTU000030'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
function closeAddImprPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      const sData = requestImprRow.value.ram4mAssessImprIds
        ? requestImprRow.value.ram4mAssessImprIds
        : ''
      if (sData.indexOf(item.ram4mAssessImprId) === -1) {
        requestImprRow.value.ram4mAssessImprIds = requestImprRow.value.ram4mAssessImprIds
          ? requestImprRow.value.ram4mAssessImprIds + ',' + item.ram4mAssessImprId
          : item.ram4mAssessImprId
        requestImprRow.value.stepFlagNames = requestImprRow.value.stepFlagNames
          ? requestImprRow.value.stepFlagNames + ',' + item.stepFlagName
          : item.stepFlagName
        requestImprRow.value.ibmFmTooltip = requestImprRow.value.ibmFmTooltip
          ? requestImprRow.value.ibmFmTooltip + ',' + item.ibmFmTooltip
          : item.ibmFmTooltip
      }
    })
    emits('imprChange')
  }
}
function openImprPop(_data: any, _row: any) {
  requestImprRow.value = _row
  popupOptions.value.title = '개선'
  popupOptions.value.param = {
    ram4mAssessImprId: _data.ram4mAssessImprId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/ram/4m/risk/4mImprRiskReduceDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function closeImprPopup(_result: any, _flag: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_result && _result.col1) {
    if (_flag !== 'delete') {
      const splitId = _.split(requestImprRow.value.ram4mAssessImprIds, ',')
      const splitStep = _.split(requestImprRow.value.stepFlagNames, ',')
      if (splitId && splitId.length > 0) {
        const idIndex = _.indexOf(splitId, _result.col1.ram4mAssessImprId)
        splitStep[idIndex] = _result.col1.stepFlagName
        requestImprRow.value.stepFlagNames = splitStep.toString()
      }
    } else {
      const splitId = _.split(requestImprRow.value.ram4mAssessImprIds, ',')
      const splitStep = _.split(requestImprRow.value.stepFlagNames, ',')
      if (splitId && splitId.length > 0) {
        const idIndex = _.indexOf(splitId, _result.col1.ram4mAssessImprId)
        splitId.splice(idIndex, 1)
        splitStep.splice(idIndex, 1)
        requestImprRow.value.ram4mAssessImprIds = splitId.toString()
        requestImprRow.value.stepFlagNames = splitStep.toString()
      }
    }
    emits('imprChange')
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

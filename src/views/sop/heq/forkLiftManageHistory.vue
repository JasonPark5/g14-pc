<template>
  <c-table
    ref="hisTable"
    title="점검 이력 목록"
    tableId="forkLiftHis"
    :columns="grid.columns"
    :data="forkLiftData.forkLiftHistoryList"
    :usePaging="false"
    :checkClickFlag="false"
    :isExcelDown="false"
    :merge="grid.merge"
    rowKey="heqForkLiftHistoryId"
    @linkClick="linkClick"
  />
  <c-dialog :param="popupOptions" />
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { forkLiftType, forkLiftHistoryType } from './forkLift'

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
  name: 'hazardFacilityHistory'
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
    heqForkLiftId: stringNull
    readOnly: Boolean
  }
  forkLiftData: forkLiftType
  forkLiftHistoryList: forkLiftHistoryType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<any>
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
  popupParam: () => {
    return {
      heqForkLiftId: '',
      readOnly: false
    }
  },
  forkLiftData: () => {
    return {
      heqForkLiftId: '',
      plantCd: '',
      processCd: '',
      vendorCd: '',
      facilityTypeId: '',
      facilityTypeCd: '',
      facilityTypeName: '',
      facilityName: '',
      deviceNo: '',
      installLocation: '',
      carryinDate: '',
      useStartYmd: '',
      useEndYmd: '',
      safetyDate: '',
      safetyResultFlag: 'Y',
      checkAction: '',
      managerNo: '',
      managerUserId: '',
      managerUserName: '',
      regUserId: '',
      chgUserId: '',
      validFlagName: '일 남음',
      specifications: '',
      operationAtor: '',
      checkValidPeriod: '',

      forkLiftSafetyMeasureList: [],
      deleteForkLiftSafetyMeasureList: [],
      forkLiftHistoryList: [],
      deleteForkLiftHistoryList: []
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'selfCheckName',
      field: 'selfCheckName',
      label: '점검명',
      style: 'width:350px',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'inspectionDate',
      field: 'inspectionDate',
      label: '점검일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'inspectionUserName',
      field: 'inspectionUserName',
      label: '점검자',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'inspectionResultDetail',
      field: 'inspectionResultDetail',
      label: '특이사항',
      style: 'width:350px',
      align: 'left',
      sortable: false
    },

    {
      name: 'checkResultNumber',
      field: 'checkResultNumber',
      label: '점검결과 (적정/부적정)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const hisTable = ref<any>(null)
const deleteHistoryUrl = ref('')
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
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
  deleteHistoryUrl.value = transactionConfig.sop.heq.forkLift.result.delete.url
  // code setting
  // list setting
}
function linkClick(result: forkLiftHistoryType) {
  if (!props.forkLiftData.facilityTypeCd) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  popupOptions.value.title = '중장비 이력 상세'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./forkLiftHistoryResult.vue`))
  )
  popupOptions.value.param = {
    heqForkLiftHistoryId: result ? result.heqForkLiftHistoryId : '',
    facilityTypeCd: props.forkLiftData.facilityTypeCd,
    facilityTypeName: props.forkLiftData.facilityTypeName,
    facilityName: props.forkLiftData.facilityName,
    heqForkLiftId: props.popupParam.heqForkLiftId,
    checkValidPeriod: props.forkLiftData.checkValidPeriod,
    vendorCd: props.forkLiftData.vendorCd,
    plantCd: props.forkLiftData.plantCd,
    readOnly: true
  }
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '95%'
  popupOptions.value.closeCallback = closeItemPopup
}
function closeItemPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  emits('getDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

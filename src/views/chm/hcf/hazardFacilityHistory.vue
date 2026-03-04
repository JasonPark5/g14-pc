<template>
  <c-table
    ref="table"
    tableId="hazardFacilityHistory"
    :usePaging="false"
    title="자체점검 이력"
    :columnSetting="false"
    :isFullScreen="false"
    :isExcelDown="false"
    :columns="grid.columns"
    :data="grid.data"
    rowKey="hazardFacilityHistoryId"
    @linkClick="linkClick"
  />
  <c-dialog :param="popupOptions" />
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { hazardFacilityType } from './hazardFacility'

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
    facilityCd: stringNull
    search: boolean
  }
  facility: hazardFacilityType
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
  param: () => {
    return {
      facilityCd: '',
      search: false
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
      name: 'selfCheckDate',
      field: 'selfCheckDate',
      label: '점검일',
      align: 'center',
      sortable: true,
      style: 'width:200px'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '주관부서',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'selfCheckUserName',
      field: 'selfCheckUserName',
      label: '점검자',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'selfCheckName',
      field: 'selfCheckName',
      label: '점검명',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'checkResultNumber',
      field: 'checkResultNumber',
      label: '점검결과 (이상/전체)',
      align: 'center',
      style: 'width:150px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const table = ref<any>(null)
const searchParam = ref({
  plantCd: null,
  period: [],
  deptCd: null,
  hcfSelfCheckCompleteFlag: null,
  facilityCd: ''
})
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
  listUrl.value = selectConfig.env.facilitySelfCheck.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 시설 조회
 *******************************/
function getList() {
  if (props.param.facilityCd) {
    searchParam.value.facilityCd = props.param.facilityCd
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세 팝업
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '시설 자체점검 상세'
  popupOptions.value.param = {
    hcfHazardFacilitySelfCheckId: row ? row.hcfHazardFacilitySelfCheckId : '',
    readOnly: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardFacilitySelfCheckDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 시설 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

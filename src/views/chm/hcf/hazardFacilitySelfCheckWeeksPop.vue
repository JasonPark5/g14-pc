<template>
  <div>
    <c-table
      ref="table"
      title="시설 자체점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      gridHeight="500px"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    />
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
  name: 'hazardFacilitySelfCheckWeeksPop'
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
  popupParam: {
    hcfHazardFacilitySelfCheckIds: stringNull
  }
  contentHeight: stringNull
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
      hcfHazardFacilitySelfCheckIds: ''
    }
  },
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  hcfHazardFacilitySelfCheckIds: null
})
const grid = ref({
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
      name: 'selfCheckName',
      field: 'selfCheckName',
      label: '점검명',
      align: 'left',
      style: 'width:250px',
      type: 'link',
      sortable: false
    },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '시설명',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'facilityNo',
      field: 'facilityNo',
      label: '시설관리번호',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'hcfFacilityTypeName',
      field: 'hcfFacilityTypeName',
      label: '시설유형',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'selfCheckDate',
      field: 'selfCheckDate',
      label: '점검일자',
      align: 'center',
      style: 'width:160px',
      sortable: false
    },
    {
      name: 'hcfSelfCheckCompleteFlagName',
      field: 'hcfSelfCheckCompleteFlagName',
      label: '진행상태',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '주관부서',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'selfCheckUserName',
      field: 'selfCheckUserName',
      label: '점검자',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')

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
  if (props.popupParam.hcfHazardFacilitySelfCheckIds) {
    searchParam.value.hcfHazardFacilitySelfCheckIds = props.popupParam.hcfHazardFacilitySelfCheckIds
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 시설 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 시설 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '시설 자체점검 상세'
  popupOptions.value.param = {
    hcfHazardFacilitySelfCheckId: row ? row.hcfHazardFacilitySelfCheckId : ''
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

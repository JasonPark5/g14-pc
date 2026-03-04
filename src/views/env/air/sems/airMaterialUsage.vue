<template>
  <div>
    <q-form ref="editForm">
      <c-search-box @enter="getList">
        <template v-slot:search>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              label="사용년도"
              type="year"
              name="usageYear"
              v-model:value="searchParam.usageYear"
            />
          </div>
        </template>
      </c-search-box>
      <c-table
        ref="table"
        title="연료사용량"
        tableId="grid"
        :columns="grid.columns"
        :data="grid.data"
        :usePaging="true"
        :columnSetting="false"
        :filtering="true"
        :isExcelDown="false"
        @linkClick="linkClick"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && grid.data.length > 0"
              label="SEMS다운로드"
              icon="download"
              @btnClicked="excelDownLoad"
            />
            <c-btn label="등록" icon="add" @btnClicked="linkClick" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
      </c-table>
    </q-form>
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
  name: 'airMaterialUsage'
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

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: true,
  width: '',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  usageYear: ''
})
const materialItems = ref<codeMasterType>([])
const monthColumns = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1
  return {
    name: `usageVolume${month}`,
    field: `usageVolume${month}`,
    label: `사용량${month}월`,
    style: 'width:35px',
    align: 'center',
    sortable: false
  }
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'usageYear',
      field: 'usageYear',
      label: '사용년도',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstMaterialName',
      field: 'envAirMstMaterialName',
      label: '사용원료명',
      type: 'link',
      style: 'width:60px',
      align: 'left',
      sortable: false
    },
    {
      name: 'airMaterialUnitName',
      field: 'airMaterialUnitName',
      label: '사용량단위',
      style: 'width:30px',
      align: 'center',
      sortable: false
    },
    ...monthColumns
  ],
  data: []
})
const editable = ref(true)
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
const listUrl = ref('')
const materialUrl = ref('')

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
  listUrl.value = selectConfig.env.air.sems.materialsUsage.list.url
  materialUrl.value = selectConfig.env.air.mst.material.list.url
  // code setting
  searchParam.value.usageYear = getThisYear()
  // list setting
  getMaterialList()
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
 * TODO (목적): 연료 조회
 *******************************/
function getMaterialList() {
  $http({
    url: materialUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      materialItems.value.push({
        code: item.envAirMstMaterialId,
        codeName: item.envAirMstMaterialName,
        airMaterialUnitName: item.airMaterialUnitName
      })
    })
  })
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '원료사용량 상세'
  popupOptions.value.param = {
    envAirSemsMaterialUsageId: row ? row.envAirSemsMaterialUsageId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./airMaterialUsageDetail.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * TODO (목적): 엑셀 다운로드
 *******************************/
function excelDownLoad() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'SEMS 원료사용량.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :editable="editable"
            codeGroupCd="ENV_GAS_MST_DISCHARGE_CD"
            itemText="codeName"
            itemValue="code"
            label="배출형태"
            name="facilityTypeCd"
            v-model:value="searchParam.facilityTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            label="공장"
            :editable="editable"
            codeGroupCd="ENV_GAS_PLANT_CD"
            itemText="codeName"
            itemValue="code"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="edit"
            :editable="editable"
            label="부서"
            name="deptCd"
            :isFirstValue="false"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="온실가스 배출시설 목록"
          :merge="grid.merge"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="grid.data"
          :columnSetting="false"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
              <c-btn label="검색" icon="search" @btnClicked="getList" />
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
  name: 'dischargeFac'
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
  columns?: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

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
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  facilityTypeCd: null,
  useFlag: 'Y',
  processCd: null,
  deptCd: null
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'envGhgFacilityId' },
    { index: 1, colName: 'envGhgFacilityId' },
    { index: 2, colName: 'envGhgFacilityId' },
    { index: 3, colName: 'envGhgFacilityId' },
    { index: 4, colName: 'envGhgFacilityId' },
    { index: 9, colName: 'envGhgFacilityId' }
  ],
  columns: [
    {
      name: 'facilityTypeName',
      field: 'facilityTypeName',
      label: '배출형태',
      align: 'center',
      sortable: true,
      style: 'width: 80px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공장명',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서명',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'facilityCode',
      field: 'facilityCode',
      label: '배출시설코드',
      align: 'center',
      sortable: true,
      style: 'width: 60px'
    },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '배출시설명',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width: 150px'
    },
    {
      name: 'equipmentCode',
      field: 'equipmentCode',
      label: '설비코드',
      align: 'center',
      sortable: true,
      style: 'width: 60px'
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      sortable: true,
      style: 'width: 150px'
    },
    {
      name: 'rawFuelName',
      field: 'rawFuelName',
      label: '배출원(연료)명',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'rawFuelTypeName',
      field: 'rawFuelTypeName',
      label: '단위',
      style: 'width: 80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'useFlagName',
      field: 'useFlagName',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width: 60px'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.env.ghg.facility.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '온실가스 배출시설 상세'
  popupOptions.value.param = {
    envGhgFacilityId: row ? row.envGhgFacilityId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./dischargeFacilityDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="6M"
            label="점검기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'facility' }"
            label="시설명"
            name="facilityCd"
            v-model:value="searchParam.facilityCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="주관부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="stepItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="진행상태"
            v-model:value="searchParam.hcfSelfCheckCompleteFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="시설 자체점검 목록"
      tableId="facilitySelfCheck"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardFacilitySelfCheck'
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
  plantCd: null,
  period: [],
  deptCd: null,
  hcfSelfCheckCompleteFlag: null,
  facilityCd: null
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
      name: 'selfCheckDate',
      field: 'selfCheckDate',
      label: '점검일',
      align: 'center',
      style: 'width:140px',
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
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    }
  ],
  data: []
})
const stepItems = ref<Array<codeMasterType>>([])
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
  stepItems.value = [
    { code: 'N', codeName: $language('작성중') },
    { code: 'Y', codeName: $language('완료') }
  ]
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

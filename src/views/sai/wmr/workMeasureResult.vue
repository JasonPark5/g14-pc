<template>
  <c-search-box>
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-datepicker
          name="measYear"
          type="year"
          :range="true"
          label="측정년도"
          defaultStart="-3y"
          defaultEnd="0y"
          v-model:value="year"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          codeGroupCd="WORK_MEAS_QUARTER_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          label="상/하반기"
          name="measQuarter"
          v-model:value="searchParam.measQuarter"
        />
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-datepicker
          :range="true"
          name="period"
          label="측정기간"
          v-model:value="period"
        ></c-datepicker>
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          :editable="editable"
          :comboItems="completeFlagItems"
          itemText="codeName"
          itemValue="code"
          label="진행상태"
          name="measCompleteFlag"
          v-model:value="searchParam.measCompleteFlag"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="table"
    title="작업환경측정결과 목록"
    :columns="grid.columns"
    :data="grid.data"
    :columnSetting="false"
    :expandAll="true"
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
  name: 'workMeasureResult'
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
const searchParam = ref({
  plantCd: null,
  measQuarter: null,
  measYear: '',
  startYmd: '',
  endYmd: '',
  measCompleteFlag: null
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'measYear',
      field: 'measYear',
      label: '측정년도',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'measPlanContent',
      field: 'measPlanContent',
      label: '측정계획명',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'measQuarterName',
      field: 'measQuarterName',
      label: '분기',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'measDate',
      field: 'measDate',
      label: '측정기간',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'measPlaceName',
      field: 'measPlaceName',
      label: '측정기관',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'measCompleteFlagName',
      field: 'measCompleteFlagName',
      label: '진행상태',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const completeFlagItems = ref<codeMasterType>([])
const year = ref(['', ''])

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
  listUrl.value = selectConfig.sai.workmeas.plan.list.url
  // code setting
  completeFlagItems.value = [
    { code: null, codeName: $language('전체') },
    { code: 'N', codeName: $language('작성중') },
    { code: 'Y', codeName: $language('완료') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 작업환경측정결과 목록 조회
 *******************************/
function getList() {
  if (year.value && year.value.length > 0) {
    searchParam.value.startYmd = year.value[0]
    searchParam.value.endYmd = year.value[1]
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./workMeasurePlanDetail.vue`))
  )
  popupOptions.value.title = '작업환경측정 상세'
  popupOptions.value.param = {
    workMeasurementPlanId: row ? row.workMeasurementPlanId : ''
  }
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="작성기간"
            defaultStart="-6M"
            defaultEnd="6M"
            name="period"
            v-model:value="period"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="ISO 45001/14001 경영검토 보고서 목록"
      :columns="grid.columns"
      :data="grid.data"
      rowKey="policyId"
      :columnSetting="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="bookPopup" />
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
  name: 'isoReviewReport'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  columns: tableColumnType
  data: Array<any>
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<any>({
  plantCd: '',
  startYmd: '',
  endYmd: ''
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
      name: 'reportTitle',
      field: 'reportTitle',
      label: '제목',
      align: 'left',
      type: 'link',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'reportDate',
      field: 'reportDate',
      label: '작성일자',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '작성자',
      align: 'center',
      style: 'width:100px',
      sortable: true
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
const listUrl = ref('')
const period = ref<any>([])

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
  listUrl.value = selectConfig.sai.iso.report.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(row: object | any) {
  bookPopup(row)
}
function bookPopup(result: object | any) {
  popupOptions.value.title = 'ISO 45001/14001 경영검토 보고서 상세'
  popupOptions.value.param = {
    reviewReportId: result ? result.reviewReportId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./isoReviewReportDetail.vue`))
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

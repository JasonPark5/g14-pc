<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="작성년월"
            name="srchMonth"
            type="month"
            v-model:value="searchParam.srchMonth"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept label="작성부서" name="deptCd" type="search" v-model:value="searchParam.deptCd" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="대기일지 목록"
      :columns="grid.columns"
      :merge="grid.merge"
      :gridHeight="grid.height"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
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
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import moment from 'moment'

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
  name: 'dailyAirReport'
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
interface searchParamType {
  srchMonth: stringNull
  startDate: stringNull
  endDate: stringNull
  plantCd: stringNull
  deptCd: stringNull
  processCd: stringNull
  dailyResultStatusCd: stringNull
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
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  srchMonth: '',
  startDate: '',
  endDate: '',
  plantCd: null,
  deptCd: '',
  processCd: '',
  dailyResultStatusCd: ''
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'dailyResultDt' }],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:60px',
      align: 'center',
      sortable: true
    },
    {
      name: 'dailyResultDt',
      field: 'dailyResultDt',
      label: '작성일자',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      style: 'width:150px',
      align: 'center',
      sortable: true,
      type: 'link'
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '진행상태',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'weatherName',
      field: 'weatherName',
      label: '날씨',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'temperature',
      field: 'temperature',
      label: '온도(℃)',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '작성자',
      style: 'width:100px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const workplaceListUrl = ref('')

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
  listUrl.value = selectConfig.env.air.daily.result.list.url
  workplaceListUrl.value = selectConfig.env.procWork.list.url
  // code setting
  searchParam.value.srchMonth = getThisMonth()
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (searchParam.value.srchMonth) {
    searchParam.value.startDate = moment(searchParam.value.srchMonth, 'YYYY-MM')
      .startOf('month')
      .format('YYYY-MM-DD')
    searchParam.value.endDate = moment(searchParam.value.srchMonth, 'YYYY-MM')
      .endOf('month')
      .format('YYYY-MM-DD')
  } else {
    searchParam.value.startDate = ''
    searchParam.value.endDate = ''
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
  popupOptions.value.title = '대기일지 상세'
  popupOptions.value.param = {
    envAirDailyResultId: row ? row.envAirDailyResultId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/env/air/dailyAirReportManageDetail.vue`))
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="가동일자"
            name="srchDts"
            :range="true"
            v-model:value="searchParam.srchDts"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="배출구"
            name="envAirMstOutletId"
            :customPopupParam="{ targetKey: 'airOutlet' }"
            v-model:value="searchParam.envAirMstOutletId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="가동시간 목록"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :columnSetting="false"
      :filtering="true"
      :isExcelDown="false"
      selection="multiple"
      rowKey="envAirSemsOutletOpertimeId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="SEMS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          />
          <c-btn label="일단위 수정/등록" icon="add" @btnClicked="addOpertime('day')" />
          <c-btn label="시설단위 수정/등록" icon="add" @btnClicked="addOpertime('outlet')" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            icon="delete_forever"
            @btnClicked="deleteOpertime"
          />
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
  name: 'airOutletOpertime'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()

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
interface searchParamType {
  plantCd: stringNull
  srchDts: Array<String>
  envAirMstOutletId: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  srchDts: [],
  envAirMstOutletId: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'operationDate',
      field: 'operationDate',
      label: '가동일자',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구일련번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '허가증상배출구번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'operationHour',
      field: 'operationHour',
      label: '배출구 가동시간(시간)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'operationMin',
      field: 'operationMin',
      label: '배출구 가동시간(분)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:200px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)

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
  listUrl.value = selectConfig.env.air.sems.opertimes.list.url
  deleteUrl.value = transactionConfig.env.air.sems.opertime.delete.url
  // code setting
  searchParam.value.srchDts[0] = getAddMonth(getToday(), -2)
  searchParam.value.srchDts[1] = getToday()
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
 * TODO (목적): 일단위등록 팝업
 *******************************/
function addOpertime(type: string) {
  if (type === 'day') {
    popupOptions.value.title = '일단위 수정 및 등록'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import('@/views/env/air/sems/airOurletOpertimeDetail01.vue'))
    )
  } else {
    popupOptions.value.title = '시설단위 수정 및 등록'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import('@/views/env/air/sems/airOutletOpertimeDetail02.vue'))
    )
  }
  popupOptions.value.param = {}
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeSopPopup
}

function closeSopPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteOpertime() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
          getList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function downLoadSems() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'SEMS가동시간엑셀양식.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

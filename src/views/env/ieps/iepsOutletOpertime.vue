<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            required
            label="가동년월"
            name="operationMonth"
            default="today"
            type="month"
            v-model:value="searchParam.operationMonth"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="대기배출구"
            name="envAirMstOutletId"
            :customPopupParam="{
              targetKey: 'airOutlet',
              param: {
                searchParam: {
                  iepsFlag: 'Y'
                }
              }
            }"
            v-model:value="searchParam.envAirMstOutletId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="수질배출구"
            name="envWaterMstOutletId"
            :customPopupParam="{
              targetKey: 'waterOutlet',
              param: {
                searchParam: {
                  iepsFlag: 'Y'
                }
              }
            }"
            v-model:value="searchParam.envWaterMstOutletId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            label="배출구 타입"
            name="mediaType"
            type="search"
            :comboItems="typeItems"
            itemText="codeName"
            itemValue="code"
            v-model:value="searchParam.mediaType"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="배출구 가동시간 목록"
      :editable="false"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :columnSetting="false"
      :filtering="true"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="IEPS 다운로드"
            icon="download"
            @btnClicked="excelDownLoad"
          />
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
  name: 'iepsOutletOpertime'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const message = useMessageStore()

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
  operationMonth: stringNull
  envAirMstOutletId: stringNull
  envWaterMstOutletId: stringNull
  mediaType: stringNull
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
  operationMonth: '',
  envAirMstOutletId: '',
  envWaterMstOutletId: '',
  mediaType: ''
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
      sortable: true,
      fix: true
    },
    {
      name: 'outletIepsNo',
      field: 'outletIepsNo',
      label: '배출구번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'operationHour',
      field: 'operationHour',
      label: '가동시간(시)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'operationMin',
      field: 'operationMin',
      label: '가동시간(분)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:100px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
// const deleteUrl = ref('')
const table = ref<any>(null)
const typeItems = ref<any>([])

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
  listUrl.value = selectConfig.env.ieps.outlet.list.url
  // deleteUrl.value = transactionConfig.env.air.sems.opertime.delete.url
  // code setting
  typeItems.value = [
    { code: 'AIR', codeName: '대기' },
    { code: 'WATER', codeName: '수질' }
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
    link.download = 'IEPS 배출구가동시간.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

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
            type="month"
            v-model:value="searchParam.operationMonth"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="배출시설"
            name="envAirMstDischargeId"
            :customPopupParam="{ targetKey: 'airDischarge' }"
            v-model:value="searchParam.envAirMstDischargeId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="배출시설 가동시간 목록"
      :editable="false"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :columnSetting="false"
      :filtering="true"
      :isExcelDown="false"
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
  name: 'dischargeOpertime'
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
  envAirMstDischargeId: stringNull
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
  envAirMstDischargeId: ''
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
      label: '운영일자',
      style: 'width:100px',
      align: 'center',
      sortable: true,
      fix: true
    },
    {
      name: 'processNo',
      field: 'processNo',
      label: '단위공정번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'processName',
      field: 'processName',
      label: '단위공정명',
      style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'dischargeIepsNo',
      field: 'dischargeIepsNo',
      label: '배출시설관리번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설명',
      style: 'width:250px',
      align: 'left',
      sortable: false
    },
    {
      name: 'dischargeIepsPlantMgtNo',
      field: 'dischargeIepsPlantMgtNo',
      label: '사업장관리번호',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'furnaceTemp',
      field: 'furnaceTemp',
      label: '온도(로내온도)',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'boilerPressure',
      field: 'boilerPressure',
      label: '압력(보일러)',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'pressureUnitCd',
      field: 'pressureUnitCd',
      label: '압력단위코드',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'pressureUnitName',
      field: 'pressureUnitName',
      label: '압력단위명',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'exhauseGasFlow',
      field: 'exhauseGasFlow',
      label: '베출가스 유량(㎥/일)',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'hourCnt',
      field: 'hourCnt',
      label: '배출시설가동시간',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      name: 'operationMin',
      field: 'operationMin',
      label: '배출시설가동분',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      name: 'preventiveIepsNo',
      field: 'preventiveIepsNo',
      label: '방지시설관리번호',
      style: 'width:100px',
      align: 'center',
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
  listUrl.value = selectConfig.env.air.sems.dischargeOpertime.list.url
  deleteUrl.value = transactionConfig.env.air.sems.dischargeOpertime.delete.url
  // code setting
  searchParam.value.operationMonth = getThisMonth()
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

// /******************************
//  * TODO (목적): 등록
//  *******************************/
// function linkClick(row?: any) {
//   popupOptions.value.title = '배출시설 가동시간 상세'
//   popupOptions.value.target = shallowRef(
//     defineAsyncComponent(() => import('@/views/env/ieps/dischargeOpertimeDetail.vue'))
//   )
//   popupOptions.value.param = {
//     operationDate: row ? row.operationDate : ''
//   }
//   popupOptions.value.isFull = true
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closeSopPopup
// }

// function closeSopPopup() {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   getList()
// }
// /******************************
//  * TODO (목적): 삭제
//  *******************************/
// function deleteOpertime() {
//   const selectData = table.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'info', // success / info / warning / error
//       confirmCallback: () => {
//         $http({
//           url: deleteUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then((_result: any) => {
//           message.requestSuccess()
//           _.forEach(selectData, (item) => {
//             grid.value.data = _.reject(grid.value.data, item)
//           })
//           table.value.compoTable.clearSelection()
//           getList()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   }
// }

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
    link.download = 'IEPS 배출시설 운영사항.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="UNINJURY_STATE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="uninjuryStateCd"
            label="구분"
            v-model:value="searchParam.uninjuryStateCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="무재해 이력"
      tableId="table"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      rowKey="uninjuryHistoryId"
      selection="multiple"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn
            label="지급완료 처리"
            icon="save"
            @btnClicked="saveDept('Y')"
            v-if="editable && grid.data.length > 0"
          />
          <c-btn
            label="미지급 처리"
            icon="remove"
            @btnClicked="saveDept('N')"
            color="orange"
            v-if="editable && grid.data.length > 0"
          /> -->
          <c-btn
            label="삭제"
            icon="remove"
            @btnClicked="deleteDept"
            v-if="editable && grid.data.length > 0"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'uninjuryStateName'">
          <q-chip v-if="props.row.uninjuryStateCd == 'USC0000002'" outline square color="red">
            {{ props.row.uninjuryStateName }}
          </q-chip>
          <span v-else>{{ props.row.uninjuryStateName }}</span>
        </template>
      </template>
    </c-table>
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
  name: 'uninjuryHistory'
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
const searchParam = ref({
  plantCd: null,
  uninjuryStateCd: null
})
const grid = ref({
  // merge: [{ index: 0, colName: 'upDeptCd' }],
  merge: [],
  columns: [
    // {
    //   name: 'upDeptName',
    //   field: 'upDeptName',
    //   label: '상위부서',
    //   style: 'width:140px',
    //   align: 'center',
    //   sortable: false
    // },
    {
      name: 'uninjuryStateName',
      field: 'uninjuryStateName',
      label: '구분',
      style: 'width:140px',
      align: 'center',
      type: 'custom',
      sortable: false
    },
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:140px',
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      style: 'width:140px',
      align: 'center',
      sortable: false
    },
    {
      name: 'startDt',
      field: 'startDt',
      label: '개시일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'endDt',
      field: 'endDt',
      label: '목표 종료일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'targetDay',
      field: 'targetDay',
      label: '목표 일수',
      align: 'right',
      type: 'cost',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'realEndDt',
      field: 'realEndDt',
      label: '실제 종료일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'realDay',
      field: 'realDay',
      label: '달성 일수',
      align: 'right',
      type: 'cost',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '미달성 사유',
      align: 'left',
      sortable: false
    },
    {
      name: 'paymentFlagName',
      field: 'paymentFlagName',
      label: '지급여부',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const updateUrl = ref('')
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
  listUrl.value = selectConfig.sai.uninjury.historys.url
  updateUrl.value = transactionConfig.sai.uninjury.history.url
  // code setting
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
 * TODO (목적): 저장
 *******************************/
// function saveDept(_flag: stringNull) {
//   const selectData = table.value.getSelected()
//   _.forEach(selectData, (item) => {
//     item.editFlag = 'U'
//     item.paymentFlag = _flag
//   })
//   if (selectData && selectData.length > 0) {
//     message.confirm({
//       title: '확인',
//       message: '저장하시겠습니까?',
//       type: 'info',
//       // 확인 callback 함수
//       confirmCallback: () => {
//         $http({
//           url: updateUrl.value,
//           method: 'PUT',
//           data: selectData
//         }).then(() => {
//           getList()
//           message.alert({
//             title: '안내',
//             message: '저장되었습니다.',
//             type: 'success' // success / info / warning / error
//           })
//           table.value.compoTable.clearSelection()
//         })
//       },
//       // 취소 callback 함수
//       cancelCallback: () => {}
//     })
//   }
// }
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteDept() {
  const selectData = table.value.getSelected()
  if (selectData.length > 0) {
    message.confirm({
      title: '확인',
      message: '무재해 달성이력을 삭제하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: updateUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          getList()
          message.alert({
            title: '안내',
            message: '삭제되었습니다.',
            type: 'success' // success / info / warning / error
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

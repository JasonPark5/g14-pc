<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            label="부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
            :isFirstValue="false"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-tree-table
          title="부서목록"
          parentProperty="upDeptCd"
          customID="deptCd"
          :columns="gridDept.columns"
          :data="gridDept.data"
          gridHeight="770px"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="false"
          :isExcelDown="false"
          :filtering="true"
          @rowClick="rowClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getAllList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
        <c-table
          ref="table"
          title="부서별 관리감독자 목록"
          tableId="grid"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="770px"
          :editable="editable"
          :checkClickFlag="false"
          rowKey="userId"
          selection="multiple"
        >
          <template v-slot:table-button>
            <div>
              <q-btn-group outline>
                <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
                <c-btn
                  v-if="editable && grid.data!.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeRow"
                />
              </q-btn-group>
            </div>
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
  name: 'safetyCheckItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
const searchParam = ref({
  plantCd: null,
  deptCd: ''
})
const gridDept = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '분류',
      align: 'center',
      sortable: true
    },
    {
      name: 'spotName',
      field: 'spotName',
      label: '직급',
      align: 'center',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const table = ref<any>(null)
const deptlistUrl = ref('')
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const rowNotSelected = ref(false)
const selectedDeptCd = ref('')

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
  deptlistUrl.value = selectConfig.mdm.dept.list.url
  listUrl.value = selectConfig.mdm.deptmanager.list.url
  saveUrl.value = transactionConfig.mdm.deptmanager.save.url
  deleteUrl.value = transactionConfig.mdm.deptmanager.delete.url
  // code setting
  // list setting
  getDeptList()
  getList()
}
function getAllList() {
  getDeptList()
  getList()
}
function getDeptList() {
  selectedDeptCd.value = ''
  rowNotSelected.value = true
  $http({
    url: deptlistUrl.value,
    method: 'GET',
    params: {
      plantCd: searchParam.value.plantCd,
      deptCd: searchParam.value.deptCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    gridDept.value.data = _result.data
  })
}
function getList() {
  selectedDeptCd.value = ''
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function addRow() {
  popupOptions.value.title = '안전관리자 추가'
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    type: 'single',
    searchParam: {
      plantCd: searchParam.value.plantCd,
      deptCd: selectedDeptCd.value
    }
  })
}
function rowClick(row: any) {
  selectedDeptCd.value = row.deptCd
  $http({
    url: listUrl.value,
    method: 'GET',
    params: row.deptCd == row.plantCd ? { plantCd: row.plantCd } : { deptCd: row.deptCd }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(grid.value.data, { userId: item.userId }) === -1) {
        saveData.push({
          plantCd: item.plantCd, // 사업장코드
          plantName: item.plantName, // 사업장코드
          deptCd: item.deptCd, // 부서코드
          deptName: item.deptName, // 부서코드
          deptBan: '', // 반
          deptJo: '', // 조
          userId: item.userId, // 안전관리자 아이디
          userName: item.userName, // 안전관리자 아이디
          jobName: item.jobName, // 안전관리자 아이디
          spotName: item.spotName, // 안전관리자 아이디
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
    $http({
      url: saveUrl.value,
      method: 'POST',
      data: saveData
    }).then((_result: any) => {
      message.requestSuccess()
      rowClick({ deptCd: selectedDeptCd.value })
    })
  }
}
function removeRow() {
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()

          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
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

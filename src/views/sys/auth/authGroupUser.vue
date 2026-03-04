<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-table
          ref="table"
          title="권한"
          tableId="table"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :columns="grid.columns"
          :data="grid.data"
          @rowClick="rowClick"
          :filtering="false"
          :isExcelDown="false"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getGrpList" />
            </q-btn-group>
          </template>
          <template v-slot:table-header-append>
            <c-select
              codeGroupCd="DEVICE_CD"
              codeAttrVal1="Y"
              type="none"
              class="no-label-control"
              :dense="true"
              itemText="codeName"
              itemValue="code"
              name="deviceTypeCd"
              label=""
              v-model:value="searchParam.deviceTypeCd"
              @update:value="getGrpList"
            />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="depttable"
          title="권한별 부서"
          tableId="depttable"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :columns="griddept.columns"
          :data="griddept.data"
          :checkClickFlag="false"
          :isExcelDown="false"
          selection="multiple"
          rowKey="deptCd"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="부서추가"
                icon="add"
                @btnClicked="addDept"
                v-if="isSelected && editable"
              />
              <c-btn
                label="삭제"
                icon="remove"
                @btnClicked="removeDept"
                v-if="isSelected && editable"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-table
          ref="usertable"
          title="권한별 사용자"
          tableId="usertable"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :columns="griduser.columns"
          :data="griduser.data"
          :checkClickFlag="false"
          :isExcelDown="false"
          selection="multiple"
          rowKey="userId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="사용자추가"
                icon="add"
                @btnClicked="addUser"
                v-if="isSelected && editable"
              />
              <c-btn
                label="삭제"
                icon="remove"
                @btnClicked="removeUser"
                v-if="isSelected && editable"
              />
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
/** message 호출 */
const message = useMessageStore()

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'authGroupUser'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
interface searchParamType {
  defaultFlag: stringNull
  useFlag: stringNull
  deviceTypeCd: stringNull
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
const searchParam = ref<searchParamType>({
  defaultFlag: 'N',
  useFlag: 'Y',
  deviceTypeCd: 'P'
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  isFull: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'sysAuthGrpName',
      field: 'sysAuthGrpName',
      label: '권한명',
      align: 'left',
      sortable: true
    }
  ],
  data: [] as any
})
const griddept = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false
    }
  ],
  data: [] as any
})
const griduser = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'empNo',
      field: 'empNo',
      label: '사번',
      align: 'center',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '사용자',
      align: 'center',
      sortable: false
    }
  ],
  data: [] as any
})
const listUrl = ref('')
const userlistUrl = ref('')
const deptlistUrl = ref('')
const deptInsertUrl = ref('')
const deptDeleteUrl = ref('')
const userInsertUrl = ref('')
const userDeleteUrl = ref('')
const selectedSysAuthGrpId = ref('')
const isSelected = ref(false)
const depttable = ref<any>(null)
const usertable = ref<any>(null)

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
  listUrl.value = selectConfig.sys.auth.grp.list.url
  userlistUrl.value = selectConfig.sys.auth.user.list.url
  deptlistUrl.value = selectConfig.sys.auth.dept.list.url
  deptInsertUrl.value = transactionConfig.sys.auth.dept.insert.url
  deptDeleteUrl.value = transactionConfig.sys.auth.dept.delete.url
  userInsertUrl.value = transactionConfig.sys.auth.user.insert.url
  userDeleteUrl.value = transactionConfig.sys.auth.user.delete.url
  // code setting
  // list setting
  getGrpList()
}
/******************************
 * TODO (목적): 행 선택 표시 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 조회 및 초기화
 *******************************/
function getGrpList() {
  isSelected.value = false
  getList()
  rowRemoveSelect()
  griduser.value.data = []
  griddept.value.data = []
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (user.value.userId === 'U000000001') {
      grid.value.data = _result.data
    } else {
      grid.value.data = _.filter(_result.data, (item) => {
        return item['sysAuthGrpId'] !== 'SAGI000000'
      })
    }
  })
}
/******************************
 * TODO (목적): 메뉴 클릭
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(row: any) {
  isSelected.value = true
  selectedSysAuthGrpId.value = row.sysAuthGrpId
  getDeptList()
  getUserList()
}
/******************************
 * TODO (목적): 권한에 따른 사용자 조회
 *******************************/
function getUserList() {
  $http({
    url: userlistUrl.value,
    method: 'GET',
    params: { sysAuthGrpId: selectedSysAuthGrpId.value }
  }).then((_result: any) => {
    griduser.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 권한에 따른 부서 조회
 *******************************/
function getDeptList() {
  $http({
    url: deptlistUrl.value,
    method: 'GET',
    params: { sysAuthGrpId: selectedSysAuthGrpId.value }
  }).then((_result: any) => {
    griddept.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 부서추가
 *******************************/
function addDept() {
  popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDept, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 부서추가 후ㅡcallback
 *******************************/
function closeDept(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData: Array<any> = []
    _.forEach(data, (item) => {
      if (_.findIndex(griddept.value.data, { deptCd: item.deptCd }) === -1) {
        saveData.push({
          sysAuthGrpId: selectedSysAuthGrpId.value,
          deptCd: item.deptCd
        })
      }
    })
    $http({
      url: deptInsertUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getDeptList()
    })
  }
}
/******************************
 * TODO (목적): 사용자추가
 *******************************/
function addUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 사용자추가 후ㅡcallback
 *******************************/
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData: Array<any> = []
    _.forEach(data, (item) => {
      if (_.findIndex(griduser.value.data, { userId: item.userId }) === -1) {
        saveData.push({
          sysAuthGrpId: selectedSysAuthGrpId.value,
          userId: item.userId
        })
      }
    })

    $http({
      url: userInsertUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getUserList()
    })
  }
}
/******************************
 * TODO (목적): 부서삭제
 *******************************/
function removeDept() {
  const selectData = depttable.value.getSelected()
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
          url: deptDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getDeptList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 사용자삭제
 *******************************/
function removeUser() {
  const selectData = usertable.value.getSelected()
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
          url: userDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getUserList()
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

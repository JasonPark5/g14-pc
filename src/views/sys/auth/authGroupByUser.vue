<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            :editable="editable"
            label="부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="DEVICE_CD"
            codeAttrVal1="Y"
            type="none"
            itemText="codeName"
            itemValue="code"
            name="deviceTypeCd"
            label="디바이스구분"
            v-model:value="searchParam.deviceTypeCd"
            @update:value="getColumns"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="depttable"
          title="부서별 권한"
          tableId="depttable"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :columns="griddept.columns"
          :data="griddept.data"
          :editable="editable"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="저장" icon="save" @btnClicked="saveDept" />
              <c-btn label="검색" icon="search" @btnClicked="getColumns" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="usertable"
          title="사용자별 권한"
          tableId="usertable"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :columns="griduser.columns"
          :data="griduser.data"
          :editable="editable"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="저장" icon="save" @btnClicked="saveUser" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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
  name: 'authGroupByUser'
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
  plantCd: stringNull
  useFlag: stringNull
  deptCd: stringNull
  retireFlag: stringNull
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
  plantCd: null,
  useFlag: 'Y',
  deptCd: '',
  retireFlag: 'N',
  deviceTypeCd: 'P'
})
const griddept = ref({
  columns: [] as any,
  data: [] as any
})
const griduser = ref({
  columns: [] as any,
  data: [] as any
})
const listUrl = ref('')
const userlistUrl = ref('')
const deptlistUrl = ref('')
const saveUserUrl = ref('')
const saveDeptUrl = ref('')
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
  userlistUrl.value = selectConfig.sys.auth.userauth.list.url
  deptlistUrl.value = selectConfig.sys.auth.deptauth.list.url
  saveUserUrl.value = transactionConfig.sys.auth.userauth.insert.url
  saveDeptUrl.value = transactionConfig.sys.auth.deptauth.insert.url
  // code setting
  // list setting
  getColumns()
}
/******************************
 * TODO (목적): 조회 및 초기화
 *******************************/
function getColumns() {
  const authlist = ref([]) as any
  griddept.value.columns = []
  griduser.value.columns = []

  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      defaultFlag: 'N',
      deviceTypeCd: searchParam.value.deviceTypeCd
    }
  }).then((_result: any) => {
    if (user.value.userId === 'U000000001') {
      authlist.value = _result.data
    } else {
      authlist.value = _.filter(_result.data, (item) => {
        return item['sysAuthGrpId'] !== 'SAGI000000'
      })
    }
    griddept.value.columns = [
      {
        name: 'plantName',
        field: 'plantName',
        label: '사업장',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'deptName',
        field: 'deptName',
        label: '부서',
        align: 'left',
        sortable: true
      },
      {
        name: 'sysAuthGrpId',
        field: 'sysAuthGrpId',
        label: '권한',
        align: 'center',
        type: 'multiSelect',
        itemText: 'sysAuthGrpName',
        itemValue: 'sysAuthGrpId',
        style: 'width:65%',
        isArray: false,
        comboItems: authlist,
        sortable: false
      }
    ]
    griduser.value.columns = [
      {
        name: 'plantName',
        field: 'plantName',
        label: '사업장',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'deptName',
        field: 'deptName',
        label: '부서',
        align: 'center',
        sortable: true
      },
      {
        name: 'empNo',
        field: 'empNo',
        label: '사번',
        align: 'center',
        sortable: true
      },
      {
        name: 'userName',
        field: 'userName',
        label: '사용자',
        align: 'center',
        sortable: true
      },
      {
        name: 'sysAuthGrpId',
        field: 'sysAuthGrpId',
        label: '권한',
        align: 'center',
        type: 'multiSelect',
        itemText: 'sysAuthGrpName',
        itemValue: 'sysAuthGrpId',
        style: 'width:55%',
        isArray: false,
        comboItems: authlist,
        sortable: false
      }
    ]
    getDeptList()
    getUserList()
  })
}
/******************************
 * TODO (목적): 권한에 따른 사용자 조회
 *******************************/
function getUserList() {
  $http({
    url: userlistUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (user.value.userId === 'U000000001') {
      griduser.value.data = _result.data
    } else {
      griduser.value.data = _.filter(_result.data, (item) => {
        return item['userId'] !== 'U000000001'
      })
    }
  })
}
/******************************
 * TODO (목적): 권한에 따른 부서 조회
 *******************************/
function getDeptList() {
  $http({
    url: deptlistUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    griddept.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 부서 권한 저장
 *******************************/
function saveDept() {
  const saveData = griddept.value.data.filter((x: any) => {
    return x.editFlag == 'U'
  })

  $http({
    url: saveDeptUrl.value,
    method: 'POST',
    data: saveData
  }).then(() => {
    message.requestSuccess()
    getDeptList()
  })
}
/******************************
 * TODO (목적): 사용자 권한 저장
 *******************************/
function saveUser() {
  const saveData = griduser.value.data.filter((x: any) => {
    return x.editFlag == 'U'
  })

  $http({
    url: saveUserUrl.value,
    method: 'POST',
    data: saveData
  }).then(() => {
    message.requestSuccess()
    getUserList()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

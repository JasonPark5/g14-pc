<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept type="search" label="부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="retireFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="retireFlag"
            label="퇴직여부"
            v-model:value="searchParam.retireFlag"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="userTable"
          title="사용자 목록"
          tableId="userTable"
          :columns="grid.columns"
          :data="grid.data"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && deleteable"
                  :url="resetUrl"
                  :isSubmit="isReset"
                  :param="userData"
                  mappingType="PUT"
                  label="비밀번호초기화"
                  icon="password"
                  @beforeAction="resetPwd"
                  @btnCallback="resetPwdCallback"
                />
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addData" />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="userData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
                <!-- <c-btn
                  v-if="editable && deleteable"
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  :param="data"
                  mappingType="DELETE"
                  label="삭제"
                  icon="remove"
                  @beforeAction="deleteData"
                  @btnCallback="deleteCallback" /> -->
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="false"
                  label="User Id"
                  name="userId"
                  v-model:value="userData.userId"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="사번"
                  name="empNo"
                  v-model:value="userData.empNo"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="사용자"
                  name="userName"
                  v-model:value="userData.userName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="로그인 ID"
                  name="loginId"
                  v-model:value="userData.loginId"
                />
              </div>
              <div class="col-6">
                <c-dept
                  :required="true"
                  :editable="editable && dataeditable"
                  type="edit"
                  label="부서"
                  name="deptCd"
                  v-model:value="userData.deptCd"
                />
              </div>
              <div class="col-6">
                <c-select
                  codeGroupCd="SEX_CD"
                  :editable="editable && dataeditable"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="sexCd"
                  label="성별"
                  v-model:value="userData.sexCd"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="전화번호"
                  name="mobileNo"
                  mask="###-####-####"
                  v-model:value="userData.mobileNo"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="생년월일"
                  name="birthDate"
                  type="date"
                  v-model:value="userData.birthDate"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="이메일"
                  name="email"
                  type="email"
                  v-model:value="userData.email"
                />
              </div>
              <div class="col-6">
                <c-select
                  codeGroupCd="JOB_CD"
                  :editable="editable && dataeditable"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="jobCd"
                  label="직책"
                  v-model:value="userData.jobCd"
                />
              </div>
              <div class="col-6">
                <c-select
                  codeGroupCd="SPOT_CD"
                  :editable="editable && dataeditable"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="spotCd"
                  label="직위"
                  v-model:value="userData.spotCd"
                />
              </div>
              <div class="col-6">
                <c-select
                  codeGroupCd="JOB_CLASS_CD"
                  :editable="editable && dataeditable"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  label="직종"
                  name="jobClassCd"
                  v-model:value="userData.jobClassCd"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="입사일"
                  name="enterDate"
                  type="date"
                  v-model:value="userData.enterDate"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="퇴직여부"
                  name="retireFlag"
                  v-model:value="userData.retireFlag"
                />
              </div>
              <div class="col-6">
                <c-text
                  v-if="userData.retireFlag == 'Y'"
                  :editable="editable && dataeditable"
                  label="퇴직일"
                  name="retireDate"
                  type="date"
                  v-model:value="userData.retireDate"
                />
              </div>
            </template>
          </c-card>
        </q-form>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'userManage'
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
interface searchParamType {
  plantCd: stringNull
  deptCd: stringNull
  retireFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<userType>
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  deptCd: '',
  retireFlag: 'N'
})
const userData = ref<userType>({
  plantCd: null,
  userId: '',
  oldUserId: '',
  empNo: '',
  userName: '',
  loginId: '',
  deptCd: '',
  sexCd: null,
  mobileNo: '',
  birthDate: '',
  email: '',
  jobCd: null,
  spotCd: null,
  jobClassCd: null,
  retireFlag: 'N',
  retireDate: '',
  enterDate: '',
  regUserId: '',
  chgUserId: ''
})
const editable = ref(true)
const retireFlagItems = ref<Array<any>>([])
const listUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const resetUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
// const isDelete = ref(false)
const isReset = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const selectedUserId = ref('')
const rowNotSelected = ref(true)
const editForm = ref<any>(null)

const grid = ref<gridType>({
  columns: [
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
      name: 'loginId',
      field: 'loginId',
      label: '로그인 ID',
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
      label: '직책',
      align: 'center',
      sortable: false
    },
    {
      name: 'sexName',
      field: 'sexName',
      label: '성별',
      align: 'center',
      sortable: true
    },
    {
      name: 'retireFlag',
      field: 'retireFlag',
      label: '퇴직여부',
      align: 'center',
      style: 'width:70px',
      sortable: true
    }
  ],
  data: []
})

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
  retireFlagItems.value = [
    { code: 'N', codeName: $language('재직') },
    { code: 'Y', codeName: $language('퇴직') }
  ]
  // role setting
  editable.value = Boolean(route.meta.editable)
  dataeditable.value = false
  // url setting
  // code setting
  // list setting
  saveUrl.value = transactionConfig.mdm.user.insert.url
  listUrl.value = selectConfig.mdm.user.list.url
  detailUrl.value = selectConfig.mdm.user.get.url
  checkUrl.value = selectConfig.mdm.user.check.loginid.url
  insertUrl.value = transactionConfig.mdm.user.insert.url
  updateUrl.value = transactionConfig.mdm.user.update.url
  deleteUrl.value = transactionConfig.mdm.user.delete.url
  resetUrl.value = transactionConfig.mdm.user.reset.url

  getList()
}
/******************************
 * TODO (목적): 사용자 목록 조회
 *******************************/
function getList() {
  reset()
  rowNotSelected.value = true
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (user.value.userId === 'U000000001') {
      grid.value.data = _result.data
    } else {
      grid.value.data = _.filter(_result.data, (item) => {
        return item['userId'] !== 'U000000001'
      })
    }
  })
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  // 상세조회
  saveable.value = true
  deleteable.value = true
  rowNotSelected.value = false
  updateMode.value = true
  selectedUserId.value = row.userId
  $http({
    url: $format(detailUrl.value, selectedUserId.value),
    method: 'GET'
  }).then((_result: any) => {
    userData.value = _result.data
    userData.value.oldUserId = row.userId
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 비밀번호 초기화
 *******************************/
function resetPwd() {
  message.confirm({
    title: '확인',
    message: '비밀번호를 초기화 하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      userData.value.chgUserId = user.value.userId
      isReset.value = !isReset.value
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 비밀번호 초기화 콜백
 *******************************/
function resetPwdCallback() {
  message.alert({
    title: '안내',
    message: '비빌번호가 초기화 되었습니다.',
    type: 'success' // success / info / warning / error
  })
}
/******************************
 * TODO (목적): 사용자 추가
 *******************************/
function addData() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  userData.value = {
    plantCd: null,
    userId: '',
    empNo: '',
    userName: '',
    loginId: '',
    deptCd: '',
    sexCd: null,
    mobileNo: '',
    birthDate: '',
    email: '',
    jobCd: null,
    spotCd: null,
    retireFlag: 'N',
    retireDate: '',
    regUserId: user.value.userId,
    chgUserId: ''
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  selectedUserId.value = ''
  userData.value = {
    plantCd: null,
    userId: '',
    empNo: '',
    userName: '',
    loginId: '',
    deptCd: '',
    sexCd: null,
    mobileNo: '',
    birthDate: '',
    email: '',
    jobCd: null,
    spotCd: null,
    retireFlag: 'N',
    retireDate: '',
    regUserId: user.value.userId,
    chgUserId: ''
  }
}

/******************************
 * TODO (목적): 사용자 저장
 *******************************/
function saveData() {
  editForm.value.validate().then((_result: boolean) => {
    // 중복체크
    if (_result) {
      $http({
        url: checkUrl.value,
        method: 'GET',
        params: {
          loginId: userData.value.loginId,
          empNo: userData.value.empNo
        }
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            confirmCallback: () => {
              userData.value.regUserId = user.value.userId
              userData.value.chgUserId = user.value.userId
              isSave.value = !isSave.value
            },
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 사번 또는 로그인 ID가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 사용자 삭제
 *******************************/
// function deleteData() {
//   message.confirm({
//     title: '확인',
//     message: '삭제하시겠습니까?',
//     type: 'warning', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       $http({
//         url: $format(deleteUrl.value, userData.value.deptCd),
//         method: 'DELETE'
//       }).then((_result: any) => {
//         isDelete.value = !isDelete.value
//       })
//     }
//   })
// }
/******************************
 * TODO (목적): 사용자 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  getList()
  if (saveType.value == 'PUT') {
    rowClick({ userId: result.data.userId })
  }
}
/******************************
 * TODO (목적): 사용자 삭제 콜백
 *******************************/
// function deleteCallback() {
//   message.requestSuccess()
//   getList()
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

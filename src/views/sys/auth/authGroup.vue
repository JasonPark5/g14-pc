<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
      <c-table
        ref="table"
        title="권한"
        tableId="table"
        :columnSetting="false"
        :usePaging="false"
        :isFullScreen="false"
        :columns="grid.columns"
        :data="grid.data"
        :isExcelDown="false"
        :filtering="false"
        @rowClick="rowClick"
      >
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
    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
      <q-form ref="editForm">
        <c-card title="상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addGrp" />
              <c-btn
                v-if="editable && deleteable && authData.defaultFlag == 'N'"
                :url="deleteUrl"
                :isSubmit="true"
                :param="authData"
                mappingType="DELETE"
                label="삭제"
                icon="remove"
                @beforeAction="deleteGrp"
                @btnCallback="deleteCallback"
              />
              <c-btn
                v-if="editable && saveable && authData.defaultFlag == 'N'"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="authData"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveGrp"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-6">
              <c-text
                :editable="editable && dataeditable"
                :required="true"
                label="권한명"
                name="sysAuthGrpName"
                v-model:value="authData.sysAuthGrpName"
              />
            </div>
            <div class="col-3">
              <c-select
                :editable="false"
                codeGroupCd="DEVICE_CD"
                codeAttrVal1="Y"
                type="edit"
                :required="true"
                itemText="codeName"
                itemValue="code"
                name="deviceTypeCd"
                label="디바이스구분"
                v-model:value="authData.deviceTypeCd"
              />
            </div>
            <div class="col-3">
              <c-text
                :disabled="true"
                label="권한 코드"
                name="sysAuthGrpId"
                v-model:value="authData.sysAuthGrpId"
              />
            </div>
            <div class="col-12">
              <c-textarea
                :editable="editable && dataeditable"
                label="설명"
                name="remark"
                :rows="3"
                v-model:value="authData.remark"
              />
            </div>
            <div class="col-6">
              <c-select
                :comboItems="dashboardItems"
                type="edit"
                itemText="menuNm"
                itemValue="sysMenuId"
                name="dashboardId"
                label="기본 대시보드(메인)"
                v-model:value="authData.dashboardId"
              />
            </div>
            <div class="col-6">
              <c-text
                :editable="editable && dataeditable"
                type="number"
                label="대시보드 우선순위"
                name="dashboardOrder"
                v-model:value="authData.dashboardOrder"
              />
            </div>
            <div class="col-6">
              <c-checkbox
                :editable="editable && dataeditable"
                :isFlag="true"
                label="사용여부"
                name="useFlag"
                v-model:value="authData.useFlag"
              />
            </div>
          </template>
        </c-card>
      </q-form>
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
import { authType } from './auth'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'authGroup'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
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
  useFlag: stringNull
  deviceTypeCd: stringNull
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
const editable = ref(true)
const editForm = ref<any>(null)
const searchParam = ref<searchParamType>({
  useFlag: '',
  deviceTypeCd: 'P'
})
const dashboardItems = ref<any>([])
const grid = ref({
  columns: [
    {
      name: 'sysAuthGrpName',
      field: 'sysAuthGrpName',
      label: '권한명',
      align: 'left',
      sortable: true
    },
    {
      name: 'dashboardName',
      field: 'dashboardName',
      label: '기본대시보드',
      align: 'center',
      style: 'width: 150px',
      sortable: true
    },
    {
      name: 'dashboardOrder',
      field: 'dashboardOrder',
      label: '대시보드우선순위',
      style: 'width: 120px',
      align: 'center',
      sortable: true
    }
  ],
  data: [] as any
})
const defaultFlagItems = ref<Array<any>>([])
const authData = ref<authType>({
  sysAuthGrpId: '', // 권한코드 SEQ
  sysAuthGrpName: '', // 권한명
  remark: '', // 권한 설명
  useFlag: 'Y', // 사용여부
  defaultFlag: 'N', // 사용자기본권한여부
  dashboardId: null,
  dashboardOrder: '',
  deviceTypeCd: 'P'
})
const listUrl = ref('')
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const dashboardUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')

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
  dataeditable.value = false
  // url setting
  listUrl.value = selectConfig.sys.auth.grp.list.url
  detailUrl.value = selectConfig.sys.auth.grp.get.url
  insertUrl.value = transactionConfig.sys.auth.grp.insert.url
  updateUrl.value = transactionConfig.sys.auth.grp.update.url
  deleteUrl.value = transactionConfig.sys.auth.grp.delete.url
  dashboardUrl.value = selectConfig.sys.menu.dashboard.url
  // code setting
  defaultFlagItems.value = [
    { code: 'Y', codeName: $language('기본권한적용') },
    { code: 'N', codeName: $language('미적용') }
  ]
  // list setting
  getList()
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
  getList()
  rowRemoveSelect()
  reset()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: dashboardUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    dashboardItems.value = _result.data

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
    saveable.value = false
    deleteable.value = false
  })
}
/******************************
 * TODO (목적): 메뉴 클릭
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(row: any) {
  saveable.value = true
  deleteable.value = true
  updateMode.value = true
  $http({
    url: $format(detailUrl.value, row.sysAuthGrpId),
    method: 'GET'
  }).then((_result: any) => {
    authData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 추가
 *******************************/
function addGrp() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  authData.value = {
    sysAuthGrpId: '', // 권한코드 SEQ
    sysAuthGrpName: '', // 권한명
    remark: '', // 권한 설명
    useFlag: 'Y', // 사용여부
    defaultFlag: 'N', // 사용자기본권한여부
    dashboardId: null,
    dashboardOrder: '',
    deviceTypeCd: searchParam.value.deviceTypeCd
  }
  rowRemoveSelect()
}
/******************************
 * TODO (목적): reset
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  authData.value = {
    sysAuthGrpId: '', // 권한코드 SEQ
    sysAuthGrpName: '', // 권한명
    remark: '', // 권한 설명
    useFlag: 'Y', // 사용여부
    defaultFlag: 'N', // 사용자기본권한여부
    dashboardId: null,
    dashboardOrder: '',
    deviceTypeCd: searchParam.value.deviceTypeCd
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveGrp() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteGrp() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, authData.value.sysAuthGrpId),
        method: 'DELETE'
      }).then(() => {
        isSave.value = !isSave.value
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 저장 후 처리
 * @param (1): api 서버에서 회신하는 정보 (정보)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    getList()
    rowClick({ sysAuthGrpId: result.data.sysAuthGrpId })
  } else {
    getGrpList()
  }
}
/******************************
 * TODO (목적): 삭제 후 처리
 *******************************/
function deleteCallback() {
  message.requestSuccess()
  getGrpList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

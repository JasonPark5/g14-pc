<template>
  <div>
    <c-search-box @enter="getApprTypeList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="사용여부"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-table
          ref="table"
          title="결재유형 목록"
          tableId="table"
          :columnSetting="false"
          :isFullScreen="false"
          :columns="grid.columns"
          :data="grid.data"
          :isExcelDown="false"
          @rowClick="rowClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getApprTypeList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addApprType" />
                <c-btn
                  v-if="editable && deleteable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteApprType"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="apprData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveApprType"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-3">
                <c-text
                  :disabled="true"
                  label="결재유형코드"
                  name="approvalTypeCd"
                  v-model:value="apprData.approvalTypeCd"
                />
              </div>
              <div class="col-9">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="결재업무명"
                  name="approvalTypeName"
                  v-model:value="apprData.approvalTypeName"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="결재화면 page경로"
                  name="approvalUrl"
                  v-model:value="apprData.approvalUrl"
                />
              </div>
              <div class="col-9">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="결재화면 파라메터"
                  name="approvalParam"
                  v-model:value="apprData.approvalParam"
                />
              </div>
              <div class="col-3">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="apprData.useFlag"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable && dataeditable"
                  label="결재메일내용"
                  name="approvalContent"
                  v-model:value="apprData.approvalContent"
                  :rows="3"
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
  name: 'apprManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
/** message 호출 */
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
interface searchParamType {
  useFlag: stringNull
}
interface apprType {
  approvalTypeCd: stringNull // 결재유형코드
  approvalTypeName: stringNull // 결재업무명
  approvalUrl: stringNull // 결재화면 page경로
  approvalParam: stringNull // 결재파라메터
  approvalContent: stringNull // 결재메일내용
  useFlag: stringNull // 사용여부
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
const searchParam = ref<searchParamType>({
  useFlag: 'Y'
})
const useFlagItems = ref<codeMasterType>([])
const grid = ref({
  columns: [
    {
      name: 'approvalTypeCd',
      field: 'approvalTypeCd',
      label: '결재유형코드',
      align: 'center',
      style: 'width: 120px',
      sortable: true
    },
    {
      name: 'approvalTypeName',
      field: 'approvalTypeName',
      label: '결재업무명',
      align: 'left',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: true
    }
  ],
  data: []
})
const apprData = ref<apprType>({
  approvalTypeCd: '', // 결재유형코드
  approvalTypeName: '', // 결재업무명
  approvalUrl: '', // 결재화면 page경로
  approvalParam: '', // 결재파라메터
  approvalContent: '', // 결재메일내용
  useFlag: 'Y' // 사용여부
})
const listUrl = ref('')
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)
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
  editable.value = user.value.userId === 'U000000001' ? Boolean(route.meta.editable) : false
  dataeditable.value = false
  // url setting
  listUrl.value = selectConfig.sys.appr.type.list.url
  detailUrl.value = selectConfig.sys.appr.type.get.url
  insertUrl.value = transactionConfig.sys.appr.type.insert.url
  updateUrl.value = transactionConfig.sys.appr.type.update.url
  deleteUrl.value = transactionConfig.sys.appr.type.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 조회 및 초기화
 *******************************/
function getApprTypeList() {
  getList()
  rowRemoveSelect()
  reset()
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
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
  saveable.value = false
  deleteable.value = false
}
/******************************
 * TODO (목적): 행 클릭 - 상세조회
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(row: any) {
  saveable.value = true
  deleteable.value = true
  updateMode.value = true
  dataeditable.value = true
  $http({
    url: $format(detailUrl.value, row.approvalTypeCd),
    method: 'GET'
  }).then((_result: any) => {
    apprData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  })
}
/******************************
 * TODO (목적): 결재업무 추가
 *******************************/
function addApprType() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  apprData.value = {
    approvalTypeCd: '', // 결재유형코드
    approvalTypeName: '', // 결재업무명
    approvalUrl: '', // 결재화면 page경로
    approvalParam: '', // 결재파라메터
    approvalContent: '', // 결재메일내용
    useFlag: 'Y' // 사용여부
  }
  rowRemoveSelect()
}
/******************************
 * TODO (목적): 결재업무 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  apprData.value = {
    approvalTypeCd: '', // 결재유형코드
    approvalTypeName: '', // 결재업무명
    approvalUrl: '', // 결재화면 page경로
    approvalParam: '', // 결재파라메터
    approvalContent: '', // 결재메일내용
    useFlag: 'Y' // 사용여부
  }
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveApprType() {
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
 * TODO (목적): 저장 후 처리
 * @param (1): api 서버에서 회신하는 정보 (정보)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    getList()
    rowClick({ approvalTypeCd: result.data.approvalTypeCd })
  } else {
    getApprTypeList()
  }
}
/******************************
 * TODO (목적): 공지사항 삭제
 *******************************/
function deleteApprType() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, apprData.value.approvalTypeCd),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        getApprTypeList()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

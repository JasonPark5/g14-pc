<template>
  <div>
    <c-search-box @enter="getAttachList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <!-- 사용여부 -->
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
          title="Excel upload 설정 목록"
          tableId="table"
          :columnSetting="false"
          :isFullScreen="false"
          :columns="grid.columns"
          :data="grid.data"
          @rowClick="rowClick"
          :isExcelDown="false"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getAttachList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="newData" />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="excelUploadSetting"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveAttach"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="업무구분코드"
                  name="taskClassCd"
                  v-model:value="excelUploadSetting.taskClassCd"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="excelUploadSetting.useFlag"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="업무구분설명"
                  name="taskClassDesc"
                  v-model:value="excelUploadSetting.taskClassDesc"
                />
              </div>
              <div class="col-12">
                <c-upload
                  :attachInfo="attachInfo"
                  :editable="editable && dataeditable"
                  label="엑셀업로드 양식"
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
  name: 'exceluploadManage'
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
interface excelUploadSettingType {
  taskClassCd: stringNull // 업무구분코드
  taskClassDesc: stringNull // 업무구분설명
  useFlag: stringNull // 사용여부
  regUserId: stringNull // 등록자 ID
  chgUserId: stringNull // 수정자 ID
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

const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'EXCEL_UPLOAD_TEMPLATE',
  taskKey: ''
})
const searchParam = ref<searchParamType>({
  useFlag: 'Y'
})
const useFlagItems = ref<codeMasterType>([])
const grid = ref({
  columns: [
    {
      name: 'taskClassCd',
      field: 'taskClassCd',
      label: '업무구분코드',
      align: 'center',
      sortable: true
    },
    {
      name: 'taskClassDesc',
      field: 'taskClassDesc',
      label: '업무구분설명',
      align: 'left',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width: 70px',
      sortable: true
    }
  ],
  data: []
})
const excelUploadSetting = ref<excelUploadSettingType>({
  taskClassCd: '', // 업무구분코드
  taskClassDesc: '', // 업무구분설명
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})
const listUrl = ref('')
const dataeditable = ref(false)
const saveable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const saveType = ref('POST')
const insertUrl = ref('')
const updateUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const saveUrl = ref('')
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
  listUrl.value = selectConfig.sys.excelUpload.list.url
  detailUrl.value = selectConfig.sys.excelUpload.get.url
  checkUrl.value = selectConfig.sys.excelUpload.check.url
  insertUrl.value = transactionConfig.sys.excelUpload.insert.url
  updateUrl.value = transactionConfig.sys.excelUpload.update.url
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
function getAttachList() {
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
}
/******************************
 * TODO (목적): 행 클릭 - 상세조회
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(row: any) {
  saveable.value = true
  updateMode.value = true
  $http({
    url: $format(detailUrl.value, row.taskClassCd),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    excelUploadSetting.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    attachInfo.value.taskKey = row.taskClassCd
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 추가
 *******************************/
function newData() {
  saveable.value = true
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  excelUploadSetting.value = {
    taskClassCd: '', // 업무구분코드
    taskClassDesc: '', // 업무구분설명
    useFlag: 'Y', // 사용여부
    regUserId: '', // 등록자 ID
    chgUserId: '' // 수정자 ID
  }
  rowRemoveSelect()
}
/******************************
 * TODO (목적): 공지사항 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  updateMode.value = false
  dataeditable.value = false
  excelUploadSetting.value = {
    taskClassCd: '', // 업무구분코드
    taskClassDesc: '', // 업무구분설명
    useFlag: 'Y', // 사용여부
    regUserId: '', // 등록자 ID
    chgUserId: '' // 수정자 ID
  }
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveAttach() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: $format(checkUrl.value, excelUploadSetting.value.taskClassCd),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              excelUploadSetting.value.regUserId = user.value.userId
              excelUploadSetting.value.chgUserId = user.value.userId

              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 시퀀스 아이디가 존재합니다.',
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
 * TODO (목적): 저장 후 처리
 * @param (1): api 서버에서 회신하는 정보 (정보)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    getList()
    rowClick({ taskClassCd: result.data })
  } else {
    attachInfo.value.taskKey = result.data
    attachInfo.value.isSubmit = uid()
    getAttachList()
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

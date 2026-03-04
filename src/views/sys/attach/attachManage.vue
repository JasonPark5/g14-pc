<template>
  <div>
    <c-search-box @enter="getAttachList">
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
          title="첨부파일 설정 목록"
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
                <c-btn
                  v-if="editable && isManager"
                  label="등록"
                  icon="add"
                  @btnClicked="addAttach"
                />
                <c-btn
                  v-if="editable && deleteable && isManager"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteAttach"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="attachData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveAttach"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="
                    editable && dataeditable && isManager && attachData.taskClassCd.length === 0
                  "
                  :required="true"
                  label="업무구분코드"
                  name="taskClassCd"
                  v-model:value="attachData.taskClassCd"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="attachData.useFlag"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable && dataeditable && isManager"
                  :required="true"
                  label="업무구분설명"
                  name="taskClassDesc"
                  v-model:value="attachData.taskClassDesc"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="허용확장자"
                  name="acceptExt"
                  v-model:value="attachData.acceptExt"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="업로드가능파일수"
                  :required="true"
                  name="limitCnt"
                  type="number"
                  suffix="개"
                  :maxlength="2"
                  v-model:value="attachData.limitCnt"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="업로드가능파일크기"
                  :required="true"
                  name="limitSize"
                  type="number"
                  suffix="MB"
                  :maxlength="5"
                  v-model:value="attachData.limitSize"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="이미지 리사이즈 넓이 (0:원본)"
                  name="resizeWidth"
                  type="number"
                  suffix="px"
                  :maxlength="5"
                  v-model:value="attachData.resizeWidth"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="이미지 리사이즈 품질 (1:원본)"
                  name="resizeQuality"
                  type="number"
                  :maxlength="5"
                  v-model:value="attachData.resizeQuality"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="DragDrop 허용여부"
                  name="dragDropFlag"
                  v-model:value="attachData.dragDropFlag"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="파일다중선택 가능여부"
                  name="multipleSelFlag"
                  v-model:value="attachData.multipleSelFlag"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="미리보기여부"
                  name="previewFlag"
                  v-model:value="attachData.previewFlag"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="설명작성 가능여부"
                  name="explainFlag"
                  v-model:value="attachData.explainFlag"
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
  name: 'attachManage'
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
interface attachType {
  taskClassCd: stringNull // 업무구분코드
  taskClassDesc: stringNull // 업무구분설명
  acceptExt: stringNull // 허용확장자
  limitCnt: stringNull // 업로드가능파일수
  limitSize: stringNull // 업로드가능파일크기
  dragDropFlag: stringNull // DragDrop허용여부
  multipleSelFlag: stringNull // 파일다중선택가능여부
  previewFlag: stringNull // 미리보기여부
  explainFlag: stringNull // 설명작성 가능여부
  onlyImageFlag: stringNull // 이미지전용 여부
  imgWidth: stringNull // 이미지 넓이
  imgHeight: stringNull // 이미지 높이
  useFlag: stringNull // 사용여부
  resizeWidth: stringNull
  resizeQuality: stringNull
  regUserId?: numberNull
  chgUserId?: numberNull
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
const attachData = ref<attachType>({
  taskClassCd: '', // 업무구분코드
  taskClassDesc: '', // 업무구분설명
  acceptExt: '', // 허용확장자
  limitCnt: '', // 업로드가능파일수
  limitSize: '', // 업로드가능파일크기
  dragDropFlag: '', // DragDrop허용여부
  multipleSelFlag: '', // 파일다중선택가능여부
  previewFlag: '', // 미리보기여부
  explainFlag: '', // 설명작성 가능여부
  onlyImageFlag: 'N', // 이미지전용 여부
  imgWidth: '', // 이미지 넓이
  imgHeight: '', // 이미지 높이
  useFlag: '', // 사용여부
  resizeWidth: '',
  resizeQuality: ''
})
const listUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isManager = ref(false)
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
  editable.value = Boolean(route.meta.editable)
  isManager.value = user.value.userId === 'U000000001'
  dataeditable.value = false
  // url setting
  listUrl.value = selectConfig.sys.attach.list.url
  detailUrl.value = selectConfig.sys.attach.get.url
  checkUrl.value = selectConfig.sys.attach.check.url
  insertUrl.value = transactionConfig.sys.attach.insert.url
  updateUrl.value = transactionConfig.sys.attach.update.url
  deleteUrl.value = transactionConfig.sys.attach.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 환경설정 조회
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
    url: $format(detailUrl.value, row.taskClassCd),
    method: 'GET'
  }).then((_result: any) => {
    attachData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  })
}
/******************************
 * TODO (목적): 추가
 *******************************/
function addAttach() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  attachData.value = {
    taskClassCd: '',
    taskClassDesc: '',
    acceptExt: '',
    limitCnt: '5',
    limitSize: '10',
    dragDropFlag: 'Y',
    multipleSelFlag: 'Y',
    previewFlag: 'N',
    explainFlag: 'N',
    onlyImageFlag: 'N', // 이미지전용 여부
    imgWidth: '0', // 이미지 넓이
    imgHeight: '0', // 이미지 높이
    useFlag: 'Y',
    resizeWidth: 800,
    resizeQuality: 0.7
  }
  rowRemoveSelect()
}
/******************************
 * TODO (목적): 환경설정 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  attachData.value = {
    taskClassCd: '',
    taskClassDesc: '',
    acceptExt: '',
    limitCnt: '',
    limitSize: '',
    dragDropFlag: 'N',
    multipleSelFlag: 'N',
    previewFlag: 'N',
    explainFlag: 'N',
    onlyImageFlag: 'N', // 이미지전용 여부
    imgWidth: '0', // 이미지 넓이
    imgHeight: '0', // 이미지 높이
    useFlag: 'N',
    resizeWidth: '',
    resizeQuality: ''
  }
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveAttach() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: $format(checkUrl.value, attachData.value.taskClassCd),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
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
    rowClick({ taskClassCd: result.data.taskClassCd })
  } else {
    getAttachList()
  }
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteAttach() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, attachData.value.taskClassCd),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        getAttachList()
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

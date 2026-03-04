<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-search-box @enter="getList">
          <template v-slot:search>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                type="search"
                codeGroupCd="NOTICE_CLASS_CD"
                itemText="codeName"
                itemValue="code"
                label="공지분류"
                name="noticeClassCd"
                v-model:value="searchParam.noticeClassCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                :range="true"
                name="period"
                label="등록기간"
                v-model:value="searchParam.period"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field label="등록자" name="userId" v-model:value="searchParam.userId" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                :editable="editable"
                :comboItems="popupFlagItems"
                label="팝업여부"
                itemText="codeName"
                itemValue="code"
                type="search"
                name="popupFlag"
                v-model:value="searchParam.popupFlag"
              />
            </div>
          </template>
        </c-search-box>
        <c-table
          ref="table"
          title="공지사항 목록"
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
              <c-btn label="검색" icon="search" @btnClicked="getNoticeList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addNotice" />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="noticeData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveNotice"
                  @btnCallback="saveCallback"
                />
                <c-btn
                  v-if="editable && deleteable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteNotice"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="공지사항 제목"
                  name="noticeTitle"
                  v-model:value="noticeData.noticeTitle"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable && dataeditable"
                  codeGroupCd="NOTICE_CLASS_CD"
                  type="edit"
                  :required="true"
                  itemText="codeName"
                  itemValue="code"
                  name="noticeClassCd"
                  label="공지사항분류"
                  v-model:value="noticeData.noticeClassCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4" v-show="editable">
                <c-radio
                  :editable="editable && dataeditable"
                  :comboItems="popupFlagItems"
                  label="팝업여부"
                  name="popupFlag"
                  v-model:value="noticeData.popupFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :editable="editable && dataeditable && noticeData.popupFlag == 'Y'"
                  label="팝업 시작일"
                  :required="noticeData.popupFlag == 'Y'"
                  name="popupStartDate"
                  v-model:value="noticeData.popupStartDate"
                  :end="noticeData.popupEndDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :editable="editable && dataeditable && noticeData.popupFlag == 'Y'"
                  label="팝업 종료일"
                  :required="noticeData.popupFlag == 'Y'"
                  name="popupEndDate"
                  v-model:value="noticeData.popupEndDate"
                  :start="noticeData.popupStartDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable && dataeditable"
                  type="editor"
                  label="내용"
                  name="noticeContents"
                  :editheight="30"
                  v-model:value="noticeData.noticeContents"
                />
              </div>
            </template>
          </c-card>
          <c-upload
            :attachInfo="attachInfoNotice"
            :editable="editable && dataeditable"
            label="첨부파일"
          />
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
import { noticeDataType } from './notice'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'noticeManage'
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
  vendorFlag: stringNull
  popupFlag: stringNull
  noticeClassCd?: stringNull
  userId?: stringNull
  startYmd?: stringNull
  endYmd?: stringNull
  period?: stringNull[]
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

const attachInfoNotice = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'NOTICE',
  taskKey: ''
})
const searchParam = ref<searchParamType>({
  popupFlag: '',
  vendorFlag: 'N',
  noticeClassCd: null,
  userId: '',
  startYmd: '',
  endYmd: '',
  period: []
})
const popupFlagItems = ref<codeMasterType>([
  { code: 'Y', codeName: $language('팝업사용') },
  { code: 'N', codeName: $language('미사용') }
])
const grid = ref({
  columns: [
    {
      name: 'noticeClassName',
      field: 'noticeClassName',
      label: '공지분류',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'noticeTitle',
      field: 'noticeTitle',
      label: '제목',
      align: 'left',
      sortable: true
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '등록일시',
      align: 'center',
      style: 'width: 180px',
      sortable: true
    }
  ],
  data: []
})
const noticeData = ref<noticeDataType>({
  sysNoticeId: '', // 공지사항 번호
  noticeClassCd: null, // 공지분류
  noticeClassName: '', // 공지분류명
  noticeTitle: '', // 제목
  noticeContents: '', // 내용
  popupFlag: 'N', // 팝업여부
  popupStartDate: '', // 팝업시작일자
  popupEndDate: '' // 팝업종료일자
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
  editable.value = Boolean(route.meta.editable)
  dataeditable.value = false
  // url setting
  listUrl.value = selectConfig.sys.notice.list.url
  detailUrl.value = selectConfig.sys.notice.get.url
  insertUrl.value = transactionConfig.sys.notice.insert.url
  updateUrl.value = transactionConfig.sys.notice.update.url
  deleteUrl.value = transactionConfig.sys.notice.delete.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 공지사항 조회
 *******************************/
function getNoticeList() {
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
  if (searchParam.value.period && searchParam.value.period.length === 2) {
    ;[searchParam.value.startYmd, searchParam.value.endYmd] = searchParam.value.period
  } else {
    ;[searchParam.value.startYmd, searchParam.value.endYmd] = ['', '']
  }
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
  $http({
    url: $format(detailUrl.value, row.sysNoticeId),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    noticeData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    attachInfoNotice.value.taskKey = row.sysNoticeId
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 공지사항 추가
 *******************************/
function addNotice() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  noticeData.value = {
    sysNoticeId: '', // 공지사항 번호
    noticeClassCd: null, // 공지분류
    noticeClassName: '', // 공지분류명
    noticeTitle: '', // 제목
    noticeContents: '', // 내용
    popupFlag: 'N', // 팝업여부
    popupStartDate: '', // 팝업시작일자
    popupEndDate: '' // 팝업종료일자
  }
  attachInfoNotice.value.taskKey = uid()
  rowRemoveSelect()
}
/******************************
 * TODO (목적): 공지사항 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  noticeData.value = {
    sysNoticeId: '', // 공지사항 번호
    noticeClassCd: null, // 공지분류
    noticeClassName: '', // 공지분류명
    noticeTitle: '', // 제목
    noticeContents: '', // 내용
    popupFlag: 'N', // 팝업여부
    popupStartDate: '', // 팝업시작일자
    popupEndDate: '' // 팝업종료일자
  }
  attachInfoNotice.value.taskKey = uid()
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveNotice() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          orderedPromise([{ func: setSaveValue }, { func: saveValue }])
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 저장 전 저장값 셋팅
 *******************************/
function setSaveValue() {
  return new Promise((resolve) => {
    noticeData.value.regUserId = user.value.userId
    noticeData.value.chgUserId = user.value.userId
    resolve(true)
  })
}
/******************************
 * TODO (목적): 저장 emit 처리
 *******************************/
function saveValue() {
  return new Promise((resolve) => {
    isSave.value = !isSave.value
    resolve(true)
  })
}
/******************************
 * TODO (목적): 저장 후 처리
 * @param (1): api 서버에서 회신하는 정보 (정보)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    rowClick(noticeData.value)
  } else {
    attachInfoNotice.value.taskKey = result.data.sysNoticeId
    attachInfoNotice.value.isSubmit = uid()
    getNoticeList()
  }
}
/******************************
 * TODO (목적): 공지사항 삭제
 *******************************/
function deleteNotice() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, noticeData.value.sysNoticeId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        getNoticeList()
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

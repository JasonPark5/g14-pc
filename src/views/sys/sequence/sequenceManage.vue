<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
      <c-table
        ref="table"
        title="시퀀스 목록"
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
            <c-btn label="검색" icon="search" @btnClicked="getSeqList" />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
      <q-form ref="editForm">
        <c-card title="상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addDept" />
              <c-btn
                v-if="editable && deleteable"
                label="삭제"
                icon="remove"
                @btnClicked="deleteDept"
              />
              <c-btn
                v-if="editable && saveable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="seqData"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveDept"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-12">
              <c-text
                :editable="editable && dataeditable"
                :required="true"
                label="시퀀스ID"
                name="sequenceId"
                autofocus
                v-model:value="seqData.sequenceId"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable && dataeditable"
                :required="true"
                label="시퀀스명"
                name="sequenceNm"
                v-model:value="seqData.sequenceNm"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable && dataeditable"
                :required="true"
                label="현재값"
                name="currentVal"
                v-model:value="seqData.currentVal"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable && dataeditable"
                label="prefix 단어"
                name="prefix"
                v-model:value="seqData.prefix"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable && dataeditable"
                :required="true"
                label="숫자 자리수"
                type="number"
                name="numLength"
                v-model:value="seqData.numLength"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable && dataeditable"
                :required="true"
                label="증가율"
                type="number"
                name="increaseRate"
                v-model:value="seqData.increaseRate"
              />
            </div>
            <div class="col-12">
              <c-radio
                :editable="editable && dataeditable"
                :comboItems="useFlagItems"
                label="사용여부"
                name="useFlag"
                v-model:value="seqData.useFlag"
              />
            </div>
            <div class="col-12">
              <c-textarea
                :editable="editable && dataeditable"
                label="설명"
                name="description"
                v-model:value="seqData.description"
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sequenceManage'
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
interface seqType {
  sequenceId: stringNull
  sequenceNm: stringNull
  currentVal: stringNull
  prefix: stringNull
  numLength: stringNull
  increaseRate: stringNull
  useFlag: stringNull
  description: stringNull
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
      name: 'sequenceId',
      field: 'sequenceId',
      label: '시퀀스ID',
      align: 'left',
      sortable: true
    },
    {
      name: 'sequenceNm',
      field: 'sequenceNm',
      label: '시퀀스명',
      align: 'left',
      sortable: true
    },
    {
      name: 'currentVal',
      field: 'currentVal',
      label: '현재값',
      align: 'right',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'prefix',
      field: 'prefix',
      label: 'prefix 단어',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'numLength',
      field: 'numLength',
      label: '숫자 자리수',
      align: 'right',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'increaseRate',
      field: 'increaseRate',
      label: '증가율',
      align: 'right',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:70px',
      sortable: true
    }
  ],
  data: []
})
const seqData = ref<seqType>({
  sequenceId: '',
  sequenceNm: '',
  currentVal: '',
  prefix: '',
  numLength: '',
  increaseRate: '',
  useFlag: '',
  description: ''
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
  listUrl.value = selectConfig.sys.sequence.list.url
  detailUrl.value = selectConfig.sys.sequence.get.url
  checkUrl.value = selectConfig.sys.sequence.check.url
  insertUrl.value = transactionConfig.sys.sequence.insert.url
  updateUrl.value = transactionConfig.sys.sequence.update.url
  deleteUrl.value = transactionConfig.sys.sequence.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 시퀀스 조회 및 초기화
 *******************************/
function getSeqList() {
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
  $http({
    url: $format(detailUrl.value, row.sequenceId),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    seqData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 시퀀스 추가
 *******************************/
function addDept() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  seqData.value = {
    sequenceId: '',
    sequenceNm: '',
    currentVal: '0',
    prefix: '',
    numLength: '',
    increaseRate: '1',
    useFlag: 'Y',
    description: ''
  }
  rowRemoveSelect()
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
  seqData.value = {
    sequenceId: '',
    sequenceNm: '',
    currentVal: '',
    prefix: '',
    numLength: '',
    increaseRate: '',
    useFlag: 'Y',
    description: ''
  }
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveDept() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: $format(checkUrl.value, seqData.value.sequenceId),
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
  getList()
  rowClick({ sequenceId: result.data.sequenceId })
}
/******************************
 * TODO (목적): 공지사항 삭제
 *******************************/
function deleteDept() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, seqData.value.sequenceId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        getSeqList()
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

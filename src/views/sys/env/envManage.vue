<template>
  <div>
    <c-search-box @enter="getEnvList">
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
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-table
          ref="table"
          title="환경설정 목록"
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
              <c-btn label="검색" icon="search" @btnClicked="getEnvList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addEnv" />
                <c-btn
                  v-if="editable && deleteable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteEnv"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="envData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveEnv"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="editable && !updateMode && dataeditable"
                  :required="true"
                  label="환경설정코드"
                  name="envCd"
                  v-model:value="envData.envCd"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="환경설정명"
                  name="envName"
                  v-model:value="envData.envName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="설정값"
                  name="attrVal01"
                  v-model:value="envData.attrVal01"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="추가속성 2"
                  name="attrVal02"
                  v-model:value="envData.attrVal02"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="추가속성 3"
                  name="attrVal03"
                  v-model:value="envData.attrVal03"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="추가속성 4"
                  name="attrVal04"
                  v-model:value="envData.attrVal04"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable && dataeditable"
                  label="설명"
                  name="description"
                  v-model:value="envData.description"
                />
              </div>
              <div class="col-6">
                <c-radio
                  :editable="editable && dataeditable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="envData.useFlag"
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
  name: 'envManage'
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
interface envType {
  envCd: stringNull // 환경설정 마스터코드
  envName: stringNull // 환경설정 코드명
  description: stringNull // 코드마스터 설명
  attrVal01: stringNull // 설정 값
  attrVal02: stringNull // 추가속성 2
  attrVal03: stringNull // 추가속성 3
  attrVal04: stringNull // 추가속성 4
  useFlag: stringNull // 사용여부
  regUserId?: stringNull
  chgUserId?: stringNull
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
      name: 'envCd',
      field: 'envCd',
      label: '환경설정코드',
      align: 'center',
      sortable: true
    },
    {
      name: 'envName',
      field: 'envName',
      label: '환경설정명',
      align: 'center',
      sortable: true
    },
    {
      name: 'description',
      field: 'description',
      label: '설명',
      align: 'left',
      sortable: true
    },
    {
      name: 'attrVal01',
      field: 'attrVal01',
      label: '설정 값',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const envData = ref<envType>({
  envCd: '', // 환경설정 마스터코드
  envName: '', // 환경설정 코드명
  description: '', // 코드마스터 설명
  attrVal01: '', // 설정 값
  attrVal02: '', // 추가속성 2
  attrVal03: '', // 추가속성 3
  attrVal04: '', // 추가속성 4
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
  listUrl.value = selectConfig.sys.env.list.url
  detailUrl.value = selectConfig.sys.env.get.url
  insertUrl.value = transactionConfig.sys.env.insert.url
  updateUrl.value = transactionConfig.sys.env.update.url
  deleteUrl.value = transactionConfig.sys.env.delete.url
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
function getEnvList() {
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
    url: $format(detailUrl.value, row.envCd),
    method: 'GET'
  }).then((_result: any) => {
    envData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  })
}
/******************************
 * TODO (목적): 환경설정 추가
 *******************************/
function addEnv() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  envData.value = {
    envCd: '', // 환경설정 마스터코드
    envName: '', // 환경설정 코드명
    description: '', // 코드마스터 설명
    attrVal01: '', // 설정 값
    attrVal02: '', // 추가속성 2
    attrVal03: '', // 추가속성 3
    attrVal04: '', // 추가속성 4
    useFlag: 'Y' // 사용여부
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
  envData.value = {
    envCd: '', // 환경설정 마스터코드
    envName: '', // 환경설정 코드명
    description: '', // 코드마스터 설명
    attrVal01: '', // 설정 값
    attrVal02: '', // 추가속성 2
    attrVal03: '', // 추가속성 3
    attrVal04: '', // 추가속성 4
    useFlag: 'Y' // 사용여부
  }
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveEnv() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          envData.value.regUserId = user.value.userId
          envData.value.chgUserId = user.value.userId
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
    rowClick({ envCd: result.data.envCd })
  } else {
    getEnvList()
  }
}
/******************************
 * TODO (목적): 공지사항 삭제
 *******************************/
function deleteEnv() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, envData.value.envCd),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        getEnvList()
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

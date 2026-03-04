<template>
  <div>
    <c-search-box @enter="getSearchList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="edit" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
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
        <c-tree-table
          ref="processTable"
          title="공정 목록"
          parentProperty="upProcessCd"
          customID="processCd"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getSearchList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card :title="title" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="신규 공정" icon="add" @btnClicked="addParent" />
                <c-btn
                  v-if="editable && processData.processLevelCd == '10' && selectedProcessCd"
                  label="신규 단위공정"
                  icon="add"
                  @btnClicked="addChild"
                />
                <c-btn
                  v-if="editable && dataeditable && selectedProcessCd"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeProcess"
                />
                <c-btn
                  v-if="editable && dataeditable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="processData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-if="processData.processLevelCd != '20'" v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="공정명"
                  name="processName"
                  v-model:value="processData.processName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="공정관리번호"
                  name="processNo"
                  v-model:value="processData.processNo"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable && dataeditable"
                  label="사업장"
                  name="plantCd"
                  v-model:value="processData.plantCd"
                />
              </div> -->
              <div class="col-4">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  type="number"
                  label="순번"
                  name="orderNo"
                  v-model:value="processData.orderNo"
                />
              </div>
              <div class="col-4">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="PSM대상"
                  name="psmFlag"
                  v-model:value="processData.psmFlag"
                />
              </div>
              <div class="col-4">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="processData.useFlag"
                />
              </div>
              <div class="col-5">
                <c-text
                  :editable="editable && dataeditable"
                  label="주재료"
                  name="mainMaterial"
                  v-model:value="processData.mainMaterial"
                />
              </div>
              <div class="col-5">
                <c-text
                  :editable="editable && dataeditable"
                  label="생산품"
                  name="productName"
                  v-model:value="processData.productName"
                />
              </div>
              <div class="col-2">
                <c-text
                  :editable="editable && dataeditable"
                  label="근로자수"
                  name="workerCnt"
                  :suffix="$language('명')"
                  type="number"
                  v-model:value="processData.workerCnt"
                />
              </div>
              <div class="col-12 q-mb-md">
                <c-textarea
                  :counter="true"
                  :editable="editable && dataeditable"
                  label="공정설명"
                  name="processDesc"
                  :rows="2"
                  v-model:value="processData.processDesc"
                />
              </div>
              <div class="col-12">
                <c-upload
                  :attachInfo="attachInfoL1Photo"
                  :editable="editable && dataeditable"
                  label="공정 사진"
                />
              </div>
              <div class="col-12" style="margin-top: -15px !important">
                <c-upload
                  :attachInfo="attachInfoL1Hazard"
                  :editable="editable && dataeditable"
                  label="그 밖의 유해위험정보"
                />
              </div>
            </template>
            <template v-else-if="processData.processLevelCd == '20'" v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="단위공정명"
                  name="processName"
                  v-model:value="processData.processName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="공정관리번호"
                  name="processNo"
                  v-model:value="processData.processNo"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  type="number"
                  label="순번"
                  name="orderNo"
                  v-model:value="processData.orderNo"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="false"
                  label="상위공정"
                  name="upProcessName"
                  v-model:value="processData.upProcessName"
                />
              </div>
              <div class="col-6">
                <c-dept-multi
                  label="관리부서"
                  :editable="editable && dataeditable"
                  :parentCheckDepts="processData.managementDepts"
                  :plantCd="processData.plantCd"
                  name="managementDepts"
                  v-model:value="processData.managementDepts"
                />
              </div>
              <div class="col-3">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="processData.useFlag"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :counter="true"
                  :editable="editable && dataeditable"
                  label="단위공정 설명"
                  name="processDesc"
                  :rows="2"
                  v-model:value="processData.processDesc"
                />
              </div>
              <div class="col-4">
                <c-select
                  :editable="editable && dataeditable"
                  codeGroupCd="WORK_CYCLE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="workCycleCd"
                  label="작업발생 주기"
                  v-model:value="processData.workCycleCd"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable && dataeditable"
                  type="number"
                  label="작업시간(1회)"
                  name="workingTime"
                  v-model:value="processData.workingTime"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable && dataeditable"
                  label="사용온도"
                  name="temperature"
                  suffix="°C"
                  v-model:value="processData.temperature"
                />
              </div>
              <div class="col-12">
                <c-upload
                  :attachInfo="attachInfoL2Photo"
                  :editable="editable && dataeditable"
                  label="단위공정 사진"
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
import { uid } from 'quasar'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'processManage'
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
  useFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<processType>
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
  plantCd: null,
  useFlag: 'Y'
})
const processData = ref<processType>({
  plantCd: null,
  processCd: '',
  processNo: '',
  processName: '',
  upProcessCd: '',
  upProcessName: '',
  processLevelCd: '',
  processDesc: '',
  managementDepts: '',
  orderNo: 0,
  mainMaterial: '',
  workerCnt: 0,
  productName: '',
  useFlag: 'Y',
  psmFlag: 'N',
  workCycleCd: null,
  workingTime: null,
  temperature: '',
  regUserId: '',
  chgUserId: ''
})
const listUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const saveType = ref('POST')
const selectedProcessCd = ref('')
const selectedProcess = ref<processType>({
  plantCd: null,
  processCd: '',
  processNo: '',
  processName: '',
  upProcessCd: '',
  upProcessName: '',
  processLevelCd: '',
  processDesc: '',
  managementDepts: '',
  orderNo: 0,
  mainMaterial: '',
  workerCnt: 0,
  productName: '',
  useFlag: 'Y',
  psmFlag: 'N',
  workCycleCd: null,
  workingTime: null,
  temperature: '',
  regUserId: '',
  chgUserId: ''
})
const psmYnItems = ref<Array<any>>([])
const useFlagItems = ref<Array<any>>([])
const editForm = ref<any>(null)
const attachInfoL1Photo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_UP',
  taskKey: ''
})
const attachInfoL2Photo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_UNIT_PHOTO',
  taskKey: ''
})
const attachInfoL1Hazard = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_UNIT_HAZARD',
  taskKey: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'left',
      sortable: false
    },
    {
      name: 'orderNo',
      field: 'orderNo',
      label: '순번',
      align: 'center',
      style: 'width: 70px',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width: 70px',
      sortable: false
    }
  ],
  data: []
})

/******************************
 * @Computed_선언
 *******************************/
const title = computed(() =>
  processData.value.processLevelCd == '20' ? '단위공정 상세' : '공정상세'
)

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
  listUrl.value = selectConfig.mdm.process.list.url
  detailUrl.value = selectConfig.mdm.process.get.url
  checkUrl.value = selectConfig.mdm.process.check.url
  insertUrl.value = transactionConfig.mdm.process.insert.url
  updateUrl.value = transactionConfig.mdm.process.update.url
  deleteUrl.value = transactionConfig.mdm.process.delete.url
  // code setting
  psmYnItems.value = [
    { code: 'Y', codeName: $language('대상') },
    { code: 'N', codeName: $language('해당없음') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 공정 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

function getSearchList() {
  getList()
  reset()
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
  selectedProcess.value = row
  selectedProcessCd.value = row.processCd
  // 상세조회
  saveable.value = true
  deleteable.value = true
  updateMode.value = true
  $http({
    url: $format(detailUrl.value, selectedProcessCd.value),
    method: 'GET'
  }).then((_result: any) => {
    processData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
    attachInfoL1Photo.value.taskKey = row.processCd
    attachInfoL1Hazard.value.taskKey = row.processCd
    attachInfoL2Photo.value.taskKey = row.processCd
  })
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  selectedProcessCd.value = ''
  selectedProcess.value = {
    plantCd: null,
    processCd: '',
    processNo: '',
    processName: '',
    upProcessCd: '',
    upProcessName: '',
    processLevelCd: '',
    processDesc: '',
    managementDepts: '',
    orderNo: 0,
    mainMaterial: '',
    workerCnt: 0,
    productName: '',
    useFlag: 'Y',
    psmFlag: 'N',
    workCycleCd: null,
    workingTime: null,
    temperature: '',
    regUserId: user.value.userId,
    chgUserId: user.value.userId
  }
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  processData.value = {
    plantCd: null,
    processCd: '',
    processNo: '',
    processName: '',
    upProcessCd: '',
    upProcessName: '',
    processLevelCd: '',
    processDesc: '',
    managementDepts: '',
    orderNo: 0,
    mainMaterial: '',
    workerCnt: 0,
    productName: '',
    useFlag: 'Y',
    psmFlag: 'N',
    workCycleCd: null,
    workingTime: null,
    temperature: '',
    regUserId: user.value.userId,
    chgUserId: user.value.userId
  }
  attachInfoL1Photo.value.taskKey = ''
  attachInfoL1Hazard.value.taskKey = ''
  attachInfoL2Photo.value.taskKey = ''
}

/******************************
 * TODO (목적): 공정 저장
 *******************************/
function saveData() {
  editForm.value.validate().then((_result: boolean) => {
    // 중복체크
    if (_result) {
      $http({
        url: $format(checkUrl.value, processData.value.processNo),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              processData.value.chgUserId = user.value.userId
              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 공정관리번호가 존재합니다.',
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
 * TODO (목적): 공정 삭제
 *******************************/
function removeProcess() {
  let msg = '삭제하시겠습니까?'
  if (selectedProcess.value.processLevelCd == '10') {
    msg = '상위공정 삭제 시 하위공정도 모두 삭제됩니다.\r\n삭제하시겠습니까?'
  }
  message.confirm({
    title: '확인',
    message: msg,
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, processData.value.processCd),
        method: 'DELETE'
      }).then((_result: any) => {
        getSearchList()
        message.requestSuccess()
      })
    }
  })
}
/******************************
 * TODO (목적): 공정 저장 콜백
 *******************************/
function saveCallback(_result: any) {
  if (saveType.value == 'POST') {
    attachInfoL1Photo.value.taskKey = _result.data
    attachInfoL1Photo.value.isSubmit = uid()
    attachInfoL1Hazard.value.taskKey = _result.data
    attachInfoL1Hazard.value.isSubmit = uid()
    attachInfoL2Photo.value.taskKey = _result.data
    attachInfoL2Photo.value.isSubmit = uid()
  }
  message.requestSuccess()
  getSearchList()
}
/******************************
 * TODO (목적): 상위공정 추가
 *******************************/
function addParent() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  processData.value = {
    plantCd: searchParam.value.plantCd,
    processCd: '',
    processNo: '',
    processName: '',
    upProcessCd: '',
    upProcessName: '',
    processLevelCd: '10',
    processDesc: '',
    managementDepts: '',
    orderNo: 0,
    mainMaterial: '',
    workerCnt: 0,
    productName: '',
    useFlag: 'Y',
    psmFlag: 'N',
    workCycleCd: null,
    workingTime: null,
    temperature: '',
    regUserId: user.value.userId,
    chgUserId: user.value.userId
  }
  attachInfoL1Photo.value.taskKey = ''
  attachInfoL1Hazard.value.taskKey = ''
}
/******************************
 * TODO (목적): 단위공정 추가
 *******************************/
function addChild() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  processData.value = {
    plantCd: selectedProcess.value.plantCd,
    processCd: '',
    processNo: '',
    processName: '',
    upProcessCd: selectedProcess.value.processCd,
    upProcessName: selectedProcess.value.processName,
    processLevelCd: '20',
    processDesc: '',
    managementDepts: '',
    orderNo: 0,
    mainMaterial: '',
    workerCnt: 0,
    productName: '',
    useFlag: 'Y',
    psmFlag: 'N',
    workCycleCd: null,
    workingTime: null,
    temperature: '',
    regUserId: user.value.userId,
    chgUserId: user.value.userId
  }
  attachInfoL2Photo.value.taskKey = ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

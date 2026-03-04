<template>
  <div>
    <c-search-box @enter="getBatchList">
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
          title="배치 목록"
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
              <c-btn label="검색" icon="search" @btnClicked="getBatchList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addBatch" />
                <c-btn
                  v-if="editable && deleteable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteBatch"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="batchData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveBatch"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="배치 클래스명"
                  name="batchClassName"
                  v-model:value="batchData.batchClassName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="배치명"
                  name="batchName"
                  v-model:value="batchData.batchName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="false"
                  label="크론 표현식"
                  name="cronOption"
                  v-model:value="batchData.cronOption"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="batchData.useFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable && dataeditable"
                  :rows="2"
                  label="배치 설명"
                  name="remark"
                  v-model:value="batchData.remark"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-card title="반복주기" class="cardClassDetailForm">
                  <template v-slot:card-detail>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <c-radio
                        :editable="editable && dataeditable"
                        :comboItems="rptItems"
                        label="반복주기 형태"
                        name="batchCycleRpt"
                        v-model:value="batchData.batchCycleRpt"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="batchData.batchCycleRpt == '01'"
                    >
                      <c-radio
                        :editable="editable && dataeditable"
                        :comboItems="rpt1Items"
                        label="매월/매주 구분"
                        name="batchCycleRptType1"
                        v-model:value="batchData.batchCycleRptType1"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="
                        batchData.batchCycleRpt == '01' && batchData.batchCycleRptType1 == 'm'
                      "
                    >
                      <c-select
                        type="edit"
                        :editable="editable && dataeditable"
                        :comboItems="rpt2Items"
                        itemText="codeName"
                        itemValue="code"
                        label="매월"
                        name="batchCycleRptType2"
                        v-model:value="batchData.batchCycleRptType2"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="
                        batchData.batchCycleRpt == '01' && batchData.batchCycleRptType1 == 'w'
                      "
                    >
                      <c-select
                        type="edit"
                        :editable="editable && dataeditable"
                        :comboItems="rpt3Items"
                        itemText="codeName"
                        itemValue="code"
                        label="매주"
                        name="batchCycleRptType3"
                        v-model:value="batchData.batchCycleRptType3"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="batchData.batchCycleRpt == '02'"
                    >
                      <c-select
                        :editable="editable && dataeditable"
                        :comboItems="rpt4Items"
                        itemText="codeName"
                        itemValue="code"
                        label="매일반복"
                        name="batchCycleRptType4"
                        v-model:value="batchData.batchCycleRptType4"
                      />
                    </div>
                  </template>
                </c-card>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-card title="실행주기" class="cardClassDetailForm">
                  <template v-slot:card-detail>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                      <c-radio
                        :editable="editable && dataeditable"
                        :comboItems="exeItems"
                        label="실행주기 구분"
                        name="batchCycleExe"
                        v-model:value="batchData.batchCycleExe"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="batchData.batchCycleExe == '02'"
                    >
                      <c-radio
                        :editable="editable && dataeditable"
                        :comboItems="rpt5Items"
                        label="시간/분 구분"
                        name="batchCycleRptType5"
                        v-model:value="batchData.batchCycleRptType5"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="
                        batchData.batchCycleExe == '01' || batchData.batchCycleRptType5 == 'h'
                      "
                    >
                      <c-select
                        type="edit"
                        :editable="editable && dataeditable"
                        :comboItems="hourItems"
                        itemText="codeName"
                        itemValue="code"
                        label="시간"
                        name="batchCycleHour"
                        v-model:value="batchData.batchCycleHour"
                      />
                    </div>
                    <div
                      class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                      v-show="
                        batchData.batchCycleExe == '01' || batchData.batchCycleRptType5 == 'm'
                      "
                    >
                      <c-select
                        type="edit"
                        :editable="editable && dataeditable"
                        :comboItems="minItems"
                        itemText="codeName"
                        itemValue="code"
                        label="분"
                        name="batchCycleMin"
                        v-model:value="batchData.batchCycleMin"
                      />
                    </div>
                  </template>
                </c-card>
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
  name: 'batchManage'
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
interface batchType {
  batchId?: stringNull // 배치아이디
  batchClassName?: stringNull // 배치 클래스명
  batchName?: stringNull // 배치명
  cronOption?: stringNull // 크론 표현식
  remark?: stringNull // 설명
  batchCycleRpt?: stringNull // 반복주기 형태
  batchCycleRptType1?: stringNull // 매월매주구분
  batchCycleRptType2?: stringNull // 고정일자
  batchCycleRptType3?: stringNull // 고정요일
  batchCycleRptType4?: stringNull // 반복text
  batchCycleRptType5?: stringNull // 실행주기 시간/분 구분
  batchCycleExe?: stringNull // 실행주기 구분
  batchCycleHour?: stringNull // 실행주기 시간
  batchCycleMin?: stringNull // 실행주기 분
  useFlag?: stringNull // 사용여부
  regUserId?: stringNull // 등록자
  chgUserId?: stringNull // 수정자
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
const rptItems = ref<codeMasterType>([
  { code: '01', codeName: '고정' },
  { code: '02', codeName: '반복' }
])
const rpt1Items = ref<codeMasterType>([
  { code: 'm', codeName: '매월' },
  { code: 'w', codeName: '매주' }
])
const rpt2Items = ref<codeMasterType>([
  { code: '1', codeName: '매월 1일' },
  { code: '2', codeName: '매월 2일' },
  { code: '3', codeName: '매월 3일' },
  { code: '4', codeName: '매월 4일' },
  { code: '5', codeName: '매월 5일' },
  { code: '6', codeName: '매월 6일' },
  { code: '7', codeName: '매월 7일' },
  { code: '8', codeName: '매월 8일' },
  { code: '9', codeName: '매월 9일' },
  { code: '10', codeName: '매월 10일' },
  { code: '11', codeName: '매월 11일' },
  { code: '12', codeName: '매월 12일' },
  { code: '13', codeName: '매월 13일' },
  { code: '14', codeName: '매월 14일' },
  { code: '15', codeName: '매월 15일' },
  { code: '16', codeName: '매월 16일' },
  { code: '17', codeName: '매월 17일' },
  { code: '18', codeName: '매월 18일' },
  { code: '19', codeName: '매월 19일' },
  { code: '20', codeName: '매월 20일' },
  { code: '21', codeName: '매월 21일' },
  { code: '22', codeName: '매월 22일' },
  { code: '23', codeName: '매월 23일' },
  { code: '24', codeName: '매월 24일' },
  { code: '25', codeName: '매월 25일' },
  { code: '26', codeName: '매월 26일' },
  { code: '27', codeName: '매월 27일' },
  { code: '28', codeName: '매월 28일' },
  { code: '29', codeName: '매월 29일' },
  { code: '30', codeName: '매월 30일' }
])
const rpt3Items = ref<codeMasterType>([
  { code: '1', codeName: '일요일' },
  { code: '2', codeName: '월요일' },
  { code: '3', codeName: '화요일' },
  { code: '4', codeName: '수요일' },
  { code: '5', codeName: '목요일' },
  { code: '6', codeName: '금요일' },
  { code: '7', codeName: '토요일' }
])
const rpt4Items = ref<codeMasterType>([{ code: '매일', codeName: '매일반복' }])
const exeItems = ref<codeMasterType>([
  { code: '01', codeName: '고정' },
  { code: '02', codeName: '반복' }
])
const rpt5Items = ref<codeMasterType>([
  { code: 'h', codeName: '시간' },
  { code: 'm', codeName: '분' }
])
const hourItems = ref<codeMasterType>([
  { code: '0', codeName: '00' },
  { code: '1', codeName: '01' },
  { code: '2', codeName: '02' },
  { code: '3', codeName: '03' },
  { code: '4', codeName: '04' },
  { code: '5', codeName: '05' },
  { code: '6', codeName: '06' },
  { code: '7', codeName: '07' },
  { code: '8', codeName: '08' },
  { code: '9', codeName: '09' },
  { code: '10', codeName: '10' },
  { code: '11', codeName: '11' },
  { code: '12', codeName: '12' },
  { code: '13', codeName: '13' },
  { code: '14', codeName: '14' },
  { code: '15', codeName: '15' },
  { code: '16', codeName: '16' },
  { code: '17', codeName: '17' },
  { code: '18', codeName: '18' },
  { code: '19', codeName: '19' },
  { code: '20', codeName: '20' },
  { code: '21', codeName: '21' },
  { code: '22', codeName: '22' },
  { code: '23', codeName: '23' }
])
const minItems = ref<codeMasterType>([
  { code: '0', codeName: '00' },
  { code: '1', codeName: '01' },
  { code: '2', codeName: '02' },
  { code: '3', codeName: '03' },
  { code: '4', codeName: '04' },
  { code: '5', codeName: '05' },
  { code: '6', codeName: '06' },
  { code: '7', codeName: '07' },
  { code: '8', codeName: '08' },
  { code: '9', codeName: '09' },
  { code: '10', codeName: '10' },
  { code: '11', codeName: '11' },
  { code: '12', codeName: '12' },
  { code: '13', codeName: '13' },
  { code: '14', codeName: '14' },
  { code: '15', codeName: '15' },
  { code: '16', codeName: '16' },
  { code: '17', codeName: '17' },
  { code: '18', codeName: '18' },
  { code: '19', codeName: '19' },
  { code: '20', codeName: '20' },
  { code: '21', codeName: '21' },
  { code: '22', codeName: '22' },
  { code: '23', codeName: '23' },
  { code: '24', codeName: '24' },
  { code: '25', codeName: '25' },
  { code: '26', codeName: '26' },
  { code: '27', codeName: '27' },
  { code: '28', codeName: '28' },
  { code: '29', codeName: '29' },
  { code: '30', codeName: '30' },
  { code: '31', codeName: '31' },
  { code: '32', codeName: '32' },
  { code: '33', codeName: '33' },
  { code: '34', codeName: '34' },
  { code: '35', codeName: '35' },
  { code: '36', codeName: '36' },
  { code: '37', codeName: '37' },
  { code: '38', codeName: '38' },
  { code: '39', codeName: '39' },
  { code: '40', codeName: '40' },
  { code: '41', codeName: '41' },
  { code: '42', codeName: '42' },
  { code: '43', codeName: '43' },
  { code: '44', codeName: '44' },
  { code: '45', codeName: '45' },
  { code: '46', codeName: '46' },
  { code: '47', codeName: '47' },
  { code: '48', codeName: '48' },
  { code: '49', codeName: '49' },
  { code: '50', codeName: '50' },
  { code: '51', codeName: '51' },
  { code: '52', codeName: '52' },
  { code: '53', codeName: '53' },
  { code: '54', codeName: '54' },
  { code: '55', codeName: '55' },
  { code: '56', codeName: '56' },
  { code: '57', codeName: '57' },
  { code: '58', codeName: '58' },
  { code: '59', codeName: '59' }
])
const grid = ref({
  columns: [
    {
      name: 'batchClassName',
      field: 'batchClassName',
      label: '배치 클래스명',
      align: 'center',
      sortable: true
    },
    {
      name: 'batchName',
      field: 'batchName',
      label: '배치명',
      align: 'center',
      sortable: true
    },
    {
      name: 'cronOption',
      field: 'cronOption',
      label: '크론 표현식',
      align: 'center',
      style: 'width:150px',
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
const batchData = ref<batchType>({
  batchId: '', // 배치아이디
  batchClassName: '', // 배치 클래스명
  batchName: '', // 배치명
  cronOption: '', // 크론 표현식
  remark: '', // 설명
  batchCycleRpt: '01', // 반복주기 형태
  batchCycleRptType1: 'm', // 매월매주구분
  batchCycleRptType2: '1', // 고정일자
  batchCycleRptType3: '1', // 고정요일
  batchCycleRptType4: '매일', // 반복text
  batchCycleRptType5: 'h', // 실행주기 시간/분 구분
  batchCycleExe: '01', // 실행주기 구분
  batchCycleHour: '1', // 실행주기 시간
  batchCycleMin: '1', // 실행주기 분
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자
  chgUserId: '' // 수정자
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
  listUrl.value = selectConfig.sys.batch.list.url
  detailUrl.value = selectConfig.sys.batch.get.url
  checkUrl.value = selectConfig.sys.batch.check.url
  insertUrl.value = transactionConfig.sys.batch.insert.url
  updateUrl.value = transactionConfig.sys.batch.update.url
  deleteUrl.value = transactionConfig.sys.batch.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 배치 조회
 *******************************/
function getBatchList() {
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
    url: $format(detailUrl.value, row.batchId),
    method: 'GET'
  }).then((_result: any) => {
    batchData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  })
}
/******************************
 * TODO (목적): 배치 추가
 *******************************/
function addBatch() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  batchData.value = {
    batchId: '', // 배치아이디
    batchClassName: '', // 배치 클래스명
    batchName: '', // 배치명
    cronOption: '', // 크론 표현식
    remark: '', // 설명
    batchCycleRpt: '01', // 반복주기 형태
    batchCycleRptType1: 'm', // 매월매주구분
    batchCycleRptType2: '1', // 고정일자
    batchCycleRptType3: '1', // 고정요일
    batchCycleRptType4: '매일', // 반복text
    batchCycleRptType5: 'h', // 실행주기 시간/분 구분
    batchCycleExe: '01', // 실행주기 구분
    batchCycleHour: '1', // 실행주기 시간
    batchCycleMin: '1', // 실행주기 분
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
  batchData.value = {
    batchId: '', // 배치아이디
    batchClassName: '', // 배치 클래스명
    batchName: '', // 배치명
    cronOption: '', // 크론 표현식
    remark: '', // 설명
    batchCycleRpt: '01', // 반복주기 형태
    batchCycleRptType1: 'm', // 매월매주구분
    batchCycleRptType2: '1', // 고정일자
    batchCycleRptType3: '1', // 고정요일
    batchCycleRptType4: '매일', // 반복text
    batchCycleRptType5: 'h', // 실행주기 시간/분 구분
    batchCycleExe: '01', // 실행주기 구분
    batchCycleHour: '1', // 실행주기 시간
    batchCycleMin: '1', // 실행주기 분
    useFlag: 'Y' // 사용여부
  }
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveBatch() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: $format(checkUrl.value, batchData.value.batchClassName),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          setCrontabOption()
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              batchData.value.regUserId = user.value.userId
              batchData.value.chgUserId = user.value.userId

              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 클래스명이 존재합니다.',
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
    rowClick({ batchId: result.data.batchId })
  } else {
    getBatchList()
  }
}
/******************************
 * TODO (목적): 배치 삭제
 *******************************/
function deleteBatch() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, batchData.value.batchId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        getBatchList()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 크론탭 형식 변환
 *******************************/
function setCrontabOption() {
  let cronexpression = ''
  if (batchData.value.batchCycleRpt == '02') {
    // 반복주기 반복
    if (batchData.value.batchCycleExe == '02') {
      // 실행주기 반복
      if (batchData.value.batchCycleRptType5 == 'h') {
        // 실행주기 시간/분 구분(시간)
        cronexpression = '0 0 0/' + batchData.value.batchCycleHour + ' * * ?'
      } else if (batchData.value.batchCycleRptType5 == 'm') {
        // 실행주기 시간/분 구분(분)
        cronexpression = '0 0/' + batchData.value.batchCycleMin + ' * * * ?'
      }
    } else if (batchData.value.batchCycleExe == '01') {
      // 실행주기 고정
      cronexpression =
        '0 ' + batchData.value.batchCycleMin + ' ' + batchData.value.batchCycleHour + ' * * ?'
    }
  } else if (batchData.value.batchCycleRpt == '01') {
    // 반복주기 고정
    let fixexp = ''
    if (batchData.value.batchCycleRptType1 == 'm') {
      // 반복주기 월/주 구분(월)
      fixexp = ' ' + batchData.value.batchCycleRptType2 + ' * ?'
    } else if (batchData.value.batchCycleRptType1 == 'w') {
      // 반복주기 월/주 구분(주)
      fixexp = ' ? * ' + batchData.value.batchCycleRptType3
    }
    if (batchData.value.batchCycleExe == '01') {
      // 실행주기 고정
      cronexpression =
        '0 ' + batchData.value.batchCycleMin + ' ' + batchData.value.batchCycleHour + fixexp
    } else if (batchData.value.batchCycleExe == '02') {
      // 실행주기 반복
      if (batchData.value.batchCycleRptType5 == 'h') {
        // 실행주기 시간/분 구분(시간)
        cronexpression = '0 0 0/' + batchData.value.batchCycleHour + fixexp
      } else if (batchData.value.batchCycleRptType5 == 'm') {
        // 실행주기 시간/분 구분(분)
        cronexpression = '0 0/' + batchData.value.batchCycleMin + ' *' + fixexp
      }
    }
  }
  batchData.value.cronOption = cronexpression
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

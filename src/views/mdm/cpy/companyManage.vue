<template>
  <div>
    <c-search-box @enter="getList">
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
          title="회사 목록"
          tableId="company"
          :columns="grid.columns"
          :data="grid.data"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
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
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="회사 정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addData" />
                <c-btn
                  v-if="saveEditable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="companyData"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :required="true"
                  :disabled="!saveMode"
                  :editable="editable"
                  label="회사명"
                  name="companyName"
                  v-model:value="companyData.companyName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :disabled="!saveMode"
                  :editable="editable"
                  :bizNumberCheck="true"
                  label="사업자번호"
                  name="bizNo"
                  v-model:value="companyData.bizNo"
                />
              </div>
              <div class="col-6">
                <c-text
                  :disabled="!saveMode"
                  :editable="editable"
                  label="대표자"
                  name="managerName"
                  v-model:value="companyData.managerName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :disabled="!saveMode"
                  :editable="editable"
                  label="대표 E-mail"
                  name="managerEmail"
                  v-model:value="companyData.managerEmail"
                />
              </div>
              <div class="col-6">
                <c-text
                  :disabled="!saveMode"
                  :editable="editable"
                  :phoneNumberCheck="true"
                  label="전화번호"
                  name="phoneNo"
                  v-model:value="companyData.phoneNo"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :disabled="!saveMode"
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="companyData.useFlag"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :disabled="!saveMode"
                  :editable="editable"
                  label="비고"
                  name="remarks"
                  v-model:value="companyData.remarks"
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
  name: 'companyManage'
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
}
interface companyDataType {
  mdmCompanyId: stringNull // 회사 일련번호
  companyName: stringNull // 회사명
  managerName: stringNull // 대표자
  managerEmail: stringNull // 대표자 E-MAIL
  phoneNo: stringNull // 전화번호
  bizNo: stringNull // 사업자번호
  remarks: stringNull // 비고
  useFlag: 'Y' // 사용여부
  regUserId: stringNull // 등록자 ID
  chgUserId: stringNull // 수정자 ID
}
interface gridType {
  columns: tableColumnType
  data: Array<companyDataType>
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
const useFlagItems = ref<Array<any>>([])
const saveMode = ref(false)
const isSave = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('POST')
const editForm = ref<any>(null)
const searchParam = ref<searchParamType>({
  useFlag: 'Y'
})
const companyData = ref<companyDataType>({
  mdmCompanyId: '', // 회사 일련번호
  companyName: '', // 회사명
  managerName: '', // 대표자
  managerEmail: '', // 대표자 E-MAIL
  phoneNo: '', // 전화번호
  bizNo: '', // 사업자번호
  remarks: '', // 비고
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'companyName',
      field: 'companyName',
      label: '회사명',
      align: 'left',
      style: 'width:70%',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:30%',
      sortable: false
    }
  ],
  data: []
})

/******************************
 * @Computed_선언
 *******************************/
const saveEditable = computed(() => editable.value && saveMode.value)

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
  listUrl.value = selectConfig.mdm.company.list.url
  detailUrl.value = selectConfig.mdm.company.get.url
  saveUrl.value = transactionConfig.mdm.company.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 회사 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    setGridData(grid.value, _result.data)
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  $http({
    url: $format(detailUrl.value, row.mdmCompanyId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(companyData.value, _result.data)
    saveMode.value = true
  })
}
/******************************
 * TODO (목적): 회사 추가
 *******************************/
function addData() {
  companyData.value = {
    mdmCompanyId: '', // 회사 일련번호
    companyName: '', // 회사명
    managerName: '', // 대표자
    managerEmail: '', // 대표자 E-MAIL
    phoneNo: '', // 전화번호
    bizNo: '', // 사업자번호
    remarks: '', // 비고
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '' // 수정자 ID
  }
  saveMode.value = true
}

/******************************
 * TODO (목적): 회사 저장
 *******************************/
function saveData() {
  if (companyData.value.mdmCompanyId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.mdm.company.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.mdm.company.insert.url
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          companyData.value.chgUserId = user.value.userId

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
 * TODO (목적): 회사 콜백
 *******************************/
function saveCallback(result: any) {
  companyData.value.mdmCompanyId = result.data
  message.requestSuccess()
  getList()
  rowClick({ mdmCompanyId: result.data })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

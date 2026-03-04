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
          title="사업장 목록"
          tableId="plant"
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
          <c-card title="사업장 정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="saveEditable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="plantData"
                  mappingType="PUT"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-select
                  :comboItems="companyItems"
                  type="edit"
                  itemText="companyName"
                  itemValue="mdmCompanyId"
                  name="attrVal1"
                  label="회사"
                  v-model:value="plantData.attrVal1"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :disabled="!saveMode"
                  :editable="editable"
                  label="소재지"
                  name="attrVal2"
                  v-model:value="plantData.attrVal2"
                />
              </div>
              <div class="col-6">
                <c-text
                  :disabled="!saveMode"
                  :editable="editable"
                  label="시설구분"
                  name="attrVal3"
                  v-model:value="plantData.attrVal3"
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
  name: 'plantManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
interface gridType {
  columns: tableColumnType
  data: Array<codeMasterType>
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
const plantData = ref<codeMasterType>({
  codeGrpCd: '', // 코드그룹
  code: '', // 코드
  codeName: '', // 코드명
  codeNameEn: '', // 코드명-영어
  codeNameJa: '', // 코드명-일어
  codeNameZhCn: '', // 코드명-중국어간체
  codeNameZhTw: '', // 코드명-중국어번체
  attrVal1: null, // 추가속성1
  attrVal2: '', // 추가속성2
  attrVal3: '', // 추가속성3
  attrVal4: '', // 추가속성4
  description: '', // 비고
  useFlag: 'Y', // 사용여부
  sortOrder: '' //
})
const useFlagItems = ref<Array<any>>([])
const companyItems = ref<Array<any>>([])
const saveMode = ref(false)
const isSave = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const companyListUrl = ref('')
const saveUrl = ref('')
const editForm = ref<any>(null)

const grid = ref<gridType>({
  columns: [
    {
      name: 'companyName',
      field: 'companyName',
      label: '회사명',
      align: 'left',
      style: 'width:35%',
      sortable: false
    },
    {
      name: 'codeName',
      field: 'codeName',
      label: '사업장명',
      align: 'left',
      style: 'width:35%',
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
  listUrl.value = selectConfig.mdm.plant.list.url
  companyListUrl.value = selectConfig.mdm.company.list.url
  detailUrl.value = selectConfig.mdm.plant.get.url
  saveUrl.value = transactionConfig.mdm.plant.update.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
  setCompany()
}
/******************************
 * TODO (목적): 사업장 목록 조회
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
/******************************
 * TODO (목적): 회사 코드 조회
 *******************************/
function setCompany() {
  $http({
    url: companyListUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    companyItems.value = _result.data
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  $http({
    url: $format(detailUrl.value, row.code),
    method: 'GET'
  }).then((_result: any) => {
    plantData.value = _result.data
    saveMode.value = true
  })
}
function saveData() {
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
 * TODO (목적): 사업장 저장 콜백
 *******************************/
function saveCallback(result: any) {
  plantData.value.code = result.data
  message.requestSuccess()
  getList()
  rowClick({ code: result.data })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

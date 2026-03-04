<template>
  <div>
    <c-search-box @enter="getLawList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="nationFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="nationFlag"
            label="국내/외 구분"
            v-model:value="searchParam.nationFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="REGULATION_BILL_API_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="regulationBillCd"
            label="규제 법규"
            v-model:value="searchParam.regulationBillCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="규제항목 목록"
          tableId="table"
          :columnSetting="false"
          :isFullScreen="false"
          :columns="grid.columns"
          :data="grid.data"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getLawList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm">
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addLaw" />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="lawData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveLaw"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-select
                  :required="true"
                  codeGroupCd="REGULATION_BILL_API_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="regulationBillCd"
                  label="규제 법규"
                  v-model:value="lawData.regulationBillCd"
                  :editable="editable && dataeditable"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="false"
                  label="규제항목코드"
                  name="regulatedItemCd"
                  v-model:value="lawData.regulatedItemCd"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable && dataeditable"
                  :required="true"
                  label="규제항목 명"
                  name="regulatedItemName"
                  v-model:value="lawData.regulatedItemName"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :counter="true"
                  :maxlength="500"
                  :editable="editable && dataeditable"
                  :rows="5"
                  label="규제 설명"
                  name="regulationDesc"
                  v-model:value="lawData.regulationDesc"
                />
              </div>
              <div class="col-6">
                <c-radio
                  :editable="editable && dataeditable"
                  :comboItems="nationFlagItems"
                  label="국내/외 구분"
                  name="nationFlag"
                  v-model:value="lawData.nationFlag"
                />
              </div>
              <div class="col-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="lawData.useFlag"
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
  name: 'lawManage'
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
  regulationBillCd: stringNull
  nationFlag: stringNull
  useFlag: stringNull
}
interface lawDataType {
  regulatedItemCd: stringNull // 규제항목코드
  regulationBillCd: stringNull // 규제 법규 코드
  regulatedItemName: stringNull // 규제항목 명
  regulationDesc: stringNull // 규제 설명
  useFlag: stringNull // 사용여부
  nationFlag: stringNull // 국내외구분(Y:국내,N:국외)
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
const editForm = ref<any>(null)
const searchParam = ref<searchParamType>({
  useFlag: 'Y',
  nationFlag: null,
  regulationBillCd: null
})
const lawData = ref<lawDataType>({
  regulatedItemCd: '', // 규제항목코드
  regulationBillCd: null, // 규제 법규 코드
  regulatedItemName: '', // 규제항목 명
  regulationDesc: '', // 규제 설명
  useFlag: 'Y', // 사용여부
  nationFlag: 'Y' // 국내외구분(Y:국내,N:국외)
})
const grid = ref({
  columns: [
    {
      name: 'nationFlagName',
      field: 'nationFlagName',
      label: '국내/외',
      align: 'center',
      sortable: true,
      style: 'width: 70px'
    },
    {
      name: 'regulationBillName',
      field: 'regulationBillName',
      label: '규제 법규',
      align: 'center',
      sortable: true
    },
    {
      name: 'regulatedItemCd',
      field: 'regulatedItemCd',
      label: '규제항목코드',
      align: 'center',
      sortable: true
    },
    {
      name: 'regulatedItemName',
      field: 'regulatedItemName',
      label: '규제항목 명',
      align: 'left',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width: 70px'
    }
  ],
  data: []
})
const detailUrl = ref('')
const listUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const saveUrl = ref('')
const saveable = ref(false)
const isSave = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const saveType = ref('POST')
const useFlagItems = ref<Array<any>>([])
const nationFlagItems = ref<Array<any>>([])

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
  listUrl.value = selectConfig.mdm.mam.regulation.item.list.url
  detailUrl.value = selectConfig.mdm.mam.regulation.item.get.url
  insertUrl.value = transactionConfig.mdm.mam.regulation.insert.url
  updateUrl.value = transactionConfig.mdm.mam.regulation.update.url
  // code setting
  nationFlagItems.value = [
    { code: 'Y', codeName: $language('국내') },
    { code: 'N', codeName: $language('국외') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getLawList()
}
/******************************
 * TODO (목적): 법규 목록 조회
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
function getLawList() {
  getList()
  rowRemoveSelect()
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
  saveable.value = true
  updateMode.value = true
  $http({
    url: $format(detailUrl.value, row.regulatedItemCd),
    method: 'GET'
  }).then((_result: any) => {
    lawData.value = _result.data

    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 법규 추가
 *******************************/
function addLaw() {
  saveable.value = true
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  lawData.value = {
    regulatedItemCd: '', // 규제항목코드
    regulationBillCd: null, // 규제 법규 코드
    regulatedItemName: '', // 규제항목 명
    regulationDesc: '', // 규제 설명
    useFlag: 'Y', // 사용여부
    nationFlag: 'Y' // 국내외구분(Y:국내,N:국외)
  }
  rowRemoveSelect()
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  updateMode.value = false
  dataeditable.value = false
  lawData.value = {
    regulatedItemCd: '', // 규제항목코드
    regulationBillCd: null, // 규제 법규 코드
    regulatedItemName: '', // 규제항목 명
    regulationDesc: '', // 규제 설명
    useFlag: 'Y', // 사용여부
    nationFlag: 'Y' // 국내외구분(Y:국내,N:국외)
  }
}

/******************************
 * TODO (목적): 법규 저장
 *******************************/
function saveLaw() {
  editForm.value.validate().then((_result: boolean) => {
    // 중복체크
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
 * TODO (목적): 법규 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    getList()
    rowClick({ regulatedItemCd: result.data.regulatedItemCd })
  } else {
    getLawList()
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

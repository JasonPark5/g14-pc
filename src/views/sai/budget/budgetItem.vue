<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
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
    <c-table
      ref="table"
      title="예산편성항목 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'budgetItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
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
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
const table = ref<any>(null)
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'plant'
    },
    {
      required: true,
      name: 'budgetTypeCd',
      field: 'budgetTypeCd',
      label: '구분',
      align: 'left',
      codeGroupCd: 'SAI_BUDGET_TYPE_CD',
      style: 'width:120px',
      sortable: false,
      type: 'select'
    },
    {
      required: true,
      name: 'budgetItemName',
      field: 'budgetItemName',
      label: '항목',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'budgetContent',
      field: 'budgetContent',
      label: '세부내용',
      align: 'left',
      style: 'width:400px',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:50px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:50px',
      sortable: true,
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')

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
  // url setting
  listUrl.value = selectConfig.sai.budget.item.list.url
  saveUrl.value = transactionConfig.sai.budget.item.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
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
 * TODO (목적): 마스터 추가
 *******************************/
function add() {
  if (!grid.value.data) grid.value.data = []
  grid.value.data.splice(0, 0, {
    saiBudgetItemId: uid(), // 소방설비 점검항목 일련번호
    plantCd: null, // 사업장
    budgetItemName: '', // 점검항목명
    budgetTypeCd: null, // 점검항목명
    budgetContent: '', // 점검항목명
    useFlag: 'Y', // 사용여부
    sortOrder: null, // 정렬순서
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장 후 callback
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

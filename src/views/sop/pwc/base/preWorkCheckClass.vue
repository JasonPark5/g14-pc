<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="SOP_PRE_WORK_CHECK_CLASS_CD"
            itemText="codeName"
            itemValue="code"
            name="sopPreWorkCheckClassCd"
            label="종류"
            v-model:value="searchParam.sopPreWorkCheckClassCd"
          />
        </div>
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
      title="작업 전 안전점검 구분 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :editable="editable"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addPreWorkCheckClass"
          />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="savePreWorkCheckClass"
            @btnCallback="savePreWorkCheckClassCallback"
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
  name: 'preWorkCheckClass'
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
const searchParam = ref({
  sopPreWorkCheckClassCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'sopPreWorkCheckClassCd',
      field: 'sopPreWorkCheckClassCd',
      label: '종류',
      align: 'center',
      sortable: true,
      required: true,
      style: 'width:100px',
      type: 'select',
      itemText: 'codeName',
      itemValue: 'code',
      codeGroupCd: 'SOP_PRE_WORK_CHECK_CLASS_CD'
    },
    {
      name: 'checkClassName',
      field: 'checkClassName',
      label: '점검구분명',
      align: 'left',
      sortable: true,
      required: true,
      style: 'width:400px',
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref<codeMasterType>([])
const table = ref<any>(null)
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
  listUrl.value = selectConfig.sop.pwc.class.list.url
  saveUrl.value = transactionConfig.sop.pwc.class.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function addPreWorkCheckClass() {
  if (!grid.value.data) {
    grid.value.data = []
  }
  grid.value.data.splice(0, 0, {
    sopPreWorkCheckClassId: '', // 작업 전 안전점검 구분 일련번호
    sopPreWorkCheckClassCd: null, // 작업 전 안전점검 구분 코드
    checkClassName: '', // 점검 구분명
    useFlag: 'Y', // 사용여부
    sortOrder: 0, // 순번
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
function savePreWorkCheckClass() {
  if (validTable(grid.value.columns, grid.value.data)) {
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
  }
}
function savePreWorkCheckClassCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

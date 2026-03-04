<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="HEA_STRESS_CHECK_CLASS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="heaStressCheckClassCd"
            label="평가구분"
            v-model:value="searchParam.heaStressCheckClassCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="shortenFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="shortenFlag"
            label="단축형 여부"
            v-model:value="searchParam.shortenFlag"
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
      title="설문항목 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      :checkClickFlag="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveMst"
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
  name: 'jobStressItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
const searchParam = ref({
  useFlag: 'Y',
  heaStressCheckClassCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'heaStressCheckClassCd',
      field: 'heaStressCheckClassCd',
      label: '평가구분',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'select',
      itemText: 'codeName',
      itemValue: 'code',
      codeGroupCd: 'HEA_STRESS_CHECK_CLASS_CD'
    },
    {
      required: true,
      name: 'jobStressItemName',
      field: 'jobStressItemName',
      label: '항목',
      align: 'left',
      style: 'width:500px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'score',
      field: 'score',
      label: '점수',
      child: [
        {
          name: 'val1Score',
          field: 'val1Score',
          label: '전혀 그렇지 않다',
          align: 'right',
          style: 'width:80px',
          type: 'number',
          sortable: false,
          maxlength: 2
        },
        {
          name: 'val2Score',
          field: 'val2Score',
          label: '그렇지 않다',
          align: 'right',
          style: 'width:80px',
          type: 'number',
          sortable: false,
          maxlength: 1
        },
        {
          name: 'val3Score',
          field: 'val3Score',
          label: '그렇다',
          align: 'right',
          style: 'width:80px',
          type: 'number',
          sortable: false,
          maxlength: 1
        },
        {
          name: 'val4Score',
          field: 'val4Score',
          label: '매우 그렇다',
          align: 'right',
          style: 'width:80px',
          type: 'number',
          sortable: false,
          maxlength: 1
        }
      ]
    },
    {
      name: 'shortenFlag',
      field: 'shortenFlag',
      label: '단축형 여부',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:60px',
      sortable: true,
      type: 'number'
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])
const shortenFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('단축형') },
  { code: 'N', codeName: $language('단축형 제외') }
])

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
  listUrl.value = selectConfig.hea.jobStress.base.item.list.url
  saveUrl.value = transactionConfig.hea.jobStress.base.item.save.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
 * TODO (목적): row 추가
 *******************************/
function addRow() {
  if (!grid.value.data) grid.value.data = []
  grid.value.data!.splice(0, 0, {
    heaJobStressItemId: uid(), // 직무스트레스 항목 일련번호
    heaStressCheckClassCd: null, // 직무스트레스 평가항목 구분
    jobStressItemName: '', // 직무스트레스 결과항목명
    val1Score: null, // (점수)전혀 그렇지 않다
    val2Score: null, // (점수)그렇지 않다
    val3Score: null, // (점수)그렇다
    val4Score: null, // (점수)매우 그렇다
    useFlag: 'Y', // 사용여부
    sortOrder: null, // 정렬순서
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMst() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

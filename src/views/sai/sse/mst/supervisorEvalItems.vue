<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            v-model:value="searchParam.useFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            required
            type="search"
            codeGroupCd="MA_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            label="평가구분"
            name="typeCd"
            v-model:value="searchParam.typeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="관리감독자 평가항목"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :usePaging="false"
      :columnSetting="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data.length > 0"
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
  name: 'supervisorEvalItems'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
  columns: Array<tableColumnType>
  data: Array<any>
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
  //plantCd: null,
  useFlag: 'Y',
  typeCd: 'A'
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'details' },
    { index: 1, colName: 'details' }
  ],
  columns: [
    {
      required: true,
      name: 'typeCd',
      field: 'typeCd',
      label: '평가구분',
      align: 'left',
      sortable: true,
      type: 'select',
      codeGroupCd: 'MA_TYPE_CD',
      style: 'width:160px'
    },
    // {
    //   name: 'evaluatorRole',
    //   field: 'evaluatorRole',
    //   label: '평가자 구분',
    //   align: 'left',
    //   sortable: true,
    //   type: 'text',
    //   style: 'width:60px'
    // },
    {
      required: true,
      name: 'details',
      field: 'details',
      label: '평가항목',
      align: 'left',
      sortable: true,
      type: 'text',
      style: 'width:240px'
    },
    {
      required: true,
      name: 'evaluationStandard',
      field: 'evaluationStandard',
      label: '평가사항',
      align: 'left',
      sortable: true,
      type: 'textarea'
      // style: 'width:200px'
    },
    {
      name: 'score',
      field: 'score',
      label: '배점',
      align: 'center',
      sortable: true,
      type: 'number',
      style: 'width:60px'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      sortable: true,
      type: 'number',
      style: 'width:60px'
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
const table = ref<any>(null)

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
  listUrl.value = selectConfig.sai.sse.supervisor.mst.item.url
  saveUrl.value = transactionConfig.sai.sse.supervisor.mst.item.url
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
 * TODO (목적): 행 추가
 *******************************/
function add() {
  grid.value.data?.push({
    typeCd: searchParam.value.typeCd, // 평가구분
    evaluatorRole: '', // 평가자 구분
    details: '', // 평가항목
    evaluationStandard: '', // 평가기준
    score: 0, // 배점
    useFlag: 'Y', // 사용여부
    type: 'A', // 평가항목 유형
    sortOrder: grid.value.data.length + 1, // 순번
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}

/******************************
 * TODO (목적): 저장
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
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

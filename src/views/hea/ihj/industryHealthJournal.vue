<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="작성기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="statusItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="completeFlag"
            label="작성상태"
            v-model:value="searchParam.completeFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="산업보건 일지 목록"
      tableId="table"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="props.row[col.name] > 0">
          {{ props.row[col.name] }}
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
  name: 'industryHealthJournal'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  data?: Array<object>
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  completeFlag: null,
  period: []
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'industryHealthJournalId' },
    { index: 1, colName: 'industryHealthJournalId' },
    { index: 2, colName: 'industryHealthJournalId' },
    { index: 3, colName: 'industryHealthJournalId' },
    { index: 4, colName: 'industryHealthJournalId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    // {
    //   name: 'completeFlagName',
    //   field: 'completeFlagName',
    //   label: '작성상태',
    //   align: 'center',
    //   sortable: true,
    //   style: 'width:100px'
    // },
    // {
    //   name: 'approvalStatusName',
    //   field: 'approvalStatusName',
    //   label: '결재진행단계',
    //   align: 'center',
    //   sortable: true,
    //   style: 'width:100px'
    // },
    {
      name: 'startDate',
      field: 'startDate',
      label: '작성일',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'journalName',
      field: 'journalName',
      label: '일지명',
      style: 'width:300px',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'sexTypeName',
      field: 'sexTypeName',
      label: '구분',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'code1',
      field: 'code1',
      label: '소화기',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code2',
      field: 'code2',
      label: '호흡기',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code3',
      field: 'code3',
      label: '근골',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code4',
      field: 'code4',
      label: '신경',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code5',
      field: 'code5',
      label: '외상',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code6',
      field: 'code6',
      label: '화상',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code7',
      field: 'code7',
      label: '안구',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code8',
      field: 'code8',
      label: '물리치료',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code9',
      field: 'code9',
      label: '기타',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'total',
      field: 'total',
      label: '합계',
      style: 'width:60px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const statusItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.hea.ihj.list.url
  // code setting
  statusItems.value = [
    { code: 'N', codeName: $language('작성중') },
    { code: 'Y', codeName: $language('작성완료') }
  ]
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
 * TODO (목적): 상세 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '산업보건 일지 상세'
  popupOptions.value.param = { industryHealthJournalId: row ? row.industryHealthJournalId : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./industryHealthJournalDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

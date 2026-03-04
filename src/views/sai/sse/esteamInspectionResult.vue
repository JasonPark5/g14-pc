<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            type="year"
            label="점검년도"
            default="today"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="HALF_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="상/하반기"
            name="checkSemiAnnualCd"
            v-model:value="searchParam.checkSemiAnnualCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            disabled
            type="search"
            label="부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            label="점검자"
            type="dept_user"
            name="checkUserId"
            v-model:value="searchParam.checkUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="comboItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="completeFlag"
            label="진행상태"
            v-model:value="searchParam.completeFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="EHS팀 반기점검 중 부적정 항목"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :editable="false"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="false"
            :isImmShow="true"
            :requestContentsCols="['requirement']"
            tableKey="saiSapaEsResultId"
            ibmTaskTypeCd="ITT0000240"
            ibmTaskUnderTypeCd="ITT0000260"
          />
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
  name: 'esteamInspectionResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  data: any[]
  merge?: tableMergeType[]
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  deptCd: 'D10031',
  completeFlag: null,
  checkUserId: '',
  year: '',
  checkSemiAnnualCd: null,
  checkResultCd: 'CR02'
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'saiSapaEsCheckId' },
    { index: 1, colName: 'saiSapaEsCheckId' },
    { index: 2, colName: 'saiSapaEsCheckId' },
    { index: 3, colName: 'saiSapaEsCheckId' },
    { index: 4, colName: 'saiSapaEsCheckId' }
  ],
  columns: [
    {
      name: 'checkTitle',
      field: 'checkTitle',
      label: '점검명',
      align: 'center',
      type: 'link',
      style: 'width:120px',
      sortable: true,
      fix: true
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      label: '점검일시',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      fix: true
    },
    {
      name: 'checkSemiAnnualName',
      field: 'checkSemiAnnualName',
      label: '상/하반기',
      align: 'center',
      style: 'width:60px',
      sortable: false,
      fix: true
    },
    {
      name: 'checkUserName',
      field: 'checkUserName',
      label: '점검자',
      align: 'center',
      sortable: true,
      style: 'width:80px',
      fix: true
    },
    {
      name: 'completeFlagName',
      field: 'completeFlagName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      fix: true
    },
    {
      name: 'upper1',
      field: 'upper1',
      label: '카테고리1',
      align: 'left',
      sortable: true,
      style: 'width:280px'
    },
    {
      name: 'upper2',
      field: 'upper2',
      label: '카테고리2',
      align: 'left',
      sortable: true,
      style: 'width:280px'
    },
    {
      name: 'requirement',
      field: 'requirement',
      label: '세부 요구사항',
      align: 'left',
      type: 'html',
      sortable: true,
      style: 'width:280px'
    },
    // {
    //   name: 'details',
    //   field: 'details',
    //   label: '상세',
    //   align: 'left',
    //   type: 'html',
    //   style: 'width:300px',
    //   sortable: false
    // },
    // {
    //   name: 'relatedLaw',
    //   field: 'relatedLaw',
    //   label: '관계법령',
    //   align: 'left',
    //   type: 'html',
    //   sortable: false,
    //   style: 'width:160px'
    // },
    // {
    //   name: 'cycle',
    //   field: 'cycle',
    //   label: '점검주기',
    //   align: 'center',
    //   type: 'custom',
    //   style: 'width:60px',
    //   sortable: false
    // },
    // {
    //   name: 'action',
    //   field: 'action',
    //   label: '활동사항',
    //   align: 'left',
    //   sortable: false,
    //   style: 'width:160px'
    // },
    // {
    //   name: 'actionCycle',
    //   field: 'actionCycle',
    //   label: '이행주기',
    //   align: 'center',
    //   type: 'custom',
    //   style: 'width:60px',
    //   sortable: false
    // },
    {
      name: 'docu',
      field: 'docu',
      label: '참고자료',
      align: 'left',
      type: 'attach',
      sortable: false,
      style: 'width: 160px',
      taskClassCd: 'EHS_HALF_CHECK',
      keyText: 'saiSapaEsResultId'
    },
    {
      name: 'checkResultName',
      field: 'checkResultName',
      label: '점검결과',
      align: 'center',
      sortable: false,
      style: 'width: 60px'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      sortable: false,
      style: 'width:160px'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:10%',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')
const comboItems = ref<Array<codeMasterType>>([
  { code: 'N', codeName: $language('작성중') },
  { code: 'Y', codeName: $language('완료') }
])
/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
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
  listUrl.value = selectConfig.sai.sse.es.list.all.url
  // code setting
  // list setting
  getList()
  // code setting
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
function linkClick(row: any) {
  popupOptions.value.title = 'EHS팀 반기점검 상세'
  popupOptions.value.param = { saiSapaEsCheckId: row ? row.saiSapaEsCheckId : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./esteamInspectionDetail.vue`))
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

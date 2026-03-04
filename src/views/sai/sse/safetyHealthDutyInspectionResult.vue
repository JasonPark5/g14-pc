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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="부서"
            name="deptCd"
            :isFirstValue="false"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :isArray="false"
            type="dept_user"
            label="점검자"
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
            name="checkFinishFlag"
            label="진행단계"
            v-model:value="searchParam.checkFinishFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="안전·보건 확보 의무 이행상태 점검 중 부적정 결과 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
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
            :requestContentsCols="['checkContent']"
            tableKey="sdpSemiCheckResultId"
            ibmTaskTypeCd="ITT0000240"
            ibmTaskUnderTypeCd="ITT0000270"
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
  name: 'safetyHealthDutyInspectionResult'
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
  columns: tableColumnType[]
  data: Array<any>
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
  deptCd: null,
  checkUserId: '',
  year: '',
  checkSemiAnnualCd: null,
  checkResultCd: 'CR02',
  checkFinishFlag: ''
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'sdpSemiCheckId' },
    { index: 1, colName: 'sdpSemiCheckId' },
    { index: 2, colName: 'sdpSemiCheckId' },
    { index: 3, colName: 'sdpSemiCheckId' },
    { index: 4, colName: 'sdpSemiCheckId' },
    { index: 5, colName: 'sdpSemiCheckId' }
  ],
  columns: [
    {
      name: 'checkTitle',
      field: 'checkTitle',
      label: '점검명',
      align: 'center',
      type: 'link',
      style: 'width:160px',
      sortable: true,
      fix: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: true,
      style: 'width:80px',
      fix: true
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      label: '점검일시',
      align: 'center',
      style: 'width:120px',
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
      style: 'width:120px',
      fix: true
    },
    {
      name: 'checkFinishName',
      field: 'checkFinishName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      fix: true
    },
    {
      name: 'codeName',
      field: 'codeName',
      label: '카테고리',
      align: 'left',
      style: 'width:16%',
      sortable: false
    },
    {
      name: 'checkContent',
      field: 'checkContent',
      label: '점검내용',
      align: 'left',
      style: 'width:20%',
      sortable: false
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
      style: 'width:10%',
      sortable: true
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
  listUrl.value = selectConfig.sai.sse.shd.list.all.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 불러오기 함수
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
 * TODO (목적): 기본 정보 팝업 표시
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '안전·보건 확보 의무 이행상태 점검 상세'
  popupOptions.value.param = {
    sdpSemiCheckId: row ? row.sdpSemiCheckId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('./safetyHealthDutyInspDetail.vue'))
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

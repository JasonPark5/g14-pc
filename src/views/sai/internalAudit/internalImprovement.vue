<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            type="year"
            default="today"
            label="년도"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            :isFirstValue="false"
            label="피심사팀"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="시정조치 관리대장 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :editable="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'ibmStepName'">
          <span style="font-weight: 500">
            <span v-if="props.row.ibmStepCd === 'IS00000001'" class="text-orange">
              {{ props.row[col.name] }}</span
            >
            <span v-else-if="props.row.ibmStepCd === 'IS00000005'" class="text-indigo">
              {{ props.row[col.name] }}</span
            >
            <span v-else-if="props.row.ibmStepCd === 'IS00000010'" class="text-green">
              {{ props.row[col.name] }}</span
            >
            <span v-else-if="props.row.ibmStepCd === 'IS00000015'" class="text-teal">
              {{ props.row[col.name] }}</span
            >
            <span v-else-if="props.row.ibmStepCd === 'IS00000020'" class="text-grey">
              {{ props.row[col.name] }}</span
            >
            <span v-else>{{ props.row[col.name] }}</span>
          </span>
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
  name: 'internalImprovement'
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
  columns: Array<tableColumnType>
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  year: '',
  deptCd: '',
  auditFlag: ''
})
const auditFlagItems = ref<codeMasterType>([])
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'saiInternalActionId' },
    { index: 1, colName: 'deptCd' },
    { index: 2, colName: 'systemElementsName' }
  ],
  columns: [
    {
      name: 'actionName',
      field: 'actionName',
      label: '수행계획명',
      align: 'left',
      style: 'width:150PX',
      sortable: false,
      fix: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '피심사팀',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      fix: true
    },
    {
      name: 'systemElementsName',
      field: 'systemElementsName',
      label: '시스템요소',
      align: 'left',
      style: 'width:120px',
      sortable: false,
      fix: true
    },
    // {
    //   name: 'sortOrder',
    //   field: 'sortOrder',
    //   label: '순번',
    //   align: 'center',
    //   style: 'width:30px',
    //   sortable: false,
    // },
    {
      name: 'itemName',
      field: 'itemName',
      label: '심사항목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'html'
    },
    {
      name: 'saiInternalAuditResultName',
      field: 'saiInternalAuditResultName',
      label: '심사결과',
      align: 'center',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'observation',
      field: 'observation',
      label: '심사내용',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '개선요청 제목',
      align: 'left',
      type: 'link',
      style: 'width:240px',
      sortable: true
    },
    {
      name: 'ibmClassName',
      field: 'ibmClassName',
      label: '개선구분',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행상태',
      align: 'center',
      style: 'width:80px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'improveRequest',
      field: 'improveRequest',
      label: '요청부서정보',
      align: 'center',
      style: 'width:220px',
      sortable: true
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:70px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')

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
  listUrl.value = selectConfig.sai.internal.action.checklistResult.impr.url
  // code setting
  auditFlagItems.value = [
    { code: 'Y', codeName: $language('만족') },
    { code: 'N', codeName: $language('불만족') }
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
 * TODO (목적): 상세보기 팝업_
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '개선'
  if (row.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.param = {
      sopImprovementId: row.sopImprovementId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.param = {
      sopImprovementId: row.sopImprovementId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
    )
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>

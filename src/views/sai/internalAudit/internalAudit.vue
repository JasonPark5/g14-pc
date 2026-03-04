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
            label="심사기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="SAI_INTERNAL_AUDIT_STATUS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="진행상태"
            name="internalAuditStepCd"
            v-model:value="searchParam.internalAuditStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="내부심사 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
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
  name: 'internalAction'
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
  period: [],
  internalAuditStepCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'actionPeriod',
      field: 'actionPeriod',
      label: '심사기간',
      align: 'center',
      style: 'width:180px',
      sortable: true
    },
    {
      name: 'actionName',
      field: 'actionName',
      label: '내부심사 계획명',
      align: 'left',
      style: 'width:240px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'targetDeptNames',
      field: 'targetDeptNames',
      label: '피심사팀',
      align: 'left',
      // style: 'width:300px',
      sortable: true
    },
    {
      name: 'internalAuditStepName',
      field: 'internalAuditStepName',
      label: '진행상태',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '계획 결재상태',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'resultApprovalStatusName',
      field: 'resultApprovalStatusName',
      label: '결과 결재상태',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'saiInternalActionTypeName',
      field: 'saiInternalActionTypeName',
      label: '심사구분',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '작성자',
      style: 'width:100px',
      align: 'center'
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '검토/승인자',
      style: 'width:120px',
      align: 'center'
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
  listUrl.value = selectConfig.sai.internal.action.list.url
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '내부심사 계획/결과 상세'
  popupOptions.value.param = {
    saiInternalActionId: row ? row.saiInternalActionId : '',
    stepCd:
      row && row.internalAuditStepCd !== 'IA00010'
        ? row.internalAuditStepCd
        : row && row.internalAuditStepCd === 'IA00010'
          ? 'IA00005'
          : 'IA00001'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./internalAuditDetail.vue`))
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

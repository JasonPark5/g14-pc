<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="apprTypeCds"
            type="search"
            itemText="approvalTypeName"
            itemValue="approvalTypeCd"
            name="approvalTypeCd"
            label="결재업무"
            v-model:value="searchParam.approvalTypeCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="APPROVAL_KIND_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="approvalKindCd"
            label="결재종류"
            v-model:value="searchParam.approvalKindCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="APPROVAL_STATUS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="approvalStatusCd"
            label="결재상태"
            v-model:value="searchParam.approvalStatusCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="결재요청일"
            defaultStart="-6M"
            defaultEnd="6M"
            name="period"
            v-model:value="period"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      :title="title"
      rowKey="sysApprovalRequestId"
      :columns="grid.columns"
      :data="grid.data"
      :isExcelDown="false"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
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
  name: 'apprList'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
interface propType {
  popupParam?: {
    approvalDocType?: stringNull
  }
}
interface searchParamType {
  startYmd: stringNull
  endYmd: stringNull
  approvalUserId: stringNull
  approvalKindCd: stringNull
  approvalStatusCd: stringNull
  approvalTypeCd?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      approvalDocType: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  startYmd: '',
  endYmd: '',
  approvalUserId: '',
  approvalKindCd: '',
  approvalStatusCd: 'ASC0000001', // 결재할문서
  approvalTypeCd: ''
})
const period = ref<any[]>([])
const grid = ref({
  columns: [
    {
      name: 'approvalTypeName',
      field: 'approvalTypeName',
      label: '결재 업무명',
      align: 'center',
      sortable: true,
      style: 'width:200px'
    },
    {
      name: 'approvalKindName',
      field: 'approvalKindName',
      label: '결재종류',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'approvalRequestName',
      field: 'approvalRequestName',
      label: '결재 요청명',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'reqDeptName',
      field: 'reqDeptName',
      label: '결재요청부서',
      align: 'center',
      sortable: true,
      style: 'width:120px'
    },
    {
      name: 'reqUserName',
      field: 'reqUserName',
      label: '결재요청자',
      align: 'center',
      sortable: true,
      style: 'width:120px'
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'requestDt',
      field: 'requestDt',
      label: '결재 요청일시',
      align: 'center',
      sortable: true,
      style: 'width:140px'
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  isFull: true,
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const title = ref('')
const apprTypeCds = ref<codeMasterType[]>([])
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
  listUrl.value = selectConfig.sys.appr.list.todo.url
  // code setting
  // list setting
  $http({
    url: selectConfig.sys.appr.type.list.url,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    apprTypeCds.value = _result.data
  })
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  if (props.popupParam.approvalDocType) {
    getApprovalStatusCd()
    if (period.value && period.value.length > 0) {
      searchParam.value.startYmd = period.value[0]
      searchParam.value.endYmd = period.value[1]
    } else {
      searchParam.value.startYmd = ''
      searchParam.value.endYmd = ''
    }
    searchParam.value.approvalUserId = user.value.userId

    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      // 각 요소의 requestDt 속성을 앞 19자로 슬라이스하여 밀리초단위삭제
      grid.value.data = _result.data.map((item: any) => ({
        ...item,
        requestDt: item.requestDt ? item.requestDt.slice(0, 19) : ''
      }))
    })
  }
}
/******************************
 * TODO (목적): 링크 클릭 - 상세조회
 * @param (1): 행 전체 정보
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '결재 상세'
  popupOptions.value.param = {
    sysApprovalRequestId: row.sysApprovalRequestId,
    approvalDocType: props.popupParam.approvalDocType,
    approvalTypeCd: row.approvalTypeCd
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./apprProcess.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 환경설정 결재상세
 *******************************/
function getApprovalStatusCd() {
  switch (props.popupParam.approvalDocType) {
    case 'TODO':
      searchParam.value.approvalStatusCd = 'ASC0000001'
      searchParam.value.approvalKindCd = ''
      title.value = '결재할 문서 목록'
      break
    case 'REQ':
      searchParam.value.approvalStatusCd = ''
      searchParam.value.approvalKindCd = 'AKC0000001'
      title.value = '결재요청 문서 목록'
      break
    case 'APPR':
      searchParam.value.approvalStatusCd = 'ASC9999999'
      searchParam.value.approvalKindCd = ''
      title.value = '결재한 문서 목록'
      break
    case 'PASS':
      searchParam.value.approvalStatusCd = ''
      searchParam.value.approvalKindCd = 'AKC0000009'
      title.value = '회람함 목록'
      break
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

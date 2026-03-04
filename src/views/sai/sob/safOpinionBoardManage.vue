<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-datepicker :range="true" label="의견게시기간" name="period" v-model:value="period" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          codeGroupCd="SOP_BOARD_RESULT_CD"
          itemText="codeName"
          itemValue="code"
          type="search"
          name="resultCd"
          label="처리결과"
          v-model:value="searchParam.resultCd"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="table"
    title="제안의견 목록"
    :columns="grid.columns"
    :data="grid.data"
    rowKey="boardId"
    :columnSetting="false"
    :expandAll="true"
    @linkClick="linkClick"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
  name: 'safOpinionBoardManage'
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
interface searchParamType {
  plantCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  resultCd: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: '',
  startYmd: '',
  endYmd: '',
  resultCd: null
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '95%',
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'boardTitle',
      field: 'boardTitle',
      label: '제목',
      align: 'left',
      type: 'link',
      style: 'width:220px',
      sortable: true
    },
    {
      name: 'boardContents',
      field: 'boardContents',
      label: '의견',
      align: 'left',
      style: 'width:220px',
      sortable: true
    },
    {
      name: 'boardDate',
      field: 'boardDate',
      label: '의견게시일',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'regName',
      field: 'regName',
      label: '작성자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'resultName',
      field: 'resultName',
      label: '처리결과',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const table = ref<any>(null)
const period = ref<string[]>([])

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
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.sai.sob.board.list.url
  getList()
}
/******************************
 * TODO (목적): 제안함 목록 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 제안함 상세 팝업창 표시
 * @param (1): 행 전체 정보 (신규등록인 경우 null)
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '제안의견 상세'
  popupOptions.value.param = {
    boardId: row ? row.boardId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safOpinionBoardManageDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * TODO (목적): 설비 상세 팝업창 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>

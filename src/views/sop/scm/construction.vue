<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="공사기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            :comboItems="finishFlagItems"
            itemText="codeName"
            itemValue="code"
            name="constructionFinishFlag"
            label="공사기간"
            v-model:value="searchParam.constructionFinishFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="공사 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="openPop" />
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

import { constructionType } from './construction'

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
  name: 'construction'
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

interface searchParamType {
  constructionFinishFlag: stringNull
  period: arrayString | null
}
interface gridType {
  columns: tableColumnType
  data: Array<constructionType>
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  period: [],
  constructionFinishFlag: 'N'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'constructionName',
      field: 'constructionName',
      label: '공사명',
      align: 'left',
      style: 'width:220px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'constructionPeriod',
      field: 'constructionPeriod',
      label: '공사명',
      align: 'center',
      style: 'width:180px',
      sortable: true
    },
    {
      name: 'onSiteManager',
      field: 'onSiteManager',
      label: '현장 총괄',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'safetyManager',
      field: 'safetyManager',
      label: '안전책임자',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '주 공사업체',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'constructionFinishFlagName',
      field: 'constructionFinishFlagName',
      label: '공사 진행상태',
      align: 'center',
      style: 'width:90px',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const finishFlagItems = ref<codeMasterType>([
  { code: 'N', codeName: '진행중' },
  { code: 'Y', codeName: '종료' }
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
  listUrl.value = selectConfig.sop.scm.construction.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 공사 조회
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
 * TODO (목적): 공사 상세 조회
 *******************************/
function linkClick(row: constructionType) {
  openPop(row)
}
/******************************
 * TODO (목적): 공사 팝업
 *******************************/
function openPop(row: constructionType) {
  popupOptions.value.title = '공사 상세' // 공사 상세
  popupOptions.value.param = {
    sopConstructionId: row ? row.sopConstructionId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./constructionDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 공사 팝업 닫기 콜백
 *******************************/
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

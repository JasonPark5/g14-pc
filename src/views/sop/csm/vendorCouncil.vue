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
            codeGroupCd="COUNCIL_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="councilTypeCd"
            label="구분"
            v-model:value="searchParam.councilTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="기간"
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
      title="협력사 협의체 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="grid.data"
      rowKey="councilId"
      :columnSetting="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="bookPopup" />
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
import { vendorCoucilType } from './vendorCoucil'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'vendorCouncil'
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
  plantCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  councilTypeCd: stringNull
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
  plantCd: '',
  startYmd: '',
  endYmd: '',
  councilTypeCd: null
})
const grid = ref<any>({
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
      name: 'councilTypeName',
      field: 'councilTypeName',
      label: '구분',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'councilTitle',
      field: 'councilTitle',
      label: '제목',
      align: 'left',
      type: 'link',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'councilDate',
      field: 'councilDate',
      label: '일자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'regName',
      field: 'regName',
      label: '작성자/작성일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const period = ref([])
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
  listUrl.value = selectConfig.mdm.cim.vendor.council.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 협의체 조회
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
 * TODO (목적): 협의체 상세 클릭
 *******************************/
function linkClick(row: vendorCoucilType) {
  bookPopup(row)
}
/******************************
 * TODO (목적): 협의체 등록
 *******************************/
function bookPopup(result: vendorCoucilType) {
  popupOptions.value.title = '협력사 협의체 상세'
  popupOptions.value.param = {
    councilId: result ? result.councilId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./vendorCouncilTab.vue`))
  )
  popupOptions.value.width = '95%'
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 협의체 상세 팝업 닫기 콜백
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="IIM_GRADE_CD"
            itemText="codeName"
            itemValue="code"
            name="iimGradeCd"
            label="아차사고등급"
            v-model:value="searchParam.iimGradeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="IIM_STATUS_NEAR_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            :rejectItems="['ISNC000003']"
            name="iimStatusNearCd"
            label="진행상태"
            v-model:value="searchParam.iimStatusNearCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="공정"
            name="processCd"
            :editable="editable"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            name="period"
            label="아차사고 기간"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-multi-select
            codeGroupCd="IIM_NEAR_KIND_CD"
            itemText="codeName"
            itemValue="code"
            name="iimNearKindCds"
            label="아차사고종류"
            v-model:value="searchParam.iimNearKindCds"
          />
        </div>
      </template>
    </c-search-box>
    <c-table title="아차사고 목록" :columns="grid.columns" :data="grid.data" @linkClick="linkClick">
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="nearAccidentRegister" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </div>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { nearAccidentType } from './nearAccident'

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
  name: 'nearAccident'
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
  iimGradeCd: stringNull
  iimNearKindCds: arrayString | null
  iimStatusNearCd: stringNull
  processCd: stringNull
  period: arrayString | null
}
interface gridType {
  columns: tableColumnType
  data: Array<nearAccidentType>
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  startYmd: '',
  endYmd: '',
  iimGradeCd: null,
  iimNearKindCds: [],
  iimStatusNearCd: null,
  processCd: '',
  period: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimNearAccidentNo',
      field: 'iimNearAccidentNo',
      label: '아차사고번호',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimNearAccidentName',
      field: 'iimNearAccidentName',
      label: '아차사고명',
      style: 'width:200px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimStatusNearName',
      field: 'iimStatusNearName',
      style: 'width:100px',
      label: '진행상태',
      align: 'center',
      sortable: true
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재진행단계',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'iimNearKindName',
      field: 'iimNearKindName',
      style: 'width:120px',
      label: '아차사고종류',
      align: 'left',
      sortable: true
    },
    {
      name: 'iimGradeName',
      field: 'iimGradeName',
      label: '아차사고등급',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'occurrenceLocation',
      field: 'occurrenceLocation',
      label: '발생가능장소',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'occurrenceDt',
      field: 'occurrenceDt',
      style: 'width:100px',
      label: '발생일시',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.sop.iim.accident.near.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  if (searchParam.value.period) {
    searchParam.value.startYmd = searchParam.value.period[0]
    searchParam.value.endYmd = searchParam.value.period[1]
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
/* eslint-disable no-unused-vars */
function nearAccidentRegister() {
  linkClick(null)
}
function linkClick(row: nearAccidentType | null) {
  popupOptions.value.title = '아차사고 상세'
  popupOptions.value.param = {
    iimNearAccidentId: row ? row.iimNearAccidentId : '',
    iimStatusNearCd: row ? row.iimStatusNearCd : '' //아차사고 진행상태
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./nearAccidentDetail.vue`))
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="7d"
            label="기간"
            name="prestartupDates"
            v-model:value="searchParam.prestartupDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="PSR_EQUIPMENT_STATUS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="psrEquipmentStatusCd"
            label="설비상태"
            v-model:value="searchParam.psrEquipmentStatusCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="점검부서"
            name="checkDeptCd"
            :plantCd="searchParam.plantCd"
            v-model:value="searchParam.checkDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            stepperGrpCd="PSR_CHECK_STATUS_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="psrCheckStatusCd"
            label="진행단계"
            v-model:value="searchParam.psrCheckStatusCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="가동전 점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="insertPop" />
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
import { preStartupCheckType } from './preStartupReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preStartupReview'
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
  checkDeptCd: stringNull
  psrEquipmentStatusCd: stringNull
  psrCheckStatusCd: stringNull
  prestartupDates: Array<string>
}
interface gridType {
  columns: tableColumnType
  data: Array<preStartupCheckType>
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
  checkDeptCd: null,
  psrEquipmentStatusCd: null,
  psrCheckStatusCd: null,
  prestartupDates: []
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
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'checkName',
      field: 'checkName',
      label: '점검명',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'psrEquipmentStatusName',
      field: 'psrEquipmentStatusName',
      label: '설비상태',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'checkDeptName',
      field: 'checkDeptName',
      label: '점검부서',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'psrCheckStatusName',
      field: 'psrCheckStatusName',
      label: '진행단계',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'prestartupDates',
      field: 'prestartupDates',
      label: '기간',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'sopMocId',
      field: 'sopMocId',
      label: 'MOC번호',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선진행',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'actionCnt',
          field: 'actionCnt',
          label: '진행중인 건 수',
          align: 'right',
          type: 'cost',
          sortable: false,
          style: 'width:100px'
        },
        {
          name: 'completeCnt',
          field: 'completeCnt',
          label: '완료된 건 수',
          align: 'right',
          type: 'cost',
          sortable: false,
          style: 'width:100px'
        },
        {
          name: 'totalCnt',
          field: 'totalCnt',
          label: '총 건 수',
          align: 'right',
          type: 'cost',
          sortable: false,
          style: 'width:100px'
        }
      ]
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
  listUrl.value = selectConfig.sop.psr.check.list.url
  // code setting
  // list setting
  getList()
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
/* eslint-disable no-unused-vars */
function linkClick(_row: any | undefined) {
  insertPop(_row)
}
function insertPop(_row: any | undefined) {
  popupOptions.value.title = '가동전점검 상세'
  popupOptions.value.param = {
    sopPrestartupCheckId: _row ? _row.sopPrestartupCheckId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./preStartupReviewDetail.vue`))
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

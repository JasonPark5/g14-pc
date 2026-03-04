<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            label="점검년월 (예정, 완료)"
            name="month"
            type="month"
            default="today"
            v-model:value="searchParam.month"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="SMD_SAFETY_CHECK_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="checkStatusCd"
            label="진행상태"
            v-model:value="searchParam.checkStatusCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            :isFirstValue="false"
            type="search"
            label="점검부서"
            name="checkDeptCd"
            v-model:value="searchParam.checkDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="SAFETY_CHECK_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            label="점검구분"
            name="checkTypeCd"
            v-model:value="searchParam.checkTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="안전점검일지 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
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
  name: 'safetyCheck'
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
  data: Array<any>
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
const searchParam = ref<any>({
  plantCd: null,
  month: '',
  checkStatusCd: null,
  checkDeptCd: '',
  checkTypeCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:100px',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'safetyCheckName',
      field: 'safetyCheckName',
      style: 'width:200px',
      label: '점검명',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'checkDeptName',
      field: 'checkDeptName',
      style: 'width:100px',
      label: '점검부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkTypeName',
      field: 'checkTypeName',
      style: 'width:100px',
      label: '점검구분',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkStatusName',
      field: 'checkStatusName',
      label: '진행단계',
      style: 'width:100px',
      align: 'center',
      sortable: false
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
      name: 'checkDate',
      field: 'checkDate',
      style: 'width:100px',
      label: '점검월',
      align: 'center',
      sortable: false
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
  listUrl.value = selectConfig.sop.safetycheck.plan.list.url
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
function linkClick(row?: any) {
  popupOptions.value.title = '관리감독자 점검일지 상세'
  popupOptions.value.param = {
    safetyCheckId: row ? row.safetyCheckId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safetyCheckDetail.vue`))
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

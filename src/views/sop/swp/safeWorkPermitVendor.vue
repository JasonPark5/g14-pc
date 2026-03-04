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
            defaultStart="-6M"
            defaultEnd="6M"
            label="작업기간"
            name="permitDates"
            v-model:value="searchParam.permitDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'vendor' }"
            label="신청업체"
            name="vendorCd"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            stepperGrpCd="SWP_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="swpStepCd"
            label="진행단계"
            v-model:value="searchParam.swpStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="SOP_PERMIT_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="permitTypeCd"
            label="허가서구분"
            v-model:value="searchParam.permitTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="SOP_SUPPLEMENT_WORK_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="supplementWorkTypeCd"
            label="보충작업"
            v-model:value="searchParam.supplementWorkTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="수급업체 작업허가서 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        {{ $language(props.row[col.name]) }}
        <template v-if="props.row.swpWorkRequestName">
          -
          <q-badge outline align="top" color="teal">
            {{ $language(props.row.swpWorkRequestName) }} {{ $language('검토중') }}
          </q-badge>
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
  name: 'safeWorkPermitVendor'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
const searchParam = ref({
  plantCd: null,
  permitDates: [],
  applicationDeptCd: null,
  issuedDeptCd: null,
  permitTypeCd: null,
  supplementWorkTypeCd: null,
  swpStepCd: null,
  vendorCd: null,
  workManagerId: ''
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'workSummary',
      field: 'workSummary',
      label: '작업개요',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width:240px'
    },
    {
      name: 'swpStepName',
      field: 'swpStepName',
      label: '진행단계',
      align: 'center',
      sortable: true,
      style: 'width:100px'
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
      name: 'permitDate',
      field: 'permitDate',
      label: '허가일',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'permitTypeName',
      field: 'permitTypeName',
      label: '허가서구분',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'supplementWorkTypeNames',
      field: 'supplementWorkTypeNames',
      label: '보충작업',
      align: 'left',
      sortable: true,
      style: 'width:200px'
    },
    {
      name: 'applicationDeptName',
      field: 'applicationDeptName',
      label: '신청부서/업체',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'issuedDeptName',
      field: 'issuedDeptName',
      label: '발급부서/업체',
      align: 'center',
      sortable: true,
      style: 'width:100px'
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
  listUrl.value = selectConfig.sop.swp.workPermit.list.url
  // code setting
  searchParam.value.workManagerId = user.value.userId
  // list setting
  getList()
}
/******************************
 * TODO (목적): 작업허가서 조회
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
 * TODO (목적): 작업허가서 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '작업허가서 상세'
  popupOptions.value.param = {
    sopWorkPermitId: row ? row.sopWorkPermitId : '',
    permitTypeCd: row ? row.permitTypeCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safeWorkPermitDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 작업허가서 팝업 닫기
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

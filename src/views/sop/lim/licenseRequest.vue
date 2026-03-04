<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-dept
          type="search"
          label="요청부서"
          :isFirstValue="false"
          name="requestDeptCd"
          v-model:value="searchParam.requestDeptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-dept
          type="search"
          label="검토부서"
          name="reviewDeptCd"
          :isFirstValue="false"
          v-model:value="searchParam.reviewDeptCd"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="table"
    title="인허가 요청 및 검토"
    :columns="grid.columns"
    :data="grid.data"
    :merge="grid.merge"
    :columnSetting="false"
    :expandAll="true"
    @linkClick="linkClick"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="인허가 요청" icon="add" @btnClicked="linkClick" />
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
  name: 'licenseRequest'
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
const searchParam = ref({
  plantCd: null,
  requestDeptCd: null,
  reviewDeptCd: null,
  licenseRequestName: ''
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [
    { index: 0, colName: 'limLicenseRequestId' },
    { index: 1, colName: 'limLicenseRequestId' },
    { index: 7, colName: 'limLicenseRequestId' },
    { index: 8, colName: 'limLicenseRequestId' },
    { index: 9, colName: 'limLicenseRequestId' },
    { index: 10, colName: 'limLicenseRequestId' },
    { index: 11, colName: 'limLicenseRequestId' },
    { index: 12, colName: 'limLicenseRequestId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      fix: true
    },
    {
      name: 'licenseRequestName',
      field: 'licenseRequestName',
      label: '인허가 요청명',
      align: 'left',
      type: 'link',
      style: 'width:240px',
      sortable: true,
      fix: true
    },
    {
      label: '인허가종류별 검토현황',
      align: 'center',
      child: [
        {
          name: 'limLicenseKindStatusName',
          field: 'limLicenseKindStatusName',
          label: '검토상태',
          align: 'left',
          style: 'width:160px',
          sortable: false
        },
        {
          name: 'relatedLawsName',
          field: 'relatedLawsName',
          label: '관련법규',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'limLicenseKindName',
          field: 'limLicenseKindName',
          label: '인허가종류',
          align: 'left',
          style: 'width:240px',
          sortable: false
        },
        {
          name: 'reviewDeptName2',
          field: 'reviewDeptName2',
          label: '검토부서',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'reviewUserName2',
          field: 'reviewUserName2',
          label: '검토부서',
          align: 'center',
          style: 'width:100px',
          sortable: false
        }
      ]
    },
    {
      name: 'completeRequestDate',
      field: 'completeRequestDate',
      label: '완료 요청일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'requestStepName',
      field: 'requestStepName',
      label: '전체 진행 단계',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'requestDeptName',
      field: 'requestDeptName',
      label: '인허가요청부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'requestUserName',
      field: 'requestUserName',
      label: '인허가요청자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewDeptName',
      field: 'reviewDeptName',
      label: '인허가검토부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      label: '인허가검토자',
      align: 'center',
      style: 'width:100px',
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
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.sop.lim.lincense.request.list.url
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
 * TODO (목적): 상세 팝업창 표시
 * @param (1): 행 전체 정보 (신규등록인 경우 null)
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '인허가 요청 및 검토'
  popupOptions.value.param = {
    stepCd: row ? row.requestStepCd : '',
    limLicenseRequestId: row ? row.limLicenseRequestId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./licenseRequestStep.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>

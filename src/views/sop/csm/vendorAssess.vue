<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="협력업체"
            name="vendorCd"
            :customPopupParam="{ targetKey: 'vendor' }"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="VENDOR_EVALUATION_KIND_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="vendorEvaluationKindCd"
            label="평가구분"
            v-model:value="searchParam.vendorEvaluationKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="EVALUATION_GRADE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="evaluationGradeCd"
            label="평가등급"
            v-model:value="searchParam.evaluationGradeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            label="평가기간"
            name="evalTerms"
            v-model:value="searchParam.evalTerms"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="statusItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="상태"
            v-model:value="searchParam.evaluationCompleteFlag"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="관련공사"
            name="sopConstructionId"
            :customPopupParam="{ targetKey: 'construction' }"
            v-model:value="searchParam.sopConstructionId"
          />
        </div> -->
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="협력업체 평가 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="등록" v-if="editable" icon="add" @btnClicked="linkClick" />
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
  name: 'vendorAssess'
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
  vendorCd: null,
  vendorEvaluationKindCd: null,
  evaluationGradeCd: null,
  evalTerms: [],
  sopConstructionId: '',
  evaluationCompleteFlag: null
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
      name: 'vendorName',
      field: 'vendorName',
      label: '협력업체',
      style: 'width:200px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'vendorEvaluationKindName',
      field: 'vendorEvaluationKindName',
      label: '평가구분',
      style: 'width:140px',
      align: 'center',
      sortable: true
    },
    {
      name: 'statusName',
      field: 'statusName',
      label: '상태',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      label: '평가점수',
      child: [
        {
          name: 'totalScore',
          field: 'totalScore',
          style: 'width:80px',
          label: '총점',
          align: 'center',
          sortable: true
        },
        {
          name: 'score',
          field: 'score',
          style: 'width:80px',
          label: '평점',
          align: 'center',
          sortable: true
        },
        {
          name: 'evaluationGradeName',
          field: 'evaluationGradeName',
          style: 'width:80px',
          label: '등급',
          align: 'center',
          sortable: true
        }
      ]
    },
    {
      name: 'evaluationDate',
      field: 'evaluationDate',
      label: '평가기간',
      style: 'width:180px',
      align: 'center',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '평가결과 종합',
      style: 'width:280px',
      align: 'left',
      sortable: false
    },
    {
      name: 'sopConstructionId',
      field: 'sopConstructionId',
      style: 'width:180px',
      label: '공사',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const statusItems = ref<codeMasterType>([
  { code: 'Y', codeName: '평가완료' },
  { code: 'N', codeName: '평가중' }
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
  listUrl.value = selectConfig.mdm.cim.vendor.evaluation.result.list.url
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
  popupOptions.value.title = '협력업체 평가 상세'
  popupOptions.value.param = {
    mdmVendorEvaluationId: row ? row.mdmVendorEvaluationId : '',
    vendorCd: row ? row.vendorCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./vendorAssessDetail.vue`))
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

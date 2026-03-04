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
            codeGroupCd="LAW_REGISTER_ITEM_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            label="법령구분"
            name="lawRegisterItemTypeCd"
            v-model:value="searchParam.lawRegisterItemTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            label="평가년도"
            default="today"
            type="year"
            name="evalYear"
            v-model:value="searchParam.evalYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="HALF_CD"
            itemText="codeName"
            itemValue="code"
            label="상/하반기"
            name="halfCd"
            v-model:value="searchParam.halfCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="평가부서"
            name="targetDeptCd"
            :isFirstValue="false"
            v-model:value="searchParam.targetDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="SAI_COMPLIANCE_EVAL_TABLE_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            label="진행상태"
            name="saiComplianceEvalTableStepCd"
            v-model:value="searchParam.saiComplianceEvalTableStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="법규등록부 및 준수평가표 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
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
import { complianceEvalTableType } from './complianceEvalTable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'complianceEvalTable'
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
  plantCd: '',
  saiComplianceEvalTableStepCd: null,
  evalYear: '',
  targetDeptCd: '',
  lawRegisterItemTypeCd: null,
  halfCd: null
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:120px'
    },
    {
      name: 'lawRegisterItemTypeName',
      field: 'lawRegisterItemTypeName',
      label: '법령구분',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'evalYear',
      field: 'evalYear',
      label: '평가년도',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'halfName',
      field: 'halfName',
      label: '상/하반기',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'startDt',
      field: 'startDt',
      label: '평가일자',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'targetDeptName',
      field: 'targetDeptName',
      label: '평가대상부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      label: '평가자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'totalName',
      field: 'totalName',
      label: '상세보기',
      align: 'left',
      style: 'width:220px',
      type: 'link',
      sortable: true
    },
    {
      name: 'saiComplianceEvalTableStepName',
      field: 'saiComplianceEvalTableStepName',
      label: '진행상태',
      style: 'width:100px',
      align: 'center'
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
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '승인자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'lawNames',
      field: 'lawNames',
      label: '법령명',
      align: 'left'
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
  listUrl.value = selectConfig.sai.evalTable.complianceEvalTable.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 법규등록부 및 준수평가표 조회
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
 * TODO (목적): 법규등록부 및 준수평가표 링크 클릭
 * @param (1): 행 정보
 *******************************/
function linkClick(row: complianceEvalTableType) {
  detailPopup(row)
}
/******************************
 * TODO (목적): 법규등록부 및 준수평가표 팝업 표시
 * @param (1): 행 정보
 *******************************/
function detailPopup(row: complianceEvalTableType) {
  popupOptions.value.title = '법규등록부 및 준수평가표'
  popupOptions.value.param = {
    saiComplianceEvalTableId: row ? row.saiComplianceEvalTableId : null,
    lawRegisterItemTypeCd: searchParam.value.lawRegisterItemTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./complianceEvalTableDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 법규등록부 및 준수평가표 팝업 닫기
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

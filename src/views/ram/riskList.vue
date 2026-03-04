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
            label="평가기간"
            name="assessmentDates"
            v-model:value="searchParam.assessmentDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_ASSESS_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramAssessTypeCd"
            label="평가구분-정기/수시/최초"
            v-model:value="searchParam.ramAssessTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_STATUS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramStatusCd"
            label="진행단계"
            v-model:value="searchParam.ramStatusCd"
          />
        </div>

        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="stepItems"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="ramStepCd"
            label="진행단계"
            v-model:value="searchParam.ramStepCd"
          />
        </div> -->
      </template>
    </c-search-box>
    <c-table
      ref="table"
      :title="ramTechnique + ' ' + $language('위험성평가 목록')"
      tableId="4"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !searchParam.isVendor"
            label="등록"
            icon="add"
            @btnClicked="addRisk"
          />
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
import { riskListType } from './risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskList'
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
  columns: tableColumnType
  data: Array<riskListType>
}
interface searchParamType {
  plantCd: stringNull
  assessmentDates: Array<any>
  ramAssessTypeCd: stringNull
  ramStepCd: stringNull
  ramStatusCd: stringNull
  ramTechniqueCd: stringNull
  isVendor: boolean | null
  approvalUserId: stringNull
}
interface paramType {
  ramTechniqueCd?: stringNull
  isNew?: stringNull
  approvalUserId?: stringNull
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
  assessmentDates: [],
  ramAssessTypeCd: null,
  ramStepCd: null,
  ramStatusCd: null,
  ramTechniqueCd: '',
  isVendor: false,
  approvalUserId: ''
})
const stepItems = ref<any>([])
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const routeParam = ref<paramType>({
  ramTechniqueCd: null,
  approvalUserId: null
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
      name: 'assessmentName',
      field: 'assessmentName',
      label: '평가명',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'ramStatusName',
      field: 'ramStatusName',
      label: '진행단계',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'assessmentDate',
      field: 'assessmentDate',
      label: '평가기간',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'ramAssessTypeName',
      field: 'ramAssessTypeName',
      label: '평가구분',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '작성자',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      label: '검토자',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '승인자',
      align: 'center',
      style: 'width:80px',
      sortable: true
    }
  ],
  data: []
})
const ramTechnique = ref('')

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
  listUrl.value = selectConfig.ram.assessPlan.list.url
  // code setting
  getStepItems('RAM_RISK_STEP_CD').then((_result: any) => {
    _result!.splice(1, 1)
    stepItems.value = _result
  })
  routeParam.value = route.meta.params as paramType

  searchParam.value.ramTechniqueCd = routeParam.value.ramTechniqueCd
  if (routeParam.value.approvalUserId) {
    // this.$set(this.searchParam, 'approvalUserId', this.$store.getters.user.userId)
    searchParam.value.isVendor = true
  }
  // const _code = window.location.href.slice(-10)
  const parts = window.location.href.split('/')
  const index = parts.indexOf('riskList')
  const _code = index !== -1 ? parts[index + 1] : null
  const _code2 = index !== -1 ? parts[index + 2] : null
  switch (_code) {
    case 'RT00000001':
      ramTechnique.value = 'HAZOP'
      break
    case 'RT00000005':
      ramTechnique.value = 'K-PSR'
      break
    case 'RT00000010':
      ramTechnique.value = 'CHECKLIST'
      break
    case 'RT00000015':
      ramTechnique.value = 'JRA'
      break
    case 'RT00000020':
      switch (_code2) {
        case 'Y':
          ramTechnique.value = 'KRAS'
          break
        case 'N':
          ramTechnique.value = '(구)KRAS'
          break
      }
      break
    case 'RT00000025':
      switch (_code2) {
        case 'Y':
          ramTechnique.value = '4M'
          break
        case 'N':
          ramTechnique.value = '(구)4M'
          break
        case 'e':
          ramTechnique.value = '4M (협력사)'
          break
      }
      break
    case 'RT00000030':
      ramTechnique.value = 'CHARM'
      break
    case 'RT00000035':
      ramTechnique.value = '3단계판단법'
      break
    default:
      ramTechnique.value = '4M (협력사)'
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
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
 * TODO (목적): 신규추가
 *******************************/
function addRisk() {
  linkClick()
}
/******************************
 * TODO (목적): 위험성평가 상세 팝업
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '위험성평가 상세'
  popupOptions.value.param = {
    ramRiskAssessmentPlanId: row ? row.ramRiskAssessmentPlanId : '',
    ramStepCd: row ? row.ramStepCd : 'RRS0000001',
    vendorFlag: row ? row.vendorFlag > 0 : false,
    ramTechniqueCd: routeParam.value.ramTechniqueCd,
    isNew: routeParam.value.isNew ? routeParam.value.isNew : null,
    assessmentName: row ? row.assessmentName : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./riskDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 위험성평가 상세 팝업 닫기 callback
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

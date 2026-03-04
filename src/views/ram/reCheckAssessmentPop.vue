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
            type="year"
            label="평가년도"
            name="assessmentYears"
            v-model:value="searchParam.assessmentYears"
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
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="table"
          title="위험성평가 목록"
          :columns="grid.columns"
          :data="grid.data"
          :gridHeight="grid.height"
          selection="multiple"
          rowKey="ramRiskAssessmentPlanId"
          @changeSelection="changeSelection"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-tab
          type="tabcard"
          align="left"
          height="600px"
          :tabItems="tabItems"
          inlineLabel
          v-model:value="tab"
        >
          <template v-slot:default="tab">
            <component
              :is="tab.component"
              :popupParam="popupParam"
              :summary="summary"
              :assessmentName="tab.label"
              :ramRiskAssessmentPlanIds="ramRiskAssessmentPlanIds"
              :ramRiskAssessmentPlanId="tab.name"
              @closePopup="closePopup"
            />
          </template>
        </c-tab>
      </div>
    </div>
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
  name: 'reCheckAssessmentPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    ramRiskAssessmentPlanId: stringNull
    ramTechniqueCd: stringNull
    vendorFlag: boolean
  }
  contentHeight: stringNull | numberNull
}
interface searchParamType {
  plantCd: stringNull
  assessmentYears: Array<any>
  ramAssessTypeCd: stringNull
  ramStepCd: stringNull // 완료된 정보만 (재검토임으로)
  ramTechniqueCd: stringNull
  approvalUserId: stringNull
  isVendor: boolean
  ramRiskAssessmentPlanId: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    ramRiskAssessmentPlanId: '',
    ramTechniqueCd: '',
    vendorFlag: false
  }),
  contentHeight: 'auto'
})

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
  assessmentYears: [],
  ramAssessTypeCd: null,
  ramStepCd: 'RRS0000015', // 완료된 정보만 (재검토임으로)
  ramTechniqueCd: '',
  approvalUserId: '',
  isVendor: false,
  ramRiskAssessmentPlanId: ''
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:85px',
      sortable: true
    },
    {
      name: 'assessmentName',
      field: 'assessmentName',
      label: '평가명',
      align: 'left',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'assessmentDate',
      field: 'assessmentDate',
      label: '평가기간',
      align: 'center',
      style: 'width:170px',
      sortable: true
    },
    {
      name: 'ramAssessTypeName',
      field: 'ramAssessTypeName',
      label: '평가구분',
      align: 'center',
      style: 'width:60px',
      sortable: true
    }
  ],
  height: '600px',
  data: []
})
const tab = ref('summary')
const tabDefaultItems = ref([
  {
    name: 'summary',
    label: '합산', // 합산
    component: defineAsyncComponent(() => import(`./reCheckSummary.vue`))
  }
]) as any
const summary = ref({
  data: []
})
const selectRisks = ref(Array<any>)
const listUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const ramRiskAssessmentPlanIds = computed(() => {
  const ids = [] as any
  if (tabItems && tabItems.value.length > 1) {
    // summary 제외한 항목이 존재하는 경우
    for (let idx = 1; idx < tabItems.value.length; idx++) {
      ids.push(tabItems.value[idx].name)
    }
  }
  return ids
})
const tabItems = computed(() => {
  let items = tabDefaultItems.value
  if (selectRisks.value && selectRisks.value.length > 0) {
    items = _.concat(
      items,
      _.map(selectRisks.value, (_risk: any) => {
        return {
          name: _risk.ramRiskAssessmentPlanId,
          label: _risk.assessmentName,
          component: defineAsyncComponent(() => import(`./reCheckSecnario.vue`))
        }
      })
    )
  }
  return items
})

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
  searchParam.value.ramTechniqueCd = props.popupParam.ramTechniqueCd
  searchParam.value.ramRiskAssessmentPlanId = props.popupParam.ramRiskAssessmentPlanId
  if (props.popupParam.vendorFlag) {
    searchParam.value.isVendor = true
    searchParam.value.approvalUserId = user.value.userId
  }
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
 * TODO (목적): 선택 변경
 *******************************/
function changeSelection() {
  const selectData = table.value.getSelected()
  if (_.findIndex(selectData, { ramRiskAssessmentPlanId: tab.value }) === -1) tab.value = 'summary'
  selectRisks.value = selectData
}
/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup(_data: any, _sum: any) {
  emits('closePopup', _data, _sum)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

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
            :comboItems="stepItems"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="ramStepCd"
            label="진행단계"
            v-model:value="searchParam.ramStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="tasktable"
      title="위험성평가 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="ramRiskAssessmentPlanId"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data!.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteTask"
          />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addTask" />
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
import { constructionPopupParamType, constructionTaskType } from './construction'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'constructionRelactionTaskRiskAssess'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
interface propType {
  popupParam: constructionPopupParamType
  task: constructionTaskType
}
interface searchParamType {
  plantCd: stringNull
  assessmentDates: arrayString | null
  ramAssessTypeCd: stringNull
  ramStepCd: stringNull
  ramTechniqueCd: stringNull
  isVendor: boolean
  approvalUserId: stringNull
  sopConstructionId: stringNull
  constructionFlag: boolean
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sopConstructionId: ''
    }
  },
  task: () => {
    return {
      insertUrl: '',
      deleteUrl: ''
    }
  }
})

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
  plantCd: null,
  assessmentDates: [],
  ramAssessTypeCd: null,
  ramStepCd: null,
  ramTechniqueCd: '',
  isVendor: false,
  approvalUserId: '',
  sopConstructionId: '',
  constructionFlag: true
})
const grid = ref<any>({
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
      name: 'ramTechniqueName',
      field: 'ramTechniqueName',
      label: '평가기법',
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
      name: 'ramStepName',
      field: 'ramStepName',
      label: '진행단계',
      align: 'center',
      style: 'width:100px',
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
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '작성자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      label: '검토자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '승인자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const stepItems = ref<any>([])
const listUrl = ref('')
const tasktable = ref<any>(null)
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
    _result.splice(1, 1)
    stepItems.value = _result
  })
  searchParam.value.sopConstructionId = props.popupParam.sopConstructionId
  // list setting
  getList()
}
/******************************
 * TODO (목적): 위험성평가 조회
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
 * TODO (목적): 위험성평가 상세 조회
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  popupOptions.value.title = '위험성평가 상세'
  popupOptions.value.param = {
    ramRiskAssessmentPlanId: row.ramRiskAssessmentPlanId,
    ramStepCd: row.ramStepCd,
    vendorFlag: row.vendorFlag > 0,
    ramTechniqueCd: row.ramTechniqueCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/riskDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 위험성평가 팝업 닫기 콜백
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * TODO (목적): 위험성평가 삭제
 *******************************/
function deleteTask() {
  const selectData = tasktable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: props.task.deleteUrl,
          method: 'DELETE',
          data: Object.values(
            _.map(selectData, (item) => {
              return {
                sopConstructionId: props.popupParam.sopConstructionId,
                ramRiskAssessmentPlanId: item.ramRiskAssessmentPlanId
              }
            })
          )
        }).then((_result: any) => {
          message.requestSuccess()
          tasktable.value.compoTable.clearSelection()
          getList()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 위험성평가 추가
 *******************************/
function addTask() {
  popupOptions.value = getPopupOptions('riskAssessment', popupOptions.value, closeTaskPopup, {
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 위험성평가 추가 팝업 닫기 콜백
 *******************************/
function closeTaskPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const insertList: any = []
    _.forEach(data, (item) => {
      if (
        _.findIndex(grid.value.data, { ramRiskAssessmentPlanId: item.ramRiskAssessmentPlanId }) ===
        -1
      ) {
        insertList.push({
          sopConstructionId: props.popupParam.sopConstructionId,
          ramRiskAssessmentPlanId: item.ramRiskAssessmentPlanId
        })
      }
    })
    $http({
      url: props.task.insertUrl,
      method: 'POST',
      data: insertList
    }).then((_result: any) => {
      getList()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

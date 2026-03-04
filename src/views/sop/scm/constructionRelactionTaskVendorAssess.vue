<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :editable="editable"
            :customPopupParam="{ targetKey: 'vendor' }"
            label="수급업체"
            name="vendorCd"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="6M"
            label="평가기간"
            name="evalTerms"
            v-model:value="searchParam.evalTerms"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="tasktable"
      title="수급업체 평가 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="mdmVendorEvaluationId"
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
  name: 'constructionRelactionTaskVendorAssess'
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
  vendorCd: stringNull
  vendorEvaluationKindCd: stringNull
  evaluationGradeCd: stringNull
  evalTerms: arrayString | null
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
const props = withDefaults(defineProps<propType>(), {})

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
  vendorCd: null,
  vendorEvaluationKindCd: null,
  evaluationGradeCd: null,
  evalTerms: [],
  sopConstructionId: '',
  constructionFlag: true
})
const grid = ref<any>({
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
      label: '수급업체',
      style: 'width:200px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'vendorEvaluationKindName',
      field: 'vendorEvaluationKindName',
      label: '평가구분',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '상태',
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
          style: 'width:100px',
          label: '총점',
          align: 'center',
          sortable: true
        },
        {
          name: 'score',
          field: 'score',
          style: 'width:100px',
          label: '평점',
          align: 'center',
          sortable: true
        },
        {
          name: 'evaluationGradeName',
          field: 'evaluationGradeName',
          style: 'width:100px',
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
      style: 'width:250px',
      align: 'center',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '평가결과 종합',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.mdm.cim.vendor.evaluation.result.list.url
  // code setting
  searchParam.value.sopConstructionId = props.popupParam.sopConstructionId
  // list setting
  getList()
}
/******************************
 * TODO (목적): 수급업체 평가 조회
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
 * TODO (목적): 수급업체 평가 상세 조회
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  popupOptions.value.title = '수급업체 평가 상세'
  popupOptions.value.param = {
    mdmVendorEvaluationId: row.mdmVendorEvaluationId,
    vendorCd: row.vendorCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/csm/vendorAssessDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 수급업체 평가 팝업 닫기 콜백
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 수급업체 평가 삭제
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
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: props.task.deleteUrl,
          method: 'DELETE',
          data: Object.values(
            _.map(selectData, (item) => {
              return {
                sopConstructionId: props.popupParam.sopConstructionId,
                mdmVendorEvaluationId: item.mdmVendorEvaluationId
              }
            })
          )
        }).then((_result: any) => {
          message.requestSuccess()
          tasktable.value.compoTable.clearSelection()
          getList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 수급업체 평가 추가
 *******************************/
function addTask() {
  popupOptions.value = getPopupOptions('vendorAssess', popupOptions.value, closeTaskPopup, {
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 수급업체 평가 추가 팝업 닫기 콜백
 *******************************/
function closeTaskPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const insertList: any = []
    _.forEach(data, (item) => {
      if (
        _.findIndex(grid.value.data, { mdmVendorEvaluationId: item.mdmVendorEvaluationId }) === -1
      ) {
        insertList.push({
          sopConstructionId: props.popupParam.sopConstructionId,
          mdmVendorEvaluationId: item.mdmVendorEvaluationId
        })
      }
    })

    $http({
      url: props.task.insertUrl,
      method: 'POST',
      data: insertList
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

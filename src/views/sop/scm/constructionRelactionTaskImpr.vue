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
            label="(기간)조치완료 요청일"
            name="actionCompleteRequestDates"
            v-model:value="searchParam.actionCompleteRequestDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="IBM_TASK_TYPE_CD"
            :rejectItems="['ITT0000145']"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="업무"
            name="ibmTaskTypeCd"
            v-model:value="searchParam.ibmTaskTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            stepperGrpCd="IBM_STEP_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            label="진행단계"
            name="ibmStepCd"
            v-model:value="searchParam.ibmStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="IBM_CLASS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="개선구분"
            name="ibmClassCd"
            v-model:value="searchParam.ibmClassCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-checkbox
            :isFlag="true"
            falseLabel="All"
            label="지연된 업무 확인"
            name="overFlag"
            v-model:value="searchParam.overFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="tasktable"
      title="개선 목록"
      tableId="impr01"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="sopImprovementId"
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
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'actionCompleteRequestDate'">
          <span
            :style="
              props.row.approvalStatusCd === 'ASC9999999' ? 'text-decoration: line-through' : ''
            "
          >
            {{ props.row.actionCompleteRequestDate }}
            <q-badge
              v-if="
                props.row.completeDateOver > 0 &&
                props.row.ibmStepCd !== 'IS00000001' &&
                props.row.approvalStatusCd !== 'ASC9999999'
              "
              color="negative"
              label="지연"
              class="blinking"
            />
          </span>
          <span v-if="props.row.approvalStatusCd === 'ASC9999999'">
            👉 {{ props.row.targetDate }}
          </span>
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
import { constructionPopupParamType, constructionTaskType } from './construction'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'constructionRelactionTaskImpr'
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
  actionCompleteRequestDates: arrayString | null
  ibmTaskTypeCd: stringNull
  stepCd: stringNull
  actionFlag: stringNull
  overFlag: stringNull
  ibmClassCd: stringNull
  sopConstructionId?: stringNull
  constructionFlag: boolean
  ibmStepCd?: stringNull
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
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  plantCd: null,
  actionCompleteRequestDates: [],
  ibmTaskTypeCd: null,
  stepCd: null,
  actionFlag: 'D',
  overFlag: 'N',
  ibmClassCd: null,
  sopConstructionId: '',
  constructionFlag: true,
  ibmStepCd: null
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
      name: 'ibmTaskTypeName',
      field: 'ibmTaskTypeName',
      label: '업무',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행단계',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'improveRequestDeptName',
      field: 'improveRequestDeptName',
      label: '요청부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'improveRequestContents',
      field: 'improveRequestContents',
      label: '요청정보',
      align: 'left',
      style: 'width:200px',
      type: 'html',
      sortable: true
    },
    {
      name: 'actionCompleteRequestDate',
      field: 'actionCompleteRequestDate',
      label: '조치완료 요청일',
      align: 'center',
      style: 'width:100px',
      type: 'custom',
      sortable: true
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '지연 결재',
      align: 'center',
      sortable: true,
      style: 'width:90px'
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'actionUserNames',
      field: 'actionUserNames',
      label: '조치자',
      align: 'left',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'actionCompleteDate',
      field: 'actionCompleteDate',
      label: '조치완료일',
      align: 'center',
      style: 'width:90px',
      sortable: true
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
  listUrl.value = selectConfig.sop.ibm.improve.list.url
  // code setting
  searchParam.value.sopConstructionId = props.popupParam.sopConstructionId
  // list setting
  getList()
}
/******************************
 * TODO (목적): 개선 조회
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
 * TODO (목적): 개선 상세 조회
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  if (!row || row.ibmClassCd == 'IC00000001') {
    popupOptions.value.title = '개선 상세' // 개선 상세
    popupOptions.value.isFull = true
    popupOptions.value.param = {
      sopImprovementId: row.sopImprovementId,
      ibmTaskTypeCd: row.ibmTaskTypeCd
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.isFull = false
    popupOptions.value.param = {
      sopImprovementId: row.sopImprovementId,
      ibmTaskTypeCd: row.ibmTaskTypeCd
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
    )
    popupOptions.value.width = '80%'
  }
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 개선 팝업 닫기 콜백
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 개선 삭제
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
                sopImprovementId: item.sopImprovementId
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
 * TODO (목적): 개선 추가
 *******************************/
function addTask() {
  popupOptions.value = getPopupOptions('impr', popupOptions.value, closeTaskPopup, {
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 개선 추가 팝업 닫기 콜백
 *******************************/
function closeTaskPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const insertList: any = []
    _.forEach(data, (item) => {
      if (_.findIndex(grid.value.data, { sopImprovementId: item.sopImprovementId }) === -1) {
        insertList.push({
          sopConstructionId: props.popupParam.sopConstructionId,
          sopImprovementId: item.sopImprovementId
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

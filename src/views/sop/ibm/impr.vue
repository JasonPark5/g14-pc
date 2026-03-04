<template>
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
          label="(기간)조치완료 요청일"
          name="actionCompleteRequestDates"
          v-model:value="searchParam.actionCompleteRequestDates"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          type="search"
          :disabled="isPop"
          codeGroupCd="IBM_TASK_TYPE_CD"
          itemText="codeName"
          itemValue="code"
          label="업무"
          name="ibmTaskTypeCd"
          v-model:value="searchParam.ibmTaskTypeCd"
        />
      </div>
      <div v-if="!isPop" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-dept
          :isFirstValue="false"
          type="search"
          label="요청부서"
          name="improveRequestDeptCd"
          v-model:value="searchParam.improveRequestDeptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-dept
          :isFirstValue="!isPop"
          type="search"
          label="조치부서"
          name="actionDeptCd"
          v-model:value="searchParam.actionDeptCd"
        />
      </div>
      <div v-if="!isPop" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          codeGroupCd="IBM_CLASS_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="ibmClassCd"
          label="개선구분"
          v-model:value="searchParam.ibmClassCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-radio
          :comboItems="[
            { code: 'D', codeName: '부서' },
            { code: 'V', codeName: '업체' },
            { code: null, codeName: '전체' }
          ]"
          label="조치대상"
          name="actionFlag"
          v-model:value="searchParam.actionFlag"
        />
      </div>
      <div v-if="!isPop" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
    ref="table"
    title="개선 목록"
    tableId="impr01"
    :columns="grid.columns"
    :data="grid.data"
    selection="multiple"
    rowKey="sopImprovementId"
    @linkClick="(row: any) => linkClick(row, 1)"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn
          v-if="grid.data && grid.data.length > 0"
          label="개선결과보고서"
          icon="print"
          @btnClicked="imprResultPrint"
        />
        <c-btn v-if="editable" label="개선요청" icon="add" @btnClicked="linkClick({}, 2)" />
        <c-btn v-if="editable" label="즉시조치" icon="add" @btnClicked="linkClick({}, 3)" />
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
          <!-- completeDateOver: {{props.row.completeDateOver}}
            ibmStepCd: {{props.row.ibmStepCd}}
            approvalStatusCd: {{props.row.approvalStatusCd}} -->

          <q-badge
            v-if="
              props.row.completeDateOver > 0 &&
              props.row.ibmStepCd !== 'IS00000001' &&
              props.row.ibmStepCd !== 'IS00000020' &&
              props.row.approvalStatusCd !== 'ASC9999999'
            "
            color="red"
            :label="$language('지연')"
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
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { imprType } from './impr'

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
  name: 'impr'
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
interface searchParamType {
  plantCd: stringNull
  actionCompleteRequestDates: arrayString | null
  ibmTaskTypeCd: stringNull
  stepCd: stringNull
  improveRequestDeptCd: stringNull
  actionDeptCd: stringNull
  actionFlag: stringNull
  overFlag: stringNull
  ibmClassCd: stringNull
  stepGubun: stringNull
  ibmStepCd: stringNull
}
interface propType {
  popupParam?: imprPopupParamType
}
interface imprPopupParamType {
  plantCd: stringNull
  ibmTaskTypeCd: stringNull
  actionCompleteRequestDates: arrayString | null
  stepGubun: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<imprType>
}
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      plantCd: null,
      ibmTaskTypeCd: null,
      actionCompleteRequestDates: [],
      stepGubun: ''
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
  actionCompleteRequestDates: [],
  ibmTaskTypeCd: null,
  stepCd: null,
  improveRequestDeptCd: '',
  actionDeptCd: '',
  actionFlag: null,
  overFlag: 'N',
  ibmClassCd: null,
  stepGubun: '',
  ibmStepCd: null
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
      name: 'ibmTaskTypeName',
      field: 'ibmTaskTypeName',
      label: '업무',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'ibmClassName',
      field: 'ibmClassName',
      label: '구분',
      align: 'center',
      style: 'width:60px',
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
      label: '지연결재',
      align: 'center',
      sortable: true,
      style: 'width:80px'
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
      align: 'center',
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
const printUrl = ref('')
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const isPop = computed(() => Boolean(props.popupParam.ibmTaskTypeCd))

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
  printUrl.value = selectConfig.sop.ibm.improve.print.url
  // code setting
  if (props.popupParam.ibmTaskTypeCd) {
    searchParam.value.ibmTaskTypeCd = props.popupParam.ibmTaskTypeCd
  }
  if (props.popupParam.plantCd) {
    searchParam.value.plantCd = props.popupParam.plantCd
  }
  if (props.popupParam.actionCompleteRequestDates) {
    searchParam.value.actionCompleteRequestDates = props.popupParam.actionCompleteRequestDates
  }
  if (props.popupParam.stepGubun) {
    searchParam.value.stepGubun = props.popupParam.stepGubun
  }
  if (isPop.value) searchParam.value.ibmClassCd = 'IC00000001' // 개선요청만
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
 * TODO (목적): 개선 상세
 *******************************/
function linkClick(row: any, num: number) {
  if ((num === 1 && row.ibmClassCd == 'IC00000001') || num === 2) {
    popupOptions.value.title = '개선 상세'
    popupOptions.value.isFull = true
    popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./imprDetail.vue`)))
  } else if ((num === 1 && row.ibmClassCd == 'IC00000005') || num === 3) {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./imprImmDetail.vue`))
    )
  }
  popupOptions.value.param = {
    sopImprovementId: num === 1 ? row.sopImprovementId : '',
    ibmTaskTypeCd: num === 1 ? row.ibmTaskTypeCd : 'ITT9999999',
    ibmTaskUnderTypeCd: num === 1 ? row.ibmTaskUnderTypeCd : 'ITTU000230'
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 개선 결과 보고서 출력
 *******************************/
function imprResultPrint() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: printUrl.value,
      method: 'POST',
      data: Object.values(selectData)
    }).then((_result: any) => {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
      link.download = '개선 결과 보고서_' + getToday() + '.xlsx'
      link.click()
      table.value.compoTable.clearSelection()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

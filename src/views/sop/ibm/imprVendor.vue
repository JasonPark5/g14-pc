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
            label="(기간)조치완료 요청일"
            name="actionCompleteRequestDates"
            v-model:value="searchParam.actionCompleteRequestDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="IBM_TASK_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ibmTaskTypeCd"
            label="업무"
            v-model:value="searchParam.ibmTaskTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            stepperGrpCd="IBM_STEP_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="ibmStepCd"
            label="진행단계"
            v-model:value="searchParam.ibmStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            label="요청부서"
            name="improveRequestDeptCd"
            v-model:value="searchParam.improveRequestDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            type="search"
            label="조치업체"
            :customPopupParam="{ targetKey: 'vendor' }"
            name="actionVendorCd"
            v-model:value="searchParam.actionVendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- 개선결과보고서 -->
          <c-btn
            :disabled="!grid.data || grid.data.length === 0"
            label="개선결과보고서"
            icon="print"
            @btnClicked="imprResultPrint"
          />
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addEtcImpr" />
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
import { imprType } from './impr'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprVendor'
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
  ibmStepCd: stringNull
  improveRequestDeptCd: stringNull
  actionVendorCd: stringNull
  actionFlag: stringNull
  overFlag: stringNull
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
  ibmStepCd: null,
  improveRequestDeptCd: '',
  actionVendorCd: '',
  actionFlag: 'V',
  overFlag: 'N'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'ibmTaskTypeName',
      field: 'ibmTaskTypeName',
      label: '업무',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:250px',
      sortable: true
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
      type: 'link',
      sortable: true
    },
    {
      name: 'actionCompleteRequestDate',
      field: 'actionCompleteRequestDate',
      label: '조치완료 요청일',
      align: 'center',
      style: 'width:170px',
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
      name: 'actionVendorName',
      field: 'actionVendorName',
      label: '조치업체',
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
  printUrl.value = selectConfig.sop.ibm.improve.print.url
  // code setting
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
 * TODO (목적): 개선 추가
 *******************************/
function addEtcImpr() {
  linkClick(null)
}
/******************************
 * TODO (목적): 개선 상세
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '개선 상세'
  popupOptions.value.param = {
    sopImprovementId: row ? row.sopImprovementId : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./imprDetail.vue`)))
  popupOptions.value.isFull = true
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
  $http({
    url: printUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm = $language('개선 결과 보고서') + '_' + getToday() + '.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

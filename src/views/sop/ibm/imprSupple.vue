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
            label="(기간)조치완료일"
            name="actionCompleteDates"
            v-model:value="searchParam.actionCompleteDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <c-checkbox
            :isFlag="true"
            falseLabel="All"
            label="보완"
            name="suppleFlag"
            v-model:value="searchParam.suppleFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            stepperGrpCd="IBM_SUPPLE_STEP_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="ibmSuppleStepCd"
            label="보완진행단계"
            v-model:value="searchParam.ibmSuppleStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            :isFirstValue="false"
            type="search"
            label="요청부서"
            name="improveRequestDeptCd"
            v-model:value="searchParam.improveRequestDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="보완부서"
            name="actionDeptCd"
            v-model:value="searchParam.actionDeptCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="개선 유효성평가 대상 목록"
      tableId="impr01"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
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
                props.row.ibmSuppleStepCd !== 'IS00000001' &&
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
  name: 'imprSupple'
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
  actionCompleteDates: arrayString | null
  ibmTaskTypeCd: stringNull
  ibmSuppleStepCd: stringNull
  improveRequestDeptCd: stringNull
  actionDeptCd: stringNull
  suppleFlag: stringNull
  actionFlag: stringNull
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
  actionCompleteDates: [],
  ibmTaskTypeCd: null,
  ibmSuppleStepCd: null,
  improveRequestDeptCd: '',
  actionDeptCd: '',
  suppleFlag: 'N',
  actionFlag: 'D'
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
      style: 'width:160px',
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
      type: 'link',
      sortable: true
    },
    {
      name: 'suppleFlagName',
      field: 'suppleFlagName',
      label: '적합/보완',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'ibmSuppleStepName',
      field: 'ibmSuppleStepName',
      label: '보완진행단계',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'improveRequestDeptName',
      field: 'improveRequestDeptName',
      label: '요청부서',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'suppleRequest',
      field: 'suppleRequest',
      label: '보완요청 내용',
      align: 'left',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'suppleScheduleDate',
      field: 'suppleScheduleDate',
      label: '보완완료 요청일',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '보완부서',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'suppleCompleteDate',
      field: 'suppleCompleteDate',
      label: '보완완료일',
      align: 'center',
      style: 'width:80px',
      sortable: true
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
  listUrl.value = selectConfig.sop.ibm.improve.supple.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 유효성평가 조회
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
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 개선 상세
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '개선 상세'
  popupOptions.value.isFull = true
  popupOptions.value.param = {
    sopImprovementId: row.sopImprovementId
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./imprDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="평가기간"
            name="evaluationDates"
            v-model:value="searchParam.evaluationDates"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            :isFirstValue="false"
            label="평가대상부서"
            name="evaluationTargetDept"
            v-model:value="searchParam.evaluationTargetDept"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-field
            label="작성자"
            name="evaluationUserId"
            v-model:value="searchParam.evaluationUserId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="모니터링 및 성과평가 목록"
      rowkey="evaluationId"
      :columns="grid.columns"
      :data="grid.data"
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
import { performanceEvaluationType } from './performanceEvaluationType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'performanceEvaluation'
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
interface gridType {
  columns: tableColumnType
  data: Array<performanceEvaluationType>
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
  evaluationDates: [],
  evaluationTargetDept: '',
  evaluationUserId: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:60px'
    },
    {
      name: 'evaluationDate',
      field: 'evaluationDate',
      label: '평가일자',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'evaluationName',
      field: 'evaluationName',
      label: '평가명',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width:300px'
    },
    {
      name: 'targetDeptNames',
      field: 'targetDeptNames',
      label: '평가대상부서',
      align: 'left',
      sortable: true,
      style: 'width:150px'
    },
    {
      name: 'evaluationStatusName',
      field: 'evaluationStatusName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:60px'
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      align: 'center',
      sortable: true,
      style: 'width:60px'
    },
    {
      name: 'evaluationUserName',
      field: 'evaluationUserName',
      label: '작성자',
      align: 'center',
      sortable: true,
      style: 'width:80px'
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
  listUrl.value = selectConfig.pe.evaluation.list.url
  // code setting
  // list setting
  getList()
}
const getList = () => {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
const linkClick = (row: object | any) => {
  popupOptions.value.title = '성과평가 상세'
  popupOptions.value.param = {
    evaluationId: row ? row.evaluationId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/test/pe/performanceEvaluationDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
const closePopup = () => {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style scoped></style>

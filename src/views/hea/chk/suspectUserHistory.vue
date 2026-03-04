<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          label="검진년도"
          default="today"
          type="year"
          name="year"
          v-model:value="searchParam.year"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-dept
          type="search"
          :isFirstValue="false"
          label="부서"
          name="deptCd"
          v-model:value="searchParam.deptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-field label="대상자" name="userId" v-model:value="searchParam.userId" />
      </div>
    </template>
  </c-search-box>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="유소견자 이력 목록"
        :columns="grid.columns"
        :data="grid.data"
        :merge="grid.merge"
        :columnSetting="false"
        @linkClick="linkClick"
      >
        <template v-slot:table-chip>
          <b class="text-electric q-ml-md"> 총 대상자 수 : {{ uniqueTargetCount }} </b>
        </template>
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
      </c-table>
    </div>
  </div>
  <c-dialog :param="popupOptions" />
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
import { suspectType } from './checkupType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'suspectUserHistory'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStore = useUserStore()
// const { user } = storeToRefs(userStore)
// const message = useMessageStore()

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
  merge: Array<{
    index: numberNull
    colName: stringNull
  }>
  columns: Array<tableColumnType>
  data: Array<suspectType>
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
const searchParam = ref({
  suspectFlag: 'Y',
  deptCd: null,
  userId: '',
  year: ''
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'deptCd' },
    { index: 1, colName: 'heaCheckupResultId' },
    { index: 2, colName: 'heaCheckupResultId' },
    { index: 3, colName: 'heaCheckupResultId' },
    { index: 4, colName: 'heaCheckupResultId' },
    { index: 5, colName: 'heaCheckupResultId' },
    { index: 6, colName: 'heaCheckupResultId' }
  ],
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '대상자',
      align: 'center',
      style: 'width:80px',
      type: 'link',
      sortable: false
    },
    {
      name: 'jobClassName',
      field: 'jobClassName',
      label: '직종',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'gender',
      field: 'gender',
      label: '성별',
      align: 'center',
      style: 'width: 40px',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'enterDate',
      field: 'enterDate',
      label: '입사일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'checkupDate',
      field: 'checkupDate',
      label: '검진일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'hazardName',
      field: 'hazardName',
      label: '취급물질',
      align: 'center',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'healthType',
      field: 'healthType',
      label: '판정',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkupOpinion',
      field: 'checkupOpinion',
      label: '소견',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    // {
    //   name: 'afterManage',
    //   field: 'afterManage',
    //   label: '조치',
    //   align: 'left',
    //   style: 'width:200px',
    //   sortable: false
    // },
    {
      name: 'suitableFlag',
      field: 'suitableFlag',
      label: '업무적합성',
      align: 'center',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'afterCare',
      field: 'afterCare',
      label: '사후관리',
      align: 'left',
      style: 'width:160px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const uniqueTargetCount = computed(() => {
  if (!grid.value.data) return 0
  return _.uniqBy(grid.value.data, 'userId').length
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
  listUrl.value = selectConfig.hea.checkup.opinion.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 유소견자 목록 조회
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
 * TODO (목적): 검진등록결과 중 선택한 검진자에 대한 상세검진결과 팝업표시
 *******************************/
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./checkUpResultDetail.vue`))
  )
  popupOptions.value.title = '건강진단 결과 상세 : ' + row.userName
  popupOptions.value.isFull = true
  popupOptions.value.param = { heaCheckupResultId: row ? row.heaCheckupResultId : '' }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
</script>

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            label="집행년도"
            name="year"
            type="year"
            default="today"
            v-model:value="searchParam.budgetYear"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            :editable="editable"
            label="부서"
            name="budgetDeptCd"
            :isFirstValue="false"
            v-model:value="searchParam.budgetDeptCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="예산실적 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'budgetCompare'
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
  data: Array<any>
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
const searchParam = ref<any>({
  plantCd: '',
  budgetStatusCd: 'BS00000005',
  budgetDeptCd: '',
  budgetYear: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'budgetYear',
      field: 'budgetYear',
      label: '집행년도',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'budgetItemName',
      field: 'budgetItemName',
      label: '항목',
      style: 'width:250px',
      align: 'left',
      sortable: true
    },
    {
      name: 'budgetPlanAmt',
      field: 'budgetPlanAmt',
      label: '예산편성금액(원)',
      style: 'width:150px',
      align: 'right',
      type: 'cost',
      sortable: true
    },
    {
      name: 'budgetResultAmt',
      field: 'budgetResultAmt',
      label: '예산집행금액(원)',
      style: 'width:150px',
      align: 'right',
      type: 'cost',
      sortable: true
    },
    {
      name: 'exchange',
      field: 'exchange',
      label: '잔액(A - B)',
      style: 'width:150px',
      align: 'right',
      type: 'cost',
      sortable: true
    },
    {
      name: 'exchangePercent',
      field: 'exchangePercent',
      label: '예산대비 비율(%)',
      style: 'width:150px',
      align: 'right',
      type: 'cost',
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
  listUrl.value = selectConfig.sai.budget.compare.list.url
  // code setting
  // searchParam.value.budgetYear = getThisYear()
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data.map((item: any) => ({
      ...item,
      budgetItemName: $language(item.budgetItemName)
    }))
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

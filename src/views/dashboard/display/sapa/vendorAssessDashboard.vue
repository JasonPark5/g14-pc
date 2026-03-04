<template>
  <div>
    <c-table
      ref="table"
      customClass="main-dashboard-table"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      :hideBottom="true"
      :isTop="false"
      gridHeight="220px"
    />
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
  name: 'vendorAssess'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
  plantCd: null,
  vendorCd: null,
  vendorEvaluationKindCd: null,
  evaluationGradeCd: null,
  evalTerms: [],
  sopConstructionId: ''
})
const grid = ref<gridType>({
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
      style: 'width:100px',
      align: 'left',
      sortable: true
    },
    {
      label: '평가점수',
      child: [
        {
          name: 'totalScore',
          field: 'totalScore',
          style: 'width:80px',
          label: '총점',
          align: 'center',
          sortable: true
        },
        {
          name: 'score',
          field: 'score',
          style: 'width:80px',
          label: '평점',
          align: 'center',
          sortable: true
        },
        {
          name: 'evaluationGradeName',
          field: 'evaluationGradeName',
          style: 'width:80px',
          label: '등급',
          align: 'center',
          sortable: true
        }
      ]
    }
  ],
  data: []
})
const editable = ref(true)
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
  listUrl.value = selectConfig.mdm.cim.vendor.evaluation.result.list.url
  // code setting
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

    grid.value.data = _.filter(grid.value.data, { evaluationGradeName: '불량' })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div style="width: 1000px; max-width: 1000px !important">
    <c-table
      ref="table"
      title="구매 전 검토 검토자 현황"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      :isExcelDown="false"
      :filtering="false"
      :columnSetting="false"
      :hideBottom="true"
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
  name: 'reviewStatusProxy'
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
interface propType {
  props: {
    row: any
  }
  col: tableColumnType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  props: () => {
    return {
      row: {}
    }
  },
  col: () => {}
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref({
  columns: [
    {
      name: 'mdmChemReviewClassName',
      field: 'mdmChemReviewClassName',
      label: '분야',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '검토자',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'mdmChemReviewResultName',
      field: 'mdmChemReviewResultName',
      label: '검토결과',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'reviewDt',
      field: 'reviewDt',
      label: '검토일시',
      align: 'center',
      style: 'width:150px',
      sortable: false
    }
  ],
  data: [],
  height: '350px'
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
  listUrl.value = selectConfig.mdm.mam.review.check.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemReviewId: props.props.row.mdmChemReviewId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

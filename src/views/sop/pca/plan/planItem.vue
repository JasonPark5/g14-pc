<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
      <c-table
        ref="table1"
        title="평가항목"
        :columnSetting="false"
        :isFullScreen="false"
        gridHeight="740px"
        :usePaging="false"
        :filtering="false"
        :columns="grid1.columns"
        :data="grid1.data"
        @rowClick="rowClick"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
      <c-table
        ref="table2"
        :title="`${selectedRow.itemMstName || ''} : 세부항목`"
        :columnSetting="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="false"
        gridHeight="740px"
        :merge="grid2.merge"
        :columns="grid2.columns"
        :data="grid2.data"
      />
    </div>
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
  name: 'planItem'
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

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      selfInspectionResultId: '',
      sysRevision: ''
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
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '평가항목',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  merge: [{ index: 0, colName: 'selfInspectionItemTypeId' }],
  columns: [
    {
      name: 'itemTypeName',
      field: 'itemTypeName',
      label: '구분',
      align: 'center',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: 'No.',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '세부항목',
      align: 'left',
      type: 'html',
      sortable: false
    }
  ],
  data: []
})
const list1Url = ref('')
const list2Url = ref('')
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const selectedRow = ref<any>({})

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
  // url setting
  list1Url.value = selectConfig.sop.pca.item.revs.url
  list2Url.value = selectConfig.sop.pca.items.mst.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: list1Url.value,
    method: 'GET',
    params: { sysRevision: props.popupParam.sysRevision }
  }).then((_result: any) => {
    grid1.value.data = _result.data
    if (grid1.value.data.length > 0) rowClick(grid1.value.data[0])
  })
}
/******************************
 * TODO (목적): 좌측 평가항목 클릭시 우측에 해당 세부항목 표시
 *******************************/
function rowClick(row: any) {
  selectedRow.value = row
  $http({
    url: list2Url.value,
    method: 'GET',
    params: { selfInspectionItemMstId: row.selfInspectionItemMstId }
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

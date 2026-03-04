<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        topBorderClass="topcolor-lightblue"
        ref="table1"
        title="평가항목별 감사결과"
        :columnSetting="false"
        :usePaging="false"
        :filtering="false"
        :columns="grid1.columns"
        :data="grid1.data"
        :merge="grid1.merge"
        :gridHeight="gridheight"
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
  name: 'resultReport'
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
      selfInspectionStatusCd: '',
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
  merge: [
    { index: 0, colName: 'itemMstName' },
    { index: 1, colName: 'itemTypeName' }
  ],
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '평가항목',
      align: 'left',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'itemTypeName',
      field: 'itemTypeName',
      label: '구분',
      align: 'left',
      style: 'width: 200px',
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
    },
    {
      name: 'selfInspectionResultName',
      field: 'selfInspectionResultName',
      label: '평가',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'selfInspectionRemark',
      field: 'selfInspectionRemark',
      label: '평가 근거',
      align: 'left',
      type: 'html',
      style: 'width: 350px',
      sortable: false
    },
    {
      name: 'answerUserName',
      field: 'answerUserName',
      label: '답변자',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const list1Url = ref('')
const gridheight = ref('')
const table1 = ref<any>(null)

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
  list1Url.value = selectConfig.sop.pca.item.revs.all
  // code setting
  gridheight.value = window.innerHeight - 190 + 'px'
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
    params: {
      sysRevision: props.popupParam.sysRevision,
      selfInspectionResultId: props.popupParam.selfInspectionResultId
    }
  }).then((_result: any) => {
    grid1.value.data = _result.data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="세부추진사항 기준정보"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      :editable="editable"
      :usePaging="false"
      :isExcelDown="false"
      :filtering="true"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="saiSafetyHealthyDetailId"
      @rowDblclick="rowDblclick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn label="검색" icon="search" @btnClicked="getList" /> -->
          <c-btn v-if="editable" label="선택" icon="check" @btnClicked="select" />
        </q-btn-group>
      </template>
    </c-table>
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
import { safetyHealthyTargetDetailType } from './safetyHealthyMst'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyHealthyMstPopup'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  columns: tableColumnType
  data: Array<safetyHealthyTargetDetailType>
  height: stringNull
  merge: Array<tableMergeType>
}
interface propType {
  popupParam: {
    type: stringNull
  }
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
      type: 'multiple'
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
// const searchParam = ref({
//   plantCd: null
// })
const listUrl = ref('')
const table = ref<any>(null)
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'plantCd' },
    { index: 1, colName: 'saiSafetyHealthyId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:130px',
      sortable: true
    },
    {
      name: 'targetName',
      field: 'targetName',
      label: '안전보건 목표',
      align: 'left',
      sortable: true
    },
    {
      name: 'detailName',
      field: 'detailName',
      label: '세부추진사항',
      align: 'left',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '해당부서',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'kpi',
      field: 'kpi',
      label: 'KPI성과지표',
      align: 'center',
      style: 'width:200px'
    },
    {
      name: 'kpiAttrName',
      field: 'kpiAttrName',
      label: '지표속성',
      align: 'center',
      style: 'width:100px'
    },
    {
      name: 'kpiDirectionName',
      field: 'kpiDirectionName',
      label: '지표방향',
      align: 'center',
      style: 'width:100px'
    }
  ],
  data: [],
  height: '600px'
})

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
  listUrl.value = selectConfig.sai.safetyHealthy.base.detail.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET'
    // params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '세부추진사항을 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): Row 더블클릭
 *******************************/
function rowDblclick(row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [row])
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

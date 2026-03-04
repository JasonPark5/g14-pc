<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            type="year"
            label="측정년도"
            name="srchYear"
            v-model:value="searchParam.srchYear"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-table
          ref="table1"
          title="측정일자 목록"
          :columns="leftGrid.columns"
          :data="leftGrid.data"
          :gridHeight="leftGrid.height"
          :isExcelDown="false"
          :isFullScreen="false"
          :columnSetting="false"
          :usePaging="false"
          :filtering="false"
          @rowClick="rowClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-table
          ref="table2"
          title="수질오염물질 측정내용"
          :columns="rightGrid.columns"
          :data="rightGrid.data"
          :gridHeight="rightGrid.height"
          :isExcelDown="false"
          :isFullScreen="false"
          :columnSetting="false"
          :usePaging="false"
        >
          <template v-slot:customArea="{ props }">
            <span
              v-if="
                props.row.legalStandard > 0 &&
                props.row.outflowCon !== 'ND' &&
                Number(props.row.outflowCon) > props.row.legalStandard
              "
              style="color: tomato"
            >
              {{ $language('초과') }}</span
            >
            <span v-else-if="props.row.outflowCon && props.row.legalStandard" class="text-grey-5">{{
              $language('이하')
            }}</span>
          </template>
        </c-table>
      </div>
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
  name: 'previousMeasurePop'
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
    dailyResultDt: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface searchParamType {
  srchYear?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    dailyResultDt: ''
  }),
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  srchYear: ''
})
const leftGrid = ref({
  columns: [
    {
      name: 'measureDate',
      field: 'measureDate',
      label: '측정일자',
      align: 'center',
      style: 'width:200px',
      sortable: true
    }
  ],
  height: '600px',
  data: []
})
const rightGrid = ref({
  columns: [
    {
      name: 'measureDt',
      field: 'measureDt',
      label: '측정일시',
      align: 'center',
      style: 'width: 110px'
    },
    {
      name: 'inspectItemIepsCd',
      field: 'inspectItemIepsCd',
      label: '오염물질코드',
      align: 'center',
      style: 'width: 50px',
      sortable: false
    },
    {
      name: 'envWaterMstInspectItemName',
      field: 'envWaterMstInspectItemName',
      label: '오염물질명',
      align: 'left',
      style: 'width: 150px',
      sortable: false
    },
    {
      name: 'waterInspectUnitName',
      field: 'waterInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'inflowExemptionName',
      field: 'inflowExemptionName',
      label: '유입수측정 면제구분',
      align: 'left',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'inflowNo',
      field: 'inflowNo',
      label: '유입시설번호',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'inflowCon',
      field: 'inflowCon',
      label: '유입수 농도(mg/l)',
      type: 'cost',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'outflowCon',
      field: 'outflowCon',
      label: '방류수 농도(mg/l)',
      type: 'cost',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'outflowValue',
      field: 'outflowValue',
      label: '방류량(㎥/일)',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '허가배출<br>기준',
      align: 'center',
      style: 'width: 60px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'exceedFlag',
      field: 'exceedFlag',
      label: '초과여부',
      align: 'center',
      style: 'width: 60px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'method',
      field: 'method',
      label: '검사방법(기기명)',
      align: 'left',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width: 100px',
      sortable: false
    }
  ],
  height: '600px',
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
  listUrl.value = selectConfig.env.ieps.water.self.measure.history.url
  // code setting
  searchParam.value.srchYear = props.popupParam.dailyResultDt.substring(0, 4)
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
    leftGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택 변경
 *******************************/
function rowClick(row?: any) {
  rightGrid.value.data = row.measureItems
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

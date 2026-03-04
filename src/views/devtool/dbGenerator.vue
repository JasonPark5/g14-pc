<template>
  <div>
    <c-search-box @enter="getTables">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="tableItems"
            type="edit"
            itemText="tableName"
            itemValue="tableId"
            name="table"
            label="대상테이블"
            v-model:value="searchParam.table"
            required
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="gtypeItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="gtype"
            label="Generate Type"
            v-model:value="searchParam.gtype"
            required
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            name="gtype"
            label="테이블 검색용(대상테이블 SELECT 바뀜)"
            v-model:value="searchParam.tableId"
            @dataChange="getTables"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="Generate Result" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="GeneratorTable" />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-12 generator-div" v-html="resultGenerate" id="resultGen" />
          </template>
        </c-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import $format from 'string-format'

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
  name: 'dbGenerator'
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
interface searchParamType {
  table: string
  gtype: string
  tableId: stringNull
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
const resultGenerate = ref<any>('')
const tableItems = ref<any>([])
const searchParam = ref<searchParamType>({
  table: '',
  gtype: '',
  tableId: ''
})
const gtypeItems = ref<Array<codeMasterType>>([
  { code: 'class', codeName: 'model class' },
  { code: 'select', codeName: 'select query' },
  { code: 'insert', codeName: 'insert query' },
  { code: 'update', codeName: 'update query' },
  { code: 'jsongridhead', codeName: 'json-그리드헤더' },
  { code: 'jsondata', codeName: 'json-Data결과수신' },
  { code: 'jsondatacomment', codeName: 'json-Data결과수신(주석포함)' },
  {
    code: 'vueThreeGridHeader',
    codeName: 'VUE3 공통팝업 테이블 컬럼 포맷'
  },
  {
    code: 'typescriptcomment',
    codeName: 'TypeScript 파일포맷(주석포함)'
  }
])
const editable = ref(true)
const route = useRoute()

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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function init() {
  editable.value = Boolean(route.meta.editable)
  getTables()
}

function getTables() {
  $http({
    url: selectConfig.devtool.dbtables.url,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      tableItems.value = _result.data
    }
  })
}
function GeneratorTable() {
  $http({
    url: $format(
      selectConfig.devtool.dbtable.url,
      searchParam.value.table,
      searchParam.value.gtype
    ),
    method: 'GET'
  }).then((_result: any) => {
    resultGenerate.value = _result.data.resultStr
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

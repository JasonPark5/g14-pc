<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            label="시작기간"
            name="period"
            defaultStart="-6M"
            defaultEnd="6M"
            v-model:value="period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="batchItems"
            type="search"
            itemText="batchName"
            itemValue="batchClassName"
            label="배치"
            name="batchClassName"
            v-model:value="searchParam.batchClassName"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="배치로그 이력"
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
  name: 'batchLog'
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
interface searchParamType {
  startYmd: stringNull
  endYmd: stringNull
  batchClassName?: stringNull
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
const searchParam = ref<searchParamType>({
  startYmd: '',
  endYmd: '',
  batchClassName: ''
})
const period = ref<any>([])
const grid = ref({
  columns: [
    {
      name: 'batchName',
      field: 'batchName',
      label: '배치명',
      style: 'width: 130px',
      align: 'center',
      sortable: true
    },
    {
      name: 'successYn',
      field: 'successYn',
      label: '성공여부',
      align: 'center',
      style: 'width: 70px',
      sortable: true
    },
    {
      name: 'resultCnt',
      field: 'resultCnt',
      label: '성공 Count',
      style: 'width: 70px',
      align: 'center',
      type: 'cost',
      sortable: true
    },
    {
      name: 'exceptions',
      field: 'exceptions',
      label: '오류내용',
      // style: 'width: 250px',
      align: 'left',
      sortable: true
    },
    {
      name: 'startDt',
      field: 'startDt',
      label: '시작일시',
      style: 'width: 160px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const consultUrl = ref('')
const batchItems = ref([])
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
  consultUrl.value = selectConfig.sys.log.batch.list.url
  // code setting
  // list setting
  $http({
    url: selectConfig.sys.batch.list.url,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    batchItems.value = _result.data
  })
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: consultUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

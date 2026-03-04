<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'safetyGear' }"
            :plantCd="searchParam.plantCd"
            label="보호구"
            name="safetyGearName"
            v-model:value="searchParam.safetyGearName"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="보호구 재고현황"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'recepitCount'">
          <span style="color: lightseagreen">{{ '+' + props.row[col.name] }}</span>
        </template>
        <template v-if="col.name === 'deliverCount'">
          <span style="color: tomato">{{ '-' + props.row[col.name] }}</span>
        </template>
        <template v-if="col.name === 'stockCount'">
          <span v-if="props.row[col.name] < 0" style="color: tomato">{{
            props.row[col.name]
          }}</span>
          <span v-else style="color: lightseagreen">{{ '+' + props.row[col.name] }}</span>
        </template>
        <template v-if="col.name === 'realCount'">
          <span v-if="props.row[col.name] < 0" style="color: tomato">{{
            props.row[col.name]
          }}</span>
          <span v-else style="color: lightseagreen">{{ '+' + props.row[col.name] }}</span>
        </template>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyGearStockStatus'
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
  columns?: Array<tableColumnType>
  data?: Array<object>
  height?: stringNull
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
const searchParam = ref({
  plantCd: null,
  safetyGearId: '',
  safetyGearName: '',
  startYmd: '',
  endYmd: ''
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'plantCd' },
    { index: 1, colName: 'safetyTypeName' }
  ],
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
      name: 'safetyTypeName',
      field: 'safetyTypeName',
      label: '보호구종류',
      style: 'width:140px',
      align: 'center',
      sortable: true
    },
    {
      name: 'safetyGearName',
      field: 'safetyGearName',
      label: '보호구',
      style: 'width:220px',
      align: 'left',
      sortable: true
    },
    // {
    //   name: 'supplyVendorName',
    //   field: 'supplyVendorName',
    //   label: '공급업체',
    //   style: 'width:110px',
    //   align: 'center',
    //   sortable: true,
    // },
    // {
    //   name: 'totalPrice',
    //   field: 'totalPrice',
    //   label: '총 입고량 단가(원)',
    //   style: 'width:110px',
    //   type: 'cost',
    //   align: 'right',
    //   sortable: true,
    // },
    {
      name: 'recepitCount',
      field: 'recepitCount',
      label: '입고량',
      style: 'width:120px',
      type: 'custom',
      align: 'right',
      sortable: true
    },
    {
      name: 'deliverCount',
      field: 'deliverCount',
      label: '출고량',
      style: 'width:120px',
      type: 'custom',
      align: 'right',
      sortable: true
    },
    {
      name: 'stockCount',
      field: 'stockCount',
      label: '재고량',
      style: 'width:120px',
      type: 'custom',
      align: 'right',
      sortable: true,
      fix: true
    },
    {
      name: 'mediateCount',
      field: 'mediateCount',
      label: '조정량',
      style: 'width:120px',
      align: 'right',
      sortable: true
    },
    {
      name: 'realCount',
      field: 'realCount',
      label: '실사 (현재 + 조정)',
      style: 'width:120px',
      align: 'right',
      type: 'custom',
      sortable: true
    },
    {
      name: 'unitName',
      field: 'unitName',
      label: '단위',
      align: 'center',
      style: 'width:70px',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      sortable: true
    }
    // {
    //   name: 'totalPrice',
    //   field: 'totalPrice',
    //   label: '단가(원)',
    //   style: 'width:120px',
    //   type: 'cost',
    //   align: 'right',
    //   sortable: true,
    // },
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const period = ref<Array<stringNull>>([])
const typeItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.sop.sas.stock.status.url
  // code setting
  typeItems.value = [
    { code: 'Y', codeName: $language('전체') },
    { code: 'N', codeName: $language('일별') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
    url: listUrl.value,
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

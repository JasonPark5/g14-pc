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
      title="통합환경허가시설(방지시설)"
      tableId="processManual"
      :merge="grid.merge"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
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
  name: 'envPreventionManage'
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
// const searchParam = ref({
//   plantCd: null
// })
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'col1' },
    { index: 1, colName: 'col2' },
    { index: 3, colName: 'col2' },
    { index: 4, colName: 'col2' },
    { index: 6, colName: 'col1' },
    { index: 7, colName: 'col1' },
    { index: 9, colName: 'col1' },
    { index: 10, colName: 'col1' },
    { index: 11, colName: 'col1' },
    { index: 12, colName: 'col1' }
  ],
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: false,
    // },
    {
      name: 'col1',
      field: 'col1',
      label: '관리번호',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'col2',
      field: 'col2',
      label: '공정번호',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'col3',
      field: 'col3',
      label: '시설번호',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col4',
      field: 'col4',
      label: '시설명',
      align: 'left',
      type: 'link',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'col5',
      field: 'col5',
      label: '용량',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col6',
      field: 'col6',
      label: '처리오염물질 등',
      style: 'width: 220px',
      align: 'left',
      sortable: false
    },
    {
      name: 'col7',
      field: 'col7',
      label: '운전인자',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col8',
      field: 'col8',
      label: '설치지점',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'col9',
      field: 'col9',
      label: '배출(방류)구 번호',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'col10',
      field: 'col10',
      label: '변경사항',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col11',
      field: 'col11',
      label: '법적대상여부',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col12',
      field: 'col12',
      label: 'P&ID No.',
      align: 'left',
      sortable: false
    },
    {
      name: 'col13',
      field: 'col13',
      label: '비고',
      style: 'width: 80px',
      align: 'center',
      sortable: false
    }
  ],
  data: [
    {
      plantName: '사업장1',
      col1: 'C-PU02201',
      col2: 'PU-02-02',
      col3: 'AT-1',
      col4: '흡수에 의한 시설 D-633(HCI SCRUBBER)',
      col5: '4 ㎥/분',
      col6: '처리물질 : 염화수소',
      col7: '유량',
      col8: '순수(WDM) 생산공정',
      col9: '#A1',
      col10: '기존',
      col11: '대상',
      col12: 'EFD-PACKAGE-WPM,WDM,UPW03/4',
      col13: ''
    },
    {
      plantName: '사업장1',
      col1: 'C-PU02201',
      col2: 'PU-02-02',
      col3: 'W-13',
      col4: '흡수에 의한 시설 D-633(HCI SCRUBBER)',
      col5: '4 ㎥/분',
      col6: '발생물질 : 생화학적 산소유구량 외 55종',
      col7: '유량',
      col8: '순수(WDM) 생산공정',
      col9: '#W1',
      col10: '기존',
      col11: '대상',
      col12: 'EFD-PACKAGE-WPM,WDM,UPW03/4',
      col13: ''
    },
    {
      plantName: '사업장1',
      col1: 'C-PU01101',
      col2: 'PU-01-01',
      col3: 'AT-2',
      col4: '흡수에 의한 시설 D-101(POLYMERIZATION PROCESS GAS SCRUBBER)',
      col5: '53 ㎥/분',
      col6: '처리물질 : 스틸렌,탄화수소,황산화물,먼지,일산화탄소,암모니아,황화수소,염화수소,염소,불소화합물,시안화수소,페놀화합물',
      col7: '유량',
      col8: 'monomer조정공정',
      col9: '#A1',
      col10: '기존',
      col11: '대상',
      col12: 'EFD-POLYMERIZATION-POL SCRUBBER-1/1',
      col13: ''
    },
    {
      plantName: '사업장1',
      col1: 'C-PU01101',
      col2: 'PU-01-01',
      col3: 'W-59',
      col4: '흡수에 의한 시설 D-101(POLYMERIZATION PROCESS GAS SCRUBBER)',
      col5: '53 ㎥/분',
      col6: '발생물질 : 생화학적 산소요구량 외 55종',
      col7: '유량',
      col8: 'monomer조정공정',
      col9: '#W1',
      col10: '기존',
      col11: '대상',
      col12: 'EFD-POLYMERIZATION-POL SCRUBBER-1/1',
      col13: ''
    },
    {
      plantName: '사업장1',
      col1: 'C-PU02101',
      col2: 'PU-02-01',
      col3: 'AT-3',
      col4: '흡수에 의한 시설 D-201(PACKAGE SCRUBBER)',
      col5: '60 ㎥/분',
      col6: '처리물질 : 탄화수소,황산화물,먼지,암모니아,니켈화합물,납화합물,아연화합물,시안화수소',
      col7: '유량',
      col8: 'NB팽윤공정',
      col9: '#A1',
      col10: '기존',
      col11: '대상',
      col12: 'EFD-PACKAGE-SCRUBBER K-FILTER-1/1',
      col13: ''
    },
    {
      plantName: '사업장1',
      col1: 'C-PU02101',
      col2: 'PU-02-01',
      col3: 'W-62',
      col4: '흡수에 의한 시설 D-201(PACKAGE SCRUBBER)',
      col5: '60 ㎥/분',
      col6: '발생물질 : 생화학적 산소요구량 외 55종',
      col7: '유량',
      col8: 'NB팽윤공정',
      col9: '#W1',
      col10: '기존',
      col11: '대상',
      col12: 'EFD-PACKAGE-SCRUBBER K-FILTER-1/1',
      col13: ''
    }
  ]
})
const editable = ref(true)
// const listUrl = ref('')

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
  // code setting
  // list setting
  // getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  //   $http({
  //     url: listUrl.value,
  //     method: 'GET',
  //     params: searchParam.value
  //   }).then((_result: any) => {
  //     grid.value.data = _result.data
  //   })
  console.log(grid.value.data)
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick() {
  popupOptions.value.title = '통합환경허가시설 (방지시설 상세)'
  popupOptions.value.param = {}
  // popupOptions.value.target = shallowRef(
  //   defineAsyncComponent(() => import(`./dischargeFacDetail.vue`))
  // )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

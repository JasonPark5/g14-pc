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
      title="통합환경허가시설(배출시설)"
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
  name: 'envDischargeManage'
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
    { index: 1, colName: 'col1' },
    { index: 2, colName: 'col3' },
    { index: 3, colName: 'col4' },
    { index: 4, colName: 'col3' },
    { index: 5, colName: 'col3' },
    { index: 7, colName: 'col1' },
    { index: 8, colName: 'col1' },
    { index: 9, colName: 'col10' },
    { index: 10, colName: 'col1' },
    { index: 12, colName: 'col1' },
    { index: 13, colName: 'col1' },
    { index: 14, colName: 'col1' }
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
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col2',
      field: 'col2',
      label: '공정번호',
      align: 'center',
      style: 'width: 80px',
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
      name: 'col0',
      field: 'col0',
      label: '배출오염물질 등',
      child: [
        {
          name: 'col6',
          field: 'col6',
          label: '인허가 항목',
          align: 'center',
          style: 'width: 80px',
          sortable: false
        },
        {
          name: 'col7',
          field: 'col7',
          label: '오염물질',
          align: 'center',
          style: 'width: 120px',
          sortable: false
        }
      ]
    },
    {
      name: 'col8',
      field: 'col8',
      label: '운전인자',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col9',
      field: 'col9',
      label: '설치지점',
      align: 'left',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'col10',
      field: 'col10',
      label: '배출(방류)구 번호',
      align: 'left',
      style: 'width: 150px',
      sortable: false
    },
    {
      name: 'col11',
      field: 'col11',
      label: '변경사항',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col12',
      field: 'col12',
      label: '법적대상여부',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col13',
      field: 'col13',
      label: 'P&ID No.',
      align: 'left',
      style: 'width: 180px',
      sortable: false
    },
    {
      name: 'col14',
      field: 'col14',
      label: '주요시설여부',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'col15',
      field: 'col15',
      label: '비고',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    }
  ],
  data: [
    {
      plantName: '사업장1',
      col1: 'I-PP01101',
      col2: 'P-01-01',
      col3: 'A-15',
      col4: '저장시설 T-100A(DMDS TANK)',
      col5: '0.2㎥',
      col6: '대기',
      col7: '이황화메틸',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1, PSV(PSV110A02)',
      col11: '기존',
      col12: '대상',
      col13: 'EFD-POLYMERIZATION-1A/2',
      col14: '',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01102',
      col2: 'P-01-01',
      col3: 'A-16',
      col4: '저장시설 T-100B(DMDS TANK)',
      col5: '0.2㎥',
      col6: '대기',
      col7: '이황화메틸',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1, PSV(PSV110B02)',
      col11: '기존',
      col12: '대상',
      col13: 'EFD-POLYMERIZATION-1B/2',
      col14: '',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01103',
      col2: 'P-01-01',
      col3: 'A-17',
      col4: '저장시설 T-100C(DMDS TANK)',
      col5: '0.2㎥',
      col6: '대기',
      col7: '이황화메틸',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1, PSV(PSV110C02)',
      col11: '기존',
      col12: '대상',
      col13: 'EFD-POLYMERIZATION-1C/2',
      col14: '',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01101',
      col2: 'P-01-01',
      col3: 'A-18',
      col4: '저장시설 T-110A(MONOMER MIXING VESSEL)',
      col5: '9.5㎥',
      col6: '대기',
      col7: '스틸렌',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1',
      col11: '기존',
      col12: '대상',
      col13: 'EFD-POLYMERIZATION-1A/2',
      col14: 'O',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01101',
      col2: 'P-01-01',
      col3: 'A-18',
      col4: '저장시설 T-110A(MONOMER MIXING VESSEL)',
      col5: '9.5㎥',
      col6: '대기',
      col7: '탄화수소',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1',
      col11: '기존',
      col12: '대상',
      col13: 'EFD-POLYMERIZATION-1A/2',
      col14: 'O',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01101',
      col2: 'P-01-01',
      col3: 'Ff-12',
      col4: '저장시설 T-110A(MONOMER MIXING VESSEL)',
      col5: '9.5㎥',
      col6: '비산배출',
      col7: '스틸렌',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1',
      col11: '기존',
      col12: '대상',
      col13: 'EFD-POLYMERIZATION-1A/2',
      col14: 'O',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01101',
      col2: 'P-01-01',
      col3: 'O-13',
      col4: '저장시설 T-110A(MONOMER MIXING VESSEL)',
      col5: '9.5㎥',
      col6: '악취',
      col7: '복합악취',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1',
      col11: '기존',
      col12: '비대상',
      col13: 'EFD-POLYMERIZATION-1A/2',
      col14: 'O',
      col15: ''
    },
    {
      plantName: '사업장1',
      col1: 'I-PP01101',
      col2: 'P-01-01',
      col3: 'O-13',
      col4: '저장시설 T-110A(MONOMER MIXING VESSEL)',
      col5: '9.5㎥',
      col6: '악취',
      col7: '스타이렌',
      col8: '압력',
      col9: 'monomer 조정공정',
      col10: '#A1',
      col11: '기존',
      col12: '비대상',
      col13: 'EFD-POLYMERIZATION-1A/2',
      col14: 'O',
      col15: ''
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
  popupOptions.value.title = '통합환경허가시설 (배출시설 상세)'
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

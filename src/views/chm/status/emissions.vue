<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            default="today"
            type="year"
            label="년도"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="배출량 조사표"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:table-chip>
        <q-chip outline square icon="info" color="primary" size="0.9em" style="font-weight: 500"
          >{{ $language('PRTR Ⅰ 그룹') }}
          <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
            <c-table
              dense
              hideBottom
              :usePaging="false"
              :isExcelDown="false"
              :columnSetting="false"
              :isFullScreen="false"
              gridHeightAuto
              class="prtr"
              title="PRTR Ⅰ 그룹 : 취급량 1톤 이상, 배출량 1kg 이상이면 신고 필요한 독성이 강한 고위험 물질"
              :columns="prtrColumns"
              :data="prtr1rows"
              rowKey="casNo"
            />
          </q-menu>
        </q-chip>
        <q-chip outline square icon="info" color="primary" size="0.9em" style="font-weight: 500"
          >{{ $language('PRTR Ⅱ 그룹') }}
          <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
            <c-table
              dense
              :isExcelDown="false"
              :columnSetting="false"
              :isFullScreen="false"
              gridHeightAuto
              class="prtr"
              title="PRTR Ⅱ 그룹 : 취급량 10톤 이상이고, 배출량이 대기 10kg 이상, 수질 5kg 이상이면 신고 필요한 일반 유해물질"
              :columns="prtrColumns"
              :data="prtr2rows"
              rowKey="casNo"
            />
          </q-menu>
        </q-chip>
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
  name: 'emissions'
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const prtr2Url = ref('')
const searchParam = ref({
  plantCd: null,
  year: Number(getThisYear()) - 1 + ''
})
const grid = ref({
  merge: [
    { index: 0, colName: 'gubun' },
    { index: 1, colName: 'mdmChemId' },
    { index: 2, colName: 'mdmChemId' },
    { index: 3, colName: 'mdmChemId' },
    { index: 4, colName: 'mdmChemId' },
    { index: 5, colName: 'mdmChemId' },
    { index: 6, colName: 'mdmChemId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'gubun',
      field: 'gubun',
      description: 'description',
      label: '구분',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질',
      type: 'link',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },

    {
      name: 'chemOutAmount',
      field: 'chemOutAmount',
      label: '연간 사용량(kg/년)',
      align: 'right',
      style: 'width:80px',
      sortable: false,
      type: 'cost'
    },
    // {
    //   name: 'throughput',
    //   field: 'throughput',
    //   label: '취급량',
    //   align: 'center',
    //   child: [
    //     {
    //       name: 'chemOutAmount0',
    //       field: 'chemOutAmount0',
    //       label: '생산량(kg/년)',
    //       align: 'right',
    //       style: 'width:80px',
    //       sortable: false,
    //       type: 'cost'
    //     },
    //   ]
    // },
    {
      label: '조사대상범위 (정량값)',
      align: 'center',
      child: [
        {
          name: 'prtrSwcsWtQuantity',
          field: 'prtrSwcsWtQuantity',
          label: '함유량(%)',
          align: 'center',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'prtrSwcsTonQuantity',
          field: 'prtrSwcsTonQuantity',
          label: '취급량(톤/년)',
          align: 'center',
          style: 'width:80px',
          sortable: false
        }
      ]
    },

    {
      name: 'chemprod',
      field: 'chemprod',
      label: '사용제품',
      align: 'center',
      child: [
        {
          name: 'materialName',
          field: 'materialName',
          label: '화학자재',
          type: 'link',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'materialCd',
          field: 'materialCd',
          label: '화학자재번호',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'vendorName',
          field: 'vendorName',
          label: '공급업체',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'outAmount',
          field: 'outAmount',
          label: '연간 사용량(kg/년)',
          align: 'right',
          style: 'width:80px',
          sortable: false,
          type: 'cost'
        }
      ]
    }
  ],
  data: []
})
const listUrl = ref('')
const prtr1rows = ref([
  {
    no: '1',
    casNo: '000050-00-0',
    krName: '포름알데히드',
    enName: 'Formaldehyde',
    rate: '0.1 이상'
  },
  {
    no: '2',
    casNo: '000056-53-1',
    krName: '디에틸스틸베스테롤',
    enName: 'Diethylstilbesterol',
    rate: '0.1 이상'
  },
  {
    no: '3',
    casNo: '000071-43-2',
    krName: '벤젠',
    enName: 'Benzene',
    rate: '0.1 이상'
  },
  {
    no: '4',
    casNo: '000075-01-4',
    krName: '염화 비닐',
    enName: 'Vinyl chloride',
    rate: '0.1 이상'
  },
  {
    no: '5',
    casNo: '000075-21-8',
    krName: '산화 에틸렌',
    enName: 'Ethylene oxide',
    rate: '0.1 이상'
  },
  {
    no: '6',
    casNo: '000079-01-6',
    krName: '트리클로로에틸렌',
    enName: 'Trichloroethylene',
    rate: '0.1 이상'
  },
  {
    no: '7',
    casNo: '000095-53-4',
    krName: 'o-톨루이딘',
    enName: 'o-Toluidine',
    rate: '0.1 이상'
  },
  {
    no: '8',
    casNo: '000101-14-4',
    krName: `3,3'-디클로로-4,4'-디아미노디페닐 메탄`,
    enName: `3,3'-Dichloro-4,4'-diaminodiphenylmethane`,
    rate: '0.1 이상'
  },
  {
    no: '9',
    casNo: '000106-99-0',
    krName: `1,3-부타디엔`,
    enName: `1,3-Butadiene`,
    rate: '0.1 이상'
  },
  {
    no: '10',
    casNo: '000107-30-2',
    krName: `클로로메틸 메틸 에테르`,
    enName: `Chloromethyl methyl ether`,
    rate: '0.1 이상'
  },
  {
    no: '11',
    casNo: '000193-39-5',
    krName: `인데노[1,2,3-cd]피렌`,
    enName: `Indeno[1,2,3-cd]pyrene`,
    rate: '0.1 이상'
  },
  {
    no: '12',
    casNo: '000298-81-7',
    krName: `8-메톡시-6,7-푸라노쿠마린`,
    enName: `8-Methoxy-6,7-furanocoumarin`,
    rate: '0.1 이상'
  },
  {
    no: '13',
    casNo: '001332-21-4',
    krName: `석면`,
    enName: `Asbestos`,
    rate: '0.1 이상'
  },
  {
    no: '14',
    casNo: 'NA-(주1)',
    krName: `납 및 그 화합물`,
    enName: `Lead and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '15',
    casNo: 'NA-(주2)',
    krName: `수은 및 그 화합물`,
    enName: `Mercury and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '16',
    casNo: 'NA-(주3)',
    krName: `니켈 및 그 화합물`,
    enName: `Nickel and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '17',
    casNo: 'NA-(주4)',
    krName: `비소 및 그 화합물`,
    enName: `Arsenic and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '18',
    casNo: 'NA-(주5)',
    krName: `베릴륨 및 그 화합물`,
    enName: `Beryllium and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '19',
    casNo: 'NA-(주6)',
    krName: `카드뮴 및 그 화합물`,
    enName: `Cadmium and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '20',
    casNo: 'NA-(주7)',
    krName: `크롬 및 그 화합물`,
    enName: `Chromium and its compounds`,
    rate: '0.1 이상'
  }
])
const prtr2rows = ref([])
const prtrColumns = ref([
  {
    name: 'no',
    field: 'no',
    label: '번호',
    align: 'center'
  },
  {
    name: 'casNo',
    field: 'casNo',
    label: 'CAS No.',
    align: 'center',
    style: 'width: 160px'
  },
  {
    name: 'krName',
    field: 'krName',
    label: '품명(국문명)',
    align: 'left'
  },
  {
    name: 'enName',
    field: 'enName',
    label: '품명(영문명)',
    align: 'left'
  },
  {
    name: 'rate',
    field: 'rate',
    label: '무게함유율(%)',
    align: 'center'
  }
])

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
  listUrl.value = selectConfig.chm.inout.emissions.url
  prtr2Url.value = selectConfig.chm.inout.emissions.prtr2.url
  // code setting
  // list setting
  getPrtr2()
  getList()
}
/******************************
 * TODO (목적): PRTR2 조회
 *******************************/
function getPrtr2() {
  $http({
    url: prtr2Url.value,
    method: 'GET'
  }).then((_result: any) => {
    prtr2rows.value = _result.data
  })
}
/******************************
 * TODO (목적): 시설 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 구성물질 링크 클릭 시 팝업 표시
 *******************************/
function linkClick(row?: any, col?: any) {
  if (col.name === 'materialName') {
    popupOptions.value.title = '화학자재 상세'
    popupOptions.value.param = {
      mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
      plantCd: row ? row.plantCd : '',
      tabName: 'chemMsds'
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/mdm/mam/chemDetail.vue`))
    )
  } else if (col.name === 'chemNmEn') {
    popupOptions.value.title = '화학물질 상세'
    popupOptions.value.param = {
      mdmChemId: row ? row.mdmChemId : ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/mdm/mam/chem/chemBaseDetail.vue`))
    )
  }
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.prtr
  .q-table__title
    color: tomato
</style>

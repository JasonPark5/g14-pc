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
      title="통계조사표"
      :columns="grid.columns"
      :data="grid.data"
      :editable="false"
    >
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
  name: 'statistics'
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
const searchParam = ref({
  plantCd: null,
  year: getThisYear()
})
const grid = ref({
  columns: [
    {
      fix: true,
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      fix: true,
      name: 'materialName',
      field: 'materialName',
      label: '화학자재',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      fix: true,
      name: 'materialCd',
      field: 'materialCd',
      label: '화학자재번호',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'productCategoryName',
      field: 'productCategoryName',
      label: '제품구분',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'mixName',
      field: 'mixName',
      label: '물질구성',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'propertiesStateName',
      field: 'propertiesStateName',
      label: '성상',
      align: 'center',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'usageName',
      field: 'usageName',
      label: '용도',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'productManufClassName',
      field: 'productManufClassName',
      label: '제품제조구분',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'chemIngredientsName',
      field: 'chemIngredientsName',
      label: '구성성분<br/>작성근거',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'keepFacilityFlag',
      field: 'keepFacilityFlag',
      label: '보관시설<br/>(창고) 유무',
      type: 'check',
      true: 'Y',
      false: 'N',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'maxKeepAmount',
      field: 'maxKeepAmount',
      label: '최대보관량(t)',
      align: 'right',
      style: 'width:90px',
      sortable: false,
      type: 'cost'
    },
    {
      name: 'storageFacilityFlag',
      field: 'storageFacilityFlag',
      label: '저장시설<br/>(탱크) 유무',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'maxStorageAmount',
      field: 'maxStorageAmount',
      label: '최대저장량(t)',
      align: 'right',
      style: 'width:90px',
      sortable: false,
      type: 'cost'
    },
    {
      name: 'manufacturingFacilitiesFlag',
      field: 'manufacturingFacilitiesFlag',
      label: '제조·사용시설 여부',
      type: 'check',
      true: 'Y',
      false: 'N',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'nanoFlag',
      field: 'nanoFlag',
      label: '나노물질 포함여부',
      align: 'center',
      helpcomment: `※ “나노물질”이란 다음 각 목의 어느 하나에 해당하는 물질을 말함
            <div class="q-ml-md">가. 3차원의 외형치수 중 최소 1차원의 크기가 1나노미터에서 100나노미터인 입자의 개수가 50퍼센트 이상 분포하는 물질</div>
            <div class="q-ml-md">나. 3차원의 외형치수 중 최소 1차원의 크기가 1나노미터 이하인 풀러렌(fullerene), 그래핀 플레이크(graphene flake) 또는 단일벽 탄소나노튜브</div><br/>
          ※ 나노물질 포함여부 : <div class="q-ml-md">제조 (국내에서 의도적으로 나노물질을 제조한 경우)</div> 
          <div class="q-ml-md">수입 (라벨링 등에 나노물질임을 명시한 물질을 수입한 경우)</div> 
          <div class="q-ml-md">해당없음 (나노물질이 포함되지 않은 경우)</div> 
          <div class="q-ml-md">모름 (나노물질 포함여부를 알 수 없는 경우)</div></br>`,
      child: [
        {
          name: 'nanoManufacturingFlag',
          field: 'nanoManufacturingFlag',
          label: '제조',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:60px',
          helpcomment: '',
          sortable: false
        },
        {
          name: 'nanoIncomeFlag',
          field: 'nanoIncomeFlag',
          label: '수입',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:60px',
          sortable: false
        },
        {
          name: 'nanoNoneApplicableFlag',
          field: 'nanoNoneApplicableFlag',
          label: '해당없음',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:60px',
          sortable: false
        },
        {
          name: 'nanoUnknownFlag',
          field: 'nanoUnknownFlag',
          label: '모름',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:60px',
          sortable: false
        }
      ]
    },
    {
      name: 'unit',
      field: 'unit',
      label: '입출고단위',
      align: 'center',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'inYear',
      field: 'inYear',
      label: '입고량(kg/년)',
      align: 'center',
      child: [
        {
          name: 'in1',
          field: 'in1',
          label: '제조',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'in2',
          field: 'in2',
          label: '수입',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'in3',
          field: 'in3',
          label: '구매',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'carryover',
          field: 'carryover',
          label: '이월',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'inSum',
          field: 'inSum',
          label: '합계',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        }
      ]
    },
    {
      name: 'outYear',
      field: 'outYear',
      label: '출고량(kg/년)',
      align: 'center',
      child: [
        {
          name: 'out1',
          field: 'out1',
          label: '사용',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'out2',
          field: 'out2',
          label: '판매',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'out3',
          field: 'out3',
          label: '수출',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'inventory',
          field: 'inventory',
          label: '재고',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'out4',
          field: 'out4',
          label: '손실/폐기',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'outSum',
          field: 'outSum',
          label: '합계',
          align: 'right',
          style: 'width:60px',
          sortable: false,
          type: 'cost'
        }
      ]
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '공급업체',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
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
  listUrl.value = selectConfig.chm.inout.statistics.url
  // code setting
  // list setting
  getList()
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

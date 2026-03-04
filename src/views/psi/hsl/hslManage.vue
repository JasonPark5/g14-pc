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
      title="유해위험물질 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <!-- <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template> -->
      <template v-slot:table-chip>
        <q-chip outline square icon="info" color="primary" size="0.9em" style="font-weight: 500"
          >{{ $language('PSM 대상물질 (51종)') }}
          <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
            <c-table
              dense
              :isExcelDown="false"
              :columnSetting="false"
              :isFullScreen="false"
              :usePaging="false"
              :isTitle="false"
              gridHeightAuto
              class="prtr"
              :columns="psmColumns"
              :data="psmRows"
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
  name: 'hslManage'
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

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  // plantCd: null,
  delFlag: 'N'
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'plantName' },
    { index: 1, colName: 'mdmChemMaterialName' },
    { index: 5, colName: 'mdmChemMaterialName' },
    { index: 6, colName: 'mdmChemMaterialName' },
    { index: 7, colName: 'mdmChemMaterialName' },
    { index: 8, colName: 'mdmChemMaterialName' },
    { index: 9, colName: 'mdmChemMaterialName' },
    { index: 10, colName: 'mdmChemMaterialName' },
    { index: 11, colName: 'mdmChemMaterialName' },
    { index: 12, colName: 'mdmChemMaterialName' },
    { index: 13, colName: 'mdmChemMaterialName' },
    { index: 14, colName: 'mdmChemMaterialName' },
    { index: 15, colName: 'mdmChemMaterialName' },
    { index: 16, colName: 'mdmChemMaterialName' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      fix: true
    },
    {
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      style: 'width:160px',
      type: 'link',
      sortable: true,
      fix: true
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명',
      align: 'left',
      style: 'width:200px',
      type: 'link',
      sortable: true,
      fix: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'limitRepval',
      field: 'limitRepval',
      label: '함량 (%)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      label: '폭발한계(%)',
      align: 'center',
      child: [
        {
          name: 'explUpLimit',
          field: 'explUpLimit',
          label: '상한',
          align: 'center',
          style: 'width:70px',
          sortable: false
        },
        {
          name: 'explLowLimit',
          field: 'explLowLimit',
          label: '하한',
          align: 'center',
          style: 'width:70px',
          sortable: false
        }
      ]
    },
    {
      name: 'exposureLimit',
      field: 'exposureLimit',
      label: '노출기준 (ppm)',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'toxicValue',
      field: 'toxicValue',
      label: '독성치 (mg/kg)',
      align: 'left',
      style: 'width:200px',
      type: 'html',
      sortable: true
    },
    {
      name: 'flashingPoint',
      field: 'flashingPoint',
      label: '인화점 (℃)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'ignitionPoint',
      field: 'ignitionPoint',
      label: '발화점 (℃)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'vaporPressure',
      field: 'vaporPressure',
      label: '증기압 (mmHg)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'corrosivenessFlag',
      field: 'corrosivenessFlag',
      label: '부식성유무',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'extraReaction',
      field: 'extraReaction',
      label: '이상반응유무',
      align: 'left',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'dailyUsage',
      field: 'dailyUsage',
      label: '일일취급량 (kg)',
      align: 'center',
      style: 'width:100px',
      type: 'cost',
      sortable: true
    },
    {
      name: 'stockage',
      field: 'stockage',
      label: '저장량 (kg)',
      align: 'center',
      style: 'width:100px',
      type: 'cost',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    }
  ],
  data: []
})
const psmRows = ref([])
const psmColumns = ref([
  {
    name: 'no',
    field: 'no',
    label: '번호',
    align: 'center',
    style: 'width: 50px'
  },
  {
    name: 'substanceCd',
    field: 'substanceCd',
    label: '물질코드',
    align: 'center',
    style: 'width: 50px'
  },
  {
    name: 'krName',
    field: 'krName',
    label: '화학물질명(국문)',
    align: 'left'
    // style: 'width: 250px'
  },
  {
    name: 'enName',
    field: 'enName',
    label: '화학물질명(영문)',
    align: 'left'
  },
  {
    name: 'casNo',
    field: 'casNo',
    label: 'CAS No.',
    align: 'center',
    style: 'width: 120px'
  }
])
const editable = ref(true)
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
  listUrl.value = selectConfig.psi.hsl.hazardmaterials.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 화학자재 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data.map((item: any) => {
      return {
        ...item,
        toxicValue: item.toxicValue ? item.toxicValue.replace(/\r\n/g, '<br/>') : ''
      }
    })
  })
  $http({
    url: selectConfig.psi.hsl.psmSubstance.url,
    method: 'GET'
  }).then((_result: any) => {
    psmRows.value = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 링크 클릭 시 팝업 표시
 * @param (1): 화학자재 정보
 *******************************/
function linkClick(row?: any, col?: any) {
  if (col.name === 'mdmChemMaterialName') {
    popupOptions.value.title = '화학자재 상세'
    popupOptions.value.param = {
      mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
      plantCd: row ? row.plantCd : ''
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
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

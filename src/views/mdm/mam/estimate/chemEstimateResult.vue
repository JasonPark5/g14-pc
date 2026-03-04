<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="사용여부"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="화학자재별 유해성/위해성 평가결과"
      tableId="riskHazrd01"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      gridHeight="790px"
      :editable="editable"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
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
import { chemEstimateResultType } from './chemEstimateResult'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemEstimateResult'
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const useFlagItems = ref<Array<codeMasterType>>([])
const grid = ref({
  merge: [
    { index: 0, colName: 'mdmChemMaterialId' },
    { index: 1, colName: 'mdmChemMaterialId' },
    { index: 2, colName: 'mdmChemMaterialId' },
    { index: 3, colName: 'mdmChemMaterialId' },
    { index: 6, colName: 'mdmChemMaterialId' },
    { index: 7, colName: 'mdmChemMaterialId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장명',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      type: 'link',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'mdmChemMaterialCd',
      field: 'mdmChemMaterialCd',
      label: '화학자재 번호',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'mfgVendorName',
      field: 'mfgVendorName',
      label: '제조업체',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '구성물질',
      align: 'left',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS NO.',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'col7',
      field: 'col7',
      label: '유해성 평가결과',
      align: 'center',
      style: 'width:160px',
      type: 'attach',
      taskClassCd: 'CHEM_APPRAISE_MALEFICENCE',
      keyText: 'mdmChemMaterialId',
      sortable: false
    },
    {
      name: 'col8',
      field: 'col8',
      label: '위해성 평가결과',
      align: 'center',
      style: 'width:160px',
      type: 'attach',
      taskClassCd: 'CHEM_APPRAISE_RISK',
      keyText: 'mdmChemMaterialId',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')
const table = ref<any>(null)

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
  listUrl.value = selectConfig.mdm.mam.chem.msds.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 유해성위해성 조회
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
 * TODO (목적): 유해성위해성 링크 클릭
 * @param (1): 행 정보
 *******************************/
function linkClick(row: chemEstimateResultType) {
  openPop(row)
}
/******************************
 * TODO (목적): 화학자재 팝업 표시 (탭 : 유해성위해성)
 * @param (1): 행정보
 *******************************/
function openPop(row: chemEstimateResultType) {
  table.value.uploadResearchSetting(row, ['col7', 'col8'])
  popupOptions.value.title = '화학자재 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: row.mdmChemMaterialId,
    plantCd: row.plantCd,
    tabName: 'chemEtc',
    subtabName: 'chemAttach'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/mam/chemDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 화학자재 팝업 닫기
 *******************************/
function closePopup() {
  table.value.uploadResearch()
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

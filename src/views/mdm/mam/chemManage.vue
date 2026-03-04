<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-multi-select
            codeGroupCd="REGULATION_BILL_API_CD"
            itemText="codeName"
            itemValue="code"
            label="관련 법규"
            name="searchLaw"
            v-model:value="searchLaw"
            @datachange="billCdChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-multi-select
            :comboItems="regulatedItems"
            itemText="regulatedItemName"
            itemValue="regulatedItemCdReplace"
            type="search"
            label="규제 법규"
            name="regulatedItemCd"
            v-model:value="searchParam.regulatedItemCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="화학자재 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="openPop" />
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
import { chemMaterialType } from './chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemManage'
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
  columns: Array<tableColumnType>
  data: Array<chemMaterialType>
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchLawItems = ref<Array<any>>([])
const searchLaw = ref([])
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y',
  mdmChemMaterialId: '',
  materialName: '',
  regulatedItemCd: [],
  searchItems: [] as Array<any>,
  headerType: 'color'
})
const regulatedItems = ref([])
const originalData = ref<Array<chemMaterialType>>([])
const filterData = ref<Array<chemMaterialType>>([])
const useFlagItems = ref<Array<codeMasterType>>([])
const grid = ref<gridType>({
  columns: [
    {
      fix: true,
      id: 'original',
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      fix: true,
      id: 'original',
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      type: 'link',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'materialCd',
      field: 'materialCd',
      label: '화학자재번호',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      id: 'original',
      name: 'deliveryVendorName',
      field: 'deliveryVendorName',
      label: '공급사',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      id: 'original',
      name: 'mfgVendorName',
      field: 'mfgVendorName',
      label: '제조사',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      id: 'original',
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      id: 'original',
      name: 'msdsNo',
      field: 'msdsNo',
      label: 'MSDS No.',
      align: 'center',
      style: 'width:140px',
      sortable: true
    },
    {
      id: 'original',
      name: 'usageName',
      field: 'usageName',
      label: '용도',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      id: 'original',
      name: 'propertiesStateName',
      field: 'propertiesStateName',
      label: '성상',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      id: 'original',
      name: 'chemFile',
      field: 'chemFile',
      label: '제품사진',
      align: 'center',
      sortable: true,
      type: 'file',
      style: 'width: 160px'
    },
    {
      id: 'original',
      name: 'existRegulation',
      field: 'existRegulation',
      label: '규제법규포함',
      align: 'center',
      type: 'color',
      style: 'width:50px',
      sortable: true
    }
  ],
  data: []
})
const headerUrl = ref('')
const listUrl = ref('')
const regsUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  headerUrl.value = selectConfig.mdm.mam.chem.header.url
  getHeader()
})
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
  listUrl.value = selectConfig.mdm.mam.chem.listreg.url
  regsUrl.value = selectConfig.mdm.mam.chem.regs.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 화학자재 헤더 정보 조회
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      grid.value.columns.push(_item)
    })
    originalData.value = _.cloneDeep(grid.value.columns)
  })
}
/******************************
 * TODO (목적): 관련법규 변경
 * @param (1): 변경된 관련법규 값
 *******************************/
function billCdChange(newValue: any) {
  searchLawItems.value = []
  searchParam.value.regulatedItemCd = []
  if (newValue.length === 0) {
    grid.value.columns = _.cloneDeep(originalData.value)
  } else {
    _.forEach(newValue, (_item) => {
      searchLawItems.value.push(_item.value)
    })
    const _searchLawItems = searchLawItems.value
    filterData.value = originalData.value.filter((object) => {
      return _searchLawItems.indexOf(object['id']) > -1 || object['id'] === 'original'
    })
    grid.value.columns = filterData.value
  }
  searchParam.value.searchItems = []
  _.forEach(newValue, (_item) => {
    searchParam.value.searchItems.push(_item.value)
  })
  $http({
    url: regsUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    regulatedItems.value = _result.data
  })
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
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 링크 클릭
 * @param (1): 화학자재 정보
 *******************************/
function linkClick(row: chemMaterialType) {
  openPop(row)
}
/******************************
 * TODO (목적): 화학자재 팝업 표시
 * @param (1): 화학자재 정보
 *******************************/
function openPop(row?: chemMaterialType) {
  popupOptions.value.title = '화학자재 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
    plantCd: row ? row.plantCd : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./chemDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 화학자재 팝업 닫기
 *******************************/
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

<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="gubunItems"
            type="none"
            itemText="codeName"
            itemValue="code"
            name="gubun"
            label="조회구분"
            v-model:value="searchParam.gubun"
            @datachange="datachange"
          />
        </div>
        <div
          v-if="searchParam.gubun === 'chemNm'"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
        >
          <c-text
            validMessage="[검색조건] 화학물질영문명을 2자 이상 입력하세요."
            name="chemNm"
            label="화학물질영문명 (2자 이상 입력)"
            v-model:value="searchParam.chemNm"
          />
        </div>
        <div
          v-if="searchParam.gubun === 'casNo'"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
        >
          <c-text
            validMessage="[검색조건] CAS No.를 2자 이상 입력하세요."
            name="casNo"
            label="CAS No. (2자 이상 입력)"
            v-model:value="searchParam.casNo"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-checkbox
            label="화학자재 취급 여부"
            :isFlag="true"
            trueLabel="화학자재 취급 물질"
            falseLabel="전체"
            name="materialFlag"
            v-model:value="searchParam.materialFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-multi-select
            type="search"
            codeGroupCd="REGULATION_BILL_API_CD"
            itemText="codeName"
            itemValue="code"
            label="관련 법규"
            name="regulationBillCds"
            v-model:value="searchParam.regulationBillCds"
            @datachange="billCdChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-multi-select
            type="search"
            :comboItems="regulatedItems"
            itemText="regulatedItemName"
            itemValue="regulatedItemCd"
            label="규제 법규"
            name="regulatedItemCds"
            v-model:value="searchParam.regulatedItemCds"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="화학물질 목록"
      :columns="grid.columns"
      :data="grid.data"
      :customTrClass="setTrClass"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-header-append>
        <span style="font-size: 1em; color: red">
          {{
            $language('※ 규제 항목의 정량값이 두 개 이상일 경우, 해당 행의 색상이 강조 표시됩니다.')
          }}
        </span>
      </template>
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
import { chemBaseType } from './chemBase'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemBase'
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
  gubun: 'casNo',
  casNo: '',
  chemNm: '',
  // regulFlag: 'Y',
  materialFlag: 'Y',
  regulationBillCds: [],
  regulatedItemCds: []
})
const grid = ref({
  columns: [
    {
      name: 'chem',
      field: 'chem',
      label: '화학물질명',
      child: [
        {
          name: 'chemNmEn',
          field: 'chemNmEn',
          label: '영문',
          align: 'left',
          sortable: true,
          style: 'width: 120px',
          type: 'link'
        },
        {
          name: 'chemNmKr',
          field: 'chemNmKr',
          label: '국문',
          align: 'left',
          sortable: true,
          style: 'width: 120px'
        }
      ]
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      sortable: true,
      style: 'width: 80px'
    },
    {
      name: 'molecularFormula',
      field: 'molecularFormula',
      label: '화학식',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    }
  ],
  data: []
})
const gubunItems = ref<Array<codeMasterType>>([])
const regulatedItems = ref([])
const listUrl = ref('')
const regsUrl = ref('')
const searchbox = ref<any>(null)

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
  listUrl.value = selectConfig.chm.base.chemBase.list.url
  regsUrl.value = selectConfig.mdm.mam.chem.regs.url
  // code setting
  gubunItems.value = [
    { code: 'casNo', codeName: $language('CAS No. 조회') },
    { code: 'chemNm', codeName: $language('화학물질영문명 조회') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 화학물질 조회
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
 * TODO (목적): 검색조건 변경
 *******************************/
function datachange() {
  if (searchParam.value.gubun === 'casNo') {
    searchParam.value.chemNm = ''
  } else {
    searchParam.value.casNo = ''
  }
}
/******************************
 * TODO (목적): 법규 변경에 따른 규제항목 조회
 *******************************/
function billCdChange() {
  $http({
    url: regsUrl.value,
    method: 'GET',
    params: {
      searchItems: searchParam.value.regulationBillCds
    }
  }).then((_result: any) => {
    regulatedItems.value = _result.data
  })
}
/******************************
 * TODO (목적): 화학물질 링크 클릭
 * @param (1): 행 정보
 *******************************/
function linkClick(row: chemBaseType) {
  openPop(row)
}
/******************************
 * TODO (목적): 화학물질 팝업 표시
 * @param (1): 행 정보
 *******************************/
function openPop(row: chemBaseType) {
  popupOptions.value.title = '화학물질 상세'
  popupOptions.value.param = {
    mdmChemId: row ? row.mdmChemId : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./chemBaseDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 화학물질 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * TODO (목적): 색 강조 닫기
 *******************************/
function setTrClass(_props: any) {
  return _props.row.pluralCount > 0 ? 'bg-blue-1' : ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

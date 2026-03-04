<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="existFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="existFlag"
            label="유해위험성 포함여부"
            v-model:value="searchParam.existFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="화학자재 유해위험성 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-icon
            name="help"
            size="1.6em"
            color="primary"
            style="margin: 2px 10px"
            class="cursor-pointer"
          >
            <q-popup-proxy anchor="bottom middle" self="top middle">
              <c-table
                title="유해위험성 구분 범례"
                :columns="gridClass.columns"
                :data="gridClass.data"
                :gridHeight="gridClass.height"
                hideBottom
              />
            </q-popup-proxy>
          </q-icon>
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
import { chemMaterialType } from '../chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemHarmfulRisk'
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
  useFlag: 'Y',
  existFlag: 'Y',
  mdmChemMaterialId: null
})
const existFlagItems = ref<Array<codeMasterType>>([])
const grid = ref({
  columns: [
    {
      fix: true,
      name: 'plantName',
      field: 'plantName',
      label: '사업장명',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      fix: true,
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      type: 'link',
      style: 'width:250px',
      sortable: true
    },
    {
      fix: true,
      name: 'mdmChemMaterialCd',
      field: 'mdmChemMaterialCd',
      label: '화학자재번호',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'propertiesStateName',
      field: 'propertiesStateName',
      label: '성상',
      align: 'center',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'usageName',
      field: 'usageName',
      label: '용도',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'harmfulRisk',
      field: 'harmfulRisk',
      label: '건강 유해성',
      child: [
        {
          name: 'hrc0000001',
          field: 'hrc0000001',
          label: '급성독성(경구)',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000002',
          field: 'hrc0000002',
          label: '급성독성(경피)',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000003',
          field: 'hrc0000003',
          label: '급성독성(흡입)',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000004',
          field: 'hrc0000004',
          label: '피부 부식/자극성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000005',
          field: 'hrc0000005',
          label: '피부 과민성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000006',
          field: 'hrc0000006',
          label: '심한 눈 손상/자극성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000007',
          field: 'hrc0000007',
          label: '호흡기 과민성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000009',
          field: 'hrc0000009',
          label: '발암성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000010',
          field: 'hrc0000010',
          label: '생식세포 변이원성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000011',
          field: 'hrc0000011',
          label: '생식독성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000012',
          field: 'hrc0000012',
          label: '특정표적장기 독성(1회노출)',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000013',
          field: 'hrc0000013',
          label: '특정표적장기 독성(반복노출)',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000014',
          field: 'hrc0000014',
          label: '흡인유해성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        }
      ]
    },
    {
      name: 'harmfulRisk',
      field: 'harmfulRisk',
      label: '물리적 위험성',
      child: [
        {
          name: 'hrc0000020',
          field: 'hrc0000020',
          label: '폭발성 물질',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000021',
          field: 'hrc0000021',
          label: '인화성 물질',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000022',
          field: 'hrc0000022',
          label: '에어로졸',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000023',
          field: 'hrc0000023',
          label: '자기반응성 물질 및 혼합물',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000024',
          field: 'hrc0000024',
          label: '자연발화성 물질',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000025',
          field: 'hrc0000025',
          label: '자기발열성 물질 및 혼합물',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000026',
          field: 'hrc0000026',
          label: '물반응성 물질 및 혼합물',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000027',
          field: 'hrc0000027',
          label: '산화성 물질',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000028',
          field: 'hrc0000028',
          label: '고압가스',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000029',
          field: 'hrc0000029',
          label: '금속부식성 물질',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        }
      ]
    },
    {
      name: 'harmfulRisk',
      field: 'harmfulRisk',
      label: '환경 유해성',
      child: [
        {
          name: 'hrc0000030',
          field: 'hrc0000030',
          label: '수생환경 유해성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        },
        {
          name: 'hrc0000031',
          field: 'hrc0000031',
          label: '오존층 유해성',
          align: 'center',
          style: 'width:100px',
          sortable: true,
          type: 'html'
        }
      ]
    }
  ],
  data: []
})
const gridClass = ref({
  columns: [
    {
      fix: true,
      name: 'harmfulRiskClassName',
      field: 'harmfulRiskClassName',
      label: '유해위험성구분',
      align: 'center',
      style: 'width:130px',
      sortable: true
    },
    {
      name: 'gubun1',
      field: 'gubun1',
      label: '구분1',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun1a',
      field: 'gubun1a',
      label: '구분1A',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun1b',
      field: 'gubun1b',
      label: '구분1B',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun1c',
      field: 'gubun1c',
      label: '구분1C',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun2',
      field: 'gubun2',
      label: '구분2',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun2a',
      field: 'gubun2a',
      label: '구분2A',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun2b',
      field: 'gubun2b',
      label: '구분2B',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun3',
      field: 'gubun3',
      label: '구분3',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun4',
      field: 'gubun4',
      label: '구분4',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun5',
      field: 'gubun5',
      label: '구분5',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    }
  ],
  data: [],
  height: '600px'
})
const listUrl = ref('')
const listLegendUrl = ref('')

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
  listUrl.value = selectConfig.mdm.mam.chem.harmfulList.url
  listLegendUrl.value = selectConfig.mdm.mam.chem.harmfulLegendList.url
  // code setting
  existFlagItems.value = [
    { code: 'Y', codeName: $language('유해위험성 포함') },
    { code: 'N', codeName: $language('유해위험성 미포함') }
  ]
  // list setting
  getLegend()
  getList()
}
/******************************
 * TODO (목적): 유해위험성 조회
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
 * TODO (목적): 유해위험성 범례 조회
 *******************************/
function getLegend() {
  $http({
    url: listLegendUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridClass.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 링크 클릭
 * @param (1): 행 정보
 *******************************/
function linkClick(row: chemMaterialType) {
  openPop(row)
}
/******************************
 * TODO (목적): 화학자재 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function openPop(row: chemMaterialType) {
  popupOptions.value.title = '화학자재 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: row.mdmChemMaterialId,
    plantCd: row.plantCd,
    tabName: 'chemGhs'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/mam/chemDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 화학자재 상세 팝업 닫기
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

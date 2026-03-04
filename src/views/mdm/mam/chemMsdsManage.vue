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
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="화학자재별 MSDS 목록"
      tableId="riskHazrd01"
      :editable="editable"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'warning'">
          <q-btn
            dense
            outline
            icon="download"
            color="blue-9"
            size="12px"
            style="font-weight: 700"
            label="6 x 4"
            @click="linkClick(props.row, col, 's')"
          />
          <q-btn
            dense
            outline
            icon="download"
            color="blue-9"
            size="12px"
            style="font-weight: 700; margin: 3px 0"
            label="11 x 9"
            @click="linkClick(props.row, col, 'm')"
          />
          <!-- <q-btn
            dense
            outline
            icon="check"
            color="green-9"
            size="12px"
            style="font-weight: 700"
            :label="$language('요약본')"
            @click="linkClick(props.row, col, 'SUMMARY')"
          /> -->
        </template>
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
  name: 'chemMsdsManage'
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
const grid = ref({
  merge: [
    { index: 0, colName: 'mdmChemMaterialId' },
    { index: 1, colName: 'mdmChemMaterialId' },
    { index: 2, colName: 'mdmChemMaterialId' },
    { index: 3, colName: 'mdmChemMaterialId' },
    // { index: 4, colName: 'mdmChemMaterialId' },
    // { index: 5, colName: 'mdmChemMaterialId' },
    { index: 6, colName: 'mdmChemMaterialId' },
    { index: 7, colName: 'mdmChemMaterialId' },
    { index: 8, colName: 'mdmChemMaterialId' },
    { index: 9, colName: 'mdmChemMaterialId' }
  ],
  columns: [
    {
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      style: 'width:250px',
      type: 'link',
      sortable: true
    },
    {
      name: 'mdmChemMaterialCd',
      field: 'mdmChemMaterialCd',
      label: '화학자재번호',
      align: 'center',
      style: 'width:110px',
      sortable: true
    },
    {
      name: 'mfgVendorName',
      field: 'mfgVendorName',
      label: '제조사',
      align: 'center',
      style: 'width:140px',
      sortable: true
    },
    {
      name: 'warning',
      field: 'warning',
      label: '경고표지',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      type: 'custom'
    },
    // {
    //   name: 'msds',
    //   field: 'msds',
    //   label: 'MSDS<br/>요약본',
    //   align: 'center',
    //   style: 'width:90px',
    //   sortable: true,
    //   type: 'custom'
    // },
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
      style: 'width:110px',
      sortable: true
    },
    {
      name: 'msdsNo',
      field: 'msdsNo',
      label: 'MSDS NO.',
      align: 'center',
      style: 'width:160px',
      sortable: true
    },
    {
      name: 'col7',
      field: 'col7',
      label: '내부 MSDS',
      align: 'center',
      style: 'width:180px',
      type: 'attach',
      taskClassCd: 'CHEM_MSDS',
      keyText: 'mdmChemMaterialMsdsId',
      sortable: false
    },
    {
      name: 'col8',
      field: 'col8',
      label: '업체 MSDS',
      align: 'center',
      style: 'width:180px',
      type: 'attach',
      taskClassCd: 'CHEM_MSDS_VENDOR',
      keyText: 'mdmChemMaterialMsdsId',
      sortable: false
    },
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const printUrl = ref('')
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
  printUrl.value = selectConfig.mdm.mam.chem.print.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function linkClick(row: chemMaterialType, col: tableColumnType, size: string) {
  if (col.name === 'mdmChemMaterialName') {
    // 화학자재 상세 페이지 열기
    table.value.uploadResearchSetting(row, ['col7', 'col8'])
    popupOptions.value.title = '화학자재 상세'
    popupOptions.value.param = {
      mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
      plantCd: row ? row.plantCd : '',
      tabName: 'chemEtc'
    }
    popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./chemDetail.vue`)))
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closePopup
  } else if (col.name === 'warning') {
    if (size == 'SUMMARY') {
      popupOptions.value.title = 'MSDS 요약정보'
      popupOptions.value.param = {
        mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
        plantCd: row ? row.plantCd : '',
        tabName: 'chemEtc',
        subtabName: 'chemSummary'
      }
      popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./chemDetail.vue`)))
      popupOptions.value.visible = true
      popupOptions.value.closeCallback = closePopup
    } else {
      // 경고표지 출력
      $http({
        url: $format(printUrl.value, row.mdmChemMaterialId),
        method: 'GET',
        params: {
          size: size
        }
      }).then((_result: any) => {
        const sizeTitle = size === 's' ? '6 x 4' : '11 x 9'
        const fileOrgNm = row.mdmChemMaterialName + '_' + sizeTitle + '.xlsx'
        const blob = base64ToBlob(_result.data)
        const nav = window.navigator as any
        if (nav && nav.msSaveOrOpenBlob) {
          nav.msSaveOrOpenBlob(blob, fileOrgNm)
        } else {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileOrgNm
          link.click()
        }
      })
    }
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
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

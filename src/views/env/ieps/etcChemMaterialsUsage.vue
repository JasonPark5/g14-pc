<template>
  <div>
    <q-form ref="editForm">
      <c-search-box @enter="getList">
        <template v-slot:search>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              label="사용년월"
              name="usageMonth"
              type="month"
              v-model:value="searchParam.usageMonth"
            />
          </div>
        </template>
      </c-search-box>

      <!-- @table-data-change="tableDataChange" -->
      <!-- rowKey="etcChemUsageId" -->
      <c-table
        ref="table"
        title="기타화학물질 사용량"
        tableId="grid"
        :columns="grid.columns"
        :data="grid.data"
        :usePaging="true"
        :columnSetting="false"
        :filtering="true"
        :isExcelDown="false"
        @linkClick="linkClick"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && grid.data.length > 0"
              label="IEPS 다운로드"
              icon="download"
              @btnClicked="downLoadExcel"
            />
            <c-btn label="등록" icon="add" @btnClicked="linkClick" />

            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'airMaterialUnitName'">
            <c-text-column
              v-if="props.row.airMaterialUnitCd === '14'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.airMaterialUnitName"
            />
            <span v-else>
              {{ props.row.airMaterialUnitName }}
            </span>
          </template>
        </template>
      </c-table>
    </q-form>
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
  name: 'etcChemMaterialsUsage'
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
  width: '',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  processNo: '',
  usageMonth: '',
  useFlag: ''
})
//const materialItems = ref<codeMasterType>([])
const grid = ref<gridType>({
  columns: [
    {
      ////required: true,
      name: 'usageMonth',
      field: 'usageMonth',
      label: '사용년월',
      type: 'link',
      style: 'width:120px',

      dateType: 'month',
      align: 'center',
      sortable: false
    },
    {
      name: 'processInfo',
      field: 'processInfo',
      label: '공정정보',
      child: [
        {
          ////required: true,
          name: 'processNo',
          field: 'processNo',
          label: '공정번호',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          ////required: true,
          name: 'processName',
          field: 'processName',
          label: '공정명',
          align: 'left',
          style: 'width:120px',
          sortable: false
        }
      ]
    },
    {
      name: 'usageInfo',
      field: 'usageInfo',
      label: '기타화학물질 사용량',
      child: [
        {
          ////required: true,
          name: 'etcChemMaterialsName',
          field: 'etcChemMaterialsName',
          label: '화학물질명',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          ////required: true,
          name: 'etcChemMaterialsUsage',
          field: 'etcChemMaterialsUsage',
          label: '사용량',
          align: 'right',
          style: 'width:120px',
          sortable: false
        },
        {
          ////required: true,
          name: 'airMaterialUnitCdName',
          field: 'airMaterialUnitCdName',
          label: '물질사용단위코드',
          align: 'center',
          style: 'width:90px',
          //type: 'select',
          codeGroupCd: 'AIR_MATERIAL_UNIT_CD',
          sortable: false
        },
        {
          name: 'airMaterialUnitName',
          field: 'airMaterialUnitName',
          label: '직접입력 단위명',
          align: 'center',
          style: 'width:80px',
          sortable: false
          //type: 'custom'
        }
      ]
    },
    {
      name: 'comment',
      field: 'comment',
      label: '비고',
      style: 'width:120px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
const listUrl = ref('')
// const materialUrl = ref('')

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
  listUrl.value = selectConfig.env.ieps.etcChem.list.url
  // materialUrl.value = selectConfig.env.air.mst.material.list.url
  // code setting
  searchParam.value.usageMonth = getThisMonth()
  searchParam.value.useFlag = 'Y'

  // list setting
  // getMaterialList()
  getList()
}
// /******************************
//  * TODO (목적): 화학물질 조회(화학물질마스터를 사용할지 키인할지 검토)
//  *******************************/
// function getMaterialList() {
//   $http({
//     url: materialUrl.value,
//     method: 'GET',
//     params: searchParam.value
//   }).then((_result: any) => {
//     _.forEach(_result.data, (item) => {
//       materialItems.value.push({
//         code: item.envAirMstMaterialId,
//         codeName: item.envAirMstMaterialName,
//         airMaterialUnitCd: item.airMaterialUnitCd
//       })
//     })
//   })
// }
/******************************
 * TODO (목적): 목록 조회
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

// /******************************
//  * TODO (목적): 테이블 데이터 변경에 따른 수정사항
//  *******************************/
// function tableDataChange(_props: any, col: any) {
//   if (col.name === 'envAirMstMaterialId') {
//     const material = materialItems.value.find((d: any) => d.code === _props.row.envAirMstMaterialId)
//     _props.row.airMaterialUnitCd = material ? material.airMaterialUnitCd : ''
//   }
// }

/******************************
 * TODO (목적): 엑셀 다운로드
 *******************************/
function downLoadExcel() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'IEPS 기타화학물질사용량' + '(' + searchParam.value.usageMonth + ')' + '.xlsx'
    link.click()
  })
}

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '기타화학물질 사용량'

  popupOptions.value.param = {
    etcChemUsageId: row ? row.etcChemUsageId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./etcChemMaterialsUsageDetail.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
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

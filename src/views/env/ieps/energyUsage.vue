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
      <c-table
        ref="table"
        title="에너지 사용량"
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
          <template v-if="col.name === 'iepsEnergyName'">
            <c-text-column
              v-if="props.row.iepsEnergyCd === '4'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.iepsEnergyName"
            />
            <span v-else>
              {{ props.row.iepsEnergyName }}
            </span>
          </template>
          <template v-if="col.name === 'energyUnitName'">
            <c-text-column
              v-if="props.row.energyUnitCd === '14'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.energyUnitName"
            />
            <span v-else>
              {{ props.row.energyUnitName }}
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
  name: 'energyUsage'
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
  usageMonth: '',
  useFlag: ''
})
//const materialItems = ref<codeMasterType>([])
const grid = ref<gridType>({
  columns: [
    {
      //required: true,
      name: 'usageMonth',
      field: 'usageMonth',
      label: '사용년월',
      style: 'width:120px',
      type: 'link',
      //type: 'date',
      dateType: 'month',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageInfo',
      field: 'usageInfo',
      label: '에너지 사용량',
      child: [
        {
          //required: true,
          name: 'iepsEnergyCdName',
          field: 'iepsEnergyCdName',
          label: '에너지코드',
          align: 'center',
          style: 'width:120px',
          sortable: false,
          //type: 'custom'
          codeGroupCd: 'IEPS_ENERGY_CD'
        },
        {
          name: 'iepsEnergyName',
          field: 'iepsEnergyName',
          label: '직접입력 에너지명',
          align: 'left',
          style: 'width:120px',
          sortable: false
          //type: 'custom'
        },
        {
          //required: true,
          name: 'iepsEnergySupdemTypeCdName',
          field: 'iepsEnergySupdemTypeCdName',
          label: '수급구분코드',
          align: 'left',
          style: 'width:120px',
          sortable: false,
          //type: 'custom'
          codeGroupCd: 'IEPS_ENERGY_SUPDEM_TYPE_CD'
        },
        {
          //required: true,
          name: 'energyUsage',
          field: 'energyUsage',
          label: '사용량',
          align: 'left',
          style: 'width:120px',
          sortable: false
          //type: 'custom'
        },
        {
          //required: true,
          name: 'energyUnitCdName',
          field: 'energyUnitCdName',
          label: '사용량 단위코드',
          align: 'left',
          style: 'width:120px',
          sortable: false,
          //type: 'custom'
          codeGroupCd: 'IEPS_ENERGY_UNIT_CD'
        },
        {
          name: 'energyUnitName',
          field: 'energyUnitName',
          label: '직접입력 단위명',
          align: 'left',
          style: 'width:120px',
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
      //type: 'custom'
    }
  ],
  data: []
})
const editable = ref(true)
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
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
  listUrl.value = selectConfig.env.ieps.energy.list.url
  // materialUrl.value = selectConfig.env.air.mst.material.list.url
  // code setting
  searchParam.value.usageMonth = getThisMonth()
  searchParam.value.useFlag = 'Y'

  // list setting
  getList()
}
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
    link.download = 'IEPS 에너지사용량' + '(' + searchParam.value.usageMonth + ')' + '.xlsx'
    link.click()
  })
}

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '에너지 사용량'
  popupOptions.value.param = {
    energyUsageId: row ? row.energyUsageId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./energyUsageDetail.vue`))
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

<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="안전보건정보 목록"
      tableId="safeHealSurvey01"
      :pagePerRow="grid.pagePerRow"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="안전보건정보 조사표" icon="assignment" @btnClicked="printChecklist" />
          <!-- <c-btn label="공정흐름도" icon="account_tree" @btnClicked="printProcessFlowChart" />
          <c-btn label="검색" icon="search" @btnClicked="getList" /> -->
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'sopNames' && props.row.sopNames">
          <q-chip
            v-for="(item, index) in props.row['sopNames'].split('\n')"
            outline
            square
            :key="index"
            color="light-green"
            text-color="white"
            style="margin-bottom: 4px !important"
          >
            {{ item }}
          </q-chip>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safeHealSurvey'
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
// const searchParam = ref({
//   plantCd: null
// })
const grid = ref({
  pagePerRow: {
    pageNumber: 100
  },
  merge: [
    { index: 0, colName: 'upProcessCd' },
    { index: 1, colName: 'processCd' },
    { index: 2, colName: 'equipmentCd' },
    { index: 3, colName: 'equipmentCd' },
    { index: 4, colName: 'materialCd' },
    { index: 6, colName: 'materialCd' },
    { index: 7, colName: 'materialCd' },
    { index: 8, colName: 'processCd' },
    { index: 9, colName: 'processCd' }
  ],
  columns: [
    {
      name: 'kras',
      field: 'kras',
      label: '공정 평가 대상',
      align: 'center',
      child: [
        {
          name: 'upProcessName',
          field: 'upProcessName',
          label: '공정',
          align: 'center',
          style: 'width:120px',
          sortable: false,
          type: 'link'
        },
        {
          name: 'processName',
          field: 'processName',
          label: '세부공정(작업)',
          align: 'center',
          style: 'width:120px',
          sortable: false,
          type: 'link'
        }
      ]
    },
    {
      name: 'equipment',
      field: 'equipment',
      label: '기계기구 및 설비',
      align: 'center',
      child: [
        {
          name: 'equipmentName',
          field: 'equipmentName',
          label: '기계기구 및 설비',
          align: 'center',
          style: 'width:200px',
          sortable: false,
          type: 'link'
        },
        {
          name: 'amount',
          field: 'amount',
          label: '수량',
          align: 'right',
          type: 'cost',
          style: 'width:70px',
          sortable: false
        }
      ]
    },
    {
      name: 'riskChemprod',
      field: 'riskChemprod',
      label: '위험성평가물질',
      align: 'center',
      child: [
        {
          name: 'materialName',
          field: 'materialName',
          label: '화학자재',
          align: 'center',
          style: 'width:150px',
          sortable: false,
          type: 'link'
        },
        {
          name: 'chemNmKr',
          field: 'chemNmKr',
          label: '화학물질',
          align: 'center',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'chemDailyVolume',
          field: 'chemDailyVolume',
          label: '취급량/일',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'chemDailyHour',
          field: 'chemDailyHour',
          label: '취급시간',
          align: 'center',
          style: 'width:100px',
          sortable: false
        }
      ]
    },
    {
      name: 'downPath',
      field: 'downPath',
      label: '그 밖의 유해위험정보',
      align: 'center',
      style: 'width:200px',
      type: 'img',
      sortable: false
    },
    {
      name: 'job',
      field: 'job',
      label: '작업 평가 대상',
      align: 'center',
      child: [
        {
          name: 'sopNames',
          field: 'sopNames',
          label: '작업',
          align: 'left',
          style: 'width:200px',
          sortable: false,
          type: 'custom'
        }
      ]
    }
  ],
  data: []
})
const listUrl = ref('')
const printUrl = ref('')

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
  listUrl.value = selectConfig.ram.safeHealSurvey.list.url
  printUrl.value = selectConfig.ram.safeHealSurvey.print.url
  // code setting
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
    method: 'GET'
    // params: searchParam.value
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
function linkClick(row: any, col: tableColumnType) {
  if (!row) return
  if (col.name === 'upProcessName' || col.name === 'processName') {
    popupOptions.value.title = '공정 상세'
    popupOptions.value.param = {
      processType: col.name === 'upProcessName' ? 'P' : 'C', // P: 상위공정, C: 단위공정
      processCd: col.name === 'upProcessName' ? row.upProcessCd || '' : row.processCd || ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/common/process/processInfoPop.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.width = '60%'
    popupOptions.value.closeCallback = closePopup
  } else if (col.name === 'equipmentName') {
    if (row.equipType === 'equipment') {
      popupOptions.value.title = '설비 상세'
      popupOptions.value.param = {
        equipmentCd: _.split(row.equipmentCd, '/')[1] || '',
        psmFlag: row ? row.psmFlag : ''
      }
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
      )
      popupOptions.value.visible = true
      popupOptions.value.width = '90%'
      popupOptions.value.closeCallback = closePopup
    } else {
      popupOptions.value.title = '유해위험기계기구 상세'
      popupOptions.value.param = {
        hhmHazardousMachineryId: row ? row.hhmHazardousMachineryId : ''
      }
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(
          () => import(`@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue`)
        )
      )
      popupOptions.value.visible = true
      popupOptions.value.width = '90%'
      popupOptions.value.closeCallback = closePopup
    }
  } else if (col.name === 'materialName') {
    popupOptions.value.title = '화학자재 상세'
    popupOptions.value.param = {
      mdmChemMaterialId: row ? row.mdmChemMaterialId : ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/mdm/mam/chemDetail.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.width = '90%'
    popupOptions.value.closeCallback = closePopup
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function printChecklist() {
  $http({
    url: printUrl.value,
    method: 'GET'
    // params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = $language('안전보건조사표') + '_' + getToday() + '.docx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

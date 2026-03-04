<!-- 시설유형별 시설 구분 관리 - 반기 상세 부분 -->
<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="HCF_FACILITY_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="hcfFacilityTypeCd"
            label="시설유형"
            v-model:value="searchParam.hcfFacilityTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
      title="시설 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="시설 등록" icon="add" @btnClicked="linkClick" />
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
import { hazardFacilityType } from './hazardFacility'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardFacility'
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
  processCd: null,
  hcfFacilityTypeCd: null,
  useFlag: 'Y',
  approvalStatusCd: null
})
const grid = ref({
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   style: 'width:100px',
    //   sortable: false
    // },
    // {
    //   name: 'processName',
    //   field: 'processName',
    //   label: '상위공정/단위공정',
    //   align: 'center',
    //   style: 'width:150px',
    //   sortable: false
    // },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '시설명(차량번호)',
      align: 'left',
      style: 'width:250px',
      type: 'link',
      sortable: false
    },
    {
      name: 'facilityNo',
      field: 'facilityNo',
      label: '시설관리번호',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'hcfFacilityTypeName',
      field: 'hcfFacilityTypeName',
      label: '시설유형',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'inspection',
      field: 'hcfInspectionCycleName',
      label: '정기검사',
      child: [
        {
          name: 'hcfInspectionCycleName',
          field: 'hcfInspectionCycleName',
          label: '주기',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'lastRemunerationDate',
          field: 'lastRemunerationDate',
          label: '최종검사일',
          align: 'center',
          style: 'width:90px',
          sortable: false
        },
        {
          name: 'nextInspectionDate',
          field: 'nextInspectionDate',
          label: '차기검사일',
          align: 'center',
          style: 'width:90px',
          sortable: false
        }
      ]
    },
    {
      name: 'selfCheck',
      field: 'hcfInspectionCycleName',
      label: '자체점검',
      child: [
        {
          name: 'lastSelfCheckDate',
          field: 'lastSelfCheckDate',
          label: '최종자체점검일',
          align: 'center',
          style: 'width:90px',
          sortable: false
        },
        {
          name: 'nextSelfCheckDate',
          field: 'nextSelfCheckDate',
          label: '차기자체점검일',
          align: 'center',
          style: 'width:90px',
          sortable: false
        }
      ]
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: false
    }
    // {
    //   name: 'approvalStatusName',
    //   field: 'approvalStatusName',
    //   label: '결재상태',
    //   style: 'width:60px',
    //   align: 'center',
    //   sortable: false
    // }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
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
  listUrl.value = selectConfig.env.facility.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
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
 * TODO (목적): 시설 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row?: hazardFacilityType) {
  popupOptions.value.title = '유해화학물질 취급시설 상세'
  popupOptions.value.param = {
    facilityCd: row ? row.facilityCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardFacilityDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 시설 팝업 닫기
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

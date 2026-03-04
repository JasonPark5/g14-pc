<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            label="단위공정"
            name="subProcessCd"
            v-model:value="searchParam.subProcessCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_TECHNIQUE_HAZARD_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramRiskHazardTechniqueCd"
            label="평가기법 분류"
            v-model:value="searchParam.ramRiskHazardTechniqueCd"
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
      title="안전작업표준 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sopManage'
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
interface searchParamType {
  plantCd: stringNull
  useFlag: stringNull
  subProcessCd: stringNull
  ramRiskHazardTechniqueCd: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  useFlag: 'Y',
  subProcessCd: '',
  ramRiskHazardTechniqueCd: null
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '80%',
  param: {},
  closeCallback: () => {}
})
const useFlagItems = ref<Array<codeMasterType>>([])
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장명',
      align: 'center',
      sortable: true
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정명',
      align: 'center',
      sortable: true
    },
    {
      name: 'sopNo',
      field: 'sopNo',
      label: '안전작업표준 관리번호',
      align: 'center',
      sortable: true,
      style: 'width: 160px'
    },
    {
      name: 'sopName',
      field: 'sopName',
      label: '안전작업표준 작업명',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'hazardGradeName',
      field: 'hazardGradeName',
      label: '위험등급',
      align: 'center',
      sortable: true
    },
    {
      name: 'workTypeName',
      field: 'workTypeName',
      label: '작업유형',
      align: 'center',
      sortable: true
    },
    {
      name: 'workKindName',
      field: 'workKindName',
      label: '작업형태',
      align: 'center',
      sortable: true
    },
    {
      name: 'workClassName',
      field: 'workClassName',
      label: '작업구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'ramRiskHazardTechniqueName',
      field: 'ramRiskHazardTechniqueName',
      label: '평가기법 분류',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width: 70px'
    }
  ],
  data: []
})
const editable = ref(true)
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
  listUrl.value = selectConfig.mdm.sop.job.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 설비 목록 조회
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
 * TODO (목적): 행 링크 클릭
 * @param (1): 행 전체 정보
 *******************************/
function linkClick(row: any) {
  openPop(row)
}
/******************************
 * TODO (목적): 상세 팝업창 표시
 * @param (1): 행 전체 정보 (신규등록인 경우 null)
 *******************************/
function openPop(row: any) {
  popupOptions.value.title = '안전작업표준 상세'
  popupOptions.value.param = {
    mdmSopId: row ? row.mdmSopId : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./sopDetail.vue`)))
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 설비 상세 팝업창 닫기
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

<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          type="search"
          codeGroupCd="EAP_TYPE_CD"
          itemText="codeName"
          itemValue="code"
          name="emergencyTypeCd"
          label="비상사태구분"
          v-model:value="searchParam.emergencyTypeCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          :comboItems="useFlagItems"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="useFlag1"
          label="비상조치계획 사용여부"
          v-model:value="searchParam.useFlag1"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          :comboItems="useFlagItems"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="useFlag2"
          label="훈련시나리오 사용여부"
          v-model:value="searchParam.useFlag2"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="table"
    title="비상조치계획서 목록"
    :columns="grid.columns"
    :data="grid.data"
    :merge="grid.merge"
    rowKey="sopEmergencyPlanId"
    @linkClick="linkClick"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="등록" icon="add" @btnClicked="onItemClick" />
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
  name: 'emergencyActionPlanDocu'
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
  emergencyTypeCd: stringNull
  useFlag1: stringNull
  useFlag2: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
  merge: tableMergeType
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  emergencyTypeCd: null,
  useFlag1: 'Y',
  useFlag2: 'Y'
})
const useFlagItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'mergeGroup' },
    { index: 1, colName: 'mergeGroup' },
    { index: 2, colName: 'mergeGroup' },
    { index: 3, colName: 'mergeGroup' },
    { index: 4, colName: 'mergeGroup' },
    { index: 5, colName: 'mergeGroup' }
  ],
  columns: [
    {
      name: 'planDocu',
      field: 'planDocu',
      label: '비상조치계획',
      align: 'center',
      child: [
        {
          name: 'plantName',
          field: 'plantName',
          label: '사업장',
          align: 'center',
          sortable: false,
          style: 'width:80px'
        },
        {
          name: 'emergencyTypeName',
          field: 'emergencyTypeName',
          label: '비상사태구분',
          align: 'center',
          sortable: false,
          style: 'width:100px'
        },
        {
          name: 'emergencyPlanName',
          field: 'emergencyPlanName',
          label: '계획서명',
          align: 'left',
          sortable: false,
          type: 'link',
          style: 'width:150px'
        },
        {
          name: 'documentNo',
          field: 'documentNo',
          label: '문서번호',
          align: 'center',
          sortable: false,
          style: 'width:50px'
        },
        {
          name: 'emergencyClassCd',
          field: 'emergencyClassCd',
          label: '비상사태유형',
          align: 'center',
          sortable: false,
          style: 'width:150px'
        },
        {
          name: 'useFlagName1',
          field: 'useFlagName1',
          label: '사용여부',
          align: 'center',
          sortable: false,
          style: 'width:50px'
        }
      ]
    },
    {
      name: 'traningScnario',
      field: 'traningScnario',
      label: '훈련시나리오',
      align: 'center',
      child: [
        {
          name: 'trainingScenarioName',
          field: 'trainingScenarioName',
          label: '훈련시나리오명',
          align: 'left',
          sortable: false,
          style: 'width:150px'
        },
        {
          name: 'revisionNum',
          field: 'revisionNum',
          label: 'Rev.',
          align: 'center',
          sortable: false,
          style: 'width:40px'
        },
        {
          name: 'trainingContentsSummary',
          field: 'trainingContentsSummary',
          label: '훈련내용요약',
          align: 'left',
          sortable: false,
          style: 'width:250px'
        },
        {
          name: 'useFlagName2',
          field: 'useFlagName2',
          label: '사용여부',
          align: 'center',
          sortable: false,
          style: 'width:50px'
        }
      ]
    }
  ],
  data: []
})

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
  listUrl.value = selectConfig.sop.eap.planDocu.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
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
function onItemClick() {
  linkClick(null)
}
function linkClick(row: any) {
  popupOptions.value.title = '비상조치계획서 상세'
  popupOptions.value.param = {
    sopEmergencyPlanId: row ? row.sopEmergencyPlanId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./emergencyActionPlanDocuDetail.vue`))
  )
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

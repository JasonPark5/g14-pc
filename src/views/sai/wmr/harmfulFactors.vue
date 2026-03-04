<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="HAZARD_CLASS_FST_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="hazardClassFstCd"
            label="유해인자 대분류"
            v-model:value="searchParam.hazardClassFstCd"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
            :comboItems="occSecItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="hazardClassSecCd"
            label="유해인자 분류"
            v-model:value="searchParam.hazardClassSecCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="workFlagItems"
            label="작업환경관련여부"
            itemText="codeName"
            itemValue="code"
            name="workEnvFlag"
            type="search"
            v-model:value="searchParam.workEnvFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="workFlagItems"
            label="특수건강검진관련여부"
            itemText="codeName"
            itemValue="code"
            name="speHealthFlag"
            type="search"
            v-model:value="searchParam.speHealthFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="hazard"
      title="유해인자 목록"
      tableId="guideBook"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="grid.data"
      rowKey="hazardCd"
      :columnSetting="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-icon
            name="help"
            size="1.4em"
            color="primary"
            style="margin: 2px 10px"
            class="cursor-pointer"
          >
            <q-tooltip anchor="bottom right">
              <div style="font-size: 1.2em !important">
                <b>특수건강진단 대상 유해인자 분류</b>
                <ul style="list-style-type: square; margin-left: -20px !important">
                  <li>유기화합물 : 109종 물질을 용량비율 1퍼센트 이상 함유한 혼합물</li>
                  <li>금속류 : 20종 물질을 중량비율 1퍼센트 이상 함유한 혼합물</li>
                  <li>산 및 알칼리류 : 8종 물질을 중량비율 1퍼센트 이상 함유한 혼합물</li>
                  <li>가스 상 물질류 : 14종 규정 물질을 용량비율 1퍼센트 이상 함유한 혼합물</li>
                  <li>
                    허가대상물질 12종 : 5 물질을 중량비율 0.5퍼센트 이상 함유한 혼합물, 1~4 & 6~11
                    물질을 중량비율 1퍼센트 이상 함유한 혼합물
                  </li>
                  <li>분진 7종</li>
                  <li>물리적 유해인자 8종</li>
                  <li>야간작업 2종</li>
                  <li>금속가공유 1종</li>
                </ul>
              </div>
            </q-tooltip>
          </q-icon>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
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
  name: 'harmfulFactors'
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
  data?: Array<any>
  height?: stringNull
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  hazardClassFstCd: null,
  hazardClassSecCd: null,
  useFlag: 'Y',
  workEnvFlag: null,
  speHealthFlag: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'hazardClassFstName',
      field: 'hazardClassFstName',
      label: '유해인자 대분류',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'hazardClassSecName',
      field: 'hazardClassSecName',
      label: '유해인자 분류',
      align: 'center',
      style: 'width:220px',
      sortable: true
    },
    {
      name: 'hazardName',
      field: 'hazardName',
      label: '유해인자명',
      align: 'left',
      style: 'width:400px',
      type: 'link',
      sortable: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'Cas No.',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    // {
    //   name: 'chemNmKrs',
    //   field: 'chemNmKrs',
    //   label: '관련화학물질명',
    //   align: 'center',
    //   sortable: true,
    // },
    {
      name: 'workMeasCycleName',
      field: 'workMeasCycleName',
      label: '작업환경측정 주기',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'factorMeasCycleName',
      field: 'factorMeasCycleName',
      label: '유해인자측정 주기',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'workEnvFlag',
      field: 'workEnvFlag',
      label: '작업환경 관련여부',
      align: 'center',
      type: 'color',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'speHealthFlag',
      field: 'speHealthFlag',
      label: '특수검진 관련여부',
      align: 'center',
      type: 'color',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'useFlagName',
      field: 'useFlagName',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const useFlagItems = ref<codeMasterType>([])
const workFlagItems = ref<codeMasterType>([])
const occSecItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.sai.hazard.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  workFlagItems.value = [
    { code: 'Y', codeName: $language('관련') },
    { code: 'N', codeName: $language('무관') }
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
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '유해인자 상세'
  popupOptions.value.param = { hazardCd: row ? row.hazardCd : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./harmfulFactorsDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 대분류 선택값 변경시 실행
 *******************************/
function datachange(_data: any) {
  const hazardClassFstCd = JSON.parse(JSON.stringify(_data)).value
  $http({
    url: $format(selectConfig.sys.code.mst.list.attr.url, 'HAZARD_CLASS_SEC_CD', hazardClassFstCd),
    method: 'GET',
    params: { srchUseFlag: 'Y' }
  }).then((_result: any) => {
    occSecItems.value = []
    searchParam.value.hazardClassSecCd = null
    _.forEach(_result.data, (_item) => {
      occSecItems.value.push({
        code: _item.code,
        codeName: _item.codeName
      })
    })
  })
}
</script>

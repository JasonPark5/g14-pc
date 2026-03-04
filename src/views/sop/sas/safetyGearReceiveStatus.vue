<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker :range="true" name="period" label="입출고일" v-model:value="period" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'safetyGear' }"
            :plantCd="searchParam.plantCd"
            label="보호구"
            name="safetyGearName"
            v-model:value="searchParam.safetyGearName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :comboItems="comboItems"
            itemText="codeName"
            itemValue="code"
            label="입/출고"
            name="typeFlag"
            v-model:value="searchParam.typeFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            type="user"
            :plantCd="searchParam.plantCd"
            label="불출담당자"
            name="giveUserId"
            v-model:value="searchParam.giveUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            type="user"
            :plantCd="searchParam.plantCd"
            label="수령인"
            name="userId"
            v-model:value="searchParam.userId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="보호구 입/출고 현황"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'relatePrice'">
          <span v-if="props.row.typeName === '입고'"> {{ setCost(props.row) }} 원 </span>
          <span v-else />
        </template>
      </template>
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
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
  name: 'safetyGearReceiveStatus'
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
  columns?: Array<tableColumnType>
  data?: Array<object>
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
const searchParam = ref({
  plantCd: null,
  startYmd: '',
  endYmd: '',
  typeFlag: null,
  safetyGearId: '',
  safetyGearName: '',
  userId: '',
  giveUserId: ''
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'plantCd' },
    { index: 1, colName: 'safetyGearId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'safetyGearName',
      field: 'safetyGearName',
      label: '보호구',
      style: 'width:160px',
      align: 'center',
      sortable: true,
      type: 'link'
    },
    // {
    //   name: 'supplyVendorName',
    //   field: 'supplyVendorName',
    //   label: '공급업체',
    //   style: 'width:110px',
    //   align: 'center',
    //   sortable: true,
    // },
    {
      name: 'typeName',
      field: 'typeName',
      label: '구분',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'relateDate',
      field: 'relateDate',
      label: '입/출고일',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'relatePrice',
      field: 'relatePrice',
      label: '단가',
      style: 'width:100px',
      align: 'right',
      type: 'custom',
      sortable: true
    },
    {
      name: 'relateCount',
      field: 'relateCount',
      label: '입/출고수량',
      style: 'width:80px',
      align: 'right',
      sortable: true
    },
    {
      name: 'unitName',
      field: 'unitName',
      label: '단위',
      align: 'center',
      style: 'width:70px',
      sortable: true
    },
    {
      name: 'giveUserName',
      field: 'giveUserName',
      label: '불출담당자',
      align: 'left',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '수령인',
      align: 'left',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      style: 'width:100px',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const period = ref<Array<stringNull>>([])
const comboItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.sop.sas.recepit.list.url
  // code setting
  comboItems.value = [
    { code: 'Y', codeName: $language('입고') },
    { code: 'N', codeName: $language('출고') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세 팝업창 표시
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '보호구 입출고 현황 상세'
  popupOptions.value.param = { safetyGearId: row ? row.safetyGearId : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safetyGearReceiveStatusDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 금액에 세자리마다 컴마 찍기
 *******************************/
function setCost(row: any) {
  return toThousandFilter(row.relatePrice)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

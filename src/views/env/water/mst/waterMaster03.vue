<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
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
      ref="table"
      title="전력량계 목록"
      :columns="wattGrid.columns"
      :data="wattGrid.data"
      :columnSetting="false"
      :isExcelDown="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && wattGrid.data!.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="wattGrid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'waterMaster03'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

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
  columns: Array<tableColumnType>
  data?: Array<any>
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
const useFlagItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const saveUrl = ref('')
const editable = ref(true)
const isSave = ref(false)
const table = ref<any>(null)
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const wattGrid = ref<gridType>({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      type: 'plant',
      sortable: true
    },
    {
      name: 'envWaterMstWattmeterNo',
      field: 'envWaterMstWattmeterNo',
      label: '전력량계관리번호',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'text'
    },
    {
      required: true,
      name: 'envWaterMstWattmeterName',
      field: 'envWaterMstWattmeterName',
      label: '전력량계명',
      style: 'width:150px',
      align: 'left',
      type: 'text',
      sortable: true
    },
    // {
    //   name: 'wattmeterUnit',
    //   field: 'wattmeterUnit',
    //   label: '단위',
    //   align: 'center',
    //   style: 'width:60px',
    //   sortable: false,
    //   type: 'text'
    // },
    {
      name: 'maxValue',
      field: 'maxValue',
      label: '최대값',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'number'
    },
    {
      name: 'wattmeterMagnification',
      field: 'wattmeterMagnification',
      label: '배율',
      align: 'center',
      style: 'width:60px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      sortable: true,
      type: 'check',
      true: 'Y',
      false: 'N'
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
  listUrl.value = selectConfig.env.water.mst.wattmeter.list.url
  saveUrl.value = transactionConfig.env.water.mst.wattmeter.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 전력량계 목록조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    wattGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function add() {
  wattGrid.value.data?.splice(0, 0, {
    plantCd: null, // 사업장코드
    envWaterMstWattmeterId: uid(), // 수질전력량계 일련번호
    envWaterMstWattmeterName: '', // 수질전력량계명
    envWaterMstWattmeterNo: '', // 수질전력량계 관리번호
    wattmeterMagnification: '1',
    deptCd: '', // 관리부서 코드
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function save() {
  if (validTable(wattGrid.value.columns, wattGrid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

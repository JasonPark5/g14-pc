<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
      ref="table"
      title="온실가스 관리"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addData" />
          <c-btn
            v-if="editable && grid.data!.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveData"
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
  name: 'greenhouseGasManage'
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
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
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
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    // {
    //   name: 'plantCd',
    //   field: 'plantCd',
    //   label: '사업장',
    //   align: 'center',
    //   type: 'plant',
    //   sortable: false,
    //   style: 'width: 150px'
    // },
    // {
    //   required: true,
    //   name: 'envGhgMstCode',
    //   field: 'envGhgMstCode',
    //   label: '코드',
    //   align: 'center',
    //   type: 'text',
    //   style: 'width: 150px',
    //   sortable: false
    // },
    {
      required: true,
      name: 'envGhgMstName',
      field: 'envGhgMstName',
      label: '온실가스 명',
      align: 'left',
      type: 'text',
      style: 'width: 500px',
      sortable: false
    },
    // {
    //   name: 'chemicalFormula',
    //   field: 'chemicalFormula',
    //   label: '화학식',
    //   align: 'center',
    //   type: 'text',
    //   style: 'width: 150px',
    //   sortable: false
    // },
    {
      name: 'gwpContent',
      field: 'gwpContent',
      label: 'GWP',
      helpcomment:
        '지구온난화지수(Global Warming Potential)로, 온실가스 배출량에 곱하여 이산화탄소 환산량(CO2e)을 계산하는 데 사용된다. <br/>이산화탄소를 제외한 다른 온실가스를 이산화탄소 기준으로 환산해 비교하는 데 사용된다.',
      align: 'center',
      type: 'number',
      style: 'width: 150px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      type: 'number'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const editable = ref(true)
const useFlagItems = ref<Array<codeMasterType>>([])
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')

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
  saveUrl.value = transactionConfig.env.ghg.master.save.url
  listUrl.value = selectConfig.env.ghg.master.list.url
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
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addData() {
  grid.value.data?.splice(0, 0, {
    plantCd: '',
    envGhgMstId: '',
    envGhgMstCode: '',
    envGhgMstName: '',
    chemicalFormula: '',
    sortOrder: grid.value.data.length + 1,
    gwpContent: '',
    useFlag: 'Y',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
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

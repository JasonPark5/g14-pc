<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :editable="editable"
            label="연료명"
            name="title"
            v-model:value="searchParam.title">
          </c-text>
        </div> -->
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
      title="특정토양오염 물질 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="true"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
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
  name: 'soilPollutantMaster'
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
  columns: Array<tableColumnType>
  //data?: Array<any>
  data: Array<any>
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
    //   style: 'width:100px',
    //   sortable: false,
    //   type: 'plant'
    // },
    {
      name: 'envSoilPollutantMstNo',
      field: 'envSoilPollutantMstNo',
      label: 'IEPS특정토양오염물질코드',
      style: 'width:100px',
      align: 'center',
      sortable: true,
      type: 'text'
    },
    {
      required: true,
      name: 'envSoilPollutantMstName',
      field: 'envSoilPollutantMstName',
      label: '특정토양오염물질명',
      style: 'width:200px',
      align: 'left',
      sortable: true,
      type: 'text'
    },
    {
      name: 'soilPollutantUnitCd',
      field: 'soilPollutantUnitCd',
      label: '단위',
      align: 'center',
      style: 'width: 60px',
      sortable: true,
      type: 'select',
      codeGroupCd: 'SOIL_POLLUTANT_UNIT_CD' // 코드그룹 추가
    },
    {
      name: 'envSoilEmissionStandard',
      field: 'envSoilEmissionStandard',
      label: '허가배출기준',
      style: 'width:100px',
      type: 'number',
      align: 'right',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
//const defaultUnit = 'SPUC000001'
const useFlagItems = ref<Array<codeMasterType>>([])
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
  listUrl.value = selectConfig.env.soil.mst.pollutant.list.url
  saveUrl.value = transactionConfig.env.soil.mst.pollutant.save.url
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
function add() {
  grid.value.data?.splice(0, 0, {
    envAirMstMaterialId: uid(),
    plantCd: '1000', // 사업장
    envSoilPollutantMstNo: '',
    envSoilPollutantMstName: '',
    soilPollutantUnitCd: 'SPUC000001',
    envSoilEmissionStandard: '',
    useFlag: 'Y', // 사용여부

    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data!)) {
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

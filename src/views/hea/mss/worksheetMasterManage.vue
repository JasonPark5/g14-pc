<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
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
    title="부담작업 기준목록"
    tableId="table"
    :columns="grid.columns"
    :data="grid.data"
    :columnSetting="false"
    :editable="editable"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn
          v-if="editable"
          :url="saveUrl"
          :isSubmit="isSave"
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
  name: 'worksheetMasterManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  columns: Array<tableColumnType>
  data: Array<any>
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
  plantCd: null as stringNull,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   style: 'width: 40px',
    //   sortable: true
    // },
    {
      name: 'heavyWorkName',
      field: 'heavyWorkName',
      label: '부담작업명',
      align: 'center',
      style: 'width: 80px',
      type: 'text',
      sortable: true
    },
    {
      name: 'exposureTime',
      field: 'exposureTime',
      label: '노출시간',
      align: 'right',
      type: 'number',
      style: 'width: 80px',
      sortable: true,
      required: true
    },
    {
      name: 'exopsureCnt',
      field: 'exopsureCnt',
      label: '노출빈도',
      align: 'right',
      type: 'number',
      style: 'width: 80px',
      sortable: true,
      required: true
    },
    {
      name: 'bodyDesc',
      field: 'bodyDesc',
      label: '신체부위',
      align: 'left',
      type: 'text',
      style: 'width: 200px',
      sortable: true
    },
    {
      name: 'positionDesc',
      field: 'positionDesc',
      label: '작업자세 및 내용',
      align: 'left',
      type: 'text',
      // style: 'width: 150px',
      sortable: true
    },
    {
      name: 'weightDesc',
      field: 'weightDesc',
      label: '무게',
      align: 'left',
      type: 'text',
      style: 'width: 320px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:80px',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])
const editable = ref(true)
const isSave = ref(false)
const saveable = ref(false)
const dataeditable = ref(false)
const listUrl = ref('')
const updateUrl = ref('')
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
onBeforeMount(() => {
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
  dataeditable.value = false
  // url setting
  listUrl.value = selectConfig.hea.heavyWork.list.url
  saveUrl.value = transactionConfig.hea.heavyWork.update.url
  updateUrl.value = transactionConfig.hea.heavyWork.update.url
  // code setting
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
  saveable.value = false
}

/******************************
 * TODO (목적): 작성한 마스터정보 저장_
 *******************************/
function saveData() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message:
        '저장하시겠습니까? * 기준정보가 변경될 경우 입력중인 계획의 부담작업 평가결과 갱신이 필요합니다.',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
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

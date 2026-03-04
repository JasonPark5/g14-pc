<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
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
      title="검사항목 목록"
      tableId="table"
      :columns="inspectGrid.columns"
      :data="inspectGrid.data"
      :columnSetting="false"
      :isExcelDown="false"
      rowKey="envWaterMstInspectItemId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addData" />
          <c-btn
            v-if="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="inspectGrid.data"
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
import { InspectItemType } from './waterMasterType'
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster06'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  columns: tableColumnType
  data: Array<InspectItemType>
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
const listUrl = ref('')
const saveUrl = ref('')
const editable = ref(true)
const isSave = ref(false)
const useFlagItems = ref<Array<codeMasterType>>([])
const searchParam = ref({
  useFlag: 'Y'
})
const inspectGrid = ref<gridType>({
  columns: [
    {
      name: 'inspectItemIepsCd',
      field: 'inspectItemIepsCd',
      label: 'IEPS오염물질코드',
      style: 'width: 100px',
      align: 'center',
      sortable: true,
      type: 'text'
    },
    {
      required: true,
      name: 'envWaterMstInspectItemName',
      field: 'envWaterMstInspectItemName',
      label: '오염물질명',
      style: 'width: 200px',
      align: 'left',
      sortable: true,
      type: 'text'
    },
    {
      name: 'waterInspectUnitCd',
      field: 'waterInspectUnitCd',
      label: '단위',
      align: 'center',
      style: 'width: 80px',
      sortable: true,
      type: 'select',
      codeGroupCd: 'WATER_INSPECT_UNIT_CD'
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '법적기준',
      align: 'center',
      style: 'width: 60px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'innerStandard',
      field: 'innerStandard',
      label: '내부기준',
      align: 'center',
      type: 'number',
      style: 'width: 60px',
      sortable: true
    },
    {
      name: 'method',
      field: 'method',
      label: '검사방법(기기명)',
      style: 'width: 150px',
      align: 'left',
      sortable: false,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width: 30px',
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
  listUrl.value = selectConfig.env.water.mst.inspect.list.url
  saveUrl.value = transactionConfig.env.water.mst.inspect.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    inspectGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (validTable(inspectGrid.value.columns, inspectGrid.value.data!)) {
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
/******************************
 * TODO (목적): 등록
 *******************************/
function addData() {
  inspectGrid.value.data.unshift({
    envWaterMstInspectItemId: '',
    envWaterMstInspectItemName: '',
    legalStandard: '',
    useFlag: 'Y',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
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

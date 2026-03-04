<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
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
      title="위험물 및 지정수량"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :usePaging="false"
      @table-data-change="tableDataChange"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" :showLoading="false" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable"
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
import { dangerItemType } from './dangerItem'

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
  name: 'dangerItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
const editable = ref(true)
const searchParam = ref({
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
const regulatedItems = ref<Array<dangerItemType>>([])
const columnUrl = ref('')
const listUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)

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
  columnUrl.value = selectConfig.mdm.mam.regulation.item.list.url
  listUrl.value = selectConfig.chm.base.dangerItem.list.url
  saveUrl.value = transactionConfig.chm.base.dangerItem.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  setColumns()
  getList()
}
/******************************
 * TODO (목적): 위험물 품목별 지정수량 조회
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
 * TODO (목적): 위험물 품목별 지정수량 컬럼 셋팅
 *******************************/
function setColumns() {
  $http({
    url: columnUrl.value,
    method: 'GET',
    params: {
      regulationBillCd: 'D140', // 위험물안전관리법
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    regulatedItems.value = _result.data
    grid.value.columns = [
      {
        name: 'danger',
        field: 'danger',
        label: '위험물',
        child: [
          {
            name: 'regulatedItemCd',
            field: 'regulatedItemCd',
            label: '유별',
            align: 'center',
            style: 'width:100px',
            sortable: true,
            required: true,
            type: 'select',
            itemText: 'regulatedItemName',
            itemValue: 'regulatedItemCd',
            comboItems: regulatedItems.value
          },
          {
            name: 'regulationDesc',
            field: 'regulationDesc',
            label: '성질',
            align: 'left',
            sortable: true,
            type: 'text',
            style: 'width:100px'
          },
          {
            name: 'dangerItemName',
            field: 'dangerItemName',
            label: '품명',
            align: 'left',
            sortable: true,
            style: 'width:200px',
            type: 'text',
            required: true
          }
        ]
      },
      {
        name: 'designatedQuantity',
        field: 'designatedQuantity',
        label: '지정수량표기',
        align: 'left',
        sortable: true,
        style: 'width:150px',
        type: 'text'
      },
      {
        name: 'quantity',
        field: 'quantity',
        label: '지정수량값(kg/리터)',
        align: 'center',
        style: 'width:100px',
        sortable: false,
        type: 'number',
        required: true
      },
      {
        name: 'sortOrder',
        field: 'sortOrder',
        label: '순번',
        align: 'center',
        style: 'width:80px',
        sortable: false,
        type: 'number'
      },
      {
        name: 'useFlag',
        field: 'useFlag',
        label: '사용여부',
        align: 'center',
        style: 'width:90px',
        sortable: true,
        type: 'check',
        true: 'Y',
        false: 'N'
      }
    ]
  })
}
/******************************
 * TODO (목적): 유형 데이터 변경에 따른 성질 정보 표시
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'regulatedItemCd') {
    const data = _.find(regulatedItems.value, {
      regulatedItemCd: _props.row[col.name]
    }) as dangerItemType
    if (data) {
      _props.row.regulatedItemName = data.regulatedItemName
      _props.row.regulationDesc = data.regulationDesc
    }
  }
}
/******************************
 * TODO (목적): 위험물 및 지정수량 추가
 *******************************/
function add() {
  if (!grid.value.data) {
    grid.value.data = []
  }
  grid.value.data.splice(0, 0, {
    chmDangerItemId: '', // 위험물 품목 번호
    regulatedItemCd: null, // 규제항목 코드
    regulatedItemName: '', // 규제항목 명
    dangerItemName: '', // 위험물 품목명
    designatedQuantity: '', // 지정수량
    sortOrder: null, // 정렬순서
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 위험물 및 지정수량 저장 전 처리
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      // TODO : 필요시 추가하세요.
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 위험물 및 지정수량 저장 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

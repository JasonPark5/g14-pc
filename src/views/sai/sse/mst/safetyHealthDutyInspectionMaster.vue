<template>
  <div>
    <c-search-box @enter="getTypeList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="edit" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-tree-table
          ref="typeTable"
          title="대분류"
          tableId="typegrid"
          :columns="typegrid.columns"
          :data="typegrid.data"
          parentProperty="attrVal1"
          customID="code"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          :isFixExpand="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <c-btn label="검색" icon="search" @btnClicked="getTypeList" />
          </template>
        </c-tree-table>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="itemTable"
          title="평가항목"
          tableId="itemgrid"
          :columns="itemgrid.columns"
          :data="itemgrid.data"
          :usePaging="false"
          :columnSetting="false"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addrow" />
              <c-btn
                v-if="editable && itemgrid.data.length > 0"
                label="저장"
                icon="save"
                @btnClicked="saveMst"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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
  name: 'vendorAssessItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
interface searchParamType {
  // plantCd: stringNull
  useFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<codeMasterType>
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
  //plantCd: null,
  useFlag: 'Y'
})
const itemTable = ref<any>(null)
const editable = ref(true)
const useFlagItems = ref<Array<any>>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])
const isSelectGrp = ref(false)
const selectedGroupCd = ref('')
const listUrl = ref('')
//const insertUrl = ref('')
const saveUrl = ref('')
const typeTable = ref<any>(null)
const typegrid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '대분류명',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const itemgrid = ref<gridType>({
  columns: [
    {
      name: 'checkContent',
      field: 'checkContent',
      label: '점검항목',
      align: 'left',
      type: 'text',
      // style: 'width:400px',
      sortable: false,
      required: true
    },

    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      type: 'number',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      sortable: false,
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
  listUrl.value = selectConfig.sai.sse.mst.list.url
  saveUrl.value = transactionConfig.sai.sse.mst.insert.url
  // saveUrl.value = transactionConfig.sai.sse.mst.save.url
  // code setting
  // list setting
  getTypeList()
}
/******************************
 * TODO (목적): 대분류 조회
 *******************************/
function getTypeList() {
  isSelectGrp.value = false
  getComboItems('SDP_FIELD_DEPT_ITEM_TYPE_CD').then((_result) => {
    typegrid.value.data = _result
    rowClick(typegrid.value.data[0])
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  isSelectGrp.value = true
  selectedGroupCd.value = row.code
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      useFlag: searchParam.value.useFlag,
      parentItemId: row.code
    }
  }).then((_result: any) => {
    itemgrid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 평가항목 행 추가
 *******************************/
function addrow() {
  itemgrid.value.data.push({
    // plantCd: searchParam.value.plantCd, // 사업장코드
    //sdpSemiCheckItemId: null, // 평가항목명 일련번호, 추가
    sortOrder: itemgrid.value.data.length + 1, // 정렬순서
    parentItemId: selectedGroupCd.value, // 대분류
    itemNm: '', // 평가항목명
    useFlag: 'Y', // 사용여부
    editFlag: 'C', // editFlag 추가
    regUserId: user.value.userId
  })
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveMst() {
  if (validTable(itemgrid.value.columns, itemgrid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      confirmCallback: () => {
        $http({
          url: saveUrl.value,
          method: 'POST',
          data: itemgrid.value.data
        }).then(() => {
          message.requestSuccess()
          rowClick({ code: selectedGroupCd.value })
        })
      },
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

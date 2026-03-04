<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="SITE_HYGIENE_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="siteHygieneTypeCd"
            label="항목구분"
            v-model:value="searchParam.siteHygieneTypeCd"
          />
        </div>
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
      title="현장산업위생일지 목록"
      rowKey="hygieneJournalItemId"
      :columns="grid.columns"
      :data="grid.data"
      :editable="editable"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" :showLoading="false" icon="add" @btnClicked="add" />
          <c-btn
            v-show="editable && grid.data.length > 0"
            :url="insertUrl"
            :isSubmit="isSave"
            :param="grid.data"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="saveItem"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
          <!-- <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            :showLoading="false"
            :editable="editable"
            icon="remove"
            @btnClicked="remove"
          /> -->
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
import { siteIndHygieneJournalItemType } from './siteIndHygieneType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'siteIndHygieneJournalItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** message 호출 */
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
interface searchParamType {
  plantCd: stringNull
  trainingTypeCd: stringNull
  siteHygieneTypeCd: stringNull
  useFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<siteIndHygieneJournalItemType>
}

/******************************
 * @inject_선언
 *******************************/

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
const isSave = ref(false)
const searchParam = ref<searchParamType>({
  plantCd: null,
  trainingTypeCd: null,
  siteHygieneTypeCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const useFlagItems = [
  { code: 'Y', codeName: getLanguage('사용') },
  { code: 'N', codeName: getLanguage('미사용') }
]
const table = ref<any>(null)
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')

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
  listUrl.value = selectConfig.hea.sih.item.list.url
  insertUrl.value = transactionConfig.hea.sih.item.insert.url
  deleteUrl.value = transactionConfig.hea.sih.item.delete.url
  // code setting
  // list setting
  setHeader()
  getList()
}

/******************************
 * TODO (목적): 그리드 헤더 세팅
 *******************************/
const setHeader = () => {
  getComboItems('SITE_HYGIENE_TYPE_CD').then((_result) => {
    grid.value.columns = [
      {
        required: true,
        name: 'plantCd',
        field: 'plantCd',
        label: '사업장',
        align: 'center',
        sortable: true,
        style: 'width:100px',
        type: 'plant'
      },
      {
        required: true,
        name: 'siteHygieneTypeCd',
        field: 'siteHygieneTypeCd',
        label: '항목구분',
        align: 'center',
        sortable: true,
        style: 'width:130px',
        type: 'select',
        itemText: 'codeName',
        itemValue: 'code',
        comboItems: _result
      },
      {
        required: true,
        name: 'hygieneItemName',
        field: 'hygieneItemName',
        label: '항목명',
        align: 'left',
        sortable: true,
        style: 'width:600px',
        type: 'text'
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
      },
      {
        name: 'sortOrder',
        field: 'sortOrder',
        label: '정렬순서',
        align: 'center',
        sortable: true,
        style: 'width:100px',
        type: 'number'
      }
    ]
  })
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
const getList = () => {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 현장산업위생일지 목록 행 추가
 *******************************/
const add = () => {
  const addRowData = {
    plantCd: '',
    siteHygieneTypeCd: null,
    hygieneJournalItemId: uid(),
    hygieneItemName: '',
    sortOrder: '',
    useFlag: 'Y',
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  }
  grid.value.data.unshift(addRowData)
}
/******************************
 * TODO (목적): 현장산업위생일지 목록 저장
 *******************************/
const saveItem = () => {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
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
const saveCallback = () => {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 현장산업위생일지 목록 삭제
 *******************************/
// const remove = () => {
//   const selectData = table.value.compoTable.selected

//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'warning', // success / info / warning / error
//       // 확인 callback 함수
//       confirmCallback: () => {
//         $http({
//           url: deleteUrl.value,
//           method: 'DELETE',
//           params: {
//             data: Object.values(selectData)
//           }
//         }).then((_result: any) => {
//           _.forEach(selectData, (item) => {
//             grid.value.data = _.reject(grid.value.data, {
//               hygieneJournalItemId: item.hygieneJournalItemId
//             })
//           })
//           message.requestSuccess()
//         })
//       },
//       // 취소 callback 함수
//       cancelCallback: () => {}
//     })
//   }
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

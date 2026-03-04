<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
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
    <c-table
      ref="itemTable"
      title="합동점검항목 목록"
      rowKey="saiJointInspectionItemId"
      selection="multiple"
      :columns="grid.columns"
      :data="grid.data"
      :editable="editable"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
          <c-btn v-if="editable" label="추가" :showLoading="false" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            :showLoading="false"
            :editable="editable"
            icon="remove"
            @btnClicked="removeItem"
          />
          <c-btn
            v-if="editable && grid.data.length > 0"
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
import { uid } from 'quasar'
import { consolidationItemInterface } from './consolidationItem'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'consolidationItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
interface searchParamType {
  plantCd: stringNull
  useFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<consolidationItemInterface>
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
const useFlagItems = ref<Array<any>>([])
const isSave = ref(false)
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const itemTable = ref<any>(null)
const searchParam = ref<searchParamType>({
  plantCd: null,
  useFlag: 'Y'
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
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      sortable: true,
      required: true,
      style: 'width:150px',
      type: 'plant'
    },
    {
      required: true,
      name: 'jointItemName',
      field: 'jointItemName',
      label: '점검항목',
      align: 'left',
      sortable: true,
      style: 'width:600px',
      type: 'text'
    },
    {
      required: true,
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
  listUrl.value = selectConfig.sai.joint.items.url
  insertUrl.value = transactionConfig.sai.joint.item.insert.url
  deleteUrl.value = transactionConfig.sai.joint.item.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 점검항목 목록 조회
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

function add() {
  grid.value.data.push({
    plantCd: searchParam.value.plantCd,
    saiJointInspectionItemId: uid(),
    jointItemName: '',
    useFlag: 'Y',
    sortOrder: (grid.value.data.length + 1) * 10,
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function saveItem() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
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
function removeItem() {
  const selectData = itemTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, {
              saiJointInspectionItemId: item.saiJointInspectionItemId
            })
          })
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function excelUploadData() {
  popupOptions.value.title = '합동점검 점검항목 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./consolidationItemExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result: any) {
  popupOptions.target = null
  popupOptions.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item) => {
      return !item.error_message
    })
    _.forEach(s_data, (item) => {
      item.useFlag = 'Y'
      item.editFlag = 'C'
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID
    })
    $http({
      url: insertUrl.value,
      method: 'POST',
      data: s_data
    }).then((_result: any) => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

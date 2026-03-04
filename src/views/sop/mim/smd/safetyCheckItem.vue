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
      ref="table"
      title="점검항목 목록"
      rowKey="checkItemId"
      :columns="grid.columns"
      :editable="editable"
      :data="grid.data"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" /> -->
          <c-btn v-if="editable" label="추가" :showLoading="false" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            :url="saveUrl"
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyCheckItem'
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
interface gridType {
  columns: tableColumnType
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: '',
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    // {
    //   required: true,
    //   name: 'plantCd',
    //   field: 'plantCd',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: true,
    //   style: 'width:100px',
    //   type: 'plant'
    // },
    {
      required: true,
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      align: 'left',
      sortable: true,
      style: 'width:600px',
      type: 'text'
    },
    {
      name: 'checkItemCycleCd',
      field: 'checkItemCycleCd',
      label: '점검주기',
      align: 'left',
      style: 'width:100px',
      type: 'select',
      codeGroupCd: 'MDM_SAFETY_CYCLE_CD',
      sortable: false
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
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      sortable: true,
      style: 'width:80px',
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref<codeMasterType>([])
const table = ref<any>(null)
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
  listUrl.value = selectConfig.sop.safetycheck.item.list.url
  saveUrl.value = transactionConfig.sop.safetycheck.item.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
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
  grid.value.data.splice(0, 0, {
    checkItemId: uid(),
    plantCd: '',
    checkItemName: '',
    checkItemCycleCd: null,
    sortOrder: grid.value.data.length + 1,
    useFlag: 'Y',
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
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
// function excelUploadData() {
//   popupOptions.value.title = '안전관리자 업무일지 점검항목 업로드'
//   popupOptions.value.target = shallowRef(
//     defineAsyncComponent(() => import(`./safetyCheckItemExcelUpload.vue`))
//   )
//   popupOptions.value.isFull = true
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closeExcelUploadPopup
// }
// function closeExcelUploadPopup(_result: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (_result && _result.length > 0) {
//     const s_data = _.filter(_result, (item) => {
//       return !item.error_message
//     })
//     _.forEach(s_data, (item) => {
//       item.useFlag = 'Y'
//       item.editFlag = 'C'
//       item.regUserId = user.value.userId // 등록자 ID
//       item.chgUserId = user.value.userId // 수정자 ID
//     })
//     $http({
//       url: saveUrl.value,
//       method: 'POST',
//       data: s_data
//     }).then((_result: any) => {
//       message.requestSuccess()
//       getList()
//     })
//   }
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

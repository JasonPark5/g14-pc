<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="none"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="datachange"
          />
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
            @datachange="datachange"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          title="대분류"
          :columns="grid1.columns"
          :editable="editable"
          :filtering="true"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="false"
          :isFullScreen="false"
          :data="grid1.data"
          gridHeight="770px"
          rowKey="checklistMasterId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="엑셀업로드"
                icon="upload"
                @btnClicked="excelUploadData"
              />
              <c-btn v-if="editable" label="추가" icon="add_circle" @btnClicked="add('FST')" />
              <c-btn
                v-show="editable && grid1.data.length > 0"
                :url="saveUrl"
                :isSubmit="isSave1"
                :param="grid1.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveChecklist('FST')"
                @btnCallback="(result: any) => saveCallback(result, 'FST')"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props }">
            <q-icon
              v-if="props.row.editFlag !== 'C'"
              name="arrow_forward_ios"
              size="sm"
              color="blue"
              class="cursor-pointer"
              @click.stop="rowClick(props.row)"
            />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="중분류"
          :filtering="true"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="false"
          :isFullScreen="false"
          :columns="grid2.columns"
          :editable="editable"
          :data="grid2.data"
          gridHeight="770px"
          rowKey="checklistMasterId"
        >
          <template v-slot:table-chip>
            <q-chip outline square color="primary">
              {{ checklistName }}
            </q-chip>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && isSelect"
                label="추가"
                icon="add_circle"
                @btnClicked="add('SEC')"
              />
              <c-btn
                v-show="editable && isSelect && grid2.data.length > 0"
                :url="saveUrl"
                :isSubmit="isSave2"
                :param="grid2.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveChecklist('SEC')"
                @btnCallback="(result: any) => saveCallback(result, 'SEC')"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <c-dialog :param="popupOptions" />
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
  name: 'ctoChecklistMaster'
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
  target: null,
  top: '',
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  checklistLevelCd: '1',
  useFlag: 'Y'
})
const grid1 = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'checklistName',
      field: 'checklistName',
      style: 'width:300px',
      type: 'text',
      label: '항목명',
      align: 'left',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      style: 'width:60px',
      type: 'number',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      type: 'check',
      sortable: false,
      true: 'Y',
      false: 'N'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '중분류',
      align: 'center',
      style: 'width:30px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'checklistName',
      field: 'checklistName',
      label: '항목명',
      type: 'text',
      align: 'left',
      sortable: true
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      style: 'width:80px',
      type: 'number',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      type: 'check',
      sortable: false,
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const useFlagItems = ref<codeMasterType>([])
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const isSave1 = ref(false)
const isSave2 = ref(false)
const listUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref('')
const select = ref<any>({
  checklistMasterId: '',
  checklistName: ''
})

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return Boolean(select.value.checklistMasterId)
})
const checklistName = computed(() => {
  return select.value.checklistName ? select.value.checklistName : '선택 X'
})

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
  listUrl.value = selectConfig.sop.cto.stdchecklist.list.url
  deleteUrl.value = transactionConfig.sop.cto.stdchecklist.delete.url
  saveUrl.value = transactionConfig.sop.cto.stdchecklist.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
function getList() {
  grid1.value.data = []
  grid2.value.data = []
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid1.value.data = _result.data
    grid2.value.data = []
  })
}
function datachange() {
  getList()
}
function rowClick(row: any) {
  select.value = row
  underList()
}
function underList() {
  grid2.value.data = []
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      parentChecklistMasterId: select.value.checklistMasterId,
      useFlag: 'Y',
      checklistLevelCd: '2'
    }
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}
function add(type: any) {
  if (type === 'FST') {
    grid1.value.data.splice(0, 0, {
      checklistMasterId: uid(),
      checklistName: '',
      plantCd: searchParam.value.plantCd,
      checklistLevelCd: '1',
      parentChecklistMasterId: '',
      useFlag: 'Y',
      sortOrder: grid1.value.data.length + 1,
      regUserId: user.value.userId,
      editFlag: 'C'
    })
  } else {
    grid2.value.data.splice(0, 0, {
      checklistMasterId: uid(),
      checklistName: '',
      plantCd: searchParam.value.plantCd,
      checklistLevelCd: '2',
      parentChecklistMasterId: select.value.checklistMasterId,
      useFlag: 'Y',
      sortOrder: grid2.value.data.length + 1,
      regUserId: user.value.userId,
      editFlag: 'C'
    })
  }
}
function saveChecklist(type: any) {
  const validItem = type === 'FST' ? grid1.value.data : grid2.value.data
  const validColumns = type === 'FST' ? grid1.value.columns : grid2.value.columns
  if (validTable(validColumns, validItem)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        if (type === 'FST') {
          isSave1.value = !isSave1.value
        } else {
          isSave2.value = !isSave2.value
        }
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveCallback(_result: any, type: any) {
  message.requestSuccess()
  if (type === 'FST') {
    getList()
  } else {
    underList()
  }
}
function excelUploadData() {
  popupOptions.value.title = '행동관찰 체크리스트 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./ctoChecklistMasterExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item) => {
      return !item.error_message
    })
    const mst_data = [] as any
    const mst_data_targetName = [] as any
    _.forEach(s_data, (item) => {
      item.useFlag = 'Y'
      item.regUserId = user.value.userId // 등록자 ID
      if (_.indexOf(mst_data_targetName, item.plantCd + item.mchecklistName) < 0) {
        mst_data_targetName.push(item.plantCd + item.mchecklistName)
        mst_data.push({
          checklistMasterId: uid(),
          checklistName: item.mchecklistName,
          plantCd: item.plantCd,
          checklistLevelCd: '1',
          parentChecklistMasterId: '',
          useFlag: 'Y',
          sortOrder: item.msortOrder,
          regUserId: user.value.userId,
          editFlag: 'C',
          items: []
        })
      }
    })
    _.forEach(mst_data, (_mst) => {
      _.forEach(s_data, (item) => {
        if (_mst.plantCd + _mst.checklistName == item.plantCd + item.mchecklistName) {
          item.useFlag = 'Y'
          item.regUserId = user.value.userId // 등록자 ID
          _mst.items.push({
            checklistMasterId: uid(),
            checklistName: item.checklistName,
            plantCd: item.plantCd,
            checklistLevelCd: '2',
            parentChecklistMasterId: '',
            useFlag: 'Y',
            sortOrder: item.sortOrder,
            regUserId: user.value.userId,
            editFlag: 'C'
          })
        }
      })
    })

    $http({
      url: saveUrl.value + '/excel',
      method: 'POST',
      data: mst_data
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

<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="LAW_ID"
            itemText="codeName"
            itemValue="code"
            label="법령"
            name="lawId"
            v-model:value="searchParam.lawId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="사용여부"
            name="useFlag"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="gubunTable"
      title="법규등록부 목록"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @innerBtnClicked="innerBtnClicked"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
          <c-btn v-if="editable" label="법령추가" icon="add" @btnClicked="addRowRaw" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="saveData"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveInfoCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <c-text-column
          :editable="editable"
          :col="col"
          :props="props"
          v-model:value="props.row[col.name]"
          @datachange="datachange(props.row)"
        />
        <div v-if="editable">
          <q-btn-group outline class="ColumInnerBtnGroup">
            <q-btn
              icon="add"
              color="orange"
              text-color="white"
              class="ColumInnerBtn"
              align="center"
              @click.prevent="innerBtnClicked(col, props)"
            >
              <q-tooltip>
                {{ $language('구분별 항목 추가') }}
              </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
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
import { lawRegisterItemType } from './lawRegister'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'lawRegister'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
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
  data: Array<lawRegisterItemType>
  merge?: Array<tableMergeType>
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
  lawId: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'lawId' },
    { index: 1, colName: 'saiLawRegisterMasterId' },
    { index: 2, colName: 'saiLawRegisterMasterId' }
  ],
  columns: [
    {
      name: 'lawName',
      field: 'lawName',
      label: '법령명',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      innerBtn: true,
      btns: [
        {
          icon: 'add',
          color: 'teal',
          tooltip: '법령별 구분 추가'
        }
      ]
    },
    {
      required: true,
      name: 'gubunName',
      field: 'gubunName',
      label: '구분',
      align: 'left',
      style: 'width:120px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'sortOrder1',
      field: 'sortOrder1',
      label: '구분순번',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'number'
    },
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '항목',
      type: 'text',
      align: 'left',
      style: 'width:150px',
      sortable: true
    },
    {
      required: true,
      name: 'relevantClause',
      field: 'relevantClause',
      label: '관련조항',
      type: 'text',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'requirements',
      field: 'requirements',
      label: '요구사항',
      type: 'textarea',
      align: 'left',
      style: 'width:220px',
      sortable: true
    },
    {
      name: 'applyConstruction',
      field: 'applyConstruction',
      label: '적용사항',
      type: 'text',
      align: 'left',
      style: 'width:140px',
      sortable: true
    },
    {
      name: 'target',
      field: 'target',
      label: '적용대상',
      type: 'text',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'relatedDocument',
      field: 'relatedDocument',
      label: '관련문서(기록)',
      type: 'textarea',
      align: 'left',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      type: 'check',
      sortable: true,
      align: 'center',
      style: 'width:40px',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      sortable: true,
      style: 'width:40px',
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
const saveData = ref<Array<lawRegisterItemType>>([])
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const excelUrl = ref('')

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
  listUrl.value = selectConfig.sai.lawRegister.item.list.url
  saveUrl.value = transactionConfig.sai.lawRegister.gubun.save.url
  excelUrl.value = transactionConfig.sai.lawRegister.gubun.excel.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
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
 * TODO (목적): 데이터 변경 시 수정자 정보 셋팅
 * @param (1): 행 전체 정보
 *******************************/
function datachange(row: any) {
  if (row.editFlag !== 'C') {
    row.editFlag = 'U'
    row.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 행 추가 버튼 클릭
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 *******************************/
function innerBtnClicked(col: tableColumnType, _props: any) {
  if (col.name === 'lawName') {
    // 법령별 구분 추가
    grid.value.data.splice(_props.rowIndex, 0, {
      saiLawRegisterMasterId: uid(), // 법규등록부 구분 일련번호
      lawId: _props.row.lawId,
      lawName: _props.row.lawName,
      gubunName: '', // 구분
      useFlag: 'Y', // 사용여부
      editFlag: 'C',
      regUserId: user.value.userId,
      // 항목 정보
      saiLawRegisterMasterItemId: uid(), // 법규등록부 항목 일련번호
      sortOrder: grid.value.data.length + 1,
      sortOrder1: _props.row.sortOrder1 + 1,
      itemName: '', // 항목
      relevantClause: '', // 관련조항
      requirements: '', // 요구사항
      applyConstruction: '', // 적용사항
      target: '', // 적용대상
      relatedDocument: '' // 관련문서(기록)
    })
  } else if (!_props.row.gubunName || _props.row.gubunName.length === 0) {
    // 구분명 없으면 항목추가 안됨
    message.alert({
      title: '안내',
      message: '구분명을 입력해주세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    // 구분별 항목 추가
    grid.value.data.splice(_props.rowIndex, 0, {
      saiLawRegisterMasterId: _props.row.saiLawRegisterMasterId, // 법규등록부 구분 일련번호
      lawId: _props.row.lawId,
      lawName: _props.row.lawName,
      gubunName: _props.row.gubunName, // 구분
      useFlag: _props.row.useFlag, // 사용여부
      regUserId: user.value.userId,
      sortOrder: grid.value.data.length + 1,
      sortOrder1: _props.row.sortOrder1,
      // 항목 정보
      saiLawRegisterMasterItemId: uid(), // 법규등록부 항목 일련번호
      itemName: '', // 항목
      relevantClause: '', // 관련조항
      requirements: '', // 요구사항
      applyConstruction: '', // 적용사항
      target: '', // 적용대상
      relatedDocument: '', // 관련문서(기록)
      editFlag: 'C'
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addRowRaw() {
  popupOptions.value = getPopupOptions('lawCode', popupOptions.value, closeLawGubunPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeLawGubunPopup(data: Array<codeMasterType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      let _idx = _.findIndex(grid.value.data, { lawId: item.code })
      _idx = _idx > -1 ? _idx : 0
      grid.value.data.splice(_idx, 0, {
        saiLawRegisterMasterId: uid(), // 법규등록부 구분 일련번호
        lawId: item.code,
        lawName: item.codeName,
        gubunName: '', // 구분
        useFlag: 'Y', // 사용여부
        editFlag: 'C',
        regUserId: user.value.userId,
        sortOrder: grid.value.data.length + 1,
        sortOrder1: _idx + 1,
        // 항목 정보
        saiLawRegisterMasterItemId: uid(), // 법규등록부 항목 일련번호
        itemName: '', // 항목
        relevantClause: '', // 관련조항
        requirements: '', // 요구사항
        applyConstruction: '', // 적용사항
        target: '', // 적용대상
        relatedDocument: '' // 관련문서(기록)
      })
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveInfo() {
  if (validTable(grid.value.columns, grid.value.data)) {
    const _saveData = grid.value.data.filter(
      (item) => item.editFlag === 'C' || item.editFlag === 'U'
    )
    _saveData.forEach((item) => {
      item.chgUserId = user.value.userId
      item.sortOrder1 = Number(item.sortOrder1)
      // 전체 데이터 중 마스터 ID가 같으면서 본인이 아닌 데이터들을 찾음
      grid.value.data.forEach((target) => {
        if (target.saiLawRegisterMasterId === item.saiLawRegisterMasterId) {
          target.sortOrder1 = item.sortOrder1
          if (target.editFlag !== 'C') target.editFlag = 'U'
        }
      })
    })
    const fSaveData = grid.value.data.filter(
      (item) => item.editFlag === 'C' || item.editFlag === 'U'
    )
    saveData.value = fSaveData
    if (saveData.value.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveInfoCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '법규등록부 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./lawRegisterExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeExcelUploadPopup(_result: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data: Array<any> = _.filter(_result, (item) => !item.error_message)
    const masterIdMap = new Map() // gubunName별로 생성된 ID를 저장할 Map 객체
    _.forEach(s_data, (item) => {
      // gubunName이 같으면 동일한 MasterId 부여
      if (!masterIdMap.has(item.gubunName)) {
        masterIdMap.set(item.gubunName, uid()) // 처음 나타난 gubunName이면 새 UID 생성
      }
      item.saiLawRegisterMasterId = masterIdMap.get(item.gubunName) // Map에서 꺼내서 할당
      item.saiLawRegisterMasterItemId = uid() // ItemId는 무조건 고유값 부여
      item.sortOrder1 = Number(item.sortOrder1)
      item.sortOrder = Number(item.sortOrder)
      item.editFlag = 'C'
      item.useFlag = 'Y'
      item.regUserId = user.value.userId
    })
    $http({
      url: excelUrl.value,
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

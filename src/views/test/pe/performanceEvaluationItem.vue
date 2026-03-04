<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="PERFORMANCE_EVALUATION_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="evaluationItemTypeCd"
            label="평가영역"
            v-model:value="searchParam.evaluationItemTypeCd"
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
    <c-table ref="table" title="성과평가항목 목록" :columns="grid.columns" :data="grid.data">
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
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
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'evaluationItem'">
          <c-text-column
            :editable="editable"
            :col="col"
            :props="props"
            v-model:value="props.row[col.name]"
            @datachange="datachange(props, col)"
          />
          <div v-if="editable">
            <q-btn-group outline class="ColumInnerBtnGroup">
              <q-btn
                icon="add"
                color="red-6"
                text-color="white"
                class="ColumInnerBtn"
                align="center"
                @click.prevent="innerBtnClicked(col, props)"
              >
                <q-tooltip>
                  {{ $language('평가항목별 세부항목 추가') }}
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </div>
        </template>
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
  name: 'performanceEvaluationItem'
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
  columns: Array<tableColumnType>
  data?: Array<any>
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '40%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width:50px',
      sortable: false,
      type: 'plant'
    },
    {
      required: true,
      name: 'evaluationItemTypeCd',
      field: 'evaluationItemTypeCd',
      label: '평가영역',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'select',
      itemText: 'codeName',
      itemValue: 'code',
      codeGroupCd: 'PERFORMANCE_EVALUATION_TYPE_CD'
    },
    {
      required: true,
      name: 'evaluationItem',
      field: 'evaluationItem',
      label: '성과평가항목',
      align: 'left',
      style: 'width:250px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'evaluationItemDetail',
      field: 'evaluationItemDetail',
      label: '세부평가항목',
      align: 'left',
      style: 'width:250px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:50px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:40px',
      sortable: true,
      type: 'number'
    }
  ],
  data: []
})
const searchParam = ref({
  plantCd: null,
  evaluationTargetDept: '',
  evaluationItemTypeCd: null,
  useFlag: 'Y'
})
const useFlagItems = ref<Array<codeMasterType>>([])
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
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
  listUrl.value = selectConfig.pe.base.list.url
  saveUrl.value = transactionConfig.pe.base.save.url
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
 * TODO (목적): 새로운 행 추가
 *******************************/
function add() {
  grid.value.data?.splice(0, 0, {
    evaluationItemId: uid(), // 성과평가항목 일련번호
    plantCd: null, // 사업장
    evaluationItemTypeCd: null, // 유형
    evaluationItem: '', // 평가항목
    evaluationItemDetail: '',
    useFlag: 'Y', // 사용여부
    sortOrder: null, // 정렬순서
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 기존 행 복사 추가
 *******************************/
function innerBtnClicked(coltd: tableColumnType, propstd: any) {
  grid.value.data?.splice(propstd.rowIndex, 0, {
    evaluationItemId: uid(), // 성과평가항목 일련번호
    plantCd: propstd.row.plantCd, // 사업장
    evaluationItemTypeCd: propstd.row.evaluationItemTypeCd, // 유형
    evaluationItem: propstd.row.evaluationItem, // 평가항목
    evaluationItemDetail: '',
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): custom 타입 데이터 변경 시 수정자 정보 세팅
 *******************************/
function datachange(_props: any, _col: tableColumnType) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
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
        _.forEach(grid.value.data, (item) => {
          // if (item.targetDeptCds) {
          //   item.targetDeptCdList = item.targetDeptCds.split(',')
          // }

          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
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
 * TODO (목적): 엑셀 업로드
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '성과평가 항목 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./evaluationItemExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}

function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const _data = _.filter(_result, (item: any) => !item.error_message)
    _.forEach(_data, (item) => {
      item.useFlag = 'Y'
      item.regUserId = user.value.userId
      item.targetDeptCdList = [item.targetDeptCd]
      item.editFlag = 'C'
      if (item.evaluationItemDetail === null) item.evaluationItemDetail = ''
    })
    $http({
      url: saveUrl.value,
      method: 'PUT',
      data: _data
    }).then(() => {
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

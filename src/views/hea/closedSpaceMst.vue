<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="CLOSED_SPACE_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="closedSpaceTypeCd"
            label="밀폐공간 종류"
            v-model:value="searchParam.closedSpaceTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field label="관리자" name="managerId" v-model:value="searchParam.managerId" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'workMap' }"
            :plantCd="searchParam.plantCd"
            label="지도명"
            name="sopMapId"
            v-model:value="searchParam.sopMapId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="permitFlagItems"
            label="허가필요여부"
            itemText="codeName"
            itemValue="code"
            name="permitFlag"
            type="search"
            v-model:value="searchParam.permitFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 container">
      <c-table
        ref="table"
        title="밀폐공간 현황"
        :columns="grid.columns"
        :data="grid.data"
        :isFullScreen="false"
        :columnSetting="false"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" icon="add" label="추가" @btnClicked="addRow" />
            <!-- <c-btn
                v-if="editable && grid.data && grid.data.length > 0"
                icon="remove"
                label="삭제"
                @btnClicked="removeClick"
              /> -->
            <c-btn
              v-if="editable && grid.data && grid.data.length > 0"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="grid.data"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveClick"
              @btnCallback="saveCallback"
            />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <c-task-target
            v-if="col.name === 'managerId'"
            :editable="editable"
            :customPopupParam="{ targetKey: 'deptUser' }"
            name="managerId"
            label=""
            v-model:value="props.row[col.name]"
            @dataChange="dataChange(props)"
          />
        </template>
      </c-table>
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
  name: 'closedSpaceMst'
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
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<object>
  height?: stringNull
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
  plantCd: null,
  closedSpaceTypeCd: null,
  managerId: null,
  useFlag: 'Y',
  permitFlag: null,
  sopMapId: null,
  mapName: ''
})
const popupOptions = ref<popupParamType>({
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const useFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])
const permitFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('허가필요') },
  { code: 'N', codeName: $language('허가불필요') }
])
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width: 100px',
      type: 'plant'
    },
    {
      name: 'closedSpaceTypeCd',
      field: 'closedSpaceTypeCd',
      label: '종류',
      align: 'center',
      sortable: true,
      type: 'select',
      codeGroupCd: 'CLOSED_SPACE_TYPE_CD',
      style: 'width: 240px'
    },
    {
      name: 'heaClosedSpaceName',
      field: 'heaClosedSpaceName',
      label: '밀폐공간명',
      align: 'left',
      sortable: true,
      style: 'width: 200px',
      type: 'text'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '설명',
      align: 'left',
      sortable: false,
      type: 'text'
    },
    {
      name: 'managerId',
      field: 'managerId',
      label: '관리자',
      align: 'center',
      sortable: false,
      style: 'width: 200px',
      type: 'custom'
    },
    {
      name: 'mapName',
      field: 'mapName',
      label: '지도명',
      align: 'left',
      sortable: true,
      style: 'width:200px'
    },
    {
      name: 'permitFlag',
      field: 'permitFlag',
      label: '허가필요여부',
      align: 'center',
      sortable: true,
      style: 'width:80px',
      type: 'check',
      true: 'Y',
      false: 'N'
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
      align: 'left',
      sortable: true,
      style: 'width: 80px',
      type: 'number'
    }
  ],
  data: [],
  height: '500px'
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref(transactionConfig.hea.closedspaceMap.base.url)
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
  listUrl.value = selectConfig.hea.closedspaceMap.base.url
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
}
/******************************
 * TODO (목적): spot 추가
 *******************************/
function addRow() {
  grid.value.data?.splice(0, 0, {
    heaClosedSpaceId: uid(),
    plantCd: null,
    closedSpaceTypeCd: null,
    heaClosedSpaceName: '',
    remark: '',
    managerId: null,
    sopMapId: null,
    useFlag: 'Y',
    sortOrder: grid.value.data.length + 5,
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveClick() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item: any) => {
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
function dataChange(_props: any) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

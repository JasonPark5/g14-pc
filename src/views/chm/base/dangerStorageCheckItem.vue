<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            codeGroupCd="CHM_DANGER_TYPE_CD"
            label="구분"
            itemText="codeName"
            itemValue="code"
            name="chmDangerTypeCd"
            type="search"
            v-model:value="searchParam.chmDangerTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-task-target
            :editable="editable"
            label="위험물저장소"
            name="chmDangerMstId"
            :customPopupParam="{ targetKey: 'hazardStorage' }"
            v-model:value="searchParam.chmDangerMstId"
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="위험물저장소 점검항목 목록"
          :editable="editable"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="770px"
          :columnSetting="false"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="추가"
                :showLoading="false"
                icon="add"
                @btnClicked="add"
              />
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="grid.data"
                mappingType="POST"
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
  name: 'dangerStorageCheckItem'
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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
  chmDangerTypeCd: 'CDTC000001',
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [],
  data: []
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
  listUrl.value = selectConfig.chm.danger.masterItems.list.url
  saveUrl.value = transactionConfig.chm.danger.masterItem.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  setColumns()
  getList()
}
function setColumns() {
  $http({
    url: selectConfig.chm.danger.master.list.url,
    method: 'GET'
  }).then((_result: any) => {
    grid.value.columns = [
      {
        name: 'chmDangerTypeCd',
        field: 'chmDangerTypeCd',
        codeGroupCd: 'CHM_DANGER_TYPE_CD',
        required: true,
        label: '구분',
        align: 'center',
        style: 'width: 110px',
        sortable: true,
        type: 'select'
      },
      {
        name: 'chmDangerMstIds',
        field: 'chmDangerMstIds',
        label: '위험물저장소',
        align: 'left',
        sortable: false,
        style: 'width:120px',
        type: 'multiSelect',
        itemText: 'chmDangerArea',
        itemValue: 'chmDangerMstId',
        setHeader: true,
        comboItems: _result.data,
        isArray: false
      },
      {
        name: 'dangerCheckItem',
        field: 'dangerCheckItem',
        required: true,
        label: '점검항목',
        align: 'left',
        style: 'width: 300px',
        sortable: true,
        type: 'text'
      },
      {
        name: 'dangerCheckContent',
        field: 'dangerCheckContent',
        required: true,
        label: '점검내용',
        align: 'left',
        style: 'width: 300px',
        sortable: true,
        type: 'text'
      },
      {
        name: 'dangerCheckMethod',
        field: 'dangerCheckMethod',
        label: '점검방법',
        align: 'left',
        style: 'width: 100px',
        sortable: true,
        type: 'text'
      },
      {
        name: 'useFlag',
        field: 'useFlag',
        label: '사용여부',
        align: 'center',
        style: 'width: 50px',
        type: 'check',
        true: 'Y',
        false: 'N',
        sortable: true
      },
      {
        name: 'sortOrder',
        field: 'sortOrder',
        label: '순번',
        align: 'right',
        style: 'width: 50px',
        sortable: true,
        type: 'number'
      }
    ]
  })
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
 * TODO (목적): 행 추가
 *******************************/
function add() {
  grid.value.data!.splice(0, 0, {
    chmDangerStorageCheckItemId: uid(),
    chmDangerTypeCd: null,
    dangerCheckItem: '', // 항목
    dangerCheckContent: '', // 내용
    dangerCheckMethod: '', // 방법
    useFlag: 'Y',
    sortOrder: '',
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          if (Array.isArray(item.chmDangerMstIds)) {
            item.chmDangerMstIds = item.chmDangerMstIds.join(',')
          }
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

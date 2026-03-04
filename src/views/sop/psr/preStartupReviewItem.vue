<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="none" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="none"
            codeGroupCd="PSR_CHECK_TYPE_CD"
            default="first"
            itemText="codeName"
            itemValue="code"
            name="psrCheckTypeCd"
            label="점검유형"
            v-model:value="searchParam.psrCheckTypeCd"
            @setCodeData="getList"
            @datachange="getList"
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
            @datachange="getList"
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
          :data="grid1.data"
          gridHeight="780px"
          :filtering="true"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="false"
          :isFullScreen="false"
          :isExcelDown="false"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add1" />
              <c-btn
                v-if="editable && grid1.data!.length > 0"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="grid1.data"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="save1"
                @btnCallback="saveCallback"
              />
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props }">
            <q-chip
              color="grey-8"
              style="font-size: 11px"
              clickable
              outline
              square
              label="보기"
              @click="rowClick(props.row)"
            />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="중분류"
          :columns="grid2.columns"
          :data="grid2.data"
          gridHeight="780px"
          :filtering="true"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="false"
          :isFullScreen="false"
          :isExcelDown="false"
        >
          <template v-slot:table-chip>
            <q-chip
              v-if="selectedRow.sopPrestartupCheckItemName"
              outline
              square
              color="blue"
              size="0.9em"
            >
              {{ selectedRow.sopPrestartupCheckItemName }}
            </q-chip>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && selectedRow.sopPrestartupCheckItemName"
                label="추가"
                icon="add"
                @btnClicked="add2"
              />
              <c-btn
                v-if="editable && grid2.data!.length > 0"
                label="저장"
                icon="save"
                @btnClicked="save2"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="table3"
          title="소분류"
          :columns="grid3.columns"
          :data="grid3.data"
          gridHeight="780px"
          :filtering="true"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="false"
          :isFullScreen="false"
          :isExcelDown="false"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="thirdEditable"
                label="등록"
                icon="add"
                @btnClicked="
                  () => {
                    ;(type = '3'), openPop(null)
                  }
                "
              />
            </q-btn-group>
          </template>
        </c-table>
      </div> -->
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
  name: 'preStartupReviewItem'
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
const isSave = ref(false)
const isSave2 = ref(false)
const useFlagItems = ref<codeMasterType>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])
const searchParam = ref({
  plantCd: null,
  psrCheckTypeCd: null,
  psopPrestartupCheckItemId: '',
  useFlag: 'Y'
})
const grid1 = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'sopPrestartupCheckItemName',
      field: 'sopPrestartupCheckItemName',
      label: '항목명',
      align: 'left',
      sortable: true,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width: 60px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '상세',
      align: 'center',
      style: 'width:40px',
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
      name: 'sopPrestartupCheckItemName',
      field: 'sopPrestartupCheckItemName',
      label: '항목명',
      align: 'left',
      sortable: true,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width: 60px',
      sortable: true,
      type: 'number'
    }
  ],
  data: []
})
const selectedRow = ref<any>({})
const listUrl = ref(selectConfig.sop.psr.checkItem.list.url)
const saveUrl = ref(transactionConfig.sop.psr.checkItem.insert.url)

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
  // code setting
  // list setting
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid1.value.data = _result.data
    grid2.value.data = []
    selectedRow.value = {}
  })
}
function rowClick(_row: any) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      psopPrestartupCheckItemId: _row.sopPrestartupCheckItemId,
      useFlag: searchParam.value.useFlag,
      psrCheckTypeCd: searchParam.value.psrCheckTypeCd
    }
  }).then((_result: any) => {
    grid2.value.data = _result.data
    selectedRow.value = _row
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function add1() {
  grid1.value.data?.push({
    sopPrestartupCheckItemId: uid(),
    plantCd: searchParam.value.plantCd,
    sopPrestartupCheckItemName: '',
    psrCheckTypeCd: searchParam.value.psrCheckTypeCd,
    sortOrder:
      grid1.value.data!.length > 0
        ? grid1.value.data[grid1.value.data.length - 1].sortOrder + 1
        : 1,
    useFlag: 'Y',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function add2() {
  grid2.value.data?.push({
    sopPrestartupCheckItemId: uid(),
    psopPrestartupCheckItemId: selectedRow.value.sopPrestartupCheckItemId,
    plantCd: searchParam.value.plantCd,
    sopPrestartupCheckItemName: '',
    psrCheckTypeCd: searchParam.value.psrCheckTypeCd,
    sortOrder:
      grid2.value.data!.length > 0
        ? grid2.value.data[grid2.value.data.length - 1].sortOrder + 1
        : 1,
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 좌측테이블 저장
 *******************************/
function save1() {
  if (validTable(grid1.value.columns, grid1.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid1.value.data, (item) => {
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
 * TODO (목적): 우측테이블 저장
 *******************************/
function save2() {
  if (validTable(grid2.value.columns, grid2.value.data!)) {
    const saveData = grid2.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'PUT',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            rowClick(selectedRow.value)
          })
          isSave2.value = !isSave2.value
        },
        cancelCallback: () => {}
      })
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="table"
          title="권한"
          tableId="table"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :columns="grid.columns"
          :isExcelDown="false"
          :data="grid.data"
          :filtering="false"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getGrpList" />
            </q-btn-group>
          </template>
          <template v-slot:table-header-append>
            <c-select
              codeGroupCd="DEVICE_CD"
              codeAttrVal1="Y"
              :dense="true"
              type="none"
              class="no-label-control"
              itemText="codeName"
              itemValue="code"
              name="deviceTypeCd"
              label=""
              v-model:value="searchParam.deviceTypeCd"
              @update:value="getGrpList"
            />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="tablemenu"
          title="권한별 메뉴목록"
          tableId="tablemenu"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :columns="gridmenu.columns"
          :data="gridmenu.data"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="메뉴추가/삭제"
                icon="add"
                @btnClicked="addMenu"
                v-if="isSelected && editable"
              />
              <c-btn
                label="권한저장"
                icon="save"
                @btnClicked="saveMenu"
                v-if="isSelected && editable"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
    <q-dialog ref="menuDialog" persistent v-model="isMenuOpen">
      <q-card class="menu-card" style="width: 600px; height: 800px">
        <q-card-section class="row items-center q-pb-none px-2 py-1 bg-orange-custom text-white">
          <div class="text-h6">메뉴</div>
          <q-space />
          <q-btn icon="done" flat round dense @click="selectMenu">
            <q-tooltip> 메뉴추가 및 삭제 </q-tooltip>
          </q-btn>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="menu-content p-2">
          <q-tree
            dense
            ref="menuTreeRef"
            :nodes="menuTree"
            node-key="sysMenuId"
            label-key="menuNm"
            children-key="children"
            :default-expand-all="false"
            selected-color="primary"
            tick-strategy="leaf"
            v-model:ticked="ticked"
            :editable="editable"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
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
import arrayToTree from 'array-to-tree'
import { authMenuType } from './auth'
/** message 호출 */
const message = useMessageStore()

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'authGroupMenu'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  useFlag: stringNull
  deviceTypeCd: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<authMenuType>
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
const searchParam = ref<searchParamType>({
  useFlag: 'Y',
  deviceTypeCd: 'P'
})
const ticked = ref<any>([])
const isMenuOpen = ref(false)
const grid = ref({
  columns: [
    {
      name: 'sysAuthGrpName',
      field: 'sysAuthGrpName',
      label: '권한명',
      align: 'left',
      sortable: true
    }
  ],
  data: [] as any
})
const gridmenu = ref<gridType>({
  columns: [
    {
      name: 'padMenuNm',
      field: 'padMenuNm',
      label: '메뉴명',
      align: 'left',
      type: 'html',
      style: 'width:75%',
      sortable: false
    },
    {
      name: 'userWriteFlag',
      field: 'userWriteFlag',
      label: '쓰기권한',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N',
      setHeader: true,
      disableTarget: 'editableFlag',
      disableCon: false
    }
  ],
  data: []
})
const menuTree = ref<any>([])
const menulistUrl = ref('')
const listUrl = ref('')
const addUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const isSelected = ref(false)
const selectedSysAuthGrpId = ref('')
const isManager = ref(false)

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
  isManager.value = user.value.userId === 'U000000001'
  // url setting
  menulistUrl.value = selectConfig.sys.menu.list.url
  listUrl.value = selectConfig.sys.auth.grp.list.url
  detailUrl.value = selectConfig.sys.auth.menu.list.url
  addUrl.value = transactionConfig.sys.auth.menu.add.url
  saveUrl.value = transactionConfig.sys.auth.menu.save.url
  // code setting
  // list setting
  getGrpList()
}
/******************************
 * TODO (목적): 행 선택 표시 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 조회 및 초기화
 *******************************/
function getGrpList() {
  isSelected.value = false
  getList()
  rowRemoveSelect()
  gridmenu.value.data = []
  ticked.value = []
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (user.value.userId === 'U000000001') {
      grid.value.data = _result.data
    } else {
      grid.value.data = _.filter(_result.data, (item) => {
        return item['sysAuthGrpId'] !== 'SAGI000000'
      })
    }
  })
}
/******************************
 * TODO (목적): 메뉴 클릭
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(row: any) {
  selectedSysAuthGrpId.value = row.sysAuthGrpId
  $http({
    url: detailUrl.value,
    method: 'GET',
    params: { sysAuthGrpIds: selectedSysAuthGrpId.value }
  }).then((_result: any) => {
    gridmenu.value.data = _result.data
    ticked.value = []
    _.forEach(_result.data, (_item) => {
      if (_item.sysAuthGrpId !== null) {
        ticked.value.push(_item.sysMenuId)
      }
    })
    isSelected.value = true
  })
}
function convertTree(_treeBases: any) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: 'upMenuId',
    customID: 'sysMenuId'
  })
  return tree
}
function addMenu() {
  $http({
    url: menulistUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (user.value.userId === 'U000000001') {
      menuTree.value = convertTree(_result.data)
    } else {
      menuTree.value = convertTree(
        _.filter(_result.data, (item) => {
          return item['systemFlag'] !== 'Y'
        })
      )
    }
    isMenuOpen.value = true
  })
}
function saveMenu() {
  const saveData = gridmenu.value.data.filter((x: any) => {
    return x.editFlag == 'U'
  })
  $http({
    url: saveUrl.value,
    method: 'POST',
    data: saveData
  }).then((_result: any) => {
    message.requestSuccess()
    rowClick({ sysAuthGrpId: selectedSysAuthGrpId.value })
  })
}
function selectMenu() {
  const existData = ref([]) as any
  _.forEach(ticked.value, (_item) => {
    _.forEach(gridmenu.value.data, (_itemMenu) => {
      if (_item == _itemMenu.sysMenuId) {
        existData.value.push(_item)
      }
    })
  })
  const saveData = ticked.value.filter((item: any) => !existData.value.includes(item))

  $http({
    url: addUrl.value,
    method: 'POST',
    data: {
      sysAuthGrpId: selectedSysAuthGrpId.value,
      existMenu: existData.value,
      newMenu: saveData
    }
  }).then((_result: any) => {
    message.requestSuccess()
    isMenuOpen.value = false
    rowClick({ sysAuthGrpId: selectedSysAuthGrpId.value })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

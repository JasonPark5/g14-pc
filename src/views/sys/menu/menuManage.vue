<template>
  <div>
    <c-search-box @enter="getMenuList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="DEVICE_CD"
            type="none"
            itemText="codeName"
            itemValue="code"
            name="deviceTypeCd"
            label="디바이스 구분"
            v-model:value="searchParam.deviceTypeCd"
            @update:value="getMenuList"
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
            @update:value="getMenuList"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-tree-table
          title="메뉴목록"
          parentProperty="upMenuId"
          customID="sysMenuId"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          :hideBottom="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getMenuList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="메뉴정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable && isManager" label="등록" icon="add" @btnClicked="addMenu" />
                <c-btn
                  v-if="editable && deleteable && isManager"
                  :url="deleteUrl"
                  :isSubmit="true"
                  mappingType="DELETE"
                  label="삭제"
                  icon="remove"
                  @beforeAction="deleteData"
                  @btnCallback="deleteCallback"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="menuData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveMenu"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable && dataeditable"
                  label="메뉴명"
                  name="menuNm"
                  v-model:value="menuData.menuNm"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :editable="false"
                  codeGroupCd="DEVICE_CD"
                  type="edit"
                  :required="true"
                  itemText="codeName"
                  itemValue="code"
                  name="deviceTypeCd"
                  label="디바이스구분"
                  v-model:value="menuData.deviceTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :disabled="true"
                  :editable="editable && dataeditable"
                  label="메뉴ID"
                  name="sysMenuId"
                  v-model:value="menuData.sysMenuId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :afterIcon="
                    editable
                      ? [
                          {
                            name: 'search',
                            click: true,
                            callbackName: 'selectUpMenu',
                            color: 'light-blue'
                          },
                          { name: 'close', click: true, callbackName: 'removeUpMenu', color: 'red' }
                        ]
                      : null
                  "
                  :disabled="true"
                  :editable="editable && dataeditable"
                  label="상위 메뉴"
                  name="upMenuNm"
                  v-model:value="menuData.upMenuNm"
                  @selectUpMenu="selectUpMenu"
                  @removeUpMenu="removeUpMenu"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :disabled="true"
                  :editable="editable && dataeditable"
                  label="메뉴레벨"
                  name="menuLvl"
                  type="number"
                  v-model:value="menuData.menuLvl"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-text
                  :editable="editable && dataeditable && isManager"
                  label="메뉴 URL"
                  name="url"
                  v-model:value="menuData.url"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="메뉴 아이콘"
                  name="menuIcon"
                  v-model:value="menuData.menuIcon"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable && dataeditable"
                  type="number"
                  label="정렬 순서"
                  name="sortOrder"
                  v-model:value="menuData.sortOrder"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="메뉴명(영어)"
                  name="menuNmEn"
                  v-model:value="menuData.menuNmEn"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="메뉴명(일본어)"
                  name="menuNmJa"
                  v-model:value="menuData.menuNmJa"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="메뉴명(중국어-간체)"
                  name="menuNmZhCn"
                  v-model:value="menuData.menuNmZhCn"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && dataeditable"
                  label="메뉴명(중국어-번체)"
                  name="menuNmZhTw"
                  v-model:value="menuData.menuNmZhTw"
                />
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                v-if="searchParam.deviceTypeCd == 'P'"
              >
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="대시보드 여부"
                  name="dashboardFlag"
                  v-model:value="menuData.dashboardFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="menuData.useFlag"
                />
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
                v-if="searchParam.deviceTypeCd == 'P'"
              >
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="매뉴얼 사용여부"
                  name="manualFlag"
                  v-model:value="menuData.manualFlag"
                />
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 manual-btn-layer"
                v-if="searchParam.deviceTypeCd == 'P'"
              >
                <c-btn
                  v-if="editable && menuData.manualFlag == 'Y'"
                  :editable="editable && dataeditable"
                  label="매뉴얼 관리"
                  color="red"
                  icon="quiz"
                  @btnClicked="addManual(menuData)"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="시스템전용메뉴"
                  name="systemFlag"
                  v-model:value="menuData.systemFlag"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>

    <q-dialog ref="menuDialog" class="mini-dialog" position="top" persistent v-model="isMenuOpen">
      <q-card class="menu-manage-card">
        <q-card-section class="row items-center bg-orange-custom text-white">
          <div class="text-h6">메뉴</div>
          <q-space />
          <q-btn icon="done" flat round dense @click="selectMenu" />
          <q-btn icon="close" flat round dense @click="closeMenu" />
        </q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              <q-chip outline square color="primary" text-color="white">
                {{ menuNm }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-section class="menu-content p-2">
          <q-tree
            dense
            ref="menuTreeRef"
            :nodes="menuTree"
            node-key="sysMenuId"
            label-key="menuNm"
            children-key="children"
            no-nodes-label="메뉴가 없습니다."
            no-results-label=""
            :default-expand-all="true"
            selected-color="primary"
            v-model:selected="selectedMenu"
            @update:selected="updateSelected"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
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
import { menuType } from './menu'
import arrayToTree from 'array-to-tree'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'menuManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
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
const delay = ref(180)
const clicks = ref(0)
const timer = ref<NodeJS.Timeout>(setTimeout(() => {}, 1))
const menuTreeRef = ref<any>(null)
const menuTree = ref<any>([])
const menuDialog = ref<any>(null)
const editForm = ref<any>(null)
const grid = ref({
  columns: [
    {
      name: 'menuNm',
      field: 'menuNm',
      label: '메뉴명',
      align: 'left',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:80px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  isFull: false,
  param: {},
  closeCallback: () => {}
})
const menuData = ref<menuType>({
  sysMenuId: '', // 메뉴 SEQ
  upMenuId: '', // 상위메뉴 ID
  menuNm: '', // 메뉴명
  upMenuNm: '',
  menuNmEn: '', // 메뉴명-영문
  menuNmJa: '', // 메뉴명-일본어
  menuNmZhCn: '', // 메뉴명-중국어간체
  menuNmZhTw: '', // 메뉴명-중국어번체
  menuLvl: -1, // 메뉴 레벨
  url: '', // URL
  menuColor: '', // color
  menuIcon: '', // icon
  sortOrder: '', // 정렬순서
  useFlag: 'Y', // 사용여부
  manualFlag: 'N',
  dashboardFlag: 'N',
  deviceTypeCd: 'P',
  systemFlag: 'N'
})
const originMenu = ref<menuType>({
  sysMenuId: '', // 메뉴 SEQ
  upMenuId: '' // 상위메뉴 ID
})
const searchParam = ref<searchParamType>({
  useFlag: 'Y',
  deviceTypeCd: 'P'
})
const useFlagItems = ref<codeMasterType>([
  { code: 'Y', codeName: '사용' },
  { code: 'N', codeName: '미사용' }
])
const isMenuOpen = ref(false)
const menuNm = ref('메뉴를 선택하세요.')
const selectedMenu = ref('')
const selectedSysMenu = ref({
  sysMenuId: '',
  sysMenuNm: '',
  menuLvl: 0
})
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const searchUrl = ref('')
const isManager = ref(false)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => selectedMenu.value,
  () => {
    const data = menuTreeRef.value.getNodeByKey(selectedMenu.value)
    menuNm.value = data.menuNm
  }
)

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
  dataeditable.value = false
  // url setting
  searchUrl.value = selectConfig.sys.menu.list.url
  detailUrl.value = selectConfig.sys.menu.get.url
  insertUrl.value = transactionConfig.sys.menu.insert.url
  updateUrl.value = transactionConfig.sys.menu.update.url
  deleteUrl.value = transactionConfig.sys.menu.delete.url
  // code setting
  // list setting
  getList()
  reset()
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
function getMenuList() {
  getList()
  reset()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: searchUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
    menuTree.value = convertTree(_result.data)
  })
  saveable.value = false
  deleteable.value = false
  selectedSysMenu.value = {
    sysMenuId: '',
    sysMenuNm: '',
    menuLvl: 0
  }
}
/******************************
 * TODO (목적): Tree형태로 변환
 * @param (1): 원본 json
 *******************************/
function convertTree(_treeBases: any) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: 'upMenuId',
    customID: 'sysMenuId'
  })
  return tree
}
/******************************
 * TODO (목적): 메뉴 선택
 *******************************/
function selectMenu() {
  if (selectedMenu.value) {
    const data = menuTreeRef.value.getNodeByKey(selectedMenu.value)
    menuData.value.upMenuId = data.sysMenuId
    menuData.value.upMenuNm = data.menuNm
    menuData.value.menuLvl = Number(data.menuLvl) + 1
    menuDialog.value.hide()
  } else {
    message.alert({
      title: '안내',
      message: '메뉴를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 상위메뉴 삭제
 *******************************/
function removeUpMenu() {
  message.confirm({
    title: '확인',
    message: '상위메뉴가 없는 경우 최상위 메뉴로 들어가게 됩니다.\n\r진행하시겠습니까?',
    type: 'info',
    // 확인 callback 함수
    confirmCallback: () => {
      menuData.value.upMenuId = null
      menuData.value.upMenuNm = ''
      menuData.value.menuLvl = 0
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 메뉴 추가
 *******************************/
function addMenu() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  menuData.value = {
    sysMenuId: '', // 메뉴 SEQ
    upMenuId: selectedSysMenu.value.sysMenuId === '' ? null : selectedSysMenu.value.sysMenuId,
    upMenuNm: selectedSysMenu.value.sysMenuNm === '' ? null : selectedSysMenu.value.sysMenuNm,
    menuLvl: selectedSysMenu.value.sysMenuId === '' ? 0 : selectedSysMenu.value.menuLvl + 1,
    menuNm: '', // 메뉴명
    menuNmEn: '', // 메뉴명-영문
    menuNmJa: '', // 메뉴명-일본어
    menuNmZhCn: '', // 메뉴명-중국어간체
    menuNmZhTw: '', // 메뉴명-중국어번체
    url: '', // URL
    menuColor: '', // color
    menuIcon: '', // icon
    sortOrder: '', // 정렬순서
    useFlag: 'Y', // 사용여부
    manualFlag: 'N',
    dashboardFlag: 'N',
    systemFlag: 'N',
    deviceTypeCd: searchParam.value.deviceTypeCd
  }
}
/******************************
 * TODO (목적): 메뉴 클릭
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(row: any) {
  selectedSysMenu.value = row
  saveable.value = true
  deleteable.value = true
  updateMode.value = true
  dataeditable.value = true

  $http({
    url: $format(detailUrl.value, row.sysMenuId),
    method: 'GET'
  }).then((_result: any) => {
    menuData.value = _result.data
    originMenu.value.sysMenuId = _.clone(_result.data.sysMenuId)
    originMenu.value.upMenuId = _.clone(_result.data.upMenuId)
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  })
}
/********************
 * TODO (목적): Tree에서 체크한 메뉴 정보 update
 *******************************/
function updateSelected() {
  clicks.value++
  if (clicks.value === 1) {
    timer.value = setTimeout(function () {
      /** 행 클릭 */
      clicks.value = 0
    }, delay.value)
  } else {
    /** 행 더블 클릭 */
    clearTimeout(timer.value)
    clicks.value = 0
    selectMenu()
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  selectedSysMenu.value = {
    sysMenuId: '',
    sysMenuNm: '',
    menuLvl: 0
  }
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  menuData.value = {
    sysMenuId: '', // 메뉴 SEQ
    upMenuId: '', // 상위메뉴 ID
    upMenuNm: '',
    menuNm: '', // 메뉴명
    menuNmEn: '', // 메뉴명-영문
    menuNmJa: '', // 메뉴명-일본어
    menuNmZhCn: '', // 메뉴명-중국어간체
    menuNmZhTw: '', // 메뉴명-중국어번체
    menuLvl: 0, // 메뉴 레벨
    url: '', // URL
    menuColor: '', // color
    menuIcon: '', // icon
    sortOrder: '', // 정렬순서
    useFlag: 'Y', // 사용여부
    manualFlag: 'N',
    dashboardFlag: 'N',
    systemFlag: 'N',
    deviceTypeCd: searchParam.value.deviceTypeCd
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMenu() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      let _message = '저장하시겠습니까?'
      if (
        originMenu.value.sysMenuId === menuData.value.sysMenuId &&
        originMenu.value.upMenuId !== menuData.value.upMenuId
      ) {
        _message =
          '상위메뉴가 변경됨으로 인해 해당 메뉴의 하위 정보들 또한 같이 이동됩니다.\n\r저장하시겠습니까?'
      }
      if (saveType.value == 'PUT' && menuData.value.sysMenuId == menuData.value.upMenuId) {
        message.alert({
          title: '안내',
          message: '메뉴가 상위메뉴와 동일할 수 없습니다.\n\r상위메뉴를 변경하세요', // 메
          type: 'warning' // success / info / warning / error
        })
      } else {
        message.confirm({
          title: '확인',
          message: _message,
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, menuData.value.sysMenuId),
        method: 'DELETE'
      }).then(() => {
        isSave.value = !isSave.value
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 저장 후 처리
 * @param (1): api 서버에서 회신하는 정보 (정보)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    getList()
    rowClick({ sysMenuId: result.data.sysMenuId })
  } else {
    getMenuList()
  }
}
/******************************
 * TODO (목적): 삭제 후 처리
 *******************************/
function deleteCallback() {
  message.requestSuccess()
  getMenuList()
}
/******************************
 * TODO (목적): 메뉴얼 상세
 * @param (1): row 데이터 전체
 *******************************/
function addManual(row: any) {
  popupOptions.value.title = '매뉴얼 상세'
  popupOptions.value.param = {
    sysMenuId: row ? row.sysMenuId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sys/menu/manualDetail.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '1280px'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 메뉴얼 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

function closeMenu() {
  isMenuOpen.value = false
}

function selectUpMenu() {
  isMenuOpen.value = true
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-search-box @enter="getDeptList">
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-tree-table
          title="부서목록"
          parentProperty="upDeptCd"
          customID="deptCd"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getDeptList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <c-card title="부서정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addData" />
                <c-btn
                  v-if="editable && deleteable"
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  :param="deptData"
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
                  :param="deptData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <!-- 부서 -->
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="부서"
                  name="deptName"
                  type="edit"
                  v-model:value="deptData.deptName"
                />
              </div>
              <!-- <div class="col-6">
                <c-plant
                  type="edit"
                  :editable="editable && dataeditable"
                  :required="true"
                  name="plantCd"
                  v-model:value="deptData.plantCd"
                />
              </div> -->
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable && dataeditable && deptData.deptCd.length === 0"
                  label="부서코드"
                  name="deptCd"
                  type="edit"
                  v-model:value="deptData.deptCd"
                />
              </div>
              <div class="col-6">
                <c-dept
                  type="edit"
                  :editable="editable && dataeditable"
                  label="상위부서"
                  name="upDeptCd"
                  v-model:value="deptData.upDeptCd"
                  :isFirstValue="false"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="순번"
                  name="sortOrder"
                  type="number"
                  v-model:value="deptData.sortOrder"
                />
              </div>
              <!-- <div class="col-6">
                <c-select
                  :comboItems="increaseFlagItems"
                  :editable="editable && dataeditable"
                  type="edit"
                  itemText="codeName"
                  required
                  itemValue="code"
                  name="increaseFlag"
                  label="무재해 대상부서"
                  v-model:value="deptData.increaseFlag"
                />
              </div> -->
              <div class="col-6">
                <c-checkbox
                  required
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="deptData.useFlag"
                />
              </div>
            </template>
          </c-card>
        </q-form>
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
  name: 'deptManage'
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

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  plantCd: stringNull
  deptNm: stringNull
  useFlag: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  deptNm: '',
  useFlag: 'Y'
})
const deptData = ref<deptType>({
  plantCd: null,
  deptCd: '',
  deptName: '',
  upDeptCd: '',
  sortOrder: '',
  useFlag: 'Y',
  increaseFlag: 'N'
})
const grid = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'left',
      sortable: false
    },
    {
      name: 'deptCd',
      field: 'deptCd',
      label: '부서코드',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:70px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const useFlagItems = ref<Array<any>>([])
const increaseFlagItems = ref<Array<any>>([])
const listUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const isDelete = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const selectedDeptCd = ref('')
const oriDeptCd = ref('')
const rowNotSelected = ref(true)
const editForm = ref<any>(null)

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
  listUrl.value = selectConfig.mdm.dept.list.url
  detailUrl.value = selectConfig.mdm.dept.get.url
  checkUrl.value = selectConfig.mdm.dept.check.url
  insertUrl.value = transactionConfig.mdm.dept.insert.url
  updateUrl.value = transactionConfig.mdm.dept.update.url
  deleteUrl.value = transactionConfig.mdm.dept.delete.url
  // code setting
  increaseFlagItems.value = [
    { code: 'Y', codeName: $language('가중인원 대상부서') },
    { code: 'X', codeName: $language('일반대상부서') },
    { code: 'N', codeName: $language('대상아님') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  dataeditable.value = false
  // list setting
  getList()
}
/******************************
 * TODO (목적): 부서 목록 조회
 *******************************/
function getList() {
  rowNotSelected.value = true
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 부서 목록 조회, 리셋
 *******************************/
function getDeptList() {
  getList()
  reset()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  // 상세조회
  saveable.value = true
  deleteable.value = true
  rowNotSelected.value = false
  updateMode.value = true
  selectedDeptCd.value = row.deptCd
  $http({
    url: $format(detailUrl.value, selectedDeptCd.value),
    method: 'GET'
  }).then((_result: any) => {
    deptData.value = _result.data

    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
    oriDeptCd.value = deptData.value.deptCd
  })
}
/******************************
 * TODO (목적): 부서 추가
 *******************************/
function addData() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  deptData.value = {
    plantCd: null,
    deptCd: '',
    deptName: '',
    upDeptCd: selectedDeptCd.value,
    sortOrder: '',
    useFlag: 'Y',
    increaseFlag: 'N'
  }
  oriDeptCd.value = ''
}

/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  selectedDeptCd.value = ''
  deptData.value = {
    plantCd: null,
    deptCd: '',
    deptName: '',
    upDeptCd: '',
    sortOrder: '',
    useFlag: 'Y',
    increaseFlag: 'N'
  }
  oriDeptCd.value = ''
}

/******************************
 * TODO (목적): 부서 저장
 *******************************/
function saveData() {
  editForm.value.validate().then((_result: boolean) => {
    // 중복체크
    if (_result) {
      $http({
        url: $format(checkUrl.value, deptData.value.deptCd),
        method: 'GET'
      }).then((_result: any) => {
        if (
          (updateMode.value && oriDeptCd.value != deptData.value.deptCd && _result.data === 0) ||
          (updateMode.value && oriDeptCd.value == deptData.value.deptCd) ||
          (!updateMode.value && _result.data === 0)
        ) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 부서코드가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 부서 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, deptData.value.deptCd),
        method: 'DELETE'
      }).then((_result: any) => {
        isDelete.value = !isDelete.value
      })
    }
  })
}
/******************************
 * TODO (목적): 부서 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (saveType.value == 'PUT') {
    getList()
    rowClick({ deptCd: result.data.deptCd })
  } else {
    getDeptList()
  }
}
/******************************
 * TODO (목적): 부서 삭제 콜백
 *******************************/
function deleteCallback() {
  message.requestSuccess()
  getDeptList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-table
          ref="tabletype"
          title="기계분류"
          :columns="typegrid.columns"
          :data="typegrid.data"
          @rowClick="rowClick"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
        >
          <template v-slot:suffixTitle>
            <span v-if="editable" style="font-size: 0.8em; font-weight: 300">
              &nbsp;&nbsp; [ 행 클릭하세요 ] &nbsp;&nbsp;
            </span>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-table
          ref="tableitem"
          title="기계분류별 안전검사 검사대상/필수항목"
          topBorderClass="topcolor-lightblue"
          :columns="grid1.columns"
          :data="grid1.data"
          :editable="editable"
          :usePaging="false"
          :filtering="false"
          :columnSetting="false"
          :isExcelDown="false"
          :isFullScreen="false"
          selection="multiple"
          rowKey="hazardousMachineryInspectionTargetId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="추가" icon="add" @btnClicked="addRow1" v-if="editable && isSelectTgt" />
              <c-btn
                label="삭제"
                icon="remove"
                @btnClicked="removeRow1"
                v-if="editable && isSelectTgt"
              />
              <c-btn
                label="저장"
                icon="save"
                @btnClicked="saveRow1"
                v-if="editable && isSelectTgt"
              />
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
  name: 'hazardEquipmentItem'
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
interface gridType {
  columns: tableColumnType
  data: any
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
const isSelectTgt = ref(false)
const isSelectDetail = ref(false)
const selectedGroupCd = ref('')
const list1Url = ref('')
const save1Url = ref('')
const delete1Url = ref('')
const list2Url = ref('')
const save2Url = ref('')
const insert2Url = ref('')
const update2Url = ref('')
const delete2Url = ref('')
const itemData = ref<any>({
  itemName: '',
  testMothod: '',
  itemCriterion: '',
  useEquip: '',
  hazardousMachineryInspectionTargetId: '',
  hazardousMachineryInspectionItemId: ''
})

const tabletype = ref<any>(null)
const tableitem = ref<any>(null)
const typegrid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '기계분류',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid1 = ref<gridType>({
  columns: [],
  data: []
})

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
  save2Url.value = transactionConfig.sop.hhm.hazard.inspection.item.insert.url
  list1Url.value = selectConfig.sop.hhm.hazard.inspection.target.list.url
  save1Url.value = transactionConfig.sop.hhm.hazard.inspection.target.save.url
  delete1Url.value = transactionConfig.sop.hhm.hazard.inspection.target.delete.url
  list2Url.value = selectConfig.sop.hhm.hazard.inspection.item.list.url
  insert2Url.value = transactionConfig.sop.hhm.hazard.inspection.item.insert.url
  update2Url.value = transactionConfig.sop.hhm.hazard.inspection.item.update.url
  delete2Url.value = transactionConfig.sop.hhm.hazard.inspection.item.delete.url
  // code setting
  getComboItems('HHM_TEST_METHOD').then((_result) => {
    grid1.value.columns = [
      {
        required: true,
        name: 'sortOrder',
        field: 'sortOrder',
        label: '조항',
        align: 'center',
        type: 'number',
        style: 'width:60px',
        sortable: false
      },
      {
        required: true,
        name: 'itemName',
        field: 'itemName',
        label: '검사항목',
        align: 'left',
        type: 'text',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'testMothod',
        field: 'testMothod',
        label: '검사방법',
        align: 'left',
        sortable: false,
        style: 'width:200px',
        type: 'multiSelect',
        itemText: 'codeName',
        itemValue: 'code',
        comboItems: _result
      },
      {
        name: 'itemCriterion',
        field: 'itemCriterion',
        label: '판정기준',
        align: 'left',
        type: 'text',
        sortable: false
      },
      {
        name: 'useEquip',
        field: 'useEquip',
        label: '활용장비',
        align: 'left',
        type: 'text',
        style: 'width:150px',
        sortable: false
      }
    ]
  })
  // list setting
  getTypeList()
}
function rowClick(row: any) {
  isSelectTgt.value = true
  selectedGroupCd.value = row.code
  getList1(row)
  itemData.value.itemName = ''
  itemData.value.testMothod = ''
  itemData.value.itemCriterion = ''
  itemData.value.useEquip = ''
  itemData.value.hazardousMachineryInspectionTargetId = ''
  itemData.value.hazardousMachineryInspectionItemId = ''
  isSelectDetail.value = false
}
function getTypeList() {
  rowRemoveSelect()
  isSelectTgt.value = false
  grid1.value.data = []
  getComboItems('HHM_TYPE_CD').then((_result) => {
    typegrid.value.data = _result
  })
}
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')
  if (_table.length > 0) {
    for (let c = 0; c <= _table.length; c++) {
      _table[c].classList.remove('bg-light-blue-1')
    }
  }
  selectedGroupCd.value = ''
}
function getList1(row: any) {
  grid1.value.data = []
  $http({
    url: list1Url.value,
    method: 'GET',
    params: {
      machineryClassification: row.code
    }
  }).then((_result: any) => {
    _.extend(grid1.value.data, _result.data)
  })
}
function addRow1() {
  grid1.value.data.splice(0, 0, {
    editFlag: 'C',
    hazardousMachineryInspectionTargetId: uid(), // 검사대상-검사항목 일련번호
    machineryClassification: selectedGroupCd.value, // 기계분류
    itemName: '', // 검사대상-검사항목명
    sortOrder:
      grid1.value.data.length === 0
        ? 1
        : parseInt(grid1.value.data[grid1.value.data.length - 1].sortOrder) + 1 // 순번
  })
}
function saveRow1() {
  if (validTable(grid1.value.columns, grid1.value.data)) {
    const saveData = grid1.value.data.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
      if (Array.isArray(item.testMothod)) {
        item.testMothod = item.testMothod.join(',')
      }
    })
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: save1Url.value,
          method: 'POST',
          data: saveData
        }).then((_result: any) => {
          message.requestSuccess()
          getList1({ code: selectedGroupCd.value })
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function removeRow1() {
  const selectData = tableitem.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: delete1Url.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid1.value.data = _.reject(grid1.value.data, item)
          })
          tableitem.value.compoTable.clearSelection()

          itemData.value.itemName = ''
          itemData.value.testMothod = ''
          itemData.value.itemCriterion = ''
          itemData.value.useEquip = ''
          itemData.value.hazardousMachineryInspectionTargetId = ''
          itemData.value.hazardousMachineryInspectionItemId = ''
          isSelectDetail.value = false
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

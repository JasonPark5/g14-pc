<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-table
          ref="table1"
          title="평가항목"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :editable="editable"
          :isExcelDown="false"
          :columns="gridItem.columns"
          :data="gridItem.data"
          :gridHeight="gridHeight"
          @rowClick="rowItemClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-select
                type="none"
                :comboItems="revisionItems"
                itemText="codeName"
                itemValue="code"
                label=""
                name="sysRevision"
                @update:value="getItemList"
                v-model:value="searchParam.sysRevision"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-table
          ref="table2"
          :title="`평가항목별 구분 : ${selectedItemRow.itemMstName}`"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :editable="editable"
          :isExcelDown="false"
          :columns="gridIType.columns"
          :data="gridIType.data"
          :gridHeight="gridHeight"
          selection="multiple"
          rowKey="selfInspectionItemTypeId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && selectedItemRow.selfInspectionItemMstId && revisionable"
                label=""
                icon="add"
                @btnClicked="addTypeRow"
              />
              <c-btn
                v-if="
                  editable &&
                  selectedItemRow.selfInspectionItemMstId &&
                  revisionable &&
                  gridIType.data &&
                  gridIType.data.length > 0
                "
                label=""
                icon="remove"
                @btnClicked="removeTypeRow"
              />
              <c-btn
                v-if="
                  editable &&
                  selectedItemRow.selfInspectionItemMstId &&
                  revisionable &&
                  gridIType.data &&
                  gridIType.data.length > 0
                "
                label=""
                icon="save"
                @btnClicked="saveTypeRow"
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
import { itemType } from './audit'

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
  name: 'auditTable2'
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
const gridItem = ref<gridType>({
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '평가항목',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const gridIType = ref({
  columns: [
    {
      required: true,
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      type: 'number',
      style: 'width: 50px',
      sortable: false
    },
    {
      required: true,
      name: 'itemTypeName',
      field: 'itemTypeName',
      label: '구분',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: [] as Array<itemType>
})
const searchParam = ref({
  sysRevision: null
})
const gridHeight = ref('870px')
const editable = ref(true)
const listItemUrl = ref('')
const listTypeUrl = ref('')
const saveTypeUrl = ref('')
const saveCheckUrl = ref('')
const deleteTypeUrl = ref('')
const deleteCheckUrl = ref('')
const revisionUrl = ref('')
const lastRevision = ref(null)
const revisionable = ref(true)
const revisionItems = ref<codeMasterType>([])
const selectedItemRow = ref<any>({})
const table1 = ref<any>(null)
const table2 = ref<any>(null)

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
  revisionUrl.value = selectConfig.sop.pca.item.revs.item
  listItemUrl.value = selectConfig.sop.pca.item.revs.url
  listTypeUrl.value = selectConfig.sop.pca.type.list.url
  saveTypeUrl.value = transactionConfig.sop.pca.type.save.url
  deleteTypeUrl.value = transactionConfig.sop.pca.type.delete.url
  saveCheckUrl.value = transactionConfig.sop.pca.typeitem.save.url
  deleteCheckUrl.value = transactionConfig.sop.pca.typeitem.delete.url
  // code setting
  // list setting
  getRevision()
}
/******************************
 * TODO (목적): 개정버전 / 항목 조회
 *******************************/
function getRevision() {
  $http({
    url: revisionUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    revisionItems.value = _result.data
    searchParam.value.sysRevision = revisionItems.value[0].code
    lastRevision.value = revisionItems.value[0].code
    getItemList()
  })
}
function getItemList() {
  revisionable.value = lastRevision.value === searchParam.value.sysRevision ? true : false
  $http({
    url: listItemUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridItem.value.data = _result.data
    rowItemClick(gridItem.value.data![0])
  })
}
/******************************
 * TODO (목적): 항목별 구분 조회
 *******************************/
function rowItemClick(row: any) {
  selectedItemRow.value = row
  $http({
    url: listTypeUrl.value,
    method: 'GET',
    params: { selfInspectionItemMstId: row.selfInspectionItemMstId }
  }).then((_result: any) => {
    gridIType.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 항목별 구분 row 추가
 *******************************/
function addTypeRow() {
  gridIType.value.data?.push({
    editFlag: 'C',
    selfInspectionItemMstId: selectedItemRow.value.selfInspectionItemMstId, // 자체감사 평가항목 일련번호
    selfInspectionItemTypeId: uid(), // 자체감사 평가항목별 구분 일련번호
    itemTypeName: '', // 자체감사 평가항목별 구분명
    sortOrder: gridIType.value.data.length + 1, // 순번
    delFlag: 'N' // 삭제여부
  })
}
/******************************
 * TODO (목적): 항목별 구분 저장
 *******************************/
function saveTypeRow() {
  if (validTable(gridIType.value.columns, gridIType.value.data)) {
    const saveData = gridIType.value.data.filter((x) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: saveTypeUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            rowItemClick(selectedItemRow.value)
          })
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
 * TODO (목적): 항목별 구분 row 삭제
 *******************************/
function removeTypeRow() {
  const selectData = table2.value.getSelected()
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
      confirmCallback: () => {
        $http({
          url: deleteTypeUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridIType.value.data = _.reject(gridIType.value.data, item)
          })
          table2.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.gridbtntop
  .customSelect
    padding-bottom: 0px !important
    .q-field__inner
      padding-bottom: 0px !important
    .q-field__control, .customSelect.q-field--dense .q-field__marginal
      height: 24px !important
      min-height: 24px !important
    .q-field__native
      min-height: 26px !important
      padding-right: 20px !important
  .q-field__control-container
    padding-top: 0 !important
  .q-field__marginal
    height: 10px !important
</style>

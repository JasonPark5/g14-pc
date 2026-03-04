<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-table
          ref="table2"
          title="평가항목별 구분"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :editable="editable"
          :isExcelDown="false"
          :columns="gridTypes.columns"
          :data="gridTypes.data"
          :merge="gridTypes.merge"
          :gridHeight="gridHeight"
          @rowClick="rowClick"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-table
          ref="table3"
          :title="`체크리스트 : ${selectedRow.itemTypeName || ''}`"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :editable="editable"
          :isExcelDown="false"
          :columns="gridCheck.columns"
          :data="gridCheck.data"
          :gridHeight="gridHeight"
          selection="multiple"
          rowKey="selfInspectionItemTypeItemId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && selectedRow.selfInspectionItemTypeId"
                icon="add"
                @btnClicked="addCheckRow"
              />
              <c-btn
                v-if="
                  editable &&
                  selectedRow.selfInspectionItemTypeId &&
                  gridCheck.data &&
                  gridCheck.data.length > 0
                "
                icon="remove"
                @btnClicked="removeCheckRow"
              />
              <c-btn
                v-if="
                  editable &&
                  selectedRow.selfInspectionItemTypeId &&
                  gridCheck.data &&
                  gridCheck.data.length > 0
                "
                icon="save"
                @btnClicked="saveCheckRow"
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
  name: 'complianceItem'
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
const gridTypes = ref<gridType>({
  merge: [{ index: 0, colName: 'selfInspectionItemMstId' }],
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '평가항목',
      align: 'left',
      sortable: false
    },
    {
      name: 'itemTypeName',
      field: 'itemTypeName',
      label: '구분',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const gridCheck = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      type: 'number',
      style: 'width: 60px',
      sortable: false
    },
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '체크리스트',
      align: 'left',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'relatedLaw',
      field: 'relatedLaw',
      label: '관련근거',
      align: 'left',
      type: 'textarea',
      style: 'width: 240px',
      sortable: false
    }
  ],
  data: []
})
const gridHeight = ref('870px')
const editable = ref(true)
const listTypeUrl = ref('')
const listCheckUrl = ref('')
const saveCheckUrl = ref('')
const deleteCheckUrl = ref('')
const selectedRow = ref<itemType>({})
const table2 = ref<any>(null)
const table3 = ref<any>(null)

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
  listTypeUrl.value = selectConfig.sop.pca.type.list.url
  listCheckUrl.value = selectConfig.sop.pca.typeitem.list.url
  saveCheckUrl.value = transactionConfig.sop.pca.typeitem.save.url
  deleteCheckUrl.value = transactionConfig.sop.pca.typeitem.delete.url
  // code setting
  // list setting
  getTypeList()
}
/******************************
 * TODO (목적): 항목별 구분 조회
 *******************************/
function getTypeList() {
  $http({
    url: listTypeUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    gridTypes.value.data = _result.data
    rowClick(gridTypes.value.data![0])
  })
}
/******************************
 * TODO (목적): 구분별 체크리스트 항목 조회
 *******************************/
function rowClick(row: any) {
  selectedRow.value = row
  $http({
    url: listCheckUrl.value,
    method: 'GET',
    params: { selfInspectionItemTypeId: row.selfInspectionItemTypeId }
  }).then((_result: any) => {
    gridCheck.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 체크리스트 row 추가
 *******************************/
function addCheckRow() {
  gridCheck.value.data?.push({
    selfInspectionItemMstId: selectedRow.value.selfInspectionItemMstId, // 자체감사 평가항목 일련번호
    selfInspectionItemTypeId: selectedRow.value.selfInspectionItemTypeId, // 자체감사 평가항목별 구분 일련번호
    selfInspectionItemTypeItemId: uid(), // 자체감사 감사항목 일련번호
    itemTypeName: '', // 자체감사 평가항목별 구분명
    sortOrder: gridCheck.value.data.length + 1, // 순번
    regUserId: user.value.userId,
    delFlag: 'N',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 체크리스트 저장
 *******************************/
function saveCheckRow() {
  if (gridCheck.value.data && validTable(gridCheck.value.columns, gridCheck.value.data)) {
    const saveData = gridCheck.value.data.filter((x) => {
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
            url: saveCheckUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            rowClick(selectedRow.value)
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
 * TODO (목적): 체크리스트 row 삭제
 *******************************/
function removeCheckRow() {
  const selectData = table3.value.getSelected()
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
          url: deleteCheckUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridCheck.value.data = _.reject(gridCheck.value.data, item)
          })
          table3.value.compoTable.clearSelection()
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

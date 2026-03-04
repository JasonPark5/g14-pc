<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="mstTable"
          title="중장비유형"
          tableId="mstTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :columns="mstGrid.columns"
          :isExcelDown="false"
          :data="mstGrid.data"
          selection="multiple"
          rowKey="code"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <c-btn label="추가" icon="add" @btnClicked="addrowType" v-if="editable" />
            <c-btn label="저장" icon="save" @btnClicked="saveType" v-if="editable" />
            <c-btn label="삭제" icon="remove" @btnClicked="removeType" v-if="editable" />
          </template>
          <template v-slot:customArea="{ props: bodyPros, col }">
            <template v-if="col.name === 'openIns' && bodyPros.row.editFlag != 'C'">
              <q-icon
                name="arrow_forward_ios"
                size="sm"
                color="blue"
                class="cursor-pointer"
                @click.stop="rowClick(bodyPros.row)"
              />
            </template>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="table"
          title="유형별 점검항목"
          tableId="table"
          :columns="grid.columns"
          :data="grid.data"
          selection="multiple"
          rowKey="heqForkLiftTypeItemId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="추가"
                icon="add"
                @btnClicked="addrowIns"
                v-if="editable && selectedRows.code && selectedRows.editFlag != 'C'"
              />
              <c-btn
                label="저장"
                icon="save"
                @btnClicked="saveIns"
                v-if="editable && selectedRows.code && selectedRows.editFlag != 'C'"
              />
              <c-btn
                label="삭제"
                icon="remove"
                @btnClicked="removeRowIns"
                v-if="editable && selectedRows.code && selectedRows.editFlag != 'C'"
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
import { forkLiftMstType } from './forkLiftType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'forkLiftTypeManage'
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
const mstGrid = ref<any>({
  columns: [
    {
      required: true,
      name: 'codeName',
      field: 'codeName',
      label: '중장비유형',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:70px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:70px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'openIns',
      field: 'openIns',
      label: '점검항목',
      align: 'center',
      style: 'width:80px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const grid = ref<any>({
  columns: [
    {
      required: true,
      name: 'typeName',
      field: 'typeName',
      label: '구분',
      align: 'left',
      style: 'width:250px',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'inspectItem',
      field: 'inspectItem',
      label: '점검항목',
      align: 'left',
      type: 'textarea',
      sortable: true
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:70px',
      align: 'center',
      type: 'number',
      sortable: false
    }
  ],
  data: []
})
const selectedRows = ref<codeMasterType>({})
const mstTable = ref<any>(null)
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
  // code setting
  // list setting
  getCodeMst()
}
/******************************
 * TODO (목적): 중장비 유형 조회
 *******************************/
function getCodeMst() {
  selectedRows.value = {}
  grid.value.data = []
  $http({
    url: $format(selectConfig.sys.code.mst.list.url, 'HEQ_TYPE_CD'),
    method: 'GET'
  }).then((_result: any) => {
    mstGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 중장비 유형별 항목 조회
 *******************************/
function rowClick(row: forkLiftMstType) {
  selectedRows.value = row
  $http({
    url: selectConfig.sop.heq.inspectitem.list.url,
    method: 'GET',
    params: { heqTypeCd: selectedRows.value.code }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 중장비 유형별 항목 추가
 *******************************/
function addrowIns() {
  const len = grid.value.data.length + 1
  grid.value.data.push({
    editFlag: 'C',
    heqForkLiftTypeItemId: uid(), // 중장비유형별 점검항목일련번호
    heqTypeCd: selectedRows.value.code, // 중장비유형코드
    typeName: '', // 구분
    inspectItem: '', // 자율점검항목
    sortOrder: len // 순번
  })
}
/******************************
 * TODO (목적): 중장비 유형별 항목 저장
 *******************************/
function saveIns() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: transactionConfig.sop.heq.inspectitem.save.url,
          method: 'POST',
          data: grid.value.data
        }).then((_result: any) => {
          rowClick(selectedRows.value)
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 중장비 유형별 항목 삭제
 *******************************/
function removeRowIns() {
  const selectData = table.value.getSelected()
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
          url: transactionConfig.sop.heq.inspectitem.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 중장비 유형 추가
 *******************************/
function addrowType() {
  const len = mstGrid.value.data.length + 1
  mstGrid.value.data.push({
    editFlag: 'C',
    codeGrpCd: 'HEQ_TYPE_CD', // 코드그룹
    code: uid(), // 코드
    codeName: '', // 코드명
    useFlag: 'Y', // 사용여부
    sortOrder: len //
  })
}
/******************************
 * TODO (목적): 중장비 유형 저장
 *******************************/
function saveType() {
  if (validTable(mstGrid.value.columns, mstGrid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: transactionConfig.sop.heq.hhmtype.save.url,
          method: 'POST',
          data: mstGrid.value.data
        }).then((_result: any) => {
          getCodeMst()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 중장비 유형 삭제
 *******************************/
function removeType() {
  const selectData = mstTable.value.getSelected()
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
          url: transactionConfig.sop.heq.hhmtype.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            mstGrid.value.data = _.reject(mstGrid.value.data, item)
          })
          mstTable.value.compoTable.clearSelection()
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

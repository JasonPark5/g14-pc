<template>
  <div>
    <c-table
      ref="table"
      title="결재이양 목록"
      tableId="table"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :filtering="false"
      :columns="grid.columns"
      :data="grid.data"
      selection="single"
      rowKey="sysApprovalTransferId"
      :isExcelDown="false"
      :editable="editable"
      @table-data-change="tableDataChange"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addTransfer" />
          <c-btn v-if="editable" label="삭제" icon="remove" @btnClicked="removeTransfer" />
          <c-btn v-if="editable" label="저장" icon="save" @btnClicked="saveTransfer" />
        </q-btn-group>
      </template>
    </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'apprTransfer'
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
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  isFull: true,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'transferUserDeptName',
      field: 'transferUserDeptName',
      label: '부서',
      align: 'center',
      sortable: false,
      style: 'width:250px'
    },
    {
      name: 'transferUserName',
      field: 'transferUserName',
      label: '이양자 명',
      align: 'center',
      sortable: false
    },
    {
      name: 'transferUserJobName',
      field: 'transferUserJobName',
      label: '직책',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    },
    {
      name: 'transferUserSpotName',
      field: 'transferUserSpotName',
      label: '직위',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    },
    {
      name: 'foreverFlag',
      field: 'foreverFlag',
      label: '기한 제한없음',
      type: 'check',
      true: 'Y',
      false: 'N',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'transferStartDt',
      field: 'transferStartDt',
      label: '결재이양 시작일자',
      align: 'center',
      style: 'width:300px',
      type: 'date',
      disableTarget: 'foreverFlag',
      disableCon: 'N',
      sortable: false
    },
    {
      name: 'transferEndDt',
      field: 'transferEndDt',
      label: '결재이양 종료일자',
      align: 'center',
      style: 'width:300px',
      type: 'date',
      disableTarget: 'foreverFlag',
      disableCon: 'N',
      sortable: false
    }
  ],
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
  listUrl.value = selectConfig.sys.appr.transfer.list.url
  saveUrl.value = transactionConfig.sys.appr.transfer.insert.url
  deleteUrl.value = transactionConfig.sys.appr.transfer.delete.url
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
    params: { userId: user.value.userId }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 사용자 추가
 *******************************/
function addTransfer() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(grid.value.data, { transferUserId: item.userId }) === -1) {
        grid.value.data.push({
          sysApprovalTransferId: uid(), // 결재이양자 일련번호
          userId: user.value.userId, // 사용자 ID
          transferUserId: item.userId, // 결재이양자
          transferUserName: item.userName,
          transferUserDeptName: item.deptName,
          transferUserJobName: item.jobName,
          transferUserSpotName: item.spotName,
          foreverFlag: 'N', // 무제한여부
          transferStartDt: '', // 결재이양 시작일자
          transferEndDt: '', // 결재이양 종료일자
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveTransfer() {
  if (validTable(grid.value.columns, grid.value.data)) {
    const saveData: any = grid.value.data.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    const isValidTransfer = ref(false)
    _.forEach(saveData, (_item) => {
      if (_item.foreverFlag == 'N' && !_item.transferStartDt && !_item.transferEndDt) {
        isValidTransfer.value = true
      }
    })
    if (isValidTransfer.value) {
      message.alert({
        title: '안내',
        message: '기간 제한일 경우 시작일자/종료일자를 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
    } else {
      if (saveData.length > 0) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            $http({
              url: saveUrl.value,
              method: 'POST',
              data: saveData
            }).then((_result: any) => {
              message.requestSuccess()
              getList()
            })
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.alert({
          title: '안내',
          message: '변경된 데이터가 없습니다.', // 변경된 데이터가 없습니다.
          type: 'info' // success / info / warning / error
        })
      }
    }
  }
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function removeTransfer() {
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
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

function tableDataChange(props: any) {
  if (props.row['foreverFlag'] == 'Y') {
    props.row['transferStartDt'] = ''
    props.row['transferEndDt'] = ''
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

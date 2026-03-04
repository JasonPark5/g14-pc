<template>
  <c-table
    ref="table"
    :title="popupParam.gridTitle"
    :columns="grid.columns"
    :data="grid.data"
    :gridHeight="grid.height"
    :editable="editable"
    :usePaging="false"
    :isExcelDown="false"
    :filtering="false"
    :isFullScreen="false"
    :columnSetting="false"
    selection="multiple"
    rowKey="sopStepHazardFactorId"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn
          v-if="editable && grid.data!.length > 0"
          label="삭제"
          icon="delete"
          @btnClicked="deleteHazardFactor"
        />
        <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addHazardFactor" />
        <c-btn
          v-if="editable && grid.data!.length > 0"
          label="저장"
          icon="save"
          @btnClicked="saveHazardFactor"
        />
      </q-btn-group>
    </template>
  </c-table>
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
  name: 'sopHazardFactorPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
interface propType {
  popupParam: {
    mdmSopId: stringNull
    jobStepId: stringNull
    sopStepHazardId: stringNull
    mdmHazardFactorsId: stringNull
    gridTitle: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
  height: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      mdmSopId: '',
      jobStepId: '',
      sopStepHazardId: '',
      mdmHazardFactorsId: '',
      gridTitle: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const table = ref<any>(null)
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'hazardOccurReason',
      field: 'hazardOccurReason',
      label: '원인',
      align: 'left',
      style: 'width:150px',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'hazardOccurResult',
      field: 'hazardOccurResult',
      label: '결과',
      align: 'left',
      style: 'width:150px',
      type: 'textarea',
      sortable: false
    }
  ],
  data: [],
  height: '600px'
})
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')

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
  listUrl.value = selectConfig.mdm.sop.hazardFactor.list.url
  saveUrl.value = transactionConfig.mdm.sop.hazardFactor.save.url
  deleteUrl.value = transactionConfig.mdm.sop.hazardFactor.delete.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      sopStepHazardId: props.popupParam.sopStepHazardId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function addHazardFactor() {
  grid.value.data.splice(0, 0, {
    sopStepHazardFactorId: uid(), // 유해위험요인별 원인결과 일련번호
    mdmSopId: props.popupParam.mdmSopId, // 안전작업 표준 일련번호
    jobStepId: props.popupParam.jobStepId, // 작업단계 일련번호
    sopStepHazardId: props.popupParam.sopStepHazardId, // 작업단계별 유해위험요인 일련번호
    mdmHazardFactorsId: props.popupParam.mdmHazardFactorsId, // 유해위험요인 일련번호
    hazardOccurReason: '', // 위험발생 원인
    hazardOccurResult: '', // 위험발생 결과
    regUserId: user.value.userId, // 등록자
    editFlag: 'C'
  })
}
function saveHazardFactor() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: saveUrl.value,
          method: 'PUT',
          data: grid.value.data
        }).then(() => {
          message.requestSuccess()
          getList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function deleteHazardFactor() {
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
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
          message.requestSuccess()
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

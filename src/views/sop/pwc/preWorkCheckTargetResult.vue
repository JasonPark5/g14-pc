<template>
  <div>
    <c-table
      ref="table"
      title="점검항목"
      :columns="grid.columns"
      :data="target.results"
      gridHeight="560px"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      selection="multiple"
      rowKey="sopPreWorkCheckTargetResultId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addResult"
          />
          <c-btn
            v-if="editable && !disabled && target.results!.length > 0"
            :disabled="!target.results || target.results.length === 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteResult"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled"
            :isImmShow="true"
            :requestContentsCols="requestContentsCols"
            tableKey="sopPreWorkCheckTargetResultId"
            ibmTaskTypeCd="ITT0000195"
            ibmTaskUnderTypeCd="ITTU000220"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
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
  name: 'preWorkCheckTargetResult'
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
    sopPreWorkCheckId: stringNull
  }
  target: {
    sopPreWorkCheckTargetId: stringNull // 작업 전 안전점검 대상 일련번호
    sopPreWorkCheckId: stringNull // 작업 전 안전점검 일련번호
    sopPreWorkCheckClassId: stringNull // 작업 전 안전점검구분 일련번호
    targetIds: stringNull // 대상 일련번호(복수)
    regUserId: stringNull // 등록자 ID
    editFlag: stringNull
    results: Array<any>
    deleteResults: Array<any>
  }
  isOld: boolean
  disabled: boolean
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
      sopPreWorkCheckId: ''
    }
  },
  target: () => {
    return {
      sopPreWorkCheckTargetId: '', // 작업 전 안전점검 대상 일련번호
      sopPreWorkCheckId: '', // 작업 전 안전점검 일련번호
      sopPreWorkCheckClassId: '', // 작업 전 안전점검구분 일련번호
      targetIds: '', // 대상 일련번호(복수)
      regUserId: '', // 등록자 ID
      editFlag: '',
      results: [],
      deleteResults: []
    }
  },
  isOld: false,
  disabled: false
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
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목명',
      align: 'left',
      sortable: true,
      style: 'width:450px',
      type: 'text'
    },
    {
      name: 'result',
      field: 'result',
      label: '결과',
      child: [
        {
          name: 'pwcWorkerResultCd',
          field: 'pwcWorkerResultCd',
          label: '근로자',
          align: 'center',
          sortable: true,
          style: 'width:100px',
          type: 'select',
          itemText: 'codeName',
          itemValue: 'code',
          codeGroupCd: 'PWC_RESULT_CD'
        },
        {
          name: 'pwcManagerResultCd',
          field: 'pwcManagerResultCd',
          label: '관리감독자',
          align: 'center',
          sortable: true,
          style: 'width:100px',
          type: 'select',
          itemText: 'codeName',
          itemValue: 'code',
          codeGroupCd: 'PWC_RESULT_CD'
        }
      ]
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:150px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})

/******************************
 * @Computed_선언
 *******************************/
const requestContentsCols = computed(() => {
  return ['checkItemName']
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})

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
function addResult() {
  props.target.results.splice(0, 0, {
    sopPreWorkCheckTargetResultId: uid(), // 작업 전 안전점검 대상 결과 일련번호
    sopPreWorkCheckTargetId: props.target.sopPreWorkCheckTargetId, // 작업 전 안전점검 대상 일련번호
    sopPreWorkCheckId: props.popupParam.sopPreWorkCheckId, // 작업 전 안전점검 일련번호
    sopPreWorkCheckItemId: '', // 작업 전 안전점검항목 일련번호
    checkItemName: '', // 점검항목명
    pwcWorkerResultCd: 'PR00000001', // 결과 (근로자)
    pwcManagerResultCd: 'PR00000001', // 결과 (관리감독자)
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
function deleteResult() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.confirm({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.target.deleteResults) props.target.deleteResults = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.target.deleteResults, {
          sopPreWorkCheckTargetResultId: item.sopPreWorkCheckTargetResultId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.target.deleteResults.push(item)
      }
      props.target.results = _.reject(props.target.results, item)
    })
    table.value.compoTable.clearSelection()
    message.requestSuccess()
  }
}
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

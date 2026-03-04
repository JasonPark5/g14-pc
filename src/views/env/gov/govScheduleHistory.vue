<template>
  <c-table
    ref="table"
    tableId="govScheduleHistory"
    :title="title"
    :columnSetting="false"
    :isFullScreen="false"
    :isExcelDown="false"
    :columns="grid.columns"
    :data="grid.data"
    selection="multiple"
    rowKey="govScheduleHistoryId"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addInfo" />
        <c-btn
          v-if="editable && grid.data && grid.data.length > 0"
          label="삭제"
          icon="delete"
          @btnClicked="deleteInfo"
        />
        <c-btn
          v-if="editable && grid.data && grid.data.length > 0"
          :url="saveUrl"
          :isSubmit="isSave"
          :param="grid.data"
          mappingType="PUT"
          label="저장"
          icon="save"
          @beforeAction="saveInfo"
          @btnCallback="saveCallback"
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
import { govScheduleType } from './schedule'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'govScheduleHistory'
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
interface propType {
  param: {
    govScheduleMstId?: stringNull
  }
  contentHeight?: stringNull
  govSchedule: govScheduleType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  param: () => {
    return {
      govScheduleMstId: ''
    }
  },
  govSchedule: () => {
    return {
      govScheduleMstId: '', // 대관업무 마스터 일련번호
      govScheduleTypeCd: null, // 대관업무구분
      plantCd: null, // 사업장코드
      govScheduleName: '', // 대관업무명
      govScheduleCycleCd: null, // 법정 주기
      remarks: '', // 내용
      useFlag: 'Y', // 사용여부
      inspType: null, // 검사-종류
      relatedLawsCd: null, // 검사-관련법규
      inspTarget: '', // 검사-대상 시설
      contStatus: null, // 계약-상태
      contType: null, // 계약-구분
      contVendor: '', // 계약-업체
      users: [],
      deleteUsers: [],
      govScheduleTypeName: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      name: 'execDt',
      field: 'execDt',
      label: '대관업무 실시일자',
      align: 'center',
      style: 'width:150px',
      sortable: true,
      type: 'date',
      required: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '대관업무 실시자 부서',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'execUserName',
      field: 'execUserName',
      label: '대관업무 실시자',
      align: 'center',
      style: 'width:150px',
      sortable: true,
      type: 'user',
      userId: 'execUserId',
      relationCols: ['deptCd', 'deptName'],
      required: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '업무내용',
      align: 'left',
      sortable: true,
      type: 'textarea'
    },
    {
      name: 'attach',
      field: 'attach',
      label: '관련 파일첨부',
      align: 'center',
      style: 'width:180px',
      type: 'attach',
      taskClassCd: 'GOV_HISTORY_ATTACH_ID',
      keyText: 'govScheduleHistoryId',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const title = computed(
  () =>
    $language('대관업무 이력') +
    ' (' +
    props.govSchedule.govScheduleTypeName +
    ' > ' +
    props.govSchedule.govScheduleName +
    ')'
)

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
  listUrl.value = selectConfig.env.gov.history.list.url
  saveUrl.value = transactionConfig.env.gov.history.save.url
  deleteUrl.value = transactionConfig.env.gov.history.delete.url
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
    params: { govScheduleMstId: props.param.govScheduleMstId }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addInfo() {
  grid.value.data!.splice(0, 0, {
    govScheduleHistoryId: uid(), // 대관업무 이력 일련번호
    govScheduleMstId: props.param.govScheduleMstId, // 대관업무 마스터 일련번호
    execDt: getToday(), // 실시일자
    execUserName: user.value.userName, // 대관업무 실시자
    execUserId: user.value.userId, // 대관업무 실시자
    deptCd: user.value.deptCd,
    deptName: user.value.deptName,
    remarks: '', // 내용
    attach: [],
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 테이블 저장
 *******************************/
function saveInfo() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info',
    confirmCallback: () => {
      console.log('저장 전 데이터 확인:', JSON.stringify(grid.value.data, null, 2))
      isSave.value = !isSave.value
    },
    cancelCallback: () => {}
  })
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 선택 행 삭제
 *******************************/
function deleteInfo() {
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
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => (grid.value.data = _.reject(grid.value.data, item)))
          table.value.compoTable.clearSelection()
          message.requestSuccess()
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

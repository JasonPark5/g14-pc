<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="산업보건 일지 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <!-- <c-appr-btn
                  ref="apprBtn"
                  name="appr-btn"
                  :editable="editable"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalJournal"
                  @callbackApprAction="approvalJournalCallback"
                  @requestAfterAction="getDetail"
                /> -->
                <c-btn
                  v-if="isOld && editable && !disabled"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-show="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="journal"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="journal.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  :disabled="disabled"
                  default="today"
                  label="작성일"
                  type="date"
                  name="startDate"
                  v-model:value="journal.startDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="일지명"
                  name="journalName"
                  v-model:value="journal.journalName"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table1"
            title="전체 지급 현황"
            :columns="totalGrid.columns"
            gridHeightAuto
            :data="totalGrid.data"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="props.row[col.name] > 0">
                {{ props.row[col.name] }}
              </template>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table2"
            title="의약품&의약외품 지급 현황"
            :columns="grid.columns"
            gridHeight="280px"
            :data="journal.results"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :hideBottom="true"
            :editable="editable && !disabled"
            rowKey="industryHealthJournalItemId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult(2)"
                />
                <c-btn
                  v-if="editable && !disabled && journal.results!.length > 0"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeResult(2)"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table3"
            title="물리치료&외상처리 현황"
            :columns="grid2.columns"
            gridHeight="280px"
            :data="journal.statuses"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :hideBottom="true"
            :editable="editable && !disabled"
            rowKey="industryHealthJournalStatusId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult(3)"
                />
                <c-btn
                  v-if="editable && !disabled && journal.statuses!.length > 0"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeResult(3)"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" />
      </div>
    </q-form>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { journalType } from './journal'

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
  name: 'industryHealthJournalDetail'
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
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    industryHealthJournalId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
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
      industryHealthJournalId: ''
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const journal = ref<journalType>({
  industryHealthJournalId: '',
  plantCd: '',
  startDate: '',
  endDate: '',
  journalName: '',
  completeFlag: 'N',
  results: [],
  deleteResults: [],
  statuses: [],
  deleteStatuses: []
})
const totalGrid = ref<gridType>({
  columns: [
    {
      name: 'code1',
      field: 'code1',
      label: '소화기',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code2',
      field: 'code2',
      label: '호흡기',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code3',
      field: 'code3',
      label: '근골',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code4',
      field: 'code4',
      label: '신경',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code5',
      field: 'code5',
      label: '외상',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code6',
      field: 'code6',
      label: '화상',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code7',
      field: 'code7',
      label: '안구',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code8',
      field: 'code8',
      label: '물리치료',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'code9',
      field: 'code9',
      label: '기타',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'total',
      field: 'total',
      label: '합계',
      style: 'width:60px',
      align: 'center',
      sortable: false
    }
  ],
  data: [],
  height: 'auto'
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const grid2 = ref<gridType>({
  columns: [],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
// const isApproval = ref(false)
// const apprBtn = ref<any>(null)
const saveType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const table3 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () => journal.value.completeFlag === 'Y' || journal.value.approvalStatusCd === 'ASC0000001'
)
const isOld = computed(() => Boolean(props.popupParam.industryHealthJournalId))
// const approvalInfo = computed(() => {
//   return {
//     sysApprovalRequestId: journal.value.sysApprovalRequestId, // 결재요청번호
//     /**
//      * 결재상태코드
//      * ASC0000001	결재중
//      * ASC0000002	반려
//      * ASC9999999	결재완료
//      */
//     approvalStatusCd: journal.value.approvalStatusCd,
//     apprEditable: editable.value && isOld.value, // 결재버튼 활성화 기준
//     param: journal.value, // 결재 param
//     approvalUrl: saveUrl.value, // 결재 url
//     isApproval: isApproval.value, // 결재 submit
//     approvalTypeCd: 'APTC000022', // 결재유형코드
//     approvalParamValue: {
//       // 결재상세화면 파라미터
//       industryHealthJournalId: journal.value.industryHealthJournalId,
//       isApprContent: true
//     },
//     approvalRequestName: '산업보건일지 (' + journal.value.journalName + ')', // 결재요청명 (문서 title)
//     approvalConnId: journal.value.industryHealthJournalId // 결재연결용 업무일련번호 (문서 key)
//   }
// })

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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.hea.ihj.get.url
  saveUrl.value = transactionConfig.hea.ihj.insert.url
  deleteUrl.value = transactionConfig.hea.ihj.delete.url
  // code setting
  // list setting
  setHeader()
  getDetail()
}
/******************************
 * TODO (목적): 2,3 테이블 헤더 세팅
 *******************************/
function setHeader() {
  getComboItems('JOURNAL_SYMPTOM_CD').then((_result: any) => {
    const firstItems = _.filter(_result, { attrVal1: 'Y' })
    const secondItems = _.filter(_result, { attrVal1: 'N' })
    grid.value.columns = [
      {
        name: 'journalDeptName',
        field: 'journalDeptName',
        label: '부서',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'journalUserName',
        field: 'journalUserName',
        label: '이름',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        required: true,
        name: 'journalSymptomCd',
        field: 'journalSymptomCd',
        label: '구분',
        align: 'center',
        style: 'width:100px',
        type: 'select',
        comboItems: firstItems,
        itemText: 'codeName',
        itemValue: 'code',
        sortable: false
      },
      {
        required: true,
        name: 'journalTypeName',
        field: 'journalTypeName',
        label: '증상',
        type: 'text',
        align: 'left',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'journalSymptomAction',
        field: 'journalSymptomAction',
        label: '처치사항',
        align: 'left',
        type: 'textarea',
        style: 'width:300px',
        sortable: false
      }
    ]
    grid2.value.columns = [
      {
        name: 'journalDeptName',
        field: 'journalDeptName',
        label: '부서',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'journalUserName',
        field: 'journalUserName',
        label: '이름',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        required: true,
        name: 'journalSymptomCd',
        field: 'journalSymptomCd',
        label: '구분',
        align: 'center',
        type: 'select',
        comboItems: secondItems,
        itemText: 'codeName',
        itemValue: 'code',
        style: 'width:100px',
        sortable: false
      },
      {
        required: true,
        name: 'journalTypeName',
        field: 'journalTypeName',
        label: '증상',
        type: 'text',
        align: 'left',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'workFlag',
        field: 'workFlag',
        label: '업무연관성 유무',
        type: 'check',
        true: 'Y',
        false: 'N',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'journalSymptomDetail',
        field: 'journalSymptomDetail',
        label: '처치사항',
        align: 'left',
        type: 'textarea',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'journalSymptomAction',
        field: 'journalSymptomAction',
        label: '사유',
        align: 'left',
        type: 'textarea',
        style: 'width:300px',
        sortable: false
      }
    ]
  })
}
/******************************
 * TODO (목적): 기본정보 상세 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    totalGrid.value.data = []
    $http({
      url: $format(detailUrl.value, props.popupParam.industryHealthJournalId),
      method: 'GET'
    }).then((_result: any) => {
      journal.value = _result.data
      totalGrid.value.data.push(_result.data)
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}
/******************************
 * TODO (목적): 수령인 추가
 *******************************/
function addResult(num?: number) {
  popupOptions.value = getPopupOptions(
    'user',
    popupOptions.value,
    num === 2 ? closeUser2 : closeUser3,
    {
      type: 'multiple'
    }
  )
}
function closeUser2(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (_item) => {
      const index = _.findIndex(journal.value.results, {
        industryHealthJournalItemId: _item.industryHealthJournalItemId
      })
      if (index === -1) {
        journal.value.results!.splice(0, 0, {
          industryHealthJournalId: props.popupParam.industryHealthJournalId,
          industryHealthJournalItemId: uid(),
          journalDate: getToday(),
          journalDeptName: _item.deptName,
          journalUserId: _item.userId,
          journalUserName: _item.userName,
          journalSymptomCd: null,
          journalTypeName: '',
          journalSymptomDetail: '',
          journalSymptomAction: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
function closeUser3(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (_item) => {
      const index = _.findIndex(journal.value.results, {
        industryHealthJournalStatusId: _item.industryHealthJournalStatusId
      })
      if (index === -1) {
        journal.value.statuses!.splice(0, 0, {
          industryHealthJournalId: props.popupParam.industryHealthJournalId,
          industryHealthJournalStatusId: uid(),
          journalDate: getToday(),
          journalDeptName: _item.deptName,
          journalUserId: _item.userId,
          journalUserName: _item.userName,
          journalTypeName: _item.journalTypeName,
          journalSymptomCd: null,
          journalSymptomDetail: '',
          journalSymptomAction: '',
          workFlag: 'N',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 선택 row 삭제
 *******************************/
function removeResult(num?: number) {
  const selectData = num === 2 ? table2.value.getSelected() : table3.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (num === 2) {
      _.forEach(selectData, (item) => {
        if (!journal.value.deleteResults) journal.value.deleteResults = []
        if (
          item.editFlag !== 'C' &&
          _.findIndex(journal.value.deleteResults, {
            industryHealthJournalItemId: item.industryHealthJournalItemId
          }) === -1
        )
          journal.value.deleteResults.push(item)
        journal.value.results = _.reject(journal.value.results, item)
      })
      table2.value.compoTable.clearSelection()
    } else if (num === 3) {
      _.forEach(selectData, (item) => {
        if (!journal.value.deleteStatuses) journal.value.deleteStatuses = []
        if (
          item.editFlag !== 'C' &&
          _.findIndex(journal.value.deleteStatuses, {
            industryHealthJournalStatusId: item.industryHealthJournalStatusId
          }) === -1
        )
          journal.value.deleteStatuses.push(item)
        journal.value.statuses = _.reject(journal.value.statuses, item)
      })
      table3.value.compoTable.clearSelection()
    }
  }
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function savePlan() {
  saveType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, journal.value.results!)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          journal.value.regUserId = user.value.userId
          journal.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (!isOld.value) props.popupParam.industryHealthJournalId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.industryHealthJournalId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 결재요청
 *******************************/
// function approvalJournal() {
//   editForm.value.validate().then((_result: boolean) => {
//     if (_result && validTable(grid.value.columns, journal.value.results!)) {
//       message.confirm({
//         title: '확인',
//         message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
//         type: 'info', // success / info / warning / error
//         confirmCallback: () => {
//           journal.value.regUserId = user.value.userId
//           journal.value.chgUserId = user.value.userId
//           isApproval.value = !isApproval.value
//         },
//         cancelCallback: () => {}
//       })
//     } else message.validError()
//   })
// }
// function approvalJournalCallback() {
//   apprBtn.value.apprRequestPop() // 결재관련 결재요청버튼 callback
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

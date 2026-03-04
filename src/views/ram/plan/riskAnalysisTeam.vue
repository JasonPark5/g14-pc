<template>
  <div>
    <c-table
      ref="table2"
      title="회의 목록"
      :columns="grid2.columns"
      :gridHeight="grid2.height"
      :data="assessPlan.conferences"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :isFullScreen="false"
      :editable="editable && !disabled"
      selection="multiple"
      rowKey="ramAssessmentConferenceId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addConference"
          />
          <c-btn
            v-if="
              editable && !disabled && assessPlan.conferences && assessPlan.conferences.length > 0
            "
            :disabled="disabled"
            label="삭제"
            icon="remove"
            @btnClicked="deleteConference"
          />
          <c-btn
            v-if="
              editable && !disabled && assessPlan.conferences && assessPlan.conferences.length > 0
            "
            :disabled="disabled"
            :isSubmit="isSaveConference"
            :url="saveConferenceUrl"
            :param="assessPlan.conferences"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveAssessConference"
            @btnCallback="saveConferenceCallback"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="table3"
      title="관련자료"
      :columns="grid3.columns"
      :gridHeight="grid3.height"
      :data="assessPlan.relatedDocuments"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :isFullScreen="false"
      :editable="editable && !disabled"
      selection="multiple"
      rowKey="ramRelatedDocumentId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable && !disabled" label="기타-추가" icon="add" @btnClicked="addEtc" />
          <c-btn
            v-if="editable && !disabled"
            label="추가"
            icon="add"
            @btnClicked="addRelateDocument"
          />
          <c-btn
            v-if="
              editable &&
              !disabled &&
              assessPlan.relatedDocuments &&
              assessPlan.relatedDocuments.length > 0
            "
            :disabled="disabled"
            label="삭제"
            icon="remove"
            @btnClicked="deleteRelateDocument"
          />
          <c-btn
            v-if="
              editable &&
              !disabled &&
              assessPlan.relatedDocuments &&
              assessPlan.relatedDocuments.length > 0
            "
            :disabled="disabled"
            :isSubmit="isSaveRelateDocument"
            :url="saveRelateDocumentUrl"
            :param="assessPlan.relatedDocuments"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveRelateDocument"
            @btnCallback="saveRelateDocumentCallback"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="neartable"
      title="관련 아차사고 목록"
      :columns="gridNear.columns"
      :data="gridNear.data"
      :gridHeight="gridNear.height"
      :filtering="false"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="iimNearAccidentId"
      @linkClick="nearLinkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addNearTask" />
          <c-btn
            v-show="editable && !disabled && gridNear.data && gridNear.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteNearTask"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="patroltable"
      id="patrol"
      title="관련 순회점검 목록"
      :columns="gridPatrol.columns"
      :data="gridPatrol.data"
      :gridHeight="gridPatrol.height"
      :filtering="false"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="saiPatrolId"
      @linkClick="patrolLinkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addPatrolTask" />
          <c-btn
            v-if="editable && !disabled && gridPatrol.data && gridPatrol.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deletePatrolTask"
          />
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
import { assessPlanType } from '../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskAnalysisTeam'
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
  assessPlan: assessPlanType
  vendorFlag: boolean
  disabled: boolean
  disabled2: boolean
}
interface gridType {
  columns: tableColumnType
  height: stringNull
  data?: Array<any>
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  assessPlan: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      plantCd: '', // 사업장 코드
      ramTechniqueCd: '', // 평가기법 코드_HAZOP/KRAS/JSA/CHECKLIST
      ramAssessTypeCd: '', // 평가구분_최초/정기/수시
      assessmentName: '', // 평가명
      assessmentStartDate: '', // 평가시작일
      assessmentEndDate: '', // 평가종료일
      assessmentPeriod: [],
      assessmentYear: '', // 평가년도
      ramStepCd: '', // 평가 진행단계 코드
      assessmentManageDeptCd: '', // 평가주관 부서 코드
      assessmentManageUserId: '', // 평가주관 담당자 ID
      ramMatrixId: null, // 위험메트릭스 번호
      sopMocId: '', // MOC 일련번호
      remark: '', // 상세내용
      workArea: '', // 작업지역
      regDtStr: '',
      regUserId: '', // 작성자 ID
      regUserName: '', // 작성자 ID
      reviewUserId: '', // 검토자 ID
      reviewDate: '', // 검토일
      approvalUserId: '', // 승인자 ID
      approvalDate: '', // 승인일
      vendorCd: '',
      sopConstructionId: '',
      chgUserId: '', // 수정자 ID
      teams: [], // 평가팀 목록
      delTeams: [],
      occasions: [], // 수시 변경/추가 내역 목록
      conferences: [], // 회의 목록
      relatedDocuments: [], // 관련자료 목록
      processes: [] // 대상공정 목록
    }
  },
  vendorFlag: false,
  disabled: false,
  disabled2: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'conferenceName',
      field: 'conferenceName',
      label: '회의명',
      align: 'left',
      style: 'width:25%',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      name: 'conferenceDate',
      field: 'conferenceDate',
      label: '회의일',
      align: 'center',
      style: 'width:10%',
      type: 'date',
      sortable: false,
      required: true
    },
    {
      name: 'conferenceContents',
      field: 'conferenceContents',
      label: '회의내용',
      align: 'left',
      style: 'width:45%',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'attendees',
      field: 'attendees',
      label: '참석자',
      align: 'center',
      style: 'width:10%',
      type: 'text',
      sortable: false
    },
    {
      name: 'attach',
      field: 'attach',
      label: '첨부파일',
      align: 'center',
      style: 'width:10%',
      type: 'attach',
      taskClassCd: 'RSA_CONFERENCE',
      keyText: 'ramAssessmentConferenceId',
      sortable: false
    }
  ],
  data: [],
  height: 'auto'
})

const grid3 = ref<gridType>({
  columns: [
    {
      name: 'ramDocumentTypeName',
      field: 'ramDocumentTypeName',
      label: '분류',
      align: 'center',
      style: 'width:10%',
      sortable: false
    },
    {
      name: 'documentTitle',
      field: 'documentTitle',
      description: 'documentSubTitle',
      label: '제목',
      align: 'left',
      style: 'width:40%',
      sortable: false
    },
    {
      name: 'materialName',
      field: 'materialName',
      label: '자료명',
      align: 'left',
      style: 'width:40%',
      type: 'text',
      sortable: false,
      required: true
    },
    {
      name: 'attach',
      field: 'attach',
      label: '첨부파일',
      align: 'center',
      style: 'width:10%',
      type: 'attach',
      taskClassCd: 'RSA_RELATE_INFO',
      keyText: 'ramRelatedDocumentId',
      sortable: false
    }
  ],
  height: 'auto'
})

const gridNear = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimNearAccidentNo',
      field: 'iimNearAccidentNo',
      label: '아차사고번호',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimNearAccidentName',
      field: 'iimNearAccidentName',
      label: '아차사고명',
      style: 'width:320px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimStatusNearName',
      field: 'iimStatusNearName',
      style: 'width:100px',
      label: '진행상태',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimNearKindName',
      field: 'iimNearKindName',
      style: 'width:80px',
      label: '아차사고유형',
      align: 'center',
      sortable: true
    },
    {
      name: 'iimGradeName',
      field: 'iimGradeName',
      label: '아차사고등급',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'occurrenceLocation',
      field: 'occurrenceLocation',
      label: '발생가능장소',
      style: 'width:100px',
      align: 'left',
      sortable: true
    },
    {
      name: 'occurrenceDt',
      field: 'occurrenceDt',
      style: 'width:100px',
      label: '발생일',
      align: 'center',
      sortable: true
    }
  ],
  data: [],
  height: 'auto'
})

const gridPatrol = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '부서',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'sopMapId',
      field: 'sopMapId',
      label: '순회장소',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'patrolName',
      field: 'patrolName',
      label: '순회명',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width:200px'
    },
    {
      name: 'patrolDate',
      field: 'patrolDate',
      label: '순회일',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'patrolCompleteFlagName',
      field: 'patrolCompleteFlagName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    }
  ],
  data: [],
  height: 'auto'
})
const task = ref<any>({
  insertUrl: '',
  deleteUrl: ''
})
const conferenceListUrl = ref('')
const saveConferenceUrl = ref('')
const deleteConferenceUrl = ref('')
const relateDocumentListUrl = ref('')
const saveRelateDocumentUrl = ref('')
const deleteRelateDocumentUrl = ref('')
const nearListUrl = ref('')
const patrolListUrl = ref('')
const isSaveConference = ref(false)
const isSaveRelateDocument = ref(false)
const table2 = ref<any>(null)
const table3 = ref<any>(null)
const neartable = ref<any>(null)
const patroltable = ref<any>(null)
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
  conferenceListUrl.value = selectConfig.ram.assessConference.list.url
  relateDocumentListUrl.value = selectConfig.ram.relatedDocument.list.url
  saveConferenceUrl.value = transactionConfig.ram.assessConference.update.url
  saveRelateDocumentUrl.value = transactionConfig.ram.relatedDocument.update.url
  deleteConferenceUrl.value = transactionConfig.ram.assessConference.delete.url
  deleteRelateDocumentUrl.value = transactionConfig.ram.relatedDocument.delete.url
  nearListUrl.value = selectConfig.sop.iim.accident.near.list.url
  patrolListUrl.value = selectConfig.sai.patrol.list.url
  task.value.insertUrl = transactionConfig.ram.assessPlan.task.insert.url
  task.value.deleteUrl = transactionConfig.ram.assessPlan.task.delete.url
  // code setting
  // list setting
  // getConferences()
  getNearList()
  getPatrolList()
}
/******************************
 * TODO (목적): 회의목록 조회
 *******************************/
function getConferences() {
  $http({
    url: conferenceListUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    props.assessPlan.conferences = _result.data
  })
}
/******************************
 * TODO (목적): 관련자료 조회
 *******************************/
function getRelateDocuments() {
  $http({
    url: relateDocumentListUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    props.assessPlan.relatedDocuments = _result.data
  })
}
/******************************
 * TODO (목적): 아차사고 조회
 *******************************/
function getNearList() {
  $http({
    url: nearListUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    gridNear.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 순회점검 조회
 *******************************/
function getPatrolList() {
  $http({
    url: patrolListUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    gridPatrol.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 회의 추가
 *******************************/
function addConference() {
  props.assessPlan.conferences.splice(0, 0, {
    ramAssessmentConferenceId: uid(),
    conferenceName: '',
    conferenceDate: getToday(),
    conferenceContents: '',
    attendees: '',
    editFlag: 'C',
    regUserId: user.value.userId,
    ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
  })
}
/******************************
 * TODO (목적): 회의 삭제
 *******************************/
function deleteConference() {
  const selectData = table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: deleteConferenceUrl.value,
      method: 'DELETE',
      data: Object.values(selectData)
    }).then(() => {
      message.requestSuccess()
      _.forEach(selectData, (_item: any) => {
        props.assessPlan.conferences = _.reject(props.assessPlan.conferences, _item)
      })
      table2.value.compoTable.clearSelection()
    })
  }
}
/******************************
 * TODO (목적): 관련자료 추가
 *******************************/
function addRelateDocument() {
  popupOptions.value.isFull = false
  popupOptions.value.width = '60%'
  popupOptions.value = getPopupOptions(
    'riskRelationDocu',
    popupOptions.value,
    closeRelateDocumentPopup,
    {
      /** 원하는 parameter 정의 */
      type: 'multiple'
    }
  )
}
/******************************
 * TODO (목적): 관련자료 추가 팝업 Callback
 *******************************/
function closeRelateDocumentPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.assessPlan.relatedDocuments, {
          documentId: item.documentId,
          ramDocumentTypeCd: item.ramDocumentTypeCd
        }) === -1
      ) {
        props.assessPlan.relatedDocuments.splice(0, 0, {
          ramRelatedDocumentId: uid(), // 관련자료 일련번호
          ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId, // 평가 일련번호
          ramDocumentTypeCd: item.ramDocumentTypeCd, // 문서 분류 코드
          ramDocumentTypeName: item.ramDocumentTypeName, // 문서 분류 코드
          documentId: item.documentId, // 문서 일련번호
          documentTitle: item.documentTitle, // 문서 제목
          documentSubTitle: item.documentSubTitle, // 문서 부제목
          materialName: item.documentTitle, // 자료명
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 기타 추가
 *******************************/
function addEtc() {
  if (!props.assessPlan.relatedDocuments) props.assessPlan.relatedDocuments = []
  props.assessPlan.relatedDocuments.splice(0, 0, {
    ramRelatedDocumentId: uid(), // 관련자료 일련번호
    ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId, // 평가 일련번호
    ramDocumentTypeCd: 'RDT0000020', // 문서 분류 코드
    ramDocumentTypeName: '기타', // 문서 분류 코드
    documentId: '', // 문서 일련번호
    documentTitle: '', // 문서 제목
    documentSubTitle: '', // 문서 부제목
    materialName: '', // 자료명
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 회의 저장
 *******************************/
function saveAssessConference() {
  if (validTable(grid2.value.columns, props.assessPlan.conferences)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.assessPlan.conferences, (_item: any) => {
          _item.chgUserId = user.value.userId
        })

        isSaveConference.value = !isSaveConference.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.validError()
  }
}
/******************************
 * TODO (목적): 회의 저장 callback
 *******************************/
function saveConferenceCallback() {
  message.requestSuccess()
  getConferences()
}

/******************************
 * TODO (목적): 관련자료 저장
 *******************************/
function saveRelateDocument() {
  if (validTable(grid3.value.columns, props.assessPlan.relatedDocuments)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSaveRelateDocument.value = !isSaveRelateDocument.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.validError()
  }
}

/******************************
 * TODO (목적): 관련자료 저장 callback
 *******************************/
function saveRelateDocumentCallback() {
  message.requestSuccess()
  getRelateDocuments()
}

/******************************
 * TODO (목적): 관련자료 삭제
 *******************************/
function deleteRelateDocument() {
  const selectData = table3.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: deleteRelateDocumentUrl.value,
      method: 'DELETE',
      data: Object.values(selectData)
    }).then(() => {
      message.requestSuccess()
      _.forEach(selectData, (_item: any) => {
        props.assessPlan.relatedDocuments = _.reject(props.assessPlan.relatedDocuments, _item)
      })
      table3.value.compoTable.clearSelection()
    })
  }
}

/******************************
 * TODO (목적): 아차사고 상세팝업
 *******************************/
function nearLinkClick(_row: any) {
  popupOptions.value.title = '아차사고 상세'
  popupOptions.value.param = {
    iimNearAccidentId: _row ? _row.iimNearAccidentId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/sop/iim/near/nearAccidentDetail.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closeNearPopup
}
/******************************
 * TODO (목적): 아차사고 상세팝업 callback
 *******************************/
function closeNearPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getNearList()
}
/******************************
 * TODO (목적): 아차사고 삭제
 *******************************/
function deleteNearTask() {
  const selectData = neartable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: task.value.deleteUrl,
          method: 'DELETE',
          data: Object.values(
            _.map(selectData, (item) => {
              return {
                ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
                iimNearAccidentId: item.iimNearAccidentId
              }
            })
          )
        }).then(() => {
          message.requestSuccess()
          neartable.value.compoTable.clearSelection()
          getNearList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 아차사고 추가
 *******************************/
function addNearTask() {
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
  popupOptions.value = getPopupOptions('nearAccident', popupOptions.value, closeNearTaskPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 아차사고 추가 callback
 *******************************/
function closeNearTaskPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const insertList = [] as any
    _.forEach(_data, (item) => {
      if (_.findIndex(gridNear.value.data, { iimNearAccidentId: item.iimNearAccidentId }) === -1) {
        insertList.push({
          ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
          iimNearAccidentId: item.iimNearAccidentId
        })
      }
    })

    $http({
      url: task.value.insertUrl,
      method: 'POST',
      data: insertList
    }).then(() => {
      message.requestSuccess()
      getNearList()
    })
  }
}
/******************************
 * TODO (목적): 순회점검 상세
 *******************************/
function patrolLinkClick(_row: any) {
  popupOptions.value.title = '순회점검 상세'
  popupOptions.value.param = {
    saiPatrolId: _row ? _row.saiPatrolId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/sai/patrol/patrolDetail.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePatrolPopup
}
/******************************
 * TODO (목적): 순회점검 상세팝업 callback
 *******************************/
function closePatrolPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getPatrolList()
}
/******************************
 * TODO (목적): 순회점검 삭제
 *******************************/
function deletePatrolTask() {
  const selectData = patroltable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: task.value.deleteUrl,
          method: 'DELETE',
          data: Object.values(
            _.map(selectData, (item) => {
              return {
                ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
                saiPatrolId: item.saiPatrolId
              }
            })
          )
        }).then(() => {
          message.requestSuccess()
          patroltable.value.compoTable.clearSelection()
          getPatrolList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 순회점검 추가
 *******************************/
function addPatrolTask() {
  popupOptions.value = getPopupOptions('patrol', popupOptions.value, closePatrolTaskPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closePatrolTaskPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const insertList = [] as any
    _.forEach(_data, (item) => {
      if (_.findIndex(gridPatrol.value.data, { saiPatrolId: item.saiPatrolId }) === -1) {
        insertList.push({
          ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
          saiPatrolId: item.saiPatrolId
        })
      }
    })
    $http({
      url: task.value.insertUrl,
      method: 'POST',
      data: insertList
    }).then(() => {
      message.requestSuccess()
      getPatrolList()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

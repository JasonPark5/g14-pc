<template>
  <div>
    <c-table
      ref="tableCommittee"
      title="위원회/검토자 목록"
      :columns="gridCommittee.columns"
      :gridHeight="gridCommittee.height"
      :data="moc.committees"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      selection="multiple"
      rowKey="sopChangeCommitteeMemberId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addComittee"
          />
          <c-btn
            v-if="editable && !disabled && moc.committees && moc.committees.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeComittee"
          />
          <c-btn
            v-show="editable && !disabled && moc.committees && moc.committees.length > 0"
            :isSubmit="isSaveComittee"
            :url="saveComitteeUrl"
            :param="gridCommittee.saveData"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveComittee"
            @btnCallback="saveComitteeCallback"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="tableCommitteeReviewItem"
      class="q-mt-sm"
      title="검토필요항목"
      :columns="gridCommitteeReviewItem.columns"
      :gridHeight="gridCommitteeReviewItem.height"
      :data="moc.committeeReviewItems"
      :filtering="false"
      :usePaging="false"
      :columnSetting="false"
      :editable="editable && !disabled"
      selection="multiple"
      rowKey="sopChangeCommitteeReviewItemId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addReviewItem"
          />
          <c-btn
            v-if="
              editable &&
              !disabled &&
              moc.committeeReviewItems &&
              moc.committeeReviewItems.length > 0
            "
            label="삭제"
            icon="remove"
            @btnClicked="removeReviewItem"
          />
          <c-btn
            v-show="
              editable &&
              !disabled &&
              moc.committeeReviewItems &&
              moc.committeeReviewItems.length > 0
            "
            :isSubmit="isSaveReviewItem"
            :url="saveReviewItemUrl"
            :param="gridCommitteeReviewItem.saveData"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveReviewItem"
            @btnCallback="saveReviewItemCallback"
          />
        </q-btn-group>
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
import { committeeReviewItemType, committeesType, mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'committeeNreviewer'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
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
interface propType {
  moc: mocType
  disabled: boolean
}
interface gridType {
  columns: Array<tableColumnType>
  height: string
  saveData: {
    sopMocId: string
    committees?: Array<committeesType>
    committeeReviewItems?: Array<committeeReviewItemType>
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  moc: () => {
    return {
      sopMocId: '', // MOC 일련번호
      mocNo: '', // moc 관리번호
      plantCd: '', // 사업장 코드
      processCd: '', // 공정
      judgmentUserId: '', // 판정자 ID
      judgmentUserName: '', // 판정자 명
      initiativeUserId: '', // 발의자 ID
      initiativeUserName: '', // 발의자 명
      initiativeDeptCd: '', // 발의 부서 코드
      initiativeDeptName: '', // 발의 부서명
      initiativeDt: '', // 발의일
      mocTitle: '', // 변경관리 제목
      mocSummary: '', // 변경 개요
      mocTypeCd: 'MT00000001', // 변경구분_공통코드(정상/비상/임시)
      mocWriteLevelCd: null, // 변경등급_작성
      mocConfirmLevelCd: null, // 변경등급_검토
      processSatefySecureMeasures: '', // 공정안전 확보 대책
      technicalBasisProcessDesign: '', // 변경계획에 대한 공정 및 설계의 기술근거
      safetyReliabilityImprovementEffect: '', // 안전성에 필요한 사항 및 신뢰성 향상 효과
      leaderOpinion: '', // 팀장의견
      relatedLaws: '', // 관련 볍령_텍스트
      processRiskAssessFlag: '', // 공정위험성 평가 여부
      jobRiskAssessFlag: '', // 작업위헝성 평가 여부
      mocPeriod: [],
      mocStartDate: '', // 변경 시작일
      mocEndDate: '', // 변경 종료일
      mocStepCd: '', // 변경관리 단계
      mocActionDeptCd: '', // 변경실행 부서코드
      mocActionResponsibilityUserId: '', // 변경실행 책임자 ID
      mocCompleteCheckUserId: '', // 변경완료 확인자 ID
      mocCompleteCheckDeptCd: '', // 변경완료 확인 부서 코드
      mocCompleteOpinion: '', // 변경완료 의견
      mocBenefitCds: '', // 변경관리 기대효과_복수
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      checklists: [],
      checklistEquips: [],
      checklistDrives: [],
      equipments: [],
      deleteEquipments: [],
      reviews: [],
      committees: [],
      committeeReviewItems: [],
      committeeHold: {
        sopMocId: '', // MOC 일련번호
        firstHoldDate: '', // (최초) 개최일
        firstHoldArea: '', // (최초) 개최장소
        firstReviewContents: '', // (최초) 검토내용
        firstReviewResult: '', // (최초) 검토결과
        professionalHoldDate: '', // (전문가) 개최일
        professionalHoldArea: '', // (전문가) 개최장소
        professionalReviewContents: '', // (전문가) 검토내용
        professionalReviewResult: '', // (전문가) 검토결과
        finalHoldDate: '', // (최종) 개최일
        finalHoldArea: '', // (최종) 개최장소
        finalReviewContents: '', // (최종) 검토내용
        finalReviewResult: '', // (최종) 검토결과
        changeApprovalFlag: '', // 변경 승인 여부
        changeApprovalReason: '', // 변경 승인 사유
        changeApprovalDate: '', // 승인일
        changeKeepFlag: '', // 변경유지 여부
        changeKeepReason: '', // 변경유지 사유
        regUserId: '', // 등록자 ID
        chgUserId: '' // 수정자 ID
      },
      relatedWorks: [],
      prestartupImproves: []
    }
  },
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
const gridCommittee = ref<gridType>({
  columns: [],
  height: '300px',
  saveData: {
    sopMocId: '',
    committees: []
  }
})
const gridCommitteeReviewItem = ref<gridType>({
  columns: [
    {
      name: 'reviewItemName',
      field: 'reviewItemName',
      label: '검토항목',
      align: 'left',
      style: 'width:250px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'confirmUserName',
      field: 'confirmUserName',
      label: '확인자',
      align: 'center',
      style: 'width:100px',
      type: 'user',
      userId: 'confirmUserId',
      sortable: false,
      value: '',
      setHeader: true
    },
    {
      name: 'reviewCompleteRequestDate',
      field: 'reviewCompleteRequestDate',
      label: '검토완료요구일',
      align: 'center',
      style: 'width:100px',
      type: 'date',
      sortable: false,
      value: '',
      setHeader: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      label: '검토자',
      align: 'center',
      style: 'width:100px',
      type: 'user',
      userId: 'reviewUserId',
      sortable: false,
      value: '',
      setHeader: true
    }
  ],
  height: '400px',
  saveData: {
    sopMocId: '',
    committeeReviewItems: []
  }
})
const isSaveComittee = ref(false)
const isSaveReviewItem = ref(false)
const committeeListUrl = ref('')
const reviewItemListUrl = ref('')
const saveComitteeUrl = ref('')
const deleteComitteeUrl = ref('')
const saveReviewItemUrl = ref('')
const deleteReviewItemUrl = ref('')
const tableCommittee = ref<any>(null)
const tableCommitteeReviewItem = ref<any>(null)

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
  committeeListUrl.value = selectConfig.sop.moc.change.committee.list.url
  reviewItemListUrl.value = selectConfig.sop.moc.change.reviewItem.list.url
  saveComitteeUrl.value = transactionConfig.sop.moc.committee.save.url
  deleteComitteeUrl.value = transactionConfig.sop.moc.committee.delete.url
  saveReviewItemUrl.value = transactionConfig.sop.moc.committeeReviewItem.save.url
  deleteReviewItemUrl.value = transactionConfig.sop.moc.committeeReviewItem.delete.url
  // code setting
  getComboItems('MOC_ROLE_CD').then((_result) => {
    getComboItems('COM_INSIDE_OUTSIDE_CD').then((inout) => {
      gridCommittee.value.columns = [
        {
          name: 'mocRoleCd',
          field: 'mocRoleCd',
          label: '역할',
          align: 'center',
          type: 'select',
          style: 'width:100px',
          comboItems: _result,
          sortable: false
        },
        {
          name: 'comInsideOutsideCd',
          field: 'comInsideOutsideCd',
          label: '내외부구분',
          align: 'center',
          style: 'width:100px',
          type: 'select',
          comboItems: inout,
          none: true,
          sortable: false
        },
        {
          name: 'userName',
          field: 'userName',
          label: '이름',
          align: 'center',
          type: 'user',
          userId: 'userId',
          style: 'width:100px',
          sortable: false,
          isInout: true,
          inoutCol: 'comInsideOutsideCd',
          in: '1',
          out: '2',
          relationCols: ['deptCd', 'deptName']
        },
        {
          name: 'deptName',
          field: 'deptName',
          label: '부서',
          align: 'center',
          style: 'width:100px',
          sortable: false
        }
        // {
        //   name: 'positionNm',
        //   field: 'positionNm',
        //   label: '직책',
        //   align: 'center',
        //   sortable: true
        // },
        // {
        //   name: 'dutyNm',
        //   field: 'dutyNm',
        //   label: '직위',
        //   align: 'center',
        //   sortable: true
        // },
      ]
    })
  })
  // list setting
}
/******************************
 * TODO (목적): 위원회/검토자 조회
 *******************************/
function getComittees() {
  $http({
    url: committeeListUrl.value,
    method: 'GET',
    params: {
      sopMocId: props.moc.sopMocId
    }
  }).then((_result: any) => {
    props.moc.committees = _result.data
  })
}
/******************************
 * TODO (목적): 검토필요항목 조회
 *******************************/
function getReviewItems() {
  $http({
    url: reviewItemListUrl.value,
    method: 'GET',
    params: {
      sopMocId: props.moc.sopMocId
    }
  }).then((_result: any) => {
    props.moc.committeeReviewItems = _result.data
  })
}
/******************************
 * TODO (목적): 위원회/검토자 행 추가
 *******************************/
function addComittee() {
  if (!props.moc.committees) props.moc.committees = []
  props.moc.committees.splice(0, 0, {
    sopChangeCommitteeMemberId: uid(), // 변경위원 번호
    sopMocId: props.moc.sopMocId, // MOC 일련번호
    comInsideOutsideCd: '1', // 내외부 구분
    userId: '', // 위원id_내부
    userName: '', // 이름
    deptName: '', // 부서명
    mocRoleCd: null, // 역할_코드 : 위원장/위원
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 위원회/검토자 삭제
 *******************************/
function removeComittee() {
  const selectData = tableCommittee.value.getSelected()
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
          url: deleteReviewItemUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.moc.committees = _.reject(props.moc.committees, item)
          })
          tableCommittee.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 위원회/검토자 저장 전 처리
 *******************************/
function saveComittee() {
  if (validTable(gridCommittee.value.columns, props.moc.committees)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        gridCommittee.value.saveData.sopMocId = props.moc.sopMocId
        gridCommittee.value.saveData.committees = _.cloneDeep(props.moc.committees)

        isSaveComittee.value = !isSaveComittee.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 위원회/검토자 저장 후 처리
 *******************************/
function saveComitteeCallback() {
  message.requestSuccess()
  getComittees()
}
/******************************
 * TODO (목적): 검토필요항목 추가
 *******************************/
function addReviewItem() {
  if (!props.moc.committeeReviewItems) props.moc.committeeReviewItems = []
  props.moc.committeeReviewItems.splice(0, 0, {
    sopChangeCommitteeReviewItemId: uid(), // 검토필요 항목 번호
    sopMocId: props.moc.sopMocId, // MOC 일련번호
    reviewItemName: '', // 검토 항목명
    reviewCompleteRequestDate: '', // 검토완료요구일
    confirmUserId: '', // 확인자 id
    reviewUserId: '', // 검토자 id
    reviewContents: '', // 검토내용
    reviewCompleteDate: '', // 검토완료일
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 검토필요항목 삭제
 *******************************/
function removeReviewItem() {
  const selectData = tableCommitteeReviewItem.value.getSelected()
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
          url: deleteComitteeUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.moc.committeeReviewItems = _.reject(props.moc.committeeReviewItems, item)
          })
          tableCommitteeReviewItem.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 검토필요항목 저장 전 처리
 *******************************/
function saveReviewItem() {
  if (validTable(gridCommitteeReviewItem.value.columns, props.moc.committeeReviewItems)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        gridCommitteeReviewItem.value.saveData.sopMocId = props.moc.sopMocId
        gridCommitteeReviewItem.value.saveData.committeeReviewItems = _.cloneDeep(
          props.moc.committeeReviewItems
        )

        isSaveReviewItem.value = !isSaveReviewItem.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 검토필요항목 저장 후 처리
 *******************************/
function saveReviewItemCallback() {
  message.requestSuccess()
  getReviewItems()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

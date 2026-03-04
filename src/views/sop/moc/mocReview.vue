<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          title="개최정보"
          :columns="gridComitteeHold.columns"
          :gridHeight="gridComitteeHold.height"
          :data="gridComitteeHold.data"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="true"
          :isFullScreen="false"
          :isExcelDown="false"
          :editable="editable && !disabled"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && !disabled"
                :isSubmit="isSaveComitteeHold"
                :url="saveComitteeHoldUrl"
                :param="moc"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveComitteeHold"
                @btnCallback="saveComitteeHoldCallback"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm">
          <c-card title="승인 상세">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- <q-chip
                  class="no-border"
                  style="margin-right:5px !important" 
                  square outline
                  color="red" 
                  text-color="white" 
                  icon="report" 
                  size="12px" >
                  {{$language('개최정보가 하나 이상 등록 될 시')}}&nbsp;<strong>{{$language('승인')}}</strong>&nbsp;{{$language('진행하실 수 있습니다.')}}
                </q-chip> -->
                <c-btn
                  v-show="editable && !disabled2"
                  :isSubmit="isSaveApproval"
                  :url="approvalComitteeHoldUrl"
                  :param="moc"
                  mappingType="PUT"
                  label="승인"
                  icon="approval"
                  @beforeAction="approvalComitteeHold"
                  @btnCallback="approvalComitteeHoldCallback"
                />
                <c-btn
                  v-show="editable && !disabled2"
                  :isSubmit="isSaveNonApproval"
                  :url="approvalComitteeHoldUrl"
                  :param="moc"
                  mappingType="PUT"
                  label="불승인"
                  icon="do_not_disturb_on"
                  @beforeAction="nonApprovalComitteeHold"
                  @btnCallback="nonApprovalComitteeHoldCallback"
                />
                <c-btn
                  v-show="editable && !disabled2"
                  :isSubmit="isSaveComitteeHoldApprovalInfo"
                  :url="saveComitteeHoldUrl"
                  :param="moc"
                  mappingType="PUT"
                  label="저장"
                  icon="save"
                  @beforeAction="saveComitteeHoldApprovalInfo"
                  @btnCallback="saveComitteeHoldApprovalInfoCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-radio
                  :disabled="true"
                  :editable="editable"
                  :comboItems="approvItems"
                  label="승인여부"
                  name="changeApprovalFlag"
                  v-model:value="moc.committeeHold!.changeApprovalFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-datepicker
                  required
                  :disabled="disabled2"
                  :editable="editable"
                  label="승인/불승인 처리일"
                  name="changeApprovalDate"
                  v-model:value="moc.committeeHold!.changeApprovalDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  required
                  :disabled="disabled2"
                  :editable="editable"
                  label="승인/불승인 사유"
                  name="changeApprovalReason"
                  autogrow
                  v-model:value="moc.committeeHold!.changeApprovalReason"
                />
              </div>
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-upload :attachInfo="attachInfo" :editable="editable && !disabled2" />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
    <c-table
      title="최종 진행항목"
      gridHeightAuto
      :columns="gridRelatedWork.columns"
      :data="moc.relatedWorks"
      :filtering="false"
      :usePaging="false"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :editable="editable && !disabled"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSaveRelatedWork"
            :url="saveRelatedWorkUrl"
            :param="gridRelatedWork.saveData"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveRelatedWork"
            @btnCallback="saveRelatedWorkCallback"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      title="검토"
      :columns="gridCommitteeReviewItem.columns"
      :gridHeight="gridCommitteeReviewItem.height"
      :data="moc.committeeReviewItems"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
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
import { committeeReviewItemType, mocType, relatedWorkType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocReview'
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
const emits = defineEmits(['saveCallback', 'approvalCallback'])

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
  disabled2: boolean
  attachInfo: attachSettingType
}
interface gridComitteeHoldType {
  columns: Array<tableColumnType>
  height: string
  data: Array<any>
}
interface gridCommitteeReviewItemType {
  columns: Array<tableColumnType>
  height: string
  saveData: {
    sopMocId: string
    committeeReviewItems: Array<committeeReviewItemType>
  }
}
interface gridRelatedWorkType {
  columns: Array<tableColumnType>
  height: string
  saveData: {
    sopMocId: string
    relatedWorks: Array<relatedWorkType>
  }
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
  disabled: false,
  disabled2: false,
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'MOC_APPROVAL',
      taskKey: ''
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
const editable = ref(true)
const gridComitteeHold = ref<gridComitteeHoldType>({
  columns: [
    {
      name: 'gubun',
      field: 'gubun',
      label: '구분',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'holdDate',
      field: 'holdDate',
      label: '개최일',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'date'
    },
    {
      name: 'holdArea',
      field: 'holdArea',
      label: '개최장소',
      align: 'left',
      style: 'width:120px',
      sortable: true,
      type: 'text'
    },
    {
      name: 'reviewContents',
      field: 'reviewContents',
      label: '검토내용',
      align: 'left',
      style: 'width:150px',
      type: 'textarea',
      sortable: true
    },
    {
      name: 'reviewResult',
      field: 'reviewResult',
      label: '검토결과',
      align: 'left',
      style: 'width:150px',
      type: 'textarea',
      sortable: true
    }
  ],
  data: [],
  height: '425px'
})
const gridCommitteeReviewItem = ref<gridCommitteeReviewItemType>({
  columns: [
    {
      name: 'reviewItemName',
      field: 'reviewItemName',
      label: '검토항목',
      align: 'left',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      label: '검토자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewContents',
      field: 'reviewContents',
      label: '검토내용',
      align: 'left',
      style: 'width:400px',
      type: 'textarea',
      sortable: true
    },
    {
      name: 'reviewCompleteDate',
      field: 'reviewCompleteDate',
      label: '검토완료일',
      align: 'center',
      style: 'width:100px',
      type: 'date',
      sortable: true
    },
    {
      name: 'attach',
      field: 'attach',
      label: '첨부파일',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'MOC_REVIEW',
      keyText: 'sopChangeCommitteeReviewItemId',
      sortable: false
    }
  ],
  saveData: {
    sopMocId: '',
    committeeReviewItems: []
  },
  height: '350px'
})
const gridRelatedWork = ref<gridRelatedWorkType>({
  columns: [
    {
      name: 'mocRelatedTaskName',
      field: 'mocRelatedTaskName',
      label: '구분',
      align: 'center',
      style: 'width:250px',
      sortable: false
    },
    {
      name: 'changeFlag',
      field: 'changeFlag',
      label: '변경/실행여부',
      align: 'center',
      style: 'width:100px',
      type: 'check',
      false: 'N',
      true: 'Y',
      sortable: false,
      value: 'N',
      setHeader: true
    },
    {
      name: 'actionScheduleCompleteDate',
      field: 'actionScheduleCompleteDate',
      label: '완료예정일',
      align: 'center',
      style: 'width:200px',
      type: 'date',
      sortable: false,
      disableTarget: 'changeFlag',
      disableCon: 'Y',
      value: '',
      setHeader: true
    },
    {
      name: 'actionUserName',
      field: 'actionUserName',
      label: '담당자',
      align: 'center',
      style: 'width:150px',
      type: 'user',
      userId: 'actionUserId',
      deptCd: 'actionDeptCd',
      deptName: 'actionDeptName',
      sortable: false,
      disableTarget: 'changeFlag',
      disableCon: 'Y',
      value: '',
      setHeader: true
    },
    {
      name: 'checkUserName',
      field: 'checkUserName',
      label: '확인자',
      align: 'center',
      style: 'width:150px',
      type: 'user',
      userId: 'checkUserId',
      sortable: false,
      disableTarget: 'changeFlag',
      disableCon: 'Y',
      value: '',
      setHeader: true
    }
  ],
  saveData: {
    sopMocId: '',
    relatedWorks: []
  },
  height: '370px'
})
const approvItems = ref<Array<codeMasterType>>([])
const isSaveComitteeHold = ref(false)
const isSaveApproval = ref(false)
const isSaveNonApproval = ref(false)
const isSaveComitteeHoldApprovalInfo = ref(false)
const isSaveReviewItem = ref(false)
const isSaveRelatedWork = ref(false)
const saveComitteeHoldUrl = ref('')
const approvalComitteeHoldUrl = ref('')
const saveReviewItemUrl = ref('')
const saveRelatedWorkUrl = ref('')
const editForm = ref<any>(null)

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
  saveComitteeHoldUrl.value = transactionConfig.sop.moc.committeeHold.save.url
  approvalComitteeHoldUrl.value = transactionConfig.sop.moc.committeeHold.approval.url
  saveReviewItemUrl.value = transactionConfig.sop.moc.committeeReviewItem.update.url
  saveRelatedWorkUrl.value = transactionConfig.sop.moc.relatedWork.save.url
  // code setting
  approvItems.value = [
    { code: 'Y', codeName: $language('승인') },
    { code: 'N', codeName: $language('불승인') }
  ]
  // list setting
  setHoldData()
}
/******************************
 * TODO (목적): 개최 데이터 셋팅
 *******************************/
function setHoldData() {
  gridComitteeHold.value.data.push({
    gubun: $language('최초'),
    holdDate: props.moc.committeeHold!.firstHoldDate,
    holdArea: props.moc.committeeHold!.firstHoldArea,
    reviewContents: props.moc.committeeHold!.firstReviewContents,
    reviewResult: props.moc.committeeHold!.firstReviewResult
  })
  gridComitteeHold.value.data.push({
    gubun: $language('전문가'),
    holdDate: props.moc.committeeHold!.professionalHoldDate,
    holdArea: props.moc.committeeHold!.professionalHoldArea,
    reviewContents: props.moc.committeeHold!.professionalReviewContents,
    reviewResult: props.moc.committeeHold!.professionalReviewResult
  })
  gridComitteeHold.value.data.push({
    gubun: $language('최종'),
    holdDate: props.moc.committeeHold!.finalHoldDate,
    holdArea: props.moc.committeeHold!.finalHoldArea,
    reviewContents: props.moc.committeeHold!.finalReviewContents,
    reviewResult: props.moc.committeeHold!.finalReviewResult
  })
  // saveComitteeHold()
}
/******************************
 * TODO (목적): 개최 저장 전 처리
 *******************************/
function saveComitteeHold() {
  if (validTable(gridComitteeHold.value.columns, gridComitteeHold.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        if (props.moc.committeeHold!.sopMocId) {
          props.moc.committeeHold!.chgUserId = user.value.userId
          props.moc.committeeHold!.editFlag = 'U'
        } else {
          props.moc.committeeHold!.sopMocId = props.moc.sopMocId
          props.moc.committeeHold!.regUserId = user.value.userId
          props.moc.committeeHold!.editFlag = 'C'
        }
        props.moc.committeeHold!.firstHoldDate = gridComitteeHold.value.data[0].holdDate
        props.moc.committeeHold!.firstHoldArea = gridComitteeHold.value.data[0].holdArea
        props.moc.committeeHold!.firstReviewContents = gridComitteeHold.value.data[0].reviewContents
        props.moc.committeeHold!.firstReviewResult = gridComitteeHold.value.data[0].reviewResult
        props.moc.committeeHold!.professionalHoldDate = gridComitteeHold.value.data[1].holdDate
        props.moc.committeeHold!.professionalHoldArea = gridComitteeHold.value.data[1].holdArea
        props.moc.committeeHold!.professionalReviewContents =
          gridComitteeHold.value.data[1].reviewContents
        props.moc.committeeHold!.professionalReviewResult =
          gridComitteeHold.value.data[1].reviewResult
        props.moc.committeeHold!.finalHoldDate = gridComitteeHold.value.data[2].holdDate
        props.moc.committeeHold!.finalHoldArea = gridComitteeHold.value.data[2].holdArea
        props.moc.committeeHold!.finalReviewContents = gridComitteeHold.value.data[2].reviewContents
        props.moc.committeeHold!.finalReviewResult = gridComitteeHold.value.data[2].reviewResult

        isSaveComitteeHold.value = !isSaveComitteeHold.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 개최 저장 후 처리
 *******************************/
function saveComitteeHoldCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
}
/******************************
 * TODO (목적): 위원회 검토 승인 전 처리
 *******************************/
function approvalComitteeHold() {
  // 위원회가 구성되었는지?
  // 개최정보가 최초/전문가/최종 중에 하나 이상 들어갔는지?
  // 최종 진행항목이 결정되었는지?
  // 승인 사유가 있는지?
  const ingRelatedWorks = _.filter(props.moc.relatedWorks, { changeFlag: 'Y' })
  if (!ingRelatedWorks || ingRelatedWorks.length === 0) {
    message.alert({
      title: '안내',
      message: '[최종 진행항목] 하나 이상을 진행하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '승인하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.moc.chgUserId = user.value.userId
          props.moc.mocStepCd = props.moc.mocTypeCd === 'MT00000001' ? 'MS00000015' : 'MT00000020'
          props.moc.committeeHold!.chgUserId = user.value.userId
          props.moc.committeeHold!.changeApprovalFlag = 'Y'

          isSaveApproval.value = !isSaveApproval.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 위원회 검토 승인 후 처리
 *******************************/
function approvalComitteeHoldCallback() {
  message.requestSuccess()
  emits('approvalCallback')
}
/******************************
 * TODO (목적): 위원회 검토 불승인 전 처리
 *******************************/
function nonApprovalComitteeHold() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '불승인하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.moc.committeeHold!.chgUserId = user.value.userId
          props.moc.committeeHold!.changeApprovalFlag = 'N'
          props.moc.mocStepCd = props.moc.mocTypeCd === 'MT00000001' ? 'MS00000020' : 'MT00000025'

          isSaveNonApproval.value = !isSaveNonApproval.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 위원회 검토 불승인 후 처리
 *******************************/
function nonApprovalComitteeHoldCallback() {
  message.requestSuccess()
  emits('approvalCallback')
}
/******************************
 * TODO (목적): 위원회 결과 저장 전 처리
 *******************************/
function saveComitteeHoldApprovalInfo() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          if (props.moc.committeeHold!.sopMocId) {
            props.moc.committeeHold!.chgUserId = user.value.userId
            props.moc.committeeHold!.editFlag = 'U'
          } else {
            props.moc.committeeHold!.sopMocId = props.moc.sopMocId
            props.moc.committeeHold!.regUserId = user.value.userId
            props.moc.committeeHold!.editFlag = 'C'
          }

          isSaveComitteeHold.value = !isSaveComitteeHold.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 위원회 결과 저장 후 처리
 *******************************/
function saveComitteeHoldApprovalInfoCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
}
/******************************
 * TODO (목적): 검토 저장 전 처리
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
        ) as Array<committeeReviewItemType>

        isSaveReviewItem.value = !isSaveReviewItem.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 검토 저장 후 처리
 *******************************/
function saveReviewItemCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
}
/******************************
 * TODO (목적): 진행항목 저장 전 처리
 *******************************/
function saveRelatedWork() {
  if (validTable(gridRelatedWork.value.columns, props.moc.committeeReviewItems)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        gridRelatedWork.value.saveData.sopMocId = props.moc.sopMocId
        gridRelatedWork.value.saveData.relatedWorks = _.cloneDeep(
          props.moc.relatedWorks
        ) as Array<relatedWorkType>

        isSaveRelatedWork.value = !isSaveRelatedWork.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 진행항목 저장 후 처리
 *******************************/
function saveRelatedWorkCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

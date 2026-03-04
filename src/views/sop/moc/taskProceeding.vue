<template>
  <q-form ref="editForm">
    <c-card title="실시 진행사항" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <q-chip
            v-if="relatedWork.completeFlag === 'Y'"
            outline
            square
            color="primary"
            icon="check"
            size="md"
            style="margin: 0 10px !important; padding: 0 10px !important"
          >
            [{{ relatedWork.actionCompleteDate }}] 완료 처리되었습니다.
          </q-chip>
          <c-btn
            v-show="editable && !disabled2 && !completeCheck && relatedWork.completeFlag !== 'Y'"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="relatedWork"
            mappingType="PUT"
            label="완료"
            icon="check"
            @beforeAction="completeRelatedWork"
            @btnCallback="completeRelatedWorkCallback"
          />
          <c-btn
            v-show="editable && !disabled2 && !completeCheck && relatedWork.completeFlag === 'Y'"
            :isSubmit="isCompleteCancel"
            :url="completeCancelUrl"
            :param="relatedWork"
            mappingType="PUT"
            label="완료 취소"
            icon="close"
            color="red-custom"
            @beforeAction="completeCancelRelatedWork"
            @btnCallback="completeCancelRelatedWorkCallback"
          />
          <c-btn
            v-show="editable && !disabled && !completeCheck"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="relatedWork"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveRelatedWork"
            @btnCallback="saveRelatedWorkCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <!-- :disabled="!emergencyCheck||disabled||completeCheck" -->
          <c-datepicker
            :required="true"
            :editable="editable"
            :disabled="disabled || completeCheck"
            label="완료예정일"
            name="actionScheduleCompleteDate"
            v-model:value="relatedWork.actionScheduleCompleteDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <template v-if="!emergencyCheck">
            <c-field
              :editable="editable"
              :disabled="disabled || completeCheck"
              :data="relatedWork"
              deptValue="actionDeptCd"
              type="dept_user"
              label="담당자"
              name="actionUserId"
              v-model:value="relatedWork.actionUserId"
            />
            <!-- :disabled="true" -->
            <!-- <c-text 
              :editable="editable"
              :disabled="disabled||completeCheck"
              label="담당자" 
              name="actionInfo"
              v-model:value="actionInfo">
            </c-text> -->
          </template>
          <template v-else>
            <c-field
              :required="true"
              :editable="editable"
              :disabled="disabled || completeCheck"
              :data="relatedWork"
              deptValue="actionDeptCd"
              type="dept_user"
              label="담당자"
              name="actionUserId"
              v-model:value="relatedWork.actionUserId"
            />
          </template>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <!-- :disabled="true" -->
          <c-text
            :editable="editable"
            :disabled="disabled || completeCheck"
            label="완료일"
            name="actionCompleteDate"
            v-model:value="relatedWork.actionCompleteDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <!-- :disabled="!emergencyCheck||disabled||completeCheck" -->
          <c-field
            :required="true"
            :editable="editable"
            :disabled="disabled || completeCheck"
            :data="moc"
            deptValue="checkDeptCd"
            type="dept_user"
            label="확인자"
            name="checkUserId"
            v-model:value="relatedWork.checkUserId"
          />
        </div>
        <div class="col-12">
          <c-textarea
            :editable="editable"
            :disabled="disabled || completeCheck"
            :rows="3"
            label="확인내용"
            name="checkContents"
            v-model:value="relatedWork.checkContents"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      title="관련 문서"
      :columns="grid.columns"
      gridHeight="470px"
      :data="relatedWork.relatedWorkDocuments"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled && !completeCheck"
      selection="multiple"
      rowKey="sopChangeRelatedWorkDocumentId"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled && !completeCheck"
            label="추가"
            icon="add"
            @btnClicked="addDocument"
          />
          <c-btn
            v-if="
              editable &&
              !disabled &&
              !completeCheck &&
              relatedWork.relatedWorkDocuments!.length > 0
            "
            label="제외"
            icon="remove"
            @btnClicked="removeDocument"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </q-form>
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
import { mocType, relatedWorkDocumnetType, relatedWorkType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'taskProceeding'
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
const emits = defineEmits(['saveCallback', 'changePreStartup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  moc: mocType
  relatedWork: relatedWorkType
  disabled: boolean
  disabled2?: boolean
  isEnvSafDept?: boolean
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
  relatedWork: () => {
    return {
      sopChangeRelatedWorkId: '', // 관련업무 일련번호
      sopMocId: '', // MOC 일련번호
      mocRelatedTaskCd: '', // 관련업무 코드
      changeFlag: '', // 변경/실행 여부
      actionDeptCd: '', // 실행 담당 부서코드
      actionDeptName: '', // 실행 담당 부서명
      actionUserId: '', // 실행 담당자 ID
      actionUserName: '', // 실행 담당자 명
      actionScheduleCompleteDate: '', // 실행 완료예정일
      actionCompleteDate: '', // 실행 완료일
      completeFlag: 'N', // 완료 여부
      checkUserId: '', // 확인자 ID
      checkUserName: '', // 확인자 명
      checkDate: '', // 확인일
      checkContents: '', // 확인내용
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      relatedWorkDocuments: [],
      deleteRelatedWorkDocuments: []
    }
  },
  disabled: false,
  disabled2: false,
  isEnvSafDept: false
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
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'documentTitle',
      field: 'documentTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'documentRegUserName',
      field: 'documentRegUserName',
      label: '등록자',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'documentRegDt',
      field: 'documentRegDt',
      label: '등록일',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  height: '450px'
})
const isSave = ref(false)
const isComplete = ref(false)
const isCompleteCancel = ref(false)
const saveUrl = ref('')
const completeUrl = ref('')
const completeCancelUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// const actionInfo = computed(
//   () => props.relatedWork.actionDeptName + ' / ' + props.relatedWork.actionUserName
// )
const completeCheck = computed(() => {
  if (props.isEnvSafDept) {
    return false
  } else {
    return props.relatedWork.completeFlag === 'Y'
  }
})
const emergencyCheck = computed(() => props.moc.mocTypeCd === 'MT00000010')

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
  saveUrl.value = transactionConfig.sop.moc.relatedWork.singleSave.url
  completeUrl.value = transactionConfig.sop.moc.relatedWork.complete.url
  completeCancelUrl.value = transactionConfig.sop.moc.relatedWork.completeCancel.url
  // code setting
  // list setting
  setColumns()
}
/******************************
 * TODO (목적): 실시 업무에 따른 컬럼 셋팅
 *******************************/
function setColumns() {
  let columns: Array<tableColumnType> = []
  switch (props.relatedWork.mocRelatedTaskCd) {
    case 'RT00000001': // 공정안전자료 업데이트
      /**
       * 분류 : 공정안전자료 분류 정보
       *  ex) 동력기계, 장치 및 설비, 공정흐름도, 소화설비 설치도 등등
       * 제목 : 도면의 경우 도면명
       *       시설정보의 경우 시설명
       * 등록자 정보 : 해당 문서가 등록될 때 입력되는 정보
       */
      columns = [
        {
          name: 'classification',
          field: 'classification',
          label: '분류',
          align: 'center',
          style: 'width:20%',
          sortable: false
        },
        {
          name: 'targetNo',
          field: 'targetNo',
          label: '번호',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:35%',
          sortable: false,
          type: 'link'
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'revisionNum',
          field: 'revisionNum',
          label: '개정번호',
          align: 'center',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '제/개정일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
    case 'RT00000005': // 위험성평가 결과
      /**
       * 분류 : 위험성평가 종류
       *  ex) HAZOP, K-PSR, KRAS, JSA, Check-list
       * 제목 : 평가명
       * 진행상태 : 위험성평가 진행상태명
       * 등록자 정보 : 해당 문서가 등록될 때 입력되는 정보
       */
      columns = [
        {
          name: 'classification',
          field: 'classification',
          label: '분류',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:40%',
          sortable: false,
          type: 'link'
        },
        {
          name: 'documentStepName',
          field: 'documentStepName',
          label: '진행상태',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
    case 'RT00000010': // 교육 결과
      /**
       * 분류 : 교육과정명
       *  ex) PSM 관련교육, 관리감독자 교육 등등
       * 제목 : 교육명
       * 진행상태 : 교육계획 진행상태명
       * 등록자 정보 : 해당 문서가 등록될 때 입력되는 정보
       */
      columns = [
        {
          name: 'classification',
          field: 'classification',
          label: '분류',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:40%',
          sortable: false,
          type: 'link'
        },
        {
          name: 'documentStepName',
          field: 'documentStepName',
          label: '진행상태',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
    case 'RT00000015': // 가동전 점검 결과
      /**
       * 제목 : 점검명
       * 진행상태 : 가동전점검 진행상태명
       * 개선진행수 :
       *  1. 진행중인 건 수 : 개선 완료되지 않은 개선 건 수
       *  2. 완료 된 건 수 : 개선 완료된 건 수  + 즉시조치 건 수
       *  3. 총 건 수 : 개선 건 수
       * 등록자 정보 : 해당 문서가 등록될 때 입력되는 정보
       */
      columns = [
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:40%',
          sortable: false,
          type: 'link'
        },
        {
          name: 'documentStepName',
          field: 'documentStepName',
          label: '진행상태',
          align: 'center',
          style: 'width:10%',
          sortable: false
        },
        {
          name: 'impr',
          field: 'impr',
          label: '개선진행',
          align: 'center',
          sortable: false,
          child: [
            {
              name: 'actionCnt',
              field: 'actionCnt',
              label: '진행중인 건 수',
              align: 'right',
              type: 'cost',
              sortable: false,
              style: 'width:10%'
            },
            {
              name: 'completeCnt',
              field: 'completeCnt',
              label: '완료된 건 수',
              align: 'right',
              type: 'cost',
              sortable: false,
              style: 'width:10%'
            },
            {
              name: 'totalCnt',
              field: 'totalCnt',
              label: '총 건 수',
              align: 'right',
              type: 'cost',
              sortable: false,
              style: 'width:10%'
            }
          ]
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:10%',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
    case 'RT00000020': // 안전작업 허가서
      /**
       * 분류 : 허가서 종류
       *  ex) 일반, 화기
       * 제목 : 작업개요
       * 진행상태 : 작업허가서 진행상태명
       * 작업 : 작업허가서 작업명
       * 보충작업 : 작업허가서 보충작업(,구분자)
       * 등록자 정보 : 해당 문서가 등록될 때 입력되는 정보
       */
      columns = [
        {
          name: 'classification',
          field: 'classification',
          label: '분류',
          align: 'center',
          style: 'width:10%',
          sortable: false
        },
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:30%',
          sortable: false,
          type: 'link'
        },
        {
          name: 'documentStepName',
          field: 'documentStepName',
          label: '진행상태',
          align: 'center',
          style: 'width:10%',
          sortable: false
        },
        {
          name: 'sopName',
          field: 'sopName',
          label: '작업',
          align: 'left',
          style: 'width:160px',
          sortable: false
        },
        {
          name: 'supplementWorkTypeNames',
          field: 'supplementWorkTypeNames',
          label: '보충작업',
          align: 'left',
          style: 'width:20%',
          sortable: false
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:10%',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
    case 'RT00000030': // 인허가
      columns = [
        {
          name: 'classification',
          field: 'classification',
          label: '분류',
          align: 'center',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          sortable: false,
          type: 'link'
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
    case 'RT00000025': // 기타
      columns = [
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:50%',
          type: 'text',
          sortable: false
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        },
        {
          name: 'attach',
          field: 'attach',
          label: '첨부파일',
          align: 'center',
          style: 'width:20%',
          type: 'attach',
          taskClassCd: 'MOC_ACTION_ETC',
          keyText: 'sopChangeRelatedWorkDocumentId',
          sortable: false
        }
      ]
      break
    default:
      columns = [
        {
          name: 'documentTitle',
          field: 'documentTitle',
          label: '제목',
          align: 'left',
          style: 'width:70%',
          type: 'text',
          sortable: false
        },
        {
          name: 'documentRegUserName',
          field: 'documentRegUserName',
          label: '등록자',
          align: 'center',
          style: 'width:15%',
          sortable: false
        },
        {
          name: 'documentRegDt',
          field: 'documentRegDt',
          label: '등록일',
          align: 'center',
          style: 'width:160px',
          sortable: false
        }
      ]
      break
  }
  grid.value.columns = columns
}
/******************************
 * TODO (목적): 실시업무 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: relatedWorkDocumnetType) {
  if (props.relatedWork.mocRelatedTaskCd == 'RT00000001') {
    // 공정안전자료 업데이트
    if (row.documentTypeCd == 'DT00000010') {
      // 동력기계
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/powerMachineDetail.vue`))
      )
      popupOptions.value.title = '동력기계 상세'
      popupOptions.value.param = {
        psiPowerEquipmentId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000015') {
      // 장치 및 설비
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/deviceEquipmentDetail.vue`))
      )
      popupOptions.value.title = '장치 및 설비 상세'
      popupOptions.value.param = {
        psiDeviceEquipmentId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000020') {
      // 배관 및 개스킷
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/pipingGasketsDetail.vue`))
      )
      popupOptions.value.title = '배관 및 개스킷 상세'
      popupOptions.value.param = {
        psiPipeGasketId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000025') {
      // 안전밸브 및 파열판
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/safetyValveRuptureDiskDetail.vue`))
      )
      popupOptions.value.title = '안전밸브 및 파열판 상세'
      popupOptions.value.param = {
        psiValveRuptureId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000001') {
      // 도면
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pidMasterDetail.vue`))
      )
      popupOptions.value.title = $language('상세') + ' [' + row.classification + ']'
      popupOptions.value.param = {
        psiDiagramId: row ? row.documentId : null,
        diagramClassCd: row.diagramClassCd,
        title: row.documentTitle
      }
    } else if (row.documentTypeCd == 'DT00000005') {
      // 문서
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/documentMasterDetail.vue`))
      )
      popupOptions.value.title = $language('상세') + ' [' + row.classification + ']'
      popupOptions.value.param = {
        psiDocumentId: row ? row.documentId : null,
        diagramClassCd: row.diagramClassCd,
        title: row.documentTitle
      }
    }
    popupOptions.value.width = '80%'
    popupOptions.value.isFull = false
  } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000005') {
    // 위험성평가 결과
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/riskDetail.vue`))
    )
    popupOptions.value.title = '위험성평가 상세'
    popupOptions.value.param = {
      ramRiskAssessmentPlanId: row ? row.documentId : '',
      ramStepCd: row ? row.ramStepCd : 'RRS0000001',
      vendorFlag: row ? row.vendorFlag > 0 : false,
      ramTechniqueCd: row ? row.ramTechniqueCd : ''
    }
    popupOptions.value.width = '95%'
  } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000010') {
    // 교육 결과
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/edu/result/educationResultDetail.vue`))
    )
    popupOptions.value.title = '교육계획 및 결과 상세'
    popupOptions.value.param = {
      eduEducationId: row ? row.documentId : '',
      stepCd: row.ramStepCd === 'ESC000001' ? 'ESC0000005' : 'ESC0000010'
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000015') {
    // 가동전 점검 결과
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/psr/preStartupReviewDetail.vue`))
    )
    popupOptions.value.title = '가동전점검 상세'
    popupOptions.value.param = {
      sopPrestartupCheckId: row ? row.documentId : ''
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000020') {
    // 안전작업 허가서
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/swp/safeWorkPermitDetail.vue`))
    )
    popupOptions.value.title = '안전작업 허가서 상세'
    popupOptions.value.param = {
      sopWorkPermitId: row ? row.documentId : '',
      permitTypeCd: row ? row.ramStepCd : ''
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000030') {
    // 인허가
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/lim/licenseStatusDetail.vue`))
    )
    popupOptions.value.title = '인허가 상세'
    popupOptions.value.param = {
      limLicenseId: row ? row.documentId : null
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  }

  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopupLink
}
/******************************
 * TODO (목적): 실시업무 상세 팝업 닫기
 *******************************/
function closePopupLink() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 실시업무(PSI) 추가를 위한 팝업 표시, * 기타업무인 경우 행 추가
 *******************************/
function addDocument() {
  if (props.relatedWork.mocRelatedTaskCd !== 'RT00000025') {
    let _title = ''
    if (props.relatedWork.mocRelatedTaskCd == 'RT00000001') {
      _title = '공정안전자료'
    } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000005') {
      _title = '위험성평가'
    } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000010') {
      _title = '교육'
    } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000015') {
      _title = '가동전 점검'
    } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000020') {
      _title = '안전작업'
    } else if (props.relatedWork.mocRelatedTaskCd == 'RT00000030') {
      _title = '인허가'
    }
    popupOptions.value.title = $language('관련 문서 상세') + ' [' + $language(_title) + ']'
    popupOptions.value.param = {
      mocRelatedTaskCd: props.relatedWork.mocRelatedTaskCd,
      columns: grid.value.columns
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./taskRelationDocu.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closePopup
  } else {
    // 기타
    props.relatedWork.relatedWorkDocuments.splice(0, 0, {
      sopChangeRelatedWorkDocumentId: uid(), // 관련업무 일련번호
      sopChangeRelatedWorkId: props.relatedWork.sopChangeRelatedWorkId, // 관련업무 일련번호
      documentId: '', // 문서 일련번호
      documentTitle: '', // 문서 제목
      documentTypeCd: 'DT00000050', // 문서 타입
      documentRegDt: getTodayDateTime(), // 문서 등록일
      documentRegUserName: user.value.userName, // 문서 등록자
      documentRegUserId: user.value.userId, // 문서 등록자 id
      editFlag: 'C'
    })
  }
}
/******************************
 * TODO (목적): 실시업무(PSI) 추가 팝업 닫기
 * @param (1): 선택한 PSI 정보
 *******************************/
function closePopup(data: Array<relatedWorkDocumnetType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!props.relatedWork.relatedWorkDocuments) props.relatedWork.relatedWorkDocuments = []
    _.forEach(data, (item) => {
      props.relatedWork.relatedWorkDocuments.push({
        sopChangeRelatedWorkDocumentId: uid(), // 관련업무 일련번호
        sopChangeRelatedWorkId: props.relatedWork.sopChangeRelatedWorkId, // 관련업무 일련번호
        documentId: item.documentId, // 문서 일련번호
        documentTitle: item.documentTitle, // 문서 제목
        documentTypeCd: item.documentTypeCd, // 문서 타입
        documentRegUserId: '',
        documentRegDt: item.documentRegDt, // 문서 등록일
        documentRegUserName: item.documentRegUserName, // 문서 등록자
        editFlag: 'C',
        targetNo: item.targetNo, // 일련번호호
        revisionNum: item.revisionNum, // 개정번호호
        classification: item.classification, // 분류
        documentStepName: item.documentStepName, // 진행상태
        sopName: item.sopName, // 작업
        supplementWorkTypeNames: item.supplementWorkTypeNames, // 보충작업
        actionCnt: item.actionCnt, // 진행중인 건 수
        completeCnt: item.completeCnt, // 완료 된 건 수
        totalCnt: item.totalCnt // 총 건 수
      })
    })
  }
}
/******************************
 * TODO (목적): 실시업무(PSI) 제외
 *******************************/
function removeDocument() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.relatedWork.deleteRelatedWorkDocuments) {
      props.relatedWork.deleteRelatedWorkDocuments = []
    }
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.relatedWork.deleteRelatedWorkDocuments, {
          sopChangeRelatedWorkDocumentId: item.sopChangeRelatedWorkDocumentId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.relatedWork.deleteRelatedWorkDocuments.push(item)
      }
      props.relatedWork.relatedWorkDocuments = _.reject(
        props.relatedWork.relatedWorkDocuments,
        item
      )
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 실시 업무 저장 전 처리
 *******************************/
function saveRelatedWork() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.relatedWork.chgUserId = user.value.userId
          isSave.value = !isSave.value
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
 * TODO (목적): 실시 업무 저장 후 처리
 *******************************/
function saveRelatedWorkCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
  if (props.relatedWork.mocRelatedTaskCd === 'RT00000015') {
    emits('changePreStartup')
  }
}
/******************************
 * TODO (목적): 실시 업무 완료 전 처리
 *******************************/
function completeRelatedWork() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      let messageText = '완료하시겠습니까?'
      if (
        !props.relatedWork.relatedWorkDocuments ||
        props.relatedWork.relatedWorkDocuments.length === 0
      ) {
        messageText = '등록된 관련문서가 없습니다. 완료하시겠습니까?'
      }
      message.confirm({
        title: '확인',
        message: messageText,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.relatedWork.chgUserId = user.value.userId
          isComplete.value = !isComplete.value
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
 * TODO (목적): 실시 업무 완료 후 처리
 *******************************/
function completeRelatedWorkCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
  if (props.relatedWork.mocRelatedTaskCd === 'RT00000015') {
    emits('changePreStartup')
  }
}
/******************************
 * TODO (목적): 실시 업무 완료 취소 전 처리
 *******************************/
function completeCancelRelatedWork() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료 취소하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.relatedWork.chgUserId = user.value.userId

          isCompleteCancel.value = !isCompleteCancel.value
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
 * TODO (목적): 실시 업무 완료 취소 후 처리
 *******************************/
function completeCancelRelatedWorkCallback() {
  message.requestSuccess()
  emits('saveCallback', props.moc.sopMocId)
  if (props.relatedWork.mocRelatedTaskCd === 'RT00000015') {
    emits('changePreStartup')
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

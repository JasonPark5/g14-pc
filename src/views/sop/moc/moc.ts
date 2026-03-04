import { dataBaseType } from '@/types/dataBase'
import { imprType } from '../ibm/impr'

export interface mocType extends dataBaseType {
  sopMocId: stringNull // MOC 일련번호
  mocNo: stringNull // moc 관리번호
  plantCd: stringNull // 사업장 코드
  processCd?: stringNull // 공정
  judgmentUserId?: stringNull // 판정자 ID
  judgmentUserName?: stringNull // 판정자 명
  initiativeUserId: stringNull // 발의자 ID
  initiativeUserName: stringNull // 발의자 명
  initiativeDeptCd: stringNull // 발의 부서 코드
  initiativeDeptName: stringNull // 발의 부서명
  initiativeDt?: stringNull // 발의
  mocTitle: stringNull // 변경관리 제목
  mocSummary: stringNull // 변경 개요
  mocTypeCd: stringNull // 변경구분_공통코드(정상/비상/임시)
  mocTypeName?: stringNull // 변경구분명(정상/비상/임시)
  mocWriteLevelCd: stringNull // 변경등급_작성
  mocConfirmLevelCd: stringNull // 변경등급_검토
  processSatefySecureMeasures: stringNull // 공정안전 확보 대책
  technicalBasisProcessDesign: stringNull // 변경계획에 대한 공정 및 설계의 기술근거
  safetyReliabilityImprovementEffect: stringNull // 안전성에 필요한 사항 및 신뢰성 향상 효과
  leaderOpinion: stringNull // 팀장의견
  relatedLaws: stringNull // 관련 볍령_텍스트
  processRiskAssessFlag: stringNull // 공정위험성 평가 여부
  jobRiskAssessFlag: stringNull // 작업위헝성 평가 여부
  mocPeriod?: Array<string>
  mocStartDate: stringNull // 변경 시작일
  mocEndDate: stringNull // 변경 종료일
  mocStepCd: stringNull // 변경관리 단계
  mocActionDeptCd: stringNull // 변경실행 부서코드
  mocActionResponsibilityUserId: stringNull // 변경실행 책임자 ID
  mocCompleteCheckUserId: stringNull // 변경완료 확인자 ID
  mocCompleteCheckDeptCd: stringNull // 변경완료 확인 부서 코드
  mocCompleteOpinion: stringNull // 변경완료 의견
  mocBenefitCds: stringNull // 변경관리 기대효과_복수
  isPrestartupImproves?: numberNull // 가동전점검 개선항목 표시하는지? (1: 표시, 0: 미표시)
  checklistEquips?: Array<any>
  checklistDrives?: Array<any>
  checklists?: Array<checklistType>
  equipments?: Array<mocEquipmentType>
  deleteEquipments?: Array<mocEquipmentType>
  reviews?: Array<initaltiveReviewType>
  committees?: Array<committeesType>
  committeeReviewItems?: Array<committeeReviewItemType>
  committeeHold?: committeeHoldType
  relatedWorks?: Array<relatedWorkType>
  prestartupImproves?: Array<prestartupImproveType>
  improves?: Array<imprType>
  imprImmData?: Array<imprType>
  imprData?: Array<imprType>
}

export interface propType {
  name?: stringNull
  value?: stringNull
  label?: stringNull
  editable?: boolean
  required?: boolean
  disabled?: boolean
  dense?: boolean
  plantCd?: stringNull
  isSubmit?: stringNull
  document?: any
  documentId?: stringNull
  documentTitle?: stringNull
  mocRelatedTaskCd?: stringNull
  error?: ErrorFunction
  validMessage?: stringNull
}

export interface checklistType extends dataBaseType {
  sopMocId: stringNull // MOC 일련번호
  mocCheckTypeCd: stringNull // 체크 구분 코드
  mocCheckTypeName?: stringNull // 체크 구분
  mocCheckItemCd: stringNull // 체크 항목 코드
  mocCheckItemName?: stringNull // 체크 항목
  mocChecklistTypeCd: stringNull // 체크리스트 타입 코드
  checkFlag: stringNull // 체크 여부
}

export interface mocEquipmentType extends dataBaseType {
  sopMocId: stringNull // MOC 일련번호
  equipmentCd: stringNull // 설비코드
  equipmentName: stringNull // 설비명
  equipmentTypeCd?: stringNull // 설비유형
  equipmentTypeName?: stringNull // 설비유형
  restorationFlag: stringNull // 원복여부
  processingHistory: stringNull // 처리내역
  check?: boolean
}

export interface initaltiveReviewType extends dataBaseType {
  sopChangeInitiativeReviewId: stringNull // 변경 발의전 검토 사항 일련번호
  sopMocId: stringNull // MOC 일련번호
  mocReviewItemCd: stringNull // 검토항목 코드
  reviewItemName: stringNull // 검토항목 명
  confirmFlag: stringNull // 검토 필요여부
  manageUserId: stringNull // 담당자 ID
  manageUserName?: stringNull // 담당자
  reviewCompleteRequestDate: stringNull // 검토완료 요청일
  reviewCompleteDate: stringNull // 검토완료일
  reviewHistory: stringNull // 검토내역
  remark: stringNull // 비고
}

export interface committeesType extends dataBaseType {
  sopChangeCommitteeMemberId: stringNull // 변경위원 번호
  sopMocId: stringNull // MOC 일련번호
  comInsideOutsideCd: stringNull // 내외부 구분
  userId: stringNull // 위원id_내부
  userName: stringNull // 성명
  deptName: stringNull // 부서명
  mocRoleCd: stringNull // 역할_코드 : 위원장/위원
  mocRoleName?: stringNull // 역할 : 위원장/위원
  label?: stringNull
  check?: boolean
}

export interface committeeReviewItemType extends dataBaseType {
  sopChangeCommitteeReviewItemId: stringNull // 검토필요 항목 번호
  sopMocId: stringNull // MOC 일련번호
  reviewItemName: stringNull // 검토 항목명
  reviewCompleteRequestDate: stringNull // 검토완료요구일
  confirmUserId: stringNull // 확인자 id
  confirmUserName?: stringNull // 확인자
  reviewUserId: stringNull // 검토자 id
  reviewUserName?: stringNull // 검토자
  reviewContents: stringNull // 검토내용
  reviewCompleteDate: stringNull // 검토완료일
}

export interface committeeHoldType extends dataBaseType {
  sopMocId: stringNull // MOC 일련번호
  firstHoldDate: stringNull // (최초) 개최일
  firstHoldArea: stringNull // (최초) 개최장소
  firstReviewContents: stringNull // (최초) 검토내용
  firstReviewResult: stringNull // (최초) 검토결과
  professionalHoldDate: stringNull // (전문가) 개최일
  professionalHoldArea: stringNull // (전문가) 개최장소
  professionalReviewContents: stringNull // (전문가) 검토내용
  professionalReviewResult: stringNull // (전문가) 검토결과
  finalHoldDate: stringNull // (최종) 개최일
  finalHoldArea: stringNull // (최종) 개최장소
  finalReviewContents: stringNull // (최종) 검토내용
  finalReviewResult: stringNull // (최종) 검토결과
  changeApprovalFlag: stringNull // 변경 승인 여부
  changeApprovalReason: stringNull // 변경 승인 사유
  changeApprovalDate: stringNull // 승인일자
  changeKeepFlag: stringNull // 변경유지 여부
  changeKeepReason: stringNull // 변경유지 사유
}

export interface relatedWorkType extends dataBaseType {
  sopChangeRelatedWorkId: stringNull // 관련업무 일련번호
  sopMocId: stringNull // MOC 일련번호
  mocRelatedTaskCd: stringNull // 관련업무 코드
  mocRelatedTaskName?: stringNull // 관련업무
  mocRelatedTaskNameTab?: stringNull // 관련업무
  mocRelatedTaskIcon?: stringNull // 관련업무
  changeFlag: stringNull // 변경/실행 여부
  actionDeptCd: stringNull // 실행 담당 부서코드
  actionDeptName: stringNull // 실행 담당 부서명
  actionUserId: stringNull // 실행 담당자 ID
  actionUserName: stringNull // 실행 담당자 명
  actionScheduleCompleteDate: stringNull // 실행 완료예정일
  actionCompleteDate: stringNull // 실행 완료일
  completeFlag: stringNull // 완료 여부
  checkUserId: stringNull // 확인자 ID
  checkUserName: stringNull // 확인자 명
  checkDate: stringNull // 확인일
  checkContents: stringNull // 확인내용
  relatedWorkDocuments: Array<relatedWorkDocumnetType>
  deleteRelatedWorkDocuments: Array<relatedWorkDocumnetType>
}

export interface relatedWorkDocumnetType extends dataBaseType {
  sopChangeRelatedWorkDocumentId: stringNull // 관련업무 일련번호
  sopChangeRelatedWorkId: stringNull // 관련업무 일련번호
  documentId: stringNull // 문서 일련번호
  classification?: stringNull // 분류
  classificationCd?: stringNull // 분류
  ramStepCd?: stringNull // 분류
  documentTitle: stringNull // 문서 제목
  documentTypeCd: stringNull // 문서 종류
  documentStepName?: stringNull // 진행상태
  sopName?: stringNull // 작업
  supplementWorkTypeNames?: stringNull // 보충작업
  actionCnt?: numberNull // 진행중인 건 수
  completeCnt?: numberNull // 완료 된 건 수
  totalCnt?: numberNull // 총 건 수
  documentRegUserId: stringNull // 등록자
  documentRegUserName?: stringNull // 등록자
  documentRegDt: stringNull // 등록일
  sopMocId?: stringNull // 변경 번호
  mocRelatedTaskCd?: stringNull //
  revisionNum?: stringNull //
  diagramClassCd?: stringNull //
  vendorFlag?: stringNull //
  ramTechniqueCd?: stringNull //
  targetNo?: stringNull // 대상업무 일련번호
}

export interface prestartupImproveType extends dataBaseType {
  sopPrestartupEquipmentHasCheckItemId: stringNull // 설비별 가동전 점검항목별 결과
  sopPrestartupCheckId: stringNull // 가동전점검 일련 번호
  checkName: stringNull // 가동전점검명
  psrCheckStatusCd: stringNull // 진행 단계
  equipmentCd: stringNull // 설비코드
  equipmentName: stringNull // 설비명
  sopPrestartupCheckItemId: stringNull // 점검항목번호
  psrCheckTypeCd: stringNull // 점검유형
  psrCheckTypeName: stringNull // 점검유형명
  mergeCheck1: stringNull // 점검항목 명 - 설비코드 / 점검유형
  mergeCheck2: stringNull // 점검항목 명 - 설비코드 / 대분류 / 중분류 / 소분류
  level: stringNull // 점검항목 명 - 대분류 / 중분류 / 소분류
  psrCheckPeriodCd: stringNull // 점검시기
  psrCheckPeriodName: stringNull // 점검시기명
  judgmentResultFlag: stringNull // 판정결과
  judgmentResultFlagName: stringNull // 판정결과명칭
  checkResult: stringNull // 점검결과
  remark: stringNull // 비고
  sopImprovementIds: stringNull // 개선번호(,구분자)
  ibmClassCds: stringNull // 개선구분(,구분자)
  ibmStepNames: stringNull // 개선진행상태(,구분자)
  ibmTooltip: stringNull // 개선툴팁
}

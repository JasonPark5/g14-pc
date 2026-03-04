import { dataBaseType } from '@/types/dataBase'

export interface eduResultPopupParamType {
  eduPlanTime: objectString | null
  plantCd: stringNull
  eduEducationId: stringNull
  eduCourseId: stringNull
  stepCd: stringNull
}
export interface eduSaveCallType {
  saveCallData: stringNull
}

export interface eduResultType extends dataBaseType {
  eduEducationId: stringNull
  eduEducationYearPlanId?: stringNull
  educationName?: stringNull
  eduCourseId?: stringNull
  plantCd?: stringNull
  plantName?: stringNull
  educationYear?: stringNull
  educationCourseName?: stringNull
  educationKindCdLarge?: stringNull
  educationKindCdLargeName?: stringNull
  educationKindCdSmall?: stringNull
  educationKindCdSmallName?: stringNull
  educationTypeCd?: stringNull
  educationTypeName?: stringNull
  departmentDeptCd?: stringNull
  departmentDeptName?: stringNull
  legalEducationFlag?: stringNull
  sumEducationTime?: stringNull
  educationCycle?: stringNull
  educationPurpose?: stringNull
  relationLaws?: stringNull
  mainTargetAudience?: stringNull
  educationMonth?: stringNull
  educationLocation?: stringNull
  estimatedEducationExpenses?: stringNull
  executionBudget?: stringNull
  educationStartDate?: stringNull
  educationEndDate?: stringNull
  educationStartTime?: stringNull
  educationEndTime?: stringNull
  instructorInformation?: stringNull
  sopMocId?: stringNull
  educationMethodCd?: stringNull
  educationMethodName?: stringNull
  educationOverview?: stringNull
  evaluationEvalCd?: stringNull
  documentStatusCd?: stringNull
  qrCodeRoute?: stringNull
  educationRangeFlag?: stringNull
  eduQuestionFlag?: stringNull
  eduQuestionMstId?: stringNull
  eduQuestionPassScore?: numberNull
  checkAppr?: stringNull
  regUserId?: stringNull
  chgUserId?: stringNull
  remark?: stringNull
  vod?: stringNull
  key?: stringNull

  // 위험성평가 결과 항목 추가
  ramRiskAssessmentPlanId?: stringNull
  assessmentName?: stringNull
  ramTechniqueCd?: stringNull
  ramStepCd?: stringNull

  // 자체감사 항목 추가
  selfInspectionResultId?: stringNull
  selfInspectionStatusCd?: stringNull
  sysRevision?: stringNull
  selfInspectionTitle?: stringNull

  eduSubjectList?: Array<eduSubjectType> | null // 과정별 교육과목
  delEduSubjectList?: Array<eduSubjectType> | null
  eduAttendeeList?: Array<eduAttendeeType> | null // 대상자
  delEduAttendeeList?: Array<eduAttendeeType> | null

  eduEvalUserList?: Array<eduEvalType> | null
  deleteEduEvalUserList?: Array<eduEvalType> | null

  educationDate?: objectStringNumber | null
  educationPeriod?: arrayString
  educationTimes?: arrayString
}

export interface eduSubjectType extends dataBaseType {
  eduEducationId: stringNull // 교육과정 일련번호
  subjectNo?: stringNull // 과목 번호
  subjectName?: stringNull // 과목명
  subjectDetailName?: stringNull // 세부내용
  educationTime?: stringNull // 교육시간
  instructorName?: stringNull // 강사명
}

export interface eduAttendeeType extends dataBaseType {
  eduEducationId: stringNull // 교육 일련번호
  attendeesNo?: stringNull // 대상자 번호
  attendeesId?: stringNull // 대상자 id
  attendeesName?: stringNull // 대상자명
  seniorityName?: stringNull // 선임명
  attendeesDeptName?: stringNull // 부서명
  attendeesPositionName?: stringNull // 직책명
  remark?: stringNull // 비고
  checkCompleteFlag?: stringNull // 이수여부
  electronSignature?: stringNull // 전자서명
  inExTypeCd?: stringNull // 코드 ?: IN 내부, EX 외부, COURSE 교육과정에서 가져옴
  companyName?: stringNull // (외부직원)회사명
  residentNo?: stringNull // (외부직원)주민번호
  evaluationPoint?: stringNull // 평가점수
  evaluationContent?: stringNull // 평가내용
  evaluationDate?: stringNull // 평가일
  attendanceTime?: stringNull // 출석시간
  noAttendanceReason?: stringNull // 불참사유
  attendeesTypeCd?: stringNull // 코드 ?: 1 직책코드, 2 선임코드, 3 부서코드, 4 개인
  opinionContent?: stringNull // 참석자의견, 모바일서명시 남김
  vodTotalTime?: stringNull // 동영상전체시간
  vodPlayTime?: stringNull // 동영상 재생시간
  vodCurrentTime?: stringNull // 동영상 플레이한 최종 위치(지점)
  enterDate?: stringNull
  checkCompleteFlagName?: stringNull
  electronSignatureFlag?: stringNull
}
export interface eduEvalType extends dataBaseType {
  eduEducationId: stringNull
  evalUserId?: stringNull
  evalUserName?: stringNull
  evalResult?: stringNull
  evalStandard?: stringNull
}

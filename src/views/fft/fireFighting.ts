import { dataBaseType } from '@/types/dataBase'

export interface fireFightingType extends dataBaseType {
  sopFireFightingId?: stringNull // 소방설비 일련번호
  plantCd?: stringNull // 사업장
  plantName?: stringNull // 사업장
  sopFireFightingTypeCd?: stringNull // 유형
  sopFireFightingTypeName?: stringNull // 유형
  sopFireFightingKindCd?: stringNull // 점검 소방시설 종류
  sopFireFightingKindName?: stringNull // 점검 소방시설 종류
  manageNo?: stringNull // 관리번호
  fireFightingName?: stringNull // 소방설비명
  deptCd?: stringNull // 관리부서
  processCd?: stringNull // 관련공정
  sopFireFightinhReplacementCycleCd?: stringNull // 소방설비 교체 주기
  sopFireFightingInspectionCycleCd?: stringNull // 소방설비 점검 주기
  amount?: stringNull // 수량
  chmDangerMstId?: stringNull // 관련 위험물 저장소 일련번호
  location?: stringNull // 설비위치
  installDate?: stringNull // 설치일
  disposeFlag?: stringNull // 폐기여부
  disposeDate?: stringNull // 폐기일
  deleteFlag?: stringNull // 삭제여부
  replacementHistroies?: Array<any>
  deleteReplacementHistroies?: Array<any>
  checks?: Array<any>
  history?: Array<any>
}

export interface checkType extends dataBaseType {
  sopFireFightingCheckId?: stringNull // 소방설비 점검 일련번호
  plantCd?: stringNull // 사업장
  sopFireFightingCheckTypeCd?: stringNull // 점검유형
  checkName?: stringNull // 점검명
  sopFireFightingCheckStepCd?: stringNull // 점검진행상태
  checkStartDate?: stringNull // 점검시작일
  checkEndDate?: stringNull // 점검종료일
  period?: Array<any>
  targets?: Array<any>
  deleteTargets?: Array<any>
  imprs?: Array<any>
}

export interface selectType extends dataBaseType {
  sopFireFightingCheckTargetId?: stringNull
  sopFireFightingId?: stringNull
  sopFireFightingKindCd?: stringNull
  fireFightingName?: stringNull
  editFlag?: stringNull
  results?: Array<any>
}

export interface receiveType extends dataBaseType {
  sopFireFightingReceivingSetHistoryId?: stringNull // 화재수신기 작동 이력 보고 일련번호
  plantCd?: stringNull // 사업장코드
  reportDate?: stringNull // 보고일
  locationDong?: stringNull // 장소_동
  locationFloor?: stringNull // 장소_층
  locationDetail?: stringNull // 세부위치
  sopFireFightingId?: stringNull // 소방설비 일련번호
  fireFightingName?: stringNull // 소방설비명
  sopFireFightingTypeName?: stringNull // 소방설비 종류명
  repeaterType?: stringNull // 중계기 번호
  repeater?: stringNull // 중계기
  repeaterMenufCompany?: stringNull // 제조사
  happened?: stringNull // 발생내용
  insufficiencies?: stringNull // 미흡사항
  causeAnalysis?: stringNull // 원인분석
  evacuationFlag?: stringNull // 대피유무
  evacuationCount?: stringNull // 대피인원
  evacuationDetails?: stringNull // 대피내용, 미대피 사유
  improvement?: stringNull // 개선방안
  remarks?: stringNull // 비고
  detectorOperatingPositionSrc?: stringNull // 감지기 동작 위치
}

export interface journalType extends dataBaseType {
  sopFireFightingJournalId?: stringNull // 소방 일지 일련번호
  plantCd?: stringNull // 사업장 코드
  journalName?: stringNull // 일지명
  confirmUserId?: stringNull // 확인자ID
  actionDate?: stringNull // 실시일
  contents?: Array<any>
  deleteContents?: Array<any>
}

export interface recordType extends dataBaseType {
  sopFireFightingPerformanceResultRecordId?: stringNull // 소방 교육·훈련 실기결과기록부 일련번호
  recordName?: stringNull // 실시결과기록부명
  targetName?: stringNull // 소방대상물 - 대상명
  usage?: stringNull // 소방대상물 - 용도
  ownerId?: stringNull // 소방대상물 - 대표자ID
  phoneNumber?: stringNull // 전화번호
  location?: stringNull // 소방대상물 - 주소
  sopFireManagementLevelCd?: stringNull // 소방대상물 - 등급
  relatedUserName?: stringNull // 관계인 - 성명(기관 또는 법인명)
  address?: stringNull // 관계인 - 주소
  trainingDate?: stringNull // 훈련일자
  trainingStartTime?: stringNull // 훈련시작시간
  trainingEndTime?: stringNull // 훈련종료시간
  trainingTime?: Array<stringNull>
  trainingPeriod?: stringNull // 훈련일시
  trainingLocation?: stringNull // 훈련장소
  trainingTypeCd?: stringNull // 훈련유형(자체/합동)
  trainingInstructor?: stringNull // 훈련교관
  trainingTargetCount?: numberNull // 참석대상(명)
  trainingAttendanceCount?: numberNull // 참석(명)
  trainingAbsenceCount?: numberNull // 미참석(명)
  trainingMaterials?: stringNull // 훈련보조재료
  fireDrillContent?: stringNull // 소화훈련내용
  notificationContent?: stringNull // 통보훈련내용
  evacuationContent?: stringNull // 피난훈련내용
  trainingResult?: stringNull // 훈련성과
  trainingIssue?: stringNull // 훈련 문제점
  trainingImprovementPlan?: stringNull // 개선계획
  educationDate?: stringNull // 교육일자
  educationStartTime?: stringNull // 교육시작시간
  educationEndTime?: stringNull // 교육종료시간
  educationTime?: Array<stringNull>
  educationPeriod?: stringNull // 교육일시
  educationLocation?: stringNull // 교육장소
  educationInstructor?: stringNull // 교육강사
  eduTargetCount?: numberNull // 참석대상(명)
  eduAttendanceCount?: numberNull // 참석(명)
  eduAbsenceCount?: numberNull // 미참석(명)
  educationContent?: stringNull // 교육내용
  educationResult?: stringNull // 교육성과
  educationIssue?: stringNull // 교육 문제점
  eduImprovementPlan?: stringNull // 개선계획
  plantCd?: stringNull // 사업장 코드
  managers?: Array<any>
  deleteManagers?: Array<any>
}

export interface eduYearType extends dataBaseType {
  sopFireFightingTraningEduYearId?: stringNull // 소방 연간 훈련·교육 계획 일련번호
  plantCd?: stringNull // 사업장코드
  planYear?: stringNull // 년도
  sopFireFightingTraningEduYearStepCd?: stringNull // 진행상태
  workerFlag?: stringNull // 근무자 여부
  workerCount?: numberNull // 근무자 수(명)
  selfFlag?: stringNull // 자위소방대 및 초기대응체계 여부
  selfCount?: numberNull // 자위소방대 및 초기대응체계 수(명)
  residentFlag?: stringNull // 거주자 여부
  residentCount?: numberNull // 거주자 수(명)
  months?: Array<monthType>
}

export interface monthType extends dataBaseType {
  sopFireFightingTraningEduYearMonthId?: stringNull // 소방 연간 훈련·교육 월간일정 일련번호
  sopFireFightingTraningEduYearId?: stringNull // 소방 연간 훈련·교육 계획 일련번호
  sopFireFightingTraningEduYearClassCd?: stringNull // 소방 연간 훈련·교육 구분 코드
  sopFireFightingTraningEduYearClassName?: stringNull // 소방 연간 훈련·교육 구분 코드
  sopFireFightingTraningEduYearClassGubun?: stringNull // 소방 연간 훈련·교육 구분 코드
  sopFireFightingTraningEduYearClassFlag?: stringNull // 소방 연간 훈련·교육 구분 코드
  month1Flag?: stringNull // 1월 여부
  month2Flag?: stringNull // 2월 여부
  month3Flag?: stringNull // 3월 여부
  month4Flag?: stringNull // 4월 여부
  month5Flag?: stringNull // 5월 여부
  month6Flag?: stringNull // 6월 여부
  month7Flag?: stringNull // 7월 여부
  month8Flag?: stringNull // 8월 여부
  month9Flag?: stringNull // 9월 여부
  month10Flag?: stringNull // 10월 여부
  month11Flag?: stringNull // 11월 여부
  month12Flag?: stringNull // 12월 여부
  disabledRow?: boolean
}

export interface docType extends dataBaseType {
  sopFireFightingDocumentId?: stringNull // 소방 문서 일련번호
  plantCd?: stringNull // 사업장코드
  sopFireFightingDocumentClassCd?: stringNull // 문서 구분 코드
  contents?: stringNull // 내용
}

export interface nodeType extends dataBaseType {
  deptCd?: stringNull
  userId?: stringNull
  sopFireFightingOrganizaionFrameId?: stringNull
  level?: numberNull
}

export interface nodeType2 extends dataBaseType {
  node: {
    data: NodeData
    children?: boolean
  }
}
export interface NodeData {
  _directSubordinates?: numberNull
  connectionFlag?: stringNull
  level?: numberNull
  name?: stringNull
  subName?: stringNull
  userDepts?: Array<{
    userDeptName?: stringNull
    mobileNo?: stringNull
    sopFireFightingOrganizaionUserDeptId?: stringNull
  }>
}

export interface safetyManagerTaskReportType extends dataBaseType {
  sopFireFightingSafetyManagerTaskReportId: stringNull // 소방안전관리자 업무수행기록 일련번호
  taskDate: stringNull // 업무수행일자
  taskName: stringNull // 업무수행기록명
  managerId: stringNull // 업무수행자
  objectName: stringNull // 소방안전관리대상물 - 상호
  sopFireManagementLevelCd: stringNull // 소방안전관리대상물 - 등급
  location: stringNull // 소방안전관리대상물 - 소재지
  basementFloorCount: stringNull // 지하층수
  groundFloorCount: stringNull // 지상층수
  totalArea: stringNull // 연면적(㎡)
  floorArea: stringNull // 바닥면적(㎡)
  buildingCount: stringNull // 동수
  imprReportDate: stringNull // 불량사항개선보고 - 보고일시
  fftImprReportTypeCd: stringNull // 불량사항개선보고 - 보고방법
  recipientId: stringNull // 불량사항개선보고 - 보고받은 사람
  fftImprActionTypeCd: stringNull // 불량사항개선보고 - 조치방법
  results: Array<any>
}

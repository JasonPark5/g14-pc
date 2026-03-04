import { dataBaseType } from '@/types/dataBase'

export interface evalPlanType extends dataBaseType {
  heaJobStressPlanId?: stringNull // 직무스트레스 계획 일련번호
  plantCd: null // 사업장
  planYear?: stringNull // 년도
  assessTypeCd?: stringNull // 평가유형코드 (기본/단축)
  stepCd?: stringNull // 상태코드
  jobStressPlanName?: stringNull // 평가계획명
  assessmentStartDate?: stringNull // 평가 시작일
  assessmentEndDate?: stringNull // 평가 종료일
  period?: Array<any> // 평가기간
  remarks?: stringNull // 비고
  users?: Array<any> // 평가자
  deleteUsers?: Array<any> // [삭제]평가자
  centers?: Array<any> // 중앙값
  depts?: Array<any>
  imprs?: Array<any>
  resultTable?: Array<any>
}

export interface estimatorType extends dataBaseType {
  heaJobStressAssessmentUserId?: stringNull // 직무스트레스 평가자 일련번호
  heaJobStressPlanId?: stringNull // 직무스트레스 계획 일련번호
  userId?: stringNull // 평가자id
  userName?: stringNull // 평가자
  deptCd?: stringNull // 평가자부서코드
  deptName?: stringNull // 평가자부서
  sexCd?: stringNull // 성별
  physicalEnv?: stringNull // (점수)물리적환경
  jobDemand?: stringNull // (점수)직무요구
  jobAutonomy?: stringNull // (점수)직무자율
  relationship?: stringNull // (점수)관계갈등
  jobInsecurity?: stringNull // (점수)직무불안정
  organizational?: stringNull // (점수)조직체계
  inadequate?: stringNull // (점수)보상부적절
  workplace?: stringNull // (점수)직장문화
  manageTargetGroupFlag?: stringNull // 관리대상군 여부
  regUserId?: stringNull // 등록자 ID
  chgUserId?: stringNull // 등록자 ID
  results?: Array<any> // 결과표
}

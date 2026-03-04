import { dataBaseType } from '@/types/dataBase'

export interface annualCommonSearchParamType {
  plantCd?: stringNull
  educationYear?: stringNull
  educationKindCdSmall?: stringNull
  educationKindCdLarge?: stringNull
  educationTypeCd?: stringNull
  legalEduYn?: stringNull
}

export interface annualEduTrendType {
  sumEstimatedEducationExpenses: numberNull
  totalEduAttendeeCnt: numberNull
  insideEduGraduatesCnt: numberNull
  outsideEduGraduatesCnt: numberNull
  totalEduGraduatesCnt: numberNull
  insideEduFailCnt: numberNull
  outsideEduFailCnt: numberNull
  totalEduFailCnt: numberNull
  planResults: arrayObject | null
  nonPlanResults: arrayObject | null
}

export interface annualEduPlanType extends dataBaseType {
  eduEducationYearPlanId: stringNull // 연간교육 일련번호
  plantCd?: stringNull // 사업장 코드
  plantName?: stringNull // 사업장
  educationYear?: stringNull // 교육년도
  sysApprovalRequestId?: stringNull // 결재요청번호
  approvalStatusCd?: stringNull // 결재관련 결재상태
  approvalStatusName?: stringNull
}

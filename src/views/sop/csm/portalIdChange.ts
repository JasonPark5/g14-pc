import { dataBaseType } from '@/types/dataBase'

export interface protalIdPopupParamType {
  vendorCd: stringNull
  loginId: stringNull
}

export interface portalIdType extends dataBaseType {
  vendorCd: stringNull
  loginId: stringNull
  portalId: stringNull
  chgUserId: stringNull
}

export interface evalType extends dataBaseType {
  mdmVendorEvaluationId?: stringNull // 업체평가 일련번호
  vendorCd?: stringNull // 업체코드
  vendorName?: stringNull
  plantCd?: stringNull // 사업장코드
  vendorEvaluationKindCd?: stringNull // 수급업체 평가구분
  evaluationStartDate?: stringNull // 평가시작일
  evaluationEndDate?: stringNull // 평가종료일
  evaluationPeriod?: Array<any>
  evaluationYear?: stringNull // 평가 년도
  score?: stringNull // 득점
  totalScore?: stringNull // 총점
  evaluationGradeCd?: stringNull // 평가등급
  evaluationGradeName?: stringNull
  remarks?: stringNull // 비고
  assessUserId?: stringNull
  evaluationCompleteFlag?: stringNull // 결재완료 후 평가완료 처리
  sopConstructionId?: stringNull
  approvalStatusCd?: stringNull // 결재관련 결재상태
  sysApprovalRequestId?: stringNull // 결재관련 결재요청코드
  itemResults?: Array<any>
  itemResultSubTotals?: Array<any>
}

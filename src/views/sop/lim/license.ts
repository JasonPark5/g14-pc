import { dataBaseType } from '@/types/dataBase'

export interface licenseType extends dataBaseType {
  limLicenseId?: stringNull
  plantCd?: stringNull
  licenseNo?: stringNull
  relatedLawsCd?: stringNull
  relatedLawsName?: stringNull
  limLicenseKindId?: stringNull
  limLicenseKindName?: stringNull
  licenseStartDate?: stringNull
  licenseEndDate?: stringNull
  relatedDeptCd?: stringNull
  chargeUserId?: stringNull
  remark?: stringNull
  licenseCreateTypeCd?: stringNull
  relLimLicenseReviewId?: stringNull
  sysRevision?: stringNull
  groupId?: stringNull
  revisionNum?: stringNull
  revisionContent?: stringNull
  sopMocId?: stringNull
  sortOrder?: numberNull
  useFlag?: stringNull
}

export interface revType extends dataBaseType {
  limLicenseId?: stringNull
  revisionNum: stringNull
  revisionContent: stringNull
  regDtStr: stringNull
  regUserName: stringNull
}

export interface licenseRequestType extends dataBaseType {
  limLicenseRequestId: stringNull // 인허가 요청 일련번호
  plantCd: stringNull // 사업장 코드
  licenseRequestName: stringNull // 인허가 요청명
  requestDeptCd: stringNull // 요청부서 코드
  requestUserId: stringNull // 요청자
  completeRequestDate: stringNull // 인허가 완료 요청일
  requestContent: stringNull // 요청 내용
  sopMocId: stringNull // MOC 일련번호
  requestStepCd: stringNull // 요청및검토 진행 단계 : RSC0000002(요청),RSC0000003(검토 및 진행중),RSC0999999(기각),RSC1000000(완료)
  dismissReason: stringNull // 기각사유
  reviewOpinion: stringNull // 검토 종합 의견
  reviewUserId: stringNull // 종합 검토자
  reviewDeptCd: stringNull // 검토 부서
  regUserId: stringNull // 등록자
  chgUserId: stringNull // 수정자
  reviews: licenseReviewType[] // 요청에 대한 검토 리스트
  deleteReviews: licenseReviewType[]
}

export interface licenseReviewType extends dataBaseType {
  limLicenseReviewId: stringNull // 인허가 검토 일련번호
  plantCd: stringNull // 사업장 코드
  limLicenseRequestId: stringNull // 인허가 요청 일련번호
  relatedLawsCd: stringNull // 관련법규
  relatedLawsName: stringNull
  limLicenseKindId: stringNull // 인허가종류 알련번호
  limLicenseKindName: stringNull
  renewalFlag: stringNull // 갱신 여부, 갱신인 경우는 기존인허가번호 입력
  reviewDeptCd: stringNull // 검토부서
  reviewDeptName: stringNull
  reviewUserId: stringNull // 검토자
  reviewUserName: stringNull
  reviewOpinion: stringNull // 인허가 검토 의견
  reviewCompleteFlag: stringNull // 검토완료 여부
  limLicenseKindStatusCd: stringNull // 인허가종류별 검토상태
  limLicenseKindStatusName: stringNull
  asLicenseSeq: stringNull // 기존 인허가 일련번호
  asLicenseSeqName: stringNull
  newLicenseSeq: stringNull // 등록 인허가 일련번호
}

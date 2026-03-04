import { dataBaseType } from '@/types/dataBase'

export interface nearAccidentPopupParamType {
  iimNearAccidentId: stringNull
  iimStatusNearCd?: stringNull
  approvalStatusCd?: stringNull
}

export interface nearAccidentType extends dataBaseType {
  iimNearAccidentId: stringNull // 아차사고 일련번호
  iimNearAccidentNo?: stringNull // 아차사고번호
  plantCd?: stringNull // 사업장 코드
  iimNearAccidentName?: stringNull // 아차사고명
  processCd?: stringNull // 공정코드
  iimStatusNearCd?: stringNull // 작성중/등록완료
  reportUserId?: stringNull // 보고자
  reportDt?: stringNull // 보고일시
  iimNearKindCds?: stringNull // 아차사고종류
  iimGradeCd?: stringNull // 아차사고등급
  occurrenceDt?: stringNull // 발생일시
  occurrenceDeptCd?: stringNull // 발생부서
  occurrenceLocation?: stringNull // 발생장소
  weatherCd?: stringNull // 날씨
  emergencyMeasures?: stringNull // 긴급조치사항
  overviewAccidentSituation?: stringNull // 사고상황 개요
  occurrenceModeLargeCd?: stringNull // 대분류코드
  occurrenceModeSmallCd?: stringNull // 중분류코드
  directCause?: stringNull // 직접원인
  indirectCause?: stringNull // 간접원인
  openning?: stringNull // 기인물
  injurious?: stringNull // 가해물
  ramRiskAssessmentPlanId?: stringNull // 평가 일련번호
  shortPlan?: stringNull // 단기계획
  longPlan?: stringNull // 중장기계획
  managerOpinion?: stringNull // 담당자의견
  iimNearDiscernCds?: stringNull // 인지기능
  iimNearFunctionCds?: stringNull // 사고기능
  iimNearFeelCds?: stringNull // 감정
  iimNearEquipCds?: stringNull // 설비요인
  iimNearManageCds?: stringNull // 관리요인
  frequencyRisk?: stringNull // 빈도
  strengthRisk?: stringNull // 강도
  totalRisk?: stringNull // 위험도
  bounty?: numberNull // 포상금
  iimNearKindName?: stringNull

  nearAccidentPreventionModels?: Array<nearAccidentPreventionType> | null
}

export interface nearAccidentPreventionType extends dataBaseType {
  iimNearAccidentId: stringNull
  iimNearCausesId?: stringNull
  iimNearCauseTypeCd?: stringNull
  iimNearCauseTypeName?: stringNull
  iimImprovingMeasures?: stringNull
  sopImprovementIds?: stringNull
  ibmStepNames?: stringNull
}

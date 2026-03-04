import { dataBaseType } from '@/types/dataBase'

export interface processAccidentPopupParamType {
  iimAccidentId: stringNull
  stepCd?: stringNull
  reportName?: stringNull
  iimReportGroupId?: stringNull
  count?: number
}

export interface processAccidentType extends dataBaseType {
  iimAccidentId: stringNull
  accidentTypeCd?: stringNull
  iimReportGroupId?: stringNull
  plantCd?: stringNull
  processCd?: stringNull
  processName?: stringNull
  accidentNo?: stringNull
  accidentName?: stringNull
  accidentStatusCd?: stringNull
  reportUserId?: stringNull
  reportDate?: stringNull
  accidentKindCd?: stringNull
  accidentKindName?: stringNull
  accidentGradeCd?: stringNull
  accidentGradeName?: stringNull
  occurrenceDate?: stringNull
  occurrenceDeptCd?: stringNull
  occurrenceDeptName?: stringNull
  occurrenceLocation?: stringNull
  weather?: stringNull
  emergencyMeasures?: stringNull
  overviewAccidentSituation?: stringNull
  occurrenceModeLargeCd?: stringNull
  occurrenceModeLargeName?: stringNull
  occurrenceModeSmallCd?: stringNull
  occurrenceModeSmallName?: stringNull
  humanDamage?: stringNull
  directCause?: stringNull
  indirectCause?: stringNull
  openning?: stringNull
  injurious?: stringNull
  materialDamageHistory?: stringNull
  humanDamageHistory?: stringNull
  toxicFlag?: stringNull
  accidentVictimModelList?: Array<processAccidentVictimType> | null // 관련 사고자
  deleteAccidentVictimModelList?: Array<processAccidentVictimType> | null // 사고자 삭제 모델
  accidentMaterialModelList?: Array<processAccidentMaterialType> | null // 관련설비 및 물질
  emergencyList?: Array<processAccidentEmergencyType> | null // 비상조치계획서
  riskAssessList?: Array<processAccidentRiskType> | null
  damageClassCd?: stringNull
  woundCd?: stringNull
  reportTypeCd?: stringNull
}

export interface processAccidentCauseType extends dataBaseType {
  iimAccidentId: stringNull
  longPlan?: stringNull
  accidentStautsCd?: stringNull
  shortPlan?: stringNull
  managerOpinion?: stringNull
  accidentStatusCd?: stringNull
  accidentImproveModelList?: Array<processAccidentImproveType> | null
}

export interface processAccidentImproveType extends dataBaseType {
  iimAccidentId: stringNull
  causesNo?: stringNull
  causeTypeCd?: stringNull
  accidentCause?: stringNull
  improvingMeasures?: stringNull
  sopImprovementIds?: stringNull
  ibmStepNames?: stringNull
}

export interface processAccidentVictimType extends dataBaseType {
  iimAccidentId: stringNull
  victimId: stringNull
  victimUserId?: stringNull
  victimName?: stringNull
  birthDate?: stringNull
  insideOutsideTypeName?: stringNull
  insideOutsideTypeCd?: stringNull
  age?: stringNull
  career?: stringNull
  degreeDamage?: stringNull
  actionMatters?: stringNull
  interspersedFlag?: stringNull
  expectTreatmentDate?: arrayString | null
}

export interface processAccidentEmergencyType extends dataBaseType {
  iimAccidentId: stringNull
  emergencyPlanName: stringNull
  sopEmergencyPlanId: stringNull
}

export interface processAccidentRiskType extends dataBaseType {
  iimAccidentId: stringNull
  ramRiskAssessmentPlanId: stringNull
  plantName?: stringNull
  ramTechniqueName?: stringNull
  assessmentName?: stringNull
  assessmentDate?: stringNull
  ramAssessTypeName?: stringNull
  regUserName?: stringNull
  reviewUserName?: stringNull
  approvalUserName?: stringNull
}

export interface processAccidentMaterialType extends dataBaseType {
  iimNearAccidentId: stringNull
  iimNearCausesId?: stringNull
  iimNearCauseTypeCd?: stringNull
  iimNearCauseTypeName?: stringNull
  iimImprovingMeasures?: stringNull
  sopImprovementIds?: stringNull
  ibmStepNames?: stringNull
}

export interface processAccidentInvestiationType extends dataBaseType {
  iimAccidentId: stringNull
  accidentStatusCd?: stringNull
  investigationFlag?: stringNull
  investigationDate?: stringNull
  investigationPlan?: stringNull
  reportDate?: stringNull
  occurrenceCause?: stringNull
  accidentDamageHistory?: stringNull
  emergencyMeasures?: stringNull
  materialLossHistory?: stringNull
  materialLossAmount?: stringNull
  enviromentLeakInformation?: stringNull
  enviromentImpactHistory?: stringNull

  accidentInvestigationTeamModelList?: Array<processAccidentTeamType> | null
  deleteAccidentInvestigationTeamModelList?: Array<processAccidentTeamType> | null
  accidentVictimModelList?: Array<processAccidentVictimType> | null
  deleteAccidentVictimModelList?: Array<processAccidentVictimType> | null
}

export interface processAccidentTeamType extends dataBaseType {
  iimAccidentId: stringNull
  researcherNo: stringNull
  researcherDeptName: stringNull
  researcherId: stringNull
  researcherName: stringNull
  birthDate: stringNull
  researcherRole: stringNull
  researcherPosition: stringNull
  insideOutsideTypeCd: stringNull
}

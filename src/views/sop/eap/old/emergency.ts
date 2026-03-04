import { dataBaseType } from '@/types/dataBase'

export interface emergencyMeasureType extends dataBaseType {
  sopEmergencyPlanId: stringNull
  plantCd?: stringNull
  documentNo?: stringNull
  emergencyPlanName?: stringNull
  emergencyTypeCd?: stringNull
  emergencyClassCd?: stringNull
  damageTypeExpectPeopleNumber?: stringNull
  expectDamageRange?: stringNull
  expectCause?: stringNull
  processActionMatter?: stringNull
  emergencyReactNotice?: stringNull
  evacuationProcedures?: stringNull
  evacuationAfterAction?: stringNull
  managerId?: stringNull
  mobileNo?: stringNull
  useFlag?: stringNull
  deptCd?: stringNull
  regDtStringTime?: stringNull // 작성일시
  chgDtStringTime?: stringNull // 수정일시

  writerDt?: stringNull // 작성일
  processAccidents?: arrayObject | null
  edus?: arrayObject | null
  emergencyMaterialModels?: arrayObject | null
}

export interface trainingType extends dataBaseType {
  sopEmergencyTrainingId: stringNull
  sopEmergencyPlanId: stringNull
  trainingName?: stringNull
  eapTrainingTypeCd?: stringNull
  checkPurpose?: stringNull
  trainingStartDate?: stringNull
  trainingStartTime?: stringNull
  trainingEndDate?: stringNull
  trainingEndTime?: stringNull
  emergencyPlanName?: stringNull
  summary?: stringNull
  trainingWay?: stringNull
  trainingArea?: stringNull
  trainingInstructUserIds?: arrayObject | null
  trainingController?: stringNull
  trainingScenarioNo?: stringNull
  evaluationUserId?: stringNull
  evaluationOpinion?: stringNull
  trainingCompleteFlag?: stringNull
  stepCd?: stringNull
  deptCd?: stringNull
  trainingDate?: stringNull
  good?: stringNull
  bad?: stringNull
  impr?: stringNull
  comment?: stringNull
  emergencyScenarioDetailModelList?: arrayObject | null
  emergencyTrainingEvaluationModels?: arrayObject | null
  emergencyTrainingUsersModels?: arrayObject | null
  delEmergencyTrainingUsersModels?: arrayObject | null

  scenarios?: scenarioType[] | null
  delScenarios?: scenarioType[] | null
  edus?: arrayObject | null
  delEdus?: arrayObject | null

  // 훈련시나리오
  trainingScenarioName?: stringNull
  preRequisites?: stringNull
  materials?: stringNull
  trainingContentsOutline?: stringNull
  trainingContentsSummary?: stringNull
  revisionNum?: stringNull
}

export interface scenarioType extends dataBaseType {
  sopEmergencyTrainingId: stringNull // 비상조치계획서 일련번호
  emergencyPlanName?: stringNull // 비상조치계획 명
  trainingScenarioNo: stringNull // 훈련 시나리오 문서번호
  revNo?: numberNull // 개정번호
  trainingScenarioName?: stringNull // 훈련시나리오 명
  trainingContentsSummary?: stringNull // 훈련내용 요약
  directlyNotice?: stringNull // 직접 참가자 훈련시 유의 사항
  indirectNotice?: stringNull // 간접 참가자 훈련시 유의 사항
  materials?: stringNull // 준비물
  preRequisites?: stringNull // 사전 준비사항
  trainingContentsOutline?: stringNull // 훈련 시나이로 개요
  useFlag?: stringNull // 사용여부
  groupId?: stringNull // 일련번호 키
  revisionNum?: stringNull // 개정번호
  revisionContent?: stringNull // 개정사유
  copyFlag?: stringNull // 복사여부
  emergencyScenarioDetailModelList?: arrayObject | null // 훈련시나리오 상세
}

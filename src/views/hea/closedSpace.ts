import { dataBaseType } from '@/types/dataBase'
import { dangerJournalType } from '@/views/chm/danger/dangerStorage'

export interface mapType extends dataBaseType {
  slide?: numberNull
  sopMapId?: stringNull
  maps?: Array<mapDetailType>
}

export interface mapDetailType extends dataBaseType {
  mapDetails: Array<any>
  ratio?: stringNull | number
  maps?: Array<any>
  sopMapId?: stringNull
  mapName?: stringNull
  mapSrc?: stringNull
  dangers?: Array<dangerType>
}
export interface dangerType extends dangerJournalType {
  locationXcoordinate?: numberNull
  locationYcoordinate?: numberNull
  isHover?: Boolean
  sopMapId?: stringNull
  plantName?: stringNull
  chmDangerMapId?: stringNull
  chmDangerTypeName?: stringNull
}

export interface trainingType extends dataBaseType {
  sopEmergencyTrainingId?: stringNull
  plantCd?: stringNull
  deptCd?: stringNull
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
  heaClosedSpaceId?: stringNull
  trainingInstructUserIds?: Array<any>
  userJoin?: stringNull
  sopEmergencyPlanId?: stringNull
  trainingScenarioNo?: stringNull
  evaluationUserId?: stringNull
  evaluationOpinon?: stringNull
  trainingCompleteFlag?: stringNull
  emergencyScenarioDetailModelList?: Array<any>
  deleteEmergencyScenarioDetailModelList?: Array<any>
  emergencyTrainingUsersModels?: Array<any>
  emergencyTrainingEvaluationModels?: Array<any>
  // 훈련시나리오
  trainingScenarioName?: stringNull
  preRequisites?: stringNull
  materials?: stringNull
  indirectNotice?: stringNull
  directlyNotice?: stringNull
  trainingContentsOutline?: stringNull
  trainingContentsSummary?: stringNull
  revisionNum?: stringNull
}

export interface giveEquipType extends dataBaseType {
  heaClosedSpaceEquipmentGiveId?: stringNull
  plantCd?: stringNull
  requestDate?: stringNull
  spaceNameCd: null
  spaceNameName?: stringNull
  giveStatusCd?: stringNull
  requestStepCd?: stringNull
  closedSpaceEquipmentGiveItemModels?: Array<any>
  deleteClosedSpaceEquipmentGiveItemModels?: Array<any>
  closedSpaceEquipmentReturnItemModels?: Array<any>
  deleteClosedSpaceEquipmentReturnItemModels?: Array<any>
}
export interface closedEquipType extends dataBaseType {
  equipmentTypeCd?: stringNull
  equipmentName?: stringNull
  equipmentStockNumber?: stringNull | number
  unitCd?: stringNull
  useFlag?: stringNull
  heaClosedSpaceEquipmentId?: stringNull
}

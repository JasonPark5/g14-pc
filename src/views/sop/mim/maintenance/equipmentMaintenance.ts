import { dataBaseType } from '@/types/dataBase'

export interface equipmentMaintenancePopupParamType {
  title?: stringNull
  equipmentCd?: stringNull
  plantCd?: stringNull
  checkDate?: stringNull
  noPlan?: stringNull
  minEquipmentMaintenanceId?: stringNull
  selectData?: arrayString | null
}

export interface equipmentMaintenanceType extends dataBaseType {
  minEquipmentMaintenanceId?: stringNull
  plantCd?: stringNull
  plantName?: stringNull
  equipmentCd?: stringNull
  equipmentNo?: stringNull
  equipmentName?: stringNull
  maintenanceStatusCd?: stringNull
  equipmentTypeCd?: stringNull
  equipmentTypeName?: stringNull
  equipmentCheckTypeCd?: stringNull
  memDeptEntrantUserId?: stringNull
  memDeptEntrantUserName?: stringNull
  maintenanceDueDate?: stringNull
  maintenanceDueUserId?: stringNull
  maintenanceDueUserName?: stringNull
  sopMocId?: stringNull
  sopMocName?: stringNull
  maintenanceUserId?: stringNull
  maintenanceQualifications?: stringNull
  maintenanceDate?: stringNull
  maintenanceResultSummary?: stringNull
  inspResultAfterMemCd?: stringNull
  maintenanceCompleteFlag?: stringNull
  noPlanResultEnrollFlag?: stringNull
  maintenanceCause?: stringNull
  maintenanceContent?: stringNull
  maintenanceTime?: stringNull
  stopDrivingTime?: stringNull
  reviewOpinionOfMananger?: stringNull
  pmCycleCd?: stringNull
  pmCycleName?: stringNull
  recentMaintainDate?: stringNull
  relatedLaws?: stringNull
  relatedLawsName?: stringNull
  nextMonth?: stringNull
  maintenanceStartTime?: stringNull
  maintenanceEndTime?: stringNull
  stopDrivingStartTime?: stringNull
  stopDrivingEndTime?: stringNull
  workSummary?: stringNull
  permitTypeCd?: stringNull
  sopWorkPermitId?: stringNull
  reportNo?: stringNull
  managerConfirm?: stringNull
  failureSeverity?: stringNull
  failureMode?: stringNull
  noUseTime?: stringNull
  totalNumber?: stringNull
  allDrivingTime?: stringNull
  stopDrivingTimeList?: Array<string> | null
  maintenanceTimeList?: Array<string> | null
  allDrivingTimeList?: Array<string> | null
  noUseTimeList?: Array<string> | null
  disable?: boolean
  equipmentResultList?: Array<equipmentMaintenanceResultType> | null
}

export interface equipmentMaintenanceResultType extends dataBaseType {
  minEquipmentCheckId: stringNull // 설비점검 일련 번호
  minEquipmentTypeCheckItemId: stringNull // 선택 및 추가한 항목의 일련번호 생성
  checkItemName?: stringNull // 검사항목 명
  checkWayName?: stringNull // 검사방법 명
  checkResult?: stringNull // 점검 결과
  judgmentResultTypeCd?: stringNull // 적합/부적합
  decisionBasis?: stringNull // 판정기준
  checkCaution?: stringNull // 점검시 안전사항
}

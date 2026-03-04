import { dataBaseType } from '@/types/dataBase'

export interface equipPlanPopupParamType {
  title?: stringNull
  equipmentCd?: stringNull
  plantCd?: stringNull
  checkDate?: stringNull
  selectData?: arrayString | null
}

export interface equipPlanType extends dataBaseType {
  minEquipmentCheckId: stringNull
  plantCd?: stringNull
  plantName?: stringNull
  checkDeptCd?: stringNull
  checkDeptName?: stringNull
  sopMocId?: stringNull
  sopMocName?: stringNull
  equipmentCheckKindCd?: stringNull
  statusCd?: stringNull
  checkStatusCd?: stringNull
  checkScheduleUserName?: stringNull
  checkScheduleUserId?: stringNull
  checkScheduleDate?: stringNull
  equipmentTypeCd?: stringNull
  equipmentTypeName?: stringNull
  equipmentNo?: stringNull
  equipmentCd?: stringNull
  equipmentName?: stringNull
  inspectionCycleName?: stringNull
  inspectionCycleCd?: stringNull
  lawEquipmentFlag?: stringNull
  selfCycleName?: stringNull
  selfCycleCd?: stringNull
  recentInspectionDate?: stringNull
  recentSelfDate?: stringNull
  relatedLawsName?: stringNull
  relatedLaws?: stringNull
  noPlanResultEnrollFlag?: stringNull
  checkUserId?: stringNull
  checkUserName?: stringNull
  equipmentCheckKindNm?: stringNull
  checkCompleteFlag?: stringNull
  checkResultCd?: stringNull
  checkDate?: stringNull
  checkResultSummary?: stringNull
  nextMonth?: stringNull
  equipmentResultList?: Array<equipResultType> | null
}

export interface equipResultType extends dataBaseType {
  minEquipmentCheckId: stringNull // 설비점검 일련 번호
  minEquipmentTypeCheckItemId: stringNull // 선택 및 추가한 항목의 일련번호 생성
  checkItemName?: stringNull // 검사항목 명
  checkWayName?: stringNull // 검사방법 명
  checkResult?: stringNull // 점검 결과
  judgmentResultTypeCd?: stringNull // 적합/부적합
  decisionBasis?: stringNull // 판정기준
  checkCaution?: stringNull // 점검시 안전사항
}

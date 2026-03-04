import { dataBaseType } from '@/types/dataBase'

export interface safetyHealthDutyInspectionType extends dataBaseType {
  envSoilPollutionTargetFacilityId: stringNull // 토양오염측정일지 일련번호
  plantCd: stringNull // 사업장
  facilityName: stringNull // 시설명
  facilityTypeCd: stringNull // 시설유형
  facilityTypeName?: stringNull
  remark: stringNull // 비고
  historyList?: Array<safetyHealthDutyInspectionResultType>
  deleteHistoryList?: Array<safetyHealthDutyInspectionResultType>
}

export interface safetyHealthDutyInspectionResultType extends dataBaseType {
  envSoilPollutionTargetFacilityHistoryId: stringNull // 토양오염측정일지 이력 일련번호
  envSoilPollutionTargetFacilityId: stringNull // 토양오염측정일지 일련번호
  historyDate: stringNull // 이력일
  remark: stringNull // 비고
}

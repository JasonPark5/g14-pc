import { dataBaseType } from '@/types/dataBase'

export interface forkLiftPopupParamType {
  heqForkLiftId: stringNull // 중장비유형별 점검항목일련번호
}

export interface forkLiftType extends dataBaseType {
  heqForkLiftId: stringNull
  plantCd?: stringNull
  processCd?: stringNull
  vendorCd?: stringNull
  facilityTypeId?: stringNull
  facilityTypeCd?: stringNull
  facilityTypeName?: stringNull
  facilityName?: stringNull
  deviceNo?: stringNull
  installLocation?: stringNull
  carryinDate?: stringNull
  useStartYmd?: stringNull
  useEndYmd?: stringNull
  safetyDate?: stringNull
  safetyResultFlag?: stringNull
  checkAction?: stringNull
  managerNo?: stringNull
  managerUserId?: stringNull
  managerUserName?: stringNull
  regUserId?: stringNull
  chgUserId?: stringNull
  validFlagName?: stringNull
  specifications?: stringNull
  operationAtor?: stringNull
  checkValidPeriod?: stringNull
  selfCheckName?: stringNull

  forkLiftSafetyMeasureList: Array<forkLiftMeasureType> | null
  deleteForkLiftSafetyMeasureList: Array<forkLiftMeasureType> | null
  forkLiftHistoryList: Array<forkLiftHistoryType> | null
  deleteForkLiftHistoryList: Array<forkLiftHistoryType> | null
}

export interface forkLiftMeasureType extends dataBaseType {
  heqForkLiftId: stringNull
  heqForkLiftMeasureId: stringNull
  riskFactors?: stringNull
  safetyMeasure?: stringNull
}

export interface forkLiftHistoryType extends dataBaseType {
  heqForkLiftId: stringNull
  heqForkLiftHistoryId: stringNull
  hhmHazardousMachineryId?: stringNull
  facilityTypeCd?: stringNull
  facilityTypeName?: stringNull
  facilityName?: stringNull
  checkValidPeriod?: stringNull
  vendorCd?: stringNull
  plantCd?: stringNull
}

export interface forkLiftHistoryResultType extends dataBaseType {
  heqForkLiftId: stringNull
  heqForkLiftHistoryId: stringNull
  heqForkLiftHistoryResultId: stringNull
  inspectionUserId: stringNull
  inspectionUserName: stringNull
  facilityName: stringNull
  inspectionDate: stringNull
  inspectionResultDetail: stringNull
  selfCheckName: stringNull
  forkLiftHistoryResultList: Array<forkLiftHistoryResultDetailType> | null
  deleteforkResultList?: Array<any>
}

export interface forkLiftHistoryResultDetailType extends dataBaseType {
  heqForkLiftHistoryId: stringNull
  heqForkLiftHistoryResultId: stringNull
  typeName: stringNull
  resultName: stringNull
  checkValue: stringNull
  safetyMeasure: stringNull
}

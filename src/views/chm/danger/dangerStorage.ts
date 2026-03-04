import { dataBaseType } from '@/types/dataBase'

export interface dangerStorageType extends dataBaseType {
  chmDangerMstId?: stringNull
  plantCd?: stringNull
  chmDangerArea?: stringNull
  chmDangerManageUserId?: stringNull
  chmDangerMstName?: stringNull
  chmDangerUserId?: stringNull
  chmDangerSafetyUserId?: stringNull
  chmDangerCount?: stringNull
  chmDangerMainUse?: stringNull
  installPermitDate?: stringNull
  permitNo?: stringNull
  useFlag: stringNull
  chmDangerTypeCd: stringNull
  typeList?: Array<any>
  deleteTypeList?: Array<any>
  itemList?: Array<any>
  fireFightings?: Array<any>
}

export interface dangerJournalType extends dataBaseType {
  chmDangerJournalId?: stringNull
  plantCd?: stringNull
  chmDangerMstId?: stringNull
  chmDangerTitle?: stringNull
  chmDangerStartDate?: stringNull
  chmDangerEndDate?: stringNull
  chmDangerArea?: stringNull
  chmDangerManageUserId?: stringNull
  chmDangerManageUserName?: stringNull
  chmDangerMstName?: stringNull
  chmDangerUserId?: stringNull
  chmDangerUserName?: stringNull
  chmDangerSafetyUserId?: stringNull
  chmDangerSafetyUserName?: stringNull
  chmDangerCount?: stringNull
  chmDangerMainUse?: stringNull
  chmDangerCompleteFlag?: stringNull
  approvalStatusCd?: stringNull // 결재관련 결재상태
  sysApprovalRequestId?: stringNull // 결재관련 결재요청코드
  itemList?: Array<any>
  resultList?: Array<any>
  imprList?: Array<any>
  updateFlag?: stringNull
  chmDangerTypeCd?: stringNull
}

export interface dangerCheckType extends dataBaseType {
  chmDangerRegularCheckId?: stringNull
  chmDangerMstId?: stringNull
  chmDangerMstName?: stringNull
  chmDangerMstTypeId?: stringNull
  plantCd?: stringNull
  chmDangerTypeCd: null
  chmDangerLocation?: stringNull
  chmDangerCheckName?: stringNull
  chmDangerPermitNo?: stringNull
  chmDangerUserId?: stringNull
  chmDangerManageUserId?: stringNull
  chmDangerSafetyUserId?: stringNull
  chmDangerInspectorUserId?: stringNull
  chmStatusDangerRegularCheckCd?: stringNull
  chmDangerCount?: stringNull
  installPermitDate?: stringNull
  chmDangerHandlingOverview?: stringNull
  chmDangerStartDate?: stringNull
  chmDangerEndDate?: stringNull
  checkitems?: Array<any>
  deletecheckitems?: Array<any>
  period?: Array<any>
  checkResults?: Array<any>
  deleteCheckResults?: Array<any>
  types?: Array<any>
  fireFightings?: Array<any>
}

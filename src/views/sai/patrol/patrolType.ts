import { dataBaseType } from '@/types/dataBase'

export interface patrolBaseType extends dataBaseType {
  regUserId?: stringNull
  chgUserId?: stringNull
}

export interface patrolMasterType extends patrolBaseType {
  editFlag?: stringNull
  regUserName?: stringNull
  regUserDeptName?: stringNull
  chgUserName?: stringNull
  chgUserDeptName?: stringNull
  userDeptCd?: stringNull
  approvalTypeCd?: stringNull
  approvalStatusCd?: stringNull
  approvalStatusName?: stringNull
  sysApprovalRequestId?: stringNull
  plantCdList?: stringNull
  regDt?: stringNull
  regDtStr?: stringNull
  regDtStrTime?: stringNull
  chgDt?: stringNull
  chgDtStr?: stringNull
  chgDtStrTime?: stringNull
  plantCd?: stringNull
  saiPatrolResultItemId?: stringNull
  patrolItemName?: stringNull
  useFlag?: stringNull
  sortOrder?: number
  error_message?: stringNull
}

export interface patrolDetailType extends patrolBaseType {
  saiPatrolId?: stringNull
  plantCd?: stringNull
  processCd?: stringNull
  vendorCd?: stringNull
  sopMapId?: stringNull
  patrolTypeCd?: stringNull
  patrolDate?: stringNull
  patrolName?: stringNull
  patrolResultCd?: stringNull
  patrolResultSummary?: stringNull
  patrolCompleteFlag?: stringNull
  sopConstructionId?: stringNull
  ramRiskAssessmentPlanId?: stringNull
  approvalStatusCd?: stringNull // 결재관련 결재상태
  sysApprovalRequestId?: stringNull // 결재관련 결재요청코드
  results: Array<patrolResultItemType>
  deleteResults?: Array<any>
  imprs?: []
  patrolImproveModelList?: []
}

interface patrolResultItemType {
  saiPatrolId: stringNull
  saiPatrolResultId: stringNull
  patrolItemName: stringNull
  patrolResultCd: stringNull
  patrolContents: stringNull
  regUserId: stringNull
  editFlag: stringNull
}

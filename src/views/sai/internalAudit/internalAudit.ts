import { dataBaseType } from '@/types/dataBase'

export interface internalAuditType extends dataBaseType {
  saiInternalYearPlanId?: stringNull // 연간 내부감사 일련번호
  plantCd?: stringNull // 사업장코드
  planYear?: stringNull // 심사년
  planName?: stringNull // 실시계획명
  auditScope?: stringNull // 심사범위
  deptCd?: stringNull // 주관부서코드
  deptName?: stringNull
  saiInternalYearPlanStepCd?: stringNull // 연간 내부심사 진행상태
  auditMonth?: Array<any> // 심사월
  targetDepts?: Array<monthType> // 피심사팀
  deleteTargetDepts?: Array<monthType> // 피심사팀
  auditTeams?: Array<monthType> // 심사팀
  deleteAuditTeams?: Array<monthType>
}

export interface monthType extends dataBaseType {
  deptFlag?: boolean
  deptName?: stringNull
  mon1?: stringNull
  mon2?: stringNull
  mon3?: stringNull
  mon4?: stringNull
  mon5?: stringNull
  mon6?: stringNull
  mon7?: stringNull
  mon8?: stringNull
  mon9?: stringNull
  mon10?: stringNull
  mon11?: stringNull
  mon12?: stringNull
  saiInternalYearPlanId?: stringNull
  saiInternalAuditTeamRoleCd?: stringNull
  deptCd?: stringNull
  userId?: stringNull
  yearmonth?: stringNull
  remark?: stringNull
  [key: string]: stringNull // 동적 속성 허용
}

export interface internalActionType extends dataBaseType {
  saiInternalActionId?: stringNull // 내부심사 수행계획서 일련번호
  plantCd?: stringNull // 사업장코드
  actionName?: stringNull // 실시계획명
  actionStartDate?: stringNull // 심사시작일
  actionEndDate?: stringNull // 심사종료일
  period?: Array<stringNull>
  saiInternalActionStepCd?: stringNull // 내부심사 수행계획서 진행상태
  internalAuditStepCd?: stringNull // 내부심사 진행상태
  saiInternalActionTypeCd?: stringNull // 심사구분
  auditPurposeScope?: stringNull // 심사 목적 및 범위
  auditPreRequire?: stringNull // 심사 준비 요청사항
  reviewUserId?: stringNull // 검토자
  approvalUserId?: stringNull // 승인자
  auditTeams?: Array<monthType> // 심사팀
  deleteAuditTeams?: Array<userType>
  actionPlans?: Array<internalPlanType> // 실시계획
  deleteActionPlans?: Array<internalPlanType> // 실시계획 [삭제]
  targetDepts?: Array<targetDeptType> // 피심사팀
  deleteTargetDepts?: Array<targetDeptType> // 피심사팀 [삭제]
  resultRemark?: stringNull // 결과요약
  resultSysApprovalRequestId?: stringNull // 결과 결재요청번호
  resultApprovalTypeCd?: stringNull // 결과 결재유형코드
  resultApprovalStatusCd?: stringNull // 결과 결재상태코드
  resultApprovalStatusName?: stringNull // 결과 결재상태명
}

export interface internalPlanType extends dataBaseType {
  saiInternalActionPlanId?: stringNull
  saiInternalActionId?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  dates?: Array<string>
  period?: stringNull
  planDate?: stringNull
  startDate?: stringNull
  endDate?: stringNull
  auditContents?: stringNull
  remark?: stringNull
  managerUserId?: stringNull
  managerUserName?: stringNull
  typeCd?: stringNull
  typeName?: stringNull
  actionPlace?: stringNull
  deptFlag?: stringNull
  userIds?: Array<userType>
}

export interface targetDeptType extends dataBaseType {
  saiInternalActionId?: stringNull // 내부심사 수행계획서 일련번호
  saiInternalActionTargetDeptId?: stringNull // 내부심사 피심사팀 일련번호
  saiInternalActionTargetDeptStepCd?: stringNull // 내부심사 피심사팀 진행상태
  saiInternalActionTargetDeptStepName?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  actionPeriod?: stringNull
  resultRemark?: stringNull
  plantCd?: stringNull // 사업장코드
  plantName?: stringNull
  actionName?: stringNull // 실시계획명
  reviewUserId?: stringNull
  approvalUserId?: stringNull
  teamUserId?: stringNull
  teamDeptCd?: stringNull
  internalAuditResultStatusName?: stringNull
  managerUserId?: stringNull
  managerUserName?: stringNull
  checklist?: Array<checklistType>
  userIds?: Array<userType>
}

export interface userType extends dataBaseType {
  saiInternalActionAuditTeamId?: stringNull
  saiInternalActionId?: stringNull
  userId?: stringNull
  userName?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  teamDeptCd?: stringNull
  saiInternalAuditTeamRoleCd?: stringNull
  saiInternalAuditTeamRoleName?: stringNull
}

export interface checklistType extends dataBaseType {
  saiInternalActionChecklistResultId?: stringNull // 내부심사 수행계획서 체크리스트 일련번호
  saiInternalActionTargetDeptId?: stringNull // 내부심사 피심사팀 일련번호
  saiInternalAuditChecklistId?: stringNull // 내부감사 체크리스트 항목 일련번호
  saiInternalAuditChecklistSystemId?: stringNull
  saiInternalAuditClassNameGubun?: stringNull
  saiInternalAuditClassName?: stringNull // ISO 구분
  systemElementsName?: stringNull // 시스템 요소
  requirement?: stringNull
  evidence?: stringNull
  itemName?: stringNull // 내부심사 항목
  aimMatter?: stringNull // 내부심사 시 착안 사항
  saiInternalAuditResultCd?: stringNull // 내부심사 결과
  saiInternalAuditResultName?: stringNull
  observation?: stringNull // 관찰사항
  sortOrder?: numberNull // 순번
  sortOrder1?: numberNull
  sopImprovementIds?: stringNull // 개선번호(,구분자)
  ibmClassCds?: stringNull // 개선구분(,구분자)
  ibmStepNames?: stringNull // 개선진행상태(,구분자)
  deptCd?: stringNull
  ibmTooltip?: stringNull // 개선툴팁
  sar0000001?: stringNull
  sar0000005?: stringNull
  sar0000010?: stringNull
  sar0000015?: stringNull
  useFlag?: stringNull
  checklistType?: stringNull // 체크리스트 구분
}

export interface targetDeptType extends dataBaseType {
  saiInternalActionTargetDeptId?: stringNull // 내부심사 피심사팀 일련번호
  saiInternalActionId?: stringNull // 내부심사 수행계획서 일련번호
  actionName?: stringNull
  deptCd?: stringNull // 피심사부서코드
  deptName?: stringNull // 피심사부서코드
  saiInternalActionTargetDeptStepCd?: stringNull // 내부심사 피심사팀 진행상태
  resultRemark?: stringNull // 결과요약
  checklist?: Array<checklistType> // 체크리스트 결과
  auditTeams?: Array<monthType> // 심사팀
}

export type resultType = 'sar0000001' | 'sar0000005' | 'sar0000010' | 'sar0000015'

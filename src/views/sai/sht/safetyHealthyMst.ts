import { dataBaseType } from '@/types/dataBase'

export interface safetyHealthyMstType extends safetyHealthyItemType, dataBaseType {
  saiSafetyHealthyId: stringNull // 안전보건목표 마스터 일련번호
  plantCd?: stringNull // 사업장
  targetName?: stringNull // 안전보건목표
  mstEditFlag?: 'C' | 'U' | null | undefined
}
export interface safetyHealthyItemType extends dataBaseType {
  saiSafetyHealthyDetailId?: stringNull // 안전보건목표 세부추진사항 일련번호
  saiSafetyHealthyId: stringNull // 안전보건목표 마스터 일련번호
  detailName?: stringNull // 세부추진사항
  deptCd?: stringNull // 해당부서
  deptName?: stringNull // 해당부서
  kpi?: stringNull // kpi 성과지표
  kpiAttrCd?: stringNull // kpi 속성
  kpiDirectionCd?: stringNull // kpi 방향
  kpiUnit?: stringNull // kpi 단위
  sortOrder?: numberNull // 정렬순서
  useFlag?: stringNull // 사용여부
  itemEditFlag?: 'C' | 'U' | null | undefined
}
export interface safetyHealthyMasterType extends dataBaseType {
  saiSafetyHealthyId?: stringNull // 안전보건목표 마스터 일련번호
  plantCd: stringNull // 사업장
  targetName: stringNull // 안전보건목표
  useFlag: stringNull // 사용여부
  items: Array<safetyHealthyItemType>
}
export interface safetyHealthyMstExcelType extends dataBaseType {
  saiSafetyHealthyDetailId?: stringNull
  saiSafetyHealthyId?: stringNull
  plantCd: stringNull
  targetName: stringNull
  detailName: stringNull
  deptCd?: stringNull // 해당부서
  deptName: stringNull
  kpi: stringNull
  kpiAttrCd?: stringNull // kpi 속성
  kpiDirectionCd?: stringNull // kpi 방향
  kpiUnit?: stringNull // kpi 단위
  sortOrder?: numberNull // 정렬순서
  error_message: stringNull // 구분
  useFlag?: stringNull // 사용여부
}
export interface safetyHealthyTargetType extends dataBaseType {
  plantCd: stringNull
  plantName: stringNull
  targetYear: stringNull
  propelDeptName: stringNull
  writeDeptName: stringNull
  writeDt: stringNull
  saiSafetyHealthyTargetId: stringNull
}
export interface safetyHealthyTargetDetailType extends dataBaseType {
  plantCd?: stringNull
  plantName: stringNull
  targetYear?: stringNull
  targetName: stringNull
  detailName: stringNull
  deptName: stringNull
  kpi: stringNull
  kpiAttrCd?: stringNull // kpi 속성
  kpiDirectionCd?: stringNull // kpi 방향
  kpiUnit?: stringNull // kpi 단위
  performanceGoal?: stringNull
  month1?: stringNull
  month2?: stringNull
  month3?: stringNull
  month4?: stringNull
  month5?: stringNull
  month6?: stringNull
  month7?: stringNull
  month8?: stringNull
  month9?: stringNull
  month10?: stringNull
  month11?: stringNull
  month12?: stringNull
  status?: stringNull
  achievementRate?: stringNull
  budget?: stringNull
  performanceDetails?: stringNull
  remark?: stringNull
}
export interface safetyHealthyTargetDetailPopType extends dataBaseType {
  month?: stringNull
  resultContents?: stringNull
  managerUserName?: stringNull
  saiSafetyHealthyTargetResultId?: stringNull
  saiSafetyHealthyTargetPlanId?: stringNull
  saiSafetyHealthyTargetId?: stringNull
  managerUserId?: stringNull
}

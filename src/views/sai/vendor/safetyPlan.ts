import { dataBaseType } from '@/types/dataBase'

export interface safetyPlanPopupParamType {
  saiVendorSafetyPlanId: stringNull
  copyFlag: boolean
}

export interface safetyPlanType extends dataBaseType {
  saiVendorSafetyPlanId?: stringNull // 수급업체 안전보건관리계획서 일련번호
  plantCd?: stringNull // 사업장 코드
  vendorCd?: stringNull // 수급업체
  workGoals?: stringNull // 작업목표 및 방침
  workDivision?: stringNull // 업무분장
  workContents?: stringNull // 작업내용
  workRisk?: stringNull // 위험성평가
  workMonitoring?: stringNull // 점검 및 모니터링
  workEdu?: stringNull // 작업교육
  workPermit?: stringNull // 작업허가
  workContact?: stringNull // 신호및 연락체계
  workMaterial?: stringNull // 위험물질 및 설비
  workEmergency?: stringNull // 비상대책
  sopConstructionId?: stringNull // 공사 일련번호
  calamitys: Array<calamitysType> | null
}

export interface calamitysType {
  saiVendorSafetyPlanId?: stringNull
  year?: stringNull
  accidentCnt?: numberNull
  diseaseCnt?: numberNull
  deadCnt?: numberNull
  totalCnt?: numberNull
  editFlag?: stringNull
  editYn?: stringNull
}

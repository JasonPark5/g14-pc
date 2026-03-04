import { dataBaseType } from '@/types/dataBase'
import { equipDailyType } from '@/views/sop/mim/inspection/equipmentDaily'

export interface equipPopupParamType {
  equipmentCd: string
  plantCd: string
  psmFlag: string
}
export interface equipType extends dataBaseType {
  plantCd: stringNull // 사업장코드
  plantName?: stringNull // 사업장
  equipmentTypeCd?: stringNull // 설비유형 코드
  equipmentTypeName?: stringNull // 설비유형명
  equipmentCd?: stringNull // 설비코드
  equipmentNo?: stringNull // 설비코드
  equipmentName?: stringNull // 설비명
  mainProcessCd?: stringNull // 주공정
  subProcessCd?: stringNull // 부공정
  managementDepts?: stringNull // 관리부서
  equipmentLocation?: stringNull // 설비위치
  installDate?: stringNull // 설치일자
  installVendor?: stringNull // 설치업체
  opertationDate?: stringNull // 가동일자
  checkPassNo?: stringNull // 검사합격번호
  checkPassDate?: stringNull // 합격일자
  discardFlag?: stringNull
  discardDate?: stringNull // 폐기일자
  psmFlag?: stringNull // PSM 대상 여부
  psmTypeCd?: stringNull
  amount?: stringNull // 수량
  lawEquipmentFlag?: stringNull // 법정설비 여부
  inspectionCycleCd?: stringNull // 법정점검 주기
  selfCycleCd?: stringNull // 자체점검 주기
  pmCycleCd?: stringNull // 자체점검 주기
  pmFlag?: stringNull // 예방정비 여부
  cmFlag?: stringNull // 고장정비 여부
  predictiveFlag?: stringNull // 예지정비 여부
  operFlag?: stringNull // 운전정비 여부
  relatedLaws?: stringNull // 관련법규
  recentInspectionDate?: stringNull // 최근 점검일자
  outsourcingVendor?: stringNull // 유지보수업체
  hazardousFlag: stringNull
  equipGradeCd: stringNull
  checks?: Array<equipDailyType>
  maintenances?: Array<equipMaintenanceType>
  specs?: Array<equipSpecType>
  ranks?: Array<equipRankType>
  materials?: Array<equipBomType>
  mocs?: Array<equipMocType>
  licenses?: Array<equipLicenseType>
  processCds?: Array<processType>
}
export interface equipMaintenanceType extends dataBaseType {
  maintenanceStatusCd: stringNull
  maintenanceDueDate: stringNull
  maintenanceDueUserName: stringNull
  memDeptEntrantUserName: stringNull
  maintenanceUserName: stringNull
  maintenanceDate: stringNull
  inspResultAfterMemName: stringNull
  equipmentCheckTypeName: stringNull
  pmCycleName: stringNull
  relatedLawsName: stringNull
  noPlanName: stringNull
}
export interface equipSpecType extends dataBaseType {
  plantCd: stringNull
  plantName?: stringNull
  equipmentSpecId: stringNull
  item: stringNull
  itemDesc: stringNull
  itemValue: stringNull
  itemUnit: stringNull
  equipmentCd: stringNull
  equipmentName?: stringNull
  sortOrder: numberNull
}

export interface equipRankType extends dataBaseType {
  plantCd: stringNull // 사업장코드
  equipmentCd: stringNull // 설비코드
  recordNo: numberNull // 이력번호
  grade: stringNull // 등급
  estimationScore: numberNull // 평가점수
  gradeDate: stringNull // 등급변경일자
  changeReason: stringNull // 등급변경사유
}

export interface equipBomType extends dataBaseType {
  equipmentMaterialCd: stringNull // 설비자재코드
  equipmentCd: stringNull // 설비코드
  processCd: stringNull // 공정코드
  mdmChemMaterialId: stringNull // 자재코드
  mdmChemMaterialCd: stringNull // 자재코드
  mdmChemMaterialName?: stringNull // 자재
  chemMaterialFlag: stringNull // 화학자재 여부 화학자재마스터에 등록된 자재이면 Y
  chemDailyVolume: stringNull // 화학자재 일 취급량
  chemDailyHour: stringNull // 화확자재 일 취급시간
}

export interface equipMocType extends dataBaseType {
  sopMocId: stringNull // MOC 일련번호
  equipmentCd: stringNull // 설비코드
  equipmentName: stringNull // 설비명
  restorationFlag: stringNull // 원복여부
  processingHistory: stringNull // 처리내역
  mocTypeCd?: stringNull // 변경구분_공통코드(정상/비상/임시)
  mocStepCd?: stringNull // MOC 상태
}

export interface equipLicenseType extends dataBaseType {
  limLicenseId: stringNull // 인허가 일련번호
  equipmentCd: stringNull // 설비코드
  equipmentTypeName: stringNull // 설비유형명
  equipmentName: stringNull // 설비명
}

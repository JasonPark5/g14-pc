import { dataBaseType } from '@/types/dataBase'

export interface hazardFacilityType extends dataBaseType {
  plantCd: stringNull // 사업장코드
  facilityCd: stringNull // 시설 코드
  facilityNo: stringNull // 시설관리번호
  facilityName: stringNull // 시설명
  processCd: stringNull // 공정코드
  hcfFacilityTypeCd: stringNull // 시설유형 코드
  hcfInspectionCycleCd: stringNull // 정기검사주기 코드
  installationPlace: stringNull // 설치장소
  annualHandling: numberNull // 연간취급량(톤/년)
  facilityCapacity: numberNull // 시설용량(㎥)
  installationDate: stringNull // 설치일
  lastRemunerationDate: stringNull // 최종보수일
  nextInspectionDate: stringNull // 차기검사일
  lastSelfCheckDate: stringNull // 최종자체점검일
  nextSelfCheckDate: stringNull // 차기자체점검일
  disasterPreventionEquipment: stringNull // 방재설비
  remarks: stringNull // 비고
  modeOfTransport: stringNull // 운송방식
  transportMethod: stringNull // 운반방식
  tankSpecifications: numberNull // 탱크 사양(재질 및 용량(㎥, ton)등)
  carryingCapacity: numberNull // 운반용량(㎥, ton)
  distance: numberNull // 거리(km)
  pipeMaterial: stringNull // 배관재질
  useFlag: stringNull // 사용여부
  hazardChems: Array<any>
  deleteHazardChems: Array<any>
  selfCheckHistory: Array<hazardSelfCheck>
}

export interface hazardFacilityChemType extends dataBaseType {
  facilityCd: stringNull // 시설 코드
  materialCd: stringNull // 유해위험물질 일련번호
  mdmChemMaterialId?: stringNull // 화학자재ID
  materialName?: stringNull // 자재명
  mdmChemId?: stringNull // 화학물질ID
  chemNmKr?: stringNull // 화학물질한글명
  chemNmEn?: stringNull // 화학물질영문명
  casNo?: stringNull // CAS No.
  molecularFormula?: stringNull // 화학식
  plantCd?: stringNull // 사업장코드
  plantName?: stringNull // 사업장
  deptCd?: stringNull // 관리부서
  deptName?: stringNull // 관리부서
  explUpLimit?: stringNull // 폭발한계상한(vol%)
  explLowLimit?: stringNull // 폭발한계하한(vol%)
  flashingPoint?: stringNull // 인하점(℃)
  ignitionPoint?: stringNull // 발화점(℃)
  vaporPressure?: stringNull // 증기압(20℃)
  extraReaction?: stringNull // 이상반응유무(내용기술)
  corrosivenessFlag?: stringNull // 부식성유무
  dailyUsage?: stringNull // 일 사용량
  stockage?: stringNull // 저장량
  remarks?: stringNull // 비고
  exposureLimit?: stringNull // 노출기준TWA
  toxicValue?: stringNull // 독성치
}
export interface hazardSelfCheck extends dataBaseType {
  facilityName: stringNull
  plantCd?: stringNull // 사업장코드
  plantName?: stringNull // 사업장
  facilityCd: stringNull
  facilityNo: stringNull
  selfCheckDate?: stringNull
  deptName?: stringNull
  selfCheckUserName?: stringNull
  selfCheckName?: stringNull
}
export interface selfcheck extends dataBaseType {
  hcfHazardFacilitySelfCheckId?: stringNull
  hcfHazardFacilitySelfCheckResultId?: stringNull
  hcfHazardFacilitySelfCheckItemId?: stringNull
  hcfHazardFacilitySelfCheckItemName?: stringNull
  plantCd?: stringNull
  selfCheckName?: stringNull //점검명
  facilityCd?: stringNull
  facilityNo?: stringNull
  facilityName?: stringNull
  hcfFacilityTypeName?: stringNull
  selfCheckDate?: stringNull
  startTime?: stringNull
  endTime?: stringNull
  time?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  selfCheckUserId?: stringNull
  selfCheckItemName?: stringNull
  hcfAbnormalityCd?: stringNull
  selfCheckUserName?: stringNull
  hcfSelfCheckCompleteFlag?: stringNull
  regUserId?: stringNull
  chgUserId?: stringNull
  materialNames?: stringNull
  deleteCheckResults?: Array<any> // 결과 목록 삭제
  selfCheckItemResults?: Array<any> // 결과 목록
  remark?: stringNull
  selfCheckItemTypeName?: stringNull
  selfCheckItemType?: stringNull // 1: 주차, 2: 반기
  // 개선관련 추가
  //hcfSelfCheckProgressCompleteFlag?: stringNull // 개선진행상태
  approvalStatusCd?: stringNull // 결재관련 결재상태
  hcfApprovalRequestId?: stringNull // 결재관련 결재요청코드
  sysApprovalRequestId?: stringNull
}

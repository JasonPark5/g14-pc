import { dataBaseType } from '@/types/dataBase'

export interface airOutletType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  envAirMstOutletId?: stringNull
  outletHeight?: stringNull // 높이
  deptCd?: stringNull // 관리부서 코드
  useFlag?: stringNull // 사용여부

  // 추가 및 수정 변수
  selfMeasureExemptionFlag?: stringNull
  inspectItems?: Array<any>
  deleteInspectItems?: Array<any>
  outletSemsId?: stringNull // 대기배출구 시스템 일련번호
  outletName?: stringNull // 배출구명
  outletPermitNo?: stringNull // 허가증상 배출구번호
  outletInnerDiameter?: stringNull // 내경
  startOpertime?: stringNull
  endOpertime?: stringNull
  dustEmission?: stringNull
  noxEmission?: stringNull
  soxEmission?: stringNull
  processCd?: stringNull
  processNo?: stringNull
  outletSemsFacilityId?: stringNull
  outletIepsNo?: stringNull
  iepsFlag?: stringNull
  outletIepsPlantMgtNo?: stringNull
  outletUpperStackDiameter?: stringNull
  outletEmissionNo?: stringNull
  envTmsMstId?: stringNull
  tmsNo?: stringNull

  // 이전 변수
  envAirMstOutletNm?: stringNull
  envAirMstOutletName?: stringNull
  envAirMstOutletSems?: stringNull
  location?: stringNull
  handlingCapacity?: stringNull
  permitCapacity?: stringNull
  outletWidth?: stringNull
  envAirMstPreventiveId?: stringNull
  preventExemptionFlag?: stringNull

  // 연결된 배출시설/방지시설
  preventiveName?: stringNull
  envAirMstDischargeId?: stringNull
  dischargeName?: stringNull
}

export interface airDischargeType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  envAirMstDischargeId?: stringNull // 대기배출시설 일련번호
  deptCd?: stringNull // 관리부서 코드
  useFlag?: stringNull // 사용여부

  // 추가 및 수정 변수
  dischargeSemsId?: stringNull // 배출시설 SEMS 일련번호
  dischargePermitNo?: stringNull // 허가증상배출시설번호
  dischargeIepsNo?: stringNull // IEPS 배출시설 관리번호
  dischargeIepsPlantMgtNo?: stringNull // IEPS 사업장 관리번호
  dischargeIepsName?: stringNull
  dischargeName?: stringNull // 배출구명
  processCd?: stringNull // 작업장(공정)
  processNo?: stringNull // 공정관리번호
  processName?: stringNull // 공정명
  iepsFlag?: stringNull // IEPS시설여부
  preventExemptFlag?: stringNull
  fuelUsageFlag?: stringNull
  exhaustGasFlow?: numberNull
  // 연결된 방지시설, 배출구
  preventiveName?: stringNull
  envAirMstPreventiveId?: stringNull
  envAirMstOutletId?: stringNull
  outletName?: stringNull
  // 이전 변수
  envAirMstDischargeName?: stringNull // 대기배출시설명
  envAirMstDischargeNo?: stringNull // 대기배출시설 관리번호
}

export interface airPreventiveType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  envAirMstPreventiveId?: stringNull // 대기방지시설 시스템일련번호
  location?: stringNull // 위치
  handlingConcentration?: stringNull // 처리농도
  wattmeterFlag?: stringNull // 전력계부착여부
  wattmeterMagnification?: stringNull //  배율
  deptCd?: stringNull // 관리부서 코드
  useFlag?: stringNull // 사용여부

  // 추가 및 수정 변수
  preventiveSemsFacilityId?: stringNull
  preventiveSemsId?: stringNull // 대기방지시설 SEMS 일련번호
  preventivePermitNo?: stringNull // 허가증상 방지시설번호
  preventiveName?: stringNull // 방지시설명
  designTreatmentCapacity?: stringNull // 설계처리용량
  actualTreatmentCapacity?: stringNull // 실제처리용량
  designTreatmentEfficiency?: stringNull // 설계처리효율
  actualTreatmentEfficiency?: stringNull // 실제처리효율
  handlingMaterial1?: stringNull // 처리오염물질1
  handlingMaterial2?: stringNull // 처리오염물질2
  handlingMaterial3?: stringNull // 처리오염물질3
  processCd?: stringNull // 관련공정코드
  processNo?: stringNull
  processName?: stringNull
  preventiveTypeCd?: stringNull // 방지시설분류코드
  preventiveIepsNo?: stringNull
  preventiveIepsPlantMgtNo?: stringNull // IEPS 사업장 관리번호
  preventiveIepsName?: stringNull
  iepsFlag?: stringNull
  wattmeters?: Array<any>
  deleteWattmeters?: Array<any>
  treatItems?: Array<any>
  deleteTreatItems?: Array<any>
  sortOrder?: number
  // 연결된 방지시설, 배출구
  envAirMstDischargeId?: stringNull
  dischargeName?: stringNull
  envAirMstOutletId?: stringNull
  outletName?: stringNull
  pressureDiffFlag?: stringNull
  temperatureFlag?: stringNull
  phFlag?: stringNull

  // 이전 변수
  envAirMstPreventiveName?: stringNull // 대기방지시설명
  envAirMstPreventiveNo?: stringNull // 대기방지시설 일련번호
  envAirMstPreventiveNum?: stringNull // 대기방지시설 사내고유번호
  handlingCapacity?: stringNull // 처리용량
  permitCapacity?: stringNull // 설계허가증상용량
  handlingMaterial?: stringNull // 처리오염물질
  handlingPercent?: stringNull // 처리효율
  envAirMstWattmeterId?: stringNull // 전력계일련번호
  envAirMstWattmeterNo?: stringNull // 전력계번호
  envAirMstWattmeterName?: stringNull // 전력계명
}

export interface airStructureType extends dataBaseType {
  plantCd?: stringNull
  airStructureLinkId?: stringNull
  facilityId?: stringNull
  facilityName?: stringNull
  linkId?: stringNull
  facilityType?: stringNull
  upStructureLinkId?: stringNull
  airMstOutletModel?: airOutletType
  airMstPreventiveModel?: any
  subAirMstPreventiveModel?: any
  airMstDischargeModel?: any
  subAirMstPreventiveList?: Array<any>
}

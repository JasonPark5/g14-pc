import { dataBaseType } from '@/types/dataBase'

export interface measureType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  envAirSelfMeasureMstId?: stringNull // 대기 자가측정 일련번호
  measureYear?: stringNull // 대기 자가측정 년도
  airInspectTypeCd?: stringNull // 대기 검사항목 구분
  envAirSelfMeasureMstName?: stringNull // 대기 자가측정명
  airSelfMeasureInspectItems?: any[] // 대기 자가측정 검사항목
}
export interface resultType extends dataBaseType {
  envAirMstInspectItemId?: stringNull
  envAirMstInspectItemName?: stringNull
  airInspectUnitName?: stringNull
  airInspectUnitCd?: stringNull
  legalStandard?: stringNull
  innerStandard?: stringNull
}

export interface dailyReportType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  envAirDailyResultId?: stringNull // 대기일지 일련번호
  dailyResultDt?: stringNull // 작성일
  deptCd?: stringNull // 작성부서
  userId?: stringNull // 작성자
  weatherCd?: stringNull // 날씨
  temperature?: stringNull // 온도
  sejongDeptCd?: stringNull // 세종사업장 부서코드

  outletOpertimes?: Array<any>
  dischargeOpertimes?: Array<any>
  preventiveOpertimes?: Array<any>
  preventiveOperations?: Array<any>
  preventiveMaintenances?: Array<any>
  fuelUsages?: Array<any>
  materialUsages?: Array<any>
  dayOfWeek?: stringNull
  worker1UserId?: stringNull
  worker1UserName?: stringNull
  worker2UserId?: stringNull
  worker3UserId?: stringNull
  dailyResultStatusCd?: stringNull
  checkerId?: stringNull
  processCd?: stringNull
  envTeamUserId?: stringNull
}

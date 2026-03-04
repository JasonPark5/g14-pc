import { dataBaseType } from '@/types/dataBase'

export interface dischargeFacilityType extends dataBaseType {
  plantCd: stringNull // 사업장코드
  facilityCode: stringNull
  envGhgFacilityId: stringNull // 온실가스 일련번호
  facilityTypeCd: stringNull // 배출형태
  facilityTypeName?: stringNull // 배출형태
  facilityName: stringNull // 배출시설명
  processCd: stringNull // 공장
  processName?: stringNull // 공장
  deptCd: stringNull // 부서
  deptName?: stringNull // 부서
  useFlag: stringNull // 사용여부
  useFlagName?: stringNull
  fuelList?: Array<dischargeFacilityFuelType>
  deleteFuelList?: Array<dischargeFacilityFuelType>
}
export interface dischargeFacilityFuelType extends dataBaseType {
  envGhgFacilityFuelId: stringNull // 시설별 연료 일련번호
  envGhgFacilityId: stringNull // 온실가스 일련번호
  envGhgRawFuelId: stringNull // 연료 일련번호
  equipmentCode: stringNull // 설비명
  equipmentName: stringNull // 설비명
  rawFuelName?: stringNull // 연료명
  rawFuelTypeName?: stringNull // 단위
  sortOrder?: numberNull // 순번
}

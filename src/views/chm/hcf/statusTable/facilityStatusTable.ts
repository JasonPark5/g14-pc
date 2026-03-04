import { dataBaseType } from '@/types/dataBase'
import { seniorStatusType } from '@/views/sop/com/senior'
import { hazardFacilityType } from '../hazardFacility'
import { deviceEquipType, powerMachineType } from '@/views/psi/processSafetyInfo'

export interface facilityStatusTableType extends dataBaseType {
  chmFacilityStatusTableId: stringNull // 취급시설 현황표 일련번호
  facilityStatusTableName: stringNull // 현황표명
  plantCd: stringNull // 사업장코드
  plantName?: stringNull // 사업장
  year: stringNull // 년도
  permitDate: stringNull // 허가일
  companyName: stringNull // 회사명
  managerName: stringNull // 대표자
  managerEmail: stringNull // 대표자 E-MAIL
  phoneNo: stringNull // 전화번호
  bizNo: stringNull // 사업자번호
  remarks: stringNull // 비고
  attrVal1: stringNull // 회사id
  attrVal2: stringNull // 소재지
  attrVal3: stringNull // 시설구분
  managers: Array<seniorStatusType> // 유해화학물질관리자
  facilities: Array<hazardFacilityType> // 시설
  hazardChems: Array<facilityStatusTableHazardChemType> // 유해화학물질 취급현황
  equipDevices: Array<deviceEquipType> // 설비 장치
  equipPowers: Array<powerMachineType> // 설비 동력기계
}

export interface facilityStatusTableHazardChemType extends dataBaseType {
  chmFacilityStatusTableHazardId: stringNull // 취급시설 현황표 유해화학물질 일련번호
  chmFacilityStatusTableId: stringNull // 취급시설 현황표 일련번호
  mdmChemId?: stringNull // 화학물질 일련번호
  useage: stringNull // 사용처
  annualVolumne: stringNull // 연간취급량
  previousVolumne: stringNull // 과년도취급량
  storageMethod: stringNull // 저장방법
  plantCd?: stringNull // 사업장코드
  plantName?: stringNull // 사업장
  mdmChemMaterialId?: stringNull // 화학자재 일련번호
  materialCd?: stringNull // 자재코드
  materialName?: stringNull // 자재
  casNo?: stringNull // CAS No.
  chemNmKr?: stringNull // 화학물질명
  chemNmEn?: stringNull // 화학물질명
  limitRepval?: numberNull // 함유량 대표값(%)
  propertiesStateCd?: stringNull // 성상
  propertiesStateName?: stringNull // 성상
}

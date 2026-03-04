import { dataBaseType } from '@/types/dataBase'

export interface workGasItemType extends dataBaseType {
  sopGasId: stringNull // 가스번호
  plantCd: stringNull // 사업장 코드
  gasName: stringNull // 가스항목명
  safetyStandards: stringNull // 안전기준
  useFlag: stringNull // 사용여부
  workTypes: Array<workGasHasItemType>
}

export interface workGasHasItemType {
  sopGasId: stringNull // 가스번호
  sopWorkTypeCd: stringNull // 가스농도 허가서/작업구분
}

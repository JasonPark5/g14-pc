import { dataBaseType } from '@/types/dataBase'

export interface chemProcessKnowhowsType extends dataBaseType {
  materialKnowhowId: stringNull //
  mdmChemMaterialId: stringNull // 화학자재 일련코드
  materialName: stringNull //
  deptCd: stringNull // 부서코드
  substanceName: stringNull //
  signName: stringNull //
  riskType: stringNull //
  riskWork: stringNull //
  imageWord: stringNull //
  twoFirst: stringNull //
  twoSecond: stringNull //
  threeFirst: stringNull //
  threeSecond: stringNull //
  threeThird: stringNull //
  threeFourth: stringNull //
  fourFirst: stringNull //
  fourSecond: stringNull //
  fourThird: stringNull //
  fourFourth: stringNull //
  fourFifth: stringNull //
  fiveFirst: stringNull //
  fiveSecond: stringNull //
  fiveThird: stringNull //
  useFlag: stringNull //
  processCd: stringNull // 공종코드
  processName: stringNull
  plantCd: stringNull // 사업장코드
  plantName?: stringNull
  mdmSopId: stringNull // 작업표준일련번호
  sopName?: stringNull
  chemNames?: stringNull
  chemList: Array<chemProcessKnowhowsMatrerialType>
  delChemList: Array<chemProcessKnowhowsMatrerialType>
}

export interface chemProcessKnowhowsMatrerialType extends dataBaseType {
  materialKnowhowId: stringNull
  mdmChemMaterialId: stringNull // 화학자재 일련코드
  mdmChemMaterialName: stringNull // 화학자재
  casNo: stringNull
  usageCd: stringNull
  usageName: stringNull
  propertiesStateCd: stringNull
  propertiesStateName: stringNull
  processCd: stringNull // 공종코드
  mdmSopId?: stringNull // 단위작업 일련번호
  substanceNames?: stringNull
}

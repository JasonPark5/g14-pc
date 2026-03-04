import { dataBaseType } from '@/types/dataBase'

export interface matrixListype extends dataBaseType {
  ramMatrixId: stringNull
  plantName: stringNull
  plantCd: stringNull
  ramTechniqueName: stringNull
  matrixName: stringNull
  useFlag: stringNull
}

export interface matrixType extends dataBaseType {
  ramMatrixId: stringNull // matrix 번호
  matrixName: stringNull // matrix 명
  plantCd: stringNull // 사업장코드
  ramTechniqueCd: stringNull // 평가기법 코드
  remarks: stringNull // 비고
  useFlag: stringNull // 사용여부
  frequencies: Array<frequenciesType> // 빈도
  deleteFrequencies: Array<frequenciesType> // [삭제] 빈도
  strengties: Array<strengtiesType> // 강도
  deleteStrengties: Array<strengtiesType> // [삭제] 강도
  risks: Array<risksType> // 위험도
  standards: Array<standardsType> // 위험도 기준
  deleteStandards: Array<standardsType> // [삭제] 위험도 기준
  matrixRiskStandardCd?: stringNull
}

export interface frequenciesType extends dataBaseType {
  frequencyContents?: stringNull
  ramMatrixFrequencyId?: stringNull
  frequency?: stringNull
  ramMatrixId?: stringNull
}

export interface strengtiesType extends dataBaseType {
  ramMatrixId?: stringNull
  ramMatrixStrengthId?: stringNull
  strength?: stringNull
  strengthContents?: stringNull
}

export interface risksType extends dataBaseType {
  frequency?: stringNull
  ramMatrixId?: stringNull
  ramMatrixRiskId?: numberNull
  risk?: stringNull
  riskInfo?: stringNull
  strength?: stringNull
}

export interface standardsType extends dataBaseType {
  min?: numberNull
  max?: numberNull
  color?: stringNull
  ramMatrixId?: stringNull
  ramMatrixRiskStandardsId?: stringNull
  riskContents?: stringNull
  checked?: boolean | null
  model?: any
}

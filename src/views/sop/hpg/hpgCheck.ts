import { dataBaseType } from '@/types/dataBase'

export interface hpgCheckType extends dataBaseType {
  hpgCheckId: stringNull
  hpgName?: stringNull
  checkTypeCd?: stringNull
  checkTypeName?: stringNull
  checkName?: stringNull
  checkDate?: stringNull
  checkerId?: stringNull
  checkerName?: stringNull
  checkDetail?: stringNull
  completeFlag?: stringNull
  targetIds?: stringNull
  targetDeptCd?: stringNull
  targetDeptName?: stringNull
  results: Array<resultType> | null
  delResults: Array<resultType> | null
}

export interface resultType extends dataBaseType {
  hpgCheckId: stringNull
  hpgCheckResultId: stringNull
  hpgCheckItemId?: stringNull
  checkTypeCd?: stringNull
  checkResultCd?: stringNull
  checkResultName?: stringNull
  divisionName: stringNull
  itemName: stringNull
  remark: stringNull
  sortOrder: numberNull
}

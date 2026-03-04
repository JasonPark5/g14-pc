import { dataBaseType } from '@/types/dataBase'

export interface workMeasureType extends dataBaseType {
  workMeasurementPlanId?: stringNull
  plantCd?: stringNull
  measPlaceName?: stringNull
  measPlanContent?: stringNull
  measQuarter?: stringNull
  measYear?: stringNull
  measStartDate?: stringNull
  measEndDate?: stringNull
  measStartDate2?: stringNull
  measEndDate2?: stringNull
  measCompleteFlag?: stringNull
  measTemperature?: stringNull
  measHumidity?: stringNull
  heaCheckupPlanId?: stringNull
  workMeasurementResultModelList?: Array<any>
  updateFlag?: stringNull
  workMeasurementResultId?: stringNull
  hazardCd?: stringNull
  hazardName?: stringNull
  chemName?: stringNull
  casNo?: stringNull
  processCd?: stringNull
  workAreaGradeCd?: stringNull
  deptCd?: stringNull
  workPlace?: stringNull
  workContents?: stringNull
  workCount?: stringNull
  shiftType?: stringNull
  occurType?: stringNull
  occurTime?: stringNull
  measPositionName?: stringNull
  measCount?: stringNull
  measValue?: stringNull
  twaPrev?: stringNull
  twaCurr?: stringNull
  exposureStandard?: stringNull
  exposureFlag?: stringNull
  measMethod?: stringNull
  remark?: stringNull
  measStartTime?: stringNull
  measEndTime?: stringNull
  hazardClassFstCd?: stringNull
  hazardClassSecCd?: stringNull
  hazardId?: stringNull
  mdmChemMaterialId?: stringNull
  useFlag?: stringNull
  sortOrder?: numberNull
  workEnvFlag?: stringNull
  speHealthFlag?: stringNull
  workMeasCycleCd?: stringNull
  factorMeasCycleCd?: stringNull
  materialCd?: stringNull
  checmName?: stringNull
  deptList?: Array<any>
}

export interface hazFactorType extends dataBaseType {
  hazardCd?: stringNull
  hazardName?: stringNull
  hazardClassFstCd?: stringNull
  hazardClassSecCd?: stringNull
  hazardId?: stringNull
  mdmChemMaterialId?: stringNull
  useFlag?: stringNull
  workEnvFlag?: stringNull
  speHealthFlag?: stringNull
  workMeasCycleCd?: stringNull
  factorMeasCycleCd?: stringNull
  materialCd?: stringNull
  checmName?: stringNull
  deptList?: Array<any>
}

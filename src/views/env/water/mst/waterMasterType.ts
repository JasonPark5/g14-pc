import { dataBaseType } from '@/types/dataBase'

export interface waterMasterDataType extends dataBaseType {
  plantCd?: stringNull
  envWaterMstPreventiveId?: stringNull
  envWaterMstPreventiveName?: stringNull
  envWaterMstPreventiveNo?: stringNull
  envWaterMstDischargeId?: stringNull
  envWaterMstDischargeName?: stringNull
  envWaterMstDischargeNo?: stringNull
  envWaterMstOutletId?: stringNull
  envWaterMstOutletName?: stringNull
  envWaterMstOutletNo?: stringNull
  outletIepsNo?: stringNull
  outletIepsPlantMgtNo?: stringNull
  preventiveIepsNo?: stringNull
  preventiveIepsPlantMgtNo?: stringNull
  preventiveIepsName?: stringNull
  processCd?: stringNull
  processNo?: stringNull
  deptCd?: stringNull
  wattmeterFlag?: stringNull
  iepsFlag?: stringNull
  useFlag?: string
  oprTime01?: stringNull
  oprTime02?: stringNull
  oprTime03?: stringNull
  oprTime04?: stringNull
  oprTime05?: stringNull
  oprTime06?: stringNull
  oprTime07?: stringNull
  oprTime08?: stringNull
  oprTime09?: stringNull
  oprTime10?: stringNull
  oprTime11?: stringNull
  oprTime12?: stringNull
  oprTime13?: stringNull
  oprTime14?: stringNull
  oprTime15?: stringNull
  oprTime16?: stringNull
  oprTime17?: stringNull
  oprTime18?: stringNull
  oprTime19?: stringNull
  oprTime20?: stringNull
  oprTime21?: stringNull
  oprTime22?: stringNull
  oprTime23?: stringNull
  oprTime24?: stringNull
  breakdowns?: Array<waterMasterData2Type>
  deleteBreakdowns?: Array<waterMasterData2Type>
  wattmeters?: Array<any>
  deleteWattmeters?: Array<any>
  preventives: Array<any>
  deletePreventives: Array<any>
}
export interface waterMasterData2Type extends dataBaseType {
  envWaterMstPreventiveId: stringNull
  envWaterMstPreventiveBreakdownId: stringNull
  breakdownStartDt: stringNull
  breakdownEndDt: stringNull
  breakdownDts: stringNull
  breakdownStatus?: stringNull
  breakdownAction?: stringNull
  remark?: stringNull
  bactionDt?: stringNull
}
export interface waterDisChargeType extends dataBaseType {
  plantCd?: stringNull
  envWaterMstDischargeId?: stringNull
  envWaterMstDischargeName?: stringNull
  dischargeIepsNo?: stringNull
  dischargeIepsPlantMgtNo?: stringNull
  dischargeIepsName?: stringNull
  envWaterMstDischargeNo?: stringNull
  processCd?: stringNull
  processNo?: stringNull
  deptCd?: stringNull
  useFlag?: string
  iepsFlag?: stringNull
  oprTime01?: stringNull
  oprTime02?: stringNull
  oprTime03?: stringNull
  oprTime04?: stringNull
  oprTime05?: stringNull
  oprTime06?: stringNull
  oprTime07?: stringNull
  oprTime08?: stringNull
  oprTime09?: stringNull
  oprTime10?: stringNull
  oprTime11?: stringNull
  oprTime12?: stringNull
  oprTime13?: stringNull
  oprTime14?: stringNull
  oprTime15?: stringNull
  oprTime16?: stringNull
  oprTime17?: stringNull
  oprTime18?: stringNull
  oprTime19?: stringNull
  oprTime20?: stringNull
  oprTime21?: stringNull
  oprTime22?: stringNull
  oprTime23?: stringNull
  oprTime24?: stringNull
}
export interface waterWattmetType extends dataBaseType {
  plantCd: stringNull
  envWaterMstWattmeterId: stringNull
  envWaterMstWattmeterName?: stringNull
  envWaterMstWattmeterNo?: stringNull
  wattmeterMagnification?: stringNull
  deptCd?: stringNull
  useFlag: stringNull
}
export interface supWaterType extends dataBaseType {
  plantCd: stringNull
  envWaterMstSupwaterId: stringNull
  envWaterMstSupwaterName?: stringNull
  remark?: stringNull
  deptCd?: stringNull
  useFlag: string
}
export interface disWaterType extends dataBaseType {
  plantCd?: stringNull
  envWaterMstDiswaterId: stringNull
  envWaterMstDiswaterName?: stringNull
  remark?: stringNull
  deptCd?: stringNull
  useFlag: string
}
export interface InspectItemType extends dataBaseType {
  envWaterMstInspectItemId: stringNull
  envWaterMstInspectItemName: stringNull
  legalStandard: stringNull
  useFlag: stringNull
  regUserId: stringNull
  editFlag: stringNull
}
export interface plantMstType extends dataBaseType {
  plantCd?: stringNull
  envWaterPlantInspectItemId?: stringNull
  envWaterMstInspectItemId?: stringNull
  envWaterMstInspectItemName?: stringNull
  legalStandard: stringNull
  innerStandard: stringNull
  useFlag?: stringNull
  editFlag?: stringNull
  regUserId?: stringNull
}
export interface measurelocType extends dataBaseType {
  plantCd?: stringNull
  plantName?: stringNull
  envWaterMstMeasurelocId: stringNull
  envWaterMstMeasurelocName?: stringNull
  waterMeasureCd: stringNull
  waterMeasureName?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  useFlag: stringNull
}
export interface additivesType extends dataBaseType {
  plantCd?: stringNull
  plantName?: stringNull
  envWaterMstAdditiveId: stringNull
  envWaterMstAdditiveName?: stringNull
  remark?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  useFlag: stringNull
}
export interface DrugType extends dataBaseType {
  plantCd?: stringNull
  plantName?: stringNull
  envWaterMstDrugId: stringNull
  envWaterMstDrugName?: stringNull
  remark?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  useFlag: stringNull
}
export interface aerationtankType extends dataBaseType {
  plantCd?: stringNull
  plantName?: stringNull
  envWaterMstAerationtankId: stringNull
  envWaterMstAerationtankName?: stringNull
  envWaterMstAerationtankNo?: stringNull
  deptCd?: stringNull
  deptName?: stringNull
  useFlag: stringNull
}

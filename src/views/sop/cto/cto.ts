import { dataBaseType } from '@/types/dataBase'

export interface ctoType extends dataBaseType {
  sopCtoId: stringNull
  plantCd: stringNull
  ctoDate: stringNull
  ctoTime: stringNull
  observeUserId: stringNull
  observeCount: stringNull
  mdmSopId: stringNull
  workArea: stringNull
  ctoCompleteFlag: stringNull
  improveContents: stringNull
  priorityContents: stringNull
  managerUserId: stringNull
  sopName: stringNull
  processName: stringNull
  regUserId: stringNull
  chgUserId: stringNull
  workCharacteristics: stringNull
  humanFactors: stringNull
  coreActionItems: stringNull
  activityModels: Array<any>
  deleteActivityModels?: Array<any>
  ctoChecklistModels: Array<any>
  ctoImproveModels: Array<any>
}

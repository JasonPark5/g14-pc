import { dataBaseType } from '@/types/dataBase'

export interface journalType extends dataBaseType {
  industryHealthJournalId?: stringNull
  plantCd?: stringNull
  startDate?: stringNull
  endDate?: stringNull
  journalName?: stringNull
  completeFlag?: stringNull
  results?: Array<any>
  deleteResults?: Array<any>
  statuses?: Array<any>
  deleteStatuses?: Array<any>
}

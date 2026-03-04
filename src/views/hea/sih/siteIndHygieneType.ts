import { dataBaseType } from '@/types/dataBase'

export interface siteIndHygieneJournal extends dataBaseType {
  plantCd?: stringNull
  regUserId?: stringNull
}

export interface siteIndHygieneJournalType extends siteIndHygieneJournal {
  plantName?: stringNull
  plantCdList?: stringNull
  regUserName?: stringNull
  regUserDeptName?: stringNull
  regDt?: stringNull
  regDtStr?: stringNull
  regDtStrTime?: stringNull
  chgUserName?: stringNull
  chgUserDeptName?: stringNull
  chgDt?: stringNull
  chgDtStr?: stringNull
  chgDtStrTime?: stringNull
  indHygieneJournalId?: stringNull
  indHygieneJournalName?: stringNull
  indHygieneJournalLocation?: stringNull
  hygieneJournalCheckDate?: stringNull
  approvalStatusName?: stringNull
  checkUserId?: stringNull
  userName?: stringNull
  userDeptCd?: stringNull
  results: Array<siteIndHygieneJournalResultType>
  deleteResults?: stringNull
}

export interface siteIndHygieneJournalResultType extends siteIndHygieneJournal {
  indHygieneJournalId: stringNull
  hygieneJournalResultId: stringNull
  siteHygieneTypeCd: stringNull
  hygieneItemName: stringNull
  checkContents: stringNull
  editFlag: stringNull
}

export interface siteIndHygieneJournalItemType extends siteIndHygieneJournal {
  siteHygieneTypeCd?: stringNull
  hygieneJournalItemId?: stringNull
  hygieneItemName?: stringNull
  sortOrder?: stringNull
  useFlag?: stringNull
  chgUserId?: stringNull
  editFlag?: stringNull
}

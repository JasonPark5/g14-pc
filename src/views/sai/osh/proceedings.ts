import { dataBaseType } from '@/types/dataBase'
import { imprType } from '@/views/sop/ibm/impr'

export interface proceedingsType extends dataBaseType {
  proceedingsId: stringNull
  plantCd: stringNull
  proceedingsDate: stringNull
  proceedingsContents: stringNull
  proceedingsTitle: stringNull
  regUserId: stringNull
  chgUserId: stringNull
  attendeeInModels: Array<proceedingsAttendeeType>
  attendeeOutModels: Array<proceedingsAttendeeType>
  deleteAttendeeInModels: Array<proceedingsAttendeeType>
  deleteAttendeeOutModels: Array<proceedingsAttendeeType>
  imprs: Array<imprType>
  imprImms: Array<imprType>
}

export interface proceedingsAttendeeType extends dataBaseType {
  proceedingsId: stringNull
  proceedingsAttendeeId: stringNull
  attendeeType: stringNull
  plantCd?: stringNull
  attendeeDeptName?: stringNull
  attendeeUserId: stringNull
  attendeeUserName: stringNull
  attendeeJobName: stringNull
  remark: stringNull
  attendeeBelong?: stringNull
}

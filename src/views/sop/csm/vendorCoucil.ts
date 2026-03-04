import { dataBaseType } from '@/types/dataBase'

export interface vendorCoucilPopupParamType {
  councilId: stringNull
}

export interface vendorCoucilType extends dataBaseType {
  councilId: stringNull
  plantCd?: stringNull
  councilDate?: stringNull
  councilContents?: stringNull
  councilTypeCd?: stringNull
  councilTitle?: stringNull
  regUserId?: stringNull
  chgUserId?: stringNull

  attendeeInModels?: Array<vendorCoucilAttendeeType> | null
  attendeeOutModels?: Array<vendorCoucilAttendeeType> | null
  coucilVendorModels?: Array<vendorCoucilVendorType> | null
  deletecoucilVendorModels?: Array<vendorCoucilVendorType> | null
  deleteAttendeeInModels?: Array<vendorCoucilAttendeeType> | null
  deleteAttendeeOutModels?: Array<vendorCoucilAttendeeType> | null
  improveList?: Array<vendorCoucilImproveType> | null

  imprImmData?: stringNull
  imprData?: stringNull
}

export interface vendorCoucilVendorType extends dataBaseType {
  councilId: stringNull
  vendorCd: stringNull
  vendorName: stringNull
  remark: stringNull
}
export interface vendorCoucilImproveType extends dataBaseType {
  councilId: stringNull
}

export interface vendorCoucilAttendeeType extends dataBaseType {
  councilId: stringNull
  councilAttendeeId: stringNull
  attendeeType?: stringNull
  attendeeUserId?: stringNull
  attendeeUserName?: stringNull
  attendeeDeptName?: stringNull
  attendeeJobName?: stringNull
  attendeeBelong?: stringNull
  remark?: stringNull
}

import { dataBaseType } from '@/types/dataBase'

export interface safetyGearType extends dataBaseType {
  requestGiveInfoId?: stringNull
  stepCd?: stringNull
  statusCd?: stringNull
  plantCd?: stringNull
  isRequest?: stringNull
  giveTypeCd?: stringNull
  requestDeptCd?: stringNull
  requestUserId?: stringNull
  requestDate?: stringNull
  giveDeptCd?: stringNull
  giveUserId?: stringNull
  giveDate?: stringNull
  requestItems?: stringNull
  giveItems?: stringNull
  detailList?: Array<safetyGearDetail> // 요청 보호구 리스트
  deleteDetailList?: Array<safetyGearDetail>
  detailList2?: Array<safetyGearDetail> // 지급 보호구 리스트
  deleteDetailList2?: Array<safetyGearDetail>
  buyRequestId?: stringNull // 구매요청 일련번호
}

export interface safetyGearDetail extends dataBaseType {
  requestGiveInfoId?: stringNull
  requestListId?: stringNull
  safetyGearId?: stringNull
  safetyGearName?: stringNull
  safetyTypeName?: stringNull
  requestCount?: stringNull | number
  remarks?: stringNull
  giveListId?: stringNull
  giveCount?: stringNull
  userArray?: Array<any>
  userList?: Array<any>
  buyRequestDetailId?: stringNull
  buyRequestId?: stringNull
  safetyGearPrice?: stringNull | number
  totalPrice?: numberNull
  plantCd?: stringNull
  recepitList?: Array<any>
  deliverList?: Array<any>
  unitName?: stringNull
  stockCount?: stringNull | number
  mediateCount?: stringNull | number
  realCount?: numberNull
}

export interface gearUserType extends dataBaseType {
  userItems?: Array<any>
  userText?: stringNull
  userValue?: stringNull
}

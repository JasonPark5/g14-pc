import { dataBaseType } from '@/types/dataBase'

export interface consolidationCheckPopupParamType {
  saiJointInspectionId: string
}

export interface consolidationCheckType extends dataBaseType {
  saiJointInspectionId: stringNull // 합동점검 일련번호
  plantCd: stringNull // 사업장 코드
  jointInspectionName: stringNull // 합동점검명
  jointStartDt: stringNull // 점검시작일
  jointEndDt: stringNull // 점검종료일
  jointDts: Array<string> | null
  remark: stringNull // 내용
  jointCompleteFlag: '' // 완료여부
  innerList: Array<consolidationCheckInnerType> | null
  outerList: Array<consolidationCheckOuterType> | null
  vendorList: Array<consolidationCheckVendorType> | null
  itemResultList: Array<consolidationCheckResultType> | null
}

export interface consolidationCheckResultType extends dataBaseType {
  saiJointInspectionId: stringNull
  jointInspectionResultId: stringNull
  jointItemName: stringNull
  jointResultCd: stringNull
  jointContents: stringNull
}

export interface consolidationCheckInnerType extends dataBaseType {
  saiJointInspectionId: stringNull
  userId: stringNull // 사용자 아이디
  userName: stringNull
  deptName: stringNull
  jobName: stringNull
  remark: stringNull // 비고
}

export interface consolidationCheckOuterType extends dataBaseType {
  saiJointInspectionId: stringNull
  saiJointOuterUserId: stringNull
  company: stringNull // 소속
  userName: stringNull // 이름
  jobName: stringNull // 직책
  remark: stringNull // 비고
}

export interface consolidationCheckVendorType extends dataBaseType {
  saiJointInspectionId: stringNull
  vendorCd: stringNull // 소속
  vendorName: stringNull // 이름
  remark: stringNull // 비고
}

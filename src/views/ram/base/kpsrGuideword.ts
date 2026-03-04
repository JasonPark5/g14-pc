import { dataBaseType } from '@/types/dataBase'

export interface kpsrRiskType extends dataBaseType {
  ramRiskTypeId: stringNull // 위험형태 번호
  riskTypName: stringNull // 위험형태명
  useFlag: stringNull // 사용여부
  regUserId: stringNull // 등록자 ID
  chgUserId: stringNull // 수정자 ID
  causes?: Array<kpsrRiskCuaseType> | null | undefined // 위험형태 원인 목록
  deleteCauses: Array<kpsrRiskCuaseType> | null | undefined // [삭제] 위험형태 원인 목록
}

export interface kpsrRiskCuaseType extends dataBaseType {
  ramRiskTypeCauseId: stringNull
  ramRiskTypeId: stringNull
  riskTypeCauseMainName: stringNull
  riskTypeCauseSubName: stringNull
  processTypes?: Array<kpsrRiskCuaseProcessType> | null | undefined
}

export interface kpsrRiskCuaseProcessType extends dataBaseType {
  mdmProcessTypeCd: stringNull
  mdmProcessTypeName: stringNull
  ramRiskTypeCauseId: stringNull
}

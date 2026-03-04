import { dataBaseType } from '@/types/dataBase'

export interface rskHazardType extends dataBaseType {
  ramRiskHazardId: stringNull // 유해위험요인 번호
  riskHazardName: stringNull // 유해위험요인명
  riskHazardNumber: stringNull
  ramRiskHazardClassCd: stringNull // 유해위험요인 분류 코드
  relevantLegalStandards: stringNull // 관련근거(법적기준)
  useFlag: stringNull // 사용여부
}

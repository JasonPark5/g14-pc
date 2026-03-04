import { dataBaseType } from '@/types/dataBase'

export interface riskThirdStandardType extends dataBaseType {
  ramRiskThirdStandardId: stringNull // 3단계 판단기준 일련번호
  plantCd: stringNull // 사업장코드
  ramRiskLevelCd: stringNull // 위험수준 코드
  judgmentCriteria: stringNull // 판단기준
  ramRiskAcceptCd: stringNull // 허용가능 수준
  riskColor: stringNull // 위험색상
}

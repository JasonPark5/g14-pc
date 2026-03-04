import { dataBaseType } from '@/types/dataBase'

export interface equipDailyPopupParamType {
  dailyCheckId: stringNull
}

export interface equipDailyType extends dataBaseType {
  dailyCheckId?: stringNull // 열화점검 일련 번호
  plantCd?: stringNull // 사업장 코드
  checkStatusCd?: stringNull // 계획수립/점검중/점검완료
  lineId?: stringNull
  processCd?: stringNull // 라인일련번호
  processName?: stringNull
  checkDeptCd?: stringNull // 점검부서
  checkUserId?: stringNull // 점검자 ID
  checkDate?: stringNull // 점검월
  dailyName?: stringNull // 점검명
  evaluationCompleteFlag: stringNull // 결재완료 후 평가완료 처리
  utilityFlag: stringNull
  dailyResultModelList?: Array<equipDailyResultType> | null
  dailyImproveModelList?: Array<equipDailyImproveType> | null
}

export interface equipDailyResultType extends dataBaseType {
  minEquipmentCheckId: stringNull // 설비점검 일련 번호
  minEquipmentTypeCheckItemId: stringNull // 선택 및 추가한 항목의 일련번호 생성
  checkItemName?: stringNull // 검사항목 명
  checkWayName?: stringNull // 검사방법 명
  checkResult?: stringNull // 점검 결과
  judgmentResultTypeCd?: stringNull // 적합/부적합
  decisionBasis?: stringNull // 판정기준
  checkCaution?: stringNull // 점검시 안전사항
}

export interface equipDailyImproveType extends dataBaseType {
  minEquipmentCheckId: stringNull // 설비점검 일련 번호
  minEquipmentTypeCheckItemId: stringNull // 선택 및 추가한 항목의 일련번호 생성
  checkItemName?: stringNull // 검사항목 명
  checkWayName?: stringNull // 검사방법 명
  checkResult?: stringNull // 점검 결과
  judgmentResultTypeCd?: stringNull // 적합/부적합
  decisionBasis?: stringNull // 판정기준
  checkCaution?: stringNull // 점검시 안전사항
}

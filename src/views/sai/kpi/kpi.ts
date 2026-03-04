import { dataBaseType } from '@/types/dataBase'

export interface kpiType extends dataBaseType {
  saiKpiId: stringNull
  year: stringNull
  results: Array<resultType> | null
  delResults: Array<resultType> | null
}

export interface resultType extends dataBaseType {
  saiKpiId: stringNull
  saiKpiResultId: stringNull
  month1?: numberNull // 1월 실적
  month2?: numberNull // 2월 실적
  month3?: numberNull // 3월 실적
  month4?: numberNull // 4월 실적
  month5?: numberNull // 5월 실적
  month6?: numberNull // 6월 실적
  month7?: numberNull // 7월 실적
  month8?: numberNull // 8월 실적
  month9?: numberNull // 9월 실적
  month10?: numberNull // 10월 실적
  month11?: numberNull // 11월 실적
  month12?: numberNull // 12월 실적
  kpi?: stringNull
  definition?: stringNull
  deptCd?: stringNull // 대상부서
  managerId?: stringNull // 담당자
  budget?: numberNull
  remark?: stringNull
  sortOrder?: numberNull
}

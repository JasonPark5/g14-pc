import { dataBaseType } from '@/types/dataBase'

export interface uninjuryType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  uninjuryYear?: stringNull // 무사고 년도
  standardDate?: stringNull // 인원기준일
  avgCnt?: numberNull // 기준일기준 부서평균인원(가중인원대상부서)
  deptUninjurys?: Array<deptUninjuryType> // 부서별 무재해현황
}

export interface deptUninjuryType extends dataBaseType {
  plantCd?: stringNull // 사업장코드
  saiDeptUninjuryId?: stringNull // 무재해현황 일련번호
  deptCd?: stringNull // 부서
  deptName?: stringNull
  startDt?: stringNull // 무재해 시작일
  targetDt?: stringNull // 무재해 목표달성 예정일
  endFlag?: stringNull // 종료여부
  endReasonCd?: stringNull // 종료사유 코드
  endDt?: stringNull // 종료일
  endFlagName?: stringNull
  increaseFlag?: stringNull
  standardDay?: numberNull | string // 기준일
  multipleCnt?: numberNull | string // 배수
  targetDay?: numberNull | string // 목표일수
  targetExpectedDt?: string // 달성예정일
  recentAccidentDt?: stringNull // 최근사고일
  attainDay?: numberNull | string // 현재달성일수
  recentAccidentUserName?: stringNull // 최근사고자
  remark?: stringNull
  paymentFlag?: stringNull
  history?: object | null
}

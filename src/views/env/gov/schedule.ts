import { dataBaseType } from '@/types/dataBase'

export interface govScheduleType extends dataBaseType {
  govScheduleMstId?: stringNull // 대관업무 마스터 일련번호
  govScheduleTypeCd?: stringNull // 대관업무구분
  plantCd?: stringNull // 사업장코드
  govScheduleName?: stringNull // 대관업무명
  govScheduleCycleCd?: stringNull // 법정 주기
  govScheduleCycleTerm?: stringNull
  remarks?: stringNull // 내용
  useFlag?: stringNull // 사용여부
  inspType?: stringNull // 검사-종류
  relatedLawsCd?: stringNull // 검사-관련법규
  inspTarget?: stringNull // 검사-대상 시설
  contStatus?: stringNull // 계약-상태
  contType?: stringNull // 계약-구분
  contVendor?: stringNull // 계약-업체
  users?: Array<any>
  deleteUsers?: Array<any>
  govScheduleTypeName?: stringNull
}

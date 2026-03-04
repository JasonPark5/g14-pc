import { dataBaseType } from '@/types/dataBase'

export interface preStartupCheckType extends dataBaseType {
  sopPrestartupCheckId?: stringNull // 가동전점검 일련 번호
  plantCd?: stringNull // 사업장코드
  plantName?: stringNull // 사업장코드
  checkName?: stringNull // 점검명
  prestartupPeriod?: Array<string> // 기간
  prestartupStartDate?: stringNull
  prestartupEndDate?: stringNull
  checkPurpose?: stringNull // 점검 목적
  psrEquipmentStatusCd?: stringNull // 설비 상태
  psrEquipmentStatusName?: stringNull // 설비 상태
  checkDeptCd?: stringNull // 점검부서
  checkDeptCdName?: stringNull // 점검부서
  sopMocId?: stringNull // MOC 일련번호
  checkCancarrierId?: stringNull // 점검 책임자
  checkResultTotal?: stringNull // 점검결과 종합
  psrCheckStatusCd?: stringNull // 진행 단계
  psrCheckStatusName?: stringNull // 진행 단계
  psrCheckPeriodCd?: stringNull
  psrCheckPeriodName?: stringNull
  equipments?: Array<equipmentsType>
  deleteEquipments?: Array<equipmentsType>
}

export interface equipmentsType extends dataBaseType {
  name?: stringNull
  label?: stringNull
  icon?: stringNull
  sopPrestartupCheckId?: stringNull // 가동전점검 일련 번호
  component?: any
  equipmentCd?: stringNull // 설비코드
  equipmentName?: stringNull // 설비명
  equipmentTypeCd?: stringNull // 설비 분류(상하위구조)
  equipmentTypeName?: stringNull // 설비 분류명(상하위구조)
  checkUserId?: stringNull // 점검 책임자
  checkScheduleDate?: stringNull // 점검 예정일
  checkDate?: stringNull // 점검일
  checkResultTotal?: stringNull // 점검 결과 종합
  checkCompleteFlag?: stringNull // 점검 완료 여부
  checkTypes: Array<any> // 점검유형
  checkItems: Array<any> // 점검항목
  deleteCheckItems: Array<any> // 점검항목
}

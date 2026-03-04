import { dataBaseType } from '@/types/dataBase'

export interface sopType extends dataBaseType {
  mdmSopId: stringNull // 안전작업 표준 일련번호
  plantCd: stringNull // 사업장코드
  subProcessCd: stringNull // 단위공정 코드
  sopNo: stringNull // 안전작업 표준 번호
  sopName: stringNull // 세부공정(작업) 명
  revNo: stringNull // 개정번호
  revReason: stringNull // 개정사유
  applyRange: stringNull // 적용범위
  purpose: stringNull // 목적
  hazardGradeCd: stringNull // 위험등급 1 ~ 5등급
  ramRiskHazardTechniqueCd: stringNull
  workTypeCd: stringNull // 작업유형 : 특별안전, 일반안전, 단순일상
  workKindCd: stringNull // 작업형태 : Gas, 고소, 굴착/매설, 방사선, 전기, 지게차, 기타
  workClassCd: stringNull // 작업구분 : Set-up, PM, BM, Part교체, 기타
  workerName: stringNull // 작업자
  managementDepts: stringNull // 관리부서 복수
  managementDepts2: stringNull // 관리부서 복수
  saftyShied: stringNull // 안전보호구
  saftyCaution: stringNull // 안전주의사항
  sopMocId: stringNull
  useFlag: stringNull // 사용여부
  revisionNum: stringNull
  groupId: stringNull
  sysRevision: numberNull
  revisionContent: stringNull
  regDtStr: stringNull
  regUserName: stringNull
  regUserId: stringNull
  chgUserId: stringNull
  revSelectValue: stringNull
  sopSteps: Array<any> // 작업단계 목록
  revs: Array<any> // 개정 목록
  mmEquips: Array<any> // 설비 목록
  mmMachines: Array<any> // 기계기구 목록
  chems: Array<any> // 화학자재 목록
  sopSummary: Array<any> // 요약정보
  sopStepHazards?: Array<any> // 작업단계 (w/h. 유해위험요인)
}

export interface sopStepType extends dataBaseType {
  jobStepId: stringNull // 작업단계일련번호
  mdmSopId: stringNull // 안전작업 표준 일련번호
  jobStepNo: stringNull // 작업단계 번호
  jobStepName: stringNull // 작업단계 명
  jobStepDesc: stringNull // 작업단계 설명
  saftyWorkMethod: stringNull // 안전작업방법(주의사항)
  saftyShied: stringNull // 안전보호구 수기 입력
  useTool: stringNull // 사용공구
  caution: stringNull // 주의사항
  useFlag: 'Y' // 사용여부
  regUserId: stringNull // 등록자 ID
  chgUserId: stringNull // 등록자 ID
  editFlag: stringNull
  sopHazards: Array<any>
  deleteSopHazards: Array<any>
  sopHazardFactors: Array<any>
  show: boolean
}

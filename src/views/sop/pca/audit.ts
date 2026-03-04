import { dataBaseType } from '@/types/dataBase'

export interface auditType extends dataBaseType {
  selfInspectionResultId?: stringNull // 자체감사 계획 일련번호
  selfInspectionStatusCd?: stringNull // 감사진행상태-계획중,계획완료,감사완료
  selfInspectionTitle?: stringNull // 감사명
  selfInspectionYear?: stringNull // 감사년도
  selfInspectionTypeCd?: stringNull // 감사종류
  plantCd?: stringNull // 해당사업장
  remark?: stringNull // 감사대상 개요
  selfInspectionStartDt?: stringNull // 감사기간-시작일
  selfInspectionEndDt?: stringNull // 감사기간-종료일
  selfInspectionResultOpinion?: stringNull // 감사원소견
  selfInspectionResultTotalOpinion?: stringNull // 감사 결과 종합의견
  selfInspectionResultCorrect?: stringNull // 시정 및 권고 요약
  selfInspectionDt?: Array<string>
  sysRevision?: stringNull // 평가항목 개정번호
  isSave?: boolean
  upProcesses?: Array<processType>
  equips?: Array<equipType>
  detps?: Array<deptType>
}

export interface processType extends dataBaseType {
  selfInspectionResultId?: stringNull // 자체감사 계획 일련번호
  processCd?: stringNull // 대상공정코드
}
export interface equipType extends dataBaseType {
  selfInspectionResultId?: stringNull // 자체감사 계획 일련번호
  equipmentCd?: stringNull // 설비코드
}
export interface deptType extends dataBaseType {
  selfInspectionResultId?: stringNull // 자체감사 계획 일련번호
  deptCd?: stringNull // 부서코드
}

export interface revisionType extends dataBaseType {
  sysRevision?: stringNull
  revisionNum?: stringNull
  revisionDt?: stringNull
  revisionContent?: stringNull
  regUserId?: stringNull
}

export interface itemType extends dataBaseType {
  selfInspectionItemMstId?: stringNull // 자체감사 평가항목 일련번호
  selfInspectionItemTypeId?: stringNull // 자체감사 평가항목별 구분 일련번호
  selfInspectionItemTypeItemId?: stringNull // 자체감사 감사항목 일련번호
  itemTypeName?: stringNull // 자체감사 평가항목별 구분명
  sortOrder?: numberNull // 순번
  delFlag?: stringNull // 삭제여부
}

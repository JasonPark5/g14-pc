import { dataBaseType } from '@/types/dataBase'

export interface complianceEvalTablePopupType {
  saiComplianceEvalTableId: stringNull
  lawRegisterItemTypeCd: stringNull
  isApprContent?: boolean
}

export interface complianceEvalTableResearchType {
  impr: stringNull
  item: stringNull
}

export interface complianceEvalTableType extends dataBaseType {
  saiComplianceEvalTableId: stringNull // 법규등록부 및 준수평가표 일련번호
  requirementName: stringNull // 법규/기타 요건명
  complianceEvalTypeCd: stringNull // 평가구분
  lawRegisterItemTypeCd: stringNull // 환경안전기타구분 업무구분
  lawRegisterItemTypeName: stringNull // 환경안전기타구분 업무구분
  halfCd?: stringNull // 상/하반기
  halfName?: stringNull // 상/하반기
  remark?: stringNull // 비고
  evalYear: stringNull // 평가년도
  reviewUserId: stringNull // 검토자ID
  approvalUserId: stringNull // 승인자ID
  plantCd: stringNull // 사업장
  targetDeptCd: stringNull // 평가부서
  targetDeptName: stringNull // 평가부서
  saiComplianceEvalTableStepCd: stringNull // 진행상태
  startDt: stringNull // 평가시작일
  endDt: stringNull // 평가종료일
  compliances: Array<complianceEvalTableResultType>
  deleteCompliances: Array<complianceEvalTableResultType>
  compliancesTypes: Array<complianceTypesType>
}

export interface complianceEvalTableResultType extends dataBaseType {
  saiComplianceEvalTableResultId: stringNull // 법규등록부 및 준수평가표 결과 일련번호
  saiComplianceEvalTableId: stringNull // 법규등록부 및 준수평가표 일련번호
  saiLawRegisterMasterItemId: stringNull // 법규등록부 항목 일련번호
  saiLawRegisterMasterId: stringNull // 법규등록부 구분 일련번호
  lawId: stringNull // 법령
  lawName: stringNull // 법령
  gubunName: stringNull // 구분
  itemName: stringNull // 항목
  relevantClause: stringNull // 관련조항
  requirements: stringNull // 요구사항
  applyConstruction: stringNull // 공사 적용사항
  target: stringNull // 적용대상
  relatedDocument: stringNull // 관련문서(기록)
  saiComplianceResultCd: stringNull // 준수평가결과
  remark: stringNull // 비고
  lawRecentInfo?: stringNull // 법령 최신 개정 정보
}

export interface complianceTypesType {
  lawId: stringNull
  lawName: stringNull
  selected: boolean
}

import { dataBaseType } from '@/types/dataBase'

export interface variableType extends dataBaseType {
  ramVariableId?: stringNull // 변수 번호
  plantCd?: stringNull
  variableName?: stringNull // 변수명
  useFlag?: stringNull // 사용여부
  sortOrder?: numberNull // 순번
  variableGuidewords?: Array<variableGuideWordType> | null | undefined // 사용 가이드워드 목록
  deleteVariableGuidewords?: Array<variableGuideWordType> | null | undefined // [삭제] 사용 가이드워드 목록
}

export interface variableGuideWordType extends dataBaseType {
  causeName?: stringNull
  ramVariableGuidewordCd?: stringNull
  ramVariableGuidewordId?: stringNull
  ramVariableId?: stringNull
}

export interface hazopNodeType {
  ramAssessNodeId?: stringNull // 노드 일련번호
  ramRiskAssessmentPlanId?: stringNull // 평가 일련번호
  ramTechniqueCd?: stringNull // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
  processCd?: stringNull // 단위공정 코드
  psiDiagramId?: stringNull // 도면 일련번호
  nodeNo?: stringNull // 노드 번호_수기입력
  nodeTitle?: stringNull // 노드 타이틀
  nodeDesc?: stringNull // 노드 설명
  designConditions?: stringNull // 설계조건
  operatingConditions?: stringNull // 작동조건
  designIntent?: stringNull // 설계의도
  startStudyDate?: stringNull // 검토 시작일
  endStudyDate?: stringNull // 검토 종료일
  scenarios: Array<any> | null | undefined
}

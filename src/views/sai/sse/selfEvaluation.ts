import { dataBaseType } from '@/types/dataBase'

export interface selfEvaluationType extends dataBaseType {
  saiSelfEvaluationId: stringNull // 중대재해처벌법 자율점검 일련번호
  plantCd: stringNull // 사업장 코드
  plantName?: stringNull // 사업장
  evaluationName: stringNull // 자율점검명
  evaluationPeriod?: stringNull // 자율점검 기간
  evaluationPeriodArray?: Array<stringNull> // 자율점검 기간
  evaluationStartDate: stringNull // 자율점검 시작일
  evaluationEndDate: stringNull // 자율점검 종료일
  managerId: stringNull // 담당자
  managerName?: stringNull // 담당자
  results?: Array<selfEvaluationTableResultType> // 점검결과
  deleteResults?: Array<selfEvaluationTableResultType> // 점검결과
}

export interface selfEvaluationTableResultType extends dataBaseType {
  saiSelfEvaluationTableResultId: stringNull // 중대재해처벌법 자율점검표 결과 일련번호
  saiSelfEvaluationId: stringNull // 중대재해처벌법 자율점검 일련번호
  saiSelfEvaluationTableItemId?: stringNull // 중대재해처벌법 자율점검표 항목 일련번호
  selfEvaluationClassCd?: stringNull // 핵심요소 구분
  selfEvaluationClassName?: stringNull // 핵심요소 구분
  selfEvaluationTableItemName?: stringNull // 중대재해처벌법 자율점검표 항목명
  selfEvaluationTableResultCd?: stringNull // 중대재해처벌법 자율점검 결과
  selfEvaluationTableResultName?: stringNull // 중대재해처벌법 자율점검 결과
  remarks?: stringNull // 비고
}

export interface sapaInspectionType extends dataBaseType {
  saiSapaEsCheckId: stringNull // 반기점검 번호
  plantCd?: stringNull // 사업장
  deptCd?: stringNull
  completeFlag?: stringNull
  checkTitle?: stringNull // 점검명
  checkDate?: stringNull // 점검일시
  checkYear?: stringNull // 점검년도
  checkSemiAnnualCd?: stringNull // 상반기/하반기
  checkDeptCd?: stringNull // 점검부서
  checkUserId?: stringNull // 점검자
  checkMethod?: stringNull // 점검방법
  results?: Array<sapaInspectionResultType> // 점검결과 목록
  delResults?: Array<sapaInspectionResultType> // 삭제용 결과 목록
}

export interface sapaInspectionResultType extends dataBaseType {
  saiSapaEsCheckId?: stringNull // 반기점검 번호
  saiSapaEsResultId: stringNull // 반기점검 결과 번호
  saiSapaEsMstId?: stringNull // 마스터id
  requirement?: stringNull // 법적 요구사항
  details?: stringNull // 상세
  relatedLaw?: stringNull // 관련법령
  cycle?: numberNull // 점검주기
  level?: numberNull
  groupId?: stringNull // 부모 id
  action?: stringNull // 활동사항
  actionCycle?: numberNull // 이행주기
  docu?: stringNull // 관련자료
  sortOrder?: numberNull // 정렬순서
  remark?: stringNull // 비고
  attrVal1?: stringNull
  attrVal2?: stringNull
  attrVal3?: stringNull
  checkResultCd?: stringNull // 점검결과(적정/부적정/해당없음)
}

export interface inspectionType extends dataBaseType {
  sdpSemiCheckId?: stringNull // 반기점검 번호
  plantCd?: stringNull // 사업장
  deptCd?: stringNull // 점검부서
  deptName?: stringNull
  checkTitle?: stringNull // 점검명
  checkYear?: stringNull // 점검년도
  checkSemiAnnualCd?: stringNull // 상반기/하반기
  checkDate?: stringNull // 점검일시
  checkUserId?: stringNull // 점검자
  checkMethod?: stringNull // 점검방법
  checkFinishFlag?: stringNull // 작성종료여부
  parentResults?: Array<parentType> // 상위 점검 목록
  delParentResults?: Array<parentType>
  subResults?: resultType[] // 상위 점검 목록
  delSubResults?: resultType[]
}

export interface parentType extends dataBaseType {
  sdpSemiCheckItemId: stringNull // 점검항목 id
  parentItemId: stringNull // 점검명(상위 id)
  checkContent: stringNull // 점검 내용
  sortOrder: numberNull // 정렬순서
  subResults?: resultType[] // 하위 점검 목록
  delSubResults?: resultType[]
}

export interface resultType extends dataBaseType {
  sdpSemiCheckId: stringNull // 반기점검 번호
  sdpSemiCheckResultId: stringNull // 반기점검 결과 번호
  parentItemId: stringNull // 상위 id
  checkResultCd: stringNull // 점검결과(적정/부적정/해당없음)
  checkContent: stringNull // 점검내용
  sortOrder: numberNull // 정렬순서
  remark: stringNull // 비고
  editYn?: stringNull // 수정여부
}

export interface selfEvaluationTableItemType extends dataBaseType {
  saiSelfEvaluationTableItemId: stringNull // 중대재해처벌법 자율점검표 항목 일련번호
  plantCd: stringNull // 사업장 코드
  selfEvaluationClassCd: stringNull // 핵심요소 구분
  selfEvaluationTableItemName: stringNull // 중대재해처벌법 자율점검표 항목명
  useFlag: stringNull // 사용여부
  sortOrder: numberNull // 정렬순서
}

export interface supervisorInspectionType extends dataBaseType {
  saiSuperEvaluationId: stringNull // 관리감독자 일련번호
  checkName?: stringNull // 평가명
  checkYear?: stringNull
  checkDate?: stringNull // 평가일
  evaluatorId?: stringNull // 평가자
  evaluateeId?: stringNull // 평가 대상자
  evaluateeName?: stringNull // 평가 대상자 이름
  evaluateeDept?: stringNull
  evaluator1?: stringNull // 1차 평가자
  evaluator2?: stringNull // 2차 평가자
  checkSemiAnnualCd?: stringNull // 상/하반기
  completeFlag?: stringNull // 진행상태
  typeCd?: stringNull
  remark?: stringNull
  results?: Array<supervisorInspectioResultType> // 관리감독자 평가 결과 목록
  deleteResults?: Array<supervisorInspectioResultType>
}
export interface supervisorInspectioResultType extends dataBaseType {
  saiSuperEvaluationId?: stringNull // 관리감독자일련 번호
  saiSuperEvaluationResultId: stringNull // 관리감독자 결과 번호
  saiSuperEvaluationMstId?: stringNull // 관리자 평가 마스터 정보 일련 번호
  rating1?: numberNull // 평점 1
  rating2?: numberNull // 평점 2
  rating3?: numberNull // 평점 3
  details?: stringNull // 평가항목
  evaluationStandard?: stringNull // 평가기준
  score?: numberNull // 배점
  check11?: stringNull // 양호
  check12?: stringNull // 보통
  check13?: stringNull // 미흡
  check21?: stringNull // 양호
  check22?: stringNull // 보통
  check23?: stringNull // 미흡
  check31?: stringNull // 양호
  check32?: stringNull // 보통
  check33?: stringNull // 미흡
  editYn?: stringNull // 수정여부
  sortOrder?: stringNull
}

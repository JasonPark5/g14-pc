import { dataBaseType } from '@/types/dataBase'

export interface brainSurveyType extends dataBaseType {
  heaBrainCardiovascularSurveyId?: stringNull // 뇌심혈관계 종합조사표 일련번호
  heaBrainCardiovascularStepCd?: stringNull // 진행상태
  userId?: stringNull // 근로자ID
  userName?: stringNull // 근로자명
  deptCd?: stringNull // 부서코드
  deptName?: stringNull // 부서명
  age?: numberNull // 나이
  sexCd?: stringNull // 성별
  sexName?: stringNull // 성별
  birthDate?: stringNull // 생년월일
  surveyDate?: stringNull // 평가일
  waistCircumference?: stringNull // 위험도_허리둘레
  bmi?: stringNull // 위험도_체질량 지수
  bloodPressure?: stringNull // 위험도_혈압
  hypertensionMedication?: stringNull // 위험도_고혈압 약 복용
  fastingBloodSugar?: stringNull // 위험도_공복 혈당
  diabetesMedication?: stringNull // 위험도_당뇨병 약 복용
  totalCholesterol?: stringNull // 위험도_총콜레스테롤
  egfr?: stringNull // 위험도_eGFR
  dipstickProteinuria?: stringNull // 위험도_Dipstick proteinuria 단백뇨
  smoking?: stringNull // 위험도_흡연상태
  physicallyActiveStatus?: stringNull // 위험도_신체 활동 여부
  results?: Array<any> // 유해요인 평가결과 목록
  riskAssessment?: ramType
  suitEval?: evalType
}

export interface ramType extends dataBaseType {
  heaBrainCardiovascularRiskAssessmentId?: stringNull // 뇌심혈관계 위험평가 일련번호
  heaBrainCardiovascularSurveyId?: stringNull // 뇌심혈관계 일련번호
  adjustedCompositeRelativeRisk?: stringNull // 조정 복합 상대위험도
  riskDevelopDisease?: stringNull // 발병위험도(10년)
  avgRiskDevelopDisease?: stringNull // 평균발병위험도(10년)
  riskOrthodonticDevelopment?: stringNull // 교정발병위험도(10년)
  reducedRiskDevelopDisease?: stringNull // 발병위험도 감소치
  cardiovascularAge?: stringNull // 심뇌혈관 나이
  correctedCardiovascularAge?: stringNull // 교정 심뇌혈관 나이
  integratedRiskClassificationCriteria?: stringNull // 통합형 위험도 분류기준
  /** 기타 정보 */
  complexRelativeRisk?: stringNull // 개인별 복합 상대위험도
  correctionCompositeRelativeRisk?: stringNull // 개인별 교정 복합 상대위험도
}

export interface evalType extends dataBaseType {
  heaBrainCardiovascularWorkSuitEvalId?: stringNull // 뇌심혈관계 업무적합성 일련번호
  heaBrainCardiovascularSurveyId?: stringNull // 뇌심혈관계 일련번호
  userId?: stringNull // 근로자ID (종합조사표 값)
  userName?: stringNull // 근로자명 (종합조사표 값)
  deptCd?: stringNull // 부서코드 (종합조사표 값)
  deptName?: stringNull // 부서명 (종합조사표 값)
  tasksPerformed?: stringNull // 수행업무
  diseaseReview?: stringNull // 임상증상 / 동반질환 검토의견
  habitsReview?: stringNull // 생활습관 / 검사항목 검토의견
  businessFactorsReview?: stringNull // 업무적요인 검토의견
  generalOpinionCd?: stringNull // 종합의견 - 결과
  generalOpinion?: stringNull // 종합의견 - 적합 이외인 경우 기술
  heaManagerId?: stringNull // 보건담당자 OR 의사
}

export interface resultType extends dataBaseType {
  heaBrainCardiovascularEvalResultId?: stringNull // 뇌심혈관계 평가결과 일련번호
  heaBrainCardiovascularSurveyId?: stringNull // 뇌심혈관계 일련번호
  heaBrainCardiovascularEvalItemId?: stringNull // 뇌심혈관계 평가항목 일련번호
  workSuitEvalItemClassCd?: stringNull // 위험요인 구분코드
  workSuitEvalItemClassName?: stringNull // 위험요인 구분코드
  riskFactors?: stringNull // 위험요인
  riskFactorsResult?: stringNull // 위험요인 평가결과(현재상태)
  riskFactorsGoalResult?: stringNull // 목표상태
  healthConditionCd?: stringNull // 건강신호등
}

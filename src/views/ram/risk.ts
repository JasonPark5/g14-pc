import { dataBaseType } from '@/types/dataBase'

export interface riskListType extends dataBaseType {
  plantCd: stringNull // 사업장
  plantName: stringNull // 사업장
  assessmentName: stringNull // 평가명
  ramStepName: stringNull // 진행단계
  assessmentDate: stringNull // 평가기간
  ramAssessTypeName: stringNull // 평가구분
  regUserName: stringNull // 작성자
  reviewUserName: stringNull // 검토자
  approvalUserName: stringNull // 승인자
  ramRiskAssessmentPlanId: stringNull
  ramStepCd: stringNull
  vendorFlag: stringNull
}

export interface assessPlanType extends dataBaseType {
  ramRiskAssessmentPlanId?: stringNull // 평가 일련번호
  plantCd?: stringNull // 사업장 코드
  plantName?: stringNull // 사업장 명
  ramTechniqueCd?: stringNull // 평가기법 코드_HAZOP/4m/JSA/CHECKLIST
  ramAssessTypeCd?: stringNull // 평가구분_최초/정기/수시
  ramAssessTypeName?: stringNull // 평가구분_최초/정기/수시
  assessmentName?: stringNull // 평가명
  assessmentStartDate?: stringNull // 평가시작일
  assessmentEndDate?: stringNull // 평가종료일
  assessmentPeriod: Array<any>
  assessmentYear?: stringNull // 평가년도
  ramStepCd?: stringNull // 평가 진행단계 코드
  assessmentManageDeptCd?: stringNull // 평가주관 부서 코드
  assessmentManageUserId?: stringNull // 평가주관 담당자 ID
  ramMatrixId?: stringNull // 위험메트릭스 번호
  matrixName?: stringNull
  sopMocId?: stringNull // MOC 일련번호
  remark?: stringNull // 상세내용
  workArea?: stringNull // 작업지역
  regUserName?: stringNull // 작성자 ID
  regUserDeptName?: stringNull
  regDtStr?: stringNull
  regDt?: stringNull
  reviewUserId?: stringNull // 검토자 ID
  reviewDate?: stringNull // 검토일
  approvalUserId?: stringNull // 승인자 ID
  approvalDate?: stringNull // 승인일
  vendorCd?: stringNull
  sopConstructionId?: stringNull
  teams: Array<any> // 평가팀 목록
  delTeams: Array<any>
  occasions: Array<any> // 수시 변경/추가 내역 목록
  conferences: Array<any> // 회의 목록
  relatedDocuments: Array<any> // 관련자료 목록
  processes: Array<any> // 대상공정 목록
}

export interface processDataType extends dataBaseType {
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  estimationReCheckedCnt?: numberNull
  processCd: stringNull // 단위공정 코드
  processName: stringNull // 단위공정명
  ramProcessAssessStepCd: stringNull // 평가진행상태
  processExplainFeature: stringNull // 공정 특징 설명
  assessDeptCd: stringNull // 평가 부서 코드
  assessUserId: stringNull // 평가 담당자
  assessUserName: stringNull // 평가 담당자
  workCycleCd: stringNull // 작업발생주기코드
  workingTime: numberNull // 작업시간(1회)
  vendorFlag: numberNull
  temperature: stringNull
  estimationFlag?: stringNull // CHARM 추정 완료여부
  workCycleName?: stringNull
  workMeasurementPlanId: stringNull
  measPlanContent: stringNull
  equipments: Array<any>
  sops: Array<any>
  jobs: Array<any>
  drawNodes: Array<any>
  draws: Array<any>
  fmScenarios: Array<scenariosType>
  hazopScenarios: Array<scenariosType>
  scenarios: Array<any>
  charmResultScenarios: Array<any>
  charmEstimationScenarios: Array<any>
  targets: Array<any>
  thirdScenarios: Array<any>
  reCheckedCnt?: numberNull
  selected?: boolean | null | undefined
  check?: stringNull
  plantCd?: stringNull
  ramMatrixId?: stringNull
  resultReCheckedCnt?: numberNull
}
export interface jobDataType extends dataBaseType {
  show: boolean
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  processCd: stringNull // 단위공정 코드
  processName: stringNull // 단위공정
  mdmSopId: stringNull // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  jobName: stringNull // 안전작업 명
  fmScenarios?: Array<scenariosType>
}
export interface scenariosType extends dataBaseType {
  ramCharmResultAssessScenarioId?: stringNull
  beforeFrequency?: stringNull | numberNull
  beforeStrength?: stringNull | numberNull
  beforeRisk?: stringNull | numberNull
  beforeRamMatrixRiskId?: stringNull | numberNull
  afterFrequency?: stringNull | numberNull
  afterStrength?: stringNull | numberNull
  afterRisk?: stringNull | numberNull
  afterRamMatrixRiskId?: stringNull | numberNull
  improveFlag?: stringNull | numberNull
  addingRiskManagementActivities?: stringNull | numberNull
  mdmSopId?: stringNull
  ramRiskHazardId?: stringNull
  ram4mAssessScenarioId?: stringNull
  ramRiskAssessmentPlanId?: stringNull
  processCd?: stringNull
  processName?: stringNull
  ramTechniqueCd?: stringNull
  groupMdmSopId?: stringNull
  jobName?: stringNull
  riskHazardName?: stringNull
  ram4mRiskHazardClassCd?: stringNull
  ram4mRiskHazardClassName?: stringNull
  damageTargetName?: stringNull
  damageTypeName?: stringNull
}

export interface sopDataType extends dataBaseType {
  ram4mAssessScenarioId?: stringNull // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  processCd: stringNull // 단위공정 코드
  processName?: stringNull
  groupMdmSopId: stringNull // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  mdmSopId: stringNull // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  jobName: stringNull // 안전작업 명
  ramRiskHazardId: stringNull // 유해위험요인 번호
  riskHazardName: stringNull // 유해위험요인명
  ram4mRiskHazardClassCd?: stringNull // 4M 분류 코드
  ram4mRiskHazardClassName?: stringNull // 4M 분류
  damageTargetName?: stringNull // 피해대상(key-in)
  damageTypeName?: stringNull // 재해형태(key-in)
  ramJsaAssessJobId?: stringNull
  sopFlag?: stringNull
  groupJobStepId?: stringNull
  jobStepId?: stringNull
  jobStepNo?: stringNull | numberNull
  jobStepName?: stringNull
  jobStepDesc?: stringNull
  riskHazardNameClass?: stringNull
  jobEditFlag?: stringNull
  scenarioEditFlag?: stringNull
}

export interface scenarioType extends dataBaseType {
  ramCharmResultAssessScenarioId?: stringNull
  mdmChemMaterialId?: stringNull
  addingRiskManagementActivies?: stringNull
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  ramChecklistAssessScenarioId?: stringNull
  ramCharmEstimationAssessScenarioId?: stringNull
  materialName?: stringNull
  chemName?: stringNull
  casNo?: stringNull
  ramJsaAssessScenarioId?: stringNull
  ramJsaAssessJobId?: stringNull
  exposureLevelFinal?: stringNull
  sopFlag?: stringNull
  ram4mAssessScenarioId?: stringNull // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramThirdAssessScenarioId?: stringNull
  ramKrasAssessScenarioId?: stringNull
  ramRiskHazardClassCd?: stringNull
  riskOccurrenceCause?: stringNull
  riskOccurrenceResult?: stringNull
  ramCheckItemClassName?: stringNull
  checkItemName?: stringNull
  ramInspectResultCd?: stringNull
  processCd: stringNull // 단위공정 코드
  processName: stringNull // 단위공정
  mdmSopId?: stringNull // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  jobName?: stringNull // 안전작업 명
  ramRiskHazardId?: stringNull // 유해위험요인 번호
  riskHazardName?: stringNull // 유해위험요인명
  ram4mRiskHazardClassCd?: null // 4M 분류 코드
  ramOccurrClassCd?: stringNull // 발생구분
  damageTargetName?: stringNull // 피해대상(key-in)
  damageTypeName?: stringNull // 재해형태(key-in)
  improveFlag?: stringNull // 개선여부
  ramRiskHazardClassName?: stringNull
  existingRiskManagementActivities?: stringNull // 현재안전조치
  addingRiskManagementActivities?: stringNull // 추가 리스크 관리활동
  beforeRamMatrixRiskId?: stringNull // 전 위험도 no
  afterRamMatrixRiskId?: stringNull // 후 위험도 no
  assessDate?: stringNull // 평가일
  assessUserId?: stringNull // 평가자 ID
  assessUserName?: stringNull // 평가자명
  vendorFlag?: stringNull // 업체 작성 여부
  imprs?: Array<any> // 개선목록
  ram4mRiskHazardClassName?: stringNull
  ramMatrixId?: stringNull
  beforeFrequency?: stringNull | numberNull
  beforeStrength?: stringNull | numberNull
  beforeRisk?: stringNull | numberNull
  riskbookFlag?: stringNull
  afterFrequency?: stringNull | numberNull
  afterStrength?: stringNull | numberNull
  afterRisk?: stringNull | numberNull
  riskHazardQuestionName?: stringNull
  improvementMeasures?: stringNull
  ramRiskThirdStandardId?: stringNull
  currentSafetyMeasures?: stringNull
  relationLaw?: stringNull
  riskHazardNameClass?: stringNull
  checklistQuestion?: stringNull
  jobStepId?: stringNull
  jobStepNo?: stringNull
  jobStepName?: stringNull
  jobStepDesc?: stringNull
  compareId?: stringNull
  recheckFlag?: stringNull
  riskEstimation?: stringNull
  customCol?: stringNull
  beforeExposureLevelFinal?: stringNull
  beforeToxic?: stringNull
  beforeRiskEstimation?: stringNull
  afterExposureLevelFinal?: stringNull
  afterToxic?: stringNull
  afterRiskEstimation?: stringNull
  dailyVolume?: stringNull | numberNull
  toxic?: stringNull
  suspectUserFlag?: stringNull
  workMeasure?: stringNull // 작업환경측정
  measValue?: stringNull // 측정치(A)
  exposureStandard?: stringNull // 노출기준(B)
  exposureMeasValue?: stringNull //A/B(%)
  daily?: stringNull // 하루 취급량, 비산성/휘발성, 밀폐·환기상태
  limitRepval?: stringNull // 함유량
  volumeUnit?: stringNull
  volumeUnitName?: stringNull // 단위
  dailyLevel?: stringNull // 일취급 수준
  maleficenceType?: stringNull //발생형태
  maleficenceGrade?: stringNull //비산성
  boilingPoint?: stringNull //끓는점
  volatilityGrade?: stringNull
  volatilityGradeName?: stringNull // 휘발성
  exposureLevelCombination?: stringNull //노출수준
  closedVentilation?: stringNull // 밀폐·환기상태
  cmrFlag?: stringNull // CMR여부
  measureCheck?: stringNull // 노출기준확인
  maleficenceForm?: stringNull //발생형태
  maleficenceValue?: stringNull // 측정값
  hrCodeGrade?: stringNull // 위험문구/유해·위험문구
  exposureCheck?: stringNull
  harmfulCheck?: stringNull
}

export interface drawNodeType extends dataBaseType {
  ramAssessNodeId: stringNull // 노드 일련번호
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  ramTechniqueCd: stringNull // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
  processCd: stringNull // 단위공정 코드
  processName: stringNull // 단위공정명
  groupPsiDiagramId: stringNull // 도면 일련번호
  psiDiagramId: stringNull // 도면 일련번호
  diagramNo: stringNull // 도면번호
  diagramTitle: stringNull // 도면명
  nodeNo: stringNull // 노드 번호_수기입력
  nodeTitle: stringNull // 노드 타이틀
  nodeDesc: stringNull // 노드 설명
  designConditions: stringNull // 설계조건
  operatingConditions: stringNull // 작동조건
  designIntent: stringNull // 설계의도
  startStudyDate: stringNull // 검토 시작일
  endStudyDate: stringNull // 검토 종료일
  studyPeriod: Array<any> // 검토기간
  isHazop?: boolean
}

export interface nodeType extends dataBaseType {
  ramAssessNodeId: stringNull // 노드 일련번호
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  ramTechniqueCd: stringNull // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
  processCd: stringNull // 단위공정 코드
  psiDiagramId: stringNull // 도면 일련번호
  nodeNo: stringNull // 노드 번호_수기입력
  nodeTitle: stringNull // 노드 타이틀
  nodeDesc: stringNull // 노드 설명
  designConditions: stringNull // 설계조건
  operatingConditions: stringNull // 작동조건
  designIntent: stringNull // 설계의도
  startStudyDate: stringNull // 검토 시작일
  endStudyDate: stringNull // 검토 종료일
  hazopScenarios: Array<any>
  ramMatrixId: stringNull
}
export interface drawType extends dataBaseType {
  ramRiskAssessmentPlanId: stringNull // 평가 일련번호
  processCd: stringNull // 단위공정 코드
  processName: stringNull // 단위공정 코드
  psiDiagramId: stringNull // 도면 일련번호
  ramTechniqueCd: stringNull // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
  diagramNo: stringNull // 도면번호
  diagramTitle: stringNull // 도면명
  nodes: Array<any>
}

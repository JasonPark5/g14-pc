import { dataBaseType } from '@/types/dataBase'

export interface workPermitPopupParamType {
  sopWorkPermitId: stringNull
  permitTypeCd: stringNull
  isApprContent: boolean
  approvalDocType: stringNull
}

export interface workPermitType extends dataBaseType {
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  plantCd: stringNull // 사업장 코드
  sopName: stringNull // 작업명
  mdmSopId: stringNull // 안전작업 표준 일련번호_SOP에서 불러와서 관련 정보 표시후 수정
  permitNo: stringNull // 허가번호_(YYYYMMDD-01)
  swpStepCd: stringNull // 진행단계 코드
  applicationDeptCd: stringNull // 신청인 부서코드
  applicationDeptName: stringNull // 신청인 부서
  applicationUserId: stringNull // 신청인 ID
  applicationUserName: stringNull // 신청인
  permitTypeCd: stringNull // 허가서 구분_화기/일반
  permitDate: stringNull // 허가일자
  workStartTime: stringNull // 작업시작시간
  workEndTime: stringNull // 작업종료시간
  workTime: Array<string> // 작업시간
  processCd: stringNull // 작업공정
  workLocation: stringNull // 작업장소
  workManagerId: stringNull // 담당자ID
  equipmentCd: stringNull // 설비번호_설비마스터
  workSummary: stringNull // 작업개요
  specialRequirements: stringNull // 특별요구사항
  cancelRemark: stringNull // 취소사유
  actionRemark: stringNull // 조치사항
  maintenanceDeptCheckUserId: stringNull // 정비부서 책임자 - 안전조치확인
  maintenanceDeptEntryUserId: stringNull // 정비부서 입회자 - 안전조치확인
  workCompleteTime: stringNull // 작업완료시간
  workCompleteEntryUserId: stringNull // 작업완료 입회자/확인자
  workCompleteWorkUserId: stringNull // 작업완료 작업자
  issuedDeptCd: stringNull // 발급자 부서코드
  issuedUserId: stringNull // 발급자 ID
  approvalDeptCd: stringNull // 승인자 부서코드
  approvalUserId: stringNull // 승인자 ID
  relationCooperation1DeptCd: stringNull // 관련부서 협조자1 부서코드
  relationCooperation1UserId: stringNull // 관련부서 협조자1 ID
  relationCooperation2DeptCd: stringNull // 관련부서 협조자2 부서코드
  relationCooperation2UserId: stringNull // 관련부서 협조자2 ID
  vendorCd: stringNull // 작업업체 코드
  overWorkFlag: stringNull // 연장작업 여부
  psmFlag: stringNull // PSM 관련 여부
  sopMocId: stringNull // MOC 일련번호
  assessWriteUserId: stringNull // 작업위험성평가_작성자 ID
  assessWriteDeptCd?: stringNull // 작업위험성평가_작성자 부서
  assessApprovalUserId: stringNull // 작업위험성평가_승인자 ID
  assessApprovalDeptCd?: stringNull // 작업위험성평가_승인자 부서
  swpWorkRequestCd: stringNull // 작업허가요청
  returnRemark: stringNull // 반려사유
  vendorFlag: number // 업체작성여부
  sysApprovalRequestId: stringNull // 결재요청번호
  sopAssessmentCheckTypeCd1: stringNull // 잠재위험요소1
  sopAssessmentCheckTypeCd2: stringNull // 잠재위험요소2
  sopAssessmentCheckTypeCd3: stringNull // 잠재위험요소3
  sopAssessmentCheckTypeCd4: stringNull // 잠재위험요소4
  sopAssessmentCheckTypeCd5: stringNull // 잠재위험요소5
  sopAssessmentCheckTypeCd6: stringNull // 잠재위험요소6
  sopConstructionId: stringNull // 공사 일련번호
  fireWatchmanId: stringNull // 화재감시자
  fireWorkClassification: stringNull // 화기 작업구분
  fireWorkClassificationEtc: stringNull // 화기 작업구분 기타 수기입력
  fireSafetyManagerId: stringNull // 소방안전관리자
  supWorks: Array<supWorkType>
  deleteSupWorks: Array<supWorkType>
  checkResults: Array<checkResultType>
  deleteCheckResults: Array<checkResultType>
  gases: Array<any>
  gasChecks: Array<gasCheckSaveType>
  deleteGasChecks: Array<gasCheckSaveType>
  deleteGasCheckVals: Array<gasCheckValueType>
  maps: Array<workMapResultType>
  deleteMaps: Array<workMapResultType>
  workers: Array<workerType>
  deleteWorkers: Array<workerType>
  assessments: Array<workSopAssessmentType>
  deleteAssessments: Array<workSopAssessmentType>
  overs: Array<overResultType>
  deleteOvers: Array<overResultType>
  protectiveGears: Array<workProtectiveGearType>
  deleteProtectiveGears: Array<workProtectiveGearType>
  lotos: Array<lotoType>
  deleteLotos: Array<lotoType>
  checklistResults: Array<checklistResultType>
  deleteChecklistResults: Array<checklistResultType>
  supplementWorkTypeCd?: stringNull
}

export interface supWorkType extends dataBaseType {
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  supplementWorkTypeCd: stringNull // 보충작업구분
  workProposalNo: stringNull // 작업 신청번호_방사선, 고소, 중장비
  workLocation: stringNull // 작업장소_방사선, 고소, 중장비
  workSummary: stringNull // 작업개요_고소, 방사선,굴착, 중장비
  issuedDeptCd: stringNull // 발급자 부서코드
  issuedUserId: stringNull // 발급자 ID
  approvalDeptCd: stringNull // 승인자 부서코드
  approvalUserId: stringNull // 승인자 ID
  maintenanceDeptCheckUserId: stringNull // 정비부서 책임자 - 안전조치확인
  maintenanceDeptEntryUserId: stringNull // 정비부서 입회자 - 안전조치확인
  relationCooperation1DeptCd: stringNull // 관려부서 협조자1 부서코드
  relationCooperation1UserId: stringNull // 관련부서 협조자1 ID
  relationCooperation2DeptCd: stringNull // 관려부서 협조자2 부서코드
  relationCooperation2UserId: stringNull // 관련부서 협조자2 ID
  specialRequirements: stringNull // 특별요구사항
  closeMachine: stringNull // (밀폐)장치명
  closeEntryResaon: stringNull // (밀폐)출입사유
  closeEntryUserIds: stringNull // (밀폐)출입자명_구분자이용 복수등록
  closeEntryUserNames: stringNull // (밀폐)출입자명_구분자이용 복수등록
  closeExpectedRisk: stringNull // (밀폐)예상위험
  blackoutCircuitBreaker: stringNull // (정전)차단기기
  blackoutCircuitBreakerNo: stringNull // (정전)차단기 번호
  blackoutPowerRecoveryRequestUserId: stringNull // (정전)전원복구 요청자
  blackoutPowerRecoveryTime: stringNull // (정전)전원복구 시간
  blackoutElectricBlockUserId: stringNull // (정전)차단확인자(전기)
  blackoutMaintenanceBlockUserId: stringNull // (정전)차단확인자(정비)
  sketchSrc: stringNull // (굴착)스케치
  radiationResponsibleUserId: stringNull // (방사선)방사능 책임자
  heavyEquipSafetyCheckUserId: stringNull // (중장비)안전조치 확인자
  heavyEquipManageUserId: stringNull // (중장비)장비관리 책임자
  heavyEquipDriveUserId: stringNull // (중장비)운전원
  heavyEquipDirectorRequirements: stringNull // (중장비) 감독 요구사항
  heavyEquipRequireDeptRequirements: stringNull // (중장비)요청부서 요구사항
  heavyEquipSupportDeptRequirements: stringNull // (중장비) 지원부서 요구사항
  heavySignalMan: stringNull // (중장비) 신호수
  heavyType: stringNull // (중장비) 중장비종류
  checkResults: Array<checkResultType>
  deleteCheckResults?: Array<checkResultType>
  gases: Array<any>
  gasChecks: Array<gasCheckSaveType>
  deleteGasChecks: Array<gasCheckSaveType>
  deleteGasCheckVals: Array<gasCheckValueType>
  entrants: Array<entrantType>
}

export interface entrantType extends dataBaseType {
  closeEntryUserId: stringNull // 출입자id
  closeEntryUserName: stringNull // 출입자
  check?: boolean // 체크
}

export interface checkResultType extends dataBaseType {
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  supplementWorkTypeCd: stringNull // 보충작업구분
  sopCheckItemId: stringNull // 점검항목 일련번호
  checkItemName: stringNull // 점검항목
  sopCheckItemKindCd: stringNull // 체크항목 종류
  necessaryFlag: stringNull // 필요
  necessaryDisabledFlag?: stringNull // 필요
  confirmFlag: stringNull // 확인
  confirmUserId: stringNull // 확인자
  confirmUserName: stringNull // 확인자
}

export interface gasCheckSaveType extends dataBaseType {
  sopGasCheckId: stringNull // 가스농도측정번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  supplementWorkTypeCd: stringNull // 보충작업구분
  checkTime: stringNull // 점검시간
  gasCheckMachine: stringNull // 점검기기명
  gasCheckUserId: stringNull // 점검자
  gasCheckUserName?: stringNull // 점검자
  gasConfirmUserId: stringNull // 확인자(입회자)
  gasConfirmUserName?: stringNull // 확인자(입회자)
  gasValues: Array<gasCheckValueType>
}

// export interface gasCheckType extends gasCheckSaveType, objectString, dataBaseType {}

export interface gasCheckValueType extends dataBaseType {
  sopGasCheckId: stringNull // 가스농도측정번호
  sopGasId: stringNull // 가스번호
  measurement?: stringNull // 측정치
}

export interface workMapResultType extends dataBaseType {
  sopMapResultId: stringNull // 작업위치 번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  sopMapId: stringNull // 지도 일련번호
  locationXcoordinate: numberNull // 작업위치 X좌표
  locationYcoordinate: numberNull // 작업위치 Y좌표
  ratio?: numberNull // 비율
  resultTypes: Array<workMapResultTypeType>
}

export interface workMapResultTypeType {
  sopMapResultId: stringNull // 작업위치 번호
  sopWorkTypeCd: stringNull // 허가서 구분 + 보충작업 구분
  sopWorkTypeCds?: stringNull // 허가서 구분 + 보충작업 구분
  sopWorkTypeName?: stringNull // 허가서 구분 + 보충작업 구분
  sopWorkPermitId?: stringNull // 작업허가서 일련번호
  workSummary?: stringNull // 작업개요
  swpStepCd?: stringNull // 진행단계
  swpStepName?: stringNull // 진행단계
  equipmentName?: stringNull // 설비
  vendorName?: stringNull // 업체
  processName?: stringNull // 공정
  workTime?: stringNull // 작업시간
}

export interface workerType extends dataBaseType {
  sopWorkerId: stringNull // 안전작업허가서_작업자 일련번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  belongName: stringNull // 소속명
  vendorCd: stringNull // 작업업체 코드
  deptCd: stringNull // 부서코드
  vendorUserCd: stringNull // 직원 일련번호
  userId: stringNull // 사용자id (현업인 경우)
  workerName: stringNull // 작업자명
  jobName: stringNull // 직책
  birthDate: stringNull // 생년월일
}

export interface workSopAssessmentType extends dataBaseType {
  sopWorkSopAssessmentId: stringNull // 작업허가서_작업위험성평가_일련번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  jobStepName: stringNull // 작업단계 명
  riskHazardName: stringNull // 유해위험요인명
  safetyActionMeasures: stringNull // 안전조치사항
  actionEducationFlag: stringNull // 조치/교육완료여부
  beforeFrequency: numberNull // 개선전 빈도
  beforeStrength: numberNull // 개선전 강도
  beforeRisk: numberNull // 개선전 위험도
  riskThirdBeforeId: stringNull // 개선 전 3단계 판단
  afterFrequency: numberNull // 개선후 빈도
  afterStrength: numberNull // 개선후 강도
  afterRisk: numberNull // 개선후 위험도
  riskThirdAfterId: stringNull // 개선 후 3단계 판단
  completeDt?: stringNull // 완료일
}

export interface overResultType extends dataBaseType {
  sopOverResultId: stringNull // 작업허가서 연장정보 번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  overTime: stringNull // 연장시간
  overReason: stringNull // 연장사유
}

export interface workProtectiveGearType {
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  sopProtectiveGearCd: stringNull // 보호구 코드
}

export interface lotoType extends dataBaseType {
  sopLotoId: stringNull // LOTO 일련번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  equipmentCd: stringNull // 설비코드일련번호
  equipmentNo: stringNull // 설비
  equipmentName: stringNull // 설비
  equipmentLocation: stringNull // 설비
  equipmentTypeCd?: stringNull // 설비
  equipmentTypeName: stringNull // 설비
  sopLotoTypeCd: stringNull // 잠금장치
  sopLotoTypeName?: stringNull // 잠금장치
}

export interface checklistResultType extends dataBaseType {
  sopFireFightingPermitChecklistResultId: stringNull // 소방공사 체크리스트 결과 일련번호
  sopWorkPermitId: stringNull // 작업허가서 일련번호
  sopFireFightingPermitChecklistItemId: stringNull // 소방공사 체크리스트 항목 일련번호
  supplementWorkTypeCd: stringNull // 보충작업구분 (화기 / 밀폐)
  supplementWorkTypeName?: stringNull // 보충작업구분 (화기 / 밀폐)
  checklistItemName: stringNull // 소방공사 체크리스트 항목명
  textFlag: stringNull // 텍스트 여부
  checklistResult: stringNull // 체크리스트 결과
}

export interface checklistItemType extends dataBaseType {
  sopFireFightingPermitChecklistItemId: stringNull // 소방공사 체크리스트 항목 일련번호
  supplementWorkTypeCd: stringNull // 보충작업구분 (화기 / 밀폐)
  checklistItemName: stringNull // 소방공사 체크리스트 항목명
  textFlag: stringNull // 텍스트 여부
  sortOrder: numberNull // 정렬순서
  useFlag: stringNull // 사용여부
}

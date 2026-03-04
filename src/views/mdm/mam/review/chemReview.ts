import { dataBaseType } from '@/types/dataBase'

export interface chemReviewType extends dataBaseType {
  mdmChemReviewId: stringNull // 사전검토 일련번호
  reviewRequestDate: stringNull // 검토요청일
  plantCds: stringNull // 사업장코드
  materialCd: stringNull // 화학자재번호
  materialName: stringNull // 자재명(KOR)
  materialNameEn: stringNull // 자재명(ENG)
  deliveryVendorCd: stringNull // 납품업체 코드
  deliveryVendorName: stringNull // 납품업체명
  mfgVendorCd: stringNull // 제조업체 코드
  mfgVendorName: stringNull // 제조업체명
  mdmChemReviewStepCd: stringNull // 사전검토 진행상태
  psmFlag: stringNull // PSM 대상 여부
  propertiesStateCd: stringNull // 성상-공통코드
  fugacity: stringNull // 비산성(고체)
  boilPoint: stringNull // 끊는점(액체,기체)
  meltingPoint: stringNull // 녹는점
  moleWeight: stringNull // 분자량
  usageCd: stringNull // 용도-회사별 공통코드
  usageEtc: stringNull // 용도 기타
  hsNo: stringNull // HS번호
  specificGravity: stringNull // 비중
  casNo: stringNull // CAS No.
  serialNo: stringNull // 고유번호(유독물번호or고시번호)
  keNo: stringNull // KE 번호
  mixFlag: stringNull // 물질구성(단일 N/혼합 Y)
  licensingFlag: stringNull // 인허가대상 물질 여부 Y/N
  dangerFlag: stringNull // 위험물 여부Y/N
  makeFlag: stringNull // 제품분류(제조)
  impFlag: stringNull // 제품분류(수입)
  buyFlag: stringNull // 제품분류(구매)
  usingFlag: stringNull // 제품분류(사용)
  expFlag: stringNull // 제품분류(수출)
  salesFlag: stringNull // 제품분류(판매)
  toxicPoisonFlag: stringNull // 유해화학물질포함여부(유독물질)
  toxicPermitFlag: stringNull // 유해화학물질포함여부(허가물질)
  toxicLimitFlag: stringNull // 유해화학물질포함여부(제한물질)
  toxicProhibitFlag: stringNull // 유해화학물질포함여부(금지물질)
  remarks: stringNull // 비고
  returnRemark: stringNull // 반려사유
  returnFlag: stringNull // 반려여부
  chemSubsControlFlag: stringNull // 화평법 등록여부
  chemAuthFlag: stringNull // 화학물질확인증명 여부
  chemLicenseFlag: stringNull // 유해화학물질 인허가 여부
  chemReportFlag: stringNull // 유해화학물질 신고여부
  msdsFlag: stringNull // MSDS제출/비공개 승인여부
  msdsNo: stringNull // MSDS번호
  materialCount: numberNull
  subs?: Array<chemReviewSubstanceType>
  prodReguls?: Array<chemReviewRegulationType>
  subsRegul?: Array<any>
  checks?: Array<chemReviewCheckType>
  deleteChecks?: Array<chemReviewCheckType>
  bills?: Array<chemReviewBillType>
}

export interface chemReviewSubstanceType extends dataBaseType {
  mdmChemReviewId: stringNull // 사전검토 일련번호
  mdmChemId: stringNull // 화학물질 일련번호
  casNo?: stringNull // CAS No. snapshot
  chemNmKr?: stringNull // 화학물질명(KOR) snapshot
  chemNmEn?: stringNull // 화학물질명(ENG) snapshot
  limitHigh?: stringNull // 함유량 상한(%)
  limitLow?: stringNull // 함유량 하한(%)
  limitRepval?: stringNull // 함유량 대표값(%)
  mttrid?: stringNull // 산업안전보건공단 chemid
  regulD10?: numberNull
  regulD14?: numberNull
  dangerousName?: numberNull
  prtrGroupId?: numberNull
  twaPpm?: stringNull
  twaMm?: stringNull
  stelPpm?: stringNull
  stelMm?: stringNull

  psiPipeGasketId?: stringNull // 배관및개스킷 일련번호
  psiPipeGasketSubstancesId?: stringNull // 조성품 일련번호
  molecularFormula?: stringNull // 화학식
  exposedBasis?: stringNull // 노출기준
  toxicity?: stringNull // 독성치
  addType?: stringNull
}

export interface chemReviewRegulationType extends dataBaseType {
  mdmChemReviewId: stringNull // 사전검토 일련번호
  regulationBillName: stringNull // 규제법규
  regulationBillCd: stringNull // 규제법규 코드
  regulatedItemName: stringNull // 규제항목
  regulatedItemCd: stringNull // 규제항목 코드
  val: stringNull //
  sortOrder: numberNull // 정렬순서
}

export interface chemReviewCheckType extends dataBaseType {
  mdmChemReviewId: stringNull // 사전검토 일련번호
  mdmChemReviewCheckId: stringNull // 사전검토 분야별 검토내역 일련번호
  mdmChemReviewClassName: stringNull // 검토자 분야
  userId: stringNull // 검토자id
  userName?: stringNull // 검토자
  mdmChemReviewResultCd: stringNull // 검토 결과 코드
  mdmChemReviewResultName?: stringNull // 검토 결과 코드
  remarks: stringNull // 비고
  mdmChemReviewCheckStepCd: stringNull // 사전검토 검토내역 진행상태
  mdmChemReviewCheckStepName?: stringNull // 사전검토 검토내역 진행상태
  reviewDt?: stringNull // 검토일시
}

export interface chemReviewBillType extends dataBaseType {
  regulationBillName: stringNull // 규제법규
  regulationBillCd: stringNull // 규제법규 코드
  reguls: Array<chemReviewRegulationType> // 규제항목
}

export interface chemReviewSubRegulQuantityType extends dataBaseType {
  mdmChemReviewId: stringNull // 사전검토 일련번호
  mdmChemId: stringNull // 화학물질 일련번호
  casNo: stringNull // CAS No.
  chemNmKr: stringNull // 화학물질명(KOR)
  chemNmEn: stringNull // 화학물질명(ENG)
  regulationBillCd: stringNull // 규제법규 코드
  regulationBillName: stringNull // 규제법규
  regulatedItemCd: stringNull // 규제항목 코드
  regulatedItemName: stringNull // 규제항목
  billRegulName: stringNull // 법규 - 규제
  quantity: numberNull // 정량값
  appliStandQuantity: stringNull // 정량값_화학물질
  appliStandSign: stringNull // 적용기준 부등호
}

export interface chemReviewRegulatorVertificationType extends dataBaseType {
  mdmChemReviewId: stringNull // 사전검토 일련번호
  mdmChemMaterialId: stringNull // 화학자재 key
  mdmChemId: stringNull // 화학물질 일련번호
  chemName: stringNull // 화학물질명(ENG)
  regulationBillCd: stringNull // 규제법규 코드
  regulatedItemCd: stringNull // 규제항목 코드
  billRegulName: stringNull // 법규 - 규제
  quantity: numberNull // 정량값
  appliStandSign: stringNull // 적용기준 부등호
  limitRepval: stringNull // 함유량 대표값(%)
  /** 상태 */
  status: stringNull
  statusMax: stringNull
  statusGroup: stringNull
  statusFin: stringNull
  statusFlag: boolean
  statusCheck: boolean
  /** 상태 카운트 */
  cnt: numberNull
  maxCnt: numberNull
}

export interface billType extends dataBaseType {
  regulationBillCd: stringNull // 규제법규 코드
  regulationBillName: stringNull // 규제법규
  reguls?: Array<chemReviewRegulationType>
}

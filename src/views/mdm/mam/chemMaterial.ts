import { dataBaseType } from '@/types/dataBase'

export interface chemMaterialType extends dataBaseType {
  plantCd: stringNull // 사업장코드
  plantName?: stringNull // 사업장
  mdmChemMaterialId: stringNull // 화학자재 일련번호
  mdmChemMaterialCd?: stringNull // 화학자재번호
  mdmChemMaterialName: stringNull // 화학자재 품명
  mdmChemMaterialNameEn?: stringNull // 화학자재 품명(영문)
  mdmChemReviewId: stringNull // 사전검토 일련번호
  deliveryVendorCd: stringNull // 납품업체 코드
  mfgVendorCd: stringNull // 제조업체 코드
  psmFlag: stringNull // PSM 대상 여부
  usageCd: stringNull // 용도-회사별 공통코드
  usageName?: stringNull // 용도-회사별
  usageEtc: stringNull // 용도 기타
  inUnitCd: stringNull // 입고단위
  inConversonFactor: stringNull // 입고 환산계수
  inConversonUnitCd: stringNull // 입고 환산단위
  specificGravity: stringNull // 비중
  propertiesStateCd: stringNull // 성상
  propertiesStateName?: stringNull // 성상
  freezingPoint: stringNull // 어는점
  boilPoint: stringNull // 끓는점
  flashPoint: stringNull // 인화점
  firePoint: stringNull // 발화점
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
  useFlag: stringNull // 사용여부
  unusedReason: stringNull // 미사용사유
  preMdmChemMaterialId: stringNull // 이전화학자재 일련번호
  casNo: stringNull // CAS No.
  msdsNo: stringNull // MSDS 번호
  productCategoryCd: stringNull // 제품구분
  keepFacilityFlag: stringNull // 보관시설 유무
  maxKeepAmount: stringNull // 최대보관량
  storageFacilityFlag: stringNull // 저장시설 유무
  maxStorageAmount: stringNull // 최대저장량
  manufacturingFacilitiesFlag: stringNull // 제조사용시설 여부
  nanoManufacturingFlag: stringNull // 나노물질 제조여부
  nanoIncomeFlag: stringNull // 나노물질 수입여부
  nanoNoneApplicableFlag: stringNull // 나노물질 해당없음 여부
  nanoUnknownFlag: stringNull // 나노물질 모름여부
  productManufClassCd: stringNull // 제품제조구분 코드
  chemIngredientsCd: stringNull // 구성성분 작성근거
  mixFlag: stringNull // 물질구성(단일 N/혼합 Y)
  serialNo: stringNull // 고유번호(유독물번호or고시번호)
  fugacity: stringNull // 비산성(고체)
  keNo: stringNull // KE 번호
  meltingPoint: stringNull // 녹는점
  moleWeight: stringNull // 분자량
  hsNo: stringNull // HS번호
  specialCtype?: stringNull // (사용안함)발암성 C-위험성평가용
  specialRtype?: stringNull // (사용안함)생식독성 R-위험성평가용
  specialMtype?: stringNull // (사용안함)생식세표변이원성 M-위험성평가용
  rcode?: stringNull // (사용안함)위험문구(R-phrase)-위험성평가용
  hcode?: stringNull // (사용안함)유해위험문구(H-code)-위험성평가용
  cmrFlag?: stringNull // (사용안함)CMR물질여부-위험성평가용
  boilingPoint?: stringNull // (사용안함)끓는점-위험성평가용
  hrCodeGrade?: stringNull // (사용안함)위험문구/유해위험문구 등급-위험성평가용
  maleficenceForm?: stringNull // (사용안함)유해성 발생형태-위험성평가용
  maleficenceValue?: stringNull // (사용안함)유해성 측정값-위험성평가용
  maleficenceGrade?: stringNull // (사용안함)비산성 등급-위험성평가용
  maleficenceType?: stringNull // (사용안함)비산/휘발성 구분-위험성평가용
  dayVolume?: stringNull // (사용안함)하루취급량
  dayVolumeUnit?: stringNull // (사용안함)하루취급량 단위
  ghsFlag?: stringNull // (사용안함)GHS 분류코드
  storagePlace?: stringNull // (사용안함)보관장소
  sysRevision: numberNull // 시스템 리비전번호
  revisionNum: stringNull // 리비전번호
  revisionContent: stringNull // 개정 변경내용
  groupId: stringNull // 일련번호 키
  mdmChemMaterialMsdsId: stringNull // MSDS key
  msdsRegDtStr: stringNull // MSDS 개정일시
  msdsRegUserName: stringNull // MSDS 개정자
  depts: stringNull
  deptNames?: stringNull

  id?: stringNull
  substanceNames?: stringNull
}

export interface chemLicenseType extends dataBaseType {
  limLicenseId: stringNull // 인허가 일련번호
  materialCd: stringNull // 화학자재번호
  materialName: stringNull // 자재명(KOR)
  mdmChemMaterialId: stringNull // 화학자재 일련번호
}

export interface billType extends dataBaseType {
  regulationBillCd: stringNull // 규제법규 코드
  regulationBillName: stringNull // 규제법규
  reguls?: Array<chemMaterialRegulatorType>
}

export interface chemMaterialRegulatorType extends dataBaseType {
  mdmChemMaterialId?: stringNull // 화학자재 key
  regulatedItemCd: stringNull // 규제항목 코드
  regulationBillCd: stringNull // 규제법규 코드
  regulationBillName?: stringNull // 규제법규
  regulatedItemName: stringNull // 규제항목 명
  regulationDesc: stringNull // 규제 설명
  useFlag: stringNull // 사용여부
  nationFlag: stringNull // 국내외구분(Y:국내,N:국외)
  val?: stringNull
  sortOrder?: numberNull
}

export interface chemMaterialRegulatorVertificationType extends dataBaseType {
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

export interface chemGhsResultType extends dataBaseType {
  mdmChemMaterialId: stringNull // 화학자재 일련번호
  classes: Array<chemGhsClassfiResultType> // 유해성위해성
  deleteClasses: Array<chemGhsClassfiResultType> // 유해성위해성 삭제 정보
  pics: Array<chemGhsPicResultType> // 그림문자
  sign: stringNull // 신호어
  pcodeResult: stringNull // 예방조치문구 결과
  hcodeResult: stringNull // 유해위험문구 결과
}

export interface chemGhsClassfiResultType extends dataBaseType {
  mdmChemMaterialId: stringNull // 화학자재 일련번호
  attrVal1?: stringNull // 대분류
  harmfulRiskClassCd: stringNull // 유해위험성 구분 코드
  harmfulRiskClassName: stringNull // 유해위험성 구분
  harmfulRiskResultCd: stringNull // 유해위험성 결과 코드
  harmfulRiskResultCdSave?: stringNull // 유해위험성 결과 코드
  harmfulRiskResultName?: stringNull // 유해위험성 결과
  harmfulRiskResultDesc?: stringNull // 유해위험성 결과
  harmfulRiskDetails: stringNull // 유해위험성 상세 설명
  classficationResult?: stringNull // (사용안함)
}

export interface chemGhsPicResultType extends dataBaseType {
  mdmChemMaterialId: stringNull // 화학자재 일련번호
  pic: stringNull // 그림문자
  chk: stringNull // 존재여부
  attrVal1: stringNull // 그림문자명
}

export interface chemHeaderType {
  label: stringNull
  align: stringNull
  id: stringNull
  child: Array<chemHeaderChildType>
}

export interface chemHeaderChildType {
  name: stringNull
  field: stringNull
  label: stringNull
  align: stringNull
  style: stringNull
  type: stringNull
  True: stringNull
  False: stringNull
  vals: stringNull
  sortable: boolean
}

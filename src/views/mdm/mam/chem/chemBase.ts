import { dataBaseType } from '@/types/dataBase'

export interface chemBaseType extends chemBaseDetailType, chemBaseDisabedType, dataBaseType {
  mdmChemId: stringNull // 화학물질 일련번호
  casNo: stringNull // CAS No.
  chemNmEn: stringNull // 화학물질명(ENG)
  chemNmKr: stringNull // 화학물질명(KOR)
  regulD10?: numberNull
  regulD14?: numberNull
  nlId: stringNull // 뉴로라인즈 물질ID
  molecularFormula: stringNull // 화학식
  regulFlag: stringNull // 규제물질 대상여부
  nlRegDt: stringNull // 뉴로라인즈 생성일
  nlChgDt: stringNull // 뉴로라인즈 수정일
  propertiesStateCd: stringNull // 성상
  mttrid: stringNull // 산업안전보건공단 chemid
  deleteFlag: stringNull // 삭제여부
  reguls: Array<chemBaseRegulatoryInfoType>
  deleteReguls: Array<chemBaseRegulatoryInfoType>
  columnSetting: chemBaseColumnSettingType
}

export interface chemBaseDetailType {
  mdmChemId: stringNull // 화학물질 일련번호
  boilingPoint: stringNull // 끓는점-위험성평가용
  cmrFlag: stringNull // CMR 물질 여부-위험성평가용
  carcinogens: stringNull // 발암성물질
  mutagens: stringNull // 변이원성물질
  reproductiveToxins: stringNull // 생식독성물질
  maleficenceForm: stringNull // 유해성 발생형태-위험성평가용
  maleficenceValue: stringNull // 유해성 측정값-위험성평가용
  maleficenceGrade: stringNull // 비산성 등급-위험성평가용
  maleficenceType: stringNull // 비산/휘발성 구분-위험성평가용
  hrCodeGrade: stringNull // 위험문구/유해위험문구 등급-위험성평가용
  hcode: stringNull // 유해･위험문구-위험성평가용
  rcode: stringNull // 위험문구-위험성평가용
  restrictions: stringNull // 제한사항
  prohibited: stringNull // 금지사항
  accidentManuQuantity: stringNull // 사고대비물질_제조사용 지정수량(Kg)
  accidentStoreQuantity: stringNull // 사고대비물질_보관저장 지정수량(kg)
  exclusionConditions: stringNull // 제외조건내용
  exclusionConditionSign: stringNull // 제외조건_부등호
  exclusionConditionQuantity: stringNull // 제외조건_정량값
  exclusionConditionUnit: stringNull // 제외조건_단위
  prtrGroupId: stringNull // PRTR_Group_ID
  prtrMaterialName: stringNull // PRTR_물질명
  prtrSwcsWt: stringNull // PRTR_조사대상무게함유기준(wt%)
  prtrSwcsWtSign: stringNull // PRTR_조사대상무게함유기준_부등호
  prtrSwcsWtQuantity: stringNull // PRTR_조사대상무게함유기준_정량값
  prtrSwcsWtUnit: stringNull // PRTR_조사대상무게함유기준_단위
  prtrSwcsTon: stringNull // PRTR_조사대상취급량기준(톤/년)
  prtrSwcsTonSign: stringNull // PRTR_조사대상취급량기준_부등호
  prtrSwcsTonQuantity: stringNull // PRTR_조사대상취급량기준_정량값
  prtrSwcsTonUnit: stringNull // PRTR_조사대상취급량기준_단위
  remark1: stringNull // 고시내용 외 참조내용 입력(예, CMR, PBT 등)
  dangerousContents: stringNull // 위험물내용
  dangerousClass: stringNull // 위험물유별구분
  dangerousProp: stringNull // 위험물성질
  dangerousName: stringNull // 위험물품명
  designatedQuantityDose: stringNull // 지정수량_정량값
  designatedQuantityUnit: stringNull // 지정수량_단위
  psmAmount: stringNull // 공정안전관리 제조∙취급∙저장량(kg/일)
  bei: stringNull // 생물학적노출기준(단위포함 Full text)
  sensitization: stringNull // 과민성 여부 입력(고용노동부, ACGIH 등)
  simpleAsphyxiants: stringNull // 질식제 여부 입력(ACGIH, EU 노출기준 등)
  skinNotations: stringNull // 피부영향 여부 입력(고용노동부, ACGIH 등)
  basisCriticalEffects: stringNull // 표적장기 입력(예, 간, 신장 등)
  twaPpm: stringNull // TWA 노출기준입력(only 숫자만) ppm
  twaMm: stringNull // TWA 노출기준입력(only 숫자만) mg/m3
  stelPpm: stringNull // STEL 노출기준입력(only 숫자만) ppm
  stelMm: stringNull // STEL 노출기준입력(only 숫자만) mg/m3
  ceilingsPpm: stringNull // Celling 노출기준입력(only 숫자만) ppm
  ceilingsMm: stringNull // Celling 노출기준입력(only 숫자만) mg/m3
  lelPpm: stringNull // LEL노출기준입력(only 숫자만) ppm
  lelMm: stringNull // LEL노출기준입력(only 숫자만) mg/m3
  remark2: stringNull // 적용기준, 고시내용 외 추가 참조사항 입력
  remark3: stringNull // 기타 참조사항
}

export interface chemBaseDisabedType {
  boilingPointDisabled?: stringNull // 끓는점-위험성평가용
  cmrFlagDisabled?: stringNull // CMR 물질 여부-위험성평가용
  carcinogensDisabled?: stringNull // 발암성물질
  mutagensDisabled?: stringNull // 변이원성물질
  reproductiveToxinsDisabled?: stringNull // 생식독성물질
  maleficenceFormDisabled?: stringNull // 유해성 발생형태-위험성평가용
  maleficenceValueDisabled?: stringNull // 유해성 측정값-위험성평가용
  maleficenceGradeDisabled?: stringNull // 비산성 등급-위험성평가용
  maleficenceTypeDisabled?: stringNull // 비산/휘발성 구분-위험성평가용
  hrCodeGradeDisabled?: stringNull // 위험문구/유해위험문구 등급-위험성평가용
  hcodeDisabled?: stringNull // 유해･위험문구-위험성평가용
  rcodeDisabled?: stringNull // 위험문구-위험성평가용
  restrictionsDisabled?: stringNull // 제한사항
  prohibitedDisabled?: stringNull // 금지사항
  accidentManuQuantityDisabled?: stringNull // 사고대비물질_제조사용 지정수량(Kg)
  accidentStoreQuantityDisabled?: stringNull // 사고대비물질_보관저장 지정수량(kg)
  exclusionConditionsDisabled?: stringNull // 제외조건내용
  exclusionConditionSignDisabled?: stringNull // 제외조건_부등호
  exclusionConditionQuantityDisabled?: stringNull // 제외조건_정량값
  exclusionConditionUnitDisabled?: stringNull // 제외조건_단위
  prtrGroupIdDisabled?: stringNull // PRTR_Group_ID
  prtrMaterialNameDisabled?: stringNull // PRTR_물질명
  prtrSwcsWtDisabled?: stringNull // PRTR_조사대상무게함유기준(wt%)
  prtrSwcsWtSignDisabled?: stringNull // PRTR_조사대상무게함유기준_부등호
  prtrSwcsWtQuantityDisabled?: stringNull // PRTR_조사대상무게함유기준_정량값
  prtrSwcsWtUnitDisabled?: stringNull // PRTR_조사대상무게함유기준_단위
  prtrSwcsTonDisabled?: stringNull // PRTR_조사대상취급량기준(톤/년)
  prtrSwcsTonSignDisabled?: stringNull // PRTR_조사대상취급량기준_부등호
  prtrSwcsTonQuantityDisabled?: stringNull // PRTR_조사대상취급량기준_정량값
  prtrSwcsTonUnitDisabled?: stringNull // PRTR_조사대상취급량기준_단위
  remark1Disabled?: stringNull // 고시내용 외 참조내용 입력(예, CMR, PBT 등)
  dangerousContentsDisabled?: stringNull // 위험물내용
  dangerousClassDisabled?: stringNull // 위험물유별구분
  dangerousPropDisabled?: stringNull // 위험물성질
  dangerousNameDisabled?: stringNull // 위험물품명
  designatedQuantityDoseDisabled?: stringNull // 지정수량_정량값
  designatedQuantityUnitDisabled?: stringNull // 지정수량_단위
  psmAmountDisabled?: stringNull // 공정안전관리 제조∙취급∙저장량(kg/일)
  beiDisabled?: stringNull // 생물학적노출기준(단위포함 Full text)
  sensitizationDisabled?: stringNull // 과민성 여부 입력(고용노동부, ACGIH 등)
  simpleAsphyxiantsDisabled?: stringNull // 질식제 여부 입력(ACGIH, EU 노출기준 등)
  skinNotationsDisabled?: stringNull // 피부영향 여부 입력(고용노동부, ACGIH 등)
  basisCriticalEffectsDisabled?: stringNull // 표적장기 입력(예, 간, 신장 등)
  twaPpmDisabled?: stringNull // TWA 노출기준입력(only 숫자만) ppm
  twaMmDisabled?: stringNull // TWA 노출기준입력(only 숫자만) mg/m3
  stelPpmDisabled?: stringNull // STEL 노출기준입력(only 숫자만) ppm
  stelMmDisabled?: stringNull // STEL 노출기준입력(only 숫자만) mg/m3
  ceilingsPpmDisabled?: stringNull // Celling 노출기준입력(only 숫자만) ppm
  ceilingsMmDisabled?: stringNull // Celling 노출기준입력(only 숫자만) mg/m3
  lelPpmDisabled?: stringNull // LEL노출기준입력(only 숫자만) ppm
  lelMmDisabled?: stringNull // LEL노출기준입력(only 숫자만) mg/m3
  remark2Disabled?: stringNull // 적용기준, 고시내용 외 추가 참조사항 입력
  remark3Disabled?: stringNull // 기타 참조사항
}

export interface chemBaseRegulatoryInfoType extends dataBaseType {
  mdmChemId: stringNull // 화학물질 일련번호
  regulationBillCd?: stringNull
  regulationBillName?: stringNull
  regulatedItemCd: stringNull // 규제항목 코드
  regulatedItemName?: stringNull // 규제항목
  regulatedReason: stringNull // 규제대상 사유
  notiNo: stringNull // 고시번호
  notice: stringNull // 고시내용
  notiDt: stringNull // 고시일자
  uniqNo: stringNull // 고유번호
  appliStandContents: stringNull // 적용기준 내용
  appliStandSign: stringNull // 적용기준 부등호
  appliStandQuantity: stringNull // 적용기준 정량값
  appliStandUnit: stringNull // 적용기준 단위
}

export interface chemBaseColumnSettingType {
  boilingPoint: stringNull // 끓는점-위험성평가용
  cmrFlag: stringNull // CMR 물질 여부-위험성평가용
  carcinogens: stringNull // 발암성물질
  mutagens: stringNull // 변이원성물질
  reproductiveToxins: stringNull // 생식독성물질
  maleficenceForm: stringNull // 유해성 발생형태-위험성평가용
  maleficenceValue: stringNull // 유해성 측정값-위험성평가용
  maleficenceGrade: stringNull // 비산성 등급-위험성평가용
  maleficenceType: stringNull // 비산/휘발성 구분-위험성평가용
  hrCodeGrade: stringNull // 위험문구/유해위험문구 등급-위험성평가용
  hcode: stringNull // 유해･위험문구-위험성평가용
  rcode: stringNull // 위험문구-위험성평가용
  restrictions: stringNull // 제한사항
  prohibited: stringNull // 금지사항
  accidentManuQuantity: stringNull // 사고대비물질_제조사용 지정수량(Kg)
  accidentStoreQuantity: stringNull // 사고대비물질_보관저장 지정수량(kg)
  exclusionConditions: stringNull // 제외조건내용
  exclusionConditionSign: stringNull // 제외조건_부등호
  exclusionConditionQuantity: stringNull // 제외조건_정량값
  exclusionConditionUnit: stringNull // 제외조건_단위
  prtrGroupId: stringNull // PRTR_Group_ID
  prtrMaterialName: stringNull // PRTR_물질명
  prtrSwcsWt: stringNull // PRTR_조사대상무게함유기준(wt%)
  prtrSwcsWtSign: stringNull // PRTR_조사대상무게함유기준_부등호
  prtrSwcsWtQuantity: stringNull // PRTR_조사대상무게함유기준_정량값
  prtrSwcsWtUnit: stringNull // PRTR_조사대상무게함유기준_단위
  prtrSwcsTon: stringNull // PRTR_조사대상취급량기준(톤/년)
  prtrSwcsTonSign: stringNull // PRTR_조사대상취급량기준_부등호
  prtrSwcsTonQuantity: stringNull // PRTR_조사대상취급량기준_정량값
  prtrSwcsTonUnit: stringNull // PRTR_조사대상취급량기준_단위
  remark1: stringNull // 고시내용 외 참조내용 입력(예, CMR, PBT 등)
  dangerousContents: stringNull // 위험물내용
  dangerousClass: stringNull // 위험물유별구분
  dangerousProp: stringNull // 위험물성질
  dangerousName: stringNull // 위험물품명
  designatedQuantityDose: stringNull // 지정수량_정량값
  designatedQuantityUnit: stringNull // 지정수량_단위
  psmAmount: stringNull // 공정안전관리 제조∙취급∙저장량(kg/일)
  bei: stringNull // 생물학적노출기준(단위포함 Full text)
  sensitization: stringNull // 과민성 여부 입력(고용노동부, ACGIH 등)
  simpleAsphyxiants: stringNull // 질식제 여부 입력(ACGIH, EU 노출기준 등)
  skinNotations: stringNull // 피부영향 여부 입력(고용노동부, ACGIH 등)
  basisCriticalEffects: stringNull // 표적장기 입력(예, 간, 신장 등)
  twaPpm: stringNull // TWA 노출기준입력(only 숫자만) ppm
  twaMm: stringNull // TWA 노출기준입력(only 숫자만) mg/m3
  stelPpm: stringNull // STEL 노출기준입력(only 숫자만) ppm
  stelMm: stringNull // STEL 노출기준입력(only 숫자만) mg/m3
  ceilingsPpm: stringNull // Celling 노출기준입력(only 숫자만) ppm
  ceilingsMm: stringNull // Celling 노출기준입력(only 숫자만) mg/m3
  lelPpm: stringNull // LEL노출기준입력(only 숫자만) ppm
  lelMm: stringNull // LEL노출기준입력(only 숫자만) mg/m3
  remark2: stringNull // 적용기준, 고시내용 외 추가 참조사항 입력
  remark3: stringNull // 기타 참조사항
}

export type chemBaseDetailLiteralType =
  | 'boilingPoint'
  | 'cmrFlag'
  | 'carcinogens'
  | 'mutagens'
  | 'reproductiveToxins'
  | 'maleficenceForm'
  | 'maleficenceValue'
  | 'maleficenceGrade'
  | 'maleficenceType'
  | 'hrCodeGrade'
  | 'hcode'
  | 'rcode'
  | 'restrictions'
  | 'prohibited'
  | 'accidentManuQuantity'
  | 'accidentStoreQuantity'
  | 'exclusionConditions'
  | 'exclusionConditionSign'
  | 'exclusionConditionQuantity'
  | 'exclusionConditionUnit'
  | 'prtrGroupId'
  | 'prtrMaterialName'
  | 'prtrSwcsWt'
  | 'prtrSwcsWtSign'
  | 'prtrSwcsWtQuantity'
  | 'prtrSwcsWtUnit'
  | 'prtrSwcsTon'
  | 'prtrSwcsTonSign'
  | 'prtrSwcsTonQuantity'
  | 'prtrSwcsTonUnit'
  | 'remark1'
  | 'dangerousContents'
  | 'dangerousClass'
  | 'dangerousProp'
  | 'dangerousName'
  | 'designatedQuantityDose'
  | 'designatedQuantityUnit'
  | 'psmAmount'
  | 'bei'
  | 'sensitization'
  | 'simpleAsphyxiants'
  | 'skinNotations'
  | 'basisCriticalEffects'
  | 'twaPpm'
  | 'twaMm'
  | 'stelPpm'
  | 'stelMm'
  | 'ceilingsPpm'
  | 'ceilingsMm'
  | 'lelPpm'
  | 'lelMm'
  | 'remark2'
  | 'remark3'

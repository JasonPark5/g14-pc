import { dataBaseType } from '@/types/dataBase'

export interface regulDbUploadType extends dataBaseType {
  chmRegulDbUploadId: stringNull // 규제DB업로드 결과 일련번호
  updateDt: stringNull // 업로드 일시
  chmUploadStateCd: stringNull // 업로드 상태
  chmUploadStateName?: stringNull // 업로드 상태
  ingCnt?: numberNull // 진행 건 수
  ingStartCnt?: numberNull // 진행 건 수
  addCnt: numberNull // 추가 건 수
  updateCnt: numberNull // 수정 건 수
  deleteCnt: numberNull // 삭제 건 수
  noChangeCnt: numberNull // 변함없음 건 수
  totalCnt: numberNull // 총 건 수
  failContents: stringNull // 실패사유
  details: Array<regulDbUploadDetailType>
  chemBases: Array<chemBaseHistoryType>
  chems: Array<chemRegulHistoryType>
}

export interface regulDbUploadDetailType {
  chmRegulDbUploadDetailId: stringNull // 규제DB업로드 결과내역 일련번호
  chmRegulDbUploadId: stringNull // 규제DB업로드 결과 일련번호
  flag: stringNull // 변경flag
  regulationBillCd: stringNull // 규제법규 코드
  regulatedItemCd: stringNull // 규제항목코드
  regulatedItemName: stringNull // 규제항목명
  casNo: stringNull // CAS No.
  chemNmEn: stringNull // 화학물질명(ENG)
  chemNmKr: stringNull // 화학물질명(KOR)
  nlId: stringNull // 뉴로라인즈 물질ID
  molecularFormula: stringNull // 화학식
  regulFlag: stringNull // 규제물질 대상여부
  notiNo: stringNull // 고시번호
  notice: stringNull // 고시내용
  notiDt: stringNull // 고시일자
  uniqNo: stringNull // 고유번호
  appliStandContents: stringNull // 적용기준 내용
  appliStandSign: stringNull // 적용기준 부등호
  appliStandQuantity: stringNull // 적용기준 정량값
  appliStandUnit: stringNull // 적용기준 단위
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
  carcinogens: stringNull // 발암성물질
  mutagens: stringNull // 변이원성물질
  reproductiveToxins: stringNull // 생식독성물질
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
  nlRegDt: stringNull // 뉴로라인즈 생성일
  nlChgDt: stringNull // 뉴로라인즈 수정일
  noChangeFlag: stringNull // 동일파일 비교로 인한 동일 데이터 구분
  failContents: stringNull // 실패사유
}

export interface chemBaseHistoryType {
  nlId: stringNull // 뉴로라인즈 물질ID
  chemName?: stringNull // 화학물질명
  flag: stringNull // 추가/수정/삭제여부
  changeContents: stringNull // 변경내역
  billItemName?: stringNull // 규제
  flagRegul: stringNull // 규제 추가/수정/삭제여부
  changeContentsRegul: stringNull // 규제 변경내역
  materialNames?: stringNull // 화학자재명
}

export interface chemRegulHistoryType {
  mdmChemMaterialId: stringNull // 화학자재id
  materialCd: stringNull // 화학자재번호
  materialNameEn: stringNull // 자재영문명
  materialName: stringNull // 자재명
  chemName: stringNull // 화학물질명
  nlId: stringNull // 뉴로라인즈
  limitRepval: stringNull // 적용값
  billItemName: stringNull // 규제
  flag: stringNull // 규제 추가/수정/삭제여부
  changeContents: stringNull // 규제 변경내역
}

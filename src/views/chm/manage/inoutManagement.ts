import { dataBaseType } from '@/types/dataBase'

export interface inoutManagementType extends dataBaseType {
  chmInoutManageId: stringNull // 입출고 번호
  mdmChemMaterialId: stringNull // 화학자재 일련번호
  materialCd: stringNull // 화학자재번호
  yearmonth: stringNull //
  inoutDate: stringNull // 입출고일
  facilityCd: stringNull // 시설 코드
  facilityName: stringNull // 시설명
  carryover: numberNull // 이월량
  chmInTypeCd: stringNull // 입고구분코드
  inAmount: numberNull // 입고량
  inAmountBefore: numberNull //
  inVendorCd: stringNull // 구입업체코드
  inVendorName: stringNull // 구입업체명
  inCorpRegistrationNumber: stringNull // 구입업체 사업자등록번호
  inAddress: stringNull // 구입업체 주소
  inUserName: stringNull // 구입 담당자
  inPhoneNumber: stringNull // 구입 담당자 전화번호
  chmOutTypeCd: stringNull // 출고구분코드
  outAmount: numberNull // 출고령
  outAmountBefore: numberNull //
  outVendorCd: stringNull // 판매업체코드
  outVendorName: stringNull // 판매업체
  outCorpRegistrationNumber: stringNull // 판매업체 사업자등록번호
  outAddress: stringNull // 판매업체 주소
  outUserName: stringNull // 판매 담당자
  outPhoneNumber: stringNull // 판매 담당자 전화번호
  outPurpose: stringNull // 용도
  outBuyerBusinessLicense: stringNull // 구매자 영업허가 구분
  inventory: numberNull // 재고량
  remarks: stringNull // 비고
}

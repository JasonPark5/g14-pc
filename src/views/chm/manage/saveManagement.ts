import { dataBaseType } from '@/types/dataBase'

export interface saveManagementType extends dataBaseType {
  chmSaveManageId: stringNull // 저장보관 번호
  mdmChemMaterialId: stringNull // 화학자재 일련번호
  materialCd: stringNull // 자재코드
  inoutDate: stringNull // 저장보관일
  carryover: numberNull // 이월량
  inAmount: numberNull // 입고량
  inVendorCd: stringNull // 구입업체코드
  inVendorName: stringNull // 구입업체명
  inCorpRegistrationNumber: stringNull // 구입업체 사업자등록번호
  inAddress: stringNull // 구입업체 주소
  outAmount: numberNull // 출고량
  outVendorCd: stringNull // 판매업체코드
  outVendorName: stringNull // 판매업체
  outCorpRegistrationNumber: stringNull // 판매업체 사업자등록번호
  outAddress: stringNull // 판매업체 주소
  inventory: numberNull // 재고량
  remarks: stringNull // 비고
}

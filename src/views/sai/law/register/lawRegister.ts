import { dataBaseType } from '@/types/dataBase'

export interface lawRegisterType extends lawRegisterItemType, dataBaseType {
  saiLawRegisterMasterId: stringNull // 법규등록부 구분 일련번호
  lawId: stringNull // 법령ID
  lawName: stringNull // 법령ID
  gubunName: stringNull // 구분
  sortOrder?: numberNull // 정렬순서
  sortOrder1?: numberNull // 정렬순서
  useFlag: stringNull // 사용여부
  mstEditFlag?: 'C' | 'U' | null | undefined
}
export interface lawRegisterItemType extends dataBaseType {
  saiLawRegisterMasterItemId: stringNull // 법규등록부 항목 일련번호
  saiLawRegisterMasterId: stringNull // 법규등록부 구분 일련번호
  itemName: stringNull // 항목
  relevantClause: stringNull // 관련조항
  requirements: stringNull // 요구사항
  applyConstruction: stringNull // 공사 적용사항
  target: stringNull // 적용대상
  relatedDocument: stringNull // 관련문서(기록)
  sortOrder?: numberNull // 정렬순서
  useFlag: stringNull // 사용여부
  itemEditFlag?: 'C' | 'U' | null | undefined
  lawId: stringNull // 법령ID
  lawName?: stringNull // 법령ID
  gubunName: stringNull // 구분
  sortOrder1?: numberNull // 정렬순서
}
export interface lawRegisterMasterType extends dataBaseType {
  saiLawRegisterMasterId: stringNull // 법규등록부 구분 일련번호
  lawId: stringNull // 법령ID
  lawName: stringNull // 법령ID
  gubunName: stringNull // 구분
  sortOrder?: numberNull // 정렬순서
  sortOrder1?: numberNull // 정렬순서
  useFlag: stringNull // 사용여부
  items: Array<lawRegisterItemType>
}
export interface lawRegisterExcelType extends dataBaseType {
  saiLawRegisterMasterItemId: stringNull // 법규등록부 항목 일련번호
  saiLawRegisterMasterId: stringNull // 법규등록부 구분 일련번호
  lawId: stringNull // 법령ID
  lawName: stringNull // 법령ID
  gubunName: stringNull // 구분
  itemName: stringNull // 항목
  relevantClause: stringNull // 관련조항
  requirements: stringNull // 요구사항
  applyConstruction: stringNull // 공사 적용사항
  target: stringNull // 적용대상
  relatedDocument: stringNull // 관련문서(기록)
  sortOrder?: numberNull // 정렬순서
  sortOrder1: numberNull // 정렬순서
  error_message: stringNull // 구분
  useFlag?: stringNull // 사용여부
}

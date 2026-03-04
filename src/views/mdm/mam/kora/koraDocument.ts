import { dataBaseType } from '@/types/dataBase'

export interface koraDocumentType extends dataBaseType {
  koraDocumentId: stringNull // 화학사고예방관리계획서 일련번호
  plantCd: stringNull // 사업장코드
  koraSubmitTypeCd: stringNull // 화학사고예방관리계획서 제출 구분코드
  koraSubmitLevelCd: stringNull // 화학사고예방관리계획서 작성수준 코드
  documentDate: stringNull // 화학사고예방관리계획서 제출 일자
  documentTitle: stringNull // 화학사고예방관리계획서 제목
  documentContents: stringNull // 화학사고예방관리계획서 내용
}

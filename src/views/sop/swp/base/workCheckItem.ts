import { dataBaseType } from '@/types/dataBase'

export interface workCheckItemType extends dataBaseType {
  sopCheckItemId: stringNull // 점검항목 일련번호
  plantCd: stringNull // 사업장 코드
  sopWorkTypeCd: stringNull // 일반/화기 + 보충작업
  sopWorkTypeName?: stringNull // 일반/화기 + 보충작업
  checkItemName: stringNull // 점검항목명
  sopCheckItemKindCd: stringNull // 체크항목 종류
  sopCheckItemKindName?: stringNull // 체크항목 종류
  useFlag: stringNull // 사용여부
  sortOrder: numberNull // 순번
}

import { dataBaseType } from '@/types/dataBase'

export interface dangerItemType extends dataBaseType {
  chmDangerItemId: stringNull // 위험물 품목 번호
  regulatedItemCd: stringNull // 규제항목 코드
  regulatedItemName: stringNull // 규제항목 명
  regulationDesc: stringNull // 규제항목 설명
  dangerItemName: stringNull // 위험물 품목명
  designatedQuantity: stringNull // 지정수량
  quantity: numberNull // 지정수량 값(kg/리터)
  sortOrder: numberNull // 정렬순서
  useFlag: stringNull // 사용여부
}

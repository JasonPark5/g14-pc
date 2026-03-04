import { dataBaseType } from '@/types/dataBase'

export interface forkLiftMstType extends dataBaseType {
  heqForkLiftTypeItemId: stringNull // 중장비유형별 점검항목일련번호
  heqTypeCd: stringNull // 중장비유형코드
  typeName: stringNull // 구분
  inspectItem: stringNull // 자율점검항목
  sortOrder: numberNull // 순번
}

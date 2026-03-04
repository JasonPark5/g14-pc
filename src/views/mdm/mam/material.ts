import { dataBaseType } from '@/types/dataBase'

export interface materialType extends dataBaseType {
  materialCd: stringNull // 자재코드
  materialNo: stringNull // 자재관리번호
  materialName: stringNull // 자재명(KOR)
  materialNameEn: stringNull // 자재명(ENG)
  chemMaterialFlag: stringNull // 화학자재 여부
  materialGroupCd: stringNull // 자재그룹 코드
  materialGroupName: stringNull // 자재그룹 명
  materialTypeCd: stringNull // 자재분류코드
  useFlag: stringNull // 사용여부
}

export interface materialLicenseType extends dataBaseType {
  limLicenseId: stringNull // 인허가 일련번호
  materialCd: stringNull // 자재코드
  materialName: stringNull // 자재명(KOR)
}

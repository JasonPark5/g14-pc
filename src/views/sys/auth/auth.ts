import { dataBaseType } from '@/types/dataBase'

export interface authType extends dataBaseType {
  sysAuthGrpId?: stringNull // 권한코드 SEQ
  sysAuthGrpName?: stringNull // 권한명
  remark?: stringNull // 권한 설명
  useFlag?: stringNull // 사용여부
  useFlag2?: stringNull // 사용여부
  defaultFlag?: stringNull // 사용자기본권한여부
  dashboardId?: stringNull
  dashboardOrder?: stringNull
  deviceTypeCd?: stringNull
}

export interface authMenuType extends dataBaseType {
  sysAuthGrpId: stringNull
  sysMenuId?: stringNull
  upMenuId?: stringNull
  menuNm?: stringNull
  padMenuNm?: stringNull
  MenuSortStr?: stringNull
  url?: stringNull
  sortOrder?: stringNull
  menuLvl?: stringNull
  userWriteFlag?: stringNull
  deptWriteFlag?: stringNull
  editableFlag?: boolean
  mobileFavoriteFlag?: stringNull
}

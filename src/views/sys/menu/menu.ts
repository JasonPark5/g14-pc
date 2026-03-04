import { dataBaseType } from '@/types/dataBase'

export interface menuType extends dataBaseType {
  sysMenuId?: stringNull // 메뉴 SEQ
  upMenuId?: stringNull // 상위메뉴 ID
  menuNm?: stringNull // 메뉴명
  upMenuNm?: stringNull
  menuNmEn?: stringNull // 메뉴명-영문
  menuNmJa?: stringNull // 메뉴명-일본어
  menuNmZhCn?: stringNull // 메뉴명-중국어간체
  menuNmZhTw?: stringNull // 메뉴명-중국어번체
  menuLvl?: numberNull // 메뉴 레벨
  url?: stringNull // URL
  content?: stringNull // URL
  menuColor?: stringNull // color
  menuIcon?: stringNull // icon
  sortOrder?: stringNull // 정렬순서
  useFlag?: stringNull // 사용여부
  pdfUseFlag?: stringNull // PDF 사용여부
  manualFlag?: stringNull
  dashboardFlag?: stringNull
  deviceTypeCd?: stringNull
  systemFlag?: stringNull
  existManual?: stringNull
  pdfUrl?: stringNull
}

import { dataBaseType } from '@/types/dataBase'

export interface noticeDataType extends dataBaseType {
  sysNoticeId?: stringNull // 공지사항 번호
  noticeClassCd?: stringNull // 공지분류
  noticeClassName?: stringNull // 공지분류명
  noticeTitle?: stringNull // 제목
  noticeContents?: stringNull // 내용
  popupFlag?: stringNull // 팝업여부
  popupStartDate?: stringNull // 팝업시작일자
  popupEndDate?: stringNull // 팝업종료일자
  vendorFlag?: stringNull
}

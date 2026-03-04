import { dataBaseType } from '@/types/dataBase'

export interface constructionPopupParamType {
  sopConstructionId: stringNull
}

export interface constructionTaskType {
  insertUrl?: stringNull
  deleteUrl?: stringNull
}

export interface constructionType {
  sopConstructionId: stringNull // 공사 일련번호
  constructionName?: stringNull // 공사명
  constructionDetails?: stringNull // 공사내역
  constructionStartDate?: stringNull // 공사 시작일
  constructionEndDate?: stringNull // 공사 종료일
  period?: arrayString | null
  constructionFinishFlag?: stringNull // 공사 종료 여부
  safetyHealthManageCost?: numberNull // 안전보건관리비(총 액)
  costCenter?: stringNull // 코스트센터
  onSiteManager?: stringNull // 현장 총괄
  safetyManager?: stringNull // 안전책임자
  vendorCd?: stringNull // 주 공사업체
  sopMocId?: stringNull // MOC 일련번호
  regUserId?: stringNull // 등록자 ID
  chgUserId?: stringNull // 수정자 ID
  vendors?: Array<constructionVendorType> | null // 참영업체
  deleteVendors?: Array<constructionVendorType> | null // 참영업체 [삭제]
  entryVendors?: Array<constructionEntryVendorType> | null // 업체출입 명단
  deleteEntryVendors?: Array<constructionEntryVendorType> | null // 업체출입 명단 [삭제]
  entryUsers?: Array<constructionEntryUserType> | null // 출입자 명단
  deleteEntryUsers?: Array<constructionEntryUserType> | null // 출입자 명단 [삭제]
  equipments?: Array<constructionEquipmentType> | null // 장비 명세표
  deleteEquipments?: Array<constructionEquipmentType> | null // 장비 명세표 [삭제]
}

export interface constructionVendorType extends dataBaseType {
  sopConstructionId: stringNull
  sopConstructionRelationVendorId: stringNull // 공사 참여업체 일련번호
  vendorCd: stringNull // 참여업체 코드
  vendorName: stringNull // 참여업체 명
  constructionDetails: stringNull // 공사내역
  participationStartDate: stringNull // 참여 시작일
  participationEndDate: stringNull // 참여 종료일
  period: arrayString | null
}

export interface constructionEntryVendorType extends dataBaseType {
  sopConstructionEntryVendorsId?: stringNull // 공사 출입업체 일련번호
  sopConstructionId?: stringNull // 공사 일련번호
  vendorCd: stringNull // 참여업체 코드
  vendorName: stringNull // 참여업체 명
  jobName: stringNull // 작업명
  jobDate: stringNull // 작업일자
  jobPlace: stringNull // 작업장소
  personnel: stringNull // 인원
  status: stringNull // 상태
}

export interface constructionEntryUserType extends dataBaseType {
  sopConstructionEntryUsersId: stringNull // 공사 출입자 일련번호
  sopConstructionId: stringNull // 공사 일련번호
  jobName: stringNull // 직책
  userId: stringNull
  userName: stringNull // 이름
  birthDate: stringNull // 생년월일
  address: stringNull // 주소
  sex: stringNull // 성별
  eduDate: stringNull // 교육만기일
  resident: stringNull // 상주
}

export interface constructionEquipmentType extends dataBaseType {
  sopConstructionEquipmentId: stringNull // 공사 장비 일련번호
  sopConstructionId: stringNull // 공사 일련번호
  equipmentName: stringNull // 설비명
  carNo: stringNull // 차량번호
  standard: stringNull // 규격
  equipmentCount: stringNull // 수량
  safeFlag: stringNull // 안전장치 부착여부
  remark: stringNull // 비고
}

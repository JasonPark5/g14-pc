import { dataBaseType } from '@/types/dataBase'

export interface wasteType extends dataBaseType {
  envWasteAllbaroId?: stringNull // 폐기물 인계서 시스템일련번호
  plantCd?: stringNull // 사업장
  userId?: stringNull
  envWasteAllbaroNo?: stringNull // 인계번호
  allbaroDt?: stringNull // 인계일자
  endFlag?: stringNull // 확정여부
  envWasteCd?: stringNull // 폐기물명 코드
  envWasteMstId?: stringNull // 폐기물종류 일련번호
  envWasteKindName?: stringNull
  state?: stringNull // 성상
  envWasteName?: stringNull // 폐기물명
  wasteVolume?: stringNull // 위탁량
  wasteVolumeUnit?: stringNull // 단위
  wasteVolumeInsu?: stringNull // 처리자인수량
  transportName?: stringNull // 운반자명
  carNo?: stringNull // 차량번호
  processName?: stringNull // 처리자명
  processMethod?: stringNull // 처리방법
  processMethodName?: stringNull
  processLocation?: stringNull // 처리장소
  transferName?: stringNull // 인계자명
  emitterFlag?: stringNull // 공동배출자여부
  inputFlag?: stringNull // 입력구분
  officeName?: stringNull // 관할관청
  status?: stringNull // 진행상태
  processResult?: stringNull // 처리결과
  transportIp?: stringNull // 운반IP동일
  processIp?: stringNull // 처리IP동일
  remark?: stringNull // 예외사유
}

export interface wasteVolumeType extends dataBaseType {
  envWasteVolumeId?: stringNull // 월별 폐기물 일련번호
  plantCd?: stringNull // 사업장코드
  wasteYear?: stringNull // 처리년도
  wasteMonth?: stringNull // 처리월
  wasteTransport?: stringNull // 폐기물 운반횟수
  salesVolume?: stringNull // 생산량
  wasteOccurVolume?: stringNull
  wasteCost?: stringNull
  occurs?: Array<any> // 폐기물종류별 발생량
  userId?: stringNull
  wasteYm?: stringNull
}

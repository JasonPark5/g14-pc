import { dataBaseType } from '@/types/dataBase'

export interface workMapType extends dataBaseType {
  sopMapId?: stringNull // 지도 일련번호
  plantCd?: stringNull // 사업장 코드
  mapName?: stringNull // 지도명
  ratio?: numberNull // 지도 넓이에 따른 높이 비율
  sortOrder?: numberNull // 순번
  useFlag?: stringNull // 사용여부
  sysAttachFileId?: stringNull // 첨부파일코드 SEQ
  contentType?: stringNull // Content-Type
  mapProcesses?: Array<workMapProcessType>
  deleteMapProcesses?: Array<workMapProcessType>
  sopFireFightingMapId?: stringNull // 소방시설 배치도면 일련번호
  sopFireFightingLocationId?: stringNull // 소방시설 배치위치 일련번호
}

export interface workMapProcessType extends dataBaseType {
  sopMapProcessId: stringNull // 지도별 공정 일련번호
  sopMapId: stringNull // 지도 일련번호
  processCd: stringNull // 공정코드
  processName: stringNull // 공정명
  mapName: stringNull // 지도명
  x: numberNull // X좌표
  y: numberNull // Y좌표
  w: numberNull // 넓이
  h: numberNull // 높이
}

import { dataBaseType } from '@/types/dataBase'

export interface commonType {
  processCd?: stringNull
  deptCd?: stringNull
  revisionNum?: stringNull
  groupId?: stringNull
  sysRevision?: numberNull
  revisionContent?: stringNull
  sopMocId?: stringNull
}

export interface powerMachineType extends dataBaseType, commonType {
  plantCd?: stringNull // 사업장코드
  psiPowerEquipmentId?: stringNull // 동력기계일련번호
  psiPowerEquipmentNo?: stringNull // 동력기계번호
  powerMachineName?: stringNull // 동력기계명
  equipmentCd?: stringNull // 설비코드
  specInfo?: stringNull // 명세
  matQuality?: stringNull // 주요재질
  inFacility?: stringNull // 전동기용량(kW)
  outFacility?: stringNull // 전동기용량(kW)
  motorVol?: stringNull // 전동기용량(kW)
  protectType?: stringNull // 방호장치종류
  remarks?: stringNull // 비고
}

export interface deviceEquipType extends dataBaseType, commonType {
  psiDeviceEquipmentId?: stringNull // 장치일련번호
  plantCd?: stringNull // 사업장코드
  equipmentNo?: stringNull // 장치번호
  deviceName?: stringNull // 장치명
  equipmentCd?: stringNull // 설비코드
  deviceTypeCd?: stringNull // 장치분류
  deviceTypeName?: stringNull // 장치분류
  detailItems?: Array<deviceDetailType>
}

export interface deviceDetailType extends dataBaseType {
  psiDeviceEquipmentId?: stringNull // 장치일련번호
  deviceTypeCd?: stringNull // 장치
  devicePartCd?: stringNull // 장치구분
  devicePartName?: stringNull // 장치구분명
  inMaterials?: stringNull // 내용물
  volume?: stringNull // 용량
  pressOperation?: stringNull // 압력(MPa)-운전
  pressDesign?: stringNull // 압력(MPa)-설계
  tempOperation?: stringNull // 온도(℃)-운전
  tempDesign?: stringNull // 온도(℃)-설계
  materialMain?: stringNull // 사용재질-본체
  materialSubPart?: stringNull // 사용재질-부속품
  materialGasket?: stringNull // 사용재질-개스킷
  weldingEfficiency?: stringNull // 용접효율
  calculateThick?: stringNull // 계산두께(mm)
  corrosionAllowance?: stringNull // 부식여유(mm)
  useThick?: stringNull // 사용두께(mm)
  afterHeatTreatYn?: stringNull // 후열처리여부
  nondestructMethod?: stringNull // 비파괴검사방법
  nondestructPercent?: stringNull // 비파괴검사율(%)
  applicableLaws?: stringNull // 적용법령
  conectorStatus?: stringNull // 연결구 상태
  designStandards?: stringNull // 설계표준
}

export interface pipeType extends dataBaseType, commonType {
  psiPipeGasketId?: stringNull // 배관및개스킷 일련번호
  plantCd?: stringNull // 사업장코드
  pipeTypeCd?: stringNull // 분류코드
  pipeName?: stringNull // 유체의명칭또는구분
  designPress?: stringNull // 설계압력(MPa)
  designTemp?: stringNull // 설계온도(℃)
  pipeMaterial?: stringNull // 배관재질
  gasketMaterial?: stringNull // 개스킷 재질 및 형태
  noneDestructPercent?: stringNull // 비파괴검사율
  afterHeatTreatFlag?: stringNull // 후열처리여부
  remarks?: stringNull // 비고
}

export interface valveType extends dataBaseType, commonType {
  psiValveRuptureId?: stringNull // 안전밸브및파열판일련번호
  plantCd?: stringNull // 사업장코드
  valveRuptureNo?: stringNull // 계기번호
  equipmentCd?: stringNull // 설비코드
  inMaterial?: stringNull // 내용물
  conditionVal?: stringNull // 상태
  outVolume?: stringNull // 배출용량(kghr)
  regulVolume?: stringNull // 정격용량(kghr)
  nozzleSizeIn?: stringNull // 노즐크기-입구
  nozzleSizeOut?: stringNull // 노즐크기-출구
  protectSerial?: stringNull // 보호기기압력-기기번호
  protectOperation?: stringNull // 보호기기압력-운전(MPa)
  protectDesign?: stringNull // 보호기기압력-설계(MPa)
  valveSetting?: stringNull // 안전밸브-설정(MPa)
  safetyValveMaterial?: stringNull // 안전밸브-몸체재질
  safetyValveTrim?: stringNull // 안전밸브-Trim재질
  precisionVal?: stringNull // 정밀도(오차범위)
  outConnect?: stringNull // 배출연결부위
  outReason?: stringNull // 배출원인
  formVal?: stringNull // 형식
}

export interface docuType extends dataBaseType, commonType {
  documentClassCd?: stringNull // 문서분류 일련번호
  psiDocumentId?: stringNull // 문서 일련번호
  documentNo?: stringNull // 문서번호
  plantCd?: stringNull // 사업장코드
  documentTitle?: stringNull // 문서명
  documentContents?: stringNull // 문서내용
  useFlag?: stringNull // 사용여부
  deleteFlag?: stringNull // 삭제여부
}

export interface interlockType extends dataBaseType, commonType {
  psiInterLockId?: stringNull // 인터락 일련번호
  plantCd?: stringNull // 사업장코드
  interLockNo?: stringNull // 인터록 번호
  facilityName?: stringNull // 대상설비번호
  temperature?: stringNull // 온도
  pressure?: stringNull // 압력
  liquidLevel?: stringNull // 액위
  etc?: stringNull // 기타
  detectorNum?: stringNull // 감지기번호
  lastOperationEquipment?: stringNull // 최종작동설비
  operationStopRange?: stringNull // 가동중지범위
  checkCycle?: stringNull // 점검주기
  remark?: stringNull // 비고
  tempOperation?: stringNull
  tempDesign?: stringNull
}

export interface dwgType extends dataBaseType, commonType {
  diagramClassCd?: stringNull // 도면분류 일련번호
  psiDiagramId?: stringNull // 도면 일련번호
  diagramNo?: stringNull // 도면번호
  plantCd?: stringNull // 사업장코드
  diagramTitle?: stringNull // 도면명
  diagramContents?: stringNull // 도면내용
  useFlag?: stringNull // 사용여부
  deleteFlag?: stringNull // 삭제여부
}

export interface frsType extends dataBaseType, commonType {
  psiFireproofStructureId?: stringNull // 내화구조명세 일련번호
  plantCd?: stringNull // 사업장코드
  fireproofStructureName?: stringNull // 내화구조설비및지역명
  fireproofProofPart?: stringNull // 내화부위
  testStndardTime?: stringNull // 시험기준및시간
  remark?: stringNull // 비고
}

export interface fireExtinguisherType extends dataBaseType, commonType {
  fireEquipmentId?: stringNull // 소화설비설치계획 일련번호
  plantCd?: stringNull // 사업장코드
  installLocation?: stringNull // 설치지역
  fireExtinguisher?: stringNull // 소화기
  autoSpreadFire?: stringNull // 자동확산소화기
  autoFire?: stringNull // 자동소화장치
  standPipe?: stringNull // 옥내소화전
  sprinkler?: stringNull // 스프링쿨러
  waterSpray?: stringNull // 물분부소화설비
  poSpray?: stringNull // 포소화설비
  co2Spray?: stringNull // CO2소화설비
  halogenSpray?: stringNull // 할로겐화합물소화설비
  cleanSpray?: stringNull // 청정소화약제소화설비
  outdoorPipe?: stringNull // 옥외소화전
}

export interface fireDetectorType extends dataBaseType, commonType {
  fireDetectionId?: stringNull // 화재탐지및경보설비 일련번호
  plantCd?: stringNull // 사업장코드
  installLocation?: stringNull // 설치지역
  singleAlarm?: stringNull // 단독경보형감지기
  emergencyAlarm?: stringNull // 비상경보설비
  startAlarm?: stringNull // 시작경보기
  autoDetection?: stringNull // 자동화재탐지설비
  emergencyBroadcast?: stringNull // 비상방송설비
  autoBreakingnews?: stringNull // 자동화재속보설비
  integrationSystem?: stringNull // 통합감시시설
  shortAlarm?: stringNull // 누전경보기
}

export interface gasLeakType extends dataBaseType, commonType {
  psiGasAlarmId?: stringNull // 가스누출감지경보기 일련번호
  plantCd?: stringNull // 사업장코드
  gasDetectorNo?: stringNull // 가스감지기NO
  sensingObject?: stringNull // 감지대상
  installLocation?: stringNull // 설치장소
  operationTime?: stringNull // 작동시간
  detectMethod?: stringNull // 측정방식
  alarmHighValue?: stringNull // 경보설정값-high
  alarmHighhighValue?: stringNull // 경보설정값-highhigh
  alarmSettingLocation?: stringNull // 경보기설치위치
  precisionVal?: stringNull // 정밀도
  measureInfo?: stringNull // 조치내용
  management?: stringNull // 유지관리
  remark?: stringNull // 비고
}

export interface washerType extends dataBaseType, commonType {
  psiFaceWashingId?: stringNull // 세안세척설비 일련번호
  plantCd?: stringNull // 사업장코드
  managerNo?: stringNull // 관리번호
  areaName?: stringNull // 지역(공정)
  location?: stringNull // 설치장소
  warmMethod?: stringNull // 보온방법
  checkCycle?: stringNull // 점검주기
  remark?: stringNull // 비고
}

export interface protectorType extends dataBaseType, commonType {
  psiProtectionEpuipmentId?: stringNull // 안전보호장구_비상방재물품_일련번호
  plantCd?: stringNull // 사업장코드
  safetyEquipTypeCd?: stringNull // 안전보호장구_비상방재물품 구분
  manageNo?: stringNull // 관리번호
  areaName?: stringNull // 지역(공정)
  itemName?: stringNull // 품목
  location?: stringNull // 비치장소
  checkCycle?: stringNull // 점검주기
  remarks?: stringNull // 비고
}

export interface exhaustType extends dataBaseType, commonType {
  psiLocalVentilationId?: stringNull // 국소배기장치 일련번호
  plantCd?: stringNull // 사업장코드
  processName?: stringNull // 공정또는작업장명
  inOutFlag?: stringNull // 실내외구분
  sourceName?: stringNull // 발생원
  harmfulTypeCd?: stringNull // 유해물질종류
  hoodForm?: stringNull // 후드형식
  hoodVelocity?: stringNull // 후드의제어풍속
  reactionVelocity?: stringNull // 덕트내반응속도
  airVolume?: stringNull // 배풍량
  motorVolume?: stringNull // 전동기용량
  motorExplosionForm?: stringNull // 전동기방폭형식
  airCleanType?: stringNull // 공기정화장치형식
  airExhaustOrder?: stringNull // 배기 및 처리순서
}

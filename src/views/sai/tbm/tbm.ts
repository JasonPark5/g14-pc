import { dataBaseType } from '@/types/dataBase'

export interface tbmPopupParamType extends dataBaseType {
  tbmId?: stringNull
}

export interface tbmType extends dataBaseType {
  tbmId?: stringNull
  sopWorkPermitId?: stringNull
  sopConstructionId?: stringNull
  permitTypeCd?: stringNull
  tbmNo?: stringNull
  plantCd?: stringNull
  permitDate?: stringNull // 참조 작업허가서 날짜
  workName?: stringNull // 작업명
  tbmLeaderDept?: stringNull // TBM리더 부서or(외부업체인 경우)회사
  tbmLeaderId?: stringNull // TBM리더 이름
  tbmLeaderSign?: stringNull // TBM리더 전자서명
  tbmName?: stringNull // TBM 타이틀
  tbmDate?: stringNull // TBM 진행 날짜
  tbmStartTime?: stringNull // 시작시간
  tbmEndTime?: stringNull // 종료시간
  tbmLocation?: stringNull // 장소
  tbmContents?: stringNull // 작업내용
  preInspectionResult?: stringNull // 사전점검결과
  tbmResult?: stringNull // TBM 결과 (중점대책의 실효성)
  tbmCompleteFlag?: stringNull // TBM 진행단계
  processCd?: stringNull // 공정코드
  vendorCd?: stringNull // 협력사 코드
  vendorName?: stringNull
  permitNo?: stringNull // 참조 작업허가서 번호
  preInspections?: stringNull // 사전점검에서 체크한 항목들. XXX,XXX,XXX 형식

  regUserId?: stringNull // 작성자 ID
  regUserName?: stringNull
  regUserDeptName?: stringNull
  regDtStringTime?: stringNull
  regDt?: stringNull
  chgUserId?: stringNull
  chgUserName?: stringNull
  chgUserDeptName?: stringNull
  chgDtStringTime?: stringNull
  chgDt?: stringNull
  tbmAttendeeList: Array<tbmAttendeeType> | null
  deleteTbmAttendeeList: Array<tbmAttendeeType> | null
  tbmRiskList: Array<tbmRiskType> | null
  deleteTbmRiskList: Array<tbmRiskType> | null
  tbmHazardEquipModelList: Array<tbmHazardEquipType> | null
  deleteTbmHazardEquipModelList: Array<tbmHazardEquipType> | null
}

export interface tbmRiskType extends dataBaseType {
  tbmId: stringNull
  tbmRiskId: stringNull
  tbmJobStep?: stringNull
  tbmRiskProcess?: stringNull
  ramAfterRiskThirdStandardId?: stringNull
  tbmRisk?: stringNull
  tbmImprove?: stringNull
  tbmRiskKeyFlag?: stringNull
  tbmRiskType?: stringNull
}

export interface tbmHazardEquipType extends dataBaseType {
  tbmId: stringNull
  tbmHazardEquipId: stringNull
  saiContructFacilityId?: stringNull
  emplacementPlace?: stringNull
  plantName?: stringNull
  machineryClassification?: stringNull
  machineryName?: stringNull
  volume?: stringNull
  inspectionSubjectFlag?: stringNull
  inspectionSubjectFlagName?: stringNull
  itemNo?: stringNull
  machineryClassificationName?: stringNull
  resultCd?: stringNull
  gradeName?: stringNull
  equipmentCd?: stringNull
  equipmentName?: stringNull
}

export interface tbmAttendeeType extends dataBaseType {
  tbmId: stringNull
  tbmAttendeeId: stringNull
  tbmAttendeeDept?: stringNull // 소속명
  vendorCd?: stringNull
  tbmAttendeeUserId?: stringNull
  tbmAttendeeName?: stringNull
  tbmAttendeeJob?: stringNull
  healthStatusCd?: stringNull
  mentalFlag?: stringNull
  phychologicalFlag?: stringNull
  physicalFlag?: stringNull
  physicalDefectFlag?: stringNull
  attendeeType?: stringNull
  remark?: stringNull
  electronSignature?: stringNull
}

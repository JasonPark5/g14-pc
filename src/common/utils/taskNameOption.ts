import { targetLiteralType } from '@utils/taskTarget'
import selectConfig from '@utils/selectConfig'

type valueKeyType =
  | 'equipmentCd'
  | 'facilityCd'
  | 'vendorCd'
  | 'processCd'
  | 'vendorUserCd'
  | 'limLicenseId'
  | 'limLicenseKindId'
  | 'materialCd'
  | 'materialTypeCd'
  | 'mdmChemMaterialId'
  | 'userId'
  | 'deptCd'
  | 'seniorId'
  | 'sopConstructionId'
  | 'sopMocId'
  | 'ramRiskAssessmentPlanId'
  | 'eduQuestionMstId'
  | 'heaCheckupPlanId'
  | 'casno'
  | 'heaInvestigationPlanId'
  | 'eduCourseId'
  | 'safetyGearName'
  | 'sopEmergencyPlanId'
  | 'chmDangerMstId'
  | 'sopFireFightingId'
  | 'sopFireFightingLocationId'
  | 'sopEmergencyTrainingId'
  | 'seniorStatusId'
  | 'eduEducationId'
  | 'envAirMstOutletId'
  | 'envAirMstPreventiveId'
  | 'envAirMstDischargeId'
  | 'envWasteMstId'
  | 'hhmHazardousMachineryId'
  | 'sopWorkPermitId'
  | 'workMeasurementPlanId'
  | 'ramRiskHazardId'
  | 'mdmSopId'
  | 'heqForkLiftId'
  | 'trainingScenarioNo'
  | 'sopMapId'
  | 'heaClosedSpaceId'
  | 'sopGasId'
  | 'envSoilPollutionTargetFacilityId'
  | 'envAirMstInspectItemId'
  | 'envGhgRawFuelId'
  | 'envGhgFacilityFuelId'
  | 'envGhgFacilityId'
  | 'processNo'
  | 'enWaterMstInspectItemId'
  | 'envWaterMstOutletId'
  | 'envWaterMstPreventiveId'
  | 'envTmsMstId'
  | 'envTmsMstMainId'
  | 'evaluateeId'
  | 'saiSuperEvaluationId'
  | 'heaCheckupResultOpinionId'
type paramsType = Record<string, boolean | string | number | null | undefined>
type nameOptionsType = {
  targetKey: targetLiteralType
  url: string
  params: {
    key?: boolean
    formatkey?: boolean
  } & paramsType
  nameKey: string
  valueKey: valueKeyType
  valueKey2?: valueKeyType
}

/** name options */
const nameOptions: Array<nameOptionsType> = [
  {
    /** 설비 */
    targetKey: 'equip',
    url: selectConfig.mdm.equipment.list.url,
    params: {
      key: true
    },
    nameKey: 'equipmentName',
    valueKey: 'equipmentCd'
  },
  {
    /** 사용자 */
    targetKey: 'user',
    url: selectConfig.mdm.user.list.url,
    params: {
      key: true
    },
    nameKey: 'userName',
    valueKey: 'userId'
  },
  {
    /** 부서 / 사용자 */
    targetKey: 'deptUser',
    url: selectConfig.mdm.user.list.url,
    params: {
      key: true
    },
    nameKey: 'totalName',
    valueKey: 'userId'
  },
  {
    /** 상위 공정 */
    targetKey: 'upProcess',
    url: selectConfig.mdm.process.nameget.url,
    params: {
      formatkey: true
    },
    nameKey: 'processName',
    valueKey: 'processCd'
  },
  {
    /** 단위 공정 */
    targetKey: 'process',
    url: selectConfig.mdm.process.nameget.url,
    params: {
      formatkey: true
    },
    nameKey: 'processName',
    valueKey: 'processCd'
  },
  {
    /** 부서 */
    targetKey: 'dept',
    url: selectConfig.mdm.dept.list.url,
    params: {
      key: true
    },
    nameKey: 'deptName',
    valueKey: 'deptCd'
  },
  {
    /** 시설 */
    targetKey: 'facility',
    url: selectConfig.env.facility.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'facilityName',
    valueKey: 'facilityCd'
  },
  {
    /** 업체 */
    targetKey: 'vendor',
    url: selectConfig.mdm.cim.vendor.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'vendorName',
    valueKey: 'vendorCd'
  },
  {
    /** 업체 직원 */
    targetKey: 'vendorUser',
    url: selectConfig.mdm.cim.vendor.user.list.url,
    params: {
      key: true
    },
    nameKey: 'totalName',
    valueKey: 'vendorUserCd'
  },
  {
    /** 인허가현황 */
    targetKey: 'license',
    url: selectConfig.sop.lim.lincense.card.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'limLicenseKindName',
    valueKey: 'limLicenseId'
  },
  {
    /** 인허가종류  */
    targetKey: 'licenseKind',
    url: selectConfig.sop.lim.lincense.kind.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'limLicenseKindName',
    valueKey: 'limLicenseKindId'
  },
  {
    /** 자재  */
    targetKey: 'material',
    url: selectConfig.mdm.mam.material.list.url,
    params: {
      key: true
    },
    nameKey: 'materialName',
    valueKey: 'materialCd'
  },
  {
    /** 자재종류  */
    targetKey: 'materialType',
    url: selectConfig.mdm.mam.material.type.name.url,
    params: {
      formatkey: true
    },
    nameKey: 'materialTypeName',
    valueKey: 'materialTypeCd'
  },
  {
    /** 화학자재  */
    targetKey: 'chemMaterial',
    url: selectConfig.mdm.mam.chem.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'mdmChemMaterialName',
    valueKey: 'mdmChemMaterialId'
  },
  {
    /** 선임명  */
    targetKey: 'senior',
    url: selectConfig.mdm.senior.list.url,
    params: {
      key: true
    },
    nameKey: 'seniorName',
    valueKey: 'seniorId'
  },
  {
    /** 공사  */
    targetKey: 'construction',
    url: selectConfig.sop.scm.construction.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'constructionName',
    valueKey: 'sopConstructionId'
  },
  {
    /** MOC  */
    targetKey: 'moc',
    url: selectConfig.sop.moc.change.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'mocTotal',
    valueKey: 'sopMocId'
  },
  {
    /** 위험성평가  */
    targetKey: 'riskAssessment',
    url: selectConfig.ram.assessPlan.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'assessmentName',
    valueKey: 'ramRiskAssessmentPlanId'
  },
  {
    /** 교육 문제풀이  */
    targetKey: 'eduQuiz',
    url: selectConfig.sop.edu.quiz.mst.list.url,
    params: {
      formatkey: true
    },
    nameKey: 'eduQuestionMstName',
    valueKey: 'eduQuestionMstId'
  },
  {
    /** 건강검진  */
    targetKey: 'checkup',
    url: selectConfig.hea.checkup.plan.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'checkupName',
    valueKey: 'heaCheckupPlanId'
  },
  {
    /** 근골격계 조사계획  */
    targetKey: 'muscle',
    url: selectConfig.hea.muscleSystem.investigationPlan.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'investigationPlanName',
    valueKey: 'heaInvestigationPlanId'
  },
  {
    /** 교육과정  */
    targetKey: 'eduCourse',
    url: selectConfig.sop.edu.course.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'educationCourseName',
    valueKey: 'eduCourseId'
  },
  {
    /** 보호구  */
    targetKey: 'safetyGear',
    url: selectConfig.sop.sas.safetyGear.list.url,
    params: {
      key: true
    },
    nameKey: 'safetyGearName',
    valueKey: 'safetyGearName'
  },
  {
    /** 훈련시나리오  */
    targetKey: 'trainingScenario',
    url: selectConfig.sop.eap.scenario.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'trainingScenarioName',
    valueKey: 'sopEmergencyPlanId',
    valueKey2: 'trainingScenarioNo'
  },
  {
    /** 위험물저장소  */
    targetKey: 'hazardStorage',
    url: selectConfig.chm.danger.master.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'chmDangerArea',
    valueKey: 'chmDangerMstId'
  },
  {
    /** 소방설비  */
    targetKey: 'fireFightingEquip',
    url: selectConfig.fft.fireFighting.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'fireFightingName',
    valueKey: 'sopFireFightingId'
  },
  {
    /** 소방설비 배치 장소  */
    targetKey: 'fireFightingLocation',
    url: selectConfig.fft.base.location.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'locationName',
    valueKey: 'sopFireFightingLocationId'
  },
  {
    /** 비상대응 훈련 목록  */
    targetKey: 'training',
    url: selectConfig.sop.eap.training.plan.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'totalName',
    valueKey: 'sopEmergencyTrainingId'
  },
  {
    /** 선해임 현황  */
    targetKey: 'seniorStatus',
    url: selectConfig.mdm.senior.status.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'totalName',
    valueKey: 'seniorStatusId'
  },
  {
    /** 교육계획 및 결과  */
    targetKey: 'edu',
    url: selectConfig.sop.edu.result.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'totalName',
    valueKey: 'eduEducationId'
  },
  {
    /** 대기 배출구  */
    targetKey: 'airOutlet',
    url: selectConfig.env.air.mst.outlet.get.url,
    params: {
      key: true
    },
    nameKey: 'outletName',
    valueKey: 'envAirMstOutletId'
  },
  {
    /** 대기 방지시설  */
    targetKey: 'airPreventive',
    url: selectConfig.env.air.mst.preventive.get.url,
    params: {
      key: true
    },
    nameKey: 'preventiveName',
    valueKey: 'envAirMstPreventiveId'
  },
  {
    /** 대기 배출시설  */
    targetKey: 'airDischarge',
    url: selectConfig.env.air.mst.discharge.get.url,
    params: {
      key: true
    },
    nameKey: 'dischargeName',
    valueKey: 'envAirMstDischargeId'
  },
  {
    /** 폐기물 종류  */
    targetKey: 'wasteMst',
    url: selectConfig.env.waste.mst.list.url,
    params: {
      key: true
    },
    nameKey: 'envWasteName',
    valueKey: 'envWasteMstId'
  },
  {
    /** 유해위험기계기구 */
    targetKey: 'hazardequip',
    url: selectConfig.sop.hhm.hazard.check.list.url,
    params: {
      key: true
    },
    nameKey: 'machineryName',
    valueKey: 'hhmHazardousMachineryId'
  },
  {
    /** 작업허가서  */
    targetKey: 'workPermit',
    url: selectConfig.sop.swp.workPermit.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'swpTotal',
    valueKey: 'sopWorkPermitId'
  },
  {
    /** 작업환경측정  */
    targetKey: 'workMeasure',
    url: selectConfig.sai.workmeas.plan.list.url,
    params: {
      key: true
    },
    nameKey: 'measPlanContent',
    valueKey: 'workMeasurementPlanId'
  },
  {
    /** 유해위험요인  */
    targetKey: 'riskHazard',
    url: selectConfig.ram.riskHazard.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'riskHazardName',
    valueKey: 'ramRiskHazardId'
  },
  {
    /** 단위작업  */
    targetKey: 'sop1',
    url: selectConfig.mdm.sop.job.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'sopName',
    valueKey: 'mdmSopId'
  },
  {
    /** 중장비 */
    targetKey: 'heqfork',
    url: selectConfig.sop.heq.forkLift.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'facilityName',
    valueKey: 'heqForkLiftId'
  },
  {
    /** 밀폐공간 */
    targetKey: 'closedSpace',
    url: selectConfig.hea.closedspaceMap.base.url,
    params: {
      key: true
    },
    nameKey: 'heaClosedSpaceName',
    valueKey: 'heaClosedSpaceId'
  },
  {
    /** 가스항목 */
    targetKey: 'gas',
    url: selectConfig.sop.swp.gas.list.url,
    params: {
      key: true
    },
    nameKey: 'gasName',
    valueKey: 'sopGasId'
  },
  {
    /** 토양오염대상시설 */
    targetKey: 'soilPollutionFacility',
    url: selectConfig.env.soil.facility.list.url,
    params: {
      key: true
    },
    nameKey: 'facilityName',
    valueKey: 'envSoilPollutionTargetFacilityId'
  },
  {
    /** 온실가스 배출원(연료) */
    targetKey: 'ghgFuel',
    url: selectConfig.env.ghg.rawFuel.list.url,
    params: {
      key: true
    },
    nameKey: 'rawFuelName',
    valueKey: 'envGhgRawFuelId'
  },
  {
    /** 온실가스 배출시설별 설비 */
    targetKey: 'ghgFacilityEquipment',
    url: selectConfig.env.ghg.facility.equipment.url,
    params: {
      formatkey: true
    },
    nameKey: 'equipmentName',
    valueKey: 'envGhgFacilityFuelId'
  },
  {
    /** 온실가스 배출시설 */
    targetKey: 'ghgFacility',
    url: selectConfig.env.ghg.facility.commonList.url,
    params: {
      key: true
    },
    nameKey: 'facilityName',
    valueKey: 'envGhgFacilityId'
  },
  {
    /** 환경 단위 공정 */
    targetKey: 'envProcess',
    url: selectConfig.env.process.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'processName',
    valueKey: 'processCd'
  },
  {
    /** 대기 검사항목 */
    targetKey: 'airInspectItemMst',
    url: selectConfig.env.air.mst.inspect.get.url,
    params: {
      key: true
    },
    nameKey: 'envAirMstInspectItemName',
    valueKey: 'envAirMstInspectItemId'
  },
  {
    /** 수질 검사항목 */
    targetKey: 'waterInspectItemMst',
    url: selectConfig.env.water.mst.inspect.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'envWaterMstInspectItemName',
    valueKey: 'enWaterMstInspectItemId'
  },
  {
    /** 환경 공정 */
    targetKey: 'envOnlyProcess',
    url: selectConfig.env.procWork.onlyProc.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'processName',
    valueKey: 'processNo'
  },
  {
    /** 수질 배출구  */
    targetKey: 'waterOutlet',
    url: selectConfig.env.water.mst.outlet.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'envWaterMstOutletName',
    valueKey: 'envWaterMstOutletId'
  },
  {
    /** 관리 감독자 */
    targetKey: 'checkUser',
    url: selectConfig.mdm.user.list.url,
    params: {
      key: true
    },
    nameKey: 'userName',
    valueKey: 'userId'
  },
  {
    /** 수질 방지시설  */
    targetKey: 'waterPreventive',
    url: selectConfig.env.water.mst.preventive.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'envWaterMstPreventiveName',
    valueKey: 'envWaterMstPreventiveId'
  },
  {
    /** TMS 마스터  */
    targetKey: 'tmsMst',
    url: selectConfig.env.air.tms.mst.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'inspectItem',
    valueKey: 'envTmsMstId'
  },
  {
    /** TMS 메인 마스터  */
    targetKey: 'tmsMstMain',
    url: selectConfig.env.air.tms.main.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'tmsNo',
    valueKey: 'envTmsMstMainId'
  },
  {
    /** 관리감독자 평가대상자  */
    targetKey: 'evaluatee',
    url: selectConfig.sai.sse.supervisor.mst.evaluatee.nameGet.url,
    params: {
      formatkey: true
    },
    nameKey: 'evaluateeName',
    valueKey: 'evaluateeId'
  },
  {
    /** 관리감독자 평가  */
    targetKey: 'evaluatee',
    url: selectConfig.sai.sse.superInspection.get.url,
    params: {
      formatkey: true
    },
    nameKey: 'checkName',
    valueKey: 'saiSuperEvaluationId'
  },
  {
    /** 유소견자  */
    targetKey: 'checkupOpinion',
    url: selectConfig.hea.checkup.opinion.list.url,
    params: { key: true },
    nameKey: 'totalName',
    valueKey: 'heaCheckupResultOpinionId'
  }
]

/** targetKey에 따른 name options 찾아 반환 */
export function getNameOption(targetKey: targetLiteralType): nameOptionsType {
  return _.find(nameOptions, { targetKey: targetKey }) as nameOptionsType
}

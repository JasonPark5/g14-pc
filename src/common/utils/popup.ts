import selectConfig from '@utils/selectConfig'
import { targetLiteralType } from '@utils/taskTarget'

// 1. 테이블 컬럼 세팅 및 search box안 세팅은 popupJson 파일에서
import * as popupJson from './popupTable'

/** 팝업 options */

const popupOptions = [
  {
    targetKey: 'equip',
    title: '설비',
    width: '80%',
    isFull: false,
    /**
     * 팝업의 param 세팅
     *  1. columnArray -> 테이블 column 세팅 popupTable.ts파일 참고
     *  2. linkFieldName -> type: 'link'를 지정하고 싶은 column name을 세팅
     *  3. detailParams -> linkClick 클릭 시 props로 param을 넘길 row['value']를 세팅
     *  4. listUrl -> 목록 조회용 api
     */
    param: {
      columnArray: popupJson.equipGridInfo,
      linkFieldName: 'equipmentName', // link field name -> link값 없으면 빈값으로 처리
      tableRowKey: 'equipmentCd',
      detailParams: ['equipmentCd', 'psmFlag'],
      listUrl: selectConfig.mdm.equipment.list.url // list url
    }
  },
  {
    targetKey: 'facility',
    title: '시설',
    width: '65%',
    isFull: false,
    param: {
      columnArray: popupJson.facilityGridInfo,
      linkFieldName: 'facilityName',
      tableRowKey: 'facilityCd',
      detailParams: ['facilityCd'],
      listUrl: selectConfig.env.facility.list.url
    }
  },
  {
    targetKey: 'vendor',
    title: '업체',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.vendorGridInfo,
      linkFieldName: '',
      tableRowKey: 'vendorCd',
      detailParams: [],
      listUrl: selectConfig.mdm.cim.vendor.list.url
    }
  },
  {
    targetKey: 'vendorUser',
    title: '업체 직원',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.vendorUserGridInfo,
      linkFieldName: '',
      tableRowKey: 'vendorUserCd',
      detailParams: [],
      listUrl: selectConfig.mdm.cim.vendor.user.list.url
    }
  },
  {
    targetKey: 'upProcess',
    title: '상위 공정',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.upProcessGridInfo,
      linkFieldName: '',
      tableRowKey: 'processCd',
      detailParams: [],
      listUrl: selectConfig.mdm.process.list.url
    }
  },
  {
    targetKey: 'process',
    title: '단위 공정',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.processGridInfo,
      linkFieldName: '',
      tableRowKey: 'processCd',
      detailParams: [],
      listUrl: selectConfig.mdm.process.list.url
    }
  },
  {
    targetKey: 'user',
    title: '사용자',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.userGridInfo,
      linkFieldName: '',
      tableRowKey: 'userId',
      detailParams: [],
      listUrl: selectConfig.mdm.user.list.url
    }
  },
  {
    targetKey: 'deptUser',
    title: '사용자',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.userGridInfo,
      linkFieldName: '',
      tableRowKey: 'userId',
      detailParams: [],
      listUrl: selectConfig.mdm.user.list.url
    }
  },
  {
    targetKey: 'dept',
    title: '부서',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.deptGridInfo,
      linkFieldName: '',
      tableRowKey: 'deptCd',
      detailParams: [],
      listUrl: selectConfig.mdm.dept.list.url
    }
  },
  {
    targetKey: 'license',
    title: '인허가 현황',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.licenseGridInfo,
      linkFieldName: 'limLicenseKindName',
      tableRowKey: 'limLicenseKindId',
      detailParams: ['limLicenseId'],
      listUrl: selectConfig.sop.lim.lincense.card.list.url
    }
  },
  {
    targetKey: 'licenseKind',
    title: '관련법규/인허가종류',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.licenseKindGridInfo,
      linkFieldName: '',
      tableRowKey: 'limLicenseKindId',
      detailParams: [],
      listUrl: selectConfig.sop.lim.lincense.kind.list.url
    }
  },
  // 쓰지 말 것
  {
    targetKey: 'material',
    title: '자재',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.materialGridInfo,
      linkFieldName: '',
      tableRowKey: 'materialCd',
      detailParams: [],
      listUrl: selectConfig.mdm.mam.material.list.url
    }
  },
  {
    targetKey: 'materialProcess',
    title: '화학자재',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.materialProcessGridInfo,
      linkFieldName: 'mdmChemMaterialName',
      tableRowKey: 'chemMaterialProcessId',
      detailParams: ['mdmChemMaterialId', 'plantCd'],
      listUrl: selectConfig.mdm.mam.chem.byprocess.url
    }
  },
  {
    targetKey: 'materialType',
    title: '자재 분류',
    width: '40%',
    isFull: false,
    param: {
      columnArray: popupJson.materialTypeGridInfo,
      linkFieldName: '',
      tableRowKey: 'materialTypeCd',
      detailParams: [],
      listUrl: selectConfig.mdm.mam.material.type.list.url
    }
  },
  {
    targetKey: 'chemMaterial',
    title: '화학자재',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.chemMaterialGridInfo,
      linkFieldName: 'mdmChemMaterialName',
      tableRowKey: 'mdmChemMaterialId',
      detailParams: ['mdmChemMaterialId', 'plantCd'],
      listUrl: selectConfig.mdm.mam.chem.list.url
    }
  },
  {
    targetKey: 'chemBase',
    title: '화학물질',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.chemBaseGridInfo,
      linkFieldName: 'chemNmEn',
      tableRowKey: 'mdmChemId',
      detailParams: ['mdmChemId'],
      listUrl: selectConfig.chm.base.chemBase.detailList.url
    }
  },
  {
    targetKey: 'ghsHarmfulRiskClass',
    title: '유해위해성 분류',
    width: '40%',
    isFull: false,
    param: {
      columnArray: popupJson.ghsHarmfulRiskClassGridInfo,
      linkFieldName: '',
      tableRowKey: 'code',
      detailParams: [],
      listUrl: $format(selectConfig.sys.code.mst.list.url, 'HARMFUL_RISK_CLASS_CD')
    }
  },
  {
    targetKey: 'senior',
    title: '선임명',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.seniorGridInfo,
      linkFieldName: '',
      tableRowKey: 'seniorId',
      detailParams: [],
      listUrl: selectConfig.mdm.senior.list.url
    }
  },
  {
    targetKey: 'law',
    title: '법령',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.lawGridInfo,
      linkFieldName: 'lawNameKor',
      tableRowKey: 'mdmLawId',
      detailParams: ['lawLink'],
      listUrl: selectConfig.mdm.law.list.url
    }
  },
  {
    targetKey: 'lawCode',
    title: '법령',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.lawCodeGridInfo,
      linkFieldName: '',
      tableRowKey: 'code',
      detailParams: [],
      listUrl: $format(selectConfig.sys.code.mst.list.url, 'LAW_ID')
    }
  },
  {
    targetKey: 'lawRegister',
    title: '법규등록부',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.lawRegisterGridInfo,
      linkFieldName: '',
      tableRowKey: 'saiLawRegisterMasterItemId',
      detailParams: [],
      listUrl: selectConfig.sai.lawRegister.item.list.url
    }
  },
  {
    targetKey: 'eduCourse',
    title: '교육과정',
    width: '95%',
    isFull: false,
    param: {
      columnArray: popupJson.eduCourseGridInfo,
      linkFieldName: 'educationCourseName',
      tableRowKey: 'eduCourseId',
      detailParams: ['eduCourseId'],
      listUrl: selectConfig.sop.edu.course.list.url
    }
  },
  {
    targetKey: 'moc',
    title: 'MOC',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.mocGridInfo,
      linkFieldName: 'mocTitle',
      tableRowKey: 'sopMocId',
      detailParams: ['sopMocId', 'mocTypeCd', 'mocStepCd'],
      listUrl: selectConfig.sop.moc.change.list.url
    }
  },
  {
    targetKey: 'sop1',
    title: 'SOP',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop1GridInfo,
      linkFieldName: 'sopNo',
      tableRowKey: 'idx',
      detailParams: ['mdmSopId'],
      listUrl: selectConfig.mdm.sop.job.list.url
    }
  },
  {
    targetKey: 'sop2',
    title: 'SOP',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop2GridInfo,
      linkFieldName: '',
      tableRowKey: 'idx',
      detailParams: [],
      listUrl: selectConfig.mdm.sop.jobstep.url
    }
  },
  {
    targetKey: 'sop3',
    title: 'SOP',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop3GridInfo,
      linkFieldName: '',
      tableRowKey: 'idx',
      detailParams: [],
      listUrl: selectConfig.mdm.sop.jobhazard.url
    }
  },
  {
    targetKey: 'sop4',
    title: '작업단계별 유해위험요인별 원인/결과',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop4GridInfo,
      linkFieldName: '',
      tableRowKey: 'idx',
      detailParams: [],
      listUrl: selectConfig.mdm.sop.jobhazardreason.url
    }
  },
  {
    targetKey: 'sop5',
    title: 'SOP',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop5GridInfo,
      linkFieldName: '',
      tableRowKey: 'idx',
      detailParams: [],
      listUrl: selectConfig.mdm.sop.processHazard.url
    }
  },
  {
    targetKey: 'sop6',
    title: 'SOP',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop6GridInfo,
      linkFieldName: '',
      tableRowKey: 'idx',
      detailParams: [],
      listUrl: selectConfig.mdm.sop.processHazardReason.url
    }
  },
  {
    targetKey: 'sop7',
    title: 'SOP',
    width: '75%',
    isFull: false,
    param: {
      columnArray: popupJson.sop7GridInfo,
      linkFieldName: '',
      tableRowKey: 'idx',
      detailParams: [],
      listUrl: selectConfig.mdm.sop.sopHazard.url
    }
  },
  {
    targetKey: 'workPermit',
    title: '작업허가서',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.workPermitGridInfo,
      linkFieldName: 'workSummary',
      tableRowKey: 'sopWorkPermitId',
      detailParams: ['sopWorkPermitId', 'swpWorkPermitTypeCd'],
      listUrl: selectConfig.swp.workPermit.list.url
    }
  },
  {
    targetKey: 'edu',
    title: '교육 계획 및 결과',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.eduGridInfo,
      linkFieldName: 'educationName',
      tableRowKey: 'eduEducationId',
      detailParams: ['plantCd', 'eduEducationId', 'stepCd'],
      listUrl: selectConfig.sop.edu.result.list.url
    }
  },
  {
    targetKey: 'construction',
    title: '공사',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.constructionGridInfo,
      linkFieldName: 'constructionName',
      tableRowKey: 'sopConstructionId',
      detailParams: ['sopConstructionId'],
      listUrl: selectConfig.sop.scm.construction.list.url
    }
  },
  {
    targetKey: 'riskAssessment',
    title: '위험성평가',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.riskAssessmentGridInfo,
      linkFieldName: '',
      tableRowKey: 'ramRiskAssessmentPlanId',
      detailParams: [''],
      listUrl: selectConfig.ram.assessPlan.list.url
    }
  },
  {
    targetKey: 'evaluatee',
    title: '관리감독자 평가대상자',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.evaluateeGridInfo,
      linkFieldName: '',
      tableRowKey: 'saiSuperEvaluateeMstId',
      detailParams: [],
      listUrl: selectConfig.sai.sse.supervisor.mst.evaluatee.url
    }
  },
  {
    targetKey: 'supervisorEval',
    title: '관리감독자 평가',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.supervisorEvalGridInfo,
      linkFieldName: 'evaluateeName',
      tableRowKey: 'saiSuperEvaluationId',
      detailParams: ['saiSuperEvaluationId', 'type'],
      listUrl: selectConfig.sai.sse.superInspection.list.url
    }
  },
  {
    targetKey: 'eduQuiz',
    title: '교육 문제풀이 SET',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.eduQuizGridInfo,
      // linkFieldName: 'eduQuestionMstName',
      linkFieldName: '',
      tableRowKey: 'eduQuestionMstId',
      // detailParams: ['eduQuestionMstId', 'disableEdit'],
      detailParams: [],
      listUrl: selectConfig.sop.edu.quiz.mst.list.url
    }
  },
  {
    targetKey: 'chemReview',
    title: '구매 전 검토',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.chemReviewGridInfo,
      linkFieldName: 'materialName',
      tableRowKey: 'mdmChemReviewId',
      detailParams: ['mdmChemReviewId'],
      listUrl: selectConfig.mdm.mam.review.list.url
    }
  },
  {
    targetKey: 'checkup',
    title: '건강검진',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.checkupGridInfo,
      linkFieldName: 'checkupName',
      tableRowKey: 'heaCheckupPlanId',
      detailParams: ['heaCheckupPlanId', 'checkupTypeCd'],
      listUrl: selectConfig.hea.checkup.plan.list.url
    }
  },
  {
    targetKey: 'hazardFactor',
    title: '유해인자',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.hazardFactorGridInfo,
      linkFieldName: '',
      tableRowKey: 'hazardCd',
      detailParams: [],
      listUrl: selectConfig.sai.hazard.list.url
    }
  },
  {
    targetKey: 'muscle',
    title: '근골격계 조사계획',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.muscleGridInfo,
      linkFieldName: '',
      tableRowKey: 'heaInvestigationPlanId',
      detailParams: [],
      listUrl: selectConfig.hea.muscleSystem.investigationPlan.list.url
    }
  },
  {
    targetKey: 'regul',
    title: '규제항목',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.regulGridInfo,
      linkFieldName: '',
      tableRowKey: 'regulatedItemCd',
      detailParams: [],
      listUrl: selectConfig.mdm.mam.regulation.item.list.url
    }
  },
  {
    targetKey: 'riskRelationDocu',
    title: '관련자료',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.riskRelationDocuInfo,
      linkFieldName: '',
      tableRowKey: 'documentId',
      detailParams: [],
      listUrl: selectConfig.ram.relatedDocument.addData.url
    }
  },
  {
    targetKey: 'nearAccident',
    title: '잠재위험 발굴 보고서',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.nearAccidentInfo,
      linkFieldName: '',
      tableRowKey: 'iimNearAccidentId',
      detailParams: [],
      listUrl: selectConfig.sop.iim.accident.near.list.url
    }
  },
  {
    targetKey: 'accident',
    title: '공정사고',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.accidentInfo,
      linkFieldName: '',
      tableRowKey: 'iimAccidentId',
      detailParams: [],
      listUrl: selectConfig.sop.iim.accident.process.list.url
    }
  },
  {
    targetKey: 'internalAuditChecklist',
    title: '내부심사 체크리스트',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.internalAuditChecklistInfo,
      linkFieldName: '',
      tableRowKey: 'saiInternalAuditChecklistSystemId',
      detailParams: [],
      listUrl: selectConfig.sai.internal.base.checklist.list.url,
      tableSetting: {
        usePaging: false
      }
    }
  },
  {
    targetKey: 'compliance',
    title: '자체감사',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.complianceGridInfo,
      linkFieldName: '',
      tableRowKey: 'selfInspectionResultId',
      detailParams: ['selfInspectionResultId', 'selfInspectionStatusCd', 'sysRevision'],
      listUrl: selectConfig.sop.pca.result.info.list.url
    }
  },
  {
    targetKey: 'hazardChem',
    title: '유해화학물질',
    width: '95%',
    isFull: false,
    param: {
      columnArray: popupJson.hazardChemGridInfo,
      linkFieldName: 'mdmChemMaterialName',
      tableRowKey: 'mdmChemMaterialId',
      detailParams: ['mdmChemMaterialId', 'plantCd'],
      listUrl: selectConfig.mdm.mam.chem.hazardChem.url
    }
  },
  {
    targetKey: 'safetyGear',
    title: '보호구',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.safetyGearGridInfo,
      linkFieldName: '',
      tableRowKey: 'safetyGearId',
      detailParams: [],
      listUrl: selectConfig.sop.sas.safetyGear.list.url
    }
  },
  {
    targetKey: 'safetyGearRequest',
    title: '보호구 신청',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.safetyGearRequestGridInfo,
      linkFieldName: '',
      tableRowKey: 'requestListId',
      detailParams: [],
      listUrl: selectConfig.sop.sas.request.get.url
    }
  },
  {
    targetKey: 'emergencyActionPlan',
    title: '비상조치계획',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.emergencyActionPlanGridInfo,
      linkFieldName: '',
      tableRowKey: 'sopEmergencyPlanId',
      detailParams: [],
      listUrl: selectConfig.sop.eap.planDocu.list.pop.url
    }
  },
  {
    targetKey: 'trainingScenario',
    title: '훈련 시나리오',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.trainingScenarioGridInfo,
      linkFieldName: 'emergencyPlanName',
      tableRowKey: 'trainingScenarioNo',
      detailParams: ['sopEmergencyPlanId'],
      listUrl: selectConfig.sop.eap.planDocu.list.url
    }
  },
  {
    targetKey: 'closedEquip',
    title: '밀폐공간 작업장비',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.closedEquipGridInfo,
      linkFieldName: '',
      tableRowKey: 'heaClosedSpaceEquipmentId',
      detailParams: [],
      listUrl: selectConfig.hea.cse.equip.list.url
    }
  },
  {
    targetKey: 'hazardStorage',
    title: '위험물저장소',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.hazardStorageGridInfo,
      linkFieldName: 'chmDangerArea',
      tableRowKey: 'chmDangerMstId',
      detailParams: ['chmDangerMstId'],
      listUrl: selectConfig.chm.danger.master.list.url
    }
  },
  {
    targetKey: 'dangerItem',
    title: '위험물 및 지정수량',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.dangerItemGridInfo,
      linkFieldName: '',
      tableRowKey: 'chmDangerItemId',
      detailParams: [],
      listUrl: selectConfig.chm.base.dangerItem.list.url
    }
  },
  {
    targetKey: 'dangerStorageChecklist',
    title: '위험물저장소 점검항목',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.dangerStorageChecklistGridInfo,
      linkFieldName: '',
      tableRowKey: 'chmDangerStorageCheckItemId',
      detailParams: [],
      listUrl: selectConfig.chm.danger.masterItems.list.url
    }
  },
  {
    targetKey: 'fireFightingEquip',
    title: '소방설비',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.fireFightingEquipGridInfo,
      linkFieldName: 'fireFightingName',
      tableRowKey: 'sopFireFightingId',
      detailParams: ['sopFireFightingId'],
      listUrl: selectConfig.fft.fireFighting.list.url
    }
  },
  {
    targetKey: 'fireFightingLocation',
    title: '소방설비 배치 장소',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.fireFightingLocationGridInfo,
      linkFieldName: '',
      tableRowKey: 'sopFireFightingLocationId',
      detailParams: [],
      listUrl: selectConfig.fft.base.location.list.url
    }
  },
  {
    targetKey: 'training',
    title: '비상대응 훈련',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.trainingGridInfo,
      linkFieldName: 'trainingName',
      tableRowKey: 'sopEmergencyTrainingId',
      detailParams: ['sopEmergencyTrainingId'],
      listUrl: selectConfig.sop.eap.training.plan.list.url
    }
  },
  {
    targetKey: 'seniorStatus',
    title: '선해임 현황',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.seniorStatusGridInfo,
      linkFieldName: 'seniorName',
      tableRowKey: 'seniorStatusId',
      detailParams: ['seniorStatusId'],
      listUrl: selectConfig.mdm.senior.status.list.url
    }
  },
  {
    targetKey: 'hazardequip',
    title: '유해위험기계기구',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.hazardequipGridInfo,
      linkFieldName: '', // link field name -> link값 없으면 빈값으로 처리
      tableRowKey: 'hhmHazardousMachineryId',
      detailParams: [],
      listUrl: selectConfig.sop.hhm.hazard.check.list.url // list url
    }
  },
  {
    targetKey: 'airOutlet',
    title: '대기 배출구',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.airOutletGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstOutletId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.outlet.list.url
    }
  },
  {
    targetKey: 'airPreventive',
    title: '대기 방지시설',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.airPreventiveGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstPreventiveId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.preventive.list.url
    }
  },
  {
    targetKey: 'airWattmeter',
    title: '대기 적산전력계',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.airWattmeterGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstWattmeterId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.wattmeter.list.url
    }
  },
  {
    targetKey: 'airInspectItem',
    title: '사업장별 대기 검사항목',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.airInspectItemGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstInspectItemId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.inspect.plant.url
    }
  },
  {
    targetKey: 'airInspectItemMst',
    title: '대기 검사항목',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.airInspectItemMstGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstInspectItemId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.inspect.list.url
    }
  },
  {
    targetKey: 'airDischarge',
    title: '대기 배출시설',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.airDischargeGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstDischargeId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.discharge.list.url
    }
  },
  {
    targetKey: 'airMaterial',
    title: '대기 원료',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.airMaterialGridInfo,
      linkFieldName: '',
      tableRowKey: 'envAirMstMaterialId',
      detailParams: [''],
      listUrl: selectConfig.env.air.mst.material.list.url
    }
  },
  {
    targetKey: 'wasteMst',
    title: '폐기물 종류 및 명칭',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.wasteMstGridInfo,
      linkFieldName: '',
      tableRowKey: 'envWasteMstId',
      detailParams: [''],
      listUrl: selectConfig.env.waste.mst.list.url,
      tableSetting: {
        usePaging: false
      }
    }
  },
  {
    targetKey: 'tbm',
    title: 'TBM',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.tbmGridInfo,
      linkFieldName: 'tbmName',
      tableRowKey: 'tbmId',
      detailParams: ['tbmId'],
      listUrl: selectConfig.sai.tbm.list.url
    }
  },
  {
    targetKey: 'patrol',
    title: '순회점검',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.patrolGridInfo,
      linkFieldName: 'patrolName',
      tableRowKey: 'saiPatrolId',
      detailParams: ['saiPatrolId'],
      listUrl: selectConfig.sai.patrol.list.url
    }
  },
  {
    targetKey: 'vendorAssess',
    title: '수급업체 평가',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.vendorAssessGridInfo,
      linkFieldName: 'vendorName',
      tableRowKey: 'mdmVendorEvaluationId',
      detailParams: ['mdmVendorEvaluationId'],
      listUrl: selectConfig.mdm.cim.vendor.evaluation.result.list.url
    }
  },
  {
    targetKey: 'impr',
    title: '개선',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.imprGridInfo,
      linkFieldName: 'ibmTitle',
      tableRowKey: 'sopImprovementId',
      detailParams: ['sopImprovementId'],
      listUrl: selectConfig.sop.ibm.improve.list.url
    }
  },
  {
    targetKey: 'workMeasure',
    title: '작업환경측정',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.workMeasureGridInfo,
      linkFieldName: 'measPlanContent',
      tableRowKey: 'workMeasurementPlanId',
      detailParams: ['workMeasurementPlanId'],
      listUrl: selectConfig.sai.workmeas.plan.list.url
    }
  },
  {
    targetKey: 'riskHazard',
    title: '유해위험요인',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.riskHazardGridInfo,
      linkFieldName: '',
      tableRowKey: 'ramRiskHazardId',
      detailParams: [],
      listUrl: selectConfig.ram.riskHazard.list.url
    }
  },
  {
    targetKey: 'heqfork',
    title: '중장비',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.heqforkGridInfo,
      linkFieldName: '', // link field name -> link값 없으면 빈값으로 처리
      tableRowKey: 'heqForkLiftId',
      detailParams: [],
      listUrl: selectConfig.sop.heq.forkLift.list.url // list url
    }
  },
  {
    targetKey: 'closedSpace',
    title: '밀폐공간',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.closedSpaceGridInfo,
      linkFieldName: '',
      tableRowKey: 'heaClosedSpaceId',
      detailParams: [],
      listUrl: selectConfig.hea.closedspaceMap.base.url
    }
  },
  {
    targetKey: 'gas',
    title: '가스항목',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.gasGridInfo,
      linkFieldName: '',
      tableRowKey: 'sopGasId',
      detailParams: [],
      listUrl: selectConfig.sop.swp.gas.list.url
    }
  },
  {
    targetKey: 'soilPollutionFacility',
    title: '토양오염대상시설',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.soilPollutionFacilityGridInfo,
      linkFieldName: '',
      tableRowKey: 'envSoilPollutionTargetFacilityId',
      detailParams: [],
      listUrl: selectConfig.env.soil.facility.list.url
    }
  },
  {
    targetKey: 'ghgFuel',
    title: '배출원(연료)',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.ghgFuelGridInfo,
      linkFieldName: '',
      tableRowKey: 'envGhgRawFuelId',
      detailParams: [],
      listUrl: selectConfig.env.ghg.rawFuel.list.url
    }
  },
  {
    targetKey: 'ghgFacility',
    title: '온실가스 배출시설',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.ghgFacilityGridInfo,
      linkFieldName: '',
      tableRowKey: 'envGhgFacilityId',
      detailParams: [],
      listUrl: selectConfig.env.ghg.facility.commonList.url
    }
  },
  {
    targetKey: 'ghgFacilityEquipment',
    title: '온실가스 배출시설 설비',
    width: '70%',
    isFull: false,
    param: {
      columnArray: popupJson.ghgFacilityEquipmentGridInfo,
      linkFieldName: '',
      tableRowKey: 'envGhgFacilityFuelId',
      detailParams: [],
      listUrl: selectConfig.env.ghg.facility.list.url
    }
  },
  {
    targetKey: 'envProcess',
    title: '환경 공정',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.envProcessGridInfo,
      linkFieldName: '',
      tableRowKey: 'processCd',
      detailParams: [],
      listUrl: selectConfig.env.process.list.url
    }
  },
  {
    targetKey: 'envOnlyProcess',
    title: 'IEPS 공정',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.envOnlyProcGridInfo,
      linkFieldName: '',
      tableRowKey: 'processNo',
      detailParams: [],
      listUrl: selectConfig.env.procWork.onlyProc.list.url
    }
  },
  {
    targetKey: 'waterOutlet',
    title: '수질 배출구',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.waterOutletGridInfo,
      linkFieldName: '',
      tableRowKey: 'envWaterMstOutletId',
      detailParams: [''],
      listUrl: selectConfig.env.water.mst.outlet.list.url
    }
  },
  {
    targetKey: 'waterInspectItemMst',
    title: '수질 검사항목',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.waterInspectItemMstGridInfo,
      linkFieldName: '',
      tableRowKey: 'envWaterMstInspectItemId',
      detailParams: [''],
      listUrl: selectConfig.env.water.mst.inspect.list.url,
      tableSetting: {
        usePaging: false
      }
    }
  },
  {
    targetKey: 'checkUser',
    title: '관리 감독자',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.checkUserGridInfo,
      linkFieldName: '',
      tableRowKey: 'userId',
      detailParams: [],
      listUrl: selectConfig.mdm.deptmanager.list.url
    }
  },
  {
    targetKey: 'waterWattmeter',
    title: '수질 전력계',
    width: '60%',
    isFull: false,
    param: {
      columnArray: popupJson.waterWattmeterGridInfo,
      linkFieldName: '',
      tableRowKey: 'envWaterMstWattmeterId',
      detailParams: [''],
      listUrl: selectConfig.env.water.mst.wattmeter.list.url
    }
  },
  {
    targetKey: 'waterPreventive',
    title: '수질 방지시설',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.waterPreventiveGridInfo,
      linkFieldName: '',
      tableRowKey: 'envWaterMstPreventiveId',
      detailParams: [''],
      listUrl: selectConfig.env.water.mst.preventive.list.url
    }
  },
  {
    targetKey: 'tmsMst',
    title: 'TMS 측정항목',
    width: '90%',
    isFull: false,
    param: {
      columnArray: popupJson.tmsMstGridInfo,
      linkFieldName: '',
      tableRowKey: 'envTmsMstId',
      detailParams: [''],
      listUrl: selectConfig.env.air.tms.mst.list.url
    }
  },
  {
    targetKey: 'tmsMstMain',
    title: 'TMS 마스터',
    width: '50%',
    isFull: false,
    param: {
      columnArray: popupJson.tmsMstMainGridInfo,
      linkFieldName: '',
      tableRowKey: 'envTmsMstMainId',
      detailParams: [''],
      listUrl: selectConfig.env.air.tms.main.list.url
    }
  },
  {
    targetKey: 'checkupOpinion',
    title: '유소견자',
    width: '80%',
    isFull: false,
    param: {
      columnArray: popupJson.checkupOpinionGrid,
      linkFieldName: 'userName',
      tableRowKey: 'heaCheckupResultOpinionId',
      detailParams: ['heaCheckupResultId'],
      listUrl: selectConfig.hea.checkup.opinion.list.url
    }
  }
]
/** targetKey에 따른 팝업 options 찾아 반환 */
export function getPopupOption(targetKey: targetLiteralType) {
  const popupOption = _.find(popupOptions, { targetKey: targetKey })
  if (popupOption?.param) {
    popupOption.param = _.extend(popupOption.param, {
      mainTitle: popupOption?.title,
      targetKey: popupOption?.targetKey,
      searchParam: {}
    })
  }
  return popupOption
}
/** targetKey에 따른 팝업 options 찾아 반환 */
export function getPopupOptions(
  targetKey: targetLiteralType,
  popupOptions: popupParamType,
  closePopup: closePopupType,
  customParam?: objectLodash
) {
  const managePopupOptions = getPopupOption(targetKey)
  if (managePopupOptions) {
    const popupParam = _.extend(managePopupOptions.param, customParam)
    popupOptions.title = managePopupOptions.title + ' 검색'
    popupOptions.param = popupParam
    popupOptions.target = shallowRef(
      defineAsyncComponent(() => import(`@/components/commonPop.vue`))
    )
    popupOptions.width = managePopupOptions.width
    popupOptions.isFull = managePopupOptions.isFull
    popupOptions.visible = true
    popupOptions.closeCallback = closePopup
  }
  return popupOptions
}

// 팝업의 상세 link url 세팅
export { default as hazardStorageDetail } from '@/views/chm/danger/dangerMasterDetail.vue'
export { default as facilityDetail } from '@/views/chm/hcf/hazardFacilityDetail.vue'
export { default as fireFightingEquipDetail } from '@/views/fft/fireFightingMasterDetail.vue'
export { default as checkupDetail } from '@/views/hea/chk/checkUpDetail.vue'
export { default as equipDetail } from '@/views/mdm/fim/equipmentDetail.vue'
export { default as chemBaseDetail } from '@/views/mdm/mam/chem/chemBaseDetail.vue'
export {
  default as chemMaterialDetail,
  default as hazardChemDetail,
  default as materialProcessDetail
} from '@/views/mdm/mam/chemDetail.vue'
export { default as chemReviewDetail } from '@/views/mdm/mam/review/chemReviewDetail.vue'
export { default as sop1Detail } from '@/views/mdm/pim/sopDetail.vue'
export { default as riskAssessmentDetail } from '@/views/ram/riskDetail.vue'
export { default as patrolDetail } from '@/views/sai/patrol/patrolDetail.vue'
export { default as supervisorEvalDetail } from '@/views/sai/sse/supervisorInspectionInfo.vue'
export { default as tbmDetail } from '@/views/sai/tbm/tbmDetail.vue'
export { default as workMeasureDetail } from '@/views/sai/wmr/workMeasurePlanDetail.vue'
export { default as seniorStatusDetail } from '@/views/sop/com/seniorDismissalStatusDetail.vue'
export { default as vendorAssessDetail } from '@/views/sop/csm/vendorAssessDetail.vue'
export { default as trainingScenarioDetail } from '@/views/sop/eap/old/emergencyActionPlanDocuDetail.vue'
export { default as trainingDetail } from '@/views/sop/eap/old/traningDetail.vue'
export { default as eduCourseDetail } from '@/views/sop/edu/cc/educationCourseDetail.vue'
export { default as eduDetail } from '@/views/sop/edu/result/educationResultDetail.vue'
export { default as imprDetail } from '@/views/sop/ibm/imprDetail.vue'
export { default as licenseDetail } from '@/views/sop/lim/licenseStatusDetail.vue'
export { default as mocDetail } from '@/views/sop/moc/mocDetail.vue'
export { default as constructionDetail } from '@/views/sop/scm/constructionDetail.vue'
export { default as workPermitDetail } from '@/views/sop/swp/safeWorkPermitDetail14.vue'
export { default as checkupOpinionDetail } from '@/views/hea/chk/checkUpResultDetail.vue'

// 1. export할 url이 없다면 여기서 추가해주기
// 2. tastTarget.ts가서 Detail제외한 이름 정의해주기
export {
  accidentDetail,
  airDischargeDetail,
  airInspectItemDetail,
  airInspectItemMstDetail,
  airMaterialDetail,
  airOutletDetail,
  airPreventiveDetail,
  airWattmeterDetail,
  checkUserDetail,
  closedEquipDetail,
  closedSpaceDetail,
  complianceDetail,
  dangerItemDetail,
  dangerStorageChecklistDetail,
  deptDetail,
  deptUserDetail,
  eduQuizDetail,
  emergencyActionPlanDetail,
  envOnlyProcessDetail,
  envProcessDetail,
  evaluateeDetail,
  fireFightingLocationDetail,
  gasDetail,
  ghgFacilityDetail,
  ghgFacilityEquipmentDetail,
  ghgFuelDetail,
  ghsHarmfulRiskClassDetail,
  hazardequipDetail,
  hazardFactorDetail,
  heqforkDetail,
  internalAuditChecklistDetail,
  lawCodeDetail,
  lawDetail,
  lawRegisterDetail,
  licenseKindDetail,
  materialDetail,
  materialTypeDetail,
  muscleDetail,
  nearAccidentDetail,
  processDetail,
  regulDetail,
  riskHazardDetail,
  riskRelationDocuDetail,
  safetyGearDetail,
  safetyGearRequestDetail,
  seniorDetail,
  soilPollutionFacilityDetail,
  sop2Detail,
  sop3Detail,
  sop4Detail,
  sop5Detail,
  sop6Detail,
  sop7Detail,
  tmsMstDetail,
  tmsMstMainDetail,
  upProcessDetail,
  userDetail,
  vendorDetail,
  vendorUserDetail,
  wasteMstDetail,
  waterInspectItemMstDetail,
  waterOutletDetail,
  waterPreventiveDetail,
  waterWattmeterDetail,
  workMapDetail
}

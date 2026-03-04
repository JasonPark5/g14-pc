/**
 * #1 : field
 * #2 : label
 * #3 : align
 * #4 : merge
 * #5 : width

 */
// 1. 설비
export const equipGridInfo = [
  ['plantName', 'equipmentNo', 'equipmentName', 'equipmentTypeName'],
  ['사업장', '설비관리번호', '설비명', '설비유형'],
  ['center', 'center', 'left', 'center']
]
// 2. 상위공정
export const upProcessGridInfo = [
  ['plantName', 'processName'],
  ['사업장', '단위공정'],
  ['center', 'center']
]
// 3. 단위공정
export const processGridInfo = [
  ['upProcessName', 'processName'],
  ['상위공정', '단위공정'],
  ['center', 'center'],
  [{ index: 0, colName: 'upProcessCd' }]
]
// 4. 사용자
export const userGridInfo = [
  [
    'plantName',
    'upDeptName',
    'deptName',
    'userName',
    'mobileNoFormat',
    'sexName',
    'jobName',
    'spotName',
    'jobClassNm'
  ],
  ['사업장', '본부', '부서', '이름', '연락처', '성별', '직책', '직위', '직종'],
  ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center']
]
// 5. 부서
export const deptGridInfo = [
  ['plantName', 'upDeptName', 'deptName'],
  ['사업장', '상위부서', '부서'],
  ['center', 'center', 'center']
]
// 인허가
export const licenseGridInfo = [
  [
    'plantName',
    'revisionNum',
    'licenseNo',
    'relatedLawsName',
    'limLicenseKindName',
    'licenseStartDate',
    'licenseEndDate',
    'relatedDeptName',
    'licenseCreateTypeName'
  ],
  [
    '사업장',
    'Rev.',
    '인허가번호',
    '관련법규',
    '인허가종류',
    '인허가시작일',
    '인허가종료일',
    '관련부서',
    '인허가 등록 구분'
  ],
  ['center', 'center', 'center', 'center', 'left', 'center', 'center', 'center', 'center']
]
//인허가 종류
export const licenseKindGridInfo = [
  ['limLicenseTaskClassName', 'relatedLawsName', 'limLicenseKindName'],
  ['인허가업무구분', '관련법규', '인허가종류'],
  ['center', 'center', 'left']
]
// 공정화학자재
export const materialProcessGridInfo = [
  [
    'processName',
    'mdmChemMaterialName',
    'casNo',
    'useFlag',
    'usePurpose',
    'propertiesStateName',
    'dailyVolume',
    'volumeUnitName',
    'substanceNames'
  ],
  [
    '공정',
    '화학자재명',
    'CAS No.',
    '제조/사용여부',
    '용도',
    '성상',
    '일 취급량',
    '취급량 단위',
    '구성물질'
  ],
  ['center', 'left', 'center', 'center', 'center', 'center', 'right', 'center', 'left'],
  [],
  [{ colName: 'substanceNames', style: 'width: 30%' }]
]
// 자재
export const materialGridInfo = [
  ['upMaterialTypeName', 'materialTypeName', 'materialNo', 'materialName'],
  ['자재 대분류', '자재 중분류', '자재관리번호', '자재명'],
  ['center', 'center', 'center', 'left']
]
// 자재 종류
export const materialTypeGridInfo = [
  ['materialKindName', 'upMaterialTypeName', 'materialTypeName'],
  ['자재구분', '자재 대분류', '자재 중분류'],
  ['center', 'center', 'center']
  // [
  //   { index: 0, colName: 'materialKindName' },
  //   { index: 1, colName: 'upMaterialTypeName' }
  // ]
]
// 화학자재
export const chemMaterialGridInfo = [
  ['mdmChemMaterialName', 'mdmChemMaterialCd', 'casNo', 'keNo', 'substanceNames'],
  ['화학자재명', '목록번호', 'CAS.No', 'KE.No', '구성물질'],
  ['left', 'center', 'center', 'center', 'left'],
  [],
  [{ colName: 'substanceNames', style: 'width: 40%' }]
]
// 화학물질
export const chemBaseGridInfo = [
  ['chemNmEn', 'chemNmKr', 'casNo', 'molecularFormula', 'regulFlag'],
  ['화학물질(영문)', '화학물질(국문)', 'CAS No.', '화학식', '규제물질 대상여부'],
  ['left', 'left', 'center', 'center', 'center']
]
// 유해위해성 분류
export const ghsHarmfulRiskClassGridInfo = [
  ['attrVal1', 'codeName'],
  ['대분류', '분류'],
  ['center', 'left']
]
// 수급업체
export const vendorGridInfo = [
  [
    'vendorName',
    'vendorClassName',
    'vendorTypeName',
    'bizNoFormat',
    'phoneNo',
    'representName',
    'chargeName'
  ],
  ['업체', '업체분류', '업체유형', '사업자번호', '대표전화번호', '대표자', '담당자'],
  ['left', 'center', 'center', 'center', 'center', 'center', 'center']
]
// 수급업체 직원
export const vendorUserGridInfo = [
  ['vendorName', 'personName', 'mobileNo', 'birthDate', 'sexName', 'jobName'],
  ['업체', '이름', '연락처', '생년월일', '성별', '직책'],
  ['center', 'center', 'center', 'center', 'center', 'center']
]
// 선임명
export const seniorGridInfo = [
  [
    'seniorClassName',
    'relatedLawsName',
    'seniorName',
    'qualifiyRequire'
    // 'seniorStandard',
    // 'reportAppointName'
  ],
  // ['구분', '관련법규', '선임명', '자격요건', '선임기준', '신고/선임'],
  // ['center', 'left', 'center', 'left', 'left', 'center']
  ['구분', '관련법규', '선임명', '자격요건'],
  ['center', 'left', 'center', 'left'],
  [],
  [{ colName: 'qualifiyRequire', style: 'width: 65%' }]
]
// 법령
export const lawGridInfo = [
  [
    'lawId',
    'curHistroyCode',
    'lawNameKor',
    'lawNameAbb',
    'promulgationDate',
    'revisiontypename',
    'competentMinistriesName',
    'lawClassName',
    'enforcementDate'
  ],
  [
    '법령번호',
    '현행연혁코드',
    '법령명한글',
    '법령약칭명',
    '공포일자',
    '제개정구분명',
    '소관부처명',
    '법령구분명',
    '시행일자'
  ],
  [
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center'
  ]
]
// 법령 코드
export const lawCodeGridInfo = [['codeName'], ['법령명'], ['left']]

// 법규등록부 코드
export const lawRegisterGridInfo = [
  [
    'lawName',
    'gubunName',
    'itemName',
    'relevantClause',
    'requirements',
    'applyConstruction',
    'target',
    'relatedDocument'
  ],
  ['법령명', '구분', '항목', '관련조항', '요구사항', '적용사항', '적용대상', '관련문서(기록)'],
  ['left', 'left', 'left', 'left', 'left', 'left', 'left', 'left'],
  /** MERGE */
  [
    { index: 0, colName: 'lawId' },
    { index: 1, colName: 'saiLawRegisterMasterId' }
  ]
]

// 교육과정
export const eduCourseGridInfo = [
  [
    'plantName',
    'educationCourseName',
    'educationKindCdLargeName',
    'educationKindCdSmallName',
    'educationTypeName',
    'legalEducationFlagName',
    'educationTimeName',
    'estimatedEducationExpenses',
    'educationPurpose',
    'relatedLawsName',
    'eduQuestionFlag'
  ],
  [
    '사업장',
    '교육과정',
    '교육종류1',
    '교육종류2',
    '교육구분',
    '법정교육여부',
    '교육시간',
    '예상교육비 (원)',
    '학습목적',
    '관련법규',
    '문제풀이'
  ],
  [
    'center',
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'left',
    'left',
    'center'
  ]
]

// MOC
export const mocGridInfo = [
  [
    'plantName',
    'mocStepName',
    'mocTitle',
    'mocTypeName',
    'mocNo',
    'mocDates',
    'initiativeDeptName',
    'initiativeUserName'
  ],
  ['사업장', '진행단계', '제목', '변경구분', '관리번호', '변경 작업 기간', '발의부서', '발의자'],
  ['center', 'center', 'left', 'center', 'center', 'center', 'center', 'center']
]

// SOP 1
export const sop1GridInfo = [
  ['processName', 'sopName', 'sopNo'],
  ['공정', '작업명', '작업표준번호'],
  ['center', 'left', 'center']
]
// SOP 2
export const sop2GridInfo = [
  ['processName', 'sopName', 'jobStepName', 'jobStepDesc'],
  ['공정', '작업명', '작업단계', '작업방법(상세설명)'],
  ['center', 'left', 'left', 'left'],
  /** MERGE */
  [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'sopName' }
  ]
]
// SOP 3
export const sop3GridInfo = [
  ['processName', 'sopName', 'jobStepName', 'ramRiskHazardClassName', 'riskHazardName'],
  ['공정', '작업명', '작업단계', '요인 분류', '유해위험요인'],
  ['center', 'left', 'left', 'center', 'left'],
  /** MERGE */
  [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'sopName' },
    { index: 2, colName: 'jobStepName' }
  ]
]
// SOP 4
export const sop4GridInfo = [
  [
    'processName',
    'sopName',
    'jobStepName',
    'ramRiskHazardClassName',
    'riskHazardName',
    'hazardOccurReason',
    'hazardOccurResult'
  ],
  ['공정', '작업명', '작업단계', '요인 분류', '유해위험요인', '원인', '결과'],
  ['center', 'left', 'left', 'center', 'left', 'left', 'left'],
  /** MERGE */
  [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'sopName' },
    { index: 2, colName: 'jobStepName' },
    { index: 3, colName: 'riskHazardName' }
  ]
]
// SOP 5
export const sop5GridInfo = [
  ['processName', 'ramRiskHazardClassName', 'riskHazardName'],
  ['공정', '요인 분류', '유해위험요인'],
  ['center', 'center', 'left'],
  /** MERGE */
  [{ index: 0, colName: 'processName' }]
]
// SOP 6
export const sop6GridInfo = [
  [
    'processName',
    'sopName',
    'ramRiskHazardClassName',
    'riskHazardName',
    'hazardOccurReason',
    'hazardOccurResult'
  ],
  ['공정', '작업명', '요인 분류', '유해위험요인', '원인', '결과'],
  ['center', 'left', 'center', 'left', 'left', 'left'],
  /** MERGE */
  [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'ramRiskHazardClassName' },
    { index: 2, colName: 'riskHazardName' }
  ]
]
// SOP 7
export const sop7GridInfo = [
  ['processName', 'sopName', 'ramRiskHazardClassName', 'riskHazardName'],
  ['공정', '작업명', '요인 분류', '유해위험요인'],
  ['center', 'left', 'center', 'left'],
  /** MERGE */
  [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'sopName' }
  ]
]

// 작업허가서
export const workPermitGridInfo = [
  [
    'workName',
    'workSummary',
    'swpStepName',
    'permitDate',
    'permitTypeName',
    'swpWorkPermitTypeName',
    'applicationUserName',
    'issuedDeptName'
  ],
  ['작업명', '작업개요', '진행단계', '허가일', '허가서구분', '작업허가분류', '신청자', '발급부서'],
  ['left', 'left', 'center', 'center', 'center', 'left', 'center', 'center']
]

// 교육
export const eduGridInfo = [
  [
    'plantName',
    'educationName',
    'educationCourseName',
    'educationDate',
    'eduPlanTime',
    'educationKindCdLargeName',
    'educationKindCdSmallName',
    'educationTypeName'
  ],
  ['사업장', '교육명', '교육과정', '교육일', '교육시간', '교육종류1', '교육종류2', '교육구분'],
  ['center', 'left', 'left', 'center', 'center', 'center', 'center', 'center']
]

// 공사
export const constructionGridInfo = [
  [
    'constructionName',
    'constructionPeriod',
    'onSiteManager',
    'safetyManager',
    'vendorName',
    'constructionFinishFlagName'
  ],
  ['공사명', '공사기간', '현장 총괄', '안전책임자', '주 공사업체', '공사 진행상태'],
  ['left', 'center', 'left', 'center', 'center', 'center']
]

// 사전검토
export const chemReviewGridInfo = [
  [
    // 'materialCd',
    'materialName',
    'materialNameEn',
    'mdmChemReviewStepName',
    'regUserName',
    'review',
    'plantNames'
  ],
  [
    // '자재일련번호',
    '화학자재(국문)',
    '화학자재(영문)',
    '진행상태',
    '작성자',
    '검토',
    '공사 진행상태'
  ],
  ['center', 'left', 'left', 'center', 'center', 'center', 'center']
]
// 교육 문제풀이 SET
export const eduQuizGridInfo = [
  ['educationKindCdLargeName', 'eduQuestionMstName'],
  ['교육종류', '문제풀이 SET 명'],
  ['center', 'left']
]
// 위험성평가
export const riskAssessmentGridInfo = [
  [
    'plantName',
    'ramTechniqueName',
    'assessmentName',
    'ramStepName',
    'assessmentDate',
    'ramAssessTypeName',
    'regUserName',
    'reviewUserName',
    'approvalUserName'
  ],
  ['사업장', '분류', '평가명', '진행단계', '평가기간', '평가구분', '작성자', '검토자', '승인자'],
  ['center', 'center', 'left', 'center', 'center', 'center', 'center', 'center', 'center'],
  [],
  [
    { colName: 'plantName', style: 'width: 8%' },
    { colName: 'ramTechniqueName', style: 'width: 8%' }
  ]
]
// 관리감독자 평가대상자
export const evaluateeGridInfo = [
  ['evaluateeName', 'evaluator1Name', 'evaluator2Name'],
  ['평가대상자', '1차 평가자', '2차 평가자'],
  ['center', 'center', 'center']
]
// 관리감독자 평가
export const supervisorEvalGridInfo = [
  [
    'checkName',
    'checkYear',
    'checkSemiAnnualName',
    'checkDate',
    'evaluateeName',
    'evaluator1Name',
    'evaluator2Name',
    'completeName'
  ],
  ['평가명', '평가년도', '상/하반기', '평가일', '평가대상자', '평가자1', '평가자2', '진행상태'],
  ['left', 'center', 'center', 'center', 'center', 'center', 'center', 'center']
]
// 건강검진
export const checkupGridInfo = [
  ['plantName', 'checkupTypeName', 'checkupName', 'hospitalName', 'checkupDate'],
  ['사업장', '건강검진 종류', '제목', '병원', '검진기간'],
  ['center', 'center', 'left', 'center', 'center']
]
// 유해인자
export const hazardFactorGridInfo = [
  ['hazardClassFstName', 'hazardClassSecName', 'hazardCd', 'casNo', 'hazardName'],
  ['유해인자 대분류', '유해인자 중분류', '유해인자코드', 'CAS NO.', '유해인자명'],
  ['center', 'center', 'center', 'center', 'left']
]
// 시설
export const facilityGridInfo = [
  ['facilityName', 'facilityNo', 'hcfFacilityTypeName', 'materialNames'],
  ['시설명(차량번호)', '시설관리번호', '시설유형', '취급자재'],
  ['center', 'center', 'center', 'left']
]
// 근골격계 조사계획
export const muscleGridInfo = [
  ['plantName', 'investigationPlanName', 'year', 'heaInvestigationStepName'],
  ['사업장', '조사계획명', '년도', '진행단계'],
  ['center', 'left', 'center', 'center']
]
// 규제항목
export const regulGridInfo = [
  ['regulationBillName', 'regulatedItemCd', 'regulatedItemName'],
  ['규제 법규', '규제항목 코드', '규제항목 명'],
  ['center', 'center', 'left']
]
// 위험성평가-관련자료
export const riskRelationDocuInfo = [
  ['ramDocumentTypeName', 'documentTitle'],
  ['분류', '제목'],
  ['center', 'left']
]
// 잠재위험 발굴 보고서
export const nearAccidentInfo = [
  [
    'plantName',
    'iimNearAccidentNo',
    'iimNearAccidentName',
    'processName',
    'iimStatusNearName',
    'iimNearKindName',
    'iimGradeName',
    'occurrenceLocation',
    'occurrenceDt'
  ],
  [
    '사업장',
    '사고번호',
    '사고명',
    '공정',
    '진행상태',
    '사고종류',
    '사고등급',
    '발생가능장소',
    '발생일시'
  ],
  ['center', 'center', 'left', 'center', 'center', 'center', 'center', 'left', 'center']
]
// 사고
export const accidentInfo = [
  [
    'plantName',
    'accidentNo',
    'accidentName',
    'processName',
    'accidentStatusName',
    'accidentKindName',
    'accidentGradeName',
    'occurrenceDate'
  ],
  ['사업장', '사고번호', '사고명', '공정', '진행상태', '사고종류', '사고등급', '발생일시'],
  ['center', 'center', 'left', 'center', 'center', 'center', 'center', 'center']
]
// 내부심사 체크리스트
export const internalAuditChecklistInfo = [
  ['systemElementsName', 'sortOrder1', 'itemName', 'aimMatter', 'sortOrder'],
  ['시스템요소', '요소순번', '내부심사 항목', '착안사항', '순번'],
  ['left', 'center', 'left', 'left', 'center'],
  [
    { index: 0, colName: 'saiInternalAuditChecklistSystemId' },
    { index: 1, colName: 'saiInternalAuditChecklistSystemId' }
  ],
  [
    { colName: 'systemElementsName', style: 'width: 12%' },
    { colName: 'sortOrder', style: 'width: 3%' }
  ]
]
// 자체감사
export const complianceGridInfo = [
  [
    'plantName',
    'selfInspectionYear',
    'selfInspectionTitle',
    'selfInspectionTypeName',
    'selfInspectionStartDt',
    'selfInspectionEndDt',
    'selfInspectionStatusName',
    'approvalStatusName'
  ],
  ['사업장', '감사년도', '감사명', '감사종류', '감사시작일', '감사종료일', '진행단계', '결재상태 '],
  ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center']
]
// 유해화학물질
export const hazardChemGridInfo = [
  [
    'plantName',
    'mdmChemMaterialName',
    'chemNmEn',
    'casNo',
    'limitRepval',
    'propertiesStateName',
    'boilPoint',
    'flashPoint',
    'firePoint',
    'fugacity',
    'toxicPoisonFlag',
    'toxicPermitFlag',
    'toxicLimitFlag',
    'toxicProhibitFlag',
    'storageFacilityFlag',
    'maxStorageAmount',
    'keepFacilityFlag',
    'maxKeepAmount'
  ],
  [
    '사업장',
    '화학자재명',
    '구성물질명',
    'CAS No.',
    '함량(%)',
    '성상',
    '끓는점 (℃)',
    '인화점 (℃)',
    '발화점 (℃)',
    '비산성',
    '유독물질',
    '허가물질',
    '제한물질',
    '금지물질',
    '저장시설',
    '최대저장량(t)',
    '보관시설',
    '최대보관량(t)'
  ],
  [
    'center',
    'left',
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center'
  ],
  [
    { index: 0, colName: 'mdmChemMaterialName' },
    { index: 1, colName: 'mdmChemMaterialName' },
    { index: 5, colName: 'mdmChemMaterialName' },
    { index: 6, colName: 'mdmChemMaterialName' },
    { index: 7, colName: 'mdmChemMaterialName' },
    { index: 8, colName: 'mdmChemMaterialName' },
    { index: 9, colName: 'mdmChemMaterialName' },
    { index: 10, colName: 'mdmChemMaterialName' },
    { index: 11, colName: 'mdmChemMaterialName' },
    { index: 12, colName: 'mdmChemMaterialName' },
    { index: 13, colName: 'mdmChemMaterialName' },
    { index: 14, colName: 'mdmChemMaterialName' },
    { index: 15, colName: 'mdmChemMaterialName' },
    { index: 16, colName: 'mdmChemMaterialName' },
    { index: 17, colName: 'mdmChemMaterialName' }
  ],
  [
    { colName: 'plantName', style: 'width: 80px' },
    { colName: 'mdmChemMaterialName', style: 'width: 160px' },
    { colName: 'chemNmEn', style: 'width: 280px' },
    { colName: 'casNo', style: 'width: 90px' }
  ]
]
// 보호구
export const safetyGearGridInfo = [
  ['plantName', 'safetyTypeName', 'safetyGearName', 'supplyVendorName', 'unitName', 'stockCount'],
  ['사업장', '보호구종류', '보호구명', '공급업체명', '단위', '재고'],
  ['center', 'center', 'left', 'left', 'center', 'right']
]
// 보호구 신청
export const safetyGearRequestGridInfo = [
  ['safetyTypeName', 'safetyGearName', 'requestCount', 'remarks'],
  ['보호구종류', '보호구명', '신청수량', '비고'],
  ['center', 'left', 'right', 'left']
]
// 비상조치계획
export const emergencyActionPlanGridInfo = [
  ['emergencyPlanName', 'emergencyTypeName', 'emergencyClassCd'],
  ['계획서명', '비상사태구분', '비상사태유형'],
  ['center', 'center', 'center']
]
// 훈련 시나리오
export const trainingScenarioGridInfo = [
  [
    'plantName',
    'emergencyTypeName',
    'emergencyPlanName',
    'revisionNum',
    'trainingScenarioName',
    'trainingContentsSummary'
  ],
  ['사업장', '구분', '비상조치계획서명', 'Rev.', '훈련시나리오명', '훈련내용 요약'],
  ['center', 'center', 'left', 'center', 'left', 'left'],
  [
    { index: 0, colName: 'plantCd' },
    { index: 1, colName: 'emergencyTypeCd' },
    { index: 2, colName: 'mergeGroup' }
  ],
  [
    { colName: 'plantName', style: 'width: 8%' },
    { colName: 'emergencyTypeName', style: 'width: 12%' },
    { colName: 'emergencyPlanName', style: 'width: 14%' },
    { colName: 'revisionNum', style: 'width: 4%' },
    { colName: 'trainingScenarioName', style: 'width: 16%' }
  ]
]
// 밀폐공간용 장비
export const closedEquipGridInfo = [
  ['plantName', 'equipmentTypeName', 'equipmentName', 'equipmentStockNumber', 'unitName'],
  ['사업장', '장비종류', '장비명', '창고 재고량', '단위'],
  ['center', 'left', 'left', 'right', 'center']
]
// 위험물저장소
export const hazardStorageGridInfo = [
  [
    'plantName',
    'chmDangerTypeName',
    'chmDangerArea',
    'chmDangerMstName',
    'chmDangerUserName',
    'chmDangerCount'
  ],
  ['사업장', '구분', '위험물저장소명', '보관 품명', '담당자', '지정수량배수'],
  ['center', 'center', 'left', 'left', 'center', 'center']
]
// 위험물 및 지정수량
export const dangerItemGridInfo = [
  ['regulatedItemName', 'regulationDesc', 'dangerItemName', 'quantity'],
  ['위험물 분류', '위험물 성질', '위험물 품명', '지정수량 (kg/L)'],
  ['center', 'center', 'left', 'center'],
  [
    { index: 0, colName: 'regulatedItemCd' },
    { index: 1, colName: 'regulatedItemCd' }
  ]
]
// 위험물저장소 점검항목
export const dangerStorageChecklistGridInfo = [
  ['chmDangerTypeName', 'dangerCheckItem', 'dangerCheckContent', 'dangerCheckMethod'],
  ['구분', '점검항목', '점검내용', '점검방법'],
  ['center', 'left', 'left', 'left']
]
// 위험물저장소에 설치된 소방설비
export const fireFightingEquipGridInfo = [
  [
    'plantName',
    'manageNo',
    'fireFightingName',
    'sopFireFightingTypeName',
    'processName',
    'deptName'
  ],
  ['사업장', '관리번호', '소방설비 및 장비명', '유형', '관련공정', '관리부서'],
  ['center', 'center', 'left', 'center', 'left', 'left']
]
// 소방설비 설치할 장소
export const fireFightingLocationGridInfo = [
  ['plantName', 'locationName'],
  ['사업장', '장소명'],
  ['center', 'left']
]
// 비상대응훈련
export const trainingGridInfo = [
  [
    'plantName',
    'trainingName',
    'trainingDate',
    'eapTrainingTypeName',
    'trainingArea',
    'trainingCompleteFlagName',
    'trainingInstructUserNames'
  ],
  ['사업장', '훈련명', '훈련일시', '훈련구분', '훈련장소', '훈련완료여부', '교관'],
  ['center', 'left', 'center', 'center', 'center', 'center', 'left']
]
// 선해임현황
export const seniorStatusGridInfo = [
  ['plantName', 'relatedLawsName', 'seniorName', 'seniorUserTotal', 'seniorDate'],
  ['사업장', '관련법규', '선임명', '선임자', '선임일'],
  ['center', 'left', 'left', 'center', 'center']
]

// 유해위험기계기구
export const hazardequipGridInfo = [
  [
    'plantName',
    'machineryName',
    'itemNo',
    'machineryClassificationName',
    'departmentDeptName',
    'departmentUserName'
  ],
  ['사업장', '기계명', 'item 번호', '기계분류', '담당부서', '담당자'],
  ['center', 'left', 'center', 'center', 'center', 'center']
]
// 중장비
export const heqforkGridInfo = [
  ['plantName', 'facilityTypeName', 'facilityName', 'deviceNo', 'managerNo', 'processName'],
  ['사업장', '중장비 유형', '중장비명', '기기번호', '관리번호', '공정'],
  ['center', 'left', 'center', 'center', 'center', 'center']
]
// 대기 배출구
export const airOutletGridInfo = [
  [
    'plantName',
    'outletSemsFacilityId',
    'outletSemsId',
    'outletPermitNo',
    'outletIepsNo',
    'outletName',
    'outletHeight',
    'outletInnerDiameter',
    'iepsFlag',
    'selfMeasureExemptionFlag',
    'processNo',
    'processName'
  ],
  [
    '사업장',
    '배출구시설ID(SEMS)',
    '배출구일련번호(SEMS)',
    '허가증상배출구번호(SEMS)',
    '배출구번호(IEPS)',
    '배출구명',
    '배출구높이(m)',
    '배출구내경(m)',
    'IEPS시설여부',
    '자가측정면제여부',
    '공정번호',
    '공정명'
  ],
  [
    'center',
    'center',
    'center',
    'center',
    'center',
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center'
  ],
  [],
  [{ colName: 'outletName', style: 'width: 25%' }]
]

// 대기 연결방지시설
export const airPreventiveGridInfo = [
  [
    'plantName',
    'preventiveSemsId',
    'preventivePermitNo',
    'preventiveIepsNo',
    'preventiveName',
    'preventiveIepsPlantMgtNo'
  ],
  [
    '사업장',
    '방지시설일련번호(SEMS)',
    '허가증상방지시설번호(SEMS)',
    '방지시설관리번호(IEPS)',
    '방지시설명',
    '사업장관리번호(IEPS)'
  ],
  ['center', 'center', 'center', 'center', 'left', 'center'],
  [],
  [
    { colName: 'preventiveName', style: 'width: 20%' },
    { colName: 'preventiveSemsId', style: 'width: 15%' },
    { colName: 'preventivePermitNo', style: 'width: 17%' }
  ]
]

// 대기 적산전력계
export const airWattmeterGridInfo = [
  [
    'plantName',
    'envAirMstWattmeterNo',
    'envAirMstWattmeterName',
    'wattmeterUnit',
    'wattmeterMagnification'
  ],
  ['사업장', '적산전력계 번호', '적산전력계 구분명', '단위', '배율'],
  ['center', 'center', 'center', 'center']
]

// 사업장별 대기 검사항목
export const airInspectItemGridInfo = [
  [
    'plantName',
    'airInspectTypeName',
    'envAirMstInspectItemName',
    'airInspectUnitName',
    'legalStandard',
    'innerStandard'
  ],
  ['사업장', '검사구분', '검사항목', '단위', '법적기준', '내부기준'],
  ['center', 'center', 'left', 'center', 'center', 'center']
]

// 대기 검사항목
export const airInspectItemMstGridInfo = [
  [
    'airInspectTypeName',
    'inspectItemIepsCd',
    'inspectItemSemsCd',
    'envAirMstInspectItemName',
    'airInspectUnitName',
    'legalStandard',
    'innerStandard'
  ],
  ['검사구분', 'IEPS오염물질코드', 'SEMS오염물질코드', '검사항목', '단위', '법적기준', '내부기준'],
  ['center', 'center', 'center', 'left', 'center', 'center', 'center']
]

// 대기 배출시설
export const airDischargeGridInfo = [
  [
    'plantName',
    'dischargeSemsId',
    'dischargePermitNo',
    'dischargeIepsNo',
    'dischargeName',
    'dischargeIepsPlantMgtNo'
  ],
  [
    '사업장',
    '배출시설일련번호(SEMS)',
    '허가증상배출시설번호(SEMS)',
    '배출시설관리번호(IEPS)',
    '배출시설명',
    '사업장관리번호(IEPS)'
  ],
  ['center', 'center', 'center', 'center', 'left', 'center'],
  [],
  [
    { colName: 'dischargeName', style: 'width: 30%' },
    { colName: 'dischargeIepsPlantMgtNo', style: 'width: 20%' }
  ]
]

// 대기 원료
export const airMaterialGridInfo = [
  ['plantName', 'envAirMstMaterialName', 'airMaterialUnitName'],
  ['사업장', '원료명', '단위'],
  ['center', 'left', 'center']
]

// 폐기물 종류
export const wasteMstGridInfo = [
  [
    'plantNames',
    'envWasteKindName',
    'envWasteCd',
    'envWasteName',
    'state',
    'processName',
    'processTypeName',
    'processLocation',
    'transportName',
    'officeName'
  ],
  [
    '사업장',
    '폐기물 종류',
    '폐기물코드',
    '폐기물명',
    '성상',
    '처리자',
    '처리방법',
    '처리장소',
    '운반자',
    '관할관청'
  ],
  ['center', 'center', 'center', 'left', 'center', 'center', 'left', 'left', 'center', 'left'],
  [{ index: 0, colName: 'envWasteMstId' }],
  [
    { colName: 'plantNames', style: 'width: 6%' },
    { colName: 'envWasteKindName', style: 'width: 6%' },
    { colName: 'envWasteCd', style: 'width: 5%' },
    { colName: 'envWasteName', style: 'width: 20%' },
    { colName: 'state', style: 'width: 6%' },
    { colName: 'processName', style: 'width: 7%' },
    { colName: 'processType', style: 'width: 25%' },
    { colName: 'processLocation', style: 'width: 17%' },
    { colName: 'transportName', style: 'width: 7%' },
    { colName: 'officeName', style: 'width: 7%' }
  ]
]

// TBM
export const tbmGridInfo = [
  [
    'plantName',
    'tbmNo',
    'tbmName',
    'workSummary',
    'tbmLocation',
    'tbmDate',
    'vendorName',
    'tbmLeaderName',
    'permitTypeName'
  ],
  ['사업장', 'TBM번호', 'TBM명', '작업허가서', '장소', 'TBM일', '업체', 'TBM리더', '허가서구분'],
  ['center', 'center', 'left', 'center', 'left', 'center', 'center', 'center', 'center']
]

// 순회점검
export const patrolGridInfo = [
  [
    'plantName',
    'processName',
    'vendorName',
    'sopMapId',
    'patrolName',
    'patrolDate',
    'patrolCompleteFlagName'
  ],
  ['사업장', '공정', '부서', '순회장소', '순회명', '순회일', '진행상태'],
  ['center', 'center', 'center', 'left', 'left', 'center', 'center']
]

// 수급업체 평가
export const vendorAssessGridInfo = [
  [
    'plantName',
    'vendorName',
    'vendorEvaluationKindName',
    'approvalStatusName',
    'totalScore',
    'score',
    'evaluationGradeName',
    'evaluationDate',
    'remarks'
  ],
  ['사업장', '수급업체', '평가구분', '상태', '총점', '평점', '등급', '평가기간', '평가결과 종합'],
  ['center', 'left', 'center', 'center', 'center', 'center', 'center', 'center', 'left']
]

// 개선
export const imprGridInfo = [
  [
    'plantName',
    'ibmTaskTypeName',
    'ibmTitle',
    'ibmStepName',
    'improveRequestDeptName',
    'improveRequestContents',
    'actionCompleteRequestDate',
    'approvalStatusName',
    'actionDeptName',
    'actionUserNames',
    'actionCompleteDate'
  ],
  [
    '사업장',
    '업무',
    '제목',
    '진행단계',
    '요청부서',
    '요청정보',
    '조치완료 요청일',
    '지연 결재',
    '조치완료 요청일',
    '조치부서',
    '조치자',
    '조치완료일'
  ],
  [
    'center',
    'center',
    'left',
    'center',
    'center',
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center'
  ]
]

// 작업환경측정
export const workMeasureGridInfo = [
  ['plantName', 'measPlanContent', 'measQuarterName', 'measDate', 'measPlaceName'],
  ['사업장', '측정계획명', '분기', '측정일', '측정기관'],
  ['center', 'left', 'center', 'center', 'center']
]

// 유해위험요인
export const riskHazardGridInfo = [
  ['ramRiskHazardClassName', 'riskHazardNumber', 'riskHazardName', 'relevantLegalStandards'],
  ['유해위험요인 분류', '분류번호', '유해위험요인', '관련근거(법적기준)'],
  ['center', 'center', 'left', 'left'],
  [{ index: 0, colName: 'ramRiskHazardClassCd' }],
  [{ colName: 'ramRiskHazardClassName', style: 'width: 16%' }]
]

// 밀폐공간
export const closedSpaceGridInfo = [
  [
    'plantName',
    'closedSpaceTypeName',
    'heaClosedSpaceName',
    'remark',
    'managerName',
    'mapName',
    'permitFlag'
  ],
  ['사업장', '종류', '밀폐공간명', '설명', '관리자', '지도명', '허가필요여부'],
  ['center', 'center', 'left', 'left', 'center', 'center', 'center']
]

// 가스
export const gasGridInfo = [
  ['gasName', 'safetyStandards'],
  ['가스항목명', '안전기준'],
  ['center', 'left']
]

// 토양오염대상시설
export const soilPollutionFacilityGridInfo = [
  ['facilityTypeName', 'facilityName'],
  ['시설유형', '시설명'],
  ['center', 'left']
]

// 온실가스 배출원(연료)
export const ghgFuelGridInfo = [
  ['rawFuelName', 'rawFuelTypeName'],
  ['배출원(연료)명', '단위'],
  ['center', 'center']
]

// 온실가스 배출원(연료)
export const ghgFacilityEquipmentGridInfo = [
  [
    'facilityTypeName',
    'processName',
    'deptName',
    'facilityName',
    'equipmentName',
    'rawFuelName',
    'rawFuelTypeName'
  ],
  ['배출형태', '공장명', '부서명', '시설명', '설비명', '배출원(연료)명', '단위'],
  ['center', 'center', 'center', 'center', 'center', 'center', 'center']
]

// 온실가스 배출시설
export const ghgFacilityGridInfo = [
  ['facilityTypeName', 'processName', 'deptName', 'facilityName'],
  ['배출형태', '공장명', '부서명', '시설명'],
  ['center', 'center', 'center', 'center']
]

// 환경 공정
export const envProcessGridInfo = [
  ['plantName', 'processNo', 'processName', 'upProcessName'],
  ['사업장', '공정번호', '공정', '상위공정'],
  ['center', 'center', 'center', 'center'],
  []
]

// IEPS 공정
export const envOnlyProcGridInfo = [
  ['processNo', 'processName', 'upProcessCd'],
  ['공정관리번호', '공정명', '상위공정관리번호'],
  ['center', 'center', 'center'],
  [],
  [{ colName: 'upProcessName', style: 'width: 15%' }]
]

// 수질 배출구
export const waterOutletGridInfo = [
  [
    'plantName',
    'outletIepsNo',
    'outletIepsPlantMgtNo',
    'envWaterMstOutletName',
    'processNo',
    'processName'
  ],
  ['사업장', '배출구번호(IEPS)', '사업장관리번호(IEPS)', '배출구명', '공정번호', '공정명'],
  ['center', 'center', 'center', 'left', 'center', 'center'],
  [],
  [{ colName: 'envWaterMstOutletName', style: 'width: 25%' }]
]

// 수질 검사항목
export const waterInspectItemMstGridInfo = [
  [
    'inspectItemIepsCd',
    'envWaterMstInspectItemName',
    'waterInspectUnitName',
    'legalStandard',
    'innerStandard',
    'method'
  ],
  ['IEPS오염물질코드', '오염물질명', '단위', '법적기준', '내부기준', '검사방법'],
  ['center', 'left', 'center', 'center', 'center', 'left']
]

// 관리 감독자
export const checkUserGridInfo = [
  ['deptName', 'jobName', 'spotName', 'userName'],
  ['부서', '분류', '직급', '이름'],
  ['center', 'center', 'center', 'center']
]

// 수질 적산전력계
export const waterWattmeterGridInfo = [
  [
    'plantName',
    'envWaterMstWattmeterNo',
    'envWaterMstWattmeterName',
    'wattmeterUnit',
    'wattmeterMagnification'
  ],
  ['사업장', '적산전력계 번호', '적산전력계명', '단위', '배율'],
  ['center', 'center', 'center', 'center']
]

// 수질 방지시설
export const waterPreventiveGridInfo = [
  [
    'plantName',
    'deptName',
    'envWaterMstPreventiveName',
    'preventiveIepsPlantMgtNo',
    'processNo',
    'processName',
    'wattmeterFlag'
  ],
  [
    '사업장',
    '관리부서',
    '방지시설명',
    '사업장관리번호(IEPS)',
    'IEPS공정',
    'IEPS공정번호',
    '전력계부착여부'
  ],
  ['center', 'center', 'left', 'center', 'center', 'center', 'center'],
  [],
  [{ colName: 'envWaterMstPreventiveName', style: 'width: 25%' }]
]

// TMS 마스터
export const tmsMstGridInfo = [
  [
    'outletName',
    'outletIepsNo',
    'dischargeName',
    'inspectItem',
    'manufacturer',
    'deviceName',
    'type',
    'approvalNo',
    'serialNo',
    'method',
    'manageTypeName',
    'approvalDate',
    'acquisitionDate'
  ],
  [
    '대기배출구명',
    'IEPS번호',
    '배출시설',
    '측정항목',
    '제조사',
    '기기명',
    '모델',
    '형식승인번호',
    '기기고유번호',
    '측정방법',
    '관리형태',
    '형식승인일자',
    '취득일자'
  ],
  [
    'center',
    'center',
    'center',
    'center',
    'center',
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center'
  ]
]

// TMS 마스터 메인
export const tmsMstMainGridInfo = [
  ['outletIepsNo', 'outletName', 'tmsNo'],
  ['IEPS번호', '대기배출구명', 'TMS번호'],
  ['center', 'center', 'center']
]
// 유소견자
export const checkupOpinionGrid = [
  [
    'deptName',
    'userName',
    'jobClassName',
    'gender',
    'birthDate',
    'enterDate',
    'checkupDate',
    'hazardName',
    'healthType',
    'checkupOpinion',
    'afterManage',
    'suitableFlag',
    'afterCare'
  ],
  [
    '부서',
    '대상자',
    '직종',
    '성별',
    '생년월일',
    '입사일',
    '검진일',
    '취급물질',
    '판정',
    '소견',
    '조치',
    '업무적합성',
    '사후관리'
  ],
  [
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'left',
    'left',
    'center',
    'left'
  ],
  [
    { index: 0, colName: 'deptCd' },
    { index: 1, colName: 'heaCheckupResultId' },
    { index: 2, colName: 'heaCheckupResultId' },
    { index: 3, colName: 'heaCheckupResultId' },
    { index: 4, colName: 'heaCheckupResultId' },
    { index: 5, colName: 'heaCheckupResultId' },
    { index: 6, colName: 'heaCheckupResultId' }
  ]
]

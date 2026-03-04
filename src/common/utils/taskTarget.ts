/** literal type */
export type targetLiteralType =
  | 'equip' // 설비
  | 'facility' // 시설
  | 'vendor' // 업체
  | 'vendorUser' // 업체 관리자
  | 'process' // 공정
  | 'upProcess' // 상위공정
  | 'license' // 인허가
  | 'licenseKind' // 인허가 종류
  | 'materialProcess' // 자재
  | 'material' // 자재
  | 'materialType' // 자재분류
  | 'chemMaterial' // 화학자재
  | 'chemBase' // 화학물질
  | 'ghsHarmfulRiskClass' // 유해위해성 분류
  | 'user' // 사용자
  | 'deptUser' // 부서 / 사용자
  | 'dept' // 부서
  | 'senior' // 선해임
  | 'law' // 법규
  | 'lawCode' // 법규 코드
  | 'lawRegister' // 법규등록부 관리
  | 'eduCourse' // 교육과정
  | 'moc' // 변경관리
  | 'sop1' // SOP [공정, 작업]
  | 'sop2' // SOP [공정, 작업, 작업단계]
  | 'sop3' // SOP [공정, 작업, 작업단계, 유해위험요인]
  | 'sop4' // SOP [공정, 작업, 작업단계, 유해위험요인, 원인]
  | 'sop5' // SOP [공정, 유해위험요인]
  | 'sop6' // SOP [공정, 작업, 유해위험요인, 원인]
  | 'sop7' // SOP [공정, 작업, 유해위험요인]
  | 'construction' // 공사
  | 'workPermit' // 작업허가서
  | 'edu' // 교육
  | 'chemReview' // 사전검토
  | 'checkup' // 건강검진
  | 'hazardFactor' // 유해인자
  | 'eduQuiz' // 교육 풀이
  | 'muscle' // 근골격계 조사계획
  | 'regul' // 규제항목
  | 'riskAssessment' // 위험성평가
  | 'evaluatee' // 관리감독자 평가대상자
  | 'supervisorEval' // 관리감독자 평가
  | 'riskRelationDocu' // 위험성평가-관련자료
  | 'nearAccident' // 아차사고
  | 'accident' // 사고
  | 'internalAuditChecklist' // 내부심사 체크리스트
  | 'compliance' // 자체감사
  | 'hazardChem' // 유해화학물질
  | 'safetyGear' // 보호구
  | 'safetyGearRequest' // 보호구 신청
  | 'emergencyActionPlan' // 비상조치계획
  | 'trainingScenario' // 훈련시나리오
  | 'closedEquip' // 밀폐공간 작업장비
  | 'hazardStorage' // 위험물저장소
  | 'dangerItem' // 위험물 및 지정수량
  | 'dangerStorageChecklist' // 위험물저장소 점검항목
  | 'fireFightingEquip' // 위험물저장소 소방설비
  | 'fireFightingLocation' // 소방설비 배치할 장소
  | 'training' // 비상대응훈련
  | 'seniorStatus' // 선행미현황
  | 'hazardequip' // 유해위험기계기구
  | 'airOutlet' // 대기 배출구
  | 'airPreventive' // 대기 방지시설
  | 'airWattmeter' // 적산전력계
  | 'airInspectItem' // 사업장별 대기 검사항목
  | 'airInspectItemMst' // 사업장별 대기 검사항목
  | 'airDischarge' // 대기 배출시설
  | 'wasteMst' // 폐기물종류
  | 'tbm' // TBM
  | 'patrol' // 순회점검
  | 'vendorAssess' // 수급업체 평가
  | 'impr' // 개선
  | 'airMaterial' // 대기 원료
  | 'workMeasure' // 작업환경측정
  | 'riskHazard' // 유해위험요인
  | 'heqfork' // 중장비
  | 'closedSpace' // 밀폐공간
  | 'soilPollutionFacility' // 토양오염대상시설
  | 'ghgFuel' // 온실가스 배출원(연료)
  | 'ghgFacilityEquipment' // 온실가스 배출시설 설비
  | 'ghgFacility' // 온실가스 배출시설
  | 'envProcess' // 환경 IEPS 공정
  | 'envOnlyProcess' // 한국철강용 공정
  | 'waterOutlet' // 수질 배출구
  | 'waterInspectItemMst' // 수질 검사항목
  | 'checkUser' // 관리감독자
  | 'waterWattmeter' // 수질 전력계
  | 'waterPreventive' // 수질 방지시설
  | 'tmsMst' // TMS 마스터
  | 'tmsMstMain' // TMS 마스터 메인
  | 'gas'
  | 'checkupOpinion' // 유소견자
// 주석 필수로 달기

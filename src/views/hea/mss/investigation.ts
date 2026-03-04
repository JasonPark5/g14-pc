import { dataBaseType } from '@/types/dataBase'

export interface investigationType extends dataBaseType {
  heaInvestigationPlanId: stringNull // 근골격계 조사계획 일련번호
  plantCd?: stringNull // 사업장코드
  investigationPlanName?: stringNull // 조사계획명
  year?: stringNull // 심사년도
  heaInvestigationStepCd?: stringNull // 진행상태
  investigationStartDate?: stringNull // 조사시작일
  investigationEndDate?: stringNull // 조사종료일
  period?: Array<string>
  deptCd?: stringNull // 담당자 부서
  userId?: stringNull // 담당자 id
  investigationDeptCd?: stringNull // 조사부서
  agency?: stringNull // 조사기관
  remark?: stringNull // 비고
  regUserId?: stringNull // 등록자 ID
  chgUserId?: stringNull // 수정자 ID
  sops?: Array<sopType> // 단위작업
  sopTable?: Array<any> // 작업분류표
}

export interface heavyWorkType extends dataBaseType {
  detailJobContents?: stringNull // 작업내용
  assessResult?: stringNull // 평가결과
  heaHeavyWorkNo?: stringNull // 부담작업No
  exopsureCnt?: string | number | null
  exposureTime?: string | number | null
  heaMuscleHeavyWorkId?: stringNull
  heaMuscleSopId?: stringNull
  heaInvestigationPlanId?: stringNull
  mdmSopId?: stringNull
  plantCd?: stringNull
  heavyWorkName?: stringNull // 부담작업No명 `${key}항`
  regUserId?: stringNull
  userId?: stringNull // 조사자
  userName?: stringNull // 조사자
  deptCd?: stringNull // 조사자 부서
  investigationDate?: stringNull // 조사일자
  workTime?: stringNull // 작업시간
  workCnt?: stringNull // 작업횟수
  workTotal?: stringNull // 총 노출시간
  workload?: stringNull // 작업부하
  workFrequency?: stringNull // 작업빈도
  totalScore?: stringNull // 총 점수
  src?: stringNull
  bodyDesc?: stringNull // 신체부위
  positionDesc?: stringNull // 작업자세 및 내용
  weightDesc?: stringNull // 무게
  sortOrder?: stringNull // 순번
  useFlag?: stringNull // 사용여부
}

export interface sopType extends dataBaseType {
  heavyWorks?: Array<heavyWorkType>
  mdmSopId?: stringNull
  heaMuscleSopId?: stringNull
  heaInvestigationPlanId?: stringNull
  heaMuscleSopStepCd?: stringNull // 진행상태
  processCd?: stringNull
  processName?: stringNull
  sopName?: stringNull
  heaInvestigationTypeCd?: stringNull // 조사구분
  investigationStartDate?: stringNull // 조사일시
  investigationDate?: stringNull // 조사일시
  deptCd?: stringNull // 조사자 부서
  userId?: stringNull // 조사자 id
  remark?: stringNull // 비고
  workers?: Array<any>
  heavyWorkIncludes?: Array<heavyWorkType> // 부담작업 결과 O
  heavyWorkHazards?: Array<any> // 유해요인
  situations?: Array<situationType> // 상황조사
  results?: Array<any> // 결과표
  imprs?: Array<any> // 개선
}

export interface situationType extends dataBaseType {
  heaMuscleSopSituationId?: stringNull // 근골격계 단위작업 상황조사 일련번호
  heaMuscleSopId?: stringNull // 근골격계 단위작업 일련번호
  heaInvestigationPlanId?: stringNull // 근골격계 조사계획 일련번호
  heaMuscleSopSituationGubunCd?: stringNull // 작업장 상황 조사 구분 코드
  heaMuscleSopSituationGubunName?: stringNull // 작업장 상황 조사 구분 코드
  changeFlag?: stringNull // 변화유무
  remark?: stringNull // 내용요약
}

export interface surveyType extends dataBaseType {
  plantCd?: stringNull
  heaMuscleWorkerSurveyId?: stringNull // 근골격계 단위작업 작업자 설문 일련번호
  heaInvestigationPlanId?: stringNull // 근골격계 조사계획 일련번호
  heaMuscleSurveyStepCd?: stringNull // 설문현황
  userId?: stringNull // 유저 시퀀스
  userName?: stringNull // 사용자명
  deptName?: stringNull // 부서명
  age?: stringNull // 연령
  career?: stringNull
  sexCd?: stringNull // 성별
  deptLine?: stringNull // 작업부서 라인
  deptWork?: stringNull // 작업부서 수행작업
  marriageFlag?: stringNull // 결혼여부
  curWorkContents?: stringNull // 현재작업 - 작업내용
  curWorkRange?: stringNull // 현재작업 - 작업기간
  onedayWorkTimeHour?: stringNull // 1일 근무시간 - 시간
  onedayWorkTimeRestMin?: stringNull // 1일 근무시간 - 휴식 - 분
  onedayWorkTimeRestCnt?: stringNull // 1일 근무시간 - 휴식 - 횟수
  pastWorkContents?: stringNull // 현작업 전에 했던 작업 - 작업내용
  pastWorkRange?: stringNull // 현작업 전에 했던 작업 - 작업기간
  checklsit1?: stringNull // 체크리스트 1
  checklsit2?: stringNull // 체크리스트 2
  checklsit3?: stringNull // 체크리스트 3
  checklsit4?: stringNull // 체크리스트 4
  checklsit5?: stringNull // 체크리스트 5
  lastQue?: stringNull // 통증부위 설문여부
  neck?: stringNull // 목
  neck1?: stringNull // 목 - 1
  neck2?: stringNull // 목 - 2
  neck3?: stringNull // 목 - 3
  neck4?: stringNull // 목 - 4
  neck5?: stringNull // 목 - 5
  neck6?: stringNull // 목 - 6
  neck6etc?: stringNull // 목 - 6기타
  necketc?: stringNull
  shoulder?: stringNull // 어깨
  shoulder1?: stringNull // 어깨 - 1
  shoulder2?: stringNull // 어깨 - 2
  shoulder3?: stringNull // 어깨 - 3
  shoulder4?: stringNull // 어깨 - 4
  shoulder5?: stringNull // 어깨 - 5
  shoulder6?: stringNull // 어깨 - 6
  shoulder6etc?: stringNull // 어깨 - 6기타
  shoulderetc?: stringNull
  arm?: stringNull // 팔/팔꿈치
  arm1?: stringNull // 팔/팔꿈치 - 1
  arm2?: stringNull // 팔/팔꿈치 - 2
  arm3?: stringNull // 팔/팔꿈치 - 3
  arm4?: stringNull // 팔/팔꿈치 - 4
  arm5?: stringNull // 팔/팔꿈치 - 5
  arm6?: stringNull // 팔/팔꿈치 - 6
  arm6etc?: stringNull // 팔/팔꿈치 - 6기타
  armetc?: stringNull
  hand?: stringNull // 손/손목/손가락
  hand1?: stringNull // 손/손목/손가락 - 1
  hand2?: stringNull // 손/손목/손가락 - 2
  hand3?: stringNull // 손/손목/손가락 - 3
  hand4?: stringNull // 손/손목/손가락 - 4
  hand5?: stringNull // 손/손목/손가락 - 5
  hand6?: stringNull // 손/손목/손가락 - 6
  hand6etc?: stringNull // 손/손목/손가락 - 6기타
  handetc?: stringNull
  waist?: stringNull // 허리
  waist1?: stringNull // 허리 - 1
  waist2?: stringNull // 허리 - 2
  waist3?: stringNull // 허리 - 3
  waist4?: stringNull // 허리 - 4
  waist5?: stringNull // 허리 - 5
  waist6?: stringNull // 허리 - 6
  waist6etc?: stringNull // 허리 - 6기타
  waistetc?: stringNull
  leg?: stringNull // 다리/발
  leg1?: stringNull // 다리/발 - 1
  leg2?: stringNull // 다리/발 - 2
  leg3?: stringNull // 다리/발 - 3
  leg4?: stringNull // 다리/발 - 4
  leg5?: stringNull // 다리/발 - 5
  leg6?: stringNull // 다리/발 - 6
  leg6etc?: stringNull // 다리/발 - 6기타
  legetc?: stringNull
}

export interface answerType extends dataBaseType {
  approvalStatusName?: stringNull
  checklistName?: stringNull
  chgDt?: stringNull
  chgDtStrTime?: stringNull
  chgUserDeptName?: stringNull
  chgUserName?: stringNull
  heaMuscleWorkerSurveyChecklistId?: stringNull
  heaMuscleWorkerSurveyInquiryId?: stringNull
  inquiries?: Array<answerType> | null
  plantCd?: stringNull
  plantCdList?: Array<string>
  plantName?: stringNull
  regDt?: stringNull
  regDtStrTime?: stringNull
  regUserDeptName?: stringNull
  regUserName?: stringNull
  sortOrder?: numberNull
  useFlag?: stringNull
  userDeptCd?: stringNull
  value?: stringNull
}

export type musculoskleltalSystemTargetLiteralType =
  | 'neck'
  | 'neck1'
  | 'neck2'
  | 'neck3'
  | 'neck4'
  | 'neck5'
  | 'neck6'
  | 'neck6etc'
  | 'necketc'
  | 'shoulder'
  | 'shoulder1'
  | 'shoulder2'
  | 'shoulder3'
  | 'shoulder4'
  | 'shoulder5'
  | 'shoulder6'
  | 'shoulder6etc'
  | 'shoulderetc'
  | 'arm'
  | 'arm1'
  | 'arm2'
  | 'arm3'
  | 'arm4'
  | 'arm5'
  | 'arm6'
  | 'arm6etc'
  | 'armetc'
  | 'hand'
  | 'hand1'
  | 'hand2'
  | 'hand3'
  | 'hand4'
  | 'hand5'
  | 'hand6'
  | 'hand6etc'
  | 'handetc'
  | 'waist'
  | 'waist1'
  | 'waist2'
  | 'waist3'
  | 'waist4'
  | 'waist5'
  | 'waist6'
  | 'waist6etc'
  | 'waistetc'
  | 'leg'
  | 'leg1'
  | 'leg2'
  | 'leg3'
  | 'leg4'
  | 'leg5'
  | 'leg6'
  | 'leg6etc'
  | 'legetc'
  | 'checklsit1'
  | 'checklsit2'
  | 'checklsit3'
  | 'checklsit4'
  | 'checklsit5'

import { dataBaseType } from '@/types/dataBase'

export interface eduCourseType extends dataBaseType {
  plantName?: stringNull
  eduCourseId?: stringNull // 교육과정 일련번호
  plantCd?: stringNull // 사업장 코드
  educationCourseName?: stringNull // 교육과정명
  educationKindCdLarge?: stringNull // 교육종류(대)
  educationKindCdSmall?: stringNull // 교육종류(소)
  educationTypeCd?: stringNull // 전사자체/부서자체/사내위탁/사외교육/연수/기타
  legalEducationFlag?: stringNull // 법정교육 여부
  sumEducationTime?: stringNull // 총 교육소요시간
  educationCycle?: stringNull // 법정교육주기
  educationPurpose?: stringNull // 학습목적
  mainTargetAudience?: stringNull // 주요 대상자
  estimatedEducationExpenses?: stringNull // 예상 교육비
  relationLaws?: stringNull // 관련 법규
  useFlag?: stringNull // 사용여부
  eduQuestionMstId?: stringNull // 문제풀이 마스터 일련번호
  eduQuestionFlag?: stringNull // 문제풀이 사용여부
  eduQuestionPassScore?: numberNull // 문제풀이 통과 기준점수
  educationLocation?: stringNull // 교육장소
  ramRiskAssessmentPlanId?: stringNull // 관련 3단계판단법 일련번호
  educationMethodCd?: stringNull // 교육방법코드
  vod?: stringNull // 교육동영상

  eduCourseSubjectList?: arrayObject | null // 과정별 교육과목
  deleteEduCourseSubjectList?: arrayObject | null // 제외과목
  eduCourseUserList?: arrayObject | null // 대상자
  deleteEduCourseUserList?: arrayObject | null // 제외 대상자
  eduCourseDeptList?: arrayObject | null // 대상부서
  deleteEduCourseDeptList?: arrayObject | null // 제외 대상부서
  eduCourseSeniorList?: arrayObject | null // 대상 선임
  deleteEduCourseSeniorList?: arrayObject | null // 제외 대상 선임
  seniorId?: stringNull
}

export interface eduCourseSubjectType extends dataBaseType {
  eduCourseId: stringNull
  subjectNo: stringNull
  subjectName: stringNull // 교육명
  educationTime: stringNull // 교육시간
  instructorName: stringNull // 강사명
}

export interface eduCourseUserType extends dataBaseType {
  eduCourseId: stringNull
  userId: stringNull
  userName: stringNull
  plantCd: stringNull
  plantName: stringNull
  deptCd: stringNull
  deptName: stringNull
  spotCd: stringNull
  spotName: stringNull
  jobCd: stringNull
  jobName: stringNull
}

export interface eduCourseDeptType extends dataBaseType {
  eduCourseId: stringNull
  deptCd: stringNull
  deptName: stringNull
}

export interface eduCourseSeniorType extends dataBaseType {
  eduCourseId: stringNull
  seniorId: stringNull
  seniorName: stringNull
}

export interface eduCoursePopupParamType {
  eduCourseId: stringNull
}

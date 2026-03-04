import { dataBaseType } from '@/types/dataBase'

export interface performanceEvaluationType extends dataBaseType {
  evaluationId?: stringNull
  plantCd?: stringNull
  evaluationName?: stringNull // 성과평가명
  evaluationDate?: stringNull // 평가일자
  targetDeptCds?: stringNull // 평가대상부서코드
  evaluationTargetDeptName?: stringNull // 평가대상부서명
  evaluationUserId?: stringNull // 작성자ID
  evaluationUserName?: stringNull // 작성자
  evaluationStatusCd?: stringNull // 진행상태 코드
  evaluationStatusName?: stringNull // 진행상태
  resultRemark?: stringNull // 결과요약
  evaluationResultList?: Array<performanceEvaluationResultType> | null
  deleteEvaluationResultList?: Array<performanceEvaluationResultType> | null
  targetDeptList?: any[]
  deleteTargetDeptList?: any[]
}

export interface performanceEvaluationResultType extends dataBaseType {
  plantCd?: stringNull
  evaluationId?: stringNull
  evaluationResultId?: stringNull
  deptCd?: stringNull
  evaluationItemTypeCd?: stringNull
  evaluationItemTypeName?: stringNull
  evaluationItem?: stringNull
  evaluationItemDetail?: stringNull
  evaluationResultCd?: stringNull
  achievementRate?: stringNull
  evaluationContents?: stringNull
  remarks?: stringNull
  perc000001?: stringNull
  perc000005?: stringNull
  perc000010?: stringNull
  sopImprovementIds?: stringNull
}

export type resultCdType = 'perc000001' | 'perc000005' | 'perc000010'

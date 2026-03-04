import { dataBaseType } from '@/types/dataBase'

export interface eduResultPopupParamType {
  eduPlanTime?: objectString | null
  plantCd?: stringNull
  eduEducationId?: stringNull
  eduCourseId?: stringNull
  stepCd?: stringNull
}

export interface questionMstType extends dataBaseType {
  eduQuestionMstId: stringNull // 교육 문제풀이 마스터 일련번호
  eduQuestionMstName?: stringNull // 교육 문제풀이 SET명
  educationKindCdLarge?: stringNull // 교육종류(대)
  eduQuestionPassScore?: stringNull // 물제풀이 통과 기준점수
  useFlag?: stringNull // 사용여부
  delFlag?: stringNull // 삭제여부
  questions?: Array<questionType> | null
  delQuestions?: Array<questionType> | null
}

export interface questionType extends dataBaseType {
  eduQuestionMstId: stringNull // 교육 문제풀이 마스터 일련번호
  eduQuestionId: stringNull // 교육 문제풀이 문제 일련번호
  questionSortOrder?: numberNull // 문제 순번
  questionContent?: stringNull // 문제내용
  questionPoint?: stringNull // 문제 배점
  delFlag?: stringNull // 삭제여부
  answers?: Array<answerType> | null
  delAnswers?: Array<answerType> | null
}

export interface answerType extends dataBaseType {
  eduQuestionId: stringNull // 교육 문제풀이 문제 일련번호
  eduAnswerId: stringNull // 교육 문제풀이 답변 일련번호
  answerSortOrder?: numberNull // 정답 순번
  answerContent?: stringNull // 정답내용
  answerFlag?: stringNull // 정답여부
  delFlag?: stringNull // 삭제여부
}

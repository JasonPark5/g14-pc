import { dataBaseType } from '@/types/dataBase'
import { lawType } from '../law'

export interface lawReviewPopupParamType {
  mdmLawCheckId: stringNull
}
export interface lawCheckType extends lawType, dataBaseType {
  mdmLawCheckId: stringNull // 법령검토 번호
  lawId: stringNull // 법령ID
  mdmLawId: stringNull // 시행일 법령 번호
  mdmLawStepCd: stringNull // 진행단계
  mdmLawStepName?: stringNull // 진행단계
  managerId: stringNull // 담당자id
  managerName?: stringNull // 담당자
  acceptDeptCds: stringNull // 적용부서
  acceptDeptNames?: stringNull // 적용부서
  currentLawContents: stringNull // 현행 법규내용 요약
  reLawContents: stringNull // 개정 법규내용 요약
  applicableFacility: stringNull // 해당시설
  reviewRequestContents: stringNull // 검토요청내용
  remark: stringNull // 비고
  checkUsers: Array<lawCheckUserType>
  deleteCheckUsers: Array<lawCheckUserType>
}
export interface lawCheckUserType extends dataBaseType {
  mdmLawCheckUserId: stringNull // 법령검토자 번호
  mdmLawCheckId: stringNull // 법령검토 번호
  checkUserId: stringNull // 담당자id
  checkUserName: stringNull // 담당자
  checkDeptCd: stringNull // 담당자 부서
  checkDeptName: stringNull // 담당자 부서
  finishFlag: stringNull // 검토완료여부
  remark: stringNull // 비고
}

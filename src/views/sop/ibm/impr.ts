import { dataBaseType } from '@/types/dataBase'

export interface imprPopupType {
  isSearch: boolean
  sopImprovementId: stringNull
  ibmTaskTypeCd: stringNull
  ibmTaskUnderTypeCd: stringNull // 업무하위분류코드
  data: stringNull
  requestContents: stringNull
  relationTableKey: stringNull
  vendorCd: stringNull
}
export interface imprImmPopupType {
  isSearch: boolean
  sopImprovementId: stringNull
  ibmTaskTypeCd: stringNull
  ibmTaskUnderTypeCd: stringNull // 업무하위분류코드
  requestContents: stringNull
  relationTableKey: stringNull
  vendorCd?: stringNull
}

export interface imprType extends dataBaseType {
  sopImprovementId: stringNull // 개선 일련번호
  plantCd: stringNull // 사업장 코드
  ibmTaskTypeCd: stringNull // 업무분류코드
  ibmTaskUnderTypeCd: stringNull // 업무하위분류코드
  ibmTitle: stringNull // 제목
  request: stringNull
  improveRequestDeptCd: stringNull // 개선요청부서
  improveRequestDeptName: stringNull // 개선요청부서명
  improveRequestUserId: stringNull // 개선요청자
  improveRequestUserName: stringNull // 개선요청자명
  improveRequestContents: stringNull // 개선요청내용
  ibmClassCd: stringNull
  ibmStepCd: stringNull // 개선진행단계
  relationTableKey: stringNull // 관련테이블 키
  relationVendor: stringNull // 관련업체_기술
  actionScheduleDate: stringNull // 조치예정일
  actionCompleteRequestDate: stringNull // 조치완료 요청일
  reviewCompleteRequestDate: stringNull // 검토완료 요청일
  actionCompleteDate: stringNull // 조치완료일
  actionFlag: stringNull // 조치부서_조치부서는 변경가능
  actionVendorCd: stringNull // 조치부서_조치부서는 변경가능
  actionDeptCd: stringNull // 조치부서_조치부서는 변경가능
  actionUserIds: arrayString | null // 조치자s
  actionContents: stringNull // 조치내용_조치부서에서
  reviewContents: stringNull // 요청부서 조치결과 검토_요청부서에서
  actionCompleteCheckUserId: stringNull // 조치완료 확인자_부서장 또는 공장장
  actionCompleteCheckFlag: stringNull // 조치완료 확인자 확인 여부
  requestRejectReason: stringNull // 요청취소사유

  targetDate: stringNull // 목표일 - 지연
  delayReason: stringNull // 지연사유
  completeDateOver: numberNull

  saveSuppleFlag: stringNull // 적합/보완 여부 저장된 정보
  suppleFlag: stringNull // 적합/보완 여부
  ibmSuppleStepCd: stringNull // 개선보완진행단계
  suppleRequest: stringNull // 보완할 사항
  suppleScheduleDate: stringNull // 보완완료 요청일
  suppleActionContents: stringNull // 보완처리 내용
  suppleCompleteDate: stringNull // 보완완료일
  suppleReviewContents: stringNull // 보완 검토 내용
  suppleCheckFlag: stringNull

  sopConstructionId: stringNull

  approvalStatusCd: stringNull // 결재관련 결재상태
  sysApprovalRequestId: stringNull // 결재관련 결재요청코드
  regUserId: stringNull // 등록자 ID
  regDt: stringNull
  chgUserId: stringNull // 수정자 ID
  actionUsers: arrayObject | null

  stepFlag: numberNull
}

export interface imprImmType extends dataBaseType {
  sopImprovementId: stringNull // 개선 일련번호
  plantCd: stringNull // 사업장 코드
  ibmClassCd: stringNull
  ibmTaskTypeCd: stringNull // 업무분류코드
  ibmTaskUnderTypeCd: stringNull
  ibmTitle: stringNull // 제목
  request: stringNull
  actionFlag: stringNull
  sopConstructionId?: stringNull
  improveRequestDeptCd: stringNull // 개선요청부서
  improveRequestDeptName: stringNull // 개선요청부서명
  improveRequestUserId: stringNull // 개선요청자
  improveRequestUserName: stringNull // 개선요청자명
  improveRequestContents: stringNull // 개선요청내용
  ibmStepCd: stringNull // 개선진행단계
  relationTableKey: stringNull // 관련테이블 키
  relationVendor: stringNull // 관련업체_기술
  actionScheduleDate: stringNull // 조치예정일
  actionCompleteRequestDate: stringNull // 조치완료 요청일
  reviewCompleteRequestDate: stringNull // 검토완료 요청일
  actionCompleteDate: stringNull // 조치완료일
  actionDeptCd?: stringNull // 조치부서_조치부서는 변경가능
  actionVendorCd?: stringNull
  actionContents: stringNull // 조치내용_조치부서에서
  reviewContents: stringNull // 요청부서 조치결과 검토_요청부서에서
  actionCompleteCheckUserId: stringNull // 조치완료 확인자_부서장 또는 공장장
  actionCompleteCheckFlag: stringNull // 조치완료 확인자 확인 여부
  requestRejectReason: stringNull // 요청취소사유
  regDt: stringNull
}

export interface taskParamType {
  sopImprovementId: stringNull
  ibmTaskTypeCd: stringNull
  ibmTaskUnderTypeCd: stringNull
  relationTableKey: stringNull
}

export interface relationTaskType {
  sopImprovementId: stringNull
  ibmTaskTypeCd: stringNull
  ibmTaskUnderTypeCd: stringNull
  relationTableKey: stringNull
  relationTableTitle: stringNull
  relationTableNavi: stringNull
  relationTableContents: stringNull
}

export interface taskRateType {
  ibmClassCd: stringNull
  improveRequestDeptCd: stringNull
  improveRequestDeptName: stringNull
  ibmTaskTypeCd: stringNull
  ibmTaskTypeName: stringNull
  requesting: stringNull
  receipting: stringNull
  actioning: stringNull
  confirming: stringNull
  complete: stringNull
  overAction: stringNull
  immTotal: stringNull
  supple: stringNull
  fit: stringNull
  noAction: stringNull
  notYet: stringNull
  requestTotal: stringNull
}

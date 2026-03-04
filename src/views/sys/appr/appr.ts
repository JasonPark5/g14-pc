export interface apprPopupParamType {
  sysApprovalRequestId?: stringNull // 결재 요청 일련번호
  approvalTypeCd?: stringNull // 결재 유형 코드
  approvalRequestName?: stringNull // 결재 요청명
  approvalParamValue?: stringNull // 결재 파라미터
  approvalConnId?: stringNull // 결재업무 연결용 업무일련번호
  approvalDocType?: stringNull // 결재문서 타입
}
export interface apprType {
  approvalTypeCd: stringNull // 결재유형코드
  approvalTypeName: stringNull // 결재업무명
  approvalUrl: stringNull // 결재화면 page경로
  approvalParam: stringNull // 결재파라메터
  approvalContent: stringNull // 결재메일내용
}
export interface reqData {
  approvalTypeCd: stringNull // 결재유형코드
  approvalRequestName: stringNull // 결재 요청명
  approvalStatusCd: stringNull // 결재상태
  approvalParam: stringNull // 결재파라메터
}
export interface apprInfo {
  approvalTypeCd?: stringNull // 결재유형코드
  approvalRequestName?: stringNull // 결재 요청명
  approvalTypeName?: stringNull // 결재업무명
  approvalUrl?: stringNull // 결재화면 page경로
  approvalStatusCd?: stringNull // 결재상태
  approvalParam?: stringNull // 결재파라메터
  approvalParamValue?: stringNull
  approvalConnId?: stringNull
}

import { dataBaseType } from '@/types/dataBase'
import { eduCourseType } from '../edu/cc/eduCourse'

export interface seniorInterface extends dataBaseType {
  seniorId: stringNull
  relatedLaws: stringNull
  qualifiyRequire: stringNull
  useFlag: stringNull
  seniorName: stringNull
  seniorStandard: stringNull
  seniorClassCd: stringNull
  reportAppointCd: stringNull
  seniorFieldCd: stringNull
  regUserId: stringNull
  eduList: Array<eduCourseType> | null
  editFlag: stringNull
}

export interface seniorStatusType extends dataBaseType {
  qualifiyRequire?: stringNull
  relatedLaws?: stringNull
  seniorStatusId: stringNull // 선해임현황 key
  plantCd: stringNull // 사업장
  seniorId: stringNull // 선해임명 key
  seniorName: stringNull // 선해임명
  seniorUserId: stringNull // 선임 user
  seniorDate: stringNull // 선임일
  relatedCertificate: stringNull // 관련자격증
  certificateNo: stringNull // 자격증번호
  certificateAcquiDate: stringNull // 자격취득일
  relatedReason: stringNull // 관련근거
  seniorReason: stringNull // 선임사유
  groupId: stringNull // 일련번호 키
  sysRevision: stringNull // 시스템 개정번호
  revisionNum: stringNull // 개정번호
  dismissalFlag: stringNull // 해임여부
  dismissalDate: stringNull // 해임일
  dismissalFlagSave: stringNull // 해임여부 (저장된 정보)
  dismissalDateSave: stringNull // 해임일 (저장된 정보)
  revisionContent: stringNull // 개정사유
  regUserId: stringNull // 등록자 ID
  chgUserId: stringNull // 수정자 ID
  eduStatuses: object[] // 교육 이수 상태
}

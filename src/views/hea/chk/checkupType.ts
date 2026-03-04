import { dataBaseType } from '@/types/dataBase'

export interface checkupType extends dataBaseType {
  heaCheckupPlanId: stringNull
  plantCd?: stringNull
  checkupName: stringNull
  checkupTypeCd: stringNull
  uploadFlag?: stringNull
  checkupStartDate: stringNull
  checkupEndDate: stringNull
  checkupDateArray?: Array<string>
  hospitalId: stringNull
  hospitalName?: stringNull
  hospitalLocation: stringNull
  typeFlag: stringNull
  resultCnt?: numberNull
}

export interface hospitalType extends dataBaseType {
  code: stringNull
  codeName: stringNull
  typeFlag: stringNull
}

export interface resultType extends dataBaseType {
  heaCheckupPlanId?: stringNull
  jobClassName?: stringNull
  checkupTypeName?: stringNull
  age?: numberNull
  workPeriod?: numberNull
  upDeptName?: stringNull
  deptName?: stringNull
  userId?: stringNull
  userName?: stringNull
  empNo?: stringNull
  checkupDate?: stringNull
  checkupNo?: stringNull
  birthDate?: stringNull
  hospitalName?: stringNull
  examines?: Array<examType>
  opinions?: Array<examType>
  healthType?: stringNull
  suitableFlag?: stringNull
  hazardName?: stringNull
  checkupOpinion?: stringNull
  opinionDetailResult?: stringNull
  afterManage?: stringNull
  remark?: stringNull
  customReg?: stringNull
  error_message?: stringNull
  heaCheckupResultId?: stringNull
  heaCheckupResultOpinionId?: stringNull
  heaCheckupUploadId?: stringNull
  heaCheckupOpinionUploadId?: stringNull
  saveDetails?: Array<examType>
}

export interface suspectType extends dataBaseType {
  suspectId: stringNull
  heaCheckupResultOpinionId?: stringNull
  heaCheckupPlanId?: stringNull
  userId?: stringNull
  userName?: stringNull
  healthType?: stringNull
  regUserId?: stringNull
  plantName?: stringNull
  deptName?: stringNull
  appointDate?: stringNull
  releaseDate?: stringNull
  releaseRemark?: stringNull
}

export interface examType extends dataBaseType {
  examineName?: stringNull
  examineResult?: stringNull
  heaCheckupPlanId?: stringNull
  examineId?: stringNull
  examineData?: stringNull
}

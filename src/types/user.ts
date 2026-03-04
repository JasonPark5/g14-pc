export type userType = {
  /** 사용자 정보 */
  id?: string
  jobCd?: string
  jobName?: string
  loginId: string
  loginPwd: string
  mobileNo?: string
  oripassword: string
  password: string
  deptCd: string
  deptName: string
  deptUserName?: string
  email?: string
  empNo: string
  enterDate?: string
  birthDate?: string
  plantCd: string
  plantCds: string
  plantName: string
  recommendationFlag?: string
  remark?: string
  retireDate?: string
  retireFlag?: string
  seniorName?: string
  seniorityName?: string
  sexCd?: string
  sexName?: string
  spotCd?: string
  spotName?: string
  typeName?: string
  userId: string
  oldUserId?: stringNull
  userName: string
  /** 메뉴 정보 */
  menuNm?: string
  dashboardId?: string
  approveSignature?: string
  url?: string
  /** 권한 정보 */
  /** 검진 */
  checkupBatchCycleCd?: string
  checkupComeDate?: string
  checkupCycleCd?: string
  checkupOccCycleCd?: string
  checkupRecentDate?: string
  checkupScheduleDate?: string
  checkupStatus?: string
  cycleCd?: string
  cycleName?: string
  nightRemark?: string
  nightWorkFlag?: string
  defectManageFlag?: string
  hazardNames?: string
  jobClassCd?: string
}

export type userNameType =
  | 'user'
  | 'dept_user'
  | 'plant_dept_user'
  | 'dept_spot_user'
  | 'dept_job_user'
  | 'detail_user'

export class User {
  private userName: string
  private deptName: string
  private plantName: string
  private jobName: string
  private spotName: string
  private empNo: string

  constructor(userName: string, deptName: string, plantName: string, jobName: string, empNo: string)
  constructor(userName: string, deptName: string, plantName: string)
  constructor(userName: string, deptName: string)
  constructor(userName: string)
  constructor(
    userName: string,
    deptName?: string,
    plantName?: string,
    jobName?: string,
    spotName?: string,
    empNo?: string
  ) {
    this.userName = userName
    this.deptName = deptName || ''
    this.plantName = plantName || ''
    this.jobName = jobName || ''
    this.spotName = spotName || ''
    this.empNo = empNo || ''
  }

  public getUserName = (type: userNameType): string => {
    switch (type) {
      case 'user':
        return `${this.userName}`
      case 'dept_user':
        return `${this.deptName} / ${this.userName}`
      case 'plant_dept_user':
        return `${this.plantName} / ${this.deptName} / ${this.userName}`
      case 'dept_job_user':
        return `${this.deptName} / ${this.jobName} / ${this.userName}`
      case 'dept_spot_user':
        return `${this.deptName} / ${this.spotName} / ${this.userName}`
      case 'detail_user':
        return `${this.deptName} / ${this.empNo} / ${this.userName}`
      default:
        return `${this.userName}`
    }
  }
}

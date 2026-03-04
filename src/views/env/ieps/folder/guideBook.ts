import { dataBaseType } from '@/types/dataBase'

export interface guideBookType extends dataBaseType {
  opmGuidebookId?: stringNull
  plantCd?: stringNull
  guidebookNo?: stringNull
  guidebookName?: stringNull
  approvalUserId?: stringNull
  examineUserId?: stringNull
  regUserId?: stringNull
  chgUserId?: stringNull
  useFlag?: stringNull
  remark?: stringNull
  revisionNum?: stringNull
  groupId?: stringNull
  sysRevision?: numberNull
  revisionContent?: stringNull
  regDtStr?: stringNull
  regUserName?: stringNull
  sopMocId?: stringNull
  sysMenuId?: stringNull // 메뉴 SEQ
  menuNm?: stringNull // 메뉴 SEQ
  content?: stringNull // 매뉴얼 내용
}

export interface folderType extends dataBaseType {
  iepsFolderId?: stringNull
  iepsParentFolderId?: stringNull
  folderName?: stringNull
  plantCd?: stringNull
}

export interface folderDetailType extends dataBaseType {
  iepsFolderDetailId?: stringNull
  iepsFolderId?: stringNull
  folderDetailName?: stringNull
  groupId?: stringNull
  revNo?: numberNull
  revisionNum?: stringNull
  revisionContent?: stringNull
  plantCd?: stringNull
  standardDate?: stringNull
  sortOrder?: stringNull
  deleteFlag?: stringNull
  useFlag?: stringNull
}

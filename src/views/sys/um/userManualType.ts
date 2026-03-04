import { dataBaseType } from '@/types/dataBase'
import { commonType } from '@/views/psi/processSafetyInfo'

export interface userManualType extends dataBaseType, commonType {
  userManualId: stringNull
  taskName: stringNull
  taskSummary?: stringNull
  deleteFlag?: stringNull
  sortOrder?: numberNull
}

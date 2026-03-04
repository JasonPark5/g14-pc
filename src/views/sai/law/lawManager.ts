export interface lawIdType {
  lawId: stringNull
  lawName: stringNull
  users: Array<lawManagerType> | null
}
export interface lawManagerType {
  mdmLawManagerId: stringNull
  lawId: stringNull
  lawName: stringNull
  userId: stringNull
  userName: stringNull
}

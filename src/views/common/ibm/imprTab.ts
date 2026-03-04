export interface imprTabInfoType {
  key: string
  ibmTaskTypeCd: string
  ibmTaskUnderTypeCd: string
  requestContents: string
  disabled: boolean
  isOld: boolean
  isTable: boolean
  gridItem: {
    listUrl: string
    param: any
    title: string
    data: Array<any>
    merge: Array<tableMergeType> | null | undefined
    columns: Array<tableColumnType>
    research: {
      impr: string
      item: string
    }
  }
  gridOther: {
    title: string
  }
}

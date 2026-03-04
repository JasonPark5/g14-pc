import { find } from 'lodash-es'

import selectConfig from '@utils/selectConfig'

export type treeOptionsType = {
  targetKey: string
  url: string
  upTaskCd: string
  taskCd: string
  taskName: string
}

const treeOptions: Array<treeOptionsType> = [
  {
    /** 설비 유형 */
    targetKey: 'equipClass',
    url: selectConfig.mdm.equipment.class.list.url,
    upTaskCd: 'upEquipmentTypeCd',
    taskCd: 'equipmentTypeCd',
    taskName: 'equipmentTypeName'
  }
]

/** targetKey에 따른 tree options 찾아 반환 */
export function getTreeOption(targetKey: string): treeOptionsType {
  return find(treeOptions, { targetKey: targetKey }) as treeOptionsType
}

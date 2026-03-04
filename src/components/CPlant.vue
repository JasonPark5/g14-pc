<template>
  <c-select
    :stype="stype"
    :comboItems="plantItems"
    :editable="editable"
    :required="required"
    :disabled="disabled || roleAccess"
    :type="type"
    :label="label"
    :error="error"
    :validMessage="validMessage"
    itemText="codeName"
    itemValue="code"
    :name="props.name || 'plantCd'"
    v-model:value="value"
    @datachange="
      (val: objectStringNumber) => {
        datachange(val)
      }
    "
  />
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

/******************************
 * @import_선언
 * TODO 아래 순서에 맞추어 import (각 순서 마다 띄우기)
 *  * 1. Dependency
 *  * 2. Utils
 *  * 3. Types
 *  * 4. Stores
 *  * 5. Vue
 *  * 6. Etc (생길 시 얘기.)
 *******************************/
import { ref, watch, onBeforeMount, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { reject, forEach } from 'lodash-es'

// import { getComboItems } from '@utils/common'

import { arrayObject, objectStringNumber } from '@/types/variable'

import { useUserStore } from '@stores/user'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CPlant'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** plantStore 호출 */
const plantStore = usePlantStore()
const { plants, isFetching } = storeToRefs(plantStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['datachange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  type?: string
  stype?: string
  editable?: boolean
  disabled?: boolean
  required?: boolean
  label?: string
  width?: number
  state?: boolean
  filterPlant?: string
  rejectPlant?: string
  isFirstValue?: boolean
  isTable?: boolean
  isEnterprise?: boolean
  enterpriseDefault?: boolean
  error?: ErrorFunction
  validMessage?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: '',
  type: 'edit',
  stype: 'select',
  editable: true,
  disabled: false,
  required: false,
  label: '사업장',
  width: 8,
  filter: '',
  reject: '',
  isFirstValue: true,
  isTable: false,
  isEnterprise: false,
  enterpriseDefault: false
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: '',
  type: String as PropType<string | null | undefined>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const isFrist = ref(true)
const roleAccess = ref(false)
const allPlant = ref('')
const plantItems = ref<arrayObject>([])

/******************************
 * @Vue_query_선언
 *******************************/

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => isFetching.value,
  () => {
    setPlantItems(plants.value)
  }
)
watch(
  () => value.value,
  () => {
    if (!props.isTable) {
      if (isFrist.value && props.isFirstValue && !value.value) {
        isFrist.value = false
        value.value = user.value.plantCd
      }

      if (isFrist.value) {
        isFrist.value = false
      }
    } else {
      if (!value.value) {
        value.value = user.value.plantCd
      }
    }
  }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  if (value.value) {
    if (props.isEnterprise && props.enterpriseDefault) {
      value.value = 'ENTERPRISE'
    }
  } else {
    if (props.isEnterprise && props.enterpriseDefault) {
      value.value = 'ENTERPRISE'
    } else if (props.isFirstValue) {
      const defaultPlantCd = window.sessionStorage.getItem('defaultPlantCd')
      if (defaultPlantCd !== null) {
        value.value = defaultPlantCd
      } else {
        value.value = user.value.plantCd
      }
    } else {
      value.value = null
    }
  }
  setPlantItems(plants.value)
  // getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setPlantItems(items: Array<codeMasterType>) {
  if (isFetching.value) return
  if (plantItems.value && plantItems.value.length > 0) {
    plantItems.value = new Array<objectStringNumber>()
  }
  let plantCds
  if (user.value.plantCds === null || user.value.plantCds === '') {
    plantCds = user.value.plantCd.split(',')
    allPlant.value = user.value.plantCd
  } else {
    plantCds = user.value.plantCds.split(',')
    allPlant.value = user.value.plantCds
  }
  forEach(items, (_item) => {
    if (props.isEnterprise && _item.code == 'ENTERPRISE') {
      plantItems.value.push(_item)
    }
    const index = plantCds.findIndex((a) => a === _item.code)
    if (index > -1) {
      plantItems.value.push(_item)
    }
  })
  if (props.rejectPlant !== undefined) {
    plantItems.value = reject(plantItems.value, {
      code: props.rejectPlant
    })
  }
}
/******************************
 * TODO (목적): 사용자에 맞는 사업장 셋팅
 *******************************/
// function getList() {
//   getComboItems('PLANT_CD').then((_result: any) => {
//     if (plantItems.value && plantItems.value.length > 0) {
//       plantItems.value = new Array<objectStringNumber>()
//     }
//     let plantCds
//     if (user.value.plantCds === null || user.value.plantCds === '') {
//       plantCds = user.value.plantCd.split(',')
//       allPlant.value = user.value.plantCd
//     } else {
//       plantCds = user.value.plantCds.split(',')
//       allPlant.value = user.value.plantCds
//     }
//     forEach(_result, (_item) => {
//       if (props.isEnterprise && _item.code == 'ENTERPRISE') {
//         plantItems.value.push(_item)
//       }
//       const index = plantCds.findIndex((a) => a === _item.code)
//       if (index > -1) {
//         plantItems.value.push(_item)
//       }
//     })
//     if (props.rejectPlant !== undefined) {
//       plantItems.value = reject(plantItems.value, {
//         code: props.rejectPlant
//       })
//     }
//   })
// }
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function datachange(newValue: objectStringNumber) {
  const oldValue = _.clone(value.value)
  if (newValue.value === null) {
    if (props.type !== 'edit') {
      if (props.isEnterprise) {
        newValue.value = allPlant.value + ',ENTERPRISE,'
      } else {
        newValue.value = allPlant.value + ','
      }
      value.value = String(newValue.value) // : cselect 다시 정의되고 나면 봐야함
    }
  }
  // 데이터가 변경되는 경우 처리 해당 속성이 설정되어 있으면 조회처리하도록 수정
  emits('datachange', newValue, oldValue)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

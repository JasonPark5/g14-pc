<!--
목적 : select 기반 select 컴포넌트(Not Autocomplete)
Detail :
  comboConfig.js 정보를 참고하여 컴포넌트 렌더링시 select 데이터 조회 해서 option 추가
 *
examples:
 *
-->
<template>
  <div class="fix-height">
    <q-select
      multiple
      use-chips
      use-input
      :options="filterItems"
      no-error-icon
      stack-label
      :clearable="clearable"
      :label="$language(label)"
      :rules="[validRule]"
      :validMessage="validMessage"
      :disable="disabled || !editable"
      color="orange-custom"
      :dense="stype === 'tableselect' || stype === 'tableHeaderselect'"
      :class="[
        stype === 'tableselect'
          ? 'customMultiTableSelect'
          : stype === 'tableHeaderselect'
            ? 'customTableHeaderSelect'
            : 'customMultiSelect'
      ]"
      option-disable="disable"
      v-model="vValue"
      @update:model-value="input"
      @filter="filterFn"
      @clear="clear"
    >
      <template v-if="label" v-slot:label>
        <div class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
          <slot name="suffixLabel" />
        </div>
      </template>
      <template v-slot:selected-item="scope">
        <template v-if="scope.opt">
          <q-chip
            :removable="scope.opt.disable ? false : true"
            outline
            square
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="orange-custom"
            class="q-ma-none customchip"
          >
            {{ scope.opt.label }}
          </q-chip>
        </template>
      </template>
      <template v-slot:append>
        <q-icon
          name="close"
          @click.stop.prevent="clear"
          class="cursor-pointer multiselect-close"
          style="font-size: 14px"
        />
      </template>
    </q-select>
  </div>
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
import { ref } from 'vue'
// eslint-disable-next-line vue/no-dupe-keys
import { find, reject, filter, forEach, indexOf, isArray, clone, split, cloneDeep } from 'lodash-es'

import { getComboItems } from '@/common/utils/common'
import { arrayObject, arrayString, objectStringNumber } from '@/types/variable'

import { GetTranLanguageFunction } from '@/types/language'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CMultiSelect'
})
/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['update:value', 'datachange', 'setCodeData'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
interface propType {
  name?: string
  value: objectStringNumber | arrayObject | undefined | null
  stype?: string
  label?: string
  editable?: boolean
  type?: string
  comboItems?: arrayObject | undefined
  itemText?: string
  itemValue?: string
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  dense?: boolean
  codeGroupCd?: string
  codeAttrVal1?: string
  isObject?: boolean
  valueText?: string
  valueKey?: string
  disabledItems?: arrayObject | undefined
  isArray?: boolean
  error?: ErrorFunction
  validMessage?: stringNull
}

/******************************
 * @Interface_선언
 *******************************/

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: '',
  value: null,
  stype: 'select',
  color: 'orange-custom',
  label: '',
  editable: true,
  type: 'none',
  comboItems: undefined,
  itemText: '',
  itemValue: '',
  disabled: false,
  required: false,
  clearable: false,
  dense: true,
  codeGroupCd: '',
  codeAttrVal1: '',
  isObject: false,
  valueText: '',
  valueKey: '',
  disabledItems: undefined,
  isArray: true
})

/******************************
 * @VModel_선언
 *******************************/
// const value = defineModel('value', {
//   default: null,
//   type: [Array, String] as PropType<arrayString | string | null>
// })

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const vValue = ref<arrayObject | arrayString | string | undefined | null>('')
const items = ref<arrayObject>([])
const filterItems = ref<arrayObject>([])

/******************************
 * @Computed_선언
 *******************************/
// const placeholder = computed(() => (props.type === 'edit' ? $language('선택') : $language('전체')))
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.value,
  () => {
    setValue()
  }
)
watch(
  () => props.comboItems,
  () => {
    makeSelectOptions(props.comboItems)
  },
  { deep: true }
)
watch(
  () => items.value,
  () => {
    setValue()
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
 * TODO (목적): 초기화
 *******************************/
function init() {
  if (Array.isArray(props.value) && props.value && props.value.length > 0) {
    if (Array.isArray(props.value)) {
      vValue.value = cloneDeep(props.value)
    } else {
      // String type으로 구분자가 ,로 들어오는 경우는 value값만
      if (props.value !== '') {
        vValue.value = split(props.value, ',')
      }
    }
  } else {
    vValue.value = []
  }
  if (props.comboItems && props.comboItems.length > 0) {
    makeSelectOptions(props.comboItems)
  } else if (props.codeGroupCd) {
    getItems()
  }
}

/******************************
 * TODO (목적): 입력할 때 타는 함수
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function input() {
  // TODO : 부모에게 변경여부 전달
  const emitData: Array<any> = []
  if (vValue.value && Array.isArray(vValue.value) && vValue.value.length > 0) {
    forEach(vValue.value, (_item: any) => {
      /**
       * 다음 두 상황으로 value를 return 할수 있게 처리
       *
       * 1. value만 Array에 담기는 경우
       * 2. Object로 itemText, itemValue에 맞춰 Array에 담기는 경우
       */
      if (props.isObject) {
        // case 1
        const data: any = find(items.value, { value: _item.value })
        const pushData: objectStringNumber = {}
        pushData[props.valueText] = data!.label
        pushData[props.valueKey] = data!.value
        emitData.push(pushData)
      } else {
        // case 2
        emitData.push(_item.value)
      }
    })
  }
  emits('update:value', props.isArray ? emitData : emitData.toString())
  emits('datachange', vValue.value)
}

/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/

function getItems() {
  getComboItems(props.codeGroupCd).then((_result: any) => {
    if (props.disabledItems && props.disabledItems.length > 0) {
      forEach(_result, (item) => {
        if (indexOf(props.disabledItems, item.code) > -1) {
          item.disable = true
        }
      })
    }
    makeSelectOptions(_result)
    emits('setCodeData')
  })
}

/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function makeSelectOptions(paramItems: arrayObject | undefined) {
  const options: any = []
  if (!paramItems || paramItems.length === 0) {
    items.value = options
    filterItems.value = options
  }
  let tempComboITems: any = []
  // 쓰기권환이 있으며 활성화 상태인 경우
  if (props.editable && !props.disabled) {
    // 사용여부가 Y인 것만 리스트에 표현한다.
    // default : 사용여부 상관없이 전체
    tempComboITems = reject(paramItems, { useFlag: 'N' })
  } else {
    tempComboITems = paramItems
  }
  // 추가속성으로 조회조건이 추가적으로있을경우 필터링
  if (props.codeAttrVal1) {
    tempComboITems = filter(tempComboITems, { attrVal1: props.codeAttrVal1 })
  }

  forEach(tempComboITems, (_item) => {
    options.push({
      label: _item[props.itemText],
      value: _item[props.itemValue],
      disable: _item.disable ? true : false
    })
  })
  items.value = options
  filterItems.value = options
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setValue() {
  let tempValue: any = []
  if (props.value === null) {
    tempValue = []
  } else {
    if (isArray(props.value)) {
      tempValue = clone(props.value)
    } else {
      // String type으로 구분자가 ,로 들어오는 경우는 value값만
      if (typeof props.value === 'string' && props.value !== '') {
        tempValue = split(props.value, ',')
      }
      // this.isArray = false;
    }
  }
  if (items.value && items.value.length > 0) {
    const data: any = []
    if (tempValue && tempValue.length > 0) {
      forEach(tempValue, (item) => {
        /**
         * 다음 두 상황으로 v-model을 받을 수 있게 처리
         *
         * 1. value만 Array에 담기는 경우
         * 2. Object로 itemText, itemValue에 맞춰 Array에 담기는 경우
         */
        if (props.isObject) {
          // case 1
          data.push(find(items.value, { value: item[props.valueKey] }))
        } else {
          // case 2
          data.push(find(items.value, { value: item }))
        }
      })
    }
    if (data) {
      vValue.value = data
    } else {
      vValue.value = []
    }
  } else {
    vValue.value = clone(String(props.value))
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function filterFn(val: string, update: any) {
  if (val === '') {
    update(() => {
      filterItems.value = items.value
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    filterItems.value = items.value.filter((v: any) => {
      return v.label.toLowerCase().indexOf(needle) > -1
    })
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function clear() {
  let emitData: any = []
  if (!props.isArray) {
    emitData = ''
  }
  emits('update:value', emitData)
  emits('datachange', [])
}
/******************************
 * TODO (목적): 유효성 검증
 * @param (1): 값
 * @return (반환): true: 통과, 그 외 : 통과X
 *******************************/
function validRule(val: any) {
  let validCheck = true
  if (props.required) {
    validCheck = Boolean(val) && val.length > 0
  }

  if (validCheck && props.error) {
    validCheck = props.error(val)
  }
  return validCheck
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

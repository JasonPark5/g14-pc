<template>
  <div class="fix-height">
    <template v-if="isSelect">
      <q-select
        :class="[
          stype === 'tableHeaderselect'
            ? 'customTableHeaderSelect'
            : type === 'custom'
              ? 'customSelect2 customSelect'
              : 'customSelect'
        ]"
        no-error-icon
        stack-label
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        ref="fieldbox"
        :options="filterOptions"
        :label="$language(label)"
        :color="color"
        :dense="stype === 'tableselect' || stype === 'tableHeaderselect'"
        :rules="[validRule]"
        :validMessage="validMessage"
        :disable="disabled || !editable"
        v-model="vValue"
        @update:model-value="input"
        @filter="filterFn"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
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

        <template v-slot:append>
          <q-icon
            v-if="!disabled && editable"
            name="search"
            class="cursor-pointer"
            @click.stop.prevent="search"
            @mousedown.prevent
          />
          <q-icon
            v-if="!disabled && editable"
            name="close"
            class="cursor-pointer"
            @click.stop.prevent="reset"
            @mousedown.prevent
          />
        </template>

        <template v-slot:selected-item="scope">
          <template v-if="!isChip">
            {{ scope.opt.label }}
          </template>
          <template v-else>
            <div :class="['text-' + scope.opt.color, 'text-bold']" :style="scope.opt.style">
              {{ scope.opt.label }}
            </div>
          </template>
        </template>
      </q-select>
    </template>
    <c-dialog :param="popupOptions" />
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
import { ref, computed, watch, onBeforeMount, inject, onMounted } from 'vue'
import { find, reject, forEach, filter } from 'lodash-es'

import * as popupVues from '@utils/popup'

import { arrayObject, objectStringNumber } from '@/types/variable'
import { GetTranLanguageFunction } from '@/types/language'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CSelect'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const systemInfo = useSystemInfoStore()
const { users, vendorUsers } = storeToRefs(systemInfo)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits([
  'update:value',
  'datachange',
  'setCodeData',
  'username',
  'update:value',
  'dataChange',
  'userInfo'
])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  plantCd?: null
  name?: string
  value: string | number | null | undefined
  stype?: string
  color?: string
  autofocus?: boolean
  label?: string
  editable?: boolean
  itemText?: string
  itemValue?: string
  disabled?: boolean
  required?: boolean
  dense?: boolean
  type?: string
  typetext?: string
  isChip?: boolean
  isSelect?: boolean
  error?: ErrorFunction
  validMessage?: stringNull
  labelIcon?: Array<any> | undefined | null
}
export type valueType = {
  label: string
  value: string | number | null | undefined
  disable?: boolean
  color?: string
  fontColor?: string
  style?: string
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  plantCd: null,
  name: '',
  value: null,
  stype: 'select',
  color: 'orange-custom',
  autofocus: false,
  label: '',
  editable: true,
  itemText: '',
  itemValue: '',
  disabled: false,
  required: false,
  dense: true,
  type: 'none',
  typetext: '',
  isChip: false,
  rejectItems: undefined,
  isSelect: true,
  labelIcon: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const vValue = ref<valueType | null | undefined>(null)
const items = ref<any>([])
const fieldbox: any = ref(null)
const vendorListTemp = ref<any[]>([])
const filterOptions = ref<any>([])
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const isComposing = ref(false)
/******************************
 * @Computed_선언
 *******************************/
const userList = computed(() => {
  const _users = props.plantCd
    ? users.value.filter((user: any) => user.plantCd === props.plantCd)
    : users.value

  const _vendorUsers = vendorListTemp.value.length > 0 ? vendorListTemp.value : vendorUsers.value

  return [..._users, ..._vendorUsers]
})
/******************************
 * @Watch_선언
 *******************************/
// TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
watch(
  () => props.value,
  () => {
    setValue()
  }
)
// TODO : 부모로 부터 값을 받아오는 경우, 상황에 따라 value 속성 값이 먼저 들어오고 comboItems의 값이 늦게 들어올 수 있으므로,
// 실제 항목인 items가 변경되면 vValue값을 value값으로 재 설정 해줌
watch(
  () => items.value,
  () => {
    setValue()
  },
  { deep: true }
)

watch(
  () => userList.value,
  () => {
    makeSelectOptions(userList.value)
  },
  { deep: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  makeSelectOptions(userList.value)
})

onMounted(() => {
  if (props.autofocus) {
    autoFocus()
  }
})
/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/

/******************************
 * TODO (목적): select show popup
 *******************************/
function autoFocus() {
  fieldbox.value.showPopup()
}

/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function input(paramValue: objectStringNumber) {
  // TODO : 부모에게 변경여부 전달
  let emitData = null
  if (paramValue) {
    emitData = paramValue.value
  } else {
    emitData = paramValue
  }
  emits('update:value', emitData)
  emits('datachange', paramValue)
}

/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function makeSelectOptions(paramItems: arrayObject | undefined) {
  const options: Array<valueType> = []

  let tempComboItems: any = null

  // 쓰기권환이 있으며 활성화 상태인 경우
  if (props.editable && !props.disabled) {
    // 사용여부가 Y인 것만 리스트에 표현한다.
    // default : 사용여부 상관없이 전체
    tempComboItems = reject(paramItems, { useFlag: 'N' })
  } else {
    tempComboItems = paramItems
  }

  forEach(tempComboItems, (_item) => {
    const colorRgbCheck = _item.attrVal1 && _item.attrVal1.indexOf('#') > -1
    if (_item)
      options.push({
        label: _item['userName'] || _item['personName'],
        value: _item['userId'] || _item['vendorCd'],
        color: colorRgbCheck ? '' : _item.attrVal1,
        fontColor: _item.attrVal2,
        style: colorRgbCheck ? `color:${_item.attrVal1}` : ''
      })
  })
  makeDefaultOptions(options)
  items.value = options
  filterOptions.value = options
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function makeDefaultOptions(_options: Array<valueType>) {
  if (props.type === 'edit') {
    _options.splice(0, 0, {
      label: $language('선택'),
      value: null
    })
  } else if (props.type === 'search') {
    _options.splice(0, 0, {
      label: $language('전체'),
      value: null
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setValue() {
  if (items.value && items.value.length > 0) {
    const targetValue = props.value === '' ? null : props.value
    const _data: any = find(items.value, { value: targetValue })
    if (_data) {
      vValue.value = _data
    } else {
      vValue.value = null
    }
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
// eslint-disable-next-line
function getName() {
  const objValue = vValue.value as valueType
  const selectData = find(items.value, { value: objValue!.value! })
  if (selectData) {
    return selectData.label
  } else {
    return ''
  }
}

function filterFn(val: any, update: any) {
  if (val === '') {
    update(() => {
      filterOptions.value = items.value
    })
    return
  }
  update(() => {
    filterOptions.value = filter(items.value, (_item) => {
      return _item.label.indexOf(val) > -1
    })
  })
}

function handleCompositionStart() {
  isComposing.value = true
}
function handleCompositionEnd(e: any) {
  isComposing.value = false
  // 강제로 다시 필터링
  filterOptions.value = filter(items.value, (_item) => {
    return _item.label.indexOf(e) > -1
  })
}
/******************************
 * TODO (목적): 유효성 검증
 * @param (1): 값
 * @return (반환): true: 통과, 그 외 : 통과X
 *******************************/
function validRule(val: any) {
  let validCheck = true
  if (props.required) {
    validCheck = Boolean(val) && Boolean(val.value)
  }

  if (validCheck && props.error) {
    validCheck = props.error(val)
  }
  return validCheck
}

function search() {
  const managePopupOptions = popupVues.getPopupOption('user')
  if (managePopupOptions) {
    const popupParam: any = _.extend(
      {
        type: 'single',
        searchParam: {
          plantCd: props.plantCd
        }
      },
      managePopupOptions.param
    )
    popupOptions.value.title = '사용자 검색'
    popupOptions.value.param = popupParam
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/components/commonPop.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.width = '50%'
    popupOptions.value.closeCallback = closePopup
  }
}

function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const userId = data[0].userId || data[0].vendorUserCd
    const userName = data[0].userName || data[0].personName

    vValue.value = userName
    emitValue(_.extend(data[0], { userId: userId, userName: userName }))
  }
}

function reset() {
  emitValue(null)
  vValue.value = null
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function emitValue(emitUser?: userType) {
  emits('update:value', emitUser?.userId)
  emits('username', emitUser?.userName)
  emits('dataChange', emitUser?.userId, emitUser)
  emits('userInfo', emitUser)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <q-input
      ref="ctext"
      bottom-slots
      no-error-icon
      stack-label
      :label="$language(label)"
      type="text"
      :counter="counter"
      :maxlength="maxlength"
      class="customText"
      :class="[
        prefix ? 'prefix-custom-text' : '',
        beforeText ? 'before-text' : '',
        afterIcon ? 'customText-btn' : '',
        prefix != '' ? 'customText-prefix' : '',
        suffix != '' ? 'customText-suffix' : ''
      ]"
      :prefix="prefix"
      :suffix="suffix"
      :mask="mask"
      :placeholder="$language(placeholder)"
      fill-mask
      :input-class="customClass"
      color="orange-custom"
      :bg-color="type === 'textarea' ? 'grey-1' : ''"
      :rules="[validRule]"
      :validMessage="validMessage"
      :disable="disabled || !editable"
      :readonly="readonly"
      v-model="vValue"
      @update:model-value="input"
      @focus="focusInput"
      @blur="blurInput"
      @keydown="onlyNumber"
      @v-on:input="onlyNumber"
    >
      <!-- v-currency="numberOptions" -->
      <template v-slot:label>
        <div v-if="label" class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(props.label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
          <template v-if="labelIcon && labelIcon.length > 0">
            <q-icon
              v-for="(icon, index) in labelIcon"
              :key="index"
              :name="String(icon.name)"
              color="primary"
              size="xs"
              class="q-ml-xs cursor-pointer"
            >
              <q-tooltip v-if="icon.tooltip"
                ><div style="font-size: 1.1em !important" v-html="icon.tooltip"
              /></q-tooltip>
              <q-tooltip v-else>
                <q-table
                  dense
                  hide-bottom
                  hide-pagination
                  :title="icon.title"
                  class="helpcomment-table"
                  table-header-style="background: rgba(0,0,0,0.1)"
                  :columns="icon.columns"
                  :rows="icon.data"
                />
              </q-tooltip>
            </q-icon>
          </template>
        </div>
      </template>

      <template v-slot:before>
        <template v-if="beforeIcon && beforeIcon.length > 0">
          <q-icon
            v-for="(icon, index) in beforeIcon"
            :key="index"
            :name="String(icon.name)"
            class="textOtherIcon"
            :class="{ 'cursor-pointer': icon.click }"
            @click="iconClick(icon)"
          >
            <q-tooltip v-if="icon.tooltip">{{ icon.tooltip }}</q-tooltip>
          </q-icon>
        </template>
        <template v-if="beforeText">
          <div
            style="
              color: #1e88e5;
              font-size: 0.82rem;
              font-weight: 700;
              line-height: 1.8rem;
              width: 80px;
            "
          >
            {{ beforeText }}
          </div>
        </template>
      </template>

      <template v-slot:prepend v-if="prependIcon && prependIcon.length > 0">
        <q-icon
          v-for="(icon, index) in prependIcon"
          :key="index"
          :name="String(icon.name)"
          class="textOtherIcon"
          :class="{ 'cursor-pointer': icon.click }"
          @click="iconClick(icon)"
        >
          <q-tooltip v-if="icon.tooltip">{{ icon.tooltip }}</q-tooltip>
        </q-icon>
      </template>

      <template v-slot:append>
        <div
          v-if="detail && !disabled && editable"
          class="vendor-self cursor-pointer"
          @click="detailClick"
        >
          {{ $language('상세') }}
        </div>
        <q-icon
          v-if="search && !disabled && editable"
          name="search"
          @click="searchClick"
          class="cursor-pointer textCloseIcon"
        />
        <q-icon
          v-if="close && !disabled && editable && !readonly"
          name="close"
          @click="closeClick"
          class="cursor-pointer textCloseIcon"
        />
        <template v-if="appendIcon && appendIcon.length > 0">
          <q-icon
            v-for="(icon, index) in appendIcon"
            :key="index"
            :name="String(icon.name)"
            class="textOtherIcon"
            :class="{ 'cursor-pointer': icon.click }"
            @click="iconClick(icon)"
          >
            <q-tooltip v-if="icon.tooltip">{{ icon.tooltip }}</q-tooltip>
          </q-icon>
        </template>
      </template>

      <!-- <template v-slot:hint>
      </template> -->

      <template v-slot:after v-if="afterIcon && afterIcon.length > 0">
        <slot name="afterIconPre" />
        <q-btn
          v-for="(icon, index) in afterIcon"
          :key="index"
          unelevated
          flat
          size="xs"
          class="textOtherIcon"
          :class="{ 'cursor-pointer': icon.click }"
          :color="String(icon.color) == 'teal' ? 'light-blue' : String(icon.color)"
          :icon="String(icon.name)"
          @click="iconClick(icon)"
        />
        <slot name="afterIconAft" />
      </template>
    </q-input>
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
import { replace } from 'lodash-es'
import { ref, watch, onBeforeMount } from 'vue'

import { arrayObject, objectStringNumber } from '@/types/variable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTextNumber'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits([
  'update:value',
  'dataChange',
  'callback',
  'searchPop',
  'detailPop',
  'blur'
])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  value?: string | number | null
  placeholder?: string
  editable?: boolean
  maxlength?: number
  beforeIcon?: arrayObject | undefined | null
  prependIcon?: arrayObject | undefined | null
  appendIcon?: arrayObject | undefined | null
  afterIcon?: arrayObject | undefined | null
  labelIcon?: arrayObject | undefined | null
  required?: boolean
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  type?: any
  counter?: boolean
  close?: boolean
  search?: boolean
  detail?: boolean
  prefix?: string
  suffix?: string
  label?: string
  mask?: string
  beforeText?: string
  dense?: boolean
  customClass?: string
  numberOptions?: object | any
  error?: ErrorFunction
  validMessage?: stringNull
  decimalPlaces?: number // 추가: 소수점 자릿수 지정
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
  value: 0,
  placeholder: '',
  editable: true,
  maxlength: 30,
  beforeIcon: null,
  prependIcon: null,
  appendIcon: null,
  afterIcon: null,
  labelIcon: null,
  required: false,
  clearable: true,
  disabled: false,
  readonly: false,
  type: 'text',
  counter: false,
  close: true,
  search: false,
  detail: false,
  prefix: '',
  suffix: '',
  label: '',
  mask: '',
  beforeText: '',
  dense: true,
  customClass: 'text-right',
  // eslint-disable-next-line vue/require-valid-default-prop
  numberOptions: { currency: null },
  decimalPlaces: 0 // 기본 소수점 자릿수는 2
})

/******************************
 * @VModel_선언
 *******************************/
// value: objectStringNumber | arrayObject | undefined | null

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const vValue = ref<string>('')
const ctext: any = ref(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.value,
  () => {
    setValueAtWatch()
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
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function init() {
  setValueAtWatch()
}

/******************************
 * TODO (목적): 입력값이 변경될 때 호출되는 함수
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function input() {
  // 부모에게 변경여부 전달
  setTimeout(() => {
    emits('dataChange', vValue.value)
    emits('update:value', replace(vValue.value, /[,]/g, ''))
  }, 200)
}

/******************************
 * TODO (목적): 포커스 시 콤마 제거
 *******************************/
function focusInput() {
  vValue.value = replace(vValue.value, /[,]/g, '')
}

/******************************
 * TODO (목적): 포커스 아웃 시 천단위 콤마 추가 및 소수점 처리
 *******************************/
function blurInput() {
  const numVal = replace(vValue.value, /[^-.\d]/g, '')
  vValue.value = formatNumber(numVal)
  emits('blur', vValue.value)
}

/******************************
 * TODO (목적): 숫자와 소수점만 입력 가능하도록 처리
 *******************************/
function onlyNumber(event: any) {
  // 키 이벤트일 경우에만 체크
  if (event.type === 'keydown') {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '.', '-']
    // 숫자 키나 허용된 특수 키가 아니면서
    // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X 같은 조합이 아닌 경우 차단
    if (
      !/^\d$/.test(event.key) &&
      !allowedKeys.includes(event.key) &&
      !(event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()))
    ) {
      event.preventDefault()
    }

    // 이미 소수점이 있는데 또 소수점을 입력하려는 경우 차단
    if (event.key === '.' && vValue.value.includes('.')) {
      event.preventDefault()
    }

    // 맨 앞에 이미 마이너스가 있는데 또 마이너스를 입력하려는 경우 차단
    if (event.key === '-' && (vValue.value.includes('-') || vValue.value.length > 0)) {
      event.preventDefault()
    }
  } else {
    // input 이벤트 처리 (직접 입력 값 필터링)
    vValue.value = replace(vValue.value, /[^-.\d]/g, '')
  }
}

/******************************
 * TODO (목적): 숫자 포맷팅 (천단위 콤마 + 소수점 처리)
 * @param (1): 변환할 숫자 문자열
 * @return (반환): 포맷팅된 숫자 문자열
 *******************************/
function formatNumber(numStr: string): string {
  if (!numStr) return ''

  // 소수점 기준으로 분리
  const parts = numStr.split('.')

  const integerPart = parts[0]

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger
}

/******************************
 * TODO (목적): watch에서 값이 변경됐을 때 호출
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setValueAtWatch() {
  if (props.value === null || props.value === undefined) {
    vValue.value = ''
    return
  }

  const numStr = String(props.value).replace(/[^-.\d]/g, '')
  vValue.value = formatNumber(numStr)
}

/******************************
 * TODO (목적): 아이콘 클릭 시 부모에게 emit
 * @param (1): 클릭된 아이콘 아이템
 * @return (반환):
 *******************************/
function iconClick(_item: objectStringNumber) {
  if (!_item.callbackName) {
    return
  }
  emits('callback', _item)
}

/******************************
 * TODO (목적): 입력값 초기화
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeClick() {
  vValue.value = ''
  emits('update:value', vValue.value)
  emits('dataChange', vValue.value)
}

/******************************
 * TODO (목적): 검색 버튼 클릭
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function searchClick() {
  emits('searchPop', vValue.value)
}

/******************************
 * TODO (목적): 상세 버튼 클릭
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function detailClick() {
  emits('detailPop', vValue.value)
}

/******************************
 * TODO (목적): 유효성 검증
 * @param (1): 값
 * @return (반환): true: 통과, 그 외 : 통과X
 *******************************/
function validRule(val: any) {
  let validCheck: any = true
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

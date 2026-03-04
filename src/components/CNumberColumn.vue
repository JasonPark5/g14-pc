<template>
  <div class="td-input-column">
    <div v-if="!isShow" class="pad-txt-label">
      <div
        v-if="col.disableData && disabled && value == 0"
        tabindex="0"
        ref="input-text"
        :class="['text-center']"
        @focus="numberfocus()"
        @click="numberfocus()"
      >
        -
      </div>
      <div
        v-else
        tabindex="0"
        ref="input-text"
        :class="[
          'text-right pr-5',
          disabled ? '' : 'table-td-numberlabel',
          colorClass ? colorClass : ''
        ]"
        @focus="numberfocus()"
        @click="numberfocus()"
      >
        {{ !Number.isNaN(value) ? toThousandFilter(Number(value)) : '' }}

        <q-tooltip v-if="col.colorTarget4 && col.type === 'number'" class="text-caption" :offset="[0, 5]">
          법적기준: {{ props.row[`${col.name}LegalStandard`] || '없음' }}<br />
          내부기준: {{ props.row[`${col.name}InnerStandard`] || '없음' }}
        </q-tooltip>
      </div>
    </div>
    <div v-if="editable && isShow">
      <q-input
        ref="input-column"
        class="table-td-text"
        type="number"
        outlined
        autofocus
        :disable="disabled"
        v-model="value"
        @keyup="keyup"
        @blur="numberfocusout()"
      />
    </div>
    <q-input
      v-show="false"
      ref="valid-input-column"
      type="number"
      error-message=""
      :error="!isValid"
      v-model="value"
    />
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
import { ref, watch, computed, onBeforeMount, PropType } from 'vue'
import { clone } from 'lodash-es'

import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CNumberColumn'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  colorClass?: string
  editable?: boolean
  disabled?: boolean
  required?: boolean
  col: {
    taskClassCd: string
    taskKey: string
    disableData?: string
    name?: string
    fix?: boolean
    type?: stringNull
  }
  props: any
  numberOptions?: {
    currency: null
  }
  maxlength?: number | null
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const _props = withDefaults(defineProps<propType>(), {
  name: '',
  colorClass: '',
  editable: true,
  disabled: false,
  required: false,
  col: () => {
    return {
      taskClassCd: '',
      taskKey: '',
      name: '',
      fix: false,
      type: null
    }
  },
  props: () => {},
  numberOptions: () => {
    return {
      currency: null
    }
  },
  maxlength: null
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: '',
  type: [String, Number] as PropType<string | number | null | undefined>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const isShow = ref(false)
const isValid = computed(() => !_props.required || value.value)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(value, () => {
  if (value.value === 0) {
    value.value = null
  }
})

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
  if (value.value === 0) {
    value.value = null
  }
}
/******************************
 * TODO (목적): focus가 잡힐때 input 영역 표시
 *******************************/
function numberfocus() {
  if (_props.editable && !_props.disabled) {
    isShow.value = true
  }
}
/******************************
 * TODO (목적): focus out시에 input 영역 비표시
 *******************************/
function numberfocusout() {
  isShow.value = false
}
/******************************
 * TODO (목적): key up 시 숫자형태 파악
 *******************************/
function keyup() {
  let _value = clone(value.value)
  if (_props.maxlength && _props.maxlength > 0) {
    const _length = value.value ? String(value.value).length : 0
    if (_length > _props.maxlength) {
      const substring = String(value.value).substring(0, _props.maxlength)
      _value = substring && !isNaN(Number(substring)) ? Number(substring) : null
    }
  }
  value.value = _value
  emits('datachange', value.value)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div class="td-input-column">
    <div v-if="!isShow" class="pad-txt-label">
      <div
        class="table-td-textlabel"
        tabindex="0"
        v-html="convertEnter(value)"
        @focus="textareafocus()"
        @click="textareafocus()"
      />
    </div>
    <div v-if="editable && isShow">
      <q-input
        class="table-td-text"
        ref="input-column"
        type="textarea"
        outlined
        autofocus
        :autogrow="true"
        :disable="disabled"
        v-model="value"
        @keyup.enter.stop
        @update:model-value="datachange"
        @blur="textareafocusout()"
      />
    </div>
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
import { ref, onBeforeMount } from 'vue'

import { convertEnter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTextareaColumn'
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
  editable?: boolean
  disabled?: boolean
  col: {
    taskClassCd: string
    taskKey: string
    disableData?: string
  }
  props: any
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
  editable: true,
  disabled: false,
  col: () => {
    return {
      taskClassCd: '',
      taskKey: ''
    }
  },
  props: () => {}
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
const isShow = ref(false)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

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
function init() {}
/******************************
 * TODO (목적): focus가 잡힐때 textarea 영역 표시
 *******************************/
function textareafocus() {
  if (props.editable && !props.disabled) {
    isShow.value = true
  }
}
/******************************
 * TODO (목적): focus out시에 textarea 영역 비표시
 *******************************/
function textareafocusout() {
  isShow.value = false
}
/******************************
 * TODO (목적): data 변환 시 emit
 *******************************/
function datachange() {
  emits('datachange')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

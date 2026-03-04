<template>
  <div class="fix-height">
    <q-file
      stack-label
      ref="custom-pick-file"
      color="orange-custom"
      class="customFilePick"
      :class="[beforeText ? 'before-field' : '']"
      :label="$language(label)"
      :disable="props.disabled || !props.editable"
      :dense="props.dense"
      :loading="props.loading"
      :clearable="!props.disabled && props.editable"
      v-model="value"
      @update:model-value="input"
      @clear="clear"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
      <template v-slot:label v-if="label">
        <div class="row items-center all-pointer-events">
          <b>
            <i class="pe-7s-note labelfrontIcon" />
            <span class="formLabelTitle">{{ $language(label) }}</span>
          </b>
        </div>
      </template>

      <template v-slot:before>
        <template v-if="beforeText">
          <div class="custom-text-before q-pl-xs q-pr-xs bg-blue-7 text-white">
            {{ beforeText }}
          </div>
        </template>
      </template>
    </q-file>
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
import { ref, PropType } from 'vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CPickFile'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getImageData'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  label?: string
  editable?: boolean
  disabled?: boolean
  dense?: boolean
  loading?: boolean
  beforeText?: string
  accept?: string
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
  label: '',
  editable: true,
  disabled: false,
  dense: true,
  loading: false,
  beforeText: '',
  accept: 'image/*'
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: null,
  type: File as PropType<File | null | undefined>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const imageData = ref<string | ArrayBuffer | null>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 파일 입력된 경우 해당 파일 정보 read
 * @param (1): 파일 정보
 *******************************/
function input(item: any) {
  if (item) {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      imageData.value = e.target!.result
      emits('getImageData', imageData.value)
    }
    reader.readAsDataURL(item)
  }
  // value.value = item
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function clear() {
  // 실제 파일 삭제처리
  // confirm창을 통해 삭제 처리하면 취소 했을 경우 value값을 통해 기존 값 유지
  value.value = null
  emits('getImageData', null)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

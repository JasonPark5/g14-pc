<template>
  <q-btn-group v-show="btnEditable" outline style="margin-right: 2px !important">
    <c-btn
      v-show="!data.flag"
      color="blue-7"
      :label="`${$language(data.title)} ${$language('정보 수정')}`"
      icon="update"
      @btnClicked="updateMode"
    />
    <c-btn v-show="data.flag" label="돌아가기" icon="undo" @btnClicked="back" />
  </q-btn-group>
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
import { watch, onMounted } from 'vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CUpdateBtn'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['updateMode', 'back'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  data?: {
    title: string
    flag: boolean
  }
  btnEditable?: boolean
  flagCondition?: boolean
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
  data: () => {
    return {
      title: '',
      flag: false
    }
  },
  btnEditable: false,
  flagCondition: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.btnEditable,
  () => {
    setFlag()
  }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  setFlag()
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): Update Mode 전환
 *******************************/
function updateMode() {
  props.data.flag = true
  emits('updateMode')
}
/******************************
 * TODO (목적): Update Mode 취소
 *******************************/
function back() {
  emits('back')
  props.data.flag = false
}
/******************************
 * TODO (목적): 수정모드 파악
 *******************************/
function setFlag() {
  if (props.flagCondition) {
    // 현재 단계에서 수정가능한 상태가 되도록 처리
    props.data.flag = !props.btnEditable ? true : false
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

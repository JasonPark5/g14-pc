<template>
  <!-- 검색 -->
  <q-form ref="searchBoxForm">
    <q-card flat bordered class="default-card searchArea">
      <div
        class="row searchArearow"
        v-on:mouseover="onMouseOver"
        v-on:mouseout="onMouseOut"
        v-on:keyup.enter="onEnterKey"
      >
        <!-- 추가 검색 또는 사용자 정의 검색 slot -->
        <slot name="search" />
      </div>
    </q-card>
  </q-form>
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
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CSearchBox'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['enter'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  enter?: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  enter: true
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const isMouseOver = ref(false) // 직접적인 상태 관리를 위한 변수
const searchBoxForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const searchCount = ref({
  value: 0,
  countUp: computed((): Number => {
    return searchCount.value.value++
  }),
  checkCount: computed((): Boolean => {
    return searchCount.value.value > 0
  })
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  if (props.enter) {
    window.addEventListener('keyup', handleKeyUp)
  }
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): enter key 입력 시 emit 전송
 * @param (1): key up event
 *******************************/
function handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter' && isMouseOver.value && props.enter) {
    emits('enter')
  }
}
/******************************
 * TODO (목적): enter key 입력 시 emit 전송
 *******************************/
function onEnterKey() {
  if (isMouseOver.value && props.enter) {
    emits('enter')
  }
}
/******************************
 * TODO (목적): searchbox에서 마우스 오버되었을 시
 *******************************/
function onMouseOver() {
  isMouseOver.value = true
}
/******************************
 * TODO (목적): searchbox에서 마우스 아웃되었을 시
 *******************************/
function onMouseOut() {
  isMouseOver.value = false
}
/******************************
 * TODO (목적): 검색조건 유효성 체크
 *******************************/
function validation() {
  return new Promise((_resolve, _reject) => {
    searchBoxForm.value.validate().then((_result: boolean) => {
      if (_result) {
        if (!searchCount.value.checkCount) {
          searchCount.value.countUp
        }
        _resolve(true)
      } else {
        const validationComponents = searchBoxForm.value.getValidationComponents()
        if (validationComponents && validationComponents.length > 0) {
          if (searchCount.value.checkCount) {
            const validationErrorComponents = _.filter(validationComponents, { hasError: true })
            if (validationErrorComponents && validationErrorComponents.length > 0) {
              /** 오류난 정보 중에 validMessage를 담고 있는 경우에 대해서만 알림창 표시 */
              if (validationErrorComponents[0].$attrs.validMessage) {
                /** 첫번째 오류난 정보에 대해서만 알림 표시 */
                message.alert({
                  title: '필수항목 미입력',
                  message: validationErrorComponents[0].$attrs.validMessage,
                  type: 'error',
                  buttonLabel: 'OK'
                })
              }
            }
          } else {
            searchCount.value.countUp
          }
        }
        _resolve(false)
      }
    })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchBoxForm, validation })
</script>

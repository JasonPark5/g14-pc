<!--
  TODO : 버튼 공통 모듈
-->
<template>
  <div />
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
import { ref, computed } from 'vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CWinPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['onRecvEvtFromWinPop', 'onClose'])
/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const windowRef = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const isClosed = computed(() => (windowRef.value ? windowRef.value.closed : null))

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

function openWinPop(uri: any, width: any, height: any) {
  if (windowRef.value) {
    closeWinPop()
  }

  const left: number = 150 // (screen.width) ? (screen.width - width) / 2 : 0;
  const top: number = 150 // (screen.height) ? (screen.height - height) / 2 : 0;

  const attr: string =
    'top=' +
    top +
    ', left=' +
    left +
    ', width=' +
    width +
    ', height=' +
    height +
    ', resizable=no,status=no'

  // 1. 윈도우 팝업 띄우기
  windowRef.value = window.open(uri, '', attr)

  // 2.  새로 띄운 윈도우 팝업창으로 부터 수신 메세지 이벤트 처리
  window.addEventListener('message', recvEvtFromChild, false)
}

function closeWinPop() {
  // 윈도우 팝업 닫기
  if (windowRef.value) {
    windowRef.value.close()
    windowRef.value = null
    emits('onClose')
  }
}

function sendEvtToChild(evt: any) {
  // 3. 부모창에서 팝업창에 메세지 보내기
  if (!windowRef.value || !g_winPopup) {
    return
  }

  // 4. 윈도팝업창(g_winPopup)에 함수 실행
  //  g_winPopup 변수는 본 소스에서 선언하지 않고 아래 ChildWinPop.vue 소스인 윈도우 팝업창 측에서 선언하고 설정함
  g_winPopup.calledFromOpener(evt)
}

function recvEvtFromChild(evt: any) {
  // 5. 팝업창으로 부터 수신된 이벤트
  if (!evt.data) {
    return
  } else if (evt.data === 'CLOSE') {
    closeWinPop()
    return
  }
  // 5. 본 소스 WinPop.vue를 콤포넌트로 사용하는 부모 vue 측에 이벤트 전달
  emits('onRecvEvtFromWinPop', evt.data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

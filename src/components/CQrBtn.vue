<!--TODO : QR 코드 버튼 공통 모듈-->
<template>
  <q-btn
    :class="[btnclass ? btnclass : '', 'custom-btn bg-navy-custom']"
    :label="$language(props.label)"
    :disable="disabled"
    :loading="loading"
    :outline="outline"
    dense
    :size="size"
    icon="qr_code_scanner"
    text-color="white"
  >
    <q-popup-proxy>
      <span action="#" id="printJS-form">
        <vue-qrcode :value="computedUrl" :options="{ width: 180 }" class="canvas" />
      </span>
      <q-btn v-if="isPrint" label="" color="grey" size="xs" icon="print" @click.prevent="print" />
      <slot name="detail" />
    </q-popup-proxy>
    <slot name="tooltip" />
  </q-btn>
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
import VueQrcode from '@chenfengyuan/vue-qrcode'
import printJs from 'print-js'
import { storeToRefs } from 'pinia'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CQrBtn'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const serverHost = useServerHostStore()
const { serverUrl } = storeToRefs(serverHost)

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  btnclass?: string
  name?: string
  label?: string
  size?: string
  mobileUrl?: string
  disabled?: boolean
  isPrint?: boolean
  showLoading?: boolean
  outline?: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  label: 'QR 코드',
  btnclass: '',
  name: '',
  size: 'sm',
  mobileUrl: '',
  disabled: false,
  isPrint: true,
  showLoading: true,
  outline: false,
  loading: false
})
/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const loading = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const computedUrl = computed(() => {
  return `${serverUrl.value}${props.mobileUrl || ''}`
})

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
function print() {
  printJs({
    printable: 'printJS-form',
    type: 'html',
    font_size: '20px',
    targetStyles: ['*']
  })
}
</script>

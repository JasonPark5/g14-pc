<template>
  <div class="row" ref="proxy">
    <div class="col-md-12 col-lg-12">
      <c-card title="서명보기" class="cardClassDetailInfo" topClass="topcolor-orange">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="data.tbmCompleteFlag !== 'Y'"
              label=""
              icon="check"
              @btnClicked="acceptSignature"
            />
            <c-btn
              v-if="data.tbmCompleteFlag !== 'Y'"
              icon="delete_forever"
              label=""
              color="red"
              :showLoading="false"
              @btnClicked="eraseSignature"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="row">
            <div class="col-xs-12 col-sm-12">
              <VueSignaturePad width="200px" height="200px" ref="refSignaturePad" />
            </div>
          </div>
        </template>
      </c-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { tbmType } from './tbm'

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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'signaturePop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['signCallback2'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    electronSignature?: stringNull
  }
  data: any
  rowIndex: number
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      electronSignature: '',
    }
  },
  data: () => {
    return {
      tbmCompleteFlag: '',
    } 
  },
  rowIndex: 0
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const refSignaturePad = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
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
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  // code setting
  if (!refSignaturePad.value) {
    return
  }
  if (props.data.tbmCompleteFlag === 'Y') {
    refSignaturePad.value.lockSignaturePad()
  }
  if (props.popupParam.electronSignature) {
    refSignaturePad.value.fromDataURL(props.popupParam.electronSignature)
  }
  // list setting
}
/******************************
 * TODO (목적): 서명 적용
 *******************************/
function acceptSignature() {
  let data = ''
  if (refSignaturePad.value.saveSignature()) data = refSignaturePad.value.saveSignature().data
  emits('signCallback2', data, props.rowIndex)
}
/******************************
 * TODO (목적): 서명 지우기
 *******************************/
function eraseSignature() {
  refSignaturePad.value.clearSignature()
  props.popupParam.electronSignature = ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

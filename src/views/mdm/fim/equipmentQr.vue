<template>
  <div>
    <div class="row">
      <c-card title="QR 출력정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn label="인쇄" type="check" @btnClicked="print" />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="row" id="printJS-form">
            <div
              class="col-md-12 wrapprint"
              v-for="(qrcode, index) in props.popupParam.selectData"
              :key="index"
            >
              <div :class="qrClass">
                <vue-qrcode
                  :value="
                    serverUrl +
                    '/sop/mim/inspection/equipmentQrSelect?equipmentCd=' +
                    qrcode.equipmentCd
                  "
                  :options="{ width: 200, errorCorrectionLevel: 'L' }"
                  class="qr-canvas"
                />
                <span class="equipmentArea">
                  <p class="contentArea">
                    <b>
                      {{ '(' + qrcode.equipmentNo ? qrcode.equipmentNo : '' + ')' }}
                    </b>
                    <b>
                      <br />
                      {{ qrcode.equipmentName }}
                    </b>
                  </p>
                </span>
              </div>
            </div>
          </div>
        </template>
      </c-card>
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
import printJs from 'print-js'
import VueQrcode from '@chenfengyuan/vue-qrcode'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentQr'
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
  popupParam: {
    selectData: Array<any>
  }
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
      selectData: []
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const redirectUrl = ref('')
const printItem = ref<Array<codeMasterType>>([])
const selectedItem = ref('zt410')

/******************************
 * @Computed_선언
 *******************************/
const qrClass = computed(() => (selectedItem.value === 'zt420' ? 'wrap zt420' : 'wrap'))

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
function init() {
  redirectUrl.value = selectConfig.com.mobileHostname.url
  printItem.value = [
    {
      code: 'zt410',
      codeName: 'ZT-410'
    },
    {
      code: 'zt420',
      codeName: 'ZT-420'
    }
  ]
}
/******************************
 * TODO (목적): QR 프린트
 *******************************/
function print() {
  printJs({
    printable: 'printJS-form',
    type: 'html',
    font_size: '25px',
    targetStyles: ['*']
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.qr-canvas {
  width: 100%;
  height: 100%;
  margin: 3 auto;
  display: inline;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 40px 40px 20px 0px;
  width: 700px;
  height: 250px;
  box-sizing: border-box;
  margin-bottom: 161px;
}
.wrapprint:last-child > .wrap {
  margin-bottom: 0px !important;
}
.equipmentArea {
  height: 200px;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.contentArea {
  width: 100%;
  /* height:20px; */
  font-size: 1.5em;
  line-height: 50px;
  display: inline;
  padding-right: 10px;
}
@media print {
  .contentArea {
    width: 100%;
    /* height:20px; */
    font-size: 1.5em;
    display: inline;
    padding-top: 30px;
  }
}
.modelno {
  float: left;
  margin-right: 20px;
}
.zt420 {
  margin-bottom: 152px;
}
.listArea {
  max-height: 318px;
  overflow-y: auto;
}
</style>

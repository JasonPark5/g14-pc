<template>
  <div class="cardcontents card-auto-height">
    <div class="card-header">
      <span class="card-icon">
        <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
      </span>
      {{ $language('무재해 활동') }}
    </div>
    <div class="card-body row" style="height: auto !important">
      <div class="col-4 safcon-left" style="text-align: center !important">
        <i class="fa-solid fa-face-smile" />
        <q-icon :name="safconImg" :color="faceColor" style="font-size: 6em" />
        <!-- <img
          :src="safconImg"
          width="90px"
          :class="safconText != $language('무사고') ? 'safconimgOn' : ''"
          @click="clickSafcon"
        /> -->
        <br />
        <div :class="safconTextClass">{{ $language(safconText) }}</div>
      </div>
      <div class="col-8 safcon-right" style="text-align: center !important">
        <div class="row">
          <div class="col-3" style="text-align: center !important">
            <div :class="safconTextClass1">{{ $language('무사고') }}</div>
          </div>
          <div class="col-3" style="text-align: center !important">
            <div :class="safconTextClass2">{{ $language('주의') }}</div>
          </div>
          <div class="col-3" style="text-align: center !important">
            <div :class="safconTextClass3">{{ $language('경계') }}</div>
          </div>
          <div class="col-3" style="text-align: center !important">
            <div :class="safconTextClass4">{{ $language('심각') }}</div>
          </div>
          <div class="col-12 safconDate" style="text-align: center !important">
            {{ safconData.startDt }} ~ {{ safconData.endDt }}
          </div>
          <div class="col-12 safconTeam" style="text-align: center !important">
            <div class="row">
              <div class="col-12">
                {{ $language('안전사고') }}
                <span class="safconbox">{{ safconData.total }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} A <span class="safconbox">{{ safconData.team1 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} B <span class="safconbox">{{ safconData.team2 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} C <span class="safconbox">{{ safconData.team3 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} D <span class="safconbox">{{ safconData.team4 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} E <span class="safconbox">{{ safconData.team5 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} F <span class="safconbox">{{ safconData.team6 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('생산팀') }} G <span class="safconbox">{{ safconData.team7 }}</span
                >{{ $language('건') }}
              </div>
              <div class="col-6">
                {{ $language('기타') }} <span class="safconbox">{{ safconData.etc }}</span
                >{{ $language('건') }}
              </div>
            </div>
          </div>
        </div>
      </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'noAccidentPortlet'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

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
const safconUrl = ref('')
const safconImg = ref('')
const faceColor = ref('')
const safconText = ref('')
const safconTextClass = ref('')
const safconTextClass1 = ref('safcon-circle')
const safconTextClass2 = ref('safcon-circle')
const safconTextClass3 = ref('safcon-circle')
const safconTextClass4 = ref('safcon-circle')
const safconData = ref<any>({
  team1: 0,
  team2: 0,
  team3: 0,
  etc: 0,
  total: 0,
  imports: 0,
  startDt: '',
  endDt: ''
})

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
  // url setting
  safconUrl.value = selectConfig.main.safcon.url
  // code setting
  // list setting
  getSafcon()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getSafcon() {
  $http({
    url: safconUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    safconData.value = _result.data
    if (safconData.value.imports > 0) {
      safconText.value = '심각'
      safconTextClass.value = 'safcon-left-text text-red'
      // safconImg.value = new URL('@images/safcon/level04.png', import.meta.url).href
      safconImg.value = 'sentiment_very_dissatisfied'
      faceColor.value = 'red'
      safconTextClass1.value = 'safcon-circle'
      safconTextClass2.value = 'safcon-circle'
      safconTextClass3.value = 'safcon-circle'
      safconTextClass4.value = 'safcon-circle bg-red'
    } else if (safconData.value.total == 0) {
      safconText.value = '무사고'
      safconTextClass.value = 'safcon-left-text text-green'
      // safconImg.value = new URL('@images/safcon/level01.png', import.meta.url).href
      safconImg.value = 'insert_emoticon'
      faceColor.value = 'green'
      safconTextClass1.value = 'safcon-circle bg-green'
      safconTextClass2.value = 'safcon-circle'
      safconTextClass3.value = 'safcon-circle'
      safconTextClass4.value = 'safcon-circle'
    } else if (safconData.value.total <= 2) {
      safconText.value = '주의'
      safconTextClass.value = 'safcon-left-text text-amber'
      // safconImg.value = new URL('@images/safcon/level02.png', import.meta.url).href
      safconImg.value = 'sentiment_neutral'
      faceColor.value = 'amber'
      safconTextClass1.value = 'safcon-circle'
      safconTextClass2.value = 'safcon-circle bg-amber'
      safconTextClass3.value = 'safcon-circle'
      safconTextClass4.value = 'safcon-circle'
    } else if (safconData.value.total == 3) {
      safconText.value = '경계'
      safconTextClass.value = 'safcon-left-text text-orange'
      // safconImg.value = new URL('@images/safcon/level03.png', import.meta.url).href
      safconImg.value = 'sentiment_dissatisfied'
      faceColor.value = 'orange'
      safconTextClass1.value = 'safcon-circle'
      safconTextClass2.value = 'safcon-circle'
      safconTextClass3.value = 'safcon-circle bg-orange'
      safconTextClass4.value = 'safcon-circle'
    } else if (safconData.value.total >= 4) {
      safconText.value = '심각'
      safconTextClass.value = 'safcon-left-text text-red'
      // safconImg.value = new URL('@images/safcon/level04.png', import.meta.url).href
      safconImg.value = 'sentiment_very_dissatisfied'
      faceColor.value = 'red'
      safconTextClass1.value = 'safcon-circle'
      safconTextClass2.value = 'safcon-circle'
      safconTextClass3.value = 'safcon-circle'
      safconTextClass4.value = 'safcon-circle bg-red'
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

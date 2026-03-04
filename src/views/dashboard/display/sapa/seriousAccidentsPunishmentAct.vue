<template>
  <div class="dashboard-display-carousel" ref="fullscreenarea">
    <div class="dashboard-fullscreen">
      <q-btn
        flat
        round
        dense
        :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="clickFullScreen"
      >
        <q-tooltip v-if="fullscreen">
          {{ $language('원래대로') }}
        </q-tooltip>
        <q-tooltip v-else>
          {{ $language('전체화면') }}
        </q-tooltip>
      </q-btn>
    </div>
    <q-carousel
      ref="carousel"
      :keep-alive="false"
      swipeable
      animated
      padding
      vertical
      infinite
      :autoplay="isAutoPlay"
      :arrows="false"
      :navigation="false"
      :height="carouselHeight"
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide
        v-for="(displayItem, idx) in displayItems"
        :key="idx"
        :name="displayItem.name"
        style="padding: 0px 16px 16px 16px"
      >
        <component
          :is="displayItem.component"
          :title="displayItem.title"
          :commonSearchParam="commonSearchParam"
        />
      </q-carousel-slide>
      <template v-slot:control>
        <q-carousel-control position="top-right" :offset="[60, 18]">
          <div v-if="isAutoPlay" class="slide-timer">
            <div class="slide-mask" />
          </div>
          <div v-else class="slide-timer2" />
          <q-btn
            flat
            round
            dense
            text-color="black"
            :icon="isAutoPlay ? 'pause' : 'play_circle'"
            @click="toggleAutoPlay"
          >
            <q-tooltip v-if="isAutoPlay">
              {{ $language('슬라이드쇼 중지') }}
            </q-tooltip>
            <q-tooltip v-else>
              {{ $language('슬라이드쇼 재생') }}
            </q-tooltip>
          </q-btn>
          <q-btn flat round dense text-color="black" icon="arrow_left" @click="carouselPrev()">
            <q-tooltip>{{ $language('이전 슬라이드') }}</q-tooltip>
          </q-btn>
          <q-btn flat round dense text-color="black" icon="arrow_right" @click="carouselNext()">
            <q-tooltip>{{ $language('다음 슬라이드') }}</q-tooltip>
          </q-btn>
        </q-carousel-control>
      </template>
    </q-carousel>
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
  name: 'seriousAccidentsPunishmentActDisplay'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
const carouselHeight = ref('500px')
const carousel = ref<any>(null)
const slide = ref('sapaSummary')
const fullscreen = ref(false)
const isAutoPlay = ref<boolean | number>(false)
const autoPlayTerm = ref<number>(10000) // 밀리세컨드 슬라이드타임 변경시 .slide-timer, .slide-mask 클래스의 animation-duration: 10s; 변경할 것
const fullscreenarea = ref<any>(null)
const displayItems = ref([
  {
    name: 'sapaSummary',
    title: '중대재해 예방활동 Summary',
    component: shallowRef(defineAsyncComponent(() => import(`./sapaSummary.vue`)))
  },
  {
    name: 'leadershipWorkParticipation',
    title: '경영 리더십 및 근로자 참여',
    component: shallowRef(defineAsyncComponent(() => import(`./leadershipWorkParticipation.vue`)))
  },
  {
    name: 'identifyRiskFactors',
    title: '위험요인 파악 및 분석',
    component: shallowRef(defineAsyncComponent(() => import(`./identifyRiskFactors.vue`)))
  },
  {
    name: 'removalReplacement',
    title: '위험요인 제거·대체 및 통제',
    component: shallowRef(defineAsyncComponent(() => import(`./removalReplacement.vue`)))
  }
])
const commonSearchParam = ref({
  plantCd: user.value.plantCd || ''
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
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onDeactivated(() => {
  isAutoPlay.value = false
  window.removeEventListener('resize', setSize)
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
  // code setting
  // list setting
  setSize()
  // setCarouselInterval()
}
/******************************
 * TODO (목적): carousel 높이 설정 (화면에 따른)
 *******************************/
function setSize() {
  let tempHeight = window.innerHeight - 51
  if (tempHeight < 500) {
    tempHeight = 500
  }
  carouselHeight.value = String(tempHeight) + 'px'
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function clickFullScreen() {
  const element = fullscreenarea.value
  if (fullscreen.value === false) {
    fullscreen.value = true
    const requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullScreen

    if (requestMethod) {
      // Native full screen.
      requestMethod.call(element)
    }
  } else {
    fullscreen.value = false
    const requestMethod = document.exitFullscreen
    if (requestMethod) {
      // Native full screen.
      requestMethod.call(document)
    }
  }
}
function toggleAutoPlay() {
  isAutoPlay.value = isAutoPlay.value ? false : autoPlayTerm.value
}
function carouselPrev() {
  isAutoPlay.value = false
  carousel.value.previous()
}
function carouselNext() {
  isAutoPlay.value = false
  carousel.value.next()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

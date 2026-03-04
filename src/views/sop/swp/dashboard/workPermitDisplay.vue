<template>
  <div ref="mainDashborad" class="work-permit-display-body">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="card cardcontents workPermitDisplaycardlayer">
          <div
            class="card-header non-label-icon mapheader workPermitDisplaycardheader topworkPermitDisplaylayer"
          >
            <div class="title">
              <span class="title1">{{ $language('안전작업허가서 배치현황') }}</span>
              <span class="text-teal" style="margin-right: 10px">SWP</span>
            </div>
            <q-btn
              flat
              round
              color="white"
              class="workPermitDisplaymapstart fullscreenBtn"
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
            <div class="card-more workPermitDisplayHeaderInput">
              <c-datepicker
                :range="true"
                :appendToBody="false"
                name="permitDates"
                v-model:value="mapObj.taskParam.permitDates"
                @datachange="getMapData"
              />
            </div>
            <q-btn
              :outline="!mapObj.interval.isPause"
              :color="mapObj.interval.isPause ? 'green' : 'white'"
              :text-color="mapObj.interval.isPause ? 'white' : 'white'"
              size="11px"
              class="workPermitDisplaymapstart startstopbtn"
              :label="mapObj.interval.isPause ? $language('시작') : $language('정지')"
              :icon="mapObj.interval.isPause ? 'restart_alt' : 'pause'"
              @click="pause"
            >
              <q-tooltip>{{ $language('작업허가 위치 Rotate') }}</q-tooltip>
            </q-btn>
            <!-- <div
              v-if="mapObj.interval.isPause"
              class="card-more main-header-input mainmapstartSecond"
            >
              <c-text
                label=""
                :prefix="$language('반복 시간')"
                :suffix="$language('(초)')"
                type="number"
                name="settingSeconds"
                v-model:value="settingSeconds"
              />
            </div> -->
          </div>
          <div
            class="card-body workPermitDisplaycardbody"
            ref="carousel"
            style="padding: 15px !important"
            :loading="mapObj.loading"
          >
            <template v-if="!mapObj.loading">
              <q-carousel
                v-if="mapObj.maps && mapObj.maps.length > 0"
                class="workPermitCarousel"
                swipeable
                animated
                arrows
                infinite
                control-type="regular"
                control-color="grey-6"
                v-model="mapObj.slide"
                @input="changeCarousel"
              >
                <q-carousel-slide
                  v-for="(map, idx) in mapObj.maps"
                  :key="idx"
                  :name="idx"
                  :img-src="map.mapSrc"
                >
                  <div class="mapTitleDiv" v-text="map.mapName" />
                  <!-- 작업허가서 -->
                  <VueDraggableResizable
                    v-for="(item, idx) in map.maps"
                    :key="idx"
                    ref="markImage"
                    class="workPermitDisplayMarkImage"
                    :class="
                      idx === mapObj.maps[0].haveWorkPermitIdxs[mapObj.activeMarked - 1]
                        ? 'selected'
                        : ''
                    "
                    :resizable="false"
                    :parent="true"
                    :draggable="false"
                    :x="item.locationXcoordinate * mapRate * mapObj.ratio"
                    :y="item.locationYcoordinate * mapRate * mapObj.ratio"
                    :w="40"
                    :h="40"
                    :grid="[20, 20]"
                  >
                    <c-map-marker
                      :isSelected="
                        idx === mapObj.maps[0].haveWorkPermitIdxs[mapObj.activeMarked - 1]
                      "
                    >
                      <template v-slot:pinInner>
                        <div class="bg-white">
                          <q-icon
                            name="font_download"
                            class="text-primary workPermitTypeIcon"
                            style="font-size: 32px"
                          />
                          <q-icon
                            name="font_download"
                            class="text-primary workPermitTypeIcon"
                            style="font-size: 32px"
                          />
                        </div>
                      </template>
                    </c-map-marker>
                  </VueDraggableResizable>
                  <!-- 바둑판식 영역 -->
                  <VueDraggableResizable
                    v-for="(area, idx) in map.areas"
                    :key="'area' + idx"
                    class="workPermitDisplayAreaClass"
                    style="z-index: 1"
                    :parent="true"
                    :draggable="false"
                    :resizable="false"
                    :x="area.x * mapRate * mapObj.ratio"
                    :y="area.y * mapRate * mapObj.ratio"
                    :w="area.w * mapRate * mapObj.ratio"
                    :h="area.h * mapRate * mapObj.ratio"
                    :grid="[20, 20]"
                  >
                    <q-menu
                      :ref="
                        (el: any) => {
                          areaproxy[area.idx] = el
                        }
                      "
                      :persistent="true"
                      :content-class="'mainMapMenuLayer'"
                      anchor="top right"
                      self="top left"
                    >
                      <q-card
                        v-for="(workPermit, idx) in selectedWorkPermit.workPermits"
                        :key="idx"
                        flat
                        bordered
                        :class="['workPermitDisplayCard', setStepClass(workPermit.swpStepCd)]"
                      >
                        <q-item class="workPermitDisplayCardSection workPermitDisplayCardItem">
                          <q-item-section avatar>
                            <q-badge
                              rounded
                              :color="setStepColor(workPermit.swpStepCd)"
                              :label="workPermit.swpStepName"
                            />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label>
                              <q-icon
                                v-for="(icon, iconIdx) in setTypeIcons(workPermit.sopWorkTypeCds)"
                                :key="iconIdx"
                                :name="icon"
                                class="text-red"
                                size="25px"
                              />
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-card-section class="workPermitDisplayCardSection">
                          <q-icon name="chevron_right" class="text-indigo" />
                          <b>{{ workPermit.workSummary }}</b> ({{ workPermit.workTime }})
                        </q-card-section>
                        <q-card-section
                          class="workPermitDisplayCardSection"
                          v-if="workPermit.vendorName"
                        >
                          <q-icon name="chevron_right" class="text-indigo" /><b
                            >{{ $language('작업업체') }} : {{ workPermit.vendorName }}</b
                          >
                        </q-card-section>
                        <q-card-section
                          class="workPermitDisplayCardSection"
                          v-if="workPermit.processName || workPermit.equipmentName"
                        >
                          <div v-if="workPermit.processName" class="mainWorkPermitCardProc">
                            <q-chip outline square color="blue" text-color="white">
                              {{ workPermit.processName }}
                            </q-chip>
                          </div>
                          <div v-if="workPermit.equipmentName" class="mainWorkPermitCardEquip">
                            <q-chip outline square color="green" text-color="white">
                              {{ workPermit.equipmentName }}
                            </q-chip>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-menu>
                  </VueDraggableResizable>
                </q-carousel-slide>
              </q-carousel>
              <c-empty v-else :description="$language('등록된 지도가 없습니다.')" />
            </template>
          </div>
        </div>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
    <q-inner-loading
      :showing="mapObj.loading"
      :label="$language('화면 조정중입니다.')"
      label-class="text-blue-grey"
      label-style="font-size: 8em"
      size="12em"
    >
      <q-spinner-grid size="12em" color="blue-grey" />
      <div class="text-blue-grey" style="font-size: 3em">
        {{ $language('화면 조정중') }}
      </div>
    </q-inner-loading>
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
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'workPermitDisplay'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface mapObjType {
  activeMarked: number
  envUrl: string
  url: string
  interval: {
    obj: NodeJS.Timeout | null
    seconds: number
    isPause: boolean
    loopSeconds: number
  }
  taskParam: {
    permitDates: Array<string>
  }
  maps: Array<mapType>
  slide: number
  height: number
  ratio: number
  loading: boolean
}
interface mapType {
  sopMapId: string
  mapSrc: string
  mapName: string
  ratio: number
  endIdx: number
  maps: Array<mapResultType>
  others: Array<mapResultType>
  areas: Array<areaType>
  haveWorkPermitIdxs: Array<number>
}
interface areaType {
  x: number
  y: number
  w: number
  h: number
  idx: number
  areaName: string
  direction: string
}
interface mapResultType {
  sopMapResultId: string
  sopWorkPermitId: string
  sopMapId: string
  locationXcoordinate: number
  locationYcoordinate: number
  ratio: number
  resultTypes: Array<workPermitResultType>
}
interface workPermitResultType {
  sopMapResultId: string
  sopWorkTypeCd: string
  sopWorkTypeCds: string
  sopWorkTypeName: string
  sopWorkPermitId: string
  workSummary: string
  permitTypeCd: string
  swpStepCd: string
  swpStepName: string
  equipmentName: string
  vendorName: string
  processName: string
  workTime: string
}

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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const settingSeconds = ref(5)
const fullscreen = ref(false)
const mapObj = ref<mapObjType>({
  activeMarked: 1,
  envUrl: '',
  url: '',
  interval: {
    obj: null, // setInterval(() => {}, 1),
    seconds: 5,
    isPause: false,
    loopSeconds: 5
  },
  taskParam: {
    permitDates: ['2024-01-01', '2024-12-31']
  },
  maps: [],
  slide: 0,
  height: 800,
  ratio: 1,
  loading: false
})
const carousel = ref<any>(null)
const mainDashborad = ref<any>(null)
const areaproxy = ref<Array<any>>([])

/******************************
 * @Computed_선언
 *******************************/
const mapRate = computed(() => 1)
const isMapData = computed(() => {
  return (
    mapObj.value.maps &&
    mapObj.value.maps.length > 0 &&
    mapObj.value.maps[mapObj.value.slide].maps &&
    mapObj.value.maps[mapObj.value.slide].maps.length > 0
  )
})
const selectedWorkPermit = computed(() => {
  const selected = {
    areaName: '',
    direction: 'rtl',
    workPermits: [] as Array<workPermitResultType>
  }
  if (isMapData.value && mapObj.value.activeMarked > 0) {
    const item = mapObj.value.maps[mapObj.value.slide] // 지도 1개
    const area = _.find(item.areas, {
      idx: mapObj.value.maps[mapObj.value.slide].haveWorkPermitIdxs[mapObj.value.activeMarked - 1]
    })
    if (area) {
      selected.areaName = area.areaName
      selected.direction = area.direction
      const maps = _.map(
        _.filter(item.maps, {
          idx: mapObj.value.maps[mapObj.value.slide].haveWorkPermitIdxs[
            mapObj.value.activeMarked - 1
          ]
        }),
        'resultTypes'
      )
      if (maps && maps.length > 0) {
        _.forEach(maps, (map) => {
          selected.workPermits = _.concat(selected.workPermits, map)
        })
      }
    }
  }
  return selected
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', () => setSize)
})
onMounted(() => {
  init()
})
onBeforeRouteLeave(() => {
  // 열려 있는 메뉴들 닫기
  areaproxy.value.forEach((menu) => {
    if (menu && typeof menu.hide === 'function') {
      menu.hide()
    }
  })

  // 인터벌도 끊어주기 (메모리 누수 방지)
  // if (mapObj.value.interval.obj) {
  //   clearInterval(mapObj.value.interval.obj)
  // }
  window.removeEventListener('resize', () => setSize)
})

// 혹시 keep-alive 등으로 인해 라우트 이동 말고 컴포넌트 unmount 상황도
// 대비하고 싶다면 onUnmounted에서도 한 번 더 정리
onUnmounted(() => {
  areaproxy.value.forEach((menu) => {
    if (menu && typeof menu.hide === 'function') {
      menu.hide()
    }
  })
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
  mapObj.value.url = selectConfig.sop.swp.workPermit.workMap.url
  mapObj.value.envUrl = selectConfig.main.env.url
  // code setting
  // list setting
  getMapPriodParam()
  getMapData()
  setSize(false)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getMapPriodParam() {
  // 초기 지도 정보를 불러올 때에는 기간 정보가 넘어가지 않게 처리
  $http({
    url: mapObj.value.envUrl,
    method: 'GET'
  }).then((_result: any) => {
    // mapObj.value.taskParam.permitDates = [_result.data[0].start, _result.data[0].end]
    mapObj.value.taskParam.permitDates = ['2024-01-01', '2024-12-31']
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getMapData(loading?: boolean) {
  const defaultPlantCd = window.sessionStorage.getItem('defaultPlantCd')
  $http({
    url: mapObj.value.url,
    method: 'GET',
    params: {
      plantCd: defaultPlantCd,
      permitDates: mapObj.value.taskParam.permitDates
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      // 지도는 1개
      _.forEach(_result.data, (item) => {
        const width = 800 * _result.data[0].ratio
        const widthHalf = width / 2
        // 총 20개의 구역을 마련 (4x5)
        const heightDivide = 3
        const widthDivide = 4
        const area = {
          h: 800 / heightDivide,
          w: width / widthDivide
        }
        item.areas = []
        for (let height = 0; height < heightDivide; height++) {
          for (let width = 0; width < widthDivide; width++) {
            item.areas.push({
              x: width * area.w,
              y: height * area.h,
              w: area.w,
              h: area.h,
              idx: width + 1 + height * widthDivide,
              areaName: 'AREA ' + (width + 1 + height * widthDivide),
              direction: widthHalf > width * area.w ? 'rtl' : 'ltr'
            })
          }
        }
        // 작업허가서가 존재하는 idx 수집
        item.haveWorkPermitIdxs = []
        if (item.maps && item.maps.length > 0) {
          _.forEach(item.maps, (map) => {
            const area = _.find(item.areas, (area) => {
              return (
                area.x <= map.locationXcoordinate + 20 &&
                area.x + area.w > map.locationXcoordinate + 20 &&
                area.y <= map.locationYcoordinate + 20 &&
                area.y + area.h > map.locationYcoordinate + 20
              )
            })
            map.idx = area ? area.idx : 0
            map.direction = widthHalf > map.locationXcoordinate ? 'rtl' : 'ltr'
            if (
              _.indexOf(item.haveWorkPermitIdxs, map.idx) === -1 &&
              map.resultTypes &&
              map.resultTypes.length > 0
            ) {
              item.haveWorkPermitIdxs.push(map.idx)
            }
          })
        }
        item.haveWorkPermitIdxs = _.sortBy(item.haveWorkPermitIdxs)
        item.endIdx = item.haveWorkPermitIdxs.length // heightDivide * widthDivide;
      })
      mapObj.value.maps = _.cloneDeep(_result.data)
      carousel.value.style.setProperty('--map-ratio', mapObj.value.maps[0].ratio)

      // 로딩바 제거
      if (loading) {
        mapObj.value.loading = false
        pause()
      } else if (mapObj.value.maps.length > 0) {
        setTimeout(() => {
          areaproxy.value[mapObj.value.maps[0].haveWorkPermitIdxs[0]].show()
        }, 100)
        intervalActionMap()
      }
    }
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function intervalActionMap() {
  //* 순서 : mark > location area > map
  mapObj.value.interval.obj = setInterval(() => {
    mapObj.value.interval.seconds--

    if (mapObj.value.interval.seconds === 0) {
      areaproxy.value[
        mapObj.value.maps[mapObj.value.slide].haveWorkPermitIdxs[mapObj.value.activeMarked - 1]
      ].hide()
      if (mapObj.value.activeMarked === mapObj.value.maps[mapObj.value.slide].endIdx) {
        mapObj.value.activeMarked = 1
      } else {
        mapObj.value.activeMarked++
      }
      areaproxy.value[
        mapObj.value.maps[mapObj.value.slide].haveWorkPermitIdxs[mapObj.value.activeMarked - 1]
      ].show()
      mapObj.value.interval.seconds = mapObj.value.interval.loopSeconds
    }
  }, 1000)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function changeCarousel(val: number) {
  if (
    mapObj.value.maps[val].haveWorkPermitIdxs &&
    mapObj.value.maps[val].haveWorkPermitIdxs.length > 0
  ) {
    areaproxy.value[mapObj.value.maps[val].haveWorkPermitIdxs[0]].show()
    mapObj.value.activeMarked = 1
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setSize(flag?: boolean) {
  // 지도의 기본 높이는 800 : 윈도우 사이즈에 맞추어 높이가 변경될 시에 그에 맞는 ratio가 따로 필요
  if (flag !== false) {
    mapObj.value.loading = true
    pause()
  }
  mapObj.value.maps = []
  const margin = fullscreen.value === false ? 200 : 105
  mapObj.value.height = window.innerHeight - margin
  const resizeRatio = Math.round((mapObj.value.height / 800) * 100) / 100
  const _height = mapObj.value.height * mapRate.value
  carousel.value.style.setProperty('--map-height', String(_height) + 'px')
  mapObj.value.ratio = resizeRatio
  setTimeout(() => {
    if (flag !== false) {
      getMapData(true)
    }
  }, 300)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function pause() {
  mapObj.value.interval.isPause = !mapObj.value.interval.isPause
  if (mapObj.value.interval.isPause) {
    clearInterval(mapObj.value.interval.obj!)
  } else {
    mapObj.value.interval.loopSeconds = settingSeconds.value
    intervalActionMap()
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
// function imgHeight(map) {
//   return String(map.ratio * mapObj.value.height) + 'px'
// }
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setStepColor(swpStepCd: string) {
  let color = ''
  switch (swpStepCd) {
    case 'SS00000005':
      color = 'light-blue'
      break
    case 'SS00000010':
      color = 'amber'
      break
    case 'SS00000020':
      color = 'light-green'
      break
  }
  return color
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setStepClass(swpStepCd: string) {
  let _class = ''
  switch (swpStepCd) {
    case 'SS00000005':
      _class = 'mainWorkPermitCardLightBlue'
      break
    case 'SS00000010':
      _class = 'mainWorkPermitCardAmber'
      break
    case 'SS00000020':
      _class = 'mainWorkPermitCardLightGreen'
      break
  }
  return _class
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setTypeIcons(sopWorkTypeCds: string) {
  const icons: Array<string> = []
  const typeArray = sopWorkTypeCds && sopWorkTypeCds.length > 0 ? sopWorkTypeCds.split(',') : []
  if (typeArray && typeArray.length > 0) {
    _.forEach(typeArray, (type) => {
      switch (type) {
        case 'SPT0000001': // 일반
          icons.push('engineering')
          break
        case 'SPT0000005': // 화기
          icons.push('local_fire_department')
          break
        case 'SSWT000001': // 밀폐공간
          icons.push('masks')
          break
        case 'SSWT000005': // 정전
          icons.push('flash_off')
          break
        case 'SSWT000010': // 방사선
          icons.push('warning')
          break
        case 'SSWT000015': // 굴착
          icons.push('hardware')
          break
        case 'SSWT000020': // 고소
          icons.push('stairs')
          break
        case 'SSWT000025': // 중장비
          icons.push('agriculture')
          break
      }
    })
  }
  return icons
}
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function openWorkPermit(item) {
//   if (!item) return
//   popupOptions.value.isFull = true
//   popupOptions.value.title = '작업허가서 상세'
//   popupOptions.value.param = {
//     sopWorkPermitId: item.sopWorkPermitId,
//     permitTypeCd: item.permitTypeCd
//   }
//   popupOptions.value.target = () => import(`@views/sop/swp/safeWorkPermitDetail.vue`)
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closeWorkPermitPopup
// }
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function closeWorkPermitPopup() {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
// }
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function clickFullScreen() {
  const element = mainDashborad.value
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
    // document.cancelFullScreen ||
    // document.webkitCancelFullScreen ||
    // document.mozCancelFullScreen ||
    // document.msExitFullscreen
    if (requestMethod) {
      // Native full screen.
      requestMethod.call(document)
    }
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
// function onMarkedInfo(area) {
//   this.$refs['area2'][0].$el.click()
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.work-permit-display-body:fullscreen
  overflow: scroll !important
.work-permit-display-body:-ms-fullscreen
  overflow: scroll !important
.work-permit-display-body:-webkit-full-screen
  overflow: scroll !important
.work-permit-display-body:-moz-full-screen
  overflow: scroll !important

.topworkPermitDisplaylayer
  border-radius: 10px 10px 10px 10px !important
  height: 76px
  background-color: #283046 !important
  display: block
  div.title
    font-weight: 600
    color: #7367f0
    font-size: 16px
    display: inline-block
    position: relative
    top: 5px
  .title1
    color: #fff
    font-size: 16px
    margin: auto 10px auto 20px
.workPermitDisplaycardlayer
  background-color: #161d31 !important
.workPermitDisplaycardheader
  border-radius: 10px 10px 0 0 !important
  background-color: #343d55 !important
  .customdatelabel
    margin-top: 0px !important
  .cdatetimepic .inputClass
    width: 220px !important
    max-width: 220px !important
    background-color: #343d55 !important
    color: #fff !important
    border-width: 0px !important
  .cdatetimepic .mx-input-wrapper
    padding: 0px 3px !important
    margin-bottom: 0px !important
    .mx-icon-clear
      color: #fff !important
    .mx-icon-calendar
      color: #fff !important
.workPermitDisplaymapstart
  float: right
  margin-right: 20px
.startstopbtn
  margin-top: 4px
.mainmapstartSecond
  float: right
  margin-right: 10px
  input
    color: #fff !important
  .q-field__suffix
    color: #fff !important
.fullscreenBtn
  .q-btn__wrapper
    min-width: 10px !important
    min-height: 10px !important
.workPermitDisplayHeaderInput
  width: 220px !important
  padding-right: 5px
  .customDate
    padding-bottom: 0 !important
    .q-field__inner
      padding: 0 !important
.workPermitDisplaycardbody
  background-color: #283046
  border-radius: 0 0 10px 10px !important

.cardcontents
  margin-top: 6px
  margin-bottom: 6px
  margin-right: 6px
  .card-body
    padding: 10px !important
  .card-header:not(.non-label-icon):before
    font-family: "Material Icons"
    content: "\e876"
  .card-header
    height: 50px
    color: #1ab394
    background: #f8f8f8
    display: inline-block
    padding-top: 8px
    .card-more
      float: right !important
      cursor: pointer
      color: #d2d2d2
    .card-more:hover
      color: #1ab394

.workPermitDisplayMarkImage
  padding: 0px !important
  font-size: 20px
  height: 30px !important
  position: absolute
  padding: 16px
  z-index: 3 !important
  border: none
.workPermitDisplayMarkImage.selected
  z-index: 3000 !important

.workPermitCarousel
  border-radius: 10px
  height: var(--map-height) !important
  .q-carousel__slide
    width: calc(var(--map-ratio) * var(--map-height)) !important
    margin: 0 auto
  .q-carousel--padding, .q-carousel__slide
    padding: 0 !important
  .q-carousel__arrow
    transition: all 0.5s
    opacity: 0.2
  .q-carousel__arrow:hover
    transition: all 0.5s
    opacity: 0.8

.workPermitDisplayCard
  padding-top: 5px
  padding-bottom: 5px
  margin: 6px
  .workPermitDisplayCardSection
    padding: 0 10px 0 10px
  .workPermitDisplayCardItem
    min-height: auto

.mainMapMenuLayer
  border-radius: 10px !important
  max-width: 600px !important
.mainWorkPermitCardProc
  margin-right: 6px !important
.mainWorkPermitCardEquip, .mainWorkPermitCardProc
  display: inline-block
  padding-top: 4px !important
  padding-bottom: 4px !important

.workPermitTypeIcon
  vertical-align: bottom
</style>
<style scoped>
.workPermitDisplayAreaClass {
  position: absolute;
  color: black;
  border: none;
  div {
    width: 100%;
    border-radius: 10px 10px 0 0;
    color: #fff;
    background-color: rgba(40, 48, 70, 0.6);
  }
}
.mapTitleDiv {
  position: absolute;
  right: 5px;
  top: 5px;
  border-radius: 10px;
  background-color: #283046 !important;
  color: #fff;
  padding: 5px 10px;
  font-weight: 700;
  z-index: 2000;
  font-size: 12px;
}
.mainWorkPermitCardLightBlue {
  border-top: 2px solid #03a9f4;
}
.mainWorkPermitCardAmber {
  border-top: 2px solid #ffc107;
}
.mainWorkPermitCardLightGreen {
  border-top: 2px solid #8bc34a;
}
</style>

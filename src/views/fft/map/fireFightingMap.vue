<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="장소"
            name="sopFireFightingLocationId"
            :customPopupParam="{ targetKey: 'fireFightingLocation' }"
            v-model:value="searchParam.sopFireFightingLocationId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="SOP_FIRE_FIGHTING_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="sopFireFightingTypeCd"
            label="유형"
            v-model:value="searchParam.sopFireFightingTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-card :title="`[${map!.mapName}] 도면 정보`" class="cardClassDetailForm firefighting-card">
      <template v-slot:card-description>
        <span style="color: #f44336; margin-left: 10px">{{
          $language('도면이미지에 마우스 우클릭을 통해 소방설비를 추가하세요.')
        }}</span>
      </template>
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div
          :style="`height: ${zoomer.height}px;`"
          class="zommer-container col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10"
        >
          <div id="zoomable" ref="zoomable">
            <!-- <panZoom v-if="mapExists" ref="panZoom" selector="#zoomerImage" :options="zoomer.options"> -->
            <q-img
              id="zoomerImage"
              :src="map!.mapSrc"
              :style="`width: ${(zoomer.height! - 30) * map!.ratio}px; height: ${zoomer.height! - 30}px;`"
            >
              <q-menu touch-position context-menu @before-show="beforeShow">
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup @click="addFireFighting">
                    <q-item-section avatar class="firefighting-mark-add">
                      <q-icon name="add" color="red" />
                    </q-item-section>
                    <q-item-section>{{ $language('소화기 배치') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <template v-for="(mark, idx) in map!.marks" :key="idx">
                <!-- <div 
                  class="warning circle" :key="'circle' + idx"
                  :style="`transform: translate(${(mark.locationXcoordinate * zoomer.ratio) - 15}px, ${(mark.locationYcoordinate * zoomer.ratio) - 15}px);z-index: auto; user-select: auto; width: 30px; height: 30px;`">
                </div> -->
                <!-- v-for="(mark, idx) in map.marks" -->
                <q-img
                  class="mark-firefighting"
                  :class="mark.curdateDiff >= 30 ? 'animatedBadge' : ''"
                  :style="`transform: translate(${mark.locationXcoordinate * zoomer.ratio! - 15}px, ${mark.locationYcoordinate * zoomer.ratio! - 15}px);z-index: auto; user-select: auto; width: 30px; height: 30px;`"
                  :src="extinguisher"
                >
                  <q-menu
                    :ref="'markedproxy' + idx"
                    :content-class="'firefighting-menu-layer'"
                    anchor="top right"
                    self="top left"
                  >
                    <q-card
                      flat
                      bordered
                      @click="openFireFightingPop(mark)"
                      :class="['firefighting-menu-card']"
                    >
                      <q-item class="firefighting-card-section firefighting-card-item">
                        <q-item-section>
                          <q-item-label>
                            <q-badge
                              rounded
                              color="light-blue"
                              :label="mark.sopFireFightingTypeName"
                            />
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon
                            name="delete"
                            color="red"
                            class="cursor-pointer"
                            @click.stop="deleteFireFightingMark(mark)"
                          />
                        </q-item-section>
                      </q-item>
                      <q-card-section class="firefighting-card-section cursor-pointer">
                        <q-icon name="chevron_right" class="text-indigo" />
                        <b>{{ $language('소방설비명') }}</b> : {{ mark.fireFightingName }}
                      </q-card-section>
                      <q-card-section class="firefighting-card-section cursor-pointer">
                        <q-icon name="chevron_right" class="text-indigo" />
                        <b>{{ $language('제조번호') }}</b> : {{ mark.manageNo }}
                      </q-card-section>
                      <q-card-section class="firefighting-card-section cursor-pointer">
                        <q-icon name="chevron_right" class="text-indigo" />
                        <b>{{ $language('최근 이슈점검일') }}</b> : {{ mark.checkDate }}
                      </q-card-section>
                      <q-card-section class="firefighting-card-section cursor-pointer">
                        <q-icon name="chevron_right" class="text-indigo" />
                        <b>{{ $language('최신이슈점검QR코드') }}</b>
                      </q-card-section>
                      <q-card-section class="firefighting-card-section cursor-pointer">
                        <span action="#" id="printJS-form">
                          <vue-qrcode
                            :value="
                              serverUrl +
                              '/fft/ise/fireFightingIssueCheck?sopFireFightingId=' +
                              mark.sopFireFightingId
                            "
                            :options="{ width: 180 }"
                            class="canvas"
                          />
                        </span>
                      </q-card-section>
                    </q-card>
                  </q-menu>
                </q-img>
              </template>
            </q-img>
            <!-- </panZoom> -->
          </div>
        </div>
        <div
          :style="`height: ${zoomer.height}px; overflow-y: auto;`"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 firefighting-map-list"
        >
          <q-list bordered padding>
            <template v-for="(mapInfo, idx) in zoomer.maps" :key="idx">
              <q-item clickable @click="mapSelect(mapInfo)">
                <q-item-section class="q-ml-none">
                  <q-img
                    id="zoomerImage"
                    :src="mapInfo.mapSrc"
                    :style="`width: 150px; height: 150px;`"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center">
                      {{ mapInfo.mapName }}
                    </div>
                  </q-img>
                </q-item-section>
              </q-item>
              <q-separator v-if="idx + 1 < zoomer.maps!.length" :key="idx + 'sep'" spaced />
            </template>
          </q-list>
        </div>
      </template>
    </c-card>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import extinguisher from '@/assets/images/extinguisher.png'

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
import { storeToRefs } from 'pinia'
import { zoomerType, mapType, markType } from '@/types/zoomer'
import panzoom from 'panzoom'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingMap'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const serverHost = useServerHostStore()
const { serverUrl } = storeToRefs(serverHost)
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

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

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  sopFireFightingLocationId: null,
  sopFireFightingTypeCd: null,
  disposeFlag: 'N',
  loginDeptCd: ''
})
const zoomer = ref<zoomerType>({
  height: 600,
  ratio: 1,
  style: 'width: 100%; height: 100%;',
  imageStyle: 'width: 90%; height: 90%;',
  value: 100,
  interval: 10,
  options: {
    minZoom: 0.5,
    maxZoom: 3,
    initialZoom: 0.9,
    initialX: 800,
    initialY: 200,
    bounds: true,
    boundsPadding: 0.1,
    zoomDoubleClickSpeed: 1
  },
  menu: {
    offsetX: 0,
    offsetY: 0
  },
  currentMap: {
    sopFireFightingMapId: '',
    sopFireFightingLocationId: ''
  },
  maps: []
})
const editable = ref(true)
const openMarkInfo = ref<markType>({})
const listUrl = ref('')
const detailUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const zoomable = ref<HTMLDivElement | null>(null)

/******************************
 * @Computed_선언
 *******************************/
const map = computed(() => {
  let _map = {
    sopFireFightingMapId: '',
    mapSrc: '',
    mapName: '',
    ratio: 0,
    marks: []
  } as mapType | undefined
  if (mapExists.value) {
    _map = _.find(zoomer.value.maps, {
      sopFireFightingMapId: zoomer.value.currentMap!.sopFireFightingMapId
    })
  }
  return _map
})
const mapExists = computed(
  () => zoomer.value.maps!.length > 0 && Boolean(zoomer.value.currentMap!.sopFireFightingMapId)
)

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
})
onMounted(async () => {
  init()
  await nextTick() // DOM 업데이트 후 실행
  if (zoomable.value) {
    const pz = panzoom(zoomable.value, {
      autocenter: true, // 컨텐츠를 중앙 정렬
      bounds: true // 경계 활성화
    })

    // 필요하면 `pz`를 사용해 추가 설정 가능
    pz.on('pan', () => {})
    pz.on('zoom', () => {})
  } else console.error('zoomable 요소가 없습니다.')
})
onBeforeUnmount(() => {
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.fft.fireFightingResultMap.list.url
  detailUrl.value = selectConfig.fft.fireFightingResultMap.get.url
  insertUrl.value = transactionConfig.fft.fireFightingResultMap.insert.url
  deleteUrl.value = transactionConfig.fft.fireFightingResultMap.delete.url
  // code setting
  searchParam.value.loginDeptCd = user.value.deptCd
  // list setting
  getList()
  setSize()
}
/******************************
 * TODO (목적): 지도 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    zoomer.value.maps = _result.data || []
    zoomer.value.currentMap!.sopFireFightingLocationId =
      searchParam.value.sopFireFightingLocationId || ''
    const idx = _.findIndex(zoomer.value.maps, {
      sopFireFightingMapId: zoomer.value.currentMap!.sopFireFightingMapId
    })
    if (zoomer.value.maps!.length > 0 && idx === -1) {
      zoomer.value.currentMap!.sopFireFightingMapId = zoomer.value.maps![0].sopFireFightingMapId
    } else if (!zoomer.value.maps || zoomer.value.maps.length === 0) {
      zoomer.value.currentMap!.sopFireFightingMapId = ''
    }
  })
}
/******************************
 * TODO (목적): 지도 사이즈 세팅
 *******************************/
function setSize() {
  zoomer.value.height = window.innerHeight - 200
  zoomer.value.ratio = (zoomer.value.height - 30) / 575
  // zoomer.value.style = `width: 100%; height: ${height}px;`
  // zoomer.value.imageStyle = `width: 90%; height: ${height - 30}px;`
}
/******************************
 * TODO (목적): 상세 조회. 특정 지도 정보의 위치정보만 refresh
 *******************************/
function getDetail(sopFireFightingMapId?: stringNull) {
  if (!sopFireFightingMapId) return
  $http({
    url: $format(detailUrl.value, sopFireFightingMapId),
    method: 'GET'
  }).then((_result: any) => {
    if (zoomer.value.maps!.length > 0 && _result.data && _result.data.marks.length > 0) {
      const idx = _.findIndex(zoomer.value.maps, { sopFireFightingMapId: sopFireFightingMapId })
      zoomer.value.maps![idx].marks = _result.data.marks
    }
  })
}
/******************************
 * TODO (목적): 해당 컴포넌트 클릭시 show() 완료전
 *******************************/
function beforeShow(event: any) {
  const ratio = 575 / (zoomer.value.height! - 30)
  zoomer.value.menu!.offsetX = event.offsetX * ratio
  zoomer.value.menu!.offsetY = event.offsetY * ratio
}
/******************************
 * TODO (목적): 해당 맵 클릭시
 *******************************/
function mapSelect(mapInfo: mapType) {
  zoomer.value.currentMap!.sopFireFightingMapId = mapInfo.sopFireFightingMapId
}
/******************************
 * TODO (목적): 맵에 표시한 소방설비 마크 삭제
 *******************************/
function deleteFireFightingMark(mark: any) {
  $http({
    url: $format(deleteUrl.value, mark.sopFireFightingResultMapId),
    method: 'DELETE'
  }).then(() => {
    message.requestSuccess()
    getDetail(mark.sopFireFightingMapId)
  })
}
/******************************
 * TODO (목적): 소방설비 팝업에서 추가. 1. 소방설비 팝업 open > 2. 설비 단일 선택 > 3. 저장
 *******************************/
function addFireFighting() {
  popupOptions.value = getPopupOptions('fireFightingEquip', popupOptions.value, closeFire, {
    type: 'single',
    searchParam: {
      mapFlag: true,
      sopFireFightingLocationId: zoomer.value.currentMap!.sopFireFightingLocationId
    }
  })
}
function closeFire(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    $http({
      url: insertUrl.value,
      method: 'POST',
      data: {
        sopFireFightingResultMapId: '', // 작업위치 번호
        sopFireFightingMapId: map.value!.sopFireFightingMapId, // 지도 일련번호
        locationXcoordinate: zoomer.value.menu!.offsetX, // 작업위치 X좌표
        locationYcoordinate: zoomer.value.menu!.offsetY, // 작업위치 Y좌표
        sopFireFightingId: _data[0].sopFireFightingId, // 소방설비 일련번호
        regUserId: user.value.userId // 등록자 ID
      }
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function openFireFightingPop(row: any) {
  openMarkInfo.value = row
  popupOptions.value.title = '소방설비 상세'
  popupOptions.value.param = { sopFireFightingId: row.sopFireFightingId }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/fft/fireFightingMasterDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getDetail(openMarkInfo.value.sopFireFightingMapId)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.custom-zoomer
  border: solid 1px silver
  background-color: white !important
.mark-firefighting
  background: unset !important
  cursor: pointer

.firefighting-menu-layer
  border-radius: 10px !important
  max-width: 600px !important
.firefighting-menu-card
  padding-top: 5px
  padding-bottom: 5px
  margin: 6px
  .firefighting-card-section
    padding: 0 10px 0 10px
  .firefighting-card-item
    min-height: auto

.zommer-container
  .vue-pan-zoom-scene
    overflow: auto

.firefighting-card
  .customCardbody
    margin: 0 !important
    padding: 0 !important

.firefighting-map-list
  padding-right: 0 !important
  .q-item
    flex-direction: column
    align-items: center

.firefighting-mark-add
  min-width: 0 !important
  padding: 0 !important

.rainbow
  position: relative
  z-index: 0
  width: 400px
  height: 300px
  border-radius: 10px
  overflow: hidden
  padding: 2rem
  display: flex
  justify-content: center
  align-items: center
  font-family: sans-serif
  font-weight: bold
  &::before
    content: ''
    position: absolute
    z-index: -2
    left: -50%
    top: -50%
    width: 200%
    height: 200%
    background-color: #399953
    background-repeat: no-repeat
    background-size: 50% 50%, 50% 50%
    background-position: 0 0, 100% 0, 100% 100%, 0 100%
    background-image: linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5)
    animation: rotate 4s linear infinite
  &::after
    content: ''
    position: absolute
    z-index: -1
    left: 6px
    top: 6px
    width: calc(100% - 12px)
    height: calc(100% - 12px)
    background: white
    border-radius: 5px

.circle
  display: block
  width: 50px
  height: 50px
  border-radius: 50%
  padding: 2.5px
  background-clip: content-box
  animation: spin 10s linear infinite

.circle-wrapper:active .circle
  animation: spin 2s linear infinite
.success
  background-color: #4BB543
  border: 2.5px dashed #4BB543
.error
  background-color: #CA0B00
  border: 2.5px dashed #CA0B00
.warning
  background-color: #F0D500
  border: 2.5px dashed #F0D500
@keyframes spin
  100%
    transform: rotateZ(360deg)
</style>

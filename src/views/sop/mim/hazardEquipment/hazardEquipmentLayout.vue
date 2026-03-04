<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="HHM_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="machineryClassification"
            label="기계분류"
            v-model:value="searchParam.machineryClassification"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text name="machineryName" label="기계명" v-model:value="searchParam.machineryName" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text name="machineryName" label="item번호" v-model:value="searchParam.itemNo" />
        </div>
      </template>
    </c-search-box>
    <c-card :title="`[${map!.mapName}] 도면 정보`" class="cardClassDetailForm hazardequip-card">
      <template v-slot:card-description>
        <span style="color: tomato; margin-left: 10px">{{
          $language('도면이미지에 마우스 우클릭을 통해 유해위험기계기구 추가하세요.')
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
              :src="map.mapSrc"
              :style="`width: ${(zoomer.height - 30) * map.ratio}px; height: ${zoomer.height - 30}px;`"
            >
              <q-menu touch-position context-menu @before-show="beforeShow">
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup @click="onItemClick">
                    <q-item-section avatar class="hazardequip-mark-add">
                      <q-icon name="add" color="red" />
                    </q-item-section>
                    <q-item-section>{{ $language('기계명') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <c-map-marker
                v-for="(mark, idx) in map.marks"
                :key="idx"
                :isImg="true"
                :imgSrc="mark.hazardEquipDownPath || require('@/assets/images/xxx.png')"
                class="mark-hazardEquip"
                :style="`transform: translate(${mark.locationXcoordinate * zoomer.ratio - 15}px, ${mark.locationYcoordinate * zoomer.ratio - 25}px);z-index: auto; user-select: auto; width: 30px; height: 30px;`"
                :isSelected="true"
              >
                <template v-slot:innerMark>
                  <q-menu
                    :ref="'markedproxy' + mark.idx"
                    :content-class="'hazardequip-menu-layer'"
                    anchor="top right"
                    self="top left"
                  >
                    <q-card
                      flat
                      bordered
                      @click="linkClick(mark)"
                      :class="['hazardequip-menu-card']"
                    >
                      <q-item class="hazardequip-card-section hazardequip-card-item">
                        <q-item-section>
                          <q-item-label>
                            <q-badge
                              rounded
                              color="light-green"
                              style="margin-right: 10px"
                              :label="mark.machineryClassificationName"
                            />
                            <q-badge rounded color="light-blue" :label="mark.itemNo" />
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon
                            name="delete"
                            color="red"
                            class="cursor-pointer"
                            @click.stop="removeClick(mark)"
                          />
                        </q-item-section>
                      </q-item>
                      <q-card-section class="hazardequip-card-section cursor-pointer">
                        <q-icon name="chevron_right" class="text-indigo" />
                        {{ mark.machineryName }}
                      </q-card-section>
                    </q-card>
                  </q-menu>
                </template>
              </c-map-marker>
            </q-img>
            <!-- </panZoom> -->
          </div>
        </div>
        <div
          :style="`height: ${zoomer.height}px; overflow-y: auto;`"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 hazardequip-map-list"
        >
          <q-list bordered padding>
            <template v-for="(mapInfo, idx) in zoomer.maps" :key="idx">
              <q-item clickable @click="mapSelect(mapInfo)">
                <q-item-section class="q-ml-none">
                  <q-img
                    id="zoomerImage"
                    :src="mapInfo.mapSrc"
                    style="width: 150px; height: 150px; border: 1px solid #9e9e9e"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center">
                      {{ mapInfo.mapName }}
                    </div>
                  </q-img>
                </q-item-section>
              </q-item>
              <q-separator v-if="idx + 1 < zoomer.maps.length" :key="idx + 'sep'" spaced />
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
import { mapType } from '@/types/zoomer'
import panzoom from 'panzoom'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardEquipmentLayout'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
  machineryClassification: null,
  machineryName: '',
  itemNo: ''
})
const zoomer = ref<any>({
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
    sopMapId: ''
  },
  maps: []
})
const editable = ref(true)
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const zoomable = ref<HTMLDivElement | null>(null)

/******************************
 * @Computed_선언
 *******************************/
const map = computed(() => {
  let _map = {
    sopMapId: '',
    mapSrc: '',
    mapName: '',
    ratio: 0,
    marks: []
  } as any
  if (mapExists.value) {
    _map = _.find(zoomer.value.maps, {
      sopMapId: zoomer.value.currentMap!.sopMapId
    })
  }
  return _map
})
const mapExists = computed(
  () => zoomer.value.maps!.length > 0 && Boolean(zoomer.value.currentMap!.sopMapId)
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
  listUrl.value = selectConfig.sop.hhm.hazard.hazardMap.list.url
  insertUrl.value = transactionConfig.sop.hhm.hazard.hazardMap.insert.url
  deleteUrl.value = transactionConfig.sop.hhm.hazard.hazardMap.delete.url
  // code setting
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
    if (zoomer.value.maps!.length > 0 && !zoomer.value.currentMap?.sopMapId) {
      zoomer.value.currentMap!.sopMapId = zoomer.value.maps![0].sopMapId
    }
  })
}
/******************************
 * TODO (목적): 지도 사이즈 세팅
 *******************************/
function setSize() {
  zoomer.value.height = window.innerHeight - 200
  zoomer.value.ratio = (zoomer.value.height - 30) / 575
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
  zoomer.value.currentMap!.sopMapId = mapInfo.sopMapId
}
function onItemClick() {
  popupOptions.value.title = '유해위험기계기구 검색'
  popupOptions.value.param = {
    type: 'single'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardEquipmentClassPop.vue`))
  )
  popupOptions.value.width = '90%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeEquipPopup
}
function closeEquipPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    let index = -1
    _.forEach(zoomer.value.maps, (_item) => {
      if (index === -1) {
        index = _.findIndex(_item.marks, {
          hhmHazardousMachineryId: data[0].hhmHazardousMachineryId
        })
      }
    })

    if (index === -1) {
      const item = data[0]
      $http({
        url: insertUrl.value,
        method: 'POST',
        data: {
          hhmMapResultId: '', // 작업위치 번호
          sopMapId: map.value.sopMapId, // 지도 일련번호
          locationXcoordinate: zoomer.value.menu.offsetX, // 작업위치 X좌표
          locationYcoordinate: zoomer.value.menu.offsetY, // 작업위치 Y좌표
          hhmHazardousMachineryId: item.hhmHazardousMachineryId, // 유해위험기계기구 일련번호
          regUserId: user.value.userId // 등록자 ID
        }
      }).then(() => {
        message.requestSuccess()
        getList()
      })
    } else {
      message.alert({
        title: '안내',
        message: '이미 배치된 기계입니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardEquipmentClassDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.title = '유해위험기계기구 상세'
  popupOptions.value.param = {
    hhmHazardousMachineryId: row.hhmHazardousMachineryId ? row.hhmHazardousMachineryId : ''
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
function removeClick(mark: any) {
  $http({
    url: $format(deleteUrl.value, mark.hhmHazardousMachineryId),
    method: 'DELETE'
  }).then(() => {
    message.requestSuccess()
    getList()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-search-box @enter="getMapData" class="no-margin">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="none" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="0M"
            label="작업기간"
            name="workPermitPeriod"
            v-model:value="searchParam.workPermitPeriod"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="신청부서"
            name="applicationDeptCd"
            v-model:value="searchParam.applicationDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="발급부서"
            name="issuedDeptCd"
            v-model:value="searchParam.issuedDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="SWP_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="swpStepCd"
            label="진행단계"
            v-model:value="searchParam.swpStepCd"
          />
        </div> -->
      </template>
    </c-search-box>
    <c-card title="작업허가 현황" class="cardClassDetailForm workPermitGraph" :height="cardHeight">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getMapData" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 container" ref="carousel">
          <q-carousel
            v-if="mapObj.maps && mapObj.maps.length > 0"
            class="map-carousel"
            swipeable
            animated
            arrows
            height="auto"
            control-type="regular"
            control-color="grey-6"
            v-model="mapObj.slide"
            infinite
            @transition="transition"
          >
            <!-- :style="{ width: map.ratio * 535 + 'px' }" -->
            <q-carousel-slide v-for="(map, idx) in mapObj.maps" :key="idx" :name="idx">
              <q-chip
                square
                outline
                dense
                color="blue"
                style="z-index: 10; position: absolute; left: 5px"
                :label="map.mapName"
              />
              <div class="mapWorkIcons">
                <q-expansion-item
                  dense
                  class="shadow-1 overflow-hidden"
                  style="border-radius: 10px"
                  icon=""
                  :label="$language('범례')"
                  header-class="bg-default text-white"
                  expand-icon-class="text-white"
                  expand-icon="expand_less"
                  expanded-icon="expand_more"
                  default-opened
                >
                  <q-card>
                    <q-card-section>
                      <ul>
                        <li v-for="(icon, iconIdx) in swpIconItems" :key="iconIdx">
                          <q-icon :name="icon.icon" class="text-red" size="16px" />
                          {{ $language(icon.name) }}
                        </li>
                      </ul>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </div>
              <q-img
                :src="map.mapSrc"
                :contain="true"
                :style="{ height: '580px', width: (map.ratio || 1.4) * 580 + 'px' }"
              >
                <VueDraggableResizable
                  v-for="(item, idx) in map.maps"
                  :key="idx"
                  ref="markImage"
                  class="workPermitGraphMarkImage"
                  :resizable="false"
                  :parent="true"
                  :draggable="false"
                  :x="item.locationXcoordinate * mapRate * 1.1"
                  :y="item.locationYcoordinate * mapRate * 1"
                  :w="20"
                  :h="20"
                  :grid="[10, 10]"
                >
                  <q-icon name="push_pin" class="blinking" />
                  <div
                    class="workPermitGraphMarkImageAbbreviationParent"
                    :style="{
                      width: '150px',
                      left: getLeft(item),
                      top: getTop(item)
                    }"
                  >
                    <div class="workPermitGraphMarkImageAbbreviation">
                      <transition name="mark-list" tag="div">
                        <div v-show="true">
                          <q-banner
                            v-for="(resultType, idx) in item.resultTypes"
                            :key="idx"
                            dense
                            :class="[
                              idx % 2 === 1 ? 'bg-grey-4' : 'bg-grey-3',
                              'workPermitGraphMarkImageAbbreviationBannerDetail'
                            ]"
                            @mouseenter="hoverPermitId = resultType.sopWorkPermitId"
                            @mouseleave="hoverPermitId = null"
                          >
                            <template v-slot:avatar>
                              <q-icon :name="workPermitIconName(resultType)" class="text-red pin" />
                            </template>
                            {{ resultType.sopWorkTypeName }}
                            <q-chip
                              square
                              outline
                              dense
                              size="0.9em"
                              :color="workPermitbadgeColor(resultType.swpStepName)"
                              :label="$language(resultType.swpStepName)"
                            />
                            <q-btn
                              class="q-ml-sm"
                              outline
                              round
                              dense
                              color="red"
                              size="9px"
                              label=""
                              icon="add"
                              @click="openWorkPermit(resultType)"
                            />
                            <div class="workPermitGraphMarkImageAbbreviationCaption">
                              {{ resultType.workSummary }}
                            </div>
                          </q-banner>
                        </div>
                      </transition>
                    </div>
                  </div>
                </VueDraggableResizable>
              </q-img>
            </q-carousel-slide>
          </q-carousel>
          <c-empty v-else :description="$language('등록된 지도가 없습니다.')" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-table
            ref="table"
            title="작업허가서 목록"
            :columns="grid.columns"
            :data="gridData"
            :gridHeight="cardHeight2"
            :customTrClass="setTrClass"
            @linkClick="linkClick"
          />
        </div>
      </template>
    </c-card>
  </div>
  <c-dialog :param="popupOptions" />
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
  name: 'workPermitGraph'
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
  url: string
  maps: Array<mapType>
  slide: number
}
interface mapType {
  sopMapId: string
  mapSrc: string
  mapName: string
  ratio: number
  maps: Array<mapResultType>
  others: Array<mapResultType>
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
  selectFlag?: stringNull
}

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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  workPermitPeriod: [] as stringNull[],
  applicationDeptCd: null,
  issuedDeptCd: null,
  permitTypeCd: null,
  supplementWorkTypeCd: null,
  swpStepCd: null
})
const grid = ref({
  columns: [
    {
      name: 'workSummary',
      field: 'workSummary',
      label: '작업개요',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width:200px'
    },
    {
      name: 'swpStepName',
      field: 'swpStepName',
      label: '진행단계',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'permitDate',
      field: 'permitDate',
      label: '허가일',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'permitTypeName',
      field: 'permitTypeName',
      label: '허가서구분',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'supplementWorkTypeNames',
      field: 'supplementWorkTypeNames',
      label: '보충작업',
      align: 'left',
      sortable: true,
      style: 'width:200px'
    }
  ]
})
const swpIconItems = ref<any[]>([
  {
    icon: 'engineering',
    name: '메인'
  },
  {
    icon: 'local_fire_department',
    name: '화기'
  },
  {
    icon: 'masks',
    name: '밀폐공간'
  },
  {
    icon: 'directions_car',
    name: '차량'
  },
  {
    icon: 'science',
    name: '유해위험물질'
  },
  {
    icon: 'bolt',
    name: '전기'
  },
  {
    icon: 'radar',
    name: '방사선'
  },
  {
    icon: 'forest',
    name: '환경'
  },
  {
    icon: 'stairs',
    name: '고소'
  },
  {
    icon: 'thermostat',
    name: '고온'
  },
  {
    icon: 'forklift',
    name: '중장비/굴착/크레인'
  },
  {
    icon: 'construction',
    name: '기타'
  }
])
const mapObj = ref<mapObjType>({
  url: '',
  maps: [],
  slide: 0
})
const mapRate = computed(() => 580 / 530)
const carousel = ref<any>(null)
const hoverPermitId = ref<stringNull>(null)
/******************************
 * @Computed_선언
 *******************************/
const gridData = computed(() => {
  let concatData: Array<workPermitResultType> = []
  if (mapObj.value.maps && mapObj.value.maps.length > 0) {
    _.forEach(mapObj.value.maps[mapObj.value.slide].maps, (map) => {
      concatData = _.concat(concatData, map.resultTypes)
    })
  }
  return _.uniqBy(concatData, 'sopWorkPermitId').map((item) => ({
    ...item,
    selectFlag: item.sopWorkPermitId === hoverPermitId.value ? 'Y' : 'N'
  }))
})
const cardHeight = computed(() => window.innerHeight - 195 + 'px')
const cardHeight2 = computed(() => window.innerHeight - 225 + 'px')

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
  mapObj.value.url = selectConfig.main.workPermit.url
  // code setting
  // searchParam.value.workPermitPeriod = [getPrevYear(1), getThisYear()]
  // list setting
  getMapData()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getMapData() {
  const _height = 580
  carousel.value.style.setProperty('--map-height', String(_height) + 'px')
  $http({
    url: mapObj.value.url,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      mapObj.value.maps = _result.data
      carousel.value.style.setProperty('--map-ratio', mapObj.value.maps[0].ratio)
    }
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function transition() {
  carousel.value.style.setProperty('--map-ratio', mapObj.value.maps[mapObj.value.slide].ratio)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getLeft(item: any) {
  let left = 0
  const nonDetailLocation = item.locationXcoordinate + 210
  const detailLocation = item.locationXcoordinate + 210
  const calLocation = nonDetailLocation > detailLocation ? nonDetailLocation : detailLocation

  if (calLocation > 800) left = 800 - calLocation
  return left + 'px'
}
function getTop(item: any) {
  let top = 30
  const nonDetailLocation = item.locationYcoordinate + 210
  const detailLocation = item.locationYcoordinate + 210
  const calLocation = nonDetailLocation > detailLocation ? nonDetailLocation : detailLocation
  if (calLocation > 750) top = 720 - calLocation
  else if (calLocation > 730) top = 700 - calLocation - 10
  else if (calLocation > 700) top = 700 - calLocation - 30
  return top + 'px'
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function workPermitIconName(resultType: workPermitResultType) {
  let icon = ''
  switch (resultType.sopWorkTypeCd) {
    // case 'SPT0000001': // 일반
    //   icon = 'engineering'
    //   break
    // case 'SPT0000005': // 화기
    //   icon = 'local_fire_department'
    //   break
    // case 'SSWT000001': // 밀폐공간
    //   icon = 'dangerous'
    //   break
    // case 'SSWT000005': // 정전
    //   icon = 'flash_off'
    //   break
    // case 'SSWT000010': // 방사선
    //   icon = 'warning'
    //   break
    // case 'SSWT000015': // 굴착
    //   icon = 'hardware'
    //   break
    // case 'SSWT000020': // 고소
    //   icon = 'stairs'
    //   break
    // case 'SSWT000025': // 중장비
    //   icon = 'agriculture'
    //   break
    case 'SPT0000001': // 정상
    case 'SPT0000005': // 긴급
    case 'SPT0000010': // 자체
      icon = 'engineering'
      break
    case 'SSWTC00001': // 차량
      icon = 'directions_car'
      break
    case 'SSWTC00101': // 화기
    case 'SSWTC00205': // 화기
      icon = 'local_fire_department'
      break
    case 'SSWTC00201': // 밀폐공간
    case 'SSWTC00202': // 밀폐공간
      icon = 'masks'
      break
    case 'SSWTC00102': // 유해위험물질
    case 'SSWTC00203': // 유해위험물질
      icon = 'science'
      break
    case 'SSWTC00003': // 전기
      icon = 'bolt'
      break
    case 'SSWTC00005': // 방사선
      icon = 'radar'
      break
    case 'SSWTC00006': // 환경
      icon = 'forest'
      break
    case 'SSWTC00104': // 고소
      icon = 'stairs'
      break
    case 'SSWTC00105': // 고온
    case 'SSWTC00206': // 고온
      icon = 'thermostat'
      break
    case 'SSWTC00103': // 중장비
    case 'SSWTC00204': // 굴착
    case 'SSWTC00207': // 크레인
      icon = 'forklift'
      break
    default:
      icon = 'construction'
  }
  return icon
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function workPermitbadgeColor(swpStepName: string) {
  let icon = ''
  switch (swpStepName) {
    case '승인완료':
      icon = 'light-blue'
      break
    case '연장':
      icon = 'amber'
      break
    case '작업완료':
      icon = 'light-green'
      break
    default:
      icon = 'blue'
  }
  return icon
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function openWorkPermit(item: workPermitResultType) {
  if (!item) return
  popupOptions.value.isFull = true
  popupOptions.value.title = $language('작업허가서')
  popupOptions.value.param = {
    sopWorkPermitId: item.sopWorkPermitId,
    permitTypeCd: item.permitTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/swp/safeWorkPermitDetail14.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeWorkPermitPopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeWorkPermitPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function linkClick(row: workPermitResultType) {
  popupOptions.value.title = '작업허가서'
  popupOptions.value.param = {
    sopWorkPermitId: row ? row.sopWorkPermitId : '',
    permitTypeCd: row ? row.permitTypeCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safeWorkPermitDetail14.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeWorkPermitPopup
}
function setTrClass(_props: any) {
  return _props.row.selectFlag === 'Y' ? 'bg-orange-1' : ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

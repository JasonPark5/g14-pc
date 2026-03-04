<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            codeGroupCd="CLOSED_SPACE_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="closedSpaceTypeCd"
            label="밀폐공간 종류"
            v-model:value="searchParam.closedSpaceTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-card title="밀폐공간 배치도" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            label="추가"
            v-if="editable && !props.popupParam.isPopup"
            icon="add"
            @btnClicked="addSpace"
          />
          <c-btn
            label="삭제"
            v-if="editable && tempMapDetails!.length > 0 && !popupParam.isPopup"
            icon="remove"
            @btnClicked="removeClick"
          />
          <c-btn
            v-if="editable && tempMapDetails!.length > 0 && !popupParam.isPopup"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="tempMapDetails"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveClick"
            @btnCallback="saveCallback"
          />
          <c-btn v-if="popupParam.isPopup" label="선택" icon="check" @btnClicked="select" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 container" ref="carousel">
          <q-carousel
            v-if="cmap.maps && cmap.maps.length > 0"
            class="map-carousel"
            control-type="regular"
            control-color="grey-6"
            animated
            arrows
            v-model="cmap.slide"
            infinite
            @transition="transition"
          >
            <q-carousel-slide
              v-for="(map, idx) in cmap.maps"
              :key="idx"
              :name="idx"
              :img-src="map.mapSrc"
              fit="contain"
            >
              <div class="mapTitleDiv" v-text="map.mapName" />
              <div class="q-img__content absolute-full">
                <VueDraggableResizable
                  v-for="(item, idx) in map.mapDetails"
                  :key="idx"
                  ref="markImage"
                  class="mainMarkImage"
                  :resizable="false"
                  :parent="true"
                  :draggable="true"
                  :x="item.locationXcoordinate"
                  :y="item.locationYcoordinate"
                  :w="30"
                  :h="30"
                  :grid="[30, 30]"
                  @dragging="(x: number, y: number) => onDrag(item, x, y)"
                >
                  <!-- {{idx + 1}} -->
                  <q-img fit="scale-down" style="bottom: 5px" :contain="true" />
                  <!-- <q-icon name="check" color="blue" class="blinking" /> -->
                  <!-- top: getTop(item), -->
                  <div
                    class="markImage-abbreviation-parent"
                    :style="{
                      width: '220px',
                      top: '30px',
                      left: getLeft(item)
                    }"
                  >
                    <div
                      class="markImage-abbreviation"
                      @mouseover="
                        () => {
                          item.isHover = true
                        }
                      "
                      @mouseleave="
                        () => {
                          item.isHover = false
                        }
                      "
                    >
                      <!-- <transition name="mark-list" tag="div">
                            <div v-if="!item.isHover" class="markImage-tran">
                              <q-banner
                                dense 
                                class="markImage-abbreviation-banner">
                                <q-icon name="report_problem" class="text-blue" />
                                <div>{{item.processName}}</div>
                              </q-banner>
                            </div>
                          </transition> -->
                      <transition name="mark-list" tag="div">
                        <q-banner dense class="markImage-abbreviation-banner-detail bg-grey-3">
                          <template v-slot:avatar>
                            <q-icon name="warning" class="text-red" size="xs" />
                          </template>
                          <div class="caption-header">{{ item.heaClosedSpaceName }}</div>
                          <!-- <q-btn class="q-ml-sm" outline round color="red" size="9px" label="" icon="add"/> -->
                          <div class="caption-work">
                            {{ $language('종류') + ' : ' + item.closedSpaceTypeName }}
                            <br />
                          </div>
                        </q-banner>
                      </transition>
                    </div>
                  </div>
                </VueDraggableResizable>
              </div>
            </q-carousel-slide>
          </q-carousel>
          <q-img v-else src="@images/no-image.png" style="max-width: 435px">
            <div class="absolute-bottom text-subtitle1 text-center">
              {{ $language('등록된 지도가 없습니다.') }}
            </div>
          </q-img>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 container">
          <c-table
            ref="table"
            :title="newTitle"
            :selection="popupParam.type"
            :columns="grid.columns"
            :data="tempMapDetails"
            :isFullScreen="false"
            :isExcelDown="false"
            :columnSetting="false"
            :gridHeight="popupParam.isPopup ? '600px' : ''"
            rowKey="heaClosedSpaceId"
            @table-data-change="tableDataChange"
          />
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
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'
import { mapType } from './closedSpace'
import noImage from '@/assets/images/no-image.png'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'closedSpaceMap'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<object>
  height?: stringNull
}
interface propType {
  popupParam?: {
    heaClosedSpaceEquipmentGiveId?: stringNull
    type?: stringNull
    isPopup?: boolean | null
  }
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    heaClosedSpaceEquipmentGiveId: null,
    type: 'multiple',
    isPopup: false
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref({
  plantCd: null,
  closedSpaceTypeCd: null
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  widht: '80%',
  top: '',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'closedSpaceTypeName',
      field: 'closedSpaceTypeName',
      label: '종류',
      align: 'center',
      sortable: true,
      style: 'width: 250px'
    },
    {
      name: 'heaClosedSpaceName',
      field: 'heaClosedSpaceName',
      label: '밀폐공간명',
      align: 'left',
      sortable: true
    }
  ],
  data: [],
  height: '500px'
})
const cmap = ref<mapType>({
  slide: 0,
  maps: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const newTitle = ref('밀폐공간 목록')
const tempMapDetails = ref<Array<any>>([])
const carousel = ref<any>(null)
const table = ref<any>(null)

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
  listUrl.value = selectConfig.hea.closedspaceMap.list.url
  saveUrl.value = transactionConfig.hea.closedspaceMap.save.url
  deleteUrl.value = transactionConfig.hea.closedspaceMap.delete.url
  // code setting
  for (let i = 0; i < cmap.value.maps!.length; i++) cmap.value.maps![i].mapSrc = noImage
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  carousel.value.style.setProperty('--map-height', 575 * 0.835 + 'px')
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      cmap.value.maps = _result.data
      if (cmap.value.maps!.length > 0)
        tempMapDetails.value! = cmap.value.maps![cmap.value.slide].mapDetails
      else tempMapDetails.value = []
      // for (let i = 0; i < cmap.value.maps!.length; i++) {
      //   carousel.value.style.setProperty(
      //     '--map-height',
      //     carousel.value.offsetWidth * cmap.value.maps![i].ratio + 'px'
      //   )
      // }
      carousel.value.style.setProperty('--map-ratio', cmap.value.maps![0].ratio)
      newTitle.value = cmap.value.maps![0].mapName + ' ' + $language('밀폐공간 목록')
    } else {
      tempMapDetails.value = []
      cmap.value = { slide: 0, maps: [] }
    }
  })
}
/******************************
 * TODO (목적): 구성 요소가 새 패널로 전환 후 emit
 *******************************/
function transition() {
  tempMapDetails.value = cmap.value.maps![cmap.value.slide].mapDetails
  newTitle.value = cmap.value.maps![cmap.value.slide].mapName + ' ' + $language('밀폐공간 목록')
  carousel.value.style.setProperty('--map-ratio', cmap.value.maps![cmap.value.slide].ratio)
}
/******************************
 * TODO (목적): 도면에 spot 추가
 *******************************/
function addSpace() {
  popupOptions.value = getPopupOptions('closedSpace', popupOptions.value, closeSpacePopup, {
    type: 'multiple',
    searchParam: {
      plantCd: searchParam.value.plantCd
    }
  })
}
function closeSpacePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(tempMapDetails.value, { heaClosedSpaceId: item.heaClosedSpaceId }) === -1) {
        const newSpace = {
          editFlag: 'C',
          heaClosedSpaceId: item.heaClosedSpaceId, // 밀폐공간 번호
          plantName: item.plantName, // 사업장 코드
          heaClosedSpaceName: item.heaClosedSpaceName, // 밀폐공간명
          closedSpaceTypeName: item.closedSpaceTypeName, // 밀폐공간 종류코드
          remark: item.remark, // 밀폐공간 설명
          locationXcoordinate: 0, // 작업위치 X좌표
          locationYcoordinate: 0, // 작업위치 Y좌표
          sopMapId: cmap.value.maps![cmap.value.slide].sopMapId,
          chgUserId: user.value.userId
        } as any
        cmap.value.maps![cmap.value.slide].maps!.push(newSpace)
        cmap.value.maps![cmap.value.slide].mapDetails!.push(newSpace)
        tempMapDetails.value = cmap.value.maps![cmap.value.slide].mapDetails
      }
    })
  }
}
/******************************
 * TODO (목적): 도면에 추가된 spot 드래그 이동
 *******************************/
function onDrag(item: any, x: number, y: number) {
  _.forEach(cmap.value.maps![cmap.value.slide].maps, (_item) => {
    if (_item.heaClosedSpaceId === item.heaClosedSpaceId && _item.editFlag !== 'C') {
      _item.editFlag = 'U'
      _item.chgUserId = user.value.userId
    }
  })
  item.locationXcoordinate = x
  item.locationYcoordinate = y
}
/******************************
 * TODO (목적): 위치 계산
 *******************************/
function getLeft(item: any) {
  let left = 0
  const nonDetailLocation = item.locationXcoordinate + 210
  const detailLocation = item.locationXcoordinate + 210
  const calLocation = nonDetailLocation > detailLocation ? nonDetailLocation : detailLocation
  if (calLocation > 800) left = 800 - calLocation // 지도의 높이 = 800
  return left + 'px'
}
// function getTop(item: any) {
//   let top = 29
//   const calLocation = item.locationYcoordinate
//   if (calLocation > 594) top = 594 - calLocation // 지도의 높이 = 594
//   return top + 'px'
// }
/******************************
 * TODO (목적): 저장
 *******************************/
function saveClick() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      _.forEach(tempMapDetails.value, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
        _.forEach(cmap.value.maps![cmap.value.slide].mapDetails, (_item) => {
          if (_item.heaClosedSpaceId === item.heaClosedSpaceId) {
            item.locationXcoordinate = _item.locationXcoordinate
            item.locationYcoordinate = _item.locationYcoordinate
          }
        })
      })
      isSave.value = !isSave.value
    },
    cancelCallback: () => {}
  })
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeClick() {
  const selectData = table.value.getSelected()
  console.log(selectData)
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => {
            _.forEach(cmap.value.maps, (_item) => {
              _item.maps = _.reject(_item.maps, { heaClosedSpaceId: item.heaClosedSpaceId })
              _item.mapDetails = _.reject(_item.mapDetails, {
                heaClosedSpaceId: item.heaClosedSpaceId
              })
            })
          })
          tempMapDetails.value = cmap.value.maps![cmap.value.slide].mapDetails
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 테이블 내 input 에 입력된값 처리 & 선택한 종류 값 반환
 *******************************/
function tableDataChange() {
  cmap.value.maps![cmap.value.slide].mapDetails = tempMapDetails.value
  cmap.value.maps![cmap.value.slide].maps = tempMapDetails.value
}
/******************************
 * TODO (목적): 테이블 내 input 에 입력된값 처리 & 선택한 종류 값 반환
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '밀폐공간을 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else emits('closePopup', selectData)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

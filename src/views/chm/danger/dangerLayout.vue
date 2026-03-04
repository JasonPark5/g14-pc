<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
      </template>
    </c-search-box>
    <c-card title="위험물저장소 배치도" class="cardClassDetailForm" height="740px">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addDanger" />
          <c-btn
            label="삭제"
            v-if="editable && gridData.length > 0"
            icon="remove"
            @btnClicked="removeMapDanger"
          />
          <c-btn
            v-if="editable && gridData.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="cmap.maps"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="saveMapDanger"
            @btnCallback="saveMapDangerCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 container" ref="carousel">
          <q-carousel
            v-if="cmap.maps && cmap.maps.length > 0"
            class="map-carousel"
            control-type="regular"
            control-color="grey-6"
            animated
            arrows
            infinite
            v-model="cmap.sopMapId"
            @transition="transition"
          >
            <q-carousel-slide
              v-for="(map, idx) in cmap.maps"
              :key="idx"
              :name="map.sopMapId"
              :img-src="map.mapSrc"
            >
              <div class="mapTitleDiv" v-text="map.mapName" />
              <div
                v-if="map.dangers && map.dangers.length > 0"
                class="q-img__content absolute-full"
              >
                <VueDraggableResizable
                  v-for="(danger, _idx) in map.dangers"
                  :key="`${idx}_${_idx}`"
                  ref="markImage"
                  class="mainMarkImage"
                  :resizable="false"
                  :parent="true"
                  :draggable="true"
                  :x="danger.locationXcoordinate"
                  :y="danger.locationYcoordinate"
                  :w="30"
                  :h="30"
                  :grid="[30, 30]"
                  @dragging="(x: number, y: number) => onDrag(danger, x, y)"
                >
                  <div
                    class="markImage-abbreviation-parent"
                    :style="{
                      maxWidth: '220px',
                      minWidth: '200px',
                      left: getLeft(danger),
                      top: '30px'
                    }"
                  >
                    <div
                      class="markImage-abbreviation"
                      @mouseover="
                        () => {
                          danger.isHover = true
                        }
                      "
                      @mouseleave="
                        () => {
                          danger.isHover = false
                        }
                      "
                    >
                      <transition name="mark-list" tag="div">
                        <q-banner
                          dense
                          class="markImage-abbreviation-banner-detail"
                          style="background-color: transparent !important"
                        >
                          <template v-slot:avatar>
                            <q-icon name="warning" class="text-red" size="xs" />
                          </template>
                          <div class="caption-header">{{ danger.chmDangerArea }}</div>
                          <div class="caption-work">
                            {{ $language('구분') + ' : ' + danger.chmDangerTypeName }}
                            <br />
                            {{ $language('품명 표기') + ' : ' + danger.chmDangerMstName }}
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
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 container">
          <c-table
            ref="table"
            :title="newTitle"
            :columns="grid.columns"
            :data="gridData"
            gridHeight="705px"
            selection="multiple"
            rowKey="chmDangerMstId"
            @linkClick="linkClick"
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
import { mapType, mapDetailType, dangerType } from '@/views/hea/closedSpace'
import noImage from '@/assets/images/no-image.png'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerLayout'
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
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true,
      fix: true
    },
    {
      name: 'chmDangerTypeName',
      field: 'chmDangerTypeName',
      label: '구분',
      style: 'width:80px',
      align: 'center',
      sortable: true,
      fix: true
    },
    {
      name: 'chmDangerArea',
      field: 'chmDangerArea',
      label: '위험물저장소명',
      style: 'width:160px',
      align: 'left',
      type: 'link',
      sortable: true,
      fix: true
    },
    {
      name: 'chmDangerMstName',
      field: 'chmDangerMstName',
      label: '품명 표기',
      style: 'width:150px',
      align: 'left',
      sortable: true,
      fix: true
    },
    {
      name: 'chmDangerManageUserName',
      field: 'chmDangerManageUserName',
      label: '안전관리자',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerUserName',
      field: 'chmDangerUserName',
      style: 'width:80px',
      label: '담당자',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerSafetyUserName',
      field: 'chmDangerSafetyUserName',
      style: 'width:80px',
      label: '안전대리자',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerCount',
      field: 'chmDangerCount',
      label: '지정수량 표기',
      style: 'width:100px',
      align: 'left',
      sortable: true
    },
    {
      name: 'chmDangerMainUse',
      field: 'chmDangerMainUse',
      style: 'width:100px',
      label: '주용도',
      align: 'left',
      sortable: true
    }
  ]
})
const cmap = ref<mapType>({
  sopMapId: '',
  maps: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const newTitle = ref('위험물저장소 목록')
const carouselKey = ref('')
const markImage = ref<any>(null)
const carousel = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridData = computed(() => {
  let _data = [] as Array<dangerType>
  if (cmap.value.maps!.length > 0 && Array.isArray(cmap.value.maps) && cmap.value.sopMapId) {
    const foundItem = _.find(
      cmap.value.maps,
      (item: mapDetailType) => item.sopMapId === cmap.value.sopMapId
    )
    if (foundItem) _data = foundItem.dangers as Array<dangerType>
  }
  return _data
})

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
  listUrl.value = selectConfig.chm.danger.map.list.url
  saveUrl.value = transactionConfig.chm.danger.map.save.url
  deleteUrl.value = transactionConfig.chm.danger.map.delete.url
  // code setting
  carousel.value.style.setProperty('--map-height', 575 * 0.835 + 'px')
  for (let i = 0; i < cmap.value.maps!.length; i++) cmap.value.maps![i].mapSrc = noImage
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList(sopMapId?: stringNull) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      cmap.value.maps = _result.data
      cmap.value.sopMapId = sopMapId || cmap.value.maps![0].sopMapId || ''
      carousel.value.style.setProperty('--map-ratio', cmap.value.maps![0].ratio)
      carouselKey.value = uid()
      newTitle.value = cmap.value.maps![0].mapName + ' ' + $language('위험물저장소 목록')
    }
  })
}
/******************************
 * TODO (목적): 구성 요소가 새 패널로 전환 후 emit
 *******************************/
function transition() {
  const currentMap = _.find(
    cmap.value.maps,
    (item: mapDetailType) => item.sopMapId === cmap.value.sopMapId
  )
  if (currentMap) newTitle.value = currentMap.mapName + ' ' + $language('위험물저장소 목록')
  else newTitle.value = $language('위험물저장소 목록')
}
/******************************
 * TODO (목적): 링크 클릭시 팝업
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '위험물저장소 상세'
  popupOptions.value.param = { chmDangerMstId: row ? row.chmDangerMstId : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./dangerMasterDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList(cmap.value.sopMapId)
}
/******************************
 * TODO (목적): 도면에 추가된 spot 드래그 이동
 *******************************/
function onDrag(item: any, x: number, y: number) {
  item.locationXcoordinate = x
  item.locationYcoordinate = y
  if (item.editFlag !== 'C') {
    item.editFlag = 'U'
    item.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 위치 계산, 지도의 높이 = 800
 *******************************/
function getLeft(item: any) {
  let left = 0
  const nonDetailLocation = item.locationXcoordinate + 210
  const detailLocation = item.locationXcoordinate + 210
  const calLocation = nonDetailLocation > detailLocation ? nonDetailLocation : detailLocation
  if (calLocation > 800) left = 800 - calLocation
  return left + 'px'
}
/******************************
 * TODO (목적): 위험물저장소 행 추가
 *******************************/
function addDanger() {
  popupOptions.value = getPopupOptions('hazardStorage', popupOptions.value, closeHazardStorage, {
    type: 'multiple'
  })
}
function closeHazardStorage(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const findMap = _.find(cmap.value.maps, { sopMapId: cmap.value.sopMapId }) as mapDetailType
    _.forEach(_data, (item) => {
      if (_.findIndex(findMap!.dangers, { chmDangerMstId: item.chmDangerMstId }) === -1) {
        findMap.dangers!.push({
          chmDangerMapId: '', // 위험물 저장소 배치도 번호
          sopMapId: cmap.value.sopMapId, // 지도 일련번호
          chmDangerMstId: item.chmDangerMstId, // 위험물 저장소 일련번호
          locationXcoordinate: 0, // 작업위치 X좌표
          locationYcoordinate: 0, // 작업위치 Y좌표
          plantName: item.plantName,
          chmDangerTypeName: item.chmDangerTypeName,
          chmDangerArea: item.chmDangerArea,
          chmDangerMstName: item.chmDangerMstName,
          chmDangerManageUserName: item.chmDangerManageUserName,
          chmDangerUserName: item.chmDangerUserName,
          chmDangerSafetyUserName: item.chmDangerSafetyUserName,
          chmDangerCount: item.chmDangerCount,
          chmDangerMainUse: item.chmDangerMainUse,
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMapDanger() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      _.forEach(cmap.value.maps, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
      })
      isSave.value = !isSave.value
    },
    cancelCallback: () => {}
  })
}
function saveMapDangerCallback() {
  message.requestSuccess()
  getList(cmap.value.sopMapId)
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeMapDanger() {
  const selectData = table.value.getSelected()
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
          const findMap = _.find(cmap.value.maps, { sopMapId: cmap.value.sopMapId })
          _.forEach(selectData, (item) => {
            findMap!.dangers = _.reject(findMap!.dangers, { chmDangerMstId: item.chmDangerMstId })
          })
          table.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

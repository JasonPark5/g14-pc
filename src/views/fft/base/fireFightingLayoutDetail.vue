<template>
  <q-form ref="editForm">
    <c-card title="상세" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="map"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="editable"
            :required="true"
            label="배치도면명"
            name="mapName"
            v-model:value="map.mapName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :required="true"
            :editable="editable"
            label="소방설비 배치 장소"
            name="sopFireFightingLocationId"
            :customPopupParam="{ targetKey: 'fireFightingLocation' }"
            v-model:value="map.sopFireFightingLocationId"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :required="true"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="map.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            type="number"
            label="순번"
            name="sortOrder"
            v-model:value="map.sortOrder"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-radio
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            name="useFlag"
            v-model:value="map.useFlag"
          />
        </div>
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-upload
          style="margin-top: 0 !important"
          :fullWidth="true"
          :attachInfo="attachInfo"
          :editable="editable"
          @files="setMap"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
        <c-card
          title="소방설비 배치도면"
          class="cardClassDetailForm"
          :noMarginPadding="true"
          height="620px"
        >
          <template v-slot:card-detail>
            <div class="col-12">
              <div id="parent" ref="parent">
                <div style="height: 550px">
                  <!-- <VueDraggableResizable
                    v-for="(mp, idx) in map.fireFights"
                    :key="idx"
                    ref="markImage"
                    class="my-class"
                    :parent="true"
                    :draggable="editable"
                    :resizable="editable"
                    class-name-dragging="my-dragging-class"
                    class-name-active="my-active-class"
                    :x="mp.x"
                    :y="mp.y"
                    :w="mp.w"
                    :h="mp.h"
                    :grid="[5, 5]"
                    :minHeight="20"
                    :minWidth="20"
                    @dragging="(x: number, y: number) => onDrag(mp, x, y)"
                    @resizing="
                      (x: number, y: number, w: number, h: number) => onResize(mp, x, y, w, h)
                    "
                  >
                    <q-tooltip anchor="top middle" self="center middle">{{ mp.processName }}</q-tooltip>
                  </VueDraggableResizable> -->
                </div>
              </div>
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import noImage from '@/assets/images/no-image.png'

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
// import VueDraggableResizable from 'vue-draggable-resizable'
// import 'vue-draggable-resizable/style.css'
import { workMapType } from '@/views/sop/swp/base/workMap'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingLayoutDetail'
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
interface propType {
  popupParam: {
    sopFireFightingMapId: string
  }
  contentHeight: string
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
  popupParam: () => {
    return {
      sopFireFightingMapId: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const map = ref<workMapType>({
  sopFireFightingMapId: '', // 지도 일련번호
  plantCd: '', // 사업장 코드
  mapName: '', // 지도명
  sopFireFightingLocationId: '',
  ratio: null,
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  sysAttachFileId: '', // 수정자 ID
  contentType: '', // 수정자 ID
  sortOrder: 0
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'FIRE_FIGHTING_MAP',
  taskKey: ''
})
const useFlagItems = ref<Array<codeMasterType>>([])
const mapSrc = ref(noImage)
const detailUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('POST')
const isSave = ref(false)
const editable = ref(true)
const editForm = ref<any>(null)
const parent = ref<any>(null)

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
  detailUrl.value = selectConfig.fft.fireFightingMap.get.url
  saveUrl.value = transactionConfig.fft.fireFightingMap.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  setCanvas(5)
  getDetail()
}
/******************************
 * TODO (목적): 지도 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.sopFireFightingMapId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopFireFightingMapId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(map.value, _result.data)
      attachInfo.value.taskKey = map.value.sopFireFightingMapId
    })
  }
}
/******************************
 * TODO (목적): 지도 이미지 미리보기 셋팅
 * @param (1): 파일 정보
 *******************************/
function setMap(files?: any) {
  if (files && files.length > 0) {
    previewImage({
      sysAttachFileId: files[0].sysAttachFileId,
      contentType: files[0].contentType
    }).then((_result) => {
      mapSrc.value = String(_result)
      setCanvas(5)
    })
  } else {
    mapSrc.value = noImage
    setCanvas(5)
  }
}
/******************************
 * TODO (목적): 바둑판 형식 style 셋팅
 * @param (1): 바둑판 사이즈
 *******************************/
function setCanvas(size: number) {
  const image = new Image()
  image.src = mapSrc.value
  image.onload = function () {
    const parent = document.getElementById('parent') as any
    map.value.ratio = image.width / image.height
    const _width = map.value.ratio * 575
    parent.style.cssText =
      `background: linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px) 0% 0% / ${size}px ${size}px, ` +
      `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px) 0% 0% / ${size}px ${size}px, ` +
      `url("${mapSrc.value}") no-repeat left/contain; transform-origin: left top; height:575px;width:${_width};`
  }
}
// /******************************
//  * TODO (목적): 도면 영역 마우스 드래그
//  * @param (1): 도면 정보
//  * @param (2): x축
//  * @param (3): y축
//  *******************************/
// function onDrag(item: any, x: number, y: number) {
//   item.x = x
//   item.y = y
//   if (item.editFlag !== 'C') {
//     item.editFlag = 'U'
//     item.chgUserId = user.value.userId
//   }
// }
// /******************************
//  * TODO (목적): 도면 영역 사이즈 조절
//  * @param (1): 도면 정보
//  * @param (2): x축
//  * @param (3): y축
//  * @param (4): 너비
//  * @param (5): 높이
//  *******************************/
// function onResize(item: any, x: number, y: number, w: number, h: number) {
//   item.x = x
//   item.y = y
//   item.w = w
//   item.h = h
//   if (item.editFlag !== 'C') {
//     item.editFlag = 'U'
//     item.chgUserId = user.value.userId
//   }
// }
/******************************
 * TODO (목적): 지도 정보 저장
 *******************************/
function save() {
  mappingType.value = props.popupParam.sopFireFightingMapId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          map.value.regUserId = user.value.userId
          map.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 지도 저장 후 처리
 *******************************/
function saveCallback(result: any) {
  if (!props.popupParam.sopFireFightingMapId) {
    attachInfo.value.taskKey = result.data
    attachInfo.value.isSubmit = uid()
  }
  props.popupParam.sopFireFightingMapId = result.data
  message.requestSuccess()
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.my-class {
  /* background-color: #9E9E9E; */
  border: 2px dashed #ff5722;
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  position: absolute;
  text-align: center;
}
.my-dragging-class {
  background-color: rgb(255, 87, 34, 0.7);
  border: 2px dashed #ff5722;
}
.my-active-class {
  background-color: rgb(255, 87, 34, 0.25);
  border: 2px dashed #ff5722;
}
</style>

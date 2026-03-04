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
        <div class="col-12">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                :required="true"
                label="지도명"
                name="mapName"
                v-model:value="map.mapName"
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
                :required="true"
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
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" />
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 workMapUp">
        <c-upload
          style="margin-top: 0 !important"
          :fullWidth="true"
          :attachInfo="attachInfo"
          :editable="editable"
          @files="setMap"
        />
        <c-table
          ref="table"
          title="지도별 공정 목록"
          tableId="mapProcess"
          :editable="editable"
          :columns="grid.columns"
          :data="map.mapProcesses"
          :gridHeight="grid.height"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :isExcelDown="false"
          selection="multiple"
          rowKey="processCd"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addProcess" />
              <c-btn
                v-if="editable && map.mapProcesses && map.mapProcesses.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="removeProcess"
              />
            </q-btn-group>
          </template>
          <!-- <template slot="suffixTitle">
            <span style="font-size:0.8em;font-weight:300; color:#c10015">
              1. 비고란에는 자체점검 시 조치완료된 사항 또는 재점검이 필요한 사항을 적습니다.<br/>
              2. 유해화학물질 취급시설 자체점검을 하려는 자는 양식의 점검 항목이 모두 포함된 별도의 서식을 사용할 수 있으며, 점검 항목이 모두 포함되어 있음을 명확하게 알 수 있도록 표기해야 합니다.)
            </span>
          </template> -->
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
        <c-card title="지도" class="cardClassDetailForm" :noMarginPadding="true" height="650px">
          <template v-slot:card-detail>
            <div class="col-12">
              <div id="parent" ref="parent">
                <div v-if="map.mapProcesses && map.mapProcesses.length > 0 && setComplete">
                  <VueDraggableResizable
                    v-for="(mp, idx) in map.mapProcesses"
                    :key="idx"
                    ref="markImage"
                    class="workMap"
                    :parent="true"
                    :draggable="editable"
                    :resizable="editable"
                    class-name-dragging="workMapDragging"
                    class-name-active="workMapActive"
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
                    <q-tooltip anchor="top middle" self="center middle">{{
                      mp.processName
                    }}</q-tooltip>
                  </VueDraggableResizable>
                </div>
              </div>
              <!-- <q-img :src="mapSrc" fit="scale-down"
                :contain="true"
                :ratio="1">
                <template v-slot:loading>
                  <q-spinner-gears color="white" />
                </template>
              </q-img> -->
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
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { workMapProcessType, workMapType } from './workMap'
import noImage from '@/assets/images/no-image.png'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'workMapDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** user 호출 */
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
    sopMapId: string
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
      sopMapId: ''
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const map = ref<workMapType>({
  sopMapId: '', // 지도 일련번호
  plantCd: null, // 사업장 코드
  mapName: '', // 지도명
  ratio: null,
  sortOrder: 0,
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  sysAttachFileId: '', // 수정자 ID
  contentType: '', // 수정자 ID
  mapProcesses: [], // 공정s
  deleteMapProcesses: [] // 공정s
})
const grid = ref({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'left',
      style: 'width:200px',
      sortable: false
    }
  ],
  height: '396px'
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'WORK_MAP',
  taskKey: ''
})
const useFlagItems = ref<Array<codeMasterType>>([])
const setComplete = ref(false)
const mapSrc = ref(noImage)
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const table = ref<any>(null)
const editForm = ref<any>(null)

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
  detailUrl.value = selectConfig.sop.swp.map.get.url
  saveUrl.value = transactionConfig.sop.swp.map.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 지도 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.sopMapId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopMapId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(map.value, _result.data)
      attachInfo.value.taskKey = map.value.sopMapId
    })
  }
}
/******************************
 * TODO (목적): 지도 이미지 미리보기 셋팅
 * @param (1): 파일 정보
 *******************************/
function setMap(files: any) {
  if (files && files.length > 0) {
    const data = files[0]

    previewImage({
      sysAttachFileId: data.sysAttachFileId,
      contentType: data.contentType
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
      'background: linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px) 0% 0% / ' +
      size +
      'px ' +
      size +
      'px, linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px) 0% 0% / ' +
      size +
      'px ' +
      size +
      'px ' +
      ', url("' +
      mapSrc.value +
      '") no-repeat left/contain;' +
      'transform-origin: left top;' + // overflow-x:auto;
      // + 'background-size: 800px;'
      'height:575px;width:' +
      _width +
      ';'
    // + 'height:100%;width:800px;';
    // + 'height:800px;width:800px';

    setTimeout(() => {
      setComplete.value = true
    }, 300)
  }
}
/******************************
 * TODO (목적): 공정 추가 팝업 표시
 *******************************/
function addProcess() {
  if (!mapSrc.value) {
    message.alert({
      title: '안내',
      message: '지도 이미지를 업로드 후 공정 추가바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  popupOptions.value = getPopupOptions('process', popupOptions.value, closeProcessPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    processLevelCd: '20',
    plantCd: map.value.plantCd
  })
}
/******************************
 * TODO (목적): 공정 팝업 닫기
 * @param (1): 공정 팝업에서 선택한 공정 정보들
 *******************************/
function closeProcessPopup(data: Array<processType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!map.value.mapProcesses) map.value.mapProcesses = []
    _.forEach(data, (item) => {
      if (_.findIndex(map.value.mapProcesses, { processCd: item.processCd }) === -1) {
        map.value.mapProcesses!.push({
          sopMapProcessId: uid(), // 지도별 공정 일련번호
          sopMapId: props.popupParam.sopMapId, // 지도 일련번호
          processCd: item.processCd, // 공정코드
          processName: item.processName, // 공정명
          mapName: map.value.mapName, // 지도명
          x: 0,
          y: 0,
          w: 100,
          h: 100,
          editFlag: 'C',
          regUserId: user.value.userId // 등록일
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 공정 제외
 *******************************/
function removeProcess() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(map.value.deleteMapProcesses, { processCd: item.processCd }) === -1 &&
        item.editFlag !== 'C'
      ) {
        map.value.deleteMapProcesses!.push(item)
      }
      map.value.mapProcesses = _.reject(map.value.mapProcesses, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 공정 영역 마우스 드래그
 * @param (1): 공정 정보
 * @param (2): x축
 * @param (3): y축
 *******************************/
function onDrag(item: workMapProcessType, x: number, y: number) {
  item.x = x
  item.y = y
  if (item.editFlag !== 'C') {
    item.editFlag = 'U'
    item.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 공정 영역 사이즈 조절
 * @param (1): 공정 정보
 * @param (2): x축
 * @param (3): y축
 * @param (4): 너비
 * @param (5): 높이
 *******************************/
function onResize(item: workMapProcessType, x: number, y: number, w: number, h: number) {
  item.x = x
  item.y = y
  item.w = w
  item.h = h
  if (item.editFlag !== 'C') {
    item.editFlag = 'U'
    item.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 지도 정보 저장
 *******************************/
function save() {
  if (props.popupParam.sopMapId) {
    mappingType.value = 'PUT'
  } else {
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          map.value.regUserId = user.value.userId
          map.value.chgUserId = user.value.userId

          if (map.value.mapProcesses && map.value.mapProcesses.length > 0) {
            _.forEach(map.value.mapProcesses, (item) => {
              item.mapName = map.value.mapName
            })
          }
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 지도 저장 후 처리
 * @param (1): 지도 키 정보
 *******************************/
function saveCallback(result: any) {
  props.popupParam.sopMapId = result.data
  attachInfo.value.taskKey = result.data
  attachInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.workMap {
  /* background-color: #9E9E9E; */
  border: 2px dashed #ff5722;
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  position: absolute;
  text-align: center;
}

.workMapDragging {
  background-color: rgb(255, 87, 34, 0.7);
  border: 2px dashed #ff5722;
}
.workMapActive {
  background-color: rgb(255, 87, 34, 0.25);
  border: 2px dashed #ff5722;
}
.workMapUp {
  .nofileArea {
    height: 130px !important;
  }
}
</style>

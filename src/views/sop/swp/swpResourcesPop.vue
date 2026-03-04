<template>
  <div>
    <c-card title="작업위치(지도)" class="cardClassDetailForm" :noMarginPadding="true">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && props.popupParam.isWriting"
            label="추가"
            icon="add"
            @btnClicked="addArea"
          />
          <c-btn
            v-if="editable && props.popupParam.isWriting"
            label="지도"
            icon="place"
            @btnClicked="selectMap"
          />
          <c-btn
            v-if="editable && props.popupParam.isWriting"
            label="저장"
            icon="save"
            @btnClicked="saveMapData"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 container">
          <q-img
            :src="mapSrc"
            class="noDrag"
            :contain="true"
            spinner-color="white"
            :style="{ height: '600px', width: (ratio || 1.4) * 530 + 'px' }"
          >
            <!-- style="height: 100%; width: 100%" -->
            <template
              v-if="props.popupParam.workPermit.maps && props.popupParam.workPermit.maps.length > 0"
            >
              <VueDraggableResizable
                v-for="(item, idx) in props.popupParam.workPermit.maps"
                :key="idx"
                ref="markImage"
                class="markImage"
                :resizable="false"
                :parent="true"
                :draggable="editable && props.popupParam.isWriting"
                :x="item.locationXcoordinate"
                :y="item.locationYcoordinate"
                :w="40"
                :h="40"
                :grid="[10, 10]"
                @dragging="(x: number, y: number) => onDrag(x, y, item)"
              >
                <!-- @activated="clickMark(item)" -->
                {{ idx }}
              </VueDraggableResizable>
            </template>
          </q-img>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 container">
          <template
            v-if="props.popupParam.workPermit.maps && props.popupParam.workPermit.maps.length > 0"
          >
            <div class="row" v-for="(item, idx) in props.popupParam.workPermit.maps" :key="idx">
              <div class="col-9">
                <c-multi-select
                  :disabled="!props.popupParam.isWriting"
                  :editable="editable"
                  :comboItems="supplyItems"
                  :isObject="true"
                  class="q-pt-md"
                  valueText="sopWorkTypeName"
                  valueKey="sopWorkTypeCd"
                  itemText="codeName"
                  itemValue="code"
                  :label="(idx === 0 ? '메인작업' : '보조작업 ') + (idx === 0 ? '' : String(idx))"
                  name="resultTypes"
                  v-model:value="item.resultTypes"
                  @datachange="datachange"
                />
              </div>
              <div class="col-3" style="position: relative; top: 40px">
                <c-btn
                  v-if="editable && props.popupParam.isWriting"
                  label="제외"
                  icon="remove"
                  @btnClicked="removePoint(Number(idx))"
                />
              </div>
            </div>
          </template>
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
import noImage from '@/assets/images/no-image.png'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'
import { workMapType } from './base/workMap'
import { workMapResultType } from './safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpResourcesPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
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
  popupParam: any
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    workPermit: {
      sopWorkPermitId: '', // 작업허가서 일련번호
      plantCd: '', // 사업장 코드
      maps: [],
      deleteMaps: []
    },
    supWorks: [],
    isWriting: false
  })
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
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const mapSrc = ref(noImage)
const supplyItems = ref<Array<codeMasterType>>([])
const supplyOriginItems = ref<Array<codeMasterType>>([])
const sopMapId = ref('')
const ratio = ref(1.4)
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.popupParam.supWorks,
  () => {
    setItems()
  },
  { deep: true }
)
watch(sopMapId, () => {
  previewImageParamTask(sopMapId.value, 'WORK_MAP').then((_result) => {
    mapSrc.value = String(_result)
  })
})

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
  listUrl.value = selectConfig.sop.swp.map.recent.url
  // code setting
  getComboItems('SWP_SUPPLEMENT_WORK_TYPE_CD').then((_result) => {
    supplyOriginItems.value = _result
    getComboItems('SOP_PERMIT_TYPE_CD').then((__result) => {
      supplyOriginItems.value = _.concat(supplyOriginItems.value, __result)
      setItems()
    })
  })
  // list setting
}
/******************************
 * TODO (목적): 입력된 허가, 보충작업 정보 setting 및 지도 표시
 *******************************/
function setItems() {
  supplyItems.value = []
  // if (props.popupParam.workPermit.permitTypeCd === 'SPT0000001') {
  //   // 일반 허가서
  //   supplyItems.value = [_.find(supplyOriginItems.value, { code: 'SPT0000001' })]
  // } else {
  //   // 화기 허가서
  //   supplyItems.value = [_.find(supplyOriginItems.value, { code: 'SPT0000005' })]
  // }

  // 정상작업, 긴급작업, 자체작업 등
  if (props.popupParam.workPermit.permitTypeCd) {
    const foundItem = _.find(supplyOriginItems.value, {
      code: props.popupParam.workPermit.permitTypeCd
    })
    if (foundItem) {
      const basicItem = _.cloneDeep(foundItem)
      basicItem.codeName = '메인작업'
      supplyItems.value.push(basicItem)
    }
  }

  if (props.popupParam.supWorks && props.popupParam.supWorks.length > 0) {
    _.forEach(supplyOriginItems.value, (item) => {
      if (
        _.indexOf(props.popupParam.supWorks, item.code) > -1 &&
        _.findIndex(supplyItems.value, { code: item.code }) === -1
      ) {
        supplyItems.value!.push(item)
      }
    })
  }
  datachange()

  if (props.popupParam.workPermit.maps && props.popupParam.workPermit.maps.length > 0) {
    ratio.value = _.clone(props.popupParam.workPermit.maps![0].ratio)
    sopMapId.value = _.clone(props.popupParam.workPermit.maps![0].sopMapId)
  } else {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        useFlag: 'Y',
        plantCd: props.popupParam.workPermit.plantCd,
        workTypeCd: 'WTC0000001'
      }
    }).then((_result: any) => {
      if (_result.data) {
        // 이후에 지도 src 정보도 가져와서 뿌릴 수 있도록 처리
        sopMapId.value = _result.data.sopMapId
        ratio.value = _result.data.ratio
      } else {
        message.alert({
          title: '안내',
          message: '지도정보를 등록 후 이용하시기 바랍니다.',
          type: 'warning' // success / info / warning / error
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 영역 추가
 *******************************/
function addArea() {
  props.popupParam.workPermit.maps!.push({
    sopMapResultId: uid(),
    sopWorkPermitId: props.popupParam.workPermit.sopWorkPermitId, // 작업허가서 일련번호
    sopMapId: sopMapId.value, // 지도 일련번호
    locationXcoordinate: 0, // 작업위치 X좌표
    locationYcoordinate: 0, // 작업위치 Y좌표
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C',
    resultTypes: []
  })
}
/******************************
 * TODO (목적): 영역 이동
 * @param (1): x축
 * @param (2): y축
 * @param (3): 영역 정보
 *******************************/
function onDrag(x: number, y: number, item: workMapResultType) {
  item.locationXcoordinate = x
  item.locationYcoordinate = y

  if (item.editFlag !== 'C') {
    item.editFlag = 'U'
    item.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 허가 & 보충작업 정보 변경
 *******************************/
function datachange() {
  const tempArr = _.cloneDeep(supplyItems.value)
  _.forEach(tempArr, (item) => {
    item.disable = false
  })
  if (props.popupParam.workPermit.maps && props.popupParam.workPermit.maps.length > 0) {
    _.forEach(props.popupParam.workPermit.maps, (point) => {
      if (point.resultTypes && point.resultTypes.length > 0) {
        _.forEach(tempArr, (item) => {
          if (_.findIndex(point.resultTypes, { sopWorkTypeCd: item.code }) > -1) {
            item.disable = true
          }
        })
      }
    })
  }
  supplyItems.value = tempArr
}
/******************************
 * TODO (목적): 영역 제외
 * @param (1): 영역 index
 *******************************/
function removePoint(idx: number) {
  const multiData = props.popupParam.workPermit.maps![idx].resultTypes
  if (multiData && multiData.length > 0) {
    const tempArr = _.cloneDeep(supplyItems.value)
    _.forEach(tempArr, (item) => {
      if (_.findIndex(multiData, { sopWorkTypeCd: item.code }) > -1) {
        item.disable = false
      }
    })
    supplyItems.value = tempArr
  }
  if (!props.popupParam.workPermit.deleteMaps) props.popupParam.workPermit.deleteMaps = []
  if (
    _.findIndex(props.popupParam.workPermit.deleteMaps, {
      sopMapResultId: props.popupParam.workPermit.maps![idx].sopMapResultId
    }) === -1 &&
    props.popupParam.workPermit.maps![idx].editFlag !== 'C'
  ) {
    props.popupParam.workPermit.deleteMaps!.push(props.popupParam.workPermit.maps![idx])
  }

  props.popupParam.workPermit.maps!.splice(idx, 1)
}
/******************************
 * TODO (목적): 지도 팝업 표시
 *******************************/
function selectMap() {
  popupOptions.value.title = '지도 검색'
  popupOptions.value.param = {
    plantCd: props.popupParam.workPermit.plantCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/swp/base/workMapPop.vue`))
  )
  popupOptions.value.width = '70%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeMapPopup
}
/******************************
 * TODO (목적): 지도 팝업 닫기 및 지도 정보 setting
 * @param (1): 지도 정보
 *******************************/
function closeMapPopup(data: Array<workMapType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    ratio.value = data[0].ratio
    previewImage({
      sysAttachFileId: data[0].sysAttachFileId,
      contentType: data[0].contentType
    }).then((_result) => {
      mapSrc.value = String(_result)
    })

    sopMapId.value = data[0].sopMapId
    if (props.popupParam.workPermit.maps && props.popupParam.workPermit.maps.length > 0) {
      _.forEach(props.popupParam.workPermit.maps, (map) => {
        map.sopMapId = data[0].sopMapId
        if (map.editFlag !== 'C') {
          map.editFlag = 'U'
          map.chgUserId = user.value.userId
        }
      })
    }
  }
}
/******************************
 * TODO (목적): 지도 정보 저장
 *******************************/
function saveMapData() {
  message.confirm({
    title: '안내',
    message: '지도 정보를 저장하시겠습니까?',
    type: 'question', // success / info / warning / error / question
    confirmCallback: () => {
      $http({
        url: transactionConfig.swp.workPermit.map.insert.url,
        method: 'POST',
        data: props.popupParam.workPermit
      }).then((_result: any) => {
        message.alert({
          title: '안내',
          message: '지도 정보가 저장되었습니다.',
          type: 'success' // success / info / warning / error
        })
        // props.popupParam.workPermit.maps = _result.data
        datachange()
      })
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="scss">
.noDrag {
  user-select: none;
  -webkit-user-drag: none;
}
</style>

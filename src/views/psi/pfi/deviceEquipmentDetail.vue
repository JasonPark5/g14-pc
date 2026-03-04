<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiDeviceEquipmentId"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="row">
                  <div class="col-1">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정번호"
                      name="revisionNum"
                      v-model:value="deviceEquip.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="deviceEquip.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="deviceEquip.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable && isRevision"
                      :isSubmit="saveCallData"
                      v-model:document="deviceEquip"
                      :documentId="popupParam.psiDeviceEquipmentId"
                      documentTitle="deviceName"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="deviceEquip.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="deviceEquip.revisionContent"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="margin-top: -18px !important;" id="revdiv">
                <c-table
                  ref="revision"
                  title="개정이력"
                  tableId="revision"
                  topBorderClass="topcolor-orange"
                  :columns="gridrev.columns"
                  :data="gridrev.data"
                  gridHeight="150px"
                  :columnSetting="false"
                  :expandAll="false"
                  :isFullScreen="false"
                  :usePaging="false"
                  :hideBottom="true"
                  :filtering="false"
                  @rowClick="rowClickRev"
                >
                </c-table>
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="장치 및 설비 기본정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiDeviceEquipmentId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiDeviceEquipmentId"
                name="selectedPsiDeviceEquipmentId"
                label=""
                v-model:value="selectedPsiDeviceEquipmentId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon
                  name="help"
                  style="font-size: 20px; margin-right: 10px"
                  class="custom-btn text-primary"
                >
                  <q-tooltip
                    anchor="bottom left"
                    self="top right"
                    :offset="[0, 0]"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    <div class="tooltipCustomTop">
                      {{ $language('주석') }}
                    </div>
                    <div class="tooltipCustom">
                      {{
                        $language(
                          '① 압력용기, 증류탑, 반응기, 열교환기, 탱크류 등 고정기계에 해당합니다.'
                        )
                      }}<br />
                      {{
                        $language(
                          '② 부속물은 증류탑의 충진물, 데미스터(Demister), 내부의 지지물 등을 말합니다.'
                        )
                      }}<br />
                      {{ $language('③ 용량에는 장치 및 설비의 직경 및 높이 등을 기재합니다.')
                      }}<br />
                      {{ $language('④ 열교환기류는 동체측과 튜브측을 구별하여 기재합니다.') }}<br />
                      {{
                        $language(
                          '⑤ 자켓이 있는 압력용기류는 동체측과 자켓측을 구별하여 기재합니다.'
                        )
                      }}
                    </div>
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiDeviceEquipmentId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiDeviceEquipmentId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiDeviceEquipmentId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="deviceEquip"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="장치번호"
                  name="equipmentNo"
                  v-model:value="deviceEquip.equipmentNo"
                />
              </div>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="장치명"
                  name="deviceName"
                  v-model:value="deviceEquip.deviceName"
                />
              </div>
              <div class="col-4">
                <c-select
                  :required="true"
                  :editable="editable && !popupParam.psiDeviceEquipmentId"
                  codeGroupCd="DEVICE_TYPE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="deviceTypeCd"
                  label="장치분류"
                  v-model:value="deviceEquip.deviceTypeCd"
                />
              </div>
              <div class="col-3">
                <c-task-target
                  name="equipmentCd"
                  label="설비"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'equip' }"
                  v-model:value="deviceEquip.equipmentCd"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="deviceEquip.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="deviceEquip.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="deviceEquip.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="deviceEquip.deptCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-tab
            type="tabcard"
            align="left"
            :tabItems="tabItems"
            :inlineLabel="true"
            :height="tabHeight"
            v-model:value="tab"
          >
            <template v-slot:default="tab">
              <component
                :is="tab.component"
                :height="tabHeight"
                :contentHeight="tabHeight"
                :key="tab.tabKey"
                :param="tab.param"
                :item="tab.item"
              />
            </template>
          </c-tab>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { deviceEquipType } from '../processSafetyInfo'

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
  name: 'deviceEquipDetail'
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
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    psiDeviceEquipmentId?: stringNull
    psiEquipmentCd?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
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
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      psiDeviceEquipmentId: '',
      psiEquipmentCd: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PSI_DEVICEEQUIPMENT',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const gridrev = ref<gridType>({
  columns: [
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: '개정번호',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'revisionContent',
      field: 'revisionContent',
      label: '개정사유',
      align: 'left',
      sortable: true
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '개정일시',
      style: 'width: 150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '개정자',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    }
  ],
  data: []
})
const deviceEquip = ref<deviceEquipType>({
  psiDeviceEquipmentId: '', // 장치일련번호
  plantCd: '', // 사업장코드
  equipmentNo: '', // 장치번호
  deviceName: '', // 장치명
  equipmentCd: '', // 설비코드
  deviceTypeCd: null, // 장치분류
  deviceTypeName: '', // 장치분류
  processCd: '',
  deptCd: '',
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sopMocId: '',
  detailItems: []
})
const editable = ref(true)
const isSave = ref(false)
const isdelete = ref(false)
const isRevision = ref(false)
const selectedPsiDeviceEquipmentId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.pfi.device.mst.insert.url)
const deleteUrl = ref('')
const revlistUrl = ref('')
const saveCallData = ref('')
const mappingType = ref('POST')
const editForm = ref<any>(null)
const tab = ref('devicePartCd1')
const tabItems = ref<Array<tabItemsType>>([])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 90 + 'px' : '480px'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => deviceEquip.value.deviceTypeCd,
  () => {
    getDetail()
  }
)
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
  detailUrl.value = selectConfig.psi.pfi.device.get.url
  deleteUrl.value = transactionConfig.psi.pfi.device.mst.delete.url
  revlistUrl.value = selectConfig.psi.pfi.device.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 동력기계 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiDeviceEquipmentId) {
    attachInfo.value.taskKey = props.popupParam.psiDeviceEquipmentId
    getDetailData(props.popupParam.psiDeviceEquipmentId, true)
    selectedPsiDeviceEquipmentId.value = props.popupParam.psiDeviceEquipmentId
  } else if (props.popupParam.psiEquipmentCd)
    deviceEquip.value.equipmentCd = props.popupParam.psiEquipmentCd
}
function getDetail() {
  tabItems.value = []
  if (deviceEquip.value.deviceTypeCd === 'DTC0000000') {
    // 장치구분 직접입력의 경우
    if (!deviceEquip.value.detailItems || deviceEquip.value.detailItems.length === 0) {
      deviceEquip.value.detailItems = []
      for (let i = 0; i < 2; i++) {
        deviceEquip.value.detailItems.push({
          psiDeviceEquipmentId: '', // 장치일련번호
          deviceTypeCd: deviceEquip.value.deviceTypeCd, // 장치
          devicePartCd: 'DIR' + (i + 1), // 장치구분
          devicePartName: '', // 장치구분명
          inMaterials: '', // 내용물
          volume: '', // 용량
          pressOperation: '', // 압력(MPa)-운전
          pressDesign: '', // 압력(MPa)-설계
          tempOperation: '', // 온도(℃)-운전
          tempDesign: '', // 온도(℃)-설계
          materialMain: '', // 사용재질-본체
          materialSubPart: '', // 사용재질-부속품
          materialGasket: '', // 사용재질-개스킷
          weldingEfficiency: '', // 용접효율
          calculateThick: '', // 계산두께(mm)
          corrosionAllowance: '', // 부식여유(mm)
          useThick: '', // 사용두께(mm)
          afterHeatTreatYn: 'N', // 후열처리여부
          nondestructMethod: '', // 비파괴검사방법
          nondestructPercent: '', // 비파괴검사율(%)
          applicableLaws: '', // 적용법령
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
        tabItems.value.push({
          name: 'devicePartCd' + (i + 1),
          icon: 'info',
          label: '장치구분' + (i + 1),
          param: {
            deviceTypeCd: 'DTC0000000',
            psiDeviceEquipmentId: props.popupParam.psiDeviceEquipmentId,
            editable: editable.value
          },
          component: markRaw(defineAsyncComponent(() => import(`./deviceEquipmentDetailInfo.vue`))),
          item: deviceEquip.value.detailItems[i],
          tabKey: uid()
        })
      }
    } else {
      let cnt = 0
      _.forEach(deviceEquip.value.detailItems, (item) => {
        const _data = item
        tabItems.value.push({
          name: 'devicePartCd' + (cnt + 1),
          icon: 'info',
          label: '장치구분' + (cnt + 1),
          param: {
            deviceTypeCd: 'DTC0000000',
            psiDeviceEquipmentId: props.popupParam.psiDeviceEquipmentId,
            editable: editable.value
          },
          component: markRaw(defineAsyncComponent(() => import(`./deviceEquipmentDetailInfo.vue`))),
          item: _data,
          tabKey: uid()
        })
        cnt++
      })
    }
  } else {
    getComboItems('DEVICE_PART_CD').then((_result: any) => {
      _result = _.filter(_result, { attrVal1: deviceEquip.value.deviceTypeCd })
      if (deviceEquip.value.detailItems?.length === 0) {
        deviceEquip.value.detailItems = []
        _.forEach(_result, (_item) => {
          deviceEquip.value.detailItems?.push({
            psiDeviceEquipmentId: '', // 장치일련번호
            deviceTypeCd: deviceEquip.value.deviceTypeCd, // 장치
            devicePartName: _item.codeName, // 장치구분명
            devicePartCd: _item.code, // 장치구분
            inMaterials: '', // 내용물
            volume: '', // 용량
            pressOperation: '', // 압력(MPa)-운전
            pressDesign: '', // 압력(MPa)-설계
            tempOperation: '', // 온도(℃)-운전
            tempDesign: '', // 온도(℃)-설계
            materialMain: '', // 사용재질-본체
            materialSubPart: '', // 사용재질-부속품
            materialGasket: '', // 사용재질-개스킷
            weldingEfficiency: '', // 용접효율
            calculateThick: '', // 계산두께(mm)
            corrosionAllowance: '', // 부식여유(mm)
            useThick: '', // 사용두께(mm)
            afterHeatTreatYn: 'N', // 후열처리여부
            nondestructMethod: '', // 비파괴검사방법
            nondestructPercent: '', // 비파괴검사율(%)
            applicableLaws: '', // 적용법령
            regUserId: user.value.userId,
            chgUserId: user.value.userId
          })
        })
      }
      if (_result.length === 1 && deviceEquip.value.detailItems) {
        const _data = deviceEquip.value.detailItems[0]
        tabItems.value.push({
          name: 'devicePartCd1',
          icon: 'info',
          label: '장치 및 설비 상세',
          param: {
            deviceTypeCd: deviceEquip.value.deviceTypeCd,
            psiDeviceEquipmentId: props.popupParam.psiDeviceEquipmentId,
            devicePartCd: _result[0].code,
            editable: editable.value,
            devicePartName: _result[0].codeName
          },
          component: markRaw(defineAsyncComponent(() => import(`./deviceEquipmentDetailInfo.vue`))),
          item: _data,
          tabKey: uid()
        })
      } else {
        let cnt = 0
        _.forEach(_result, (item) => {
          const _data = deviceEquip.value.detailItems ? deviceEquip.value.detailItems[cnt] : {}
          tabItems.value.push({
            name: 'devicePartCd' + (cnt + 1),
            icon: 'info',
            label: item.codeName,
            param: {
              deviceTypeCd: deviceEquip.value.deviceTypeCd,
              psiDeviceEquipmentId: props.popupParam.psiDeviceEquipmentId,
              devicePartCd: item.code,
              editable: editable.value,
              devicePartName: item.codeName
            },
            component: markRaw(
              defineAsyncComponent(() => import(`./deviceEquipmentDetailInfo.vue`))
            ),
            item: _data,
            tabKey: uid()
          })
          cnt++
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 개정 버전에 따른 상세 조회 변경
 *******************************/
function getDetailData(_psiDeviceEquipmentId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiDeviceEquipmentId),
    method: 'GET'
  }).then((_result: any) => {
    deviceEquip.value = _result.data
    deviceEquip.value.regDtStr = deviceEquip.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiDeviceEquipmentId === props.popupParam.psiDeviceEquipmentId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiDeviceEquipmentId) {
    deviceEquip.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    deviceEquip.value.regUserId = user.value.userId
    mappingType.value = 'POST'
  }
  let saveMsg = '저장하시겠습니까?'
  if (isRevision.value) saveMsg = '현재버전을 개정하여 저장하시겠습니까?'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: saveMsg,
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isSave.value = !isSave.value
          isdelete.value = false
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            deviceEquip.value.sysRevision = parseInt(deviceEquip.value.sysRevision) + 1
          }
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.psiDeviceEquipmentId = result.data.psiDeviceEquipmentId
  saveCallData.value = uid()
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data.psiDeviceEquipmentId
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
  if (mappingType.value === 'POST') getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.psiDeviceEquipmentId),
        method: 'DELETE'
      }).then(() => {
        // isdelete.value = !isdelete.value
        // props.popupParam.psiDeviceEquipmentId = null
        // getDetailData(null, false)
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 개정 버전 조회
 *******************************/
function getRevList(_groupId?: string) {
  $http({
    url: revlistUrl.value,
    method: 'GET',
    params: { groupId: _groupId }
  }).then((_result: any) => {
    gridrev.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 개정 버전 추가
 *******************************/
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: deviceEquip.value.revisionNum }
  }).then((_result: any) => {
    deviceEquip.value.revisionNum = _result.data
    deviceEquip.value.revisionContent = ''
    deviceEquip.value.regDtStr = ''
    deviceEquip.value.regUserName = ''
    deviceEquip.value.sopMocId = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.psiDeviceEquipmentId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.psiDeviceEquipmentId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== deviceEquip.value.psiDeviceEquipmentId) {
    selectedPsiDeviceEquipmentId.value = row
    getDetailData(selectedPsiDeviceEquipmentId.value, false)
    attachInfo.value.taskKey = selectedPsiDeviceEquipmentId.value
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

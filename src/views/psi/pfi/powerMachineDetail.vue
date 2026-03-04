<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiPowerEquipmentId"
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
                      v-model:value="powerMachine.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="powerMachine.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="powerMachine.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable && isRevision"
                      :isSubmit="saveCallData"
                      :document="powerMachine"
                      :documentId="popupParam.psiPowerEquipmentId"
                      documentTitle="powerMachineName"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="powerMachine.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="powerMachine.revisionContent"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="margin-top: -18px !important;">
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
          <c-card title="동력기계 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiPowerEquipmentId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiPowerEquipmentId"
                name="selectedPsiPowerEquipmentId"
                label=""
                v-model:value="selectedPsiPowerEquipmentId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon
                  name="help"
                  style="margin: 2px 8px 0 0; font-size: 22px"
                  class="text-primary"
                >
                  <q-tooltip
                    anchor="bottom middle"
                    self="top middle"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    {{
                      $language(
                        `① 방호‧보호장치의 종류에는 법적인 안전/방호장치와 모터보호장치(THT\\R, EOCR, EMPR 등) 등을 기재합니다.`
                      )
                    }}<br />
                    {{ $language('② 비고에는 인버터 또는 기동방식 등을 기재합니다.') }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiPowerEquipmentId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiPowerEquipmentId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiPowerEquipmentId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="powerMachine"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="동력기계번호"
                  name="psiPowerEquipmentNo"
                  v-model:value="powerMachine.psiPowerEquipmentNo"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="동력기계명"
                  name="powerMachineName"
                  v-model:value="powerMachine.powerMachineName"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="powerMachine.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  name="equipmentCd"
                  label="설비"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'equip' }"
                  v-model:value="powerMachine.equipmentCd"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="명세"
                  name="specInfo"
                  :rows="3"
                  v-model:value="powerMachine.specInfo"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="주요재질"
                  name="matQuality"
                  :rows="3"
                  v-model:value="powerMachine.matQuality"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="방호.보호장치의 종류"
                  name="protectType"
                  :rows="3"
                  v-model:value="powerMachine.protectType"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="비고"
                  name="remarks"
                  :rows="3"
                  v-model:value="powerMachine.remarks"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="인입측"
                  name="inFacility"
                  v-model:value="powerMachine.inFacility"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="토출측"
                  name="outFacility"
                  v-model:value="powerMachine.outFacility"
                />
              </div>
              <div class="col-6">
                <c-text
                  suffix="KW"
                  :editable="editable"
                  label="전동기용량(kW)"
                  name="motorVol"
                  v-model:value="powerMachine.motorVol"
                />
              </div>
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="powerMachine.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="powerMachine.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="powerMachine.deptCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-12">
          <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { powerMachineType } from '../processSafetyInfo'

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
  name: 'powerMachineDetail'
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
    psiPowerEquipmentId?: stringNull
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
      psiPowerEquipmentId: '',
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
  taskClassCd: 'PSI_POWERMACHINE',
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
const powerMachine = ref<powerMachineType>({
  plantCd: '', // 사업장코드
  psiPowerEquipmentId: '', // 동력기계일련번호
  psiPowerEquipmentNo: '', // 동력기계번호
  powerMachineName: '', // 동력기계명
  equipmentCd: '', // 설비코드
  specInfo: '', // 명세
  matQuality: '', // 주요재질
  inFacility: '', // 전동기용량(kW)
  outFacility: '', // 전동기용량(kW)
  motorVol: '', // 전동기용량(kW)
  protectType: '', // 방호장치종류
  remarks: '', // 비고
  processCd: '',
  deptCd: '',
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sopMocId: ''
})
const editable = ref(true)
const isSave = ref(false)
const isdelete = ref(false)
const isRevision = ref(false)
const selectedPsiPowerEquipmentId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.pfi.power.insert.url)
const deleteUrl = ref('')
const revlistUrl = ref('')
const saveCallData = ref('')
const mappingType = ref('POST')
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
  detailUrl.value = selectConfig.psi.pfi.power.get.url
  deleteUrl.value = transactionConfig.psi.pfi.power.delete.url
  revlistUrl.value = selectConfig.psi.pfi.power.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 동력기계 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiPowerEquipmentId) {
    attachInfo.value.taskKey = props.popupParam.psiPowerEquipmentId
    getDetail(props.popupParam.psiPowerEquipmentId, true)
    selectedPsiPowerEquipmentId.value = props.popupParam.psiPowerEquipmentId
  } else {
    if (props.popupParam.psiEquipmentCd)
      powerMachine.value.equipmentCd = props.popupParam.psiEquipmentCd
  }
}
function getDetail(_psiPowerEquipmentId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiPowerEquipmentId),
    method: 'GET'
  }).then((_result: any) => {
    powerMachine.value = _result.data
    powerMachine.value.regDtStr = powerMachine.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiPowerEquipmentId === props.popupParam.psiPowerEquipmentId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
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
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiPowerEquipmentId) {
    powerMachine.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    powerMachine.value.regUserId = user.value.userId
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
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            powerMachine.value.sysRevision = parseInt(powerMachine.value.sysRevision) + 1
          }
          isSave.value = !isSave.value
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
  props.popupParam.psiPowerEquipmentId = result.data.psiPowerEquipmentId
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data.psiPowerEquipmentId
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  saveCallData.value = uid()
  getData()
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
        url: $format(deleteUrl.value, props.popupParam.psiPowerEquipmentId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete.value
        props.popupParam.psiPowerEquipmentId = null
        getDetail(null, false)
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 개정 버전 추가
 *******************************/
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: powerMachine.value.revisionNum }
  }).then((_result: any) => {
    powerMachine.value.revisionNum = _result.data
    powerMachine.value.revisionContent = ''
    powerMachine.value.regDtStr = ''
    powerMachine.value.regUserName = ''
    powerMachine.value.sopMocId = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.psiPowerEquipmentId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.psiPowerEquipmentId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== powerMachine.value.psiPowerEquipmentId) {
    selectedPsiPowerEquipmentId.value = row
    getDetail(selectedPsiPowerEquipmentId.value, false)
    attachInfo.value.taskKey = selectedPsiPowerEquipmentId.value
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

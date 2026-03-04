<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiValveRuptureId"
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
                      v-model:value="valve.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="valve.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="valve.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable && isRevision"
                      :isSubmit="saveCallData"
                      :document="valve"
                      :documentId="popupParam.psiValveRuptureId"
                      documentTitle="inMaterial"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="valve.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="valve.revisionContent"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="margin-top: -18px !important" id="revdiv">
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
          <c-card title="안전밸브 및 파열판 기본정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                v-if="popupParam.psiValveRuptureId"
                :editable="!isRevision"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiValveRuptureId"
                name="selectedpsiValveRuptureId"
                label=""
                v-model:value="selectedpsiValveRuptureId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon name="help" color="primary" style="font-size: 20px; margin-right: 10px">
                  <q-tooltip
                    anchor="bottom left"
                    self="top right"
                    :offset="[0, 0]"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    <div class="tooltipCustom">
                      {{
                        $language(
                          '① 배출원인에는 안전밸브의 작동원인(냉각수 차단, 전기공급중단, 화재, 열팽창, 출구차단 등) 중 최대로 배출되는 원인을 기재합니다.'
                        )
                      }}<br />
                      {{
                        $language(
                          '② 형식에는 안전밸브의 형식(일반형, 벨루우즈형, 파일럿 조작형)을 기재합니다'
                        )
                      }}
                    </div>
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiValveRuptureId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiValveRuptureId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiValveRuptureId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="valve"
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
                  label="계기번호"
                  name="valveRuptureNo"
                  v-model:value="valve.valveRuptureNo"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="내용물"
                  name="inMaterial"
                  v-model:value="valve.inMaterial"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="valve.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="상태"
                  name="conditionVal"
                  v-model:value="valve.conditionVal"
                />
              </div>
              <div class="col-3">
                <c-task-target
                  name="equipmentCd"
                  label="설비"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'equip' }"
                  v-model:value="valve.equipmentCd"
                />
              </div>
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="valve.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="valve.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="valve.deptCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="용량 및 노즐크기" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  suffix="kg/hr"
                  :editable="editable"
                  label="배출용량(kg/hr)"
                  name="outVolume"
                  v-model:value="valve.outVolume"
                />
              </div>
              <div class="col-6">
                <c-text
                  suffix="kg/hr"
                  :editable="editable"
                  label="정격용량(kg/hr)"
                  name="regulVolume"
                  v-model:value="valve.regulVolume"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="노즐크기-입구"
                  name="nozzleSizeIn"
                  v-model:value="valve.nozzleSizeIn"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="노즐크기-출구"
                  name="nozzleSizeOut"
                  v-model:value="valve.nozzleSizeOut"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="보호기기 압력" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="기기번호"
                  name="protectSerial"
                  v-model:value="valve.protectSerial"
                />
              </div>
              <div class="col-6">
                <c-text
                  suffix="Mpa"
                  :editable="editable"
                  label="운전(MPa)"
                  name="protectOperation"
                  v-model:value="valve.protectOperation"
                />
              </div>
              <div class="col-6">
                <c-text
                  suffix="Mpa"
                  :editable="editable"
                  label="설정(MPa)"
                  name="protectDesign"
                  v-model:value="valve.protectDesign"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="안전밸브정보" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  suffix="Mpa"
                  :editable="editable"
                  label="설정(MPa)"
                  name="valveSetting"
                  v-model:value="valve.valveSetting"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="몸체재질"
                  name="safetyValveMaterial"
                  v-model:value="valve.safetyValveMaterial"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="Trim재질"
                  name="safetyValveTrim"
                  v-model:value="valve.safetyValveTrim"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="기타 정보" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="정밀도(오차범위)"
                  name="precisionVal"
                  v-model:value="valve.precisionVal"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="배출연결부위"
                  name="outConnect"
                  v-model:value="valve.outConnect"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="배출원인"
                  name="outReason"
                  v-model:value="valve.outReason"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="형식"
                  name="formVal"
                  v-model:value="valve.formVal"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          style="padding-top: 20px !important"
        >
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
import { valveType } from '../processSafetyInfo'

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
  name: 'safetyValveRuptureDiskDetail'
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
    psiValveRuptureId?: stringNull
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
      psiValveRuptureId: '',
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
  taskClassCd: 'PSI_SAFETYVALVERUPTUREDISK',
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
const valve = ref<valveType>({
  psiValveRuptureId: '', // 안전밸브및파열판일련번호
  plantCd: '', // 사업장코드
  valveRuptureNo: '', // 계기번호
  equipmentCd: '', // 설비코드
  inMaterial: '', // 내용물
  conditionVal: '', // 상태
  outVolume: '', // 배출용량(kghr)
  regulVolume: '', // 정격용량(kghr)
  nozzleSizeIn: '', // 노즐크기-입구
  nozzleSizeOut: '', // 노즐크기-출구
  protectSerial: '', // 보호기기압력-기기번호
  protectOperation: '', // 보호기기압력-운전(MPa)
  protectDesign: '', // 보호기기압력-설계(MPa)
  valveSetting: '', // 안전밸브-설정(MPa)
  safetyValveMaterial: '', // 안전밸브-몸체재질
  safetyValveTrim: '', // 안전밸브-Trim재질
  precisionVal: '', // 정밀도(오차범위)
  outConnect: '', // 배출연결부위
  outReason: '', // 배출원인
  formVal: '', // 형식
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
const selectedpsiValveRuptureId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.pfi.valve.insert.url)
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
  detailUrl.value = selectConfig.psi.pfi.valve.get.url
  deleteUrl.value = transactionConfig.psi.pfi.valve.delete.url
  revlistUrl.value = selectConfig.psi.pfi.valve.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 안전밸브 및 파열판 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiValveRuptureId) {
    attachInfo.value.taskKey = props.popupParam.psiValveRuptureId
    getDetail(props.popupParam.psiValveRuptureId, true)
    selectedpsiValveRuptureId.value = props.popupParam.psiValveRuptureId
  } else {
    if (props.popupParam.psiEquipmentCd) valve.value.equipmentCd = props.popupParam.psiEquipmentCd
  }
}
function getDetail(_psiValveRuptureId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiValveRuptureId),
    method: 'GET'
  }).then((_result: any) => {
    valve.value = _result.data
    valve.value.regDtStr = valve.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiValveRuptureId === props.popupParam.psiValveRuptureId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiValveRuptureId) {
    valve.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    valve.value.regUserId = user.value.userId
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
            valve.value.sysRevision = parseInt(valve.value.sysRevision) + 1
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
  props.popupParam.psiValveRuptureId = result.data.psiValveRuptureId
  saveCallData.value = uid()
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data.psiValveRuptureId
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
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
        url: $format(deleteUrl.value, props.popupParam.psiValveRuptureId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete.value
        props.popupParam.psiValveRuptureId = null
        getDetail(null, false)
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
    params: { revisionNum: valve.value.revisionNum }
  }).then((_result: any) => {
    valve.value.revisionNum = _result.data
    valve.value.revisionContent = ''
    valve.value.regDtStr = ''
    valve.value.regUserName = ''
    valve.value.sopMocId = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.psiValveRuptureId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.psiValveRuptureId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== valve.value.psiValveRuptureId) {
    selectedpsiValveRuptureId.value = row
    getDetail(selectedpsiValveRuptureId.value, false)
    attachInfo.value.taskKey = selectedpsiValveRuptureId.value
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

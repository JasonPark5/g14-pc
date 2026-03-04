<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiGasAlarmId"
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
                      v-model:value="gasLeak.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="gasLeak.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="gasLeak.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="gasLeak"
                      :documentId="gasLeak.psiGasAlarmId"
                      documentTitle="sensingObject"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="gasLeak.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="gasLeak.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="가스누출감지 경보기 설치 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                v-if="popupParam.psiGasAlarmId"
                :editable="!isRevision"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiGasAlarmId"
                name="selectedpsiGasAlarmId"
                label=""
                v-model:value="selectedpsiGasAlarmId"
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
                    {{ $language('① 감지대상은 감지하고자 하는 물질을 기재합니다.') }}<br />
                    {{
                      $language(
                        '② 설치장소는 구체적인 화학설비 및 부속설비의 주변 등으로 구체적으로 기재합니다.'
                      )
                    }}<br />
                    {{
                      $language(
                        '③ 경보설정치는 폭발하한계(LEL)의 25% 이하, 허용농도 이하 등으로 기재합니다.'
                      )
                    }}<br />
                    {{
                      $language(
                        '④ 경보시 조치내용은 경보가 발생할 경우 근로자의 조치내용을 기재합니다.'
                      )
                    }}<br />
                    {{ $language('⑤ 유지관리에는 교정 주기 등을 기재합니다.') }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiGasAlarmId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiGasAlarmId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiGasAlarmId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="gasLeak"
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
                  label="가스감지기NO"
                  name="gasDetectorNo"
                  v-model:value="gasLeak.gasDetectorNo"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="감지대상"
                  name="sensingObject"
                  v-model:value="gasLeak.sensingObject"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="설치장소"
                  name="installLocation"
                  v-model:value="gasLeak.installLocation"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="gasLeak.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="gasLeak.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="gasLeak.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="gasLeak.deptCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="작동시간"
                  name="operationTime"
                  v-model:value="gasLeak.operationTime"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="측정방식"
                  name="detectMethod"
                  v-model:value="gasLeak.detectMethod"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="경보설정값-high"
                  name="alarmHighValue"
                  v-model:value="gasLeak.alarmHighValue"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="경보설정값-highhigh"
                  name="alarmHighhighValue"
                  v-model:value="gasLeak.alarmHighhighValue"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="경보기설치위치"
                  name="alarmSettingLocation"
                  v-model:value="gasLeak.alarmSettingLocation"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="정밀도"
                  name="precisionVal"
                  v-model:value="gasLeak.precisionVal"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="조치내용"
                  name="measureInfo"
                  v-model:value="gasLeak.measureInfo"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="유지관리"
                  name="management"
                  v-model:value="gasLeak.management"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="비고"
                  name="remark"
                  v-model:value="gasLeak.remark"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { gasLeakType } from '@/views/psi/processSafetyInfo'

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
  name: 'gasLeakDetectionAlarmInfoDetail'
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
    psiGasAlarmId?: stringNull
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

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      psiGasAlarmId: ''
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
const gasLeak = ref<gasLeakType>({
  psiGasAlarmId: '', // 가스누출감지경보기 일련번호
  plantCd: '', // 사업장코드
  gasDetectorNo: '', // 가스감지기NO
  sensingObject: '', // 감지대상
  installLocation: '', // 설치장소
  operationTime: '', // 작동시간
  detectMethod: '', // 측정방식
  alarmHighValue: '', // 경보설정값-high
  alarmHighhighValue: '', // 경보설정값-highhigh
  alarmSettingLocation: '', // 경보기설치위치
  precisionVal: '', // 정밀도
  measureInfo: '', // 조치내용
  management: '', // 유지관리
  remark: '', // 비고
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
const selectedpsiGasAlarmId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.lbe.gasalarm.insert.url)
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
  detailUrl.value = selectConfig.psi.lbe.gasalarm.get.url
  deleteUrl.value = transactionConfig.psi.lbe.gasalarm.delete.url
  revlistUrl.value = selectConfig.psi.lbe.gasalarm.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 동력기계 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiGasAlarmId) {
    getDetail(props.popupParam.psiGasAlarmId, true)
    selectedpsiGasAlarmId.value = props.popupParam.psiGasAlarmId
  }
}
function getDetail(_psiGasAlarmId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiGasAlarmId),
    method: 'GET'
  }).then((_result: any) => {
    gasLeak.value = _result.data
    gasLeak.value.regDtStr = gasLeak.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiGasAlarmId === props.popupParam.psiGasAlarmId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiGasAlarmId) {
    gasLeak.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    gasLeak.value.regUserId = user.value.userId
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
            gasLeak.value.sysRevision = parseInt(gasLeak.value.sysRevision) + 1
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
  props.popupParam.psiGasAlarmId = result.data.psiGasAlarmId
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
        url: $format(deleteUrl.value, props.popupParam.psiGasAlarmId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete.value
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
    params: { revisionNum: gasLeak.value.revisionNum }
  }).then((_result: any) => {
    gasLeak.value.revisionNum = _result.data
    gasLeak.value.revisionContent = ''
    gasLeak.value.regDtStr = ''
    gasLeak.value.regUserName = ''
    gasLeak.value.sopMocId = ''
    isRevision.value = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row) {
    selectedpsiGasAlarmId.value = row
    if (selectedpsiGasAlarmId.value !== gasLeak.value.psiGasAlarmId)
      getDetail(selectedpsiGasAlarmId.value, false)
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

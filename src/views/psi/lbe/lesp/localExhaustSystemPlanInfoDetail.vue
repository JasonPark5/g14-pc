<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiLocalVentilationId"
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
                      v-model:value="exhaust.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="exhaust.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="exhaust.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="exhaust"
                      :documentId="exhaust.psiLocalVentilationId"
                      documentTitle="processName"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="exhaust.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="exhaust.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="국소배기장치 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiLocalVentilationId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiLocalVentilationId"
                name="selectedpsiLocalVentilationId"
                label=""
                v-model:value="selectedpsiLocalVentilationId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && popupParam.psiLocalVentilationId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiLocalVentilationId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiLocalVentilationId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="exhaust"
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
                  label="공정 또는 작업장명"
                  name="processName"
                  v-model:value="exhaust.processName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="실내외구분"
                  name="inOutFlag"
                  v-model:value="exhaust.inOutFlag"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="exhaust.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="exhaust.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="exhaust.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="exhaust.deptCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="발생원"
                  name="sourceName"
                  v-model:value="exhaust.sourceName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="유해물질종류"
                  name="harmfulTypeCd"
                  v-model:value="exhaust.harmfulTypeCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="후드형식"
                  name="hoodForm"
                  v-model:value="exhaust.hoodForm"
                />
              </div>
              <div class="col-3">
                <c-text
                  suffix="m/s"
                  :editable="editable"
                  label="후드의제어풍속(m/s)"
                  name="hoodVelocity"
                  v-model:value="exhaust.hoodVelocity"
                />
              </div>
              <div class="col-3">
                <c-text
                  suffix="m/s"
                  :editable="editable"
                  label="덕트내반응속도(m/s)"
                  name="reactionVelocity"
                  v-model:value="exhaust.reactionVelocity"
                />
              </div>
              <div class="col-3">
                <c-text
                  suffix="㎥/min"
                  :editable="editable"
                  label="배풍량(㎥/min)"
                  name="airVolume"
                  v-model:value="exhaust.airVolume"
                />
              </div>
              <div class="col-3">
                <c-text
                  suffix="Kw"
                  :editable="editable"
                  label="전동기용량(kW)"
                  name="motorVolume"
                  v-model:value="exhaust.motorVolume"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="전동기방폭형식"
                  name="motorExplosionForm"
                  v-model:value="exhaust.motorExplosionForm"
                />
              </div>
              <div class="col-9" />
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="공기정화장치형식"
                  name="airCleanType"
                  v-model:value="exhaust.airCleanType"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="배기 및 처리순서"
                  name="airExhaustOrder"
                  v-model:value="exhaust.airExhaustOrder"
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
import { exhaustType } from '@/views/psi/processSafetyInfo'

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
  name: 'localExhaustSystemPlanInfoDetail'
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
    psiLocalVentilationId?: stringNull
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
      psiLocalVentilationId: ''
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
const exhaust = ref<exhaustType>({
  psiLocalVentilationId: '', // 국소배기장치 일련번호
  plantCd: '', // 사업장코드
  processName: '', // 공정또는작업장명
  inOutFlag: '', // 실내외구분
  sourceName: '', // 발생원
  harmfulTypeCd: '', // 유해물질종류
  hoodForm: '', // 후드형식
  hoodVelocity: '', // 후드의제어풍속
  reactionVelocity: '', // 덕트내반응속도
  airVolume: '', // 배풍량
  motorVolume: '', // 전동기용량
  motorExplosionForm: '', // 전동기방폭형식
  airCleanType: '', // 공기정화장치형식
  airExhaustOrder: '', // 배기 및 처리순서
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
const selectedpsiLocalVentilationId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.lbe.localven.insert.url)
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
  detailUrl.value = selectConfig.psi.lbe.localven.get.url
  deleteUrl.value = transactionConfig.psi.lbe.localven.delete.url
  revlistUrl.value = selectConfig.psi.lbe.localven.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 동력기계 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiLocalVentilationId) {
    getDetail(props.popupParam.psiLocalVentilationId, true)
    selectedpsiLocalVentilationId.value = props.popupParam.psiLocalVentilationId
  }
}
function getDetail(_psiLocalVentilationId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiLocalVentilationId),
    method: 'GET'
  }).then((_result: any) => {
    exhaust.value = _result.data
    exhaust.value.regDtStr = exhaust.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiLocalVentilationId === props.popupParam.psiLocalVentilationId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiLocalVentilationId) {
    exhaust.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    exhaust.value.regUserId = user.value.userId
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
            exhaust.value.sysRevision = parseInt(exhaust.value.sysRevision) + 1
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
  props.popupParam.psiLocalVentilationId = result.data.psiLocalVentilationId
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
        url: $format(deleteUrl.value, props.popupParam.psiLocalVentilationId),
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
    params: { revisionNum: exhaust.value.revisionNum }
  }).then((_result: any) => {
    exhaust.value.revisionNum = _result.data
    exhaust.value.revisionContent = ''
    exhaust.value.regDtStr = ''
    exhaust.value.regUserName = ''
    exhaust.value.sopMocId = ''
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
  if (row && row !== exhaust.value.psiLocalVentilationId) {
    selectedpsiLocalVentilationId.value = row
    getDetail(selectedpsiLocalVentilationId.value, false)
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

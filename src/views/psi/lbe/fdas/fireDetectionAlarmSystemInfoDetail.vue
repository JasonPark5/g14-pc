<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            v-if="popupParam.fireDetectionId"
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
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
                      v-model:value="fireDetector.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="fireDetector.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="fireDetector.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="fireDetector"
                      :documentId="fireDetector.fireDetectionId"
                      documentTitle="installLocation"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="fireDetector.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="fireDetector.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="화재탐지 및 경보설비 설치계획 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                v-if="popupParam.fireDetectionId"
                :editable="!isRevision"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="fireDetectionId"
                name="selectedfireDetectionId"
                label=""
                v-model:value="selectedfireDetectionId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon name="help" style="font-size: 20px; margin-right: 8px" class="text-primary">
                  <q-tooltip
                    anchor="bottom left"
                    self="top right"
                    :offset="[0, 0]"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    {{
                      $language(
                        '① ｢소방시설 설치･유지 및 안전관리에 관한 법률 시행령｣ 별표 1 및 ｢위험물안전관리법 시행규칙｣ 별표 17에 따라 분말소화설비 등 다른 형태의 소화설비를 추가하여 기재합니다.'
                      )
                    }}<br />
                    {{
                      $language('② 이 서식 대신 “소방시설등(기준･일람)산출표”를 사용할 수 있습니다')
                    }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.fireDetectionId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.fireDetectionId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.fireDetectionId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="fireDetector"
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
                  label="설치지역"
                  name="installLocation"
                  v-model:value="fireDetector.installLocation"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="fireDetector.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="fireDetector.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="fireDetector.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="fireDetector.deptCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="단독경보형감지기"
                  name="singleAlarm"
                  v-model:value="fireDetector.singleAlarm"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="비상경보설비"
                  name="emergencyAlarm"
                  v-model:value="fireDetector.emergencyAlarm"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="시작경보기"
                  name="startAlarm"
                  v-model:value="fireDetector.startAlarm"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="자동화재탐지설비"
                  name="autoDetection"
                  v-model:value="fireDetector.autoDetection"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="비상방송설비"
                  name="emergencyBroadcast"
                  v-model:value="fireDetector.emergencyBroadcast"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="자동화재속보설비"
                  name="autoBreakingnews"
                  v-model:value="fireDetector.autoBreakingnews"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="통합감시시설"
                  name="integrationSystem"
                  v-model:value="fireDetector.integrationSystem"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="누전경보기"
                  name="shortAlarm"
                  v-model:value="fireDetector.shortAlarm"
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
import { fireDetectorType } from '@/views/psi/processSafetyInfo'

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
  name: 'fireDetectionAlarmSystemInfoDetail'
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
    fireDetectionId?: stringNull
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
      fireDetectionId: ''
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
const fireDetector = ref<fireDetectorType>({
  fireDetectionId: '', // 화재탐지및경보설비 일련번호
  plantCd: '', // 사업장코드
  installLocation: '', // 설치지역
  singleAlarm: '', // 단독경보형감지기
  emergencyAlarm: '', // 비상경보설비
  startAlarm: '', // 시작경보기
  autoDetection: '', // 자동화재탐지설비
  emergencyBroadcast: '', // 비상방송설비
  autoBreakingnews: '', // 자동화재속보설비
  integrationSystem: '', // 통합감시시설
  shortAlarm: '', // 누전경보기
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
const selectedfireDetectionId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.lbe.firedetect.insert.url)
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
  detailUrl.value = selectConfig.psi.lbe.firedetect.get.url
  deleteUrl.value = transactionConfig.psi.lbe.firedetect.delete.url
  revlistUrl.value = selectConfig.psi.lbe.firedetect.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 동력기계 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.fireDetectionId) {
    getDetail(props.popupParam.fireDetectionId, true)
    selectedfireDetectionId.value = props.popupParam.fireDetectionId
  }
}
function getDetail(_fireDetectionId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _fireDetectionId),
    method: 'GET'
  }).then((_result: any) => {
    fireDetector.value = _result.data
    fireDetector.value.regDtStr = fireDetector.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.fireDetectionId === props.popupParam.fireDetectionId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.fireDetectionId) {
    fireDetector.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    fireDetector.value.regUserId = user.value.userId
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
            fireDetector.value.sysRevision = parseInt(fireDetector.value.sysRevision) + 1
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
  props.popupParam.fireDetectionId = result.data.fireDetectionId
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
        url: $format(deleteUrl.value, props.popupParam.fireDetectionId),
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
    params: { revisionNum: fireDetector.value.revisionNum }
  }).then((_result: any) => {
    fireDetector.value.revisionNum = _result.data
    fireDetector.value.revisionContent = ''
    fireDetector.value.regDtStr = ''
    fireDetector.value.regUserName = ''
    fireDetector.value.sopMocId = ''
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
    selectedfireDetectionId.value = row
    if (selectedfireDetectionId.value != fireDetector.value.fireDetectionId) {
      getDetail(selectedfireDetectionId.value, false)
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.fireEquipmentId"
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
                      v-model:value="fireExtinguisher.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="fireExtinguisher.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="fireExtinguisher.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="fireExtinguisher"
                      :documentId="fireExtinguisher.fireEquipmentId"
                      documentTitle="installLocation"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="fireExtinguisher.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="fireExtinguisher.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="소화설비설치계획 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.fireEquipmentId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="fireEquipmentId"
                name="selectedfireEquipmentId"
                label=""
                v-model:value="selectedfireEquipmentId"
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
                    {{ $language('① 설치지역별로 소화기 등 소화설비의 설치개수를 기재합니다.')
                    }}<br />
                    {{
                      $language(
                        '② 스프링클러 등 수계소화설비는 Deluge(딜루지) 밸브 등의 설치개수를 기재합니다.'
                      )
                    }}<br />
                    {{
                      $language(
                        '③ CO2 소화설비 등 가스계소화설비는 기동용기 등의 설치개수를 기재합니다.'
                      )
                    }}<br />
                    {{
                      $language(
                        '④ ｢소방시설 설치･유지 및 안전관리에 관한 법률 시행령｣ 별표 1 및 ｢위험물안전관리법 시행규칙｣ 별표 17에 따라 분말소화설비 등 다른 형태의 소화설비를 추가하여 기재합니다.'
                      )
                    }}<br />
                    {{
                      $language(
                        '⑤ 이 서식 대신 “소방시설등(기준･일람)산출표”를 사용할 수 있습니다.'
                      )
                    }}<br />
                    {{ $language('※ 소화설비 용량산출 근거, 설계기준, 소화설비 계통도 등 제출') }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.fireEquipmentId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.fireEquipmentId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.fireEquipmentId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="fireExtinguisher"
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
                  v-model:value="fireExtinguisher.installLocation"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="fireExtinguisher.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="fireExtinguisher.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="fireExtinguisher.deptCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="소화기"
                  name="fireExtinguisher"
                  v-model:value="fireExtinguisher.fireExtinguisher"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="자동확산소화기"
                  name="autoSpreadFire"
                  v-model:value="fireExtinguisher.autoSpreadFire"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="자동소화장치"
                  name="autoFire"
                  v-model:value="fireExtinguisher.autoFire"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="옥내소화전"
                  name="standPipe"
                  v-model:value="fireExtinguisher.standPipe"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="스프링쿨러"
                  name="sprinkler"
                  v-model:value="fireExtinguisher.sprinkler"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="물분부소화설비"
                  name="waterSpray"
                  v-model:value="fireExtinguisher.waterSpray"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="포소화설비"
                  name="poSpray"
                  v-model:value="fireExtinguisher.poSpray"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="CO2소화설비"
                  name="co2Spray"
                  v-model:value="fireExtinguisher.co2Spray"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="할로겐화합물소화설비"
                  name="halogenSpray"
                  v-model:value="fireExtinguisher.halogenSpray"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="청정소화약제소화설비"
                  name="cleanSpray"
                  v-model:value="fireExtinguisher.cleanSpray"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="옥외소화전"
                  name="outdoorPipe"
                  v-model:value="fireExtinguisher.outdoorPipe"
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
import { fireExtinguisherType } from '@/views/psi/processSafetyInfo'

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
  name: 'firefightingEquipmentInfoDetail'
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
    fireEquipmentId?: stringNull
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
      fireEquipmentId: ''
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
const fireExtinguisher = ref<fireExtinguisherType>({
  fireEquipmentId: '', // 소화설비설치계획 일련번호
  plantCd: '', // 사업장코드
  installLocation: '', // 설치지역
  fireExtinguisher: '', // 소화기
  autoSpreadFire: '', // 자동확산소화기
  autoFire: '', // 자동소화장치
  standPipe: '', // 옥내소화전
  sprinkler: '', // 스프링쿨러
  waterSpray: '', // 물분부소화설비
  poSpray: '', // 포소화설비
  co2Spray: '', // CO2소화설비
  halogenSpray: '', // 할로겐화합물소화설비
  cleanSpray: '', // 청정소화약제소화설비
  outdoorPipe: '', // 옥외소화전
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
const selectedfireEquipmentId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.lbe.fireequip.insert.url)
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
  detailUrl.value = selectConfig.psi.lbe.fireequip.get.url
  deleteUrl.value = transactionConfig.psi.lbe.fireequip.delete.url
  revlistUrl.value = selectConfig.psi.lbe.fireequip.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 내화구조설비 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.fireEquipmentId) {
    getDetail(props.popupParam.fireEquipmentId, true)
    selectedfireEquipmentId.value = props.popupParam.fireEquipmentId
  }
}
function getDetail(_fireEquipmentId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _fireEquipmentId),
    method: 'GET'
  }).then((_result: any) => {
    fireExtinguisher.value = _result.data
    fireExtinguisher.value.regDtStr = fireExtinguisher.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.fireEquipmentId === props.popupParam.fireEquipmentId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.fireEquipmentId) {
    fireExtinguisher.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    fireExtinguisher.value.regUserId = user.value.userId
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
            fireExtinguisher.value.sysRevision = parseInt(fireExtinguisher.value.sysRevision) + 1
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
  props.popupParam.fireEquipmentId = result.data.fireEquipmentId
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
        url: $format(deleteUrl.value, props.popupParam.fireEquipmentId),
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
    params: { revisionNum: fireExtinguisher.value.revisionNum }
  }).then((_result: any) => {
    fireExtinguisher.value.revisionNum = _result.data
    fireExtinguisher.value.revisionContent = ''
    fireExtinguisher.value.regDtStr = ''
    fireExtinguisher.value.regUserName = ''
    fireExtinguisher.value.sopMocId = ''
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
    selectedfireEquipmentId.value = row
    if (selectedfireEquipmentId.value !== fireExtinguisher.value.fireEquipmentId) {
      getDetail(selectedfireEquipmentId.value, false)
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

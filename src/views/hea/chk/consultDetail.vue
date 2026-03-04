<template>
  <div>
    <q-form ref="editForm">
      <c-card title="상담 내용" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="isOld && editable"
              label="삭제"
              icon="remove"
              @btnClicked="removeConsult"
            />
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="conData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveConsult"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div
            :class="
              isSuspect
                ? 'col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4'
                : 'col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
            "
          >
            <c-field
              required
              type="detail_user"
              :editable="editable"
              label="부서/사번/성함"
              name="userId"
              v-model:value="conData.userId"
              @userInfo="userInfo"
            />
          </div>
          <div v-if="isSuspect" class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-btn
              label="유소견자 검진상세"
              icon="search"
              class="q-mt-lg"
              @btnClicked="linkClick"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              required
              :editable="editable"
              codeGroupCd="SUSPECT_CONSULT_TYPE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              label="상담구분"
              name="consultTypeCd"
              v-model:value="conData.consultTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              required
              :editable="editable"
              label="상담일"
              name="consultDate"
              default="today"
              v-model:value="conData.consultDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              label="상담자"
              :editable="editable"
              name="counselorName"
              v-model:value="conData.counselorName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              label="흡연"
              name="smoking"
              v-model:value="conData.smoking"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              label="음주"
              name="drinking"
              v-model:value="conData.drinking"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="운동"
              name="exercise"
              v-model:value="conData.exercise"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="가족력"
              name="consultContent"
              v-model:value="conData.consultContent"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              label="소견"
              :editable="editable"
              name="symptom"
              :rows="2"
              v-model:value="conData.symptom"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              label="현병력/복용 약물"
              :editable="editable"
              name="diseasePast"
              :rows="2"
              v-model:value="conData.diseasePast"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              required
              label="상담내용"
              :editable="editable"
              :rows="2"
              name="diseaseCurrent"
              v-model:value="conData.diseaseCurrent"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              label="기타 특이사항"
              :editable="editable"
              :rows="2"
              name="remark"
              v-model:value="conData.remark"
            />
          </div>
        </template>
      </c-card>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="간이검사결과" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="혈압(수축기)"
                name="systole"
                v-model:value="conData.systole"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="혈압(이완기)"
                name="diastole"
                v-model:value="conData.diastole"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="혈당"
                name="bloodSugar"
                v-model:value="conData.bloodSugar"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="당화혈색소"
                name="glycatedHemoglobin"
                v-model:value="conData.glycatedHemoglobin"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="간수치(OT)"
                name="liverOt"
                v-model:value="conData.liverOt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="간수치(PT)"
                name="liverPt"
                v-model:value="conData.liverPt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="악력(좌)"
                name="gripStrengthLeft"
                v-model:value="conData.gripStrengthLeft"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="악력(우)"
                name="gripStrengthRight"
                v-model:value="conData.gripStrengthRight"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="소변검사결과"
                name="peeCheckResult"
                v-model:value="conData.peeCheckResult"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="이상지질혈증(총콜레스테롤)"
                name="totalCholesterol"
                v-model:value="conData.totalCholesterol"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="이상지질혈증(LDL콜레스테롤)"
                name="ldlCholesterol"
                v-model:value="conData.ldlCholesterol"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="이상지질혈증(HDL콜레스테롤)"
                name="hdlCholesterol"
                v-model:value="conData.hdlCholesterol"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="중성지방"
                name="neutralFat"
                v-model:value="conData.neutralFat"
              />
            </div>
          </template>
        </c-card>
        <c-upload :attachInfo="attachInfo" :editable="editable" label="관련 파일" />
      </div>
    </q-form>
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
import { consultHistoryDataType } from './consultType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'consultDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    suspectConsultId: string
    heaBrainCardiovascularSurveyId: string
    suspectId: string
    userId: string
  }
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
      suspectConsultId: '',
      heaBrainCardiovascularSurveyId: '',
      suspectId: '',
      userId: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(false)
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'HEA_USER_CONSULT',
  taskKey: ''
})
const editForm = ref<HTMLFormElement | null>(null)
const conData = ref<consultHistoryDataType>({
  suspectConsultId: '',
  suspectId: '',
  heaBrainCardiovascularSurveyId: '',
  suspectUserId: '',
  consultContent: '',
  consultDate: '',
  diseasePast: '',
  diseaseCurrent: '',
  symptom: '',
  remark: '',
  consultTypeCd: null,
  counselorName: '',
  glycatedHemoglobin: '',
  liverOt: '',
  liverPt: '',
  gripStrengthLeft: '',
  gripStrengthRight: '',
  peeCheckResult: '',
  ldlCholesterol: '',
  hdlCholesterol: '',
  neutralFat: '',
  smoking: '',
  drinking: '',
  exercise: '',
  bloodSugar: '',
  totalCholesterol: '',
  diastole: '',
  systole: '',
  regUserId: '',
  chgUserId: '',
  deptCd: '',
  userId: '',
  heaCheckupResultId: null
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.suspectConsultId))
const isSuspect = computed(() => Boolean(conData.value.heaCheckupResultId))

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
  detailUrl.value = selectConfig.hea.checkup.suspect.consult.get.url
  saveUrl.value = transactionConfig.hea.checkup.suspect.consult.insert.url
  // insertUrl.value = transactionConfig.hea.checkup.suspect.consult.insert.url
  // updateUrl.value = transactionConfig.hea.checkup.suspect.consult.update.url
  deleteUrl.value = transactionConfig.hea.checkup.suspect.consult.delete.url
  // code setting
  if (props.popupParam.suspectId) {
    conData.value.suspectId = props.popupParam.suspectId
    conData.value.consultTypeCd = 'SCT0000002'
    conData.value.userId = props.popupParam.userId
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.suspectConsultId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.suspectConsultId),
      method: 'GET'
    }).then((_result: any) => {
      conData.value = _.clone(_result.data)
      attachInfo.value.taskKey = props.popupParam.suspectConsultId
      emits('setRegInfo', _result.data)
    })
  }
}
/******************************
 * TODO (목적): 입력 값 저장
 *******************************/
function saveConsult() {
  if (props.popupParam.suspectConsultId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.hea.checkup.suspect.consult.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.hea.checkup.suspect.consult.insert.url
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          conData.value.regUserId = user.value.userId
          conData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 입력 값 저장 완료 후 동작
 * @param (1): 저장 완료 결과 값
 *******************************/
function saveCallback(result: object | any) {
  message.requestSuccess()
  props.popupParam.suspectConsultId = result.data
  attachInfo.value.taskKey = props.popupParam.suspectConsultId
  attachInfo.value.isSubmit = props.popupParam.suspectConsultId
  getDetail()
}
/******************************
 * TODO (목적): 정보 삭제
 *******************************/
function removeConsult() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.suspectConsultId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
function userInfo() {
  $http({
    url: selectConfig.hea.checkup.opinion.list.url,
    method: 'GET',
    params: {
      suspectFlag: 'Y',
      userId: conData.value.userId
    }
  }).then((_result: any) => {
    conData.value.heaCheckupResultId = _result.data ? _result.data[0].heaCheckupResultId : null
    conData.value.consultTypeCd = _result.data ? 'SCT0000002' : null
  })
}
function linkClick() {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./checkUpResultDetail.vue`))
  )
  popupOptions.value.title = '유소견자 건강진단 결과 상세'
  popupOptions.value.isFull = true
  popupOptions.value.param = { heaCheckupResultId: conData.value.heaCheckupResultId }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

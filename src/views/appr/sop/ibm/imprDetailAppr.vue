<template>
  <div class="row">
    <div class="col-12">
      <c-step
        stepperGrpCd="IBM_STEP_CD"
        :currentStepCd="impr.ibmStepCd"
        :disabled="true"
        v-model:value="impr.ibmStepCd"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
      <div class="row">
        <div class="col-12">
          <q-form ref="editForm1">
            <c-card title="요청&접수 상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <component
                    :is="relationTableInfo.component"
                    :key="relationTableInfo.key"
                    :taskParam="relationTableInfo.taskParam"
                    :disabled="!Boolean(popupParam.sopImprovementId)"
                  />
                  <c-btn
                    v-show="requestBtnEditable"
                    :isSubmit="isRequest"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="조치부서에 요청"
                    icon="send"
                    @beforeAction="requestImpr"
                    @btnCallback="requestCallback"
                  />
                  <c-btn
                    v-show="receiptBtnEditable"
                    :isSubmit="isReceipt"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="접수"
                    icon="directions_run"
                    @beforeAction="receiptImpr"
                    @btnCallback="receiptCallback"
                  />
                  <c-btn
                    v-show="saveBtnEditable1"
                    :isSubmit="isSaveRequestReceipt"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveRequestReceiptImpr"
                    @btnCallback="saveRequestReceiptCallback"
                  />
                  <c-btn
                    v-show="requestCancelBtnEditable"
                    :isSubmit="isReject"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="요청취소"
                    icon="delete_forever"
                    @beforeAction="rejectImpr"
                    @btnCallback="rejectCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-select
                    :disabled="true"
                    :editable="editable"
                    codeGroupCd="IBM_TASK_TYPE_CD"
                    type="edit"
                    itemText="codeName"
                    itemValue="code"
                    name="ibmTaskTypeCd"
                    label="업무"
                    v-model:value="impr.ibmTaskTypeCd"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-text
                    :disabled="true"
                    :editable="editable"
                    name="sopImprovementId"
                    label="개선번호"
                    v-model:value="impr.sopImprovementId"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-text
                    :editable="editable"
                    :disabled="true"
                    label="요청부서/이름/요청일"
                    name="request"
                    v-model:value="request"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-text
                    :editable="requestAreaEditable"
                    label="관련공사"
                    name="sopConstructionId"
                    v-model:value="impr.sopConstructionId"
                  />
                </div>
                <div class="col-12">
                  <c-text
                    :editable="requestAreaEditable"
                    :required="true"
                    label="제목"
                    name="ibmTitle"
                    v-model:value="impr.ibmTitle"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="requestAreaEditable"
                    :required="true"
                    autogrow
                    label="요청내용"
                    name="improveRequestContents"
                    v-model:value="impr.improveRequestContents"
                  />
                </div>
                <!-- <div class="col-8">
                  <c-plant
                    :editable="requestAreaEditable"
                    :required="true"
                    type="edit"
                    name="plantCd"
                    v-model:value="impr.plantCd"
                  />
                </div> -->
                <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                  <c-checkbox
                    :editable="requestAreaEditable"
                    :isFlag="true"
                    trueLabel="업체"
                    falseLabel="부서"
                    trueValue="V"
                    falseValue="D"
                    label="조치주체"
                    name="actionFlag"
                    v-model:value="impr.actionFlag"
                    @datachange="changeAction"
                  />
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <c-dept
                    v-show="impr.actionFlag === 'D'"
                    :editable="requestAreaEditable || actionReceiptAreaEditable"
                    :required="impr.actionFlag === 'D'"
                    :searchFlag="actionReceiptAreaEditable ? false : true"
                    :closeFlag="actionReceiptAreaEditable ? false : true"
                    type="edit"
                    label="조치부서"
                    name="actionDeptCd"
                    v-model:value="impr.actionDeptCd"
                  >
                    <template v-slot:custom-btn-icon>
                      <q-icon
                        v-if="actionReceiptAreaEditable"
                        name="autorenew"
                        @click="changeActionDeptImpr"
                        class="cursor-pointer"
                      >
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          <strong>{{ $language('부서변경') }}</strong>
                        </q-tooltip>
                      </q-icon>
                    </template>
                  </c-dept>
                  <c-task-target
                    v-show="impr.actionFlag === 'V'"
                    :editable="requestAreaEditable || actionReceiptAreaEditable"
                    :required="impr.actionFlag === 'V'"
                    :selfFlag="false"
                    :customPopupParam="{ targetKey: 'vendor' }"
                    label="조치업체"
                    name="actionVendorCd"
                    v-model:value="impr.actionVendorCd"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-multi-field
                    v-show="impr.actionFlag === 'D'"
                    :editable="actionReceiptAreaEditable"
                    :required="true"
                    v-model:userInfo="userInfo"
                    isArray
                    type="dept_user"
                    label="조치자"
                    name="actionUserIds"
                    v-model:value="impr.actionUserIds"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-datepicker
                    :editable="requestAreaEditable"
                    :required="true"
                    label="조치완료 요청일"
                    name="actionCompleteRequestDate"
                    v-model:value="impr.actionCompleteRequestDate"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-field
                    :editable="requestAreaEditable || actionReceiptAreaEditable"
                    type="dept_user"
                    :data="impr"
                    deptValue="actionCompleteCheckDeptCd"
                    label="조치완료 확인자"
                    name="actionCompleteCheckUserId"
                    v-model:value="impr.actionCompleteCheckUserId"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="actionReceiptAreaEditable"
                    label="요청취소 사유"
                    autogrow
                    name="requestRejectReason"
                    v-model:value="impr.requestRejectReason"
                  />
                </div>
                <div class="col-12">
                  <c-upload
                    :attachInfo="attachBeforeInfo"
                    :editable="requestAreaEditable || actionReceiptAreaEditable"
                    label="개선 전 사진"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
      <div class="row">
        <div class="col-12" v-show="overFlag">
          <q-form ref="overForm">
            <c-card title="지연상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-show="editable && !disabled"
                    :isSubmit="isOver"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveOverImpr"
                    @btnCallback="saveOverCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-datepicker
                    :editable="editable"
                    :disabled="disabled"
                    :required="true"
                    :start="getToday()"
                    label="목표일"
                    name="targetDate"
                    v-model:value="impr.targetDate"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="editable"
                    :disabled="disabled"
                    :required="true"
                    autogrow
                    label="지연사유"
                    name="delayReason"
                    v-model:value="impr.delayReason"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
        <div class="col-12">
          <q-form ref="editForm2">
            <c-card title="조치상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-show="actionCompleteBtnEditable"
                    :isSubmit="isActionComplete"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="조치완료"
                    icon="directions_run"
                    @beforeAction="actionCompleteImpr"
                    @btnCallback="actionCompleteCallback"
                  />
                  <c-btn
                    v-show="saveBtnEditable2"
                    :isSubmit="isSaveAction"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveActionImpr"
                    @btnCallback="saveActionCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-datepicker
                    :editable="actionAreaEditable"
                    :required="true"
                    label="조치완료일"
                    name="actionCompleteDate"
                    v-model:value="impr.actionCompleteDate"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-datepicker
                    :editable="actionAreaEditable"
                    :required="true"
                    label="검토완료 요청일"
                    name="reviewCompleteRequestDate"
                    v-model:value="impr.reviewCompleteRequestDate"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="actionAreaEditable"
                    :required="true"
                    autogrow
                    label="조치내용"
                    name="actionContents"
                    v-model:value="impr.actionContents"
                  />
                </div>
                <div class="col-12">
                  <c-upload
                    :attachInfo="attachAfterInfo"
                    :editable="actionAreaEditable"
                    label="개선 후 사진"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
        <div class="col-12">
          <q-form ref="editForm3">
            <c-card title="검토상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-show="completeBtnEditable"
                    :isSubmit="isComplete"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="개선완료"
                    icon="check_circle_outline"
                    @beforeAction="completeImpr"
                    @btnCallback="completeCallback"
                  />
                  <c-btn
                    v-show="saveBtnEditable3"
                    :isSubmit="isSaveCheck"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveCheckImpr"
                    @btnCallback="saveCheckCallback"
                  />
                  <c-btn
                    v-show="rejectBtnEditable"
                    :isSubmit="isReturn"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="반려"
                    icon="front_hand"
                    @beforeAction="returnImpr"
                    @btnCallback="returnCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-12">
                  <c-textarea
                    :editable="requestCheckAreaEditable"
                    :required="true"
                    autogrow
                    label="검토내용"
                    name="reviewContents"
                    v-model:value="impr.reviewContents"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
      </div>
    </div>
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
import { imprPopupType, imprType } from './impr'
import { getToday } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprDetail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: imprPopupType
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
      isSearch: false,
      sopImprovementId: '',
      ibmTaskTypeCd: '',
      ibmTaskUnderTypeCd: '', // 업무하위분류코드
      data: null,
      requestContents: '',
      relationTableKey: '',
      vendorCd: '' // 협렵업체 코드
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
const editable = ref(true)
const impr = ref<imprType>({
  sopImprovementId: '', // 개선 일련번호
  plantCd: '', // 사업장 코드
  ibmTaskTypeCd: '', // 업무분류코드
  ibmTaskUnderTypeCd: '', // 업무하위분류코드
  ibmTitle: '', // 제목
  request: '',
  improveRequestDeptCd: '', // 개선요청부서
  improveRequestDeptName: '', // 개선요청부서명
  improveRequestUserId: '', // 개선요청자
  improveRequestUserName: '', // 개선요청자명
  improveRequestContents: '', // 개선요청내용
  ibmClassCd: '',
  ibmStepCd: '', // 개선진행단계
  relationTableKey: '', // 관련테이블 키
  relationVendor: '', // 관련업체_기술
  actionScheduleDate: '', // 조치예정일
  actionCompleteRequestDate: '', // 조치완료 요청일
  reviewCompleteRequestDate: '', // 검토완료 요청일
  actionCompleteDate: '', // 조치완료일
  actionFlag: 'D', // 조치부서_조치부서는 변경가능
  actionVendorCd: '', // 조치부서_조치부서는 변경가능
  actionDeptCd: '', // 조치부서_조치부서는 변경가능
  actionUserIds: [], // 조치자s
  actionContents: '', // 조치내용_조치부서에서
  reviewContents: '', // 요청부서 조치결과 검토_요청부서에서
  actionCompleteCheckUserId: '', // 조치완료 확인자_부서장 또는 공장장
  actionCompleteCheckFlag: '', // 조치완료 확인자 확인 여부
  requestRejectReason: '', // 요청취소사유

  targetDate: '', // 목표일 - 지연
  delayReason: '', // 지연사유
  completeDateOver: 0,

  saveSuppleFlag: '', // 적합/보완 여부 저장된 정보
  suppleFlag: '', // 적합/보완 여부
  ibmSuppleStepCd: '', // 개선보완진행단계
  suppleRequest: '', // 보완할 사항
  suppleScheduleDate: '', // 보완완료 요청일
  suppleActionContents: '', // 보완처리 내용
  suppleCompleteDate: '', // 보완완료일
  suppleReviewContents: '', // 보완 검토 내용
  suppleCheckFlag: 'N',

  sopConstructionId: '',

  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '', // 결재관련 결재요청코드
  regUserId: '', // 등록자 ID
  regDt: '',
  chgUserId: '', // 수정자 ID
  actionUsers: [],
  stepFlag: 0
})
const attachBeforeInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'IBM_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'IBM_AFTER',
  taskKey: ''
})
const attachSupple = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'IBM_SUPPLE',
  taskKey: ''
})

const deptCd = ref(null)
const deptName = ref('부서를 선택하세요')
const isOpen = ref(false)
const selected = ref(null)
const mappingType = ref('PUT')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const approvalUrl = ref('')
const isSaveRequestReceipt = ref(false) // 요청&접수 저장 flag
const isRequest = ref(false) // 요청 flag
const isReceipt = ref(false) // 접수 flag
const isReject = ref(false) // 요청취소 flag
const isActionComplete = ref(false) // 조치완료 flag
const isSaveAction = ref(false) // 조치 저장 flag
const isSaveCheck = ref(false) // 검토 저장 flag
const isComplete = ref(false) // 개선완료 flag
const isReturn = ref(false) // 조치반려 flag
const isOver = ref(false) // 지연 저장 flag
const imprActionDept = ref<any>(null)
const editForm1 = ref<any>(null)
const editForm2 = ref<any>(null)
const overForm = ref<any>(null)
const editForm3 = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const request = computed(() => {
  if (impr.value.improveRequestDeptName !== impr.value.improveRequestUserName) {
    return (
      impr.value.improveRequestDeptName +
      ' / ' +
      impr.value.improveRequestUserName +
      ' / ' +
      impr.value.regDt
    )
  } else {
    return impr.value.improveRequestUserName + ' / ' + impr.value.regDt.slice(0, 16)
  }
})
const disabled = computed(() => {
  return (
    props.popupParam.isSearch ||
    impr.value.ibmStepCd === 'IS00000020' ||
    // 결재중인 경우 비활성화
    impr.value.approvalStatusCd === 'ASC0000001'
  )
})
const imprEditable = computed(() => {
  return (
    editable.value &&
    !disabled.value &&
    (impr.value.approvalStatusCd === 'ASC9999999' ? true : !overFlag.value)
  )
})
const requestAreaEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000001' && // 요청중 상태
    impr.value.improveRequestDeptCd === user.value.deptCd
  ) // 로그인자의 부서가 요청부서인 경우
})
const actionReceiptAreaEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000005' && // 조치부서 접수중 상태
    (impr.value.actionDeptCd === user.value.deptCd || // 로그인자의 부서가 조치부서인 경우
      _.indexOf(impr.value.actionUserIds, user.value.userId) > -1) // 조치자인 경우
  )
})
const actionAreaEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000010' && // 조치부서 조치중 상태
    (impr.value.actionDeptCd === user.value.deptCd || // 로그인자의 부서가 조치부서인 경우
      _.indexOf(impr.value.actionUserIds, user.value.userId) > -1) // 조치자인 경우
  )
})
const requestCheckAreaEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000015' && // 요청부서 검토중 상태
    impr.value.improveRequestDeptCd === user.value.deptCd
  ) // 로그인자의 부서가 요청부서인 경우
})
const requestBtnEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000001' && // 요청중 상태
    props.popupParam.sopImprovementId && // key가 있는 경우, 저장이 한번 된 상태
    impr.value.improveRequestDeptCd === user.value.deptCd
  ) // 로그인자의 부서가 요청부서인 경우
})
const receiptBtnEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000005' && // 조치부서 접수중 상태
    (impr.value.actionDeptCd === user.value.deptCd || // 로그인자의 부서가 조치부서인 경우
      _.indexOf(impr.value.actionUserIds, user.value.userId) > -1) // 조치자인 경우
  )
})
const requestCancelBtnEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000005' && // 조치부서 접수중 상태
    (impr.value.actionDeptCd === user.value.deptCd || // 로그인자의 부서가 조치부서인 경우
      _.indexOf(impr.value.actionUserIds, user.value.userId) > -1) // 조치자인 경우
  )
})
const actionCompleteBtnEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000010' && // 조치부서 조치중 상태
    (impr.value.actionDeptCd === user.value.deptCd || // 로그인자의 부서가 조치부서인 경우
      _.indexOf(impr.value.actionUserIds, user.value.userId) > -1) // 조치자인 경우
  )
})
const rejectBtnEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000015' && // 요청부서 검토중 상태
    impr.value.improveRequestDeptCd === user.value.deptCd
  ) // 로그인자의 부서가 요청부서인 경우
})
const completeBtnEditable = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000015' && // 요청부서 검토중 상태
    impr.value.improveRequestDeptCd === user.value.deptCd
  ) // 로그인자의 부서가 요청부서인 경우
})
const saveBtnEditable1 = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000001' && // 요청중 and 로그인자의 부서가 요청부서
    impr.value.improveRequestDeptCd === user.value.deptCd
  )
})
const saveBtnEditable2 = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000010' && // 조치부서 조치중 상태
    (impr.value.actionDeptCd === user.value.deptCd || // 로그인자의 부서가 조치부서인 경우
      _.indexOf(impr.value.actionUserIds, user.value.userId) > -1) // 조치자인 경우
  )
})
const saveBtnEditable3 = computed(() => {
  return (
    imprEditable.value &&
    impr.value.ibmStepCd === 'IS00000015' && // 요청부서 검토중 상태
    impr.value.improveRequestDeptCd === user.value.deptCd
  ) // 로그인자의 부서가 요청부서인 경우
})
const userInfo = computed(() => {
  return {
    userItems: impr.value.actionUsers,
    userText: 'actionUserName',
    userValue: 'actionUserId',
    deptText: 'actionDeptName',
    deptValue: 'actionDeptCd'
  }
})
const overFlag = computed(() => {
  /**
   * 지연된 데이터 체크
   * 접수중 단계부터 체크하며 지연된 데이터의 경우 지연 프로세스 동작
   * 지연 정보를 제외한 나머지 정보는 비활성화 처리
   */
  return (
    impr.value.completeDateOver > 0 &&
    impr.value.ibmStepCd !== 'IS00000001' &&
    impr.value.ibmStepCd !== 'IS00000020'
  )
  // && impr.value.targetDate
})
const relationTableInfo = computed(() => {
  return {
    component: defineAsyncComponent(() => import(`@views/sop/ibm/imprRelationTag.vue`)),
    key: uid(),
    taskParam: impr.value
  }
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => selected.value,
  () => {
    const data = imprActionDept.value.getNodeByKey(selected.value)
    deptCd.value = _.clone(selected.value)
    deptName.value = data.deptName
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
  detailUrl.value = selectConfig.sop.ibm.improve.get.url
  saveUrl.value = transactionConfig.sop.ibm.improve.update.url
  deleteUrl.value = transactionConfig.sop.ibm.improve.delete.url
  approvalUrl.value = transactionConfig.sop.ibm.improve.approval.url
  // code setting
  // 조치업체의 경우
  if (props.popupParam.vendorCd) {
    impr.value.actionFlag = 'V'
    impr.value.actionVendorCd = props.popupParam.vendorCd
    impr.value.actionDeptCd = null
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 개선 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.sopImprovementId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopImprovementId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(impr.value, _result.data)

      impr.value.saveSuppleFlag = _.clone(impr.value.suppleFlag)

      attachBeforeInfo.value.taskKey = _.clone(impr.value.sopImprovementId)
      attachAfterInfo.value.taskKey = _.clone(impr.value.sopImprovementId)
      attachSupple.value.taskKey = _.clone(impr.value.sopImprovementId)

      if (impr.value.actionUsers && impr.value.actionUsers.length > 0) {
        impr.value.actionUserIds = _.map(impr.value.actionUsers, 'actionUserId')
      } else {
        impr.value.actionUserIds = []
      }
    })
  } else {
    /**
     * 데이터가 들어오지 않은 경우 두 가지의 case로 처리
     *
     * case 1. popupParam.data가 있는 경우
     *  - 해당 데이터에 새로 들어온 데이터가 있음으로 해당 데이터를 impr에 extend 처리
     * case 2. popupParam.data가 없는 경우 경우
     *  - 해당 팝업으로 개선요청을 등록하는 경우로 업무 및 요청정보를 setting한다.
     */
    if (props.popupParam.data) {
      // case 1.
      _.extend(impr.value, props.popupParam.data)
    } else {
      // case 2.
      impr.value.ibmClassCd = 'IC00000001'
      impr.value.ibmStepCd = 'IS00000001'
      impr.value.ibmTaskTypeCd = props.popupParam.ibmTaskTypeCd
      impr.value.ibmTaskUnderTypeCd = props.popupParam.ibmTaskUnderTypeCd
      impr.value.improveRequestDeptCd = user.value.deptCd
      impr.value.improveRequestDeptName = user.value.deptName
      impr.value.improveRequestUserId = user.value.userId
      impr.value.improveRequestUserName = user.value.userName
      impr.value.regDt = getToday()
      impr.value.relationTableKey = props.popupParam.relationTableKey
      if (props.popupParam.requestContents) {
        impr.value.ibmTitle =
          props.popupParam.requestContents.replace(/^[\s\uFEFF\xA0]+/gi, '') + '_' + getToday()
      }
    }
  }
}
/******************************
 * TODO (목적): 조치부서 변경
 *******************************/
function changeActionDeptImpr() {
  isOpen.value = true
}
function changeAction(value: any) {
  if (value === 'D') {
    // 부서
    impr.value.actionVendorCd = null
  } else if (value === 'V') {
    // 업체
    impr.value.actionDeptCd = null
  }
}

// 요청&접수 상세 저장
function saveRequestReceiptImpr() {
  if (props.popupParam.sopImprovementId) {
    mappingType.value = 'PUT'
  } else {
    mappingType.value = 'POST'
  }
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId

          isSaveRequestReceipt.value = !isSaveRequestReceipt.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveRequestReceiptCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachBeforeInfo.value.taskKey = result.data
  attachBeforeInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 요청
function requestImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '조치부서에 개선요청하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000005'
          isRequest.value = !isRequest.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function requestCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachBeforeInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
/**
 * 접수
 */
function receiptImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '요청건을 접수하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000010'

          isReceipt.value = !isReceipt.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function receiptCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachBeforeInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 요청취소
function rejectImpr() {
  if (impr.value.requestRejectReason) {
    message.confirm({
      title: '확인',
      message: '요청취소하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        impr.value.chgUserId = user.value.userId
        impr.value.ibmStepCd = 'IS00000001'

        isReject.value = !isReject.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.alert({
      title: '안내',
      message: '요청취소사유를 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
  }
}
function rejectCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachBeforeInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 조치완료
function actionCompleteImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    editForm2.value.validate().then((__result: boolean) => {
      if (_result && __result) {
        message.confirm({
          title: '확인',
          message: '조치완료하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            impr.value.chgUserId = user.value.userId
            impr.value.ibmStepCd = 'IS00000015'
            impr.value.stepFlag = 1

            isActionComplete.value = !isActionComplete.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.validError()
      }
    })
  })
}
function actionCompleteCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachAfterInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 조치 저장
function saveActionImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    editForm2.value.validate().then((__result: boolean) => {
      if (_result && __result) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            impr.value.chgUserId = user.value.userId

            isSaveAction.value = !isSaveAction.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.validError()
      }
    })
  })
}
function saveActionCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachAfterInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 조치 저장
function saveCheckImpr() {
  editForm3.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId

          isSaveCheck.value = !isSaveCheck.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCheckCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  getDetail()
}
// 개선완료
function completeImpr() {
  editForm3.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '개선 완료처리하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000020'

          isComplete.value = !isComplete.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function completeCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  getDetail()
}
// 조치반려
function returnImpr() {
  editForm3.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '조치반려하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000010'

          isReturn.value = !isReturn.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function returnCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  getDetail()
}
function saveOverImpr() {
  overForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId

          isOver.value = !isOver.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveOverCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

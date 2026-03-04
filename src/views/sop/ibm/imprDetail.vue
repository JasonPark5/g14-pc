<template>
  <div class="row">
    <div v-show="impr.ibmStepCd !== 'IS00000001' && impr.suppleCheckFlag !== 'Y'" class="col-12">
      <c-step
        stepperGrpCd="IBM_STEP_CD"
        :currentStepCd="impr.ibmStepCd"
        :disabled="true"
        v-model:value="impr.ibmStepCd"
      />
    </div>
    <div v-show="suppleFlag" class="col-12">
      <c-step
        stepperGrpCd="IBM_SUPPLE_STEP_CD"
        :currentStepCd="impr.ibmSuppleStepCd"
        :disabled="true"
        v-model:value="impr.ibmSuppleStepCd"
      />
    </div>
    <div v-if="overFlag && impr.approvalStatusCd !== 'ASC9999999'" class="col-12">
      <q-banner dense inline-actions class="text-white bg-red">
        <template v-slot:avatar>
          <q-icon name="report_problem" color="grey-3" />
        </template>
        <b class="text-h5">{{ $language('지연') }}</b>
      </q-banner>
    </div>
    <div
      v-show="impr.suppleCheckFlag === 'Y'"
      :class="impr.saveSuppleFlag === 'Y' ? 'col-xs-12 col-sm-12 col-md-12 col-lg-6' : 'col-12'"
    >
      <div class="row">
        <div class="col-12">
          <q-form ref="editSuppleForm">
            <c-card title="보완 요청 상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-show="suppleRequestEditable"
                    :isSubmit="isSaveSuppleRequest"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="보완요청"
                    icon="send"
                    @beforeAction="saveSuppleRequest"
                    @btnCallback="saveSuppleRequestCallback"
                  />
                  <c-btn
                    v-show="suppleRequestEditable"
                    :isSubmit="isSaveSupple"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveSupple"
                    @btnCallback="saveSuppleCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-description>
                <span
                  v-if="!impr.saveSuppleFlag"
                  style="font-size: 0.96em; color: tomato"
                  class="q-ml-md"
                >
                  {{ $language('※ 적합 / 보완 처리가 되지 않았습니다.') }}
                </span>
              </template>
              <template v-slot:card-detail>
                <div :class="impr.saveSuppleFlag === 'Y' ? 'col-4' : 'col-3'">
                  <c-select
                    :editable="suppleEditable"
                    :comboItems="suppleFlagItems"
                    itemText="codeName"
                    itemValue="code"
                    type="edit"
                    label="적합/보완 여부"
                    name="suppleFlag"
                    v-model:value="impr.suppleFlag"
                    @datachange="supplechange"
                  />
                </div>
                <div v-if="impr.saveSuppleFlag === 'Y'" class="col-4">
                  <c-datepicker
                    :editable="suppleRequestEditable"
                    :required="true"
                    label="보완완료 요청일"
                    name="suppleScheduleDate"
                    v-model:value="impr.suppleScheduleDate"
                  />
                </div>
                <div v-if="impr.saveSuppleFlag === 'Y'" class="col-12">
                  <c-textarea
                    :editable="suppleRequestEditable"
                    :required="true"
                    autogrow
                    label="보완요청내용"
                    name="suppleRequest"
                    v-model:value="impr.suppleRequest"
                  />
                </div>
                <div v-show="impr.saveSuppleFlag === 'Y'" class="col-12">
                  <c-upload
                    ref="suppleAttach"
                    :attachInfo="attachSupple"
                    :editable="suppleAttachEditable"
                    label="보완 관련 첨부파일"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
      </div>
    </div>
    <div
      v-show="impr.suppleCheckFlag === 'Y' && impr.saveSuppleFlag === 'Y'"
      class="col-xs-12 col-sm-12 col-md-12 col-lg-6"
    >
      <div class="row">
        <div class="col-12">
          <q-form ref="editSuppleActionReviewForm">
            <c-card title="보완 조치&검토 상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-show="suppleReviewEditable"
                    :isSubmit="isSaveSuppleComplete"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="보완완료"
                    icon="directions_run"
                    @beforeAction="saveSuppleComplete"
                    @btnCallback="saveSuppleCompleteCallback"
                  />
                  <c-btn
                    v-show="suppleActionEditable"
                    :isSubmit="isSaveSuppleReview"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="검토요청"
                    icon="send"
                    @beforeAction="saveSuppleReview"
                    @btnCallback="saveSuppleReviewCallback"
                  />
                  <c-btn
                    v-show="suppleActionReviewBtnEditable"
                    :isSubmit="isSaveSuppleActionReview"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveSuppleActionReview"
                    @btnCallback="saveSuppleActionReviewCallback"
                  />
                  <c-btn
                    v-show="suppleReviewEditable"
                    :isSubmit="isReturnSupple"
                    :url="saveUrl"
                    :param="impr"
                    mappingType="PUT"
                    label="반려"
                    icon="front_hand"
                    @beforeAction="returnSupple"
                    @btnCallback="returnSuppleCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <c-datepicker
                    :editable="suppleActionEditable"
                    :required="true"
                    label="보완완료일"
                    name="suppleCompleteDate"
                    v-model:value="impr.suppleCompleteDate"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="suppleActionEditable"
                    :required="true"
                    :rows="4"
                    label="보완처리내용"
                    name="suppleActionContents"
                    v-model:value="impr.suppleActionContents"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="suppleReviewEditable"
                    :rows="4"
                    label="보완검토내용"
                    name="suppleReviewContents"
                    v-model:value="impr.suppleReviewContents"
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
                    v-show="requestAreaEditable && popupParam.sopImprovementId"
                    :isSubmit="isDelete"
                    :url="deleteUrl"
                    :param="impr"
                    mappingType="DELETE"
                    label="삭제"
                    icon="remove"
                    @beforeAction="removeImpr"
                    @btnCallback="removeCallback"
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
                    :mappingType="mappingType"
                    label="저장"
                    icon="save"
                    @beforeAction="saveRequestReceiptImpr"
                    @btnCallback="saveRequestReceiptCallback"
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
                    :editable="false"
                    name="sopImprovementId"
                    label="개선번호"
                    v-model:value="impr.sopImprovementId"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-text
                    :editable="false"
                    label="요청부서/이름/요청일"
                    name="request"
                    :value="request"
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
                  <c-textarea
                    :editable="requestAreaEditable"
                    :required="true"
                    autogrow
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
                <!-- <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
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
                    :trueLabel="$language('업체')"
                    :falseLabel="$language('부서')"
                    trueValue="V"
                    falseValue="D"
                    label="조치주체"
                    name="actionFlag"
                    v-model:value="impr.actionFlag"
                    @datachange="changeAction"
                  />
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <c-task-target
                    v-if="impr.actionFlag === 'V'"
                    :editable="requestAreaEditable || actionReceiptAreaEditable"
                    :required="impr.actionFlag === 'V'"
                    :customPopupParam="{ targetKey: 'vendor' }"
                    label="조치업체"
                    name="actionVendorCd"
                    v-model:value="impr.actionVendorCd"
                  />
                  <c-dept
                    v-else
                    :editable="requestAreaEditable || actionReceiptAreaEditable"
                    :required="impr.actionFlag === 'D'"
                    :searchFlag="actionReceiptAreaEditable ? false : true"
                    :closeFlag="actionReceiptAreaEditable ? false : true"
                    type="edit"
                    label="조치부서"
                    name="actionDeptCd"
                    v-model:value="impr.actionDeptCd"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <c-multi-field
                    v-if="impr.actionFlag === 'D'"
                    :editable="actionReceiptAreaEditable"
                    :required="impr.actionFlag === 'D'"
                    :deptCd="impr.actionDeptCd"
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
                    label="조치완료 확인자"
                    name="actionCompleteCheckUserId"
                    v-model:value="impr.actionCompleteCheckUserId"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="actionReceiptAreaEditable"
                    autogrow
                    label="요청취소 사유"
                    name="requestRejectReason"
                    v-model:value="impr.requestRejectReason"
                  />
                </div>
                <div class="col-12">
                  <c-upload
                    :isPhoto="true"
                    :attachInfo="attachBeforeInfo"
                    :editable="
                      requestAreaEditable || actionReceiptAreaEditable || actionAreaEditable
                    "
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
        <div class="col-12" v-if="overFlag">
          <q-form ref="overForm">
            <c-card title="지연상세" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-appr-btn
                    ref="apprBtn"
                    name="work-permit-appr-btn"
                    :editable="overApprEditable"
                    :approvalInfo="approvalInfo"
                    @beforeApprAction="approvalOverImpr"
                    @callbackApprAction="approvalOverImrpCallback"
                    @requestAfterAction="getDetail"
                  />
                  <c-btn
                    v-if="overEditable"
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
                    :editable="overEditable"
                    :required="true"
                    :start="getToday()"
                    label="목표일"
                    name="targetDate"
                    v-model:value="impr.targetDate"
                  />
                </div>
                <div class="col-12">
                  <c-textarea
                    :editable="overEditable"
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
                    :isPhoto="true"
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: imprPopupType
  contentHeight: string
  returnData: returnDataType
}
interface returnDataType {
  col1: stringNull
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
  },
  returnData: () => {
    return {
      col1: null
    }
  },
  contentHeight: 'auto'
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
const isDelete = ref(false) // 삭제 flag
const isActionComplete = ref(false) // 조치완료 flag
const isSaveAction = ref(false) // 조치 저장 flag
const isSaveCheck = ref(false) // 검토 저장 flag
const isComplete = ref(false) // 개선완료 flag
const isReturn = ref(false) // 조치반려 flag
const isOver = ref(false) // 지연 저장 flag
const isApproval = ref(false) // 지연 결재 flag
const isSaveSuppleRequest = ref(false) // 보완 요청 flag
const isSaveSupple = ref(false) // 보완 정보 저장 flag
const isSaveSuppleComplete = ref(false) // 보완완료 flag
const isSaveSuppleActionReview = ref(false) // 보완 정보 저장 flag
const isSaveSuppleReview = ref(false) // 보완 검토요청 flag
const isReturnSupple = ref(false) // 보완 반려 flag
const imprActionDept = ref<any>(null)
const suppleAttach = ref<any>(null)
const editForm1 = ref<any>(null)
const editForm2 = ref<any>(null)
const editSuppleActionReviewForm = ref<any>(null)
const editSuppleForm = ref<any>(null)
const apprBtn = ref<any>(null)
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
const suppleAttachEditable = computed(() => {
  return (
    editable.value &&
    impr.value.ibmStepCd === 'IS00000020' && // 개선완료
    impr.value.suppleCheckFlag === 'Y' && // 보완 작성 여부
    impr.value.ibmSuppleStepCd !== 'ISS0000015' && // 보완완료 상태인 경우
    impr.value.saveSuppleFlag === 'Y'
  )
})
const suppleEditable = computed(() => {
  return (
    editable.value &&
    impr.value.ibmStepCd === 'IS00000020' && // 개선완료
    impr.value.suppleCheckFlag === 'Y' && // 보완 작성 여부
    impr.value.improveRequestDeptCd === user.value.deptCd && // 로그인자의 부서가 요청부서인 경우
    impr.value.ibmSuppleStepCd !== 'ISS0000015'
  ) // 보완 진행단계가 없거나 요청상태인 경우
})
const suppleRequestEditable = computed(() => {
  return (
    editable.value &&
    impr.value.ibmStepCd === 'IS00000020' && // 개선완료
    impr.value.suppleCheckFlag === 'Y' && // 보완 작성 여부
    impr.value.improveRequestDeptCd === user.value.deptCd && // 로그인자의 부서가 요청부서인 경우
    impr.value.ibmSuppleStepCd === 'ISS0000001'
  ) // 보완 요청상태인 경우
})
const suppleActionEditable = computed(() => {
  return (
    editable.value &&
    impr.value.actionDeptCd === user.value.deptCd && // 로그인자의 부서가 요청부서인 경우
    impr.value.ibmSuppleStepCd === 'ISS0000005'
  ) // 보완 조치상태인 경우
})
const suppleReviewEditable = computed(() => {
  return (
    editable.value &&
    impr.value.improveRequestDeptCd === user.value.deptCd && // 로그인자의 부서가 요청부서인 경우
    impr.value.ibmSuppleStepCd === 'ISS0000010'
  ) // 보완 검토상태인 경우
})
const suppleActionReviewBtnEditable = computed(() => {
  return (
    editable.value &&
    (impr.value.improveRequestDeptCd === user.value.deptCd ||
      impr.value.actionDeptCd === user.value.deptCd) && // 로그인자의 부서가 요청부서이거나 조치부서인 경우
    (impr.value.ibmSuppleStepCd === 'ISS0000005' || impr.value.ibmSuppleStepCd === 'ISS0000010')
  ) // 보완 조치 또는 검토 상태인 경우
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
const overEditable = computed(() => {
  return (
    editable.value &&
    impr.value.approvalStatusCd !== 'ASC9999999' &&
    !disabled.value &&
    impr.value.actionDeptCd === user.value.deptCd
  )
})
const overApprEditable = computed(() => {
  return (
    editable.value &&
    impr.value.approvalStatusCd !== 'ASC9999999' &&
    impr.value.actionDeptCd === user.value.deptCd
  )
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
const suppleFlag = computed(() => {
  return impr.value.saveSuppleFlag === 'Y' && impr.value.ibmSuppleStepCd
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
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: impr.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: impr.value.approvalStatusCd,
    apprEditable: overFlag.value, // 결재버튼 활성화 기준
    param: impr.value, // 결재 param
    approvalUrl: approvalUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000007', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      sopImprovementId: impr.value.sopImprovementId,
      isApprContent: true
    },
    approvalRequestName: impr.value.ibmTitle, // 결재요청명 (문서 title)
    approvalConnId: impr.value.sopImprovementId // 결재연결용 업무일련번호 (문서 key)
  }
})
const suppleFlagItems = computed(() => {
  // if (impr.value.saveSuppleFlag) {
  return [
    { code: 'Y', codeName: $language('보완') },
    { code: 'N', codeName: $language('적합') }
  ]
  // } else {
  //   return [
  //     { code: '', codeName: $language('선택') },
  //     { code: 'Y', codeName: $language('보완') },
  //     { code: 'N', codeName: $language('적합') }
  //   ]
  // }
})
const relationTableInfo = computed(() => {
  return {
    component: defineAsyncComponent(() => import(`./imprRelationTag.vue`)),
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
      } else impr.value.actionUserIds = []
      props.returnData.col1 = impr.value
      // 검토완료 요청일에 조치완료 요청일 있으면 넣기
      impr.value.reviewCompleteRequestDate = impr.value.actionCompleteRequestDate || null
    })
  } else {
    /**
     * 데이터가 들어오지 않은 경우 두 가지의 case로 처리
     * case 1. popupParam.data가 있는 경우
     *  - 해당 데이터에 새로 들어온 데이터가 있으므로 해당 데이터를 impr에 extend 처리
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

function changeAction(value: any) {
  if (value === 'D') impr.value.actionVendorCd = null
  else if (value === 'V') impr.value.actionDeptCd = null
}
/******************************
 * TODO (목적): 적합/여부 datachange
 *******************************/
function supplechange(data: any) {
  if (!data.value) return
  let msg = '보완이 필요한 개선요청건으로 지정하시겠습니까?'
  if (data.value === 'N') {
    if (impr.value.ibmSuppleStepCd)
      msg = '보완을 위해 작성한 내용이 삭제됩니다. 적합으로 지정하시겠습니까?'
    else msg = '적합으로 지정하시겠습니까?'
  }
  message.confirm({
    title: '확인',
    message: msg,
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      impr.value.chgUserId = user.value.userId
      if (data.value === 'Y') {
        impr.value.ibmSuppleStepCd = 'ISS0000001'
      } else {
        impr.value.ibmSuppleStepCd = ''
        impr.value.suppleRequest = ''
        impr.value.suppleScheduleDate = ''
        impr.value.suppleActionContents = ''
        impr.value.suppleCompleteDate = ''
        impr.value.suppleReviewContents = ''
        suppleAttach.value.removeAllFilesMethod()
      }
      $http({
        url: saveUrl.value,
        method: 'PUT',
        data: impr.value
      }).then((_result: any) => {
        message.requestSuccess()
        getDetail()
      })
    },
    cancelCallback: () => {
      impr.value.suppleFlag = impr.value.saveSuppleFlag
    }
  })
}
// 요청&접수 상세 저장
function saveRequestReceiptImpr() {
  if (props.popupParam.sopImprovementId) mappingType.value = 'PUT'
  else mappingType.value = 'POST'
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isSaveRequestReceipt.value = !isSaveRequestReceipt.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
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
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000005'
          isRequest.value = !isRequest.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function requestCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachBeforeInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 접수
function receiptImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '요청건을 접수하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          _.forEach(impr.value.actionUserIds, (item) =>
            impr.value.actionUsers.push({
              actionUserId: item
            })
          )
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000010'
          isReceipt.value = !isReceipt.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
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
      confirmCallback: () => {
        impr.value.chgUserId = user.value.userId
        impr.value.ibmStepCd = 'IS00000001'
        isReject.value = !isReject.value
      },
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
// 삭제
function removeImpr() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      deleteUrl.value = $format(
        transactionConfig.sop.ibm.improve.delete.url,
        props.popupParam.sopImprovementId
      )
      isDelete.value = !isDelete.value
    },
    cancelCallback: () => {}
  })
}
function removeCallback() {
  message.requestSuccess()
  emits('closePopup', props.returnData, 'delete')
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
          confirmCallback: () => {
            impr.value.chgUserId = user.value.userId
            impr.value.ibmStepCd = 'IS00000015'
            impr.value.stepFlag = 1
            isActionComplete.value = !isActionComplete.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
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
          confirmCallback: () => {
            impr.value.chgUserId = user.value.userId
            isSaveAction.value = !isSaveAction.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
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
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isSaveCheck.value = !isSaveCheck.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
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
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000020'
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
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
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmStepCd = 'IS00000010'
          isReturn.value = !isReturn.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
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
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isOver.value = !isOver.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveOverCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  getDetail()
}
function approvalOverImpr() {
  overForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isApproval.value = !isApproval.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function approvalOverImrpCallback() {
  apprBtn.value.apprRequestPop()
}
// 보완요청
function saveSuppleRequest() {
  editSuppleForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '조치부서에 보완조치요청 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmSuppleStepCd = 'ISS0000005'
          isSaveSuppleRequest.value = !isSaveSuppleRequest.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSuppleRequestCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  attachSupple.value.isSubmit = uid()
  getDetail()
}
// 보완 정보 저장
function saveSupple() {
  editSuppleForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isSaveSupple.value = !isSaveSupple.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSuppleCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  attachSupple.value.isSubmit = uid()
  getDetail()
}
// 보완 정보 저장
function saveSuppleActionReview() {
  editSuppleActionReviewForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isSaveSuppleActionReview.value = !isSaveSuppleActionReview.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSuppleActionReviewCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  attachSupple.value.isSubmit = uid()
  getDetail()
}
// 보완완료
function saveSuppleComplete() {
  editSuppleActionReviewForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '보완 완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmSuppleStepCd = 'ISS0000015'
          isSaveSuppleComplete.value = !isSaveSuppleComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSuppleCompleteCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  attachSupple.value.isSubmit = uid()
  getDetail()
}
// 보완 검토요청 저장
function saveSuppleReview() {
  editSuppleActionReviewForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '검토 요청하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmSuppleStepCd = 'ISS0000010'
          isSaveSuppleReview.value = !isSaveSuppleReview.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSuppleReviewCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  attachSupple.value.isSubmit = uid()
  getDetail()
}
// 보완 반려
function returnSupple() {
  if (!impr.value.suppleReviewContents) {
    message.alert({
      title: '안내',
      message: '보완검토내용에 반려사유를 입력하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editSuppleActionReviewForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '반려하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          impr.value.ibmSuppleStepCd = 'ISS0000005'
          isReturnSupple.value = !isReturnSupple.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function returnSuppleCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  message.requestSuccess()
  attachSupple.value.isSubmit = uid()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

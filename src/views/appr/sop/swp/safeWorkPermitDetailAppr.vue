<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-12">
          <c-card title="기본정보" class="cardClassDetailForm work-card" :noMarginPadding="true">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="workPermit"
                  :mappingType="mappingType"
                  :label="saveBtnLabel"
                  icon="save"
                  @beforeAction="saveWorkPermit"
                  @btnCallback="saveWorkPermitCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 work-item">
                <c-plant
                  :required="true"
                  :disabled="!isWriting"
                  :editable="editable"
                  label="사업장"
                  name="plantCd"
                  v-model:value="workPermit.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 work-item">
                <c-text
                  :disabled="true"
                  :editable="editable"
                  label="허가번호"
                  name="permitNo"
                  v-model:value="workPermit.permitNo"
                />
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 work-item">
                <c-datepicker
                  :required="true"
                  :disabled="!isWriting"
                  :editable="editable"
                  label="허가작업일"
                  name="permitDate"
                  v-model:value="workPermit.permitDate"
                />
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 work-item">
                <c-datepicker
                  :required="true"
                  :disabled="!isWriting"
                  :editable="editable"
                  :range="true"
                  :minuteStep="10"
                  type="time"
                  label="작업시간"
                  name="workTime"
                  v-model:value="workPermit.workTime"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 work-item">
                <c-multi-select
                  :disabled="!isWriting"
                  :editable="editable"
                  codeGroupCd="SOP_SUPPLEMENT_WORK_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="보충작업"
                  name="supWorks"
                  v-model:value="supWorks"
                  @datachange="changeSupWork"
                />
              </div>
              <template v-if="isWorkInfo">
                <q-slide-transition>
                  <div
                    v-show="visible"
                    class="row"
                    style="display: -webkit-inline-box; width: 100%"
                  >
                    <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                      <q-card
                        class="work-card"
                        flat
                        bordered
                        :class="cancelFlag ? 'bg-highLight' : ''"
                      >
                        <q-card-section
                          class="q-pa-xs q-pl-sm bg-grey-3"
                          :class="
                            editable && !disabled && !disableCancel
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed'
                          "
                          v-on:click="qCardCancelClick"
                        >
                          <div class="text-orange-9 work-title-text">
                            <q-checkbox
                              :disable="disableCancel || disabled || !editable"
                              size="22px"
                              label=""
                              v-model="cancelFlag"
                              @input="changeCancel"
                            />
                            {{ $language('취소') }}
                          </div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="no-padding row">
                          <div class="col-12 work-item">
                            <c-textarea
                              :required="cancelFlag"
                              :editable="editable"
                              :disabled="disabled || !cancelFlag"
                              :rows="3"
                              label="취소사유"
                              beforeText=""
                              name="cancelRemark"
                              v-model:value="workPermit.cancelRemark"
                            />
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                      <q-card
                        class="work-card"
                        flat
                        bordered
                        :class="overFlag ? 'bg-highLight' : ''"
                      >
                        <q-card-section
                          class="q-pa-xs q-pl-sm cursor-pointer bg-grey-3"
                          style="position: relative"
                        >
                          <div style="position: absolute; right: 10px; top: 3px; z-index: 10600">
                            <q-btn-group outline>
                              <c-btn
                                v-if="editable && overFlag && !disabled"
                                label="추가"
                                icon="add"
                                :showLoading="false"
                                @btnClicked="addOver"
                              />
                              <c-btn
                                v-if="editable && overFlag && !disabled"
                                label="제외"
                                icon="remove"
                                :showLoading="false"
                                @btnClicked="removeOver"
                              />
                            </q-btn-group>
                          </div>
                        </q-card-section>
                        <q-card-section
                          class="q-pa-xs q-pl-sm bg-grey-3"
                          style="min-height: 23px"
                          :class="editable && !disabled ? 'cursor-pointer' : 'cursor-not-allowed'"
                          v-on:click="qCardOverClick"
                        >
                          <div
                            class="text-orange-9 work-title-text float-left"
                            style="position: absolute; top: -3px"
                          >
                            <q-checkbox
                              :disable="disabled"
                              size="22px"
                              label=""
                              v-model="overFlag"
                              @input="changeOver"
                            />
                            {{ $language('연장') }}
                          </div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="no-padding row" style="width: 100%">
                          <div class="col-12">
                            <c-table
                              class="work-permit-table"
                              ref="tableOver"
                              title=""
                              tableId="01"
                              :columns="grid.columns"
                              :data="workPermit.overs"
                              :gridHeight="grid.height"
                              :editable="editable && overFlag && !disabled"
                              :tableTimePickerOptions="tableTimePickerOptions"
                              :filtering="false"
                              :columnSetting="false"
                              :usePaging="false"
                              :isTitle="false"
                              :hideHeader="false"
                              :hideBottom="true"
                              :noHighLight="true"
                              :noHoverRow="true"
                              selection="multiple"
                              rowKey="sopOverResultId"
                            />
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 grid-style-transition">
                      <q-card
                        class="work-card"
                        flat
                        bordered
                        :class="completeFlag ? 'bg-highLight' : ''"
                      >
                        <q-card-section
                          class="q-pa-xs q-pl-sm bg-grey-3"
                          :class="
                            editable && !disabled && !disableComplete
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed'
                          "
                          v-on:click="qCardCompleteClick"
                        >
                          <div class="text-orange-9 work-title-text">
                            <q-checkbox
                              :disable="disableComplete || disabled"
                              size="22px"
                              label=""
                              v-model="completeFlag"
                              @input="changeComplete"
                            />
                            {{ $language('완료') }}
                          </div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="no-padding row">
                          <div class="col-4 work-item">
                            <c-datepicker
                              :required="completeFlag"
                              :editable="editable"
                              :disabled="disabled || !completeFlag"
                              :time-picker-options="overTimeOption"
                              :minuteStep="10"
                              type="time"
                              label="완료시간"
                              beforeText=""
                              name="workCompleteTime"
                              v-model:value="workPermit.workCompleteTime"
                            />
                          </div>
                          <div class="col-4 work-item">
                            <c-field
                              :required="completeFlag"
                              :editable="editable"
                              :disabled="disabled || !completeFlag"
                              :data="workPermit"
                              deptValue="workCompleteEntryDeptCd"
                              type="dept_user"
                              label="확인자"
                              beforeText=""
                              name="workCompleteEntryUserId"
                              v-model:value="workPermit.workCompleteEntryUserId"
                            />
                          </div>
                          <div class="col-4 work-item">
                            <c-field
                              :required="completeFlag"
                              :editable="editable"
                              :disabled="disabled || !completeFlag"
                              :data="workPermit"
                              deptValue="workCompleteWorkDeptCd"
                              type="dept_user"
                              label="작업자"
                              beforeText=""
                              name="workCompleteWorkUserId"
                              v-model:value="workPermit.workCompleteWorkUserId"
                            />
                          </div>
                          <div class="col-12 work-item">
                            <c-text
                              :editable="editable"
                              :disabled="disabled || !completeFlag"
                              label="조치사항"
                              beforeText=""
                              name="actionRemark"
                              v-model:value="workPermit.actionRemark"
                            />
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-slide-transition>
                <div class="col-12 folder-area">
                  <q-btn
                    style="width: 100%"
                    size="2px"
                    color="light-blue"
                    :icon="folderIcon"
                    @click="folder"
                  />
                </div>
              </template>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <c-tab
      class="q-mt-sm"
      type="tabcard"
      align="left"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          ref="swp-tab"
          :is="tab.component"
          :key="tab.componentKey"
          :workPermit="workPermit"
          :supWork="tab.supWork"
          :gridLoto="gridLoto"
          :isOld="isOld"
          :isWriting="isWriting"
          :confiFlag="confiFlag"
          :saveCall="saveCall"
          :saveAction="saveAction"
          :height="tabHeight"
          @saveWorkPermit="saveWorkPermit"
          @saveWorkPermitCallback="saveWorkPermitCallback"
          @validResult="validResult"
        />
      </template>
      <template v-slot:customTab>
        <q-tab name="references" icon="description" :label="$language('관련정보')" />
      </template>
      <template v-slot:customTabPanel>
        <q-tab-panel name="references">
          <keep-alive>
            <component
              :is="referencesCompo"
              :key="referencesKey"
              :workPermit="workPermit"
              :gridLoto="gridLoto"
              :supWorks="supWorks"
              :saveCall="saveCall"
              :isWriting="isWriting"
              :height="tabHeight"
            />
          </keep-alive>
        </q-tab-panel>
      </template>
    </c-tab>
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
import eventBus from '@utils/eventBus'

import { workGasItemType } from '@views/sop/swp/base/workGasItem'
import {
  checklistItemType,
  checklistResultType,
  gasCheckValueType,
  supWorkType,
  workPermitPopupParamType,
  workPermitType
} from '@views/sop/swp/safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safeWorkPermitDetailAppr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
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
  popupParam: workPermitPopupParamType
  contentHeight?: string
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
      sopWorkPermitId: '',
      permitTypeCd: '',
      isApprContent: false,
      approvalDocType: ''
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const workPermit = ref<workPermitType>({
  sopWorkPermitId: '', // 작업허가서 일련번호
  plantCd: '', // 사업장 코드
  sopName: '', // 작업명
  mdmSopId: '', // 안전작업 표준 일련번호_SOP에서 불러와서 관련 정보 표시후 수정
  permitNo: '', // 허가번호_(YYYYMMDD-01)
  swpStepCd: '', // 진행단계 코드
  applicationDeptCd: '', // 신청인 부서코드
  applicationDeptName: '',
  applicationUserId: '', // 신청인 ID
  applicationUserName: '',
  permitTypeCd: '', // 허가서 구분_화기/일반
  permitDate: '', // 허가일
  workStartTime: '', // 작업시작시간
  workEndTime: '', // 작업종료시간
  workTime: [], // 작업시간
  processCd: '', // 작업공정
  workLocation: '', // 작업장소
  equipmentCd: '', // 설비번호_설비마스터
  workSummary: '', // 작업개요
  specialRequirements: '', // 특별요구사항
  cancelRemark: '', // 취소사유
  actionRemark: '', // 조치사항
  maintenanceDeptCheckUserId: '', // 정비부서 책임자 - 안전조치확인
  maintenanceDeptEntryUserId: '', // 정비부서 입회자 - 안전조치확인
  workCompleteTime: '', // 작업완료시간
  workCompleteEntryUserId: '', // 작업완료 입회자/확인자
  workCompleteWorkUserId: '', // 작업완료 작업자
  issuedDeptCd: '', // 발급자 부서코드
  issuedUserId: '', // 발급자 ID
  workManagerId: '', //담당자id
  approvalDeptCd: '', // 승인자 부서코드
  approvalUserId: '', // 승인자 ID
  relationCooperation1DeptCd: '', // 관련부서 협조자1 부서코드
  relationCooperation1UserId: '', // 관련부서 협조자1 ID
  relationCooperation2DeptCd: '', // 관련부서 협조자2 부서코드
  relationCooperation2UserId: '', // 관련부서 협조자2 ID
  vendorCd: '', // 작업업체 코드
  overWorkFlag: '', // 연장작업 여부
  psmFlag: 'N', // PSM 관련 여부
  sopMocId: '', // MOC 일련번호
  assessWriteUserId: '', // 작업위험성평가_작성자 ID
  assessApprovalUserId: '', // 작업위험성평가_승인자 ID
  swpWorkRequestCd: '', // 작업허가요청
  returnRemark: '', // 반려사유
  vendorFlag: 0, // 업체작성여부
  sopAssessmentCheckTypeCd1: '', // 잠재위험요소1
  sopAssessmentCheckTypeCd2: '', // 잠재위험요소2
  sopAssessmentCheckTypeCd3: '', // 잠재위험요소3
  sopAssessmentCheckTypeCd4: '', // 잠재위험요소4
  sopAssessmentCheckTypeCd5: '', // 잠재위험요소5
  sopAssessmentCheckTypeCd6: '', // 잠재위험요소6
  sopConstructionId: '',
  fireWatchmanId: '', // 화재감시자
  fireWorkClassification: '', // 화기 작업구분
  fireWorkClassificationEtc: '', // 화기 작업구분
  fireSafetyManagerId: '', // 소방안전관리자
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  supWorks: [],
  deleteSupWorks: [],
  checkResults: [],
  deleteCheckResults: [],
  gases: [], // 조회용
  gasChecks: [], // 저장용
  deleteGasChecks: [],
  deleteGasCheckVals: [],
  maps: [],
  deleteMaps: [],
  workers: [],
  deleteWorkers: [],
  assessments: [],
  deleteAssessments: [],
  overs: [],
  deleteOvers: [],
  protectiveGears: [],
  deleteProtectiveGears: [],
  lotos: [],
  deleteLotos: [],
  checklistResults: [],
  deleteChecklistResults: [],
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '' // 결재관련 결재요청코드
})
const supWorks = ref<Array<string>>([])
const visible = ref(false)
const folderIcon = ref('expand_more')
const tab = ref('')
const tabItems = ref<Array<tabItemsType>>([])
const grid = ref({
  columns: [
    {
      name: 'overTime',
      field: 'overTime',
      label: '시간',
      align: 'center',
      // style: 'width:100px',
      sortable: true,
      type: 'datetime',
      minuteStep: 10
    },
    {
      name: 'overReason',
      field: 'overReason',
      label: '사유',
      align: 'left',
      style: 'width:200px',
      sortable: true,
      type: 'text'
    }
  ],
  data: [],
  height: '110px'
})
const gridLoto = ref({
  columns: [
    {
      name: 'equipmentNo',
      field: 'equipmentNo',
      label: '설비관리번호',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      style: 'width:150px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      required: true,
      name: 'sopLotoTypeCd',
      field: 'sopLotoTypeCd',
      label: '잠금장치',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'SOP_LOTO_TYPE_CD'
    },
    {
      name: 'equipmentLocation',
      field: 'equipmentLocation',
      label: '설비위치',
      align: 'center',
      style: 'width:150px',
      sortable: true
    }
  ],
  height: '350px'
})
const gasItems = ref<Array<workGasItemType>>([])
const fireChecklist = ref<Array<checklistItemType>>([])
const cancelFlag = ref(false)
const overFlag = ref(false)
const completeFlag = ref(false)
const disableCancel = ref(false)
const disableComplete = ref(false)
const saveAction = ref('')
const detailUrl = ref('')
const listGasItemUrl = ref('')
const listFireChecklistItemUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const overUrl = ref('')
const cancelUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const saveCall = ref({
  saveCallData: ''
})
const tableOver = ref<any>(null)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  return '700px'
})
const overTimeOption = computed(() => {
  const returnData = {
    start: '17:00',
    step: '00:10',
    end: '23:50'
  }
  if (workPermit.value.overs && workPermit.value.overs.length > 0) {
    returnData.start = workPermit.value.overs[workPermit.value.overs.length - 1].overTime
  }
  return returnData
})
const isOld = computed(() => Boolean(props.popupParam.sopWorkPermitId))
const referencesCompo = computed(() => {
  return defineAsyncComponent(() => import(`@views/sop/swp/swpReferences.vue`))
})
const referencesKey = computed(() => uid())
const disabled = computed(
  () =>
    // 모든 입력폼이 비활성화 되는 상황
    isOld.value &&
    // - 취소  - 작업완료
    (workPermit.value.swpStepCd === 'SS00000015' || workPermit.value.swpStepCd === 'SS00000020')
)
const isWorkInfo = computed(
  () =>
    // 작업 승인이 났으며 작업이 진행중인 상황
    // - 승인완료  - 연장
    isOld.value && workPermit.value.swpStepCd !== 'SS00000001'
)
const isWriting = computed(
  () =>
    // 허가서 작성중인 상황
    // - 작성중 - 결재중이 아닌경우
    !isOld.value || workPermit.value.swpStepCd === 'SS00000001'
)
const saveBtnLabel = computed(() =>
  !isOld.value || workPermit.value.swpStepCd === 'SS00000001'
    ? '일괄저장'
    : '취소 - 연장 - 완료 처리'
)
const tableTimePickerOptions = computed(() => {
  const returnData = {
    colName: 'overTime',
    start: '17:00',
    step: '00:10',
    end: '23:50'
  }
  if (workPermit.value.workTime && workPermit.value.workTime.length === 2) {
    returnData.start = workPermit.value.workTime[1]
  }
  return returnData
})
const confiFlag = computed(
  () =>
    // 밀폐공간 보충작업이 선택되어졌는지 여부
    _.indexOf(supWorks.value, 'SSWT000001') > -1
)

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
  detailUrl.value = selectConfig.sop.swp.workPermit.get.url
  listGasItemUrl.value = selectConfig.sop.swp.gas.list.url
  listFireChecklistItemUrl.value = selectConfig.fft.fireFightingPermit.checklistItem.list.url
  saveUrl.value = transactionConfig.sop.swp.workPermit.insert.url
  deleteUrl.value = transactionConfig.sop.swp.workPermit.delete.url
  overUrl.value = transactionConfig.sop.swp.workPermit.over.url
  cancelUrl.value = transactionConfig.sop.swp.workPermit.cancel.url
  completeUrl.value = transactionConfig.sop.swp.workPermit.complete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 작업허가서 상세 조회
 * @param (1): 저장 여부
 *******************************/
function getDetail(flag?: string) {
  if (!tabItems.value) {
    tabItems.value = []
  }
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopWorkPermitId),
      method: 'GET'
    }).then((_result: any) => {
      setTimeout(() => {
        _.extend(workPermit.value, _result.data)
        workPermit.value.workTime =
          workPermit.value.workStartTime && workPermit.value.workEndTime
            ? [workPermit.value.workStartTime, workPermit.value.workEndTime]
            : []
        supWorks.value = _.map(workPermit.value.supWorks, 'supplementWorkTypeCd')

        overFlag.value = workPermit.value.overs && workPermit.value.overs.length > 0
        cancelFlag.value =
          workPermit.value.swpStepCd === 'SS00000015' ||
          workPermit.value.swpWorkRequestCd === 'SWR0000010'
        completeFlag.value =
          workPermit.value.swpStepCd === 'SS00000020' ||
          workPermit.value.swpWorkRequestCd === 'SWR0000015'
        if (flag === 'save') {
          saveCall.value.saveCallData = uid()
        }
        setTabItems(flag)

        // 취소/연장/작업완료인 경우
        const stepVisible = ['SS00000005', 'SS00000010', 'SS00000015', 'SS00000020']
        if (stepVisible.indexOf(workPermit.value.swpStepCd) > -1 && !visible.value) {
          folder()
        }
        getFireChecklist()
      }, 1)
    })
  } else {
    // this.$http.url = this.recentUrl;
    // this.$http.type = 'GET';
    // this.$http.param = {
    //   permitTypeCd: props.popupParam.permitTypeCd,
    //   regUserId: user.value.userId
    // };
    // this.$http.request((_result) => {
    //   if (_result.data) {
    //     /**
    //      * 자신이 작성한 최신 작업허가서 정보 setting
    //      *
    //      * 셋팅 항목
    //      *  1. 허가서 (허가일, 허가작업일, 작업개요, MOC, 연장/취소/완료정보는 가지고 오지 않음)
    //      *  2. 안전조치 요구사항 (허가서)
    //      *  3. 가스농도 (허가서)
    //      *  4. 보호구
    //      */
    //     _.extend(workPermit.value, _result.data);
    //     workPermit.value.workTime = workPermit.value.workStartTime && workPermit.value.workEndTime ?
    //       [workPermit.value.workStartTime, workPermit.value.workEndTime] : []
    //   } else {
    // 작성한 작업허가서 정보가 없는 경우 default setting
    workPermit.value.permitTypeCd = props.popupParam.permitTypeCd
    workPermit.value.applicationDeptCd = user.value.deptCd
    workPermit.value.applicationDeptName = user.value.deptName
    workPermit.value.applicationUserId = user.value.userId
    workPermit.value.applicationUserName = user.value.userName
    workPermit.value.permitDate = getToday()
    workPermit.value.workTime = ['08:00', '17:00']
    workPermit.value.workManagerId = user.value.userId
    workPermit.value.issuedUserId = user.value.userId
    workPermit.value.issuedDeptCd = user.value.deptCd
    setTabItems(flag)
    getFireChecklist()
    //   }
    //   this.setTabItems(flag);
    //   this.getFireChecklist();
    // },);
  }
}
/******************************
 * TODO (목적): 화기 허가서인 경우 화기에 따른 체크리스트 조회
 *******************************/
function getFireChecklist() {
  $http({
    url: listFireChecklistItemUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
    fireChecklist.value = _result.data

    if (!isOld.value && props.popupParam.permitTypeCd === 'SPT0000005') {
      workPermit.value.checklistResults = _.map(
        _.filter(fireChecklist.value, { supplementWorkTypeCd: '' }),
        (item) => {
          return {
            sopFireFightingPermitChecklistResultId: uid(), // 소방공사 체크리스트 결과 일련번호
            sopWorkPermitId: props.popupParam.sopWorkPermitId, // 작업허가서 일련번호
            sopFireFightingPermitChecklistItemId: item.sopFireFightingPermitChecklistItemId, // 소방공사 체크리스트 항목 일련번호
            supplementWorkTypeCd: item.supplementWorkTypeCd, // 보충작업구분 (화기 / 밀폐)
            checklistItemName: item.checklistItemName, // 소방공사 체크리스트 항목명
            textFlag: item.textFlag, // 텍스트 여부
            checklistResult: item.textFlag === 'N' ? 'O' : '', // 체크리스트 결과
            regUserId: user.value.userId, // 등록자
            editFlag: 'C'
          }
        }
      ) as Array<checklistResultType>
    }
  })
}
/******************************
 * TODO (목적): 작업허가서 보충작업에 따른 탭 셋팅
 * @param (1): 저장 여부
 *******************************/
function setTabItems(flag?: string) {
  // tabItems.value = [];
  if (props.popupParam.permitTypeCd === 'SPT0000001') {
    if (checkTab('normal')) {
      tabItems.value.push({
        componentKey: uid(),
        name: 'normal',
        icon: 'engineering',
        class: 'tab-lightblue',
        label: '일반',
        component: shallowRef(defineAsyncComponent(() => import(`@views/sop/swp/swpNormal.vue`)))
      })
    }
  } else {
    if (checkTab('fire')) {
      tabItems.value.push({
        componentKey: uid(),
        name: 'fire',
        icon: 'local_fire_department',
        class: 'tab-red',
        label: '화기',
        component: shallowRef(defineAsyncComponent(() => import(`@views/sop/swp/swpFire.vue`)))
      })
    }
  }
  if (workPermit.value.supWorks && workPermit.value.supWorks.length > 0) {
    _.forEach(workPermit.value.supWorks, (supWork) => {
      const checkIdx = _.findIndex(tabItems.value, {
        supplementWorkTypeCd: supWork.supplementWorkTypeCd
      })
      if (checkIdx === -1) {
        let pushData = {}
        switch (supWork.supplementWorkTypeCd) {
          case 'SSWT000001':
            pushData = {
              componentKey: uid(),
              name: supWork.supplementWorkTypeCd,
              class: 'tab-bluegrey',
              icon: 'masks',
              label: '밀폐공간',
              component: shallowRef(
                defineAsyncComponent(() => import(`@views/sop/swp/swpConfinedSpace.vue`))
              ),
              supplementWorkTypeCd: supWork.supplementWorkTypeCd,
              supWork: supWork
            }
            break
          case 'SSWT000005':
            pushData = {
              componentKey: uid(),
              name: supWork.supplementWorkTypeCd,
              class: 'tab-bluegrey',
              icon: 'flash_off',
              label: '정전',
              component: shallowRef(
                defineAsyncComponent(() => import(`@views/sop/swp/swpBlackout.vue`))
              ),
              supplementWorkTypeCd: supWork.supplementWorkTypeCd,
              supWork: supWork
            }
            break
          case 'SSWT000010':
            pushData = {
              componentKey: uid(),
              name: supWork.supplementWorkTypeCd,
              class: 'tab-bluegrey',
              icon: 'warning',
              label: '방사선',
              component: shallowRef(
                defineAsyncComponent(() => import(`@views/sop/swp/swpRadiation.vue`))
              ),
              supplementWorkTypeCd: supWork.supplementWorkTypeCd,
              supWork: supWork
            }
            break
          case 'SSWT000015':
            pushData = {
              componentKey: uid(),
              name: supWork.supplementWorkTypeCd,
              class: 'tab-bluegrey',
              icon: 'hardware',
              label: '굴착',
              component: shallowRef(
                defineAsyncComponent(() => import(`@views/sop/swp/swpExcavation.vue`))
              ),
              supplementWorkTypeCd: supWork.supplementWorkTypeCd,
              supWork: supWork
            }
            break
          case 'SSWT000020':
            pushData = {
              componentKey: uid(),
              name: supWork.supplementWorkTypeCd,
              class: 'tab-bluegrey',
              icon: 'stairs',
              label: '고소',
              component: shallowRef(
                defineAsyncComponent(() => import(`@views/sop/swp/swpHighPlace.vue`))
              ),
              supplementWorkTypeCd: supWork.supplementWorkTypeCd,
              supWork: supWork
            }
            break
          case 'SSWT000025':
            pushData = {
              componentKey: uid(),
              name: supWork.supplementWorkTypeCd,
              class: 'tab-bluegrey',
              icon: 'agriculture',
              label: '중장비',
              component: shallowRef(
                defineAsyncComponent(() => import(`@views/sop/swp/swpHeavyEquipment.vue`))
              ),
              supplementWorkTypeCd: supWork.supplementWorkTypeCd,
              supWork: supWork
            }
            break
          default:
        }
        if (checkTab(supWork.supplementWorkTypeCd)) {
          tabItems.value.push(pushData)
        }
      } else {
        tabItems.value[checkIdx].supWork = supWork
      }
    })
    const deleteItems: Array<tabItemsType> = []
    _.forEach(tabItems.value, (item) => {
      if (
        _.findIndex(workPermit.value.supWorks, (supWork) => {
          return supWork.supplementWorkTypeCd === item.supplementWorkTypeCd
        }) === -1 &&
        item.name !== 'normal' &&
        item.name !== 'fire'
      ) {
        deleteItems.push(item)
      }
    })
    if (deleteItems && deleteItems.length > 0) {
      _.forEach(deleteItems, (delItem) => {
        tabItems.value = _.reject(tabItems.value, delItem)
      })
    }
  } else {
    // 허가서를 제외한 나머지 보충작업 삭제
    tabItems.value = _.filter(tabItems.value, (item) => {
      return item.name === 'normal' || item.name === 'fire'
    })
  }

  if (tabItems.value && tabItems.value.length > 0) {
    const deleteItems: Array<tabItemsType> = []
    _.forEach(tabItems.value, (item) => {
      if (
        item.supplementWorkTypeCd &&
        _.findIndex(workPermit.value.supWorks, {
          supplementWorkTypeCd: item.supplementWorkTypeCd
        }) === -1
      ) {
        deleteItems.push(item)
      }
    })
    _.forEach(deleteItems, (item) => {
      tabItems.value = tabItems.value.splice(_.findIndex(tabItems.value, { name: item.name }), 1)
    })
  }

  tab.value =
    _.findIndex(tabItems.value, { name: tab.value }) > -1 || tab.value === 'references'
      ? tab.value
      : props.popupParam.permitTypeCd === 'SPT0000001'
        ? 'normal'
        : 'fire'

  // 저장하고 난 후 조치
  if (flag === 'save') {
    saveAction.value = uid()
  }
}
/******************************
 * TODO (목적): 탭 존재여부 확인
 * @param (1): 탭 정보
 * @return (반환): 탭 index
 *******************************/
function checkTab(tab: string) {
  return _.findIndex(tabItems.value, { name: tab }) === -1
}
/******************************
 * TODO (목적): 보충작업 변경 시 그에 따른 보충작업 데이터 셋팅
 *******************************/
function changeSupWork() {
  /* 보충작업이 입력되었을 경우
        - workPermit.value.supWorks에 영향을 준다.
        - this.setTabItems() method를 호출한다. */
  // ## 추가된 보충작업을 넣는 과정
  if (supWorks.value && supWorks.value.length > 0) {
    _.forEach(supWorks.value, (supWork) => {
      if (_.findIndex(workPermit.value.supWorks, { supplementWorkTypeCd: supWork }) === -1) {
        workPermit.value.supWorks.push({
          sopWorkPermitId: props.popupParam.sopWorkPermitId
            ? props.popupParam.sopWorkPermitId
            : uid(), // 작업허가서 일련번호
          supplementWorkTypeCd: supWork, // 보충작업구분
          workProposalNo: '', // 작업 신청번호_방사선, 고소, 중장비
          workLocation: '', // 작업장소_방사선, 고소, 중장비
          workSummary: '', // 작업개요_고소, 방사선,굴착, 중장비
          issuedDeptCd: '', // 발급자 부서코드
          issuedUserId: '', // 발급자 ID
          approvalDeptCd: '', // 승인자 부서코드
          approvalUserId: '', // 승인자 ID
          maintenanceDeptCheckUserId: '', // 정비부서 책임자 - 안전조치확인
          maintenanceDeptEntryUserId: '', // 정비부서 입회자 - 안전조치확인
          relationCooperation1DeptCd: '', // 관려부서 협조자1 부서코드
          relationCooperation1UserId: '', // 관련부서 협조자1 ID
          relationCooperation2DeptCd: '', // 관려부서 협조자2 부서코드
          relationCooperation2UserId: '', // 관련부서 협조자2 ID
          specialRequirements: '', // 특별요구사항
          closeMachine: '', // (밀폐)장치명
          closeEntryResaon: '', // (밀폐)출입사유
          closeEntryUserIds: '', // (밀폐)출입자id_구분자이용 복수등록
          closeEntryUserNames: '', // (밀폐)출입자명_구분자이용 복수등록
          entrants: [],
          closeExpectedRisk: '', // (밀폐)예상위험
          blackoutCircuitBreaker: '', // (정전)차단기기
          blackoutCircuitBreakerNo: '', // (정전)차단기 번호
          blackoutPowerRecoveryRequestUserId: '', // (정전)전원복구 요청자
          blackoutPowerRecoveryTime: '', // (정전)전원복구 시간
          blackoutElectricBlockUserId: '', // (정전)차단확인자(전기)
          blackoutMaintenanceBlockUserId: '', // (정전)차단확인자(정비)
          radiationResponsibleUserId: '', // (방사선)방사능 책임자
          heavyEquipSafetyCheckUserId: '', // (중장비)안전조치 확인자
          heavyEquipManageUserId: '', // (중장비)장비관리 책임자
          heavyEquipDriveUserId: '', // (중장비)운전원
          heavySignalMan: '', // (중장비) 신호수
          heavyType: '', // (중장비) 중장비 종류
          heavyEquipDirectorRequirements: '', // (중장비) 감독 요구사항
          heavyEquipRequireDeptRequirements: '', // (중장비)요청부서 요구사항
          heavyEquipSupportDeptRequirements: '', // (중장비) 지원부서 요구사항
          regUserId: user.value.userId, // 등록자 ID
          chgUserId: '', // 수정자 ID
          checkResults: [], // 안전조치항목
          gases: [], // 가스항목측정 ** 사용하지 않는 보충작업도 존재하지만 빈 배열을 할당시켜 관리
          gasChecks: [], // 저장용
          deleteGasChecks: [],
          deleteGasCheckVals: [],
          editFlag: 'C',
          sketchSrc: ''
        })

        // 소방공사
        if (supWork === 'SSWT000001' && props.popupParam.permitTypeCd === 'SPT0000005') {
          // 화기허가서이면서 밀폐보충작업이 추가된 경우
          workPermit.value.checklistResults = _.concat(
            workPermit.value.checklistResults,
            _.map(_.filter(fireChecklist.value, { supplementWorkTypeCd: 'SSWT000001' }), (item) => {
              return {
                sopFireFightingPermitChecklistResultId: uid(), // 소방공사 체크리스트 결과 일련번호
                sopWorkPermitId: props.popupParam.sopWorkPermitId, // 작업허가서 일련번호
                sopFireFightingPermitChecklistItemId: item.sopFireFightingPermitChecklistItemId, // 소방공사 체크리스트 항목 일련번호
                supplementWorkTypeCd: item.supplementWorkTypeCd, // 보충작업구분 (화기 / 밀폐)
                checklistItemName: item.checklistItemName, // 소방공사 체크리스트 항목명
                textFlag: item.textFlag, // 텍스트 여부
                checklistResult: item.textFlag === 'N' ? 'O' : '', // 체크리스트 결과
                regUserId: user.value.userId, // 등록자
                editFlag: 'C'
              }
            })
          )
        }
      }
    })
  }

  // ## 삭제된 보충작업을 빼는 과정
  if (workPermit.value.supWorks && workPermit.value.supWorks.length > 0) {
    const deleteItems: Array<supWorkType> = []
    _.forEach(workPermit.value.supWorks, (item) => {
      if (_.indexOf(supWorks.value, item.supplementWorkTypeCd) === -1) {
        deleteItems.push(item)
      }
    })

    if (!workPermit.value.deleteSupWorks) workPermit.value.deleteSupWorks = []
    if (!workPermit.value.deleteChecklistResults) workPermit.value.deleteChecklistResults = []
    _.forEach(deleteItems, (deleteItem) => {
      // 소방공사
      if (deleteItem.supplementWorkTypeCd === 'SSWT000001') {
        // 밀폐공간 보충작업이 제거되는 경우
        const filteringData = _.filter(workPermit.value.checklistResults, (filterItem) => {
          return filterItem.editFlag !== 'C' && filterItem.supplementWorkTypeCd === 'SSWT000001'
        })
        if (
          filteringData &&
          filteringData.length > 0 &&
          _.findIndex(workPermit.value.deleteChecklistResults, {
            supplementWorkTypeCd: 'SSWT000001'
          }) === -1
        ) {
          workPermit.value.deleteChecklistResults = _.concat(
            workPermit.value.deleteChecklistResults,
            _.filter(workPermit.value.checklistResults, {
              supplementWorkTypeCd: 'SSWT000001'
            })
          )
        }
        workPermit.value.checklistResults = _.reject(workPermit.value.checklistResults, {
          supplementWorkTypeCd: 'SSWT000001'
        })
      }

      if (
        _.findIndex(workPermit.value.deleteSupWorks, {
          supplementWorkTypeCd: deleteItem.supplementWorkTypeCd
        }) === -1 &&
        deleteItem.editFlag !== 'C'
      ) {
        workPermit.value.deleteSupWorks.push(deleteItem)
      }
      const idx = _.findIndex(workPermit.value.supWorks, {
        supplementWorkTypeCd: deleteItem.supplementWorkTypeCd
      })
      workPermit.value.supWorks.splice(idx, 1)
    })
  }
  setTabItems()
}
/******************************
 * TODO (목적): 취소 카드 클릭
 *******************************/
function qCardCancelClick() {
  if (editable.value && !disabled.value && !disableCancel.value) {
    cancelFlag.value = !cancelFlag.value
    changeCancel(cancelFlag.value)
  }
}
/******************************
 * TODO (목적): 취소 시 완료 영역 비활성화
 * @param (1): 취소 영역 체크 여부
 *******************************/
function changeCancel(val: boolean) {
  if (val) {
    disableComplete.value = true
  } else {
    disableComplete.value = false
    workPermit.value.cancelRemark = ''
  }
}
/******************************
 * TODO (목적): 연장 카드 클릭
 *******************************/
function qCardOverClick() {
  if (editable.value && !disabled.value) {
    overFlag.value = !overFlag.value
    changeOver(overFlag.value)
  }
}
/******************************
 * TODO (목적): 연장 여부에 따른 연장 정보 표시 셋팅
 * @param (1): 연장 영역 체크 여부
 *******************************/
function changeOver(val: boolean) {
  if (!val) {
    if (workPermit.value.overs && workPermit.value.overs.length > 0) {
      message.confirm({
        title: '확인',
        message: '연장을 해제하시면 연장정보가 사라집니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          if (!workPermit.value.deleteOvers) workPermit.value.deleteOvers = []
          _.forEach(workPermit.value.overs, (over) => {
            if (
              _.findIndex(workPermit.value.deleteOvers, {
                sopOverResultId: over.sopOverResultId
              }) === -1
            ) {
              workPermit.value.deleteOvers.push(_.clone(over))
            }
          })
          workPermit.value.overs = []
        },
        // 취소 callback 함수
        cancelCallback: () => {
          overFlag.value = true
        }
      })
    }
  }
}
/******************************
 * TODO (목적): 완료 카드 클릭
 *******************************/
function qCardCompleteClick() {
  if (editable.value && !disabled.value && !disableComplete.value) {
    completeFlag.value = !completeFlag.value
    changeComplete(completeFlag.value)
  }
}
/******************************
 * TODO (목적): 완료 체크 시 취소 영역 비활성화
 * @param (1): 완료 영역 체크 여부
 *******************************/
function changeComplete(val: boolean) {
  if (val) {
    disableCancel.value = true
  } else {
    disableCancel.value = false
    workPermit.value.actionRemark = ''
    workPermit.value.workCompleteEntryUserId = ''
    workPermit.value.workCompleteWorkUserId = ''
    workPermit.value.workCompleteTime = ''
  }
}
/******************************
 * TODO (목적): 연장 추가
 *******************************/
function addOver() {
  workPermit.value.overs.push({
    sopOverResultId: uid(), // 작업허가서 연장정보 번호
    sopWorkPermitId: workPermit.value.sopWorkPermitId, // 작업허가서 일련번호
    overTime: '', // 연장시간
    overReason: '', // 연장사유
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 연장 제거
 *******************************/
function removeOver() {
  const selectData = tableOver.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '제외할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!workPermit.value.deleteOvers) {
      workPermit.value.deleteOvers = []
    }
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(workPermit.value.deleteOvers, {
          sopOverResultId: item.sopOverResultId
        }) === -1
      ) {
        workPermit.value.deleteOvers.push(item)
      }
      workPermit.value.overs = _.reject(workPermit.value.overs, item)
    })
    tableOver.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 취소 & 연장 & 완료 영역 접기/펼치기
 *******************************/
function folder() {
  visible.value = !visible.value
  if (visible.value) {
    folderIcon.value = 'expand_less'
  } else {
    folderIcon.value = 'expand_more'
  }
}
/******************************
 * TODO (목적): 작업허가서 저장
 *******************************/
function saveWorkPermit() {
  if (isOld.value) {
    saveUrl.value = transactionConfig.sop.swp.workPermit.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.swp.workPermit.insert.url
    mappingType.value = 'POST'
    workPermit.value.swpStepCd = 'SS00000001' // 작성중
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      eventBus.$emit('vaildForm', 'save')
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 각 상황별 유효성 체크 및 후속처리 호출
 * @param (1): 유효성 통과 여부
 * @param (2): 상황
 *******************************/
function validResult(_result: boolean, type: string) {
  if (_result && validTable(gridLoto.value.columns, workPermit.value.lotos, null, true)) {
    if (type === 'save' || type === 'reqApproval') {
      let messageContents = '저장하시겠습니까?'
      /* 1. 작업승인을 하지 않은 경우 일반 저장 처리
       * 2. 취소를 체크한 경우 작업완료 체크여부 확인
       *                      취소사유 기입 되었는지 확인
       * 3. 연장만 체크한 경우 연장 정보가 들어갔는지 확인
       * 4. 완료를 체크한 경우 취소 체크여부 확인
       */
      if (overFlag.value) {
        // 연장을 체크한 경우
        if (!workPermit.value.overs || workPermit.value.overs.length === 0) {
          message.alert({
            title: '안내',
            message: '연장된 정보를 하나 이상 입력하십시오.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
        saveUrl.value = transactionConfig.sop.swp.workPermit.over.url
        mappingType.value = 'PUT'
        messageContents = '작업 연장하시겠습니까?'
      }
      if (cancelFlag.value) {
        // 취소가 체크된 경우
        if (completeFlag.value) {
          message.alert({
            title: '안내',
            message: '완료와 취소는 동시에 진행 할 수 없습니다. 하나를 선택 하세요.',
            type: 'warning' // success / info / warning / error
          })
          return
        } else if (!workPermit.value.cancelRemark) {
          message.alert({
            title: '안내',
            message: '취소사유를 입력하시기 바랍니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
        saveUrl.value = transactionConfig.sop.swp.workPermit.cancel.url
        mappingType.value = 'PUT'
        messageContents = '작업 취소하시겠습니까?'
      }
      if (completeFlag.value) {
        // 완료를 체크한 경우
        if (cancelFlag.value) {
          message.alert({
            title: '안내',
            message: '완료와 취소는 동시에 진행 할 수 없습니다. 하나를 선택 하세요.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
        saveUrl.value = transactionConfig.sop.swp.workPermit.complete.url
        mappingType.value = 'PUT'
        messageContents = '작업 완료하시겠습니까?'
      }
      if (type === 'reqApproval') {
        messageContents = '업체요청 승인하시겠습니까?'
      }
      // 유효성체크 :  각 탭 별 유효성 체크 필요 ** 해당 부분 만들어야 함
      message.confirm({
        title: '확인',
        message: messageContents,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          const promises = [
            {
              func: getGasItems
            },
            {
              func: setSaveValue
            },
            {
              func: saveValue
            }
          ]
          orderedPromise(promises)
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    }
  } else {
    message.validError()
  }
}
/******************************
 * TODO (목적): 가스 측정 항목 조회
 *******************************/
function getGasItems() {
  return new Promise((resolve) => {
    $http({
      url: listGasItemUrl.value,
      method: 'GET',
      params: {
        plantCd: workPermit.value.plantCd
      }
    })
      .then((_result: any) => {
        gasItems.value = _result.data
        resolve(true)
      })
      .catch((_error) => {
        resolve(false)
      })
  })
}
/******************************
 * TODO (목적): 저장 하기 전 데이터 셋팅
 *******************************/
function setSaveValue() {
  return new Promise((resolve) => {
    workPermit.value.regUserId = user.value.userId
    workPermit.value.chgUserId = user.value.userId

    workPermit.value.workStartTime = workPermit.value.workTime[0]
    workPermit.value.workEndTime = workPermit.value.workTime[1]

    setGasData('permit')
    setGasData('supwork')
    resolve(true)
  })
}
/******************************
 * TODO (목적): 가스 데이터 셋팅
 * @param (1): 허가/보충작업 구분
 *******************************/
function setGasData(target: string) {
  let targetArray: Array<workPermitType> | Array<supWorkType> = []
  // let targetArray = []
  if (target === 'permit') {
    targetArray = [workPermit.value]
  } else {
    targetArray = workPermit.value.supWorks
  }
  // const targetArray: Array<workPermitType> = [workPermit.value]
  if (targetArray && targetArray.length > 0) {
    targetArray.forEach((targetObj) => {
      if (targetObj.gases && targetObj.gases.length > 0) {
        _.forEach(targetObj.gases, (gas) => {
          const gasValues: Array<gasCheckValueType> = []
          if (gasItems.value && gasItems.value.length > 0) {
            _.forEach(gasItems.value, (gasItem) => {
              if (gas[gasItem.sopGasId]) {
                gasValues.push({
                  sopGasCheckId: gas.sopGasCheckId, // 가스농도측정번호
                  sopGasId: gasItem.sopGasId, // 가스번호
                  measurement: gas[gasItem.sopGasId], // 측정치
                  regUserId: gas.regUserId, // 등록자 ID
                  chgUserId: gas.chgUserId, // 수정자 ID
                  editFlag: gas.editFlag
                })
              }
            })
          }
          if (!targetObj.gasChecks) targetObj.gasChecks = []
          targetObj.gasChecks.push({
            sopGasCheckId: gas.sopGasCheckId, // 가스농도측정번호
            sopWorkPermitId: workPermit.value.sopWorkPermitId, // 작업허가서 일련번호
            supplementWorkTypeCd: target === 'permit' ? '' : targetObj.supplementWorkTypeCd, // 보충작업구분
            checkTime: gas.checkTime, // 점검시간
            gasCheckMachine: gas.gasCheckMachine, // 점검기기명
            gasCheckUserId: gas.gasCheckUserId, // 점검자
            gasConfirmUserId: gas.gasConfirmUserId, // 확인자(입회자)
            regUserId: gas.regUserId, // 등록자 ID
            chgUserId: gas.chgUserId, // 수정자 ID
            editFlag: gas.editFlag,
            gasValues: gasValues
          })
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장 진행
 *******************************/
function saveValue() {
  return new Promise((resolve) => {
    isSave.value = !isSave.value
    resolve(true)
  })
}
/******************************
 * TODO (목적): 작업허가서 저장 후 처리
 * @param (1): 작업허가서 id 담은 object
 *******************************/
function saveWorkPermitCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopWorkPermitId = result.data
  getDetail('save')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <q-form ref="editForm">
    <c-card title="화기작업 상세정보" class="cardClassDetailForm no-margin">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :required="true"
            :disabled="!isWriting"
            :editable="editable"
            label="작업개요"
            name="workSummary"
            v-model:value="workPermit.workSummary"
          />
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-task-target
            :disabled="!isWriting"
            :editable="editable"
            :customPopupParam="{ targetKey: 'process' }"
            label="단위공정"
            name="processCd"
            v-model:value="workPermit.processCd"
          />
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            :disabled="!isSopEdit || !isWriting"
            :afterIcon="
              editable && isWriting
                ? [
                    { name: 'mode_edit', click: true, callbackName: 'sopEdit', color: '' },
                    { name: 'search', click: true, callbackName: 'searchSop', color: 'teal' },
                    { name: 'close', click: true, callbackName: 'removeSop', color: 'red' }
                  ]
                : null
            "
            label="작업명"
            name="sopName"
            v-model:value="workPermit.sopName"
            @sopEdit="sopEdit"
            @searchSop="searchSop"
            @removeSop="removeSop"
          />
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-task-target
            :disabled="!isWriting"
            :editable="editable"
            :customPopupParam="{ targetKey: 'vendor' }"
            label="작업업체"
            name="vendorCd"
            v-model:value="workPermit.vendorCd"
            @dataChange="vendorChange"
          />
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-text
            :disabled="!isWriting"
            :editable="editable"
            label="작업장소"
            name="workLocation"
            v-model:value="workPermit.workLocation"
          />
        </div>
        <div v-if="!isVendorReqeust" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable && isWriting"
            label="MOC번호"
            name="sopMocId"
            v-model:value="workPermit.sopMocId"
          />
          <!-- <c-moc
            :editable="editable"
            :disabled="!isWriting"
            :isSubmit="saveCall.saveCallData"
            :document="workPermit"
            :documentId="workPermit.sopWorkPermitId"
            documentTitle="workSummary"
            mocRelatedTaskCd="RT00000020"
            label="MOC번호"
            name="sopMocId"
            v-model:value="workPermit.sopMocId"
          /> -->
        </div>
        <div v-if="!isVendorReqeust" class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-task-target
            :disabled="!isWriting"
            :editable="editable"
            :plantCd="workPermit.plantCd"
            :processCd="workPermit.processCd"
            :customPopupParam="{ targetKey: 'equip' }"
            label="관련 설비"
            name="equipmentCd"
            v-model:value="workPermit.equipmentCd"
          />
        </div>
        <div v-if="!isVendorReqeust" class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-checkbox
            :disabled="!isWriting"
            :editable="editable"
            :isFlag="true"
            label="PSM 관련 여부"
            name="psmFlag"
            v-model:value="workPermit.psmFlag"
          />
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-text
            :disabled="true"
            :editable="editable"
            label="신청인"
            name="request"
            v-model:value="request"
          />
        </div>
        <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
          <c-field
            :required="true"
            :disabled="!isWriting"
            :editable="editable"
            :data="workPermit"
            :plantCd="workPermit.plantCd"
            deptValue="workManagerDeptCd"
            type="dept_user"
            userType="lnf"
            label="담당자"
            beforeText=""
            name="workManagerId"
            v-model:value="workPermit.workManagerId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <c-checkbox
            :disabled="!isWriting"
            :editable="editable"
            codeGroupCd="SOP_PROTECTIVE_GEAR_CD"
            :isObject="true"
            valueText="sopProtectiveGearName"
            valueKey="sopProtectiveGearCd"
            label="보호구"
            name="protectiveGears"
            v-model:value="workPermit.protectiveGears"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <!-- :style="[isVendorReqeust ? '' : 'margin-top: -20px']" -->
          <c-task-target
            :disabled="!isWriting"
            :editable="editable"
            :customPopupParam="{ targetKey: 'construction' }"
            label="관련 공사"
            name="sopConstructionId"
            v-model:value="workPermit.sopConstructionId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :disabled="!isWriting"
            :editable="editable"
            autogrow
            label="특별요구사항"
            name="specialRequirements"
            v-model:value="workPermit.specialRequirements"
          />
        </div>
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <c-table
          title="안전조치 요구사항"
          style="padding-top: 6px"
          :columns="gridCheck.columns"
          :gridHeight="gridCheck.height"
          :data="workPermit.checkResults"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && isWriting"
          :contentsField="contentsField"
          @table-data-change="tableDataChange"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
        <div class="row">
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <c-card title="발급 정보" class="cardClassDetailForm no-margin">
              <template v-slot:card-detail>
                <div class="col-12">
                  <c-field
                    :required="true"
                    :disabled="!isWriting"
                    :editable="editable"
                    :data="workPermit"
                    deptValue="issuedDeptCd"
                    type="dept_user"
                    label="발급"
                    beforeText=""
                    name="issuedUserId"
                    v-model:value="workPermit.issuedUserId"
                  />
                </div>
                <div class="col-12">
                  <c-field
                    :required="true"
                    :disabled="!isWriting"
                    :editable="editable"
                    :data="workPermit"
                    deptValue="approvalDeptCd"
                    type="dept_user"
                    label="승인"
                    beforeText=""
                    name="approvalUserId"
                    v-model:value="workPermit.approvalUserId"
                  />
                </div>
              </template>
            </c-card>
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <c-card title="협조자 정보" class="cardClassDetailForm no-margin">
              <template v-slot:card-detail>
                <div class="col-12">
                  <c-field
                    :disabled="!isWriting"
                    :editable="editable"
                    :data="workPermit"
                    deptValue="relationCooperation1DeptCd"
                    type="dept_user"
                    label="협조자-1"
                    beforeText=""
                    name="relationCooperation1UserId"
                    v-model:value="workPermit.relationCooperation1UserId"
                  />
                </div>
                <div class="col-12">
                  <c-field
                    :disabled="!isWriting"
                    :editable="editable"
                    :data="workPermit"
                    deptValue="relationCooperation2DeptCd"
                    type="dept_user"
                    label="협조자-2"
                    beforeText=""
                    name="relationCooperation2UserId"
                    v-model:value="workPermit.relationCooperation2UserId"
                  />
                </div>
              </template>
            </c-card>
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <c-card title="안전조치확인 정보" class="cardClassDetailForm no-margin">
              <template v-slot:card-detail>
                <div class="col-12">
                  <c-field
                    :disabled="!isWriting"
                    :editable="editable"
                    :data="workPermit"
                    deptValue="maintenanceDeptCheckDeptCd"
                    type="dept_user"
                    label="책임자"
                    name="maintenanceDeptCheckUserId"
                    v-model:value="workPermit.maintenanceDeptCheckUserId"
                  />
                </div>
                <div class="col-12">
                  <c-field
                    :disabled="!isWriting"
                    :editable="editable"
                    :data="workPermit"
                    deptValue="maintenanceDeptEntryDeptCd"
                    type="dept_user"
                    label="입회자"
                    name="maintenanceDeptEntryUserId"
                    v-model:value="workPermit.maintenanceDeptEntryUserId"
                  />
                </div>
              </template>
            </c-card>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <c-table
              ref="gasTable"
              title="가스농도 측정"
              :columns="gridGas.columns"
              :gridHeight="gridGas.height"
              :data="workPermit.gases"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              :editable="editable && gasEditable"
              selection="multiple"
              rowKey="sopGasCheckId"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable && gasEditable"
                    label="추가"
                    icon="add"
                    :showLoading="false"
                    @btnClicked="addGas"
                  />
                  <c-btn
                    v-if="editable && gasEditable"
                    label="제외"
                    icon="remove"
                    :showLoading="false"
                    @btnClicked="removeGas"
                  />
                  <c-btn
                    v-if="
                      editable &&
                      isOld &&
                      workPermit.swpStepCd !== 'SS00000001' &&
                      gasEditable &&
                      workPermit.gases.length > 0
                    "
                    icon="save"
                    label="저장"
                    @btnClicked="saveSwpGas"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
        </div>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
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
import { checkResultType, workPermitType } from './safeWorkPermit'
import { workGasItemType } from './base/workGasItem'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpFire'
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
const emits = defineEmits(['validResult', 'saveWorkPermit', 'saveWorkPermitCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  workPermit: workPermitType
  isOld: boolean
  isWriting: boolean
  confiFlag: boolean
  saveCall: {
    saveCallData: string
  }
}
interface gridCheckType {
  columns: Array<tableColumnType>
  data: Array<checkResultType>
  height: string
}
interface gridGasType {
  columns: Array<tableColumnType>
  height: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  workPermit: () => {
    return {
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
    }
  },
  isOld: false,
  isWriting: false,
  confiFlag: false,
  saveCall: () => {
    return {
      saveCallData: ''
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
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridCheck = ref<gridCheckType>({
  columns: [],
  data: [],
  height: '613px'
})
const gridGas = ref<gridGasType>({
  columns: [],
  height: '410px'
})
const useGasItems = ref<Array<workGasItemType>>([])
const sopEditing = ref(false)
const listCheckItemUrl = ref('')
const listGasItemUrl = ref('')
const listSopUrl = ref('')
const editForm = ref<any>(null)
const gasTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const request = computed(() =>
  isVendorReqeust.value
    ? props.workPermit.applicationDeptName
    : props.workPermit.applicationDeptName + ' / ' + props.workPermit.applicationUserName
)
const isSopEdit = computed(
  () => Boolean(!props.workPermit.mdmSopId && props.workPermit.sopName) || sopEditing.value
)
const isVendorReqeust = computed(() => props.workPermit.vendorFlag > 0)
const disableEtc = computed(() =>
  props.workPermit.fireWorkClassification
    ? props.workPermit.fireWorkClassification.indexOf('FWC0000020') === -1
    : true
)
const gasEditable = computed(
  () => props.workPermit.swpStepCd !== 'SS00000020' && props.workPermit.swpStepCd !== 'SS00000015'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.workPermit.plantCd,
  () => {
    props.workPermit.checkResults = []
    props.workPermit.gases = []
    getCheckItemList()
    getGasItemList()
  }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  eventBus.$on('vaildForm', (type: string) => {
    if (editForm.value) {
      editForm.value.validate().then((_result: boolean) => {
        emits('validResult', _result, type)
      })
    }
  })
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
  listCheckItemUrl.value = selectConfig.sop.swp.workChekItem.list.url
  listGasItemUrl.value = selectConfig.sop.swp.gas.list.url
  listSopUrl.value = selectConfig.mdm.sop.jobhazard.url
  // code setting
  // list setting
  getCheckItemList()
  getGasItemList()
}
/******************************
 * TODO (목적): 안전조치사항 조회
 *******************************/
function getCheckItemList() {
  /** default 값을 조회
   * 초기인 경우 workPermit.checkResults에 값을 그대로 적용
   * 작성중 단계인 경우 default 값에 새로운 항목이 있을시에 workPermit.checkResults에 추가하여 입력을 받을 수 있도록 조치
   * 승인완료, 연장, 취소, 작업완료인 경우 저장된 데이터를 그대로 표시하며 이 경우 default값을 조회하지 않도록 조치
   */
  gridCheck.value.columns = [
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '항목',
      align: 'left',
      sortable: true
    },
    {
      name: 'necessaryFlag',
      field: 'necessaryFlag',
      label: '필요',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N',
      setHeader: true
    },
    {
      name: 'confirmFlag',
      field: 'confirmFlag',
      label: '확인',
      align: 'center',
      sortable: false,
      type: 'check',
      disableTarget: 'necessaryFlag',
      disableCon: 'Y',
      true: 'Y',
      false: 'N',
      value: 'N',
      setHeader: true
    }
  ]
  if (!props.workPermit.plantCd) return
  if (!props.workPermit.checkResults) props.workPermit.checkResults = []
  if (!props.isOld || props.workPermit.swpStepCd === 'SS00000001') {
    $http({
      url: listCheckItemUrl.value,
      method: 'GET',
      params: {
        plantCd: props.workPermit.plantCd,
        sopWorkTypeCd: 'SWT0000005',
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      if (
        !props.isOld &&
        (!props.workPermit.checkResults || props.workPermit.checkResults.length === 0)
      ) {
        // 최초인 경우 조치항목을 가지고 있지 않음으로 해당 값을 표시
        _.forEach(_result.data, (item) => {
          props.workPermit.checkResults.push({
            sopWorkPermitId: '', // 작업허가서 일련번호
            supplementWorkTypeCd: '', // 보충작업구분
            sopCheckItemId: item.sopCheckItemId, // 점검항목 일련번호
            checkItemName: item.checkItemName, // 점검항목명
            sopCheckItemKindCd: item.sopCheckItemKindCd, // 체크항목 종류
            necessaryFlag: 'N', // 필요
            confirmFlag: 'N', // 확인
            confirmUserId: '', // 확인자
            confirmUserName: '', // 확인자명
            regUserId: user.value.userId, // 등록자 ID
            chgUserId: '', // 수정자 ID
            editFlag: 'C'
          })
        })
      } else {
        _.forEach(_result.data, (item) => {
          if (
            _.findIndex(props.workPermit.checkResults, {
              sopCheckItemId: item.sopCheckItemId
            }) === -1
          ) {
            props.workPermit.checkResults.push({
              sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
              supplementWorkTypeCd: '', // 보충작업구분
              sopCheckItemId: item.sopCheckItemId, // 점검항목 일련번호
              checkItemName: item.checkItemName, // 점검항목명
              sopCheckItemKindCd: item.sopCheckItemKindCd, // 체크항목 종류
              necessaryFlag: 'N', // 필요
              confirmFlag: 'N', // 확인
              confirmUserId: '', // 확인자
              confirmUserName: '', // 확인자명
              regUserId: user.value.userId, // 등록자 ID
              chgUserId: '', // 수정자 ID
              editFlag: 'C'
            })
          }
        })
      }
      if (
        _.findIndex(_result.data, { sopCheckItemKindCd: 'SCIK000005' }) > -1 ||
        _.findIndex(props.workPermit.checkResults, { sopCheckItemKindCd: 'SCIK000005' }) > -1
      ) {
        gridCheck.value.columns.push({
          name: 'confirmUserName',
          field: 'confirmUserName',
          label: '확인자',
          align: 'center',
          sortable: true,
          type: 'user',
          userId: 'confirmUserId',
          disableTarget: 'necessaryFlag',
          disableCon: 'Y',
          setHeader: true
        })
      }
      workClassChange()
    })
  } else {
    if (_.findIndex(props.workPermit.checkResults, { sopCheckItemKindCd: 'SCIK000005' }) > -1) {
      gridCheck.value.columns.push({
        name: 'confirmUserName',
        field: 'confirmUserName',
        label: '확인자',
        align: 'center',
        sortable: true,
        type: 'user',
        userId: 'confirmUserId',
        disableTarget: 'necessaryFlag',
        disableCon: 'Y',
        setHeader: true
      })
    }
  }
}
/******************************
 * TODO (목적): 가스 측정값 조회
 *******************************/
function getGasItemList() {
  const columns: Array<tableColumnType> = [
    {
      name: 'checkTime',
      field: 'checkTime',
      label: '측정시간',
      align: 'center',
      type: 'datetime',
      minuteStep: 10,
      sortable: false,
      style: 'width:15%'
    },
    {
      name: 'gasCheckMachine',
      field: 'gasCheckMachine',
      label: '측정기기',
      align: 'center',
      sortable: false,
      type: 'text',
      value: '',
      setHeader: true,
      style: 'width:15%'
    },
    {
      name: 'gasCheckUserName',
      field: 'gasCheckUserName',
      label: '측정자',
      align: 'center',
      sortable: false,
      type: 'user',
      userId: 'gasCheckUserId',
      value: '',
      setHeader: true,
      style: 'width:10%'
    },
    {
      name: 'gasConfirmUserName',
      field: 'gasConfirmUserName',
      label: '확인자',
      align: 'center',
      sortable: false,
      type: 'user',
      userId: 'gasConfirmUserId',
      value: '',
      setHeader: true,
      style: 'width:10%'
    }
  ]

  $http({
    url: listGasItemUrl.value,
    method: 'GET',
    params: {
      plantCd: props.workPermit.plantCd
      // sopWorkTypeCd: 'SWT0000001',
    }
  }).then((_result: any) => {
    useGasItems.value = []
    if (props.workPermit.gases && props.workPermit.gases.length > 0) {
      const pushData: Array<workGasItemType> = []
      _.forEach(props.workPermit.gases, (gas) => {
        for (const gasValue in gas) {
          const idx = _.findIndex(_result.data, { sopGasId: gasValue })
          const idx2 = _.findIndex(pushData, { sopGasId: gasValue })
          /* idx의 경우 기본적으로 존재여부를 판단하지만 예전 입력된 값 중 useFlag N처리된 값이 있는 경우는 허용 */
          if (idx > -1 && gas[gasValue] !== '-' && idx2 === -1) {
            // _result.data[idx] = 'me'
            // this.$set(_result.data[idx], 'me')
            pushData.push(_result.data[idx])
          }
        }
      })
      if (pushData && pushData.length > 0) {
        _.forEach(pushData, (item) => {
          useGasItems.value.push(item)
          columns.splice(1, 0, {
            // 가스 헤더 적용 로직 추가 필요
            name: item.sopGasId + '_p',
            field: item.sopGasId + '_p',
            label: item.gasName,
            align: 'center',
            sortable: false,
            child: [
              {
                name: item.sopGasId,
                field: item.sopGasId,
                label: item.safetyStandards,
                align: 'center',
                type: 'text',
                sortable: false,
                style: 'width:' + 50 / pushData.length + '%'
              }
            ]
          })
        })
      }
    } else {
      const useYList = _.filter(_result.data, (item) => {
        return (
          item.useFlag === 'Y' && _.findIndex(item.workTypes, { sopWorkTypeCd: 'SWT0000005' }) > -1
        )
      })
      _.forEach(useYList, (gas) => {
        useGasItems.value.push(gas)
        columns.splice(1, 0, {
          // 가스 헤더 적용 로직 추가 필요
          name: gas.sopGasId + '_p',
          field: gas.sopGasId + '_p',
          label: gas.gasName,
          align: 'center',
          sortable: false,
          child: [
            {
              name: gas.sopGasId,
              field: gas.sopGasId,
              label: gas.safetyStandards,
              align: 'center',
              type: 'text',
              sortable: false,
              style: 'width:' + 50 / useYList.length + '%'
            }
          ]
        })
      })
    }

    gridGas.value.columns = columns
  })
}
/******************************
 * TODO (목적): 가스 추가
 *******************************/
function addGas() {
  const pushData: any = {
    sopGasCheckId: uid(), // 가스농도측정번호
    sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
    supplementWorkTypeCd: 'SWT0000005', // 보충작업구분
    checkTime: '', // 점검시간
    gasCheckMachine: '', // 점검기기명
    gasCheckUserName: '',
    gasCheckUserId: '', // 점검자
    gasConfirmUserName: '',
    gasConfirmUserId: '', // 확인자(입회자)
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  }
  _.forEach(useGasItems.value, (gas) => {
    pushData[gas.sopGasId] = '0'
  })

  props.workPermit.gases.push(pushData)
}
/******************************
 * TODO (목적): 가스 제거
 *******************************/
function removeGas() {
  const selectData = gasTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '제외할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.workPermit.deleteGasChecks) props.workPermit.deleteGasChecks = []
    if (!props.workPermit.deleteGasCheckVals) props.workPermit.deleteGasCheckVals = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.workPermit.deleteGasChecks, {
          sopGasCheckId: item.sopGasCheckId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.workPermit.deleteGasChecks.push(item)
        _.forEach(useGasItems.value, (gas) => {
          props.workPermit.deleteGasCheckVals.push({
            sopGasCheckId: item.sopGasCheckId,
            sopGasId: gas.sopGasId
          })
        })
      }
      props.workPermit.gases = _.reject(props.workPermit.gases, item)
    })
    gasTable.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 업체 변경에 따른 작업자 정보 리셋
 * @param (1): 업체 코드
 * @param (2): 변경 전 업체 코드
 *******************************/
function vendorChange(vendorCd: stringNull, beforeVendorCd: stringNull) {
  if (props.workPermit.workers && props.workPermit.workers.length > 0) {
    message.confirm({
      title: '확인',
      message: '해당 작업업체별로 지정된 작업자 정보들이 제외됩니다. 진행하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        if (!props.workPermit.deleteWorkers) {
          props.workPermit.deleteWorkers = []
        }
        _.forEach(_.filter(props.workPermit.workers, { vendorCd: beforeVendorCd }), (item) => {
          if (
            _.findIndex(props.workPermit.deleteWorkers, {
              sopWorkerId: item.sopWorkerId
            }) === -1
          ) {
            props.workPermit.deleteWorkers.push(item)
          }
        })
        props.workPermit.workers = _.reject(props.workPermit.workers, {
          vendorCd: beforeVendorCd
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {
        props.workPermit.vendorCd = beforeVendorCd
      }
    })
  }
}
/******************************
 * TODO (목적): SOP(작업) 변경에 따른 작업위험성평가 정보 리셋
 *******************************/
function sopEdit() {
  if (props.workPermit.assessments && props.workPermit.assessments.length > 0) {
    message.confirm({
      title: '확인',
      message:
        '작업을 수기로 작성 시 작업위험성평가에 작성된 안전조치사항이 초기화 됩니다. 진행하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.workPermit.assessments, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(props.workPermit.deleteAssessments, {
              sopWorkSopAssessmentId: item.sopWorkSopAssessmentId
            }) === -1
          ) {
            props.workPermit.deleteAssessments.push(item)
          }
        })
        props.workPermit.assessments = []

        sopEditing.value = true
        props.workPermit.mdmSopId = null
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    sopEditing.value = true
    props.workPermit.mdmSopId = null
  }
}
/******************************
 * TODO (목적): SOP(작업) 팝업 호출 전 컨펌
 *******************************/
function searchSop() {
  if (props.workPermit.processCd) {
    if (props.workPermit.assessments && props.workPermit.assessments.length > 0) {
      message.confirm({
        title: '확인',
        message:
          '작업 변경 시 작업위험성평가에 작성된 안전조치사항이 초기화 됩니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          openSopPopup()
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      openSopPopup()
    }
  } else {
    message.alert({
      title: '안내',
      message: '공정을 지정하신 후 이용바랍니다.',
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): SOP(작업) 팝업 표시
 *******************************/
function openSopPopup() {
  popupOptions.value = getPopupOptions('sop1', popupOptions.value, closeSopPopup, {
    /** 원하는 parameter 정의 */
    type: 'single',
    searchParam: {
      subProcessCd: props.workPermit.processCd
    }
  })
}
/******************************
 * TODO (목적): SOP(작업) 팝업 닫기
 *******************************/
function closeSopPopup(data: Array<{ mdmSopId: string; sopName: string }>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (props.workPermit.assessments && props.workPermit.assessments.length > 0) {
      if (!props.workPermit.deleteAssessments) {
        props.workPermit.deleteAssessments = []
      }
      _.forEach(props.workPermit.assessments, (item) => {
        if (
          item.editFlag !== 'C' &&
          _.findIndex(props.workPermit.deleteAssessments, {
            sopWorkSopAssessmentId: item.sopWorkSopAssessmentId
          }) === -1
        ) {
          props.workPermit.deleteAssessments.push(item)
        }
      })
    }
    if (props.workPermit.mdmSopId !== data[0].mdmSopId) {
      $http({
        url: listSopUrl.value,
        method: 'GET',
        params: {
          mdmSopId: data[0].mdmSopId
        }
      }).then((_result: any) => {
        _.forEach(_result.data, (item) => {
          item.sopWorkSopAssessmentId = uid() // 작업허가서_작업위험성평가_일련번호
          item.sopWorkPermitId = props.workPermit.sopWorkPermitId // 작업허가서 일련번호
          // item.jobStepName = item.jobStepName;  // 작업단계 명
          // item.riskHazardName = item.riskHazardName;  // 유해위험요인명
          item.safetyActionMeasures = '' // 안전조치사항
          item.actionEducationFlag = 'N' // 조치/교육완료여부
          item.beforeFrequency = null // 개선전 빈도
          item.beforeStrength = null // 개선전 강도
          item.beforeRisk = null // 개선전 위험도
          item.afterFrequency = null // 개선후 빈도
          item.afterStrength = null // 개선후 강도
          item.afterRisk = null // 개선후 위험도
          item.regUserId = user.value.userId // 등록자 ID
          item.chgUserId = '' // 수정자 ID
          item.editFlag = 'C'
        })
        props.workPermit.assessments = _result.data
      })
      sopEditing.value = false
      props.workPermit.mdmSopId = data[0].mdmSopId
      props.workPermit.sopName = data[0].sopName
    }
  }
}
/******************************
 * TODO (목적): SOP(작업) 제거
 *******************************/
function removeSop() {
  if (props.workPermit.assessments && props.workPermit.assessments.length > 0) {
    message.confirm({
      title: '확인',
      message:
        '작업 변경 시 작업위험성평가에 작성된 안전조치사항이 초기화 됩니다. 진행하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.workPermit.assessments, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(props.workPermit.deleteAssessments, {
              sopWorkSopAssessmentId: item.sopWorkSopAssessmentId
            }) === -1
          ) {
            props.workPermit.deleteAssessments.push(item)
          }
        })
        props.workPermit.assessments = []

        sopEditing.value = false
        props.workPermit.mdmSopId = null
        props.workPermit.sopName = null
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    sopEditing.value = false
    props.workPermit.mdmSopId = null
    props.workPermit.sopName = null
  }
}
/******************************
 * TODO (목적): 안전조치사항 필요란 체크에 따른 확인란 활성화 처리
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 * @return (반환): 활성화 여부
 *******************************/
function contentsField(_props: any, col: tableColumnType) {
  /** 안전조치사항 항목에서 항목 입력 타입이 '테이블_점검자' 인 경우 테이블에 표시
   * 단, 예전에 '테이블_점검자'였으며 그럼으로 인해 데이터가 저장이 된적이 있는 경우 컴포넌트 표시 */
  let returnVal = true
  if (col.name === 'confirmUserName') {
    returnVal =
      _props.row.sopCheckItemKindCd === 'SCIK000005' || Boolean(_props.row.confirmUserName)
  }
  return returnVal
}
/******************************
 * TODO (목적): 안전조치사항 필요란 체크시 확인란 체크 해제
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'necessaryFlag' && _props.row[col.name] !== 'Y') {
    _props.row.confirmFlag = 'N'
    _props.row.confirmUserId = null
    _props.row.confirmUserName = null
  }
}
/******************************
 * TODO (목적): 화재 영역 화재구분 변경에 따른 유효성 체크 부여
 *******************************/
function workClassChange() {
  if (disableEtc.value) {
    props.workPermit.fireWorkClassificationEtc = ''
  }
  const requiredDatas = ['SCI0000335', 'SCI0000336']
  if (
    props.workPermit.fireWorkClassification &&
    (props.workPermit.fireWorkClassification.indexOf('FWC0000001') > -1 ||
      props.workPermit.fireWorkClassification.indexOf('FWC0000005') > -1 ||
      props.workPermit.fireWorkClassification.indexOf('FWC0000010') > -1 ||
      props.workPermit.fireWorkClassification.indexOf('FWC0000015') > -1)
  ) {
    // 용접, 용단, 땜, 연마 클릭 시
    // 화재감시자 배치 및 소화기 배치 필수값설정
    // ** 사업장이 대구공장 밖에 없음으로 다음과 같이 셋팅
    // SCI0000335, SCI0000336
    _.forEach(props.workPermit.checkResults, (checkResult) => {
      if (requiredDatas.indexOf(checkResult.sopCheckItemId) > -1) {
        checkResult.necessaryFlag = 'Y'
        checkResult.necessaryDisabledFlag = 'Y'
        if (checkResult['editFlag'] !== 'C') {
          checkResult['editFlag'] = 'U'
          checkResult['chgUserId'] = user.value.userId
        }
      }
    })
  } else {
    _.forEach(props.workPermit.checkResults, (checkResult) => {
      if (requiredDatas.indexOf(checkResult.sopCheckItemId) > -1) {
        checkResult.necessaryFlag = 'N'
        checkResult.necessaryDisabledFlag = null
        if (checkResult['editFlag'] !== 'C') {
          checkResult['editFlag'] = 'U'
          checkResult['chgUserId'] = user.value.userId
        }
      }
    })
  }
  dataChange()
}
/******************************
 * TODO (목적): 데이터 변경 시 저장을 위한 수정 정보 셋팅
 *******************************/
function dataChange() {
  if (props.workPermit.editFlag !== 'C') {
    props.workPermit.editFlag = 'U'
    props.workPermit.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 가스 저장 시 작업허가서 저장 버튼 호출
 *******************************/
function saveSwpGas() {
  emits('saveWorkPermit')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

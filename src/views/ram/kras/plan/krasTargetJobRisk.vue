<template>
  <div class="tab-content-box" style="padding: 5px 5px 0px 5px">
    <c-tab
      type="tabcard"
      align="left"
      height="500px"
      :inlineLabel="true"
      :tabItems="tabItems"
      :editable="editable"
      :haveTitle="true"
      title="공정별 작업"
      :addTab="!disabled && isSelect"
      :addDirectTab="!disabled && isSelect"
      addTabName="추가"
      btnColor="green"
      :removeTab="!disabled && isSelect"
      v-model:value="tab"
      @addTab="addTab"
      @addDirectTab="addDirectTab"
      @removeTab="removeTab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="tab.param"
          :disabled="disabled"
          :processData="processData"
          :assessPlan="assessPlan"
          @saveProcess="saveProcess"
          @research="research"
        />
      </template>
    </c-tab>
    <q-dialog v-model="jobData.show" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editForm">
          <c-card title="평가대상 상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  label="저장"
                  icon="save"
                  @btnClicked="saveJob"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-text
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="작업"
                  name="jobName"
                  v-model:value="jobData.jobName"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
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
import { assessPlanType, processDataType, jobDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'krasTargetJobRisk'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['saveProcess', 'research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  assessPlan: assessPlanType
  processData: processDataType
  disabled: boolean
  vendorFlag: boolean
  isSelect: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  assessPlan: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      plantCd: '', // 사업장 코드
      ramTechniqueCd: '', // 평가기법 코드_HAZOP/KRAS/JSA/CHECKLIST
      ramAssessTypeCd: '', // 평가구분_최초/정기/수시
      assessmentName: '', // 평가명
      assessmentStartDate: '', // 평가시작일
      assessmentEndDate: '', // 평가종료일
      assessmentPeriod: [],
      assessmentYear: '', // 평가년도
      ramStepCd: '', // 평가 진행단계 코드
      assessmentManageDeptCd: '', // 평가주관 부서 코드
      assessmentManageUserId: '', // 평가주관 담당자 ID
      ramMatrixId: null, // 위험메트릭스 번호
      sopMocId: '', // MOC 일련번호
      remark: '', // 상세내용
      workArea: '', // 작업지역
      regDtStr: '',
      regUserId: '', // 작성자 ID
      regUserName: '', // 작성자 ID
      reviewUserId: '', // 검토자 ID
      reviewDate: '', // 검토일
      approvalUserId: '', // 승인자 ID
      approvalDate: '', // 승인일
      vendorCd: '',
      sopConstructionId: '',
      chgUserId: '', // 수정자 ID
      teams: [], // 평가팀 목록
      delTeams: [],
      occasions: [], // 수시 변경/추가 내역 목록
      conferences: [], // 회의 목록
      relatedDocuments: [], // 관련자료 목록
      processes: [] // 대상공정 목록
    }
  },
  processData: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정명
      ramProcessAssessStepCd: '', // 평가진행상태
      processExplainFeature: '', // 공정 특징 설명
      assessDeptCd: '', // 평가 부서 코드
      assessUserId: '', // 평가 담당자
      assessUserName: '', // 평가 담당자
      workCycleCd: null, // 작업발생주기코드
      workingTime: 0, // 작업시간(1회)
      vendorFlag: 0,
      temperature: null,
      workMeasurementPlanId: '',
      measPlanContent: '',
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      sops: [],
      jobs: [],
      drawNodes: [],
      draws: [],
      fmScenarios: [],
      hazopScenarios: [],
      scenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: []
    }
  },
  disabled: false,
  vendorFlag: false,
  isSelect: false
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
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const jobData = ref<jobDataType>({
  show: false,
  ramRiskAssessmentPlanId: '',
  processCd: '',
  processName: '',
  mdmSopId: '',
  jobName: '',
  regUserId: ''
})
const tabItems = ref([])
const editForm = ref<any>(null)
const listUrl = ref('')
const insertDirectUrl = ref('')
const insertSelectUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const tab = ref('first')

/******************************
 * @Computed_선언
 *******************************/
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.processData.processCd,
  () => {
    getDetail()
  },
  {
    deep: true
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
  listUrl.value = selectConfig.ram.assessJob.krasAssessJobList.url
  insertDirectUrl.value = transactionConfig.ram.assessJob.insert.url
  insertSelectUrl.value = transactionConfig.ram.assessJob.inserts.url
  updateUrl.value = transactionConfig.ram.assessJob.update.url
  deleteUrl.value = transactionConfig.ram.assessJob.krasDelete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 작업 조회
 *******************************/
function getDetail() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.jobs = _result.data
    if (_result.data && _result.data.length > 0) {
      tabItems.value = _result.data
      tab.value = _result.data[0].mdmSopId
      _.forEach(tabItems.value, (item: any) => {
        item.name = item.mdmSopId
        item.label = item.jobName
        item.icon = 'folder'
        item.component = shallowRef(
          defineAsyncComponent(() => import(`./krasTargetJobRiskDetail.vue`))
        )
        item.param = {
          scenarios: item.krasScenarios,
          mdmSopId: item.mdmSopId,
          jobName: item.jobName
        }
        item.key = uid()
      })
    } else {
      tabItems.value = []
      tab.value = ''
    }
  })
}
/******************************
 * TODO (목적): 작업 추가
 *******************************/
function addTab() {
  popupOptions.value = getPopupOptions('sop1', popupOptions.value, closeSopPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchType: '1', //1: 작업조회, 2:작업단계, 3:작업단계별 유해위험요인, 4:작업단계별 유해위험요인별 원인/결과
    searchParam: {
      subProcessCd: props.processData.processCd,
      ramRiskHazardTechniqueCd: 'RTH0000005'
    }
  })
}

/******************************
 * TODO (목적): 작업(SOP) 팝업
 *******************************/
function addDirectTab() {
  jobData.value.show = true
}

/******************************
 * TODO (목적): 작업 팝업 callback
 *******************************/
function closeSopPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveList: any = ref([])
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.processData.jobs, {
          mdmSopId: item.mdmSopId
        }) === -1
      ) {
        props.processData.jobs.push({
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
          processCd: props.processData.processCd, // 단위공정 코드
          processName: props.processData.processName,
          mdmSopId: item.mdmSopId, // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
          jobName: item.sopName, // 안전작업 명
          regUserId: user.value.userId,
          editFlag: 'C'
        })
        saveList.value.push({
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
          processCd: props.processData.processCd, // 단위공정 코드
          processName: props.processData.processName,
          mdmSopId: item.mdmSopId, // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
          jobName: item.sopName, // 안전작업 명
          regUserId: user.value.userId,
          editFlag: 'C',
          ramTechniqueCd: 'RT00000020' // 평가기법 코드_KRAS
        })
      }
    })
    $http({
      url: insertSelectUrl.value,
      method: 'POST',
      data: saveList.value
    }).then((_result: any) => {
      message.requestSuccess()
      emits('research')
      getDetail()
    })
    // this.saveSop();
  }
}

/******************************
 * TODO (목적): 다이얼로그 닫기
 *******************************/
function closeDialog() {
  jobData.value.show = false
}
/******************************
 * TODO (목적): 작업 저장
 *******************************/
function saveJob() {
  const saveData = {
    ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
    processCd: props.processData.processCd,
    processName: props.processData.processName,
    mdmSopId: '',
    jobName: jobData.value.jobName,
    regUserId: user.value.userId
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: insertDirectUrl.value,
        method: 'POST',
        data: saveData
      }).then((_result: any) => {
        message.requestSuccess()
        jobData.value.show = false
        emits('research')
        getDetail()
      })
    } else {
      message.validError()
    }
  })
}

/******************************
 * TODO (목적): 작업 삭제
 *******************************/
function removeTab(_tab: any) {
  message.confirm({
    title: '확인',
    message: '작업을 삭제하시겠습니까? <br>관련되어 있는 시나리오 목록까지 삭제됩니다.',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(
          deleteUrl.value,
          props.processData.ramRiskAssessmentPlanId,
          _tab.processCd,
          _tab.mdmSopId
        ),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('research')
        getDetail()
      })
    },
    cancelCallback: () => {}
  })
}

function saveProcess(_processCd: string) {
  emits('saveProcess', _processCd)
}
function research() {
  emits('research')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style scoped>
.tab-content-box {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
}
</style>

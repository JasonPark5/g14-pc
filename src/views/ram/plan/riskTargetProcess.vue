<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 risk-process-chips">
        <div class="chip-header">
          <div class="chip-header-title">
            <q-icon name="info" size="16px" class="q-mr-xs" color="white" />공정
          </div>
          <q-chip
            v-if="editable && !disabled"
            clickable
            square
            color="orange"
            text-color="white"
            icon="add"
            :label="$language('추가')"
            :title="$language('추가')"
            @click="addProcess"
          />
          <q-chip
            v-if="editable && !disabled"
            clickable
            square
            color="orange"
            text-color="white"
            icon="add"
            :label="$language('직접추가')"
            :title="$language('직접추가')"
            @click="writeProcess"
          />
          <q-chip
            v-for="(process, idx) in assessPlan.processes"
            :key="idx"
            outline
            square
            :removable="editable && !disabled && process.ramProcessAssessStepCd !== 'RPA0000005'"
            :color="process.selected ? 'primary' : 'grey-6'"
            text-color="white"
            icon="memory"
            :selected="process.selected"
            :label="process.processName"
            :title="process.processName"
            v-model="process.check"
            @remove="(state: boolean) => removeProcess(state, process)"
            @update:selected="(state: boolean) => selectedProcess(state, process, idx)"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <component
          :is="processComponent"
          :assessPlan="assessPlan"
          :processData="processData"
          :disabled="disabled"
          :isNew="isNew"
          :vendorFlag="vendorFlag"
          @research="research"
          @saveProcess="saveProcess"
        />
      </div>
    </div>
    <q-dialog v-model="processDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editForm">
          <c-card title="평가대상 상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  label="저장"
                  icon="save"
                  @btnClicked="saveWriteProcess"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="공정"
                  name="processName"
                  v-model:value="processDialog.processName"
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
import { assessPlanType } from '../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskTargetProcess'
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
const emits = defineEmits(['loadAssess', 'saveCallback', 'research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  assessPlan: assessPlanType
  searchFlag: {
    value: stringNull
  }
  attachInfo: {
    isSubmit: stringNull
    taskClassCd: stringNull
    taskKey: stringNull
  }
  vendorFlag: boolean
  disabled: boolean
  disabled2: boolean
  isNew: stringNull
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
  searchFlag: () => {
    return {
      value: ''
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'RISK_PLAN',
      taskKey: ''
    }
  },
  vendorFlag: false,
  disabled: false,
  disabled2: false,
  isNew: null
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
const processData = ref({
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
  workMeasurementPlanId: '', // 계획 일련번호
  temperature: '', // 사용온도
  measPlanContent: '',
  estimationFlag: '', // CHARM 추정 완료여부
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
})
const processDialog = ref({
  show: false,
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정명
  ramProcessAssessStepCd: '', // 평가진행상태
  processExplainFeature: '', // 공정 특징 설명
  assessDeptCd: '', // 평가 부서 코드
  assessUserId: '', // 평가 담당자
  workCycleCd: null, // 작업발생주기코드
  workingTime: 0, // 작업시간(1회)
  workMeasurementPlanId: null, // 작업환경측정계획번호
  measPlanContent: null, // 작업환경측정계획번호
  temperature: null, // 공정사용온도
  estimationFlag: '', // CHARM 추정 완료여부
  regUserId: '' // 작성자 ID
})
const saveUrl = ref('')
const deleteUrl = ref('')
const saveProcessCd = ref('')
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const processComponent = computed(() => {
  return defineAsyncComponent(() => import(`./riskTargetProcessDetail.vue`))
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.assessPlan.processes,
  () => {
    const idx = _.findIndex(props.assessPlan.processes, { processCd: saveProcessCd.value })
    if (saveProcessCd.value && idx > -1) {
      props.assessPlan.processes[idx].selected = true

      props.assessPlan.processes.forEach((item: any, index: any) => {
        if (idx !== index) {
          item.selected = false
        }
      })
    }
  },
  { deep: true }
)
watch(
  () => props.searchFlag.value,
  () => {
    if (props.assessPlan.processes && props.assessPlan.processes.length > 0) {
      const idx = _.findIndex(props.assessPlan.processes, { processCd: saveProcessCd.value })
      if (idx === -1) {
        selectedProcess(true, props.assessPlan.processes[0], 0)
      }
    }
  },
  { deep: true }
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
  saveUrl.value = transactionConfig.ram.assessProcess.insert.url
  deleteUrl.value = transactionConfig.ram.assessProcess.delete.url
  // code setting
  // list setting
  if (props.assessPlan.processes && props.assessPlan.processes.length > 0) {
    selectedProcess(true, props.assessPlan.processes[0], 0)
  }
}
/******************************
 * TODO (목적): 공정 삭제
 *******************************/
function removeProcess(_state: any, _process: any) {
  message.confirm({
    title: '확인',
    message: '제외하실 경우 해당 공정에 해당하는 평가대상 목록도 변경됩니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: deleteUrl.value,
        method: 'DELETE',
        data: _process
      }).then(() => {
        message.requestSuccess()
        emits('saveCallback', props.assessPlan.ramRiskAssessmentPlanId)

        /**
         * 계획정보수정
         *  변경사항을 적용하기 위함
         */
        emits('research')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {
      _process.check = true
    }
  })
}
/******************************
 * TODO (목적): 공정 추가
 *******************************/
function addProcess() {
  popupOptions.value = getPopupOptions('process', popupOptions.value, closeProcessPopup, {
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 공정추가 callback
 *******************************/
function closeProcessPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData = _.filter(_data, (item) => {
      return _.findIndex(props.assessPlan.processes, { processCd: item.processCd }) === -1
    })
    _.forEach(saveData, (item) => {
      item.ramRiskAssessmentPlanId = props.assessPlan.ramRiskAssessmentPlanId
      item.ramProcessAssessStepCd = 'RPA0000001'
      item.assessDeptCd = user.value.deptCd
      item.regUserId = user.value.userId
    })
    $http({
      url: saveUrl.value,
      method: 'POST',
      data: Object.values(saveData)
    }).then(() => {
      message.requestSuccess()
      emits('saveCallback', props.assessPlan.ramRiskAssessmentPlanId)
      /**
       * 계획정보수정
       *  변경사항을 적용하기 위함
       */
      emits('research')
    })
  }
}
/******************************
 * TODO (목적): 공정직접추가
 *******************************/
function writeProcess() {
  /**
   * 공정을 직접 만들지만, 공정코드를 가상으로 유니크하게 셋팅
   *  :: 해당 테이블 및 이후 테이블에서 공정코드를 사용함으로 이와 같이 구성
   */
  processDialog.value.processCd = 'WTE' + uid()
  processDialog.value.show = true
}
/******************************
 * TODO (목적): 공정추가 닫기
 *******************************/
function closeDialog() {
  processDialog.value.show = false
  processDialog.value = {
    show: false,
    ramRiskAssessmentPlanId: '', // 평가 일련번호
    processCd: '', // 단위공정 코드
    processName: '', // 단위공정명
    ramProcessAssessStepCd: '', // 평가진행상태
    processExplainFeature: '', // 공정 특징 설명
    assessDeptCd: '', // 평가 부서 코드
    assessUserId: '', // 평가 담당자
    workCycleCd: null, // 작업발생주기코드
    workingTime: 0, // 작업시간(1회)
    workMeasurementPlanId: null, // 작업환경측정계획번호
    measPlanContent: null, // 작업환경측정계획번호
    temperature: null, // 공정사용온도
    estimationFlag: '', // CHARM 추정 완료여부
    regUserId: '' // 작성자 ID
  }
}
/******************************
 * TODO (목적): 직접입력 공정 저장
 *******************************/
function saveWriteProcess() {
  const saveData = [] as any
  if (
    _.findIndex(props.assessPlan.processes, { processName: processDialog.value.processName }) > -1
  ) {
    message.alert({
      title: '안내',
      message: '동일한 공정명이 있습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    processDialog.value.ramRiskAssessmentPlanId = props.assessPlan.ramRiskAssessmentPlanId
    processDialog.value.ramProcessAssessStepCd = 'RPA0000001'
    processDialog.value.regUserId = user.value.userId
    saveData.push(processDialog.value)

    $http({
      url: saveUrl.value,
      method: 'POST',
      data: Object.values(saveData)
    }).then(() => {
      message.requestSuccess()
      emits('saveCallback', props.assessPlan.ramRiskAssessmentPlanId)
      closeDialog()

      /**
       * 계획정보수정
       *  변경사항을 적용하기 위함
       */
      emits('research')
    })
  }
}
/******************************
 * TODO (목적): 공정 선택
 * chip 라이브러리 사용
 * 공정을 클릭 했을 시에 해당 공정이 클릭되었음을 표시하게끔 배경색을 변경시키며
 * 다른 공정들은 selected false 처리 및 색상 primary로 변경
 *******************************/
function selectedProcess(_state: any, _process: any, _idx: any) {
  if (saveProcessCd.value) {
    saveProcessCd.value = ''
  }
  if (_state) {
    props.assessPlan.processes.forEach((item: any, index: any) => {
      if (_idx !== index) {
        item.selected = false
      } else {
        item.selected = true
        processData.value = _process
      }
    })
  } else {
    props.assessPlan.processes[_idx].selected = true
  }
}
/******************************
 * TODO (목적): 공정 저장
 *******************************/
function saveProcess(_processCd: any) {
  saveProcessCd.value = _processCd
  emits('saveCallback', props.assessPlan.ramRiskAssessmentPlanId)
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
.chip-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.chip-header-title {
  /* background: #fb7e1f !important; */
  background: #616161 !important;
  margin-right: 10px;
  width: 100px !important;
  color: white;
  padding: 10px 10px;
  border-radius: 10px 0 0 0;
  font-weight: 900;
  display: flex;
  align-items: center;
}
</style>

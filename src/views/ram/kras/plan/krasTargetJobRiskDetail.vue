<template>
  <c-table
    ref="table"
    title="평가대상 목록 - 유해위험요인"
    :columns="grid.columns"
    gridHeightAuto
    :data="grid.data"
    :columnSetting="false"
    :expandAll="false"
    :isFullScreen="false"
    :usePaging="false"
    :hideBottom="false"
    :filtering="false"
    :editable="editable && !disabled"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn
          v-show="editable && !disabled && grid.data && grid.data.length > 0"
          :isSubmit="isSave"
          :url="saveUrl"
          :param="saveData"
          mappingType="POST"
          label="유해위험요인 저장"
          icon="save"
          @beforeAction="saveSop"
          @btnCallback="saveSopCallback"
        />
      </q-btn-group>
    </template>
    <template v-slot:customArea="{ props: bodyProps, col }">
      <template v-if="col.name === 'riskHazardNames'">
        <span
          v-for="(item, index) in bodyProps.row['riskHazardNames']"
          :key="index"
          class="example-item"
          style="display: inline; text-align: center"
        >
          <q-checkbox
            v-model="inputDatas"
            :val="item.ramRiskHazardId"
            color="red"
            size="xs"
            :disable="!editable || disabled"
            class="q-mb-xs meaning"
            style="width: 220px !important"
            @update:model-value="(val: any) => datachange(bodyProps, col, val, item)"
          >
            <!-- <span style="font-size: 1.2em"> -->
            {{ item.riskHazardNumber }} &nbsp;{{ item.riskHazardName }}
            <!-- </span> -->
          </q-checkbox>
        </span>
      </template>
    </template>
  </c-table>

  <c-dialog :param="popupOptions" />
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
import { assessPlanType, processDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'krasTargetJobRiskDetail'
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
  popupParam: popupParamJobType
  disabled: boolean
}

interface popupParamJobType {
  scenarios: Array<any>
  mdmSopId: stringNull
  jobName: stringNull
}

interface gridType {
  columns: tableColumnType
  height: stringNull
  data: Array<any>
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
  popupParam: () => {
    return {
      scenarios: [],
      mdmSopId: '',
      jobName: ''
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
      scenarios: [],
      hazopScenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: []
    }
  },
  disabled: false
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'ramRiskHazardClassName',
      field: 'ramRiskHazardClassName',
      label: '평가구분(KRAS)',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'riskHazardNames',
      field: 'riskHazardNames',
      label: '유해위험요인',
      align: 'left',
      style: 'width:600px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '550px'
})
const riskHazardListUrl = ref('')
const inputDatas = ref<any>([])
const listUrl = ref('')
const saveUrl = ref('')
const saveData = ref<any>({
  krasHazardList: [],
  deleteKrasHazardList: []
})
const isSave = ref(false)
const table = ref<any>(null)
const typeList = ref<any>([])
const riskHazardList = ref<any>([])
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
  riskHazardListUrl.value = selectConfig.ram.riskHazard.list.url
  listUrl.value = selectConfig.ram.assessJob.krasRiskHazardList.url
  saveUrl.value = transactionConfig.ram.assessJob.krasRiskHazardSave.url
  // code setting
  getComboItems('RAM_RISK_HAZARD_CLASS_CD', 'kras').then((_result: any) => {
    typeList.value = _result
    getRiskHazardListUrl()
    if (props.popupParam.scenarios && props.popupParam.scenarios.length > 0) {
      inputDatas.value = _.uniq(_.map(props.popupParam.scenarios, 'ramRiskHazardId'))
    }
  })

  // list setting
}

/******************************
 * TODO (목적): 유해위험요인 마스터 조회
 *******************************/
function getRiskHazardListUrl() {
  $http({
    url: riskHazardListUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      ramRiskHazardTechniqueCd: 'RTH0000005'
    }
  }).then((_result: any) => {
    grid.value.data = []
    riskHazardList.value = _result.data
    _.forEach(typeList.value, (_item) => {
      grid.value.data.push({
        ramRiskHazardClassCd: _item.code,
        ramRiskHazardClassName: _item.codeName,
        riskHazardNames: _.filter(_result.data, { ramRiskHazardClassCd: _item.code })
      })
    })
  })
}
/******************************
 * TODO (목적): 시나리오 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd,
      mdmSopId: props.popupParam.mdmSopId
    }
  }).then((_result: any) => {
    props.popupParam.scenarios = _result.data
    inputDatas.value = _.map(props.popupParam.scenarios, 'ramRiskHazardId')
  })
}
/******************************
 * TODO (목적):
 *******************************/
function datachange(_props: any, _col: any, val: any[], item: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }

  const isChecked = val.includes(item.ramRiskHazardId)

  if (!isChecked) {
    const alreadyExist = saveData.value.deleteKrasHazardList.some(
      (_result: any) => _result.ramRiskHazardId === item.ramRiskHazardId
    )
    if (!alreadyExist) {
      saveData.value.deleteKrasHazardList.push({
        ramRiskHazardId: item.ramRiskHazardId,
        ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
        groupMdmSopId: props.processData.processCd + '/' + props.popupParam.mdmSopId,
        mdmSopId: props.popupParam.mdmSopId,
        processCd: props.processData.processCd,
        jobName: props.popupParam.jobName
      })
    }
  } else {
    _.remove(
      saveData.value.deleteKrasHazardList,
      (_result: any) => _result.ramRiskHazardId === item.ramRiskHazardId
    )
  }
}
/******************************
 * TODO (목적): SOP 저장
 *******************************/
function saveSop() {
  if (validTable(grid.value.columns, props.popupParam.scenarios)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        saveData.value.krasHazardList = []
        _.forEach(inputDatas.value, (_item) => {
          const _hazardData = _.find(riskHazardList.value, { ramRiskHazardId: _item })
          if (_.findIndex(props.popupParam.scenarios, { ramRiskHazardId: _item }) === -1) {
            saveData.value.krasHazardList.push({
              ramKrasAssessScenarioId: uid(),
              ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
              processCd: props.processData.processCd, // 단위공정 코드
              processName: props.processData.processName,
              ramTechniqueCd: 'RT00000020',
              groupMdmSopId: props.processData.processCd + '/' + props.popupParam.mdmSopId,
              mdmSopId: props.popupParam.mdmSopId, // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
              jobName: props.popupParam.jobName, // 안전작업 명
              ramRiskHazardId: _item, // 유해위험요인 번호
              riskHazardName: _hazardData.riskHazardName, // 유해위험요인명
              ramRiskHazardClassCd: _hazardData.ramRiskHazardClassCd, // KRAS 분류 코드
              ramRiskHazardClassName: _hazardData.ramRiskHazardClassName, // KRAS 분류
              damageTargetName: '', // 피해대상(key-in)
              damageTypeName: '', // 재해형태(key-in)
              regUserId: user.value.userId,
              editFlag: 'C'
            })
          }
        })
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): SOP 저장 callback
 *******************************/
function saveSopCallback() {
  message.requestSuccess()
  saveData.value.deleteKrasHazardList = []
  // emits('saveProcess', props.processData.processCd)
  emits('research')
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <div class="row">
      <div
        :class="[
          scenarioViewGroup === 'L' ? 'col-12' : 'col-xs-12 col-sm-6 col-md-4 col-lg-4 third',
          'scenario-list'
        ]"
      >
        <c-table
          ref="table"
          title="시나리오 목록"
          :columns="gridColumns"
          :gridHeight="setheight"
          :data="processData.thirdScenarios"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && !disabled"
          :isExcelDown="scenarioViewGroup === 'L'"
          :isFullScreen="scenarioViewGroup === 'L'"
          :customTrClass="setTrClass"
          @table-data-change="tableDataChange"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-update-btn
                name="updateBtn"
                :data="updateBtnData"
                :btnEditable="btnEditable"
                :flagCondition="flagCondition"
                @back="back"
              />
              <c-btn
                v-show="isCompared"
                label="이전평가결과조회"
                icon="compare_arrows"
                @btnClicked="compareScenario"
              />
              <!-- <c-btn
                v-if="editable && !disabled"
                label="삭제"
                icon="remove"
                @btnClicked="removeScenario"
              /> -->
              <c-btn
                v-show="editable && !disabled && !btnEditable"
                :isSubmit="isComplete"
                :url="completeUrl"
                :param="processData"
                mappingType="PUT"
                label="평가완료"
                icon="check"
                @beforeAction="completeProcess"
                @btnCallback="completeProcessCallback"
              />
              <c-btn
                v-show="
                  editable &&
                  !disabled &&
                  scenarioViewGroup === 'L' &&
                  processData.thirdScenarios &&
                  processData.thirdScenarios.length > 0
                "
                :isSubmit="isSave"
                :url="saveUrl"
                :param="processData.thirdScenarios"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveScenario"
                @btnCallback="saveScenarioCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:suffixTitle>
            <q-btn-group outline class="scenario-view-group">
              <q-btn
                :outline="scenarioViewGroup !== 'L'"
                :color="scenarioViewGroup === 'L' ? 'indigo' : 'grey'"
                size="11px"
                label=""
                icon="view_list"
                @click="listView"
              >
                <q-tooltip>
                  {{ $language('목록형') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                :outline="scenarioViewGroup !== 'C'"
                :color="scenarioViewGroup === 'C' ? 'indigo' : 'grey'"
                size="11px"
                label=""
                icon="space_dashboard"
                @click="cardView"
              >
                <q-tooltip>
                  {{ $language('카드형') }}
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'customCol'">
              <component
                :is="imprComponent"
                :col="col"
                :props="props"
                :isImmShow="false"
                :inputEditable="editable && Boolean(props.row.ramThirdAssessScenarioId)"
                :requestContentsCols="requestContentsCols"
                tableKey="ramThirdAssessScenarioId"
                ibmTaskTypeCd="ITT0000013"
                ibmTaskUnderTypeCd="ITTU000015"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'item'">
              <q-item class="card-scenario-list">
                <q-item-section>
                  <q-item-label class="scenario-card-title">{{
                    `${props.row['riskHazardQuestionName']}`
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    v-if="props.row.editFlag !== 'C'"
                    name="arrow_forward_ios"
                    size="sm"
                    color="blue"
                    class="cursor-pointer"
                    @click="getDetail(props.row)"
                  />
                </q-item-section>
              </q-item>
            </template>
            <template v-else-if="col.name === 'riskHazardPicture'">
              <q-icon
                style="font-size: 30px; cursor: pointer"
                class="text-success"
                name="image"
                @click.stop="openHazardPicture(props)"
              />
            </template>
            <template v-else-if="col.name === 'picture'">
              <q-icon
                style="font-size: 30px; cursor: pointer"
                class="text-primary"
                name="image"
                @click.stop="openImprPicture(props)"
              />
            </template>
          </template>
        </c-table>
      </div>
      <div
        v-if="scenarioViewGroup === 'C'"
        class="col-xs-12 col-sm-6 col-md-8 col-lg-8 scenario-card"
      >
        <q-form ref="editForm">
          <div class="row">
            <div class="col-5">
              <c-card title="상세정보" class="cardClassDetailForm no-margin">
                <template v-slot:card-button>
                  <q-btn-group outline>
                    <c-btn
                      v-show="editable && !disabled"
                      :isSubmit="isSaveUnit"
                      :url="saveUnitUrl"
                      :param="scenario"
                      mappingType="PUT"
                      label="저장"
                      icon="save"
                      @beforeAction="saveScenarioUnit"
                      @btnCallback="saveScenarioUnitCallback"
                    />
                  </q-btn-group>
                </template>
                <template v-slot:card-detail>
                  <div class="col-12">
                    <c-upload-picture
                      height="250px"
                      :attachInfo="attachHazardInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-12">
                    <c-textarea
                      :disabled="true"
                      :editable="editable"
                      autogrow
                      label="유해위험요인 (위험한 상황과 사건)"
                      name="riskHazardQuestionName"
                      v-model:value="scenario.riskHazardQuestionName"
                    />
                  </div>
                  <div class="col-6">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="관련법규"
                      name="relationLaw"
                      v-model:value="scenario.relationLaw"
                    />
                  </div>
                  <div class="col-6">
                    <c-checkbox
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :isFlag="true"
                      label="위험등록부"
                      name="riskbookFlag"
                      v-model:value="scenario.riskbookFlag"
                    />
                  </div>
                  <div class="col-6">
                    <c-datepicker
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="평가일"
                      name="assessDate"
                      v-model:value="scenario.assessDate"
                    />
                  </div>
                  <div class="col-6">
                    <c-field
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :data="scenario"
                      label="평가자"
                      name="assessUserId"
                      v-model:value="scenario.assessUserId"
                      @username="
                        (val: any) => {
                          scenario.assessUserName = val
                        }
                      "
                    />
                  </div>
                </template>
              </c-card>
            </div>
            <div class="col-7">
              <c-card title="개선정보" class="cardClassDetailForm no-margin">
                <template v-slot:card-detail>
                  <div class="col-4">
                    <c-upload-picture
                      height="170px"
                      :attachInfo="attachBeforeInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-8">
                    <div class="row">
                      <div class="col-12">
                        <c-textarea
                          :disabled="disabled || !selectScenario"
                          :editable="editable"
                          :rows="3"
                          label="현재안전조치"
                          name="currentSafetyMeasures"
                          v-model:value="scenario.currentSafetyMeasures"
                        />
                      </div>
                      <div class="col-12">
                        <c-select
                          :disabled="disabled || !selectScenario"
                          :editable="editable"
                          :comboItems="riskStandardItems"
                          :isChip="true"
                          type="edit"
                          itemText="ramRiskLevelName"
                          itemValue="ramRiskThirdStandardId"
                          label="판단결과"
                          name="ramRiskThirdStandardId"
                          v-model:value="scenario.ramRiskThirdStandardId"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <c-table
                      title="개선 목록"
                      :editable="editable && !disabled && selectScenario"
                      :columns="gridImpr.columns"
                      :data="scenario.imprs"
                      :gridHeight="gridImpr.height"
                      :usePaging="false"
                      :columnSetting="false"
                      :isFullScreen="false"
                      :filtering="false"
                      :isExcelDown="false"
                      @linkClick="
                        (row: any) => linkClick({ sopImprovementId: row.sopImprovementId }, row)
                      "
                    >
                      <template v-slot:table-button>
                        <q-btn-group outline>
                          <c-btn
                            v-if="editable && !disabled && selectScenario"
                            label="개선요청"
                            icon="add"
                            @btnClicked="openImprRequest"
                          />
                        </q-btn-group>
                      </template>
                    </c-table>
                  </div>
                  <div class="col-4">
                    <c-upload-picture
                      isMultiTask
                      :attachInfo="attachAfterInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-8">
                    <c-textarea
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :rows="3"
                      label="추가 리스크관리 계획"
                      name="improvementMeasures"
                      v-model:value="scenario.improvementMeasures"
                    />
                  </div>
                </template>
              </c-card>
            </div>
          </div>
        </q-form>
      </div>
    </div>
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
import { processDataType, scenarioType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'thirdScenario'
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
const emits = defineEmits(['research', 'assessComplete'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  processData: processDataType
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    ramTechniqueCd: stringNull
  }
  height: stringNull
  planUpdateBtnData: {
    title: stringNull
    flag: boolean
    research: stringNull
    planResearch: stringNull
  }
}

interface gridType {
  columns?: tableColumnType
  height?: stringNull
  merge?: tableMergeType
  data?: Array<any>
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
      workCycleName: '',
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      jobs: [],
      sops: [],
      drawNodes: [],
      draws: [],
      fmScenarios: [],
      hazopScenarios: [],
      scenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: [],
      reCheckedCnt: 0,
      plantCd: null
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      ramTechniqueCd: ''
    }
  },
  height: '',
  planUpdateBtnData: () => {
    return {
      title: '계획', // 계획
      flag: false,
      research: '',
      planResearch: ''
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
const gridImpr = ref<gridType>({
  columns: [
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행단계',
      align: 'center',
      style: 'width:85px',
      sortable: true
    },
    {
      name: 'improveRequestDeptName',
      field: 'improveRequestDeptName',
      label: '요청부서',
      align: 'center',
      style: 'width:85px',
      sortable: true
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:85px',
      sortable: true
    }
  ],
  height: '260px'
})
const scenario = ref<scenarioType>({
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  ramThirdAssessScenarioId: '',
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정
  mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  jobName: '', // 안전작업 명
  ramRiskHazardId: '', // 유해위험요인 번호
  riskHazardName: '', // 유해위험요인명
  ram4mRiskHazardClassCd: null, // 4M 분류 코드
  ramOccurrClassCd: null, // 발생구분
  damageTargetName: '', // 피해대상(key-in)
  damageTypeName: '', // 재해형태(key-in)
  improveFlag: 'X', // 개선여부
  existingRiskManagementActivities: '', // 현재안전조치
  addingRiskManagementActivities: '', // 추가 리스크 관리활동
  beforeRamMatrixRiskId: '', // 전 위험도 no
  afterRamMatrixRiskId: '', // 후 위험도 no
  assessDate: '', // 평가일
  assessUserId: '', // 평가자 ID
  assessUserName: '', // 평가자명
  vendorFlag: null, // 업체 작성 여부
  regUserId: '', // 작성자 ID
  chgUserId: '', // 수정자 ID
  imprs: [], // 개선목록
  ram4mRiskHazardClassName: '',
  ramMatrixId: '',
  beforeFrequency: null,
  beforeStrength: null,
  beforeRisk: null,
  riskbookFlag: '',
  afterFrequency: null,
  afterStrength: null,
  afterRisk: null,
  improvementMeasures: '',
  ramRiskThirdStandardId: null,
  currentSafetyMeasures: '',
  relationLaw: ''
})
const updateBtnData = ref({
  title: '평가',
  flag: false,
  research: ''
})
const attachHazardInfo = ref({
  isSubmit: '',
  taskClassCd: 'THIRD_RISK_HAZARD',
  taskKey: ''
})
const attachBeforeInfo = ref({
  isSubmit: '',
  task: [],
  taskClassCd: 'THIRD_SCENARIO_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref({
  isSubmit: '',
  task: []
})
const activeWinProps = ref({
  processCd: '',
  ramThirdAssessScenarioId: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const scenarioViewGroup = ref('L')
const riskStandardItems = ref<any>([])
const isSave = ref(false)
const isSaveUnit = ref(false)
const isComplete = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const listImprUrl = ref('')
const listRiskStandardUrl = ref('')
const saveUrl = ref('')
const saveUnitUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)
const winPopup = ref<any>(null)
const checkChildClosed = ref<numberNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const isCompared = computed(() => {
  return props.processData.reCheckedCnt > 0
})
const disabled = computed(() => {
  return (
    (!(props.param.ramStepCd === 'RRS0000005' || props.param.ramStepCd == 'RRS0000010') ||
      props.processData.ramProcessAssessStepCd === 'RPA0000005') &&
    !updateBtnData.value.flag
  )
})
const setheight = computed(() => {
  const pxRemove = props.height.replace('px', '')
  return props.height && props.height.indexOf('px') > -1 && !isNaN(pxRemove)
    ? Number(pxRemove) - 80 + 'px'
    : '500px'
})
const btnEditable = computed(() => {
  return (
    editable.value &&
    props.param.ramStepCd === 'RRS0000010' &&
    props.processData.ramProcessAssessStepCd === 'RPA0000005'
  )
})
const flagCondition = computed(() => {
  return props.param.ramStepCd === 'RRS0000010'
})
const gridColumns = computed(() => {
  let cols = []
  if (scenarioViewGroup.value === 'L') {
    cols = [
      {
        fix: true,
        name: 'riskHazardQuestionName',
        field: 'riskHazardQuestionName',
        label: '유해위험요인 (위험한 상황과 사건)',
        align: 'left',
        style: 'width:450px',
        sortable: false
      },
      {
        fix: true,
        name: 'riskHazardPicture',
        field: 'riskHazardPicture',
        label: '사진',
        align: 'center',
        style: 'width:40px',
        sortable: false,
        type: 'custom'
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        style: 'width:130px',
        sortable: false,
        type: 'text'
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:180px',
        sortable: false,
        type: 'textarea'
      },
      {
        name: 'ramRiskThirdStandardId',
        field: 'ramRiskThirdStandardId',
        label: '판단결과',
        align: 'center',
        style: 'width:100px',
        sortable: false,
        type: 'select',
        itemText: 'ramRiskLevelName',
        itemValue: 'ramRiskThirdStandardId',
        comboItems: riskStandardItems.value,
        isChip: true,
        required: true,
        setHeader: true
      },
      {
        name: 'picture',
        field: 'picture',
        label: '개선 전/후 사진',
        align: 'center',
        type: 'custom',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:180px',
        sortable: false,
        type: 'textarea'
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:150px',
        type: 'custom',
        sortable: false
      },
      {
        name: 'assessDate',
        field: 'assessDate',
        label: '평가일',
        align: 'center',
        type: 'date',
        style: 'width:130px',
        sortable: false
      },
      {
        name: 'assessUserName',
        field: 'assessUserName',
        label: '평가자',
        align: 'center',
        type: 'user',
        userId: 'assessUserId',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'riskbookFlag',
        field: 'riskbookFlag',
        label: '위험<br/>등록부',
        align: 'center',
        style: 'width:60px',
        sortable: true,
        type: 'check',
        true: 'Y',
        false: 'N'
      }
    ]
  } else {
    cols = [
      {
        name: 'item',
        field: 'item',
        label: '평가내용',
        align: 'left',
        sortable: false,
        type: 'custom'
      }
    ]
  }
  return cols
})
const selectScenario = computed(() => {
  return Boolean(scenario.value.ramThirdAssessScenarioId)
})
const requestContentsCols = computed(() => {
  return ['riskHazardQuestionName']
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => winPopup.value,
  () => {
    if (!winPopup.value) return
    checkChildClosed.value = setInterval(() => {
      if (!winPopup.value || winPopup.value.closed) {
        activeWinProps.value.processCd = ''
        activeWinProps.value.ramThirdAssessScenarioId = ''
        clearInterval(checkChildClosed.value)
        winPopup.value = null // 상태 초기화
      }
    }, 500) // 2초마다 확인
  },
  { immediate: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})
onUnmounted(() => {
  clearInterval(checkChildClosed.value)
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
  listUrl.value = selectConfig.ram.third.scenario.list.url
  detailUrl.value = selectConfig.ram.third.scenario.get.url
  listImprUrl.value = selectConfig.ram.third.riskReduce.impr.url
  listRiskStandardUrl.value = selectConfig.ram.riskThirdStandard.list.url
  saveUrl.value = transactionConfig.ram.third.scenario.save.url
  saveUnitUrl.value = transactionConfig.ram.third.scenario.saveUnit.url
  deleteUrl.value = transactionConfig.ram.third.scenario.delete.url
  completeUrl.value = transactionConfig.ram.assessProcess.complete.url
  // code setting
  // list setting
  getRiskStandardItems()
}
/******************************
 * TODO (목적): 시나리오 목록
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.thirdScenarios = _result.data
  })
}
/******************************
 * TODO (목적): 표준아이템 목록
 *******************************/
function getRiskStandardItems() {
  $http({
    url: listRiskStandardUrl.value,
    method: 'GET',
    params: {
      plantCd: props.processData.plantCd
    }
  }).then((_result: any) => {
    riskStandardItems.value = _.map(_result.data, (item) => {
      return _.extend(item, {
        attrVal1: item.riskColor
      })
    })
  })
}
/******************************
 * TODO (목적): 시나리오 상세
 *******************************/
function getDetail(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ramThirdAssessScenarioId),
    method: 'GET'
  }).then((_result: any) => {
    scenario.value = _result.data
    attachHazardInfo.value.taskKey = scenario.value.ramThirdAssessScenarioId
    attachBeforeInfo.value.taskKey = scenario.value.ramThirdAssessScenarioId
    attachAfterInfo.value.task = _.map(scenario.value.imprs, (_impr: any) => {
      return {
        taskClassCd: 'IBM_AFTER',
        taskKey: _impr.sopImprovementId
      }
    }) as any
  })
}
/******************************
 * TODO (목적): 개선목록 조회
 *******************************/
function getImprs() {
  $http({
    url: listImprUrl.value,
    method: 'GET',
    params: {
      ramThirdAssessScenarioId: scenario.value.ramThirdAssessScenarioId
    }
  }).then((_result: any) => {
    scenario.value.imprs = _result.data
  })
}
/******************************
 * TODO (목적): 테이블 데이터 변경
 * 협력업체 포탈에서는 평가자는 key-in
 * 따라서 평가자를 수정할 시에 id를 제거하도록 처리
 *******************************/
function tableDataChange(_props: any, _col: any) {
  if (_col.name === 'ramRiskThirdStandardId') {
    _props.row.riskColor = _.find(riskStandardItems.value, {
      ramRiskThirdStandardId: _props.row.ramRiskThirdStandardId
    }).riskColor
  }
}
/******************************
 * TODO (목적): 재조회
 *******************************/
function research() {
  emits('research', 'scenario')
}
/******************************
 * TODO (목적): 개선수정 시
 *******************************/
function imprChange(_data: any) {
  table.value.compoTable.resetVirtualScroll()
  research()
}
/******************************
 * TODO (목적): 개선요청
 *******************************/
function openImprRequest() {
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: scenario.value.riskHazardQuestionName,
    relationTableKey: scenario.value.ramThirdAssessScenarioId,
    ibmTaskTypeCd: 'ITT0000013',
    ibmTaskUnderTypeCd: 'ITTU000015'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeCardImprPopup
}
/******************************
 * TODO (목적): 개선상세 팝업 Callback
 *******************************/
function closeCardImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImprs()
}
/******************************
 * TODO (목적): 개선 상세
 *******************************/
function linkClick(_data: any, _row: any | undefined) {
  popupOptions.value.title = '개선 상세'
  popupOptions.value.param = {
    sopImprovementId: _data.sopImprovementId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeCardImprPopup
}
/******************************
 * TODO (목적): 리스트 뷰
 *******************************/
function listView() {
  scenarioViewGroup.value = 'L'
}
/******************************
 * TODO (목적): 카드 뷰
 *******************************/
function cardView() {
  scenarioViewGroup.value = 'C'
}
/******************************
 * TODO (목적): 시나리오 저장
 *******************************/
function saveScenario() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 시나리오 저장 callback
 *******************************/
function saveScenarioCallback() {
  message.requestSuccess()
  research()
  getList()
}
/******************************
 * TODO (목적): 시나리오 저장(카드)
 *******************************/
function saveScenarioUnit() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          scenario.value.chgUserId = user.value.userId

          isSaveUnit.value = !isSaveUnit.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 시나리오 저장 카드 callback
 *******************************/
function saveScenarioUnitCallback() {
  message.requestSuccess()
  research()
  getList()
}
/******************************
 * TODO (목적): 시나리오 제거
 *******************************/
function removeScenario() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.processData.thirdScenarios.splice(
              _.findIndex(props.processData.thirdScenarios, item),
              1
            )
          })
          table.value.compoTable.clearSelection()
          props.planUpdateBtnData.planResearch = uid()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 공정 완료
 *******************************/
function completeProcess() {
  // 도면 별 노드에 시나리오가 하나 이상 등록되었는지?
  // 화면에서 추가는 하고 저장을 하지 않았을 시에 해당 데이터도 일괄 저장 처리
  // 저장 처리 후 callback에서 process 목록 재조회
  let isProgress = true
  if (!props.processData.thirdScenarios || props.processData.thirdScenarios.length === 0) {
    isProgress = false
    message.alert({
      title: '안내',
      message: getLanguage('등록된 시나리오가 없습니다.', props.processData.processName),
      type: 'warning' // success / info / warning / error
    })
  }

  if (isProgress && validTable(gridColumns.value, props.processData.thirdScenarios)) {
    message.confirm({
      title: '확인',
      message: '완료하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        props.processData.chgUserId = user.value.userId
        props.processData.ramProcessAssessStepCd = 'RPA0000005'

        isComplete.value = !isComplete.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 공정완료 callback
 *******************************/
function completeProcessCallback(_result: any) {
  message.requestSuccess()
  emits('assessComplete', _result.data)

  props.planUpdateBtnData.planResearch = uid()
}
/******************************
 * TODO (목적): 유해위험요인 사진 오픈
 *******************************/
function openHazardPicture(_props: any) {
  popupOptions.value.title = '유해위험요인(위험한 상황과 사건) 사진'
  popupOptions.value.param = {
    ramThirdAssessScenarioId: _props.row.ramThirdAssessScenarioId,
    disabled: disabled.value
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/third/action/thirdRiskHazardPicture.vue'))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '50%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeHazardPicturePopup
}
/******************************
 * TODO (목적): 유해위험요인 사진 오픈 callback
 *******************************/
function closeHazardPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 개선 사진 오픈
 *******************************/
function openImprPicture(_props: any) {
  popupOptions.value.title = '개선 전/후 사진'
  popupOptions.value.param = {
    ramThirdAssessScenarioId: _props.row.ramThirdAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    disabled: disabled.value
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/third/action/thirdScenarioImprPicture.vue'))
  )
  popupOptions.value.width = '60%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeScenarioImprPicturePopup
}
/******************************
 * TODO (목적): 개선 사진 오픈 callback
 *******************************/
function closeScenarioImprPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 이전평가 비교 팝업
 *******************************/
function compareScenario() {
  const width = 1560
  const height = 700
  // 중앙 정렬 위치 계산
  const left = window.screenX + (window.innerWidth - width) / 2
  const top = window.screenY + (window.innerHeight - height) / 2
  const uri = `/ram/compare/compareScenario?ramTechniqueCd=${props.param.ramTechniqueCd}&ramRiskAssessmentPlanId=${props.param.ramRiskAssessmentPlanId}&processCd=${props.processData.processCd}`
  winPopup.value = window.open(
    uri,
    'compareBefore',
    `width=${width}, height=${height}, menubar=no, status=no, toolbar=no, left=${left}, top=${top}`
  )
  // window.addEventListener('message', handleMessage)
}
;(window as any).receiveDataFromChild = (_data: any) => {
  activeWinProps.value.processCd = _data.processCd
  activeWinProps.value.ramThirdAssessScenarioId = _data.ramThirdAssessScenarioId
}
/******************************
 * TODO (목적): 메시지 수신 핸들러 함수 (중복 방지)
 ******************************/
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramThirdAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramThirdAssessScenarioId = event.data.ramThirdAssessScenarioId
// }
/******************************
 * TODO (목적):
 *******************************/
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramThirdAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
/******************************
 * TODO (목적): 재조회
 * 재조회 목적 : 돌아가기전 데이터를 저장 했을 수도 있지만 입력만 하고 돌아가는 경우를 대비하기 위함
 *******************************/
function back() {
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

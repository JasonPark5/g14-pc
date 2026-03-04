<template>
  <div>
    <div class="row">
      <div
        :class="[
          scenarioViewGroup === 'L' ? 'col-12' : 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
          'scenario-list'
        ]"
      >
        <c-table
          ref="table"
          title="시나리오 목록"
          :columns="gridColumns"
          :gridHeight="setheight"
          :data="sop.scenarios"
          :merge="scenarioViewGroup === 'L' ? grid.merge : []"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && !disabled"
          :isExcelDown="scenarioViewGroup === 'L'"
          :isFullScreen="scenarioViewGroup === 'L'"
          :customTrClass="setTrClass"
          @innerBtnClicked="innerBtnClicked"
          @table-data-change="tableDataChange"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-show="isCompared"
                label="이전평가결과조회"
                icon="compare_arrows"
                @btnClicked="compareScenario"
              />
              <c-btn
                v-if="editable && !disabled && sop.scenarios && sop.scenarios.length > 0"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="sop.scenarios"
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
                :inputEditable="editable && Boolean(props.row.ramJsaAssessScenarioId)"
                :requestContentsCols="requestContentsCols"
                tableKey="ramJsaAssessScenarioId"
                ibmTaskTypeCd="ITT0000015"
                ibmTaskUnderTypeCd="ITTU000020"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'item'">
              <q-item class="card-scenario-list">
                <q-item-section>
                  <q-item-label class="scenario-card-title">{{
                    (props.row.jobName ? props.row.jobName + ' - ' : '') +
                    props.row.riskHazardNameClass
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
            <template v-else-if="col.name === 'afterRisk' || col.name === 'beforeRisk'">
              <q-btn
                v-if="editable && !disabled"
                flat
                size="12px"
                :color="disabled ? null : 'blue-6'"
                :label="props.row[col.name] ? props.row[col.name] : '보기'"
              >
                <q-popup-proxy
                  :breakpoint="1000"
                  ref="popupProxy"
                  :id="'proxy_' + props.rowIndex + '_' + col.name"
                >
                  <component
                    :is="col.component"
                    :props="props"
                    :col="col"
                    :editable="editable"
                    @callback="(data: any) => callbackProxy(data, props, col)"
                  />
                </q-popup-proxy>
              </q-btn>
              <q-btn
                v-else
                flat
                size="12px"
                :color="disabled ? null : 'blue-6'"
                :label="props.row[col.name] ? props.row[col.name] : ''"
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
                    <c-text
                      :disabled="true"
                      :editable="editable"
                      label="작업 / 작업단계 / 요인분류 / 유해위험요인"
                      name="scenarioTarget"
                      v-model:value="scenarioTarget"
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
                  <div class="col-12">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="원인"
                      name="riskOccurrenceCause"
                      v-model:value="scenario.riskOccurrenceCause"
                    />
                  </div>
                  <div class="col-12">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="결과"
                      name="riskOccurrenceResult"
                      v-model:value="scenario.riskOccurrenceResult"
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
                      :attachInfo="attachBeforeInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-5">
                    <c-textarea
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :rows="3"
                      label="현재안전조치"
                      name="currentSafetyMeasures"
                      v-model:value="scenario.currentSafetyMeasures"
                    />
                  </div>
                  <div class="col-3 scenario">
                    <q-list dense bordered separator>
                      <q-item>
                        <div class="card-risk-info detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('빈도') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label>{{ scenario.beforeFrequency }}</q-item-label>
                          </q-item-section>
                        </div>
                        <q-separator spaced vertical />
                        <div class="card-risk-info detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('강도') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label>{{ scenario.beforeStrength }}</q-item-label>
                          </q-item-section>
                        </div>
                      </q-item>
                      <q-item class="detail-risk">
                        <q-item-section>
                          <q-item-label>{{ $language('위험도') }}</q-item-label>
                        </q-item-section>

                        <q-item-section side class="detail-risk-num">
                          <q-item-label>{{ scenario.beforeRisk }}</q-item-label>
                        </q-item-section>
                        <q-item-section
                          v-if="!disabled && selectScenario"
                          side
                          class="detail-risk-num"
                        >
                          <q-btn unelevated round dense size="10px" color="primary" icon="create">
                            <q-popup-proxy ref="beforeRiskProxy">
                              <component
                                :is="riskPopComponent.value"
                                width="800px"
                                :props="{
                                  row: {
                                    ramMatrixId: scenario.ramMatrixId
                                  }
                                }"
                                :editable="editable && !disabled && selectScenario"
                                @callback="
                                  (data: any, color: any) =>
                                    callbackCardProxy(data, color, 'beforeRiskProxy')
                                "
                              />
                            </q-popup-proxy>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col-12">
                    <c-radio
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :comboItems="improveFlagItems"
                      label="개선진행여부"
                      name="improveFlag"
                      v-model:value="scenario.improveFlag"
                      @datachange="improveFlagChange"
                    />
                  </div>
                  <div class="col-12">
                    <c-table
                      title="개선 목록"
                      :editable="editable && !disabled && selectScenario"
                      :columns="gridImpr.columns"
                      :data="scenario.imprs"
                      :gridHeight="gridImpr.height"
                      :usePaging="false"
                      :hideBottom="true"
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
                  <div class="col-12 row">
                    <div class="col-4">
                      <c-upload-picture
                        isMultiTask
                        :attachInfo="attachAfterInfo"
                        :editable="editable && !disabled && selectScenario && afterRiskEditable"
                      />
                    </div>
                    <div class="col-5">
                      <c-textarea
                        :disabled="disabled || !selectScenario || !afterRiskEditable"
                        :editable="editable"
                        :rows="3"
                        label="추가 리스크관리 계획"
                        name="improvementMeasures"
                        v-model:value="scenario.improvementMeasures"
                      />
                    </div>
                    <div class="col-3 scenario">
                      <q-list dense bordered separator>
                        <q-item>
                          <div class="card-risk-info detail-risk">
                            <q-item-section>
                              <q-item-label>{{ $language('빈도') }}</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                              <q-item-label>{{ scenario.afterFrequency }}</q-item-label>
                            </q-item-section>
                          </div>
                          <q-separator spaced vertical />
                          <div class="card-risk-info detail-risk">
                            <q-item-section>
                              <q-item-label>{{ $language('강도') }}</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                              <q-item-label>{{ scenario.afterStrength }}</q-item-label>
                            </q-item-section>
                          </div>
                        </q-item>
                        <q-item class="detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('위험도') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side class="detail-risk-num">
                            <q-item-label>{{ scenario.afterRisk }}</q-item-label>
                          </q-item-section>
                          <q-item-section
                            v-if="!disabled && selectScenario && afterRiskEditable"
                            side
                            class="detail-risk-num"
                          >
                            <q-btn unelevated round dense size="10px" color="primary" icon="create">
                              <q-popup-proxy ref="afterRiskProxy">
                                <component
                                  :is="riskPopComponent.value"
                                  width="800px"
                                  :props="{
                                    row: {
                                      ramMatrixId: scenario.ramMatrixId
                                    }
                                  }"
                                  :editable="editable && !disabled && selectScenario"
                                  @callback="
                                    (data: any, color: any) =>
                                      callbackCardProxy(data, color, 'afterRiskProxy')
                                  "
                                />
                              </q-popup-proxy>
                            </q-btn>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
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
  name: 'jsaScenario'
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
  sop: {
    ramJsaAssessJobId: stringNull // 안전작업 일련번호
    ramRiskAssessmentPlanId: stringNull // 평가 일련번호
    processCd: stringNull // 단위공정 코드
    processName: stringNull
    mdmSopId: stringNull // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
    sopFlag: stringNull // sop 여부_sop에서 작업을 불러오는 경우
    jobName: stringNull // 안전작업 명
    regUserId: stringNull // 작성자 ID
    chgUserId: stringNull // 수정자 ID
    scenarios: Array<any>
    ramMatrixId: stringNull
  }
  disabled: boolean
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
      reCheckedCnt: 0
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
  disabled: false,
  sop: () => {
    return {
      ramJsaAssessJobId: '', // 안전작업 일련번호
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '',
      mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
      sopFlag: '', // sop 여부_sop에서 작업을 불러오는 경우
      jobName: '', // 안전작업 명
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      scenarios: [],
      ramMatrixId: ''
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
const improveFlagItems = ref<any>([])
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'jobStepName' },
    { index: 1, colName: 'riskHazardNameClass' },
    { index: 2, colName: 'riskHazardNameClass' }
  ],
  data: []
})
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
  height: '265px'
})
const scenario = ref<scenarioType>({
  ramJsaAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramJsaAssessJobId: '', // 안전작업 일련번호
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정
  mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  sopFlag: '', // sop 여부_sop에서 작업을 불러오는 경우
  jobName: '', // 안전작업 명
  jobStepId: '', // 작업단계일련번호
  jobStepNo: '', // 작업단계 번호
  jobStepName: '', // 작업단계 명
  jobStepDesc: '', // 작업단계 설명
  ramRiskHazardId: '', // 유해위험요인 코드
  riskHazardName: '', // 유해위험요인 명
  ramRiskHazardClassName: '',
  riskOccurrenceCause: '', // 위험발생 원인
  riskOccurrenceResult: '', // 위험발생 결과
  relationLaw: '', // 관련법규
  improveFlag: 'X', // 개선여부
  currentSafetyMeasures: '', // 현재 안전조치
  beforeRamMatrixRiskId: '', // 전 위험도 no
  afterRamMatrixRiskId: '', // 후 위험도 no
  improvementMeasures: '', // 개선대책
  assessDate: '', // 평가일
  assessUserId: '', // 평가자 ID
  compareId: '', // 비교 대상 일련번호(시나리오 일련번호)
  recheckFlag: '', // 재검토 여부
  regUserId: '', // 작성자 ID
  chgUserId: '', // 수정자 ID
  imprs: [] // 개선목록
})
const attachHazardInfo = ref({
  isSubmit: '',
  taskClassCd: 'RISK_HAZARD',
  taskKey: ''
})
const attachBeforeInfo = ref({
  isSubmit: '',
  taskClassCd: 'JSA_SCENARIO_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref({
  isSubmit: '',
  task: []
})
const activeWinProps = ref({
  processCd: '',
  ramJsaAssessScenarioId: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const scenarioViewGroup = ref('L')
const isSave = ref(false)
const isSaveUnit = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const listImprUrl = ref('')
const saveUrl = ref('')
const saveUnitUrl = ref('')
const deleteUrl = ref('')
const winPopup = ref<any>(null)
const table = ref<any>(null)
const editForm = ref<any>(null)
const rowIndex = ref(0)
const afterRiskProxy = ref<any>(null)
const beforeRiskProxy = ref<any>(null)
const checkChildClosed = ref<numberNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const isCompared = computed(() => {
  return props.processData.reCheckedCnt > 0
})
const setheight = computed(() => {
  const pxRemove = props.height.replace('px', '')
  return props.height && props.height.indexOf('px') > -1 && !isNaN(pxRemove)
    ? Number(pxRemove) - 50 + 'px'
    : '500px'
})
const riskPopComponent = computed(() => {
  return shallowRef(defineAsyncComponent(() => import(`@/views/ram/base/matrixPop.vue`)))
})
const gridColumns = computed(() => {
  let cols = [] as any
  if (scenarioViewGroup.value === 'L') {
    cols = [
      {
        fix: true,
        name: 'jobStepName',
        field: 'jobStepName',
        description: 'jobStepDesc',
        label: '작업단계',
        align: 'center',
        style: 'width:150px',
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
        fix: true,
        name: 'riskHazardNameClass',
        field: 'riskHazardNameClass',
        label: '분류-유해위험요인',
        align: 'left',
        style: 'width:200px',
        sortable: false,
        innerBtn: true,
        btns: [
          {
            label: '',
            icon: 'add',
            color: 'light-blue',
            value: '1',
            disableTarget: 'jobStepId',
            disableCon: null,
            tooltip: `${$language('가능한 원인 추가')} <span style="color:yellow"><b>${$language('(※ 관리되는 항목)')}'</b></span>`
          },
          { label: '', icon: 'add', color: 'orange', value: '2', tooltip: $language('원인 추가') }
        ]
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        type: 'text',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'riskOccurrenceCause',
        field: 'riskOccurrenceCause',
        label: '원인',
        align: 'left',
        style: 'width:170px',
        type: 'text',
        sortable: false,
        required: true
      },
      {
        name: 'riskOccurrenceResult',
        field: 'riskOccurrenceResult',
        label: '결과',
        align: 'left',
        style: 'width:170px',
        type: 'text',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        type: 'text',
        style: 'width:150px',
        sortable: false,
        required: true
      },
      {
        name: 'before',
        field: 'before',
        label: '개선전',
        align: 'center',
        child: [
          {
            name: 'beforeFrequency',
            field: 'beforeFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:40px',
            sortable: false
          },
          {
            name: 'beforeStrength',
            field: 'beforeStrength',
            label: '강도',
            align: 'center',
            style: 'width:40px',
            sortable: false
          },
          {
            name: 'beforeRisk',
            field: 'beforeRisk',
            label: '위험도',
            align: 'center',
            style: 'width:70px',
            sortable: false,
            type: 'custom',
            component: riskPopComponent.value
          }
        ]
      },
      {
        name: 'picture',
        field: 'picture',
        label: '개선 전/후 사진',
        align: 'center',
        type: 'custom',
        style: 'width:70px',
        sortable: false
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '개선대책',
        align: 'left',
        style: 'width:200px',
        type: 'text',
        sortable: false
      },
      {
        name: 'improveFlag',
        field: 'improveFlag',
        label: '개선진행여부',
        align: 'center',
        style: 'width:100px',
        sortable: false,
        type: 'select',
        comboItems: improveFlagItems.value
      },
      {
        name: 'impr',
        field: 'impr',
        label: '개선진행',
        align: 'center',
        child: [
          {
            name: 'customCol',
            field: 'customCol',
            label: '개선번호/개선진행상태',
            align: 'center',
            style: 'width:180px',
            type: 'custom',
            sortable: false
          }
        ]
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterFrequency',
            field: 'afterFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:40px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:40px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            style: 'width:70px',
            sortable: false,
            required: true,
            type: 'custom',
            component: riskPopComponent.value
          }
        ]
      },
      {
        name: 'assessDate',
        field: 'assessDate',
        label: '평가일',
        align: 'center',
        type: 'date',
        style: 'width:130px',
        sortable: false,
        required: true
      },
      {
        name: 'assessUserName',
        field: 'assessUserName',
        label: '평가자',
        align: 'center',
        type: 'user',
        userId: 'assessUserId',
        style: 'width:80px',
        sortable: false,
        required: true
      },
      {
        name: 'riskbookFlag',
        field: 'riskbookFlag',
        label: '위험등록부',
        align: 'center',
        sortable: true,
        style: 'width:70px',
        type: 'check',
        true: 'Y',
        false: 'N',
        disableTarget: 'riskRegisterFlag',
        disableCon: false
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
  return Boolean(scenario.value.ramJsaAssessScenarioId)
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['jobStepName', 'riskHazardNameClass', 'riskOccurrenceCause']
})
const scenarioTarget = computed(() => {
  return selectScenario.value
    ? `${scenario.value.jobName} / ${scenario.value.jobStepName} / ${scenario.value.ramRiskHazardClassName || ''} / ${scenario.value.riskHazardName}`
    : ''
})
const afterRiskEditable = computed(() => {
  return scenario.value.improveFlag !== 'N'
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
        activeWinProps.value.ramJsaAssessScenarioId = ''
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
  listUrl.value = selectConfig.ram.jsa.scenario.list.url
  detailUrl.value = selectConfig.ram.jsa.scenario.get.url
  listImprUrl.value = selectConfig.ram.jsa.riskReduce.impr.url
  saveUrl.value = transactionConfig.ram.jsa.scenario.save.url
  saveUnitUrl.value = transactionConfig.ram.jsa.scenario.saveUnit.url
  deleteUrl.value = transactionConfig.ram.jsa.scenario.delete.url
  // code setting
  improveFlagItems.value = [
    { code: 'X', codeName: $language('상관없음') },
    { code: 'Y', codeName: $language('개선진행') },
    { code: 'N', codeName: $language('유지') }
  ]
  // list setting
}
/******************************
 * TODO (목적): 시나리오 목록
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramJsaAssessJobId: props.sop.ramJsaAssessJobId
    }
  }).then((_result: any) => {
    props.sop.scenarios = _result.data
  })
}
/******************************
 * TODO (목적): 시나리오 상세
 *******************************/
function getDetail(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ramJsaAssessScenarioId),
    method: 'GET'
  }).then((_result: any) => {
    scenario.value = _result.data
    attachHazardInfo.value.taskKey = scenario.value.ramRiskHazardId
    attachBeforeInfo.value.taskKey = scenario.value.ramJsaAssessScenarioId
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
      ramJsaAssessScenarioId: scenario.value.ramJsaAssessScenarioId
    }
  }).then((_result: any) => {
    scenario.value.imprs = _result.data
    getList()
  })
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

function innerBtnClicked(_col: any, _props: any, _btn: any) {
  if (_col.name === 'riskHazardNameClass') {
    if (_btn.value === '1') {
      rowIndex.value = _props.rowIndex
      popupOptions.value = getPopupOptions('sop4', popupOptions.value, closeCausePopup, {
        /** 원하는 parameter 정의 */
        type: 'multiple',
        searchType: '4',
        searchParam: {
          subProcessCd: props.sop.processCd,
          jobStepId: _props.row.jobStepId,
          mdmHazardFactorsId: _props.row.ramRiskHazardId
        }
      })
    } else {
      props.sop.scenarios!.splice(_props.rowIndex, 0, {
        ramJsaAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
        ramJsaAssessJobId: props.sop.ramJsaAssessJobId, // 안전작업 일련번호
        ramRiskAssessmentPlanId: props.sop.ramRiskAssessmentPlanId, // 평가 일련번호
        processCd: props.sop.processCd, // 단위공정 코드
        processName: props.sop.processName, // 단위공정 코드
        jobStepId: _props.row.jobStepId, // 작업단계일련번호
        jobStepNo: _props.row.jobStepNo, // 작업단계 번호
        jobStepName: _props.row.jobStepName, // 작업단계 명
        jobStepDesc: _props.row.jobStepDesc, // 작업단계 설명
        ramRiskHazardId: _props.row.ramRiskHazardId, // 유해위험요인 코드
        riskHazardName: _props.row.riskHazardName, // 유해위험요인 명
        riskHazardNameClass: _props.row.riskHazardNameClass, // 분류 명
        relationLaw: _props.row.relationLaw, // 관련법규_유해위험요인 마스터에스 불러와서 편집후 저장
        riskOccurrenceCause: '', // 위험발생 원인
        riskOccurrenceResult: '', // 위험발생 결과
        currentSafetyMeasures: '', // 현재 안전조치
        beforeRamMatrixRiskId: '', // 전 위험도 no
        afterRamMatrixRiskId: '', // 후 위험도 no
        improvementMeasures: '', // 개선대책
        assessDate: getToday(), // 평가일
        assessUserName: _.clone(props.processData.assessUserName),
        assessUserId: _.clone(props.processData.assessUserId),
        sopImprovementIds: '',
        ibmStepNames: '',
        riskbookFlag: 'N',
        editFlag: 'C',
        ramMatrixId: props.sop.ramMatrixId,
        // 위험등록부 등재를 위한 prop
        riskRegisterFlag: false
      })
    }
  }
}
function closeCausePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      props.sop.scenarios.splice(rowIndex.value, 0, {
        ramJsaAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
        ramJsaAssessJobId: props.sop.ramJsaAssessJobId, // 안전작업 일련번호
        ramRiskAssessmentPlanId: props.sop.ramRiskAssessmentPlanId, // 평가 일련번호
        processCd: props.sop.processCd, // 단위공정 코드
        processName: props.sop.processName, // 단위공정 코드
        jobStepId: item.jobStepId, // 작업단계일련번호
        jobStepNo: item.jobStepNo, // 작업단계 번호
        jobStepName: item.jobStepName, // 작업단계 명
        jobStepDesc: item.jobStepDesc, // 작업단계 설명
        ramRiskHazardId: item.mdmHazardFactorsId, // 유해위험요인 코드
        riskHazardName: item.riskHazardName, // 유해위험요인 명
        ramRiskHazardClassName: item.ramRiskHazardClassName,
        riskHazardNameClass: item.ramRiskHazardClassName
          ? item.ramRiskHazardClassName + ' - ' + item.riskHazardName
          : item.riskHazardName, // 유해위험요인 명
        riskOccurrenceCause: item.hazardOccurReason, // 위험발생 원인
        riskOccurrenceResult: item.hazardOccurResult, // 위험발생 결과
        relationLaw: '', // 관련법규_유해위험요인 마스터에스 불러와서 편집후 저장
        currentSafetyMeasures: '', // 현재 안전조치
        beforeRamMatrixRiskId: '', // 전 위험도 no
        afterRamMatrixRiskId: '', // 후 위험도 no
        improvementMeasures: '', // 개선대책
        assessDate: getToday(), // 평가일
        assessUserName: _.clone(props.processData.assessUserName),
        assessUserId: _.clone(props.processData.assessUserId),
        sopImprovementIds: '',
        ibmStepNames: '',
        riskbookFlag: 'N',
        editFlag: 'C',
        ramMatrixId: props.sop.ramMatrixId,
        // 위험등록부 등재를 위한 prop
        riskRegisterFlag: false
      })
    })
  }
}
/******************************
 * TODO (목적): 개선요청
 *******************************/
function openImprRequest() {
  let requestContents = scenario.value.jobStepName
  if (scenario.value.riskHazardNameClass) {
    requestContents += ' / ' + scenario.value.riskHazardNameClass
  }
  if (scenario.value.riskOccurrenceCause) {
    requestContents += ' / ' + scenario.value.riskOccurrenceCause
  }
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: requestContents,
    relationTableKey: scenario.value.ramJsaAssessScenarioId,
    ibmTaskTypeCd: 'ITT0000015',
    ibmTaskUnderTypeCd: 'ITTU000020'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeCardImprPopup
}
/******************************
 * TODO (목적): 개선 상세
 *******************************/
function linkClick(_data: any, _row: any) {
  popupOptions.value.title = '개선'
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
 * TODO (목적): 개선상세 팝업 Callback
 *******************************/
function closeCardImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  getImprs()
}
/******************************
 * TODO (목적): 위험도(테이블)
 *******************************/
function callbackProxy(_data: any, _props: any, _col: any) {
  if (_col.name === 'beforeRisk') {
    props.sop.scenarios[_props.rowIndex].beforeFrequency = _data.f
    props.sop.scenarios[_props.rowIndex].beforeStrength = _data.s
    props.sop.scenarios[_props.rowIndex].beforeRisk = _data.r
    props.sop.scenarios[_props.rowIndex].beforeRamMatrixRiskId = _data.ramMatrixRiskId
    if (props.sop.scenarios[_props.rowIndex].improveFlag === 'N') {
      props.sop.scenarios[_props.rowIndex].afterFrequency = _data.f
      props.sop.scenarios[_props.rowIndex].afterStrength = _data.s
      props.sop.scenarios[_props.rowIndex].afterRisk = _data.r
      props.sop.scenarios[_props.rowIndex].afterRamMatrixRiskId = _data.ramMatrixRiskId
    }
  } else {
    props.sop.scenarios[_props.rowIndex].afterFrequency = _data.f
    props.sop.scenarios[_props.rowIndex].afterStrength = _data.s
    props.sop.scenarios[_props.rowIndex].afterRisk = _data.r
    props.sop.scenarios[_props.rowIndex].afterRamMatrixRiskId = _data.ramMatrixRiskId
  }
  if (props.sop.scenarios[_props.rowIndex].editFlag !== 'C') {
    props.sop.scenarios[_props.rowIndex].editFlag = 'U'
    props.sop.scenarios[_props.rowIndex].chgUserId = user.value.userId
  }
  const refName = 'proxy_' + _props.rowIndex + '_' + _col.name
  const elements = document.getElementById(refName) as any
  if (elements) {
    elements.style.display = 'none'
  }
}
/******************************
 * TODO (목적): 위험도(카드형)
 *******************************/
function callbackCardProxy(_data: any, _color: any, _refName: any) {
  if (_refName === 'beforeRiskProxy') {
    // 개선 전
    scenario.value.beforeFrequency = _data.f
    scenario.value.beforeStrength = _data.s
    scenario.value.beforeRisk = _data.r
    scenario.value.beforeRamMatrixRiskId = _data.ramMatrixRiskId

    if (scenario.value.improveFlag === 'N') {
      scenario.value.afterFrequency = _data.f
      scenario.value.afterStrength = _data.s
      scenario.value.afterRisk = _data.r
      scenario.value.afterRamMatrixRiskId = _data.ramMatrixRiskId
    }
  } else {
    // 개선 후
    scenario.value.afterFrequency = _data.f
    scenario.value.afterStrength = _data.s
    scenario.value.afterRisk = _data.r
    scenario.value.afterRamMatrixRiskId = _data.ramMatrixRiskId
  }
  afterRiskProxy.value.hide()
  beforeRiskProxy.value.hide()
  // this.$refs[refName].hide()
  // this.$forceUpdate()
}
/******************************
 * TODO (목적): 테이블 데이터 변경
 * 협력업체 포탈에서는 평가자는 key-in
 * 따라서 평가자를 수정할 시에 id를 제거하도록 처리
 *******************************/
function tableDataChange(_props: any, _col: any) {
  if (_col.name === 'improveFlag') {
    // 개선을 진행 할 건지 여부 체크
    if (_props.row[_col.name] === 'N') {
      props.sop.scenarios[_props.rowIndex].afterFrequency = _props.row.beforeFrequency
      props.sop.scenarios[_props.rowIndex].afterStrength = _props.row.beforeStrength
      props.sop.scenarios[_props.rowIndex].afterRisk = _props.row.beforeRisk
      props.sop.scenarios[_props.rowIndex].afterRamMatrixRiskId = _props.row.beforeRamMatrixRiskId
      props.sop.scenarios[_props.rowIndex].editFlag = 'U'
      props.sop.scenarios[_props.rowIndex].chgUserId = user.value.userId

      _props.row.addingRiskManagementActivities = '현상 유지'
      _props.row.afterFrequency = _props.row.beforeFrequency
      _props.row.afterStrength = _props.row.beforeStrength
      _props.row.afterRisk = _props.row.beforeRisk
      _props.row.afterRamMatrixRiskId = _props.row.beforeRamMatrixRiskId
    }
  }
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
 * TODO (목적): 개선진행여부 변경
 *******************************/
function improveFlagChange() {
  if (scenario.value.improveFlag === 'N') {
    // 유지하는 경우 개선 전 위험도를 복사 및 계획에는 현상유지 setting
    scenario.value.addingRiskManagementActivities = '현상 유지'
    scenario.value.afterFrequency = scenario.value.beforeFrequency
    scenario.value.afterStrength = scenario.value.beforeStrength
    scenario.value.afterRisk = scenario.value.beforeRisk
    scenario.value.afterRamMatrixRiskId = scenario.value.beforeRamMatrixRiskId
  }
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
      _.forEach(props.sop.scenarios, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
      })
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
 * TODO (목적): 유해위험요인 사진 오픈
 *******************************/
function openHazardPicture(_props: any) {
  popupOptions.value.title = '유해위험요인 사진'
  popupOptions.value.param = {
    ramRiskHazardId: _props.row.ramRiskHazardId,
    disabled: props.disabled
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/base/riskHazardPicture.vue'))
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
    ramJsaAssessScenarioId: _props.row.ramJsaAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    disabled: props.disabled
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/jsa/action/jsaScenarioImprPicture.vue'))
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
  activeWinProps.value.ramJsaAssessScenarioId = _data.ramJsaAssessScenarioId
}
/******************************
 * TODO (목적): 메시지 수신 핸들러 함수 (중복 방지)
 ******************************/
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramJsaAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramJsaAssessScenarioId = event.data.ramJsaAssessScenarioId
// }
/******************************
 * TODO (목적):
 *******************************/
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramJsaAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

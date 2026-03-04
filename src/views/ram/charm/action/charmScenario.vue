<template>
  <div>
    <div class="row charm-scenario">
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
          :data="processData.charmResultScenarios"
          :merge="scenarioViewGroup === 'L' ? grid.merge : []"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :isExcelDown="scenarioViewGroup === 'L'"
          :isFullScreen="scenarioViewGroup === 'L'"
          :customTrClass="setTrClass"
          :editable="editable && !disabled"
          selection="multiple"
          rowKey="ramCharmResultAssessScenarioId"
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
                v-show="
                  editable &&
                  !disabled &&
                  !btnEditable &&
                  processData.charmResultScenarios &&
                  processData.charmResultScenarios.length > 0
                "
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
                v-if="editable && !disabled"
                label="삭제"
                icon="remove"
                @btnClicked="removeScenario"
              />
              <c-btn
                v-show="
                  editable &&
                  !disabled &&
                  scenarioViewGroup === 'L' &&
                  processData.charmResultScenarios &&
                  processData.charmResultScenarios.length > 0
                "
                :isSubmit="isSave"
                :url="saveUrl"
                :param="processData.charmResultScenarios"
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
                :inputEditable="editable && Boolean(props.row.ramCharmResultAssessScenarioId)"
                :requestContentsCols="requestContentsCols"
                tableKey="ramCharmResultAssessScenarioId"
                ibmTaskTypeCd="ITT0000024"
                ibmTaskUnderTypeCd="ITTU000035"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'item'">
              <q-item class="card-scenario-list">
                <q-item-section>
                  <q-item-label class="scenario-card-title">{{
                    `${props.row['materialName']} `
                  }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    v-if="props.row.editFlag !== 'C'"
                    name="arrow_forward_ios"
                    color="blue"
                    size="sm"
                    class="cursor-pointer"
                    @click="getDetail(props.row)"
                  />
                </q-item-section>
              </q-item>
            </template>
            <template v-else-if="col.name === 'picture'">
              <q-icon
                style="font-size: 30px; cursor: pointer"
                class="text-primary"
                name="image"
                @click.stop="openImprPicture(props)"
              />
            </template>
            <template
              v-else-if="col.name === 'afterRiskEstimation' || col.name === 'beforeRiskEstimation'"
            >
              <q-btn
                v-if="editable && !disabled"
                flat
                size="12px"
                color="blue-6"
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
                color="blue-6"
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
            <div class="col-12">
              <c-card title="개선정보" class="cardClassDetailForm no-margin">
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
                  <div class="col-4">
                    <c-upload-picture
                      height="160px"
                      :attachInfo="attachBeforeInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-4">
                    <c-textarea
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :rows="2"
                      label="현재안전보건조치"
                      name="existingRiskManagementActivities"
                      v-model:value="scenario.existingRiskManagementActivities"
                    />
                    <c-textarea
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :rows="2"
                      label="감소대책"
                      name="addingRiskManagementActivies"
                      v-model:value="scenario.addingRiskManagementActivies"
                    />
                  </div>
                  <div class="col-4 scenario" style="margin-top: 0 !important">
                    <div class="formLabelTitle">
                      {{ $language('개선 전 위험도') }}
                    </div>
                    <q-list dense bordered separator>
                      <q-item>
                        <div class="card-risk-info-charm detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('노출수준') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label>{{ scenario.beforeExposureLevelFinal }}</q-item-label>
                          </q-item-section>
                        </div>
                        <q-separator spaced vertical />
                        <div class="card-risk-info-charm detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('유해성') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label>{{ scenario.beforeToxic }}</q-item-label>
                          </q-item-section>
                        </div>
                      </q-item>
                      <q-item class="detail-risk">
                        <q-item-section>
                          <q-item-label>{{ $language('위험도') }}</q-item-label>
                        </q-item-section>

                        <q-item-section side class="detail-risk-num-charm">
                          <q-item-label>{{ scenario.beforeRiskEstimation }}</q-item-label>
                        </q-item-section>
                        <q-item-section
                          v-if="!disabled && selectScenario"
                          side
                          class="detail-risk-num"
                        >
                          <q-btn unelevated round dense size="10px" color="primary" icon="create">
                            <q-popup-proxy ref="beforeRiskEstimationProxy">
                              <component
                                :is="riskPopComponent"
                                width="800px"
                                :props="{
                                  row: {
                                    ramMatrixId: scenario.ramMatrixId
                                  }
                                }"
                                :editable="editable && !disabled && selectScenario"
                                @callback="
                                  (data: any, color: any) =>
                                    callbackCardProxy(data, color, 'beforeRiskEstimationProxy')
                                "
                              />
                            </q-popup-proxy>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
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
                        (row: any) =>
                          imprClick(
                            {
                              sopImprovementId: row.sopImprovementId,
                              ramCharmResultAssessImprId: row.ramCharmResultAssessImprId
                            },
                            row
                          )
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
                      height="160px"
                      isMultiTask
                      :attachInfo="attachAfterInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-4 row">
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
                    <div class="col-12">
                      <c-checkbox
                        :disabled="disabled || !selectScenario"
                        :editable="editable"
                        :isFlag="true"
                        label="위험등록부"
                        name="riskbookFlag"
                        v-model:value="scenario.riskbookFlag"
                      />
                    </div>
                  </div>
                  <div class="col-4 scenario" style="margin-top: 0 !important">
                    <div class="formLabelTitle">
                      {{ $language('개선 후 위험도') }}
                    </div>
                    <q-list dense bordered separator>
                      <q-item>
                        <div class="card-risk-info-charm detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('노출수준') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label>{{ scenario.afterExposureLevelFinal }}</q-item-label>
                          </q-item-section>
                        </div>
                        <q-separator spaced vertical />
                        <div class="card-risk-info-charm detail-risk">
                          <q-item-section>
                            <q-item-label>{{ $language('유해성') }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label>{{ scenario.afterToxic }}</q-item-label>
                          </q-item-section>
                        </div>
                      </q-item>
                      <q-item class="detail-risk">
                        <q-item-section>
                          <q-item-label>{{ $language('위험도') }}</q-item-label>
                        </q-item-section>

                        <q-item-section side class="detail-risk-num-charm">
                          <q-item-label>{{ scenario.afterRiskEstimation }}</q-item-label>
                        </q-item-section>
                        <q-item-section
                          v-if="!disabled && selectScenario"
                          side
                          class="detail-risk-num"
                        >
                          <q-btn unelevated round dense size="10px" color="primary" icon="create">
                            <q-popup-proxy ref="afterRiskEstimationProxy">
                              <component
                                :is="riskPopComponent"
                                width="800px"
                                :props="{
                                  row: {
                                    ramMatrixId: scenario.ramMatrixId
                                  }
                                }"
                                :editable="editable && !disabled && selectScenario"
                                @callback="
                                  (data: any, color: any) =>
                                    callbackCardProxy(data, color, 'afterRiskEstimationProxy')
                                "
                              />
                            </q-popup-proxy>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
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
  name: 'charmScenario'
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
  estimationUpdateBtnData: {
    title: stringNull
    flag: boolean
    research: stringNull
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
      ramMatrixId: '',
      estimationFlag: '',
      resultReCheckedCnt: 0
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      ramTechniqueCd: ''
    }
  },
  estimationUpdateBtnData: () => {
    return {
      title: '추정', // 추정
      flag: false,
      research: ''
    }
  },
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  merge: [{ index: 0, colName: '' }],
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
  height: '240px'
})
const scenario = ref<scenarioType>({
  ramCharmResultAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정
  mdmChemMaterialId: '',
  materialName: '',
  existingRiskManagementActivities: '', // 현재안전보건조치
  addingRiskManagementActivies: '', // 추가 리스크 관리활동
  beforeRamMatrixRiskId: '', // 전 위험도 no
  afterRamMatrixRiskId: '', // 후 위험도 no
  assessDate: '', // 평가일
  assessUserId: '', // 평가자 ID
  assessUserName: '', // 평가자명
  regUserId: '', // 작성자 ID
  chgUserId: '', // 수정자 ID
  riskbookFlag: '',
  customCol: '',
  imprs: [], // 개선목록,
  beforeExposureLevelFinal: '',
  beforeToxic: '',
  beforeRiskEstimation: '',
  afterExposureLevelFinal: '',
  afterToxic: '',
  afterRiskEstimation: ''
})
const attachBeforeInfo = ref({
  isSubmit: '',
  task: [],
  taskClassCd: 'CHARM_SCENARIO_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref({
  isSubmit: '',
  task: [],
  taskClassCd: 'CHARM_SCENARIO_AFTER',
  taskKey: ''
})
const requestImprRow = ref<any>(null)
const activeWinProps = ref({
  processCd: '',
  ramCharmResultAssessScenarioId: ''
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
const isComplete = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const listImprUrl = ref('')
const saveUrl = ref('')
const saveUnitUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const winPopup = ref<any>(null)
const table = ref<any>(null)
const editForm = ref<any>(null)
const beforeRiskEstimationProxy = ref<any>(null)
const afterRiskEstimationProxy = ref<any>(null)
const checkChildClosed = ref<numberNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const isCompared = computed(() => {
  return props.processData.resultReCheckedCnt > 0
})
const disabled = computed(() => {
  return (
    props.param.ramStepCd == 'RRS0000015' &&
    props.processData.ramProcessAssessStepCd === 'RPA0000005'
  )
})
const setheight = computed(() => {
  const pxRemove = props.height.replace('px', '')
  return props.height && props.height.indexOf('px') > -1 && !isNaN(pxRemove)
    ? Number(pxRemove) - 150 + 'px'
    : '500px'
})
const btnEditable = computed(() => {
  return (
    editable.value &&
    props.param.ramStepCd === 'RRS0000010' &&
    props.processData.ramProcessAssessStepCd === 'RPA0000005'
  )
})
const gridColumns = computed(() => {
  let cols = [] as any
  if (scenarioViewGroup.value === 'L') {
    cols = [
      {
        fix: true,
        name: 'materialName',
        field: 'materialName',
        label: '화학자재',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'existingRiskManagementActivities',
        field: 'existingRiskManagementActivities',
        label: '현재안전보건조치',
        align: 'left',
        type: 'textarea',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'before',
        field: 'before',
        label: '개선전',
        align: 'center',
        child: [
          {
            name: 'beforeExposureLevelFinal',
            field: 'beforeExposureLevelFinal',
            label: '노출수준',
            align: 'center',
            style: 'width:60px',
            sortable: false
          },
          {
            name: 'beforeToxic',
            field: 'beforeToxic',
            label: '유해성',
            align: 'center',
            style: 'width:60px',
            sortable: false
          },
          {
            name: 'beforeRiskEstimation',
            field: 'beforeRiskEstimation',
            label: '위험도',
            align: 'center',
            style: 'width:70px',
            sortable: false,
            type: 'proxy',
            component: riskPopComponent.value
          }
        ]
      },
      {
        name: 'addingRiskManagementActivies',
        field: 'addingRiskManagementActivies',
        label: '감소대책',
        align: 'left',
        type: 'textarea',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterExposureLevelFinal',
            field: 'afterExposureLevelFinal',
            label: '노출수준',
            align: 'center',
            style: 'width:60px',
            sortable: false
          },
          {
            name: 'afterToxic',
            field: 'afterToxic',
            label: '유해성',
            align: 'center',
            style: 'width:60px',
            sortable: false
          },
          {
            name: 'afterRiskEstimation',
            field: 'afterRiskEstimation',
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
        name: 'picture',
        field: 'picture',
        label: '개선 전/후 사진',
        align: 'center',
        type: 'custom',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'assessDate',
        field: 'assessDate',
        label: '평가일',
        align: 'center',
        type: 'date',
        style: 'width:120px',
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
        style: 'width:100px',
        sortable: false,
        required: true
      },
      {
        name: 'riskbookFlag',
        field: 'riskbookFlag',
        label: '위험등록부',
        align: 'center',
        style: 'width:80px',
        sortable: true,
        type: 'check',
        true: 'Y',
        false: 'N',
        disableTarget: 'riskRegisterFlag',
        disableCon: false
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선번호/개선진행상태',
        align: 'center',
        style: 'width:190px',
        type: 'custom',
        sortable: false
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
  return Boolean(scenario.value.ramCharmResultAssessScenarioId)
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['materialName']
})
const riskPopComponent = computed(() => {
  return shallowRef(defineAsyncComponent(() => import(`@/views/ram/base/matrixPop.vue`)))
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.estimationUpdateBtnData.research,
  () => {
    getList()
  }
),
  watch(
    () => winPopup.value,
    () => {
      if (!winPopup.value) return

      checkChildClosed.value = setInterval(() => {
        if (!winPopup.value || winPopup.value.closed) {
          activeWinProps.value.processCd = ''
          activeWinProps.value.ramCharmResultAssessScenarioId = ''
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
  listUrl.value = selectConfig.ram.charm.scenario.result.url
  detailUrl.value = selectConfig.ram.charm.scenario.get.url
  listImprUrl.value = selectConfig.ram.charm.riskReduce.impr.url
  saveUrl.value = transactionConfig.ram.charm.scenario.result.url
  saveUnitUrl.value = transactionConfig.ram.charm.scenario.saveUnit.url
  deleteUrl.value = transactionConfig.ram.charm.scenario.delete.url
  completeUrl.value = transactionConfig.ram.assessProcess.complete.url
  // code setting
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
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.charmResultScenarios = _result.data
  })
}
/******************************
 * TODO (목적): 시나리오 상세
 *******************************/
function getDetail(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ramCharmResultAssessScenarioId),
    method: 'GET'
  }).then((_result: any) => {
    scenario.value = _result.data
    attachBeforeInfo.value.taskKey = scenario.value.ramCharmResultAssessScenarioId
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
      ramCharmResultAssessScenarioId: scenario.value.ramCharmResultAssessScenarioId
    }
  }).then((_result: any) => {
    scenario.value.imprs = _result.data
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
/******************************
 * TODO (목적): 개선요청
 *******************************/
function openImprRequest() {
  const requestContents = scenario.value.materialName
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: requestContents,
    relationTableKey: scenario.value.ramCharmResultAssessScenarioId,
    ibmTaskTypeCd: 'ITT0000024',
    ibmTaskUnderTypeCd: 'ITTU000035'
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
function imprClick(data: any, row: any) {
  requestImprRow.value = row
  popupOptions.value.title = '개선'
  popupOptions.value.param = {
    sopImprovementId: data.sopImprovementId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function closeImprPopup(result: any, flag: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    if (flag !== 'delete') {
      if (
        result.col1.ibmStepCd === 'IS00000010' ||
        result.col1.ibmStepCd === 'IS00000015' ||
        result.col1.ibmStepCd === 'IS00000020'
      ) {
        requestImprRow.value.riskRegisterFlag = true
      }
      const splitId = _.split(requestImprRow.value.sopImprovementIds, ',')
      const splitStep = _.split(requestImprRow.value.ibmStepNames, ',')
      if (splitId && splitId.length > 0) {
        const idIndex = _.indexOf(splitId, result.col1.sopImprovementId)
        splitStep[idIndex] = result.col1.ibmStepName
        requestImprRow.value.ibmStepNames = splitStep.toString()
      }
    } else {
      const splitId = _.split(requestImprRow.value.sopImprovementIds, ',')
      const splitStep = _.split(requestImprRow.value.ibmStepNames, ',')
      const splitClass = _.split(requestImprRow.value.ibmClassCds, ',')
      if (splitId && splitId.length > 0) {
        const idIndex = _.indexOf(splitId, result.col1.sopImprovementId)
        splitId.splice(idIndex, 1)
        splitStep.splice(idIndex, 1)
        splitClass.splice(idIndex, 1)
        requestImprRow.value.sopImprovementIds = splitId.toString()
        requestImprRow.value.ibmStepNames = splitStep.toString()
        requestImprRow.value.ibmClassCds = splitClass.toString()
      }
    }
    table.value.compoTable.resetVirtualScroll()
    research()
  }
}
/******************************
 * TODO (목적): 위험도(테이블)
 *******************************/
function callbackProxy(_data: any, _props: any, _col: any) {
  if (_col.name === 'beforeRiskEstimation') {
    props.processData.charmResultScenarios[_props.rowIndex].beforeExposureLevelFinal = _data.f
    props.processData.charmResultScenarios[_props.rowIndex].beforeToxic = _data.s
    props.processData.charmResultScenarios[_props.rowIndex].beforeRiskEstimation = _data.r
    props.processData.charmResultScenarios[_props.rowIndex].beforeRamMatrixRiskId =
      _data.ramMatrixRiskId
  } else {
    props.processData.charmResultScenarios[_props.rowIndex].afterExposureLevelFinal = _data.f
    props.processData.charmResultScenarios[_props.rowIndex].afterToxic = _data.s
    props.processData.charmResultScenarios[_props.rowIndex].afterRiskEstimation = _data.r
    props.processData.charmResultScenarios[_props.rowIndex].afterRamMatrixRiskId =
      _data.ramMatrixRiskId
  }
  if (props.processData.charmResultScenarios[_props.rowIndex].editFlag !== 'C') {
    props.processData.charmResultScenarios[_props.rowIndex].editFlag = 'U'
    props.processData.charmResultScenarios[_props.rowIndex].chgUserId = user.value.userId
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
  if (_refName === 'beforeRiskEstimationProxy') {
    // 개선 전
    scenario.value.beforeExposureLevelFinal = _data.f
    scenario.value.beforeToxic = _data.s
    scenario.value.beforeRiskEstimation = _data.r
    scenario.value.beforeRamMatrixRiskId = _data.ramMatrixRiskId
  } else {
    // 개선 후
    scenario.value.afterFrequency = _data.f
    scenario.value.afterStrength = _data.s
    scenario.value.afterRisk = _data.r
    scenario.value.afterRamMatrixRiskId = _data.ramMatrixRiskId
  }
  afterRiskEstimationProxy.value.hide()
  beforeRiskEstimationProxy.value.hide()
}
/******************************
 * TODO (목적): 시나리오 저장
 *******************************/
function saveScenario() {
  if (validTable(grid.value.columns, props.processData.charmResultScenarios)) {
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
            props.processData.charmResultScenarios.splice(
              _.findIndex(props.processData.charmResultScenarios, item),
              1
            )
          })
          table.value.compoTable.clearSelection()
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
  // 화면에서 추가는 하고 저장을 하지 않았을 시에 해당 데이터도 일괄 저장 처리
  // 저장 처리 후 callback에서 process 목록 재조회
  let isProgress = true
  if (
    !props.processData.charmResultScenarios ||
    props.processData.charmResultScenarios.length === 0
  ) {
    isProgress = false
    message.alert({
      title: '안내',
      message: getLanguage('공정에 등록된 시나리오가 없습니다.', props.processData.processName),
      type: 'warning' // success / info / warning / error
    })
  }

  if (isProgress && validTable(grid.value.columns, props.processData.charmResultScenarios)) {
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
}
/******************************
 * TODO (목적): 개선 사진 오픈
 *******************************/
function openImprPicture(_props: any) {
  popupOptions.value.title = '개선 전/후 사진'
  popupOptions.value.param = {
    ramCharmResultAssessScenarioId: _props.row.ramCharmResultAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    ramCharmResultAssessImprIds: _props.row.ramCharmResultAssessImprIds,
    disabled: disabled.value
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/charm/action/charmScenarioImprPicture.vue'))
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
  activeWinProps.value.ramCharmResultAssessScenarioId = _data.ramCharmResultAssessScenarioId
}
/******************************
 * TODO (목적): 메시지 수신 핸들러 함수 (중복 방지)
 ******************************/
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramCharmResultAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramCharmResultAssessScenarioId = event.data.ramCharmResultAssessScenarioId
// }
/******************************
 * TODO (목적): 자식창에서 선택한 row 관련 부모 row 배경색 변경
 *******************************/
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramCharmResultAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

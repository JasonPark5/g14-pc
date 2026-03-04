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
          title="체크리스트 목록"
          :columns="gridColumns"
          :data="target.scenarios"
          :gridHeight="setheight"
          :merge="scenarioViewGroup === 'L' ? grid.merge : []"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && !disabled"
          :isExcelDown="scenarioViewGroup === 'L'"
          :isFullScreen="scenarioViewGroup === 'L'"
          :customTrClass="setTrClass"
          selection="multiple"
          rowKey="ramChecklistAssessScenarioId"
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
                v-if="editable && !disabled"
                label="삭제"
                icon="remove"
                @btnClicked="removeScenario"
              />
              <c-btn
                v-if="editable && !disabled"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="target.scenarios"
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
                :inputEditable="
                  editable && !disabled && Boolean(props.row.ramChecklistAssessScenarioId)
                "
                :requestContentsCols="requestContentsCols"
                tableKey="ramChecklistAssessScenarioId"
                ibmTaskTypeCd="ITT0000010"
                ibmTaskUnderTypeCd="ITTU000010"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'checkItemName'">
              <template
                v-if="props.row.checkItemId && props.row.ramCheckItemClassCd !== 'RCIC000015'"
              >
                <!-- 작업, 기계·기구, 유해인자 & link 걸린 대상 -->
                <q-btn
                  flat
                  class="tableinnerBtn"
                  align="left"
                  color="blue-6"
                  :label="props.row[col.name]"
                  @click.stop="openItem(props.row)"
                />
              </template>
              <template v-else>
                <!-- 기타 & link 걸리지 않은 대상 -->
                {{ props.row[col.name] }}
              </template>
            </template>
            <template v-else-if="col.name === 'item'">
              <q-item class="card-scenario-list">
                <q-item-section>
                  <q-item-label class="scenario-card-title">{{
                    `${props.row['checklistQuestion']}`
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
                  <div class="col-5">
                    <c-text
                      :disabled="true"
                      :editable="editable"
                      label="분류"
                      name="ramCheckItemClassName"
                      v-model:value="scenario.ramCheckItemClassName"
                    />
                  </div>
                  <div class="col-7">
                    <c-text
                      :disabled="true"
                      :editable="editable"
                      label="평가대상"
                      name="checkItemName"
                      v-model:value="scenario.checkItemName"
                    />
                  </div>
                  <div class="col-12">
                    <c-textarea
                      :disabled="true"
                      :editable="editable"
                      autogrow
                      label="체크리스트 문항"
                      name="checklistQuestion"
                      v-model:value="scenario.checklistQuestion"
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
                      isMultiTask
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
                          codeGroupCd="RAM_INSPECT_RESULT_CD"
                          type="edit"
                          itemText="codeName"
                          itemValue="code"
                          :isChip="true"
                          label="결과"
                          name="ramInspectResultCd"
                          v-model:value="scenario.ramInspectResultCd"
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
  name: 'checklistScenario'
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
  target: {
    ramAssessChecklistTargetId: stringNull // 공종/유해인자/설비 일련번호
    ramRiskAssessmentPlanId: stringNull // 평가 일련번호
    processCd: stringNull // 단위공정 코드
    processName: stringNull // 단위공정명
    ramCheckItemClassCd: stringNull // 분류코드
    ramCheckItemClassName: stringNull // 분류코드
    checkItemName: stringNull // 분류명
    scenarios: Array<any>
    reCheckedCnt: numberNull
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
  target: () => {
    return {
      ramAssessChecklistTargetId: '', // 공종/유해인자/설비 일련번호
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정명
      ramCheckItemClassCd: '', // 분류코드
      ramCheckItemClassName: '', // 분류코드
      checkItemName: '', // 분류명
      scenarios: [],
      reCheckedCnt: 0
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
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'checkClassGroup' },
    { index: 1, colName: 'checkItemGroup' }
  ],
  columns: [],
  data: [],
  height: '600px'
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
  ramChecklistAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramCheckItemClassName: '',
  ramRiskAssessmentPlanId: '', // 평가 일련번호
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
  checkItemName: '',
  ramMatrixId: '',
  beforeFrequency: null,
  beforeStrength: null,
  beforeRisk: null,
  riskbookFlag: '',
  afterFrequency: null,
  afterStrength: null,
  afterRisk: null,
  ramInspectResultCd: '',
  checklistQuestion: ''
})
const attachBeforeInfo = ref({
  isSubmit: '',
  task: []
})
const attachAfterInfo = ref({
  isSubmit: '',
  task: []
})
const activeWinProps = ref({
  processCd: '',
  ramChecklistAssessScenarioId: ''
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
    ? Number(pxRemove) - 60 + 'px'
    : '500px'
})
const gridColumns = computed(() => {
  let cols = [] as any
  if (scenarioViewGroup.value === 'L') {
    cols = [
      {
        fix: true,
        name: 'ramCheckItemClassName',
        field: 'ramCheckItemClassName',
        label: '분류',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        fix: true,
        name: 'checkItemName',
        field: 'checkItemName',
        label: '평가대상',
        align: 'center',
        style: 'width:150px',
        type: 'custom',
        sortable: false
      },
      {
        fix: true,
        name: 'checklistQuestion',
        field: 'checklistQuestion',
        label: '체크리스트 문항',
        align: 'left',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        style: 'width:120px',
        type: 'text',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        type: 'textarea',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'ramInspectResultCd',
        field: 'ramInspectResultCd',
        label: '결과',
        align: 'center',
        style: 'width:90px',
        type: 'select',
        setHeader: true,
        codeGroupCd: 'RAM_INSPECT_RESULT_CD',
        isChip: true,
        required: true
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
        style: 'width:200px',
        type: 'textarea',
        sortable: false
      },
      {
        name: 'assessDate',
        field: 'assessDate',
        label: '평가일',
        align: 'center',
        type: 'date',
        style: 'width:120px',
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
        sortable: false,
        setHeader: true
      },
      {
        name: 'riskbookFlag',
        field: 'riskbookFlag',
        label: '위험<br/>등록부',
        align: 'center',
        style: 'width:55px',
        sortable: true,
        type: 'check',
        true: 'Y',
        false: 'N',
        disableTarget: 'riskRegisterFlag',
        disableCon: false
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
            style: 'width:150px',
            type: 'custom',
            sortable: false
          }
        ]
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
  return Boolean(scenario.value.ramChecklistAssessScenarioId)
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['ramCheckItemClassName', 'checkItemName']
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
        activeWinProps.value.ramChecklistAssessScenarioId = ''
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
  listUrl.value = selectConfig.ram.checklist.scenario.list.url
  detailUrl.value = selectConfig.ram.checklist.scenario.get.url
  listImprUrl.value = selectConfig.ram.checklist.riskReduce.impr.url
  saveUrl.value = transactionConfig.ram.checklist.scenario.save.url
  saveUnitUrl.value = transactionConfig.ram.checklist.scenario.saveUnit.url
  deleteUrl.value = transactionConfig.ram.checklist.scenario.delete.url
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
      ramAssessChecklistTargetId: props.target.ramAssessChecklistTargetId
    }
  }).then((_result: any) => {
    props.target.scenarios = _result.data
  })
}
/******************************
 * TODO (목적): 시나리오 상세
 *******************************/
function getDetail(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ramChecklistAssessScenarioId),
    method: 'GET'
  }).then((_result: any) => {
    scenario.value = _result.data
    attachBeforeInfo.value.task = _.map(scenario.value.imprs, (_impr: any) => {
      return {
        taskClassCd: 'IBM_BEFORE',
        taskKey: _impr.sopImprovementId
      }
    }) as any
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
      ramChecklistAssessScenarioId: scenario.value.ramChecklistAssessScenarioId
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
function openItem(row: any) {
  if (row.ramCheckItemClassCd === 'RCIC000001') {
    popupOptions.value.title = '안전작업표준 상세'
    popupOptions.value.param = {
      mdmSopId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/mdm/pim/sopDetail.vue`))
    )
    popupOptions.value.width = '80%'
    popupOptions.value.isFull = false
  } else if (row.ramCheckItemClassCd === 'RCIC000005') {
    popupOptions.value.title = '유해위험기계기구 상세'
    popupOptions.value.param = {
      hhmHazardousMachineryId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(
        () => import(`@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue`)
      )
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '유해인자 상세'
    popupOptions.value.param = {
      hazardCd: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sai/wmr/harmfulFactorsDetail.vue`))
    )
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
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
  const requestContents =
    scenario.value.ramCheckItemClassName + ' / ' + scenario.value.checkItemName
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: requestContents,
    relationTableKey: scenario.value.ram4mAssessScenarioId,
    ibmTaskTypeCd: 'ITT0000023',
    ibmTaskUnderTypeCd: 'ITTU000030'
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
            props.target.scenarios.splice(_.findIndex(props.target.scenarios, item), 1)
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
 * TODO (목적): 개선 사진 오픈
 *******************************/
function openImprPicture(_props: any) {
  popupOptions.value.title = '개선 전/후 사진'
  popupOptions.value.param = {
    ramChecklistAssessScenarioId: _props.row.ramChecklistAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    disabled: props.disabled
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () => import('@views/ram/checklist/action/checklistScenarioImprPicture.vue')
    )
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
  activeWinProps.value.ramChecklistAssessScenarioId = _data.ramChecklistAssessScenarioId
}
/******************************
 * TODO (목적): 메시지 수신 핸들러 함수 (중복 방지)
 ******************************/
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramChecklistAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramChecklistAssessScenarioId = event.data.ramChecklistAssessScenarioId
// }
/******************************
 * TODO (목적):
 *******************************/
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramChecklistAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

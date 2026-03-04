<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="table"
        title="평가대상 목록 - 작업/작업단계/유해위험요인"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="processData.sops"
        :merge="grid.merge"
        :columnSetting="false"
        :expandAll="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="false"
        :editable="editable && !disabled && isSelect"
        selection="multiple"
        rowKey="ramJsaAssessScenarioId"
        @innerBtnClicked="innerBtnClicked"
      >
        <template v-slot:table-button>
          <q-chip
            v-show="
              editable && !disabled && isSelect && processData.sops && processData.sops.length > 0
            "
            outline
            square
            clickable
            size="md"
            color="green"
            icon="contact_support"
            :label="$language('범례')"
            style="height: 26px; margin-right: 2px !important"
          >
            <q-popup-proxy>
              <q-banner>
                <q-icon
                  color="white"
                  name="add"
                  size="xs"
                  class="bg-green"
                  style="border-radius: 4px"
                />
                <span style="color: gray; margin-left: 10px">
                  : {{ $language('작업단계 추가') }}</span
                >
              </q-banner>
              <q-separator inset />
              <q-banner>
                <q-icon
                  color="white"
                  name="add"
                  size="xs"
                  class="bg-lime"
                  style="border-radius: 4px"
                />
                <span style="color: gray; margin-left: 10px">
                  : {{ $language('유해위험요인 추가') }}</span
                >
              </q-banner>
            </q-popup-proxy>
          </q-chip>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="추가"
              icon="add"
              @btnClicked="addJob"
            />
            <c-btn
              v-show="editable && !disabled && isSelect && checkProcessCd"
              label="SOP 추가"
              icon="add"
              @btnClicked="openSop"
            />
            <c-btn
              v-show="
                editable && !disabled && isSelect && processData.sops && processData.sops.length > 0
              "
              label="삭제"
              icon="remove"
              @btnClicked="removeSop"
            />
            <c-btn
              v-show="false"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="sopScenarioSave"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveSop"
              @btnCallback="saveSopCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <q-chip
              color="amber"
              outline
              square
              :clickable="true"
              text-color="white"
              style="margin-bottom: 4px !important"
              @click.stop="
                () => {
                  rowClick(props.row, props.pageIndex)
                }
              "
            >
              {{ $language('수정') }}
            </q-chip>
          </template>
          <template v-else-if="col.name === 'picture'">
            <q-icon
              style="font-size: 30px; cursor: pointer"
              class="text-success"
              name="image"
              @click.stop="openPicture(props)"
            />
          </template>
        </template>
      </c-table>
    </div>
    <q-dialog v-model="sopDialog" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editForm">
          <c-card title="작업/작업단계/유해위험요인 추가" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled && isSelect && isRowClick"
                  :disabled="disabledSop"
                  label="저장"
                  icon="save"
                  @btnClicked="accepts"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="공정"
                  name="processName"
                  v-model:value="sopData.processName"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledSop || disabled1 || !isRowClick"
                  :required="true"
                  label="작업"
                  name="jobName"
                  v-model:value="sopData.jobName"
                  @dataChange="jobChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledSop || disabled2 || !isRowClick"
                  :required="true"
                  label="작업단계순번"
                  name="jobStepNo"
                  v-model:value="sopData.jobStepNo"
                  @dataChange="jobStepChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledSop || disabled2 || !isRowClick"
                  :required="true"
                  label="작업단계"
                  name="jobStepName"
                  v-model:value="sopData.jobStepName"
                  @dataChange="jobStepChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabledSop || disabled2 || !isRowClick"
                  label="작업단계설명"
                  name="jobStepDesc"
                  v-model:value="sopData.jobStepDesc"
                  @dataChange="jobStepChange"
                />
              </div>
              <div class="col-12">
                <c-text
                  :afterIcon="
                    editable && !disabledSop && !disabled3 && isRowClick
                      ? [
                          {
                            name: 'search',
                            click: true,
                            callbackName: 'searchRiskHazard',
                            color: 'teal'
                          },
                          {
                            name: 'close',
                            click: true,
                            callbackName: 'removeRiskHazard',
                            color: 'red'
                          }
                        ]
                      : null
                  "
                  :editable="editable"
                  :disabled="disabledSop || disabled3 || !isRowClick"
                  :required="true"
                  label="유해위험요인"
                  name="riskHazardNameClass"
                  v-model:value="sopData.riskHazardNameClass"
                  @searchRiskHazard="searchRiskHazard"
                  @removeRiskHazard="removeRiskHazard"
                  @dataChange="riskHazardChagne"
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
import { processDataType, sopDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jsaTargetJobRisk'
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
  processData: processDataType
  disabled: boolean
}

interface gridType {
  columns: tableColumnType
  height: stringNull
  merge: tableMergeType
  data: Array<any>
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
  merge: [
    { index: 0, colName: 'processCd' },
    { index: 1, colName: 'groupMdmSopId' },
    { index: 2, colName: 'groupJobStepId' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'riskHazardClassName',
      field: 'riskHazardClassName',
      label: '분류',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '유해위험요인',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      name: 'picture',
      field: 'picture',
      label: '사진',
      align: 'center',
      type: 'custom',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '상세',
      align: 'center',
      style: 'width:40px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '480px'
})
const sopScenarioSave = ref<any>({
  ramRiskAssessmentPlanId: '',
  processCd: '',
  sops: [],
  scenarios: []
})
const sopData = ref<sopDataType>({
  ramJsaAssessJobId: '', // 안전작업 일련번호
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '',
  mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  groupMdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  sopFlag: 'N', // sop 여부_sop에서 작업을 불러오는 경우
  jobName: '', // 안전작업 명
  groupJobStepId: '', // 작업단계일련번호
  jobStepId: '', // 작업단계일련번호
  jobStepNo: '', // 작업단계 번호
  jobStepName: '', // 작업단계 명
  jobStepDesc: '', // 작업단계 설명
  ramRiskHazardId: '', // 유해위험요인 코드
  riskHazardName: '', // 유해위험요인 명
  riskHazardNameClass: '', // 유해위험요인 명
  regUserId: '', // 작성자 ID
  chgUserId: '', // 수정자 ID
  jobEditFlag: '',
  scenarioEditFlag: ''
})
const editForm = ref<any>(null)
const isSameJobName = ref(false)
const isSameJobStepName = ref(false)
const isRowAdd = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const rowIndex = ref(0)
const sopDialog = ref(false)
const table = ref<any>(null)
const disabled1 = ref(false)
const disabled2 = ref(false)
const disabled3 = ref(false)
const manualAdd = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return props.processData &&
    props.processData.processCd &&
    props.processData.ramProcessAssessStepCd !== 'RPA0000005'
    ? true
    : false
})
const checkProcessCd = computed(() => {
  return props.processData.processCd.indexOf('WTE') === -1
})
const disabledSop = computed(() => {
  return props.disabled || !isSelect.value
})
const isRowClick = computed(() => {
  return Boolean(sopData.value.ramJsaAssessJobId) || manualAdd.value
})

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
  listUrl.value = selectConfig.ram.assessSop.list.url
  saveUrl.value = transactionConfig.ram.assessSop.save.url
  deleteUrl.value = transactionConfig.ram.assessSop.delete.url
  // code setting
  grid.value.columns.splice(
    1,
    0,
    {
      name: 'jobName',
      field: 'jobName',
      label: '작업',
      align: 'center',
      style: 'width:160px',
      sortable: false,
      innerBtn: true,
      btns: [{ label: '', icon: 'add', color: 'green', tooltip: $language('작업단계 추가') }]
    },
    {
      name: 'jobStepName',
      field: 'jobStepName',
      description: 'jobStepDesc',
      label: '작업단계',
      align: 'center',
      style: 'width:200px',
      sortable: false,
      innerBtn: true,
      btns: [{ label: '', icon: 'add', color: 'lime', tooltip: $language('유해위험요인 추가') }]
    }
  )
  // list setting
}

/******************************
 * TODO (목적): SOP 조회
 *******************************/
function getSops() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.sops = _result.data
  })
}
/******************************
 * TODO (목적): SOP 팝업
 *******************************/
function openSop() {
  popupOptions.value = getPopupOptions('sop3', popupOptions.value, closeSopPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchType: '3', //1: 작업조회, 2:작업단계, 3:작업단계별 유해위험요인, 4:작업단계별 유해위험요인별 원인/결과
    searchParam: {
      subProcessCd: props.processData.processCd,
      ramRiskHazardTechniqueCd: 'RTH0000010'
    }
  })
}
/******************************
 * TODO (목적): SOP 팝업 callback
 *******************************/
function closeSopPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  const saveSopData = [] as any
  if (_data && _data.length > 0) {
    /**
     * 관리되는 SOP를 선택했을때 고려할 점
     *  1. mdmSopId 기준으로 이전에 등록된 데이터가 존재할 수 있음
     *  2. 존재하는 SOP의 jobName이 변경되었을 가능성이 존재
     *  3. 저장할 때에 같은 mdmSopId를 가지고 있다면 최신으로 업데이트하는 로직 필요
     */
    _.forEach(_data, (item: any) => {
      if (
        _.findIndex(props.processData.sops, {
          mdmSopId: item.mdmSopId,
          jobStepId: item.jobStepId,
          ramRiskHazardId: item.mdmHazardFactorsId
        }) === -1
      ) {
        let spliceIdx = _.findIndex(props.processData.sops, { mdmSopId: item.mdmSopId })
        if (spliceIdx > -1) {
          const spliceIdx2 = _.findIndex(props.processData.sops, {
            mdmSopId: item.mdmSopId,
            jobStepId: item.jobStepId
          })
          spliceIdx = spliceIdx2 > -1 ? spliceIdx2 : spliceIdx
        } else {
          spliceIdx = 0
        }
        _.forEach(props.processData.sops, (_sop: any) => {
          if (_sop.mdmSopId === item.mdmSopId && _sop.jobName !== item.jobName) {
            _sop.jobName = item.jobName
            if (_sop.jobEditFlag !== 'C') {
              _sop.jobEditFlag = 'U'
            }
          }

          if (
            _sop.jobStepId === item.jobStepId &&
            (_sop.jobStepNo !== item.jobStepNo ||
              _sop.jobStepName !== item.jobStepName ||
              _sop.jobStepDesc !== item.jobStepDesc)
          ) {
            _sop.jobStepNo = item.jobStepNo
            _sop.jobStepName = item.jobStepName
            _sop.jobStepDesc = item.jobStepDesc
            if (_sop.scenarioEditFlag !== 'C') {
              _sop.scenarioEditFlag = 'U'
            }
          }
        })
        saveSopData.push({
          ramJsaAssessScenarioId: uid(),
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
          processCd: props.processData.processCd,
          processName: props.processData.processName,
          ramJsaAssessJobId: '',
          ramTechniqueCd: 'RT00000015',
          groupMdmSopId: props.processData.processCd + '/' + item.mdmSopId,
          mdmSopId: item.mdmSopId,
          sopFlag: 'Y',
          jobName: item.sopName,
          groupJobStepId: props.processData.processCd + '/' + item.mdmSopId + '/' + item.jobStepId,
          jobStepId: item.jobStepId,
          jobStepNo: item.jobStepNo,
          jobStepName: item.jobStepName,
          jobStepDesc: item.jobStepDesc,
          ramRiskHazardClassCd: item.ramRiskHazardClassCd,
          relationLaw: item.relevantLegalStandards,
          ramRiskHazardId: item.mdmHazardFactorsId,
          riskHazardName: item.riskHazardName,
          riskHazardNameClass: item.ramRiskHazardClassName + ' - ' + item.riskHazardName,
          regUserId: user.value.userId,
          jobEditFlag: 'C',
          scenarioEditFlag: 'C',
          editFlag: 'C'
        })
      }
    })
    saveSop(saveSopData)
  }
}
function rowClick(row: any, index: any) {
  /**
   * 이후에 해당 정보를 클릭 한 후 수정하려고 할 수 있도록 열것임
   * 다만 해당 마다 존재하는 키값이 temp로 따진 키가 아닐 경우에만 한에서 열어줄것임
   * 작업seq, 작업단계seq, 유해위험요인seq
   */
  rowIndex.value = index
  if (!row.mdmSopId) {
    disabled1.value = false
    disabled2.value = false
    disabled3.value = false
  } else if (!row.jobStepId) {
    disabled1.value = true
    disabled2.value = false
    disabled3.value = false
  } else {
    disabled1.value = true
    disabled2.value = true
    disabled3.value = false
  }
  _.extend(sopData.value, row)
  sopDialog.value = true
}
/******************************
 * TODO (목적): 작업추가
 *******************************/
function addJob() {
  manualAdd.value = true
  rowIndex.value = 0
  disabled1.value = false
  disabled2.value = false
  disabled3.value = false
  const groupMdmSopId = props.processData.processCd + '/' + uid()
  const sop = {
    ramJsaAssessScenarioId: uid(),
    ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
    processCd: props.processData.processCd, // 단위공정 코드
    processName: props.processData.processName,
    ramJsaAssessJobId: '',
    ramTechniqueCd: 'RT00000015',
    groupMdmSopId: groupMdmSopId,
    mdmSopId: '',
    sopFlag: 'N',
    jobName: '',
    groupJobStepId: groupMdmSopId + '/' + uid(),
    jobStepId: '',
    jobStepNo: '',
    jobStepName: '',
    jobStepDesc: '',
    ramRiskHazardId: '',
    riskHazardName: '',
    riskHazardNameClass: '',
    regUserId: user.value.userId,
    jobEditFlag: 'C',
    scenarioEditFlag: 'C'
  }
  rowClick(sop, rowIndex.value)
}
/******************************
 * TODO (목적): 내부버튼 클릭
 *******************************/
function innerBtnClicked(_col: any, _props: any) {
  rowIndex.value = _props.rowIndex
  isRowAdd.value = true
  if (_col.name === 'jobName') {
    addSopDetail(_props)
  } else if (_col.name === 'jobStepName') {
    addRiskHazard(_props)
  }
}
/******************************
 * TODO (목적): SOP 추가
 *******************************/
function addSopDetail(_props: any) {
  disabled1.value = true
  disabled2.value = false
  disabled3.value = false
  const sop = {
    ramJsaAssessScenarioId: uid(),
    ramRiskAssessmentPlanId: _props.row.ramRiskAssessmentPlanId,
    processCd: _props.row.processCd,
    processName: _props.row.processName,
    ramJsaAssessJobId: _props.row.ramJsaAssessJobId,
    ramTechniqueCd: _props.row.ramTechniqueCd,
    groupMdmSopId: _props.row.groupMdmSopId,
    mdmSopId: _props.row.mdmSopId,
    sopFlag: _props.row.mdmSopId ? 'Y' : 'N',
    jobName: _props.row.jobName,
    groupJobStepId: _props.row.groupMdmSopId + '/' + uid(),
    jobStepId: '',
    jobStepNo: '',
    jobStepName: '',
    jobStepDesc: '',
    ramRiskHazardId: '',
    riskHazardName: '',
    riskHazardNameClass: '',
    regUserId: user.value.userId,
    jobEditFlag: '',
    scenarioEditFlag: 'C'
  }
  rowClick(sop, rowIndex.value)
}
/******************************
 * TODO (목적): 유해위험요인 추가
 *******************************/
function addRiskHazard(_props: any) {
  disabled1.value = true
  disabled2.value = true
  disabled3.value = false
  const _sop = {
    ramJsaAssessScenarioId: uid(),
    ramRiskAssessmentPlanId: _props.row.ramRiskAssessmentPlanId,
    processCd: _props.row.processCd,
    processName: _props.row.processName,
    ramJsaAssessJobId: _props.row.ramJsaAssessJobId,
    ramTechniqueCd: _props.row.ramTechniqueCd,
    groupMdmSopId: _props.row.groupMdmSopId,
    mdmSopId: _props.row.mdmSopId,
    sopFlag: _props.row.mdmSopId ? 'Y' : 'N',
    jobName: _props.row.jobName,
    groupJobStepId: _props.row.groupJobStepId,
    jobStepId: _props.row.jobStepId,
    jobStepNo: _props.row.jobStepNo,
    jobStepName: _props.row.jobStepName,
    jobStepDesc: _props.row.jobStepDesc,
    ramRiskHazardId: '',
    riskHazardName: '',
    riskHazardNameClass: '',
    regUserId: user.value.userId,
    jobEditFlag: '',
    scenarioEditFlag: 'C'
  }
  rowClick(_sop, rowIndex.value)
}
/******************************
 * TODO (목적): 유해위험요인 검색
 *******************************/
function searchRiskHazard() {
  popupOptions.value = getPopupOptions('riskHazard', popupOptions.value, closeRiskHazardPopup, {
    type: 'single'
  })
}
/******************************
 * TODO (목적): 유해위험요인 검색 callback
 *******************************/
function closeRiskHazardPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    if (
      _.findIndex(
        _.filter(props.processData.sops, {
          groupMdmSopId: sopData.value.groupMdmSopId,
          groupJobStepId: sopData.value.groupJobStepId
        }),
        { ramRiskHazardId: _data[0].ramRiskHazardId }
      ) === -1
    ) {
      sopData.value.ramRiskHazardId = _data[0].ramRiskHazardId
      sopData.value.riskHazardName = _data[0].riskHazardName
      sopData.value.riskHazardNameClass =
        _data[0].ramRiskHazardClassName + ' - ' + _data[0].riskHazardName
    } else {
      message.alert({
        title: '안내',
        message: '해당 작업 - 작업단계에 존재하는 유해위험요인입니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 유해위험요인 삭제
 *******************************/
function removeRiskHazard() {
  sopData.value.ramRiskHazardId = null
  sopData.value.riskHazardName = null
  sopData.value.riskHazardNameClass = null
}
/******************************
 * TODO (목적): 작업변경
 *******************************/
function jobChange() {
  if (_.findIndex(props.processData.sops, { jobName: sopData.value.jobName }) > -1) {
    isSameJobName.value = true
  } else {
    isSameJobName.value = false
    if (sopData.value.jobEditFlag !== 'C') {
      sopData.value.jobEditFlag = 'U'
    }
  }
}
function jobStepChange() {
  const idx = _.findIndex(props.processData.sops, {
    groupMdmSopId: sopData.value.groupMdmSopId,
    jobStepName: sopData.value.jobStepName
  })
  if (idx > -1) {
    isSameJobStepName.value = true
  } else {
    isSameJobStepName.value = false
    if (sopData.value.scenarioEditFlag !== 'C') {
      sopData.value.scenarioEditFlag = 'U'
    }
  }
}
function riskHazardChagne(_props: any) {
  // 직적 입력하는 순간 유해위험요인의 id는 null처리
  if (_props && _props.row) {
    _props.row.ramRiskHazardId = null
  } else {
    sopData.value.ramRiskHazardId = null
  }
  sopData.value.riskHazardName = sopData.value.riskHazardNameClass
  if (sopData.value.scenarioEditFlag !== 'C') {
    sopData.value.scenarioEditFlag = 'U'
  }
}
/******************************
 * TODO (목적): 작업저장
 *******************************/
function accepts() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (isSameJobName.value) {
        message.alert({
          title: '안내',
          message: '동일한 작업명이 존재합니다.',
          type: 'warning' // success / info / warning / error
        })
        isSameJobName.value = false
        isSameJobStepName.value = false
        return
      }
      if (isSameJobStepName.value) {
        message.alert({
          title: '안내',
          message: '동일한 작업단계명이 존재합니다.',
          type: 'warning' // success / info / warning / error
        })
        isSameJobName.value = false
        isSameJobStepName.value = false
        return
      }

      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          const saveSopDataPop = [] as any
          saveSopDataPop.push(sopData.value)
          // props.processData.sops.splice(rowIndex.value, 0, _.clone(sopData.value))
          // 초기화 & dialog close
          sopData.value = {
            ramJsaAssessJobId: '', // 안전작업 일련번호
            ramRiskAssessmentPlanId: '', // 평가 일련번호
            processCd: '', // 단위공정 코드
            processName: '',
            mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
            groupMdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
            sopFlag: 'N', // sop 여부_sop에서 작업을 불러오는 경우
            jobName: '', // 안전작업 명
            groupJobStepId: '', // 작업단계일련번호
            jobStepId: '', // 작업단계일련번호
            jobStepNo: '', // 작업단계 번호
            jobStepName: '', // 작업단계 명
            jobStepDesc: '', // 작업단계 설명
            ramRiskHazardId: '', // 유해위험요인 코드
            riskHazardName: '', // 유해위험요인 명
            riskHazardNameClass: '', // 유해위험요인 명
            regUserId: '', // 작성자 ID
            chgUserId: '', // 수정자 ID
            jobEditFlag: '',
            scenarioEditFlag: ''
          }
          sopDialog.value = false

          saveSop(saveSopDataPop)
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
 * TODO (목적): 다이얼로그 닫기
 *******************************/
function closeDialog() {
  isSameJobName.value = false
  isSameJobStepName.value = false
  sopData.value = {
    ramJsaAssessJobId: '', // 안전작업 일련번호
    ramRiskAssessmentPlanId: '', // 평가 일련번호
    processCd: '', // 단위공정 코드
    processName: '',
    mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
    groupMdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
    sopFlag: 'N', // sop 여부_sop에서 작업을 불러오는 경우
    jobName: '', // 안전작업 명
    groupJobStepId: '', // 작업단계일련번호
    jobStepId: '', // 작업단계일련번호
    jobStepNo: '', // 작업단계 번호
    jobStepName: '', // 작업단계 명
    jobStepDesc: '', // 작업단계 설명
    ramRiskHazardId: '', // 유해위험요인 코드
    riskHazardName: '', // 유해위험요인 명
    riskHazardNameClass: '', // 유해위험요인 명
    regUserId: '', // 작성자 ID
    chgUserId: '', // 수정자 ID
    jobEditFlag: '',
    scenarioEditFlag: ''
  }
  sopDialog.value = false
}
/******************************
 * TODO (목적): SOP 저장
 *******************************/
function saveSop(_saveSopData: any) {
  _.forEach(_saveSopData, (sop) => {
    sop.chgUserId = user.value.userId
  })
  sopScenarioSave.value.ramRiskAssessmentPlanId = props.processData.ramRiskAssessmentPlanId
  sopScenarioSave.value.processCd = props.processData.processCd
  sopScenarioSave.value.sops = []
  sopScenarioSave.value.scenarios = []
  // 작업별로 모음
  _.forEach(
    _.filter(_saveSopData, (item) => {
      return item.jobEditFlag === 'C'
    }),
    (_sop: any) => {
      if (_.findIndex(sopScenarioSave.value.sops, { jobName: _sop.jobName }) === -1) {
        sopScenarioSave.value.sops.push(_sop)
      }
    }
  )
  sopScenarioSave.value.scenarios = _.map(_saveSopData, (sop) => {
    return _.extend(sop, {
      editFlag: sop.scenarioEditFlag
    })
  })
  isSave.value = !isSave.value
}
/******************************
 * TODO (목적): SOP 저장 callback
 *******************************/
function saveSopCallback() {
  message.requestSuccess()
  emits('saveProcess', props.processData.processCd)
  emits('research')
  getSops()
}

/******************************
 * TODO (목적): SOP 삭제
 *******************************/
function removeSop() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    const _message =
      '관련되어 있는 정보 및 개선사항, 위험등록부가 같이 삭제됩니다. 진행하시겠습니까?'
    message.confirm({
      title: '확인',
      message: _message,
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
            props.processData.sops = _.reject(props.processData.sops, item)
          })
          table.value.compoTable.clearSelection()
          emits('research')
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 유해위험요인 사진
 *******************************/
function openPicture(_props: any) {
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
  popupOptions.value.closeCallback = closePicturePopup
}
/******************************
 * TODO (목적): 유해위험요인 사진 callback
 *******************************/
function closePicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

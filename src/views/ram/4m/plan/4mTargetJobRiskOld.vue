<template>
  <c-table
    ref="table"
    title="평가대상 목록 - 작업/유해위험요인"
    :columns="grid.columns"
    gridHeightAuto
    :data="processData.fmScenarios"
    :merge="grid.merge"
    :columnSetting="false"
    :expandAll="false"
    :isFullScreen="false"
    :usePaging="false"
    :hideBottom="false"
    :filtering="false"
    :editable="editable && !disabled"
    selection="multiple"
    rowKey="ram4mAssessScenarioId"
    @innerBtnClicked="innerBtnClicked"
  >
    <template v-slot:table-button>
      <q-chip
        v-show="
          editable &&
          !disabled &&
          isSelect &&
          processData.fmScenarios &&
          processData.fmScenarios.length > 0
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
              style="background-color: #4caf50; border-radius: 4px"
            />
            <span style="color: gray; margin-left: 10px"
              >: {{ $language('유해위험요인 추가') }}</span
            >
          </q-banner>
        </q-popup-proxy>
      </q-chip>
      <q-btn-group outline>
        <c-btn
          v-show="editable && !disabled && isSelect"
          label="직접추가"
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
            editable &&
            !disabled &&
            isSelect &&
            processData.fmScenarios &&
            processData.fmScenarios.length > 0
          "
          label="삭제"
          icon="remove"
          @btnClicked="removeSop"
        />
        <c-btn
          v-show="
            editable &&
            !disabled &&
            isSelect &&
            processData.fmScenarios &&
            processData.fmScenarios.length > 0
          "
          :isSubmit="isSave"
          :url="saveUrl"
          :param="processData.fmScenarios"
          mappingType="PUT"
          label="저장"
          icon="save"
          @beforeAction="saveSop"
          @btnCallback="saveSopCallback"
        />
      </q-btn-group>
    </template>
    <template v-slot:customArea="{ props, col }">
      <template v-if="col.name === 'riskHazardName'">
        <c-text
          :afterIcon="
            editable && !disabled && isSelect
              ? [
                  {
                    name: 'search',
                    click: true,
                    callbackName: 'searchRiskHazard',
                    color: 'teal'
                  },
                  { name: 'close', click: true, callbackName: 'removeRiskHazard', color: 'red' }
                ]
              : null
          "
          :editable="editable"
          :disabled="disabled || !isSelect"
          :close="false"
          label=""
          name="riskHazardName"
          v-model:value="props.row[col.name]"
          @searchRiskHazard="searchRiskHazardPop(props, col)"
          @removeRiskHazard="removeRowRiskHazard(props)"
          @dataChange="chagneRiskHazard(props, col)"
        />
      </template>
      <template v-else-if="col.name === 'jobName'">
        <c-text-column
          :editable="editable && !disabled && isSelect"
          :disabled="disabled || !isSelect"
          :col="col"
          :props="props"
          v-model:value="props.row[col.name]"
          @datachange="datachange(props, col)"
        />
        <div v-if="editable && !disabled && isSelect">
          <q-btn-group outline class="ColumInnerBtnGroup">
            <q-btn
              icon="add"
              color="green"
              text-color="white"
              class="ColumInnerBtn"
              align="center"
              @click.prevent="innerBtnClicked(col, props)"
            >
              <q-tooltip>
                {{ $language('유해위험요인 추가') }}
              </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </template>
      <template v-else-if="col.name === 'picture'">
        <q-icon
          style="font-size: 30px; cursor: pointer"
          class="text-green-custom"
          name="image"
          @click.stop="openPicture(props)"
        />
      </template>
    </template>
  </c-table>
  <q-dialog v-model="sopDialog" persistent>
    <q-card style="min-width: 350px">
      <q-form ref="editForm">
        <c-card title="평가대상 상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && !disabled && isRowClick && isSelect"
                :disabled="disabled || !isSelect"
                label="적용"
                icon="save"
                @btnClicked="accepts"
              />
              <c-btn label="닫기" icon="cancel" @btnClicked="closeDialog" />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :editable="editable"
                :disabled="true"
                label="공정"
                name="processName"
                v-model:value="sopData.processName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :editable="editable"
                :disabled="disabled || !isRowClick || Boolean(sopData.mdmSopId) || !isSelect"
                :required="true"
                label="작업"
                name="jobName"
                v-model:value="sopData.jobName"
                @dataChange="jobChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-select
                :required="true"
                :editable="editable"
                :disabled="disabled || !isRowClick || !isSelect"
                codeGroupCd="RAM_4M_RISK_HAZARD_CLASS_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="ram4mRiskHazardClassCd"
                label="평가구분(4M)"
                v-model:value="sopData.ram4mRiskHazardClassCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :afterIcon="
                  editable && !disabled && isRowClick && isSelect
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
                :disabled="disabled || !isRowClick || !isSelect"
                :required="true"
                :close="false"
                label="유해위험요인 (재해형태)"
                name="riskHazardName"
                v-model:value="sopData.riskHazardName"
                @searchRiskHazard="searchRiskHazardPop"
                @removeRiskHazard="removeRiskHazardPop"
                @dataChange="chagneRiskHazardPop"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </q-card>
  </q-dialog>
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
import { assessPlanType, processDataType, sopDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: '4mTargetJobRiskOld'
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

interface gridType {
  columns: tableColumnType
  height: stringNull
  merge: tableMergeType
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
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'groupMdmSopId' }],
  columns: [],
  data: [],
  height: '550px'
})
const rowRiskHazardInfo = ref<any>({
  row: null,
  col: null
})
const sopData = ref<sopDataType>({
  ram4mAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정 코드
  groupMdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
  jobName: '', // 안전작업 명
  ramRiskHazardId: '', // 유해위험요인 번호
  riskHazardName: '', // 유해위험요인명
  ram4mRiskHazardClassCd: null, // 4M 분류 코드
  ram4mRiskHazardClassName: '', // 4M 분류
  damageTargetName: '', // 피해대상(key-in)
  damageTypeName: '', // 재해형태(key-in)
  regUserId: '', // 작성자 ID
  chgUserId: '' // 수정자 ID
})
const editForm = ref<any>(null)
const isSameJobName = ref(false)
const isRowClick = ref(false)
const isRowAdd = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const rowIndex = ref(0)
const sopDialog = ref(false)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// const isSelect = computed(() => {
//   return props.processData &&
//     props.processData.processCd &&
//     props.processData.ramProcessAssessStepCd !== 'RPA0000005'
//     ? true
//     : false
// })
const checkProcessCd = computed(() => {
  return props.processData.processCd.indexOf('WTE') === -1
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
  listUrl.value = selectConfig.ram.fm.scenario.list.url
  saveUrl.value = transactionConfig.ram.fm.scenario.save.url
  deleteUrl.value = transactionConfig.ram.fm.scenario.delete.url
  // code setting
  getComboItems('RAM_RISK_HAZARD_CLASS_CD', 'fm').then((_result: any) => {
    grid.value.columns = [
      {
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'center',
        style: 'width:400px',
        sortable: false,
        required: true,
        type: 'custom'
      },
      {
        name: 'ram4mRiskHazardClassCd',
        field: 'ram4mRiskHazardClassCd',
        label: '평가구분(4M)',
        align: 'center',
        style: 'width:160px',
        sortable: false,
        required: true,
        type: 'select',
        comboItems: _result
      },
      {
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '유해위험요인 (재해형태)',
        align: 'left',
        sortable: false,
        required: true,
        type: 'custom'
      },
      {
        name: 'picture',
        field: 'picture',
        label: '사진',
        align: 'center',
        type: 'custom',
        style: 'width:80px',
        sortable: false
      }
    ]
  })
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
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.fmScenarios = _result.data
  })
}
/******************************
 * TODO (목적): 직접 입력하는 순간 유해위험요인의 id는 null처리
 *******************************/
function chagneRiskHazard(_props: any, _col: any) {
  if (props && _props.row) {
    _props.row.ramRiskHazardId = null
  } else {
    sopData.value.ramRiskHazardId = null
  }
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
}
/******************************
 * TODO (목적): 직접 입력하는 순간 유해위험요인의 id는 null처리
 *******************************/
function chagneRiskHazardPop(_props: any, _col: any) {
  sopData.value.ramRiskHazardId = null
}
/******************************
 * TODO (목적): SOP 팝업
 *******************************/
function openSop() {
  popupOptions.value = getPopupOptions('sop7', popupOptions.value, closeSopPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchType: '7', //1: 작업조회, 2:작업단계, 3:작업단계별 유해위험요인, 4:작업단계별 유해위험요인별 원인/결과
    searchParam: {
      subProcessCd: props.processData.processCd,
      ramRiskHazardTechniqueCd: 'RTH0000001'
    }
  })
}
/******************************
 * TODO (목적): SOP 팝업 callback
 *******************************/
function closeSopPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.processData.fmScenarios, {
          mdmSopId: item.mdmSopId,
          ramRiskHazardId: item.mdmHazardFactorsId
        }) === -1
      ) {
        props.processData.fmScenarios.splice(0, 0, {
          ram4mAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
          processCd: props.processData.processCd, // 단위공정 코드
          processName: props.processData.processName,
          ramTechniqueCd: 'RT00000025',
          groupMdmSopId: props.processData.processCd + '/' + item.mdmSopId,
          mdmSopId: item.mdmSopId, // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
          jobName: item.sopName, // 안전작업 명
          ramRiskHazardId: item.mdmHazardFactorsId, // 유해위험요인 번호
          riskHazardName: item.riskHazardName, // 유해위험요인명
          ram4mRiskHazardClassCd: null, // 4M 분류 코드
          ram4mRiskHazardClassName: '', // 4M 분류
          damageTargetName: '', // 피해대상(key-in)
          damageTypeName: '', // 재해형태(key-in)
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
    // this.saveSop();
  }
}
/******************************
 * TODO (목적): 팝업
 * 이후에 해당 정보를 클릭 한 후 수정하려고 할 수 있도록 열것임
 * 다만 해당 마다 존재하는 키값이 temp로 따진 키가 아닐 경우에만 한에서 열어줄것임
 * 유해위험요인seq
 *******************************/
function openPop(_row: any, _index: any) {
  rowIndex.value = _index
  isRowClick.value = true
  _.extend(sopData.value, _row)
  if (sopData.value.editFlag !== 'C') {
    sopData.value.editFlag = 'U'
    sopData.value.chgUserId = user.value.userId
  }
  sopDialog.value = true
}
/******************************
 * TODO (목적): 작업추가
 *******************************/
function addJob() {
  rowIndex.value = 0
  isRowAdd.value = true
  const groupMdmSopId = props.processData.processCd + '/' + uid()
  const _sop = {
    ram4mAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
    ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
    processCd: props.processData.processCd, // 단위공정 코드
    processName: props.processData.processName,
    ramTechniqueCd: 'RT00000025',
    groupMdmSopId: groupMdmSopId,
    mdmSopId: 'TMP' + generateRandom(1000000, 9999999), // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
    jobName: '', // 안전작업 명
    ramRiskHazardId: '', // 유해위험요인 번호
    riskHazardName: '', // 유해위험요인명
    ram4mRiskHazardClassCd: null, // 4M 분류 코드
    ram4mRiskHazardClassName: '', // 4M 분류
    damageTargetName: '', // 피해대상(key-in)
    damageTypeName: '', // 재해형태(key-in)
    regUserId: user.value.userId,
    editFlag: 'C'
  } as any
  props.processData.fmScenarios.push(_sop)
}
/******************************
 * TODO (목적): 내부버튼 클릭
 *******************************/
function innerBtnClicked(_col: any, _props: any) {
  rowIndex.value = _props.rowIndex
  isRowAdd.value = true
  if (_col.name === 'processName') {
    addSop(_props)
  } else if (_col.name === 'jobName') {
    addRiskHazard(_props)
  }
}
/******************************
 * TODO (목적): SOP 추가
 *******************************/
function addSop(_props: any) {
  const _sop = {
    ram4mAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
    ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
    processCd: props.processData.processCd, // 단위공정 코드
    processName: props.processData.processName,
    ramTechniqueCd: _props.row.ramTechniqueCd,
    groupMdmSopId: _props.row.processCd + '/' + uid(),
    mdmSopId: '', // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
    jobName: '', // 안전작업 명
    ramRiskHazardId: '', // 유해위험요인 번호
    riskHazardName: '', // 유해위험요인명
    ram4mRiskHazardClassCd: null, // 4M 분류 코드
    ram4mRiskHazardClassName: '', // 4M 분류
    damageTargetName: '', // 피해대상(key-in)
    damageTypeName: '', // 재해형태(key-in)
    regUserId: user.value.userId,
    editFlag: 'C'
  } as any
  props.processData.fmScenarios.push(_sop)
}
/******************************
 * TODO (목적): 유해위험요인 추가
 *******************************/
function addRiskHazard(_props: any) {
  const _sop = {
    ram4mAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
    ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
    processCd: props.processData.processCd, // 단위공정 코드
    processName: props.processData.processName,
    ramTechniqueCd: _props.row.ramTechniqueCd,
    groupMdmSopId: _props.row.groupMdmSopId,
    mdmSopId: _props.row.mdmSopId, // 안전작업 표준 일련번호_sop 작업이 아닌경우는 "tmp_001"과 같이 생성
    jobName: _props.row.jobName, // 안전작업 명
    ramRiskHazardId: '', // 유해위험요인 번호
    riskHazardName: '', // 유해위험요인명
    ram4mRiskHazardClassCd: null, // 4M 분류 코드
    ram4mRiskHazardClassName: '', // 4M 분류
    damageTargetName: '', // 피해대상(key-in)
    damageTypeName: '', // 재해형태(key-in)
    regUserId: user.value.userId,
    editFlag: 'C'
  }
  openPop(_sop, rowIndex.value)
}
/******************************
 * TODO (목적): 유해위험요인 검색
 *******************************/
function searchRiskHazardPop(_props?: any, _col?: any) {
  if (_props && _col) {
    rowRiskHazardInfo.value.row = _props.row
    rowRiskHazardInfo.value.col = _col
  }
  popupOptions.value = getPopupOptions(
    'riskHazard',
    popupOptions.value,
    _props && _col ? closeRowRiskHazardPopup : closeRiskHazardPopup,
    {
      type: 'single'
    }
  )
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
        _.filter(props.processData.fmScenarios, {
          groupMdmSopId: sopData.value.groupMdmSopId
        }),
        { ramRiskHazardId: _data[0].ramRiskHazardId }
      ) === -1
    ) {
      sopData.value.ramRiskHazardId = _data[0].ramRiskHazardId
      sopData.value.riskHazardName = _data[0].riskHazardName
    } else {
      message.alert({
        title: '안내',
        message: '해당 작업에 존재하는 유해위험요인입니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 유해위험요인 검색 callback
 *******************************/
function closeRowRiskHazardPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    if (
      _.findIndex(
        _.filter(props.processData.fmScenarios, {
          groupMdmSopId: rowRiskHazardInfo.value.row.groupMdmSopId
        }),
        { ramRiskHazardId: _data[0].ramRiskHazardId }
      ) === -1
    ) {
      rowRiskHazardInfo.value.row.ramRiskHazardId = _data[0].ramRiskHazardId
      rowRiskHazardInfo.value.row.riskHazardName = _data[0].riskHazardName
      if (rowRiskHazardInfo.value.row['editFlag'] !== 'C') {
        rowRiskHazardInfo.value.row['editFlag'] = 'U'
        rowRiskHazardInfo.value.row['chgUserId'] = user.value.userId
      }
    } else {
      message.alert({
        title: '안내',
        message: '해당 작업에 존재하는 유해위험요인입니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 유해위험요인 삭제
 *******************************/
function removeRiskHazardPop() {
  sopData.value.ramRiskHazardId = null
  sopData.value.riskHazardName = null
}
/******************************
 * TODO (목적):
 *******************************/
function datachange(_props: any, _col: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
}
/******************************
 * TODO (목적): 유해위험요인 삭제
 *******************************/
function removeRowRiskHazard(_props: any) {
  _props.row.ramRiskHazardId = null
  _props.row.riskHazardName = null
}
/******************************
 * TODO (목적): 작업변경
 *******************************/
function jobChange() {
  if (isRowAdd.value) {
    if (_.findIndex(props.processData.fmScenarios, { jobName: sopData.value.jobName }) > -1) {
      isSameJobName.value = true
    } else {
      isSameJobName.value = false
    }
  } else {
    if (
      _.findIndex(
        _.reject(props.processData.fmScenarios, {
          groupMdmSopId: sopData.value.groupMdmSopId
        }),
        { jobName: sopData.value.jobName }
      ) > -1
    ) {
      isSameJobName.value = true
    } else {
      isSameJobName.value = false
    }
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
        return
      }

      if (!sopData.value.ramRiskHazardId) {
        // 유해위험요인 일련번호가 없는 경우(key-in)
        sopData.value.ramRiskHazardId = uid()
      }
      if (isRowAdd.value) {
        props.processData.fmScenarios.splice(rowIndex.value, 0, _.clone(sopData.value))
      } else {
        if (props.processData.fmScenarios[rowIndex.value].jobName !== sopData.value.jobName) {
          _.forEach(props.processData.fmScenarios, (item) => {
            if (item.groupMdmSopId === sopData.value.groupMdmSopId) {
              item.jobName = sopData.value.jobName

              if (item.editFlag !== 'C') {
                item.editFlag = 'U'
                item.chgUserId = user.value.userId
              }
            }
          })
        }
        _.extend(props.processData.fmScenarios[rowIndex.value], _.clone(sopData.value))
      }
      isRowClick.value = false
      isRowAdd.value = false
      sopDialog.value = false
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
  isRowClick.value = false
  isRowAdd.value = false
  sopDialog.value = false
}
/******************************
 * TODO (목적): SOP 저장
 *******************************/
function saveSop() {
  if (validTable(grid.value.columns, props.processData.fmScenarios)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.processData.fmScenarios, (_sop: any) => {
          _sop.chgUserId = user.value.userId
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
  emits('saveProcess', props.processData.processCd)
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
    message.confirm({
      title: '확인',
      message: '관련되어 있는 정보 및 개선사항, 위험등록부가 같이 삭제됩니다. 진행하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.processData.fmScenarios = _.reject(props.processData.fmScenarios, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
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

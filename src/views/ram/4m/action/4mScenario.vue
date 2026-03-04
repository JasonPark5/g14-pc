<template>
  <div>
    <div class="row">
      <div class="col-12">
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            dense
            dark
            default-opened
            icon="account_tree"
            header-class="bg-blue-grey-6 text-white"
            expand-icon-class="text-white"
            :label="$language('공정 정보')"
          >
            <q-separator />
            <q-card class="q-pa-sm">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-label-text title="평가명" :value="assessPlan.assessmentName" />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-label-text title="평가기법" :value="assessPlan.ramTechniqueName" />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-label-text title="평가대상공정" :value="processData.processName" />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-label-text title="작업발생주기" :value="processData.workCycleName" />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-label-text title="작업시간(1회)" :value="processData.workingTime" />
                </div>
              </div>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
    <div class="row">
      <div
        :class="[
          scenarioViewGroup === 'L' ? 'col-12' : 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
          'scenario-list'
        ]"
      >
        <!-- selection="multiple"
          rowKey="ram4mAssessScenarioId" -->
        <c-table
          ref="table"
          title="시나리오 목록"
          :gridHeight="setheight"
          :columns="gridColumns"
          :data="processData.fmScenarios"
          :merge="scenarioViewGroup === 'L' ? grid.merge : []"
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
            <q-chip
              v-show="editable && !disabled && scenarioViewGroup === 'L'"
              outline
              square
              clickable
              size="md"
              color="red"
              icon="help"
              :label="$language('범례')"
              style="height: 26px; margin-right: 2px !important"
            >
              <q-popup-proxy>
                <q-banner>
                  <q-icon
                    color="white"
                    name="add"
                    size="xs"
                    style="background-color: red; border-radius: 4px"
                  />
                  <span style="color: gray; margin-left: 10px"
                    >: {{ $language('개선요청 등록') }}</span
                  >
                </q-banner>
              </q-popup-proxy>
            </q-chip>
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
              <!-- <c-btn
                v-if="editable && !disabled"
                label="삭제"
                icon="remove"
                @btnClicked="removeScenario"
              /> -->
              <c-btn
                v-show="editable && !disabled && scenarioViewGroup === 'L'"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="processData.fmScenarios"
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
                :inputEditable="editable && Boolean(props.row.ram4mAssessScenarioId)"
                :requestContentsCols="requestContentsCols"
                tableKey="ram4mAssessScenarioId"
                ibmTaskTypeCd="ITT0000023"
                ibmTaskUnderTypeCd="ITTU000030"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'afterRisk' || col.name === 'beforeRisk'">
              <q-btn
                v-if="editable && !disabled"
                flat
                size="12px"
                :color="disabled ? '' : 'blue-6'"
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
                :color="disabled ? '' : 'blue-6'"
                :label="props.row[col.name] ? props.row[col.name] : ''"
              />
            </template>
            <template v-else-if="col.name === 'item'">
              <q-item class="card-scenario-list">
                <q-item-section>
                  <q-item-label class="scenario-card-title">{{
                    `${props.row['jobName']} / ${props.row['ram4mRiskHazardClassName'] ? props.row['ram4mRiskHazardClassName'] : 'x'} / ${props.row['riskHazardName']}`
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    v-if="props.row.editFlag !== 'C'"
                    name="arrow_forward_ios"
                    color="blue"
                    style="font-size: 20px; cursor: pointer"
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
            <template v-else-if="col.name === 'addingRiskManagementActivities'">
              <c-textarea-column
                :editable="editable"
                :disabled="disabled"
                :props="props"
                :col="col"
                v-model:value="props.row['addingRiskManagementActivities']"
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
              <c-card title="상세정보" class="cardClassDetailForm">
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
                      class="scenario4m2"
                      height="250px"
                      :attachInfo="attachHazardInfo"
                      :editable="editable && !disabled && selectScenario"
                    />
                  </div>
                  <div class="col-12">
                    <c-text
                      :disabled="true"
                      :editable="editable"
                      label="작업 / 평가구분 / 유해위험요인"
                      name="scenarioTarget"
                      v-model:value="scenarioTarget"
                    />
                  </div>
                  <div class="col-6">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="피해대상"
                      name="damageTargetName"
                      v-model:value="scenario.damageTargetName"
                    />
                  </div>
                  <div class="col-6">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="재해형태"
                      name="damageTypeName"
                      v-model:value="scenario.damageTypeName"
                    />
                  </div>
                  <div class="col-6">
                    <c-select
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      type="edit"
                      codeGroupCd="RAM_OCCURR_CLASS_CD"
                      itemText="codeName"
                      itemValue="code"
                      label="발생형태"
                      name="ramOccurrClassCd"
                      v-model:value="scenario.ramOccurrClassCd"
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
                      v-if="!param.vendorFlag"
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :data="scenario"
                      label="평가자"
                      name="assessUserId"
                      v-model:value="scenario.assessUserId"
                      @username="
                        (_val: any) => {
                          scenario.assessUserName = _val
                        }
                      "
                    />
                    <c-text
                      v-else
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="평가자"
                      name="assessUserName"
                      v-model:value="scenario.assessUserName"
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
                      :isMultiTask="scenario.imprs && scenario.imprs.length > 0"
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
                      name="existingRiskManagementActivities"
                      v-model:value="scenario.existingRiskManagementActivities"
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
                                :props="{
                                  row: {
                                    ramMatrixId: scenario.ramMatrixId
                                  } as any
                                }"
                                :editable="editable && !disabled && selectScenario"
                                @callback="
                                  (_data: any, _color: any) =>
                                    callbackCardProxy(_data, _color, 'beforeRiskProxy')
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
                      :columnSetting="false"
                      :isFullScreen="false"
                      :filtering="false"
                      :isExcelDown="false"
                      @linkClick="
                        (_row: any) =>
                          linkClick(
                            {
                              sopImprovementId: _row.sopImprovementId,
                              ram4mAssessImprId: _row.ram4mAssessImprId
                            },
                            _row
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
                      :isMultiTask="scenario.imprs && scenario.imprs.length > 0"
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
                      name="addingRiskManagementActivities"
                      v-model:value="scenario.addingRiskManagementActivities"
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
                                :props="{
                                  row: {
                                    ramMatrixId: scenario.ramMatrixId
                                  }
                                }"
                                :editable="editable && !disabled && selectScenario"
                                @callback="
                                  (_data: any, _color: any) =>
                                    callbackCardProxy(_data, _color, 'afterRiskProxy')
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
  name: '4mScenario'
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
    vendorFlag: boolean
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
      reCheckedCnt: 0
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      vendorFlag: false,
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
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'jobName' },
    { index: 1, colName: 'ram4mRiskHazardClassGroup' }
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
      sortable: true,
      type: 'link'
    },
    {
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행단계',
      align: 'center',
      sortable: true
    },
    {
      name: 'improveRequestDeptName',
      field: 'improveRequestDeptName',
      label: '요청부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      sortable: true
    }
  ],
  height: '206px'
})
const scenario = ref<scenarioType>({
  ram4mAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
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
  ramMatrixId: '',
  beforeFrequency: null,
  beforeStrength: null,
  beforeRisk: null,
  riskbookFlag: '',
  afterFrequency: null,
  afterStrength: null,
  afterRisk: null
})
const updateBtnData = ref({
  title: '평가', // 평가
  flag: false,
  research: ''
})
const improveFlagItems = ref<any>([])
const attachHazardInfo = ref({
  isSubmit: '',
  taskClassCd: 'RISK_HAZARD',
  taskKey: ''
})
const attachBeforeInfo = ref({
  isSubmit: '',
  task: [],
  taskClassCd: '4M_SCENARIO_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref({
  isSubmit: '',
  task: [],
  taskClassCd: '4M_SCENARIO_AFTER',
  taskKey: ''
})
const requestImprRow = ref(null)
const activeWinProps = ref({
  processCd: '',
  ram4mAssessScenarioId: ''
})
const assessPlan = ref({
  assessmentName: '', // 평가명
  ramTechniqueName: '' // 평가기법명
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
const ramPlanUrl = ref('')
const winPopup = ref<Window | null>(null)
const table = ref<any>(null)
const editForm = ref<any>(null)
const afterRiskProxy = ref<any>(null)
const beforeRiskProxy = ref<any>(null)
const checkChildClosed = ref<numberNull>(null)

/******************************
 * @Computed_선언
 *******************************/
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
    ? Number(pxRemove) - 180 + 'px'
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
  let cols = [] as any
  if (scenarioViewGroup.value === 'L') {
    cols = [
      {
        fix: true,
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        fix: true,
        name: 'ram4mRiskHazardClassName',
        field: 'ram4mRiskHazardClassName',
        label: '평가구분(4M)',
        align: 'center',
        style: 'width:120px',
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
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '유해위험요인',
        align: 'left',
        style: 'width:170px',
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
        name: 'damageTargetName',
        field: 'damageTargetName',
        label: '피해대상',
        align: 'left',
        style: 'width:120px',
        type: 'text',
        sortable: false
      },
      {
        name: 'ramOccurrClassCd',
        field: 'ramOccurrClassCd',
        label: '발생형태',
        align: 'center',
        type: 'select',
        style: 'width:100px',
        sortable: false,
        codeGroupCd: 'RAM_OCCURR_CLASS_CD'
      },
      {
        name: 'damageTypeName',
        field: 'damageTypeName',
        label: '재해형태',
        align: 'left',
        type: 'text',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'existingRiskManagementActivities',
        field: 'existingRiskManagementActivities',
        label: '현재안전조치',
        align: 'left',
        type: 'textarea',
        style: 'width:180px',
        sortable: false
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
            style: 'width:50px',
            sortable: false
          },
          {
            name: 'beforeStrength',
            field: 'beforeStrength',
            label: '강도',
            align: 'center',
            style: 'width:50px',
            sortable: false
          },
          {
            name: 'beforeRisk',
            field: 'beforeRisk',
            label: '위험도',
            align: 'center',
            style: 'width:60px',
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
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'addingRiskManagementActivities',
        field: 'addingRiskManagementActivities',
        label: '추가 리스크관리 계획',
        align: 'left',
        type: 'custom',
        style: 'width:180px',
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
        name: 'customCol',
        field: 'customCol',
        label: '개선번호/개선진행상태',
        align: 'center',
        style: 'width:150px',
        type: 'custom',
        sortable: false
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
            style: 'width:50px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:50px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            style: 'width:60px',
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
        style: 'width:120px',
        sortable: false,
        setHeader: true
      },
      {
        name: 'assessUserName',
        field: 'assessUserName',
        label: '평가자',
        align: 'center',
        type: !props.param.vendorFlag ? 'user' : 'text',
        userId: 'assessUserId',
        style: 'width:100px',
        sortable: false,
        setHeader: true
      }
    ]
    if (!props.param.vendorFlag) {
      cols.splice(cols.length - 2, 0, {
        name: 'riskbookFlag',
        field: 'riskbookFlag',
        label: '위험<br/>등록부',
        align: 'center',
        style: 'width:50px',
        sortable: true,
        type: 'check',
        true: 'Y',
        false: 'N'
      })
    }
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
  return Boolean(scenario.value.ram4mAssessScenarioId)
})
const scenarioTarget = computed(() => {
  return selectScenario.value
    ? `${scenario.value.jobName} / ${scenario.value.ram4mRiskHazardClassName ? scenario.value.ram4mRiskHazardClassName : 'X'} / ${scenario.value.riskHazardName}`
    : ''
})
const afterRiskEditable = computed(() => {
  return scenario.value.improveFlag !== 'N'
})
const imprComponent = computed(() => {
  let components = null
  if (!props.param.vendorFlag) {
    components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  } else {
    components = defineAsyncComponent(() => import(`@views/ram/4m/4mTableImpr.vue`))
  }
  return components
})
const requestContentsCols = computed(() => {
  return ['jobName', 'ram4mRiskHazardClassName', 'riskHazardName']
})

const riskPopComponent = computed(() => {
  return shallowRef(defineAsyncComponent(() => import(`@/views/ram/base/matrixPop.vue`)))
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
        activeWinProps.value.ram4mAssessScenarioId = ''
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
  initializeDataChange()
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
  listUrl.value = selectConfig.ram.fm.scenario.list.url
  detailUrl.value = selectConfig.ram.fm.scenario.get.url
  ramPlanUrl.value = selectConfig.ram.assessPlan.get.url
  listImprUrl.value = selectConfig.ram.fm.riskReduce.impr.url
  saveUrl.value = transactionConfig.ram.fm.scenario.save.url
  saveUnitUrl.value = transactionConfig.ram.fm.scenario.saveUnit.url
  deleteUrl.value = transactionConfig.ram.fm.scenario.delete.url
  completeUrl.value = transactionConfig.ram.assessProcess.complete.url
  // code setting
  improveFlagItems.value = [
    { code: 'X', codeName: $language('상관없음') },
    { code: 'Y', codeName: $language('개선진행') },
    { code: 'N', codeName: $language('유지') }
  ]
  // list setting
  getAccessPlan()
}

/******************************
 * TODO (목적): 계획 상세 조회
 *******************************/
function getAccessPlan() {
  $http({
    url: $format(ramPlanUrl.value, props.param.ramRiskAssessmentPlanId),
    method: 'GET'
  }).then((_result: any) => {
    assessPlan.value = _result.data
  })
}
/******************************
 * TODO (목적): 데이터변경 초기화
 *******************************/
function initializeDataChange() {
  if (props.processData.fmScenarios && props.processData.fmScenarios.length > 0) {
    _.forEach(props.processData.fmScenarios, (_scenario: any) => {
      const props = { row: _scenario }
      datachange(props, null) // col을 null로 전달
    })
  }
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
    props.processData.fmScenarios = _result.data
  })
}
/******************************
 * TODO (목적): 시나리오 상세
 *******************************/
function getDetail(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ram4mAssessScenarioId),
    method: 'GET'
  }).then((_result: any) => {
    scenario.value = _result.data
    attachHazardInfo.value.taskKey = scenario.value.ram4mAssessScenarioId
    attachBeforeInfo.value.taskKey = scenario.value.ram4mAssessScenarioId
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
      ram4mAssessScenarioId: scenario.value.ram4mAssessScenarioId,
      vendorFlag: scenario.value.vendorFlag
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
  const requestContents =
    scenario.value.jobName +
    ' / ' +
    scenario.value.ram4mRiskHazardClassName +
    ' / ' +
    scenario.value.riskHazardName
  if (!props.param.vendorFlag) {
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
  } else {
    popupOptions.value.title = '개선'
    popupOptions.value.param = {
      requestContents: requestContents,
      ram4mAssessScenarioId: scenario.value.ram4mAssessScenarioId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/4m/risk/4mImprRiskReduce.vue`))
    )
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeCardImprPopup
}
/******************************
 * TODO (목적): 개선 상세
 *******************************/
function linkClick(_data: any, _row: any) {
  requestImprRow.value = _row
  popupOptions.value.title = '개선'
  if (!props.param.vendorFlag) {
    popupOptions.value.param = {
      sopImprovementId: _data.sopImprovementId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.param = {
      ram4mAssessImprId: _data.ram4mAssessImprId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/4m/risk/4mImprRiskReduceDetail.vue`))
    )
  }
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
    props.processData.fmScenarios[_props.rowIndex].beforeFrequency = _data.f
    props.processData.fmScenarios[_props.rowIndex].beforeStrength = _data.s
    props.processData.fmScenarios[_props.rowIndex].beforeRisk = _data.r
    props.processData.fmScenarios[_props.rowIndex].beforeRamMatrixRiskId = _data.ramMatrixRiskId
    if (props.processData.fmScenarios[_props.rowIndex].improveFlag === 'N') {
      props.processData.fmScenarios[_props.rowIndex].afterFrequency = _data.f
      props.processData.fmScenarios[_props.rowIndex].afterStrength = _data.s
      props.processData.fmScenarios[_props.rowIndex].afterRisk = _data.r
      props.processData.fmScenarios[_props.rowIndex].afterRamMatrixRiskId = _data.ramMatrixRiskId
    }
  } else {
    props.processData.fmScenarios[_props.rowIndex].afterFrequency = _data.f
    props.processData.fmScenarios[_props.rowIndex].afterStrength = _data.s
    props.processData.fmScenarios[_props.rowIndex].afterRisk = _data.r
    props.processData.fmScenarios[_props.rowIndex].afterRamMatrixRiskId = _data.ramMatrixRiskId
  }
  if (props.processData.fmScenarios[_props.rowIndex].editFlag !== 'C') {
    props.processData.fmScenarios[_props.rowIndex].editFlag = 'U'
    props.processData.fmScenarios[_props.rowIndex].chgUserId = user.value.userId
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
  if (_col.name === 'assessUserName' && props.param.vendorFlag) {
    _props.row.assessUserId = ''
  }
  if (_col.name === 'improveFlag') {
    // 개선을 진행 할 건지 여부 체크
    if (_props.row[_col.name] === 'N') {
      props.processData.fmScenarios[_props.rowIndex].afterFrequency = _props.row.beforeFrequency
      props.processData.fmScenarios[_props.rowIndex].afterStrength = _props.row.beforeStrength
      props.processData.fmScenarios[_props.rowIndex].afterRisk = _props.row.beforeRisk
      props.processData.fmScenarios[_props.rowIndex].afterRamMatrixRiskId =
        _props.row.beforeRamMatrixRiskId
      props.processData.fmScenarios[_props.rowIndex].editFlag = 'U'
      props.processData.fmScenarios[_props.rowIndex].chgUserId = user.value.userId

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
    // if (_result && validTable(grid.value.columns, props.assessPlan.teams)) {
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
// function removeScenario() {
//   const selectData = table.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'info', // success / info / warning / error
//       // 확인 callback 함수
//       confirmCallback: () => {
//         $http({
//           url: deleteUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then(() => {
//           message.requestSuccess()
//           _.forEach(selectData, (item) => {
//             props.processData.fmScenarios.splice(
//               _.findIndex(props.processData.fmScenarios, item),
//               1
//             )
//           })
//           table.value.compoTable.clearSelection()
//           props.planUpdateBtnData.planResearch = uid()
//         })
//       },
//       // 취소 callback 함수
//       cancelCallback: () => {}
//     })
//   }
// }
/******************************
 * TODO (목적): 공정 완료
 *******************************/
function completeProcess() {
  // 도면 별 노드에 시나리오가 하나 이상 등록되었는지?
  // 화면에서 추가는 하고 저장을 하지 않았을 시에 해당 데이터도 일괄 저장 처리
  // 저장 처리 후 callback에서 process 목록 재조회
  let isProgress = true
  if (!props.processData.fmScenarios || props.processData.fmScenarios.length === 0) {
    isProgress = false
    message.alert({
      title: '안내',
      message: getLanguage('등록된 시나리오가 없습니다.', props.processData.processName),
      type: 'warning' // success / info / warning / error
    })
  }

  if (isProgress && validTable(gridColumns.value, props.processData.fmScenarios)) {
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
  popupOptions.value.title = '유해위험요인 사진'
  popupOptions.value.param = {
    ramRiskHazardId: _props.row.ramRiskHazardId,
    disabled: disabled.value
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
    ram4mAssessScenarioId: _props.row.ram4mAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    ram4mAssessImprIds: _props.row.ram4mAssessImprIds,
    disabled: disabled.value
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/4m/action/4mScenarioImprPicture.vue'))
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
  // window.addEventListener('message', handleMessage, { once: true }) // 새로운 이벤트 리스너 등록
}
;(window as any).receiveDataFromChild = (_data: any) => {
  activeWinProps.value.processCd = _data.processCd
  activeWinProps.value.ram4mAssessScenarioId = _data.ram4mAssessScenarioId
}
/******************************
 * TODO (목적): 메시지 수신 핸들러 함수 (중복 방지)
 ******************************/
// function handleMessage(event: MessageEvent) {
//   console.log(event.data)
//   if (event.origin !== window.location.origin) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ram4mAssessScenarioId = event.data.ram4mAssessScenarioId
// }

/******************************
 * TODO (목적): 자식창에서 선택한 row 관련 부모 row 배경색 변경
 *******************************/
function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ram4mAssessScenarioId
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
 * TODO (목적): 데이터 변경 이벤트
 *******************************/
function datachange(_props: any, _row: any) {
  const idList = _props.row['sopImprovementIds'] ? _props.row['sopImprovementIds'].split(',') : []
  if (!_props.row['addingRiskManagementActivities'] && idList && idList.length > 0) {
    _props.row['addingRiskManagementActivities'] = ''

    _.forEach(idList, (_item: any, _idx: any) => {
      $http({
        url: $format(selectConfig.sop.ibm.improve.get.url, _item),
        method: 'GET'
      }).then((_result: any) => {
        _props.row['addingRiskManagementActivities'] += _result.data.actionContents
          ? (_idx > 0 ? '\n' : '') + _result.data.actionContents
          : ''
      })
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <div class="row charm-estimation">
      <div
        :class="[
          scenarioViewGroup === 'L' ? 'col-12' : 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
          'scenario-list'
        ]"
      >
        <c-table
          ref="table"
          title="물질별 위험도 추정"
          :columns="grid.columns"
          :gridHeight="setheight"
          :data="processData.charmEstimationScenarios"
          :merge="scenarioViewGroup === 'L' || scenarioViewGroup === 'C' ? grid.merge : []"
          :filtering="false"
          :customTrClass="setTrClass"
          :columnSetting="false"
          :usePaging="false"
          :isExcelDown="scenarioViewGroup === 'L'"
          :isFullScreen="scenarioViewGroup === 'L'"
          :editable="editable && !disabled"
          @table-data-change="tableDataChange"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-update-btn
                name="updateBtn"
                :data="estimationUpdateBtnData"
                :btnEditable="estimationBtnEditable"
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
                v-if="editable && !disabled && scenarioViewGroup === 'L'"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="processData.charmEstimationScenarios"
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
            <template v-if="col.name === 'item'">
              <q-item class="card-scenario-list">
                <q-item-section>
                  <q-item-label class="scenario-card-title">{{
                    `${props.row['casNo']} `
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
          </template>
        </c-table>
      </div>
      <div
        v-if="scenarioViewGroup === 'C'"
        class="col-xs-12 col-sm-6 col-md-8 col-lg-8 scenario-card"
      >
        <q-form ref="editForm">
          <div class="row">
            <c-card title="노출수준 측정" class="cardClassDetailForm col-6">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-show="editable && !disabled && isCardSelect"
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
                <div
                  class="col-12 row"
                  :class="scenario.exposureCheck === 'F' ? 'check-highLight' : null"
                >
                  <div class="col-12 mainTitle">
                    {{ $language('1순위 유소견자') }}
                    <q-icon
                      name="help"
                      size="xs"
                      color="primary"
                      class="cursor-pointer"
                      style="position: relative; top: -1px !important"
                    >
                      <q-tooltip
                        anchor="center right"
                        self="center left"
                        :offset="[5, 0]"
                        style="font-size: 0.9em"
                      >
                        {{ $language('직업병 유소견자(D1) 발생 시 : 노출수준 4등급 (최상)') }}
                      </q-tooltip>
                    </q-icon>
                  </div>
                  <div class="col-4">
                    <c-checkbox
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :isFlag="true"
                      label="유소견자 발생여부"
                      name="suspectUserFlag"
                      @datachange="cardDataChange('suspectUserFlag')"
                      v-model:value="scenario.suspectUserFlag"
                    />
                  </div>
                </div>
                <div
                  class="col-12 row mt-2"
                  :class="scenario.exposureCheck === 'S' ? 'check-highLight' : null"
                >
                  <div class="col-12 mainTitle">
                    {{ $language('2순위 작업환경측정') }}
                    <q-icon
                      name="help"
                      size="xs"
                      color="primary"
                      class="cursor-pointer"
                      style="position: relative; top: -2px !important"
                    >
                      <q-tooltip anchor="bottom right" :offset="[5, 0]" style="font-size: 0.9em">
                        <q-table
                          dense
                          hide-bottom
                          hide-pagination
                          class="helpcomment-table"
                          table-header-style="background: rgba(0,0,0,0.1)"
                          :columns="workMeasureColumns"
                          :rows="workMeasureRows"
                        />
                      </q-tooltip>
                    </q-icon>
                  </div>
                  <div class="col-4">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="측정치(A)"
                      name="measValue"
                      v-model:value="scenario.measValue"
                      @dataChange="cardDataChange('measValue')"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="노출기준(B)"
                      name="exposureStandard"
                      v-model:value="scenario.exposureStandard"
                      @dataChange="cardDataChange('exposureStandard')"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :editable="false"
                      label="A/B(%)"
                      name="exposureMeasValue"
                      v-model:value="scenario.exposureMeasValue"
                    />
                  </div>
                </div>
                <div
                  class="col-12 row mt-2"
                  :class="scenario.exposureCheck === 'T' ? 'check-highLight' : null"
                >
                  <div class="col-12 mainTitle">
                    {{ $language('3순위 하루 취급량, 비산성/휘발성') }}
                  </div>
                  <div class="col-3">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="함유량(%)"
                      name="limitRepval"
                      type="number"
                      v-model:value="scenario.limitRepval"
                      @dataChange="cardDataChange('limitRepval')"
                    />
                  </div>
                  <div class="col-3">
                    <c-text
                      :editable="false"
                      label="일취급량"
                      type="number"
                      name="dailyVolume"
                      v-model:value="scenario.dailyVolume"
                    />
                  </div>
                  <div class="col-3">
                    <c-text
                      :editable="false"
                      label="단위"
                      :labelIcon="volumeUnitLabel"
                      name="volumeUnitName"
                      v-model:value="scenario.volumeUnitName"
                    />
                  </div>
                  <div class="col-3">
                    <c-text
                      :editable="false"
                      label="일취급 수준"
                      name="dailyLevel"
                      v-model:value="scenario.dailyLevel"
                    />
                  </div>
                  <div class="col-3">
                    <c-select
                      type="edit"
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="발생형태"
                      name="maleficenceType"
                      v-model:value="scenario.maleficenceType"
                      codeGroupCd="MALEFICENCE_TYPE"
                      itemText="codeName"
                      itemValue="code"
                      @datachange="cardDataChange('maleficenceType')"
                    />
                  </div>
                  <div class="col-3" v-if="isMaleficenceType1">
                    <c-select
                      type="edit"
                      :disabled="disabled || !selectScenario || maleficenceTypeFlag"
                      :editable="editable"
                      label="비산성"
                      :labelIcon="maleficenceGradeLabel"
                      name="maleficenceGrade"
                      v-model:value="scenario.maleficenceGrade"
                      codeGroupCd="MALEFICENCE_GRADE"
                      itemText="codeName"
                      itemValue="code"
                    />
                  </div>
                  <div class="col-3" v-if="isMaleficenceType2">
                    <c-text
                      :disabled="disabled || !selectScenario || !maleficenceTypeFlag"
                      :editable="editable"
                      label="끓는점(℃)"
                      name="boilingPoint"
                      v-model:value="scenario.boilingPoint"
                      @dataChange="cardDataChange('boilingPoint')"
                    />
                  </div>
                  <div class="col-3" v-if="isMaleficenceType2">
                    <c-text
                      :editable="false"
                      label="휘발성"
                      :labelIcon="volatilityGradeLabel"
                      name="volatilityGradeName"
                      v-model:value="scenario.volatilityGradeName"
                    />
                  </div>
                  <q-separator class="col-12 q-mt-sm q-mb-sm" style="padding: 0.04em !important" />
                  <div class="col-6">
                    <c-text
                      :editable="false"
                      label="노출수준"
                      :labelIcon="exposureLevelCombinationLabels"
                      name="exposureLevelCombination"
                      v-model:value="scenario.exposureLevelCombination"
                    />
                  </div>
                  <div class="col-6">
                    <c-select
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="밀폐·환기상태"
                      :labelIcon="closedVentilationLabels"
                      name="closedVentilation"
                      v-model:value="scenario.closedVentilation"
                      @datachange="cardDataChange('closedVentilation')"
                      codeGroupCd="CLOSED_VENTILATION"
                      itemText="codeName"
                      itemValue="code"
                    />
                  </div>
                </div>
              </template>
            </c-card>
            <c-card title="유해성 측정" class="cardClassDetailForm col-6">
              <template v-slot:card-detail>
                <div
                  class="col-12 row"
                  :class="scenario.harmfulCheck === 'F' ? 'check-highLight' : null"
                >
                  <div class="col-12 mainTitle">
                    {{ $language('1순위') }}
                    <q-icon
                      name="help"
                      size="xs"
                      color="primary"
                      class="cursor-pointer"
                      style="position: relative; top: -1px !important"
                    >
                      <q-tooltip
                        anchor="center right"
                        self="center left"
                        :offset="[5, 0]"
                        style="font-size: 0.9em"
                      >
                        {{ $language('CMR 물질(1A, 1B, 2)에 해당 시 : 유해성 4등급 (최대)') }}
                      </q-tooltip>
                    </q-icon>
                  </div>
                  <div class="col-6">
                    <c-checkbox
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      :isFlag="true"
                      label="CMR여부"
                      name="cmrFlag"
                      @datachange="cardDataChange('cmrFlag')"
                      v-model:value="scenario.cmrFlag"
                    />
                  </div>
                </div>
                <div
                  class="col-12 row mt-2"
                  :class="scenario.harmfulCheck === 'S' ? 'check-highLight' : null"
                >
                  <div class="col-12 mainTitle">
                    {{ $language('2순위 노출기준') }}
                    <q-icon
                      name="help"
                      size="xs"
                      color="primary"
                      class="cursor-pointer"
                      style="position: relative; top: -2px !important"
                    >
                      <q-tooltip anchor="bottom right" :offset="[5, 0]" style="font-size: 0.9em">
                        <q-table
                          dense
                          hide-bottom
                          hide-pagination
                          class="helpcomment-table"
                          table-header-style="background: rgba(0,0,0,0.1)"
                          :columns="exposureStandardsColumns"
                          :rows="exposureStandardsRows"
                        />
                      </q-tooltip>
                    </q-icon>
                  </div>
                  <div class="col-6">
                    <c-select
                      type="edit"
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="발생형태"
                      name="maleficenceForm"
                      v-model:value="scenario.maleficenceForm"
                      codeGroupCd="MALEFICENCE_FORM"
                      itemText="codeName"
                      itemValue="code"
                    />
                  </div>
                  <div class="col-6">
                    <c-text
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="측정값"
                      name="maleficenceValue"
                      @dataChange="cardDataChange('maleficenceValue')"
                      v-model:value="scenario.maleficenceValue"
                    />
                  </div>
                </div>
                <div
                  class="col-12 row mt-2"
                  :class="scenario.harmfulCheck === 'T' ? 'check-highLight' : null"
                >
                  <div class="col-12 mainTitle">
                    {{ $language('3순위 위험문구') }}
                    <q-icon
                      name="help"
                      size="xs"
                      color="primary"
                      class="cursor-pointer"
                      style="position: relative; top: -2px !important"
                    >
                      <q-tooltip anchor="bottom right" :offset="[5, 0]" style="font-size: 0.9em">
                        <q-table
                          dense
                          hide-bottom
                          hide-pagination
                          class="helpcomment-table"
                          table-header-style="background: rgba(0,0,0,0.1)"
                          :columns="riskPhraseColumns"
                          :rows="riskPhraseRows"
                        />
                      </q-tooltip>
                    </q-icon>
                  </div>
                  <div class="col-6">
                    <c-select
                      type="edit"
                      :disabled="disabled || !selectScenario"
                      :editable="editable"
                      label="위험문구/유해·위험문구"
                      name="hrCodeGrade"
                      v-model:value="scenario.hrCodeGrade"
                      codeGroupCd="HR_CODE_GRADE"
                      itemText="codeName"
                      itemValue="code"
                      @datachange="cardDataChange('hrCodeGrade')"
                    />
                  </div>
                  <div class="col-12 scenario">
                    <c-card
                      title="최종 유해성 결과"
                      class="cardClassDetailForm"
                      topClass="topcolor-orange"
                    >
                      <template v-slot:card-detail>
                        <q-list dense bordered separator>
                          <q-item>
                            <div class="card-risk-info-charm detail-risk">
                              <q-item-section>
                                <q-item-label>{{ $language('최종 노출수준') }}</q-item-label>
                              </q-item-section>

                              <q-item-section side>
                                <q-item-label>{{ scenario.exposureLevelFinal }}</q-item-label>
                              </q-item-section>
                            </div>
                            <q-separator spaced vertical />
                            <div class="card-risk-info-charm detail-risk">
                              <q-item-section>
                                <q-item-label>{{ $language('유해성') }}</q-item-label>
                              </q-item-section>

                              <q-item-section side>
                                <q-item-label>{{ scenario.toxic }}</q-item-label>
                              </q-item-section>
                            </div>
                          </q-item>
                          <q-item>
                            <div class="card-risk-info-charm detail-risk">
                              <q-item-section>
                                <q-item-label>{{ $language('위험도 추정') }}</q-item-label>
                              </q-item-section>
                              <q-item-section side class="detail-risk-num-charm">
                                <q-item-label>{{ scenario.riskEstimation }}</q-item-label>
                              </q-item-section>
                            </div>
                          </q-item>
                        </q-list>
                      </template>
                    </c-card>
                  </div>
                </div>
              </template>
            </c-card>
          </div>
        </q-form>
      </div>
    </div>
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
  name: 'charmRiskEstimation'
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
      estimationReCheckedCnt: 0
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      ramTechniqueCd: ''
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
const isCardSelect = ref(false)
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'materialName' }],
  data: [],
  height: '260px'
})
const exposureStandardsColumns = ref<any>([
  {
    name: 'grade',
    field: 'grade',
    label: '구분',
    align: 'center'
  },
  {
    name: 'dust',
    field: 'dust',
    label: '분진(㎎/㎥) 노출기준',
    align: 'center'
  },
  {
    name: 'vapor',
    field: 'vapor',
    label: '증기(ppm) 노출기준',
    align: 'center'
  }
])
const exposureStandardsRows = ref<any>([
  {
    grade: '1 (소)',
    dust: '1 초과 ~ 10 이하',
    vapor: '50 초과 ~ 500 이하'
  },
  {
    grade: '2 (중)',
    dust: '0.1 초과 ~ 1 이하',
    vapor: '5 초과 ~ 50 이하'
  },
  {
    grade: '3 (대)',
    dust: '0.01 초과 ~ 0.1 이하',
    vapor: '0.5 초과 ~ 5 이하'
  },
  {
    grade: '4 (최대)',
    dust: '0.01 이하',
    vapor: '0.5 이하'
  }
])
const riskPhraseColumns = ref<any>([
  {
    name: 'grade',
    field: 'grade',
    label: '등급',
    align: 'center'
  },
  {
    name: 'hcode',
    field: 'hcode',
    label: 'GHS 유해·위험문구 (H-code)',
    align: 'left'
  },
  {
    name: 'remark',
    field: 'remark',
    label: '비고',
    align: 'left'
  }
])
const riskPhraseRows = ref<any>([
  {
    grade: '1 (소)',
    hcode: `H315,\nH319,\nH362,\nH336\n2~4등급에 분류되지 않은 기타 유해·위험문구`,
    remark: `피부 부식성/피부 자극성 2\n심한 눈 손상성/눈 자극성 2\n생식독성(수유독성)\n특정표적장기 독성(1회 노출) 3(마취작용)\n2~4등급에 분류되지 않은 기타 유해성·위험성 분류`
  },
  {
    grade: '2 (중)',
    hcode: `H302, H312, H332,\nH305`,
    remark: `급성 독성(경구, 경피, 흡입) 4\n흡인 유해성 2`
  },
  {
    grade: '3 (대)',
    hcode: `H301, H311, H331\nH314, \nH318,\nH371, H373,\nH335,\nH317`,
    remark: `급성 독성(경구, 경피, 흡입) 3\n피부 부식성/피부 자극성 1\n심한 눈 손상성/눈 자극성 1\n특정표적장기 독성(1회 노출, 반복 노출) 2\n특정표적장기 독성(1회 노출) 3(호흡기계 자극)\n피부 과민성 1`
  },
  {
    grade: '4 (최대)',
    hcode: `H340, H341, H350, \nH334\nH300, H310, H330, \nH304, \nH370, H372,\nH351,\nH360, H361`,
    remark: `생식세포 변이원성 1A, 1B, 2, 발암성 1A, 1B, \n호흡기 과민성 1\n급성 독성(경구, 경피, 흡입) 1, 2\n흡인 유해성 1\n특정표적장기 독성(1회 노출, 반복 노출) 1\n발암성 2\n생식독성 1A, 1B, 2`
  }
])
const closedVentilationLabels = ref<any>([
  {
    name: 'help',
    title: '✅ 최종 노출수준 = 노출수준 - 밀폐·환기상태',
    columns: [
      {
        name: 'grade',
        field: 'grade',
        label: '구분',
        align: 'center'
      },
      {
        name: 'standard',
        field: 'standard',
        label: '밀폐·환기상태',
        align: 'center',
        style: 'width: 180px'
      }
    ],
    data: [
      {
        grade: '1 (양호)',
        standard: '국소배기장치 설치'
      },
      {
        grade: '2 (매우 양호)',
        standard: '원격조작·완전밀폐'
      }
    ]
  }
])
const exposureLevelCombinationLabels = ref<any>([
  {
    name: 'help',
    title: '✅ 노출수준 : 일취급수준과 휘발성 (액체, 가스 상태) / 비산성 (분진, 흄 상태) 을 조합',
    columns: [
      {
        name: 'dailyLevel',
        field: 'dailyLevel',
        label: '일취급수준',
        align: 'center'
      },
      {
        name: 'volatilityLow',
        field: 'volatilityLow',
        label: '휘발성 1 (저)',
        align: 'center'
      },
      {
        name: 'volatilityMid',
        field: 'volatilityMid',
        label: '휘발성 2 (중)',
        align: 'center'
      },
      {
        name: 'volatilityHigh',
        field: 'volatilityHigh',
        label: '휘발성 3 (고)',
        align: 'center'
      },
      {
        name: 'maleficenceLow',
        field: 'maleficenceLow',
        label: '비산성 1 (저)',
        align: 'center'
      },
      {
        name: 'maleficenceMid',
        field: 'maleficenceMid',
        label: '비산성 2 (중)',
        align: 'center'
      },
      {
        name: 'maleficenceHigh',
        field: 'maleficenceHigh',
        label: '비산성 3 (고)',
        align: 'center'
      }
    ],
    data: [
      {
        dailyLevel: '1 (소)',
        volatilityLow: '1',
        volatilityMid: '2',
        volatilityHigh: '2',
        maleficenceLow: '1',
        maleficenceMid: '1',
        maleficenceHigh: '2'
      },
      {
        dailyLevel: '2 (중)',
        volatilityLow: '2',
        volatilityMid: '3',
        volatilityHigh: '3',
        maleficenceLow: '2',
        maleficenceMid: '3',
        maleficenceHigh: '3'
      },
      {
        dailyLevel: '3 (대)',
        volatilityLow: '2',
        volatilityMid: '3',
        volatilityHigh: '4',
        maleficenceLow: '2',
        maleficenceMid: '4',
        maleficenceHigh: '4'
      }
    ]
  }
])
const volatilityGradeLabel = ref<any>([
  {
    name: 'help',
    columns: [
      {
        name: 'division',
        field: 'division',
        label: '구분',
        align: 'center'
      },
      {
        name: 'low',
        field: 'low',
        label: '1 (저)',
        align: 'center'
      },
      {
        name: 'mid',
        field: 'mid',
        label: '2 (중)',
        align: 'center'
      },
      {
        name: 'high',
        field: 'high',
        label: '3 (고)',
        align: 'center'
      }
    ],
    data: [
      {
        division: '공정 온도가 상온 20℃ 이하인 경우',
        low: '150 ℃ < 끓는점',
        mid: '50 ℃ ≤ 끓는점 ≤ 150 ℃',
        high: '끓는점 < 50 ℃'
      },
      {
        division: '공정 온도 (A) 가 상온 20℃ 넘는 경우',
        low: '(5A + 50) ℃ < 끓는점',
        mid: '(2A + 10) ℃ ≤ 끓는점 ≤ (5A + 50) ℃',
        high: '끓는점 < (2A + 10) ℃'
      }
    ]
  }
])
const maleficenceGradeLabel = ref<any>([
  {
    name: 'help',
    columns: [
      {
        name: 'grade',
        field: 'grade',
        label: '노출수준',
        align: 'center'
      },
      {
        name: 'standard',
        field: 'standard',
        label: '기준',
        align: 'left'
      }
    ],
    data: [
      {
        grade: '1 (소)',
        standard: '부스러지지 않는 고체로 취급 중에 거의 먼지가 보이지 않는 경우'
      },
      {
        grade: '2 (중)',
        standard: '결정형 입상으로 취급 시 먼지가 보이나 쉽게 가라앉는 경우'
      },
      {
        grade: '3 (대)',
        standard: '미세하고 가벼운 분말로 취급 시 먼지 구름이 형성되는 경우'
      }
    ]
  }
])
const volumeUnitLabel = ref<any>([
  {
    name: 'help',
    columns: [
      {
        name: 'grade',
        field: 'grade',
        label: '노출수준',
        align: 'center'
      },
      {
        name: 'standard',
        field: 'standard',
        label: '기준',
        align: 'left'
      }
    ],
    data: [
      {
        grade: '1',
        standard: 'g, ㎖ 단위'
      },
      {
        grade: '2',
        standard: '㎏, ℓ 단위'
      },
      {
        grade: '3',
        standard: 'ton, ㎥ 단위'
      }
    ]
  }
])
const workMeasureColumns = ref<any>([
  {
    name: 'grade',
    field: 'grade',
    label: '노출수준',
    align: 'center'
  },
  {
    name: 'standard',
    field: 'standard',
    label: '기준',
    align: 'left'
  }
])
const workMeasureRows = ref<any>([
  {
    grade: '1',
    standard: 'A/B <= 10 %'
  },
  {
    grade: '2',
    standard: '10 % < A/B <= 50 %'
  },
  {
    grade: '3',
    standard: '50 % < A/B <= 100 %'
  },
  {
    grade: '4',
    standard: 'A/B > 100 %'
  }
])
const cardColumn = ref<any>([
  {
    name: 'materialName',
    field: 'materialName',
    label: '화학자재',
    align: 'left',
    style: 'width:90px',
    sortable: false
  },
  {
    name: 'chemName',
    field: 'chemName',
    label: '구성물질',
    align: 'left',
    style: 'width:200px',
    sortable: false
  },
  {
    name: 'item',
    field: 'item',
    label: 'CAS No.',
    align: 'center',
    style: 'width:130px',
    sortable: false,
    type: 'custom'
  }
])
const gridColumn = ref<any>([])
const scenario = ref<scenarioType>({
  ramCharmEstimationAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정
  materialName: '', // 화학자재
  chemName: '', // 구성물질
  casNo: '', // CAS No
  riskEstimation: '', // 위험도 추정
  exposureLevelFinal: '', // 최종노출수준
  toxic: '', // 유해성
  suspectUserFlag: '', // 유소견자 발생여부
  workMeasure: '', // 작업환경측정
  measValue: '', // 측정치(A)
  exposureStandard: '', // 노출기준(B)
  exposureMeasValue: '', //A/B(%)
  daily: '', // 하루 취급량, 비산성/휘발성, 밀폐·환기상태
  limitRepval: '', // 함유량
  dailyVolume: '', //일취급량
  volumeUnitName: '', // 단위
  dailyLevel: '', // 일취급 수준
  maleficenceType: null, //발생형태
  maleficenceGrade: null, //비산성
  boilingPoint: '', //끓는점
  volatilityGradeName: '', // 휘발성
  exposureLevelCombination: '', //노출수준
  closedVentilation: '0', // 밀폐·환기상태
  cmrFlag: '', // CMR여부
  measureCheck: '', // 노출기준확인
  maleficenceForm: null, //발생형태
  maleficenceValue: '', // 측정값
  hrCodeGrade: null, // 위험문구/유해·위험문구
  exposureCheck: '',
  harmfulCheck: ''
})
const volumnItems = ref<any>([])
const scenarioViewGroup = ref('L')
const isSave = ref(false)
const isSaveUnit = ref(false)
const maleficenceTypeFlag = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const saveUnitUrl = ref('')
const resultUpdateUrl = ref('')
const winPopup = ref<any>(null)
const table = ref<any>(null)
const editForm = ref<any>(null)
const activeWinProps = ref<any>({
  processCd: '',
  ramCharmEstimationAssessScenarioId: ''
})
const checkChildClosed = ref<numberNull>(null)
/******************************
 * @Computed_선언
 *******************************/
const isCompared = computed(() => {
  return props.processData.estimationReCheckedCnt > 0
})
const isMaleficenceType1 = computed(() => {
  return scenario.value.maleficenceType !== null && !maleficenceTypeFlag.value
})
const isMaleficenceType2 = computed(() => {
  return scenario.value.maleficenceType !== null && maleficenceTypeFlag.value
})
const disabled = computed(() => {
  return (
    (!(props.param.ramStepCd === 'RRS0000005' || props.param.ramStepCd == 'RRS0000010') ||
      props.processData.ramProcessAssessStepCd === 'RPA0000005' ||
      props.processData.estimationFlag === 'Y') &&
    !props.estimationUpdateBtnData.flag
  )
})
const setheight = computed(() => {
  const pxRemove = props.height.replace('px', '')
  return props.height && props.height.indexOf('px') > -1 && !isNaN(pxRemove)
    ? Number(pxRemove) - 300 + 'px'
    : '500px'
})
const estimationBtnEditable = computed(() => {
  return (
    editable.value &&
    props.param.ramStepCd === 'RRS0000010' &&
    props.processData.estimationFlag === 'Y' &&
    props.processData.ramProcessAssessStepCd !== 'RPA0000005'
  )
})
const flagCondition = computed(() => {
  // update 버튼 활성화 여부
  return (
    props.param.ramStepCd === 'RRS0000010' && // 감소대책 계획 및 실행 상태인 경우
    props.processData.estimationFlag === 'N' && // 추정완료되지 않은 경우
    props.processData.ramProcessAssessStepCd !== 'RPA0000005'
  ) // 공정완료 되지 않은 경우
})
const selectScenario = computed(() => {
  return Boolean(scenario.value.ramCharmEstimationAssessScenarioId)
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
        activeWinProps.value.ramCharmEstimationAssessScenarioId = ''
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
  listUrl.value = selectConfig.ram.charm.scenario.estimation.url
  detailUrl.value = selectConfig.ram.charm.scenario.estimationDetail.url
  saveUrl.value = transactionConfig.ram.charm.scenario.estimation.url
  saveUnitUrl.value = transactionConfig.ram.charm.scenario.estimationSave.url
  resultUpdateUrl.value = transactionConfig.ram.assessProcess.estimation.url
  // code setting
  // list setting
  setRisk()
}
/******************************
 * TODO (목적): 리스트 뷰
 *******************************/
function listView() {
  scenarioViewGroup.value = 'L'
  grid.value.columns = gridColumn.value
}
/******************************
 * TODO (목적): 카드 뷰
 *******************************/
function cardView() {
  scenarioViewGroup.value = 'C'
  grid.value.columns = cardColumn.value
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
    props.processData.charmEstimationScenarios = _result.data
  })
}
/******************************
 * TODO (목적): 시나리오 상세
 *******************************/
function getDetail(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ramCharmEstimationAssessScenarioId),
    method: 'GET'
  }).then((_result: any) => {
    scenario.value = _result.data

    if (scenario.value.maleficenceType == 'MT00000001') {
      maleficenceTypeFlag.value = false
    } else {
      maleficenceTypeFlag.value = true
    }
    isCardSelect.value = true
  })
}
function setRisk() {
  getMultiComboItems([
    'MALEFICENCE_TYPE',
    'CLOSED_VENTILATION',
    'MALEFICENCE_GRADE',
    'MALEFICENCE_FORM',
    'HR_CODE_GRADE',
    'VOLUME_UNIT'
  ]).then((_result: any) => {
    volumnItems.value = _result['VOLUME_UNIT']
    gridColumn.value = [
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
        fix: true,
        name: 'chemName',
        field: 'chemName',
        label: '구성물질',
        align: 'left',
        style: 'width:180px',
        sortable: false
      },
      {
        fix: true,
        name: 'casNo',
        field: 'casNo',
        label: 'CAS No.',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'riskEstimation',
        field: 'riskEstimation',
        label: '위험도 추정',
        align: 'center',
        style: 'width:50px',
        sortable: false,
        color: '#1976D2'
      },
      {
        name: 'exposureLevelFinal',
        field: 'exposureLevelFinal',
        label: '최종노출수준',
        align: 'center',
        style: 'width:40px',
        sortable: false,
        color: '#1976D2'
      },
      {
        name: 'toxic',
        field: 'toxic',
        label: '유해성',
        align: 'center',
        style: 'width:60px',
        sortable: false,
        color: '#1976D2'
      },
      {
        name: 'f',
        field: 'f',
        label: '노출수준 측정',
        child: [
          {
            name: 'suspectUserFlag',
            field: 'suspectUserFlag',
            label: '유소견자<br/>발생여부',
            align: 'center',
            style: 'width:70px',
            sortable: false,
            type: 'check',
            true: 'Y',
            false: 'N',
            helpcomment: '직업병 유소견자(D1) 발생 시 : 노출수준 4등급 (최상)'
          },
          {
            name: 'workMeasure',
            field: 'workMeasure',
            label: '작업환경측정',
            helpcommentTable: {
              columns: [
                {
                  name: 'grade',
                  field: 'grade',
                  label: '노출수준',
                  align: 'center'
                },
                {
                  name: 'standard',
                  field: 'standard',
                  label: '기준',
                  align: 'left'
                }
              ],
              data: [
                {
                  grade: '1',
                  standard: 'A/B <= 10 %'
                },
                {
                  grade: '2',
                  standard: '10 % < A/B <= 50 %'
                },
                {
                  grade: '3',
                  standard: '50 % < A/B <= 100 %'
                },
                {
                  grade: '4',
                  standard: 'A/B > 100 %'
                }
              ]
            },
            child: [
              {
                name: 'measValue',
                field: 'measValue',
                label: '측정치(A)',
                align: 'right',
                style: 'width:80px',
                sortable: false,
                type: 'number'
              },
              {
                name: 'exposureStandard',
                field: 'exposureStandard',
                label: '노출기준(B)',
                align: 'right',
                style: 'width:80px',
                sortable: false,
                type: 'number'
              },
              {
                name: 'exposureMeasValue',
                field: 'exposureMeasValue',
                label: 'A/B(%)',
                align: 'right',
                style: 'width:65px',
                sortable: false,
                type: 'cost'
              }
            ]
          },
          {
            name: 'daily',
            field: 'daily',
            label: '하루 취급량, 비산성/휘발성, 밀폐·환기상태',
            child: [
              {
                name: 'limitRepval',
                field: 'limitRepval',
                label: '함유량(%)',
                align: 'center',
                style: 'width:60px',
                sortable: false,
                type: 'number'
              },
              {
                name: 'dailyVolume',
                field: 'dailyVolume',
                label: '일취급량',
                align: 'center',
                style: 'width:70px',
                sortable: false
              },
              {
                name: 'volumeUnitName',
                field: 'volumeUnitName',
                label: '단위',
                helpcommentTable: {
                  columns: [
                    {
                      name: 'grade',
                      field: 'grade',
                      label: '노출수준',
                      align: 'center'
                    },
                    {
                      name: 'standard',
                      field: 'standard',
                      label: '기준',
                      align: 'left'
                    }
                  ],
                  data: [
                    {
                      grade: '1',
                      standard: 'g, ㎖ 단위'
                    },
                    {
                      grade: '2',
                      standard: '㎏, ℓ 단위'
                    },
                    {
                      grade: '3',
                      standard: 'ton, ㎥ 단위'
                    }
                  ]
                },
                align: 'center',
                style: 'width:50px',
                sortable: false
              },
              {
                name: 'dailyLevel',
                field: 'dailyLevel',
                label: '일취급 수준',
                align: 'center',
                style: 'width:70px',
                sortable: false
              },
              {
                name: 'maleficenceType',
                field: 'maleficenceType',
                label: '발생형태',
                align: 'center',
                style: 'width:80px',
                sortable: false,
                type: 'select',
                comboItems: _result['MALEFICENCE_TYPE']
              },
              {
                name: 'maleficenceGrade',
                field: 'maleficenceGrade',
                label: '비산성',
                align: 'center',
                style: 'width:80px',
                sortable: false,
                helpcommentTable: {
                  columns: [
                    {
                      name: 'grade',
                      field: 'grade',
                      label: '노출수준',
                      align: 'center'
                    },
                    {
                      name: 'standard',
                      field: 'standard',
                      label: '기준',
                      align: 'left'
                    }
                  ],
                  data: [
                    {
                      grade: '1 (소)',
                      standard: '부스러지지 않는 고체로 취급 중에 거의 먼지가 보이지 않는 경우'
                    },
                    {
                      grade: '2 (중)',
                      standard: '결정형 입상으로 취급 시 먼지가 보이나 쉽게 가라앉는 경우'
                    },
                    {
                      grade: '3 (대)',
                      standard: '미세하고 가벼운 분말로 취급 시 먼지 구름이 형성되는 경우'
                    }
                  ]
                },
                disableTarget: 'maleficenceType',
                disableCon: 'MT00000001',
                type: 'select',
                comboItems: _result['MALEFICENCE_GRADE']
              },
              {
                name: 'boilingPoint',
                field: 'boilingPoint',
                label: '끓는점(℃)',
                align: 'right',
                style: 'width:60px',
                sortable: false,
                type: 'number',
                disableTarget: 'maleficenceType',
                disableCon: 'MT00000002'
              },
              {
                name: 'volatilityGradeName',
                field: 'volatilityGradeName',
                label: '휘발성',
                helpcommentTable: {
                  columns: [
                    {
                      name: 'division',
                      field: 'division',
                      label: '구분',
                      align: 'center'
                    },
                    {
                      name: 'low',
                      field: 'low',
                      label: '1 (저)',
                      align: 'center'
                    },
                    {
                      name: 'mid',
                      field: 'mid',
                      label: '2 (중)',
                      align: 'center'
                    },
                    {
                      name: 'high',
                      field: 'high',
                      label: '3 (고)',
                      align: 'center'
                    }
                  ],
                  data: [
                    {
                      division: '공정 온도가 상온 20℃ 이하인 경우',
                      low: '150 ℃ < 끓는점',
                      mid: '50 ℃ ≤ 끓는점 ≤ 150 ℃',
                      high: '끓는점 < 50 ℃'
                    },
                    {
                      division: '공정 온도 (A) 가 상온 20℃ 넘는 경우',
                      low: '(5A + 50) ℃ < 끓는점',
                      mid: '(2A + 10) ℃ ≤ 끓는점 ≤ (5A + 50) ℃',
                      high: '끓는점 < (2A + 10) ℃'
                    }
                  ]
                },
                align: 'center',
                style: 'width:60px',
                sortable: false
              },
              {
                name: 'exposureLevelCombination',
                field: 'exposureLevelCombination',
                label: '노출수준',
                helpcommentTable: {
                  title:
                    '✅ 노출수준 : 일취급수준과 휘발성 (액체, 가스 상태) / 비산성 (분진, 흄 상태) 을 조합',
                  columns: [
                    {
                      name: 'dailyLevel',
                      field: 'dailyLevel',
                      label: '일취급수준',
                      align: 'center'
                    },
                    {
                      name: 'volatilityLow',
                      field: 'volatilityLow',
                      label: '휘발성 1 (저)',
                      align: 'center'
                    },
                    {
                      name: 'volatilityMid',
                      field: 'volatilityMid',
                      label: '휘발성 2 (중)',
                      align: 'center'
                    },
                    {
                      name: 'volatilityHigh',
                      field: 'volatilityHigh',
                      label: '휘발성 3 (고)',
                      align: 'center'
                    },
                    {
                      name: 'maleficenceLow',
                      field: 'maleficenceLow',
                      label: '비산성 1 (저)',
                      align: 'center'
                    },
                    {
                      name: 'maleficenceMid',
                      field: 'maleficenceMid',
                      label: '비산성 2 (중)',
                      align: 'center'
                    },
                    {
                      name: 'maleficenceHigh',
                      field: 'maleficenceHigh',
                      label: '비산성 3 (고)',
                      align: 'center'
                    }
                  ],
                  data: [
                    {
                      dailyLevel: '1 (소)',
                      volatilityLow: '1',
                      volatilityMid: '2',
                      volatilityHigh: '2',
                      maleficenceLow: '1',
                      maleficenceMid: '1',
                      maleficenceHigh: '2'
                    },
                    {
                      dailyLevel: '2 (중)',
                      volatilityLow: '2',
                      volatilityMid: '3',
                      volatilityHigh: '3',
                      maleficenceLow: '2',
                      maleficenceMid: '3',
                      maleficenceHigh: '3'
                    },
                    {
                      dailyLevel: '3 (대)',
                      volatilityLow: '2',
                      volatilityMid: '3',
                      volatilityHigh: '4',
                      maleficenceLow: '2',
                      maleficenceMid: '4',
                      maleficenceHigh: '4'
                    }
                  ]
                },
                align: 'center',
                style: 'width:70px',
                sortable: false
              },
              {
                name: 'closedVentilation',
                field: 'closedVentilation',
                label: '밀폐·환기상태',
                helpcommentTable: {
                  title: '✅ 최종 노출수준 = 노출수준 - 밀폐·환기상태',
                  columns: [
                    {
                      name: 'grade',
                      field: 'grade',
                      label: '구분',
                      align: 'center'
                    },
                    {
                      name: 'standard',
                      field: 'standard',
                      label: '밀폐·환기상태',
                      align: 'center',
                      style: 'width: 180px'
                    }
                  ],
                  data: [
                    {
                      grade: '1 (양호)',
                      standard: '국소배기장치 설치'
                    },
                    {
                      grade: '2 (매우 양호)',
                      standard: '원격조작·완전밀폐'
                    }
                  ]
                },
                align: 'center',
                style: 'width:100px',
                sortable: false,
                type: 'select',
                none: 'none',
                comboItems: _result['CLOSED_VENTILATION']
              }
            ]
          }
        ]
      },
      {
        name: 's',
        field: 's',
        label: '유해성 측정',
        child: [
          {
            name: 'cmrFlag',
            field: 'cmrFlag',
            label: 'CMR여부',
            helpcomment: 'CMR 물질(1A, 1B, 2)에 해당 시 : 유해성 4등급 (최대)',
            align: 'center',
            style: 'width:80px',
            sortable: false,
            type: 'check',
            true: 'Y',
            false: 'N'
          },
          {
            name: 'measureCheck',
            field: 'measureCheck',
            label: '노출기준확인',
            helpcommentTable: {
              columns: [
                {
                  name: 'grade',
                  field: 'grade',
                  label: '구분',
                  align: 'center'
                },
                {
                  name: 'dust',
                  field: 'dust',
                  label: '분진(㎎/㎥) 노출기준',
                  align: 'center'
                },
                {
                  name: 'vapor',
                  field: 'vapor',
                  label: '증기(ppm) 노출기준',
                  align: 'center'
                }
              ],
              data: [
                {
                  grade: '1 (소)',
                  dust: '1 초과 ~ 10 이하',
                  vapor: '50 초과 ~ 500 이하'
                },
                {
                  grade: '2 (중)',
                  dust: '0.1 초과 ~ 1 이하',
                  vapor: '5 초과 ~ 50 이하'
                },
                {
                  grade: '3 (대)',
                  dust: '0.01 초과 ~ 0.1 이하',
                  vapor: '0.5 초과 ~ 5 이하'
                },
                {
                  grade: '4 (최대)',
                  dust: '0.01 이하',
                  vapor: '0.5 이하'
                }
              ]
            },
            child: [
              {
                name: 'maleficenceForm',
                field: 'maleficenceForm',
                label: '발생형태',
                align: 'center',
                style: 'width:110px',
                sortable: false,
                disableTarget: 'cmrFlag',
                disableCon: 'N',
                type: 'select',
                comboItems: _result['MALEFICENCE_FORM']
              },
              {
                name: 'maleficenceValue',
                field: 'maleficenceValue',
                label: '측정값',
                align: 'right',
                style: 'width:80px',
                sortable: false,
                disableTarget: 'cmrFlag',
                disableCon: 'N',
                type: 'number'
              }
            ]
          },
          {
            name: 'hrCodeGrade',
            field: 'hrCodeGrade',
            label: '유해·위험문구',
            helpcommentTable: {
              columns: [
                {
                  name: 'grade',
                  field: 'grade',
                  label: '등급',
                  align: 'center'
                },
                {
                  name: 'hcode',
                  field: 'hcode',
                  label: 'GHS 유해·위험문구 (H-code)',
                  align: 'left'
                },
                {
                  name: 'remark',
                  field: 'remark',
                  label: '비고',
                  align: 'left'
                }
              ],
              data: [
                {
                  grade: '1 (소)',
                  hcode: `H315,\nH319,\nH362,\nH336\n2~4등급에 분류되지 않은 기타 유해·위험문구`,
                  remark: `피부 부식성/피부 자극성 2\n심한 눈 손상성/눈 자극성 2\n생식독성(수유독성)\n특정표적장기 독성(1회 노출) 3(마취작용)\n2~4등급에 분류되지 않은 기타 유해성·위험성 분류`
                },
                {
                  grade: '2 (중)',
                  hcode: `H302, H312, H332,\nH305`,
                  remark: `급성 독성(경구, 경피, 흡입) 4\n흡인 유해성 2`
                },
                {
                  grade: '3 (대)',
                  hcode: `H301, H311, H331\nH314, \nH318,\nH371, H373,\nH335,\nH317`,
                  remark: `급성 독성(경구, 경피, 흡입) 3\n피부 부식성/피부 자극성 1\n심한 눈 손상성/눈 자극성 1\n특정표적장기 독성(1회 노출, 반복 노출) 2\n특정표적장기 독성(1회 노출) 3(호흡기계 자극)\n피부 과민성 1`
                },
                {
                  grade: '4 (최대)',
                  hcode: `H340, H341, H350, \nH334\nH300, H310, H330, \nH304, \nH370, H372,\nH351,\nH360, H361`,
                  remark: `생식세포 변이원성 1A, 1B, 2, 발암성 1A, 1B, \n호흡기 과민성 1\n급성 독성(경구, 경피, 흡입) 1, 2\n흡인 유해성 1\n특정표적장기 독성(1회 노출, 반복 노출) 1\n발암성 2\n생식독성 1A, 1B, 2`
                }
              ]
            },
            align: 'center',
            style: 'width:80px',
            sortable: false,
            disableTarget: 'cmrFlag',
            disableCon: 'N',
            type: 'select',
            comboItems: _result['HR_CODE_GRADE']
          }
        ]
      }
    ]
    grid.value.columns = gridColumn.value
    getList()
  })
}
function tableDataChange(_props: any, _col: any) {
  if (_col.name === 'maleficenceType') {
    if (_props.row[_col.name] === 'MT00000002') {
      _props.row.maleficenceGrade = null
      if (_props.row.boilingPoint) {
        // 끓는점이 있는 경우 : 공정사용온도는 필수 체크후 넘어왔음으로 있다고 판단
        // 상온 여부 체크
        if (props.processData.temperature !== 20) {
          _props.row.volatilityGrade =
            _props.row.boilingPoint < props.processData.temperature * 2 + 10
              ? '3'
              : _props.row.boilingPoint >= props.processData.temperature * 2 + 10 &&
                  _props.row.boilingPoint <= props.processData.temperature * 5 + 50
                ? '2'
                : '1'
        } else {
          _props.row.volatilityGrade =
            _props.row.boilingPoint < 50
              ? '3'
              : _props.row.boilingPoint >= 50 && _props.row.boilingPoint <= 150
                ? '2'
                : '1'
        }
        _props.row.volatilityGradeName =
          _props.row.volatilityGrade === '3'
            ? '3(고)'
            : _props.row.volatilityGrade === '2'
              ? '2(중)'
              : '1(저)'
      } else {
        // 노출기준 초기화 처리
        _props.row.volatilityGrade = '0'
        _props.row.volatilityGradeName = ''
      }
    } else {
      _props.row.boilingPoint = ''
      _props.row.volatilityGradeName = ''
    }
  } else if (_col.name === 'boilingPoint') {
    // 끓는점 데이터가 들어온 경우
    // 공정사용온도는 필수 체크후 넘어왔음으로 있다고 판단
    // 상온 여부 체크
    if (_props.row[_col.name]) {
      if (props.processData.temperature !== 20) {
        _props.row.volatilityGrade =
          _props.row.boilingPoint < props.processData.temperature * 2 + 10
            ? '3'
            : _props.row.boilingPoint >= props.processData.temperature * 2 + 10 &&
                _props.row.boilingPoint <= props.processData.temperature * 5 + 50
              ? '2'
              : '1'
      } else {
        _props.row.volatilityGrade =
          _props.row.boilingPoint < 50
            ? '3'
            : _props.row.boilingPoint >= 50 && _props.row.boilingPoint <= 150
              ? '2'
              : '1'
      }
      _props.row.volatilityGradeName =
        _props.row.volatilityGrade === '3'
          ? '3(고)'
          : _props.row.volatilityGrade === '2'
            ? '2(중)'
            : '1(저)'
    } else {
      _props.row.volatilityGrade = '0'
      _props.row.volatilityGradeName = ''
    }
  } else if (_col.name === 'measValue' || _col.name === 'exposureStandard') {
    /**
     * 작업환경측정 :: 해당 부분은 업체를 통해 측정값을 받아 계산하는 로직이 들어가며
     *                기본적으로 해당 측정치를 사용자가 마음대로 바꾸는것은 안됨
     *                LNF 및 솔루션에서는 작업환경측정 데이터가 안 들어올 수 있다는 가정하에 입력을 받게 처리
     */
    const _exposureMeasValue =
      _props.row.exposureStandard &&
      !isNaN(_props.row.exposureStandard) &&
      Number(_props.row.exposureStandard) !== 0
        ? ((_props.row.measValue && !isNaN(_props.row.measValue)
            ? Number(_props.row.measValue)
            : 0) *
            100) /
          Number(_props.row.exposureStandard)
        : 0
    _props.row.exposureMeasValue = _.ceil(_exposureMeasValue, 2)
  } else if (_col.name === 'limitRepval') {
    /**
     * 함유량 :: 화학자재 마스터에서 관리하는 구성성분의 함유량을 토대로 일취급수준을 결정
     *          단 함유량 대표값을 정확히 판단하기 어려운 경우를 위해 key-in이 되도록 설정
     */
    if (_props.row.limitRepval && !isNaN(_props.row.limitRepval)) {
      const chemprod = _.find(props.processData.charmResultScenarios, {
        mdmChemMaterialId: _props.row.mdmChemMaterialId
      })
      let _dailyVolume = _.round(
        Number(chemprod.dailyVolume) * (Number(_props.row.limitRepval) / 100),
        4
      ) // 물질의 일취급량
      const _volumeObj = _.find(volumnItems.value, { code: chemprod.volumeUnit })
      let _volumeUnit = _volumeObj.code
      let _volumeUnitName = _volumeObj.codeName
      switch (chemprod.volumeUnit) {
        case '1': // g, ㎖
          if (_dailyVolume >= 1000 && _dailyVolume < 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '2'
            _volumeUnitName = _.find(volumnItems.value, { code: '2' }).codeName
          } else if (_dailyVolume >= 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '3'
            _volumeUnitName = _.find(volumnItems.value, { code: '3' }).codeName
          }
          break
        case '4': // g, ㎖
          if (_dailyVolume >= 1000 && _dailyVolume < 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '5'
            _volumeUnitName = _.find(volumnItems.value, { code: '5' }).codeName
          } else if (_dailyVolume >= 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '6'
            _volumeUnitName = _.find(volumnItems.value, { code: '6' }).codeName
          }
          break
        case '2': // ㎏, ℓ
          if (_dailyVolume >= 1000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '3'
            _volumeUnitName = _.find(volumnItems.value, { code: '3' }).codeName
          } else if (_dailyVolume < 1) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '1'
            _volumeUnitName = _.find(volumnItems.value, { code: '1' }).codeName
          }
          break
        case '5': // ㎏, ℓ
          if (_dailyVolume >= 1000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '6'
            _volumeUnitName = _.find(volumnItems.value, { code: '6' }).codeName
          } else if (_dailyVolume < 1) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '4'
            _volumeUnitName = _.find(volumnItems.value, { code: '4' }).codeName
          }
          break
        case '3': // ton, ㎥
          if (_dailyVolume < 1 && _dailyVolume >= 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '2'
            _volumeUnitName = _.find(volumnItems.value, { code: '2' }).codeName
          } else if (_dailyVolume < 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000 * 1000, 2)
            _volumeUnit = '1'
            _volumeUnitName = _.find(volumnItems.value, { code: '1' }).codeName
          }
          break
        case '6': // ton, ㎥
          if (_dailyVolume < 1 && _dailyVolume >= 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '5'
            _volumeUnitName = _.find(volumnItems.value, { code: '5' }).codeName
          } else if (_dailyVolume < 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000 * 1000, 2)
            _volumeUnit = '4'
            _volumeUnitName = _.find(volumnItems.value, { code: '4' }).codeName
          }
          break
      }
      _props.row.dailyVolume = _dailyVolume
      _props.row.volumeUnit = _volumeUnit
      _props.row.volumeUnitName = _volumeUnitName
      _props.row.dailyLevel = _volumeUnit
    } else {
      _props.row.dailyVolume = 0
      _props.row.volumeUnit = null
      _props.row.volumeUnitName = null
      _props.row.dailyLevel = '0'
    }
  }

  riskEstimationCheck(_props, _col)
}
function riskEstimationCheck(_props: any, _col: any) {
  // 노출 기준 측정
  if (_props.row.suspectUserFlag === 'Y') {
    // 1. 유소견자가 있는 경우
    _props.row.exposureLevelFinal = String(Number('4'))
    _props.row.exposureCheck = 'F'
  } else if (_props.row.exposureMeasValue) {
    // 2. 작업환경측정 정보가 있는 경우
    const num = Number(_props.row.exposureMeasValue)
    _props.row.exposureLevelFinal =
      num > 100 ? '4' : num > 50 && num <= 100 ? '3' : num > 10 && num <= 50 ? '2' : '1'
    _props.row.exposureCheck = 'S'
  } else {
    // 3. 비산성 / 휘발성 체크
    if (_props.row['maleficenceType'] === 'MT00000001') {
      if (_props.row.dailyLevel === '3') {
        _props.row.exposureLevelCombination =
          _props.row.maleficenceGrade === '3'
            ? '4'
            : _props.row.maleficenceGrade === '2'
              ? '4'
              : _props.row.maleficenceGrade === '1'
                ? '2'
                : '0'
      } else if (_props.row.dailyLevel === '2') {
        _props.row.exposureLevelCombination =
          _props.row.maleficenceGrade === '3'
            ? '3'
            : _props.row.maleficenceGrade === '2'
              ? '3'
              : _props.row.maleficenceGrade === '1'
                ? '2'
                : '0'
      } else if (_props.row.dailyLevel === '1') {
        _props.row.exposureLevelCombination =
          _props.row.maleficenceGrade === '3'
            ? '2'
            : _props.row.maleficenceGrade === '2'
              ? '1'
              : _props.row.maleficenceGrade === '1'
                ? '1'
                : '0'
      } else {
        _props.row.exposureLevelCombination = '0'
      }
    } else if (_props.row['maleficenceType'] === 'MT00000002') {
      if (_props.row.dailyLevel === '3') {
        _props.row.exposureLevelCombination =
          _props.row.volatilityGrade === '3'
            ? '4'
            : _props.row.volatilityGrade === '2'
              ? '3'
              : _props.row.volatilityGrade === '1'
                ? '2'
                : '0'
      } else if (_props.row.dailyLevel === '2') {
        _props.row.exposureLevelCombination =
          _props.row.volatilityGrade === '3'
            ? '3'
            : _props.row.volatilityGrade === '2'
              ? '3'
              : _props.row.volatilityGrade === '1'
                ? '2'
                : '0'
      } else if (_props.row.dailyLevel === '1') {
        _props.row.exposureLevelCombination =
          _props.row.volatilityGrade === '3'
            ? '2'
            : _props.row.volatilityGrade === '2'
              ? '2'
              : _props.row.volatilityGrade === '1'
                ? '1'
                : '0'
      } else {
        _props.row.exposureLevelCombination = '0'
      }
    } else {
      // 선택되지 않은 경우
      _props.row.exposureLevelCombination = '0'
    }

    _props.row.exposureLevelFinal = String(
      Number(_props.row.exposureLevelCombination) - Number(_props.row.closedVentilation)
    )
    _props.row.exposureCheck = 'T'
  }

  // 유해성 측정
  if (_props.row.cmrFlag === 'Y') {
    // 1. CMR 물질 여부
    _props.row.toxic = '4'
    _props.row.harmfulCheck = 'F'
  } else if (_props.row.maleficenceValue && _props.row.maleficenceForm) {
    // 2. 발생형태에 따른 측정값 체크
    /**
     * 노출값 체크
     * 10㎎/㎥(분진) 또는 500ppm(증기)을 초과 여부
     */
    const checkVal =
      _props.row.maleficenceForm === '분진'
        ? _props.row.maleficenceValue <= 10
        : _props.row.maleficenceValue <= 500
    if (checkVal) {
      const toxic = function (maleficenceValue: any, constVal: any) {
        return maleficenceValue <= 0.01 * constVal
          ? '4'
          : maleficenceValue > 0.01 * constVal && maleficenceValue <= 0.1 * constVal
            ? '3'
            : maleficenceValue > 0.1 * constVal && maleficenceValue <= 1 * constVal
              ? '2'
              : '1'
      }
      _props.row.toxic =
        _props.row.maleficenceForm === '분진'
          ? toxic(_props.row.maleficenceValue, 1)
          : toxic(_props.row.maleficenceValue, 50)
    } else {
      _props.row.toxic = _props.row.hrCodeGrade ? _props.row.hrCodeGrade : '0'
      // 초과한 경우 유해위험문구를 체크
    }
    _props.row.harmfulCheck = 'S'
  } else {
    // 유해위험문구
    _props.row.toxic = _props.row.hrCodeGrade ? _props.row.hrCodeGrade : '0'
    _props.row.harmfulCheck = 'T'
  }
  // 위험도 추정
  _props.row.riskEstimation = String(
    (_props.row.exposureLevelFinal && !isNaN(_props.row.exposureLevelFinal)
      ? Number(_props.row.exposureLevelFinal)
      : 0) * (_props.row.toxic && !isNaN(_props.row.toxic) ? Number(_props.row.toxic) : 0)
  )
}
function cardDataChange(_type: any) {
  if (_type == 'maleficenceType') {
    // 발생형태
    if (scenario.value.maleficenceType === 'MT00000002') {
      //휘발성일 경우
      maleficenceTypeFlag.value = true
      scenario.value.maleficenceGrade = null
      if (scenario.value.boilingPoint) {
        // 끓는점이 있는 경우 : 공정사용온도는 필수 체크후 넘어왔음으로 있다고 판단
        // 상온 여부 체크
        if (props.processData.temperature !== 20) {
          scenario.value.volatilityGrade =
            scenario.value.boilingPoint < props.processData.temperature * 2 + 10
              ? '3'
              : scenario.value.boilingPoint >= props.processData.temperature * 2 + 10 &&
                  scenario.value.boilingPoint <= props.processData.temperature * 5 + 50
                ? '2'
                : '1'
        } else {
          scenario.value.volatilityGrade =
            scenario.value.boilingPoint < 50
              ? '3'
              : scenario.value.boilingPoint >= 50 && scenario.value.boilingPoint <= 150
                ? '2'
                : '1'
        }
        scenario.value.volatilityGradeName =
          scenario.value.volatilityGrade === '3'
            ? '3(고)'
            : scenario.value.volatilityGrade === '2'
              ? '2(중)'
              : '1(저)'
      } else {
        scenario.value.volatilityGrade = '0'
        scenario.value.volatilityGradeName = ''
        // 노출기준 초기화 처리
      }
    } else {
      maleficenceTypeFlag.value = false
    }
  } else if (_type == 'boilingPoint') {
    // 끓는점
    // 끓는점 데이터가 들어온 경우
    // 공정사용온도는 필수 체크후 넘어왔음으로 있다고 판단
    // 상온 여부 체크
    if (scenario.value.boilingPoint) {
      if (props.processData.temperature !== 20) {
        scenario.value.volatilityGrade =
          scenario.value.boilingPoint < props.processData.temperature * 2 + 10
            ? '3'
            : scenario.value.boilingPoint >= props.processData.temperature * 2 + 10 &&
                scenario.value.boilingPoint <= props.processData.temperature * 5 + 50
              ? '2'
              : '1'
      } else {
        scenario.value.volatilityGrade =
          scenario.value.boilingPoint < 50
            ? '3'
            : scenario.value.boilingPoint >= 50 && scenario.value.boilingPoint <= 150
              ? '2'
              : '1'
      }
      scenario.value.volatilityGradeName =
        scenario.value.volatilityGrade === '3'
          ? '3(고)'
          : scenario.value.volatilityGrade === '2'
            ? '2(중)'
            : '1(저)'
    } else {
      scenario.value.volatilityGrade = '0'
      scenario.value.volatilityGradeName = ''
    }
  } else if (_type == 'measValue' || _type == 'exposureStandard') {
    /**
     * 작업환경측정 :: 해당 부분은 업체를 통해 측정값을 받아 계산하는 로직이 들어가며
     *                기본적으로 해당 측정치를 사용자가 마음대로 바꾸는것은 안됨
     *                LNF 및 솔루션에서는 작업환경측정 데이터가 안 들어올 수 있다는 가정하에 입력을 받게 처리
     */
    const _exposureMeasValue =
      scenario.value.exposureStandard &&
      !isNaN(scenario.value.exposureStandard) &&
      Number(scenario.value.exposureStandard) !== 0
        ? ((scenario.value.measValue && !isNaN(scenario.value.measValue)
            ? Number(scenario.value.measValue)
            : 0) *
            100) /
          Number(scenario.value.exposureStandard)
        : 0
    scenario.value.exposureMeasValue = _.ceil(_exposureMeasValue, 2)
  } else if (_type == 'limitRepval') {
    /**
     * 함유량 :: 화학자재 마스터에서 관리하는 구성성분의 함유량을 토대로 일취급수준을 결정
     *          단 함유량 대표값을 정확히 판단하기 어려운 경우를 위해 key-in이 되도록 설정
     */
    if (scenario.value.limitRepval && !isNaN(scenario.value.limitRepval)) {
      const chemprod = _.find(props.processData.charmResultScenarios, {
        mdmChemMaterialId: scenario.value.mdmChemMaterialId
      })
      let _dailyVolume = _.round(
        Number(chemprod.dailyVolume) * (Number(scenario.value.limitRepval) / 100),
        4
      ) // 물질의 일취급량
      const _volumeObj = _.find(volumnItems.value, { code: chemprod.volumeUnit })
      let _volumeUnit = _volumeObj.code
      let _volumeUnitName = _volumeObj.codeName
      switch (chemprod.volumeUnit) {
        case '1': // g, ㎖
          if (_dailyVolume >= 1000 && _dailyVolume < 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '2'
            _volumeUnitName = _.find(volumnItems.value, { code: '2' }).codeName
          } else if (_dailyVolume >= 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '3'
            _volumeUnitName = _.find(volumnItems.value, { code: '3' }).codeName
          }
          break
        case '4': // g, ㎖
          if (_dailyVolume >= 1000 && _dailyVolume < 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '5'
            _volumeUnitName = _.find(volumnItems.value, { code: '5' }).codeName
          } else if (_dailyVolume >= 1000000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '6'
            _volumeUnitName = _.find(volumnItems.value, { code: '6' }).codeName
          }
          break
        case '2': // ㎏, ℓ
          if (_dailyVolume >= 1000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '3'
            _volumeUnitName = _.find(volumnItems.value, { code: '3' }).codeName
          } else if (_dailyVolume < 1) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '1'
            _volumeUnitName = _.find(volumnItems.value, { code: '1' }).codeName
          }
          break
        case '5': // ㎏, ℓ
          if (_dailyVolume >= 1000) {
            _dailyVolume = _.round(_dailyVolume / 1000, 2)
            _volumeUnit = '6'
            _volumeUnitName = _.find(volumnItems.value, { code: '6' }).codeName
          } else if (_dailyVolume < 1) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '4'
            _volumeUnitName = _.find(volumnItems.value, { code: '4' }).codeName
          }
          break
        case '3': // ton, ㎥
          if (_dailyVolume < 1 && _dailyVolume >= 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '2'
            _volumeUnitName = _.find(volumnItems.value, { code: '2' }).codeName
          } else if (_dailyVolume < 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000 * 1000, 2)
            _volumeUnit = '1'
            _volumeUnitName = _.find(volumnItems.value, { code: '1' }).codeName
          }
          break
        case '6': // ton, ㎥
          if (_dailyVolume < 1 && _dailyVolume >= 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000, 2)
            _volumeUnit = '5'
            _volumeUnitName = _.find(volumnItems.value, { code: '5' }).codeName
          } else if (_dailyVolume < 0.001) {
            _dailyVolume = _.round(_dailyVolume * 1000 * 1000, 2)
            _volumeUnit = '4'
            _volumeUnitName = _.find(volumnItems.value, { code: '4' }).codeName
          }
          break
      }
      scenario.value.dailyVolume = _dailyVolume
      scenario.value.volumeUnitName = _volumeUnitName
      scenario.value.dailyLevel = _volumeUnit
    } else {
      scenario.value.dailyVolume = 0
      scenario.value.volumeUnit = null
      scenario.value.volumeUnitName = null
      scenario.value.dailyLevel = '0'
    }
  }

  cardRiskEstimationCheck()
}
function cardRiskEstimationCheck() {
  // 노출 기준 측정
  if (scenario.value.suspectUserFlag === 'Y') {
    // 1. 유소견자가 있는 경우
    scenario.value.exposureLevelCombination = '4'
    scenario.value.exposureCheck = 'F'
  } else if (scenario.value.exposureMeasValue) {
    // 2. 작업환경측정 정보가 있는 경우
    const num = Number(scenario.value.exposureMeasValue)
    scenario.value.exposureLevelCombination =
      num > 100 ? '4' : num > 50 && num <= 100 ? '3' : num > 10 && num <= 50 ? '2' : '1'
    scenario.value.exposureCheck = 'S'
  } else {
    // 3. 비산성 / 휘발성 체크
    if (scenario.value.maleficenceType === 'MT00000001') {
      if (scenario.value.dailyLevel === '3') {
        scenario.value.exposureLevelCombination =
          scenario.value.maleficenceGrade === '3'
            ? '4'
            : scenario.value.maleficenceGrade === '2'
              ? '4'
              : scenario.value.maleficenceGrade === '1'
                ? '2'
                : '0'
      } else if (scenario.value.dailyLevel === '2') {
        scenario.value.exposureLevelCombination =
          scenario.value.maleficenceGrade === '3'
            ? '3'
            : scenario.value.maleficenceGrade === '2'
              ? '3'
              : scenario.value.maleficenceGrade === '1'
                ? '2'
                : '0'
      } else if (scenario.value.dailyLevel === '1') {
        scenario.value.exposureLevelCombination =
          scenario.value.maleficenceGrade === '3'
            ? '2'
            : scenario.value.maleficenceGrade === '2'
              ? '1'
              : scenario.value.maleficenceGrade === '1'
                ? '1'
                : '0'
      } else {
        scenario.value.exposureLevelCombination = '0'
      }
    } else if (scenario.value.maleficenceType === 'MT00000002') {
      if (scenario.value.dailyLevel === '3') {
        scenario.value.exposureLevelCombination =
          scenario.value.volatilityGrade === '3'
            ? '4'
            : scenario.value.volatilityGrade === '2'
              ? '3'
              : scenario.value.volatilityGrade === '1'
                ? '2'
                : '0'
      } else if (scenario.value.dailyLevel === '2') {
        scenario.value.exposureLevelCombination =
          scenario.value.volatilityGrade === '3'
            ? '3'
            : scenario.value.volatilityGrade === '2'
              ? '3'
              : scenario.value.volatilityGrade === '1'
                ? '2'
                : '0'
      } else if (scenario.value.dailyLevel === '1') {
        scenario.value.exposureLevelCombination =
          scenario.value.volatilityGrade === '3'
            ? '2'
            : scenario.value.volatilityGrade === '2'
              ? '2'
              : scenario.value.volatilityGrade === '1'
                ? '1'
                : '0'
      } else {
        scenario.value.exposureLevelCombination = '0'
      }
    } else {
      // 선택되지 않은 경우
      scenario.value.exposureLevelCombination = '0'
    }
    scenario.value.exposureCheck = 'T'
  }
  scenario.value.exposureLevelFinal = String(
    Number(scenario.value.exposureLevelCombination) - Number(scenario.value.closedVentilation)
  )

  // 유해성 측정
  if (scenario.value.cmrFlag === 'Y') {
    // 1. CMR 물질 여부
    scenario.value.toxic = '4'
    // scenario.value.maleficenceForm = null
    // scenario.value.maleficenceValue = null
    // scenario.value.hrCodeGrade = null
    scenario.value.harmfulCheck = 'F'
  } else if (scenario.value.maleficenceValue && scenario.value.maleficenceForm) {
    // 2. 발생형태에 따른 측정값 체크
    /**
     * 노출값 체크
     * 10㎎/㎥(분진) 또는 500ppm(증기)을 초과 여부
     */
    const checkVal =
      scenario.value.maleficenceForm === '분진'
        ? scenario.value.maleficenceValue <= 10
        : scenario.value.maleficenceValue <= 500

    if (checkVal) {
      const toxic = function (maleficenceValue: any, constVal: any) {
        return maleficenceValue <= 0.01 * constVal
          ? '4'
          : maleficenceValue > 0.01 * constVal && maleficenceValue <= 0.1 * constVal
            ? '3'
            : maleficenceValue > 0.1 * constVal && maleficenceValue <= 1 * constVal
              ? '2'
              : '1'
      }
      scenario.value.toxic =
        scenario.value.maleficenceForm === '분진'
          ? toxic(scenario.value.maleficenceValue, 1)
          : toxic(scenario.value.maleficenceValue, 50)
    } else {
      // 초과한 경우 유해위험문구를 체크
      scenario.value.toxic = scenario.value.hrCodeGrade ? scenario.value.hrCodeGrade : '0'
    }
    scenario.value.harmfulCheck = 'S'
  } else {
    // 유해위험문구
    scenario.value.toxic = scenario.value.hrCodeGrade ? scenario.value.hrCodeGrade : '0'
    scenario.value.harmfulCheck = 'T'
  }
  // 위험도 추정
  scenario.value.riskEstimation = String(
    (scenario.value.exposureLevelFinal && !isNaN(scenario.value.exposureLevelFinal)
      ? Number(scenario.value.exposureLevelFinal)
      : 0) *
      (scenario.value.toxic && !isNaN(scenario.value.toxic) ? Number(scenario.value.toxic) : 0)
  )
}
function research() {
  emits('research', 'scenario')
}
function saveScenario() {
  if (validTable(grid.value.columns, props.processData.charmEstimationScenarios)) {
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
function saveScenarioCallback() {
  message.requestSuccess()
  research()
  getList()

  if (props.estimationUpdateBtnData.flag) {
    $http({
      url: resultUpdateUrl.value,
      method: 'PUT',
      data: {
        ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
        processCd: props.processData.processCd
      }
    }).then(() => {
      props.estimationUpdateBtnData.research = uid()
    })
  }
}
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
function saveScenarioUnitCallback() {
  message.requestSuccess()
  research()
  getList()
}
function compareScenario() {
  const width = 1560
  const height = 700
  // 중앙 정렬 위치 계산
  const left = window.screenX + (window.innerWidth - width) / 2
  const top = window.screenY + (window.innerHeight - height) / 2
  const uri = `/ram/compare/compareScenario?ramTechniqueCd=${props.param.ramTechniqueCd}&ramRiskAssessmentPlanId=${props.param.ramRiskAssessmentPlanId}&processCd=${props.processData.processCd}&charmTypeName=estimation`
  winPopup.value = window.open(
    uri,
    'compareBefore',
    `width=${width}, height=${height}, menubar=no, status=no, toolbar=no, left=${left}, top=${top}`
  )
  // window.addEventListener('message', handleMessage) // 새로운 이벤트 리스너 등록
}
;(window as any).receiveDataFromChild = (_data: any) => {
  activeWinProps.value.processCd = _data.processCd
  activeWinProps.value.ramCharmEstimationAssessScenarioId = _data.ramCharmEstimationAssessScenarioId
}
// function handleMessage(event: MessageEvent) {
//   if (!event.data || !event.data.processCd || !event.data.ramCharmEstimationAssessScenarioId) return
//   activeWinProps.value.processCd = event.data.processCd
//   activeWinProps.value.ramCharmEstimationAssessScenarioId =
//     event.data.ramCharmEstimationAssessScenarioId
// }

function setTrClass(_props: any) {
  return _props.row.processCd === activeWinProps.value.processCd &&
    _props.row.compareId === activeWinProps.value.ramCharmEstimationAssessScenarioId
    ? 'bg-purple-2'
    : ''
}
function back() {
  /** 재조회
   * 목적 : 돌아가기전 데이터를 저장 했을 수도 있지만, 입력만 하고 돌아가는 경우를 대비하기 위함 */
  research()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.mainTitle
  color: #ff9800 !important
  font-weight: bolder !important

.check-highLight
  border-width: 3px !important
  border-style: dashed !important
  border-color: #36a8f5 !important
</style>

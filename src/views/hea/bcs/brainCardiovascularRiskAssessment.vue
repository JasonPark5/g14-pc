<template>
  <q-form ref="editForm">
    <c-card class="cardClassDetailForm bcs-user-info-card">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled && isOld"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="survey"
            mappingType="PUT"
            label="업무적합성 평가 실시"
            icon="check"
            @beforeAction="completeSurvey"
            @btnCallback="completeSurveyCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-title-custom>
        <div class="col" style="text-align: center">
          <q-chip dense color="indigo" text-color="white" icon="bookmark" outline square>
            {{
              $language(
                '질병관리본부에서 서울대학교 산학협력단과 연구한 결과를 토대로 구성되었습니다.'
              )
            }}'
          </q-chip>
        </div>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 bcs-user-info">
          {{ $language('근로자') }} : (만 {{ survey.age }}세 {{ survey.sexName }})
          {{ survey.deptName }} / {{ survey.userName
          }}<span style="margin-left: 40px">
            {{ $language('조사일') }} : {{ survey.surveyDate }}</span
          >
        </div>
      </template>
    </c-card>
    <c-card class="cardClassDetailForm bcs-risk-assess-card" :isTitle="false">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div class="widget-chart container-counter">
            <div class="widget-subheading">
              {{ $language('나의 심뇌혈관질환 발생 위험') }}<br />
              {{ survey.age }} 세 {{ survey.sexName }} 평균 대비
            </div>
            <div class="widget-numbers cursor-help">
              <span class="big-counter">{{
                survey.riskAssessment.adjustedCompositeRelativeRisk
              }}</span>
              <span class="big-counter-description"> 배 </span>
              <q-tooltip
                class="bg-amber text-black"
                style="font-size: 14px; font-weight: 600"
                :offset="[10, 0]"
              >
                <q-icon name="info" />
                {{
                  $language('(개인별 복합 상대위험도) / (나이, 성별에 따른 평균 복합 상대위험도)')
                }}
              </q-tooltip>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 chart">
          <apexchart
            ref="chartHTML"
            height="130"
            type="bar"
            :options="chart.options"
            :series="chart.series"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div class="widget-chart container-counter">
            <div class="widget-subheading">{{ $language('심뇌혈관 나이') }}<br /></div>
            <div class="widget-numbers cursor-help">
              <span class="big-counter">{{ survey.riskAssessment.cardiovascularAge }}</span>
              <span class="big-counter-description"> 세 </span>
            </div>
            <q-tooltip
              class="bg-amber text-black"
              style="font-size: 14px; font-weight: 600"
              :offset="[10, 0]"
            >
              <q-icon name="info" />
              {{ $language('절대위험도의 값이 평균 절대위험도와 가장 가까운 나이') }}
            </q-tooltip>
          </div>
        </div>
      </template>
    </c-card>
    <c-table
      title="나의 건강위험요인 알아보기"
      :columns="grid.columns"
      :data="gridData"
      gridHeightAuto
      hideBottom
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
    />
    <c-card class="cardClassDetailForm bcs-risk-assess-card" :isTitle="false">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-5">
          <div class="widget-chart container-counter no-border">
            <div class="widget-subheading">
              {{ $language('향후 10년 이내에 심뇌혈관질환이 발생할 확률 교정') }}
            </div>
            <div class="widget-numbers">
              <span class="cursor-help">
                <span class="middle-counter">
                  {{ survey.riskAssessment.reducedRiskDevelopDisease }}
                </span>
                <span class="middle-counter-description"> % 감소 </span>
                <q-tooltip
                  class="bg-amber text-black"
                  style="font-size: 14px; font-weight: 600"
                  :offset="[10, 10]"
                >
                  <q-icon name="info" />
                  {{ $language('(발병위험도 - 교정 절대위험도) * 100 / 발병위험도') }}
                </q-tooltip>
              </span>
              <span class="cursor-help">
                <span class="small-counter"> ({{ survey.riskAssessment.riskDevelopDisease }} </span>
                <span class="small-counter-description"> % </span>
                <q-tooltip
                  class="bg-amber text-black"
                  style="font-size: 14px; font-weight: 600"
                  :offset="[10, 10]"
                >
                  <q-icon name="info" />
                  {{
                    $language(
                      '(개인별 복합 상대위험도) / (나이, 성별에 따른 평균 복합 상대위험도) x (나이, 성별에 따른 평균 절대위험도) / (100000, 10만 명 당) * 100'
                    )
                  }}
                </q-tooltip>
              </span>
              <q-icon size="lg" name="arrow_right" style="position: relative; top: -4px" />
              <span class="cursor-help">
                <span class="small-counter">
                  {{ survey.riskAssessment.riskOrthodonticDevelopment }}
                </span>
                <span class="small-counter-description"> % </span>
                <span class="small-counter"> ) </span>
                <q-tooltip
                  class="bg-amber text-black"
                  style="font-size: 14px; font-weight: 600"
                  :offset="[10, 10]"
                >
                  <q-icon name="info" />
                  {{
                    $language(
                      '(교정 복합 상대위험도) / (나이, 성별에 따른 평균 복합 상대위험도) x (나이, 성별에 따른 평균 절대위험도) / (100000, 10만 명 당) * 100'
                    )
                  }}
                </q-tooltip>
              </span>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-5">
          <div class="widget-chart container-counter no-border">
            <div class="widget-subheading">{{ $language('심뇌혈관 나이') }}<br /></div>
            <div class="widget-numbers">
              <span class="cursor-help">
                <span class="middle-counter">
                  {{ survey.riskAssessment.cardiovascularAge }}
                </span>
                <span class="middle-counter-description"> 세 </span>
                <q-tooltip
                  class="bg-amber text-black"
                  style="font-size: 14px; font-weight: 600"
                  :offset="[10, 10]"
                >
                  <q-icon name="info" />
                  {{ $language('절대위험도의 값이 평균 절대위험도와 가장 가까운 나이') }}
                </q-tooltip>
              </span>
              <q-icon size="lg" name="arrow_right" style="position: relative; top: -4px" />
              <span class="cursor-help">
                <span class="middle-counter">
                  {{ survey.riskAssessment.correctedCardiovascularAge }}
                </span>
                <span class="middle-counter-description"> 세 </span>
                <q-tooltip
                  class="bg-amber text-black"
                  style="font-size: 14px; font-weight: 600"
                  :offset="[10, 10]"
                >
                  <q-icon name="info" />
                  {{ $language('교정 절대위험도의 값이 평균 절대위험도와 가장 가까운 나이') }}
                </q-tooltip>
              </span>
            </div>
          </div>
        </div>
      </template>
    </c-card>
  </q-form>
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
import { brainSurveyType } from './brainSurvey'
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'brainCardiovascularRiskAssessment'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaBrainCardiovascularSurveyId?: stringNull
  }
  survey?: brainSurveyType
  evalItems?: Array<any>
  evalItemClasses?: Array<any>
  riskPredictions?: Array<any>
  isOld?: boolean
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      heaBrainCardiovascularSurveyId: ''
    }
  },
  survey: () => {
    return {
      heaBrainCardiovascularSurveyId: '', // 뇌심혈관계 종합조사표 일련번호
      heaBrainCardiovascularStepCd: '', // 진행상태
      userId: '', // 근로자ID
      userName: '', // 근로자명
      deptCd: '', // 부서코드
      deptName: '', // 부서명
      age: 0, // 나이
      sexCd: '', // 성별
      sexName: '', // 성별
      birthDate: '', // 생년월일
      surveyDate: '', // 평가일
      waistCircumference: '', // 위험도_허리둘레
      bmi: '', // 위험도_체질량 지수
      bloodPressure: '', // 위험도_혈압
      hypertensionMedication: '', // 위험도_고혈압 약 복용
      fastingBloodSugar: '', // 위험도_공복 혈당
      diabetesMedication: '', // 위험도_당뇨병 약 복용
      totalCholesterol: '', // 위험도_총콜레스테롤
      egfr: '', // 위험도_eGFR
      dipstickProteinuria: '', // 위험도_Dipstick proteinuria 단백뇨
      smoking: '', // 위험도_흡연상태
      physicallyActiveStatus: '', // 위험도_신체 활동 여부
      regUserId: '', //
      chgUserId: '', //
      results: [], // 유해요인 평가결과 목록
      riskAssessment: {
        heaBrainCardiovascularRiskAssessmentId: '', // 뇌심혈관계 위험평가 일련번호
        heaBrainCardiovascularSurveyId: '', // 뇌심혈관계 일련번호
        adjustedCompositeRelativeRisk: '', // 조정 복합 상대위험도
        riskDevelopDisease: '', // 발병위험도(10년)
        avgRiskDevelopDisease: '', // 평균발병위험도(10년)
        riskOrthodonticDevelopment: '', // 교정발병위험도(10년)
        reducedRiskDevelopDisease: '', // 발병위험도 감소치
        cardiovascularAge: '', // 심뇌혈관 나이
        correctedCardiovascularAge: '', // 교정 심뇌혈관 나이
        integratedRiskClassificationCriteria: '', // 통합형 위험도 분류기준
        /** 기타 정보 */
        complexRelativeRisk: '', // 개인별 복합 상대위험도
        correctionCompositeRelativeRisk: '', // 개인별 교정 복합 상대위험도
        regUserId: '', //
        chgUserId: '' //
      }, // 위험평가
      suitEval: {
        heaBrainCardiovascularWorkSuitEvalId: '', // 뇌심혈관계 업무적합성 일련번호
        heaBrainCardiovascularSurveyId: '', // 뇌심혈관계 일련번호
        userId: '', // 근로자ID (종합조사표 값)
        userName: '', // 근로자명 (종합조사표 값)
        deptCd: '', // 부서코드 (종합조사표 값)
        deptName: '', // 부서명 (종합조사표 값)
        tasksPerformed: '', // 수행업무
        diseaseReview: '', // 임상증상 / 동반질환 검토의견
        habitsReview: '', // 생활습관 / 검사항목 검토의견
        businessFactorsReview: '', // 업무적요인 검토의견
        generalOpinionCd: '', // 종합의견 - 결과
        generalOpinion: '', // 종합의견 - 적합 이외인 경우 기술
        heaManagerId: '', // 보건담당자 OR 의사
        regUserId: '', //
        chgUserId: '' //
      } // 업무적합성 평가서
    }
  },
  evalItems: () => [],
  evalItemClasses: () => [],
  riskPredictions: () => [],
  isOld: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      name: 'riskFactors',
      field: 'riskFactors',
      label: '건강위험요인',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    },
    {
      name: 'riskFactorsResultView',
      field: 'riskFactorsResultView',
      label: '현재상태',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    },
    {
      name: 'riskFactorsGoalResult',
      field: 'riskFactorsGoalResult',
      label: '목표상태',
      align: 'left',
      sortable: false,
      style: 'width:250px'
    },
    {
      name: 'healthConditionName',
      field: 'healthConditionName',
      label: '건강신호등',
      align: 'center',
      sortable: false,
      style: 'width:130px'
    }
  ],
  data: []
})
const editable = ref(true)
const isComplete = ref(false)
const completeUrl = ref('')
const chartHTML = ref<any>(null)
const chart = ref<apexChartType>({
  options: {
    title: { text: '향후 10년 이내에 심뇌혈관질환이 발생할 확률' },
    chart: {
      type: 'bar'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: [
        `${props.survey.userName} 님`,
        `${props.survey.age}세 ${props.survey.sexName} 평균`
      ]
    }
  },
  series: [
    {
      data: [
        props.survey.riskAssessment!.riskDevelopDisease,
        props.survey.riskAssessment!.avgRiskDevelopDisease
      ]
    }
  ],
  chartWidth: '80%'
})

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () => props.isOld && props.survey.heaBrainCardiovascularStepCd !== 'HBCS000005'
)
const gridData = computed(() => {
  const _data = [] as Array<any>
  const evalItems = _.filter(props.evalItems, { riskAssessFlag: 'Y' })
  if (evalItems!.length > 0) {
    _.forEach(evalItems, (evalItem) => {
      const checkData = _.find(props.survey.results, {
        heaBrainCardiovascularEvalItemId: evalItem.heaBrainCardiovascularEvalItemId
      })
      if (checkData) _data.push(checkData)
    })
  }
  return _data
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
  completeUrl.value = transactionConfig.hea.bcs.workSuitEval.step.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 완료처리
 *******************************/
function completeSurvey() {
  message.confirm({
    title: '확인',
    message: '업무적합성 평가를 실시하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      props.survey.chgUserId = user.value.userId
      isComplete.value = !isComplete.value
    },
    cancelCallback: () => {}
  })
}
function completeSurveyCallback() {
  message.requestSuccess()
  emits('getDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

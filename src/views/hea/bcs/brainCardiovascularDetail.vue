<template>
  <div>
    <c-tab
      type="horizon"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :popupParam="popupParam"
          :survey="survey"
          :evalItems="evalItems"
          :evalItemClasses="evalItemClasses"
          :riskPredictions="riskPredictions"
          :contentHeight="contentHeight"
          :isOld="isOld"
          @getDetail="getDetail"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
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
import { brainSurveyType } from './brainSurvey'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'brainCardiovascularDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  contentHeight?: stringNull
  popupParam: {
    heaBrainCardiovascularSurveyId?: stringNull
    isEvalHistory?: boolean
    /** 상황 : 사후관리(탭) > 뇌심혈관계 평가 이력 링크 타고 들어온 경우
     * 목적 : tab의 위치를 위험평가로 고정
     */
  }
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
      heaBrainCardiovascularSurveyId: '',
      isEvalHistory: false
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
const tab = ref('info') //처음 화면에 보여질 tab을 표시하는 부분
const survey = ref<brainSurveyType>({
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
})
const editable = ref(true)
const detailUrl = ref('')
const evalItemListUrl = ref('')
const riskPredictionListUrl = ref('')
const evalItems = ref<Array<any>>([])
const evalItemClasses = ref<Array<any>>([])
const riskPredictions = ref<Array<any>>([])
const checkboxItems = ref([
  'BCWI000010',
  'BCWI000012',
  'BCWI000017',
  'BCWI000018',
  'BCWI000019',
  'BCWI000020',
  'BCWI000021',
  'BCWI000022'
])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 8 + 'px' : '620px'
)
const isOld = computed(() => Boolean(props.popupParam.heaBrainCardiovascularSurveyId))
const tabItems = computed(() => {
  let _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'edit',
      label: '종합조사표',
      component: defineAsyncComponent(() => import(`./brainCardiovascularInfo.vue`))
    }
  ]
  // HBCS000001	종합조사표 작성중
  // HBCS000005	위험평가 확인중
  // HBCS000010	업무적합성 평가서 작성중
  // HBCS000015	사후관리
  if (survey.value.heaBrainCardiovascularStepCd === 'HBCS000005') {
    _items = _.concat(_items, [
      {
        name: 'riskAssessment',
        icon: 'build',
        label: '위험평가',
        component: defineAsyncComponent(() => import(`./brainCardiovascularRiskAssessment.vue`)),
        key: uid()
      }
    ])
  } else if (survey.value.heaBrainCardiovascularStepCd === 'HBCS000010') {
    _items = _.concat(_items, [
      {
        name: 'riskAssessment',
        icon: 'build',
        label: '위험평가',
        component: defineAsyncComponent(() => import(`./brainCardiovascularRiskAssessment.vue`)),
        key: uid()
      },
      {
        name: 'suitEval',
        icon: 'build',
        label: '업무적합성 평가서',
        component: defineAsyncComponent(() => import(`./brainCardiovascularSuitEval.vue`)),
        key: uid()
      }
    ])
  } else if (survey.value.heaBrainCardiovascularStepCd === 'HBCS000015') {
    _items = _.concat(_items, [
      {
        name: 'riskAssessment',
        icon: 'build',
        label: '위험평가',
        component: defineAsyncComponent(() => import(`./brainCardiovascularRiskAssessment.vue`)),
        key: uid()
      },
      {
        name: 'suitEval',
        icon: 'build',
        label: '업무적합성 평가서',
        component: defineAsyncComponent(() => import(`./brainCardiovascularSuitEval.vue`)),
        key: uid()
      },
      {
        name: 'postProcessing',
        icon: 'build',
        label: '사후관리',
        component: defineAsyncComponent(() => import(`./brainCardiovascularPostProcessing.vue`)),
        key: uid()
      }
    ])
  }
  return _items
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
  detailUrl.value = selectConfig.hea.bcs.survey.get.url
  evalItemListUrl.value = selectConfig.hea.bcs.evalItem.list.url
  riskPredictionListUrl.value = selectConfig.hea.bcs.riskPrediction.list.url
  // code setting
  getComboItems('WORK_SUIT_EVAL_ITEM_CLASS_CD').then((_result) => {
    evalItemClasses.value = _result as Array<any>
  })
  // list setting
  getEvalItems()
  getRiskPredictions()
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.heaBrainCardiovascularSurveyId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(survey.value, _result.data)
      if (!props.popupParam.isEvalHistory) {
        if (survey.value.heaBrainCardiovascularStepCd === 'HBCS000001') tab.value = 'info'
        else if (survey.value.heaBrainCardiovascularStepCd === 'HBCS000005')
          tab.value = 'riskAssessment'
        else if (survey.value.heaBrainCardiovascularStepCd === 'HBCS000010') tab.value = 'suitEval'
        else tab.value = 'postProcessing'
      } else tab.value = 'riskAssessment'
    })
  }
}
/******************************
 * TODO (목적): 평가항목 조회
 *******************************/
function getEvalItems() {
  $http({
    url: evalItemListUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    evalItems.value = _result.data
    if (!isOld.value) {
      survey.value.results = _.map(evalItems.value, (evalItem) => {
        return {
          heaBrainCardiovascularEvalResultId: '', // 뇌심혈관계 평가결과 일련번호
          heaBrainCardiovascularSurveyId: '', // 뇌심혈관계 일련번호
          heaBrainCardiovascularEvalItemId: evalItem.heaBrainCardiovascularEvalItemId, // 뇌심혈관계 평가항목 일련번호
          workSuitEvalItemClassCd: evalItem.workSuitEvalItemClassCd, // 위험요인 구분코드
          workSuitEvalItemClassName: evalItem.workSuitEvalItemClassName, // 위험요인 구분코드
          riskFactors: evalItem.riskFactors, // 위험요인
          riskFactorsResult:
            _.indexOf(checkboxItems.value, evalItem.heaBrainCardiovascularEvalItemId) === -1
              ? ''
              : 'N', // 위험요인 평가결과(현재상태)
          riskFactorsGoalResult: '', // 목표상태
          healthConditionCd: '', // 건강신호등
          regUserId: user.value.userId, //
          editFlag: 'C'
        }
      })
    }
  })
}
/******************************
 * TODO (목적): 자식에게서 값 전달받는함수
 *******************************/
function getRiskPredictions() {
  $http({
    url: riskPredictionListUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    riskPredictions.value = _result.data
  })
}
function closePopup(_data: any) {
  emits('closePopup', _data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

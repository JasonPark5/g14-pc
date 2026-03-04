<template>
  <q-form ref="editForm">
    <c-card class="cardClassDetailForm" title="상세">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled && isOld"
            label="삭제"
            icon="delete"
            @btnClicked="deleteSurvey"
          />
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="survey"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveSurvey"
            @btnCallback="saveSurveyCallback"
          />
          <c-btn
            v-show="editable && !disabled && isOld"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="survey"
            mappingType="POST"
            label="위험평가 실시"
            icon="check"
            @beforeAction="completeSurvey"
            @btnCallback="completeSurveyCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-field
            :required="true"
            :disabled="disabled || isOld"
            :editable="editable"
            :data="survey"
            deptValue="deptCd"
            type="dept_user"
            label="근로자"
            name="userId"
            v-model:value="survey.userId"
            @dataChange="userChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :disabled="true"
            label="성별 / 만나이 (조사일 기점)"
            name="sexAge"
            v-model:value="sexAge"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-datepicker
            :required="true"
            :disabled="disabled"
            :editable="editable"
            default="today"
            label="조사일"
            name="surveyDate"
            v-model:value="survey.surveyDate"
            @datachange="calculationAge"
          />
        </div>
      </template>
    </c-card>
    <c-table
      class="q-mt-sm brain-cardiovascular-survey"
      ref="table"
      title="증상조사표"
      :columns="grid.columns"
      :data="gridData"
      customDataTr
      gridHeightAuto
      hideHeader
      hideBottom
      isDense
      :isTitle="false"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
    >
      <template v-slot:customDataTr="props">
        <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
          <q-td class="text-center th-td-style th-style" :colspan="12">
            <span> {{ evalItemClass('WSEIC00005') }}</span>
            <div class="etc-info">
              <template v-if="bmi">
                <q-chip color="teal" icon="info" style="font-size: 11px" outline square>{{
                  bmi.riskFactors
                }}</q-chip>
                : {{ bmi.riskFactorsResult }}
              </template>
              <template v-if="eGFR">
                <q-chip
                  color="teal"
                  icon="info"
                  style="font-size: 11px; margin-left: 20px"
                  outline
                  square
                  >{{ eGFR.riskFactors }}</q-chip
                >
                : {{ eGFR.riskFactorsResult }}
              </template>
            </div>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000001')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000002')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000004')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000014')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000013')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000031')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 2" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000005')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="4"
            codeGroupCd="PHYSICALLY_ACTIVE_OPTION_CD"
            type="radio"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000006')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="4"
            codeGroupCd="DRINK_CD"
            type="radio"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000007')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="4"
            codeGroupCd="SMOKE_CD"
            type="radio"
            @datachange="datachange"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 3" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000008')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000009')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000010')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000011')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000012')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
            @datachange="datachange"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000016')"
            :editable="editable && !disabled"
            :required="true"
            :colspan="2"
            type="number"
            @datachange="datachange"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 4" no-hover>
          <q-td class="text-center th-td-style th-style" :rowspan="1" :colspan="12">
            <span>
              {{ evalItemClass('WSEIC00001') }}
            </span>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 5" no-hover style="line-height: 42px">
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000017')"
            :editable="editable && !disabled"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000018')"
            :editable="editable && !disabled"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000019')"
            :editable="editable && !disabled"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000020')"
            :editable="editable && !disabled"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000021')"
            :editable="editable && !disabled"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000022')"
            :editable="editable && !disabled"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 6" no-hover>
          <q-td class="text-center th-td-style th-style" :rowspan="1" :colspan="12">
            {{ evalItemClass('WSEIC00010') }}
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 7" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000023')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000024')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 8" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000025')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000026')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 9" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000027')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000028')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 10" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000029')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000030')"
            :editable="editable && !disabled"
            :colspan="6"
            type="text"
          />
        </q-tr>
      </template>
    </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'brainCardiovascularInfo'
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
const emits = defineEmits(['closePopup', 'getDetail'])

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
    { name: '1', field: '1', style: 'width:100px' },
    { name: '2', field: '2', style: 'width:150px' },
    { name: '3', field: '3', style: 'width:100px' },
    { name: '4', field: '4', style: 'width:150px' },
    { name: '5', field: '5', style: 'width:100px' },
    { name: '6', field: '6', style: 'width:150px' },
    { name: '7', field: '7', style: 'width:100px' },
    { name: '8', field: '8', style: 'width:150px' },
    { name: '9', field: '9', style: 'width:150px' },
    { name: '10', field: '10', style: 'width:150px' },
    { name: '11', field: '11', style: 'width:150px' },
    { name: '12', field: '12', style: 'width:150px' }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const mappingType = ref('PUT')
const saveUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () => props.isOld && props.survey.heaBrainCardiovascularStepCd !== 'HBCS000001'
)
const sexAge = computed(() => `${props.survey.age} / ${props.survey.sexName}`)
const gridData = computed(() => {
  const _data = []
  for (let idx = 0; idx < 12; idx++) _data.push({})
  return _data
})
const evalItemTd = computed(() =>
  markRaw(defineAsyncComponent(() => import(`@/views/hea/bcs/brainCardiovascularInfoItemTd.vue`)))
)
const bmi = computed(() =>
  _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000003' })
)
const eGFR = computed(() =>
  _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000015' })
)

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
  saveUrl.value = transactionConfig.hea.bcs.survey.insert.url
  deleteUrl.value = transactionConfig.hea.bcs.survey.delete.url
  completeUrl.value = transactionConfig.hea.bcs.riskAssessment.insert.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 근로자 변경시. 건강검진 정보 불러오는 로직은 하지 않음. 대동 프로젝트 진행 후 보건관리자 의견 수렴하여 개발 필요
 *******************************/
function userChange(userId?: stringNull, _user?: any) {
  props.survey.userName = _user.userName
  props.survey.deptCd = _user.deptCd
  props.survey.deptName = _user.deptName
  props.survey.sexCd = _user.sexCd
  props.survey.sexName = _user.sexName
  props.survey.birthDate = _user.birthDate
  calculationAge()
}
/******************************
 * TODO (목적): 근로자 나이 계산
 *******************************/
function calculationAge() {
  if (props.survey.surveyDate && props.survey.birthDate) {
    let age = 0
    // 생일
    const birthDate = new Date(props.survey.birthDate)
    const birthYear = birthDate.getFullYear()
    const birthMonth = birthDate.getMonth()
    const birthDay = birthDate.getDate()
    // 기준일
    const standardData = new Date(props.survey.surveyDate)
    const standardYear = standardData.getFullYear()
    const standardMonth = standardData.getMonth()
    const standardDay = standardData.getDate()

    age = standardYear - birthYear
    if (standardMonth < birthMonth || (standardMonth === birthMonth && birthDay < standardDay)) {
      age--
    }
    props.survey.age = age
  } else props.survey.age = 0
}
/******************************
 * TODO (목적): 평가항목 조회 1
 *******************************/
function evalItemClass(workSuitEvalItemClassCd?: stringNull) {
  let text = ''
  if (props.evalItemClasses && props.evalItemClasses.length > 0) {
    text = _.find(props.evalItemClasses, { code: workSuitEvalItemClassCd }).codeName
  }
  return text
}
/******************************
 * TODO (목적): 평가항목 조회 2
 *******************************/
function getEvalItem(heaBrainCardiovascularEvalItemId?: stringNull) {
  return _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: heaBrainCardiovascularEvalItemId
  })
}
/******************************
 * TODO (목적): 평가항목 응답값 변경시
 *******************************/
function datachange() {
  /**
   * 처리항목
   *  - 위험도 예측 모형을 통한 위험도 산출
   *  - 체질량지수 (BMI) 계산 BCWI000003
   *  - eGFR (MDRD) 계산 BCWI000015
   */
  const height = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000001' })
  const weight = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000002' })
  const bmi = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000003' })
  const creatinineBlood = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000014'
  })
  const eGFR = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000015' })

  // 체질량지수 (BMI) 계산
  if (height.riskFactorsResult && weight.riskFactorsResult) {
    bmi.riskFactorsResult =
      Math.round(
        (Number(weight.riskFactorsResult) / Math.pow(Number(height.riskFactorsResult) / 100, 2)) *
          100
      ) / 100
    if (bmi.eidtFlag !== 'C') {
      bmi.editFlag = 'U'
      bmi.chgUserId = user.value.userId
    }
  }
  // eGFR (MDRD) 계산
  if (creatinineBlood.riskFactorsResult && props.survey.age > 0) {
    const c = props.survey.sexCd === 'M' ? 1 : 0.742 // 상수
    eGFR.riskFactorsResult =
      Math.round(
        186 *
          Math.pow(Number(creatinineBlood.riskFactorsResult), -1.154) *
          Math.pow(props.survey.age, -0.203) *
          c *
          100
      ) / 100
    if (eGFR.eidtFlag !== 'C') {
      eGFR.editFlag = 'U'
      eGFR.chgUserId = user.value.userId
    }
  }
}
/******************************
 * TODO (목적): 위험도 계산 1
 *******************************/
function minusRisk(risk1?: numberNull, risk2?: numberNull) {
  if (!risk2) return risk1 - 1
  else return risk1 > risk2 ? risk1 - 1 : risk2 - 1
}
/******************************
 * TODO (목적): 위험도 계산 2
 *******************************/
function setRisk() {
  /**
   * 처리항목
   *  - 위험도 예측 모형을 통한 위험도 산출
   *  - 체질량지수 (BMI) 계산 BCWI000003
   *  - eGFR (MDRD) 계산 BCWI000015
   *
   * 위험도
   *  - 체질량지수 bmi
   *  - 허리둘레 waistCircumference
   *  - 혈압 bloodPressure
   *  - 고혈압 약 복용 hypertensionMedication
   *  - 공복 혈당 fastingBloodSugar
   *  - 당뇨병 약 복용 diabetesMedication
   *  - 총콜레스테롤 totalCholesterol
   *  - eGFR egfr
   *  - Dipstick proteinuria 단백뇨 dipstickProteinuria
   *  - 흡연상태 smoking
   *  - 신체 활동 여부 physicallyActiveStatus
   *
   * 기타정보
   *  - 개인별 복합 상대위험도
   *  - 개인별 교정 복합 상대위험도
   *
   * 평가기준 & 목표상태
   *  - BMI & 허리둘레
   *  - 혈압
   *  - 공복혈당
   *  - 총콜레스테롤
   *  - 음주
   *  - 흡연
   *  - 신체활동
   */
  const height = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000001' })
  const weight = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000002' })
  const bmi = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000003' })
  const waistCircumference = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000004'
  })
  const physicalActivity = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000005'
  })
  const drinking = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000006' })
  const smoking = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000007' })
  const bloodPressureContraction = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000008'
  })
  const bloodPressureExpansion = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000009'
  })
  const hypertensionMedication = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000010'
  })
  const fastingBloodSugar = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000011'
  })
  const diabetesMedication = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000012'
  })
  const totalCholesterol = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000013'
  })
  const ldlCholesterol = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000031'
  })
  const eGFR = _.find(props.survey.results, { heaBrainCardiovascularEvalItemId: 'BCWI000015' })
  const dipstickProteinuria = _.find(props.survey.results, {
    heaBrainCardiovascularEvalItemId: 'BCWI000016'
  })
  // 체질량지수 위험도
  if (bmi.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000001'
    })
    const riskFactorsResult = Number(bmi.riskFactorsResult)
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (
        riskFactorsResult >= riskPrediction.conditionFrom1 &&
        riskFactorsResult < riskPrediction.conditionTo1
      ) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.bmi = risk
  }
  // 허리둘레 위험도
  if (waistCircumference.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000005'
    })
    const riskFactorsResult = Number(waistCircumference.riskFactorsResult)
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (
        props.survey.sexCd === 'M' &&
        riskFactorsResult >= riskPrediction.conditionFrom1 &&
        riskFactorsResult < riskPrediction.conditionTo1
      ) {
        risk = riskPrediction.riskMale
        return false
      } else if (
        props.survey.sexCd === 'F' &&
        riskFactorsResult >= riskPrediction.conditionFrom1 &&
        riskFactorsResult < riskPrediction.conditionTo1
      ) {
        risk = riskPrediction.riskFemale
        return false
      }
    })
    props.survey.waistCircumference = risk
  }
  // 흡연 위험도
  if (smoking.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000010'
    })
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (smoking.riskFactorsResult === riskPrediction.conditionText) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.smoking = risk
  }
  // 혈압 위험도
  if (bloodPressureContraction.riskFactorsResult && bloodPressureExpansion.riskFactorsResult) {
    const riskPredictions = _.reverse(
      _.filter(props.riskPredictions, { heaRiskPredictionModelCd: 'RPM0000015' })
    )
    const riskFactorsResult1 = Number(bloodPressureContraction.riskFactorsResult)
    const riskFactorsResult2 = Number(bloodPressureExpansion.riskFactorsResult)
    let risk = null
    let idx = 0
    _.forEach(riskPredictions, (riskPrediction) => {
      if (idx === 3) {
        if (
          riskFactorsResult1 < riskPrediction.conditionTo1 &&
          riskFactorsResult2 < riskPrediction.conditionTo2
        ) {
          risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
          return false
        }
      } else if (idx === 0) {
        if (
          riskFactorsResult1 >= riskPrediction.conditionFrom1 &&
          riskFactorsResult2 >= riskPrediction.conditionFrom2
        ) {
          risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
          return false
        }
      } else {
        if (
          (riskFactorsResult1 >= riskPrediction.conditionFrom1 &&
            riskFactorsResult1 < riskPrediction.conditionTo1) ||
          (riskFactorsResult2 >= riskPrediction.conditionFrom2 &&
            riskFactorsResult2 < riskPrediction.conditionTo2)
        ) {
          risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
          return false
        }
      }
      idx++
    })
    props.survey.bloodPressure = risk
  }
  // 혈압약 위험도
  if (hypertensionMedication.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000020'
    })
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (hypertensionMedication.riskFactorsResult === riskPrediction.conditionText) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.hypertensionMedication = risk
  }
  // 신체 활동 위험도
  if (physicalActivity.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000025'
    })
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (
        (physicalActivity.riskFactorsResult === 'PAO0000010' ||
          physicalActivity.riskFactorsResult === 'PAO0000015') &&
        riskPrediction.conditionFrom1 === 3
      ) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      } else if (
        physicalActivity.riskFactorsResult !== 'PAO0000010' &&
        physicalActivity.riskFactorsResult !== 'PAO0000015' &&
        riskPrediction.conditionTo1 === 3
      ) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.physicallyActiveStatus = risk
  }
  // 공복 혈당 위험도
  if (fastingBloodSugar.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000030'
    })
    const riskFactorsResult = Number(fastingBloodSugar.riskFactorsResult)
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (
        riskFactorsResult >= riskPrediction.conditionFrom1 &&
        riskFactorsResult < riskPrediction.conditionTo1
      ) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.fastingBloodSugar = risk
  }
  // 당뇨병 약 복용 위험도
  if (diabetesMedication.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000035'
    })
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (diabetesMedication.riskFactorsResult === riskPrediction.conditionText) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.diabetesMedication = risk
  }
  // 총콜레스테롤 위험도
  if (totalCholesterol.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000040'
    })
    const riskFactorsResult = Number(totalCholesterol.riskFactorsResult)
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (
        riskFactorsResult >= riskPrediction.conditionFrom1 &&
        riskFactorsResult < riskPrediction.conditionTo1
      ) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.totalCholesterol = risk
  }
  // eGFR 위험도
  if (eGFR.riskFactorsResult) {
    const riskPredictions = _.filter(props.riskPredictions, {
      heaRiskPredictionModelCd: 'RPM0000045'
    })
    const riskFactorsResult = Number(eGFR.riskFactorsResult)
    let risk = null
    _.forEach(riskPredictions, (riskPrediction) => {
      if (
        riskFactorsResult >= riskPrediction.conditionFrom1 &&
        riskFactorsResult < riskPrediction.conditionTo1
      ) {
        risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
        return false
      }
    })
    props.survey.egfr = risk
  }
  // Dipstick proteinuria 단백뇨 위험도
  const riskPredictions = _.filter(props.riskPredictions, {
    heaRiskPredictionModelCd: 'RPM0000050'
  })
  const riskFactorsResult = dipstickProteinuria.riskFactorsResult
    ? Number(dipstickProteinuria.riskFactorsResult)
    : 0
  let risk = null
  _.forEach(riskPredictions, (riskPrediction) => {
    if (
      riskFactorsResult >= riskPrediction.conditionFrom1 &&
      riskFactorsResult < riskPrediction.conditionTo1
    ) {
      risk = props.survey.sexCd === 'M' ? riskPrediction.riskMale : riskPrediction.riskFemale
      return false
    }
  })
  props.survey.dipstickProteinuria = risk
  if (!props.survey.riskAssessment) {
    props.survey.riskAssessment = {
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
    }
  }
  // 개인별 복합 상대위험도
  if (
    props.survey.waistCircumference > 0 &&
    props.survey.bmi > 0 &&
    props.survey.bloodPressure > 0 &&
    props.survey.hypertensionMedication > 0 &&
    props.survey.fastingBloodSugar > 0 &&
    props.survey.diabetesMedication > 0 &&
    props.survey.totalCholesterol > 0 &&
    props.survey.egfr > 0 &&
    props.survey.dipstickProteinuria > 0 &&
    props.survey.smoking > 0 &&
    props.survey.physicallyActiveStatus > 0
  ) {
    const risk =
      1 +
      minusRisk(props.survey.waistCircumference, props.survey.bmi) +
      minusRisk(props.survey.bloodPressure) +
      minusRisk(props.survey.hypertensionMedication) +
      minusRisk(props.survey.fastingBloodSugar) +
      minusRisk(props.survey.diabetesMedication) +
      minusRisk(props.survey.totalCholesterol) +
      minusRisk(props.survey.egfr, props.survey.dipstickProteinuria) +
      minusRisk(props.survey.smoking) +
      minusRisk(props.survey.physicallyActiveStatus)
    props.survey.riskAssessment.complexRelativeRisk = risk
  }
  // 개인별 교정 복합 상대위험도
  if (
    props.survey.smoking > 0 &&
    props.survey.hypertensionMedication > 0 &&
    props.survey.diabetesMedication > 0 &&
    props.survey.egfr > 0 &&
    props.survey.dipstickProteinuria > 0
  ) {
    const risk =
      1 +
      minusRisk(props.survey.hypertensionMedication) +
      minusRisk(props.survey.diabetesMedication) +
      minusRisk(props.survey.egfr, props.survey.dipstickProteinuria) +
      minusRisk(props.survey.smoking)
    props.survey.riskAssessment.correctionCompositeRelativeRisk = risk
  }
  // 평가기준 및 목표 제시
  if (height.riskFactorsResult && bmi.riskFactorsResult && props.survey.waistCircumference) {
    const heightRisk = Number(height.riskFactorsResult)
    const bmiRisk = Number(bmi.riskFactorsResult)
    const waistRisk = Number(props.survey.waistCircumference)
    if (bmiRisk >= 18.5 && bmiRisk < 23 && waistRisk === 1) {
      weight.healthConditionCd = 'HC00000001'
      waistCircumference.healthConditionCd = 'HC00000001'
    } else if ((bmiRisk >= 25 && bmiRisk < 30 && waistRisk !== 1) || bmiRisk >= 30) {
      weight.healthConditionCd = 'HC00000010'
      waistCircumference.healthConditionCd = 'HC00000010'
    } else {
      weight.healthConditionCd = 'HC00000005'
      waistCircumference.healthConditionCd = 'HC00000005'
    }
    weight.riskFactorsGoalResult =
      Math.round(Math.pow(heightRisk / 100, 2) * 23 * 100) / 100 + 'kg, BMI 23기준 정상체중'
    waistCircumference.riskFactorsGoalResult = '남성 90cm 미만 / 여성 85cm 미만'
  }

  if (bloodPressureContraction.riskFactorsResult && props.survey.hypertensionMedication) {
    const hypertensionMedicationRisk = Number(props.survey.hypertensionMedication)
    const riskFactorsResult1 = Number(bloodPressureContraction.riskFactorsResult)
    const riskFactorsResult2 = Number(bloodPressureExpansion.riskFactorsResult)
    if (hypertensionMedicationRisk === 1) {
      if (riskFactorsResult1 < 140 && riskFactorsResult2 < 90) {
        bloodPressureContraction.healthConditionCd = 'HC00000005'
        bloodPressureExpansion.healthConditionCd = 'HC00000005'
      } else {
        bloodPressureContraction.healthConditionCd = 'HC00000010'
        bloodPressureExpansion.healthConditionCd = 'HC00000010'
      }
    } else {
      if (riskFactorsResult1 < 120 && riskFactorsResult2 < 80) {
        bloodPressureContraction.healthConditionCd = 'HC00000001'
        bloodPressureExpansion.healthConditionCd = 'HC00000001'
      } else if (
        (riskFactorsResult1 < 140 && riskFactorsResult1 >= 120) ||
        (riskFactorsResult2 < 90 && riskFactorsResult2 >= 80)
      ) {
        bloodPressureContraction.healthConditionCd = 'HC00000005'
        bloodPressureExpansion.healthConditionCd = 'HC00000005'
      } else {
        bloodPressureContraction.healthConditionCd = 'HC00000010'
        bloodPressureExpansion.healthConditionCd = 'HC00000010'
      }
    }
    bloodPressureContraction.riskFactorsGoalResult = '120/80mmHg 미만'
    bloodPressureExpansion.riskFactorsGoalResult = '120/80mmHg 미만'
  }

  if (fastingBloodSugar.riskFactorsResult && props.survey.diabetesMedication) {
    const diabetesMedicationRisk = Number(props.survey.diabetesMedication)
    const riskFactorsResult = Number(fastingBloodSugar.riskFactorsResult)
    if (diabetesMedicationRisk === 1) {
      if (riskFactorsResult < 126) {
        fastingBloodSugar.healthConditionCd = 'HC00000005'
      } else fastingBloodSugar.healthConditionCd = 'HC00000010'
    } else {
      if (riskFactorsResult < 100) {
        fastingBloodSugar.healthConditionCd = 'HC00000001'
      } else if (riskFactorsResult < 126 && riskFactorsResult >= 100) {
        fastingBloodSugar.healthConditionCd = 'HC00000005'
      } else fastingBloodSugar.healthConditionCd = 'HC00000010'
    }
    fastingBloodSugar.riskFactorsGoalResult = '100mg/dL 미만'
  }

  if (
    totalCholesterol.riskFactorsResult &&
    ldlCholesterol.riskFactorsResult &&
    props.survey.diabetesMedication
  ) {
    const totalRisk = Number(totalCholesterol.riskFactorsResult)
    const ldlRisk = Number(ldlCholesterol.riskFactorsResult)
    const diabetesMedicationRisk = Number(props.survey.diabetesMedication)
    if (totalRisk < 200) {
      if (
        (diabetesMedicationRisk === 1 && ldlRisk < 130) ||
        (diabetesMedicationRisk !== 1 && ldlRisk < 100)
      ) {
        totalCholesterol.healthConditionCd = 'HC00000001'
      } else if (
        (diabetesMedicationRisk === 1 && ldlRisk >= 160) ||
        (diabetesMedicationRisk !== 1 && ldlRisk >= 100)
      ) {
        totalCholesterol.healthConditionCd = 'HC00000010'
      } else {
        totalCholesterol.healthConditionCd = 'HC00000005'
      }
    } else {
      if (
        (diabetesMedicationRisk === 1 && ldlRisk < 160) ||
        (diabetesMedicationRisk !== 1 && ldlRisk < 100)
      ) {
        totalCholesterol.healthConditionCd = 'HC00000005'
      } else if (
        (diabetesMedicationRisk === 1 && ldlRisk >= 160) ||
        (diabetesMedicationRisk !== 1 && ldlRisk >= 100)
      ) {
        totalCholesterol.healthConditionCd = 'HC00000010'
      }
    }
    totalCholesterol.riskFactorsGoalResult = `총콜레스테롤 : 200mg/dL 미만\nLDL콜레스테롤 : 130mg/dL 미만 (당뇨병 환자 100mg/dL 미만)`
  }

  if (drinking.riskFactorsResult && props.survey.sexCd && props.survey.age) {
    if (props.survey.sexCd === 'M') {
      if (props.survey.age < 65) {
        if (
          drinking.riskFactorsResult === 'DC00000015' ||
          drinking.riskFactorsResult === 'DC00000020'
        ) {
          drinking.healthConditionCd = 'HC00000005'
        } else if (drinking.riskFactorsResult === 'DC00000025')
          drinking.healthConditionCd = 'HC00000010'
        else drinking.healthConditionCd = 'HC00000001'
      } else {
        if (
          drinking.riskFactorsResult === 'DC00000001' ||
          drinking.riskFactorsResult === 'DC00000005'
        ) {
          drinking.healthConditionCd = 'HC00000001'
        } else if (
          drinking.riskFactorsResult === 'DC00000020' ||
          drinking.riskFactorsResult === 'DC00000025'
        ) {
          drinking.healthConditionCd = 'HC00000010'
        } else drinking.healthConditionCd = 'HC00000005'
      }
    } else {
      if (props.survey.age < 65) {
        if (
          drinking.riskFactorsResult === 'DC00000001' ||
          drinking.riskFactorsResult === 'DC00000005'
        ) {
          drinking.healthConditionCd = 'HC00000001'
        } else if (
          drinking.riskFactorsResult === 'DC00000020' ||
          drinking.riskFactorsResult === 'DC00000025'
        ) {
          drinking.healthConditionCd = 'HC00000010'
        } else drinking.healthConditionCd = 'HC00000005'
      } else {
        if (
          drinking.riskFactorsResult === 'DC00000001' ||
          drinking.riskFactorsResult === 'DC00000005'
        ) {
          drinking.healthConditionCd = 'HC00000001'
        } else drinking.healthConditionCd = 'HC00000010'
      }
    }
    drinking.riskFactorsGoalResult =
      '남성 < 65세 하루 2잔 이하\n남성 >= 65세 하루 1잔 이하\n여성 하루 1잔 이하'
  }
  if (smoking.riskFactorsResult) {
    if (smoking.riskFactorsResult === 'SC00000001') {
      smoking.healthConditionCd = 'HC00000001'
      smoking.riskFactorsGoalResult = '비흡연'
    } else if (smoking.riskFactorsResult === 'SC00000005') {
      smoking.healthConditionCd = 'HC00000005'
      smoking.riskFactorsGoalResult = '금연 유지'
    } else {
      smoking.healthConditionCd = 'HC00000010'
      smoking.riskFactorsGoalResult = '금연'
    }
  }
  if (physicalActivity.riskFactorsResult) {
    if (physicalActivity.riskFactorsResult === 'PAO0000010') {
      physicalActivity.healthConditionCd = 'HC00000005'
    } else if (physicalActivity.riskFactorsResult === 'PAO0000015') {
      physicalActivity.healthConditionCd = 'HC00000001'
    } else physicalActivity.healthConditionCd = 'HC00000010'
    physicalActivity.riskFactorsGoalResult = ''
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveSurvey() {
  mappingType.value = props.isOld ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          setRisk()
          props.survey.regUserId = user.value.userId
          props.survey.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSurveyCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.heaBrainCardiovascularSurveyId = _result.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 완료처리
 *******************************/
/**
 * 1. 개인별 복합 상대위험도가 계산되었는지?
 * 2. 개인별 교정 복합 상대위험도가 계산되었는지?
 */
function completeSurvey() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '위험평가를 실시하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          setRisk()
          if (!props.survey.riskAssessment!.complexRelativeRisk) {
            message.alert({
              title: '안내',
              message: '개인별 복합 상대위험도가 산출되지 않았습니다.\n입력항목을 확인해주세요.',
              type: 'warning' // success / info / warning / error
            })
          } else if (!props.survey.riskAssessment!.correctionCompositeRelativeRisk) {
            message.alert({
              title: '안내',
              message:
                '개인별 교정 복합 상대위험도가 산출되지 않았습니다.\n입력항목을 확인해주세요.',
              type: 'warning' // success / info / warning / error
            })
          }
          props.survey.regUserId = user.value.userId
          props.survey.chgUserId = user.value.userId
          props.survey.riskAssessment!.regUserId = user.value.userId
          props.survey.riskAssessment!.chgUserId = user.value.userId
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeSurveyCallback() {
  message.requestSuccess()
  emits('getDetail')
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteSurvey() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.heaBrainCardiovascularSurveyId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

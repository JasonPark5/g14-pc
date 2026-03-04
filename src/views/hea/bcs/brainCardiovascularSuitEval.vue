<template>
  <q-form ref="editForm">
    <c-card class="cardClassDetailForm bcs-user-info-card" :isTitle="false">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 bcs-user-info">
          근로자 : (만 {{ survey.age }}세 {{ survey.sexName }}) {{ survey.deptName }} /
          {{ survey.userName }}
          <span style="margin-left: 40px">조사일 : {{ survey.surveyDate }}</span>
        </div>
      </template>
    </c-card>
    <c-card class="cardClassDetailForm" title="검토의견">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="survey"
            mappingType="PUT"
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
            mappingType="PUT"
            label="사후관리"
            icon="check"
            @beforeAction="completeSurvey"
            @btnCallback="completeSurveyCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            required
            :disabled="disabled"
            :editable="editable"
            type="edit"
            codeGroupCd="GENERAL_OPINION_CD"
            itemText="codeName"
            itemValue="code"
            label="종합의견 결과"
            name="generalOpinionCd"
            v-model:value="survey.suitEval.generalOpinionCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-field
            required
            :disabled="disabled"
            :editable="editable"
            :data="survey"
            deptValue="deptCd"
            type="dept_user"
            label="보건담당자"
            name="heaManagerId"
            v-model:value="survey.suitEval.heaManagerId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="수행업무"
            name="tasksPerformed"
            v-model:value="survey.suitEval.tasksPerformed"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="생활습관 / 검사항목 검토의견"
            name="habitsReview"
            v-model:value="survey.suitEval.habitsReview"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="임상증상 / 동반질환 검토의견"
            name="diseaseReview"
            v-model:value="survey.suitEval.diseaseReview"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="업무적요인 검토의견"
            name="businessFactorsReview"
            v-model:value="survey.suitEval.businessFactorsReview"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :disabled="disabled"
            :editable="editable"
            label="종합의견"
            name="generalOpinion"
            v-model:value="survey.suitEval.generalOpinion"
          />
        </div>
      </template>
    </c-card>
    <c-table
      class="q-mt-sm brain-cardiovascular-survey"
      title="증사조사표"
      ref="table"
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
          <q-td class="text-center th-td-style th-style" :rowspan="1" :colspan="12">
            <span>
              {{ evalItemClass('WSEIC00005') }}
            </span>
            <div class="etc-info">
              <template v-if="bmi">
                <q-chip color="teal" icon="info" style="font-size: 11px" outline square>
                  {{ bmi.riskFactors }}
                </q-chip>
                : {{ bmi.riskFactorsResult }}
              </template>
              <template v-if="eGFR">
                <q-chip
                  color="teal"
                  icon="info"
                  style="font-size: 11px; margin-left: 20px"
                  outline
                  square
                >
                  {{ eGFR.riskFactors }}
                </q-chip>
                : {{ eGFR.riskFactorsResult }}
              </template>
            </div>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000001')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000002')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000004')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000014')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000013')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000031')"
            :editable="false"
            :colspan="2"
            type="number"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 2" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000005')"
            :editable="false"
            :colspan="4"
            codeGroupCd="PHYSICALLY_ACTIVE_OPTION_CD"
            type="radio"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000006')"
            :editable="false"
            :colspan="4"
            codeGroupCd="DRINK_CD"
            type="radio"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000007')"
            :editable="false"
            :colspan="4"
            codeGroupCd="SMOKE_CD"
            type="radio"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 3" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000008')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000009')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000010')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000011')"
            :editable="false"
            :colspan="2"
            type="number"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000012')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000016')"
            :editable="false"
            :colspan="2"
            type="number"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 4" no-hover>
          <q-td class="text-center th-td-style th-style" :rowspan="1" :colspan="12">
            <span>
              {{ evalItemClass('WSEIC00001') }}
            </span>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 5" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000017')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000018')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000019')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000020')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000021')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000022')"
            :editable="false"
            :colspan="2"
            trueLabel="복용"
            falseLabel="미복용"
            type="check"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 6" no-hover>
          <q-td class="text-center th-td-style th-style" :rowspan="1" :colspan="12">
            <span>
              {{ evalItemClass('WSEIC00010') }}
            </span>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 7" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000023')"
            :editable="false"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000024')"
            :editable="false"
            :colspan="6"
            type="text"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 8" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000025')"
            :editable="false"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000026')"
            :editable="false"
            :colspan="6"
            type="text"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 9" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000027')"
            :editable="false"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000028')"
            :editable="false"
            :colspan="6"
            type="text"
          />
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 10" no-hover>
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000029')"
            :editable="false"
            :colspan="6"
            type="text"
          />
          <component
            :is="evalItemTd"
            :result="getEvalItem('BCWI000030')"
            :editable="false"
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
  name: 'brainCardiovascularSuitEval'
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
const isSave = ref(true)
const isComplete = ref(true)
const saveUrl = ref('')
const completeUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () => props.isOld && props.survey.heaBrainCardiovascularStepCd !== 'HBCS000010'
)
const gridData = computed(() => {
  const _data = []
  for (let idx = 0; idx < 15; idx++) _data.push({})
  return _data
})
const evalItemTd = computed(() =>
  markRaw(defineAsyncComponent(() => import(`@views/hea/bcs/brainCardiovascularInfoItemTd.vue`)))
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
  saveUrl.value = transactionConfig.hea.bcs.workSuitEval.update.url
  completeUrl.value = transactionConfig.hea.bcs.postProcessing.step.url
  // code setting
  // list setting
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
 * TODO (목적): 저장
 *******************************/
function saveSurvey() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
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
function completeSurvey() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '사후관리를 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.survey.suitEval!.regUserId = user.value.userId
          props.survey.suitEval!.chgUserId = user.value.userId
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

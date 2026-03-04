<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <c-card class="cardClassDetailForm bcs-user-info-card" :isTitle="false">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 bcs-user-info">
            근로자 : (만 {{ survey.age }}세 {{ survey.sexName }}) {{ survey.deptName }} /
            {{ survey.userName
            }}<span style="margin-left: 40px"> 조사일 : {{ survey.surveyDate }}</span>
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
      <c-table
        title="뇌심혈관계 평가 이력"
        ref="table1"
        :columns="gridEvalHistory.columns"
        :data="gridEvalHistory.data"
        gridHeight="700px"
        :columnSetting="false"
        :isFullScreen="false"
        :isExcelDown="false"
        :filtering="false"
        @linkClick="evalHistoryLinkClick"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
      <c-table
        title="상담 이력"
        ref="table2"
        :columns="gridConsultHistory.columns"
        :data="gridConsultHistory.data"
        :merge="gridConsultHistory.merge"
        gridHeight="700px"
        :columnSetting="false"
        :isFullScreen="false"
        :isExcelDown="false"
        :filtering="false"
        @linkClick="consultHistoryLinkClick"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="consultHistoryLinkClick" />
          </q-btn-group>
        </template>
      </c-table>
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
import { brainSurveyType } from './brainSurvey'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'brainCardiovascularPostProcessing'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

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
const gridEvalHistory = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '근로자',
      align: 'center',
      sortable: false,
      style: 'width:120px',
      type: 'link'
    },
    {
      name: 'sexName',
      field: 'sexName',
      label: '성별',
      align: 'center',
      sortable: false,
      style: 'width:80px'
    },
    {
      name: 'age',
      field: 'age',
      label: '나이(조사시점)',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'surveyDate',
      field: 'surveyDate',
      label: '조사일',
      align: 'center',
      sortable: false,
      style: 'width:120px'
    }
  ],
  data: []
})
const gridConsultHistory = ref<gridType>({
  merge: [
    { index: 0, colName: 'mergeGroup' },
    { index: 1, colName: 'mergeGroup' },
    { index: 2, colName: 'mergeGroup' }
  ],
  columns: [
    {
      name: 'suspectFlagName',
      field: 'suspectFlagName',
      style: 'width: 100px',
      label: '상담자 구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      style: 'width: 100px',
      label: '부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      style: 'width: 100px',
      label: '상담자',
      align: 'center',
      sortable: true
    },
    {
      name: 'consultDate',
      field: 'consultDate',
      label: '상담일',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'consultTypeName',
      field: 'consultTypeName',
      label: '상담구분',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'consultContent',
      field: 'consultContent',
      label: '상담내용',
      align: 'left',
      style: 'width: 220px',
      sortable: false,
      type: 'link'
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const surveyListUrl = ref('')
const consultListUrl = ref('')
const table1 = ref<any>(null)
const table2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

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
  surveyListUrl.value = selectConfig.hea.bcs.survey.list.url
  consultListUrl.value = selectConfig.hea.checkup.suspect.history.consult.url
  // code setting
  // list setting
  getEvalHistoryList()
  getConsultHistoryList()
}
/******************************
 * TODO (목적): 평가이력 목록 조회
 *******************************/
function getEvalHistoryList() {
  $http({
    url: surveyListUrl.value,
    method: 'GET',
    params: { userId: props.survey.userId }
  }).then((_result: any) => {
    gridEvalHistory.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상담이력 목록 조회
 *******************************/
function getConsultHistoryList() {
  $http({
    url: consultListUrl.value,
    method: 'GET',
    params: {
      userId: props.survey.userId,
      heaBrainCardiovascularSurveyId: props.popupParam.heaBrainCardiovascularSurveyId
    }
  }).then((_result: any) => {
    gridConsultHistory.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 링크 클릭시 팝업 (뇌심혈관계)
 *******************************/
function evalHistoryLinkClick(row?: any) {
  popupOptions.value.title = '뇌심혈관계 상세'
  popupOptions.value.param = {
    heaBrainCardiovascularSurveyId: row.heaBrainCardiovascularSurveyId,
    isEvalHistory: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./brainCardiovascularDetail.vue`))
  )
  popupOptions.value.width = '90%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeEvaltHistoryPopup
}
function closeEvaltHistoryPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getEvalHistoryList()
}
/******************************
 * TODO (목적): 링크 클릭시 팝업 (건강상담)
 *******************************/
function consultHistoryLinkClick(row?: any) {
  popupOptions.value.title = '건강상담 상세'
  popupOptions.value.param = {
    suspectConsultId: row ? row.suspectConsultId : '',
    suspectId: row ? row.suspectId : '',
    suspectFlag: row ? row.suspectFlag : 'N',
    suspectUserName: row ? row.deptName + ' / ' + row.userName : '',
    heaBrainCardiovascularSurveyId: row
      ? row.heaBrainCardiovascularSurveyId
      : props.popupParam.heaBrainCardiovascularSurveyId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/hea/chk/consultDetail.vue`))
  )
  popupOptions.value.width = '90%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeConsultHistoryPopup
}
function closeConsultHistoryPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getConsultHistoryList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

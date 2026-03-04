<template>
  <div>
    <c-tab
      type="vertical"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="param"
          :plan="plan"
          :contentHeight="contentHeight"
          :searchParam="searchParam"
          @getDetail="getDetail"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { evalPlanType } from './jobStress'

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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jobStressAssessmentResultDetail'
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
  contentHeight?: stringNull
  param: {
    heaJobStressPlanId: stringNull
    stepCd?: stringNull
    searchProcess?: any | null | undefined
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
  param: () => {
    return {
      heaJobStressPlanId: '',
      stepCd: null,
      searchProcess: {
        flag: '',
        isSearch: false
      }
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
const detailUrl = ref('')
const editable = ref(true)
const tab = ref('status')
const plan = ref<evalPlanType>({
  heaJobStressPlanId: '', // 직무스트레스 계획 일련번호
  plantCd: null, // 사업장
  planYear: '', // 년도
  stepCd: null, // 평가단계
  assessTypeCd: null, // 평가유형
  jobStressPlanName: '', // 평가계획명
  assessmentStartDate: '', // 평가 시작일
  assessmentEndDate: '', // 평가 종료일
  period: [], // 평가기간
  remarks: '', // 비고
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  users: [], // 평가자
  centers: [], // 중앙값
  depts: [],
  imprs: [],
  resultTable: []
})
const searchParam = ref({
  groupByDept: true,
  groupByUpDept: false,
  groupByJobclass: false,
  deptCd: null,
  upDeptCd: null,
  jobClassCd: null,
  heaStressCheckClassCd: null
})
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'status',
    icon: 'assignment_turned_in',
    label: '평가결과',
    component: markRaw(defineAsyncComponent(() => import(`./jobStressAssessmentResultStatus.vue`)))
  },
  {
    name: 'class',
    icon: 'assignment_turned_in',
    label: '평가구분별<br/>평가결과',
    component: markRaw(defineAsyncComponent(() => import(`./jobStressAssessmentResultStatus2.vue`)))
  },
  {
    name: 'bad',
    icon: 'verified',
    label: '관리대상군',
    component: markRaw(
      defineAsyncComponent(() => import(`./jobStressAssessmentResultDeptUser.vue`))
    )
  },
  {
    name: 'impr',
    icon: 'engineering',
    label: '개선',
    component: markRaw(defineAsyncComponent(() => import(`./jobStressAssessmentResultImpr.vue`)))
  }
])
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 810
    ? Number(props.contentHeight) + 'px'
    : '810px'
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
  detailUrl.value = selectConfig.hea.jobStress.plan.status.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, props.param.heaJobStressPlanId),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    plan.value = _result.data
    // 평가결과표
    plan.value.resultTable = []
    _.forEach(plan.value.depts, (dept) => {
      _.forEach(plan.value.centers, (center) => {
        let _score = 0
        switch (center.heaStressCheckClassCd) {
          case 'add_circle': // 추가/신규 amber-7
            break
          case 'HCC0000001': // 물리적환경
            _score = dept.physicalEnv
            break
          case 'HCC0000005': // 직무요구
            _score = dept.jobDemand
            break
          case 'HCC0000010': // 직무자율
            _score = dept.jobAutonomy
            break
          case 'HCC0000015': // 관계갈등
            _score = dept.relationship
            break
          case 'HCC0000020': // 직무 불안정
            _score = dept.jobInsecurity
            break
          case 'HCC0000025': // 조직체계
            _score = dept.organizational
            break
          case 'HCC0000030': // 보상부적절
            _score = dept.inadequate
            break
          case 'HCC0000035': // 직장문화
            _score = dept.workplace
            break
          default:
            break
        }
        plan.value.resultTable!.push({
          deptCd: dept.deptCd,
          deptName: dept.deptName,
          upDeptCd: dept.upDeptCd,
          upDeptNm: dept.upDeptNm,
          jobClassCd: dept.jobClassCd,
          jobClassNm: dept.jobClassNm,
          jobClassCd2: dept.jobClassCd2,
          heaStressCheckClassCd: center.heaStressCheckClassCd,
          heaStressCheckClassName: center.heaStressCheckClassName,
          score: _score,
          companyMale: center.companyMale,
          companyFemale: center.companyFemale,
          company: center.company,
          koreaMale: center.koreaMale,
          koreaFemale: center.koreaFemale,
          korea: center.korea
        })
      })
    })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

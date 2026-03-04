<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ props.title }}</h2>
    </div>
    <div class="row maindashboard-director">
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '위험성평가 현황(KRAS)' }}
          </div>
          <div class="card-body" style="height: 340px !important">
            <component :is="riskGraphComponents" :commonSearchParam="commonSearchParam" />
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents evalcard">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '잔존 위험요인 리스트' }}
          </div>
          <div class="card-body">
            <component :is="riskTableComponents" :commonSearchParam="commonSearchParam" />
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents evalcard">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '안전교육 계획 현황(금년)' }}
          </div>
          <div class="card-body" style="height: 250px !important">
            <component :is="annualEduComponents" :commonSearchParam="commonSearchParam" />
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents evalcard">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '도급업체 평가등급' }}
          </div>
          <div class="card-body" style="height: 250px !important">
            <component :is="vendorEvaluationComponents" :commonSearchParam="commonSearchParam" />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ '부적합 사항 개선 이행율(최근 1년)' }}
          </div>
          <div class="card-body" style="height: 250px !important">
            <component :is="imprComponents" :commonSearchParam="commonSearchParam" />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div class="cardcontents risk">
          <div class="card-header">
            <span class="card-icon">
              <c-svg-icon name="caretCircleRight" height="15px" width="15px" />
            </span>
            {{ $language('조치부서별 조치 건수(1년/상위6개)') }}
          </div>
          <div class="card-body row" style="height: 260px !important">
            <component :is="takenActionDeptImprComponents" :commonSearchParam="commonSearchParam" />
          </div>
        </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'removalReplacement'
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
  title: string
  commonSearchParam: {
    plantCd: stringNull
  }
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
  title: '',
  commonSearchParam: () => {
    return {
      plantCd: null
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
const riskGraphComponents = defineAsyncComponent(() => import(`./riskAssessmentGraphPortlet.vue`))
const riskTableComponents = defineAsyncComponent(() => import(`./riskAssessmentPortlet.vue`))
const annualEduComponents = defineAsyncComponent(() => import(`./annualEducationPortlet.vue`))
const vendorEvaluationComponents = defineAsyncComponent(
  () => import(`./vendorEvaluationPortlet.vue`)
)
const imprComponents = defineAsyncComponent(() => import(`./unsuitableImprPortlet.vue`))
const takenActionDeptImprComponents = defineAsyncComponent(
  () => import(`./takenActionDeptImprPortlet.vue`)
)

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
  // code setting
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

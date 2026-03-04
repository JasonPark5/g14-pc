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
          :key="tab.key"
          :popupParam="popupParam"
          :hazard="hazard"
          :attachInfo="attachInfo"
          :attachResultInfo="attachResultInfo"
          :contentHeight="props.height"
          :disabled="disabled"
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
import { sopType } from './investigation'

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
  name: 'hazardInvestigationDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  height?: stringNull
  disabled?: boolean
  popupParam: {
    heaMuscleSopId: stringNull
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
  height: null,
  disabled: false,
  popupParam: () => {
    return {
      heaMuscleSopId: ''
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
const tab = ref('work')
const hazard = ref<sopType>({
  heaMuscleSopId: '', // 근골격계 단위작업 일련번호
  heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
  heaMuscleSopStepCd: '', // 진행상태
  processCd: '', // 공정코드
  processName: '', // 공정명
  mdmSopId: '', // 안전작업 표준 일련번호
  sopName: '', // 세부공정(작업) 명
  heaInvestigationTypeCd: '', // 조사구분
  investigationDate: '', // 조사일시
  deptCd: '', // 조사자 부서
  userId: '', // 조사자 id
  remark: '', // 비고
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  heavyWorks: [], // 부담작업
  heavyWorkIncludes: [], // 부담작업 결과 O
  heavyWorkHazards: [], // 유해요인
  workers: [], // 작업자
  situations: [], // 상황조사
  results: [], // 결과표
  imprs: [] // 개선
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'HEA_MUSCLE_HAZARD',
  taskKey: ''
})
const attachResultInfo = ref({
  isSubmit: '',
  taskClassCd: 'HEA_MUSCLE_HAZARD_RESULT',
  taskKey: ''
})

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => [
  {
    ket: uid(),
    name: 'work',
    icon: 'construction',
    label: '작업조건 평가',
    component: defineAsyncComponent(() => import(`./investiWork.vue`))
  },
  {
    ket: uid(),
    name: 'hazard',
    icon: 'engineering',
    label: '유해요인<br>조사',
    component: defineAsyncComponent(() => import(`./muscleHazardCheck.vue`))
  },
  // {
  //   name: 'result',
  //   icon: 'task',
  //   label: '작업분석·평가 결과표',
  //   component: defineAsyncComponent(() => import(`./muscleJobResult.vue`))
  // },
  {
    ket: uid(),
    name: 'impr',
    icon: 'auto_fix_high',
    label: '개선관리',
    component: defineAsyncComponent(() => import(`./muscleImprStatus.vue`))
  }
])

const tabHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 80 + 'px' : '680px'
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
  detailUrl.value = selectConfig.hea.muscleSystem.muscleSop.get.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 설문조사 결과 상세조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, props.popupParam.heaMuscleSopId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(hazard.value, _result.data)
    attachInfo.value.taskKey = props.popupParam.heaMuscleSopId
    attachResultInfo.value.taskKey = props.popupParam.heaMuscleSopId
    // 처음으로 유해요인 조사하러 온 케이스 체크
    if (!hazard.value.situations || hazard.value.situations.length === 0) {
      getComboItems('HEA_MUSCLE_SOP_SITUATION_GUBUN_CD').then((_result: any) => {
        hazard.value.situations = []
        _.forEach(_result, (item) => {
          hazard.value.situations?.push({
            heaMuscleSopSituationId: '', // 근골격계 단위작업 상황조사 일련번호
            heaMuscleSopId: props.popupParam.heaMuscleSopId, // 근골격계 단위작업 일련번호
            heaInvestigationPlanId: hazard.value.heaInvestigationPlanId, // 근골격계 조사계획 일련번호
            heaMuscleSopSituationGubunCd: item.code, // 작업장 상황 조사 구분 코드
            heaMuscleSopSituationGubunName: item.codeName, // 작업장 상황 조사 구분 코드
            changeFlag: 'N', // 변화유무
            remark: '', // 내용요약
            regUserId: user.value.userId, // 등록자 id
            editFlag: 'C'
          })
        })
      })
      hazard.value.userId = user.value.userId
      hazard.value.deptCd = user.value.deptCd
    }
  })
}
</script>

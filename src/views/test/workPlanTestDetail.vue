<template>
  <div>
    <c-tab
      type="horizon"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :popupParam="popupParam"
          :sop="sop"
          :rev="rev"
          :isOld="isOld"
          :contentHeight="contentHeight"
          :height="tabHeight"
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sopDetail'
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
    mdmSopId: stringNull
  }
  contentHeight: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      mdmSopId: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const sop = ref<any>({
  mdmSopId: '', // 안전작업 표준 일련번호
  plantCd: null, // 사업장코드
  subProcessCd: '', // 단위공정 코드
  sopNo: '', // 안전작업 표준 번호
  sopName: '지원동 현수막 시공 件', // 세부공정(작업) 명
  accidentKindCd: 'WRF0000004,WRF0000005',
  accidentKindCd2: 'WRF0000002',
  accidentKindCd3: 'SSWT000020',
  revNo: '', // 개정번호
  revReason: '', // 개정사유
  applyRange: '', // 적용범위
  purpose: '', // 목적
  hazardGradeCd: null, // 위험등급 1 ~ 5등급
  workTypeCd: null, // 작업유형 : 특별안전, 일반안전, 단순일상
  workKindCd: null, // 작업형태 : Gas, 고소, 굴착/매설, 방사선, 전기, 지게차, 기타
  workClassCd: null, // 작업구분 : Set-up, PM, BM, Part교체, 기타
  workerName: '', // 작업자
  ramRiskHazardTechniqueCd: null,
  managementDepts: '', // 관리부서 복수
  managementDepts2: '', // 관리부서 복수
  saftyShied: '', // 안전보호구
  saftyCaution: '', // 안전주의사항
  sopMocId: '',
  useFlag: 'Y', // 사용여부
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  regUserId: '',
  chgUserId: '',
  test1: '디스토시드, 울트라란, 크레오신티, 에코론 크림',
  test2: '폭발성, 인화성, 산화성, 고압가스',
  test3: '물리적 위험성 : 고인화성 액체 및 증기, 피부에 자극을 일으킴',
  test4:
    '안전 확보: 자신의 안전을 먼저 확보한 후 환자에게 접근합니다. 119 신고: 응급 상황 발생 시, 가장 먼저 119에 신고합니다.  ',
  test5: 'test',
  test6: '1',
  revSelectValue: null,
  sopSteps: [], // 작업단계 목록
  revs: [], // 개정 목록
  mmEquips: [], // 설비 목록
  mmMachines: [], // 기계기구 목록
  chems: [], // 화학자재 목록
  sopSummary: [], // 요약정보
  sopStepHazards: [] // 작업단계 (w/h. 유해위험요인)
})
const tab = ref('sopInfo')
const rev = ref({
  isRevision: false
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.mdmSopId))
const tabHeight = computed(() => {
  const numHeight = Number(props.contentHeight.replace('px', ''))
  return !isNaN(numHeight) && numHeight > 700 ? numHeight - 1 + 'px' : '700px'
})
const tabItems = computed(() => {
  return [
    {
      name: 'sopInfo',
      icon: 'info',
      label: '작업계획서 수정',
      component: defineAsyncComponent(() => import(`./workPlanTestInfo.vue`)),
      key: uid()
    },
    {
      name: 'additionalInfo',
      icon: 'playlist_add',
      label: '유해위험요인 체크리스트',
      component: defineAsyncComponent(() => import(`./workPlanTestChecklist.vue`)),
      key: uid(),
      disabled: rev.value.isRevision ? true : false
    }
  ]
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
  // code setting
  // list setting
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

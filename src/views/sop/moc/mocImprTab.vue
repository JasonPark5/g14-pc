<template>
  <div>
    <c-tab type="vertical" :tabItems="tabItems" :height="height" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :param="param"
          :moc="moc"
          :disabled="disabled"
          :height="height"
          @saveCallback="saveCallback"
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
import { mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocImprTab'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStroe 호출 */
const userStroe = useUserStore()
const { user, auths } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    sopMocId: stringNull
    mocTypeCd: stringNull
    mocStepCd: stringNull
    changePreStartup: stringNull
  }
  height: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      sopMocId: '',
      mocTypeCd: '',
      mocStepCd: '',
      changePreStartup: ''
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
const tab = ref('review')
const moc = ref<mocType>({
  sopMocId: '', // MOC 일련번호
  mocNo: '', // moc 관리번호
  plantCd: '', // 사업장 코드
  processCd: '', // 공정
  judgmentUserId: '', // 판정자 ID
  judgmentUserName: '', // 판정자 명
  initiativeUserId: '', // 발의자 ID
  initiativeUserName: '', // 발의자 명
  initiativeDeptCd: '', // 발의 부서 코드
  initiativeDeptName: '', // 발의 부서명
  mocTitle: '', // 변경관리 제목
  mocSummary: '', // 변경 개요
  mocTypeCd: 'MT00000001', // 변경구분_공통코드(정상/비상/임시)
  mocWriteLevelCd: null, // 변경등급_작성
  mocConfirmLevelCd: null, // 변경등급_검토
  processSatefySecureMeasures: '', // 공정안전 확보 대책
  technicalBasisProcessDesign: '', // 변경계획에 대한 공정 및 설계의 기술근거
  safetyReliabilityImprovementEffect: '', // 안전성에 필요한 사항 및 신뢰성 향상 효과
  leaderOpinion: '', // 팀장의견
  relatedLaws: '', // 관련 볍령_텍스트
  processRiskAssessFlag: '', // 공정위험성 평가 여부
  jobRiskAssessFlag: '', // 작업위헝성 평가 여부
  mocPeriod: [],
  mocStartDate: '', // 변경 시작일
  mocEndDate: '', // 변경 종료일
  mocStepCd: '', // 변경관리 단계
  mocActionDeptCd: '', // 변경실행 부서코드
  mocActionResponsibilityUserId: '', // 변경실행 책임자 ID
  mocCompleteCheckUserId: '', // 변경완료 확인자 ID
  mocCompleteCheckDeptCd: '', // 변경완료 확인 부서 코드
  mocCompleteOpinion: '', // 변경완료 의견
  mocBenefitCds: '', // 변경관리 기대효과_복수
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  checklists: [],
  checklistEquips: [],
  checklistDrives: [],
  equipments: [],
  reviews: [],
  committees: [],
  committeeReviewItems: [],
  committeeHold: {
    sopMocId: '', // MOC 일련번호
    firstHoldDate: '', // (최초) 개최일
    firstHoldArea: '', // (최초) 개최장소
    firstReviewContents: '', // (최초) 검토내용
    firstReviewResult: '', // (최초) 검토결과
    professionalHoldDate: '', // (전문가) 개최일
    professionalHoldArea: '', // (전문가) 개최장소
    professionalReviewContents: '', // (전문가) 검토내용
    professionalReviewResult: '', // (전문가) 검토결과
    finalHoldDate: '', // (최종) 개최일
    finalHoldArea: '', // (최종) 개최장소
    finalReviewContents: '', // (최종) 검토내용
    finalReviewResult: '', // (최종) 검토결과
    changeApprovalFlag: '', // 변경 승인 여부
    changeApprovalReason: '', // 변경 승인 사유
    changeApprovalDate: '', // 승인일
    changeKeepFlag: '', // 변경유지 여부
    changeKeepReason: '', // 변경유지 사유
    regUserId: '', // 등록자 ID
    chgUserId: '' // 수정자 ID
  },
  relatedWorks: [],
  prestartupImproves: [],
  isPrestartupImproves: 0,
  improves: [],
  imprImmData: [],
  imprData: []
})
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  if (isEnvSafDept.value) {
    return false
  } else {
    // 비상변경에 대해서는 생각하지 않음
    const stepCheck =
      props.param.mocTypeCd === 'MT00000001'
        ? 'MS00000015'
        : props.param.mocTypeCd === 'MT00000005'
          ? 'MT00000020'
          : 'ME00000010'
    return props.param.sopMocId && props.param.mocStepCd !== stepCheck
  }
})
const isEnvSafDept = computed(
  () => _.indexOf(auths.value, 'SAGI000021') > -1 || user.value.empNo === 'admin'
)
const isRecovery = computed(
  () =>
    props.param.mocTypeCd === 'MT00000005' ||
    (props.param.mocTypeCd === 'MT00000010' &&
      moc.value.committeeHold &&
      moc.value.committeeHold.changeKeepFlag === 'N')
)
const tabItems = computed(() => {
  const data: Array<tabItemsType> = [
    // { name: 'committee', icon: 'group_add', label: '변경관리 Punch list', component: () => import(`${'./mocImprTabDetail.vue'}`), key: uid(), },
    {
      name: 'review',
      icon: 'preview',
      label: 'Punch list',
      component: defineAsyncComponent(() => import(`./mocPreStartupImpr.vue`)),
      key: uid()
    }
  ]
  if (isRecovery.value) {
    data.push(
      // 설비 원복
      {
        name: 'recovery',
        icon: 'health_and_safety',
        label: '설비 원복',
        component: defineAsyncComponent(() => import(`./mocFacilityRestoration.vue`)),
        key: uid()
      }
    )
  }
  return data
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.changePreStartup,
  () => {
    getDetail()
  }
)

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
  detailUrl.value = selectConfig.sop.moc.change.punchList.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): MOC 개선 조회
 *******************************/
function getDetail() {
  if (props.param.sopMocId) {
    $http({
      url: $format(detailUrl.value, props.param.sopMocId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(moc.value, _result.data)
      if (moc.value.improves && moc.value.improves.length > 0) {
        // 즉시조치
        moc.value.imprImmData = _.filter(moc.value.improves, { ibmClassCd: 'IC00000005' })
        // 개선요청
        moc.value.imprData = _.filter(moc.value.improves, { ibmClassCd: 'IC00000001' })
      }
    })
  }
  if (props.param.mocTypeCd == 'MT00000001') {
    tab.value = 'review'
  } else if (isRecovery.value) {
    tab.value = 'recovery'
  } else {
    tab.value = 'review'
  }
}
/******************************
 * TODO (목적): 저장 후 진행단계 처리 및 MOC 개선 조회
 * @param (1): MOC id
 *******************************/
function saveCallback(data: string) {
  props.param.sopMocId = data
  emits('emitStep', {
    name: 'keySetting',
    param: data
  })
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

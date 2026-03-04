<template>
  <div class="q-pa-md" :style="[{ height: tabHeight }, { 'overflow-y': 'auto' }]">
    <div class="row">
      <div class="col-12 moc-complete">
        <c-textarea
          :disabled="true"
          :editable="editable"
          label="변경완료의견"
          name="mocCompleteOpinion"
          v-model:value="moc.mocCompleteOpinion"
        />
      </div>
    </div>
    <q-timeline class="moc-timeline" color="green-4">
      <q-timeline-entry
        v-for="(item, idx) in items"
        :key="idx"
        :class="[idx === 0 ? 'fix-header' : '']"
      >
        <template v-if="item.title" v-slot:title>
          <b>{{ item.title }}</b>
        </template>
        <q-slide-transition>
          <div v-show="item.visible">
            <component
              :is="item.component"
              :param="param"
              :moc="moc"
              :disabled="true"
              :onePage="true"
            />
          </div>
        </q-slide-transition>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { mocType } from './moc'

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
  name: 'mocOnepageEmergency'
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
  param: {
    sopMocId: stringNull
    mocTypeCd: stringNull
    mocStepCd: stringNull
    committeeHold: {
      sopMocId: stringNull // MOC 일련번호
      changeApprovalFlag: stringNull // 변경 승인 여부
      changeApprovalReason: stringNull // 변경 승인 사유
      changeApprovalDate: stringNull // 승인일
    }
  }
  height?: stringNull
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
  param: () => {
    return {
      sopMocId: '',
      mocTypeCd: '',
      mocStepCd: '',
      committeeHold: {
        sopMocId: '', // MOC 일련번호
        changeApprovalFlag: '', // 변경 승인 여부
        changeApprovalReason: '', // 변경 승인 사유
        changeApprovalDate: '' // 승인일
      }
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
  deleteEquipments: [],
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
  }
})
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const items = computed(() => {
  const items = [
    {
      title: $language('발의'),
      visible: true,
      component: defineAsyncComponent(() => import(`./mocRequest.vue`))
    },
    {
      title: $language('발의 전 검토'),
      visible: true,
      component: defineAsyncComponent(() => import(`./reviewItem.vue`))
    },
    {
      title: $language('검토(위원회)'),
      visible: true,
      component: defineAsyncComponent(() => import(`./timeline/mocMeetingTL.vue`))
    },
    {
      title: $language('실시'),
      visible: true,
      component: defineAsyncComponent(() => import(`./timeline/taskProceedingTL.vue`))
    },
    {
      title: $language('사후처리'),
      visible: true,
      component: defineAsyncComponent(() => import(`./timeline/mocImprTabTL.vue`))
    }
  ]
  return items
})
const tabHeight = computed(() => {
  const numHeight = props.height ? Number(_.replace(props.height, 'px', '')) - 10 : 600
  return numHeight + 'px'
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
  detailUrl.value = selectConfig.sop.moc.change.initiative.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): MOC 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.param.sopMocId) {
    $http({
      url: $format(detailUrl.value, props.param.sopMocId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(moc.value, _result.data)
      moc.value.mocPeriod =
        moc.value.mocStartDate && moc.value.mocEndDate
          ? [moc.value.mocStartDate, moc.value.mocEndDate]
          : []
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

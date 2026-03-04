<template>
  <div>
    <!-- 관련설비 목록 -->
    <c-table
      ref="table"
      title="관련설비 목록"
      tableId="related-equip"
      :columns="grid.columns"
      :data="moc.equipments"
      :gridHeight="gridHeight"
      :editable="editable && !disabled"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isUpdate"
            :url="updateUrl"
            :param="moc.equipments"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveEquip"
            @btnCallback="saveEquipCallback"
          />
        </q-btn-group>
      </template>
    </c-table>
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
import { mocEquipmentType, mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocFacilityRestoration'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['saveCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  moc: mocType
  disabled: boolean
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
  moc: () => {
    return {
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
    }
  },
  disabled: false,
  height: '700px'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'equipmentCd',
      field: 'equipmentCd',
      // 설비코드
      label: '설비코드',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'link'
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      // 설비명
      label: '설비명',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      // 설비유형
      label: '설비유형',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'restorationFlag',
      field: 'restorationFlag',
      // 원복여부
      label: '원복여부',
      align: 'center',
      sortable: true,
      style: 'width:70px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'processingHistory',
      field: 'processingHistory',
      // 처리내역
      label: '처리내역',
      align: 'left',
      sortable: true,
      style: 'width:500px',
      type: 'textarea'
    }
  ],
  data: []
})
const updateUrl = ref('')
const isUpdate = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  const heightNum = _.replace(props.height, 'px', '')
  return heightNum ? Number(heightNum) - 40 + 'px' : '600px'
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
  updateUrl.value = transactionConfig.sop.moc.restorationEquipment.update.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 설비 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: mocEquipmentType) {
  popupOptions.value.title = '설비 상세' // 설비 상세
  popupOptions.value.param = {
    equipmentCd: row.equipmentCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
  )
  popupOptions.value.width = '90%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 설비 상세 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 설비 복원 저장 전 처리
 *******************************/
function saveEquip() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      isUpdate.value = !isUpdate.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 설비 복원 저장 후 처리
 *******************************/
function saveEquipCallback() {
  message.requestSuccess()
  // 상세 조회
  emits('saveCallback', props.moc.sopMocId)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

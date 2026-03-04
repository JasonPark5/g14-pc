<template>
  <q-form ref="editForm">
    <c-card title="요청상세" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="moc"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveMoc"
            @btnCallback="saveMocCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :disabled="true"
            :editable="editable"
            codeGroupCd="MOC_TYPE_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="mocTypeCd"
            label="변경구분"
            v-model:value="moc.mocTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="true"
            label="MOC번호"
            name="mocNo"
            v-model:value="moc.mocNo"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :required="true"
            :disabled="disabled"
            :editable="editable"
            codeGroupCd="MOC_LEVEL_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="mocWriteLevelCd"
            label="등급(작성)"
            v-model:value="moc.mocWriteLevelCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :disabled="disabled"
            codeGroupCd="MOC_LEVEL_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="mocConfirmLevelCd"
            label="등급(검토)"
            v-model:value="moc.mocConfirmLevelCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :required="true"
            :disabled="disabled"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="moc.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="true"
            label="발의부서/이름"
            name="initiative"
            v-model:value="initiative"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :required="true"
            :disabled="disabled"
            :editable="editable"
            label="제목"
            name="mocTitle"
            v-model:value="moc.mocTitle"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :editable="editable"
            :disabled="disabled"
            :range="true"
            label="변경 작업 기간"
            name="mocPeriod"
            v-model:value="moc.mocPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :editable="editable"
            :disabled="disabled"
            :data="moc"
            deptValue="mocActionDeptCd"
            type="dept_user"
            label="변경실행책임자"
            name="mocActionResponsibilityUserId"
            v-model:value="moc.mocActionResponsibilityUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :editable="editable"
            :disabled="disabled"
            :data="moc"
            deptValue="mocCompleteCheckDeptCd"
            type="dept_user"
            label="변경완료확인자"
            name="mocCompleteCheckUserId"
            v-model:value="moc.mocCompleteCheckUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="true"
            label="발의일"
            name="initiativeDt"
            v-model:value="moc.initiativeDt"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-task-target
            multiple
            required
            :editable="editable"
            :disabled="disabled"
            :customPopupParam="{ targetKey: 'process' }"
            :plantCd="moc.plantCd"
            label="관련공정"
            name="processCd"
            v-model:value="moc.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-tag
            :editable="editable"
            :disabled="disabled"
            :clickable="true"
            itemText="equipmentName"
            itemValue="equipmentCd"
            label="관련설비"
            name="equipments"
            v-model:value="moc.equipments"
            @removeTag="removeEquipment"
            @addTag="addEquipment"
            @clickTag="clickTag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-checkbox
            :disabled="disabled"
            :editable="editable"
            :isArray="false"
            codeGroupCd="MOC_BENEFIT_CD"
            itemText="codeName"
            itemValue="code"
            label="변경 후 기대효과"
            name="mocBenefitCds"
            v-model:value="moc.mocBenefitCds"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :disabled="disabled"
            :editable="editable"
            label="변경계획에 대한 공정 및 설계의 기술근거"
            name="technicalBasisProcessDesign"
            v-model:value="moc.technicalBasisProcessDesign"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :disabled="disabled"
            :editable="editable"
            label="변경의 개요와 의견"
            name="mocSummary"
            v-model:value="moc.mocSummary"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :disabled="disabled"
            :editable="editable"
            label="공정안전 확보를 위한 대책"
            name="processSatefySecureMeasures"
            v-model:value="moc.processSatefySecureMeasures"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :disabled="disabled"
            :editable="editable"
            label="안전성에 필요한 사항 및 신뢰성 향상 효과"
            name="safetyReliabilityImprovementEffect"
            v-model:value="moc.safetyReliabilityImprovementEffect"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="관련근거법령"
            name="relatedLaws"
            v-model:value="moc.relatedLaws"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :disabled="disabled"
            :editable="editable"
            label="팀장의견"
            name="leaderOpinion"
            v-model:value="moc.leaderOpinion"
          />
        </div>
        <div class="col-12">
          <c-upload :attachInfo="attachInfo" :editable="editable && !disabled" />
        </div>
      </template>
    </c-card>
    <c-dialog :param="popupOptions" />
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
import { equipType } from '@/views/mdm/fim/equipment'
import { mocEquipmentType, mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocRequest'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
      initiativeDt: '', // 발의일
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
      },
      relatedWorks: [],
      prestartupImproves: []
    }
  },
  disabled: false
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
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const attachInfo = ref({
  isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
  taskClassCd: 'MOC_REQUEST',
  taskKey: ''
})
const saveUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const initiative = computed(
  () => props.moc.initiativeDeptName + ' / ' + props.moc.initiativeUserName
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.moc.sopMocId,
  () => {
    setTaskKey()
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
  saveUrl.value = transactionConfig.sop.moc.change.update.url
  // code setting
  // list setting
  setTaskKey()
}
/******************************
 * TODO (목적): 업로드 키 셋팅
 *******************************/
function setTaskKey() {
  const taskKey = props.moc && props.moc.sopMocId ? props.moc.sopMocId : ''
  attachInfo.value.taskKey = taskKey
}
/******************************
 * TODO (목적): 관련 설비 삭제
 * @param (1): 설비 정보
 *******************************/
function removeEquipment(item: mocEquipmentType) {
  if (!props.moc.deleteEquipments) {
    props.moc.deleteEquipments = []
  }
  if (
    _.findIndex(props.moc.equipments, { equipmentCd: item.equipmentCd }) > -1 &&
    item.editFlag !== 'C'
  ) {
    props.moc.deleteEquipments.push(item)
  }
  props.moc.equipments = _.reject(props.moc.equipments, item)
}
/******************************
 * TODO (목적): 설비 팝업 표시
 *******************************/
function addEquipment() {
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 설비 팝업 닫기 및 선택한 설비 셋팅
 * @param (1): 선택한 설비 정보
 *******************************/
function closeEquipPopup(data: Array<equipType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!props.moc.equipments) props.moc.equipments = []
    _.forEach(data, (item) => {
      if (_.findIndex(props.moc.equipments, { equipmentCd: item.equipmentCd }) === -1) {
        props.moc.equipments!.push({
          sopMocId: props.moc.sopMocId,
          equipmentCd: item.equipmentCd,
          equipmentName: item.equipmentName,
          restorationFlag: 'N',
          processingHistory: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 설비 상세 팝업 표시
 * @param (1): 설비 정보
 *******************************/
function clickTag(tag: mocEquipmentType) {
  popupOptions.value.title = '설비 상세'
  popupOptions.value.param = tag
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
 * TODO (목적): MOC 저장 전 처리
 *******************************/
function saveMoc() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.moc.chgUserId = user.value.userId
          props.moc.mocStartDate = props.moc.mocPeriod![0]
          props.moc.mocEndDate = props.moc.mocPeriod![1]

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): MOC 저장 후 처리
 * @param (1): API 반환 값
 *******************************/
function saveMocCallback(_result: any) {
  message.requestSuccess()
  emits('saveCallback', _result.data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <q-form ref="editForm">
      <c-card title="대상공정 상세" class="cardClassDetailForm tpd">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && isSelect"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="processData"
              mappingType="PUT"
              label="공정 정보 저장"
              icon="save"
              @beforeAction="saveProcess"
              @btnCallback="saveProcessCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
            <template v-if="checkProcessCd">
              <c-task-target
                :editable="editable"
                :customPopupParam="{ targetKey: 'process' }"
                :plantCd="assessPlan.plantCd"
                label="단위공정"
                name="processCd"
                v-model:value="processData.processCd"
              />
            </template>
            <template v-else>
              <c-text
                :editable="editable"
                :disabled="true"
                label="공정"
                name="processName"
                v-model:value="processData.processName"
              />
            </template>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
            <template v-if="!vendorFlag">
              <c-dept
                :editable="editable"
                :disabled="!isSelect"
                :required="true"
                type="edit"
                label="평가부서"
                name="assessDeptCd"
                v-model:value="processData.assessDeptCd"
              />
            </template>
            <template v-else>
              <c-task-target
                :editable="editable"
                :disabled="!isSelect"
                :customPopupParam="{ targetKey: 'vendor' }"
                label="평가업체"
                name="assessDeptCd"
                v-model:value="processData.assessDeptCd"
              />
            </template>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
            <c-field
              :isWrite="assessPlan.ramTechniqueCd === 'RT00000025'"
              :required="true"
              :editable="editable"
              :disabled="!isSelect"
              :data="processData"
              type="user"
              userName="assessUserName"
              label="평가담당자"
              name="assessUserId"
              v-model:value="processData.assessUserId"
            />
          </div>
          <div
            v-if="assessPlan.ramTechniqueCd === 'RT00000025'"
            class="col-xs-12 col-sm-6 col-md-3 col-lg-2"
          >
            <c-select
              :editable="editable"
              :disabled="!isSelect"
              codeGroupCd="WORK_CYCLE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="workCycleCd"
              label="작업발생주기"
              v-model:value="processData.workCycleCd"
            />
          </div>
          <div
            v-if="assessPlan.ramTechniqueCd === 'RT00000025'"
            class="col-xs-12 col-sm-6 col-md-3 col-lg-2"
          >
            <c-text
              :editable="editable"
              :disabled="!isSelect"
              type="number"
              label="작업시간(1회)"
              name="workingTime"
              v-model:value="processData.workingTime"
            />
          </div>
          <div
            v-if="assessPlan.ramTechniqueCd === 'RT00000030'"
            class="col-xs-12 col-sm-6 col-md-3 col-lg-4"
          >
            <c-task-target
              :customPopupParam="{ targetKey: 'workMeasure' }"
              :editable="editable"
              :disabled="!isSelect"
              :plantCd="assessPlan.plantCd"
              label="작업환경측정"
              name="measPlanContent"
              v-model:value="processData.measPlanContent"
              @dataChange="dataChange"
            />
          </div>
          <div
            v-if="assessPlan.ramTechniqueCd === 'RT00000030'"
            class="col-xs-12 col-sm-6 col-md-3 col-lg-2"
          >
            <c-text
              :required="true"
              :disabled="!isSelect"
              :editable="editable"
              type="number"
              label="사용온도(℃)"
              name="temperature"
              v-model:value="processData.temperature"
            />
          </div>
          <div
            v-if="assessPlan.ramTechniqueCd === 'RT00000001'"
            class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
          >
            <c-tag
              :editable="editable"
              :disabled="!isSelect"
              :clickable="true"
              itemText="equipmentName"
              itemValue="equipmentCd"
              label="관련설비"
              name="equipments"
              v-model:value="processData.equipments"
              @removeTag="removeEquipment"
              @addTag="addEquipment"
              @clickTag="clickTag"
            />
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
            :style="assessPlan.ramTechniqueCd === 'RT00000001' ? 'margin-top: -20px' : ''"
          >
            <c-textarea
              :editable="editable"
              :disabled="!isSelect"
              autogrow
              label="공정특징설명"
              name="processExplainFeature"
              v-model:value="processData.processExplainFeature"
            />
          </div>
        </template>
      </c-card>
      <component
        :is="subComponent"
        :processData="processData"
        :assessPlan="assessPlan"
        :disabled="disabled"
        :isSelect="isSelect"
        :vendorFlag="vendorFlag"
        @saveProcess="emitSaveProcess"
        @research="research"
      />
    </q-form>
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
import { assessPlanType, processDataType } from '../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskTargetProcessDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['saveProcess', 'research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  assessPlan: assessPlanType
  processData: processDataType
  vendorFlag: boolean
  disabled: boolean
  isNew: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  assessPlan: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      plantCd: '', // 사업장 코드
      ramTechniqueCd: '', // 평가기법 코드_HAZOP/KRAS/JSA/CHECKLIST
      ramAssessTypeCd: '', // 평가구분_최초/정기/수시
      assessmentName: '', // 평가명
      assessmentStartDate: '', // 평가시작일
      assessmentEndDate: '', // 평가종료일
      assessmentPeriod: [],
      assessmentYear: '', // 평가년도
      ramStepCd: '', // 평가 진행단계 코드
      assessmentManageDeptCd: '', // 평가주관 부서 코드
      assessmentManageUserId: '', // 평가주관 담당자 ID
      ramMatrixId: null, // 위험메트릭스 번호
      sopMocId: '', // MOC 일련번호
      remark: '', // 상세내용
      workArea: '', // 작업지역
      regDtStr: '',
      regUserId: '', // 작성자 ID
      regUserName: '', // 작성자 ID
      reviewUserId: '', // 검토자 ID
      reviewDate: '', // 검토일
      approvalUserId: '', // 승인자 ID
      approvalDate: '', // 승인일
      vendorCd: '',
      sopConstructionId: '',
      chgUserId: '', // 수정자 ID
      teams: [], // 평가팀 목록
      delTeams: [],
      occasions: [], // 수시 변경/추가 내역 목록
      conferences: [], // 회의 목록
      relatedDocuments: [], // 관련자료 목록
      processes: [] // 대상공정 목록
    }
  },
  processData: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정명
      ramProcessAssessStepCd: '', // 평가진행상태
      processExplainFeature: '', // 공정 특징 설명
      assessDeptCd: '', // 평가 부서 코드
      assessUserId: '', // 평가 담당자
      assessUserName: '', // 평가 담당자
      workCycleCd: null, // 작업발생주기코드
      workingTime: 0, // 작업시간(1회)
      vendorFlag: 0,
      temperature: null,
      workMeasurementPlanId: '',
      measPlanContent: '',
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      sops: [],
      jobs: [],
      drawNodes: [],
      draws: [],
      fmScenarios: [],
      hazopScenarios: [],
      scenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: []
    }
  },
  vendorFlag: false,
  disabled: false,
  isNew: null
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
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '70%',
  param: {},
  closeCallback: () => {}
})
const saveUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return props.processData && props.processData.processCd && !props.disabled ? true : false
})
const checkProcessCd = computed(() => {
  return props.processData.processCd.indexOf('WTE') === -1
})
const subComponent = computed(() => {
  let components = null
  switch (props.assessPlan.ramTechniqueCd) {
    case 'RT00000001': // HAZOP
      components = defineAsyncComponent(
        () => import(`@views/ram/hazop/plan/hazopTargetPidNode.vue`)
      )
      break
    case 'RT00000005': // K-PSR
      components = defineAsyncComponent(() => import(`@views/ram/kpsr/plan/kpsrTargetPidNode.vue`))
      break
    case 'RT00000010': // Check-list
      components = defineAsyncComponent(
        () => import(`@views/ram/checklist/plan/checklistTargetItem.vue`)
      )
      break
    case 'RT00000015': // JRA
      components = defineAsyncComponent(() => import(`@views/ram/jsa/plan/jsaTargetJobRisk.vue`))
      break
    case 'RT00000020': // KRAS
      if (props.isNew === 'Y') {
        components = defineAsyncComponent(
          () => import(`@views/ram/kras/plan/krasTargetJobRisk.vue`)
        )
      } else {
        components = defineAsyncComponent(
          () => import(`@views/ram/kras/plan/krasTargetJobRiskOld.vue`)
        )
      }
      break
    case 'RT00000025': // 4M
      if (props.isNew === 'Y') {
        components = defineAsyncComponent(() => import(`@views/ram/4m/plan/4mTargetJobRisk.vue`))
      } else {
        components = defineAsyncComponent(() => import(`@views/ram/4m/plan/4mTargetJobRiskOld.vue`))
      }
      break
    case 'RT00000030': // CHARM
      components = defineAsyncComponent(() => import(`@views/ram/charm/plan/charmTargetChem.vue`))
      break
    case 'RT00000035': // 3단계 판단법
      components = defineAsyncComponent(
        () => import(`@views/ram/third/plan/thirdTargetRiskHazard.vue`)
      )
      break
  }
  return components
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
  saveUrl.value = transactionConfig.ram.assessProcess.update.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 공정저장 Emit
 *******************************/
function emitSaveProcess(_processCd: any) {
  emits('saveProcess', _processCd)
}
/******************************
 * TODO (목적): 작업환경측정 검색 닫기
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  if (data3.workMeasurementPlanId!.length > 0) {
    props.processData.workMeasurementPlanId = data3.workMeasurementPlanId
    props.processData.measPlanContent = data3.measPlanContent
  }
}
/******************************
 * TODO (목적): 설비 제외
 *******************************/
function removeEquipment(_item: any) {
  message.confirm({
    title: '확인',
    message: '제외하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      props.processData.equipments = _.reject(props.processData.equipments, _item)
    },
    // 취소 callback 함수
    cancelCallback: () => {
      _item.check = true
    }
  })
}
/******************************
 * TODO (목적): 설비 추가
 *******************************/
function addEquipment() {
  popupOptions.value.width = '60%'
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeFacilityPopup, {
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 설비 추가 후 닫기
 *******************************/
function closeFacilityPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    if (!props.processData.equipments) {
      props.processData.equipments = []
    }
    _.forEach(_data, (item) => {
      if (_.findIndex(props.processData.equipments, { equipmentCd: item.equipmentCd }) === -1) {
        props.processData.equipments.push({
          equipmentCd: item.equipmentCd,
          equipmentName: item.equipmentName
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 설비 상세
 *******************************/
function clickTag(_tag: any) {
  popupOptions.value.title = '설비 상세'
  popupOptions.value.param = _tag
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
 * TODO (목적): 공정 저장
 *******************************/
function saveProcess() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.processData.regUserId = user.value.userId
          props.processData.chgUserId = user.value.userId

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}

/******************************
 * TODO (목적): 공정 저장 후 callback
 *******************************/
function saveProcessCallback() {
  message.requestSuccess()
  emits('saveProcess', props.processData.processCd)
}

function research() {
  emits('research')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

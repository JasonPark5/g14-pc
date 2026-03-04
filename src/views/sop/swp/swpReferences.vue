<template>
  <div class="tabvertical">
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :height="tabHeight"
          :workPermit="workPermit"
          :supWorks="supWorks"
          :gridLoto="gridLoto"
          :saveCall="saveCall"
          :isWriting="isWriting"
        />
      </template>
    </c-tab>
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
import { workPermitType } from './safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpReferences'
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
  workPermit: workPermitType
  supWorks: Array<string>
  gridLoto: {
    columns: tableColumnType
    height: string
  }
  isWriting: boolean
  height: string
  saveCall: {
    saveCallData: string
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
  workPermit: () => {
    return {
      sopWorkPermitId: '', // 작업허가서 일련번호
      plantCd: '', // 사업장 코드
      sopName: '', // 작업명
      mdmSopId: '', // 안전작업 표준 일련번호_SOP에서 불러와서 관련 정보 표시후 수정
      permitNo: '', // 허가번호_(YYYYMMDD-01)
      swpStepCd: '', // 진행단계 코드
      applicationDeptCd: '', // 신청인 부서코드
      applicationDeptName: '',
      applicationUserId: '', // 신청인 ID
      applicationUserName: '',
      permitTypeCd: '', // 허가서 구분_화기/일반
      permitDate: '', // 허가일
      workStartTime: '', // 작업시작시간
      workEndTime: '', // 작업종료시간
      workTime: [], // 작업시간
      processCd: '', // 작업공정
      workLocation: '', // 작업장소
      equipmentCd: '', // 설비번호_설비마스터
      workSummary: '', // 작업개요
      specialRequirements: '', // 특별요구사항
      cancelRemark: '', // 취소사유
      actionRemark: '', // 조치사항
      maintenanceDeptCheckUserId: '', // 정비부서 책임자 - 안전조치확인
      maintenanceDeptEntryUserId: '', // 정비부서 입회자 - 안전조치확인
      workCompleteTime: '', // 작업완료시간
      workCompleteEntryUserId: '', // 작업완료 입회자/확인자
      workCompleteWorkUserId: '', // 작업완료 작업자
      issuedDeptCd: '', // 발급자 부서코드
      issuedUserId: '', // 발급자 ID
      workManagerId: '', //담당자id
      approvalDeptCd: '', // 승인자 부서코드
      approvalUserId: '', // 승인자 ID
      relationCooperation1DeptCd: '', // 관련부서 협조자1 부서코드
      relationCooperation1UserId: '', // 관련부서 협조자1 ID
      relationCooperation2DeptCd: '', // 관련부서 협조자2 부서코드
      relationCooperation2UserId: '', // 관련부서 협조자2 ID
      vendorCd: '', // 작업업체 코드
      overWorkFlag: '', // 연장작업 여부
      psmFlag: 'N', // PSM 관련 여부
      sopMocId: '', // MOC 일련번호
      assessWriteUserId: '', // 작업위험성평가_작성자 ID
      assessApprovalUserId: '', // 작업위험성평가_승인자 ID
      swpWorkRequestCd: '', // 작업허가요청
      returnRemark: '', // 반려사유
      vendorFlag: 0, // 업체작성여부
      sopAssessmentCheckTypeCd1: '', // 잠재위험요소1
      sopAssessmentCheckTypeCd2: '', // 잠재위험요소2
      sopAssessmentCheckTypeCd3: '', // 잠재위험요소3
      sopAssessmentCheckTypeCd4: '', // 잠재위험요소4
      sopAssessmentCheckTypeCd5: '', // 잠재위험요소5
      sopAssessmentCheckTypeCd6: '', // 잠재위험요소6
      sopConstructionId: '',
      fireWatchmanId: '', // 화재감시자
      fireWorkClassification: '', // 화기 작업구분
      fireWorkClassificationEtc: '', // 화기 작업구분
      fireSafetyManagerId: '', // 소방안전관리자
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      supWorks: [],
      deleteSupWorks: [],
      checkResults: [],
      deleteCheckResults: [],
      gases: [], // 조회용
      gasChecks: [], // 저장용
      deleteGasChecks: [],
      deleteGasCheckVals: [],
      maps: [],
      deleteMaps: [],
      workers: [],
      deleteWorkers: [],
      assessments: [],
      deleteAssessments: [],
      overs: [],
      deleteOvers: [],
      protectiveGears: [],
      deleteProtectiveGears: [],
      lotos: [],
      deleteLotos: [],
      checklistResults: [],
      deleteChecklistResults: [],
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '' // 결재관련 결재요청코드
    }
  },
  supWorks: () => [],
  gridLoto: () => {
    return {
      columns: [
        {
          name: 'equipmentNo',
          field: 'equipmentNo',
          label: '설비관리번호', // 설비관리번호
          align: 'center',
          style: 'width:100px',
          sortable: true
        },
        {
          name: 'equipmentName',
          field: 'equipmentName',
          label: '설비명', // 설비명
          align: 'left',
          style: 'width:150px',
          sortable: true,
          type: 'link'
        },
        {
          name: 'equipmentTypeName',
          field: 'equipmentTypeName',
          label: '설비유형', // 설비유형
          align: 'center',
          style: 'width:150px',
          sortable: true
        },
        {
          required: true,
          name: 'sopLotoTypeCd',
          field: 'sopLotoTypeCd',
          label: '잠금장치', // 잠금장치
          align: 'center',
          style: 'width:150px',
          sortable: false,
          type: 'select',
          codeGroupCd: 'SOP_LOTO_TYPE_CD'
        },
        {
          name: 'equipmentLocation',
          field: 'equipmentLocation',
          label: '설비위치', // 설비위치
          align: 'center',
          style: 'width:150px',
          sortable: true
        }
      ],
      height: '350px'
    }
  },
  isWriting: false,
  height: '',
  saveCall: () => {
    return {
      saveCallData: ''
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
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const tabHeight = ref('500px')
const tab = ref('resources')
const tabItems = ref([
  {
    name: 'resources',
    icon: 'map',
    label: '작업위치<br />(지도)',
    component: shallowRef(defineAsyncComponent(() => import(`./swpResources.vue`)))
  },
  {
    name: 'contractor',
    icon: 'engineering',
    label: '작업자',
    component: shallowRef(defineAsyncComponent(() => import(`./swpContractor.vue`)))
  },
  {
    name: 'asssessment',
    icon: 'verified',
    label: '작업<br />위험성평가',
    component: shallowRef(defineAsyncComponent(() => import(`./swpAssessment.vue`)))
  },
  {
    name: 'loto',
    icon: 'lock',
    label: 'LOTO',
    component: shallowRef(defineAsyncComponent(() => import(`./swpLoto.vue`)))
  },
  {
    name: 'attach',
    icon: 'attach_file',
    label: '첨부파일',
    component: shallowRef(defineAsyncComponent(() => import(`./swpAttach.vue`)))
  }
])

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.height,
  () => {
    setTabHeight()
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
  // code setting
  // list setting
  setTabHeight()
}
/******************************
 * TODO (목적): 탭 높이 셋팅
 *******************************/
function setTabHeight() {
  let returnText = '500px'
  returnText =
    props.height && !Number.isNaN(props.height.replace('px', ''))
      ? String(Number(props.height.replace('px', '')) - 30) + 'px'
      : returnText
  tabHeight.value = returnText
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

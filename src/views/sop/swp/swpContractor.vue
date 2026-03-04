<template>
  <div>
    <c-table
      ref="workerTable"
      title="작업자명"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="workPermit.workers"
      :merge="grid.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && isWriting"
      selection="multiple"
      rowKey="sopWorkerId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- 추가(작업업체 근무자) -->
          <c-btn
            v-if="editable && isWriting"
            label="추가(작업업체 근무자)"
            icon="add"
            @btnClicked="addVendorUser"
          />
          <!-- 추가(현업) -->
          <c-btn v-if="editable && isWriting" label="추가(현업)" icon="add" @btnClicked="addUser" />
          <!-- 제외 -->
          <c-btn
            v-if="editable && isWriting && workPermit.workers.length > 0"
            label="제외"
            icon="remove"
            :showLoading="false"
            @btnClicked="remove"
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
import { workPermitType } from './safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpContractor'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** user 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  isWriting: boolean
  height: string
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
  isWriting: false,
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [{ index: 0, colName: 'belongName' }],
  columns: [
    {
      name: 'belongName',
      field: 'belongName',
      label: '소속',
      align: 'center',
      sortable: false
    },
    {
      name: 'workerName',
      field: 'workerName',
      label: '이름',
      align: 'center',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '직책',
      align: 'center',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      align: 'center',
      sortable: false
    }
  ],
  data: [],
  height: '350px'
})
const workerTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.height,
  () => {
    setGridHeight()
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
  setGridHeight()
}
/******************************
 * TODO (목적): 업체 작업자 팝업 표시
 *******************************/
function addVendorUser() {
  popupOptions.value = getPopupOptions('vendorUser', popupOptions.value, closeVendorUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    plantCd: props.workPermit.plantCd, // 사업장코드(관련사업장)
    vendorCd: props.workPermit.vendorCd // 수급업체코드
  })
}
/******************************
 * TODO (목적): 업체 작업자 팝업 닫기
 * @param (1): 선택한 업체 작업자
 *******************************/
function closeVendorUserPopup(data: Array<vendorUserType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.workPermit.workers, { vendorUserCd: item.vendorUserCd }) === -1) {
        let idx = _.findIndex(props.workPermit.workers, { vendorCd: item.vendorCd })
        idx = idx > -1 ? idx : 0
        props.workPermit.workers.splice(idx, 0, {
          sopWorkerId: uid(), // 안전작업허가서_작업자 일련번호
          sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
          belongName: '(' + $language('업체') + ') ' + item.vendorName, // 소속명
          vendorCd: item.vendorCd, // 작업업체 코드
          deptCd: '', // 부서코드
          vendorUserCd: item.vendorUserCd, // 직원 일련번호
          userId: '', // 사용자id (현업인 경우)
          workerName: item.personName, // 작업자명
          jobName: item.jobName,
          birthDate: item.birthDate,
          regUserId: user.value.userId, // 등록자 ID
          chgUserId: '', // 수정자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 사용자 팝업 표시
 *******************************/
function addUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    plantCd: props.workPermit.plantCd // 사업장코드(관련사업장)
  })
}
/******************************
 * TODO (목적): 사용자 팝업 닫기
 * @param (1): 선택한 사용자
 *******************************/
function closeUserPopup(data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.workPermit.workers, { userId: item.userId }) === -1) {
        let idx = _.findIndex(props.workPermit.workers, { deptCd: item.deptCd })
        idx = idx > -1 ? idx : 0
        props.workPermit.workers.splice(idx, 0, {
          sopWorkerId: uid(), // 안전작업허가서_작업자 일련번호
          sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
          belongName: '(' + $language('현업') + ') ' + item.deptName, // 소속명
          vendorCd: '', // 작업업체 코드
          deptCd: item.deptCd, // 부서코드
          vendorUserCd: '', // 직원 일련번호
          userId: item.userId, // 사용자id (현업인 경우)
          workerName: item.userName, // 작업자명
          jobName: item.jobName,
          birthDate: item.birthDate,
          regUserId: user.value.userId, // 등록자 ID
          chgUserId: '', // 수정자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 작업자 제거
 *******************************/
function remove() {
  const selectData = workerTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '삭제할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.workPermit.deleteWorkers) {
        props.workPermit.deleteWorkers = []
      }
      if (_.findIndex(props.workPermit.deleteWorkers, { sopWorkerId: item.sopWorkerId }) === -1) {
        props.workPermit.deleteWorkers.push(item)
      }
      props.workPermit.workers = _.reject(props.workPermit.workers, item)
    })
  }
}
/******************************
 * TODO (목적): 목록 높이 셋팅
 *******************************/
function setGridHeight() {
  let returnText = '500px'
  returnText =
    props.height && !Number.isNaN(props.height.replace('px', ''))
      ? String(Number(props.height.replace('px', '')) - 40) + 'px'
      : returnText
  grid.value.height = returnText
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

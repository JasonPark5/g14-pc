<template>
  <div>
    <c-table
      ref="table"
      title="LOTO"
      :columns="gridLoto.columns"
      :gridHeight="gridLoto.height"
      :data="workPermit.lotos"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && isWriting"
      selection="multiple"
      rowKey="sopLotoId"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable && isWriting" label="추가" icon="add" @btnClicked="addFacility" />
          <c-btn
            v-if="editable && isWriting && workPermit.lotos.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="removeFacility"
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
import { equipType } from '@/views/mdm/fim/equipment'
import { workPermitType } from './safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpLoto'
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
  gridLoto: {
    columns: tableColumnType
    height: string
  }
  isWriting: boolean
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
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const table = ref<any>(null)

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
 * TODO (목적): 설비 팝업 표시
 *******************************/
function addFacility() {
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    plantCd: props.workPermit.plantCd // 사업장코드(관련사업장)
  })
}
/******************************
 * TODO (목적): 설비 팝업 닫기
 * @param (1): 선택한 설비 정보
 *******************************/
function closePopup(data: Array<equipType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.workPermit.lotos, { equipmentCd: item.equipmentCd }) === -1) {
        props.workPermit.lotos.splice(0, 0, {
          sopLotoId: uid(), // LOTO 일련번호
          sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
          equipmentCd: item.equipmentCd,
          equipmentNo: item.equipmentNo,
          equipmentName: item.equipmentName,
          equipmentTypeName: item.equipmentTypeName,
          equipmentLocation: item.equipmentLocation,
          sopLotoTypeCd: null, // 잠금장치
          regUserId: user.value.userId, // 수정자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 설비 제외
 *******************************/
function removeFacility() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '삭제할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.workPermit.deleteLotos) {
        props.workPermit.deleteLotos = []
      }
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.workPermit.deleteLotos, { equipmentCd: item.equipmentCd }) === -1
      ) {
        props.workPermit.deleteLotos.push(item)
      }
      props.workPermit.lotos = _.reject(props.workPermit.lotos, item)
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
  props.gridLoto.height = returnText
}
/******************************
 * TODO (목적): 설비 상세 팝업 표시
 * @param (1): 설비 상세 정보
 *******************************/
function linkClick(row: equipType) {
  popupOptions.value.title = '설비 상세'
  popupOptions.value.param = {
    equipmentCd: row.equipmentCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.width = '95%'
  popupOptions.value.closeCallback = closeEquipPopup
}
/******************************
 * TODO (목적): 설비 상세 팝업 닫기
 *******************************/
function closeEquipPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

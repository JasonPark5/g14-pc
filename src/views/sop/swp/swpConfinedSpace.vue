<template>
  <div>
    <c-card title="밀폐공간작업 상세정보" class="cardClassDetailForm" style="margin-bottom: -10px">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 swpConfined">
          <c-textarea
            :disabled="!isWriting"
            :editable="editable"
            label="출입사유"
            name="closeEntryResaon"
            v-model:value="supWork.closeEntryResaon"
            @dataChange="dataChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 swpConfined">
          <c-textarea
            :disabled="!isWriting"
            :editable="editable"
            label="밀폐장소의 예상위험"
            name="closeExpectedRisk"
            v-model:value="supWork.closeExpectedRisk"
            @dataChange="dataChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 swpConfined">
          <c-tag
            :disabled="!isWriting"
            :editable="editable"
            itemText="closeEntryUserName"
            itemValue="closeEntryUserId"
            icon="face"
            label="출입자"
            name="entrants"
            v-model:value="supWork.entrants"
            @removeTag="removeEntrant"
            @addTag="addEentrant"
          />
        </div>
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
        <c-table
          class="q-mt-md"
          title="안전조치 요구사항"
          :columns="gridCheck.columns"
          :gridHeight="gridCheck.height"
          :data="supWork.checkResults"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && isWriting"
          :contentsField="contentsField"
          @table-data-change="tableDataChange"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
        <c-table
          ref="gasTable"
          class="q-mt-md"
          title="가스농도 측정"
          :columns="gridGas.columns"
          :gridHeight="gridGas.height"
          :data="supWork.gases"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && gasEditable"
          selection="multiple"
          rowKey="sopGasCheckId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && gasEditable"
                label="추가"
                icon="add"
                :showLoading="false"
                @btnClicked="addGas"
              />
              <c-btn
                v-if="editable && gasEditable && supWork.gases.length > 0"
                label="제외"
                icon="remove"
                :showLoading="false"
                @btnClicked="removeGas"
              />
              <c-btn
                v-if="
                  editable &&
                  isOld &&
                  workPermit.swpStepCd !== 'SS00000001' &&
                  gasEditable &&
                  workPermit.gases.length > 0
                "
                label="저장"
                icon="save"
                @btnClicked="saveSwpGas"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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
import { workGasItemType } from './base/workGasItem'
import { checkResultType, entrantType, supWorkType, workPermitType } from './safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpConfinedSpace'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['saveWorkPermit', 'saveWorkPermitCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  workPermit: workPermitType
  supWork: supWorkType
  isOld: boolean
  isWriting: boolean
  saveCall: {
    saveCallData: string
  }
}
interface gridCheckType {
  columns: Array<tableColumnType>
  data: Array<checkResultType>
  height: string
}
interface gridGasType {
  columns: Array<tableColumnType>
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
  supWork: () => {
    return {
      sopWorkPermitId: '', // 작업허가서 일련번호
      supplementWorkTypeCd: '', // 보충작업구분
      workProposalNo: '', // 작업 신청번호_방사선, 고소, 중장비
      workLocation: '', // 작업장소_방사선, 고소, 중장비
      workSummary: '', // 작업개요_고소, 방사선,굴착, 중장비
      issuedDeptCd: '', // 발급자 부서코드
      issuedUserId: '', // 발급자 ID
      approvalDeptCd: '', // 승인자 부서코드
      approvalUserId: '', // 승인자 ID
      maintenanceDeptCheckUserId: '', // 정비부서 책임자 - 안전조치확인
      maintenanceDeptEntryUserId: '', // 정비부서 입회자 - 안전조치확인
      relationCooperation1DeptCd: '', // 관려부서 협조자1 부서코드
      relationCooperation1UserId: '', // 관련부서 협조자1 ID
      relationCooperation2DeptCd: '', // 관려부서 협조자2 부서코드
      relationCooperation2UserId: '', // 관련부서 협조자2 ID
      specialRequirements: '', // 특별요구사항
      closeMachine: '', // (밀폐)장치명
      closeEntryResaon: '', // (밀폐)출입사유
      closeEntryUserIds: '', // (밀폐)출입자id_구분자이용 복수등록
      closeEntryUserNames: '', // (밀폐)출입자명_구분자이용 복수등록
      closeExpectedRisk: '', // (밀폐)예상위험
      blackoutCircuitBreaker: '', // (정전)차단기기
      blackoutCircuitBreakerNo: '', // (정전)차단기 번호
      blackoutPowerRecoveryRequestUserId: '', // (정전)전원복구 요청자
      blackoutPowerRecoveryTime: '', // (정전)전원복구 시간
      blackoutElectricBlockUserId: '', // (정전)차단확인자(전기)
      blackoutMaintenanceBlockUserId: '', // (정전)차단확인자(정비)
      sketchSrc: '', // (굴착)스케치
      radiationResponsibleUserId: '', // (방사선)방사능 책임자
      heavyEquipSafetyCheckUserId: '', // (중장비)안전조치 확인자
      heavyEquipManageUserId: '', // (중장비)장비관리 책임자
      heavyEquipDriveUserId: '', // (중장비)운전원
      heavyEquipDirectorRequirements: '', // (중장비) 감독 요구사항
      heavyEquipRequireDeptRequirements: '', // (중장비)요청부서 요구사항
      heavyEquipSupportDeptRequirements: '', // (중장비) 지원부서 요구사항
      heavySignalMan: '', // (중장비) 신호수
      heavyType: '', // (중장비) 중장비종류
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      checkResults: [], // 안전조치항목
      gases: [], // 가스항목측정 ** 사용하지 않는 보충작업도 존재하지만 빈 배열을 할당시켜 관리
      gasChecks: [], // 저장용
      gasCheckVals: [], // 저장용
      deleteGasChecks: [],
      deleteGasCheckVals: [],
      editFlag: 'C',
      entrants: []
    }
  },
  isOld: false,
  isWriting: false,
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
const gridCheck = ref<gridCheckType>({
  columns: [],
  data: [],
  height: '450px'
})
const gridGas = ref<gridGasType>({
  columns: [],
  height: '450px'
})
const useGasItems = ref<Array<workGasItemType>>([])
const listCheckItemUrl = ref('')
const listGasItemUrl = ref('')
const gasTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gasEditable = computed(
  () => props.workPermit.swpStepCd !== 'SS00000020' && props.workPermit.swpStepCd !== 'SS00000015'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.workPermit.plantCd,
  () => {
    props.supWork.checkResults = []
    props.supWork.gases = []
    getCheckItemList()
    getGasItemList()
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
  listCheckItemUrl.value = selectConfig.sop.swp.workChekItem.list.url
  listGasItemUrl.value = selectConfig.sop.swp.gas.list.url
  // code setting
  // list setting
  setData()
  getCheckItemList()
  getGasItemList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setData() {
  if (props.supWork.closeEntryUserIds) {
    const closeEntryUserIdSplit = _.split(props.supWork.closeEntryUserIds, ',')
    const closeEntryUserNameSplit = _.split(props.supWork.closeEntryUserNames, ',')
    let idx = 0
    props.supWork.entrants = [] // 무조건 초기화 처리
    _.forEach(closeEntryUserIdSplit, (closeEntryUserId) => {
      props.supWork.entrants.push({
        closeEntryUserId: closeEntryUserId,
        closeEntryUserName: closeEntryUserNameSplit[idx],
        check: true
      })
      idx++
    })
  } else {
    props.supWork.entrants = []
  }
}
/******************************
 * TODO (목적): 안전조치사항 조회
 *******************************/
function getCheckItemList() {
  /** default 값을 조회
   * 초기인 경우 workPermit.checkResults에 값을 그대로 적용
   * 작성중 단계인 경우 default 값에 새로운 항목이 있을시에 workPermit.checkResults에 추가하여 입력을 받을 수 있도록 조치
   * 승인완료, 연장, 취소, 작업완료인 경우 저장된 데이터를 그대로 표시하며 이 경우 default값을 조회하지 않도록 조치
   */
  gridCheck.value.columns = [
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '항목',
      align: 'left',
      sortable: true
    },
    {
      name: 'necessaryFlag',
      field: 'necessaryFlag',
      label: '필요',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N',
      setHeader: true
    },
    {
      name: 'confirmFlag',
      field: 'confirmFlag',
      label: '확인',
      align: 'center',
      sortable: false,
      type: 'check',
      disableTarget: 'necessaryFlag',
      disableCon: 'Y',
      true: 'Y',
      false: 'N',
      value: 'N',
      setHeader: true
    }
  ]
  if (!props.workPermit.plantCd) return
  if (!props.supWork.checkResults) props.supWork.checkResults = []
  if (!props.isOld || props.workPermit.swpStepCd === 'SS00000001') {
    $http({
      url: listCheckItemUrl.value,
      method: 'GET',
      params: {
        plantCd: props.workPermit.plantCd,
        sopWorkTypeCd: 'SWT0000010',
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      if (
        !props.isOld &&
        (!props.supWork.checkResults || props.supWork.checkResults.length === 0)
      ) {
        // 최초인 경우 조치항목을 가지고 있지 않음으로 해당 값을 표시
        _.forEach(_result.data, (item) => {
          props.supWork.checkResults.push({
            sopWorkPermitId: '', // 작업허가서 일련번호
            supplementWorkTypeCd: '', // 보충작업구분
            sopCheckItemId: item.sopCheckItemId, // 점검항목 일련번호
            checkItemName: item.checkItemName, // 점검항목명
            sopCheckItemKindCd: item.sopCheckItemKindCd, // 체크항목 종류
            necessaryFlag: 'N', // 필요
            confirmFlag: 'N', // 확인
            confirmUserId: '', // 확인자
            confirmUserName: '', // 확인자명
            regUserId: user.value.userId, // 등록자 ID
            chgUserId: '', // 수정자 ID
            editFlag: 'C'
          })
        })
      } else {
        _.forEach(_result.data, (item) => {
          if (
            _.findIndex(props.supWork.checkResults, {
              sopCheckItemId: item.sopCheckItemId
            }) === -1
          ) {
            props.supWork.checkResults.push({
              sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
              supplementWorkTypeCd: props.supWork.supplementWorkTypeCd, // 보충작업구분
              sopCheckItemId: item.sopCheckItemId, // 점검항목 일련번호
              checkItemName: item.checkItemName, // 점검항목명
              sopCheckItemKindCd: item.sopCheckItemKindCd, // 체크항목 종류
              necessaryFlag: 'N', // 필요
              confirmFlag: 'N', // 확인
              confirmUserId: '', // 확인자
              confirmUserName: '', // 확인자명
              regUserId: user.value.userId, // 등록자 ID
              chgUserId: '', // 수정자 ID
              editFlag: 'C'
            })
          }
        })
      }
      if (
        _.findIndex(_result.data, { sopCheckItemKindCd: 'SCIK000005' }) > -1 ||
        _.findIndex(props.supWork.checkResults, { sopCheckItemKindCd: 'SCIK000005' }) > -1
      ) {
        gridCheck.value.columns.push({
          name: 'confirmUserName',
          field: 'confirmUserName',
          label: '확인자',
          align: 'center',
          sortable: true,
          type: 'user',
          userId: 'confirmUserId',
          disableTarget: 'necessaryFlag',
          disableCon: 'Y'
        })
      }
    })
  } else {
    if (_.findIndex(props.supWork.checkResults, { sopCheckItemKindCd: 'SCIK000005' }) > -1) {
      gridCheck.value.columns.push({
        name: 'confirmUserName',
        field: 'confirmUserName',
        label: '확인자',
        align: 'center',
        sortable: true,
        type: 'user',
        userId: 'confirmUserId',
        disableTarget: 'necessaryFlag',
        disableCon: 'Y'
      })
    }
  }
}
/******************************
 * TODO (목적): 가스 측정값 조회
 *******************************/
function getGasItemList() {
  const columns: Array<tableColumnType> = [
    {
      name: 'checkTime',
      field: 'checkTime',
      label: '측정시간',
      align: 'center',
      type: 'datetime',
      minuteStep: 10,
      sortable: false,
      style: 'width:15%'
    },
    {
      name: 'gasCheckMachine',
      field: 'gasCheckMachine',
      label: '측정기기',
      align: 'center',
      sortable: false,
      type: 'text',
      value: '',
      setHeader: true,
      style: 'width:15%'
    },
    {
      name: 'gasCheckUserName',
      field: 'gasCheckUserName',
      label: '측정자',
      align: 'center',
      sortable: false,
      type: 'user',
      userId: 'gasCheckUserId',
      value: '',
      setHeader: true,
      style: 'width:10%'
    },
    {
      name: 'gasConfirmUserName',
      field: 'gasConfirmUserName',
      label: '확인자',
      align: 'center',
      sortable: false,
      type: 'user',
      userId: 'gasConfirmUserId',
      value: '',
      setHeader: true,
      style: 'width:10%'
    }
  ]

  $http({
    url: listGasItemUrl.value,
    method: 'GET',
    params: {
      plantCd: props.workPermit.plantCd
      // sopWorkTypeCd: 'SWT0000001',
    }
  }).then((_result: any) => {
    useGasItems.value = []
    if (props.supWork.gases && props.supWork.gases.length > 0) {
      const pushData: Array<workGasItemType> = []
      _.forEach(props.supWork.gases, (gas) => {
        for (const gasValue in gas) {
          const idx = _.findIndex(_result.data, { sopGasId: gasValue })
          const idx2 = _.findIndex(pushData, { sopGasId: gasValue })
          /* idx의 경우 기본적으로 존재여부를 판단하지만 예전 입력된 값 중 useFlag N처리된 값이 있는 경우는 허용 */
          if (idx > -1 && gas[gasValue] !== '-' && idx2 === -1) {
            // _result.data[idx] = 'me'
            // this.$set(_result.data[idx], 'me')
            pushData.push(_result.data[idx])
          }
        }
      })
      if (pushData && pushData.length > 0) {
        _.forEach(pushData, (item) => {
          useGasItems.value.push(item)
          columns.splice(1, 0, {
            // 가스 헤더 적용 로직 추가 필요
            name: item.sopGasId + '_p',
            field: item.sopGasId + '_p',
            label: item.gasName,
            align: 'center',
            sortable: false,
            child: [
              {
                name: item.sopGasId,
                field: item.sopGasId,
                label: item.safetyStandards,
                align: 'center',
                type: 'text',
                sortable: false,
                style: 'width:' + 50 / pushData.length + '%'
              }
            ]
          })
        })
      }
    } else {
      const useYList = _.filter(_result.data, (item) => {
        return (
          item.useFlag === 'Y' && _.findIndex(item.workTypes, { sopWorkTypeCd: 'SWT0000010' }) > -1
        )
      })
      _.forEach(useYList, (gas) => {
        useGasItems.value.push(gas)
        columns.splice(1, 0, {
          // 가스 헤더 적용 로직 추가 필요
          name: gas.sopGasId + '_p',
          field: gas.sopGasId + '_p',
          label: gas.gasName,
          align: 'center',
          sortable: false,
          child: [
            {
              name: gas.sopGasId,
              field: gas.sopGasId,
              label: gas.safetyStandards,
              align: 'center',
              type: 'text',
              sortable: false,
              style: 'width:' + 50 / useYList.length + '%'
            }
          ]
        })
      })
    }

    gridGas.value.columns = columns
  })
}
/******************************
 * TODO (목적): 가스 추가
 *******************************/
function addGas() {
  const pushData: any = {
    sopGasCheckId: uid(), // 가스농도측정번호
    sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
    supplementWorkTypeCd: props.supWork.supplementWorkTypeCd, // 보충작업구분
    checkTime: '', // 점검시간
    gasCheckMachine: '', // 점검기기명
    gasCheckUserName: '',
    gasCheckUserId: '', // 점검자
    gasConfirmUserName: '',
    gasConfirmUserId: '', // 확인자(입회자)
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  }
  _.forEach(useGasItems.value, (gas) => {
    pushData[gas.sopGasId] = '0'
  })

  props.supWork.gases.push(pushData)
}
/******************************
 * TODO (목적): 가스 제거
 *******************************/
function removeGas() {
  const selectData = gasTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '제외할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.supWork.deleteGasChecks) props.supWork.deleteGasChecks = []
    if (!props.supWork.deleteGasCheckVals) props.supWork.deleteGasCheckVals = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.supWork.deleteGasChecks, {
          sopGasCheckId: item.sopGasCheckId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.supWork.deleteGasChecks.push(item)
        _.forEach(useGasItems.value, (gas) => {
          props.workPermit.deleteGasCheckVals.push({
            sopGasCheckId: item.sopGasCheckId,
            sopGasId: gas.sopGasId
          })
        })
      }
      props.supWork.gases = _.reject(props.supWork.gases, item)
    })
    gasTable.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 사용자 팝업 표시
 *******************************/
function addEentrant() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeEentrantPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 사용자 팝업 닫기
 * @param (1): 출입자로 선택한 사용자 셋팅
 *******************************/
function closeEentrantPopup(data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    let closeEntryUserIdSplit = props.supWork.closeEntryUserIds
      ? _.split(props.supWork.closeEntryUserIds, ',')
      : []
    let closeEntryUserNameSplit = props.supWork.closeEntryUserNames
      ? _.split(props.supWork.closeEntryUserNames, ',')
      : []
    if (!props.supWork.entrants) props.supWork.entrants = []
    _.forEach(data, (item) => {
      if (_.findIndex(props.supWork.entrants, { closeEntryUserId: item.userId }) === -1) {
        props.supWork.entrants.push({
          closeEntryUserId: item.userId,
          closeEntryUserName: item.userName
        })
      }

      if (_.indexOf(closeEntryUserIdSplit, item.userId) === -1) {
        closeEntryUserIdSplit = _.concat(closeEntryUserIdSplit, item.userId)
        props.supWork.closeEntryUserIds = _.join(closeEntryUserIdSplit, ',')
        closeEntryUserNameSplit = _.concat(closeEntryUserNameSplit, item.userName)
        props.supWork.closeEntryUserNames = _.join(closeEntryUserNameSplit, ',')
      }
    })

    if (props.supWork.editFlag !== 'C') {
      props.supWork.editFlag = 'U'
      props.supWork.chgUserId = user.value.userId
    }
  }
}
/******************************
 * TODO (목적): 출입자 제거
 * @param (1): 출입자 정보
 *******************************/
function removeEntrant(item: entrantType) {
  item.check = false
  props.supWork.entrants = _.reject(props.supWork.entrants, item)

  const closeEntryUserIdSplit = _.split(props.supWork.closeEntryUserIds, ',')
  const closeEntryUserNameSplit = _.split(props.supWork.closeEntryUserNames, ',')
  const idx = _.indexOf(closeEntryUserIdSplit, item.closeEntryUserId)
  closeEntryUserIdSplit.splice(idx, 1)
  closeEntryUserNameSplit.splice(idx, 1)
  props.supWork.closeEntryUserIds = _.join(closeEntryUserIdSplit, ',')
  props.supWork.closeEntryUserNames = _.join(closeEntryUserNameSplit, ',')

  if (props.supWork.editFlag !== 'C') {
    props.supWork.editFlag = 'U'
    props.supWork.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 데이터 변경 시 저장을 위한 수정 정보 셋팅
 *******************************/
function dataChange() {
  if (props.supWork.editFlag !== 'C') {
    props.supWork.editFlag = 'U'
    props.supWork.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 안전조치사항 필요란 체크에 따른 확인란 활성화 처리
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 * @return (반환): 활성화 여부
 *******************************/
function contentsField(_props: any, col: tableColumnType) {
  /** 안전조치사항 항목에서 항목 입력 타입이 '테이블_점검자' 인 경우 테이블에 표시
   * 단, 예전에 '테이블_점검자'였으며 그럼으로 인해 데이터가 저장이 된적이 있는 경우 컴포넌트 표시
   */
  let returnVal = true
  if (col.name === 'confirmUserName') {
    returnVal =
      _props.row.sopCheckItemKindCd === 'SCIK000005' || Boolean(_props.row.confirmUserName)
  }
  return returnVal
}
/******************************
 * TODO (목적): 안전조치사항 필요란 체크시 확인란 체크 해제
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'necessaryFlag' && _props.row[col.name] !== 'Y') {
    _props.row.confirmFlag = 'N'
    _props.row.confirmUserId = null
    _props.row.confirmUserName = null
  }
}
/******************************
 * TODO (목적): 가스 저장 시 작업허가서 저장 버튼 호출
 *******************************/
function saveSwpGas() {
  emits('saveWorkPermit')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.swpConfined
  margin-bottom: -20px !important
</style>

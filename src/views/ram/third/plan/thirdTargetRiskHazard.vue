<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="table"
        title="평가대상 목록 - 유해위험요인"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="processData.thirdScenarios"
        :columnSetting="false"
        :expandAll="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="false"
        :editable="editable && !disabled && isSelect"
        selection="multiple"
        rowKey="ramThirdAssessScenarioId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="추가"
              icon="add"
              @btnClicked="addRiskHazard"
            />
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="유해위험요인 추가"
              icon="add"
              @btnClicked="addRiskHazardPop"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.thirdScenarios &&
                processData.thirdScenarios.length > 0
              "
              label="삭제"
              icon="remove"
              @btnClicked="removeRiskHazard"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.thirdScenarios &&
                processData.thirdScenarios.length > 0
              "
              :isSubmit="isSave"
              :url="saveUrl"
              :param="processData.thirdScenarios"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveRiskHazard"
              @btnCallback="saveRiskHazardCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'picture'">
            <q-icon
              style="font-size: 30px; cursor: pointer"
              class="text-success"
              name="image"
              @click.stop="openPicture(props)"
            />
          </template>
        </template>
      </c-table>
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
import { assessPlanType, processDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'thirdTargetRiskHazard'
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
  disabled: boolean
}

interface gridType {
  columns: tableColumnType
  height: stringNull
  data: Array<any>
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
      jobs: [],
      sops: [],
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
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'riskHazardQuestionName',
      field: 'riskHazardQuestionName',
      label: '유해위험요인 (위험한 상황과 사건)',
      align: 'left',
      style: 'width:100%',
      sortable: true,
      type: 'textarea',
      required: true
    },
    {
      name: 'picture',
      field: 'picture',
      label: '사진',
      align: 'center',
      type: 'custom',
      style: 'width:80px',
      sortable: false
    }
  ],
  data: [],
  height: 'auto'
})
const table = ref<any>(null)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return props.processData &&
    props.processData.processCd &&
    props.processData.ramProcessAssessStepCd !== 'RPA0000005'
    ? true
    : false
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
  listUrl.value = selectConfig.ram.third.scenario.list.url
  saveUrl.value = transactionConfig.ram.third.scenario.save.url
  deleteUrl.value = transactionConfig.ram.third.scenario.delete.url
  // code setting
  // list setting
}
function getScenarios() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.thirdScenarios = _result.data
  })
}
function addRiskHazard() {
  if (!props.processData.thirdScenarios) props.processData.thirdScenarios = []
  props.processData.thirdScenarios.splice(0, 0, {
    ramThirdAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
    ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
    processCd: props.processData.processCd, // 단위공정 코드
    processName: props.processData.processName, // 단위공정
    riskHazardQuestionName: '', // 유해위험요인 질문
    ramRiskThirdStandardId: '', // 3단계 판단결과
    riskColor: '', // 위험색상
    regUserId: user.value.userId, // 작성자 ID
    editFlag: 'C'
  })
}
function addRiskHazardPop() {
  popupOptions.value = getPopupOptions('sop5', popupOptions.value, closeRiskHazardPopup, {
    type: 'multiple',
    searchParam: {
      ramRiskHazardTechniqueCd: 'RTH0000015'
    }
  })
}
/******************************
 * TODO (목적): 유해위험요인 검색 callback
 *******************************/
function closeRiskHazardPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (_item) => {
      if (
        _.findIndex(props.processData.thirdScenarios, {
          ramRiskHazardId: _item.ramRiskHazardId
        }) === -1
      ) {
        props.processData.thirdScenarios.splice(0, 0, {
          ramThirdAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
          processCd: props.processData.processCd, // 단위공정 코드
          processName: props.processData.processName, // 단위공정
          riskHazardQuestionName: _item.riskHazardName, // 유해위험요인 질문
          ramRiskHazardId: _item.ramRiskHazardId, // 유해위험요인 질문
          ramRiskThirdStandardId: '', // 3단계 판단결과
          riskColor: '', // 위험색상
          regUserId: user.value.userId, // 작성자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
function saveRiskHazard() {
  if (validTable(grid.value.columns, props.processData.thirdScenarios)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveRiskHazardCallback() {
  message.requestSuccess()
  emits('saveProcess', props.processData.processCd)
  emits('research')
  getScenarios()
}
function removeRiskHazard() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    const _message =
      '관련되어 있는 정보 및 개선사항, 위험등록부가 같이 삭제됩니다.\n\r삭제하시겠습니까?' // 삭제하시겠습니까?
    message.confirm({
      title: '확인',
      message: _message,

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.processData.thirdScenarios = _.reject(props.processData.thirdScenarios, item)
          })
          table.value.compoTable.clearSelection()
          emits('research')
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function openPicture(_props: any) {
  popupOptions.value.title = '유해위험요인 사진'
  popupOptions.value.param = {
    ramThirdAssessScenarioId: _props.row.ramThirdAssessScenarioId,
    disabled: _props.disabled
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/third/action/thirdRiskHazardPicture.vue'))
  )
  popupOptions.value.width = '50%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePicturePopup
}
function closePicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

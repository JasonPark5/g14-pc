<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="순회점검 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <c-appr-btn
                  v-if="!popupParam.isApprContent"
                  ref="apprBtn"
                  name="work-permit-appr-btn"
                  :editable="editable"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalPatrol"
                  @callbackApprAction="approvalPatrolCallback"
                  @requestAfterAction="getDetail"
                />
                <c-btn
                  v-if="isOld && !disabled && editable && !popupParam.isApprContent"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-show="!disabled && editable"
                  label="저장"
                  icon="save"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="patrol"
                  :mappingType="saveType"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  type="edit"
                  name="plantCd"
                  :disabled="disabled"
                  :editable="editable && !isOld"
                  v-model:value="patrol.plantCd"
                  @datachange="datachange"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  label="순회일"
                  type="date"
                  name="patrolDate"
                  :editable="editable"
                  :disabled="disabled"
                  v-model:value="patrol.patrolDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  label="공정"
                  name="processCd"
                  :editable="editable"
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'process' }"
                  v-model:value="patrol.processCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  label="부서"
                  name="vendorCd"
                  :editable="editable"
                  :disabled="disabled"
                  v-model:value="patrol.vendorCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  label="순회장소"
                  name="sopMapId"
                  :editable="editable"
                  :disabled="disabled"
                  v-model:value="patrol.sopMapId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  required
                  label="순회명"
                  name="patrolName"
                  :editable="editable"
                  :disabled="disabled"
                  v-model:value="patrol.patrolName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-task-target
                  label="관련공사"
                  name="sopConstructionId"
                  :editable="editable"
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'construction' }"
                  v-model:value="patrol.sopConstructionId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-task-target
                  label="관련 위험성평가"
                  name="ramRiskAssessmentPlanId"
                  :editable="editable"
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'riskAssessment' }"
                  v-model:value="patrol.ramRiskAssessmentPlanId"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="항목별 결과 목록"
            :columns="grid.columns"
            :gridHeight="grid.height"
            :data="patrol.results"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :noDataLabel="$language('항목별 결과 추가하세요.')"
            :editable="editable && !disabled"
            rowKey="saiPatrolResultId"
            selection="multiple"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="editable && !disabled"
                  :isImmShow="true"
                  :requestContentsCols="requestContentsCols"
                  tableKey="saiPatrolResultId"
                  ibmTaskTypeCd="ITT0000065"
                  ibmTaskUnderTypeCd="ITTU000105"
                  @imprChange="imprChange"
                />
              </template>
            </template>
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult"
                />
                <c-btn
                  v-if="editable && !disabled && patrol.results.length > 0"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeResult"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="순회결과 정보" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  codeGroupCd="PATROL_RESULT_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="patrolResultCd"
                  label="순회결과"
                  :editable="editable"
                  :disabled="disabled"
                  v-model:value="patrol.patrolResultCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  label="순회결과요약"
                  name="patrolResultSummary"
                  :editable="editable"
                  :disabled="disabled"
                  :rows="3"
                  v-model:value="patrol.patrolResultSummary"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfo"
            :editable="editable && !disabled"
            label="관련 첨부파일"
          />
        </div>
      </div>
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
import { patrolMasterType, patrolDetailType } from './patrolType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'patrolInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiPatrolId: stringNull
    isApprContent: boolean
  }
  patrol: patrolDetailType
  attachInfo: {
    isSubmit: stringNull
    taskClassCd: stringNull
    taskKey: stringNull
  }
  isOld: boolean
  disabled: boolean
}
interface gridType {
  columns: tableColumnType
  data: Array<patrolMasterType>
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
  popupParam: () => {
    return {
      saiPatrolId: '',
      isApprContent: false
    }
  },
  patrol: () => {
    return {
      saiPatrolId: '',
      plantCd: '',
      processCd: '',
      vendorCd: '',
      sopMapId: '',
      patrolTypeCd: '',
      patrolDate: '',
      patrolName: '',
      patrolResultCd: null,
      patrolResultSummary: '',
      patrolCompleteFlag: 'N',
      sopConstructionId: '',
      ramRiskAssessmentPlanId: '',
      approvalStatusCd: '',
      sysApprovalRequestId: '',
      regUserId: '',
      chgUserId: '',
      results: [],
      deleteResults: [],
      patrolImproveModelList: []
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'PATROL_RESULT',
      taskKey: ''
    }
  },
  isOld: false,
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
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'patrolItemName',
      field: 'patrolItemName',
      label: '점검항목',
      align: 'left',
      type: 'textarea',
      style: 'width:40%',
      sortable: false
    },
    {
      required: true,
      name: 'patrolResultCd',
      field: 'patrolResultCd',
      label: '점검결과',
      align: 'center',
      style: 'width:10%',
      type: 'select',
      codeGroupCd: 'PATROL_RESULT_CHECK_CD',
      setHeader: true,
      sortable: false
    },
    {
      name: 'patrolContents',
      field: 'patrolContents',
      label: '비고',
      align: 'left',
      type: 'textarea',
      style: 'width:20%',
      setHeader: true,
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '400px'
})
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
const apprBtn = ref<any>(null)
const saveType = ref('POST')
const resultItemUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const approvalUrl = ref('')
const isSave = ref(false)
const isApproval = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const requestContentsCols = computed(() => ['patrolItemName'])
const imprComponent = computed(() => {
  const components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  return components
})
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: props.patrol.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: props.patrol.approvalStatusCd,
    apprEditable: editable && props.isOld && !props.disabled, // 결재버튼 활성화 기준
    param: props.patrol, // 결재 param
    approvalUrl: approvalUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000019', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiPatrolId: props.patrol.saiPatrolId,
      isApprContent: true
    },
    approvalRequestName: props.patrol.patrolName, // 결재요청명 (문서 title)
    approvalConnId: props.patrol.saiPatrolId // 결재연결용 업무일련번호 (문서 key)
  }
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
  resultItemUrl.value = selectConfig.sai.patrol.resultItem.list.url
  saveUrl.value = transactionConfig.sai.patrol.insert.url
  deleteUrl.value = transactionConfig.sai.patrol.delete.url
  approvalUrl.value = transactionConfig.sai.patrol.update.url
  // code setting
  // list setting
}
const getDetail = () => {
  emits('getDetail')
}
const addResult = () => {
  props.patrol.results?.unshift({
    saiPatrolId: props.popupParam.saiPatrolId,
    saiPatrolResultId: uid(),
    patrolItemName: '',
    patrolResultCd: 'PRCC000001',
    patrolContents: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
const removeResult = () => {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!props.patrol.deleteResults) props.patrol.deleteResults = []
      if (
        _.findIndex(props.patrol.deleteResults, {
          saiPatrolResultId: item.saiPatrolResultId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.patrol.deleteResults.push(item)
      }
      props.patrol.results = _.reject(props.patrol.results, item)
    })
  }
}
const savePlan = () => {
  if (props.isOld) {
    saveUrl.value = transactionConfig.sai.patrol.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sai.patrol.insert.url
    saveType.value = 'POST'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.patrol.regUserId = user.value.userId
          props.patrol.chgUserId = user.value.userId
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
const saveCallback = (_result: any) => {
  message.requestSuccess()
  if (!props.isOld) {
    props.popupParam.saiPatrolId = _result?.data
    props.attachInfo.taskKey = _result?.data
    props.attachInfo.isSubmit = uid()
  }
  emits('getDetail')
}
const remove = () => {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiPatrolId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
// const datachange = (data: object) => {
//   message.confirm({
//     title: '확인',
//     message: '점검항목이 변경됩니다. 진행하시겠습니까?',
//     type: 'info', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       props.patrol.results = []
//       if (!data) return

//       $http({
//         url: resultItemUrl.value,
//         method: 'GET',
//         params: {
//           plantCd: data,
//           useFlag: 'Y'
//         }
//       }).then((_result: any) => {
//         _.forEach(_result.data, (_item) => {
//           props.patrol.results?.push({
//             saiPatrolId: props.popupParam.saiPatrolId,
//             saiPatrolResultId: uid(),
//             patrolItemName: _item.patrolItemName,
//             patrolResultCd: 'PRCC000001',
//             patrolContents: '',
//             regUserId: user.value.userId,
//             editFlag: 'C'
//           })
//         })
//       })
//     },
//     // 취소 callback 함수
//     cancelCallback: () => {}
//   })
// }
const approvalPatrol = () => {
  let isIng = true
  if (!props.patrol.results || props.patrol.results.length === 0) {
    message.alert({
      title: '안내',
      message:
        '업로드할 데이터가 없는 Sheet가 있습니다. 데이터 확인 또는 엑셀을 업로드 하였는지 확인바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    isIng = false
  }

  if (isIng) {
    editForm.value?.validate().then((_result: boolean) => {
      if (_result) {
        message.confirm({
          title: '확인',
          message: '결재요청 하기 전 입력된 값을 저장합니다.<br> 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            props.patrol.regUserId = user.value.userId
            props.patrol.chgUserId = user.value.userId
            isApproval.value = !isApproval.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.validError()
      }
    })
  }
}
const approvalPatrolCallback = () => {
  apprBtn.value.apprRequestPop()
}
const imprChange = () => {
  table.value.compoTable.resetVirtualScroll()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

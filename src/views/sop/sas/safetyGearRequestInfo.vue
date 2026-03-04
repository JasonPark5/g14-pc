<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card title="보호구 신청 상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <!-- [S]결재관련 버튼 -->
              <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
              <!-- param.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
              <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
              <!-- param.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
              <c-appr-btn
                ref="apprBtn"
                name="safety-gear-request-appr-btn"
                :editable="editable"
                :approvalInfo="approvalInfo"
                @beforeApprAction="saveDataAppr"
                @callbackApprAction="approvalCallback"
                @requestAfterAction="getDetail"
              />
              <c-btn
                v-if="editable && !disabled && isRemove"
                label="삭제"
                :editable="editable"
                icon="delete_forever"
                @btnClicked="removeData"
              />
              <c-btn
                v-if="editable && !disabled"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="safetyGear"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-34 col-lg-3 col-xl-3">
              <c-plant
                type="edit"
                :required="true"
                label="사업장"
                :disabled="disabled"
                :editable="editable"
                name="plantCd"
                v-model:value="safetyGear.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-34 col-lg-3 col-xl-3">
              <c-dept
                :required="true"
                label="신청부서"
                :disabled="disabled"
                :editable="editable"
                name="requestDeptCd"
                v-model:value="safetyGear.requestDeptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-34 col-lg-3 col-xl-3">
              <c-field
                type="user"
                :required="true"
                label="신청자"
                :disabled="disabled"
                :editable="editable"
                name="requestUserId"
                v-model:value="safetyGear.requestUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-34 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                label="신청일"
                :disabled="disabled"
                :editable="editable"
                name="requestDate"
                default="today"
                v-model:value="safetyGear.requestDate"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="보호구 신청 목록"
        :columns="grid.columns"
        :data="safetyGear.detailList"
        :merge="grid.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="editable && !disabled"
        gridHeight="630px"
        selection="multiple"
        rowKey="requestListId"
      >
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addGear" />
              <c-btn
                v-if="editable && !disabled && safetyGear.detailList!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="removeGear"
              />
            </q-btn-group>
          </div>
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
import { safetyGearType } from './safetyGear'

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
  name: 'safetyGearRequestInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    requestGiveInfoId?: stringNull
    stepCd?: stringNull
    plantCd?: stringNull
    giveTypeCd?: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      requestGiveInfoId: '',
      stepCd: '',
      plantCd: '',
      giveTypeCd: ''
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const safetyGear = ref<safetyGearType>({
  plantCd: null,
  requestDate: '',
  requestDeptCd: '',
  requestUserId: '',
  giveDate: '',
  giveTypeCd: '',
  giveDeptCd: '',
  giveUserId: '',
  sysApprovalRequestId: '',
  detailList: [],
  deleteDetailList: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'safetyTypeName',
      field: 'safetyTypeName',
      label: '보호구종류',
      style: 'width:120px',
      align: 'center',
      setHeader: true,
      sortable: false
    },
    {
      name: 'safetyGearName',
      field: 'safetyGearName',
      label: '보호구명',
      style: 'width:200px',
      align: 'left',
      setHeader: true,
      sortable: false
    },
    {
      required: true,
      name: 'requestCount',
      field: 'requestCount',
      label: '신청수량',
      style: 'width:80px',
      align: 'right',
      type: 'number',
      setHeader: true,
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      style: 'width:350px',
      align: 'left',
      type: 'text',
      setHeader: true,
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const isApproval = ref(false)
const mappingType = ref('POST')
const getUrl = ref('')
const saveUrl = ref(transactionConfig.sop.sas.request.insert.url)
const deleteUrl = ref('')
const apprBtn = ref<any>(null)
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: safetyGear.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: safetyGear.value.approvalStatusCd,
    apprEditable: safetyGear.value.statusCd === 'SSC0000001', // 결재버튼 활성화 기준
    param: safetyGear.value, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000012', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      requestGiveInfoId: safetyGear.value.requestGiveInfoId,
      isApprContent: true
    },
    approvalRequestName: safetyGear.value.requestDate + ' ' + '보호구 신청', // 결재요청명 (문서 title)
    approvalConnId: safetyGear.value.requestGiveInfoId // 결재연결용 업무일련번호 (문서 key)
  }
})
const disabled = computed(
  () =>
    props.param.stepCd === 'SSC0000005' ||
    props.param.stepCd === 'SSC0000010' ||
    props.param.stepCd === 'SSC0000015' ||
    safetyGear.value.approvalStatusCd === 'ASC0000001'
)
const isRemove = computed(
  () => Boolean(props.param.requestGiveInfoId) && Boolean(!safetyGear.value.sysApprovalRequestId)
)

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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  getUrl.value = selectConfig.sop.sas.request.get.url
  deleteUrl.value = transactionConfig.sop.sas.request.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.param.requestGiveInfoId) {
    $http({
      url: $format(getUrl.value, props.param.requestGiveInfoId),
      method: 'GET'
    }).then((_result: any) => {
      safetyGear.value = _result.data
    })
  } else safetyGear.value.requestUserId = user.value.userId
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function saveData() {
  if (safetyGear.value.requestGiveInfoId) {
    safetyGear.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    safetyGear.value.regUserId = user.value.userId
    safetyGear.value.giveTypeCd = props.param.giveTypeCd
    mappingType.value = 'POST'
  }
  if (!safetyGear.value.detailList || safetyGear.value.detailList.length === 0) {
    message.alert({
      title: '안내',
      message: '신청할 보호구를 하나 이상 등록하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  } else {
    editForm.value.validate().then((_result: boolean) => {
      if (
        _result &&
        safetyGear.value.detailList &&
        validTable(grid.value.columns, safetyGear.value.detailList)
      ) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            safetyGear.value.statusCd = 'SSC0000001'
            isSave.value = !isSave.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
    })
  }
}
function saveCallback(result: any) {
  props.param.requestGiveInfoId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 결재요청 전 저장 및 결재팝업 열기
 *******************************/
function saveDataAppr() {
  if (safetyGear.value.detailList?.length === 0) {
    message.alert({
      title: '안내',
      message: '신청할 보호구를 하나 이상 등록하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  } else {
    editForm.value.validate().then((_result: boolean) => {
      if (
        _result &&
        safetyGear.value.detailList &&
        validTable(grid.value.columns, safetyGear.value.detailList)
      ) {
        message.confirm({
          title: '확인',
          message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            safetyGear.value.regUserId = user.value.userId
            safetyGear.value.chgUserId = user.value.userId
            isApproval.value = !isApproval.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
    })
  }
}
function approvalCallback() {
  apprBtn.value.apprRequestPop()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.requestGiveInfoId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('emitStep', {
          name: 'closePopup',
          param: {}
        })
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addGear() {
  popupOptions.value = getPopupOptions('safetyGear', popupOptions.value, closePopup, {
    type: 'multiple',
    searchParam: { plantCd: safetyGear.value.plantCd }
  })
}
function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(safetyGear.value.detailList, { safetyGearId: item.safetyGearId }) === -1) {
        safetyGear.value.detailList!.push({
          requestListId: uid(),
          requestGiveInfoId: props.param.requestGiveInfoId,
          safetyGearId: item.safetyGearId,
          safetyTypeName: item.safetyTypeName,
          safetyGearName: item.safetyGearName,
          requestCount: '',
          remarks: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 선택 삭제
 *******************************/
function removeGear() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        if (!safetyGear.value.deleteDetailList) safetyGear.value.deleteDetailList = []
        _.forEach(selectData, (item) => {
          if (
            _.findIndex(safetyGear.value.deleteDetailList, {
              requestListId: item.requestListId
            }) === -1 &&
            item.editFlag !== 'C'
          )
            safetyGear.value.deleteDetailList!.push(item)
          safetyGear.value.detailList = _.reject(safetyGear.value.detailList, item)
        })
        table.value.compoTable.clearSelection()
      },
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

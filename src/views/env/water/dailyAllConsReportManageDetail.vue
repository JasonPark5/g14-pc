<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- param.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- param.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <c-appr-btn
                  ref="apprBtn"
                  :editable="editable"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="saveDataAppr"
                  @callbackApprAction="approvalCallback"
                  @requestAfterAction="getDetail"
                />
                <c-btn
                  v-if="editable && updateMode && !allConsReportData.approvalStatusCd"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable && !allConsReportData.approvalStatusCd"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="allConsReportData"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="등록일자"
                  name="dailyResultDt"
                  v-model:value="allConsReportData.dailyResultDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-field
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  :data="allConsReportData"
                  deptValue="deptCd"
                  type="dept_user"
                  label="작성부서 & 작성자"
                  name="userId"
                  v-model:value="allConsReportData.userId"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-plant
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="allConsReportData.plantCd"
                  @datachange="getAdditives"
                />
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <!-- 기존 높이 300 -->
          <c-table
            ref="table"
            title="폐수 전량위탁 처리정보"
            :columns="grid.columns"
            :data="grid.data"
            :usePaging="false"
            :hideBottom="true"
            :columnSetting="false"
            :isFullScreen="false"
            :filtering="false"
            :isExcelDown="false"
            :editable="editable && !disabled"
            gridHeight="170px"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <!-- 기존 높이 300 -->
          <c-table
            ref="table1"
            title="원료 또는 첨가제 등의 사용량"
            :columns="grid1.columns"
            :data="allConsReportData.waterEntrustResultAdditives"
            :usePaging="false"
            :hideBottom="true"
            :columnSetting="false"
            :filtering="false"
            :isExcelDown="false"
            :editable="editable && !disabled"
            gridHeight="320px"
          />
        </div>
      </div>
    </q-form>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dailyAllConsReportManageDetail'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envWaterEntrustResultId: stringNull
    plantCd: stringNull
    approvalStatusCd: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
  popupParam: () => {
    return {
      envWaterEntrustResultId: '',
      plantCd: null,
      approvalStatusCd: null
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
const allConsReportData = ref<any>({
  plantCd: '',
  envWaterEntrustResultId: '',
  dailyResultDt: '',
  deptCd: '',
  userId: '',
  oprStartDt: '',
  oprEndDt: '',
  useAmount: '',
  wasteAmount: '',
  entrustAmount: '',
  preAmount: '',
  stoAmount: '',
  entrustNo: '',
  entrustVendorName: '',
  remark: '',
  waterEntrustResultAdditives: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'oprTime',
      field: 'oprTime',
      label: '가동시간(시작 ~ 종료)',
      align: 'center',
      sortable: false,
      type: 'datetime',
      minuteStep: 10,
      range: true,
      style: 'width:120px'
    },
    {
      name: 'useAmount',
      field: 'useAmount',
      label: '용수사용량(L)',
      align: 'center',
      sortable: false,
      type: 'number',
      style: 'width:120px'
    },
    {
      name: 'wasteAmount',
      field: 'wasteAmount',
      label: '폐수발생량(L)',
      align: 'center',
      sortable: false,
      type: 'number',
      style: 'width:120px'
    },
    {
      label: '폐수 위탁처리',
      align: 'center',
      child: [
        {
          name: 'entrustAmount',
          field: 'entrustAmount',
          label: '위탁량(L)',
          align: 'center',
          sortable: false,
          type: 'number',
          style: 'width:120px'
        },
        {
          name: 'entrustNo',
          field: 'entrustNo',
          label: '위탁ㆍ수탁 확인서<br>일련번호',
          align: 'center',
          sortable: false,
          type: 'text',
          style: 'width:160px'
        },
        {
          name: 'entrustVendorName',
          field: 'entrustVendorName',
          label: '처리업소명',
          align: 'center',
          sortable: false,
          type: 'text',
          style: 'width:150px'
        }
      ]
    },
    {
      name: 'stoAmount',
      field: 'stoAmount',
      label: '보관폐수량(L)',
      align: 'center',
      sortable: false,
      type: 'number',
      style: 'width:120px'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '기타 중요사항',
      align: 'left',
      sortable: false,
      type: 'text',
      style: 'width:200px'
    }
  ],
  data: []
})
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'envWaterMstAdditiveName',
      field: 'envWaterMstAdditiveName',
      label: '원료/첨가제 명',
      align: 'center',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'useAmount',
      field: 'useAmount',
      label: '사용량(kg)',
      align: 'center',
      type: 'number',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const mappingType = ref('POST')
const saveUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const detailUrl = ref('')
const additiveUrl = ref('')
const isSave = ref(false)
const updateMode = ref(false) // 수정모드
const isApproval = ref(false)
const apprBtn = ref<any>(null)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return props.popupParam.approvalStatusCd === 'ASC9999999'
})
const approvalInfo = computed(() => {
  return {
    // 결재요청번호
    sysApprovalRequestId: allConsReportData.value.sysApprovalRequestId,
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: allConsReportData.value.approvalStatusCd,
    apprEditable:
      allConsReportData.value.approvalStatusCd === null ||
      allConsReportData.value.approvalStatusCd == 'ASC0000001', // 결재버튼 활성화 기준
    param: allConsReportData.value, // 결재 param
    approvalUrl: updateUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000015', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      envWaterEntrustResultId: props.popupParam.envWaterEntrustResultId,
      plantCd: props.popupParam.plantCd,
      isFullScreen: false
    },
    approvalRequestName: '폐수전량위탁운영일지 [' + allConsReportData.value.dailyResultDt + ']', // 결재요청명 (문서 title)
    approvalConnId: props.popupParam.envWaterEntrustResultId // 결재연결용 업무일련번호 (문서 key)
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
  detailUrl.value = selectConfig.env.water.entrust.result.get.url
  additiveUrl.value = selectConfig.env.water.entrust.additive.list.url
  saveUrl.value = transactionConfig.env.water.entrust.result.insert.url
  updateUrl.value = transactionConfig.env.water.entrust.result.update.url
  deleteUrl.value = transactionConfig.env.water.entrust.result.delete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적):폐수 전량위탁 처리정보 세팅
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterEntrustResultId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        envWaterEntrustResultId: props.popupParam.envWaterEntrustResultId,
        plantCd: props.popupParam.plantCd
      }
    }).then((_result: any) => {
      _result.data.oprTime = [_result.data.oprStartDt, _result.data.oprEndDt]
      allConsReportData.value = _result.data
      updateMode.value = true
      grid.value.data = []
      grid.value.data.push(allConsReportData.value)
      grid1.value.data = allConsReportData.value.waterEntrustResultAdditives
    })
  } else {
    grid.value.data = [
      {
        plantCd: allConsReportData.value.plantCd, // 사업장코드
        envWaterEntrustResultId: '', // 폐수전량위탁운영일지 일련번호
        dailyResultDt: getToday(), // 작성일
        deptCd: user.value.deptCd, // 작성부서
        userId: user.value.userId, // 작성자
        oprStartDt: '', // 가동시작시간
        oprEndDt: '', // 가동종료시간
        useAmount: '', // 용수사용량
        wasteAmount: '', // 폐수발생량
        entrustAmount: '', // 위탁량
        preAmount: '', // 전일보관폐수량
        stoAmount: '', // 보관폐수량
        entrustNo: '', // 위탁수탁확인서일련번호
        entrustVendorName: '', // 처리업소명
        remark: '' // 기타 중요사항
      }
    ]
    allConsReportData.value.dailyResultDt = getToday()
    allConsReportData.value.deptCd = user.value.deptCd
    allConsReportData.value.userId = user.value.userId
    //getAdditives(allConsReportData.plantCd)
  }
}
/******************************
 * TODO (목적):
 *******************************/
function saveDataAppr() {
  message.confirm({
    title: '확인',
    message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      allConsReportData.value.chgUserId = user.value.deptCd
      allConsReportData.value.regUserId = user.value.userId
      const promises = [
        {
          func: approvalValue
        }
      ]
      orderedPromise(promises)
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 결재관련 결재요청버튼 callback
 *******************************/
function approvalCallback() {
  apprBtn.value.apprRequestPop()
}
/******************************
 * TODO (목적):
 *******************************/
function approvalValue() {
  return new Promise((resolve) => {
    isApproval.value = !isApproval.value
    resolve(true)
  })
}
// /******************************
//  * TODO (목적):
//  *******************************/
// function getAdditives(plantCd: string) {
//   $http({
//     url: additiveUrl.value,
//     method: 'GET',
//     params: { plantCd: plantCd }
//   }).then((_result: any) => {
//     _result.data = _.map(_result.data, (item) => {
//       return _.extend(item, {
//         regUserId: user.value.userId
//       })
//     })
//     allConsReportData.value.waterEntrustResultAdditives = _result.data
//   })
// }
/******************************
 * TODO (목적): 저장 버튼 이벤트
 *******************************/
function saveInfo() {
  if (props.popupParam.envWaterEntrustResultId) {
    saveUrl.value = transactionConfig.env.water.entrust.result.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.env.water.entrust.result.insert.url
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          allConsReportData.value.regUserId = user.value.userId
          allConsReportData.value.chgUserId = user.value.userId
          allConsReportData.value.oprStartDt =
            grid.value.data![0].oprTime && grid.value.data![0].oprTime.length > 0
              ? grid.value.data![0].oprTime[0]
              : '' // 가동시작시간
          allConsReportData.value.oprEndDt =
            grid.value.data![0].oprTime && grid.value.data![0].oprTime.length > 0
              ? grid.value.data![0].oprTime[1]
              : '' // 가동종료시간
          allConsReportData.value.useAmount = grid.value.data![0].useAmount // 용수사용량
          allConsReportData.value.wasteAmount = grid.value.data![0].wasteAmount // 폐수발생량
          allConsReportData.value.entrustAmount = grid.value.data![0].entrustAmount // 위탁량
          allConsReportData.value.preAmount = grid.value.data![0].preAmount // 전일보관폐수량
          allConsReportData.value.stoAmount = grid.value.data![0].stoAmount // 보관폐수량
          allConsReportData.value.entrustNo = grid.value.data![0].entrustNo // 위탁수탁확인서일련번호
          allConsReportData.value.entrustVendorName = grid.value.data![0].entrustVendorName // 처리업소명
          allConsReportData.value.remark = grid.value.data![0].remark // 기타 중요사항
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
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  props.popupParam.envWaterEntrustResultId = result.data.envWaterEntrustResultId
  props.popupParam.plantCd = result.data.plantCd
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 삭제버튼 이벤트
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '일지 전체 내용이 삭제됩니다.\r\n삭제하시겠습니까?',

    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envWaterEntrustResultId),
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
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

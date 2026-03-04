<template>
  <div>
    <q-form ref="editForm">
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
                name="safety-gear-request-appr-btn"
                :editable="editable"
                :approvalInfo="approvalInfo"
                @beforeApprAction="saveDataAppr"
                @callbackApprAction="approvalCallback"
                @requestAfterAction="getDetail"
              />
              <c-btn
                v-if="
                  editable &&
                  dailyReportData.envWaterDailyResultId &&
                  !dailyReportData.approvalStatusCd
                "
                label="삭제"
                icon="delete"
                @btnClicked="deleteData"
              />
              <c-btn
                v-if="editable && !disabled"
                :url="saveUrl"
                :isSubmit="isSave1"
                :param="dailyReportData"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveInfo"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant
                :required="true"
                :editable="editable"
                :disabled="Boolean(popupParam.envWaterDailyResultId)"
                type="edit"
                name="plantCd"
                v-model:value="dailyReportData.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                :required="true"
                :editable="editable"
                :disabled="Boolean(popupParam.envWaterDailyResultG14Id)"
                label="작성일자"
                default="today"
                name="dailyResultDt"
                v-model:value="dailyReportData.dailyResultDt"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
              <c-dept
                :required="true"
                :editable="editable"
                :disabled="true"
                label="부서"
                name="deptCd"
                v-model:value="dailyReportData.deptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-field
                :required="true"
                ::editable="editable"
                :disabled="disabled"
                label="작성자"
                name="userId"
                v-model:value="dailyReportData.userId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                :rows="2"
                label="기타 중요사항"
                name="remark"
                v-model:value="dailyReportData.remark"
              />
            </div>
          </template>
        </c-card>
        <c-table
          ref="table1"
          title="가동시간"
          :columns="grid1.columns"
          :data="grid1.data"
          gridHeight="250px"
          :columnSetting="false"
          :filtering="false"
          :usePaging="false"
          :hideBottom="true"
          @table-data-change="tableDataChange"
        />
        <c-table
          ref="table2"
          title="용수사용량 및 폐수발생량"
          :columns="grid2.columns"
          :data="grid2.data"
          :gridHeight="gridHeight"
          :columnSetting="false"
          :filtering="false"
          :usePaging="false"
          @table-data-change="tableDataChange"
        >
          <template v-slot:suffixTitle>
            <span
              v-if="!Boolean(props.popupParam.envWaterDailyResultG14Id)"
              style="font-size: 0.8em; font-weight: 500; color: tomato"
            >
              용수사용량 및 폐수발생량 입력은 일지 생성 후 가능합니다.
            </span>
          </template>
        </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dailyWaterReportDetail'
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
const emits = defineEmits(['closePopup', 'saveCallback', 'research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envWaterDailyResultG14Id?: stringNull
    dailyResultDt?: stringNull
    plantCd: stringNull
    approvalStatusCd: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  columns?: Array<tableColumnType>
  data?: Array<any>
  merge?: Array<tableMergeType>
  height?: string
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
  popupParam: () => {
    return {
      envWaterDailyResultG14Id: '',
      dailyResultDt: '',
      plantCd: null,
      approvalStatusCd: null
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const dailyReportData = ref<any>({
  envWaterDailyResultG14Id: null,
  dailyResultDt: null,
  dayOfWeek: null,
  deptCd: null,
  userId: null,
  dailyResultStatuCd: null,
  plantCd: '1000',
  startTime: null,
  endTime: null,
  scrubberA: null,
  sinkB: null,
  sinkC: null,
  waterUsage: null,
  wasteWater: null,
  remark: null,
  time00: 'N',
  time01: 'N',
  time02: 'N',
  time03: 'N',
  time04: 'N',
  time05: 'N',
  time06: 'N',
  time07: 'N',
  time08: 'N',
  time09: 'N',
  time10: 'N',
  time11: 'N',
  time12: 'N',
  time13: 'N',
  time14: 'N',
  time15: 'N',
  time16: 'N',
  time17: 'N',
  time18: 'N',
  time19: 'N',
  time20: 'N',
  time21: 'N',
  time22: 'N',
  time23: 'N',
  all: 'N'
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  widht: '80%',
  target: null,
  title: '',
  visible: false,
  top: '',
  param: {},
  closeCallback: () => {}
})
const timeColumns = Array.from({ length: 24 }, (_, i) => {
  const idx = String(i).padStart(2, '0')

  return {
    name: `time${idx}`,
    field: `time${idx}`,
    label: idx,
    type: 'check',
    style: 'width:60px',
    true: 'Y',
    false: 'N',
    value: 'N',
    align: 'center',
    sortable: false
  }
})
const grid1 = ref<gridType>({
  columns: [
    ...timeColumns,
    {
      name: 'all',
      field: 'all',
      label: '전체선택',
      style: 'width:60px',
      type: 'check',
      align: 'center',
      true: 'Y',
      false: 'N',
      value: 'N',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'prevScrubberA',
      field: 'prevScrubberA',
      label: '전일지침A(스크러버)',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'scrubberA',
      field: 'scrubberA',
      label: '금일지침A(스크러버)',
      style: 'width:100px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'prevSinkB',
      field: 'prevSinkB',
      label: '전일지침B(싱크대-1번)',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'sinkB',
      field: 'sinkB',
      label: '금일지침B(싱크대-1번)',
      style: 'width:100px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'prevSinkC',
      field: 'prevSinkC',
      label: '전일지침C(싱크대-2번)',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'sinkC',
      field: 'sinkC',
      label: '금일지침C(싱크대-2번)',
      style: 'width:100px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'waterUsage',
      field: 'waterUsage',
      label: '용수사용량(A+B+C)',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'wasteWater',
      field: 'wasteWater',
      label: '폐수발생량(m3)',
      style: 'width:100px',
      align: 'center',
      type: 'number',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const saveUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const checkUrl = ref('')
const sejongDeptCdUrl = ref('')
const mappingType = ref('POST')
const deleteUrl = ref('')
const isSave1 = ref(false)
const detailUrl = ref('')
const editForm = ref<any>(null)
const isApproval = ref(false)
const apprBtn = ref<any>(null)
const isSyncingGrid1 = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return (
    dailyReportData.value.approvalStatusCd === 'ASC0000001' ||
    dailyReportData.value.approvalStatusCd === 'ASC9999999'
  )
})
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 480 + 'px' : '320px'
)

const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: dailyReportData.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: dailyReportData.value.approvalStatusCd,
    apprEditable:
      dailyReportData.value.approvalStatusCd === null ||
      dailyReportData.value.approvalStatusCd == 'ASC0000001', // 결재버튼 활성화 기준
    param: dailyReportData.value, // 결재 param
    approvalUrl: updateUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000014', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      envWaterDailyResultG14Id: props.popupParam.envWaterDailyResultG14Id,
      plantCd: props.popupParam.plantCd
    },
    approvalRequestName: $language('수질일지') + ' [' + dailyReportData.value.dailyResultDt + ']', // 결재요청명 (문서 title)
    approvalConnId: props.popupParam.envWaterDailyResultG14Id // 결재연결용 업무일련번호 (문서 key)
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
  detailUrl.value = selectConfig.env.water.daily.resultG14.get.url
  saveUrl.value = transactionConfig.env.water.daily.resultG14.insert.url
  insertUrl.value = transactionConfig.env.water.daily.resultG14.insert.url
  updateUrl.value = transactionConfig.env.water.daily.resultG14.update.url
  deleteUrl.value = transactionConfig.env.water.daily.resultG14.delete.url
  checkUrl.value = selectConfig.env.water.daily.resultG14.check.url
  sejongDeptCdUrl.value = selectConfig.sys.env.get.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적):조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterDailyResultG14Id) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        envWaterDailyResultG14Id: props.popupParam.envWaterDailyResultG14Id
      }
    }).then((_result: any) => {
      dailyReportData.value = _result.data
      syncAllByTimes()
      grid1.value.data = [dailyReportData.value]
      grid2.value.data = [dailyReportData.value]
    })
  } else {
    getSejongDeptCd()
    dailyReportData.value.userId = user.value.userId
    grid1.value.data = [dailyReportData.value]
  }
}

function getSejongDeptCd() {
  $http({
    url: $format(sejongDeptCdUrl.value, 'ENV_SEJONG_DEPT_CD'),
    method: 'GET'
  }).then((_result: any) => {
    dailyReportData.value.deptCd = _result.data.attrVal01
  })
}

function syncAllByTimes() {
  const timeFields = timeColumns.map((c) => c.name) // time00~time23
  const allChecked = timeFields.every((tf) => dailyReportData.value[tf] === 'Y')
  dailyReportData.value.all = allChecked ? 'Y' : 'N'
}

/******************************
 * TODO (목적): 용수사용량 계산
 *******************************/
function recalcWaterUsage() {
  const a = Number(dailyReportData.value.scrubberA) - Number(dailyReportData.value.prevScrubberA)
  const b = Number(dailyReportData.value.sinkB) - Number(dailyReportData.value.prevSinkB)
  const c = Number(dailyReportData.value.sinkC) - Number(dailyReportData.value.prevSinkC)

  dailyReportData.value.waterUsage = a + b + c
}

/******************************
 * TODO (목적): 테이블 데이터 변경 로직
 *******************************/
function tableDataChange(_props: any, col: any) {
  const row = _props?.row
  const field = col?.name
  if (!row || !field) return

  // ✅ grid2: 금일지침 값이 바뀌면 waterUsage 재계산
  if (field === 'scrubberA' || field === 'sinkB' || field === 'sinkC') {
    recalcWaterUsage()
    return
  }

  if (isSyncingGrid1.value) return
  isSyncingGrid1.value = true

  try {
    const timeFields = timeColumns.map((c) => c.name) // time00 ~ time23

    // 전체선택 클릭
    if (field === 'all') {
      const newVal = row.all === 'Y' ? 'Y' : 'N'
      timeFields.forEach((tf) => (row[tf] = newVal))
      row.all = newVal
      return
    }

    // 개별 체크 클릭 -> 전체선택 상태 갱신
    if (timeFields.includes(field)) {
      const allChecked = timeFields.every((tf) => row[tf] === 'Y')
      row.all = allChecked ? 'Y' : 'N'
      return
    }
  } finally {
    isSyncingGrid1.value = false
  }
}

/******************************
 * TODO (목적): 결제요청/결재처리 콜백
 *******************************/
function saveDataAppr() {
  message.confirm({
    title: '확인',
    message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      dailyReportData.value.regUserId = user.value.userId
      dailyReportData.value.chgUserId = user.value.userId
      isApproval.value = !isApproval.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}

/******************************
 * TODO (목적): 결재요청
 *******************************/
function approvalCallback() {
  apprBtn.value.apprRequestPop() // 결재관련 결재요청버튼 callback
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (dailyReportData.value.envWaterDailyResultG14Id) {
    dailyReportData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
    mappingType.value = 'PUT'
  } else {
    dailyReportData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (!dailyReportData.value.envWaterDailyResultG14Id) {
        $http({
          url: checkUrl.value,
          method: 'GET',
          params: {
            dailyResultDt: dailyReportData.value.dailyResultDt,
            deptCd: dailyReportData.value.deptCd
          }
        }).then((_result: any) => {
          if (_result.data === 0) {
            message.confirm({
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                isSave1.value = !isSave1.value
              },
              // 취소 callback 함수
              cancelCallback: () => {}
            })
          } else {
            message.alert({
              title: '안내',
              message: '해당 날짜로 생성된 일지가 존재합니다.',
              type: 'warning' // success / info / warning / error
            })
          }
        })
      } else {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            isSave1.value = !isSave1.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}

/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  props.popupParam.envWaterDailyResultG14Id = result.data
  message.requestSuccess()
  getDetail()
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '일지전체 내용이 삭제됩니다.\r\n삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, dailyReportData.value.envWaterDailyResultId),
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

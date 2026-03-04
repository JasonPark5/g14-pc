<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
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
                  v-if="editable && dailyReportData.approvalStatusCd"
                  label="일지출력"
                  color="amber-7"
                  @btnClicked="print"
                  icon="print"
                />
                <c-btn
                  v-if="editable && popupParam.envWaterDailyResultId"
                  label="전체화면 보기"
                  @btnClicked="fullScreenReport"
                  icon="receipt_long"
                />
                <c-btn
                  v-if="editable && updateMode && !dailyReportData.approvalStatusCd"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable && !dailyReportData.approvalStatusCd"
                  :url="saveUrl"
                  :isSubmit="isSave"
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
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-datepicker
                  :required="true"
                  :editable="editable && !updateMode"
                  label="등록일자"
                  name="dailyResultDt"
                  v-model:value="dailyReportData.dailyResultDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-field
                  :required="true"
                  :editable="editable"
                  :data="dailyReportData"
                  deptValue="deptCd"
                  type="dept_user"
                  label="작성부서 & 작성자"
                  name="userId"
                  v-model:value="dailyReportData.userId"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-plant
                  :required="true"
                  :editable="editable && !updateMode"
                  type="edit"
                  name="plantCd"
                  v-model:value="dailyReportData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="WEATHER_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="weatherCd"
                  label="날씨"
                  v-model:value="dailyReportData.weatherCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="온도"
                  suffix="℃"
                  name="temperature"
                  v-model:value="dailyReportData.temperature"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="table"
            title="근무자 목록"
            :columns="grid.columns"
            :data="dailyReportData.dailyUsers"
            :usePaging="false"
            :hideBottom="true"
            :columnSetting="false"
            :isFullScreen="false"
            :filtering="false"
            :isExcelDown="false"
            selection="multiple"
            rowKey="envWaterDailyResultUserId"
            gridHeight="190px"
            :editable="editable && !dailyReportData.approvalStatusCd"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !dailyReportData.approvalStatusCd && !updateMode"
                  label="이전일 근무자"
                  icon="add"
                  @btnClicked="addUserPrev(false)"
                />
                <c-btn
                  v-if="editable && !dailyReportData.approvalStatusCd"
                  label=""
                  icon="add"
                  @btnClicked="addUser"
                />
                <c-btn
                  v-if="editable && !dailyReportData.approvalStatusCd"
                  label=""
                  icon="remove"
                  @btnClicked="removeUser"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 tabvertical"
          v-if="popupParam.envWaterDailyResultId"
        >
          <c-tab
            type="vertical"
            :tabItems="tabItems"
            dense
            inlineLabel
            v-model:value="tab"
            align="left"
            :height="tabHeight"
            :splitter="splitter"
            tabClassVertical="leftTabAlign"
          >
            <template v-slot:default="tab">
              <component :is="tab.component" :param="popupParam" />
            </template>
          </c-tab>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dailyReportManageDetail'
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
    envWaterDailyResultId: ''
    isFullScreen: Boolean
    plantCd: stringNull
    dailyResultDt: stringNull
    approvalStatusCd: stringNull
  }
  contentHeight?: stringNull
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
      envWaterDailyResultId: '',
      isFullScreen: false,
      plantCd: null,
      dailyResultDt: '',
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
  plantCd: null, // 사업장코드
  envWaterDailyResultId: '', // 수질일지 일련번호
  dailyResultDt: '', // 작성일
  deptCd: '', // 작성부서
  userId: '', // 작성자
  weatherCd: null, // 날씨
  temperature: '', // 온도
  approvalStatusCd: '',
  dailyUsers: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  widht: '80%',
  top: '',
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  columns: [
    {
      name: 'userName',
      field: 'userName',
      label: '근무자',
      align: 'center',
      style: 'width:40%',
      sortable: false
    },
    {
      name: 'startTime',
      field: 'startTime',
      label: '근무시작시간',
      align: 'center',
      type: 'datetime',
      minuteStep: 10,
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'endTime',
      field: 'endTime',
      label: '근무종료시간',
      align: 'center',
      type: 'datetime',
      minuteStep: 10,
      style: 'width:30%',
      sortable: false
    }
  ]
})
const table = ref<any>(null)
const tab = ref('tab1')
const editable = ref(true)
const saveUrl = ref('')
const mappingType = ref('POST')
const updateUrl = ref('')
const deleteUrl = ref('')
const deleteUserUrl = ref('')
const printUrl = ref('')
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const isApproval = ref(false)
const apprBtn = ref<any>(null)
const editForm = ref<any>(null)
const splitter = ref({ data: 250 })
const tabItems = ref([
  {
    name: 'tab1',
    label: '1. 폐수배출시설 가동(조업)시간대',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport01.vue`))),
    key: uid()
  },
  {
    name: 'tab2',
    label: '2. 수질오염방지시설 가동시간대',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport02.vue`))),
    key: uid()
  },
  {
    name: 'tab3',
    label: '3. 용수 공급원별 사용량과 폐수배출량',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport03.vue`))),
    key: uid()
  },
  {
    name: 'tab4',
    label: '4. 슬러지의 발생량 및 처리량',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport04.vue`))),
    key: uid()
  },
  // {
  //   name: 'tab5',
  //   label: '5. 원료 또는 첨가제 등의 사용량',
  //   component: shallowRef(defineAsyncComponent(() => import(`./dailyReport05.vue`))),
  //   key: uid()
  // },
  {
    name: 'tab6',
    label: '5. 전력사용량',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport06.vue`))),
    key: uid()
  },
  {
    name: 'tab7',
    label: '6. 약품사용량',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport07.vue`))),
    key: uid()
  },
  // {
  //   name: 'tab8',
  //   label: '8. 폭기조 운전상태',
  //   component: shallowRef(defineAsyncComponent(() => import(`./dailyReport08.vue`))),
  //   key: uid()
  // },
  {
    name: 'tab9',
    label: '7. 수질오염방지시설 고장 유무',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport09.vue`))),
    key: uid()
  },
  {
    name: 'tab10',
    label: '8. 수질오염물질 측정내용',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport10.vue`))),
    key: uid()
  },
  // {
  //   name: 'tab11',
  //   label: '11. 측정항목별 점검내용',
  //   component: shallowRef(defineAsyncComponent(() => import(`./dailyReport11.vue`))),
  //   key: uid()
  // },
  {
    name: 'tab12',
    label: '9. 지도ㆍ점검을 받은 사항',
    component: shallowRef(defineAsyncComponent(() => import(`./dailyReport12.vue`))),
    key: uid()
  }
])
/******************************
 * @Computed_선언
 *******************************/
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
      envWaterDailyResultId: props.popupParam.envWaterDailyResultId,
      plantCd: props.popupParam.plantCd,
      isFullScreen: false
    },
    approvalRequestName: $language('수질일지') + ' [' + dailyReportData.value.dailyResultDt + ']', // 결재요청명 (문서 title)
    approvalConnId: props.popupParam.envWaterDailyResultId // 결재연결용 업무일련번호 (문서 key)
  }
})
const tabHeight = computed(() => {
  // const numHeight = props.contentHeight ? Number(_.replace(props.contentHeight, 'px', '')) : 220
  const numHeight = props.contentHeight - 220
  return numHeight + 'px'
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
  detailUrl.value = selectConfig.env.water.daily.result.get.url
  printUrl.value = selectConfig.env.water.daily.result.print.url
  saveUrl.value = transactionConfig.env.water.daily.result.insert.url
  updateUrl.value = transactionConfig.env.water.daily.result.update.url
  deleteUrl.value = transactionConfig.env.water.daily.result.delete.url
  deleteUserUrl.value = transactionConfig.env.water.daily.user.delete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적):조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterDailyResultId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        envWaterDailyResultId: props.popupParam.envWaterDailyResultId
      }
    }).then((_result: any) => {
      dailyReportData.value = _result.data
      updateMode.value = true
      props.popupParam.plantCd = dailyReportData.value.plantCd
      props.popupParam.dailyResultDt = dailyReportData.value.dailyResultDt
      props.popupParam.approvalStatusCd = dailyReportData.value.approvalStatusCd
    })
  } else {
    dailyReportData.value.dailyResultDt = getToday()
    dailyReportData.value.userId = user.value.userId
    dailyReportData.value.deptCd = user.value.deptCd
    addUserPrev(true)
  }
}

/******************************
 * TODO (목적): 이전일 근무자 추가
 *******************************/
function addUserPrev(_isFirst: boolean) {
  $http({
    url: selectConfig.env.water.daily.user.list.url + '/prev',
    method: 'GET',
    params: {
      dailyResultDt: dailyReportData.value.dailyResultDt,
      plantCd: dailyReportData.value.plantCd
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      if (dailyReportData.value.dailyUsers.length > 0) {
        message.confirm({
          title: '확인',
          message: '추가한 기존 근무자는 삭제됩니다.\r\n이전일 근무자목록을 추가하시겠습니까?',
          type: 'warning', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            dailyReportData.value.dailyUsers = []
            _.forEach(_result.data, (_item) => {
              dailyReportData.value.dailyUsers.push({
                envWaterDailyResultId: uid(),
                envWaterDailyResultUserId: uid(),
                userId: _item.userId,
                userName: _item.userName,
                startTime: _item.startTime,
                endTime: _item.endTime,
                chgUserId: user.value.userId,
                regUserId: user.value.userId,
                editFlag: 'C'
              })
            })
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        _.forEach(_result.data, (_item) => {
          dailyReportData.value.dailyUsers.push({
            envWaterDailyResultId: uid(),
            envWaterDailyResultUserId: uid(),
            userId: _item.userId,
            userName: _item.userName,
            startTime: _item.startTime,
            endTime: _item.endTime,
            chgUserId: user.value.userId,
            regUserId: user.value.userId,
            editFlag: 'C'
          })
        })
      }
    } else {
      if (!_isFirst) {
        message.alert({
          title: '안내',
          message: '이전일자의 근무자목록이 없습니다.',
          type: 'info' // success / info / warning / error
        })
      }
    }
  })
}

/******************************
 * TODO (목적): 근무자 추가
 *******************************/
function addUser() {
  popupOptions.value.title = '근무자 검색'
  popupOptions.value.width = '60%'
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    type: 'multiple'
  })
}

/******************************
 * TODO (목적): 근무자 팝업 닫기
 *******************************/
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      dailyReportData.value.dailyUsers.push({
        envWaterDailyResultId: uid(),
        envWaterDailyResultUserId: uid(),
        userId: _item.userId,
        userName: _item.userName,
        startTime: '',
        endTime: '',
        chgUserId: user.value.userId,
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}

/******************************
 * TODO (목적): 근무자 삭제
 *******************************/
function removeUser() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '삭제할 근무자를 선택해주세요.',
      type: 'info' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '선택한 근무자를 삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUserUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            dailyReportData.value.dailyUsers = _.reject(dailyReportData.value.dailyUsers, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
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
  if (props.popupParam.envWaterDailyResultId) {
    saveUrl.value = transactionConfig.env.water.daily.result.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.env.water.daily.result.insert.url
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          dailyReportData.value.regUserId = user.value.userId
          dailyReportData.value.chgUserId = user.value.userId
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
  props.popupParam.envWaterDailyResultId = result.data.envWaterDailyResultId
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
        url: $format(deleteUrl.value, props.popupParam.envWaterDailyResultId),
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
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup() {
  props.popupParam.isFullScreen = false
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * TODO (목적): 전체화면 보기
 *******************************/
function fullScreenReport() {
  props.popupParam.isFullScreen = true
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/env/water/dailyReportFullScreen.vue`))
  )
  popupOptions.value.title = '수질일지 전체'
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.param = {
    envWaterDailyResultId: props.popupParam.envWaterDailyResultId,
    plantCd: props.popupParam.plantCd,
    isFullScreen: true,
    dailyResultDt: props.popupParam.dailyResultDt
  }
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * TODO (목적): 일지출력
 *******************************/
function print() {
  $http({
    url: $format(printUrl.value, props.popupParam.envWaterDailyResultId),
    method: 'GET'
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm = dailyReportData.value.dailyResultDt + '_수질일지.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

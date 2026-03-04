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
                :editable="editable && user.deptCd === dailyReportData.deptCd"
                :approvalInfo="approvalInfo"
                @beforeApprAction="saveDataAppr"
                @callbackApprAction="approvalCallback"
                @requestAfterAction="getDetail"
              />
              <!-- <c-btn
                v-show="editable && dailyReportData.approvalStatusCd"
                label="일지출력"
                color="amber-7"
                @btnClicked="print"
                icon="print"
              /> -->
              <c-btn
                v-if="editable && dailyReportData.envWaterDailyResultId"
                label="전체화면 보기"
                @btnClicked="fullScreenReport"
                icon="receipt_long"
              />
              <c-btn
                v-if="
                  editable &&
                  !disabled &&
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
          <template v-slot:card-description>
            <span style="font-size: 0.9em; font-weight: 500; color: tomato; margin-left: 10px">
              ※
              {{ $language('기본정보를 저장하시면, 해당 날짜의 운영사항을 입력하실 수 있습니다.') }}
            </span>
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
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                :editable="editable"
                :disabled="Boolean(popupParam.envWaterDailyResultId)"
                label="작성일자"
                default="today"
                name="dailyResultDt"
                v-model:value="dailyReportData.dailyResultDt"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <c-dept
                :required="true"
                :editable="false"
                label="부서"
                name="deptCd"
                v-model:value="dailyReportData.deptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                :required="true"
                :editable="false"
                :disabled="disabled"
                label="작성자"
                name="userId"
                v-model:value="dailyReportData.userId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                :editable="editable"
                :disabled="disabled"
                codeGroupCd="WEATHER_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="weatherCd"
                label="날씨"
                v-model:value="dailyReportData.weatherCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="editable"
                :disabled="disabled"
                label="온도"
                suffix="℃"
                name="temperature"
                v-model:value="dailyReportData.temperature"
              />
            </div>
          </template>
        </c-card>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 env-daily-report">
        <div class="chip-header">
          <div class="chip-header-title">
            <q-icon name="info" size="15px" class="q-mr-xs" color="#616161" />메뉴
          </div>
          <div class="chip-list">
            <q-chip
              v-for="(tab, idx) in tabItems"
              :key="idx"
              outline
              square
              :color="tab.selected ? 'primary' : 'grey-7'"
              icon="memory"
              :selected="tab.selected"
              :label="tab.label"
              :title="tab.label"
              @update:selected="(state: boolean) => selectedTab(state, tab, idx)"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <component
          :is="selectedTabComponent"
          :param="popupParam"
          :dailyReportData="dailyReportData"
          :disFlag="disabled"
          :contentHeight="contentHeight"
        />
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
const { user, auths } = storeToRefs(userStore)

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
    envWaterDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
    plantCd: stringNull
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
  plantCd: null, // 사업장코드
  envWaterDailyResultId: '', // 수질일지 일련번호
  dailyResultDt: '', // 작성일
  deptCd: '', // 작성부서
  userId: '', // 작성자
  checkerId: '',
  envTeamUserId: '',
  processCd: '',
  weatherCd: null, // 날씨
  temperature: '', // 온도
  worker1UserId: '', // 1근 근무자
  worker1UserName: '',
  worker2UserId: '', // 2근 근무자
  worker2UserName: '',
  worker3UserId: '', // 3근 근무자
  worker3UserName: '',
  dailyResultStatusCd: '',
  dischargeModels: [],
  preventiveModels: [],
  powerUsageModels: [],
  diswaterModels: [],
  supwaterModels: [],
  drugModels: [],
  preventiveBreakdownModels: [],
  deletePreventiveBreakdownModels: [],
  guidanceModels: [],
  deleteGuidanceModels: []
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
const editable = ref(true)
const saveUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const checkUrl = ref('')
const mappingType = ref('POST')
const deleteUrl = ref('')
const printUrl = ref('')
const isSave1 = ref(false)
const detailUrl = ref('')
const editForm = ref<any>(null)
const isApproval = ref(false)
const apprBtn = ref<any>(null)
const selectedTabComponent = ref(null)
// const saveTabKey = ref('')
const tabItems = ref<any>([
  {
    name: 'tab1',
    label: '1. 폐수배출시설 가동(조업)시간대',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport01.vue`))),
    key: uid(),
    selected: false
  },
  {
    name: 'tab2',
    label: '2. 수질오염방지시설 가동시간대',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport02.vue`))),
    key: uid(),
    selected: false
  },
  {
    name: 'tab3',
    label: '3. 용수 공급원별 사용량과 폐수배출량',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport03.vue`))),
    key: uid(),
    selected: false
  },
  {
    name: 'tab4',
    label: '4. 슬러지의 발생량 및 처리량',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport04.vue`))),
    key: uid(),
    selected: false
  },
  // {
  //   name: 'tab5',
  //   label: '5. 원료 또는 첨가제 등의 사용량',
  //   component: markRaw(defineAsyncComponent(() => import(`./dailyReport05.vue`))),
  //   key: uid()
  // },
  {
    name: 'tab6',
    label: '5. 전력사용량',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport06.vue`))),
    key: uid(),
    selected: false
  },
  {
    name: 'tab7',
    label: '6. 약품사용량',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport07.vue`))),
    key: uid(),
    selected: false
  },
  // {
  //   name: 'tab8',
  //   label: '8. 폭기조 운전상태',
  //   component: markRaw(defineAsyncComponent(() => import(`./dailyReport08.vue`))),
  //   key: uid()
  // },
  {
    name: 'tab9',
    label: '7. 수질오염방지시설 고장 유무',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport09.vue`))),
    key: uid(),
    selected: false
  },
  // {
  //   name: 'tab10',
  //   label: '8. 수질오염물질 측정내용',
  //   component: markRaw(defineAsyncComponent(() => import(`./dailyReportMeasure.vue`))),
  //   key: uid(),
  //   selected: false
  // },
  // {
  //   name: 'tab11',
  //   label: '11. 측정항목별 점검내용',
  //   component: markRaw(defineAsyncComponent(() => import(`./dailyReport11.vue`))),
  //   key: uid()
  // },
  {
    name: 'tab12',
    label: '8. 지도ㆍ점검을 받은 사항',
    component: markRaw(defineAsyncComponent(() => import(`./dailyReport12.vue`))),
    key: uid(),
    selected: false
  }
])
/******************************
 * @Computed_선언
 *******************************/
const isManager = computed(() => {
  return _.indexOf(auths.value, 'SAGI001024') > -1
})

const disabled = computed(() => {
  return (
    (dailyReportData.value.approvalStatusCd === 'ASC0000001' ||
      dailyReportData.value.approvalStatusCd === 'ASC9999999' ||
      user.value.deptCd !== dailyReportData.value.deptCd) &&
    !isManager.value
  )
})

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
  insertUrl.value = transactionConfig.env.water.daily.result.insert.url
  updateUrl.value = transactionConfig.env.water.daily.result.update.url
  deleteUrl.value = transactionConfig.env.water.daily.result.delete.url
  checkUrl.value = selectConfig.env.water.daily.result.check.url
  // code setting
  tabItems.value[0].selected = true
  selectedTabComponent.value = tabItems.value[0].component
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
    })
  } else {
    dailyReportData.value.userId = user.value.userId
  }
}

/******************************
 * TODO (목적): 탭 선택
 * chip 라이브러리 사용
 * 탭을 클릭 했을 시에 해당 탭이 클릭되었음을 표시하게끔 배경색을 변경시키며
 * 다른 탭들은 selected false 처리 및 색상 primary로 변경
 *******************************/
function selectedTab(_state: any, _tab: any, _idx: any) {
  if (_state) {
    tabItems.value.forEach((item: any, index: any) => {
      if (_idx !== index) {
        item.selected = false
      } else {
        item.selected = true
        selectedTabComponent.value = _tab.component
      }
    })
  } else {
    tabItems.value[_idx].selected = true
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
  if (dailyReportData.value.envWaterDailyResultId) {
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
      if (!dailyReportData.value.envWaterDailyResultId) {
        $http({
          url: checkUrl.value,
          method: 'GET',
          params: {
            dailyResultDt: dailyReportData.value.dailyResultDt,
            plantCd: dailyReportData.value.plantCd
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

// /******************************
//  * TODO (목적): 탭 내용 저장
//  *******************************/
// function saveTabContent(_key: any) {
//   saveTabKey.value = _key
//   emits('saveCallback', props.popupParam.envWaterDailyResultId)
// }

// function research() {
//   emits('research')
// }

/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  props.popupParam.envWaterDailyResultId = result.data
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
    envWaterDailyResultId: dailyReportData.value.envWaterDailyResultId,
    isFullScreen: true,
    dailyReportData: dailyReportData.value
  }
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup() {
  props.popupParam.isFullScreen = false
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

// /******************************
//  * TODO (목적): 일지출력
//  *******************************/
// function print() {
//   $http({
//     url: $format(printUrl.value, props.popupParam.envWaterDailyResultId),
//     method: 'GET'
//   }).then((_result: any) => {
//     const windowObj = window.navigator as any
//     const fileOrgNm = dailyReportData.value.dailyResultDt + '_수질일지.xlsx'
//     const blob = base64ToBlob(_result.data)
//     if (windowObj && windowObj.msSaveOrOpenBlob) {
//       windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
//     } else {
//       const link = document.createElement('a')
//       link.href = window.URL.createObjectURL(blob)
//       link.download = fileOrgNm
//       link.click()
//     }
//   })
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style scoped>
.chip-header {
  display: flex;
  align-items: stretch;
  flex-direction: row;
}

.chip-header-title {
  /* background: #fb7e1f !important; */
  background: #f4f5f7 !important;
  width: 80px !important;
  color: #616161;
  padding: 10px 10px;
  border-radius: 5px 0 0 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  min-height: 40px; /* 헤더 높이 늘리기 */
  margin: -6px 10px -6px -6px;
  border-top: #929191 solid 1.8px;
}

.chip-list {
  display: flex;
  flex-wrap: wrap; /* 칩이 넘치면 자동 줄바꿈 */
  align-items: flex-start;
}

.q-chip {
  width: 270px; /* 원하는 고정 너비(px, %, rem 등으로 조정 가능) */
  white-space: nowrap; /* 줄바꿈 방지 */
  text-align: center; /* 텍스트 중앙 정렬 */
}
</style>

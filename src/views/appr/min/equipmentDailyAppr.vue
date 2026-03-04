<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="일상점검 계획 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled && !data.sysApprovalRequestId"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="data"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  required
                  label="공정"
                  :disabled="disabled || updateMode"
                  type="search"
                  name="processCd"
                  :customPopupParam="{ targetKey: 'process' }"
                  v-model:value="data.processCd"
                  @dataChange="datachange('A')"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  required
                  :disabled="disabled"
                  :editable="editable"
                  label="점검년월"
                  type="month"
                  name="checkDate"
                  v-model:value="data.checkDate"
                  @datachange="datachange('B')"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  required
                  :disabled="disabled || updateMode"
                  :editable="editable"
                  :plantCd="data.plantCd"
                  type="edit"
                  name="plantCd"
                  v-model:value="data.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-dept
                  required
                  :disabled="disabled"
                  :editable="editable"
                  label="점검부서"
                  name="checkDeptCd"
                  v-model:value="data.checkDeptCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-tab
            type="tabcard"
            :tabItems="tabItems"
            :inlineLabel="true"
            height="400px"
            v-model:value="tab"
            align="left"
            @tabClick="tabClick"
          >
            <template v-slot:default="tab">
              <component
                :is="tab.component"
                :data="data"
                :grid="grid"
                :imprTabInfo="imprTabInfo"
                :research="research"
                contentHeight="400px"
                @getDetail="getDetail"
                @setKey="setKey"
              />
            </template>
          </c-tab>
        </div>
      </div>
      <c-dialog :param="popupOptions">></c-dialog>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { equipDailyPopupParamType, equipDailyType } from '@/views/sop/mim/inspection/equipmentDaily'

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
  name: 'equipmentDailyDetail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: equipDailyPopupParamType
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: any
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
      dailyCheckId: ''
    }
  },
  contentHeight: ''
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
const data = ref<equipDailyType>({
  dailyCheckId: '', // 열화점검 일련 번호
  plantCd: '', // 사업장 코드
  checkStatusCd: '', // 계획수립/점검중/점검완료
  processCd: '', // 라인일련번호
  checkDeptCd: '', // 점검부서
  checkUserId: '', // 점검자 ID
  checkDate: '', // 점검월
  dailyName: '', // 점검명
  evaluationCompleteFlag: 'N', // 결재완료 후 평가완료 처리
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '', // 결재관련 결재요청코드
  utilityFlag: 'N',
  dailyResultModelList: [], // sheet
  dailyImproveModelList: [] // 개선 list
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'equipmentCd' }],
  columns: [],
  data: [],
  height: 'auto'
})
const updateMode = ref(false)
const saveUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const lunarList = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const getUrl = ref('')
const resultItemDetail = ref('')
const currentMonth = ref('')
const lunarHolidays = ref<any>([])
const today = ref<string>('')
const editForm = ref<any>(null)
const research = ref<any>({
  impr: '',
  item: ''
})
const tab = ref('equipmentDailyResult')
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'equipmentDailyResult',
    icon: 'list',
    label: '일상점검 결과',
    component: markRaw(
      defineAsyncComponent(() => import(`@/views/sop/mim/inspection/equipmentDailyResult.vue`))
    )
  },
  {
    name: 'equipmentDailyImpr',
    icon: 'construction',
    label: '개선관리',
    component: markRaw(defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)))
  }
])
/******************************
 * @Computed_선언
 *******************************/
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.dailyCheckId, //
    ibmTaskTypeCd: 'ITT0000070',
    ibmTaskUnderTypeCd: 'ITTU000120',
    requestContents: data.value.dailyName,
    disabled: data.value.checkStatusCd === 'MCSC000015' || Boolean(data.value.sysApprovalRequestId),
    isOld: Boolean(props.popupParam.dailyCheckId),
    gridItem: {
      listUrl: selectConfig.sop.min.equipment.plan.daily.improve.url,
      param: {
        dailyCheckId: props.popupParam.dailyCheckId,
        imprFlag: true
      },
      title: '점검항목별 개선목록',
      merge: [],
      columns: [
        {
          name: 'equipmentName',
          field: 'equipmentName',
          label: '설비명',
          align: 'center',
          style: 'width:180px',
          type: 'html',
          sortable: false
        },
        {
          name: 'checkItemPartName',
          field: 'checkItemPartName',
          label: '부품명',
          align: 'center',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'checkItemName',
          field: 'checkItemName',
          label: '점검항목',
          align: 'center',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'dayStr',
          field: 'dayStr',
          label: '일  ',
          align: 'center',
          style: 'width:75px',
          sortable: false
        }
      ],
      research: research.value
    },
    gridOther: {
      title: '항목외 개선 목록'
    }
  }
})
const disabled = computed(() => {
  return data.value.checkStatusCd === 'MCSC000015' || Boolean(data.value.sysApprovalRequestId)
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  () => {
    let height = props.contentHeight - 220
    if (height < 400) {
      height = 500
    }
    grid.value.height = height + 'px'
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
  saveUrl.value = transactionConfig.sop.min.equipment.plan.daily.insert.url
  getUrl.value = selectConfig.sop.min.equipment.plan.daily.get.url
  insertUrl.value = transactionConfig.sop.min.equipment.plan.daily.insert.url
  updateUrl.value = transactionConfig.sop.min.equipment.plan.daily.update.url
  deleteUrl.value = transactionConfig.sop.min.equipment.plan.daily.delete.url
  completeUrl.value = transactionConfig.sop.min.equipment.plan.daily.complete.url
  resultItemDetail.value = selectConfig.sop.min.equipment.result.daily.newItem.url
  lunarList.value = selectConfig.sop.min.equipment.result.lunar.url // 음력 공휴일구하기
  // code setting
  today.value = getToday().slice(-2, getToday().length)
  currentMonth.value = getToday().slice(-5, getToday().length - 3)
  if (today.value.substring(Number(today.value), 0) === '0') {
    today.value = today.value.substring(Number(today.value), 0)
  }
  // list setting
  getDetail()
}
function setKey(data: string) {
  props.popupParam.dailyCheckId = data
  getDetail()
}
function getDetail() {
  if (props.popupParam.dailyCheckId) {
    $http({
      url: $format(getUrl.value, props.popupParam.dailyCheckId),
      method: 'GET'
    }).then((_result: any) => {
      data.value = _result.data
      updateMode.value = true
      setColumns()
    })
  }
}
function saveData() {
  if (props.popupParam.dailyCheckId) {
    saveUrl.value = updateUrl.value
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
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
          data.value.regUserId = user.value.userId
          data.value.chgUserId = user.value.userId

          data.value.dailyResultModelList = _.clone(grid.value.data)

          if (mappingType.value === 'POST') {
            _.forEach(data.value.dailyResultModelList, (_item) => {
              _item.editFlag = 'C'
            })
          }
          data.value.utilityFlag = 'N'
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
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.dailyCheckId = result.data
  getDetail()
}
function datachange(type: string) {
  if (type === 'A' && data.value.processCd) {
    $http({
      url: $format(resultItemDetail.value, data.value.processCd),
      method: 'GET'
    }).then((_result: any) => {
      data.value.dailyResultModelList = _result.data
      _.forEach(data.value.dailyResultModelList, (_item: any) => {
        _item.dailyCheckResultId = uid()
      })
      setColumns()
    })
  } else if (type === 'B' && data.value.checkDate) {
    // grid.value.data = [];
    setColumns()
  }
}
function setColumns() {
  const _columns: any = [
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'center',
      style: 'width:220px',
      sortable: false,
      fix: true
    },
    {
      name: 'checkItemPartName',
      field: 'checkItemPartName',
      label: '부품명',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      fix: true
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'checkItemMethod',
      field: 'checkItemMethod',
      label: '점검방법',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'checkStandard',
      field: 'checkStandard',
      label: '점검기준',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      label: '주기',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'cycle1',
          field: 'cycle1',
          label: '일 ',
          style: 'width:30px',
          align: 'center',
          type: 'custom',
          sortable: false
        },
        {
          name: 'cycle2',
          field: 'cycle2',
          label: '주 ',
          style: 'width:30px',
          align: 'center',
          type: 'custom',
          sortable: false
        },
        {
          name: 'cycle3',
          field: 'cycle3',
          label: '월',
          style: 'width:30px',
          align: 'center',
          type: 'custom',
          sortable: false
        }
      ]
    }
  ]
  const days: any = []
  const year: any = data.value.checkDate.substring(0, 4)
  const month: any = data.value.checkDate.substring(5)

  // 주말 계산
  const date = new Date(Number(year), Number(month), 0)
  const week = ['일', '월', '화', '수', '목', '금', '토']

  // 양력 공휴일 계산
  const solorHolidays = [
    '01-01',
    '03-01',
    '05-01',
    '05-05',
    '06-06',
    '07-17',
    '08-15',
    '10-03',
    '12-25'
  ]

  if (data.value.checkDate) {
    $http({
      url: $format(lunarList.value, year),
      method: 'GET'
    }).then((_result: any) => {
      lunarHolidays.value = _result.data

      for (let i = 1; i <= date.getDate(); i++) {
        const dayOfWeek = week[new Date(Number(year) + '-' + Number(month) + '-' + i).getDay()]

        let solarIdx = 0
        let countDay: any = 0
        if (i < 10) {
          countDay = '0' + i
          solarIdx = solorHolidays.indexOf(month + '-0' + i)
        } else {
          countDay = i
          solarIdx = solorHolidays.indexOf(month + '-' + i)
        }
        let lunarIdx = 0
        if (i < 10) {
          lunarIdx = lunarHolidays.value.indexOf(year + month + '0' + i)
        } else {
          lunarIdx = lunarHolidays.value.indexOf(year + month + i)
        }

        let day = ''
        if (dayOfWeek === '일' || dayOfWeek === '토' || solarIdx >= 0 || lunarIdx >= 0) {
          day = 'weekend'
        } else {
          day = 'weekday'
        }
        days.push({
          name: 'day' + i + 'Name',
          field: 'day' + i + 'Name',
          key: 'day' + i,
          label: i,
          currentDay:
            String(countDay) === String(today.value) && String(month) === String(currentMonth.value)
              ? true
              : false,
          align: 'center',
          size: 'xs',
          setHeader: true,
          style: 'width:50px',
          // dayType: day,
          headerColor: day === 'weekend' ? '#FFCDD2' : '',
          type: 'custom',
          headType: 'link',
          sortable: false
          // component: () => import(`${'./equipmentDeteriorResultProxy.vue'}`)
        })
      }
      grid.value.columns = _.concat(_columns, {
        name: 'year',
        field: 'year',
        label: '측정값',
        child: days
      })
      grid.value.data = _.clone(data.value.dailyResultModelList)
    })
  }

  if (data.value.checkDate && data.value.processCd) {
    data.value.dailyName = year + '년도  ' + month + '월  '
  }
}
function tabClick() {
  research.value.impr = uid()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

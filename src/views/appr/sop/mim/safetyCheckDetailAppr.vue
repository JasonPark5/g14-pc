<template>
  <div>
    <q-form ref="editForm">
      <c-card title="안전점검 기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled && !safetyCheck.sysApprovalRequestId"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="safetyCheck"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveData"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-plant
              required
              :disabled="disabled || isOld"
              :editable="editable"
              type="none"
              name="plantCd"
              v-model:value="safetyCheck.plantCd"
              @datachange="datachange('A')"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              required
              :editable="editable && !disabled && !isOld"
              label="점검년월"
              type="month"
              name="checkDate"
              v-model:value="safetyCheck.checkDate"
              @datachange="datachange('B')"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-dept
              :editable="editable && !disabled && !isOld"
              label="점검부서"
              name="checkDeptCd"
              v-model:value="safetyCheck.checkDeptCd"
              @setDeptName="(val: any) => (safetyCheck.checkDeptName = val)"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="false"
              label="점검명"
              name="safetyCheckName"
              v-model:value="safetyCheck.safetyCheckName"
            />
          </div>
        </template>
      </c-card>
      <c-tab
        type="tabcard"
        :tabItems="tabItems"
        :height="tabHeight"
        :inlineLabel="true"
        v-model:value="tab"
        align="left"
      >
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :safetyCheck="safetyCheck"
            :grid="grid"
            :imprTabInfo="imprTabInfo"
            :disabled="disabled"
            :height="tabHeight"
            @getDetail="getDetail"
            @setKey="setKey"
          />
        </template>
      </c-tab>
      <c-dialog :param="popupOptions" />
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
  name: 'safetyCheckDetailAppr'
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
  popupParam: {
    safetyCheckId: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface gridType {
  columns: tableColumnType
  height: stringNull
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
      safetyCheckId: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const safetyCheck = ref<any>({
  safetyCheckId: '', // 열화점검 일련 번호
  plantCd: '', // 사업장 코드
  checkStatusCd: '', // 계획수립/점검중/점검완료
  checkDeptCd: '', // 점검부서
  checkUserId: '', // 점검자 ID
  checkDate: '', // 점검월
  safetyCheckName: '', // 점검명
  evaluationCompleteFlag: 'N', // 결재완료 후 평가완료 처리
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '', // 결재관련 결재요청코드
  safetyCheckResultModelList: [], // sheet
  safetyCheckImproveModelList: [] // 개선 list
})
const tab = ref('safetyCheckResult')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const resultItemUrl = ref('')
const lunarList = ref('')
const currentMonth = ref('')
const lunarHolidays = ref<any>([])
const today = ref('')
const research = ref<any>({
  impr: '',
  item: ''
})
const grid = ref<gridType>({
  columns: [],
  height: 'auto'
})
const editForm = ref<any>(null)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.safetyCheckId))
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    {
      name: 'safetyCheckResult',
      icon: 'list',
      label: '안전점검일지 결과',
      component: defineAsyncComponent(() => import(`@views/sop/mim/smd/safetyCheckResult.vue`)),
      key: uid()
    },
    {
      name: 'safetyCheckImpr',
      icon: 'construction',
      label: '개선관리',
      component: defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)),
      key: uid()
    }
  ]
  return items
})
const disabled = computed(
  () =>
    safetyCheck.value.checkStatusCd === 'MCSC000015' ||
    safetyCheck.value.approvalStatusCd === 'ASC0000001'
)
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.safetyCheckId,
    ibmTaskTypeCd: 'ITT0000075',
    ibmTaskUnderTypeCd: 'ITTU000125',
    requestContents: safetyCheck.value.safetyCheckName,
    disabled: disabled.value,
    isOld: isOld.value,
    isTable: false,
    gridItem: {
      listUrl: selectConfig.sop.safetycheck.improve.get.url,
      param: {
        safetyCheckId: props.popupParam.safetyCheckId,
        imprFlag: true
      },
      title: '점검항목별 개선목록',
      merge: [
        { index: 0, colName: 'safetyCheckResultId' },
        { index: 1, colName: 'safetyCheckResultId' }
      ],
      columns: [
        {
          name: 'checkItemName',
          field: 'checkItemName',
          label: '점검항목',
          align: 'left',
          style: 'width:30%',
          sortable: false,
          fix: true
        },
        {
          name: 'checkItemCycleName',
          field: 'checkItemCycleName',
          label: '주기',
          align: 'center',
          style: 'width:10%',
          sortable: false,
          fix: true
        },
        {
          name: 'dayStr',
          field: 'dayStr',
          label: '점검일 (주/야)',
          align: 'center',
          style: 'width:10%',
          sortable: false,
          fix: true
        }
      ],
      research: research.value
    },
    gridOther: {
      title: '항목외 개선 목록'
    }
  }
})
const tabHeight = computed(() => {
  return '600px'
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [safetyCheck.value.checkDate, safetyCheck.value.checkDeptCd],
  () => {
    const [_y, _m] = safetyCheck.value.checkDate.split('-')
    if (!isOld)
      safetyCheck.value.safetyCheckName = `${_y}년 ${_m}월 ${safetyCheck.value.checkDeptName} 안전관리자 점검일지`
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
  detailUrl.value = selectConfig.sop.safetycheck.plan.get.url
  saveUrl.value = transactionConfig.sop.safetycheck.plan.insert.url
  deleteUrl.value = transactionConfig.sop.safetycheck.plan.delete.url
  resultItemUrl.value = selectConfig.sop.safetycheck.result.newItem.url
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
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.safetyCheckId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(safetyCheck.value, _result.data)
      setColumns()
    })
  } else {
    datachange('A')
  }
}
function setKey(data: any) {
  props.popupParam.safetyCheckId = data
  getDetail()
}
function datachange(type: any) {
  if (type === 'A') {
    $http({
      url: resultItemUrl.value,
      method: 'GET'
    }).then((_result: any) => {
      safetyCheck.value.safetyCheckResultModelList = _result.data
      _.forEach(safetyCheck.value.safetyCheckResultModelList, (_item) => {
        _item.safetyCheckResultId = uid()
      })
      setColumns()
    })
  } else if (type === 'B' && safetyCheck.value.checkDate) {
    // this.grid.data = [];
    setColumns()
  }
}
function setColumns() {
  if (!safetyCheck.value.checkDate) return
  const _columns = [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'right',
      style: 'width:40px',
      sortable: true,
      fix: true
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      align: 'left',
      style: 'width:450px',
      sortable: false,
      fix: true
    },
    {
      name: 'checkItemCycleName',
      field: 'checkItemCycleName',
      label: '주기',
      align: 'center',
      style: 'width:90px',
      sortable: false,
      fix: true
    }
  ]
  const [year, month] = safetyCheck.value.checkDate.split('-')
  // 주말 계산
  const date = new Date(Number(year), Number(month), 0)
  const week = ['일', '월', '화', '수', '목', '금', '토']
  // 양력 공휴일 계산
  const solorHolidays = ['01-01', '03-01', '05-05', '06-06', '07-17', '08-15', '10-03', '12-25']

  let days = [] as any
  const parent = [] as any
  $http({
    url: $format(lunarList.value, year),
    method: 'GET'
  }).then((_result: any) => {
    // 음력 공휴일 계산은 백엔드에서
    lunarHolidays.value = _result.data

    for (let i = 1; i <= date.getDate(); i++) {
      const dayOfWeek = week[new Date(Number(year) + '-' + Number(month) + '-' + i).getDay()]
      const countDay = i < 10 ? '0' + i : String(i) || '0'

      const solarIdx =
        i < 10
          ? solorHolidays.indexOf(month + '-0' + i)
          : solorHolidays.indexOf(month + '-' + i) || 0

      const lunarIdx =
        i < 10
          ? lunarHolidays.value.indexOf(year + month + '0' + i)
          : lunarHolidays.value.indexOf(year + month + i) || 0

      const day =
        dayOfWeek === '일' || dayOfWeek === '토' || solarIdx >= 0 || lunarIdx >= 0
          ? 'weekend'
          : 'weekday'

      days.push({
        name: 'day' + i + 'Name',
        field: 'day' + i + 'Name',
        key: 'day' + i,
        day: i,
        label: $language('주'),
        currentDay:
          String(countDay) === String(today.value) && String(month) === String(currentMonth.value)
            ? true
            : false,
        align: 'center',
        size: 'xs',
        setHeader: true,
        style: 'width:35px',
        // dayType: day,
        headerColor: day === 'weekend' ? '#FFCDD2' : '',
        type: 'custom',
        headType: 'link',
        sortable: false
        // component: () => import(`${'./equipmentDeteriorResultProxy.vue'}`)
      })
      days.push({
        name: 'nday' + i + 'Name',
        field: 'nday' + i + 'Name',
        key: 'nday' + i,
        day: i,
        label: $language('야'),
        currentDay:
          String(countDay) === String(today.value) && String(month) === String(currentMonth.value)
            ? true
            : false,
        align: 'center',
        size: 'xs',
        setHeader: true,
        style: 'width:35px',
        // dayType: day,
        headerColor: day === 'weekend' ? '#FFCDD2' : '',
        type: 'custom',
        headType: 'link',
        sortable: false
        // component: () => import(`${'./equipmentDeteriorResultProxy.vue'}`)
      })
      parent.push({
        headerColor: day === 'weekend' ? '#FFCDD2' : '',
        name: String(i),
        field: String(i),
        label: String(i),
        child: days
      })
      days = []
    }
    grid.value.columns = _.concat(_columns, parent)
  })
}
function saveData() {
  if (isOld.value) {
    saveUrl.value = transactionConfig.sop.safetycheck.plan.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.safetycheck.plan.insert.url
    mappingType.value = 'POST'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          safetyCheck.value.regUserId = user.value.userId
          safetyCheck.value.chgUserId = user.value.userId
          if (mappingType.value === 'POST') {
            _.forEach(
              safetyCheck.value.safetyCheckResultModelList,
              (_item) => (_item.editFlag = 'C')
            )
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.safetyCheckId = result.data
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

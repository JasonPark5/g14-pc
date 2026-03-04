<template>
  <!-- <c-search-box @enter="getList">
    <template v-slot:search">
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-task-target
          label="관련공정"
          name="processCd"
          :customPopupParam="{ targetKey: 'process' }"
          v-model:value="searchParam.processCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-dept
          type="search"
          label="부서"
          name="period"
          v-model:value="searchParam.deptCd"
        />
      </div>
    </template>
  </c-search-box> -->
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        :title="title + ' 작업환경측정결과'"
        :merge="grid.merge"
        :columns="grid.columns"
        :data="grid.data"
        :gridHeight="gridHeight"
        :filtering="true"
        :columnSetting="false"
        :usePaging="false"
        :editable="!disabled"
        noDataLabel="작업환경측정결과를 추가하세요."
        selection="multiple"
        rowKey="workMeasurementResultId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="updateMode && !disabled && editable"
              :showLoading="false"
              label="부서추가"
              icon="add"
              @btnClicked="addRow(1)"
            />
            <c-btn
              v-if="updateMode && !disabled && editable"
              :showLoading="false"
              label="업체추가"
              icon="add"
              @btnClicked="addRow(2)"
            />
            <c-btn
              v-if="updateMode && !disabled && editable && grid.data!.length > 0"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="remove"
            />
            <c-btn
              v-if="updateMode && !disabled && editable && grid.data!.length > 0"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="grid.data"
              mappingType="POST"
              label="측정결과 저장"
              icon="save"
              @beforeAction="saveData"
              @btnCallback="saveCallback"
            />
            <!-- <c-btn label="검색" icon="search" @btnClicked="getListDate" /> datepicker로 조회할 수 있게 되어있는 부분 * 현재 datepicker 삭제해놓은 상태-->
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <component
              :is="imprComponent"
              :col="col"
              :props="props"
              :inputEditable="!disabled"
              :isImmShow="true"
              :requestContentsCols="[
                'processCd',
                'deptName',
                'workPlace',
                'hazardCd',
                'measPositionName',
                'measValue'
              ]"
              tableKey="workMeasurementResultId"
              ibmTaskTypeCd="ITT0000175"
              ibmTaskUnderTypeCd="ITTU000200"
              @imprChange="imprChange"
            />
          </template>
          <template v-else-if="col.name === 'exposureFlag'">
            <span
              v-if="
                parseFloat(props.row.measValue) >= 0 &&
                parseFloat(props.row.exposureStandard) > 0 &&
                parseFloat(props.row.measValue) > parseFloat(props.row.exposureStandard)
              "
              class="text-red"
              >{{ $language('초과') }}</span
            >
            <span
              v-else-if="
                (parseFloat(props.row.measValue) >= 0 &&
                  parseFloat(props.row.exposureStandard) > 0 &&
                  parseFloat(props.row.measValue) <= parseFloat(props.row.exposureStandard)) ||
                props.row.measValue === '불검출' ||
                props.row.measValue === '검출한계'
              "
              class="text-green"
            >
              {{ $language('미만') }}</span
            >
            <c-text-column
              v-else
              :editable="editable && !disabled"
              :props="props"
              :col="col"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props.row)"
            />
          </template>
        </template>
      </c-table>
    </div>
  </div>
  <c-dialog :param="popupOptions" />
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
  name: 'workMeasureResultInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail', 'addRow', 'remove'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  height?: stringNull
  workMeasure: {
    workMeasurementPlanId: stringNull
    plantCd: stringNull
    updateFlag: stringNull
    workMeasurementResultModelList: Array<any>
  }
  title: stringNull
  workAreaGradeCd: stringNull
  unit: stringNull
  disabled: boolean
  updateMode: boolean
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
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  height: null,
  workMeasure: () => {
    return {
      workMeasurementPlanId: '',
      plantCd: '',
      updateFlag: '',
      workMeasurementResultModelList: []
    }
  },
  title: '',
  unit: '',
  workAreaGradeCd: '',
  disabled: false,
  updateMode: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
// const searchParam = ref({
//   processCd: '',
//   processName: '',
//   deptCd: '',
//   workMeasurementPlanId: '',
//   startYmd: '',
//   endYmd: '',
//   workAreaGradeCd: ''
// })
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'processCd' }],
  columns: [
    {
      name: 'processCd',
      field: 'processCd',
      label: '단위사업체명',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      fix: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서 및 업체',
      align: 'center',
      style: 'width:120px',
      sortable: false,
      fix: true
    },
    {
      required: true,
      name: 'workPlace',
      field: 'workPlace',
      label: '단위작업장소',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: false,
      fix: true
    },
    {
      required: true,
      name: 'hazardCd',
      field: 'hazardCd',
      label: '유해인자',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: false,
      fix: true
    },
    {
      name: 'workCount',
      field: 'workCount',
      label: '근로자수',
      align: 'center',
      style: 'width:60px',
      type: 'number',
      sortable: true
    },
    {
      name: 'shiftType',
      field: 'shiftType',
      label: '근로형태 및 시간',
      align: 'left',
      style: 'width:120px',
      type: 'text',
      sortable: true
    },
    {
      name: 'occurTime',
      field: 'occurTime',
      label: '발생시간(분)',
      align: 'center',
      style: 'width:100px',
      type: 'text',
      sortable: true
    },
    {
      name: 'measPositionName',
      field: 'measPositionName',
      label: '측정위치(근로자명)',
      align: 'left',
      style: 'width:120px',
      type: 'text',
      sortable: true
    },
    {
      name: 'measStartTime',
      field: 'measStartTime',
      label: '측정시간',
      align: 'left',
      style: 'width:120px',
      type: 'datetime',
      minuteStep: 10,
      range: true,
      sortable: true
    },
    {
      name: 'measCount',
      field: 'measCount',
      label: '측정횟수',
      align: 'center',
      style: 'width:60px',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'measValue',
      field: 'measValue',
      label: '측정치 [' + props.unit + ']',
      align: 'center',
      style: 'width:80px',
      type: 'text',
      sortable: true
    },
    {
      name: 'twaPrev',
      field: 'twaPrev',
      label: '전회치 [' + props.unit + ']',
      align: 'center',
      style: 'width:80px',
      type: 'text',
      sortable: true
    },
    {
      name: 'twaCurr',
      field: 'twaCurr',
      label: '금회치 [' + props.unit + ']',
      align: 'center',
      style: 'width:80px',
      type: 'text',
      sortable: true
    },
    {
      name: 'exposureStandard',
      field: 'exposureStandard',
      label: '노출기준 [' + props.unit + ']',
      align: 'center',
      style: 'width:80px',
      type: 'text',
      sortable: true
    },
    {
      name: 'exposureFlag',
      field: 'exposureFlag',
      label: '기준초과여부',
      align: 'center',
      style: 'width:80px',
      type: 'custom',
      sortable: true
    },
    {
      name: 'measMethod',
      field: 'measMethod',
      label: '측정방법',
      align: 'center',
      style: 'width:100px',
      type: 'text',
      sortable: true
    },
    {
      name: 'measAnalysis',
      field: 'measAnalysis',
      label: '분석방법',
      align: 'center',
      style: 'width:150px',
      type: 'text',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'center',
      style: 'width:100px',
      type: 'text',
      sortable: true
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:200px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '650px'
})
const editable = ref(true)
// const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const deleteResultUrl = ref('')
const listCheckupUrl = ref('')
const table = ref<any>(null)
const isSave = ref(false)
const saveUrl = ref(transactionConfig.sai.workmeas.results.insert.url)

/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const gridHeight = computed(() => {
  let height =
    props.height && !Number.isNaN(Number(props.height.replace('px', '')))
      ? Number(props.height.replace('px', '')) - 20
      : 200
  if (height < 200) height = 200
  return height + 'px'
})

/******************************
 * @Watch_선언
 *******************************/
// watch(
//   () => props.workAreaGradeCd,
//   () => getList(),
//   { immediate: true }
// )
watch(
  () => props.workMeasure.updateFlag,
  () => {
    getList()
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
  // detailUrl.value = selectConfig.sai.workmeas.result.list.url
  insertUrl.value = transactionConfig.sai.workmeas.plan.insert.url
  updateUrl.value = transactionConfig.sai.workmeas.plan.update.url
  deleteUrl.value = transactionConfig.sai.workmeas.plan.delete.url
  completeUrl.value = transactionConfig.sai.workmeas.plan.complete.url
  deleteResultUrl.value = transactionConfig.sai.workmeas.result.delete.url
  listCheckupUrl.value = selectConfig.hea.checkup.result.list.url
  // code setting
  // list setting
  if (props.workAreaGradeCd === '1') {
    grid.value.columns.splice(4, 0, {
      name: 'workContents',
      field: 'workContents',
      label: '작업내용',
      align: 'left',
      style: 'width:240px',
      type: 'text',
      sortable: false
    })
  }
  getList()
}

/******************************
 * TODO (목적): 작업환경측정결과 분야별 상세조회
 *******************************/
function getList() {
  // emits('getDetail')
  grid.value.data = _.filter(props.workMeasure.workMeasurementResultModelList, {
    workAreaGradeCd: props.workAreaGradeCd
  })
  _.forEach(grid.value.data, (item) => {
    if (item.measStartTime && typeof item.measStartTime === 'string') {
      item.measStartTime = item.measStartTime.split(',')
    } else if (!item.measStartTime) item.measStartTime = []
  })
}

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function addRow(num: number) {
  if (num === 1) {
    popupOptions.value.title = '부서 조회'
    popupOptions.value.target = markRaw(
      defineAsyncComponent(() => import('@popups/dept/deptPop.vue'))
    )
    popupOptions.value.visible = true
    popupOptions.value.isFull = false
    popupOptions.value.width = '40%'
    popupOptions.value.closeCallback = closeDept
  } else {
    popupOptions.value = getPopupOptions('vendor', popupOptions.value, closeVendor, {
      type: 'single'
    })
  }
}
function closeDept(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item: any) => {
      grid.value.data!.push({
        workMeasurementPlanId: props.workMeasure.workMeasurementPlanId,
        workAreaGradeCd: props.workAreaGradeCd,
        workMeasurementResultId: uid(),
        processCd: '그룹포틴',
        deptName: item.deptName,
        deptCd: item.deptCd,
        dvFlag: 'D',
        workPlace: '',
        workContents: '',
        hazardCd: ['1', '5'].includes(props.workAreaGradeCd) ? props.title : '',
        workCount: '',
        measValue: '',
        exposureStandard: '',
        editFlag: 'C',
        regUserId: user.value.userId
      })
    })
  }
  // props.workMeasure.workMeasurementResultModelList.push(newRow)
  // emits('addRow', newRow)
}
function closeVendor(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item: any) => {
      grid.value.data!.push({
        workMeasurementPlanId: props.workMeasure.workMeasurementPlanId,
        workAreaGradeCd: props.workAreaGradeCd,
        workMeasurementResultId: uid(),
        processCd: '수급사',
        deptCd: item.vendorCd,
        deptName: item.vendorName,
        dvFlag: 'V',
        workPlace: '',
        workContents: '',
        hazardCd: ['1', '5'].includes(props.workAreaGradeCd) ? props.title : '',
        workCount: '',
        measValue: '',
        exposureStandard: '',
        editFlag: 'C',
        regUserId: user.value.userId
      })
    })
  }
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
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
      message: '측정결과를 삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(selectData, (item) => {
          item.measStartTime = item.measStartTime.join(',')
        })
        $http({
          url: deleteResultUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
            props.workMeasure.workMeasurementResultModelList = _.reject(grid.value.data, item)
          })
          getList()
          table.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
          item.measStartTime = item.measStartTime.join(',')
        })
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  } else message.validError()
}
function saveCallback(result: any) {
  message.requestSuccess()
  emits('getDetail', result.data)
  getList()
}
/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  props.workMeasure.updateFlag = uid()
  table.value.resetVirtualScroll()
}
function datachange(row: any) {
  if (row['editFlag'] !== 'C') {
    row['editFlag'] = 'U'
    row['chgUserId'] = user.value.userId
  }
}
</script>

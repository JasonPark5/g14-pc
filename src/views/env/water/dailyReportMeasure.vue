<template>
  <div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="수질오염물질 측정내용"
        :columns="grid.columns"
        :data="dailyReportData.selfMeasureModels"
        :gridHeight="gridHeight"
        :editable="editable && !param.isFullScreen"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        selection="multiple"
        rowKey="envIepsWaterSelfMeasureSubId"
        :gridHeightAuto="param.isFullScreen"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !param.isFullScreen"
              label="과거이력조회"
              icon="history"
              @btnClicked="getPreviousMeasure"
            />
            <c-btn
              v-if="editable && !param.isFullScreen"
              label="오염물질추가"
              icon="add"
              @btnClicked="add"
            />
            <c-btn
              v-if="editable && !param.isFullScreen && dailyReportData.selfMeasureModels.length > 0"
              label="제외"
              icon="remove"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="['inflowCon', 'outflowCon'].includes(col.name)">
            <c-text-column
              :editable="editable"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props, col)"
            />
          </template>
          <template v-else-if="col.name === 'inflowNo'">
            <c-text-column
              v-if="!Boolean(props.row.inflowExemptionCd)"
              :editable="editable"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
            />
          </template>
          <template v-else-if="col.name === 'exceedFlag'">
            <span
              v-if="
                props.row.legalStandard > 0 &&
                props.row.outflowCon !== 'ND' &&
                Number(props.row.outflowCon) > props.row.legalStandard
              "
              style="color: tomato"
            >
              {{ $language('초과') }}</span
            >
            <span v-else-if="props.row.outflowCon && props.row.legalStandard" class="text-grey-5">{{
              $language('이하')
            }}</span>
          </template>
        </template>
      </c-table>
      <c-dialog :param="popupOptions" />
    </div>
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
  name: 'dailyReportMeasure'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

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
  param: {
    envWaterDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
  }
  disFlag?: boolean
  dailyReportData?: any
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<object>
  columns: Array<tableColumnType>
  data?: Array<any>
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
  param: () => {
    return {
      envWaterDailyResultId: '',
      isFullScreen: false,
      dailyResultDt: ''
    }
  },
  disFlag: false,
  dailyReportData: null,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'measureDt',
      field: 'measureDt',
      label: '측정일시',
      align: 'center',
      type: 'datetime',
      datetimeType: 'datetime',
      style: 'width: 110px',
      setHeader: true
    },
    {
      name: 'inspectItemIepsCd',
      field: 'inspectItemIepsCd',
      label: '오염물질코드',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      required: true,
      name: 'envWaterMstInspectItemName',
      field: 'envWaterMstInspectItemName',
      label: '오염물질명',
      align: 'left',
      style: 'width: 150px',
      sortable: false
    },
    {
      name: 'waterInspectUnitName',
      field: 'waterInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'inflowExemptionCd',
      field: 'inflowExemptionCd',
      label: '유입수측정 면제구분',
      align: 'left',
      type: 'select',
      style: 'width: 120px',
      codeGroupCd: 'INFLOW_EXEMPTION_CD',
      sortable: false,
      setHeader: true
    },
    {
      name: 'inflowNo',
      field: 'inflowNo',
      label: '유입시설번호',
      align: 'center',
      type: 'custom',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'inflowCon',
      field: 'inflowCon',
      label: '유입수 농도(mg/l)',
      align: 'center',
      style: 'width: 80px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'outflowCon',
      field: 'outflowCon',
      label: '방류수 농도(mg/l)',
      align: 'center',
      style: 'width: 80px',
      type: 'custom',
      sortable: false,
      currentDay: true
    },
    {
      name: 'outflowValue',
      field: 'outflowValue',
      label: '방류량(㎥/일)',
      align: 'center',
      style: 'width: 80px',
      type: 'number',
      sortable: false
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '허가배출기준',
      align: 'center',
      style: 'width: 60px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'exceedFlag',
      field: 'exceedFlag',
      label: '초과여부',
      align: 'center',
      style: 'width: 60px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'method',
      field: 'method',
      label: '검사방법(기기명)',
      align: 'left',
      style: 'width: 200px',
      type: 'text',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width: 100px',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const editable = computed(() => {
  if (props.disFlag) return false
  else return Boolean(route.meta.editable)
})
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 210 + 'px' : '560px'
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
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  // url setting
  // code setting
  // list setting
}

/******************************
 * TODO (목적): row 추가
 *******************************/
function add() {
  popupOptions.value = getPopupOptions(
    'waterInspectItemMst',
    popupOptions.value,
    closeInspectionPopup,
    {
      type: 'multiple',
      usePaging: false,
      searchParam: { useFlag: 'Y' }
    }
  )
}

function closeInspectionPopup(_data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.dailyReportData.selfMeasureModels, {
          envWaterMstInspectItemId: item.envWaterMstInspectItemId
        }) === -1
      ) {
        props.dailyReportData.selfMeasureModels.push({
          ...item,
          envWaterDailyResultId: props.dailyReportData.envWaterDailyResultId,
          envIepsWaterSelfMeasureSubId: uid(),
          envWaterMstOutletId: 'WMOI000001',
          measureDt: `${props.dailyReportData.dailyResultDt} 00:00`,
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}

/******************************
 * TODO (목적): row 제외
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
    if (!props.dailyReportData.deleteSelfMeasureModels)
      props.dailyReportData.deleteSelfMeasureModels = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.dailyReportData.deleteSelfMeasureModels, {
          envIepsWaterSelfMeasureSubId: item.envIepsWaterSelfMeasureSubId
        }) === -1
      ) {
        props.dailyReportData.deleteSelfMeasureModels.push(item)
        props.dailyReportData.selfMeasureModels = _.reject(
          props.dailyReportData.selfMeasureModels,
          item
        )
      }
    })
  }
}

/******************************
 * TODO (목적): custom 컬럼 소수점 6자리 이상 자르기
 *******************************/
function datachange(_props: any, col: any) {
  const val = _props.row[col.name]
  let decimalPart = ''
  if (typeof val === 'number') decimalPart = val.toString().split('.')[1]
  else if (typeof val === 'string') decimalPart = val.split('.')[1]
  if (decimalPart && decimalPart.length > 6) {
    message.alert({
      title: '안내',
      message: '소수점 이하 6자리까지만 입력 가능합니다.',
      type: 'warning' // success / info / warning / error
    })
    if (typeof val === 'number') _props.row[col.name] = Math.floor(val * 1_000_000) / 1_000_000
    else if (typeof val === 'string')
      _props.row[col.name] = val.split('.')[0] + '.' + decimalPart.slice(0, 6)
  }
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
  }
}

/******************************
 * TODO (목적): 과거이력조회 팝업 오픈
 *******************************/
function getPreviousMeasure() {
  popupOptions.value.title = '수질 자가측정 이력'
  popupOptions.value.param = {
    dailyResultDt: props.dailyReportData.dailyResultDt
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@/views/env/water/previousMeasurePop.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '90%'
  popupOptions.value.closeCallback = closeMeasurePopup
}

function closeMeasurePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

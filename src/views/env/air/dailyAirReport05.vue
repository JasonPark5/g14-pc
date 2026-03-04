<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table5"
        title="방지시설 전력사용량"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.preventiveOperations"
        :merge="grid.merge"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :editable="editable && !param.isFullScreen"
        @table-data-change="tableDataChange"
      />
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
  name: 'dailyAirReport05'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)
// const message = useMessageStore()

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
    plantCd?: stringNull
    envAirDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
  }
  disFlag?: boolean
  dailyReportData?: any
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
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
  param: () => {
    return {
      plantCd: null,
      envAirDailyResultId: '',
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
  merge: [
    { index: 1, colName: 'envAirMstWattmeterId' },
    { index: 2, colName: 'envAirMstWattmeterId' },
    { index: 3, colName: 'envAirMstWattmeterId' },
    { index: 4, colName: 'envAirMstWattmeterId' },
    { index: 5, colName: 'envAirMstWattmeterId' },
    { index: 6, colName: 'envAirMstWattmeterId' }
  ],
  columns: [
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설',
      style: 'width:110px',
      align: 'left',
      sortable: false
    },
    {
      name: 'envAirMstWattmeterNo',
      field: 'envAirMstWattmeterNo',
      label: '적산전력계번호',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstWattmeterName',
      field: 'envAirMstWattmeterName',
      label: '전력계구분명',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'prevPowerIndicator',
      field: 'prevPowerIndicator',
      label: '전일지침(Kwh)',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'powerIndicator',
      field: 'powerIndicator',
      label: '금일지침(Kwh)',
      type: 'decimal',
      integer: 10,
      point: 2,
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'powerUsage',
      field: 'powerUsage',
      label: '사용량(Kwh)',
      style: 'width:60px',
      type: 'cost',
      align: 'center',
      sortable: false
    },
    {
      name: 'readingTime',
      field: 'readingTime',
      label: '검침시간',
      type: 'datetime',
      minuteStep: 10,
      style: 'width:60px',
      align: 'left',
      sortable: false,
      setHeader: true
    }
  ],
  data: []
})
const table5 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const editable = computed(() => {
  if (props.disFlag) return false
  else return Boolean(route.meta.editable)
})
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 170 + 'px' : '560px'
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
  // getList()
}

/******************************
 * TODO (목적): 테이블 셀 값 변경시 로직
 *******************************/
function tableDataChange(_props: any, _col: tableColumnType) {
  if (_col.name === 'powerIndicator') {
    const prev = Number(_props.row.prevPowerIndicator)
    const today = Number(_props.row.powerIndicator)

    if (prev && today) {
      if (prev <= today) {
        _props.row.powerUsage = today - prev
      } else {
        const usage = _props.row.maxValue - prev + today
        _props.row.powerUsage = usage
      }
    } else {
      _props.row.powerUsage = today
    }
  }
  // 같은 전력계 그룹 row들
  const groupRows = props.dailyReportData?.preventiveOperations?.filter(
    (r: any) => r?.envAirMstWattmeterId === _props.row.envAirMstWattmeterId
  )

  groupRows?.forEach((r: any) => {
    r.editFlag = 'U'
    r.powerIndicator = _props.row.powerIndicator
    r.powerUsage = _props.row.powerUsage
    r.readingTime = _props.row.readingTime
  })

  console.log(props.dailyReportData.preventiveOperations)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

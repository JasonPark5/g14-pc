<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table1"
        title="폐수배출시설 가동(조업)시간대"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.dischargeModels"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :editable="editable && !param.isFullScreen"
        @table-data-change="tableDataChange"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <!-- <c-btn
              label="저장"
              icon="save"
              v-if="!param.isFullScreen && editable"
              @btnClicked="saveData"
            /> -->
          </q-btn-group>
        </template>
      </c-table>
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
  name: 'dailyReport01'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
// const message = useMessageStore()
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)

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
    envWaterDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
  }
  disFlag?: boolean
  dailyReportData?: any
  contentHeight?: stringNull
}
interface gridType {
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
const timeColumns = Array.from({ length: 24 }, (_, i) => {
  const idx = String(i).padStart(2, '0')
  const end = String(i + 1).padStart(2, '0')

  return {
    name: `oprTime${idx}`,
    field: `oprTime${idx}`,
    label: `${idx}~${end}`,
    type: 'check',
    true: 'Y',
    false: 'N',
    value: 'N',
    align: 'center',
    sortable: false
  }
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'envWaterMstDischargeName',
      field: 'envWaterMstDischargeName',
      label: '배출시설명',
      style: 'width:300px',
      align: 'center',
      sortable: false
    },
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
const timeKeys = Array.from({ length: 24 }, (_, i) => `oprTime${String(i).padStart(2, '0')}`)
const rowIndexMap = new Map<string, number>()

// const listUrl = ref('')
// const saveUrl = ref('')

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
watch(
  () => props.dailyReportData.dischargeModels,
  (models) => {
    if (Array.isArray(models)) {
      models.forEach((row) => updateAllFlag(row))
    }
  },
  { immediate: true }
)
watch(
  () => props.dailyReportData?.dischargeModels,
  (rows) => {
    rowIndexMap.clear()
    if (!Array.isArray(rows)) return
    rows.forEach((r, i) => rowIndexMap.set(String(r.envWaterMstDischargeId), i))

    // all 초기화도 여기서 1번만(선택)
    rows.forEach(updateAllFlag)
  },
  { immediate: true }
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
  // url setting
  // listUrl.value = selectConfig.env.water.daily.discharge.list.url
  // saveUrl.value = transactionConfig.env.water.daily.discharge.save.url
  // code setting
  // list setting
  // getList()
}

/******************************
 * TODO (목적): all 상태 계산
 ******************************/
function calcAll(row: any) {
  return timeKeys.every((k) => row[k] === 'Y') ? 'Y' : 'N'
}

/******************************
 * TODO (목적): 새 row 만들기
 *******************************/
function applyAll(row: any, val: 'Y' | 'N') {
  const next = { ...row, all: val }
  for (const k of timeKeys) next[k] = val
  return next
}

/******************************
 * TODO (목적): 전체선택
 *******************************/
function tableDataChange(_props: any, col: any) {
  const rows = props.dailyReportData?.dischargeModels
  if (!Array.isArray(rows) || rows.length === 0) return

  const rowKey = String(_props.row.envWaterMstDischargeId)
  const idx = rowIndexMap.get(rowKey)
  if (idx === undefined) return

  const row = rows[idx]

  if (col.name === 'all') {
    const val: 'Y' | 'N' = _props.row.all === 'Y' ? 'Y' : 'N'

    // 통째로 바꾸기 유지 (nextRow 만들어 assign)
    const nextRow = applyAll(row, val)
    Object.assign(row, nextRow)
    return
  }

  if (col.name.startsWith('oprTime')) {
    row.all = calcAll(row)
  }
}

/******************************
 * TODO (목적): 전체선택 컬럼 상태관리
 *******************************/
function updateAllFlag(row: any) {
  row.all = timeKeys.every((key) => row[key] === 'Y') ? 'Y' : 'N'
}

// /******************************
//  * TODO (목적): 목록 조회
//  *******************************/
// function getList() {
//   $http({
//     url: listUrl.value,
//     method: 'get',
//     params: {
//       envWaterDailyResultId: props.param.envWaterDailyResultId,
//       plantCd: props.param.plantCd
//     }
//   }).then((_result: any) => {
//     grid.value.data = _result.data
//   })
// }

// /******************************
//  * TODO (목적): 저장
//  *******************************/
// function saveData() {
//   const saveData = grid.value.data!.filter((x) => x.editFlag == 'U' || x.editFlag == 'C')
//   _.forEach(saveData, (item) => {
//     item.regUserId = user.value.userId
//     item.chgUserId = user.value.userId
//   })
//   if (saveData.length > 0) {
//     message.confirm({
//       title: '확인',
//       message: '저장하시겠습니까?',
//       type: 'info',
//       confirmCallback: () => {
//         $http({
//           url: saveUrl.value,
//           method: 'POST',
//           data: saveData
//         }).then(() => {
//           // getList()
//           message.requestSuccess()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   } else {
//     message.alert({
//       title: '안내',
//       message: '변경된 데이터가 없습니다.',
//       type: 'info' // success / info / warning / error
//     })
//   }
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

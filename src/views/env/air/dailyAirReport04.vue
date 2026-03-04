<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table4"
        title="배출시설 연료사용현황"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.fuelUsages"
        :filtering="false"
        :usePaging="false"
        :columnSetting="false"
        :editable="editable && !param.isFullScreen"
        @table-data-change="tableDataChange"
      >
        <!-- 버튼 영역 -->
        <!-- <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="!param.isFullScreen && editable"
              label="저장"
              icon="save"
              @btnClicked="saveData"
            />
          </q-btn-group>
        </template> -->
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
  name: 'dailyAirReport04'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
const fuelItems = ref<Array<any>>([])
const grid = ref<gridType>({
  columns: [
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      name: 'furnaceTemp',
      field: 'furnaceTemp',
      label: '온도(로내온도)',
      style: 'width:60px',
      type: 'number',
      align: 'left',
      sortable: false
    },
    {
      name: 'boilerPressure',
      field: 'boilerPressure',
      label: '압력(보일러)',
      style: 'width:60px',
      type: 'number',
      align: 'left',
      sortable: false
    },
    {
      name: 'pressureUnitCd',
      field: 'pressureUnitCd',
      label: '압력단위',
      style: 'width:60px',
      align: 'center',
      type: 'select',
      codeGroupCd: 'IEPS_PRESSURE_UNIT_CD',
      sortable: false
    },
    {
      name: 'pressureUnitName',
      field: 'pressureUnitName',
      label: '압력단위(직접입력)',
      style: 'width:60px',
      align: 'center',
      type: 'text',
      disableTarget: 'pressureUnitCd',
      disableCon: '9',
      sortable: false
    },
    {
      name: 'envAirMstFuelId',
      field: 'envAirMstFuelId',
      label: '연료',
      style: 'width:60px',
      type: 'select',
      comboItems: fuelItems.value,
      align: 'left',
      sortable: false
    },
    {
      name: 'unit',
      field: 'unit',
      label: '단위',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'prevFuelIndicator',
      field: 'prevFuelIndicator',
      label: '전일지침',
      style: 'width:60px',
      type: 'cost',
      align: 'center',
      sortable: false
    },
    {
      name: 'fuelIndicator',
      field: 'fuelIndicator',
      label: '금일지침',
      type: 'number',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'fuelVolume',
      field: 'fuelVolume',
      label: '사용량',
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
      sortable: false
    }
  ],
  data: [],
  height: '560px'
})
const listUrl = ref('')
// const saveUrl = ref('')

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
  listUrl.value = selectConfig.env.air.mst.fuel.list.url
  // saveUrl.value = transactionConfig.env.air.daily.fuel.save.url
  // code setting
  // list setting
  getFuelList()
}
/******************************
 * TODO (목적): 연료 조회
 *******************************/
function getFuelList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      fuelItems.value.push({
        code: item.envAirMstFuelId,
        codeName: item.envAirMstFuelName
      })
    })
  })
}

/******************************
 * TODO (목적): 테이블 셀 값 변경시 로직
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  const prev = Number(_props.row.prevFuelIndicator)
  const today = Number(_props.row.fuelIndicator)
  if (prev && today) _props.row.fuelVolume = (today - prev).toFixed(2)
  else _props.row.fuelVolume = today
  if (col.name === 'envAirMstFuelId') {
    $http({
      url: selectConfig.env.air.mst.fuel.list.url,
      method: 'GET',
      params: { envAirMstFuelId: _props.row.envAirMstFuelId }
    }).then((_result: any) => {
      _props.row.unit =
        _result.data[0].airFuelUnitCd === '14'
          ? _result.data[0].airFuelUnitName
          : _result.data[0].airFuelUnitName1
    })
  }
}

// /******************************
//  * TODO (목적): 목록 조회
//  *******************************/
// function getList() {
//   $http({
//     url: listUrl.value,
//     method: 'GET',
//     params: { envAirDailyResultId: props.param.envAirDailyResultId, plantCd: props.param.plantCd }
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
//           getList()
//           message.alert({
//             title: '안내',
//             message: '저장되었습니다.',
//             type: 'success' // success / info / warning / error
//           })
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

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="table1"
        title="용수 공급원별 사용량"
        :columns="grid1.columns"
        :gridHeight="!param.isFullScreen ? gridHeight : '352px'"
        :data="dailyReportData.supwaterModels"
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
              @btnClicked="saveData1"
            /> -->
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="table2"
        title="용수 공급원별 폐수배출량"
        :columns="grid2.columns"
        :gridHeight="!param.isFullScreen ? gridHeight : '352px'"
        :data="dailyReportData.diswaterModels"
        :usePaging="false"
        :hideBottom="false"
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
              @btnClicked="saveData2"
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
  name: 'dailyReport03'
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
  contentHeight?: any
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
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'envWaterMstSupwaterName',
      field: 'envWaterMstSupwaterName',
      label: '용수구분명',
      align: 'center',
      sortable: false
    },
    {
      name: 'prevScore',
      field: 'prevScore',
      label: '전일지침(㎥)',
      type: 'cost',
      align: 'center',
      style: 'width:16%',
      sortable: false
    },
    {
      name: 'nowScore',
      field: 'nowScore',
      label: '금일지침(㎥)',
      align: 'center',
      type: 'number',
      style: 'width:16%',
      sortable: false
    },
    {
      name: 'todayScore',
      field: 'todayScore',
      label: '사용량(㎥/일)',
      type: 'cost',
      align: 'center',
      style: 'width:16%',
      sortable: false
    },
    {
      name: 'todayTime',
      field: 'todayTime',
      label: '검침시간',
      align: 'center',
      type: 'datetime',
      minuteStep: 10,
      style: 'width:16%',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'envWaterMstDiswaterName',
      field: 'envWaterMstDiswaterName',
      label: '용수구분명',
      align: 'center',
      sortable: false
    },
    {
      name: 'prevScore',
      field: 'prevScore',
      label: '전일지침(㎥)',
      type: 'cost',
      align: 'center',
      style: 'width:22%',
      sortable: false
    },
    {
      name: 'nowScore',
      field: 'nowScore',
      label: '금일지침(㎥)',
      align: 'center',
      type: 'number',
      style: 'width:22%',
      sortable: false
    },
    {
      name: 'todayScore',
      field: 'todayScore',
      label: '배출량 및 사용량(㎥/일)',
      type: 'cost',
      align: 'center',
      style: 'width:22%',
      sortable: false
    },
    {
      name: 'todayTime',
      field: 'todayTime',
      label: '검침시간',
      align: 'center',
      type: 'datetime',
      minuteStep: 10,
      style: 'width:16%',
      sortable: false
    }
  ],
  data: []
})
// const listUrl1 = ref('')
// const saveUrl1 = ref('')
// const listUrl2 = ref('')
// const saveUrl2 = ref('')

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
  // listUrl1.value = selectConfig.env.water.daily.supwater.list.url
  // saveUrl1.value = transactionConfig.env.water.daily.supwater.save.url
  // listUrl2.value = selectConfig.env.water.daily.diswater.list.url
  // saveUrl2.value = transactionConfig.env.water.daily.diswater.save.url
  // code setting
  // list setting
  // getList1()
  // getList2()
}

/******************************
 * TODO (목적): 테이블 데이터 변경1
 *******************************/
function tableDataChange(_props: any) {
  if (_props.row.prevScore > 0 && _props.row.nowScore > 0) {
    _props.row.todayScore = Math.round((_props.row.nowScore - _props.row.prevScore) * 100) / 100
  } else if (
    (_props.row.prevScore == 0 || _props.row.prevScore === null) &&
    _props.row.nowScore > 0
  ) {
    _props.row.todayScore = Math.round(_props.row.nowScore * 100) / 100
  } else if (!_props.row.prevScore && !_props.row.nowScore) _props.row.todayScore = 0
  else if (!_props.row.nowScore) _props.row.todayScore = 0
}

// /******************************
//  * TODO (목적): 목록 조회1
//  *******************************/
// function getList1() {
//   $http({
//     url: listUrl1.value,
//     method: 'GET',
//     params: {
//       envWaterDailyResultId: props.param.envWaterDailyResultId,
//       plantCd: props.param.plantCd
//     }
//   }).then((_result: any) => {
//     grid1.value.data = _result.data
//   })
// }

// /******************************
//  * TODO (목적): 목록 조회2
//  *******************************/
// function getList2() {
//   $http({
//     url: listUrl2.value,
//     method: 'GET',
//     params: {
//       envWaterDailyResultId: props.param.envWaterDailyResultId,
//       plantCd: props.param.plantCd
//     }
//   }).then((_result: any) => {
//     grid2.value.data = _result.data
//   })
// }

// /******************************
//  * TODO (목적): 저장1
//  *******************************/
// function saveData1() {
//   const saveData = grid1.value.data!.filter((x) => {
//     return x.editFlag == 'U' || x.editFlag == 'C'
//   })
//   if (saveData.length > 0) {
//     message.confirm({
//       title: '확인',
//       message: '저장하시겠습니까?',
//       type: 'info',
//       confirmCallback: () => {
//         $http({
//           url: saveUrl1.value,
//           method: 'POST',
//           data: saveData
//         }).then(() => {
//           message.requestSuccess()
//           // getList1()
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

// /******************************
//  * TODO (목적): 저장2
//  *******************************/
// function saveData2() {
//   const saveData = grid2.value.data!.filter((x) => {
//     return x.editFlag == 'U' || x.editFlag == 'C'
//   })
//   if (saveData.length > 0) {
//     message.confirm({
//       title: '확인',
//       message: '저장하시겠습니까?',
//       type: 'info',
//       confirmCallback: () => {
//         $http({
//           url: saveUrl2.value,
//           method: 'POST',
//           data: saveData
//         }).then(() => {
//           message.requestSuccess()
//           // getList2()
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

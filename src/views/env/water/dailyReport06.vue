<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table6"
        title="전력사용량"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.powerUsageModels"
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
  name: 'dailyReport06'
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'envWaterMstPreventiveName',
      field: 'envWaterMstPreventiveName',
      label: '방지시설명',
      style: 'width:200px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envWaterMstWattmeterNo',
      field: 'envWaterMstWattmeterNo',
      label: '적산전력계번호',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envWaterMstWattmeterName',
      field: 'envWaterMstWattmeterName',
      label: '전력계구분명',
      style: 'width:70px',
      align: 'center',
      sortable: false
    },
    {
      name: 'prevPowerIndicator',
      field: 'prevPowerIndicator',
      label: '전일지침(Kwh)',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'powerIndicator',
      field: 'powerIndicator',
      label: '금일지침(Kwh)',
      style: 'width:80px',
      align: 'center',
      type: 'decimal',
      integer: 10,
      point: 2,
      sortable: false
    },
    {
      name: 'powerUsage',
      field: 'powerUsage',
      label: '사용량(Kwh)',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'readingTime',
      field: 'readingTime',
      label: '검침시간',
      align: 'center',
      type: 'datetime',
      style: 'width:80px',
      minuteStep: 10,
      sortable: false
    }
  ],
  data: []
})
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
  // listUrl.value = selectConfig.env.water.daily.preventive.list.url
  // saveUrl.value = transactionConfig.env.water.daily.preventive.save.url
  // code setting
  // list setting
  // getList()
}

/******************************
 * TODO (목적): 테이블 셀 값 변경시 로직
 *******************************/
function tableDataChange(_props: any) {
  const prev = Number(_props.row.prevPowerIndicator)
  const today = Number(_props.row.powerIndicator)

  if (prev && today) {
    if (prev <= today) {
      _props.row.powerUsage = (today - prev).toLocaleString()
    } else {
      const usage = _props.row.maxValue - prev + today
      _props.row.powerUsage = usage.toLocaleString()
    }
  } else {
    _props.row.powerUsage = today.toLocaleString()
  }
}

// /******************************
//  * TODO (목적): 목록 조회
//  *******************************/
// function getList() {
//   $http({
//     url: listUrl.value,
//     method: 'GET',
//     params: {
//       envWaterDailyResultId: props.param.envWaterDailyResultId,
//       plantCd: props.param.plantCd
//     }
//   }).then((_result: any) => {
//     grid.value.data = _result.data
//     console.log(_result.data)
//   })
// }

// /******************************
//  * TODO (목적): 저장
//  *******************************/
// function saveData() {
//   const saveData = grid.value.data!.filter((x) => {
//     return x.editFlag == 'U' || x.editFlag == 'C'
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
//           message.requestSuccess()
//           // getList()
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

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table3"
        title="방지시설 보수내역"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.preventiveMaintenances"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :editable="editable && !param.isFullScreen"
        selection="multiple"
        rowKey="envAirDailyResultPreventiveHistoryId"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addrow1" />
            <c-btn
              v-if="
                editable &&
                dailyReportData.preventiveMaintenances &&
                dailyReportData.preventiveMaintenances.length > 0
              "
              label="제외"
              icon="remove"
              @btnClicked="removeRow1"
            />
            <!-- <c-btn
              v-if="editable && grid.data!.length > 0"
              label="저장"
              icon="save"
              @btnClicked="saveRow1"
            /> -->
          </q-btn-group>
        </template>
      </c-table>
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
  name: 'dailyAirReport03'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
    plantCd?: stringNull
    envAirDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
  }
  disFlag?: boolean
  dailyReportData?: any
  contentHeight?: any
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
  columns: [
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'period',
      field: 'period',
      label: '보수기간',
      child: [
        {
          name: 'startDt',
          field: 'startDt',
          label: '보수시작일',
          align: 'center',
          type: 'date',
          style: 'width:100px',
          sortable: true
        },
        {
          name: 'endDt',
          field: 'endDt',
          label: '보수종료일',
          align: 'center',
          type: 'date',
          style: 'width:100px',
          sortable: true
        }
      ]
    },
    {
      name: 'userName',
      field: 'userName',
      label: '보수자',
      align: 'center',
      type: 'user',
      userId: 'userId',
      setHeader: true,
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '보수명세',
      align: 'left',
      type: 'text',
      style: 'width:300px',
      sortable: true
    }
  ],
  data: [],
  height: '650px'
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const table3 = ref<any>(null)

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
  listUrl.value = selectConfig.env.air.daily.preventive.history.url
  insertUrl.value = transactionConfig.env.air.daily.preventive.history.save.url
  deleteUrl.value = transactionConfig.env.air.daily.preventive.history.delete.url
  // code setting
  // list setting
  // getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
// function getList() {
//   $http({
//     url: listUrl.value,
//     method: 'GET',
//     params: { dailyResultDt: props.param.dailyResultDt }
//   }).then((_result: any) => {
//     grid.value.data = _result.data
//   })
// }
/******************************
 * TODO (목적): 대기방지시설 팝업에서 추가
 *******************************/
function addrow1() {
  console.log(props.dailyReportData.deptCd)
  popupOptions.value = getPopupOptions('airPreventive', popupOptions.value, closePopup, {
    type: 'multiple',
    searchParam: { plantCd: props.param.plantCd, deptCd: props.dailyReportData.deptCd }
  })
}
function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (_item) => {
      props.dailyReportData.preventiveMaintenances!.push({
        plantCd: props.param.plantCd, // 사업장코드
        preventiveName: _item.preventiveName, // 대기방지시설명
        envAirMstPreventiveId: _item.envAirMstPreventiveId, // 대기방지시설 일련번호
        envAirDailyResultPreventiveHistoryId: uid(), // 방지시설 보수내역 일련번호
        startDt: props.dailyReportData.dailyResultDt,
        endDt: props.dailyReportData.dailyResultDt,
        userId: user.value.userId,
        userName: user.value.userName,
        remark: '',
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): 선택행 제외
 *******************************/
function removeRow1() {
  const selectData = table3.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!props.dailyReportData.deletePreventiveMaintenances)
        props.dailyReportData.deletePreventiveMaintenances = []

      if (item.editFlag !== 'C') {
        props.dailyReportData.deletePreventiveMaintenances.push(item)
      }
      props.dailyReportData.preventiveMaintenances = _.reject(
        props.dailyReportData.preventiveMaintenances,
        item
      )
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
// function saveRow1() {
//   const checkItem = ['startDt', 'endDt', 'userId']
//   let isConti = true
//   _.forEach(grid.value.data, (item) => {
//     _.forEach(checkItem, (check) => {
//       if (!item[check]) {
//         isConti = false
//         return false
//       }
//     })
//   })
//   if (!isConti) {
//     message.alert({
//       title: '안내',
//       message: '필수 입력값을 입력해 주세요. [보수시작일, 보수종료일, 보수자]',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     const saveData = grid.value.data!.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
//     _.forEach(saveData, (item) => {
//       item.regUserId = user.value.userId
//       item.chgUserId = user.value.userId
//     })
//     if (saveData.length > 0) {
//       message.confirm({
//         title: '확인',
//         message: '저장하시겠습니까?',
//         type: 'info',
//         confirmCallback: () => {
//           $http({
//             url: insertUrl.value,
//             method: 'POST',
//             data: saveData
//           }).then(() => {
//             message.requestSuccess()
//             getList()
//           })
//         },
//         cancelCallback: () => {}
//       })
//     } else {
//       message.alert({
//         title: '안내',
//         message: '변경된 데이터가 없습니다.',
//         type: 'info' // success / info / warning / error
//       })
//     }
//   }
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

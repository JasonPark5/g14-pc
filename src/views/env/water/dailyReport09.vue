<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table9"
        title="수질오염방지시설 고장 유무 및 특기사항"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.preventiveBreakdownModels"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :editable="editable && !param.isFullScreen"
        selection="multiple"
        rowKey="envWaterMstPreventiveBreakdownId"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              label="추가"
              icon="add"
              v-if="!param.isFullScreen && editable && !disFlag"
              @btnClicked="addPreventive"
            />
            <c-btn
              v-if="
                !param.isFullScreen &&
                editable &&
                props.dailyReportData.preventiveBreakdownModels.length > 0
              "
              label="제외"
              icon="remove"
              @btnClicked="removePreventive"
            />
            <!-- <c-btn
              v-if="!param.isFullScreen &&
                editable &&
                props.dailyReportData.preventiveBreakdownModels.length > 0
              "
              label="저장"
              icon="save"
              @btnClicked="saveData"
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
  name: 'dailyReport09'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
      required: true,
      name: 'envWaterMstPreventiveName',
      field: 'envWaterMstPreventiveName',
      label: '고장시설명',
      align: 'center',
      sortable: false
    },
    {
      name: 'breakdownStartDt',
      field: 'breakdownStartDt',
      label: '고장시작일',
      align: 'center',
      type: 'date',
      style: 'width:140px',
      sortable: true
    },
    {
      name: 'breakdownEndDt',
      field: 'breakdownEndDt',
      label: '고장종료일',
      align: 'center',
      type: 'date',
      style: 'width:140px',
      sortable: true
    },
    {
      name: 'breakdownStatus',
      field: 'breakdownStatus',
      label: '고장상태',
      align: 'left',
      type: 'text',
      style: 'width:20%',
      sortable: true
    },
    {
      name: 'breakdownAction',
      field: 'breakdownAction',
      label: '조치상태',
      align: 'left',
      type: 'text',
      style: 'width:20%',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '특기사항',
      align: 'left',
      type: 'text',
      style: 'width:20%',
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
  width: '60%',
  top: '',
  param: {},
  closeCallback: null
})
// const listUrl = ref('')
// const saveUrl = ref('')
// const deleteUrl = ref('')
const table9 = ref<any>(null)

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
  // listUrl.value = selectConfig.env.water.mst.preventive.breakdown.list.url
  // saveUrl.value = transactionConfig.env.water.mst.preventive.breakdown.save.url
  // deleteUrl.value = transactionConfig.env.water.mst.preventive.breakdown.deletes.url
  // code setting
  // list setting
  // getList()
}

/******************************
 * TODO (목적): 추가
 *******************************/
function addPreventive() {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/common/water/waterPreventivePop.vue`))
  )

  popupOptions.value.title = '수질방지시설 검색'
  popupOptions.value.param = {
    type: 'multiple',
    plantCd: props.param.plantCd
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (_item) => {
      if (
        _.findIndex(props.dailyReportData.preventiveBreakdownModels, {
          envWaterMstPreventiveId: _item.envWaterMstPreventiveId
        }) === -1
      ) {
        props.dailyReportData.preventiveBreakdownModels!.splice(0, 0, {
          envWaterMstPreventiveName: _item.envWaterMstPreventiveName, // 수질방지시설명
          envWaterMstPreventiveId: _item.envWaterMstPreventiveId, // 수질방지시설 일련번호
          envWaterMstPreventiveBreakdownId: uid(), // 수질방지시설 고장이력 일련번호
          breakdownStartDt: props.param.dailyResultDt, // 고장기간 시작일
          breakdownEndDt: props.param.dailyResultDt, // 고장기간 종료일
          breakdownStatus: '', // 고장상태
          breakdownAction: '', // 조치사항
          remark: '', // 특기사항
          bactionDt: '', // 조치일
          chgUserId: user.value.userId,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 제외
 *******************************/
function removePreventive() {
  const selectData = table9.value.getSelected()
  if (selectData.length > 0) {
    // message.confirm({
    //   title: '확인',
    //   message: '삭제하시겠습니까?',
    //   type: 'info',
    //   confirmCallback: () => {
    if (!props.dailyReportData.deletePreventiveBreakdownModels)
      props.dailyReportData.deletePreventiveBreakdownModels = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.dailyReportData.deletePreventiveBreakdownModels, {
          envWaterMstPreventiveBreakdownId: item.envWaterMstPreventiveBreakdownId
        }) === -1
      ) {
        props.dailyReportData.deletePreventiveBreakdownModels.push(item)
      }
      props.dailyReportData.preventiveBreakdownModels = _.reject(
        props.dailyReportData.preventiveBreakdownModels,
        item
      )
    })
    table9.value.compoTable.clearSelection()
    //   },
    //   cancelCallback: () => {}
    // })
  } else {
    message.alert({
      title: '안내',
      message: '선택된 데이터가 없습니다.',
      type: 'warning' // success / info / warning / error
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
//   const saveData = grid.value.data!.filter((x) => {
//     return x.editFlag == 'U' || x.editFlag == 'C'
//   })
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

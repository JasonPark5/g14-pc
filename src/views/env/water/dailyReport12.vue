<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-table
          ref="table12"
          title="지도ㆍ점검을 받은 사항"
          :columns="grid.columns"
          :gridHeight="gridHeight"
          :data="dailyReportData.guidanceModels"
          :usePaging="false"
          :columnSetting="false"
          :filtering="false"
          :editable="editable && !param.isFullScreen"
          selection="multiple"
          rowKey="envWaterDailyResultGuidanceId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="!param.isFullScreen && editable"
                label="추가"
                icon="add"
                @btnClicked="addRow"
              />
              <c-btn
                v-if="
                  !param.isFullScreen && editable && props.dailyReportData.guidanceModels.length > 0
                "
                label="제외"
                icon="remove"
                @btnClicked="deleteRow"
              />
              <!-- <c-btn
                label="저장"
                icon="save"
                v-if="!param.isFullScreen && editable"
                @btnClicked="saveData"
              /> -->
            </q-btn-group>
          </template>
        </c-table>
      </q-form>
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
  name: 'dailyReport12'
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
      name: 'guidanceOrgName',
      field: 'guidanceOrgName',
      label: '단속기관',
      align: 'center',
      type: 'text',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'guidanceUserName',
      field: 'guidanceUserName',
      label: '단속기관 점검자',
      align: 'center',
      type: 'text',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'violationItem',
      field: 'violationItem',
      label: '위반사항',
      align: 'left',
      style: 'width:300px',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'actionItem',
      field: 'actionItem',
      label: '조치사항',
      align: 'left',
      type: 'textarea',
      sortable: false
    }
  ],
  data: []
})
// const listUrl = ref('')
// const saveUrl = ref('')
// const deleteUrl = ref('')
const table12 = ref<any>(null)
const editForm = ref<any>(null)

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
  // listUrl.value = selectConfig.env.water.daily.guidance.list.url
  // saveUrl.value = transactionConfig.env.water.daily.guidance.save.url
  // deleteUrl.value = transactionConfig.env.water.daily.guidance.delete.url
  // code setting
  // list setting
  // getList()
}

/******************************
 * TODO (목적): 추가
 *******************************/
function addRow() {
  props.dailyReportData.guidanceModels!.push({
    envWaterDailyResultId: props.param.envWaterDailyResultId, // 수질일지 일련번호
    envWaterDailyResultGuidanceId: uid(), // 지도점검일련번호
    guidanceOrgName: '', // 단속기관
    guidanceUserName: '', // 단속기관점검자
    violationItem: '', // 위반사항
    actionItem: '', // 조치사항
    editFlag: 'C',
    regUserId: user.value.userId
  })
}

/******************************
 * TODO (목적): 제외
 *******************************/
function deleteRow() {
  const selectData = table12.value.getSelected()
  if (selectData.length > 0) {
    // message.confirm({
    //   title: '확인',
    //   message: '삭제하시겠습니까?',
    //   type: 'info',
    //   confirmCallback: () => {
    if (!props.dailyReportData.deleteGuidanceModels) props.dailyReportData.deleteGuidanceModels = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.dailyReportData.deleteGuidanceModels, {
          envWaterDailyResultGuidanceId: item.envWaterDailyResultGuidanceId
        }) === -1
      ) {
        props.dailyReportData.deleteGuidanceModels.push(item)
      }
      props.dailyReportData.guidanceModels = _.reject(props.dailyReportData.guidanceModels, item)
    })
    table12.value.compoTable.clearSelection()
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
//     editForm.value.validate().then((_result: boolean) => {
//       if (_result && validTable(grid.value.columns, grid.value.data)) {
//         message.confirm({
//           title: '확인',
//           message: '저장하시겠습니까?',
//           type: 'info',
//           confirmCallback: () => {
//             $http({
//               url: saveUrl.value,
//               method: 'POST',
//               data: saveData
//             }).then(() => {
//               message.requestSuccess()
//               getList()
//             })
//           },
//           cancelCallback: () => {}
//         })
//       }
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

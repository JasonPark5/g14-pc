<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table1"
        title="유해‧위험 요인 확인 및 필요 조치 실시 여부 (위험성평가)"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="grid.results"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :isExcelDown="false"
        :editable="editable"
        :gridHeightAuto="props.param.isFullScreen"
      >
        <!-- :results="grid.results" -->
        <!-- 버튼 영역
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              label="저장"
              icon="save"
              v-if="!param.isFullScreen && editable"
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
  name: 'safetyHealthDutyInspectionCheckList01'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
    sdpSemiCheckId?: stringNull // 추가
    plantCd?: stringNull
    isFullScreen?: boolean
    sdpSemiCheckResultId?: stringNull // 추가
  }
  parentItemId?: stringNull // 추가
}
// infor에게 받은 값
interface gridType {
  columns?: Array<tableColumnType>
  results?: Array<any>
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
      sdpSemiCheckId: null,
      sdpSemiCheckResultId: null,
      plantCd: null
      //isFullScreen: false
      // dailyResultDt: ''
      //approvalStatusCd: null,
      //approvalTarget: false
    }
  },
  parentItemId: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
//UI수정
const grid = ref<gridType>({
  columns: [
    {
      name: 'checkContent',
      field: 'checkContent',
      label: '점검내용',
      align: 'left',
      type: 'textarea',
      style: 'width:40%',
      sortable: false
    },
    {
      name: 'checkResultCd',
      field: 'checkResultCd',
      label: '점검결과(적정/부적정/해당없음)',
      align: 'center',
      sortable: true,
      style: 'width:10%',
      type: 'select',
      codeGroupCd: 'CHECK_RESULT_CD', // 코드그룹코드
      setHeader: true
    },

    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      type: 'textarea',
      align: 'center',
      sortable: true
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      type: 'custom',
      sortable: false
    }
  ],
  results: [],
  height: '400px'
})

const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
// const editable = computed(() => {
//   if (props.param.approvalTarget) return true
//   else if (props.param.approvalStatusCd !== null) return false
//   else return Boolean(route.meta.editable)
// })

const editable = computed(() => {
  return Boolean(route.meta.editable)
})

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
  listUrl.value = selectConfig.sai.sse.mst.list.url // 질문 항목 목록 조회 URL
  //saveUrl.value = transactionConfig.sai.sse.insert.list.url
  // code setting
  // list setting
}

/******************************
 * TODO (목적): 저장
 *******************************/
// function saveData() {
//   const saveData = grid.value.data!.filter((x) => x.editFlag == 'U' || x.editFlag == 'C')
//   _.forEach(saveData, (item) => {
//     console.log('sdpSemiCheckId 값 확인하기 :', props.param.sdpSemiCheckId)
//     item.sdpSemiCheckId = props.param.sdpSemiCheckId
//     item.sdpSemiCheckResultId = item.sdpSemiCheckResultId || uid()
//     item.parentItemId = props.param.parentItemId
//     item.regUserId = user.value.userId
//     item.chgUserId = user.value.userId

//     item.plantCd = props.param.plantCd
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

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table10"
        title="수질오염물질 측정내용"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="grid.data"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :editable="editable && !param.isFullScreen"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <!-- <c-btn label="저장" icon="save" v-if="!param.isFullScreen && editable" /> -->
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
  name: 'dailyReport10'
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
    plantCd?: stringNull
    envWaterDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
    approvalStatusCd?: stringNull
    approvalTarget?: boolean
  }
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
      dailyResultDt: '',
      approvalStatusCd: null,
      approvalTarget: false
    }
  }
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
      name: 'envWaterMstMeasurelocName',
      field: 'envWaterMstMeasurelocName',
      label: '측정위치 ',
      align: 'center',
      style: 'width: 200px',
      sortable: false,
      fix: true
    }
  ],
  data: [],
  height: '520px'
})
const listUrl = ref('')
const headerUrl = ref('')
const envWaterMstInspectItemIds = ref<Array<any>>([])
/******************************
 * @Computed_선언
 *******************************/
const editable = computed(() => {
  if (props.param.approvalTarget) return true
  else if (props.param.approvalStatusCd !== null) return false
  else return Boolean(route.meta.editable)
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
  listUrl.value = selectConfig.env.water.self.measureloc.list.url
  headerUrl.value = selectConfig.env.water.self.measureloc.header.url
  // code setting
  // list setting
  getHeader()
}

/******************************
 * TODO (목적): 헤더 조회
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: { plantCd: props.param.plantCd }
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      envWaterMstInspectItemIds.value.push(item.envWaterMstInspectItemId)
      grid.value.columns.push({
        name: item.envWaterMstInspectItemId,
        field: item.envWaterMstInspectItemId,
        label: item.envWaterMstInspectItemName + '<br>',
        align: 'center',
        // type: 'number',
        style: 'width: 90px',
        sortable: false,
        colorClass: ['R,bg-red-6 text-white', 'I,bg-orange-4 text-white'],
        colorTarget: item.envWaterMstInspectItemId + '001',
        helpcomment: '법적기준: ' + item.legalStandard + '<br>내부기준: ' + item.innerStandard
      })
    })
    // getList()
  })
}
// /******************************
//  * TODO (목적): 목록 조회
//  *******************************/
// function getList() {
//   $http({
//     url: listUrl.value,
//     method: 'GET',
//     params: {
//       measureDt: props.param.dailyResultDt,
//       envWaterMstInspectItemIds: envWaterMstInspectItemIds.value,
//       plantCd: props.param.plantCd
//     }
//   }).then((_result: any) => {
//     grid.value.data = _result.data
//   })
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

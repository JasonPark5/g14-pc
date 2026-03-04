<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="none"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="plantChange"
          />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      :title="`핵심요소 내부기준 목록 (${searchPlantName})`"
      :columns="grid.columns"
      :data="grid.data"
      @table-data-change="tableDataChange"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'selfEvaluationClassInnerStandard'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
// const searchParam = ref({
//   plantCd: null
// })
const grid = ref({
  columns: [
    {
      name: 'selfEvaluationClassName',
      field: 'selfEvaluationClassName',
      label: '핵심요소',
      align: 'left',
      sortable: false
    },
    {
      required: true,
      name: 'innerStandard',
      field: 'innerStandard',
      label: '내부기준',
      align: 'right',
      style: 'width:100px',
      sortable: false,
      type: 'number'
    },
    {
      name: 'totalCount',
      field: 'totalCount',
      label: '문항 수',
      align: 'right',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      sortable: true,
      style: 'width:350px',
      type: 'text'
    }
  ],
  data: []
})
const searchPlantName = ref('')
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

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
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.sai.sse.selfEvaluationClassInnerStandard.list.url
  saveUrl.value = transactionConfig.sai.sse.selfEvaluationClassInnerStandard.save.url
  // code setting
  searchPlantName.value = user.value.plantName
  // list setting
  getList()
}
/******************************
 * TODO (목적): 핵심요소 내부기준 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET'
    // params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
// /******************************
//  * TODO (목적): 사업장 변경에 따른 조회처리
//  * @param (1): 변경 값
//  *******************************/
// function plantChange(newValue: { value: stringNull; label: stringNull }) {
//   searchPlantName.value = newValue.label
//   getList()
// }
/******************************
 * TODO (목적): 내부기준 변경 시 문항 수에 따른 유효성 체크
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(bodyProps: any, col: tableColumnType) {
  if (col.name === 'innerStandard' && bodyProps.row.innerStandard > bodyProps.row.totalCount) {
    message.alert({
      title: '안내',
      message: '내부기준은 문항 수를 넘을 수 없습니다.',
      type: 'warning' // success / info / warning / error
    })
    bodyProps.row.innerStandard = 0
  }
}
/******************************
 * TODO (목적): 핵심요소 내부기준 저장 전 처리
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 핵심요소 내부기준 저장 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

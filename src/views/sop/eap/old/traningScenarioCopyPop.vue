<template>
  <div>
    <c-table
      ref="table"
      title="훈련 시나리오 목록"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      :isExpand="true"
      :usePaging="false"
      :columnSetting="false"
      rowKey="trainingScenarioNo"
      :selection="popupParam.type"
      @rowDblclick="rowDblclick"
    >
      <template v-slot:expand-header> {{ $language('시나리오 상세') }} </template>
      <template v-slot:expand-td="props">
        <q-table
          class="q-ma-md innerTable"
          flat
          :rows="props.row.emergencyScenarioDetailModelList"
          :columns="[
            {
              name: 'leadTime',
              field: 'leadTime',
              label: '소요시간',
              align: 'center',
              style: 'width: 15%'
            },
            {
              name: 'itemName',
              field: 'itemName',
              label: '항목',
              align: 'center',
              style: 'width: 15%'
            },
            {
              name: 'trainingDetailContents',
              field: 'trainingDetailContents',
              label: '상세훈련내용',
              align: 'left',
              style: 'width: 55%'
            },
            {
              name: 'managerUserName',
              field: 'managerUserName',
              label: '담당자',
              align: 'center',
              style: 'width: 15%'
            }
          ]"
          :hide-bottom="true"
        />
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
          <c-btn label="선택" icon="check" @btnClicked="select" />
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
  name: 'traningScenarioCopyPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    type: stringNull
    trainingScenarioNo: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
  popupParam: () => {
    return {
      type: 'multiple',
      trainingScenarioNo: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [
    {
      name: 'planDocu',
      field: 'planDocu',
      label: '비상조치계획',
      align: 'center',
      child: [
        {
          name: 'plantName',
          field: 'plantName',
          label: '사업장',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        },
        {
          name: 'emergencyPlanName',
          field: 'emergencyPlanName',
          label: '계획서명',
          align: 'center',
          sortable: true,
          style: 'width:150px'
        }
      ]
    },
    {
      name: 'traningScnario',
      field: 'traningScnario',
      label: '훈련시나리오',
      align: 'center',
      child: [
        {
          name: 'revisionNum',
          field: 'revisionNum',
          label: 'Rev.',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        },
        {
          name: 'trainingScenarioName',
          field: 'trainingScenarioName',
          label: '훈련시나리오명',
          align: 'center',
          sortable: true,
          style: 'width:150px'
        },
        {
          name: 'trainingContentsSummary',
          field: 'trainingContentsSummary',
          label: '훈련내용요약',
          align: 'left',
          sortable: true,
          style: 'width:450px'
        }
      ]
    }
  ],
  data: []
})
const table = ref<any>(null)
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  () => {
    let height = props.contentHeight - 200
    if (height < 400) {
      height = 500
    }
    grid.value.height = height + 'px'
  }
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.sop.eap.scenario.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { trainingScenarioNo: props.popupParam.trainingScenarioNo }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '시나리오를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
function rowDblclick(row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [row])
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.innerTable
  z-index: 0 !important
  td
    line-height: 28px !important
    background-color: #fffdf0 !important
  th
    height: 28px !important
    min-height: 28px !important
    background-color: #e5e5e5 !important
</style>

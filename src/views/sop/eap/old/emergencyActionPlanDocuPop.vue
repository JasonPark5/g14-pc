<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="EAP_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="emergencyTypeCd"
            label="비상사태구분"
            v-model:value="searchParam.emergencyTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="비상조치계획서 목록"
      :columns="grid.columns"
      :data="grid.data"
      gridHeight="770px"
      :selection="popupParam.type"
      rowKey="trainingScenarioNo"
      @rowDblclick="rowDblclick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
          <c-btn label="선택" icon="check" @btnClicked="select" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'emergencyActionPlanDocuPop'
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
  }
}
interface searchParamType {
  plantCd: stringNull
  emergencyTypeCd: stringNull
  useFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
      type: 'multiple'
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  plantCd: null,
  emergencyTypeCd: null,
  useFlag: 'Y'
})
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
          style: 'width:250px'
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
  listUrl.value = selectConfig.sop.eap.planDocu.list.url
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
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '비상조치계획서를 선택하세요.',
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

<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <!-- <div v-show="!processDisabled" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            :plantCd="searchParam.plantCd"
            label="관련공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            type="search"
            :comboItems="diagramKindItems"
            itemText="diagramKindName"
            itemValue="diagramClassCd"
            label="도면분류"
            name="diagramClassCd"
            v-model:value="searchParam.diagramClassCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text label="도면" name="diagramTitle" v-model:value="searchParam.diagramTitle" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="공정 도면 목록"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      :selection="popupParam.type"
      :columnSetting="false"
      :isExcelDown="false"
      :isFullScreen="false"
      rowKey="psiDiagramId"
      @rowDblclick="rowDblclick"
    >
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
  name: 'diagramPop'
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
    processCd: stringNull
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
      type: 'single',
      processCd: ''
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
const diagramKindItems = ref<any>([])
const searchParam = ref<any>({
  plantCd: '',
  processCd: '',
  deptCd: '',
  diagramClassCd: null,
  diagramTitle: '',
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'diagramKindName',
      field: 'diagramKindName',
      label: '도면분류',
      align: 'center',
      style: 'width: 250px',
      sortable: false
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'diagramNo',
      field: 'diagramNo',
      label: '도면번호',
      align: 'center',
      style: 'width: 150px',
      sortable: false
    },
    {
      name: 'diagramTitle',
      field: 'diagramTitle',
      label: '도면',
      align: 'left',
      sortable: false
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: '개정',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    }
  ],
  height: '650px',
  data: []
})
const listUrl = ref('')
const kindlistUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// const processDisabled = computed(() => {
//   return Boolean(props.popupParam.processCd)
// })

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
  listUrl.value = selectConfig.psi.diagram.list.url
  kindlistUrl.value = selectConfig.psi.diagramkind.url
  // code setting
  if (props.popupParam.processCd) {
    if (props.popupParam.processCd.indexOf('WTE') === -1) {
      searchParam.value.processCd = _.clone(props.popupParam.processCd)
    } else {
      searchParam.value.processCd = null
    }
  }
  // list setting
  getKind()
  getList()
}
function getKind() {
  $http({
    url: kindlistUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    diagramKindItems.value = _result.data
  })
}
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
      message: '선택된 항목이 없습니다.',
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

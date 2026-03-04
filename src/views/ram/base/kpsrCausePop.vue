<template>
  <c-table
    ref="table"
    :title="popupParam.riskTypName + ' : ' + $language('위험형태별 원인 목록')"
    :columns="grid.columns"
    :gridHeight="grid.height"
    :data="grid.data"
    :filtering="false"
    :columnSetting="false"
    :usePaging="false"
    :editable="editable"
    :selection="popupParam.type"
    @rowDblclick="rowDblclick"
    rowKey="ramRiskTypeCauseId"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="선택" icon="check" @btnClicked="select" />
      </q-btn-group>
    </template>
  </c-table>
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
  name: 'kpsrCausePop'
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
    // 대상공정의 구분을 확인 후 해당 구분에 맞게 목록을 조회 (회분식, 연속식)
    processType: stringNull
    // 위험형태 key를 제공받아 해당 key를 토대로 목록을 조회토록 설정
    ramRiskTypeId: stringNull
    riskTypName: stringNull
  }
  contentHeight: stringNull | numberNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => ({
    type: 'multiple',
    processType: '',
    ramRiskTypeId: '',
    riskTypName: ''
  }),
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
const grid = ref({
  columns: [] as any,
  data: [],
  height: '650px'
})
const listUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  () => {
    grid.value.height = Number(props.contentHeight) - 50 + 'px'
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
  listUrl.value = selectConfig.ram.riskTypeCause.list.url
  // code setting
  getComboItems('MDM_PROCESS_TYPE_CD').then((_result) => {
    grid.value.columns = [
      {
        name: 'riskTypeCauseMainName',
        field: 'riskTypeCauseMainName',
        label: '원인(대분류)',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'riskTypeCauseSubName',
        field: 'riskTypeCauseSubName',
        label: '원인(소분류)',
        align: 'left',
        style: 'width:300px',
        sortable: true
      },
      {
        name: 'processTypes',
        field: 'processTypes',
        label: '공정구분',
        align: 'center',
        style: 'width:80px',
        type: 'multiSelect',
        isObject: true,
        valueText: 'mdmProcessTypeName',
        valueKey: 'mdmProcessTypeCd',
        itemText: 'codeName',
        itemValue: 'code',
        comboItems: _result,
        sortable: true,
        disableTarget: 'none',
        disableCon: 'O'
      }
    ]
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskTypeId: props.popupParam.ramRiskTypeId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '원인을 하나 이상 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      item.riskTypName = props.popupParam.riskTypName
    })
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): Row 더블클릭
 *******************************/
function rowDblclick(_row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [_row])
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

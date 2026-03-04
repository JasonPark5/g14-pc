<template>
  <div>
    <c-table
      ref="table"
      :title="`${popupParam.requestContents}${$language('에 대한 Punch-list')}`"
      tableId="4mImprRequest"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      selection="multiple"
      rowKey="ram4mAssessImprId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addImpr" />
          <c-btn v-if="editable" label="제외" icon="remove" @btnClicked="removeImpr" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="saveImprRequest"
            @btnCallback="saveCallback"
          />
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
  name: '4mImprRiskReduce'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    ram4mAssessScenarioId: stringNull
    requestContents: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
  height: string
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      ram4mAssessScenarioId: '',
      requestContents: ''
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
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const grid = ref<gridType>({
  columns: [],
  data: [],
  height: '500px'
})
const table = ref<any>(null)

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
  listUrl.value = selectConfig.ram.fm.impr.list.url
  saveUrl.value = transactionConfig.ram.fm.impr.inserts.url
  // code setting
  uploderSetting('4M_IMPR_BEFORE').then((_result: any) => {
    uploderSetting('4M_IMPR_AFTER').then((_result2: any) => {
      grid.value.columns = [
        {
          name: 'ibmTitle',
          field: 'ibmTitle',
          label: '제목',
          align: 'left',
          style: 'width:300px',
          sortable: false,
          type: 'text',
          required: true
        },
        {
          name: 'actionContents',
          field: 'actionContents',
          label: '조치내용',
          align: 'left',
          style: 'width:400px',
          sortable: false,
          type: 'textarea',
          required: true
        },
        {
          name: 'actionCompleteDate',
          field: 'actionCompleteDate',
          label: '조치완료일',
          align: 'center',
          style: 'width:120px',
          sortable: false,
          type: 'date',
          required: true
        },
        {
          name: 'before',
          field: 'before',
          label: '개선 후 사진',
          align: 'center',
          style: 'width:200px',
          type: 'attach',
          taskClassCd: '4M_IMPR_BEFORE',
          keyText: 'ram4mAssessImprId',
          sortable: false,
          uploaderSetting: _result
        },
        {
          name: 'after',
          field: 'after',
          label: '개선 전 사진',
          align: 'center',
          style: 'width:200px',
          type: 'attach',
          taskClassCd: '4M_IMPR_AFTER',
          keyText: 'ram4mAssessImprId',
          sortable: false,
          uploaderSetting: _result2
        }
      ]
    })
  })
  // list setting
}
/******************************
 * TODO (목적): 개선 추가
 *******************************/
function addImpr() {
  grid.value.data.push({
    ram4mAssessImprId: uid(), // 시나리오별 Punch-list 번호
    ram4mAssessScenarioId: props.popupParam.ram4mAssessScenarioId, // 시나리오 일련번호_시나리오의 한 라인(원일별)
    ibmTitle: props.popupParam.requestContents + '_' + getToday(), // 제목
    stepFlag: 'N', // 완료여부
    actionCompleteDate: getToday(), // 조치완료일
    actionContents: '', // 조치내용
    regUserId: user.value.userId,
    regDt: getToday(),
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 개선 저장
 *******************************/
function saveImprRequest() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: $language(
        "목록에 표시된 Punch-list를 '" +
          props.popupParam.requestContents +
          "'항목에 대한 Punch-list건으로 추가합니다.\n\r 저장하시겠습니까?",
        { s1: props.popupParam.requestContents }
      ),
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.validError()
  }
}
/******************************
 * TODO (목적): 개선저장 callback
 *******************************/
function saveCallback(_result: any) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ram4mAssessScenarioId: props.popupParam.ram4mAssessScenarioId
    }
  }).then((_result: any) => {
    message.requestSuccess()
    emits('closePopup', _result.data)
  })
}
/******************************
 * TODO (목적): 개선 삭제
 *******************************/
function removeImpr() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      grid.value.data.splice(
        _.findIndex(grid.value.data, { sopImprovementId: item.sopImprovementId }),
        1
      )
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

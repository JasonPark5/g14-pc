<template>
  <div>
    <c-table
      ref="table"
      title="체크리스트 목록"
      :columns="grid.columns"
      :data="cto.ctoChecklistModels"
      :filtering="false"
      :isExcelDown="false"
      :columnSetting="false"
      :usePaging="false"
      noDataLabel="체크리스트를 추가하세요."
      :editable="editable && !disabled"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'selectValue'">
          <c-select
            v-if="!props.row.disable"
            class="no-label-control"
            :disabled="disabled"
            codeGroupCd="CTO_GOOD_BAD_CD"
            :editable="editable"
            type="edit"
            itemValue="code"
            itemText="codeName"
            v-model:value="props.row['selectValue']"
            @datachange="datachange(props)"
          />
        </template>
        <template v-else-if="col.name === 'remarks'">
          <c-textarea-column
            v-if="!props.row.disable"
            :editable="editable"
            :disabled="disabled"
            :col="col"
            :props="props"
            v-model:value="props.row['remarks']"
            @datachange="datachange(props)"
          />
        </template>
        <template v-else-if="col.name === 'customCol' && !props.row.disable">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled"
            :isImmShow="true"
            :requestContentsCols="requestContentsCols"
            tableKey="sopCtoChecklistId"
            ibmTaskTypeCd="ITT0000060"
            ibmTaskUnderTypeCd="ITTU000095"
            @imprChange="imprChange"
          />
        </template>
        <template v-else-if="col.name === 'checklistName'">
          <span
            v-if="props.row.disable"
            class="text-primary"
            style="font-size: 14px; margin-left: 5px; font-weight: 600"
          >
            {{ props.row.checklistName }}
          </span>
          <span v-else> {{ props.row.checklistName }}</span>
        </template>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled && cto.ctoChecklistModels.length > 0"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="cto.ctoChecklistModels"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="saveChecklist"
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
import { ctoType } from './cto'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'ctoChecklist'
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
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopCtoId: stringNull
  }
  cto: ctoType
  isOld: boolean
  disabled: boolean
}
interface gridType {
  columns: tableColumnType
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
      sopCtoId: ''
    }
  },
  cto: () => {
    return {
      sopCtoId: '',
      plantCd: '',
      ctoDate: '',
      ctoTime: '',
      observeUserId: '',
      observeCount: '',
      mdmSopId: '',
      workArea: '',
      ctoCompleteFlag: 'N',
      improveContents: '',
      priorityContents: '',
      managerUserId: '',
      sopName: '',
      processName: '',
      regUserId: '',
      chgUserId: '',
      workCharacteristics: '',
      humanFactors: '',
      coreActionItems: '',
      activityModels: [],
      deleteActivityModels: [],
      ctoChecklistModels: [],
      ctoImproveModels: []
    }
  },
  isOld: false,
  disabled: false
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'checklistName',
      field: 'checklistName',
      label: '체크리스트 항목',
      align: 'left',
      style: 'width:400px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'selectValue',
      field: 'selectValue',
      label: '양호/불량/해당없음',
      style: 'width:100px',
      type: 'custom',
      headType: 'select',
      align: 'center',
      setHeader: true,
      codeGroupCd: 'CTO_GOOD_BAD_CD',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      type: 'custom',
      style: 'width:400px',
      align: 'left',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:250px',
      type: 'custom',
      sortable: false
    }
  ]
})
const saveUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const requestContentsCols = computed(() => {
  return ['checklistName']
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  saveUrl.value = transactionConfig.sop.cto.checklist.save.url
  // code setting
  // list setting
}
function saveChecklist() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      _.forEach(props.cto.ctoChecklistModels, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId

        item.sopCtoId = props.popupParam.sopCtoId
      })
      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function saveCallback() {
  message.requestSuccess()
  emits('getDetail')
}
function datachange(_props: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
}
function imprChange() {
  emits('getDetail')
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

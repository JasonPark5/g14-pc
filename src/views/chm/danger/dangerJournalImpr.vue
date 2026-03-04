<template>
  <div class="col-lg-12 col-md-12 col-sm-12">
    <c-table
      ref="tableImpr"
      title="개선 목록"
      :columns="gridImpr.columns"
      gridHeight="500px"
      :data="journal.imprList"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      rowKey="chmDangerJournalItemId"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="!disabled"
            :isImmShow="true"
            :requestContentsCols="requestContentsCols"
            tableKey="chmDangerJournalItemId"
            ibmTaskTypeCd="ITT0000085"
            ibmTaskUnderTypeCd="ITTU000140"
            @imprChange="imprChange"
          />
        </template>
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
import { dangerJournalType } from './dangerStorage'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerJournalImpr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  journal?: dangerJournalType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
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
  journal: () => {
    return {
      imprList: [],
      chmDangerCompleteFlag: '',
      sysApprovalRequestId: ''
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
const tableImpr = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridImpr = ref<gridType>({
  columns: [
    {
      name: 'chmDangerItemName',
      field: 'chmDangerItemName',
      label: '점검항목',
      align: 'left',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:60%',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    props.journal.chmDangerCompleteFlag === 'Y' || props.journal.approvalStatusCd === 'ASC0000001'
)
// 개선요청 내용 전달
const requestContentsCols = computed(() => ['chmDangerItemName'])
// 개선요청 Component
const imprComponent = computed(() =>
  defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  emits('getDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

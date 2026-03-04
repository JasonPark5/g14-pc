<template>
  <c-table
    ref="table"
    :title="
      '가이드워드별 원인 목록' +
      (props.label ? ' (' + props.label : '') +
      (props.attrVal1 ? ' : ' + props.attrVal1 + ')' : '')
    "
    :columns="grid.columns"
    :gridHeight="grid.height"
    :data="gridData"
    :filtering="false"
    :columnSetting="false"
    :hideBottom="false"
    :usePaging="false"
    :editable="editable && !disabled"
    selection="multiple"
    rowKey="ramVariableGuidewordId"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn
          v-if="editable && !disabled"
          :showLoading="false"
          label="추가"
          icon="add"
          @btnClicked="addCause"
        />
        <c-btn
          v-if="editable && !disabled"
          :showLoading="false"
          label="제외"
          icon="remove"
          @btnClicked="deleteCause"
        />
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
import { variableType } from './hazopGuideword'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazopDeviationPosibleCause'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/

interface propType {
  variable: variableType
  ramVariableGuidewordCd: stringNull
  attrVal1?: stringNull
  label?: stringNull
  disabled: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

const props = withDefaults(defineProps<propType>(), {
  variable: () => {
    return {
      ramVariableId: '', // 변수 번호
      variableGuidewords: [], // 사용 가이드워드 목록
      deleteVariableGuidewords: [] // [삭제] 사용 가이드워드 목록
    }
  },
  ramVariableGuidewordCd: '',
  attrVal1: '',
  label: '',
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
const grid = ref({
  columns: [
    {
      name: 'causeName',
      field: 'causeName',
      label: '가능한 원인',
      align: 'left',
      type: 'textarea',
      sortable: false
    }
  ],
  data: [],
  height: '520px'
})
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridData = computed(() => {
  return _.filter(props.variable.variableGuidewords, {
    ramVariableGuidewordCd: props.ramVariableGuidewordCd
  })
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 원인 추가
 *******************************/
function addCause() {
  const date = new Date()
  if (!props.variable.variableGuidewords) {
    props.variable.variableGuidewords = []
  }
  props.variable.variableGuidewords.push({
    ramVariableGuidewordId: String(date.getTime()),
    ramVariableGuidewordCd: props.ramVariableGuidewordCd,
    causeName: '',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 원인 삭제
 *******************************/
function deleteCause() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.variable.deleteVariableGuidewords) {
      props.variable.deleteVariableGuidewords = []
    }
    _.forEach(selectData, (item: any) => {
      if (
        _.findIndex(props.variable.deleteVariableGuidewords, {
          ramVariableGuidewordId: item.ramVariableGuidewordId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.variable.deleteVariableGuidewords?.push(item)
      }
      props.variable.variableGuidewords = _.reject(props.variable.variableGuidewords, {
        ramVariableGuidewordId: item.ramVariableGuidewordId
      })
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

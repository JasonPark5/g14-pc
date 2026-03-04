<template>
  <div class="col-lg-12 col-md-12 col-sm-12">
    <c-table
      ref="table"
      title="점검항목 목록"
      :columns="itemGrid.columns"
      gridHeight="500px"
      :data="journal.itemList"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      rowKey="chmDangerJournalItemId"
    >
      <template v-slot:suffixTitle>
        <span style="font-size: 0.86em; color: tomato; margin: 0 10px">
          O : {{ $language('양호') }}
          <span style="margin: 0 10px">X : {{ $language('불량') }}</span>
          <q-icon name="change_history" /> : {{ $language('정비필요') }}
        </span>
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
import { dangerJournalType } from './dangerStorage'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerJournalItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  journal?: dangerJournalType
  itemGrid?: gridType
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
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  journal: () => {
    return {
      itemList: []
    }
  },
  itemGrid: () => {
    return {
      columns: [],
      data: []
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

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    props.journal.chmDangerCompleteFlag === 'Y' || props.journal.approvalStatusCd === 'ASC0000001'
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

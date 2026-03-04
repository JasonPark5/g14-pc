<template>
  <div>
    <c-table
      ref="table"
      :title="$language('개선 목록') + ' [' + $language(label) + ']'"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="gridHeight"
      @linkClick="linkClick"
    >
      <template v-slot:customArea="{ props }">
        <template>
          <span>
            {{ props.row.actionCompleteRequestDate }}
            <q-badge
              v-if="props.row.completeDateOver > 0"
              color="negative"
              :label="$language('지연')"
              class="blinking"
            />
          </span>
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
import { imprType } from './impr'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprActionRateDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  grid: any
  label: stringNull
  gridHeight: stringNull
  curTab: stringNull
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
  grid: () => {
    return {
      columns: [],
      data: [],
      allData: []
    }
  },
  label: '작성중',
  gridHeight: '',
  curTab: 'IS00000001'
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
  isFull: false,
  target: null,
  width: '80%',
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
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
  // code setting
  // list setting
}
/* eslint-disable no-unused-vars */
function linkClick(row: imprType) {
  if (props.curTab !== 'immTotal') {
    popupOptions.value.title = '개선 상세'
    popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./imprDetail.vue`)))
  } else {
    popupOptions.value.title = '즉시개선 상세'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./imprImmDetail.vue`))
    )
  }
  popupOptions.value.param = {
    isSearch: true,
    sopImprovementId: row.sopImprovementId,
    ibmTaskTypeCd: row.ibmTaskTypeCd
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

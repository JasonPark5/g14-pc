<!--
목적 : select 기반 select 컴포넌트(Not Autocomplete)
Detail :
  comboConfig.js 정보를 참고하여 컴포넌트 렌더링시 select 데이터 조회 해서 option 추가
 *
examples:
 *
-->
<template>
  <div class="fix-height">
    <q-field
      class="customTag"
      stack-label
      no-error-icon
      error-message=""
      color="orange-custom"
      :disable="disabled || !editable"
      :label="$language(label)"
      :error="!isValid"
      v-model="items"
    >
      <template v-slot:label v-if="label">
        <div class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
        </div>
      </template>
      <template v-slot:control>
        <q-chip
          v-for="(item, idx) in items"
          outline
          square
          :key="idx"
          :dense="dense"
          :removable="editable && !disabled"
          :clickable="clickable"
          :color="item['color'] ? String(item['color']) : 'primary'"
          :icon="icon"
          :label="String(item[itemText])"
          :title="item[itemText]"
          :model-value="Boolean(item[itemValue])"
          @remove="(state: any) => remove(state, item)"
          @click="(e: Event) => clickTag(item)"
        >
          <!-- <q-tooltip>{{ item[itemText] }}</q-tooltip> -->
        </q-chip>
        <q-chip
          v-if="editable && !disabled && isAdd"
          :dense="dense"
          outline
          square
          clickable
          color="orange"
          icon="add"
          :label="$language(addLabel)"
          :title="$language(addLabel)"
          @click="add"
        />
      </template>
    </q-field>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { ref } from 'vue'

import { arrayObject } from '@/types/variable'
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
  name: 'CTag'
})
/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

const emits = defineEmits(['removeTag', 'addTag', 'clickTag'])
/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/

interface propType {
  name?: string
  value: arrayObject | undefined | null
  label?: string
  editable?: boolean
  itemText?: string
  itemValue?: string
  disabled?: boolean
  required?: boolean
  dense?: boolean
  clickable?: boolean
  addLabel?: string
  icon?: string
  isAdd?: boolean
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: '',
  value: undefined,
  label: '',
  editable: true,
  itemText: '',
  itemValue: '',
  disabled: false,
  required: false,
  dense: true,
  clickable: false,
  addLabel: '추가',
  icon: 'precision_manufacturing',
  isAdd: true
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const items = ref<arrayObject | undefined | null>([])
/******************************
 * @Computed_선언
 *******************************/
const isValid = computed(() => !props.required || props.value)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.value,
  () => {
    items.value = props.value
  },
  { deep: true }
)
/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  items.value = props.value
})
/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
/******************************
 * TODO (목적): 삭제 emit
 *******************************/
function remove(state: boolean, item: any) {
  emits('removeTag', item)
}
function add() {
  emits('addTag')
}
function clickTag(item: any) {
  emits('clickTag', item)
}
</script>

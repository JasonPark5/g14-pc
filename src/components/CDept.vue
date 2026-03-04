<template>
  <div class="fix-height">
    <!-- readonly -->
    <q-input
      bottom-slots
      no-error-icon
      stack-label
      ref="customDept"
      class="customDept"
      :class="isTable ? 'tableDept' : ''"
      :rules="[validRule]"
      :label="$language(label)"
      :placeholder="$language(placeholder)"
      :disable="disabled || !editable"
      v-model="textDeptName"
    >
      <template v-slot:label>
        <div class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
        </div>
      </template>

      <template v-slot:append>
        <slot name="custom-btn-icon" />
        <q-icon v-if="editable && searchFlag" name="search" @click="click" class="cursor-pointer" />
        <q-icon v-if="editable && closeFlag" name="close" @click="reset" class="cursor-pointer" />
      </template>
    </q-input>

    <q-dialog
      persistent
      ref="deptDialog"
      class="mini-dialog"
      position="top"
      v-model="isOpen"
      @show="onShow"
      @hide="onHide"
    >
      <q-card class="dept-card dialog-layout">
        <q-card-section
          class="row items-center q-pb-none px-2 py-1 bg-mini-dialog text-white dialog-header cursor-move"
        >
          <div class="text-h6">
            {{ $language('부서') }}
          </div>
          <q-space />
          <q-btn icon="done" flat round dense @click="selectDept" />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              <q-chip outline square color="primary" text-color="white">
                {{ deptName }}
              </q-chip>
              <q-input ref="filterInput" dense v-model="filterData" label="Filter">
                <template v-slot:append>
                  <q-icon
                    v-if="filterData !== ''"
                    name="clear"
                    class="cursor-pointer"
                    @click="resetFilter"
                  />
                </template>
              </q-input>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-section class="dept-content p-2">
          <q-tree
            dense
            ref="customTreeDept"
            node-key="deptCd"
            label-key="deptName"
            children-key="children"
            selected-color="primary"
            :nodes="deptTree"
            :no-nodes-label="$language('부서 정보가 없습니다.')"
            :no-results-label="$language('필터링 된 데이터가 없습니다.')"
            :filter="filterData"
            :default-expand-all="defaultExpandAll"
            v-model:selected="selected"
            @update:selected="updateSelected"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
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
import arrayToTree from 'array-to-tree'
import { filter, find, forEach } from 'lodash-es'
import { storeToRefs } from 'pinia'
import {
  computed,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  watch
} from 'vue'

import { GetTranLanguageFunction } from '@/types/language'

import { useSystemInfoStore } from '@stores/systemInfo'
import { useUserStore } from '@stores/user'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CDept'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** userStore 호출 */
const systemInfo = useSystemInfoStore()
const { depts } = storeToRefs(systemInfo)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setDeptName', 'datachange', 'onShow', 'onHide'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  type?: string
  editable?: boolean
  disabled?: boolean
  required?: boolean
  isFirstValue?: boolean
  label?: string
  plantCd?: string
  defaultExpandAll?: boolean
  dense?: boolean
  multiple?: string
  searchFlag?: boolean
  closeFlag?: boolean
  isTable?: boolean
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
  name: '',
  type: 'edit',
  editable: true,
  disabled: false,
  required: false,
  isFirstValue: true,
  label: '부서',
  plantCd: '',
  defaultExpandAll: true,
  dense: true,
  multiple: 'single',
  searchFlag: true,
  closeFlag: true,
  isTable: false
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: '',
  type: String as PropType<string | null | undefined>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const deptCd = ref<string | null>('')
const deptName = ref<string | null>('')
const textDeptName = ref<string | null>('')
const placeholder = ref('선택')
const isOpen = ref(false)
const filterData = ref('')
const selected = ref<string | null>(null)
const target = ref<HTMLElement | null>(null)
const nodeDragg = ref<HTMLElement | null>(null)
const delay = ref(180)
const clicks = ref(0)
const timer = ref<NodeJS.Timeout>(setTimeout(() => {}, 1))
const customTreeDept = ref<any>(null)
const customDept = ref<any>(null)
const filterInput = ref<any>(null)
const deptDialog = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const filterDepts = computed(() => {
  let list: any = []
  if (user.value.plantCds !== null && user.value.plantCds !== '') {
    const plantCds = user.value.plantCds.split(',')
    forEach(depts.value, (_item: any) => {
      const index = plantCds.findIndex((a) => a === _item.plantCd)
      if (index > -1) {
        list.push(_item)
      }
    })
  } else {
    list = filter(depts.value, {
      plantCd: user.value.plantCd
    })
  }
  if (props.plantCd) {
    list = filter(list, { plantCd: props.plantCd })
  }
  if (props.editable && !props.disabled) {
    // 사용여부가 Y인 것만 리스트에 표현한다.
    // default : 사용여부 상관없이 전체
    list = filter(list, { useFlag: 'Y' })
  }
  return list
})
const deptTree = computed(() => {
  const val = convertTree(filterDepts.value)
  return val ? val : []
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [value.value, props.plantCd],
  () => {
    checkDefault()
  }
)
watch(
  () => filterDepts.value,
  () => {
    checkDefault()
  }
)
watch(selected, () => {
  const data = customTreeDept.value.getNodeByKey(selected.value)

  deptCd.value = selected.value
  if (data) {
    deptName.value = data.deptName
  } else {
    deptName.value = ''
  }
})
watch(
  () => props.searchFlag,
  () => {
    if (props.searchFlag === false) {
      customDept.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', click)
    }
  }
)
watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      customDept.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', click)
    } else {
      customDept.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', click)
      customDept.value.$el
        .getElementsByClassName('q-field__native')[0]
        .addEventListener('click', click)
    }
  }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})
onMounted(() => {
  if (!props.disabled) {
    customDept.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', click)
  }
})
onBeforeUnmount(() => {
  if (!props.disabled) {
    customDept.value.$el
      .getElementsByClassName('q-field__native')[0]
      .removeEventListener('click', click)
  }
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
  placeholder.value = props.type === 'search' ? $language('전체') : $language('선택')
  if (props.isFirstValue) {
    if (!value.value && (props.plantCd ? user.value.plantCd === props.plantCd : true)) {
      value.value = user.value.deptCd
      emits('setDeptName', user.value.deptName)
    } else {
      checkDefault()
    }
  }
  if (props.searchFlag === false) {
    customDept.value.$el
      .getElementsByClassName('q-field__native')[0]
      .removeEventListener('click', click)
  }
}
/******************************
 * TODO (목적): Tree에서 체크한 부서 정보 update
 *******************************/
function updateSelected() {
  clicks.value++
  if (clicks.value === 1) {
    timer.value = setTimeout(function () {
      /** 행 클릭 */
      clicks.value = 0
    }, delay.value)
  } else {
    /** 행 더블 클릭 */
    clearTimeout(timer.value)
    clicks.value = 0
    selectDept()
  }
}
/******************************
 * TODO (목적): 부서정보 셋팅
 *******************************/
function checkDefault() {
  // 부서 목록이 아직 로드되지 않았으면 검증 로직을 수행하지 않음 (기존 값 유지)
  if (filterDepts.value.length === 0) return

  let data = null
  if (value.value) {
    data = find(filterDepts.value, { deptCd: value.value })
    if (!data) {
      deptCd.value = null
      deptName.value = null
    } else {
      deptCd.value = data.deptCd
      deptName.value = data.deptName
    }
  } else {
    deptCd.value = null
    deptName.value = null
  }

  textDeptName.value = deptName.value
  value.value = deptCd.value
  emits('setDeptName', deptName.value)
  emits('datachange', deptCd.value, deptName.value)
}
/******************************
 * TODO (목적): 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
 * @param (1): 부서 리스트
 *******************************/
function convertTree(_treeBases: Array<any>) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: 'upDeptCd',
    customID: 'deptCd'
  })
  return tree
}
/******************************
 * TODO (목적): 부서 팝업 표시
 *******************************/
function click() {
  if (props.editable && !props.disabled) {
    isOpen.value = true
  }
}
/******************************
 * TODO (목적): filter 정보 초기화
 *******************************/
function resetFilter() {
  filterData.value = ''
  filterInput.value.focus()
}
/******************************
 * TODO (목적): 부서 정보 초기화
 *******************************/
function reset() {
  textDeptName.value = ''
  deptCd.value = ''
  deptName.value = ''
  value.value = deptCd.value
  emits('setDeptName', deptName.value)
  emits('datachange', deptCd.value, deptName.value)
}
/******************************
 * TODO (목적): 부서트리에서 부서 정보 선택
 *******************************/
function selectDept() {
  if (deptName.value) {
    textDeptName.value = deptName.value
    value.value = deptCd.value
    emits('setDeptName', deptName.value)
    emits('datachange', deptCd.value, deptName.value)
  }
  deptDialog.value.hide()
}
/******************************
 * TODO (목적): 부서 팝업 표시되었을 때 drag를 위한 event 설정
 *******************************/
function onShow() {
  const dialogElements = document.getElementsByClassName('mini-dialog')
  target.value = dialogElements[dialogElements.length - 1].querySelector('.dialog-layout')
  nodeDragg.value = target.value!.querySelector<HTMLElement>('.dialog-header')
  nodeDragg.value!.addEventListener('mousedown', onGrab)

  emits('onShow')
}
/******************************
 * TODO (목적): 부서 팝업 닫힐때 drag event 제거
 *******************************/
function onHide() {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onLetGo)
  nodeDragg.value!.removeEventListener('mousedown', onGrab)
  emits('onHide')
}
/******************************
 * TODO (목적): 부서팝업 drag
 *******************************/
function onDrag(e: MouseEvent) {
  const originalStyles = window.getComputedStyle(target.value!)
  target.value!.style.left = parseInt(originalStyles.left) + e.movementX + 'px'
  target.value!.style.top = parseInt(originalStyles.top) + e.movementY + 'px'

  if (parseInt(originalStyles.top) + e.movementY < 0) {
    target.value!.style.top = '0px'
  }
  if (parseInt(originalStyles.top) + e.movementY + 60 > window.innerHeight) {
    target.value!.style.top = window.innerHeight - 60 + 'px'
  }
}
/******************************
 * TODO (목적): 부서 팝업을 떠날시
 *******************************/
function onLetGo() {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onLetGo)
}
/******************************
 * TODO (목적): 부서 팝업 잡았을때 (마우스)
 *******************************/
function onGrab() {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', onLetGo)
}
/******************************
 * TODO (목적): 유효성 검증
 * @param (1): 값
 * @return (반환): true: 통과, 그 외 : 통과X
 *******************************/
function validRule(val: any) {
  return props.required ? Boolean(val) : true
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

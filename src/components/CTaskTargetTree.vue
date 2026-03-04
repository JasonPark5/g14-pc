<template>
  <div class="fix-height">
    <q-input
      bottom-slots
      readonly
      no-error-icon
      stack-label
      ref="customTaskTargetTree"
      class="customTaskTargetTree"
      :rules="[validRule]"
      :validMessage="validMessage"
      :label="$language(label)"
      :placeholder="$language(placeholder)"
      :disable="disabled || !editable"
      v-model="textTaskName"
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
      ref="taskDialog"
      class="mini-dialog"
      position="top"
      v-model="isOpen"
      @show="onShow"
      @hide="onHide"
    >
      <q-card class="task-tree-card dialog-layout">
        <q-card-section
          class="row items-center q-pb-none px-2 py-1 bg-mini-dialog text-white dialog-header cursor-move"
        >
          <div class="text-h6">
            {{ $language('업무') }}
          </div>
          <q-space />
          <q-btn icon="done" flat round dense @click="selectTarget" />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              <q-chip outline square color="primary" text-color="white">
                {{ targetName }}
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

        <q-card-section class="task-tree-content p-2">
          <q-tree
            dense
            ref="customTreeTarget"
            :node-key="manageTreeOption.taskCd"
            :label-key="manageTreeOption.taskName"
            children-key="children"
            selected-color="primary"
            :nodes="targetTree"
            :no-nodes-label="$language('업무 정보가 없습니다.')"
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
import {
  ref,
  watch,
  computed,
  inject,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  PropType
} from 'vue'
import arrayToTree from 'array-to-tree'
import { filter, find } from 'lodash-es'

import { getTreeOption, treeOptionsType } from '@utils/taskTreeOption'

import { GetTranLanguageFunction } from '@/types/language'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTaskTargetTree'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getName', 'dataChange', 'onShow', 'onHide'])

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
  label?: string
  plantCd?: string
  targetKey: string
  defaultExpandAll?: boolean
  dense?: boolean
  searchFlag?: boolean
  closeFlag?: boolean
  error?: ErrorFunction
  validMessage?: stringNull
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
  label: '업무',
  listUrl: '',
  plantCd: '',
  targetKey: '',
  defaultExpandAll: true,
  dense: true,
  searchFlag: true,
  closeFlag: true
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
const tasks = ref<Array<any>>([])
const targetCd = ref<string | null>('')
const targetName = ref<string | null>('')
const textTaskName = ref<string | null>('')
const placeholder = ref('선택')
const isOpen = ref(false)
const filterData = ref('')
const selected = ref<string | null>(null)
const target = ref<HTMLElement | null>(null)
const nodeDragg = ref<HTMLElement | null>(null)
const delay = ref(180)
const clicks = ref(0)
const timer = ref<NodeJS.Timeout>(setTimeout(() => {}, 1))
const manageTreeOption = ref<treeOptionsType>({
  targetKey: '',
  url: '',
  upTaskCd: '',
  taskCd: '',
  taskName: ''
})
const customTreeTarget = ref<any>(null)
const customTaskTargetTree = ref<any>(null)
const filterInput = ref<any>(null)
const taskDialog = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const filterTargets = computed(() => {
  let list: any = []
  if (props.editable && !props.disabled) {
    // 사용여부가 Y인 것만 리스트에 표현한다.
    // default : 사용여부 상관없이 전체
    list = filter(tasks.value, { useFlag: 'Y' })
  } else {
    list = tasks.value
  }
  return list
})
const targetTree = computed(() => {
  const val = convertTree(filterTargets.value)
  return val ? val : []
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => value.value,
  () => {
    checkDefault()
  }
)
watch(selected, () => {
  const data = customTreeTarget.value.getNodeByKey(selected.value)

  targetCd.value = selected.value
  if (data) {
    targetName.value = data[manageTreeOption.value.taskName]
  } else {
    targetName.value = ''
  }
})
watch(
  () => props.searchFlag,
  () => {
    if (props.searchFlag === false) {
      customTaskTargetTree.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', click)
    }
  }
)
watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      customTaskTargetTree.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', click)
    } else {
      customTaskTargetTree.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', click)
      customTaskTargetTree.value.$el
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
    customTaskTargetTree.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', click)
  }
})
onBeforeUnmount(() => {
  if (!props.disabled) {
    customTaskTargetTree.value.$el
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
  if (props.searchFlag === false) {
    customTaskTargetTree.value.$el
      .getElementsByClassName('q-field__native')[0]
      .removeEventListener('click', click)
  }

  manageTreeOption.value = getTreeOption(props.targetKey)
  getList()
}
/******************************
 * TODO (목적): 업무 조회
 *******************************/
function getList() {
  $http({
    url: manageTreeOption.value.url,
    method: 'GET',
    params: {
      plantCd: props.plantCd ? props.plantCd : ''
    }
  }).then((_result: any) => {
    tasks.value = _result.data
    checkDefault()
  })
}
/******************************
 * TODO (목적): Tree에서 체크한 업무 정보 update
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
    selectTarget()
  }
}
/******************************
 * TODO (목적): 업무정보 셋팅
 *******************************/
function checkDefault() {
  let data = null
  if (!filterTargets.value || filterTargets.value.length === 0) {
    return
  }
  if (value.value) {
    data = find(filterTargets.value, (target) => {
      return target[manageTreeOption.value.taskCd] === value.value
    })
    if (!data) {
      targetCd.value = null
      targetName.value = null
    } else {
      targetCd.value = data[manageTreeOption.value.taskCd]
      targetName.value = data[manageTreeOption.value.taskName]
    }
  } else {
    targetCd.value = null
    targetName.value = null
  }

  textTaskName.value = targetName.value
  value.value = targetCd.value
  emits('getName', targetName.value)
  emits('dataChange', targetCd.value, targetName.value)
}
/******************************
 * TODO (목적): 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
 * @param (1): 업무 리스트
 *******************************/
function convertTree(_treeBases: Array<any>) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: manageTreeOption.value.upTaskCd,
    customID: manageTreeOption.value.taskCd
  })
  return tree
}
/******************************
 * TODO (목적): 업무 팝업 표시
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
 * TODO (목적): 업무 정보 초기화
 *******************************/
function reset() {
  textTaskName.value = ''
  targetCd.value = ''
  targetName.value = ''
  value.value = targetCd.value
  emits('getName', targetName.value)
  emits('dataChange', targetCd.value, targetName.value)
}
/******************************
 * TODO (목적): 업무트리에서 업무 정보 선택
 *******************************/
function selectTarget() {
  if (targetName.value) {
    textTaskName.value = targetName.value
    value.value = targetCd.value
    emits('getName', targetName.value)
    emits('dataChange', targetCd.value, targetName.value)
  }
  taskDialog.value.hide()
}
/******************************
 * TODO (목적): 업무 팝업 표시되었을 때 drag를 위한 event 설정
 *******************************/
function onShow() {
  const dialogElements = document.getElementsByClassName('mini-dialog')
  target.value = dialogElements[dialogElements.length - 1].querySelector('.dialog-layout')
  nodeDragg.value = target.value!.querySelector<HTMLElement>('.dialog-header')
  nodeDragg.value!.addEventListener('mousedown', onGrab)

  emits('onShow')
}
/******************************
 * TODO (목적): 업무 팝업 닫힐때 drag event 제거
 *******************************/
function onHide() {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onLetGo)
  nodeDragg.value!.removeEventListener('mousedown', onGrab)
  emits('onHide')
}
/******************************
 * TODO (목적): 업무팝업 drag
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
 * TODO (목적): 업무 팝업을 떠날시
 *******************************/
function onLetGo() {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onLetGo)
}
/******************************
 * TODO (목적): 업무 팝업 잡았을때 (마우스)
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
  let validCheck = true
  if (props.required) {
    validCheck = Boolean(val) && val.length > 0
  }

  if (validCheck && props.error) {
    validCheck = props.error(val)
  }
  return validCheck
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <q-stepper
    animated
    flat
    bordered
    header-nav
    alternative-labels
    ref="stepper"
    class="customStep full-height"
    done-color="red-6"
    active-color="orange-10"
    inactive-color="orange-3"
    :keep-alive="true"
    v-model="value"
    @transition="transition"
  >
    <!-- v-on:click="stepClick(item)" -->
    <q-step
      v-for="(item, idx) in stepItems"
      :key="idx"
      :name="item.name"
      :title="$language(item.title)"
      :icon="item.icon ? item.icon : 'content_paste'"
      :style="{ height: height }"
      :disable="disabled || item.disabled"
      :done="value > idx"
    >
      <keep-alive>
        <component
          v-if="item.component"
          :is="item.component"
          :key="item.key"
          :param="param"
          v-model:height="height"
          @emitStep="emitStep"
        />
      </keep-alive>
    </q-step>

    <template v-slot:message>
      <template v-for="(item, idx) in stepItems">
        <template v-if="String(value) === stepItems[idx].name && item.message">
          <q-layout ref="customStepMessage" :key="idx" style="min-height: unset !important">
            <q-page-container style="padding-top: 0px">
              <q-page class="custom-step-page">
                <q-page-sticky position="top-right" class="custom-step-offset">
                  <q-btn :icon="messageTranIcon" color="indigo-4" @click="tranMessage" size="2px" />
                  <!-- // 에스엘용 수정 indigo-4 / 원본 teal-4 -->
                </q-page-sticky>
                <q-slide-transition>
                  <div v-show="visible">
                    <q-banner class="bg-grey-2 text-dark q-px-sm stepmsg">
                      <span v-html="$language(item.message)" />
                    </q-banner>
                  </div>
                </q-slide-transition>
              </q-page>
            </q-page-container>
          </q-layout>
        </template>
      </template>
    </template>
  </q-stepper>
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
  inject,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  shallowRef,
  defineAsyncComponent
} from 'vue'
import { uid } from 'quasar'
import { map, extend, findIndex, indexOf, reject, forEach, split } from 'lodash-es'

import { getStepItems, convertHtml } from '@utils/common'

import { GetTranLanguageFunction } from '@/types/language'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CStep'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setStepItems', 'stepClick', 'research', '*'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  editable?: boolean
  disabled?: boolean
  items?: Array<any>
  stepperGrpCd?: string
  currentStepCd?: string
  setSizeAgain?: string
  stepSize?: number
  param?: object | any
  stepDisabledItems?: Array<string>
  stepRejectItems?: Array<string>
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
  editable: true,
  disabled: false,
  items: () => [],
  stepperGrpCd: '',
  currentStepCd: '',
  setSizeAgain: '',
  stepSize: 0,
  param: () => {},
  stepDisabledItems: () => [],
  stepRejectItems: () => []
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: 1
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const visible = ref(false)
const messageTranIcon = ref('contact_support')
const height = ref('auto')
const stepItems = ref<Array<any>>([])
const customStepMessage = ref<any>(null)
const stepper = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.items,
  () => {
    stepItems.value = map(props.items, (item) => {
      return extend(item, {
        key: uid()
      })
    })
  }
)
watch(
  () => props.currentStepCd,
  () => {
    if (stepItems.value && stepItems.value.length > 0) {
      const curIndex = props.currentStepCd
        ? findIndex(stepItems.value, { name: props.currentStepCd })
        : 0
      if (curIndex > -1) {
        for (let i = 0; i <= curIndex; i++) {
          stepItems.value[i].disabled = false
        }
      }
    }
  }
)
watch(
  () => props.stepDisabledItems,
  () => {
    if (
      stepItems.value &&
      stepItems.value.length > 0 &&
      props.stepDisabledItems &&
      props.stepDisabledItems.length > 0
    ) {
      for (let i = 0; i < stepItems.value.length; i++) {
        if (indexOf(props.stepDisabledItems, stepItems.value[i].name) > -1) {
          stepItems.value[i].disabled = true
        }
      }
    }
  },
  {
    deep: true
  }
)
watch(
  () => props.stepRejectItems,
  () => {
    if (
      stepItems.value &&
      stepItems.value.length > 0 &&
      props.stepRejectItems &&
      props.stepRejectItems.length > 0
    ) {
      for (let i = 0; i < stepItems.value.length; i++) {
        if (indexOf(props.stepRejectItems, stepItems.value[i].name) > -1) {
          stepItems.value = reject(stepItems.value, {
            name: stepItems.value[i].name
          })
        }
      }
    }
  },
  {
    deep: true
  }
)
watch(
  () => props.setSizeAgain,
  () => {
    setSize()
  }
)
watch(
  () => props.stepSize,
  () => {
    setSize()
  }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
  init()
})
onMounted(() => {
  if (!props.stepSize) {
    setSize()
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setSize)
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
  if (props.stepperGrpCd && (!props.items || props.items.length === 0)) {
    getItems()
  } else {
    stepItems.value = map(props.items, (item) => {
      return extend(item, {
        key: uid()
      })
    })
  }
}
/******************************
 * TODO (목적): Stepper에 표시할 item을 셋팅
 *******************************/
async function getItems() {
  getStepItems(props.stepperGrpCd).then((_result: any) => {
    const curIndex = props.currentStepCd
      ? findIndex(_result, { stepperMstCd: props.currentStepCd })
      : 0

    const checkDisabled = props.stepDisabledItems && props.stepDisabledItems.length > 0
    const checkReject = props.stepRejectItems && props.stepRejectItems.length > 0

    let index = 0
    stepItems.value = []

    forEach(_result, (item) => {
      let disabled = curIndex < index
      if (checkDisabled && disabled === false) {
        disabled = indexOf(props.stepDisabledItems, item.stepperMstCd) > -1
      }

      let directoryPaths: Array<string> = []
      if (item.vuePath) {
        directoryPaths = split(item.vuePath, '/')
        /** 제일 처음 빈 공간 제거 */
        directoryPaths.shift()
      }
      let componentData = null
      if (directoryPaths && directoryPaths.length > 0) {
        switch (directoryPaths.length) {
          case 1:
            componentData = shallowRef(
              defineAsyncComponent(() => import(`../views/${directoryPaths[0]}.vue`))
            )
            break
          case 2:
            componentData = shallowRef(
              defineAsyncComponent(
                () => import(`../views/${directoryPaths[0]}/${directoryPaths[1]}.vue`)
              )
            )
            break
          case 3:
            componentData = shallowRef(
              defineAsyncComponent(
                () =>
                  import(
                    `../views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}.vue`
                  )
              )
            )
            break
          case 4:
            componentData = shallowRef(
              defineAsyncComponent(
                () =>
                  import(
                    `../views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}/${directoryPaths[3]}.vue`
                  )
              )
            )
            break
          case 5:
            componentData = shallowRef(
              defineAsyncComponent(
                () =>
                  import(
                    `../views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}/${directoryPaths[3]}/${directoryPaths[4]}.vue`
                  )
              )
            )
            break
          default:
            componentData = null
            break
        }
      }

      if (!checkReject) {
        stepItems.value.push({
          name: item.stepperMstCd,
          title: item.stepperMstNm,
          icon: item.iconClass,
          disabled: disabled,
          message: convertHtml(item.remark),
          component: componentData,
          key: uid()
        })
        index++
      } else {
        if (indexOf(props.stepRejectItems, item.stepperMstCd) < 0) {
          stepItems.value.push({
            name: item.stepperMstCd,
            title: item.stepperMstNm,
            icon: item.iconClass,
            disabled: disabled,
            message: convertHtml(item.remark),
            component: componentData,
            key: uid()
          })
          index++
        }
      }
    })
    emits('setStepItems')
  })
}
/******************************
 * TODO (목적): Step별 메시지 표시
 *******************************/
function tranMessage() {
  visible.value = !visible.value
  setTimeout(() => {
    setSize()
  }, 200)
}
/******************************
 * TODO (목적): Stepper 및 컨텐츠 영역 높이 설정
 *******************************/
function setSize() {
  const messageHight =
    customStepMessage.value && customStepMessage.value[0] && messageTranIcon.value === 'remove'
      ? customStepMessage.value[0].$el.offsetHeight
      : 0

  const headerHeightElement = Array.from(
    document.getElementsByClassName('q-stepper__header') as HTMLCollectionOf<HTMLElement>
  )[0]
  const headerHeight = headerHeightElement ? headerHeightElement.offsetHeight : 53
  let tempHeight =
    stepper.value.$el.offsetHeight - (messageHight + (headerHeight < 10 ? 55 : headerHeight))
  if (tempHeight < 300) {
    tempHeight = 300
  }
  if (props.stepSize && props.stepSize > 0) {
    height.value = String(props.stepSize) + 'px'
  } else {
    height.value = String(tempHeight) + 'px'
  }
}
/******************************
 * TODO (목적): Stepper 이동 시 사이즈 및 step 클릭 이벤트 발동
 * @param (1): emit 정보
 *******************************/
function transition(data: any) {
  setSize()
  stepClick(data)
}
/******************************
 * TODO (목적): Step에서 emit을 원할 시
 * @param (1): emit 정보
 *******************************/
function emitStep(data: any) {
  emits(data.name, data.param)
}
/******************************
 * TODO (목적): Step 클릭 시 emit
 * @param (1): step 정보
 *******************************/
function stepClick(item: any) {
  emits('stepClick', item)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.customStep
  .q-stepper__dot
    flex: none
  .q-stepper__tab
    padding: 8px 0px 2px 0px
  .q-stepper__label
    margin-top: 0.2rem
    padding: 0px
    .q-stepper__title
      font-size: 0.82rem
  .q-stepper__dot
    font-size: 14px
    width: 22px
    min-width: 22px
    height: 22px
    .q-icon
      font-size: 13px
  .q-splitter__panel
    padding: 0 !important

.custom-step-offset
  top: -23px
  right: 10px
  position: absolute
  transform: translateX(10px) !important
  z-index: 1

.q-stepper__tab
  min-height: 30px !important

.stepmsg
  .text-body2
    font-size: 0.75rem !important
.q-page
  .full-height
    height: 98% !important
</style>

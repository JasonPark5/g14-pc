<template>
  <div>
    <template v-if="type === 'tabcard'">
      <q-toolbar class="custom-split-tab-card bg-grey-3 q-pa-none">
        <div
          v-if="haveTitle"
          class="q-pl-sm q-pr-sm bg-grey-8 text-white tab-title-have"
          style="
            display: flex;
            align-items: center;
            width: 120px !important;
            min-height: 40px;
            height: 100%;
          "
        >
          <span style="font-weight: 900">
            <q-icon name="info" size="xs" style="vertical-align: sub" />
            {{ $language(title) }}
          </span>
        </div>
        <q-chip
          v-if="addTab && editable && !disabled"
          clickable
          square
          :color="btnColor ? btnColor : 'orange'"
          text-color="white"
          icon="add"
          :label="addTabName ? addTabName : $language('추가')"
          :title="addTabName ? addTabName : $language('추가')"
          style="margin-left: 15px"
          @click="add"
        />
        <q-chip
          v-if="addDirectTab && editable && !disabled"
          clickable
          square
          :color="btnColor ? btnColor : 'orange'"
          text-color="white"
          icon="add"
          :label="$language('직접추가')"
          :title="$language('직접추가')"
          @click="addDirect"
        />
        <q-tabs
          ref="compo-tab"
          :class="tabClass ? 'bg-grey-3 mainBgColorsTxt' : ''"
          class="custom-split-tab2"
          :inline-label="inlineLabel"
          :outside-arrows="outsideArrows"
          :mobile-arrows="mobileArrows"
          :align="align ? align : 'left'"
          v-model="value"
          narrow-indicator
          dense
          shrink
        >
          <keep-alive v-for="(tab, idx) in tabItems" :key="idx">
            <template v-if="tab">
              <q-tab
                :disable="tab.disabled || (tabInCheck && !tab.check) || disabled || !editable"
                :name="tab.name"
                :class="tab.class"
                :icon="tab.icon"
                :label="$language(tab.label)"
                v-on:click="tabClick(tab)"
              >
                <q-badge v-if="tab.badge" color="red" floating>{{ tab.badge }}</q-badge>
                <div
                  v-if="tabInCheck"
                  :class="[!disabled && editable ? 'tab-check-non-disable' : '']"
                >
                  <q-checkbox
                    size="xs"
                    :disable="disabled"
                    v-model="tab.check"
                    @update:model-value="(val: boolean) => changeCheckbox(val, tab)"
                  />
                </div>
                <div
                  v-if="isRemoveTab(tab)"
                  :class="[!disabled && editable ? 'tab-check-non-disable' : '', 'q-pl-xs']"
                >
                  <q-btn
                    flat
                    round
                    size="3px"
                    color="red"
                    icon="close"
                    class=""
                    @click="remove(tab)"
                  />
                </div>
              </q-tab>
            </template>
          </keep-alive>
          <slot name="customTab" />
          <!-- <q-space v-if="addTab" /> -->
        </q-tabs>
      </q-toolbar>
      <q-tab-panels
        v-model="value"
        class="tabcard-panel"
        animated
        vertical
        transition-prev="jump-left"
        transition-next="jump-right"
        :keep-alive="true"
        :style="{ height: cusheight }"
      >
        <template v-for="(tab, idx) in tabItems">
          <template v-if="tab">
            <q-tab-panel :key="idx" :name="tab.name">
              <keep-alive>
                <q-scroll-area style="height: 100%">
                  <slot v-bind="tab" />
                </q-scroll-area>
              </keep-alive>
            </q-tab-panel>
            <slot name="customTabPanel" />
          </template>
        </template>
      </q-tab-panels>
    </template>

    <q-splitter
      v-else-if="type === 'vertical'"
      ref="compo-tab"
      class="custom-split-tab fit"
      :class="tabClassVertical"
      :disable="true"
      unit="px"
      v-model="splitter.data"
    >
      <template v-slot:before>
        <q-tabs
          v-model="value"
          vertical
          :inline-label="inlineLabel"
          :outside-arrows="outsideArrows"
          :mobile-arrows="mobileArrows"
          :class="tabClass2"
          class="custom-split-tab3"
          :align="align"
          :style="{ height: cusheight }"
          switch-indicator
        >
          <q-tab
            v-for="(tab, idx) in tabItems"
            :key="idx"
            :disable="tab.disabled || disabled"
            :name="tab.name"
            :icon="tab.icon"
            v-on:click="tabClick(tab)"
          >
            <template v-slot:default>
              <div class="q-tab__label" v-html="$language(tab.label)" />
            </template>
          </q-tab>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="value"
          animated
          class="custom-vertical-panels"
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
          :keep-alive="true"
          :style="{ height: cusheight }"
        >
          <q-tab-panel v-for="(tab, idx) in tabItems" :key="idx" :name="tab.name">
            <keep-alive>
              <q-scroll-area style="height: 100%">
                <slot v-bind="tab" />
              </q-scroll-area>
            </keep-alive>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <template v-else-if="type === 'pagetop'">
      <q-tabs
        ref="compo-tab"
        class="custom-split-tab2 custom-split-tab-pagetop mainBgColorsPageTop text-white"
        :inline-label="inlineLabel"
        :outside-arrows="outsideArrows"
        :mobile-arrows="mobileArrows"
        align="left"
        v-model="value"
        switch-indicator
        :dense="dense"
      >
        <keep-alive v-for="(tab, idx) in tabItems" :key="idx">
          <q-tab
            :disable="tab.disabled || disabled"
            :class="tab.class"
            :name="tab.name"
            :icon="tab.icon"
            :label="$language(tab.label)"
            v-on:click="tabClick(tab)"
          >
            <q-badge v-if="tab.badge" color="red" floating>{{ tab.badge }}</q-badge>
          </q-tab>
        </keep-alive>
      </q-tabs>
      <q-tab-panels
        v-model="value"
        animated
        class="custom-panels"
        vertical
        transition-prev="jump-left"
        transition-next="jump-right"
        :keep-alive="true"
        :style="{ height: cusheight }"
      >
        <q-tab-panel v-for="(tab, idx) in tabItems" :key="idx" :name="tab.name">
          <keep-alive>
            <q-scroll-area style="height: 100%">
              <slot v-bind="tab" />
            </q-scroll-area>
          </keep-alive>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <template v-else>
      <q-tabs
        ref="compo-tab"
        class="custom-popuptop-tab"
        :inline-label="inlineLabel"
        :outside-arrows="outsideArrows"
        :mobile-arrows="mobileArrows"
        :align="align"
        v-model="value"
        switch-indicator
        :dense="dense"
      >
        <keep-alive v-for="(tab, idx) in tabItems" :key="idx">
          <q-tab
            :disable="tab.disabled || disabled"
            :class="tab.class"
            :name="tab.name"
            :icon="tab.icon"
            v-on:click="tabClick(tab)"
          >
            <template v-slot:default>
              <div
                class="q-tab__label"
                :style="
                  tabOptions && tabOptions[tab.name] ? tabOptions[tab.name].tabLabelStyle : ''
                "
                v-html="$language(tab.label)"
              />
              <q-badge v-if="tab.badge" color="red" floating>{{ tab.badge }}</q-badge>
            </template>
          </q-tab>
        </keep-alive>
      </q-tabs>
      <q-tab-panels
        v-model="value"
        animated
        class="custom-panels"
        vertical
        transition-prev="jump-left"
        transition-next="jump-right"
        :keep-alive="true"
        :style="{ height: cusheight }"
      >
        <q-tab-panel v-for="(tab, idx) in tabItems" :key="idx" :name="tab.name">
          <keep-alive>
            <q-scroll-area style="height: 100%">
              <slot v-bind="tab" />
            </q-scroll-area>
          </keep-alive>
        </q-tab-panel>
      </q-tab-panels>
    </template>
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
import { computed, inject, onBeforeMount, PropType } from 'vue'
import { replace } from 'lodash-es'

import { GetTranLanguageFunction } from '@/types/language'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTab'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['tabClick', 'addTab', 'addDirectTab', 'removeTab', 'changeCheckbox'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  tabItems: Array<any>
  editable?: boolean
  disabled?: boolean
  type?: string
  tabClassVertical?: string
  tabClass?: string
  tabClass2?: string
  align?: 'left' | 'center' | 'right' | 'justify'
  inlineLabel?: boolean
  outsideArrows?: boolean
  mobileArrows?: boolean
  height?: string
  dense?: boolean
  tabInCheck?: boolean
  addTabName?: string
  addTab?: boolean
  addDirectTab?: boolean
  removeTab?: boolean
  removeConditionCol?: string
  removeConditionVal?: string
  btnColor?: string
  title?: string
  splitter?: {
    data: number
  }
  tabOptions?: any
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
  tabItems: () => [],
  editable: true,
  disabled: false,
  type: 'horizon',
  tabClassVertical: '',
  tabClass: 'mainBgColors text-white shadow-2',
  tabClass2: 'mainBgColorsverticalTab text-white shadow-2',
  align: 'justify',
  inlineLabel: false,
  outsideArrows: true,
  mobileArrows: true,
  height: 'auto',
  dense: false,
  tabInCheck: false,
  addTabName: '추가',
  addTab: false,
  addDirectTab: false,
  removeTab: false,
  removeConditionCol: '',
  removeConditionVal: '',
  btnColor: 'orange',
  title: '',
  splitter: () => {
    return {
      data: 100
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: '',
  type: [Number, String] as PropType<string | number | undefined | null>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/

/******************************
 * @Computed_선언
 *******************************/
const cusheight = computed(() => {
  const ruturnText = replace(props.height, 'px', '')
  return ruturnText === 'auto' ? ruturnText : String(parseInt(ruturnText) - 10) + 'px'
})
const haveTitle = computed(() => (props.title ? true : false))

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기 셋팅
 *******************************/
function init() {}
/******************************
 * TODO (목적): tab 클릭 시 emit
 * @param (1): tab 정보
 *******************************/
function tabClick(tab: any) {
  emits('tabClick', tab)
}
/******************************
 * TODO (목적): tab 추가
 *******************************/
function add() {
  emits('addTab')
}
/******************************
 * TODO (목적): tab 추가
 *******************************/
function addDirect() {
  emits('addDirectTab')
}
/******************************
 * TODO (목적): tab 제거
 * @param (1): tab 정보
 *******************************/
function remove(tab: any) {
  emits('removeTab', tab)
}
/******************************
 * TODO (목적): tab 삭제 체크
 * @param (1): tab 정보
 * @return (반환): tab 삭제 여부
 *******************************/
function isRemoveTab(tab: any) {
  let val = true
  if (props.removeConditionCol && props.removeConditionVal) {
    // 해당 조건일 경우 삭제하지 않음
    val = tab[props.removeConditionCol] !== props.removeConditionVal
  }
  return props.removeTab && val
}
/******************************
 * TODO (목적): tab의 checkbox 클릭 시 emit
 * @param (1): 체크박스 체킹 여부
 * @param (2): tab 정보
 *******************************/
function changeCheckbox(val: boolean, tab: any) {
  emits('changeCheckbox', val, tab)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

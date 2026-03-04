<template>
  <div class="table-border">
    <!-- v-table-resizable -->
    <q-table
      flat
      bordered
      ref="compoTable"
      class="default-table"
      :class="[topBorderClass, isDashboard ? 'isDashboardTable' : '']"
      :card-class="cardClass"
      :style="{ height: height }"
      :tableId="tableId"
      :fullscreen="fullscreen"
      :separator="separator"
      :rows="arrayTreeObj"
      :columns="arrangColumns"
      :row-key="rowKey"
      :selection="selection"
      :visible-columns="visibleColumns"
      :filter="filterText"
      :dense="dense"
      :loading="loading"
      :no-data-label="noDataLabel"
      :no-results-label="noResultLabel"
      :hide-pagination="false"
      :virtual-scroll="!usePaging"
      :virtual-scroll-slice-size="!usePaging ? 20 : 20"
      :virtual-scroll-item-size="!usePaging ? 48 : 0"
      :virtual-scroll-sticky-size-start="!usePaging ? 48 : 0"
      :hide-bottom="hideBottom"
      :hide-header="hideHeader"
      v-model:selected="selected"
      v-model:pagination="initialPagination"
      @selection="changeSelection"
      @virtual-scroll="virtualScroll"
    >
      <!-- ### loading 처리 -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <!-- ### 데이터 없음 / filtering 된 데이터 없음 문구 처리 -->
      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center text-accent q-gutter-sm gridNodataDiv">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            {{ message }}
          </span>
        </div>
      </template>

      <!-- 상단 타이틀 / 컬럼 control -->
      <template v-slot:top v-if="isTop">
        <template v-if="isTitle">
          <div class="float-left">
            <!-- 타이틀 앞 표시영역 -->
            <slot name="perfixTitle" />
            <!-- 타이틀 영역 -->
            <div class="q-table__title">
              <!-- <i class="text-primary lnr-list"></i>  -->
              <q-icon name="expand_circle_down" />
              {{ $language(title) }}
              <slot name="suffixTitle" />
            </div>
            <!-- 타이틀 뒤 표시영역 -->
          </div>
          <!-- 필터링 영역 -->
          <div
            class="float-left"
            :class="[{ gridSearchIcon: isTitle }, { gridSearchIcon2: !isTitle }]"
          >
            <q-input
              v-if="filtering"
              class="filtering-text"
              dense
              debounce="300"
              color="white"
              :style="filteringStyle"
              placeholder="Search"
              v-model="filterText"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <slot name="customFilter" />
          </div>
          <!-- chip 추가 -->
          <div>
            <slot name="table-chip" />
          </div>
          <q-space />
          <!-- 버튼 영역 -->
          <div class="q-mt-md gridbtntop">
            <slot name="table-button" />
          </div>
          <div class="float-right">
            <!-- 설명 영역 -->
            <slot name="prefixContent" />
            <q-btn
              v-if="isExcelDown && data.length > 0"
              flat
              dense
              class="tableExcelIcon"
              @click="downloadExcel"
            >
              <q-tooltip anchor="top left" self="center left">
                {{ $language('엑셀 다운로드') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="isFullScreen"
              flat
              dense
              color="grey-6"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              class="tabletopicon tablefullscreen"
              @click="clickFullScreen"
            >
              <q-tooltip v-if="fullscreen">
                {{ $language('원래대로') }}
              </q-tooltip>
              <q-tooltip anchor="top left" self="center left" v-else>
                {{ $language('전체화면') }}
              </q-tooltip>
            </q-btn>
            <!-- 컬럼 컨트롤 영역 -->
            <div v-if="columnSetting" class="table-setting gridsettingIcon">
              <q-btn flat dense color="grey-6" icon="more_vert" class="tabletopicon">
                <q-tooltip>
                  {{ $language('컬럼설정') }}
                </q-tooltip>
                <q-menu transition-show="jump-down" transition-hide="jump-up">
                  <q-list dense class="configColumnSet">
                    <q-item
                      v-for="(column, idx) in columnsControl"
                      :key="idx"
                      tag="label"
                      v-ripple
                      :disable="column.disabled"
                    >
                      <q-item-section side top>
                        <q-checkbox
                          v-if="column.disabled"
                          class="tableCheckBox"
                          :disable="true"
                          color="orange-custom"
                          :model-value="true"
                        />
                        <q-checkbox
                          v-else
                          class="tableCheckBox"
                          color="orange-custom"
                          v-model="column.check"
                          v-on:click="colChange(column)"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ $language(column.label) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <slot name="customTableTitleEditor" />
        </template>
      </template>

      <template v-slot:header="props" v-if="viewHeaders && viewHeaders.length > 0">
        <q-tr v-for="(viewHeader, idx) in viewHeaders" :key="idx" :ref="'ctr'">
          <template v-if="selection !== 'none' && idx === 0 && editable">
            <q-th
              auto-width
              class="text-center"
              :rowspan="colDepth"
              :class="fixFlag ? 'checkbox-th-fix' : ''"
              style="min-width: 24px; max-width: 24px"
            >
              <q-checkbox
                v-if="selection === 'multiple'"
                class="tableCheckBox"
                color="orange-custom"
                :disable="!editable"
                dense
                v-model="props.selected"
              />
            </q-th>
          </template>
          <q-th v-if="isExpand && idx === 0" auto-width class="text-center" :rowspan="colDepth">
            <slot name="expand-header" />
          </q-th>
          <slot name="perTh" v-bind="props" />
          <template v-for="col in viewHeader">
            <q-th
              v-if="col.colspan === 1 ? idx + 1 === col.level : true"
              :auto-width="false"
              :key="col.name"
              class="text-center"
              :colspan="col.colspan"
              :rowspan="col.colspan === 1 && !col.hasOwnProperty('child') ? colDepth - idx : 1"
              :props="findIndex(arrangColumns, { name: col.name }) > -1 ? props : void 0"
              :style="setHeaderStyle(col)"
            >
              <span v-html="$language(col.label)" />
              <span v-if="col.required" class="text-red">*</span>
              <span
                v-if="
                  col.helpcomment !== '' &&
                  col.helpcomment !== null &&
                  col.helpcomment !== undefined
                "
              >
                <q-btn-group outline>
                  <q-btn
                    icon="help"
                    color="deep-purple-6"
                    text-color="white"
                    class="inner-help-btn"
                    align="center"
                    round
                  >
                    <q-tooltip anchor="bottom left" self="top left">
                      <div class="tooltipCustomTop">
                        {{ $language('설명') }}
                      </div>
                      <div class="tooltipCustom">
                        <div class="q-pl-xs" style="text-align: left" v-html="col.helpcomment" />
                      </div>
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </span>
              <div v-if="col.setHeader && col.type && editable">
                <template v-if="col.type === 'select'">
                  <!-- select -->
                  <c-select
                    stype="tableHeaderselect"
                    :editable="editable"
                    :comboItems="col.comboItems"
                    :type="!col.none ? 'allEdit' : ''"
                    :itemText="col.itemText ? col.itemText : 'codeName'"
                    :itemValue="col.itemValue ? col.itemValue : 'code'"
                    @datachange="(val: any) => headerDataChange(val.value, props, col)"
                  />
                </template>
                <template v-else-if="col.type === 'check'">
                  <q-checkbox
                    dense
                    color="orange-custom"
                    class="tableCheckBox"
                    :disable="!editable"
                    :true-value="col.true ? col.true : 'O'"
                    :false-value="col.false ? col.false : 'X'"
                    v-model="col.value"
                    @update:model-value="(val: any) => headerDataChange(val, props, col)"
                  />
                </template>
                <!-- date -->
                <template v-else-if="col.type === 'date'">
                  <c-datepicker
                    dense
                    class="tableDatepicker"
                    type="date"
                    :disable="!editable"
                    :range="col.range === true ? true : false"
                    v-model:value="col.value"
                    @update:model-value="(val: any) => headerDataChange(val, props, col)"
                  />
                </template>
                <!-- text -->
                <template v-else-if="col.type === 'text'">
                  <q-input
                    dense
                    v-if="col.type === 'text'"
                    v-model="col.value"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, props, col)"
                  />
                </template>
                <template v-else-if="col.type === 'number'">
                  <q-input
                    dense
                    v-if="col.type === 'number'"
                    v-model="col.value"
                    type="number"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, props, col)"
                  />
                </template>
                <template v-else-if="col.type === 'custom'">
                  <c-select
                    v-if="col.headType === 'select'"
                    stype="tableHeaderselect"
                    :editable="editable"
                    :comboItems="col.comboItems"
                    :type="!col.none ? 'allEdit' : ''"
                    :itemText="col.itemText ? col.itemText : 'codeName'"
                    :itemValue="col.itemValue ? col.itemValue : 'code'"
                    @datachange="(val: any) => headerDataChange(val.value, props, col)"
                  />
                  <q-btn
                    v-if="col.headType === 'link'"
                    class="tableinnerBtn"
                    :class="{
                      'tableinnerBtn-left': col.align === 'left' ? true : false,
                      'tableinnerBtn-right': col.align === 'right' ? true : false
                    }"
                    flat
                    :align="col.align"
                    :size="col.size"
                    color="blue-6"
                    icon="build"
                    @click.stop="headLinkClick(props, col)"
                  />
                  <q-input
                    dense
                    v-if="col.headType === 'text'"
                    v-model="col.value"
                    type="text"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, props, col)"
                  />
                </template>
              </div>
            </q-th>
          </template>
          <slot name="sufTh" v-bind="props" />
        </q-tr>
      </template>

      <!-- 데이터 영역 -->
      <template v-slot:body="props">
        <!-- :key="`${props.key}_${uid()}`" -->
        <q-tr
          :props="props"
          ref="compo-tr"
          :class="[
            { 'no-hover-row': noHoverRow },
            customTrClass(props),
            `tbody_tr_${props.rowIndex}`
          ]"
          v-on:click="(e: MouseEvent) => rowClick(e, props.row, props.rowIndex)"
        >
          <!--
            columns에 정의한 col이 아닌 custom을 위한 영역
          -->
          <q-td
            v-if="selection !== 'none' && editable && isCreate(props.row, -1, props.rowIndex)"
            auto-width
            class="text-center"
            :rowspan="getRowspan(-1, props.rowIndex)"
            :class="fixFlag ? 'checkbox-td' : ''"
            style="min-width: 24px; max-width: 24px"
          >
            <q-checkbox
              class="tableCheckBox"
              color="orange-custom"
              :disable="!editable || props.row[checkDisableColumn]"
              dense
              v-model="props.selected"
            />
          </q-td>
          <q-td v-if="isExpand" auto-width class="text-center">
            <q-btn
              size="xs"
              class="tableInnerIsExpend"
              color="accent"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <slot name="perTd" v-bind="props" />
          <template v-for="(col, colIndex) in props.cols">
            <q-td
              v-if="isCreate(props.row, colIndex, props.rowIndex)"
              :ref="'custom-td-' + props.rowIndex + '-' + colIndex"
              :auto-width="false"
              :key="col.name"
              :props="props"
              :class="[checkEnable(col, props.row, props) ? '' : `edittd-${col.type}`]"
              :style="tdStyle(col)"
              :rowspan="getRowspan(colIndex, props.rowIndex)"
              @click="tdClick(props, col, $event)"
              @contextmenu.capture.prevent="tdRightClick(props, col)"
            >
              <template v-if="contentsField(props, col)">
                <!-- default 영역 -->
                <span
                  v-if="check(col.type)"
                  :class="[
                    checkEnable(col, props.row, props) ? 'non-edit' : '',
                    col.innerBtn ? 'descript-span' : '',
                    col.color ? 'text-' + col.color : ''
                  ]"
                >
                  <template v-if="colIndex !== 0">
                    {{ props.row[col.name] }}
                  </template>
                  <span
                    v-else
                    :class="{ 'q-tree-link': true, 'q-tree-label': true }"
                    v-bind:style="setPadding(props.row)"
                  >
                    <q-icon
                      :name="iconName(props.row)"
                      :class="{
                        'cursor-pointer': props.row.children && props.row.children.length > 0
                      }"
                      color="secondary"
                      @click="toggle(props.row, colIndex)"
                    />
                    {{ props.row[col.name] }}
                  </span>
                  <div v-if="col.description" class="description-td">
                    {{ props.row[col.description] }}
                  </div>
                  <div v-if="col.innerBtn">
                    <q-btn-group outline class="ColumInnerBtnGroup">
                      <template v-for="(btn, idx) in col.btns">
                        <q-btn
                          v-if="
                            editable &&
                            !checkEnable(col, props.row, props) &&
                            !checkInnerBtnEnable(btn, props.row)
                          "
                          :key="idx"
                          :label="btn.label"
                          :icon="btn.icon ? btn.icon : void 0"
                          :color="btn.color ? btn.color : 'blue-grey-4'"
                          :text-color="btn.textColor ? btn.textColor : 'white'"
                          class="ColumInnerBtn"
                          align="center"
                          @click.stop="innerBtnClicked(col, props, btn)"
                        >
                          <q-tooltip v-if="btn.tooltip">
                            <span v-html="btn.tooltip" />
                          </q-tooltip>
                        </q-btn>
                      </template>
                    </q-btn-group>
                  </div>
                </span>
                <template v-if="editTdCheck(col.type)">
                  <!-- input text -->
                  <template v-if="col.type === 'text'">
                    <c-text-column
                      :editable="editable"
                      :disabled="
                        props.row[checkDisableColumn] || checkEnable(col, props.row, props)
                      "
                      :col="col"
                      :props="props"
                      :colorClass="checkColorClass(col, props.row)"
                      @datachange="datachange(props, col)"
                    />
                  </template>
                  <template v-else-if="col.type === 'textarea'">
                    <!-- input textarea -->
                    <c-textarea-column
                      :editable="editable"
                      :disabled="
                        props.row[checkDisableColumn] || checkEnable(col, props.row, props)
                      "
                      :col="col"
                      :props="props"
                      @datachange="datachange(props, col)"
                    />
                  </template>
                  <template v-else-if="col.type === 'select'">
                    <!-- select -->
                    <c-select
                      class="no-label-control"
                      :editable="editable"
                      :disabled="
                        !editable ||
                        props.row[checkDisableColumn] ||
                        checkEnable(col, props.row, props)
                      "
                      :isChip="col.isChip"
                      :comboItems="col.comboItems"
                      :type="!col.none ? 'edit' : ''"
                      :itemText="col.itemText ? col.itemText : 'codeName'"
                      :itemValue="col.itemValue ? col.itemValue : 'code'"
                      v-model:value="props.row[col.name]"
                      @datachange="(val: any) => changeSelect(val, props, col)"
                    />
                  </template>
                  <!-- date -->
                  <template v-else-if="col.type === 'date'">
                    <c-datepicker
                      dense
                      class="tableDatepicker"
                      :type="col.dateType ? col.dateType : 'date'"
                      :disabled="
                        checkEnable(col, props.row, props) ||
                        !editable ||
                        props.row[checkDisableColumn]
                      "
                      :range="col.range === true ? true : false"
                      :minuteStep="col.minuteStep ? col.minuteStep : 1"
                      :start="col.start ? col.start : ''"
                      :end="col.end ? col.end : ''"
                      v-model:value="props.row[col.name]"
                      @datachange="() => datachange(props, col)"
                    />
                  </template>
                  <template v-else-if="col.type === 'number'">
                    <!-- input number -->
                    <c-number-column
                      :editable="editable"
                      :disabled="
                        props.row[checkDisableColumn] || checkEnable(col, props.row, props)
                      "
                      :col="col"
                      :props="props"
                      :colorClass="checkColorClass(col, props.row)"
                      @datachange="datachange(props, col)"
                    />
                  </template>
                  <!-- check box (1) -->
                  <template v-else-if="col.type === 'check'">
                    <q-checkbox
                      dense
                      color="orange-custom"
                      class="tableCheckBox"
                      :disable="checkEnable(col, props.row, props) || !editable"
                      :true-value="col.true ? col.true : 'O'"
                      :false-value="col.false ? col.false : 'X'"
                      v-model="props.row[col.name]"
                      @update:model-value="() => datachange(props, col)"
                    />
                  </template>
                  <!-- datetime -->
                  <template v-else-if="col.type === 'datetime'">
                    <c-datepicker
                      dense
                      class="tableDatepicker"
                      :type="col.datetimeType ? col.datetimeType : 'time'"
                      :timePickerOptions="setTimePickerOptions(props, col)"
                      :range="col.range === true ? true : false"
                      :disabled="
                        checkEnable(col, props.row, props) ||
                        !editable ||
                        props.row[checkDisableColumn]
                      "
                      :minuteStep="col.minuteStep ? col.minuteStep : 1"
                      v-model:value="props.row[col.name]"
                      @datachange="() => datachange(props, col)"
                    />
                  </template>
                  <c-multi-select
                    class="no-label-control"
                    v-else-if="col.type === 'multiSelect'"
                    :editable="editable"
                    :disabled="checkEnable(col, props.row, props)"
                    :isObject="col.isObject"
                    :valueText="col.valueText ? col.valueText : 'codeName'"
                    :valueKey="col.valueKey ? col.valueKey : 'code'"
                    :comboItems="col.comboItems"
                    :itemText="col.itemText ? col.itemText : 'codeName'"
                    :itemValue="col.itemValue ? col.itemValue : 'code'"
                    v-model:value="props.row[col.name]"
                    @datachange="() => datachange(props, col)"
                  />
                </template>
                <template v-else>
                  <!-- text 클릭 -->
                  <template v-if="col.type === 'link'">
                    <q-btn
                      v-if="props.row[col.name]"
                      class="tableinnerBtn"
                      :class="{
                        'tableinnerBtn-left': col.align === 'left' ? true : false,
                        'tableinnerBtn-right': col.align === 'right' ? true : false
                      }"
                      flat
                      :align="col.align"
                      color="blue-6"
                      :label="props.row[col.name]"
                      @click.stop="linkClick(props, col)"
                    />
                  </template>
                  <!-- tag -->
                  <template v-else-if="col.type === 'tag'">
                    <q-chip
                      v-if="props.row[col.name]"
                      outline
                      square
                      :color="setTagColor(col, props.row[col.name])"
                      :text-color="col.colorItems ? 'white' : 'black'"
                    >
                      {{ setTagName(col, props.row[col.name]) }}
                    </q-chip>
                    <template v-else />
                  </template>
                  <!-- custom -->
                  <template v-else-if="col.type === 'custom'">
                    <slot name="customArea" v-bind:props="props" v-bind:col="col" />
                  </template>
                  <!-- 천단위 콤마 -->
                  <span v-else-if="col.type === 'cost'">
                    {{ toThousandFilter(props.row[col.name]) }}
                  </span>
                  <!-- HTML태그허용 -->
                  <span
                    v-else-if="col.type === 'html'"
                    v-html="convertEnter(props.row[col.name])"
                  />
                  <!-- badge -->
                  <span v-else-if="col.type === 'badge'">
                    <q-badge :color="col.color" :label="props.row[col.name]" />
                  </span>
                  <!-- popup proxy -->
                  <q-btn
                    v-else-if="col.type === 'proxy'"
                    class="tableinnerBtn"
                    flat
                    :align="col.align"
                    color="blue-6"
                    :label="props.row[col.name] ? props.row[col.name] : 'Click'"
                  >
                    <q-popup-proxy
                      :ref="'proxy_' + props.rowIndex + '_' + col.name"
                      :breakpoint="1000"
                    >
                      <component
                        :is="col.component"
                        :props="props"
                        :col="col"
                        :editable="editable"
                        @callback="(data: any) => callbackProxy(data, props, col)"
                      />
                    </q-popup-proxy>
                  </q-btn>
                </template>
              </template>
            </q-td>
          </template>
          <!--
            뒤에 배치됨
            columns에 정의한 col이 아닌 custom을 위한 영역
          -->
          <slot name="sufTd" v-bind="props" />
        </q-tr>
        <q-tr
          v-if="showDescription"
          :props="props"
          :key="`e_${props.rowIndex}`"
          class="q-virtual-scroll--with-prev description-tr"
        >
          <q-td colspan="100%" class="description-td">
            <slot name="description-td" v-bind="props" />
          </q-td>
        </q-tr>
        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%">
            <slot name="expand-td" v-bind="props" />
          </q-td>
        </q-tr>
      </template>

      <!-- 바텀 영역 -->
      <template v-slot:bottom>
        {{ $language('총 건수') }} : {{ data ? data.length : 0 }}
        <q-space />

        <!-- 페이징 영역 -->
        <template v-if="usePaging">
          <!-- 페이지 input 영역 -->
          <q-select
            outlined
            dense
            style="min-width: 50px; max-width: 70px"
            :options="pageItems"
            color="teal"
            class="tablePagingInput"
            v-model="pagePerRow.pageNumber"
            @update:model-value="changePageNumber"
          />
          <!-- 페이지네이션 영역 -->
          <q-pagination
            v-model="initialPagination.page"
            :max="pagesNumber"
            :max-pages="5"
            class="tablePagingBtn"
            direction-links
            boundary-links
            icon-first="skip_previous"
            icon-last="skip_next"
            color="teal-5"
          />
        </template>
      </template>
    </q-table>
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
import {
  ref,
  watch,
  computed,
  inject,
  onBeforeMount,
  onUnmounted
  // shallowRef,
  // defineAsyncComponent
} from 'vue'
import { storeToRefs } from 'pinia'
import {
  forEach,
  map,
  filter,
  findIndex,
  find,
  indexOf,
  clone,
  ceil,
  drop,
  dropRight,
  trim,
  split,
  concat,
  reject
} from 'lodash-es'
import moment from 'moment'
import arrayToTree from 'array-to-tree'
import { writeFile, utils } from 'xlsx'

import { toThousandFilter, convertEnter, getToday } from '@utils/common'

import { GetTranLanguageFunction } from '@/types/language'
import { popupParamType } from '@/types/popupParam'

import { useUserStore } from '@stores/user'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTreeTable'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits([
  'getTableHeight',
  'linkClick',
  'table-data-change',
  'rowClick',
  'rowDblclick',
  'changeSelection',
  'getSelected',
  'headerCheckboxChange',
  'headerDataChange',
  'headLinkClick',
  'innerBtnClicked',
  'callbackProxy'
])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  data?: Array<any>
  columns?: Array<any>
  expendcolumns?: Array<any>
  merge?: Array<any>
  title?: string
  editable?: boolean
  separator?: 'cell' | 'horizontal' | 'vertical' | 'none'
  selection?: 'none' | 'multiple' | 'single'
  rowKey?: string
  columnSetting?: boolean
  isFullScreen?: boolean
  isExcelDown?: boolean
  filtering?: boolean
  cardClass?: string
  loading?: boolean
  dense?: boolean
  autoFullHeight?: boolean
  gridHeight?: string
  usePaging?: boolean
  isDashboard?: boolean
  hideBottom?: boolean
  hideHeader?: boolean
  isExpand?: boolean
  isTitle?: boolean
  isTop?: boolean
  tableId?: string
  parentProperty?: string
  customID?: string
  expandAll?: boolean
  isFixExpand?: boolean
  isSelection?: Function
  topBorderClass?: string
  contentsField?: Function
  showDescription?: boolean
  noHighLight?: boolean
  noHoverRow?: boolean
  checkDisableColumn?: string
  checkClickFlag?: boolean
  tableTimePickerOptions?: any
  customTrClass?: Function
  pagePerRow?: {
    pageNumber: number
  }
}
type paginationType = {
  sortBy: string
  descending: boolean
  page: number
  rowsPerPage: number
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
  data: () => [],
  columns: () => [],
  expendcolumns: () => [],
  merge: () => [],
  title: '',
  editable: true,
  separator: 'cell',
  selection: 'none',
  rowKey: 'name',
  columnSetting: true,
  isFullScreen: true,
  isExcelDown: true,
  filtering: true,
  cardClass: '',
  loading: false,
  dense: true,
  autoFullHeight: true,
  gridHeight: '',
  usePaging: true,
  isDashboard: false,
  hideBottom: false,
  hideHeader: false,
  isExpand: false,
  isTitle: true,
  isTop: true,
  tableId: '',
  parentProperty: '',
  customID: '',
  isFixExpand: false,
  expandAll: false,
  // eslint-disable-next-line
  isSelection: (props: any) => {
    return true
  },
  topBorderClass: '',
  // eslint-disable-next-line
  contentsField: (props: any, col: any) => {
    return true
  },
  showDescription: false,
  noHighLight: false,
  noHoverRow: false,
  checkDisableColumn: 'disable',
  checkClickFlag: true,
  tableTimePickerOptions: () => {},
  // eslint-disable-next-line
  customTrClass: (props: any) => {
    return ''
  },
  pagePerRow: () => {
    return {
      pageNumber: 20
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
const fullscreen = ref(false)
const tableWidth = ref(0)
const height = ref('100%')
const selected = ref<Array<any>>([])
const filterText = ref('')
const colDepth = ref(1)
const childLength = ref<Array<any>>([])
const viewHeaders = ref<Array<any>>([])
const arrangColumns = ref<Array<any>>([])
const columnsControl = ref<Array<any>>([])
const visibleColumns = ref<Array<any>>([])
const hiddenColumns = ref<Array<any>>([])
const initialPagination = ref<paginationType>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
})
const pageItems = ref([5, 20, 30, 50, 100, 200])
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  top: '10px',
  param: {},
  closeCallback: () => {}
})
const delay = ref(180)
const clicks = ref(0)
const timer = ref<NodeJS.Timeout>(setTimeout(() => {}, 1))
const toggleFlag = ref<boolean>(false)
const render = ref({
  from: 0,
  to: 0
})
const isExpanded = ref(true)
const itemId = ref<string | number | null | undefined>(null)
const isInit = ref(true)
const compoTable = ref<any>(null)
const isInnerBtnClick = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const pagesNumber = computed(() => {
  let _length = props.data.length
  if (filterText.value) {
    _length = compoTable.value.filteredSortedRowsNumber
  }
  return Math.ceil(_length / initialPagination.value.rowsPerPage)
})
const convertTreeData = computed(() => {
  if (!props.data || props.data.length === 0) return
  return arrayToTree(props.data, {
    parentProperty: props.parentProperty,
    customID: props.customID
  })
})
const arrayTreeObj = computed(() => {
  const newObj: any = []
  recursive(convertTreeData.value, newObj, 0, String(itemId.value!), isExpanded.value, isInit.value)
  return newObj
})
const fixFlag = computed(() =>
  arrangColumns.value && arrangColumns.value.length > 0 ? arrangColumns.value[0].fix : false
)
const noDataLabel = computed(() => $language('데이터가 없습니다.'))
const noResultLabel = computed(() => $language('필터링 된 데이터가 없습니다.'))
const filteringStyle = computed(() => {
  let style = 'min-width: 150px;max-width: 250px;'
  if (tableWidth.value < 400) {
    style = 'min-width: 150px;max-width: 150px;'
  }
  return style
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.gridHeight,
  () => {
    setSize()
  }
)
watch(
  () => props.columns,
  () => {
    setColumnControl()
  },
  { deep: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onUnmounted(() => {
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
  setPaging()
  setColumnControl()
  setSize()
  tableWidth.value = compoTable.value.$el.clientWidth
}
/******************************
 * TODO (목적): paginavigation 셋팅
 *******************************/
function setPaging() {
  if (props.usePaging) {
    initialPagination.value = {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage:
        props.pagePerRow && props.pagePerRow.pageNumber
          ? Number(clone(props.pagePerRow.pageNumber))
          : 20
    }
  } else {
    initialPagination.value = {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 0
    }
  }
}
/******************************
 * TODO (목적): 컬럼 셋팅 (merge, level) : q-table이 받아들일 수 있게 재조립
 *******************************/
function setColumnControl() {
  arrangColumns.value = []
  let _colDepth = 1
  colDepth.value = 1
  forEach(props.columns, (column) => {
    const idx = findIndex(childLength.value, { level: 1 })
    if (idx > -1) {
      childLength.value[idx].val = 0
    } else {
      childLength.value.push({ level: 1, val: 0 })
    }
    column.level = 1
    if (!column!.child) {
      arrangColumns.value.push(column)
      column.colspan = 1
    } else {
      arrangColumns.value = concat(arrangColumns.value, FloorColumn(column, 2, false))
      column.colspan = column.child.length + find(childLength.value, { level: 1 }).val

      if (colDepth.value > _colDepth) {
        _colDepth = clone(colDepth.value)
      }
      colDepth.value = 1
    }
  })

  colDepth.value = _colDepth
  if (viewHeaders.value && viewHeaders.value.length > 0) {
    viewHeaders.value = []
  }

  ;(viewHeaders.value = []).length = colDepth.value
  viewHeaders.value.fill([])

  for (let i = 0; i < colDepth.value; i++) {
    viewHeaders.value[i] = getLevelHeaders(props.columns, i + 1)
  }

  visibleColumns.value = map(arrangColumns.value, 'name')
  // 컬럼visible정보를 localStorage에 있으면 불러오기..
  const tablevisiblecol = JSON.parse(window.localStorage.getItem(props.title)!)
  if (tablevisiblecol !== null) {
    visibleColumns.value = tablevisiblecol
  }
  let index = 0
  columnsControl.value = []
  forEach(arrangColumns.value, (col) => {
    columnsControl.value.push({
      label: col.label,
      name: col.name,
      check: visibleColumns.value.indexOf(col.name) > -1 ? true : false,
      disabled: findIndex(props.merge, { index: index }) > -1 || col.level > 1
    })
    index++
  })
  compoTable.value.$el.style.setProperty('--my-var', colDepth.value * 33 + 'px')
}
/******************************
 * TODO (목적): 컬럼 level에 따른 child 처리
 * @param (1): child가 있는 컬럼
 * @param (2): column의 level
 * @param (3):
 * @return (반환): 자식컬럼 셋팅 된 컬럼
 *******************************/
function FloorColumn(column: any, level: number, checkDept: boolean) {
  if (!checkDept) {
    colDepth.value++
  }
  let returnCols: Array<any> = []
  const idx = findIndex(childLength.value, { level: level })
  if (idx > -1) {
    childLength.value[idx].val = 0
  } else {
    childLength.value.push({ level: level, val: 0 })
  }
  forEach(column.child, (childColumn) => {
    childColumn.level = level
    if (!childColumn!.child) {
      returnCols.push(childColumn)
      childColumn.colspan = 1
    } else {
      const _checkDept = level >= colDepth.value ? false : true
      returnCols = concat(returnCols, FloorColumn(childColumn, level + 1, _checkDept))
      childColumn.colspan = childColumn.child.length + find(childLength.value, { level: level }).val
      forEach(childLength.value, (item) => {
        if (level > item.level) {
          item.val += childColumn.child.length - 1
        }
      })
    }
  })
  return returnCols
}
/******************************
 * TODO (목적): 헤더 level에 따른 child 처리
 * @param (1): child가 있는 헤더
 * @param (2): header의 level
 * @return (반환): 자식헤더 셋팅 된 헤더
 *******************************/
function getLevelHeaders(columns: Array<any>, level: number) {
  let returnHeaders: Array<any> = []
  forEach(columns, (column) => {
    if (column.level === level) {
      returnHeaders.push(column)
    } else {
      if (column!.child) {
        returnHeaders = concat(returnHeaders, getLevelHeaders(column.child, level))
      }
    }
  })
  return returnHeaders
}
/******************************
 * TODO (목적): 테이블 높이 설정 (화면에 따른)
 *******************************/
function setSize() {
  /**
   * autoFullHeight: 윈도우 사이즈에 맞게 자동으로 높이 조절
   * gridHeight: 그리드의 높이를 지정하는 prop
   *
   * 그리드의 높이를 지정하지 않았으며 autoFullHeight를 true로 준 경우 높이를 윈도우 사이즈에 맞게 조절한다.
   * ※ 단, 자동으로 조절되는 높이가 200보다 작게 설정되지 않는다.
   * */
  if (props.autoFullHeight && !props.gridHeight) {
    const offsettop = compoTable.value.$el.getBoundingClientRect().top
    const topsizes = [111, 208, 214]
    let tempHeight =
      window.innerHeight -
      (compoTable.value ? offsettop : 250) -
      (topsizes.indexOf(offsettop) < 0 ? 51 : 80)
    if (tempHeight < 300) {
      tempHeight = 300
    }
    height.value = String(tempHeight) + 'px'
  } else if (props.gridHeight) {
    height.value = props.gridHeight
  } else {
    height.value = '300px'
  }
  emits('getTableHeight', height.value)
}
/******************************
 * TODO (목적): col에 type이 있는지 판단 (있으면 false, 없으면 true)
 * @param (1): col의 type
 * @return (반환): 있으면 false, 없으면 true
 *******************************/
function check(type: string) {
  return type ? false : true
}
/******************************
 * TODO (목적): edit form 체크
 * @param (1): col의 type
 * @return (반환): eidt form에 따른 true, false
 *******************************/
function editTdCheck(type: string) {
  /**
   * type이 주어진 td이면서 editing이 필요한 컬럼인지 확인
   */
  const blackList = [
    'color',
    'html',
    'html2',
    'badge',
    'img',
    'cost',
    'cost2',
    'link',
    'tag',
    'custom',
    'proxy'
  ]
  return indexOf(blackList, type) === -1
}
/******************************
 * TODO (목적): link 클릭 시 emit
 * @param (1): 행 정보
 * @param (2): 컬럼 정보
 *******************************/
function linkClick(props: any, col: any) {
  emits('linkClick', props.row, col, props.pageIndex)
}
/******************************
 * TODO (목적): 행 클릭 시 emit (순간적으로 두번 누른 경우 더블클릭으로 인식)
 * @param (1): 클릭 이벤트
 * @param (2): 행 정보
 * @param (3): 행 index
 *******************************/
function rowClick(event: MouseEvent, row: any, index: number) {
  const tr = compoTable.value.$el.getElementsByClassName('tbody_tr_' + index)
  if (tr && tr[0]) {
    const highListTrs = compoTable.value.$el.getElementsByClassName('bg-light-blue-1')
    if (highListTrs && highListTrs.length > 0) {
      _.forEach(highListTrs, (highListTr) => {
        highListTr.classList.remove('bg-light-blue-1')
      })
    }
    tr[0].classList.add('bg-light-blue-1')
  }
  if (toggleFlag.value) {
    toggleFlag.value = false
    return
  }
  // td 안에 있는 버튼을 클릭 시에는 row Click 이벤트가 먹히지 않도록 설정
  if (isInnerBtnClick.value) return
  clicks.value++
  if (clicks.value === 1) {
    timer.value = setTimeout(function () {
      /** 행 클릭 */
      emits('rowClick', row, index)
      clicks.value = 0
    }, delay.value)
  } else {
    /** 행 더블 클릭 */
    clearTimeout(timer.value)
    emits('rowDblclick', row, index)
    clicks.value = 0
  }
}
/******************************
 * TODO (목적): 체크박스 변화가 발생했을 경우 (전체 체크 시 체크박스 비활성화 되어져 있는 부분은 제외)
 * @param (1): 체크박스 체킹 정보
 *******************************/
function changeSelection(detail: any) {
  if (detail.added) {
    // 전체 체크한 경우
    const noneSelected = filter(detail.rows, (row) => {
      return Boolean(row[props.checkDisableColumn])
    })
    setTimeout(() => {
      forEach(noneSelected, (item) => {
        const idx = findIndex(selected.value, (sel) => {
          return sel[props.rowKey] === item[props.rowKey]
        })
        if (idx > -1) {
          selected.value.splice(idx, 1)
        }
      })
    }, 100)
  } else {
    // 전체 체크해제한 경우
    const _selected = filter(detail.rows, (row) => {
      return Boolean(row[props.checkDisableColumn])
    })
    setTimeout(() => {
      // this.$set(this.$data, 'selected', _selected)
      forEach(_selected, (item) => {
        const idx = findIndex(selected.value, (sel) => {
          return sel[props.rowKey] === item[props.rowKey]
        })
        if (idx > -1) {
          selected.value.splice(idx, 1)
        }
      })
    }, 100)
  }
  setTimeout(() => {
    emits('changeSelection', detail)
  }, 150)
}
/******************************
 * TODO (목적): CTable을 직접 호출해 사용할 method
 *******************************/
// eslint-disable-next-line
function getSelected() {
  emits('getSelected', selected.value)
}
/******************************
 * TODO (목적): 테이블 scroll에 따른 html 표시 from to 값 setting
 * @param (1): 테이블 scroll에 따른 html 표시 from to
 *******************************/
function virtualScroll(details: any) {
  render.value = {
    from: details.from,
    to: details.to
  }
}
/******************************
 * TODO (목적): merge 처리 및 from/to에 따른 html 변환 처리 셋팅
 * @param (1): 행 정보
 * @param (2): 컬럼 위치
 * @param (3): 행 위치
 * @return (반환): td 그릴지 여부
 *******************************/
function isCreate(row: any, colIndex: number, rowIndex: number) {
  if (!compoTable.value) {
    return false
  }
  const data = compoTable.value.filteredSortedRows
  let returnVal = true
  if (props.merge && props.merge.length > 0) {
    let colName = ''
    if (colIndex > -1) {
      forEach(props.merge, (item) => {
        if (item.index === colIndex) {
          colName = item.colName
          return false
        }
      })
    } else {
      colName = clone(props.rowKey)
    }
    if (colName) {
      let viewRowIndex = rowIndex
      let rows = clone(data)
      if (initialPagination.value.rowsPerPage !== 0) {
        viewRowIndex = rowIndex > 0 ? rowIndex % initialPagination.value.rowsPerPage : rowIndex
        const lastPage = ceil(data.length / initialPagination.value.rowsPerPage)
        const stSliceIdx = (initialPagination.value.page - 1) * initialPagination.value.rowsPerPage
        if (lastPage !== initialPagination.value.page) {
          // 현재 보는 페이지가 마지막 페이지가 아닌경우
          const edSliceIdx =
            data.length - initialPagination.value.page * initialPagination.value.rowsPerPage
          rows = drop(rows, stSliceIdx)
          rows = dropRight(rows, edSliceIdx)
        } else {
          // 현재 보는 페이지가 마지막 페이지인 경우
          rows = drop(rows, stSliceIdx)
        }
      } else {
        // 페이징을 사용하지 않는 경우 100 단위로 랜더링 됨으로 100을 기준으로 row를 정리
        viewRowIndex = rowIndex > 0 ? rowIndex - render.value.from : rowIndex
        rows = drop(rows, render.value.from)
        rows = dropRight(rows, data.length - render.value.to - 1)
      }

      if (rows && rows.length > 0 && viewRowIndex > 0 && rows[viewRowIndex]) {
        if (
          rows[viewRowIndex - 1] &&
          rows[viewRowIndex - 1][colName] === rows[viewRowIndex][colName]
        ) {
          returnVal = false
        }
      }
    }
  }

  return returnVal
}
/******************************
 * TODO (목적): 행 merge 처리
 * @param (1): 컬럼 위치
 * @param (2): 행 위치
 * @return (반환): rowspan 값
 *******************************/
function getRowspan(colIndex: number, rowIndex: number) {
  const data = compoTable.value.filteredSortedRows
  let rowSpan = 0
  if (props.merge && props.merge.length > 0) {
    let colName = ''
    if (colIndex > -1) {
      forEach(props.merge, (item) => {
        if (item.index === colIndex) {
          colName = item.colName
          return false
        }
      })
    } else {
      colName = clone(props.rowKey)
    }
    if (colName) {
      let viewRowIndex = rowIndex
      let rows = clone(data)
      if (initialPagination.value.rowsPerPage !== 0) {
        const lastPage = ceil(data.length / initialPagination.value.rowsPerPage)
        const stSliceIdx = (initialPagination.value.page - 1) * initialPagination.value.rowsPerPage
        viewRowIndex = rowIndex > 0 ? rowIndex % initialPagination.value.rowsPerPage : rowIndex
        if (lastPage !== initialPagination.value.page) {
          // 현재 보는 페이지가 마지막 페이지가 아닌경우
          const edSliceIdx =
            data.length - initialPagination.value.page * initialPagination.value.rowsPerPage
          rows = drop(rows, stSliceIdx)
          rows = dropRight(rows, edSliceIdx)
        } else {
          // 현재 보는 페이지가 마지막 페이지인 경우
          rows = drop(rows, stSliceIdx)
        }
      } else {
        // 페이징을 사용하지 않는 경우 100 단위로 랜더링 됨으로 100을 기준으로 row를 정리
        viewRowIndex = rowIndex > 0 ? rowIndex - render.value.from : rowIndex
        rows = drop(rows, render.value.from)
        rows = dropRight(rows, data.length - render.value.to - 1)
      }
      if (rows && rows.length > 0 && rows[viewRowIndex]) {
        const postName = rows[viewRowIndex][colName]
        for (let i = viewRowIndex; i < rows.length; i++) {
          if (postName === rows[i][colName]) {
            rowSpan++
          } else {
            break
          }
        }
        // for (let i = 0; i < viewRowIndex; i++) {
        //   if (postName === rows[i][colName]) {
        //     rowSpan++
        //   } else {
        //     break
        //   }
        // }
      }
    }
  }

  if (rowSpan === 0) {
    rowSpan = 1
  }

  return rowSpan > 1 ? rowSpan : void 0
}
/******************************
 * TODO (목적): page 변경될 시 동기화
 *******************************/
function changePageNumber() {
  initialPagination.value.rowsPerPage = Number(clone(props.pagePerRow.pageNumber))
}
/******************************
 * TODO (목적): 컬럼 셋팅
 * @param (1): 컬럼 셋팅 정보
 *******************************/
function colChange(column: any) {
  if (!column.disabled) {
    if (column.check) {
      visibleColumns.value.push(column.name)
      const index = indexOf(hiddenColumns.value, column.name)
      if (index > -1) {
        hiddenColumns.value.splice(index, 1)
      }
    } else {
      const index = indexOf(visibleColumns.value, column.name)
      visibleColumns.value.splice(index, 1)
      hiddenColumns.value.push(column.name)
    }
    // 보이는 컬럼이 전체일경우 localStorage 삭제, 그외 컬럼visible정보를 localStorage에 저장
    if (visibleColumns.value.length == arrangColumns.value.length) {
      window.localStorage.removeItem(props.title)
    } else {
      window.localStorage.setItem(props.title, JSON.stringify(visibleColumns.value))
    }
  }
}
/******************************
 * TODO (목적): td안의 작은 버튼 활성화 체크
 * @param (1): 버튼 정보
 * @param (2): 행 정보
 * @return (반환): 활성화 여부
 *******************************/
function checkInnerBtnEnable(btn: any, row: any) {
  let returnVal = false
  if (btn.disableTarget) {
    // && col.disableCon && row[col.disableTarget]
    if (btn.disableCon) {
      returnVal = row[btn.disableTarget] !== btn.disableCon
    } else {
      returnVal = !row[btn.disableTarget]
    }
  }
  return returnVal
}
/******************************
 * TODO (목적): 활성화 체크
 * @param (1): 버튼 정보
 * @param (2): 행 정보
 * @param (3): 행 전체 정보
 * @return (반환): 활성화 여부
 *******************************/
function checkEnable(col: any, row: any, props: any) {
  let returnVal = false
  if (col.disableTarget) {
    // && col.disableCon && row[col.disableTarget]
    returnVal = row[col.disableTarget] !== col.disableCon
  }

  if (props.selection !== 'none' && col.selectionAble) {
    returnVal = !props.selected
  }
  return returnVal
}
/******************************
 * TODO (목적): td text, number color class 체크
 * @param (1): 컬럼 정보
 * @param (2): 행 정보
 * @param (3): 연산자
 * @return (반환): color class
 *******************************/
function checkColorClass(col: any, row: any, compareMethod?: string) {
  let returnColorClass = ''
  if (col.colorTarget) {
    const _classes = col.colorClass
    forEach(_classes, (item) => {
      let bol = false
      if (!compareMethod || compareMethod === '=') {
        bol = item.split(',')[0] === row[col.colorTarget]
      } else if (compareMethod === '>') {
        // 숫자만 가능
        bol = Number(item.split(',')[0]) > Number(row[col.colorTarget])
      } else if (compareMethod === '>=') {
        // 숫자만 가능
        bol = Number(item.split(',')[0]) >= Number(row[col.colorTarget])
      } else if (compareMethod === '<') {
        // 숫자만 가능
        bol = Number(item.split(',')[0]) < Number(row[col.colorTarget])
      } else if (compareMethod === '<=') {
        // 숫자만 가능
        bol = Number(item.split(',')[0]) <= Number(row[col.colorTarget])
      }
      if (bol) {
        returnColorClass = item.split(',')[1]
        return false
      }
    })
  }
  if (col.colorTarget2) {
    if (row[col.colorTarget2] == 'N' && row[col.disableTarget] === col.disableCon) {
      returnColorClass = 'bg-grey-9 text-white'
    }
  }
  if (col.colorTarget3) {
    if (row[col.colorTarget3] == 'C') {
      returnColorClass = 'air-no-check-target'
    }
  }
  return returnColorClass
}
/******************************
 * TODO (목적): 헤더 데이터 변경(일괄 변경)이 발생한 경우 그에 따른 조치
 * @param (1): 헤더 데이터 값
 * @param (2): 행 전체 정보
 * @param (2): 컬럼 정보
 * @param (2): 컬럼 이름
 *******************************/
function headerDataChange(val: string, props: any, col: any, name?: string) {
  if (col.headerType === 'checkbox') {
    emits('headerCheckboxChange', props, col, val)
    return
  }
  // 필터링한 데이터만 바꾸기(데이터가 있을경우)
  const filterRows = compoTable.value.filteredSortedRows
  if (filterRows && filterRows.length > 0) {
    const valueCol = col.type !== 'dept' ? col.name : col.deptCd
    const nameCol = col.type !== 'dept' ? 'nothing' : col.name
    forEach(filterRows, (item) => {
      if (
        !item[props.checkDisableColumn] &&
        !(col.disableTarget && item[col.disableTarget] !== col.disableCon)
      ) {
        item[valueCol] = val
        item[nameCol] = name
        if (item['editFlag'] !== 'C') {
          item['editFlag'] = 'U'
          item['chgUserId'] = user.value.userId
        }
      }
    })
  } else if (props.data && props.data.length > 0) {
    const valueCol = col.type !== 'dept' ? col.name : col.deptCd
    const nameCol = col.type !== 'dept' ? 'nothing' : col.name
    forEach(props.data, (item) => {
      if (
        !item[props.checkDisableColumn] &&
        !(col.disableTarget && item[col.disableTarget] !== col.disableCon)
      ) {
        item[valueCol] = val
        item[nameCol] = name
        if (item['editFlag'] !== 'C') {
          item['editFlag'] = 'U'
          item['chgUserId'] = user.value.userId
        }
      }
    })
    // 해당 경우에는 table-data-change emit을 날리지 않음
    emits('headerDataChange', props, col)
  }
}
/******************************
 * TODO (목적): 헤더 링크 클릭 시 emit
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function headLinkClick(props: any, col: any) {
  emits('headLinkClick', props, col, props.pageIndex)
}
/******************************
 * TODO (목적): 데이터 변경에 따른 수정자 셋팅 및 emit
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function datachange(props: any, col: any) {
  if (props.row['editFlag'] !== 'C') {
    props.row['editFlag'] = 'U'
    props.row['chgUserId'] = user.value.userId
  }
  emits('table-data-change', props, col)
}
/******************************
 * TODO (목적): 콤보박스 변경 시
 * @param (1): 콤보박스 변경 정보
 * @param (2): 행 전체 정보
 * @param (3): 컬럼 정보
 *******************************/
function changeSelect(val: any, props: any, col: any) {
  props.row[col.name] = val.value

  /**
   * user 컴포넌트 사용하면서 내/외 구분에 따라 컴포넌틑 컨트롤 한다면
   * select 될때 userId의 값을 빈값처리
   */
  const userTypeCol = find(props.cols, { type: 'user' })
  if (userTypeCol && userTypeCol.isInout) {
    //  && val.value === userTypeCol.out
    props.row[userTypeCol.userId] = null
    props.row[userTypeCol.field] = null

    /**
     * 2021.08.24 kdh
     * 사용자뿐만 아니라 관련있는 항목도 null처리
     * relationCols (Array) 를 통해 처리
     */
    if (userTypeCol.relationCols && userTypeCol.relationCols.length > 0) {
      forEach(userTypeCol.relationCols, (item) => {
        props.row[item] = null
      })
    }
  }
  if (props.row['editFlag'] !== 'C') {
    props.row['editFlag'] = 'U'
    props.row['chgUserId'] = user.value.userId
  }
  emits('table-data-change', props, col)
}
/******************************
 * TODO (목적): table 전체 사이즈 변환
 *******************************/
function clickFullScreen() {
  if (fullscreen.value === false) {
    fullscreen.value = true
    height.value = '100%'
  } else {
    fullscreen.value = false
    setTimeout(() => {
      setSize()
    }, 100)
  }
}
/******************************
 * TODO (목적): td 내부 작은 버튼 클릭 시
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 * @param (3): 버튼 정보
 * @return (반환):
 *******************************/
function innerBtnClicked(col: any, props: any, btn: any) {
  isInnerBtnClick.value = true
  setTimeout(() => {
    isInnerBtnClick.value = false
  }, 100)
  emits('innerBtnClicked', col, props, btn)
}
/******************************
 * TODO (목적): proxy에서 반환 하는 값 전달
 * @param (1): proxy에서 반환하는 값
 * @param (2): 행 전체 정보
 * @param (3): 컬럼 정보
 * @return (반환):
 *******************************/
function callbackProxy(data: any, props: any, col: any) {
  const refName = 'proxy_' + props.rowIndex + '_' + col.name
  emits('callbackProxy', data, props, col)
  const elements = document.getElementById(refName) as any
  if (elements) {
    elements.hide()
  }
  // this.$refs[refName][0].hide()
}
/******************************
 * TODO (목적): color class 반환 (type tag 인 경우)
 * @param (1): 컬럼 정보
 * @param (2): 데이터 정보
 * @return (반환): color class
 *******************************/
function setTagColor(col: any, data: any) {
  if (col.colorItems) {
    const color =
      find(col.colorItems, { code: data }) || find(col.colorItems, { stepperMstCd: data })
    return color ? color.attrVal1 || color.colorClass : ''
  } else {
    return ''
  }
}
/******************************
 * TODO (목적): 이름 반환 (type tag 인 경우)
 * @param (1): 컬럼 정보
 * @param (2): 데이터 정보
 * @return (반환): tag 이름
 *******************************/
function setTagName(col: any, data: any) {
  if (col.colorItems) {
    const color =
      find(col.colorItems, { code: data }) || find(col.colorItems, { stepperMstCd: data })
    return color ? color.codeName || color.stepperMstNm : ''
  } else {
    return ''
  }
}
/******************************
 * TODO (목적): 헤더 style 셋팅
 * @param (1): 컬럼 정보
 * @return (반환): 헤더 style
 *******************************/
function setHeaderStyle(col: any) {
  const width = col.style ? trim(split(col.style, ':')[1]) : ''
  let returnText = width ? 'min-width: ' + width + ';max-width: ' + width : ''

  // + ';max-width: ' + width : '';
  if (returnText !== '') {
    returnText += ';white-space: normal'
  }
  if (col.headerColor) {
    returnText += ';background: ' + col.headerColor
  }
  if (col.fix && col.style) {
    /**
     * fix를 하기 위해서는 width가 있어야함
     */
    let left = 0
    if (props.selection !== 'none' && props.editable) {
      /**
       * 체크박스가 있는 경우 clientLeft
       */
      left = 24
    }
    const colIdx = findIndex(arrangColumns.value, { name: col.name })
    if (colIdx > 0) {
      for (let i = 0; i < colIdx; i++) {
        const _left: string = trim(arrangColumns.value[i].style.replace(/width[:]|px/g, ''))
        left += _left && !Number.isNaN(_left) ? Number(_left) : 0
      }
    }
    returnText += ';position: sticky;background-color: #EEF2FD;z-index: 3;left:' + left + 'px;'
  }
  return returnText
}
/******************************
 * TODO (목적): 테이블(html) to 엑셀(html)
 *******************************/
function downloadExcel() {
  // 그리드 엑셀 다운로드 (멀티 haeder는 가장 아래 header기준 (3레벨 header까지))
  const columnsControlData = props.data.slice()

  if (props.data.length > 0) {
    const sheetheaderfileds: Array<any> = []
    const sheetheadertitle: any = {}
    const colsContr = visibleColumns.value
    props.columns.forEach(function (value) {
      if (value.child) {
        value.child.forEach(function (value2: any) {
          if (value2.child) {
            value2.child.forEach(function (value3: any) {
              if (colsContr.indexOf(value3.field) > -1) {
                sheetheaderfileds.push(value3.field)
                sheetheadertitle[value3.field] = value3.label
              }
            })
          } else {
            if (colsContr.indexOf(value2.field) > -1) {
              sheetheaderfileds.push(value2.field)
              sheetheadertitle[value2.field] = value2.label
            }
          }
        })
      } else {
        if (colsContr.indexOf(value.field) > -1) {
          sheetheaderfileds.push(value.field)
          sheetheadertitle[value.field] = value.label
        }
      }
    })
    const printData: Array<any> = []
    columnsControlData.forEach(function (value) {
      const keys = Object.keys(value)
      const obj: any = {}
      keys.forEach(function (_value) {
        if (
          sheetheaderfileds
            .map(function (e) {
              return e
            })
            .indexOf(_value) > -1
        ) {
          obj[_value] = value[_value]
        }
      })
      printData.push(obj)
    })
    const jsonWorkSheet = utils.json_to_sheet(printData, {
      header: sheetheaderfileds
    })
    const range = utils.decode_range(jsonWorkSheet['!ref']!)
    for (let c = range.s.c; c <= range.e.c; c++) {
      const header = utils.encode_col(c) + '1'
      jsonWorkSheet[header].v = sheetheadertitle[jsonWorkSheet[header].v]
    }
    const workBook = {
      SheetNames: ['Sheet1'], // sheet name
      Sheets: {
        Sheet1: jsonWorkSheet
      }
    }
    writeFile(workBook, props.title + '-' + moment().format('YYYYMMDD') + '.xlsx')
  }
}
/******************************
 * TODO (목적):
 * @param (1): 대상 데이터
 * @param (2): 새롭게 펼칠 데이터(자식 데이터)
 * @param (3): 하위 레벨
 * @param (4): 부모-자식 간 연결되는 id
 * @param (5): 하위 정보도 탐색할 것인지 여부
 * @param (6): 초기인지 여부
 *******************************/
function recursive(
  obj: any,
  newObj: any,
  level: number,
  itemId: string,
  isExpend: boolean,
  _isInit: boolean
) {
  if (!obj) return
  obj.forEach(function (o: any) {
    if (o.children && o.children.length != 0) {
      o.level = level
      o.leaf = false
      newObj.push(o)
      if (o[props.customID] == itemId || (props.expandAll && _isInit) || props.isFixExpand) {
        o.expend = isExpend
      }
      if (o.expend == true) {
        recursive(o.children, newObj, o.level + 1, itemId, isExpend, _isInit)
      }
    } else {
      o.level = level
      o.leaf = true
      newObj.push(o)
      return false
    }
  })

  if (isInit.value || !props.isFixExpand) {
    isInit.value = false
  }
}
/******************************
 * TODO (목적): tree 열기
 * @param (1): 행 정보
 * @param (2): 행 위치
 *******************************/
function toggle(item: any, index: number) {
  if (index === 0) {
    toggleFlag.value = true
    itemId.value = item[props.customID]

    item.leaf = false
    //show  sub items after click on + (more)
    if (item.leaf == false && item.expend == undefined && item.children != undefined) {
      if (item.children.length != 0) {
        recursive(item.children, [], item.level + 1, item[props.customID], true, false)
      }
    }

    if (item.expend == true && item.children != undefined) {
      item.children.forEach(function (o: any) {
        o.expend = undefined
      })

      item.expend = undefined
      item.leaf = false
      itemId.value = null
    }
  }
}
/******************************
 * TODO (목적): tree 단계 마다 padding을 주어 tree 형태 처럼 표현
 * @param (1): expend가 되는 데이터
 * @return (반환): padding style
 *******************************/
function setPadding(item: any) {
  return `padding-left: ${item.level * 30}px;`
}
/******************************
 * TODO (목적): expend icon 표시
 * @param (1): expend가 되는 데이터
 * @return (반환): expend icon
 *******************************/
function iconName(item: any) {
  if (item.expend == true) {
    return 'remove_circle_outline'
  }
  if (item.children && item.children.length > 0) {
    return 'control_point'
  }
  return 'done'
}
/******************************
 * TODO (목적): td 클릭 시 체크박스 체킹
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tdClick(props: any, col: any, self: any) {
  if (!props.checkClickFlag) return
  let rowspan = 0
  let target = self.target
  if (target.localName === 'span') {
    target = target.offsetParent
  }
  rowspan = target.getAttribute('rowspan') ? target.getAttribute('rowspan') : 0
  /**
   * selection이 있는 경우 실행 selected rowKey
   *
   * selected check
   */
  if (check(col.type) || col.type === 'html') {
    if (props.selection === 'multiple') {
      const data = compoTable.value.filteredSortedRows
      let filterData = []
      if (rowspan > 0) {
        filterData = filter(data, (item) => {
          return item[col.name] === props.row[col.name]
        })
      } else {
        filterData = filter(data, (item) => {
          return item[props.rowKey] === props.row[props.rowKey]
        })
      }
      if (filterData && filterData.length > 0) {
        forEach(filterData, (item) => {
          if (
            findIndex(selected.value, (selectItem) => {
              return selectItem[props.rowKey] === item[props.rowKey]
            }) === -1
          ) {
            selected.value.push(item)
          }
        })
      }
    } else if (props.selection === 'single') {
      const data = compoTable.value.filteredSortedRows
      selected.value = filter(data, (item) => {
        return item[props.rowKey] === props.row[props.rowKey]
      })
    }
  }
}
/******************************
 * TODO (목적): td 우클릭 시 체크박스 해제
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tdRightClick(props: any, col: any) {
  if (!props.checkClickFlag) return
  /**
   * selection이 있는 경우 실행 selected rowKey
   *
   * selected uncheck
   */
  if (check(col.type)) {
    if (props.selection === 'multiple' || props.selection === 'single') {
      const data = compoTable.value.filteredSortedRows
      const filterData = filter(data, (item) => {
        return item[col.name] === props.row[col.name]
      })
      if (filterData && filterData.length > 0) {
        forEach(filterData, (item) => {
          if (
            findIndex(selected.value, (selectItem) => {
              return selectItem[props.rowKey] === item[props.rowKey]
            }) > -1
          ) {
            selected.value = reject(selected.value, item)
          }
        })
      }
    }
  }
}
/******************************
 * TODO (목적): datepicker time 옵션 설정
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 * @return (반환): datepicker time 옵션
 *******************************/
function setTimePickerOptions(props: any, col: any) {
  if (
    col.type === 'datetime' &&
    props.tableTimePickerOptions &&
    props.tableTimePickerOptions.start &&
    col.name === props.tableTimePickerOptions.colName
  ) {
    const stepSplit = split(props.tableTimePickerOptions.step, ':')
    const curStart =
      props.rowIndex > 0
        ? props.data[props.rowIndex - 1][col.name]
        : props.tableTimePickerOptions.start
    const start = moment(getToday() + ' ' + curStart)
      .add(Number(stepSplit[1]), 'm')
      .add(Number(stepSplit[0]), 'h')
      .format('HH:mm')
    return {
      start: start,
      step: props.tableTimePickerOptions.step,
      end: props.tableTimePickerOptions.end
    }
  } else {
    return undefined
  }
}
/******************************
 * TODO (목적): td style 반환
 * @param (1): 컬럼 정보
 * @return (반환): td style
 *******************************/
function tdStyle(col: any) {
  let text = ''
  if (col.innerBtn && col.btns) {
    text = 'padding-top:10px !important;'
  }
  if (col.color) {
    text += 'font-weight:800; color:' + col.color + ';'
  }
  if (col.currentDay) {
    text += 'background-color: #eaffdd;'
  }
  if (col.fix && col.style) {
    /**
     * fix를 하기 위해서는 width가 있어야함
     */
    let left = 0
    if (props.selection !== 'none' && props.editable) {
      /**
       * 체크박스가 있는 경우 clientLeft
       */
      left = 24
    }
    const colIdx = findIndex(arrangColumns.value, { name: col.name })
    if (colIdx > 0) {
      for (let i = 0; i < colIdx; i++) {
        const _left = trim(arrangColumns.value[i].style.replace(/width[:]|px/g, ''))
        left += _left && !Number.isNaN(_left) ? Number(_left) : 0
      }
    }
    text += ';position: sticky;background-color: #EFEBE9;z-index: 1;left:' + left + 'px;'
  }
  return text
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style scoped>
.default-table tbody .q-tr [rowspan] {
  vertical-align: top;
}
@supports (position: sticky) or (position: -webkit-sticky) {
  .default-table
    tbody
    .q-tr
    [rowspan]:not(.edittd-text):not(.edittd-textarea):not(.edittd-number):not(.edittd-date):not(
      .edittd-select
    )
    > span:not(.descript-span) {
    position: sticky;
    top: calc(var(--my-var) + 2px);
  }
}
</style>

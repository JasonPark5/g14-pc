<template>
  <div :class="hideBorder ? 'hideBorder' : 'table-border'">
    <!-- v-table-resizable -->
    <q-table
      flat
      bordered
      :key="tableKey"
      :tableId="tableId"
      ref="compoTable"
      class="default-table"
      :class="[
        topBorderClass,
        customClass,
        isDashboard ? 'isDashboardTable' : '',
        isDense ? 'default-table-no-padding' : '',
        expanded ? '' : 'fold-table',
        striped ? 'q-table--striped' : ''
      ]"
      :style="{ height: expanded ? height : '50px' }"
      :card-class="cardClass"
      :grid="grid"
      :fullscreen="fullscreen"
      :separator="separator"
      :rows="props.data"
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
      :virtual-scroll-slice-size="!usePaging ? 100 : 20"
      :virtual-scroll-item-size="!usePaging ? 24 : 0"
      :hide-bottom="hideBottom"
      :hide-header="hideHeader"
      v-model:selected="selected"
      v-model:pagination="initialPagination"
      @selection="changeSelection"
      @virtual-scroll="virtualScroll"
    >
      <!-- :virtual-scroll-sticky-size-start="!usePaging ? 48 : 0" -->
      <!-- ### loading 처리 -->

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
              :style="
                tableWidth > 920
                  ? 'min-width: 150px;max-width: 250px;'
                  : 'min-width: 100px;max-width: 100px;'
              "
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
          <div class="table-chip-div">
            <slot name="table-chip" />
          </div>
          <q-space />
          <div class="col-auto cardselectarea">
            <slot name="table-header-append" />
          </div>
          <!-- 버튼 영역 -->
          <div class="q-mt-md gridbtntop">
            <slot name="table-button" />
          </div>
          <div class="float-right">
            <!-- 설명 영역 -->
            <slot name="prefixContent" />
            <q-btn
              v-if="isExcelDown && data!.length > 0"
              flat
              dense
              class="tableExcelIcon"
              @click="downloadExcelHtml"
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
                      :key="`table_col_setting_item_${idx}`"
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
                          :disable="column.required"
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
            <q-btn
              v-if="collapsed"
              flat
              dense
              class="card-collapse"
              color="grey-6"
              :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expanded = !expanded"
            >
              <q-tooltip>
                {{ expanded ? '접기' : '펼치기' }}
              </q-tooltip>
            </q-btn>
          </div>
          <slot name="customTableTitleEditor" />
        </template>
      </template>

      <template v-slot:header="bodyProps" v-if="viewHeaders && viewHeaders.length > 0">
        <q-tr v-for="(viewHeader, idx) in viewHeaders" :key="`header_tr_${idx}`" :ref="'ctr'">
          <template v-if="selection !== 'none' && idx === 0 && editable">
            <q-th
              auto-width
              class="text-center"
              :rowspan="colDepth"
              :class="[fixFlag ? 'checkbox-th-fix' : '', 'checkbox-th']"
              style="min-width: 24px; max-width: 24px"
            >
              <q-checkbox
                v-if="selection === 'multiple'"
                class="tableCheckBox"
                color="orange-custom"
                :disable="!editable"
                dense
                v-model="bodyProps.selected"
              />
            </q-th>
          </template>
          <q-th v-if="isExpand && idx === 0" auto-width class="text-center" :rowspan="colDepth">
            <slot name="expand-header" />
          </q-th>
          <!-- <q-th v-if="isTree && idx===0" auto-width class="text-center" :rowspan="colDepth">
            {{treeHeaderLabel}}
          </q-th> -->
          <slot name="perTh" v-bind="bodyProps" />
          <template v-for="col in viewHeader">
            <q-th
              v-if="col.colspan === 1 ? idx + 1 === col.level : true"
              :auto-width="false"
              :key="col.name"
              :class="{
                'text-center': true,
                'table-header-true': col.setHeader ? true : false
              }"
              :colspan="col.colspan"
              :rowspan="col.colspan === 1 && !col.hasOwnProperty('child') ? colDepth - idx : 1"
              :props="findIndex(arrangColumns, { name: col.name }) > -1 ? bodyProps : void 0"
              :style="setHeaderStyle(col)"
            >
              <span v-html="$language(col.label)" />
              <!-- <q-icon v-if="col.blinking"  color="yellow" class="blinking" rounded/> -->
              <span v-if="col.required && col.type !== 'plant'" class="text-red"> *</span>
              <template v-if="col.headerCustom">
                <slot name="customHeader" v-bind:props="bodyProps" v-bind:col="col" />
              </template>
              <span v-if="col.type === 'attach' && data && data.length > 0">
                <q-btn-group outline>
                  <q-icon name="help" class="custom-btn text-electric" style="font-size: 1.4em">
                    <q-tooltip anchor="bottom left" self="top left" style="padding: 10px">
                      <div class="tooltipCustomTop">
                        {{ $language('업로드 제한사항') }}
                      </div>
                      <div class="tooltipCustom">
                        <div class="q-pl-xs" style="text-align: left">
                          <span class="text-warning">{{ $language('업로드 가능 확장자') }}</span>
                          :
                          {{
                            col.hasOwnProperty('uploaderSetting')
                              ? col.uploaderSetting.acceptExt
                              : uploaderSetting.acceptExt
                          }}
                          <br />
                          <span class="text-warning">{{ $language('업로드 가능 파일 수') }}</span>
                          :
                          {{
                            col.hasOwnProperty('uploaderSetting')
                              ? col.uploaderSetting.limitCnt
                              : uploaderSetting.limitCnt
                          }}
                          <br />
                          <span class="text-warning">{{ $language('허용 파일 크기') }}</span>
                          :
                          {{
                            col.hasOwnProperty('uploaderSetting')
                              ? col.uploaderSetting.limitSize
                              : uploaderSetting.limitSize
                          }}MB
                        </div>
                      </div>
                    </q-tooltip>
                  </q-icon>
                </q-btn-group>
              </span>
              <span
                v-if="
                  col.helpcomment !== '' &&
                  col.helpcomment !== null &&
                  col.helpcomment !== undefined
                "
              >
                <q-icon
                  name="help"
                  style="font-size: 14px; margin-left: 1px"
                  class="inner-help-btn text-primary cursor-pointer"
                >
                  <q-tooltip anchor="bottom left" :offset="[0, 0]">
                    <div class="tooltipCustomTop">
                      {{ $language('설명') }}
                    </div>
                    <div class="tooltipCustom">
                      <div class="q-pl-xs text-left" v-html="col.helpcomment" />
                    </div>
                  </q-tooltip>
                </q-icon> </span
              ><span
                v-if="
                  col.helpcommentTable !== '' &&
                  col.helpcommentTable !== null &&
                  col.helpcommentTable !== undefined
                "
              >
                <q-icon
                  name="help"
                  style="font-size: 16px; margin-left: 2px; position: relative; top: -1px"
                  class="inner-help-btn text-primary cursor-pointer"
                >
                  <q-tooltip anchor="bottom middle">
                    <q-table
                      dense
                      hide-bottom
                      hide-pagination
                      :title="col.helpcommentTable.title"
                      class="helpcomment-table"
                      table-header-style="background: rgba(0,0,0,0.1)"
                      :columns="col.helpcommentTable.columns"
                      :rows="col.helpcommentTable.data"
                    />
                  </q-tooltip>
                </q-icon>
              </span>
              <span
                v-if="
                  col.helpcommentCustom !== '' &&
                  col.helpcommentCustom !== null &&
                  col.helpcommentCustom !== undefined
                "
              >
                <q-icon
                  name="help"
                  style="font-size: 16px; margin-left: 2px; position: relative; top: -1px"
                  class="inner-help-btn text-primary cursor-pointer"
                >
                  <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
                    <slot name="customComment" />
                  </q-menu>
                </q-icon>
              </span>
              <div v-if="col.setHeader && (col.type || col.headerType) && editable">
                <template v-if="col.headerType === 'checkbox'">
                  <q-checkbox
                    class="tableCheckBox"
                    color="orange-custom"
                    :disable="!editable"
                    :true-value="col.trueValue ? col.trueValue : 'Y'"
                    :false-value="col.falseValue ? col.falseValue : 'N'"
                    dense
                    v-model="col.value"
                    @update:model-value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
                <template v-if="col.type === 'select'">
                  <!-- select -->
                  <c-select
                    stype="tableHeaderselect"
                    :editable="editable"
                    :comboItems="col.comboItems"
                    :type="!col.none ? 'allEdit' : ''"
                    :itemText="col.itemText ? col.itemText : 'codeName'"
                    :itemValue="col.itemValue ? col.itemValue : 'code'"
                    v-model:value="col.value"
                    @datachange="(val: any) => headerDataChange(val.value, bodyProps, col)"
                  />
                  <!-- v-model="props.row[col.name]" -->
                </template>
                <c-multi-select
                  v-else-if="col.type === 'multiSelect'"
                  stype="tableHeaderselect"
                  :editable="editable"
                  :valueText="col.valueText ? col.valueText : 'codeName'"
                  :valueKey="col.valueKey ? col.valueKey : 'code'"
                  :comboItems="col.comboItems"
                  :itemText="col.itemText ? col.itemText : 'codeName'"
                  :itemValue="col.itemValue ? col.itemValue : 'code'"
                  v-model:value="col.value"
                  @update:value="(val: any) => headerDataChange(val, bodyProps, col)"
                />
                <c-dept-multi
                  v-if="col.type === 'deptMulti'"
                  stype="tableHeaderselect"
                  :editable="editable"
                  label=""
                  v-model:value="col.value"
                  @datachange="
                    (val1: string, val2: string) => {
                      headerDataChange(val1, bodyProps, col, val2)
                    }
                  "
                />
                <template v-if="col.type === 'html2'">
                  <country-flag :country="col.lang" class="lanauageFlag" />
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
                    @update:model-value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
                <!-- date -->
                <template v-else-if="col.type === 'date'">
                  <c-datepicker
                    dense
                    class="tableDatepicker"
                    name="tableDatepicker"
                    :type="col.dateType ? col.dateType : 'date'"
                    :disable="!editable"
                    :minuteStep="col.minuteStep ? col.minuteStep : 1"
                    :start="col.start ? col.start : ''"
                    :end="col.end ? col.end : ''"
                    :range="col.range === true ? true : false"
                    v-model:value="col.value"
                    @update:value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
                <!-- datetime  -->
                <template v-else-if="col.type === 'datetime'">
                  <c-datepicker
                    dense
                    class="tableDatepicker"
                    name="tableDatepicker"
                    :type="col.datetimeType ? col.datetimeType : 'time'"
                    :timePickerOptions="setTimePickerOptions(bodyProps, col)"
                    :range="col.range === true ? true : false"
                    :disable="!editable"
                    :minuteStep="col.minuteStep ? col.minuteStep : 1"
                    v-model:value="col.value"
                    @update:value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
                <!-- text -->
                <template v-else-if="col.type === 'text'">
                  <q-input
                    dense
                    v-if="col.type === 'text'"
                    v-model="col.value"
                    :maxlength="col.maxlength"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
                <template v-else-if="col.type === 'number'">
                  <q-input
                    dense
                    v-if="col.type === 'number'"
                    v-model="col.value"
                    type="number"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
                <template v-else-if="col.type === 'decimal'">
                  <q-input
                    dense
                    v-if="col.type === 'decimal'"
                    v-model="col.value"
                    type="text"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, bodyProps, col)"
                    @input="(e: any) => onDecimalInput(e, col)"
                  />
                </template>
                <template v-else-if="col.type === 'user'">
                  <q-input
                    :disable="!editable"
                    v-model="col.value"
                    :readonly="true"
                    class="table-inner-tr-user"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="search"
                        size="xs"
                        @click.stop.prevent="
                          openUserPop({ userId: '', userName: '' }, col, 'header')
                        "
                      />
                      <q-icon
                        name="close"
                        size="xs"
                        @click.stop.prevent="
                          deleteUserPop({ userId: '', userName: '' }, col, 'header')
                        "
                      />
                    </template>
                  </q-input>
                  <!-- <q-btn
                    class="tableinnerBtn tableinnerUserSearch"
                    :class="{
                      'tableinnerUserSearch-left': col.align === 'left' ? true : false,
                      'tableinnerUserSearch-right': col.align === 'right' ? true : false
                    }"
                    flat
                    color="blue-6"
                    :disable="!editable"
                    icon="search"
                    :label="col.value"
                    @click.stop="openUserPop({ userId: '', userName: '' }, col, 'header')"
                  /> -->
                </template>
                <template v-else-if="col.type === 'dept'">
                  <!-- dept (1) -->
                  <c-dept
                    type="edit"
                    label=""
                    isTable
                    :isFirstValue="false"
                    :disable="!editable"
                    v-model:value="col.value"
                    @datachange="
                      (deptCd: string, deptName: string) =>
                        headerDataChange(deptCd, bodyProps, col, deptName)
                    "
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
                    v-model:value="col.value"
                    @datachange="(val: any) => headerDataChange(val.value, bodyProps, col)"
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
                    :color="col.color ? col.color : 'blue-6'"
                    :icon="col.icon ? col.icon : 'build'"
                    @click.stop="headLinkClick(bodyProps, col)"
                  />
                  <!-- :icon="col.dayType === 'weekend' ? null : 'build'" -->
                  <q-input
                    dense
                    v-if="col.headType === 'text'"
                    v-model="col.value"
                    type="text"
                    class="tableHeaderText"
                    @update:model-value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                  <c-multi-field
                    v-if="col.headType === 'multiUser'"
                    class="tableHeaderMultiUser"
                    :userInfo="userInfo"
                    isArray
                    type="user"
                    label=""
                    v-model:value="col.value"
                    @update:value="(val: any) => headerDataChange(val, bodyProps, col)"
                  />
                </template>
              </div>
            </q-th>
          </template>
          <slot name="sufTh" v-bind="bodyProps" />
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <!-- 데이터 영역 -->
      <template v-slot:body="bodyProps">
        <template v-if="isDescriptionFrontTr">
          <slot name="description-front-tr" v-bind="bodyProps" />
        </template>
        <template v-if="!customDataTr">
          <!-- {{ uid() }} -->
          <q-tr
            :key="`${bodyProps.key}_${uid()}`"
            :props="bodyProps"
            :class="[
              {
                'table-tr-highLight': setHighLight(bodyProps),
                'no-hover-row': noHoverRow
              },
              // customTrClass(bodyProps),
              `tbody_tr_${bodyProps.rowIndex}`
            ]"
            v-on:click.stop="(e: Event) => rowClick(e, bodyProps.row, bodyProps.rowIndex)"
          >
            <!--
                앞에 배치됨
                columns에 정의한 col이 아닌 custom을 위한 영역
              -->
            <!-- props.row['editable'] -->
            <q-td
              v-if="
                selection !== 'none' && editable && isCreate(bodyProps.row, -1, bodyProps.rowIndex)
              "
              auto-width
              class="text-center"
              :rowspan="getRowspan(-1, bodyProps.rowIndex)"
              :class="fixFlag ? 'checkbox-td' : ''"
              style="min-width: 24px; max-width: 24px"
            >
              <q-checkbox
                class="tableCheckBox"
                color="orange-custom"
                :disable="!editable || bodyProps.row[checkDisableColumn]"
                dense
                v-model="bodyProps.selected"
              />
            </q-td>
            <q-td v-if="isExpand" auto-width class="text-center">
              <q-btn
                size="xs"
                class="tableInnerIsExpend"
                color="accent"
                round
                dense
                @click="bodyProps.expand = !bodyProps.expand"
                :icon="bodyProps.expand ? 'remove' : 'add'"
              />
            </q-td>
            <!-- <slot name="perTd" v-bind="bodyProps" /> -->
            <template v-for="(col, colIndex) in bodyProps.cols">
              <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props"> -->
              <!-- , setColColor(col), -->
              <q-td
                v-if="isCreate(bodyProps.row, Number(colIndex), bodyProps.rowIndex)"
                :ref="'custom-td-' + bodyProps.rowIndex + '-' + colIndex"
                :auto-width="false"
                :key="col.name"
                :props="bodyProps"
                :class="[
                  checkEnable(col, bodyProps.row, bodyProps) ? '' : `edittd-${col.type}`,
                  col.ellipsis == true ? 'tableinnerBtn-ellipsis' : '',
                  customTrClass(bodyProps)
                ]"
                :style="tdStyle(col)"
                :rowspan="getRowspan(Number(colIndex), bodyProps.rowIndex)"
              >
                <!-- @click="tdClick(props, col, $event)"
                  @contextmenu.capture.prevent="tdRightClick(props, col)" -->
                <!-- :class 에 포함되었던 속성으로 text box가 앞으로 나옴으로 주석처리
                  col.type === 'user' && !checkUserTd(col, props) ? 'edittd-text' : ''  -->
                <template v-if="contentsField(bodyProps, col)">
                  <!-- default 영역 : 해당 if는 제일 앞에 두고 그리드를 그리는데 좀 더 빠르게 표시하는게 목적 -->
                  <span
                    v-if="check(col.type)"
                    :class="[
                      checkEnable(col, bodyProps.row, bodyProps) ? 'non-edit' : '',
                      col.innerBtn ? 'descript-span' : '',
                      col.color ? 'text-' + col.color : ''
                    ]"
                    :style="
                      col.isEllipsis
                        ? {
                            display: 'inline-block',
                            maxWidth: col.maxWidth ? col.maxWidth : '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            paddingTop: '7px'
                          }
                        : null
                    "
                  >
                    {{ bodyProps.row[col.name] }}
                    <div v-if="col.description" class="description-td">
                      {{ bodyProps.row[col.description] }}
                    </div>
                    <div v-if="col.innerBtn">
                      <q-btn-group outline class="ColumInnerBtnGroup">
                        <template v-for="(btn, idx) in col.btns">
                          <q-btn
                            v-if="
                              editable &&
                              !checkEnable(col, bodyProps.row, bodyProps) &&
                              !checkInnerBtnEnable(btn, bodyProps.row)
                            "
                            :key="idx"
                            :label="btn.label"
                            :icon="btn.icon ? btn.icon : void 0"
                            :color="btn.color ? btn.color : 'blue-grey-4'"
                            :text-color="btn.textColor ? btn.textColor : 'white'"
                            class="ColumInnerBtn"
                            align="center"
                            @click.stop="innerBtnClicked(col, bodyProps, btn)"
                          >
                            <q-tooltip v-if="btn.tooltip">
                              <span v-html="$language(btn.tooltip)" />
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
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        :col="col"
                        :props="bodyProps"
                        :mask="col.mask"
                        :maxlength="col.maxlength"
                        :colorClass="checkColorClass(col, bodyProps.row)"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'textarea'">
                      <!-- input textarea -->
                      <c-textarea-column
                        :editable="editable"
                        :disabled="
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        :col="col"
                        :props="bodyProps"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'select'">
                      <!-- select -->
                      <c-select
                        class="no-label-control"
                        :editable="editable"
                        :disabled="
                          !editable ||
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        :isSelect="
                          col.isSelect === true || col.isSelect === false ? col.isSelect : true
                        "
                        :isChip="col.isChip"
                        :comboItems="col.comboItems"
                        :type="!col.none ? 'edit' : ''"
                        :itemText="col.itemText ? col.itemText : 'codeName'"
                        :itemValue="col.itemValue ? col.itemValue : 'code'"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="(val: any) => changeSelect(val, bodyProps, col)"
                      />
                    </template>
                    <c-multi-select
                      v-else-if="col.type === 'multiSelect'"
                      class="no-label-control"
                      :editable="editable"
                      :disabled="
                        !editable ||
                        bodyProps.row[checkDisableColumn] ||
                        checkEnable(col, bodyProps.row, bodyProps)
                      "
                      :isArray="col.isArray === false ? false : true"
                      :isObject="col.isObject"
                      :valueText="col.valueText ? col.valueText : 'codeName'"
                      :valueKey="col.valueKey ? col.valueKey : 'code'"
                      :comboItems="col.comboItems"
                      :itemText="col.itemText ? col.itemText : 'codeName'"
                      :itemValue="col.itemValue ? col.itemValue : 'code'"
                      v-model:value="bodyProps.row[col.name]"
                      @datachange="() => datachange(bodyProps, col)"
                    />
                    <template v-else-if="col.type === 'date'">
                      <c-datepicker
                        dense
                        class="tableDatepicker"
                        name="tableDatepicker"
                        :type="col.dateType ? col.dateType : 'date'"
                        :disabled="
                          checkEnable(col, bodyProps.row, bodyProps) ||
                          !editable ||
                          bodyProps.row[checkDisableColumn]
                        "
                        :range="col.range === true ? true : false"
                        :minuteStep="col.minuteStep ? col.minuteStep : 1"
                        :start="col.start ? col.start : ''"
                        :end="col.end ? col.end : ''"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="() => datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'plant'">
                      <div
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          height: 100%;
                          width: 100%;
                        "
                      >
                        <span>사업장1</span>
                      </div>
                    </template>
                    <template v-else-if="col.type === 'plantep'">
                      <!-- plant -->
                      <c-plant
                        :isTable="true"
                        class="no-label-control"
                        :editable="editable"
                        label=""
                        type="none"
                        :isEnterprise="true"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="() => datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'number'">
                      <!-- input number -->
                      <c-number-column
                        :editable="editable"
                        :disabled="
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        :maxlength="col.maxlength > 0 ? col.maxlength : void 0"
                        :col="col"
                        :props="bodyProps"
                        :colorClass="checkColorClass(col, bodyProps.row)"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'decimal'">
                      <!-- input number -->
                      <c-number-column
                        :editable="editable"
                        :disabled="
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        :maxlength="col.maxlength > 0 ? col.maxlength : void 0"
                        :col="col"
                        :props="bodyProps"
                        :colorClass="checkColorClass(col, bodyProps.row)"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="decimalDatachange(bodyProps, col)"
                      />
                    </template>
                    <!-- check box (1) -->
                    <template v-else-if="col.type === 'check'">
                      <q-checkbox
                        dense
                        :color="col.color ? col.color : 'orange-custom'"
                        class="tableCheckBox"
                        :label="
                          col.isLabel && col.true === bodyProps.row[col.name]
                            ? col.trueLabel
                            : col.isLabel && col.false === bodyProps.row[col.name]
                              ? col.falseLabel
                              : null
                        "
                        :disable="checkEnable(col, bodyProps.row, bodyProps) || !editable"
                        :true-value="col.true ? col.true : 'O'"
                        :false-value="col.false ? col.false : 'X'"
                        :checked-icon="col.checkIcon ? col.checkIcon : void 0"
                        :unchecked-icon="col.uncheckIcon ? col.uncheckIcon : void 0"
                        v-model="bodyProps.row[col.name]"
                        @update:model-value="() => datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'radio'">
                      <c-radio
                        :disabled="checkEnable(col, bodyProps.row, bodyProps) || !editable"
                        :comboItems="col.comboItems"
                        :itemText="col.itemText ? col.itemText : 'codeName'"
                        :itemValue="col.itemValue ? col.itemValue : 'code'"
                        label=""
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'dept'">
                      <!-- dept (1) -->
                      <c-dept
                        v-if="editable"
                        type="edit"
                        label=""
                        isTable
                        :isFirstValue="col.isFirstValue"
                        :disabled="
                          !editable ||
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        v-model:value="bodyProps.row[col.deptCd]"
                        @setDeptName="(val: string) => (bodyProps.row[col.name] = val)"
                        @datachange="datachange(bodyProps, col, col.type)"
                      />
                      <span v-else>
                        {{ bodyProps.row[col.name] }}
                      </span>
                    </template>
                    <template v-else-if="col.type === 'deptMulti'">
                      <!-- dept multi -->
                      <c-dept-multi
                        v-if="editable"
                        type="edit"
                        label=""
                        :disabled="
                          !editable ||
                          bodyProps.row[checkDisableColumn] ||
                          checkEnable(col, bodyProps.row, bodyProps)
                        "
                        v-model:value="bodyProps.row[col.deptCd]"
                        @setDeptName="
                          (val: string | null | undefined) => (bodyProps.row[col.name] = val)
                        "
                        @datachange="datachange(bodyProps, col, col.type)"
                      />
                      <span v-else>
                        {{ bodyProps.row[col.name] }}
                      </span>
                    </template>
                    <!-- 사용자 검색 -->
                    <template v-else-if="col.type === 'user'">
                      <q-input
                        v-if="checkUserTd(col, bodyProps)"
                        class="table-inner-td-user"
                        :disable="
                          checkEnable(col, bodyProps.row, bodyProps) ||
                          !editable ||
                          bodyProps.row[checkDisableColumn]
                        "
                        :readonly="true"
                        v-model="bodyProps.row[col.name]"
                      >
                        <template
                          v-slot:append
                          v-if="
                            !(
                              checkEnable(col, bodyProps.row, bodyProps) ||
                              !editable ||
                              bodyProps.row[checkDisableColumn]
                            )
                          "
                        >
                          <q-icon
                            name="search"
                            size="xs"
                            @click.stop.prevent="openUserPop(bodyProps.row, col, 'td')"
                          />
                          <q-icon
                            name="close"
                            size="xs"
                            @click.stop.prevent="deleteUserPop(bodyProps.row, col, 'td')"
                          />
                        </template>
                      </q-input>
                      <!-- <q-btn
                          v-if="checkUserTd(col, bodyProps)"
                          class="tableinnerBtn tableinnerUserSearch"
                          :class="{
                            'tableinnerUserSearch-left': col.align === 'left' ? true : false,
                            'tableinnerUserSearch-right': col.align === 'right' ? true : false
                          }"
                          flat
                          color="blue-6"
                          :disable="
                            checkEnable(col, bodyProps.row, bodyProps) ||
                            !editable ||
                            bodyProps.row[checkDisableColumn]
                          "
                          :icon="checkEnable(col, bodyProps.row, bodyProps) ? 'search_off' : 'search'"
                          :label="bodyProps.row[col.name]"
                          @click.stop="openUserPop(bodyProps.row, col, 'td')"
                        /> -->
                      <template v-else>
                        <c-text-column
                          :editable="editable"
                          :disabled="
                            bodyProps.row[checkDisableColumn] ||
                            checkEnable(col, bodyProps.row, bodyProps)
                          "
                          :col="col"
                          :props="bodyProps"
                          v-model:value="bodyProps.row[col.name]"
                          @datachange="datachange(bodyProps, col)"
                        />
                      </template>
                    </template>
                    <c-task-target
                      v-else-if="['vendor', 'facility', 'equip'].indexOf(col.type) > -1"
                      :disabled="
                        bodyProps.row[checkDisableColumn] ||
                        checkEnable(col, bodyProps.row, bodyProps)
                      "
                      :editable="editable"
                      :customPopupParam="getCustomPopupParam(col.type)"
                      :name="`${col.type}_${bodyProps.row.rowIndex}`"
                      label=""
                      v-model:value="bodyProps.row[col.name]"
                      @dataChange="
                        (val: any, oldVal: any, task: any) => taskChange(bodyProps, col, task)
                      "
                    />
                    <template v-else-if="col.type === 'attach'">
                      <c-upload-column
                        dense
                        class="tableUploadColumn"
                        :editable="
                          !checkEnable(col, bodyProps.row, bodyProps) &&
                          editable &&
                          !bodyProps.row[checkDisableColumn]
                        "
                        :imageRestriction="col.imageRestriction"
                        :col="col"
                        v-model:row="bodyProps.row"
                        v-model:uploaderSetting="uploaderSetting"
                        v-model:colUploaderSetting="col.uploaderSetting"
                        v-model:change="change"
                        @upload-change="
                          (data: any) => {
                            uploadChange(data, bodyProps)
                          }
                        "
                      />
                    </template>
                    <template v-else-if="col.type === 'file'">
                      <c-file-column
                        :editable="
                          !checkEnable(col, bodyProps.row, bodyProps) &&
                          editable &&
                          !bodyProps.row[checkDisableColumn]
                        "
                        v-model:fileIds="bodyProps.row[col.name]"
                        v-model:rowIndex="bodyProps.rowIndex"
                        v-model:preview="preview"
                      />
                    </template>
                    <template v-else-if="col.type === 'datetime'">
                      <c-datepicker
                        dense
                        class="tableDatepicker"
                        name="tableDatepicker"
                        :type="col.datetimeType ? col.datetimeType : 'time'"
                        :timePickerOptions="setTimePickerOptions(bodyProps, col)"
                        :range="col.range === true ? true : false"
                        :disabled="
                          checkEnable(col, bodyProps.row, bodyProps) ||
                          !editable ||
                          bodyProps.row[checkDisableColumn]
                        "
                        :minuteStep="col.minuteStep ? col.minuteStep : 1"
                        v-model:value="bodyProps.row[col.name]"
                        @datachange="() => datachange(bodyProps, col)"
                      />
                    </template>
                    <template v-else-if="col.type === 'detail' || col.type === 'click'">
                      <q-chip
                        color="orange"
                        style="font-size: 1em"
                        dense
                        :clickable="
                          !checkEnable(col, bodyProps.row, bodyProps) &&
                          editable &&
                          !bodyProps.row[checkDisableColumn]
                        "
                        outline
                        square
                        label="보기"
                        @click="
                          col.type === 'detail'
                            ? innerBtnClicked(col, bodyProps)
                            : linkClick(bodyProps, col)
                        "
                      />
                    </template>
                  </template>
                  <template v-else>
                    <!-- text 클릭 -->
                    <template v-if="col.type === 'link'">
                      <q-btn
                        v-if="bodyProps.row[col.name]"
                        class="tableinnerBtn"
                        :class="{
                          'tableinnerBtn-left': col.align === 'left' ? true : false,
                          'tableinnerBtn-right': col.align === 'right' ? true : false,
                          'tableinnerBtn-ellipsis': col.ellipsis == true ? true : false
                        }"
                        flat
                        :align="col.align"
                        color="blue-6"
                        :label="bodyProps.row[col.name]"
                        @click.stop="linkClick(bodyProps, col)"
                      />
                    </template>
                    <!-- tag -->
                    <template v-else-if="col.type === 'tag'">
                      <c-tag
                        :editable="
                          !checkEnable(col, bodyProps.row, bodyProps) &&
                          editable &&
                          !bodyProps.row[checkDisableColumn]
                        "
                        :icon="col.icon || 'person_outline'"
                        :itemText="col.itemText || 'userName'"
                        :itemValue="col.itemValue || 'userId'"
                        name="userIds"
                        v-model:value="bodyProps.row.userIds"
                        @addTag="addManager(bodyProps.row)"
                        @removeTag="(item: any) => removeManager(bodyProps.row, item)"
                      />
                      <!-- <q-chip
                        v-if="bodyProps.row[col.name]"
                        outline
                        square
                        :color="setTagColor(col, bodyProps.row[col.name])"
                        :text-color="col.colorItems ? 'white' : 'black'"
                      >
                        {{ setTagName(col, bodyProps.row[col.name]) }}
                      </q-chip>
                      <template v-else /> -->
                    </template>
                    <!-- custom -->
                    <template v-else-if="col.type === 'custom'">
                      <slot name="customArea" v-bind:props="bodyProps" v-bind:col="col" />
                    </template>
                    <!-- 천단위 콤마 -->
                    <span v-else-if="col.type === 'cost'">
                      {{ col.prefix ? col.prefix : ''
                      }}{{ toThousandFilter(bodyProps.row[col.name])
                      }}{{ col.suffix ? col.suffix : '' }}
                    </span>
                    <span v-else-if="col.type === 'bizNumber'">
                      {{ toBizNum(bodyProps.row[col.name]) }}
                    </span>
                    <!-- O 처리 효율 문제로 솔루션에는 반영하지 않음 -->
                    <!-- <span v-else-if="col.type==='circle'">
                        {{ props.row[col.name] == 'Y' ? 'O' : '' }}
                      </span> -->
                    <!-- HTML태그허용 -->
                    <span
                      v-else-if="col.type === 'html'"
                      v-html="
                        convertEnter(
                          col.maxLength > 0 && bodyProps.row[col.name].length > col.maxLength
                            ? bodyProps.row[col.name].substring(0, col.maxLength) + '...'
                            : bodyProps.row[col.name]
                        )
                      "
                    />
                    <span
                      v-else-if="col.type === 'html2'"
                      v-html="convertEnter(bodyProps.row[col.name])"
                    />
                    <!-- 백그라운드color -->
                    <div
                      v-else-if="col.type === 'color'"
                      :class="
                        bodyProps.row[col.name] === 'Y'
                          ? 'tdBackGroundColor'
                          : 'tdBackGroundColorNone'
                      "
                    >
                      {{ bodyProps.row[col.name] }}
                    </div>
                    <!-- badge -->
                    <span v-else-if="col.type === 'badge'">
                      <q-badge :color="col.color" :label="bodyProps.row[col.name]" />
                    </span>
                    <span v-else-if="col.type === 'img'">
                      <!-- 샘플 -->
                      <img
                        :src="bodyProps.row[col.name]"
                        style="width: 150px"
                        :class="{ 'cursor-pointer': Boolean(bodyProps.row.sysAttachFileId) }"
                        @click.prevent="setPreview(bodyProps.row)"
                      />
                    </span>
                    <!-- popup proxy -->
                    <q-btn
                      v-else-if="col.type === 'proxy'"
                      class="tableinnerBtn"
                      flat
                      :align="col.align"
                      color="blue-6"
                      :label="bodyProps.row[col.name] ? bodyProps.row[col.name] : '보기'"
                    >
                      <q-popup-proxy
                        :id="'proxy_' + bodyProps.rowIndex + '_' + col.name"
                        :ref="(el: any) => (proxyColumns[bodyProps.rowIndex] = el)"
                        :breakpoint="1000"
                      >
                        <component
                          :is="col.component"
                          :props="bodyProps"
                          :col="col"
                          :editable="editable"
                          @callback="(data: any) => callbackProxy(data, bodyProps, col)"
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
            <slot name="sufTd" v-bind="bodyProps" />
          </q-tr>
        </template>
        <template v-else>
          <slot name="customDataTr" v-bind="bodyProps" />
        </template>
        <q-tr
          v-if="showDescription && !bodyProps.row.disabled"
          :props="bodyProps"
          :key="`e_${bodyProps.rowIndex}`"
          class="q-virtual-scroll--with-prev description-tr"
        >
          <q-td colspan="100%" class="description-td">
            <slot name="description-td" v-bind="bodyProps" />
          </q-td>
        </q-tr>
        <q-tr v-if="bodyProps.expand" :props="bodyProps">
          <q-td colspan="100%">
            <slot name="expand-td" v-bind="bodyProps" />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <slot name="customBottomRow" />
      </template>
      <!-- 바텀 영역 -->
      <template v-slot:bottom>
        {{ $language('총 건수') }} : {{ data ? toThousandFilter(data.length) : 0 }}
        <q-space />

        <!-- 페이징 영역 -->
        <template v-if="usePaging">
          <!-- 페이지 input 영역 -->
          <q-select
            outlined
            dense
            style="min-width: 50px; max-width: 70px"
            :options="pageItems"
            color="table-paging-color"
            class="tablePagingInput"
            v-model="pagePerRow.pageNumber"
            @update:model-value="changePageNumber"
          />
          <!-- 페이지네이션 영역 -->
          <q-pagination
            v-model="initialPagination.page"
            :max="pagesNumber"
            unelevated
            flat
            :max-pages="7"
            class="tablePagingBtn"
            direction-links
            boundary-links
            size="0.95em"
            color="grey-8"
            icon-first="skip_previous"
            icon-last="skip_next"
          />
        </template>
      </template>
    </q-table>
    <c-dialog :param="popupOptions" />

    <!-- 이미지 미리보기 -->
    <q-dialog v-if="preview && preview.src" v-model="preview.isShow">
      <q-card class="preview-image-card">
        <q-btn
          color="white"
          text-color="primary"
          @click="preview.isShow = false"
          round
          dense
          icon="close"
          class="preview-close-btn"
        >
          <!-- 창닫기 -->
          <q-tooltip class="bg-white text-primary">{{ $language('창닫기') }}</q-tooltip>
        </q-btn>
        <q-img :src="preview.src" />
        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="save_alt"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
            @click.prevent="fileDown(preview)"
          />
          <div class="row no-wrap items-center">
            <div class="col text-h6">
              {{ preview.oriFileNm }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              {{ bytesToSize(preview.fileSize) }}
            </div>
          </div>
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
  onUnmounted
  // shallowRef,
  // defineAsyncComponent
} from 'vue'
import { storeToRefs } from 'pinia'
import { uid } from 'quasar'
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
  replace,
  concat,
  extend
} from 'lodash-es'
import moment from 'moment'
import CountryFlag from 'vue-country-flag-next'

import selectConfig from '@utils/selectConfig'
import {
  getMultiComboItems,
  getComboItems,
  toThousandFilter,
  toBizNum,
  convertEnter,
  getTodayNone,
  getToday,
  base64ToBlob,
  getAccept,
  bytesToSize
} from '@utils/common'
import { $http } from '@utils/http'
import { encrypt, fileDownDecrypt } from '@utils/aes256'

import { GetTranLanguageFunction } from '@/types/language'
import { popupParamType } from '@/types/popupParam'

import { useUserStore } from '@stores/user'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTable'
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
  // 'getSelected',
  'headerCheckboxChange',
  'headerDataChange',
  'headLinkClick',
  'uploadChange',
  'innerBtnClicked',
  'callbackProxy',
  'signReExamine',
  'addTag',
  'removeTag'
])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  data: Array<any>
  columns: Array<tableColumnType>
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
  collapsed?: boolean
  defaultExpand?: boolean
  cardClass?: string
  loading?: boolean
  dense?: boolean
  customClass?: stringNull
  autoFullHeight?: boolean
  gridHeight?: string
  gridHeightAuto?: boolean
  grid?: boolean
  usePaging?: boolean
  isDashboard?: boolean
  hideBottom?: boolean
  hideHeader?: boolean
  isExpand?: boolean
  isTitle?: boolean
  isTop?: boolean
  tableId?: string
  isTree?: boolean
  treeHeaderLabel?: string
  isSelection?: Function
  highLightInfo?: any
  topBorderClass?: string
  contentsField?: Function
  showDescription?: boolean
  noHighLight?: boolean
  noHoverRow?: boolean
  checkDisableColumn?: string
  checkClickFlag?: boolean
  striped?: boolean
  tableTimePickerOptions?: any
  customTrClass?: Function
  pagePerRow?: {
    pageNumber: number
  }
  changeData?: boolean
  customDataTr?: boolean
  isDense?: boolean
  isDescriptionFrontTr?: boolean
  hideBorder?: boolean
}
type paginationType = {
  sortBy: string
  descending: boolean
  page: number
  rowsPerPage: number
}
type userInfoType = {
  row: any
  col: any
  gubun: string
}
type uploadResearchType = {
  row: any
  uploadCols: any
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
  rowKey: '',
  customClass: '',
  columnSetting: true,
  isFullScreen: true,
  isExcelDown: true,
  filtering: true,
  collapsed: false,
  defaultExpand: true,
  cardClass: '',
  loading: false,
  dense: true,
  autoFullHeight: true,
  gridHeight: '',
  gridHeightAuto: false,
  grid: false,
  usePaging: true,
  isDashboard: false,
  hideBottom: false,
  hideHeader: false,
  isExpand: false,
  isTitle: true,
  isTop: true,
  tableId: '',
  isTree: false,
  treeHeaderLabel: '',
  striped: false,
  // eslint-disable-next-line
  isSelection: (props: any) => {
    return true
  },
  highLightInfo: () => {},
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
  },
  changeData: false,
  customDataTr: false,
  isDense: false,
  isDescriptionFrontTr: false,
  hideBorder: false
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
const viewHeaders = ref<Array<tableColumnType>>([])
const arrangColumns = ref<Array<tableColumnType>>([])
const columnsControl = ref<Array<any>>([])
const visibleColumns = ref<Array<tableColumnType>>([])
const hiddenColumns = ref<Array<string>>([])
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
const setUserInfo = ref<userInfoType>({
  row: null,
  col: null,
  gubun: ''
})
const delay = ref(180)
const clicks = ref(0)
const timer = ref<NodeJS.Timeout>(setTimeout(() => {}, 1))
const render = ref({
  from: 0,
  to: 0
})
const uploaderSetting = ref({
  multipleSelFlag: 'N',
  previewFlag: 'N',
  acceptExt: '*',
  limitSize: 1048576,
  limitCnt: 5,
  noThumbnails: false,
  explainFlag: 'N',
  resizeWidth: 0,
  resizeQuality: 1
})
const preview = ref({
  isShow: false,
  sysAttachFileId: '',
  src: '',
  oriFileNm: '',
  fileSize: 0,
  fileExt: ''
})
const previewUrl = ref('')
const fileDownUrl = ref('')
const change = ref({
  data: ''
})
const uploadResearchObj = ref<uploadResearchType>({
  row: null,
  uploadCols: null
})
const expanded = ref(true)
const tableKey = ref('1')
const compoTable = ref<any>(null)
const isInnerBtnClick = ref(false)
const plantItems = ref<Array<any>>([])
const proxyColumns = ref<Array<any>>([])
/******************************
 * @Computed_선언
 *******************************/
const pagesNumber = computed(() => {
  let _length = props.data ? props.data.length : 0
  if (filterText.value) {
    _length = compoTable.value.filteredSortedRows?.length || 0
  }
  return Math.ceil(_length / initialPagination.value.rowsPerPage)
})
const fixFlag = computed(() =>
  arrangColumns.value && arrangColumns.value.length > 0 ? arrangColumns.value[0].fix : false
)
const noDataLabel = computed(() => $language('데이터가 없습니다.'))
const noResultLabel = computed(() => $language('필터링 된 데이터가 없습니다.'))
const userInfo = computed(() => {
  return {
    userItems: [],
    userText: 'userName',
    userValue: 'userId'
  }
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
    // if (!isSame(newVal, oldVal)) {
    //}
  },
  { deep: true }
)
watch(
  () => props.changeData,
  () => {
    /**
     * data가 바뀜으로 인해 td안에 있는 컴포넌트가 반응을 해야함에도
     * 반응하지 않는 현상 있음(옛날 정보를 그대로 가지고 있는 경우)
     *
     * 해당 경우로 인해 컴포넌트에 flag를 넘김
     *
     * 컴포넌트 :: attach
     */
    change.value.data = uid()
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
  previewUrl.value = selectConfig.com.upload.preview.url
  fileDownUrl.value = selectConfig.com.upload.fileDown.url

  // 테이블 접기/펼치기 기본값 셋팅
  if (props.collapsed) {
    expanded.value = props.defaultExpand
  }
  getComboItems('PLANT_CD').then((_result: any) => {
    plantItems.value = _result
  })
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
  if (!compoTable.value?.$el) return
  arrangColumns.value = []
  let tempArrangColumns: Array<any> = []
  let _colDepth = 1
  colDepth.value = 1
  forEach(props.columns, (column: any) => {
    const idx = findIndex(childLength.value, { level: 1 })
    if (idx > -1) {
      childLength.value[idx].val = 0
    } else {
      childLength.value.push({ level: 1, val: 0 })
    }
    column.level = 1
    if (!column!.child) {
      tempArrangColumns.push(column)
      column.colspan = 1
    } else {
      tempArrangColumns = concat(tempArrangColumns, FloorColumn(column, 2, false))
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
  // visibleColumns.value = tempArrangColumns
  visibleColumns.value = map(
    _.reject(tempArrangColumns, (col) => {
      return col.type === 'plant' || col.label === '사업장' || col.name === 'plantName'
    }),
    'name'
  )
  // visibleColumns.value = map(tempArrangColumns, 'name')

  // 컬럼 visible정보를 localStorage에 있으면 불러오기..
  const tablevisiblecol = JSON.parse(window.localStorage.getItem(props.title)!)
  if (tablevisiblecol !== null) {
    visibleColumns.value = tablevisiblecol
  }
  let index = 0
  columnsControl.value = []
  const typeChecks = ['select', 'radio', 'multiSelect']
  const codeGroupCds: Array<any> = []
  forEach(tempArrangColumns, (col) => {
    /**
     * get comboItems
     * type: select, radio, multiSelect
     */
    if (typeChecks.indexOf(col.type) > -1 && !col.comboItems) {
      codeGroupCds.push(col.codeGroupCd)
    }
    columnsControl.value.push({
      label: col.label,
      name: col.name,
      required: col.required,
      check: visibleColumns.value.indexOf(col.name) > -1 ? true : false,
      disabled: findIndex(props.merge, { index: index }) > -1 || col.level > 1
      // disabled: false,
    })
    index++
  })

  if (codeGroupCds && codeGroupCds.length > 0) {
    let comboItemsArray: Array<any> = []
    getMultiComboItems(codeGroupCds).then((_result: any) => {
      comboItemsArray = _result
      for (const key in comboItemsArray) {
        let cols = filter(tempArrangColumns, { codeGroupCd: key })
        cols = map(cols, (col: any) => {
          return extend(col, {
            comboItems: comboItemsArray[key]
          })
        })
      }
      arrangColumns.value = tempArrangColumns
    })
  } else {
    arrangColumns.value = tempArrangColumns
  }
  compoTable.value.$el.style.setProperty('--my-var', colDepth.value * 33 + 'px')
}
/******************************
 * TODO (목적): 컬럼 level에 따른 child 처리
 * @param (1): child가 있는 컬럼
 * @param (2): column의 level
 * @param (3):
 * @return (반환): 자식컬럼 셋팅 된 컬럼
 *******************************/
function FloorColumn(column: tableColumnType, level: number, checkDept: boolean) {
  if (!checkDept) {
    colDepth.value++
  }
  let returnCols: Array<tableColumnType> = []
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
function getLevelHeaders(columns: Array<tableColumnType>, level: number) {
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
  if (!props.gridHeightAuto) {
    if (props.autoFullHeight && !props.gridHeight) {
      const offsettop = compoTable.value.$el.getBoundingClientRect().top
      const topsizes = [111, 208, 214]
      // let tempHeight = (document.getElementsByClassName('app-footer')[0].offsetTop - (compoTable.value ? compoTable.value.$el.offsetTop : 250)) - 10;
      let tempHeight =
        window.innerHeight -
        (compoTable.value ? offsettop : 250) -
        (topsizes.indexOf(offsettop) < 0 ? 12 : 80)
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
  } else {
    height.value = ''
  }
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
function linkClick(bodyProps: any, col: any) {
  emits('linkClick', bodyProps.row, col, bodyProps.pageIndex)
}
/******************************
 * TODO (목적): 사용자 팝업 표시
 * @param (1): 행 정보
 * @param (2): 컬럼 정보
 * @param (3): header, td 표시
 * @return (반환):
 *******************************/
function openUserPop(row: any, col: any, gubun: string) {
  setUserInfo.value = {
    row: row,
    col: col,
    gubun: gubun
  }
  popupOptions.value.width = '60%'
  popupOptions.value = getPopupOptions('user', popupOptions.value, closePopup, {
    type: 'single'
  })
}
/******************************
 * TODO (목적): 사용자 팝업 닫기
 * @param (1): 사용자 팝업에서 선택한 정보
 * @param (2):
 * @return (반환):
 *******************************/
function closePopup(data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (setUserInfo.value.gubun === 'td') {
      setUserInfo.value.row[setUserInfo.value.col.name] = data[0].userName
      setUserInfo.value.row[setUserInfo.value.col.userId] = data[0].userId

      const deptCdText = setUserInfo.value.col.deptCd ? setUserInfo.value.col.deptCd : 'deptCd'
      const deptNameText = setUserInfo.value.col.deptName
        ? setUserInfo.value.col.deptName
        : 'deptName'
      const jobNameText = setUserInfo.value.col.jobName ? setUserInfo.value.col.jobName : 'jobName'
      const spotNameText = setUserInfo.value.col.spotName
        ? setUserInfo.value.col.spotName
        : 'spotName'
      setUserInfo.value.row[deptCdText] = data[0].deptCd
      setUserInfo.value.row[deptNameText] = data[0].deptName
      setUserInfo.value.row[jobNameText] = data[0].jobName
      setUserInfo.value.row[spotNameText] = data[0].spotName

      if (setUserInfo.value.row['editFlag'] !== 'C') {
        setUserInfo.value.row['editFlag'] = 'U'
        setUserInfo.value.row['chgUserId'] = user.value.userId
      }
      emits('table-data-change', { row: setUserInfo.value.row }, setUserInfo.value.col)
    } else {
      setUserInfo.value.col.value = data[0].userName
      if (props.data && props.data.length > 0) {
        forEach(props.data, (item) => {
          if (
            !item[props.checkDisableColumn] &&
            !(
              setUserInfo.value.col.disableTarget &&
              item[setUserInfo.value.col.disableTarget] !== setUserInfo.value.col.disableCon
            )
          ) {
            item[setUserInfo.value.col.name] = data[0].userName
            item[setUserInfo.value.col.userId] = data[0].userId

            const deptCdText = setUserInfo.value.col.deptCd
              ? setUserInfo.value.col.deptCd
              : 'deptCd'
            const deptNameText = setUserInfo.value.col.deptName
              ? setUserInfo.value.col.deptName
              : 'deptName'
            const jobNameText = setUserInfo.value.col.jobName
              ? setUserInfo.value.col.jobName
              : 'jobName'
            const spotNameText = setUserInfo.value.col.spotName
              ? setUserInfo.value.col.spotName
              : 'spotName'
            item[deptCdText] = data[0].deptCd
            item[deptNameText] = data[0].deptName
            item[jobNameText] = data[0].jobName
            item[spotNameText] = data[0].spotName

            if (item['editFlag'] !== 'C') {
              item['editFlag'] = 'U'
              item['chgUserId'] = user.value.userId
            }
          }
        })
        // 해당 경우에는 table-data-change emit을 날리지 않음
      }
    }
  }
}
function deleteUserPop(row: any, col: any, gubun: string) {
  setUserInfo.value = {
    row: row,
    col: col,
    gubun: gubun
  }
  if (setUserInfo.value.gubun === 'td') {
    setUserInfo.value.row[setUserInfo.value.col.name] = ''
    setUserInfo.value.row[setUserInfo.value.col.userId] = ''

    const deptCdText = setUserInfo.value.col.deptCd ? setUserInfo.value.col.deptCd : 'deptCd'
    const deptNameText = setUserInfo.value.col.deptName
      ? setUserInfo.value.col.deptName
      : 'deptName'
    const jobNameText = setUserInfo.value.col.jobName ? setUserInfo.value.col.jobName : 'jobName'
    const spotNameText = setUserInfo.value.col.spotName
      ? setUserInfo.value.col.spotName
      : 'spotName'
    setUserInfo.value.row[deptCdText] = ''
    setUserInfo.value.row[deptNameText] = ''
    setUserInfo.value.row[jobNameText] = ''
    setUserInfo.value.row[spotNameText] = ''
    if (setUserInfo.value.row['editFlag'] !== 'C') {
      setUserInfo.value.row['editFlag'] = 'U'
      setUserInfo.value.row['chgUserId'] = user.value.userId
    }

    emits('table-data-change', { row: setUserInfo.value.row }, setUserInfo.value.col)
  } else {
    setUserInfo.value.col.value = ''
    if (props.data && props.data.length > 0) {
      forEach(props.data, (item) => {
        if (
          !item[props.checkDisableColumn] &&
          !(
            setUserInfo.value.col.disableTarget &&
            item[setUserInfo.value.col.disableTarget] !== setUserInfo.value.col.disableCon
          )
        ) {
          item[setUserInfo.value.col.name] = ''
          item[setUserInfo.value.col.userId] = ''

          const deptCdText = setUserInfo.value.col.deptCd ? setUserInfo.value.col.deptCd : 'deptCd'
          const deptNameText = setUserInfo.value.col.deptName
            ? setUserInfo.value.col.deptName
            : 'deptName'
          const jobNameText = setUserInfo.value.col.jobName
            ? setUserInfo.value.col.jobName
            : 'jobName'
          const spotNameText = setUserInfo.value.col.spotName
            ? setUserInfo.value.col.spotName
            : 'spotName'
          item[deptCdText] = ''
          item[deptNameText] = ''
          item[jobNameText] = ''
          item[spotNameText] = ''

          if (item['editFlag'] !== 'C') {
            item['editFlag'] = 'U'
            item['chgUserId'] = user.value.userId
          }
        }
      })
      // 해당 경우에는 table-data-change emit을 날리지 않음
    }
  }
}
/******************************
 * TODO (목적): 행 클릭 (순간적으로 두번 누른 경우 더블클릭으로 인식)
 * @param (1): 클릭 이벤트
 * @param (2): 행 정보
 * @param (3): 행 index
 *******************************/
function rowClick(event: Event, row: any, index: number) {
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
 * TODO (목적): 하이라이트 설정
 * @param (1): 행 정보
 * @return (반환): 하이라이트 설정할 여부
 *******************************/
function setHighLight(bodyProps: any) {
  let returnVal = false
  if (props.highLightInfo && props.highLightInfo.ids) {
    returnVal = indexOf(props.highLightInfo.ids, bodyProps.row[props.highLightInfo.val]) > -1
  }
  return returnVal
}
/******************************
 * TODO (목적): 체크박스 변화가 발생했을 경우 (전체 체크 시 체크박스 비활성화 되어져 있는 부분은 제외)
 * @param (1): 체크박스 체킹 정보
 *******************************/
function changeSelection(detail: any) {
  if (detail.added) {
    // 전체 체크한 경우
    const noneSelected = filter(detail.rows, (row) => Boolean(row[props.checkDisableColumn]))
    setTimeout(() => {
      forEach(noneSelected, (item) => {
        const idx = findIndex(selected.value, (sel) => sel[props.rowKey] === item[props.rowKey])
        if (idx > -1) selected.value.splice(idx, 1)
      })
    }, 100)
  } else {
    // 전체 체크해제한 경우
    const _selected = filter(detail.rows, (row) => Boolean(row[props.checkDisableColumn]))
    setTimeout(() => {
      forEach(_selected, (item) => {
        const idx = findIndex(selected.value, (sel) => sel[props.rowKey] === item[props.rowKey])
        if (idx > -1) selected.value.splice(idx, 1)
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
function getSelected() {
  return props.rowKey
    ? _.filter(props.data, (filterItem) => {
        return (
          _.findIndex(selected.value, (selectedItem) => {
            return selectedItem[props.rowKey] === filterItem[props.rowKey]
          }) > -1
        )
      })
    : selected.value
}
/******************************
 * TODO (목적): CTable을 직접 호출해 사용할 method (SET 전용)
 *******************************/
function setSelected(pushItems: any) {
  if (pushItems && pushItems.length > 0) {
    _.forEach(pushItems, (item) => {
      selected.value.push(item)
    })
  } else {
    selected.value = []
  }
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
  row['plantCd'] = '1000'

  // console.log(row['plantCd'])
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
      if (rows && rows.length > 0 && rows[viewRowIndex]) {
        const postName = rows[viewRowIndex][colName]
        for (let i = viewRowIndex; i < rows.length; i++) {
          if (postName === rows[i][colName]) {
            rowSpan++
          } else {
            break
          }
        }
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
function colChange(column: tableColumnType) {
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
function checkEnable(col: any, row: any, bodyProps: any) {
  let returnVal = false
  if (col.disableTarget) {
    // && col.disableCon && row[col.disableTarget]
    returnVal = row[col.disableTarget] !== col.disableCon
  }

  if (props.selection !== 'none' && col.selectionAble) {
    returnVal = !bodyProps.selected
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
  if (
    (col.colorTarget4 && row[col.colorTarget4] === 'N') ||
    (col.colorTarget2 && row[col.colorTarget2] === 'N')
  ) {
    returnColorClass = 'bg-grey-9 text-white'
  }
  if (col.colorTarget3 && row[col.colorTarget3] === 'C') {
    returnColorClass = 'air-no-check-target'
  }
  return returnColorClass
}
/******************************
 * TODO (목적): 내/외부 체크 (사용자 type 인 경우만)
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 * @return (반환): 내/외부 여부
 *******************************/
function checkUserTd(col: any, bodyProps: any) {
  if (!col.isInout) {
    return true
  } else {
    if (bodyProps.row[col.inoutCol] === col.in) {
      return true
    } else {
      return false
    }
  }
}
/******************************
 * TODO (목적): 헤더 데이터 변경(일괄 변경)이 발생한 경우 그에 따른 조치
 * @param (1): 헤더 데이터 값
 * @param (2): 행 전체 정보
 * @param (2): 컬럼 정보
 * @param (2): 컬럼 이름
 *******************************/
function headerDataChange(val: any, bodyProps: any, col: any, name?: string) {
  if (col.headerType === 'checkbox') {
    emits('headerCheckboxChange', bodyProps, col, val)
    return
  } else if (col.type === 'decimal') {
    let value = String(val)
    const point = col.point ?? 0
    const maxInteger = col.integer ?? 6

    const regex = new RegExp(`^(-?)(\\d{0,${maxInteger}})(\\.\\d{0,${point}})?`)
    const match = value.match(regex)

    if (match) value = `${match[1] || ''}${match[2] || ''}${match[3] || ''}`
    else value = ''

    val = value
    col.value = value
  }
  const filterRows = compoTable.value.filteredSortedRows
  if (filterRows && filterRows.length > 0) {
    const isDeptType = col.type === 'dept' || col.type === 'deptMulti'
    const valueCol = isDeptType ? col.deptCd : col.name
    const nameCol = isDeptType ? col.name : 'nothing'
    forEach(filterRows, (item) => {
      if (
        (props.checkDisableColumn ? !item[props.checkDisableColumn] : true) &&
        !(col.disableTarget && item[col.disableTarget] !== col.disableCon)
      ) {
        item[valueCol] = val
        if (isDeptType && name !== undefined) item[nameCol] = name
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
        (props.checkDisableColumn ? !item[props.checkDisableColumn] : true) &&
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
    emits('headerDataChange', bodyProps, col)
  }
}

function onDecimalInput(e: InputEvent, col: any) {
  const input = e.target as HTMLInputElement
  const point = col.point ?? 0
  const maxInteger = col.integer ?? 8

  const value = input.value

  const regex = new RegExp(`^(-?)(\\d{0,${maxInteger}})(\\.\\d{0,${point}})?`)
  const match = value.match(regex)

  if (match) {
    const result = `${match[1] || ''}${match[2] || ''}${match[3] || ''}`
    input.value = result
    col.value = result
  } else {
    input.value = ''
    col.value = ''
  }
}

/******************************
 * TODO (목적): 헤더 링크 클릭 시 emit
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function headLinkClick(bodyProps: any, col: any) {
  emits('headLinkClick', bodyProps, col, bodyProps.pageIndex)
}
/******************************
 * TODO (목적): 데이터 변경에 따른 수정자 셋팅 및 emit
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function datachange(bodyProps: any, col: any, type?: string) {
  if (bodyProps.row['editFlag'] !== 'C') {
    bodyProps.row['editFlag'] = 'U'
    bodyProps.row['chgUserId'] = user.value.userId
  }
  /** props.data 적용 */
  const others = []
  if (type === 'deptMulti' || type === 'dept') {
    others.push({
      name: col.deptCd,
      value: bodyProps.row[col.deptCd]
    })
  }

  emits('table-data-change', bodyProps, col)
}

function decimalDatachange(bodyProps: any, col: any) {
  let value = String(bodyProps.row[col.name])
  const point = col.point ?? 0
  const maxInteger = col.integer ?? 6

  if (bodyProps.row['editFlag'] !== 'C') {
    bodyProps.row['editFlag'] = 'U'
    bodyProps.row['chgUserId'] = user.value.userId
  }

  if (point || maxInteger) {
    const regex = new RegExp(`^(-?)(\\d{0,${maxInteger}})(\\.\\d{0,${point}})?`)
    const match = value.match(regex)

    if (match) {
      value = `${match[1] || ''}${match[2] || ''}${match[3] || ''}`
    } else {
      value = ''
    }

    bodyProps.row[col.name] = value
  }

  emits('table-data-change', bodyProps, col)
}

/******************************
 * TODO (목적): 파일 업로드 시
 * @param (1): 업로드 된 파일 정보
 * @param (2): 행 전체 정보
 * @return (반환):
 *******************************/
function uploadChange(data: any, bodyProps: any) {
  /**
   * F : 업로드 끝
   * R : 파일 삭제
   */
  if (bodyProps.row['editFlag'] !== 'C') {
    bodyProps.row['editFlag'] = 'U'
    bodyProps.row['chgUserId'] = user.value.userId
  }
  emits('uploadChange', data)
}
/******************************
 * TODO (목적): 콤보박스 변경 시
 * @param (1): 콤보박스 변경 정보
 * @param (2): 행 전체 정보
 * @param (3): 컬럼 정보
 *******************************/
function changeSelect(val: any, bodyProps: any, col: any) {
  bodyProps.row[col.name] = val.value

  /**
   * user 컴포넌트 사용하면서 내/외 구분에 따라 컴포넌틑 컨트롤 한다면
   * select 될때 userId의 값을 빈값처리
   */
  const userTypeCol = find(bodyProps.cols, { type: 'user' })
  if (userTypeCol && userTypeCol.isInout && col.name === userTypeCol.inoutCol) {
    //  && val.value === userTypeCol.out
    bodyProps.row[userTypeCol.userId] = null
    bodyProps.row[userTypeCol.field] = null

    /**
     * 2021.08.24 kdh
     * 사용자뿐만 아니라 관련있는 항목도 null처리
     * relationCols (Array) 를 통해 처리
     */
    if (userTypeCol.relationCols && userTypeCol.relationCols.length > 0) {
      forEach(userTypeCol.relationCols, (item) => {
        bodyProps.row[item] = null
      })
    }
  }
  if (bodyProps.row['editFlag'] !== 'C') {
    bodyProps.row['editFlag'] = 'U'
    bodyProps.row['chgUserId'] = user.value.userId
  }
  emits('table-data-change', bodyProps, col)
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
function innerBtnClicked(col: any, bodyProps: any, btn?: any) {
  isInnerBtnClick.value = true
  setTimeout(() => {
    isInnerBtnClick.value = false
  }, 100)
  emits('innerBtnClicked', col, bodyProps, btn)
}
/******************************
 * TODO (목적): proxy에서 반환 하는 값 전달
 * @param (1): proxy에서 반환하는 값
 * @param (2): 행 전체 정보
 * @param (3): 컬럼 정보
 * @return (반환):
 *******************************/
function callbackProxy(data: any, bodyProps: any, col: any) {
  emits('callbackProxy', data, bodyProps, col)
  proxyColumns.value![bodyProps.rowIndex].hide()
}
// /******************************
//  * TODO (목적): color class 반환 (type tag 인 경우)
//  * @param (1): 컬럼 정보
//  * @param (2): 데이터 정보
//  * @return (반환): color class
//  *******************************/
// function setTagColor(col: any, data: any) {
//   if (col.colorItems) {
//     const color =
//       find(col.colorItems, { code: data }) || find(col.colorItems, { stepperMstCd: data })
//     return color ? color.attrVal1 || color.colorClass : ''
//   } else {
//     return ''
//   }
// }
// /******************************
//  * TODO (목적): 이름 반환 (type tag 인 경우)
//  * @param (1): 컬럼 정보
//  * @param (2): 데이터 정보
//  * @return (반환): tag 이름
//  *******************************/
// function setTagName(col: any, data: any) {
//   if (col.colorItems) {
//     const color =
//       find(col.colorItems, { code: data }) || find(col.colorItems, { stepperMstCd: data })
//     return color ? color.codeName || color.stepperMstNm : ''
//   } else {
//     return ''
//   }
// }
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
        const styleStr = arrangColumns.value[i].style || ''
        // 숫자(소수점 포함) 부분만 매칭하여 추출
        const match = styleStr.match(/\d+(\.\d+)?/)
        const _left = match ? match[0] : '0'
        left += !Number.isNaN(Number(_left)) ? Number(_left) : 0
      }
    }
    returnText += ';position: sticky;background-color: #EEF2FD;z-index: 3;left:' + left + 'px;'
  }
  return returnText
}
/******************************
 * TODO (목적): 엑셀 다운로드 시 필요로 하는 텍스트 값 변환
 * @param (1): 데이터 정보
 * @param (2): 컬럼 정보
 * @return (반환): 변환된 텍스트
 *******************************/
function setTdText(item: any, col: any) {
  let text = item[col.name] ? item[col.name] : ''
  if (text && indexOf(['number', 'cost', 'cost2'], col.type) > -1) {
    text = toThousandFilter(text)
  } else if (text && indexOf(['select', 'radio', 'multiSelect'], col.type) > -1) {
    const itemText = col.itemText ? col.itemText : 'codeName'
    const itemValue = col.itemValue ? col.itemValue : 'code'
    const valueKey = col.valueKey ? col.valueKey : 'code'
    let colData = null
    if (col.type !== 'multiSelect') {
      colData = find(col.comboItems, (comboItem) => {
        return comboItem[itemValue] === text
      })

      if (colData) {
        text = colData[itemText]
      } else {
        text = ''
      }
    } else {
      colData = filter(col.comboItems, (comboItem) => {
        return (
          findIndex(text, (val: any) => {
            return val[valueKey] === comboItem[itemValue]
          }) > -1
        )
      })

      if (colData) {
        text = map(colData, itemText).toString()
      } else {
        text = ''
      }
    }
  } else if (col.type === 'plant') {
    if (plantItems.value && plantItems.value.length > 0) {
      const plant = find(plantItems.value, { code: item[col.name] })
      if (plant) {
        text = '사업장1'
      } else {
        text = ''
      }
    } else {
      text = ''
    }
  } else {
    text =
      text && isNaN(text)
        ? text.replace(/(?:\r\n|\n\r|\r|\n)/g, '<br style="mso-data-placement:same-cell;" />')
        : text
  }
  return text
}
/******************************
 * TODO (목적): 테이블(html) to 엑셀(html)
 *******************************/
function downloadExcelHtml() {
  const table = compoTable.value.$el.getElementsByTagName('table')[0]
  const exportTable = document.createElement('table')
  const alignCenter = 'text-align: center !important;'
  const alignLeft = 'text-align: left !important;'
  const alignRight = 'text-align: right !important;'
  /** ####################################################################### */
  /** ############################## HEADER ################################# */
  /** ####################################################################### */
  const exportTHeader = document.createElement('thead')
  // 마지막 tr은 제외처리
  const headers = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')
  const thStyle =
    'background: #EEEEEE; color: #000; font-weight: 350; font-size: 0.8rem; padding: 6px 4px !important;border: 1px solid #D9D9D9;'
  const thFirstStyle = 'border-top: 2px solid #1ab394 !important; top: 0;'
  exportTHeader.appendChild(document.createElement('tr'))
  for (let i = 0; i < headers.length; i++) {
    const exportTr = document.createElement('tr')
    const ths = headers[i].getElementsByTagName('th')
    for (let j = 0; j < ths.length; j++) {
      if (ths[j].className.includes('checkbox-th')) continue // 체크박스열 제거
      const exportTh = document.createElement('th')
      exportTh.style.cssText = ths[j].style.cssText + thStyle + (i === 0 ? thFirstStyle : '')
      exportTh.innerText = replace(
        replace(ths[j].getElementsByTagName('span')[0].textContent, 'arrow_upward', ''),
        'arrow_drop_down',
        ''
      )
      // exportTh.innerText = replace(replace(ths[j].textContent, 'arrow_upward', ''), 'arrow_drop_down', '')
      // exportTh.colspan = arrangColumns.value[j].colspan ? arrangColumns.value[j].colspan : 1
      exportTh.setAttribute(
        'colSpan',
        ths[j].getAttribute('colSpan') ? ths[j].getAttribute('colSpan') : 1
      )
      exportTh.setAttribute(
        'rowSpan',
        ths[j].getAttribute('rowSpan') ? ths[j].getAttribute('rowSpan') : 1
      )
      exportTr.appendChild(exportTh)
    }
    exportTHeader.appendChild(exportTr)
  }
  exportTable.appendChild(exportTHeader)

  /** ####################################################################### */
  /** ################################ BODY ################################# */
  /** ####################################################################### */
  const tdStyle = ';border: 1px solid #D9D9D9;font-size: 0.8rem;color: #616161;'
  const exportTBody = document.createElement('tbody')
  if (compoTable.value.filteredSortedRows && compoTable.value.filteredSortedRows.length > 0) {
    compoTable.value.filteredSortedRows.forEach((item: any) => {
      const exportTr = document.createElement('tr')
      forEach(arrangColumns.value, (col) => {
        // 보이는 컬럼들만 데이터 적용
        if (indexOf(visibleColumns.value, col.name) > -1) {
          const exportTd = document.createElement('td')
          exportTd.style.cssText =
            col.style +
            tdStyle +
            (col.align === 'left' ? alignLeft : col.align === 'right' ? alignRight : alignCenter)
          exportTd.innerHTML = setTdText(item, col)
          // exportTd.innerText = this.setTdText(item, col)
          exportTr.appendChild(exportTd)
        }
      })
      exportTBody.appendChild(exportTr)
    })
    exportTable.appendChild(exportTBody)
  }

  // xlsx 파일 (style 미적용)
  // let wb = XLSX.utils.book_new();
  // let newWorksheet = XLSX.utils.table_to_sheet(exportTable);
  // XLSX.utils.book_append_sheet(wb, newWorksheet, 'Sheet');
  // XLSX.writeFile(wb, this.$language(title) + '-' + this.moment().format('YYYYMMDD') + '.xlsx');

  // xls 파일 (style적용)
  exportExcel(exportTable)
}
/******************************
 * TODO (목적): 엑셀 다운로드
 * @param (1): 테이블(html) 정보
 *******************************/
function exportExcel(table: HTMLTableElement) {
  const styles = ''

  const ctx = { worksheet: 'sheet', table: table.innerHTML }
  const template =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<meta http-equiv="content-type" content="text/plain; charset=UTF-8">' +
    '<head><!--[if gte mso 9]>' +
    '<xml><x:ExcelWorkbook>' +
    '<x:ExcelWorksheets>' +
    '<x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>' +
    '</x:ExcelWorksheets>' +
    '</x:ExcelWorkbook>' +
    '</xml><![endif]-->' +
    styles +
    '</head><body>' +
    '<table>{table}</table>' +
    '</body></html>'

  const uri = 'data:application/vnd.ms-excel;base64,'
  const base64 = function (s: any) {
    return window.btoa(unescape(encodeURIComponent(s)))
  }
  const format = function (s: any, c: any) {
    return s.replace(/{(\w+)}/g, function (m: any, p: any) {
      return c[p]
    })
  }
  const link = document.createElement('a')
  link.href = uri + base64(format(template, ctx))
  link.download = $language(props.title) + '-' + getTodayNone() + '.xls'
  link.click()
}
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function tdClick(props: any, col: any, self) {
//   if (!props.checkClickFlag) return
//   let rowspan = 0
//   let target = self.target
//   if (target.localName === 'span') {
//     target = target.offsetParent
//   }
//   rowspan = target.getAttribute('rowspan') ? target.getAttribute('rowspan') : 0
//   /**
//    * selection이 있는 경우 실행 selected rowKey
//    *
//    * selected check
//    */
//   if (check(col.type) || col.type === 'html') {
//     if (props.selection === 'multiple') {
//       const data = compoTable.value.filteredSortedRows;
//       let filterData = []
//       if (rowspan > 0) {
//         filterData = filter(data, (item) => {
//           return item[col.name] === props.row[col.name]
//         })
//       } else {
//         filterData = filter(data, (item) => {
//           return item[props.rowKey] === props.row[props.rowKey]
//         })
//       }
//       if (filterData && filterData.length > 0) {
//         forEach(filterData, (item) => {
//           if (
//             findIndex(selected.value, (selectItem) => {
//               return selectItem[props.rowKey] === item[props.rowKey]
//             }) === -1
//           ) {
//             selected.value.push(item)
//           }
//         })
//       }
//     } else if (props.selection === 'single') {
//       const data = compoTable.value.filteredSortedRows;
//       selected.value = filter(data, (item) => {
//         return item[props.rowKey] === props.row[props.rowKey]
//       })
//     }
//   }
// }
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function tdRightClick(props, col) {
//   if (!props.checkClickFlag) return
//   /**
//    * selection이 있는 경우 실행 selected rowKey
//    *
//    * selected uncheck
//    */
//   if (this.check(col.type)) {
//     if (props.selection === 'multiple' || props.selection === 'single') {
//       const data = compoTable.value.filteredSortedRows;
//       const filterData = filter(data, item => {
//         return item[col.name] === props.row[col.name]
//       })
//       if (filterData && filterData.length > 0) {
//         forEach(filterData, (item) => {
//           if (
//             findIndex(selected.value, (selectItem) => {
//               return selectItem[props.rowKey] === item[props.rowKey]
//             }) > -1
//           ) {
//             selected.value = reject(selected.value, item)
//             // this.$set(selected.value, item, )
//           }
//         })
//       }
//     }
//   }
// }
/******************************
 * TODO (목적): datepicker time 옵션 설정
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 * @return (반환): datepicker time 옵션
 *******************************/
function setTimePickerOptions(bodyProps: any, col: any) {
  if (
    col.type === 'datetime' &&
    props.tableTimePickerOptions &&
    props.tableTimePickerOptions.start &&
    col.name === props.tableTimePickerOptions.colName
  ) {
    const stepSplit = split(props.tableTimePickerOptions.step, ':')
    const curStart =
      bodyProps.rowIndex > 0
        ? props.data![bodyProps.rowIndex - 1][col.name]
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
 * TODO (목적): 파일 다운로드
 * @param (1): 파일 정보
 *******************************/
function fileDown(file: any) {
  const accept = getAccept(file.fileExt)
  $http({
    url: fileDownUrl.value,
    method: 'GET',
    params: {
      sysAttachFileId: encrypt(file.sysAttachFileId)
    }
  }).then((_result: any) => {
    const fileInfo = fileDownDecrypt(_result.data)
    if (fileInfo.id === file.sysAttachFileId) {
      const blob = base64ToBlob(fileInfo.bytes, accept)
      const nav = window.navigator as any
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, file.oriFileNm)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = file.oriFileNm
        link.click()
      }
    } else {
      message.alert({
        title: '안내',
        message: '잘못된 정보입니다.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}
/******************************
 * TODO (목적): 미리보기 셋팅
 * @param (1): 파일 정보
 *******************************/
function setPreview(file: any) {
  if (!file) return
  // 이미지인  경우
  if (file.sysAttachFileId) {
    $http({
      url: previewUrl.value,
      method: 'GET',
      params: {
        sysAttachFileId: encrypt(file.sysAttachFileId)
      }
    }).then((_result: any) => {
      const fileInfo = fileDownDecrypt(_result.data)
      if (fileInfo.id === file.sysAttachFileId) {
        preview.value.isShow = true
        preview.value.sysAttachFileId = file.sysAttachFileId
        preview.value.src = 'data:' + file.contentType + ';base64,' + fileInfo.bytes
        preview.value.oriFileNm = file.oriFileNm
        preview.value.fileSize = file.fileSize
        preview.value.fileExt = file.fileExt
      } else {
        message.alert({
          title: '안내',
          message: '잘못된 정보입니다.',
          type: 'error' // success / info / warning / error
        })
      }
    })
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
    text += 'background-color: #e6f4fc;'
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
        const styleStr = arrangColumns.value[i].style || ''
        // 숫자(소수점 포함) 부분만 매칭하여 추출
        const match = styleStr.match(/\d+(\.\d+)?/)
        const _left = match ? match[0] : '0'
        left += !Number.isNaN(Number(_left)) ? Number(_left) : 0
      }
    }
    text += ';position: sticky;background-color: #f7f7f7;z-index: 1;left:' + left + 'px;'
  }
  return text
}
/******************************
 * TODO (목적): 업로드 재조회 셋팅
 * @param (1): 행 정보
 * @param (2): 업로드 할 컬럼 정보
 *******************************/
function uploadResearchSetting(row: any, uploadCols: any) {
  if (uploadCols && uploadCols.length > 0) {
    uploadResearchObj.value = {
      row: row,
      uploadCols: uploadCols
    }
  }
}
/******************************
 * TODO (목적): 업로드 재조회
 *******************************/
function uploadResearch() {
  if (
    uploadResearchObj.value &&
    uploadResearchObj.value.uploadCols &&
    uploadResearchObj.value.uploadCols.length > 0
  ) {
    forEach(uploadResearchObj.value.uploadCols, (col) => {
      uploadResearchObj.value.row[`uprecol_${col}`] = uid()
    })
  }
}
/******************************
 * TODO (목적): 다시 그리기
 *******************************/
function reRend() {
  tableKey.value = uid()
}
/******************************
 * TODO (목적): task-target component에서 사용될 custom popup param 전달
 * @param (1): type (설비, 시설, 업체)
 * @return (반환): custom popup param
 *******************************/
function getCustomPopupParam(type: 'vendor' | 'facility' | 'equip') {
  /** default 설비 */
  let param = {
    targetKey: 'equip',
    param: {
      type: 'single'
    }
  }
  if (type === 'facility') {
    param = {
      targetKey: 'facility',
      param: {
        type: 'single'
      }
    }
  } else if (type === 'vendor') {
    param = {
      targetKey: 'vendor',
      param: {
        type: 'single'
      }
    }
  }
  return param
}
/******************************
 * TODO (목적): 업무 정보 변경에 따른 처리
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 * @param (3): 업무 정보
 *******************************/
function taskChange(bodyProps: any, col: any, task: any) {
  if (col.type === 'vendor') {
    const vendorName =
      col.vendorInfo && col.vendorInfo.vendorName ? col.vendorInfo.vendorName : 'vendorName'
    const address = col.vendorInfo && col.vendorInfo.address ? col.vendorInfo.address : 'address'
    const bizNo = col.vendorInfo && col.vendorInfo.bizNo ? col.vendorInfo.bizNo : 'bizNo'
    const chargeName =
      col.vendorInfo && col.vendorInfo.chargeName ? col.vendorInfo.chargeName : 'chargeName'
    const phoneNo = col.vendorInfo && col.vendorInfo.phoneNo ? col.vendorInfo.phoneNo : 'phoneNo'
    bodyProps.row[vendorName] = task.vendorName
    bodyProps.row[address] = task.address
    bodyProps.row[bizNo] = task.bizNo.includes('-') ? task.bizNo : toBizNum(task.bizNo)
    bodyProps.row[chargeName] = task.chargeName
    bodyProps.row[phoneNo] = task.phoneNo
  } else if (col.type === 'facility') {
    const facilityName =
      col.facilityInfo && col.facilityInfo.facilityName
        ? col.facilityInfo.facilityName
        : 'facilityName'
    bodyProps.row[facilityName] = task.facilityName
  } else if (col.type === 'equip') {
    const equipName =
      col.equipInfo && col.equipInfo.equipmentName ? col.equipInfo.equipmentName : 'equipmentName'
    const equipNo =
      col.equipInfo && col.equipInfo.equipmentNo ? col.equipInfo.equipmentNo : 'equipmentNo'
    bodyProps.row[equipName] = task.equipmentName
    bodyProps.row[equipNo] = task.equipmentNo
  }
  if (bodyProps.row['editFlag'] !== 'C') {
    bodyProps.row['editFlag'] = 'U'
    bodyProps.row['chgUserId'] = user.value.userId
  }
  emits('table-data-change', bodyProps, col)
}
function addManager(_row: any) {
  if (_row['editFlag'] !== 'C') {
    _row['editFlag'] = 'U'
    _row['chgUserId'] = user.value.userId
  }
  emits('addTag', _row)
}
function removeManager(_row: any, item: any) {
  if (_row['editFlag'] !== 'C') {
    _row['editFlag'] = 'U'
    _row['chgUserId'] = user.value.userId
  }
  emits('removeTag', _row, item)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({
  compoTable,
  getSelected,
  uploadResearchSetting,
  uploadResearch,
  reRend,
  setSelected
})
</script>
<style scoped>
.default-table tbody .q-tr [rowspan] {
  vertical-align: top;
}
.tdBackGroundColor {
  display: inline-block;
  width: 30px;
  height: 25px;
  background: #26a69a;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  padding-top: 2px;
}
.tdBackGroundColorNone {
  display: inline-block;
  width: 30px;
  height: 25px;
  background: #e4e4e4;
  border-radius: 10px;
  font-weight: 700;
  padding-top: 2px;
  opacity: 0.5;
}
.tooltipCustom,
.tooltipCustomTop {
  font-size: 1.2em !important;
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
    /* z-index: -1; */
    /* top: 35px; */
  }
}
</style>
<style lang="sass">
.helpcomment-table
  .q-table
    td
      white-space: pre-line !important
    tbody
      tr:nth-child(even)
        background-color: rgba(0, 0, 0, 0.02)
  .q-table__top
    color: yellow !important
    background: rgb(29, 29, 29) !important
    .q-table__title
      font-size: 13px !important
      font-weight: 500 !important
</style>

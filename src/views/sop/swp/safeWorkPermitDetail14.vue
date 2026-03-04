<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-12">
          <c-card
            title="1. 안전작업 개요 및 기본정보"
            class="cardClassDetailForm work-card"
            :noMarginPadding="true"
          >
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="!isOld"
                  label="기존 작업허가서 불러오기"
                  icon="system_update_alt"
                  @btnClicked="loadWorkPermit"
                />
                <c-btn
                  v-show="
                    editable &&
                    workPermit.sopWorkPermitId &&
                    workPermit.swpStepCd !== 'SSC00000001' &&
                    workPermit.swpStepCd !== 'SSC00000020'
                  "
                  label="작업위치(지도)"
                  icon="map"
                  @btnClicked="loadWorkPermitLocation"
                />
                <!-- <c-btn
                  v-show="editable"
                  label="작업위치(지도)"
                  icon="send"
                  @btnClicked="loadWorkPermitLocation"
                /> -->
                <c-btn
                  v-show="editable && !disabled && isOld && isWriting && !fromApproval"
                  :isSubmit="isReqApproval"
                  :url="saveUrl"
                  :param="workPermit"
                  :mappingType="mappingType"
                  label="검토요청"
                  icon="send"
                  @beforeAction="saveWorkPermit('reqApproval')"
                  @btnCallback="saveWorkPermitCallback"
                />
                <c-btn
                  v-show="editable && !disabled && isReviewing && fromApproval"
                  :isSubmit="isApproval"
                  :url="saveUrl"
                  :param="workPermit"
                  :mappingType="mappingType"
                  label="작업승인"
                  icon="approval"
                  @beforeAction="saveWorkPermit('approval')"
                  @btnCallback="saveWorkPermitCallback"
                />
                <c-btn
                  v-show="editable && !disabled && isReviewing && fromApproval"
                  label="작업반려"
                  icon="front_hand"
                  color="red-3"
                  @btnClicked="returnDialogOpen"
                />
                <c-btn
                  v-show="editable && !disabled && isReviewing && fromApproval"
                  :isSubmit="isCancel"
                  :url="saveUrl"
                  :param="workPermit"
                  :mappingType="mappingType"
                  label="작업취소"
                  icon="delete_forever"
                  @beforeAction="saveWorkPermit('cancel')"
                  @btnCallback="saveWorkPermitCallback"
                />
                <c-btn
                  v-show="editable && isWriting && isOld && !fromApproval"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeWorkPermit"
                />
                <c-btn
                  v-show="editable && !disabled && !isReviewing && !fromApproval"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="workPermit"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveWorkPermit('save')"
                  @btnCallback="saveWorkPermitCallback"
                />
                <c-btn v-show="isWorking" label="출력" icon="print" @btnClicked="printWorkPermit" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="false"
                  label="작업허가번호"
                  name="permitNo"
                  v-model:value="workPermit.permitNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-radio
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  codeGroupCd="SOP_PERMIT_TYPE_CD"
                  label="작업구분"
                  name="permitTypeCd"
                  v-model:value="workPermit.permitTypeCd"
                />
              </div>
              <div
                v-if="workPermit.permitTypeCd === 'SPT0000005'"
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
              >
                <c-text
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="⨠ 긴급작업사유"
                  name="emergencyWorkReason"
                  v-model:value="workPermit.emergencyWorkReason"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="작업명"
                  name="workName"
                  v-model:value="workPermit.workName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="작업신청자"
                  name="applicationUserId"
                  v-model:value="workPermit.applicationUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-field
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="작업감독자"
                  name="workManagerId"
                  v-model:value="workPermit.workManagerId"
                  @userInfo="(val: any) => (workPermit.workManagerNo = val.mobileNo)"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  mask="###-####-####"
                  label="작업감독자 연락처"
                  name="workManagerNo"
                  v-model:value="workPermit.workManagerNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  type="search"
                  :editable="editable"
                  :disabled="disabled"
                  :isFirstValue="false"
                  label="작업수행부서"
                  name="workDeptCd"
                  v-model:value="workPermit.workDeptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  :editable="editable"
                  :disabled="disabled"
                  label="작업허가부서 승인자"
                  name="issuedUserId"
                  v-model:value="workPermit.issuedUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-dept
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  type="search"
                  :isFirstValue="false"
                  label="작업허가부서"
                  name="issuedDeptCd"
                  v-model:value="workPermit.issuedDeptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-text
                  :editable="editable && !disabled"
                  mask="###-####-####"
                  label="작업허가부서 연락처"
                  name="issuedDeptNo"
                  v-model:value="workPermit.issuedDeptNo"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  :editable="editable"
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="workPermit.plantCd"
                  type="search"
                  label="공정"
                  name="processCd"
                  v-model:value="workPermit.processCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  :range="true"
                  :minuteStep="30"
                  type="datetime"
                  label="작업일시"
                  name="workTime"
                  v-model:value="workPermit.workTime"
                />
              </div> -->
              <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                <c-datepicker
                  :required="true"
                  :disabled="!isWriting"
                  :editable="editable"
                  label="허가작업일"
                  name="permitDate"
                  v-model:value="workPermit.permitDate"
                />
              </div>
              <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                <c-datepicker
                  :required="true"
                  :disabled="!isWriting"
                  :editable="editable"
                  :range="true"
                  :minuteStep="30"
                  type="time"
                  label="작업시간"
                  name="workTime"
                  v-model:value="workPermit.workTime"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="작업장소"
                  name="workLocation"
                  v-model:value="workPermit.workLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="작업설비"
                  name="workEquipment"
                  v-model:value="workPermit.workEquipment"
                />
              </div>
              <div
                v-if="workPermit.permitTypeCd !== 'SPT0000010'"
                class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
              >
                <c-task-target
                  :editable="editable && !disabled"
                  label="협력회사"
                  :customPopupParam="{ targetKey: 'vendor' }"
                  name="vendorCd"
                  v-model:value="workPermit.vendorCd"
                />
              </div>
              <div
                v-if="workPermit.permitTypeCd !== 'SPT0000010'"
                class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"
              >
                <c-text
                  :editable="editable && !disabled"
                  label="협력사 감독자명"
                  name="vendorUserCd"
                  v-model:value="workPermit.vendorUserCd"
                />
              </div>
              <div
                v-if="workPermit.permitTypeCd !== 'SPT0000010'"
                class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"
              >
                <c-text
                  :editable="editable && !disabled"
                  mask="###-####-####"
                  label="협력사 감독자 연락처"
                  name="vendorManagerNo"
                  v-model:value="workPermit.vendorManagerNo"
                />
              </div>
              <div
                v-if="workPermit.permitTypeCd !== 'SPT0000010'"
                class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
              >
                <c-text-number
                  :editable="editable"
                  :disabled="disabled"
                  label="작업감독자(자체감독자) 외 작업인원"
                  suffix="명"
                  name="workCount"
                  v-model:value="workPermit.workCount"
                />
              </div>
              <div
                v-if="workPermit.returnRemark"
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
              >
                <c-text
                  :editable="false"
                  :disabled="true"
                  label="반려사유"
                  name="returnRemark"
                  v-model:value="workPermit.returnRemark"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <c-card
            title="2. 작업정보(작업수행부서)"
            class="cardClassDetailForm work-card"
            :noMarginPadding="true"
          >
            <template v-slot:card-detail>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="취급물질명"
                  name="handleMaterialName"
                  v-model:value="workPermit.handleMaterialName"
                />
              </div>
              <div class="col-12">
                <q-markup-table class="full-width work-permit-table" style="overflow: hidden">
                  <thead>
                    <tr>
                      <th
                        colspan="7"
                        style="font-size: 1em; font-weight: 700"
                        class="text-center th-style text-default"
                      >
                        유해/위험성
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td width="15%">
                        <c-radio
                          :required="true"
                          :editable="editable"
                          :disabled="disabled"
                          :comboItems="[
                            { label: '60도 이상', value: 'Y' },
                            { label: '60도 이하', value: 'N' }
                          ]"
                          itemText="label"
                          itemValue="value"
                          label="설비 표면 또는 작업구간 온도"
                          name="surfaceTempYn"
                          v-model:value="workPermit.surfaceTempYn"
                        />
                      </td>
                      <td width="15%">
                        <c-radio
                          :required="true"
                          :editable="editable"
                          :disabled="disabled"
                          :comboItems="existCheckOption"
                          itemText="label"
                          itemValue="value"
                          label="작업 중 추락의 위험성"
                          name="hazardousChemYn"
                          v-model:value="workPermit.hazardousChemYn"
                        />
                      </td>
                      <td width="15%">
                        <c-radio
                          :required="true"
                          :editable="editable"
                          :disabled="disabled"
                          :comboItems="existCheckOption"
                          itemText="label"
                          itemValue="value"
                          label="산소결핍 또는 유해가스의 위험성"
                          name="confinedSpaceYn"
                          v-model:value="workPermit.confinedSpaceYn"
                        />
                      </td>
                      <td width="15%">
                        <c-radio
                          :required="true"
                          :editable="editable"
                          :disabled="disabled"
                          :comboItems="existCheckOption"
                          itemText="label"
                          itemValue="value"
                          label="유해위험물질 유출 또는 잔존 가능성"
                          name="highPlaceYn"
                          v-model:value="workPermit.highPlaceYn"
                        />
                      </td>
                      <td width="15%">
                        <c-radio
                          :required="true"
                          :editable="editable"
                          :disabled="disabled"
                          :comboItems="existCheckOption"
                          itemText="label"
                          itemValue="value"
                          label="정전 작업 시 감전 가능성"
                          name="electricalWorkYn"
                          v-model:value="workPermit.electricalWorkYn"
                        />
                      </td>
                      <td>
                        <c-radio
                          :required="true"
                          :editable="editable"
                          :disabled="disabled"
                          :comboItems="existCheckOption"
                          itemText="label"
                          itemValue="value"
                          label="기타 위험성"
                          name="etcHazardousYn"
                          v-model:value="workPermit.etcHazardousYn"
                        />
                      </td>
                      <td>
                        <c-text
                          :required="workPermit.etcHazardousYn === 'Y'"
                          :editable="workPermit.etcHazardousYn === 'Y'"
                          :disabled="disabled"
                          placeholder="기타 위험성 있는 경우 작성"
                          name="etcHazardousReason"
                          v-model:value="workPermit.etcHazardousReason"
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <q-space />
              <div class="col-12">
                <c-table
                  title="안전보호구"
                  :columns="gearGrid.columns"
                  :data="gearGrid.data"
                  :merge="gearGrid.merge"
                  gridHeightAuto
                  :filtering="false"
                  :columnSetting="false"
                  :usePaging="false"
                  :fullscreen="false"
                  :isExcelDown="false"
                  :hide-bottom="true"
                  :no-data-label="true"
                  :editable="editable && isWriting"
                >
                  <template v-slot:customArea="{ props, col }">
                    <q-checkbox
                      dense
                      class="tableCheckBox"
                      :editable="editable"
                      :disabled="disabled"
                      :isFlag="true"
                      :true-value="'Y'"
                      :false-value="'N'"
                      :name="col.name"
                      v-model="props.row[col.name]"
                      @update:model-value="() => datachange(props, col)"
                    />
                  </template>
                </c-table>
              </div>
              <div class="col-12">
                <c-textarea
                  :rows="2"
                  :editable="editable && isWriting"
                  :disabled="disabled"
                  :required="true"
                  label="작업내용"
                  name="workSummary"
                  v-model:value="workPermit.workSummary"
                />
              </div>
              <!-- <div class="col-12" v-if="workPermit.permitTypeCd === 'SPT0000010'">
                <c-radio
                  :comboItems="[
                    { label: '해당', value: 'Y' },
                    { label: '해당없음', value: 'N' }
                  ]"
                  :disabled="disabled"
                  itemText="label"
                  itemValue="value"
                  label="변경관리 해당여부"
                  name="mocCheckYn"
                  v-model:value="workPermit.mocCheckYn"
                />
              </div>
              <div class="col-12" v-if="workPermit.permitTypeCd === 'SPT0000010'">
                <c-radio
                  :comboItems="[
                    { label: '해당', value: 'Y' },
                    { label: '해당없음', value: 'N' }
                  ]"
                  :disabled="disabled"
                  itemText="label"
                  itemValue="value"
                  label="가동전 점검 대상 여부"
                  name="preWorkCheckYn"
                  v-model:value="workPermit.preWorkCheckYn"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :comboItems="permitTypeItems"
                  type="edit"
                  :editable="editable"
                  :disabled="disabled"
                  :default="1"
                  :required="true"
                  itemText="codeName"
                  itemValue="code"
                  name="swpWorkPermitTypeCd"
                  label="작업허가서분류"
                  v-model:value="workPermit.swpWorkPermitTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
                <div class="q-gutter-sm row">
                  <q-checkbox
                    v-for="(item, index) in supplementWorkTypeItems"
                    :key="index"
                    v-model="swpSupplementWorkTypeCdArray"
                    :val="item.code"
                    :disable="disabled || !editable"
                    dense
                    color="primary"
                  >
                    {{ item.codeName }}
                    <q-icon name="info" color="primary" size="sm" class="q-ml-sm cursor-pointer">
                      <q-tooltip
                        ><span style="font-size: 14px" class="cursor-pointer">{{
                          getSupTooltip(item.code)
                        }}</span></q-tooltip
                      >
                    </q-icon>
                  </q-checkbox>
                </div>
              </div>
              <div class="col-12">
                <c-table
                  title="작업수행부서 안전조치 및 작업준비"
                  :columns="workCheckGridColumns"
                  :data="workCheckGridData"
                  :merge="checkGrid.merge"
                  gridHeightAuto
                  :filtering="false"
                  :columnSetting="false"
                  :usePaging="false"
                  :fullscreen="false"
                  :isExcelDown="false"
                  :hide-bottom="true"
                  :no-data-label="true"
                  :editable="editable && isWriting"
                >
                  <template v-slot:suffixTitle>
                    <span class="text-electric" style="font-size: 0.9em; font-weight: 600">
                      ※ {{ $language('해당 없을 경우 체크를 해지할 것') }}
                    </span>
                  </template>
                  <template v-slot:customArea="{ props, col }">
                    <template v-if="col.name === 'workCheckYn'">
                      <q-checkbox
                        dense
                        class="tableCheckBox"
                        :editable="editable"
                        :disabled="disabled || isCommonChecklistItem(props.row)"
                        :isFlag="true"
                        :true-value="'Y'"
                        :false-value="'N'"
                        :name="col.name"
                        v-model="props.row[col.name]"
                        @update:model-value="() => datachange(props, col)"
                      />
                    </template>
                  </template>
                </c-table>
              </div>
              <div class="col-12">
                <c-radio
                  :comboItems="[
                    { label: '해당', value: 'Y' },
                    { label: '해당없음', value: 'N' }
                  ]"
                  :required="true"
                  :editable="editable && !disabled"
                  itemText="label"
                  itemValue="value"
                  label="가스측정여부"
                  name="gasCheckYn"
                  v-model:value="workPermit.gasCheckYn"
                />
              </div>
              <div class="col-12" v-if="workPermit.gasCheckYn === 'Y'">
                <c-checkbox
                  :isArray="false"
                  :required="workPermit.gasCheckYn === 'Y'"
                  :editable="editable && !disabled"
                  :comboItems="gasItems"
                  itemText="gasName"
                  itemValue="sopGasId"
                  label="가스측정대상"
                  name="gasCheckItems"
                  v-model:value="workPermit.gasCheckItems"
                />
              </div>
              <div class="col-12">
                <c-radio
                  :comboItems="[
                    { label: '해당', value: 'Y' },
                    { label: '해당없음', value: 'N' }
                  ]"
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  itemText="label"
                  itemValue="value"
                  label="에너지원 차단여부"
                  name="energyBlockYn"
                  v-model:value="workPermit.energyBlockYn"
                />
              </div>
              <div class="col-12">
                <c-radio
                  :comboItems="[
                    { label: '보유', value: 'Y' },
                    { label: '미보유', value: 'N' }
                  ]"
                  :disabled="disabled"
                  itemText="label"
                  itemValue="value"
                  label="작업지도서 보유여부"
                  name="workDrillBookYn"
                  v-model:value="workPermit.workDrillBookYn"
                />
              </div>
              <div class="col-12">
                <c-upload
                  ref="uploader"
                  :attachInfo="attachInfo"
                  :editable="editable && isWriting && !disabled"
                  label="작업위험성평가(Excel) / 기타 첨부파일"
                  @files="(files: fileType[]) => (fileList = files)"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :rows="2"
                  :editable="editable && isWriting"
                  :disabled="disabled"
                  label="검토의견(작업수행부서)"
                  name="workReviewComment"
                  v-model:value="workPermit.workReviewComment"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
      <div class="row" v-if="fromApproval || workPermit.permitTypeCd === 'SPT0000005'">
        <div class="col-12">
          <c-card
            title="3. 작업정보(작업허가부서)"
            class="cardClassDetailForm work-card"
            :noMarginPadding="true"
          >
            <template v-slot:card-detail>
              <div class="col-12">
                <!-- <div class="col-12">
                  <c-radio
                    :comboItems="[
                      { label: '해당', value: 'Y' },
                      { label: '해당없음', value: 'N' }
                    ]"
                    :disabled="disabled"
                    itemText="label"
                    itemValue="value"
                    label="변경관리 해당여부"
                    name="mocCheckYn"
                    v-model:value="workPermit.mocCheckYn"
                  />
                </div>
                <div class="col-12">
                  <c-radio
                    :comboItems="[
                      { label: '해당', value: 'Y' },
                      { label: '해당없음', value: 'N' }
                    ]"
                    :disabled="disabled"
                    itemText="label"
                    itemValue="value"
                    label="가동전 점검 대상 여부"
                    name="preWorkCheckYn"
                    v-model:value="workPermit.preWorkCheckYn"
                  />
                </div> -->
                <div class="col-12">
                  <c-table
                    title="작업허가부서 안전조치 및 작업준비"
                    :columns="permitCheckGridColumns"
                    :data="permitCheckGridData"
                    :merge="checkGrid.merge"
                    gridHeightAuto
                    :filtering="false"
                    :columnSetting="false"
                    :usePaging="false"
                    :fullscreen="false"
                    :isExcelDown="false"
                    :hide-bottom="true"
                    :no-data-label="true"
                    :editable="editable && isWriting"
                  >
                    <template v-slot:suffixTitle>
                      <span class="text-electric" style="font-size: 0.9em; font-weight: 600">
                        ※ {{ $language('해당 없을 경우 체크를 해지할 것') }}
                      </span>
                    </template>
                    <template v-slot:customArea="{ props, col }">
                      <template v-if="col.name === 'permitCheckYn'">
                        <q-checkbox
                          dense
                          class="tableCheckBox"
                          :editable="editable"
                          :disabled="disabled || isCommonChecklistItem(props.row)"
                          :isFlag="true"
                          :true-value="'Y'"
                          :false-value="'N'"
                          :name="col.name"
                          v-model="props.row[col.name]"
                          @update:model-value="() => datachange(props, col)"
                        />
                      </template>
                    </template>
                  </c-table>
                </div>
              </div>
              <div class="col-12">
                <c-textarea
                  :rows="2"
                  :editable="editable && isReviewing"
                  :disabled="disabled"
                  label="검토의견(확인)"
                  name="permitReviewComment"
                  v-model:value="workPermit.permitReviewComment"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <q-dialog v-model="returnDialog.show" persistent>
      <q-card style="min-width: 450px">
        <q-form ref="editForm2">
          <c-card title="반려 사유" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  :isSubmit="isReturn"
                  :url="saveUrl"
                  :param="workPermit"
                  mappingType="PUT"
                  label="반려"
                  icon="front_hand"
                  color="red-3"
                  @beforeAction="returnWorkPermit"
                  @btnCallback="returnWorkPermitCallback"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeReturnDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  :rows="5"
                  label=""
                  name="returnRemark"
                  v-model:value="workPermit.returnRemark"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
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
import { fileType } from '@components/CUpload.vue'
import { WatchStopHandle } from 'vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safeWorkPermitDetail14'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])
/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopWorkPermitId: stringNull
    callType: stringNull
    isDirty?: boolean
  }
  contentHeight?: stringNull
}

interface gasType {
  sopGasId: string
  gasName: string
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sopWorkPermitId: '',
      callType: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const isDirty = ref(false)
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SWP_RELATE_INFO',
  taskKey: '',
  beforeTaskKey: ''
})
const workPermit = ref<any>({
  sopWorkPermitId: '', // 작업허가서 일련번호
  permitNo: '',
  plantCd: '', // 사업장 코드
  permitTypeCd: '', // 허가서 구분
  swpWorkPermitTypeCd: '', // 작업허가분류코드
  swpSupplementWorkTypeCd: '', // 보완작업유형코드
  workName: '', // 작업명
  swpStepCd: '', // 진행단계 코드
  applicationDeptCd: '', // 신청인 부서코드
  applicationUserId: '', // 신청인 ID
  workManagerId: '', // 작업감독자 ID
  workManagerNo: '',
  workDeptCd: '', // 작업수행부서 코드
  issuedDeptCd: '', // 작업허가 부서코드
  issuedUserId: '', // 작업허가 승인자 ID
  processCd: '', // 작업공정
  permitDate: '', // 작업일자
  workStartTime: '', // 작업시작시간
  workEndTime: '', // 작업종료시간
  workLocation: '', // 작업장소
  workEquipment: '', // 작업설비
  workCompleteTime: '', // 작업완료시간
  workCompleteWorkUserId: '', // 작업완료 작업자
  vendorCd: '', // 작업업체 코드
  workCount: '', // 작업인원
  emergencyWorkReason: '', // 긴급작업사유
  workReviewComment: '', // 작업수행부서 검토의견

  handleMaterialName: '', // 취급물질명
  surfaceTempYn: '', // 설비 표면 또는 작업구간 온도
  hazardousChemYn: '', // 작업 중 추락의 위험성
  confinedSpaceYn: '', // 산소결핍 또는 유해가스의 위험성
  highPlaceYn: '', // 유해위험물질 유출 또는 잔존 가능성
  electricalWorkYn: '', // 정전 작업 시 감전 가능성
  etcHazardousYn: '', // 기타 위험성 여부
  etcHazardousReason: '', // 기타 위험성 사유
  workSummary: '', // 작업내용
  workDrillBookYn: '', // 작업지도서 보유여부
  mocCheckYn: '', // 변경관리 해당여부
  preWorkCheckYn: '', // 가동전 점검 대상 여부
  energyBlockYn: '', // 에너지원 차단여부
  gasCheckYn: '', // 가스측정여부
  gasCheckItems: '', // 가스측정대상
  gearCheckItems: '', // 안전보호구 그리드 데이터
  swpCheckItems: [], // 작업수행부서/허가부서 체크리스트
  permitReviewComment: '', // 작업허가부서 검토의견

  sysApprovalRequestId: '', // 결재요청번호
  cancelRemark: '', // 취소사유
  returnRemark: '', // 반려사유
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  approvalStatusCd: '', // 결재관련 결재상태
  vendorUserCd: null,
  vendorManagerNo: '',
  issuedDeptNo: '',

  maps: [],
  deleteMaps: []
})

const gearGrid = ref<any>({
  // merge: [
  //   { index: 0, colName: 'saiSafetyHealthyId' },
  //   { index: 1, colName: 'saiSafetyHealthyId' }
  // ],
  columns: [
    {
      name: 'safetyShoes',
      field: 'safetyShoes',
      label: '안전화',
      align: 'center',
      child: [
        {
          name: 'gear1',
          field: 'gear1',
          label: '안전화',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear2',
          field: 'gear2',
          label: '내화학',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear3',
          field: 'gear3',
          label: '방열',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear4',
          field: 'gear4',
          label: '절연',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear5',
          field: 'gear5',
          label: '제전화',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        }
      ]
    },
    {
      name: 'gear6',
      field: 'gear6',
      label: '안전모',
      align: 'center',
      type: 'custom',
      true: 'Y',
      false: 'N',
      color: 'blue',
      sortable: false
    },
    {
      name: 'gear7',
      field: 'gear7',
      label: '보안경',
      align: 'center',
      type: 'custom',
      true: 'Y',
      false: 'N',
      color: 'blue',
      sortable: false
    },
    {
      name: 'faceShield',
      field: 'faceShield',
      label: '보안면',
      align: 'left',
      sortable: false,
      child: [
        {
          name: 'gear8',
          field: 'gear8',
          label: '일반',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear9',
          field: 'gear9',
          label: '방염',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear10',
          field: 'gear10',
          label: '방열',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear11',
          field: 'gear11',
          label: '용접',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        }
      ]
    },
    {
      name: 'respirator',
      field: 'respirator',
      label: '호흡보호구',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'gear12',
          field: 'gear12',
          label: '방진',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gearA',
          field: 'gearA',
          label: '방독',
          align: 'center',
          sortable: false,
          child: [
            {
              name: 'gear14',
              field: 'gear14',
              label: '전면',
              align: 'center',
              type: 'custom',
              true: 'Y',
              false: 'N',
              color: 'blue',
              sortable: false
            },
            {
              name: 'gear16',
              field: 'gear16',
              label: '반면',
              align: 'center',
              type: 'custom',
              true: 'Y',
              false: 'N',
              color: 'blue',
              sortable: false
            }
          ]
        },
        {
          name: 'gear17',
          field: 'gear17',
          label: '전동식호흡보호구',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear18',
          field: 'gear18',
          label: '송기마스크',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        }
      ]
    },
    {
      name: 'safetyGloves',
      field: 'safetyGloves',
      label: '보호(안전)장갑',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'gear19',
          field: 'gear19',
          label: '일반',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear20',
          field: 'gear20',
          label: '내화학',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear21',
          field: 'gear21',
          label: '방염',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear22',
          field: 'gear22',
          label: '방열',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear23',
          field: 'gear23',
          label: '용접',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear24',
          field: 'gear24',
          label: '라텍스',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        }
      ]
    },
    {
      name: 'protectiveClothing',
      field: 'protectiveClothing',
      label: '보호의',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'gear25',
          field: 'gear25',
          label: '방진',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear26',
          field: 'gear26',
          label: '내화학',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear27',
          field: 'gear27',
          label: '내산두건',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear28',
          field: 'gear28',
          label: '방염',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear29',
          field: 'gear29',
          label: '방열',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear30',
          field: 'gear30',
          label: '밀폐',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        }
      ]
    },
    {
      name: 'gear31',
      field: 'gear31',
      label: '안전벨트',
      align: 'center',
      type: 'custom',
      true: 'Y',
      false: 'N',
      color: 'blue',
      sortable: false
    },
    {
      name: 'earProtection',
      field: 'earProtection',
      label: '귀보호',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'gear32',
          field: 'gear32',
          label: '귀마개',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear33',
          field: 'gear33',
          label: '귀덮개',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        }
      ]
    },
    {
      name: 'cryogenicProtection',
      field: 'cryogenicProtection',
      label: '초저온보호구',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'gear34',
          field: 'gear34',
          label: '장갑',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear35',
          field: 'gear35',
          label: '덧신',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue',
          sortable: false
        },
        {
          name: 'gear36',
          field: 'gear36',
          label: '앞치마',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'black',
          sortable: false
        },
        {
          name: 'gear37',
          field: 'gear37',
          label: '고글',
          align: 'center',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'red',
          sortable: false
        }
      ]
    }
  ]
})

const workCheckGridColumns = ref([
  {
    name: 'swpSupplementWorkTypeName',
    field: 'swpSupplementWorkTypeName',
    label: '보조작업',
    align: 'center',
    style: 'width:20%',
    sortable: false
  },
  {
    name: 'workCheckItem',
    field: 'workCheckItem',
    label: '안전조치사항(작업수행부서)',
    align: 'left',
    style: 'width:70%',
    sortable: false
  },
  {
    name: 'workCheckYn',
    field: 'workCheckYn',
    label: '해당',
    align: 'center',
    type: 'custom',
    true: 'Y',
    false: 'N',
    color: 'blue',
    style: 'width:10%',
    sortable: false
  }
])
const permitCheckGridColumns = ref([
  {
    name: 'swpSupplementWorkTypeName',
    field: 'swpSupplementWorkTypeName',
    label: '보조작업',
    align: 'center',
    style: 'width:20%',
    sortable: false
  },
  {
    name: 'permitCheckItem',
    field: 'permitCheckItem',
    label: '안전조치사항(작업허가부서)',
    align: 'left',
    style: 'width:70%',
    sortable: false
  },
  {
    name: 'permitCheckYn',
    field: 'permitCheckYn',
    label: '해당',
    align: 'center',
    type: 'custom',
    true: 'Y',
    false: 'N',
    color: 'blue',
    style: 'width:10%',
    sortable: false
  }
])

const checkGrid = ref<any>({
  merge: [{ index: 0, colName: 'swpSupplementWorkTypeName' }],
  data: []
})
const workCheckGridData = computed(() => {
  return checkGrid.value.data.filter((item: any) => {
    const workItem = item.workCheckItem ? item.workCheckItem.trim() : ''
    return workItem && !workItem.includes('-')
  })
})
const permitCheckGridData = computed(() => {
  return checkGrid.value.data.filter((item: any) => {
    const permitItem = item.permitCheckItem ? item.permitCheckItem.trim() : ''
    return permitItem && !permitItem.includes('-')
  })
})
const returnDialog = ref({
  show: false
})
// 이전 선택값 추적
let previousSelectedCodes: string[] = []
const loadingChecklistCodes = ref<string[]>([]) // 로딩 중인 체크리스트 코드 추적
const existCheckOption = ref<Array<any>>([
  { label: '있음', value: 'Y' },
  { label: '없음', value: 'N' }
])
const permitTypeItems = ref<Array<codeMasterType>>([]) // 작업허가분류
const supplementWorkTypeItems = ref<Array<codeMasterType>>([]) // 보중작업
const allSupplementWorkTypeItems = ref<Array<codeMasterType>>([]) // 보충작업 전체 원본
const checkItemlistUrl = ref('')
const detailUrl = ref('')
const deleteUrl = ref('')
const printUrl = ref('')
const saveUrl = ref('')
const gasURL = ref('')
const gasItems = ref<Array<gasType>>([]) // 가스측정항목
const isSave = ref(false)
const isReqApproval = ref(false)
const isApproval = ref(false)
const isCancel = ref(false)
const isReturn = ref(false)
const mappingType = ref('POST')
const uploader = ref<any>(null)
const editForm = ref<any>(null)
const editForm2 = ref<any>(null)
const fileList = ref<Array<fileType>>([])
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.sopWorkPermitId))
const isWriting = computed(
  () =>
    // 허가서 작성중
    !isOld.value ||
    workPermit.value.swpStepCd === 'SSC0000001' ||
    workPermit.value.swpStepCd === 'SSC0000015'
)
const isReviewing = computed(
  () =>
    // 검토중
    isOld.value && workPermit.value.swpStepCd === 'SSC0000005'
)
const fromApproval = computed(
  () =>
    // 화면호출이 사전허가서검토화면에서 불러온 경우
    isOld.value && props.popupParam.callType === 'APPROVAL'
)
const isWorking = computed(
  () =>
    // 검토완료
    isOld.value && workPermit.value.swpStepCd === 'SSC0000010'
)
const disabled = computed(
  () =>
    // 모든 입력폼이 비활성화 되는 상황
    isOld.value &&
    // 검토완료-반려-작업취소
    (workPermit.value.swpStepCd === 'SSC0000010' ||
      (workPermit.value.swpStepCd === 'SSC0000015' && props.popupParam.callType === 'APPROVAL') ||
      workPermit.value.swpStepCd === 'SSC0000020')
)
const swpSupplementWorkTypeCdArray = computed({
  get() {
    if (!workPermit.value.swpSupplementWorkTypeCd) return []
    return typeof workPermit.value.swpSupplementWorkTypeCd === 'string'
      ? workPermit.value.swpSupplementWorkTypeCd.split(',')
      : [workPermit.value.swpSupplementWorkTypeCd]
  },
  set(val) {
    workPermit.value.swpSupplementWorkTypeCd = val.join(',')
  }
})
const commonChecklistCodes = ['SSWTC00000', 'SSWTC00100', 'SSWTC00200']
const isCommonChecklistItem = (row: any) => {
  return commonChecklistCodes.includes(row.swpSupplementWorkTypeCd)
}

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => workPermit.value.swpWorkPermitTypeCd,

  (newVal) => {
    if (newVal === null) {
      supplementWorkTypeItems.value = null
      return
    }
    workPermit.value.swpSupplementWorkTypeCd = null // 보충작업 유형 초기화
    checkGrid.value.data = [] // swpWorkPermitTypeCd 변경 시 checkGrid 초기화

    if (newVal === 'SWPTC00010') {
      getCheckItemList('SSWTC00000') // 공통 체크리스트 추가
    } else if (newVal === 'SWPTC00020') {
      getCheckItemList('SSWTC00100') // 공통 체크리스트 추가
    } else if (newVal === 'SWPTC00030') {
      getCheckItemList('SSWTC00200') // 공통 체크리스트 추가
    }

    if (newVal) {
      const codesToInclude = [newVal]
      if (newVal === 'SWPTC00020') {
        codesToInclude.push('SWPTC00010')
      } else if (newVal === 'SWPTC00030') {
        codesToInclude.push('SWPTC00010', 'SWPTC00020')
      }

      // 선택된 작업허가분류에 따라 보충작업유형을 필터링
      supplementWorkTypeItems.value = allSupplementWorkTypeItems.value.filter(
        (item: codeMasterType) =>
          codesToInclude.includes(item.attrVal1) &&
          item.code !== 'SSWTC00000' &&
          item.code !== 'SSWTC00100' &&
          item.code !== 'SSWTC00200'
      )
    }
  }
)
watch(
  () => workPermit.value.swpSupplementWorkTypeCd,
  (newVal) => {
    // newVal이 문자열 (쉼표로 구분) 또는 단일 값으로 들어옴
    let currentSelectedCodes: string[] = []

    if (newVal) {
      // 쉼표로 구분된 문자열을 배열로 변환
      currentSelectedCodes =
        typeof newVal === 'string'
          ? newVal
              .split(',')
              .map((v) => v.trim())
              .filter((v) => v.length > 0)
          : [newVal]
    }

    // 새로 추가된 항목 찾기 (현재에는 있고 이전에는 없던 항목)
    const addedCodes = currentSelectedCodes.filter((code) => !previousSelectedCodes.includes(code))

    // 제거된 항목 찾기 (이전에는 있었고 현재는 없는 항목)
    const removedCodes = previousSelectedCodes.filter(
      (code) => !currentSelectedCodes.includes(code)
    )

    // 새로 추가된 항목: push
    addedCodes.forEach((code) => {
      getCheckItemList(code)
    })

    // 제거된 항목: remove
    removedCodes.forEach((code) => {
      checkGrid.value.data = checkGrid.value.data.filter(
        (item: any) => item.swpSupplementWorkTypeCd !== code
      )
    })

    // 현재 선택값을 이전 선택값으로 업데이트
    previousSelectedCodes = [...currentSelectedCodes]
  }
)
// watch(
//   () => workPermit.value.hazardousChemYn,
//   (newVal) => {
//     if (gearGrid.value.data && gearGrid.value.data.length > 0) {
//       if (newVal === 'Y') {
//         gearGrid.value.data[0].gear31 = 'Y'
//       } else {
//         gearGrid.value.data[0].gear31 = 'N'
//       }
//     }
//   }
// )
/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()

  // 신규 작성 시에만 저장하지 않고 닫을 경우 확인 메시지 표시
  if (!isOld.value) {
    let originalState: string = ''
    let stopWatch: WatchStopHandle | null = null

    // 초기 상태 저장. init()에서 기본값이 설정된 직후의 상태를 캡처합니다.
    originalState = JSON.stringify(workPermit.value)

    // 변경 감시 시작
    stopWatch = watch(
      workPermit,
      () => {
        if (JSON.stringify(workPermit.value) !== originalState) {
          isDirty.value = true
          props.popupParam.isDirty = true
          // 한번 dirty가 되면 계속 dirty 상태이므로 감시 중지 (성능 최적화)
          if (stopWatch) {
            stopWatch()
            stopWatch = null
          }
        }
      },
      { deep: true }
    )
  }
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  checkItemlistUrl.value = selectConfig.swp.workCheck.list.url
  gasURL.value = selectConfig.sop.swp.gas.list.url
  detailUrl.value = selectConfig.swp.workPermit.get.url
  printUrl.value = selectConfig.swp.workPermit.print.url
  saveUrl.value = transactionConfig.swp.workPermit.insert.url
  deleteUrl.value = transactionConfig.swp.workPermit.delete.url

  // code setting
  setGearGridData()
  getGasList()
  getMultiComboItems(['SWP_WORK_PERMIT_TYPE_CD', 'SWP_SUPPLEMENT_WORK_TYPE_CD']).then(
    (_result: any) => {
      permitTypeItems.value = _result['SWP_WORK_PERMIT_TYPE_CD']
      allSupplementWorkTypeItems.value = _result['SWP_SUPPLEMENT_WORK_TYPE_CD']
      //supplementWorkTypeItems.value = [...allSupplementWorkTypeItems.value] // 초기값 설정
    }
  )
  // list setting
  if (isOld.value) {
    attachInfo.value.taskKey = props.popupParam.sopWorkPermitId
    getDetail()
  } else {
    workPermit.value.permitDate = getToday()
    workPermit.value.workTime = ['08:00', '17:00']
    workPermit.value.plantCd = user.value.plantCd
    workPermit.value.applicationUserId = user.value.userId
    workPermit.value.applicationDeptCd = user.value.deptCd
    workPermit.value.workManagerId = user.value.userId
    workPermit.value.workManagerNo = user.value.mobileNo
    workPermit.value.workDeptCd = user.value.deptCd
    workPermit.value.issuedDeptCd = user.value.deptCd

    workPermit.value.mocCheckYn = 'N'
    workPermit.value.preWorkCheckYn = 'N'
    workPermit.value.gasCheckYn = 'N'
  }
}

/******************************
 * TODO (목적): 작업허가서 상세 조회
 * @param (1): 저장 여부
 *******************************/
function getDetail() {
  $http({
    url: detailUrl.value,
    method: 'GET',
    params: {
      sopWorkPermitId: props.popupParam.sopWorkPermitId
    }
  }).then((_result: any) => {
    setTimeout(() => {
      const fetchedData = _result.data

      // 1. watchers를 트리거하는 속성을 제외한 모든 데이터를 먼저 복사
      for (const key in fetchedData) {
        if (key !== 'swpWorkPermitTypeCd' && key !== 'swpSupplementWorkTypeCd') {
          workPermit.value[key] = fetchedData[key]
        }
      }
      // 작업시간 설정
      workPermit.value.workTime = [fetchedData.workStartTime, fetchedData.workEndTime]

      // 보호구 설정
      if (fetchedData.gearCheckItems) {
        const gearData = gearGrid.value.data[0]
        fetchedData.gearCheckItems.split(',').forEach((gear: string) => {
          if (gear in gearData) {
            gearData[gear] = 'Y'
          }
        })
      }

      // 2. 첫 번째 watch를 트리거하기 위해 swpWorkPermitTypeCd를 설정
      workPermit.value.swpWorkPermitTypeCd = fetchedData.swpWorkPermitTypeCd

      // 3. 첫 번째 watch의 동기 작업이 완료된 후 실행
      nextTick(() => {
        // 4. swpSupplementWorkTypeCd 설정
        const supplementCodesToSelect = [
          ...new Set(
            (fetchedData.swpCheckItems || []).map((item: any) => item.swpSupplementWorkTypeCd)
          )
        ].filter((code) => code && !commonChecklistCodes.includes(code.toString())) // 공통 체크리스트 코드는 제외

        if (supplementCodesToSelect.length > 0) {
          // 두 번째 watch를 트리거하여 checkGrid 데이터 로드
          workPermit.value.swpSupplementWorkTypeCd = supplementCodesToSelect.join(',')

          // 5. checkGrid 데이터가 로드될 때까지 대기한 후, 저장된 체크 상태를 적용
          setTimeout(() => {
            const savedChecksMap = new Map(
              (fetchedData.swpCheckItems || []).map((item: any) => [item.swpCheckItemId, item])
            )

            // 4. 로드된 checkGrid의 각 항목에 저장된 workCheckYn, permitCheckYn 값을 설정
            checkGrid.value.data.forEach((gridItem: any) => {
              const savedItem: any = savedChecksMap.get(gridItem.swpCheckItemId)
              if (savedItem) {
                // 저장된 항목(Y인 항목)이 있으면 Y/N 상태를 명시적으로 설정
                gridItem.workCheckYn = savedItem.workCheckYn === 'Y' ? 'Y' : 'N'
                gridItem.permitCheckYn = savedItem.permitCheckYn === 'Y' ? 'Y' : 'N'
              } else {
                // 저장된 항목이 없으면(swpCheckItems에 없으면) 'N'으로 설정
                gridItem.workCheckYn = 'N'
                gridItem.permitCheckYn = 'N'
              }
            })
          }, 500)
        }
      })
    }, 1)
  })
}
/******************************
 * TODO (목적): 작업허가서 불러오기 팝업 표시
 *******************************/
function loadWorkPermit() {
  popupOptions.value = getPopupOptions('workPermit', popupOptions.value, closeWorkPermitPopup, {
    /** 원하는 parameter 정의 */
    type: 'single',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 작업허가서 불러오기 팝업 닫기
 * @param (1): 불러오기 선택한 작업허가서
 *******************************/
function closeWorkPermitPopup(data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const selectedSopWorkPermitId = data[0].sopWorkPermitId
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        sopWorkPermitId: selectedSopWorkPermitId
      }
    }).then((_result: any) => {
      // getDetail 로직을 기반으로 데이터를 템플릿처럼 설정
      setTimeout(() => {
        // 상세 조회 시에는 기존에 로드된 그리드 데이터를 초기화
        checkGrid.value.data = []
        previousSelectedCodes = []
        workPermit.value.swpSupplementWorkTypeCd = null

        const fetchedData = _result.data

        // 0. Reset grids and previous selections
        gearGrid.value.data = []
        setGearGridData() // 보호구 그리드 초기화
        checkGrid.value.data = []
        previousSelectedCodes = []
        workPermit.value.swpSupplementWorkTypeCd = null

        // 1. watchers를 트리거하는 속성을 제외한 모든 데이터를 먼저 복사
        for (const key in fetchedData) {
          if (key !== 'swpWorkPermitTypeCd' && key !== 'swpSupplementWorkTypeCd') {
            workPermit.value[key] = fetchedData[key]
          }
        }

        // 2. 새 작업허가서로 만들기 위해 ID 및 상태값 초기화
        workPermit.value.sopWorkPermitId = ''
        workPermit.value.swpStepCd = 'SSC0000001' // 작성중
        workPermit.value.sysApprovalRequestId = ''
        workPermit.value.cancelRemark = ''
        workPermit.value.returnRemark = ''
        workPermit.value.approvalStatusCd = ''
        attachInfo.value.taskKey = '' // 첨부파일 키 초기화

        // 3. 현재 사용자 정보로 일부 값 재설정
        workPermit.value.applicationUserId = user.value.userId
        workPermit.value.applicationDeptCd = user.value.deptCd
        workPermit.value.workManagerId = user.value.userId

        // 작업시간 설정
        workPermit.value.workTime = [fetchedData.workStartTime, fetchedData.workEndTime]

        // 보호구 설정
        if (fetchedData.gearCheckItems) {
          const gearData = gearGrid.value.data[0]
          fetchedData.gearCheckItems.split(',').forEach((gear: string) => {
            if (gear in gearData) {
              gearData[gear] = 'Y'
            }
          })
        }

        // 4. 첫 번째 watch를 트리거하기 위해 swpWorkPermitTypeCd를 설정
        workPermit.value.swpWorkPermitTypeCd = fetchedData.swpWorkPermitTypeCd

        // 5. 첫 번째 watch의 동기 작업이 완료된 후 실행
        nextTick(() => {
          // 6. swpSupplementWorkTypeCd 설정
          const supplementCodesToSelect = [
            ...new Set(
              (fetchedData.swpCheckItems || []).map((item: any) => item.swpSupplementWorkTypeCd)
            )
          ].filter(Boolean)

          if (supplementCodesToSelect.length > 0) {
            // 두 번째 watch를 트리거하여 checkGrid 데이터 로드
            workPermit.value.swpSupplementWorkTypeCd = supplementCodesToSelect.join(',')

            // 7. checkGrid 데이터가 로드될 때까지 대기한 후, 저장된 체크 상태를 적용
            setTimeout(() => {
              const savedChecksMap = new Map(
                (fetchedData.swpCheckItems || []).map((item: any) => [item.swpCheckItemId, item])
              )

              checkGrid.value.data.forEach((gridItem: any) => {
                const savedItem: any = savedChecksMap.get(gridItem.swpCheckItemId)
                if (savedItem) {
                  gridItem.workCheckYn = savedItem.workCheckYn === 'Y' ? 'Y' : 'N'
                  gridItem.permitCheckYn = savedItem.permitCheckYn === 'Y' ? 'Y' : 'N'
                } else {
                  gridItem.workCheckYn = 'N'
                  gridItem.permitCheckYn = 'N'
                }
              })
            }, 500)
          }
        })
      }, 1)
    })
  }
}
/******************************
 * TODO (목적): 안전조치사항 조회
 *******************************/
function getCheckItemList(swpSupplementWorkTypeCd: string) {
  // 이미 해당 보조작업의 체크리스트가 로드되었는지 확인
  const isAlreadyLoaded = checkGrid.value.data.some(
    (item: any) => item.swpSupplementWorkTypeCd === swpSupplementWorkTypeCd
  )
  // 로딩 중인지 확인
  const isLoading = loadingChecklistCodes.value.includes(swpSupplementWorkTypeCd)

  // 이미 로드되었거나 로딩 중이라면 중복 추가를 방지하기 위해 함수 실행을 중단
  if (isAlreadyLoaded || isLoading) {
    return
  }

  // 로딩 중인 코드 추가
  loadingChecklistCodes.value.push(swpSupplementWorkTypeCd)

  $http({
    url: checkItemlistUrl.value,
    method: 'GET',
    params: {
      swpSupplementWorkTypeCd: swpSupplementWorkTypeCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    const filteredData = _result.data.filter((item: any) => {
      const workItem = item.workCheckItem ? item.workCheckItem.trim() : ''
      const permitItem = item.permitCheckItem ? item.permitCheckItem.trim() : ''
      const isWorkInvalid = !workItem || workItem.includes('-')
      const isPermitInvalid = !permitItem || permitItem.includes('-')
      return !(isWorkInvalid && isPermitInvalid)
    })
    checkGrid.value.data.push(...filteredData)
    // 로딩 상태 제거
    const index = loadingChecklistCodes.value.indexOf(swpSupplementWorkTypeCd)
    if (index > -1) {
      loadingChecklistCodes.value.splice(index, 1)
    }
  })
}

/******************************
 * TODO (목적): 작업허가서 저장
 *******************************/
function saveWorkPermit(flag: string) {
  let messageText = '저장하시겠습니까?'

  if (isOld.value) {
    if (flag === 'reqApproval') {
      messageText = '검토요청하시겠습니까?'
    } else if (flag === 'approval') {
      messageText = '승인하시겠습니까?'
    } else if (flag === 'return') {
      messageText = '작업반려하시겠습니까?'
    } else if (flag === 'cancel') {
      messageText = '작업취소하시겠습니까?'
    } else {
      messageText = '저장하시겠습니까?'
    }
    saveUrl.value = transactionConfig.swp.workPermit.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.swp.workPermit.insert.url
    mappingType.value = 'POST'
    workPermit.value.swpStepCd = 'SSC0000001' // 작성중
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      const permitTypeCd = workPermit.value.swpWorkPermitTypeCd
      const selectedSupWorkCodes = workPermit.value.swpSupplementWorkTypeCd
        ? workPermit.value.swpSupplementWorkTypeCd.split(',').filter(Boolean)
        : []

      // 현재 작업허가분류가 보충작업을 가질 수 있는지 확인
      const hasSupWorkForPermitType = allSupplementWorkTypeItems.value.some(
        (item: codeMasterType) => item.attrVal1 === permitTypeCd
      )

      // 보충작업을 가질 수 있는 작업허가분류인 경우, 그에 해당하는 보충작업이 하나 이상 선택되었는지 검사
      if (hasSupWorkForPermitType) {
        const hasRequiredSelection = selectedSupWorkCodes.some((code: string) => {
          const supWorkItem = allSupplementWorkTypeItems.value.find(
            (item: codeMasterType) => item.code === code
          )
          return supWorkItem && supWorkItem.attrVal1 === permitTypeCd
        })

        if (!hasRequiredSelection) {
          message.alert({
            title: '안내',
            message: '현재 선택된 작업허가서분류에 해당하는 작업을 하나 이상 선택해야 합니다.',
            type: 'warning'
          })
          return
        }
      }
      message.confirm({
        title: '확인',
        message: `${messageText}`,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          setSaveData()
          if (flag === 'reqApproval') {
            workPermit.value.swpStepCd = 'SSC0000005' // 검토중
            isReqApproval.value = !isReqApproval.value
          } else if (flag === 'approval') {
            workPermit.value.swpStepCd = 'SSC0000010' // 검토완료
            isApproval.value = !isApproval.value
          } else if (flag === 'return') {
            workPermit.value.swpStepCd = 'SSC0000015' // 작업반려
            isReturn.value = !isReturn.value
          } else if (flag === 'cancel') {
            workPermit.value.swpStepCd = 'SSC0000020' // 작업취소
            isCancel.value = !isCancel.value
          } else {
            isSave.value = !isSave.value
          }
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: `필수항목 미입력`,
        type: 'warning'
      })
      return
    }
  })
}
/******************************
 * TODO (목적): 작업허가서 저장 후 처리
 * @param (1): 작업허가서 id 담은 object
 *******************************/
async function saveWorkPermitCallback(result: any) {
  isDirty.value = false
  props.popupParam.isDirty = false
  message.requestSuccess()
  props.popupParam.sopWorkPermitId = result.data
  if (mappingType.value === 'POST') {
    attachInfo.value.taskKey = result.data

    // ref를 통해 CUpload가 노출하는 submitFile 함수를 직접 호출하고 끝날 때까지 대기
    if (uploader.value) {
      try {
        await uploader.value.submitFile()
      } catch (e) {
        console.error('첨부파일 연결에 실패했습니다.', e)
      }
    }
  }
  // 첨부파일 연결이 완전히 끝난 후, 화면 데이터를 재조회
  getDetail()
}
/******************************
 * TODO (목적): 저장 데이터 셋팅
 *******************************/
function setSaveData() {
  if (workPermit.value.workTime && workPermit.value.workTime.length === 2) {
    workPermit.value.workStartTime = workPermit.value.workTime[0]
    workPermit.value.workEndTime = workPermit.value.workTime[1]
    // workPermit.value.permitDate = workPermit.value.workTime[0].substring(0, 10)
  }

  // 1. 보호구 (문자열)
  if (gearGrid.value.data && gearGrid.value.data.length > 0) {
    const gearData = gearGrid.value.data[0]
    const selectedGears = Object.keys(gearData).filter((key) => gearData[key] === 'Y')
    workPermit.value.gearCheckItems = selectedGears.join(',')
  }

  // 2. 체크리스트 (배열)
  workPermit.value.swpCheckItems = []
  if (checkGrid.value.data && checkGrid.value.data.length > 0) {
    const uniqueItemsMap = new Map()

    checkGrid.value.data.forEach((item: any) => {
      const key = item.swpCheckItemId

      if (!uniqueItemsMap.has(key)) {
        // Create a base item, ensuring Y/N properties are set.
        uniqueItemsMap.set(key, { ...item, workCheckYn: 'N', permitCheckYn: 'N' })
      }

      const storedItem = uniqueItemsMap.get(key)
      if (item.workCheckYn === 'Y') {
        storedItem.workCheckYn = 'Y'
      }
      if (item.permitCheckYn === 'Y') {
        storedItem.permitCheckYn = 'Y'
      }
    })

    // Filter for items that have at least one check and add other properties
    const finalItems = []
    for (const item of uniqueItemsMap.values()) {
      if (item.workCheckYn === 'Y' || item.permitCheckYn === 'Y') {
        finalItems.push(item)
      }
    }
    workPermit.value.swpCheckItems = finalItems
  }
}
/******************************
 * TODO (목적): 작업허가서 출력물 다운로드
 *******************************/
function printWorkPermit() {
  $http({
    url: $format(printUrl.value, props.popupParam.sopWorkPermitId),
    method: 'GET'
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = `[작업허가서] ${workPermit.value.workName}_${workPermit.value.workTime[0]}.pdf`
    link.click()
  })
}
/******************************
 * TODO (목적): 반려 팝업 표시
 *******************************/
function returnDialogOpen() {
  returnDialog.value.show = true
}
/******************************
 * TODO (목적): 반려 팝업 닫기
 *******************************/
function closeReturnDialog() {
  returnDialog.value.show = false
}
/******************************
 * TODO (목적): 작업허가서 반려
 *******************************/
function returnWorkPermit() {
  if (!workPermit.value.returnRemark) {
    message.alert({
      title: '안내',
      message: '반려사유를 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm2.value.validate().then((_result: boolean) => {
    if (_result) {
      saveWorkPermit('return')
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 작업허가서 반려 후 처리
 * @param (1): 작업허가서 id 담은 object
 *******************************/
function returnWorkPermitCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopWorkPermitId = result.data
  closeReturnDialog()
  getDetail()
}
/******************************
 * TODO (목적): 작업허가서 삭제
 *******************************/
function removeWorkPermit() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: deleteUrl.value,
        data: {
          sopWorkPermitId: props.popupParam.sopWorkPermitId
        },
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 보호구 그리드 초기 데이터 셋팅
 *******************************/
function setGearGridData() {
  const initialData: { [key: string]: string } = {}
  const getLeafFields = (columns: any[]) => {
    const fields: string[] = []
    function traverse(cols: any[]) {
      for (const col of cols) {
        if (col.child && col.child.length > 0) {
          traverse(col.child)
        } else {
          if (col.field) {
            fields.push(col.field)
          }
        }
      }
    }
    traverse(columns)
    return fields
  }
  const leafFields = getLeafFields(gearGrid.value.columns)
  for (const field of leafFields) {
    initialData[field] = 'N'
  }
  gearGrid.value.data = [initialData]
}
/******************************
 * TODO (목적): 데이터 변경 시 수정자 정보 셋팅
 * @param (1): 행 전체 정보
 *******************************/
function datachange(_props: any, _col: tableColumnType) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, _col.name, _props.row[_col.name])
}
/******************************
 * TODO (목적): 가스 조회
 *******************************/
function getGasList() {
  $http({
    url: gasURL.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    gasItems.value = _result.data
  })
}

/******************************
 * TODO (목적): 작업장소 불러오기 팝업 표시
 *******************************/
function loadWorkPermitLocation() {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./swpResourcesPop.vue`))
  )
  popupOptions.value.title = '작업장소 상세'
  popupOptions.value.param = {
    workPermit: workPermit.value,
    supWorks: workPermit.value.swpSupplementWorkTypeCd
      ? workPermit.value.swpSupplementWorkTypeCd
          .split(',')
          .map((v: string) => v.trim())
          .filter((v: string) => v.length > 0)
      : [],
    isWriting: isWriting.value
  }
  popupOptions.value.width = '70%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

function getSupTooltip(_cd: any) {
  let tooltipText = ''
  if (!_cd) return ''
  if (_cd === 'SSWTC00201') tooltipText = '밀폐공간 내부에서 수행하는 모든 작업'
  else if (_cd === 'SSWTC00202') tooltipText = '밀폐공간 내부에서의 분진 취급작업'
  else if (_cd === 'SSWTC00203') tooltipText = '비일상적인 신규 유해위험물질 취급작업'
  else if (_cd === 'SSWTC00204')
    tooltipText = '지면을 30cm이상 굴착하는 작업(굴삭기 사용 작업 포함)'
  else if (_cd === 'SSWTC00205')
    tooltipText = '폭발위험장소 및 11m 반경 내 가연물이 있는 지역에서의 화기작업'
  else if (_cd === 'SSWTC00206')
    tooltipText = 'Heat-up 상태에서 Kiln 상부 또는 고소작업이 병행되는 고온작업'
  else if (_cd === 'SSWTC00207') tooltipText = '크레인, 카고크레인(5톤 이상)을 이용한 작업'
  else if (_cd === 'SSWTC00208') tooltipText = '이동식 비계 설치작업을 제외한 비계설치 및 해체작업'
  else if (_cd === 'SSWTC00209') tooltipText = '작업 발판과 안전난간 없이 이동해야 하는 고소작업'
  else if (_cd === 'SSWTC00101') tooltipText = '화재위험지역 외에서의 화기작업'
  else if (_cd === 'SSWTC00102')
    tooltipText = '작업지도서가 정립되어 있는 일상적인 유해위험물질 취급'
  else if (_cd === 'SSWTC00103')
    tooltipText = '호이스트, 윈치, 체인블록 및 핸드리프트 등 인양운반 장비를 이용한 작업'
  else if (_cd === 'SSWTC00104')
    tooltipText = '지면 또는 각층 바닥으로부터 2m 이상의 높이에서의 작업(고소작업대 포함)'
  else if (_cd === 'SSWTC00105')
    tooltipText =
      '특별작업의 고온작업 외 설비 표면의 온도가 0도 이상이며 설비 내부에 진입하거나 접촉할 우려가 있는 작업'
  else if (_cd === 'SSWTC00001')
    tooltipText =
      '카고 크레인(5톤미만), 구내운반차, 덤프트럭, 레미콘트럭, 진공차, 펌프카, 암롤카, 집게차,화물운반차(5톤이상) 등을 사용하는 작업'
  else if (_cd === 'SSWTC00002') tooltipText = '자체적으로 수행하는 Sampling 작업'
  else if (_cd === 'SSWTC00003')
    tooltipText = '안전전압(50V)이상의 전압이 도통되거나 도통될 가능성이 있는 곳에서의 작업'
  else if (_cd === 'SSWTC00004')
    tooltipText =
      '기계작업, 계기작업, 보온작업, 도장작업, 발화가능기기 사용, 수리 등의 일반 정비작업'
  else if (_cd === 'SSWTC00005')
    tooltipText = '기기의 점검, 용접부 비파괴 검사 등 방사능을 사용하여 비파괴 검사를 하는 작업'
  else if (_cd === 'SSWTC00006') tooltipText = '대기방지 시설에 대한 자가측정 작업'
  else tooltipText = _cd.codeName

  return tooltipText
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

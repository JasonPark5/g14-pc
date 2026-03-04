<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-md-4 col-sm-4">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="설비 목록"
            :columns="grid.columns"
            :gridHeight="grid.height"
            :data="grid.data"
            :filtering="false"
            :selection="popupParam.selectData.length > 0 ? 'multiple' : 'none'"
            :columnSetting="false"
            :usePaging="false"
            :isExcelDown="false"
            :checkClickFlag="false"
            :editable="editable"
            :noDataLabel="
              $language('정비계획할 설비를 추가하세요. 저장할 시 정비결과를 등록 할 수 있습니다.')
            "
            rowKey="minEquipmentMaintenanceId"
            checkDisableColumn="disable"
            @rowClick="rowClick"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <q-icon
                  v-if="editable && !disabled && popupParam.selectData.length > 0"
                  name="help"
                  color="primary"
                  style="font-size: 20px; margin-right: 8px; position: relative; top: 3px"
                >
                  <q-tooltip
                    anchor="bottom left"
                    self="top left"
                    style="font-size: 0.85em; padding: 10px"
                  >
                    <div class="tooltipCustomTop">{{ $language('버튼설명') }}</div>
                    <div class="tooltipCustom">
                      {{
                        $language('▫️ 선택 완료 : 체크박스를 선택하여 정비완료 하는 버튼입니다.')
                      }}
                      <br />
                      {{
                        $language(
                          '▫️ 일괄저장 : 설비목록과 설비별 정비결과를 일괄적으로 저장하는 버튼입니다.'
                        )
                      }}
                    </div>
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-if="editable && !disabled && popupParam.selectData.length > 0"
                  :showLoading="false"
                  label="선택완료"
                  icon="task_alt"
                  color="blue"
                  @btnClicked="resultComplete"
                />
                <c-btn
                  v-if="editable && !disabled && popupParam.selectData.length === 0"
                  :showLoading="false"
                  label="완료"
                  icon="check"
                  color="blue"
                  @btnClicked="resultComplete2"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :url="updatesUrl"
                  :isSubmit="isSave"
                  :param="grid.data"
                  mappingType="PUT"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInspection"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'complete' && popupParam.selectData.length > 0">
                <q-icon
                  size="sm"
                  :editable="editable"
                  :disable="props.row.disable"
                  name="task_alt"
                  class="cursor-pointer text-primary"
                  @click.stop="resultComplete3(props.row)"
                />
              </template>
            </template>
          </c-table>
        </div>
      </div>
      <div class="col-8">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <q-form ref="editForm">
            <c-card
              class="cardClassDetailForm"
              :title="`${result.equipmentName} (${result.equipmentNo}) ${$language('정비결과')}`"
            >
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="saveDisable && !disabled"
                    :url="updateUrl"
                    :isSubmit="isSave2"
                    :param="result"
                    mappingType="PUT"
                    label="저장"
                    icon="save"
                    @beforeAction="saveItemInspection"
                    @btnCallback="saveCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-select
                    required
                    :disabled="result.disable"
                    label="정비유형"
                    codeGroupCd="MDM_MAINTENANCE_KIND_CD"
                    type="edit"
                    itemText="codeName"
                    itemValue="code"
                    v-model:value="result.equipmentCheckTypeCd"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-field
                    required
                    :disabled="result.disable"
                    label="실제정비자"
                    name="maintenanceUserId"
                    type="user"
                    v-model:value="result.maintenanceUserId"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-datepicker
                    required
                    :disabled="result.disable"
                    :editable="editable"
                    label="실제정비일"
                    name="maintenanceDate"
                    v-model:value="result.maintenanceDate"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-select
                    required
                    :disabled="result.disable"
                    :editable="editable"
                    codeGroupCd="MIM_CHECK_RESULT_CD"
                    type="edit"
                    itemText="codeName"
                    itemValue="code"
                    name="inspResultAfterMemCd"
                    label="정비후 정비결과"
                    v-model:value="result.inspResultAfterMemCd"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-datepicker
                    :disabled="result.disable"
                    :editable="editable"
                    label="정비시간"
                    :range="true"
                    :minuteStep="10"
                    type="time"
                    name="maintenanceTimeList"
                    v-model:value="result.maintenanceTimeList"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-field
                    :disabled="result.disable"
                    label="정비부서입회자"
                    name="memDeptEntrantUserId"
                    type="user"
                    v-model:value="result.memDeptEntrantUserId"
                  >
                    ></c-field
                  >
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-task-target
                    :disabled="disabled"
                    :editable="editable"
                    label="작업허가서"
                    :customPopupParam="{ targetKey: 'workPermit' }"
                    name="sopWorkPermitId"
                    v-model:value="result.sopWorkPermitId"
                  />
                </div>
                <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-task-target
                    :disabled="disabled"
                    :editable="editable"
                    label="MOC번호"
                    :customPopupParam="{ targetKey: 'moc' }"
                    name="sopMocId"
                    v-model:value="result.sopMocId"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-text
                    :editable="editable"
                    :disabled="result.disable"
                    label="정비자 자격사항"
                    name="maintenanceQualifications"
                    v-model:value="result.maintenanceQualifications"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-textarea
                    :editable="editable"
                    :disabled="result.disable"
                    label="정비원인"
                    :rows="2"
                    name="maintenanceCause"
                    v-model:value="result.maintenanceCause"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-textarea
                    :editable="editable"
                    :disabled="result.disable"
                    label="정비내용"
                    :rows="2"
                    name="maintenanceContent"
                    v-model:value="result.maintenanceContent"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-textarea
                    :editable="editable"
                    :disabled="result.disable"
                    label="정비결과요약"
                    :rows="2"
                    name="maintenanceResultSummary"
                    v-model:value="result.maintenanceResultSummary"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <c-textarea
                    :editable="editable"
                    :disabled="result.disable"
                    :rows="2"
                    label="관리자의 검토의견"
                    name="reviewOpinionOfMananger"
                    v-model:value="result.reviewOpinionOfMananger"
                  />
                </div>
              </template>
            </c-card>
            <c-card class="cardClassDetailForm" title="정비이력">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn label="출력" icon="print" @btnClicked="btnRecord" />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-text
                    :editable="editable"
                    :disabled="result.disable"
                    label="보고서번호"
                    name="reportNo"
                    v-model:value="result.reportNo"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-text
                    :editable="editable"
                    :disabled="result.disable"
                    label="고장심각도"
                    name="failureSeverity"
                    v-model:value="result.failureSeverity"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-text
                    :editable="editable"
                    :disabled="result.disable"
                    label="고장모드"
                    name="failureMode"
                    v-model:value="result.failureMode"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-text
                    :editable="editable"
                    :disabled="result.disable"
                    label="누계횟수"
                    name="totalNumber"
                    v-model:value="result.totalNumber"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-datepicker
                    :disabled="result.disable"
                    :editable="editable"
                    label="운전정지시간"
                    :range="true"
                    :minuteStep="10"
                    type="time"
                    name="stopDrivingTimeList"
                    v-model:value="result.stopDrivingTimeList"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-datepicker
                    :disabled="result.disable"
                    :editable="editable"
                    label="이용불능시간"
                    :range="true"
                    :minuteStep="10"
                    type="time"
                    name="noUseTimeList"
                    v-model:value="result.noUseTimeList"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <c-datepicker
                    :disabled="result.disable"
                    :editable="editable"
                    :minuteStep="10"
                    :range="true"
                    label="총가동시간"
                    type="time"
                    name="allDrivingTimeList"
                    v-model:value="result.allDrivingTimeList"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <c-textarea
                    :editable="editable"
                    :disabled="result.disable"
                    label="관리자확인"
                    :rows="2"
                    name="managerConfirm"
                    v-model:value="result.managerConfirm"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import {
  equipmentMaintenancePopupParamType,
  equipmentMaintenanceType
} from './equipmentMaintenance'

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
  name: 'equipmentMaintenanceResultDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
  popupParam: equipmentMaintenancePopupParamType
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<equipmentMaintenanceType>
  height: stringNull
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
  popupParam: () => {
    return {
      title: '',
      noPlan: 'N',
      selectData: [],
      minEquipmentMaintenanceId: ''
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
const result = ref<equipmentMaintenanceType>({
  minEquipmentMaintenanceId: '',
  plantCd: '',
  equipmentCd: '',
  maintenanceStatusCd: null,
  equipmentTypeCd: '',
  equipmentCheckTypeCd: null,
  memDeptEntrantUserId: '',
  maintenanceDueDate: '',
  maintenanceDueUserId: '',
  sopMocId: '',
  maintenanceUserId: '',
  maintenanceQualifications: '',
  maintenanceResultSummary: '',
  inspResultAfterMemCd: null,
  noPlanResultEnrollFlag: 'N',
  maintenanceCause: '',
  maintenanceContent: '',
  maintenanceStartTime: '',
  maintenanceEndTime: '',
  stopDrivingStartTime: '',
  stopDrivingEndTime: '',
  reviewOpinionOfMananger: '',
  workSummary: '',
  permitTypeCd: '',
  sopWorkPermitId: '',
  reportNo: '',
  managerConfirm: '',
  failureSeverity: '',
  failureMode: '',
  noUseTime: '',
  totalNumber: '',
  allDrivingTime: '',
  stopDrivingTimeList: [],
  maintenanceTimeList: [],
  allDrivingTimeList: [],
  noUseTimeList: [],
  disable: false
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [],
  data: [],
  height: '700px'
})
const title = ref('')
const updateUrl = ref('')
const updatesUrl = ref('')
const getUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const isSave2 = ref(false)
const saveCallData = ref('')

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  let count = 0
  _.forEach(grid.value.data, (_item: any) => {
    if (_item.disable) count++
  })
  return count === grid.value.data.length
})
const saveDisable = computed(() => {
  return (
    props.popupParam.selectData.length > 0 &&
    Boolean(result.value) &&
    !result.value.disable &&
    editable.value
  )
})
const editForm = ref<any>(null)
const table = ref<any>(null)
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
  getUrl.value = selectConfig.sop.min.maintenance.plan.get.url
  updatesUrl.value = transactionConfig.sop.min.maintenance.result.updates.url
  updateUrl.value = transactionConfig.sop.min.maintenance.result.update.url
  completeUrl.value = transactionConfig.sop.min.maintenance.result.completes.url
  // code setting
  title.value = props.popupParam.title
  // list setting
  setHeader()
  getDetail()
}
/******************************
 * TODO (목적): 정비 결과 조회
 *******************************/
function getDetail() {
  if (props.popupParam.selectData.length > 0) {
    grid.value.data = []

    _.forEach(props.popupParam.selectData, (_item) => {
      $http({
        url: $format(getUrl.value, _item.minEquipmentMaintenanceId),
        method: 'GET'
      }).then((_result: any) => {
        grid.value.data.push(_result.data)
        _.forEach(grid.value.data, (_item) => {
          if (_item.stopDrivingStartTime && _item.stopDrivingEndTime) {
            _item.stopDrivingTimeList = [_item.stopDrivingStartTime, _item.stopDrivingEndTime]
          }
          if (_item.maintenanceStartTime && _item.maintenanceEndTime) {
            _item.maintenanceTimeList = [_item.maintenanceStartTime, _item.maintenanceEndTime]
          }
        })
        rowClick(grid.value.data[0])
      })
    })
  } else {
    if (props.popupParam.minEquipmentMaintenanceId) {
      grid.value.data = []
      $http({
        url: $format(getUrl.value, props.popupParam.minEquipmentMaintenanceId),
        method: 'GET'
      }).then((_result: any) => {
        grid.value.data.push(_result.data)
        _.forEach(grid.value.data, (_item: any) => {
          if (_item.stopDrivingStartTime && _item.stopDrivingEndTime) {
            _item.stopDrivingTimeList = [_item.stopDrivingStartTime, _item.stopDrivingEndTime]
          }
          if (_item.maintenanceStartTime && _item.maintenanceEndTime) {
            _item.maintenanceTimeList = [_item.maintenanceStartTime, _item.maintenanceEndTime]
          }
          if (_item.noUseStartTime && _item.noUseEndTime) {
            _item.noUseTimeList = [_item.noUseStartTime, _item.noUseEndTime]
          }
          if (_item.allDrivingStartTime && _item.allDrivingEndTime) {
            _item.allDrivingTimeList = [_item.allDrivingStartTime, _item.allDrivingEndTime]
          }
        })
        rowClick(grid.value.data[0])
      })
    }
  }
}
/******************************
 * TODO (목적): 테이블 헤더 세팅
 *******************************/
function setHeader() {
  if (props.popupParam.selectData.length > 0) {
    grid.value.columns = [
      {
        name: 'equipmentTypeName',
        field: 'equipmentTypeName',
        label: '설비유형',
        style: 'width:100px',
        align: 'center',
        sortable: false
      },
      {
        name: 'equipmentName',
        field: 'equipmentName',
        label: '설비명',
        style: 'width:120px',
        align: 'center',
        sortable: false
      },
      {
        name: 'maintenanceDueUserName',
        field: 'maintenanceDueUserName',
        label: '정비예정자',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'maintenanceDueDate',
        field: 'maintenanceDueDate',
        label: '정비예정일',
        style: 'width:100px',
        align: 'center',
        sortable: false
      },
      {
        name: 'complete',
        field: 'complete',
        label: '완료',
        align: 'center',
        style: 'width:50px',
        sortable: false,
        type: 'custom'
      }
    ]
  } else {
    grid.value.columns = [
      {
        name: 'equipmentTypeName',
        field: 'equipmentTypeName',
        label: '설비유형',
        style: 'width:100px',
        align: 'center',
        sortable: false
      },
      {
        name: 'equipmentName',
        field: 'equipmentName',
        label: '설비명',
        style: 'width:120px',
        align: 'center',
        sortable: false
      },
      {
        name: 'maintenanceDueUserName',
        field: 'maintenanceDueUserName',
        label: '정비예정자',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'maintenanceDueDate',
        field: 'maintenanceDueDate',
        label: '정비예정일',
        style: 'width:100px',
        align: 'center',
        sortable: false
      }
    ]
  }
}
/******************************
 * TODO (목적): 정비 결과 저장
 *******************************/
function saveInspection() {
  let flag = false
  _.forEach(grid.value.data, (_item) => {
    if (
      !_item.memDeptEntrantUserId ||
      !_item.equipmentCheckTypeCd ||
      !_item.maintenanceUserId ||
      !_item.inspResultAfterMemCd ||
      !_item.maintenanceDate
    ) {
      message.alert({
        title: '안내',
        message: $language('필수', { s1: _item.equipmentName }), // '[ ' + _item.equipmentName + ' ]의 필수 입력값을 입력해 주세요. [정비부서 입회자, 정비유형, 실제정비자, 실제정비일, 정비후 정비결과]'
        type: 'warning' // success / info / warning / error
      })
      flag = true
    }
  })
  if (!flag) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(grid.value.data, (_item: any) => {
          if (_item.maintenanceTimeList && _item.maintenanceTimeList.length > 0) {
            _item.maintenanceStartTime = _item.maintenanceTimeList[0]
            _item.maintenanceEndTime = _item.maintenanceTimeList[1]
          }
          if (_item.stopDrivingTimeList && _item.stopDrivingTimeList.length > 0) {
            _item.stopDrivingStartTime = _item.stopDrivingTimeList[0]
            _item.stopDrivingEndTime = _item.stopDrivingTimeList[1]
          }
          if (_item.noUseTimeList && _item.noUseTimeList.length > 0) {
            _item.noUseStartTime = _item.noUseTimeList[0]
            _item.noUseEndTime = _item.noUseTimeList[1]
          }
          if (_item.allDrivingTimeList && _item.allDrivingTimeList.length > 0) {
            _item.allDrivingStartTime = _item.allDrivingTimeList[0]
            _item.allDrivingEndTime = _item.allDrivingTimeList[1]
          }
        })
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 정비 결과 저장
 *******************************/
function saveItemInspection() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isSave2.value = !isSave2.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 정비 결과 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  saveCallData.value = uid()
}
function resultComplete() {
  const selectData = table.value.getSelected()
  if (selectData && selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning'
    })
    return
  }
  let flag = false
  _.forEach(selectData, (_item) => {
    if (
      !_item.memDeptEntrantUserId ||
      !_item.equipmentCheckTypeCd ||
      !_item.maintenanceUserId ||
      !_item.inspResultAfterMemCd ||
      !_item.maintenanceDate
    ) {
      message.alert({
        title: '안내',
        message: $language('필수 입력값을 입력해 주세요.') + '[' + _item.equipmentName + ']',
        type: 'warning' // success / info / warning / error
      })
      flag = true
    }
  })
  if (!flag) {
    message.confirm({
      title: '확인',
      message: '정비완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(selectData, (_item) => {
          _item.maintenanceCompleteFlag = 'Y'
        })
        $http({
          url: completeUrl.value,
          method: 'PUT',
          data: selectData
        }).then((_result: any) => {
          _.forEach(selectData, (_item) => {
            _item.maintenanceStatusCd = 'MCSC000020'
            _item.disable = true
          })
          table.value.setSelected([])
          message.requestSuccess()
          getDetail()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 정비 결과 일괄 완료
 *******************************/
function resultComplete2() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '정비완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (_item) => {
          _item.maintenanceCompleteFlag = 'Y'
        })
        $http({
          url: completeUrl.value,
          method: 'PUT',
          data: grid.value.data
        }).then((_result: any) => {
          message.requestSuccess()
          getDetail()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 정비 결과 단일완료
 *******************************/
function resultComplete3(_row: any) {
  rowClick(_row)
  if (
    !_row.memDeptEntrantUserId ||
    !_row.equipmentCheckTypeCd ||
    !_row.maintenanceUserId ||
    !_row.inspResultAfterMemCd ||
    !_row.maintenanceDate
  ) {
    message.alert({
      title: '안내',
      message:
        '필수 입력값을 입력해 주세요. [정비부서 입회자, 정비유형, 실제정비자, 실제정비일,  정비후 정비결과]',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  message.confirm({
    title: '확인',
    message: '정비완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      _row.maintenanceCompleteFlag = 'Y'
      $http({
        url: transactionConfig.sop.min.maintenance.result.complete.url,
        method: 'PUT',
        data: _row
      }).then((_result: any) => {
        _row.disable = true
        _row.maintenanceStatusCd = 'MCSC000020'
        table.value.setSelected([])
        message.requestSuccess()
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 정비 결과 상세 조회
 *******************************/
function rowClick(row: any) {
  result.value = row
}
/******************************
 * TODO (목적): 정비 결과서 출력
 *******************************/
function btnRecord() {
  $http({
    url: selectConfig.sop.min.equipment.maintain.print.url,
    method: 'GET',
    params: {
      minEquipmentMaintenanceId: result.value.minEquipmentMaintenanceId,
      detailFlag: 'Y',
      equipmentCd: result.value.equipmentCd,
      plantCd: result.value.plantCd
    }
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm = result.value.equipmentName + ' ' + $language('기기정비이력기록서') + '.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

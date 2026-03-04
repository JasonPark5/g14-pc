<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="measure"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
                <c-btn
                  v-if="editable && Boolean(popupParam.envSemsAirSelfMeasureMainId)"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="측정명"
                  name="semsAirSelfMeasureName"
                  v-model:value="measure.semsAirSelfMeasureName"
                />
              </div>
              <div class="col-2">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  label="측정월"
                  type="month"
                  default="today"
                  name="measureYm"
                  v-model:value="measure.measureYm"
                />
              </div>
              <div class="col-2">
                <c-task-target
                  :required="true"
                  :customPopupParam="{
                    targetKey: 'airOutlet',
                    param: {
                      searchParam: { selfMeasureExemptionFlag: 'N' }
                    }
                  }"
                  label="대기 배출구"
                  name="envAirMstOutletId"
                  v-model:value="measure.envAirMstOutletId"
                  @dataChange="(data1: any, data2: any, data3: any) => dataChange(data3, 1)"
                />
              </div>
              <!-- <div class="col-2">
                <c-plant
                  :editable="editable"
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="measure.plantCd"
                />
              </div> -->
            </template>
          </c-card>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="배출구별 SEMS 대기 자가측정기록부"
          :columns="grid.columns"
          :data="measure.subSemsMeasures"
          :gridHeight="grid.height"
          :editable="editable"
          :columnSetting="false"
          :filtering="false"
          selection="multiple"
          rowKey="envSemsAirSelfMeasureSubId"
        >
          <template v-slot:suffixTitle>
            <span
              v-if="!measure.envAirMstOutletId"
              style="color: tomato; font-size: 0.9em"
              class="q-ml-md"
            >
              {{ $language('※ 상단에서 대기배출구를 선택해야 추가 버튼이 표시됩니다.') }}
            </span>
          </template>
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline v-if="editable">
              <c-btn
                v-if="measure.envAirMstOutletId"
                label="추가"
                icon="add"
                @btnClicked="addItem"
              />
              <c-btn
                v-if="measure.subSemsMeasures!.length > 0"
                label="제외"
                icon="delete"
                @btnClicked="remove"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'envAirMstInspectItemId'">
              <c-task-target
                :editable="editable"
                name="envAirMstInspectItemId"
                label=""
                :customPopupParam="{
                  targetKey: 'airInspectItemMst',
                  param: {
                    searchParam: { isSems: 'Y' }
                  }
                }"
                v-model:value="props.row[col.name]"
                @dataChange="
                  (data1: any, data2: any, data3: any) => dataChange(data3, 3, props.row)
                "
              />
            </template>
            <template v-else-if="col.name === 'exceedFlag'">
              <span
                v-if="
                  props.row.legalStandard > 0 &&
                  props.row.inspectItemValue !== 'ND' &&
                  Number(props.row.inspectItemValue) > props.row.legalStandard
                "
                style="color: tomato"
              >
                {{ $language('초과') }}</span
              >
              <span
                v-else-if="props.row.inspectItemValue && props.row.legalStandard"
                class="text-grey-5"
                >{{ $language('이하') }}</span
              >
            </template>
            <template v-else-if="col.name === 'noStandardFlag' && props.row.envAirMstInspectItemId">
              <span
                v-if="props.row.legalStandard && props.row.legalStandard > 0"
                class="text-grey-5"
                >{{ 'N' }}</span
              >
              <span v-else style="color: tomato">{{ 'Y' }}</span>
            </template>
            <template v-else-if="col.name === 'legalStandard'">
              <span v-if="props.row[col.name]">{{ props.row[col.name] }}</span>
            </template>
          </template>
        </c-table>
        <c-dialog :param="popupOptions" />
      </div>
    </q-form>
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
import { measureTypeSems } from '@views/env/ieps/iepsAirMeasure'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'selfAirMeasureDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envSemsAirSelfMeasureMainId: stringNull
  }
}
interface gridType {
  merge?: Array<object>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
      envSemsAirSelfMeasureMainId: ''
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구번호',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      fix: true
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '배출구허가번호',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      fix: true
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      fix: true
    },
    {
      required: true,
      name: 'measureDt',
      field: 'measureDt',
      label: '측정일',
      align: 'center',
      type: 'date',
      style: 'width: 120px',
      setHeader: true,
      fix: true
    },
    {
      name: 'measureCd',
      field: 'measureCd',
      label: '자가측정 방법',
      align: 'center',
      style: 'width: 100px',
      type: 'select',
      codeGroupCd: 'SEMS_SELF_MEASURE_TYPE_CD',
      sortable: false,
      setHeader: true
    },
    {
      name: 'inspectorCd',
      field: 'inspectorCd',
      label: '검사기관',
      align: 'center',
      style: 'width: 200px',
      type: 'select',
      codeGroupCd: 'SEMS_INSPECTION_AGENCY_CD',
      sortable: false,
      setHeader: true
    },
    {
      name: 'gasSpeed',
      field: 'gasSpeed',
      label: '배출가스 속도(m/s)',
      align: 'center',
      style: 'width: 130px',
      type: 'decimal',
      integer: 5,
      point: 2,
      helpcomment: '정수[5].소수점[2]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'gasTemperature',
      field: 'gasTemperature',
      label: '배출가스 온도(℃)',
      align: 'center',
      style: 'width: 120px',
      type: 'decimal',
      integer: 4,
      point: 2,
      helpcomment: '정수[4].소수점[2]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'moisture',
      field: 'moisture',
      label: '수분량(%)',
      align: 'center',
      style: 'width: 80px',
      type: 'decimal',
      integer: 3,
      point: 2,
      helpcomment: '정수[3].소수점[2]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'measuredOxygen',
      field: 'measuredOxygen',
      label: '실측산소농도(%)',
      align: 'center',
      style: 'width: 120px',
      type: 'decimal',
      integer: 2,
      point: 1,
      helpcomment: '정수[2].소수점[1]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'standardOxygenCd',
      field: 'standardOxygenCd',
      label: '표준산소농도(%)',
      align: 'center',
      style: 'width: 120px',
      type: 'select',
      codeGroupCd: 'SEMS_STANDARD_OXYGEN_LEVEL_CD',
      sortable: false,
      setHeader: true
    },
    {
      name: 'gasAmount',
      field: 'gasAmount',
      label: '배출가스 유량(S ㎥/min)',
      align: 'center',
      style: 'width: 160px',
      type: 'decimal',
      integer: 10,
      point: 3,
      helpcomment: '정수[10].소수점[3]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'semsWeatherCd',
      field: 'semsWeatherCd',
      label: '기상',
      align: 'center',
      style: 'width: 90px',
      type: 'select',
      codeGroupCd: 'SEMS_WEATHER_CD',
      sortable: false,
      setHeader: true
    },
    {
      name: 'temperature',
      field: 'temperature',
      label: '기온(℃)',
      align: 'center',
      style: 'width: 80px',
      type: 'decimal',
      integer: 4,
      point: 1,
      helpcomment: '정수[4].소수점[1]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'humidity',
      field: 'humidity',
      label: '습도(%)',
      align: 'center',
      style: 'width: 80px',
      type: 'decimal',
      integer: 4,
      point: 1,
      helpcomment: '정수[4].소수점[1]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'pressure',
      field: 'pressure',
      label: '기압(mmHg)',
      align: 'center',
      style: 'width: 100px',
      type: 'decimal',
      integer: 4,
      point: 1,
      helpcomment: '정수[4].소수점[1]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'windDirectionCd',
      field: 'windDirectionCd',
      label: '풍향',
      align: 'center',
      style: 'width: 90px',
      type: 'select',
      codeGroupCd: 'SEMS_WIND_DIRECTION_CD',
      sortable: false,
      setHeader: true
    },
    {
      name: 'windSpeed',
      field: 'windSpeed',
      label: '풍속(m/sec)',
      align: 'center',
      style: 'width: 100px',
      type: 'decimal',
      integer: 4,
      point: 1,
      helpcomment: '정수[4].소수점[1]',
      sortable: false,
      setHeader: true
    },
    {
      name: 'inspectItemSemsCd',
      field: 'inspectItemSemsCd',
      label: '오염물질코드',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'envAirMstInspectItemName',
      field: 'envAirMstInspectItemName',
      label: '오염물질명',
      align: 'left',
      // type: 'custom',
      style: 'width: 180px',
      sortable: false,
      currentDay: true
    },
    {
      name: 'inspectItemValue',
      field: 'inspectItemValue',
      label: '오염물질농도',
      align: 'right',
      style: 'width: 100px',
      helpcomment: '정수[10].소수점[8]',
      type: 'decimal',
      integer: 10,
      point: 8,
      sortable: false
    },
    {
      name: 'airInspectUnitName',
      field: 'airInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '배출허용기준농도',
      align: 'center',
      style: 'width: 120px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'noStandardFlag',
      field: 'standardFlag',
      label: '배출허용기준없음',
      align: 'center',
      style: 'width: 120px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'exceedFlag',
      field: 'exceedFlag',
      label: '초과여부',
      align: 'center',
      style: 'width: 60px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'fuelName',
      field: 'fuelName',
      label: '연료명 및 사용량(일)',
      align: 'left',
      style: 'width: 120px',
      type: 'text',
      sortable: false
    },
    {
      name: 'rawName',
      field: 'rawName',
      label: '원료명 및 사용량<br/>(특정대기유해물질 배출원 포함)',
      align: 'left',
      style: 'width: 180px',
      type: 'text',
      sortable: false
    },
    {
      name: 'technician',
      field: 'technician',
      label: '환경기술인',
      align: 'center',
      style: 'width: 80px',
      type: 'number',
      sortable: false,
      setHeader: true
    },
    {
      name: 'opinion',
      field: 'opinion',
      label: '환경기술인 의견',
      align: 'left',
      style: 'width: 100px',
      type: 'text',
      sortable: false
    },
    {
      name: 'machine',
      field: 'machine',
      label: '검사 기기명',
      align: 'left',
      style: 'width: 100px',
      type: 'text',
      sortable: false
    },
    {
      name: 'method',
      field: 'method',
      label: '검사 방법',
      align: 'left',
      style: 'width: 100px',
      type: 'text',
      sortable: false
    }
  ],
  data: [],
  height: window.innerHeight - 240 + 'px'
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const measure = ref<measureTypeSems>({
  plantCd: null, // 사업장코드
  envSemsAirSelfMeasureMainId: '', // 대기 자가측정 일련번호
  measureYm: '', // 대기 자가측정 년도
  envAirMstOutletId: null, // 대기 배출구
  outletName: '', // 대기 배출구명
  outletSemsId: '', // 대기 배출구 SEMS 번호
  outletPermitNo: '', // 대기 배출구 사업장관리번호
  semsAirSelfMeasureName: '', // 대기 자가측정명
  subSemsMeasures: [], // 대기 자가측정 검사항목
  delSubSemsMeasures: []
})
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)

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
  detailUrl.value = selectConfig.env.sems.air.self.measure.get.url
  deleteUrl.value = transactionConfig.env.sems.air.self.measure.delete.url
  saveUrl.value = transactionConfig.env.sems.air.self.measure.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envSemsAirSelfMeasureMainId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envSemsAirSelfMeasureMainId: props.popupParam.envSemsAirSelfMeasureMainId }
    }).then((_result: any) => {
      measure.value = _result.data
      emits('setRegInfo', _result.data)
    })
  } else measure.value.measureYm = getThisMonth()
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envSemsAirSelfMeasureMainId) {
    mappingType.value = 'PUT'
    measure.value.chgUserId = user.value.userId
  } else {
    mappingType.value = 'POST'
    measure.value.regUserId = user.value.userId
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, measure.value.subSemsMeasures)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envSemsAirSelfMeasureMainId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까? ',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envSemsAirSelfMeasureMainId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 데이터 변경에 따른 수정자 셋팅
 *******************************/
function dataChange(_data: any, num: number, row?: any) {
  if (row && row.editFlag !== 'C') {
    row.editFlag = 'U'
    row.chgUserId = user.value.userId
  }
  if (num === 1) {
    measure.value.envAirMstOutletId = _data.envAirMstOutletId
    measure.value.outletName = _data.outletName
    measure.value.outletSemsId = _data.outletSemsId
    measure.value.outletPermitNo = _data.outletPermitNo
  } else if (num === 3 && row) {
    row.envAirMstInspectItemId = _data.envAirMstInspectItemId
    row.envAirMstInspectItemName = _data.envAirMstInspectItemName
    row.inspectItemSemsCd = _data.inspectItemSemsCd
    row.airInspectUnitName = _data.airInspectUnitName
    row.legalStandard = _data.legalStandard
  }
}
/******************************
 * TODO (목적): row 추가
 *******************************/
function addItem() {
  popupOptions.value = getPopupOptions('airInspectItemMst', popupOptions.value, closeItem, {
    type: 'multiple',
    searchParam: { isSems: 'Y' }
  })
}
function closeItem(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(measure.value.subSemsMeasures, {
          envAirMstInspectItemId: item.envAirMstInspectItemId
        }) === -1
      ) {
        measure.value.subSemsMeasures?.push({
          measureDt: '',
          envSemsAirSelfMeasureMainId: props.popupParam.envSemsAirSelfMeasureMainId,
          envSemsAirSelfMeasureSubId: uid(),
          envAirMstOutletId: measure.value.envAirMstOutletId || '',
          outletSemsId: measure.value.outletSemsId || '',
          outletPermitNo: measure.value.outletPermitNo || '',
          outletName: measure.value.outletName || '',
          inspectItemSemsCd: item.inspectItemSemsCd,
          envAirMstInspectItemId: item.envAirMstInspectItemId,
          envAirMstInspectItemName: item.envAirMstInspectItemName,
          airInspectUnitName: item.airInspectUnitName,
          legalStandard: item.legalStandard,
          measureCd: 'SMM020', // 자가측정 방법 코드
          standardOxygenCd: 'SOD010', // 표준산소농도 코드
          semsWeatherCd: 'WSE010', // 날씨코드
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): row 제외
 *******************************/
function remove() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!measure.value.delSubSemsMeasures) measure.value.delSubSemsMeasures = []
      if (
        _.findIndex(measure.value.delSubSemsMeasures, {
          envSemsAirSelfMeasureSubId: item.envSemsAirSelfMeasureSubId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        measure.value.delSubSemsMeasures.push(item)
      }
      measure.value.subSemsMeasures = _.reject(measure.value.subSemsMeasures, item)
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

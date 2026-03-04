<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && Boolean(popupParam.envIepsAirSelfMeasureMainId)"
                label="삭제"
                icon="delete"
                @btnClicked="deleteData"
              />
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
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-2">
                <c-plant
                  :editable="editable"
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="measure.plantCd"
                />
              </div> -->
            <div class="col-4">
              <c-text
                :required="true"
                :editable="editable"
                label="측정명"
                name="iepsAirSelfMeasureName"
                v-model:value="measure.iepsAirSelfMeasureName"
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
                required
                :customPopupParam="{
                  targetKey: 'airOutlet',
                  param: {
                    searchParam: {
                      iepsFlag: 'Y',
                      selfMeasureExemptionFlag: 'N'
                    }
                  }
                }"
                label="대기 배출구"
                name="envAirMstOutletId"
                v-model:value="measure.envAirMstOutletId"
                @dataChange="(data1: any, data2: any, data3: any) => dataChange(data3, 1)"
              />
            </div>
            <div class="col-2">
              <c-text
                :editable="false"
                label="사업장 관리번호(IEPS)"
                name="outletIepsPlantMgtNo"
                v-model:value="measure.outletIepsPlantMgtNo"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-upload
          :fullWidth="false"
          :attachInfo="attachInfo"
          :editable="editable"
          label="첨부파일"
        />
        <c-table
          ref="table"
          title="배출구별 IEPS 대기 자가측정기록부"
          :columns="grid.columns"
          :data="measure.subMeasures"
          :gridHeight="grid.height"
          :editable="editable"
          :columnSetting="false"
          :hideBottom="true"
          :filtering="false"
          selection="multiple"
          rowKey="envIepsAirSelfMeasureSubId"
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
                v-if="measure.subMeasures!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="remove"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template
              v-if="['standardOxygen', 'measuredOxygen', 'inspectItemValue'].includes(col.name)"
            >
              <c-text-column
                :editable="editable"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props, col)"
              />
            </template>
            <template v-if="col.name === 'envAirMstInspectItemId'">
              <c-task-target
                :editable="editable"
                name="envAirMstInspectItemId"
                label=""
                :customPopupParam="{
                  targetKey: 'airInspectItemMst',
                  param: {
                    searchParam: { isIeps: 'Y' }
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
import { measureType } from './iepsAirMeasure'

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
    envIepsAirSelfMeasureMainId: stringNull
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
      envIepsAirSelfMeasureMainId: ''
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
      label: '측정정보',
      child: [
        {
          required: true,
          name: 'measureDt',
          field: 'measureDt',
          label: '측정일시',
          align: 'center',
          type: 'datetime',
          datetimeType: 'datetime',
          style: 'width: 150px',
          setHeader: true,
          fix: true
        }
      ]
    },
    {
      label: '기상상태',
      child: [
        {
          name: 'iepsWeatherCd',
          field: 'iepsWeatherCd',
          label: '기상',
          align: 'center',
          style: 'width: 100px',
          type: 'select',
          codeGroupCd: 'IEPS_WEATHER_CD',
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
          integer: 10,
          point: 6,
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
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        },
        {
          name: 'pressure',
          field: 'pressure',
          label: '기압(mmHg)',
          align: 'center',
          style: 'width: 80px',
          type: 'decimal',
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        },
        {
          name: 'windDirection',
          field: 'windDirection',
          label: '풍향',
          align: 'center',
          style: 'width: 80px',
          type: 'text',
          sortable: false,
          setHeader: true
        },
        {
          name: 'windSpeed',
          field: 'windSpeed',
          label: '풍속(m/sec)',
          align: 'center',
          style: 'width: 80px',
          type: 'decimal',
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        }
      ]
    },
    {
      label: '측정자료',
      child: [
        {
          name: 'gasAmount',
          field: 'gasAmount',
          label: '배출가스량(S ㎥/min)',
          align: 'center',
          style: 'width: 160px',
          type: 'decimal',
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        },
        {
          name: 'outletHeight',
          field: 'outletHeight',
          label: '배출구높이(m)',
          align: 'center',
          style: 'width: 100px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'outletUpperStackDiameter',
          field: 'outletUpperStackDiameter',
          label: '상부굴뚝 내경(m)',
          align: 'center',
          style: 'width: 100px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'outletInnerDiameter',
          field: 'outletInnerDiameter',
          label: '측정공위치 내경(m)',
          align: 'center',
          style: 'width: 120px',
          type: 'cost',
          sortable: false
        },

        {
          name: 'gasSpeed',
          field: 'gasSpeed',
          label: '배출가스 유속(m/s)',
          align: 'center',
          style: 'width: 120px',
          type: 'decimal',
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        },
        {
          name: 'gasTemperature',
          field: 'gasTemperature',
          label: '배출가스 온도(℃)',
          align: 'center',
          style: 'width: 100px',
          type: 'decimal',
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        },
        {
          name: 'moisture',
          field: 'moisture',
          label: '수분함량(%)',
          align: 'center',
          style: 'width: 80px',
          type: 'decimal',
          integer: 10,
          point: 6,
          sortable: false,
          setHeader: true
        },
        {
          name: 'standardOxygen',
          field: 'standardOxygen',
          label: '표준산소농도(%)',
          align: 'right',
          style: 'width: 100px',
          type: 'text',
          sortable: false,
          setHeader: true
        },
        {
          name: 'measuredOxygen',
          field: 'measuredOxygen',
          label: '실측산소농도(%)',
          align: 'right',
          style: 'width: 100px',
          type: 'text',
          sortable: false,
          setHeader: true
        }
      ]
    },
    {
      label: '측정항목',
      child: [
        {
          name: 'inspectItemIepsCd',
          field: 'inspectItemIepsCd',
          label: 'IEPS오염물질코드',
          align: 'center',
          style: 'width: 120px',
          sortable: false
        },
        {
          name: 'envAirMstInspectItemName',
          field: 'envAirMstInspectItemName',
          label: '오염물질명',
          align: 'center',
          // type: 'custom',
          style: 'width: 180px',
          sortable: false
        },
        {
          name: 'inspectItemValue',
          field: 'inspectItemValue',
          label: '측정농도',
          align: 'right',
          style: 'width: 100px',
          type: 'custom',
          sortable: false,
          currentDay: true
        },
        {
          name: 'airInspectUnitName',
          field: 'airInspectUnitName',
          label: '단위',
          align: 'center',
          style: 'width: 100px',
          sortable: false
        },
        {
          name: 'legalStandard',
          field: 'legalStandard',
          label: '허가배출기준',
          align: 'center',
          style: 'width: 80px',
          type: 'cost',
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
        }
      ]
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width: 120px',
      type: 'textarea',
      sortable: false
    }
  ],
  data: [],
  height: window.innerHeight - 440 + 'px'
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
const measure = ref<measureType>({
  plantCd: null, // 사업장코드
  envIepsAirSelfMeasureMainId: '', // 대기 자가측정 일련번호
  measureYm: '', // 대기 자가측정 년도
  envAirMstOutletId: null, // 대기 배출구
  outletName: '', // 대기 배출구명
  outletIepsNo: '', // 대기 배출구 IEPS 번호
  processCd: '', // 공정번호
  processNo: '', // 공정번호
  processName: '', // 공정명
  outletIepsPlantMgtNo: '', // 대기 배출구 사업장관리번호
  outletHeight: 0, // 대기 배출구 높이
  outletUpperStackDiameter: 0, // 대기 배출구 상단 Stack 직경
  outletInnerDiameter: 0,
  iepsAirSelfMeasureName: '', // 대기 자가측정명
  subMeasures: [], // 대기 자가측정 검사항목
  delSubMeasures: []
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'ENV_AIR_SELF_MEASURE',
  taskKey: ''
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
  detailUrl.value = selectConfig.env.ieps.air.self.measure.get.url
  deleteUrl.value = transactionConfig.env.ieps.air.self.measure.delete.url
  saveUrl.value = transactionConfig.env.ieps.air.self.measure.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envIepsAirSelfMeasureMainId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envIepsAirSelfMeasureMainId: props.popupParam.envIepsAirSelfMeasureMainId }
    }).then((_result: any) => {
      measure.value = _result.data
      attachInfo.value.taskKey = props.popupParam.envIepsAirSelfMeasureMainId
      emits('setRegInfo', _result.data)
    })
  } else measure.value.measureYm = getThisMonth()
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envIepsAirSelfMeasureMainId) {
    mappingType.value = 'PUT'
    measure.value.chgUserId = user.value.userId
  } else {
    mappingType.value = 'POST'
    measure.value.regUserId = user.value.userId
  }
  const hasDuplicates = () => {
    const seen = new Set()
    for (const item of measure.value.subMeasures || []) {
      const key =
        (item.measureDt?.replace('-', '').slice(0, 8) || '') + (item.envAirMstInspectItemId || '')
      if (seen.has(key)) return true
      seen.add(key)
    }
    return false
  }
  const check =
    (measure.value.subMeasures?.length
      ? validTable(grid.value.columns, measure.value.subMeasures)
      : true) && !hasDuplicates()
  if (hasDuplicates()) {
    message.alert({
      title: '안내',
      message: '측정일자 + 오염물질 조합이 중복된 항목이 있습니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result && check) {
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
  props.popupParam.envIepsAirSelfMeasureMainId = result.data
  attachInfo.value.taskKey = props.popupParam.envIepsAirSelfMeasureMainId
  attachInfo.value.isSubmit = uid()
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
        url: $format(deleteUrl.value, props.popupParam.envIepsAirSelfMeasureMainId),
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
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function dataChange(_data: any, num: number, row?: any) {
  if (row && row.editFlag !== 'C') {
    row.editFlag = 'U'
    row.chgUserId = user.value.userId
  }
  if (num === 1) {
    console.log(_data)
    measure.value.envAirMstOutletId = _data.envAirMstOutletId
    measure.value.outletName = _data.outletName
    measure.value.outletIepsNo = _data.outletIepsNo
    measure.value.processCd = _data.processCd
    measure.value.processNo = _data.processNo
    measure.value.processName = _data.processName
    measure.value.outletIepsPlantMgtNo = _data.outletIepsPlantMgtNo
    measure.value.outletHeight = _data.outletHeight
    measure.value.outletUpperStackDiameter = _data.outletUpperStackDiameter
    measure.value.outletInnerDiameter = _data.outletInnerDiameter
  } else if (num === 2 && row) {
    row.processCd = _data.processCd
    row.processNo = _data.processNo
    row.processName = _data.processName
  } else if (num === 3 && row) {
    row.envAirMstInspectItemId = _data.envAirMstInspectItemId
    row.inspectItemIepsCd = _data.inspectItemIepsCd
    row.envAirMstInspectItemName = _data.envAirMstInspectItemName
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
    searchParam: { isIeps: 'Y' }
  })
}
function closeItem(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(measure.value.subMeasures, {
          envAirMstInspectItemId: item.envAirMstInspectItemId
        }) === -1
      ) {
        measure.value.subMeasures?.push({
          measureDt: null,
          envIepsAirSelfMeasureMainId: props.popupParam.envIepsAirSelfMeasureMainId,
          envIepsAirSelfMeasureSubId: uid(),
          processCd: measure.value.processCd || '',
          processNo: measure.value.processNo || '',
          processName: measure.value.processName || '',
          envAirMstOutletId: measure.value.envAirMstOutletId || '',
          outletIepsNo: measure.value.outletIepsNo || '',
          outletIepsPlantMgtNo: measure.value.outletIepsPlantMgtNo || '',
          outletHeight: measure.value.outletHeight || '',
          outletUpperStackDiameter: measure.value.outletUpperStackDiameter || '',
          outletInnerDiameter: measure.value.outletInnerDiameter || '',
          inspectItemIepsCd: item.inspectItemIepsCd,
          envAirMstInspectItemId: item.envAirMstInspectItemId,
          envAirMstInspectItemName: item.envAirMstInspectItemName,
          airInspectUnitName: item.airInspectUnitName,
          legalStandard: item.legalStandard,
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
      if (!measure.value.delSubMeasures) measure.value.delSubMeasures = []
      if (
        _.findIndex(measure.value.delSubMeasures, {
          envIepsAirSelfMeasureSubId: item.envIepsAirSelfMeasureSubId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        measure.value.delSubMeasures.push(item)
      }
      measure.value.subMeasures = _.reject(measure.value.subMeasures, item)
    })
  }
}
function datachange(_props: any, col: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  const val = _props.row[col.name]
  let decimalPart = ''
  if (typeof val === 'number') decimalPart = val.toString().split('.')[1]
  else if (typeof val === 'string') decimalPart = val.split('.')[1]
  if (decimalPart && decimalPart.length > 6) {
    message.alert({
      title: '안내',
      message: '소수점 이하 6자리까지만 입력 가능합니다.',
      type: 'warning' // success / info / warning / error
    })
    if (typeof val === 'number') _props.row[col.name] = Math.floor(val * 1_000_000) / 1_000_000
    else if (typeof val === 'string')
      _props.row[col.name] = val.split('.')[0] + '.' + decimalPart.slice(0, 6)
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

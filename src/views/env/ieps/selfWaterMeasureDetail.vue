<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && Boolean(popupParam.envIepsWaterSelfMeasureMainId)"
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
            <div class="col-4">
              <c-text
                :required="true"
                :editable="editable"
                label="측정명"
                name="iepsWaterSelfMeasureName"
                v-model:value="measure.iepsWaterSelfMeasureName"
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
                :customPopupParam="{ targetKey: 'waterOutlet' }"
                label="수질 배출구"
                name="envWaterMstOutletId"
                v-model:value="measure.envWaterMstOutletId"
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
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-upload
          :fullWidth="false"
          :attachInfo="attachInfo"
          :editable="editable"
          label="첨부파일"
        />
        <c-table
          ref="table"
          title="배출구별 IEPS 수질 자가측정기록부"
          :columns="grid.columns"
          :data="measure.subWMeasures"
          :gridHeight="grid.height"
          :editable="editable"
          :columnSetting="false"
          :hideBottom="true"
          :filtering="false"
          :usePaging="false"
          selection="multiple"
          rowKey="envIepsWaterSelfMeasureSubId"
        >
          <template v-slot:suffixTitle>
            <span
              v-if="!measure.envWaterMstOutletId"
              style="color: tomato; font-size: 0.9em"
              class="q-ml-md"
            >
              {{ $language('※ 상단에서 수질배출구를 선택해야 추가 버튼이 표시됩니다.') }}
            </span>
          </template>
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline v-if="editable">
              <c-btn
                v-if="measure.envWaterMstOutletId"
                label="추가"
                icon="add"
                @btnClicked="addItem"
              />
              <c-btn
                v-if="measure.subWMeasures!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="remove"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="['inflowCon', 'outflowCon'].includes(col.name)">
              <c-text-column
                :editable="editable"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props, col)"
              />
            </template>
            <template v-else-if="col.name === 'outflowValue'">
              <c-number-column
                :editable="editable"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props, col)"
              />
            </template>
            <template v-else-if="col.name === 'inflowNo'">
              <c-text-column
                v-if="!Boolean(props.row.inflowExemptionCd)"
                :editable="editable"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
              />
            </template>
            <template v-else-if="col.name === 'envWaterMstInspectItemId'">
              <c-task-target
                :editable="editable"
                name="envWaterMstInspectItemId"
                label=""
                :customPopupParam="{ targetKey: 'waterInspectItemMst' }"
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
                  props.row.outflowCon !== 'ND' &&
                  Number(props.row.outflowCon) > props.row.legalStandard
                "
                style="color: tomato"
              >
                {{ $language('초과') }}</span
              >
              <span
                v-else-if="props.row.outflowCon && props.row.legalStandard"
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
import { measureTypeW } from './iepsAirMeasure'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'selfWaterMeasureDetail'
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
    envIepsWaterSelfMeasureMainId: stringNull
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
      envIepsWaterSelfMeasureMainId: ''
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
      label: '측정항목',
      child: [
        {
          name: 'inspectItemIepsCd',
          field: 'inspectItemIepsCd',
          label: '오염물질코드',
          align: 'center',
          style: 'width: 80px',
          sortable: false
        },
        {
          name: 'envWaterMstInspectItemName',
          field: 'envWaterMstInspectItemName',
          label: '오염물질명',
          align: 'left',
          // type: 'custom',
          style: 'width: 220px',
          sortable: false,
          currentDay: true
        },
        {
          name: 'inflowExemptionCd',
          field: 'inflowExemptionCd',
          label: '유입수측정 면제구분',
          align: 'left',
          type: 'select',
          style: 'width: 120px',
          codeGroupCd: 'INFLOW_EXEMPTION_CD',
          sortable: false,
          setHeader: true
        },
        {
          name: 'inflowNo',
          field: 'inflowNo',
          label: '유입시설번호',
          align: 'center',
          type: 'custom',
          style: 'width: 100px',
          sortable: false,
          setHeader: true
        },
        {
          name: 'inflowCon',
          field: 'inflowCon',
          label: '유입수 농도(mg/l)',
          align: 'center',
          style: 'width: 120px',
          type: 'custom',
          sortable: false,
          setHeader: true
        },
        {
          name: 'outflowCon',
          field: 'outflowCon',
          label: '방류수 농도(mg/l)',
          align: 'center',
          style: 'width: 120px',
          type: 'custom',
          sortable: false,
          currentDay: true
        },
        {
          name: 'outflowValue',
          field: 'outflowCon',
          label: '방류량(㎥/일)',
          align: 'center',
          style: 'width: 80px',
          type: 'decimal',
          pointer: 6,
          sortable: false,
          setHeader: true
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
          name: 'method',
          field: 'method',
          label: '검사방법(기기명)',
          align: 'left',
          style: 'width: 200px',
          type: 'text',
          sortable: false
        }
      ]
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width: 150px',
      type: 'text',
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
const measure = ref<measureTypeW>({
  plantCd: null, // 사업장코드
  envIepsWaterSelfMeasureMainId: '', // 대기 자가측정 일련번호
  measureYm: '', // 대기 자가측정 년도
  envWaterMstOutletId: null, // 대기 배출구
  envWaterMstOutletName: '', // 대기 배출구명
  outletIepsNo: '', // 대기 배출구 IEPS 번호
  processCd: '', // 공정번호
  processNo: '', // 공정번호
  processName: '', // 공정명
  outletIepsPlantMgtNo: '', // 대기 배출구 사업장관리번호
  iepsWaterSelfMeasureName: '', // 대기 자가측정명
  subWMeasures: [], // 대기 자가측정 검사항목
  delSubWMeasures: []
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'ENV_WATER_SELF_MEASURE',
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
  detailUrl.value = selectConfig.env.ieps.water.self.measure.get.url
  deleteUrl.value = transactionConfig.env.ieps.water.self.measure.delete.url
  saveUrl.value = transactionConfig.env.ieps.water.self.measure.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envIepsWaterSelfMeasureMainId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envIepsWaterSelfMeasureMainId: props.popupParam.envIepsWaterSelfMeasureMainId }
    }).then((_result: any) => {
      measure.value = _result.data
      attachInfo.value.taskKey = props.popupParam.envIepsWaterSelfMeasureMainId
      emits('setRegInfo', _result.data)
    })
  } else measure.value.measureYm = getThisMonth()
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envIepsWaterSelfMeasureMainId) {
    mappingType.value = 'PUT'
    measure.value.chgUserId = user.value.userId
  } else {
    mappingType.value = 'POST'
    measure.value.regUserId = user.value.userId
  }
  const hasDuplicates = () => {
    const seen = new Set()
    for (const item of measure.value.subWMeasures || []) {
      const key =
        (item.measureDt?.replace('-', '').slice(0, 8) || '') + (item.envWaterMstInspectItemId || '')
      if (seen.has(key)) return true
      seen.add(key)
    }
    return false
  }
  const check =
    (measure.value.subWMeasures?.length
      ? validTable(grid.value.columns, measure.value.subWMeasures)
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
  props.popupParam.envIepsWaterSelfMeasureMainId = result.data
  attachInfo.value.taskKey = props.popupParam.envIepsWaterSelfMeasureMainId
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
        url: $format(deleteUrl.value, props.popupParam.envIepsWaterSelfMeasureMainId),
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
    measure.value.envWaterMstOutletId = _data.envWaterMstOutletId
    measure.value.envWaterMstOutletName = _data.envWaterMstOutletName
    measure.value.outletIepsPlantMgtNo = _data.outletIepsPlantMgtNo
    measure.value.outletIepsNo = _data.outletIepsNo
    measure.value.processCd = _data.processCd
    measure.value.processNo = _data.processNo
    measure.value.processName = _data.processName
  } else if (num === 3 && row) {
    row.envWaterMstInspectItemId = _data.envWaterMstInspectItemId
    row.inspectItemIepsCd = _data.inspectItemIepsCd
    row.envWaterMstInspectItemName = _data.envWaterMstInspectItemName
    row.waterInspectUnitName = _data.waterInspectUnitName
    row.legalStandard = _data.legalStandard
  }
}
/******************************
 * TODO (목적): row 추가
 *******************************/
function addItem() {
  popupOptions.value = getPopupOptions('waterInspectItemMst', popupOptions.value, closeItem, {
    type: 'multiple'
  })
}
function closeItem(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(measure.value.subWMeasures, {
          envWaterMstInspectItemId: item.envWaterMstInspectItemId
        }) === -1
      ) {
        measure.value.subWMeasures?.push({
          measureDt: null,
          envIepsWaterSelfMeasureMainId: props.popupParam.envIepsWaterSelfMeasureMainId,
          envIepsWaterSelfMeasureSubId: uid(),
          processCd: measure.value.processCd || '',
          processNo: measure.value.processNo || '',
          processName: measure.value.processName || '',
          envWaterMstOutletId: measure.value.envWaterMstOutletId || '',
          outletIepsNo: measure.value.outletIepsNo || '',
          outletIepsPlantMgtNo: measure.value.outletIepsPlantMgtNo || '',
          inspectItemIepsCd: item.inspectItemIepsCd,
          envWaterMstInspectItemId: item.envWaterMstInspectItemId,
          envWaterMstInspectItemName: item.envWaterMstInspectItemName,
          waterInspectUnitName: item.waterInspectUnitName,
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
      if (!measure.value.delSubWMeasures) measure.value.delSubWMeasures = []
      if (
        _.findIndex(measure.value.delSubWMeasures, {
          envIepsWaterSelfMeasureSubId: item.envIepsWaterSelfMeasureSubId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        measure.value.delSubWMeasures.push(item)
      }
      measure.value.subWMeasures = _.reject(measure.value.subWMeasures, item)
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

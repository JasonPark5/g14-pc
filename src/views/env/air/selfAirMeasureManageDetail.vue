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
                  v-if="editable && updateMode"
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
                  name="envAirSelfMeasureMstName"
                  v-model:value="measure.envAirSelfMeasureMstName"
                />
              </div>
              <div class="col-2">
                <c-datepicker
                  :required="true"
                  :editable="editable && !updateMode"
                  label="측정년도"
                  type="year"
                  default="today"
                  name="measureYear"
                  v-model:value="measure.measureYear"
                />
              </div>
              <div class="col-2">
                <c-select
                  :required="true"
                  type="edit"
                  :editable="editable && !updateMode"
                  codeGroupCd="AIR_INSPECT_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="측정구분"
                  name="airInspectTypeCd"
                  v-model:value="measure.airInspectTypeCd"
                />
              </div>
              <!-- <div class="col-2">
                <c-plant
                  :editable="editable && !updateMode"
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
      <div
        class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
        v-show="popupParam.envAirSelfMeasureMstId"
      >
        <c-table
          ref="table"
          title="배출구별 검사결과"
          :columns="grid.columns"
          :data="grid.data"
          :editable="editable"
          :columnSetting="false"
          :filtering="false"
          :gridHeight="grid.height"
        >
          <!-- 버튼 영역 -->
          <template v-slot:suffixTitle>
            <span style="font-size: 0.85em; font-weight: 400; margin-left: 20px">
              <i class="material-icons bg-red-6 text-red-6">check</i>
              {{ $language('법적기준 초과') }}
              <i class="material-icons bg-orange-4 text-orange-4" style="margin-left: 10px"
                >check</i
              >
              {{ $language('내부관리기준 초과') }}
              <i class="material-icons bg-grey-9 text-grey-9" style="margin-left: 10px">check</i>
              {{
                $language('배출구의 자가측정 검사항목 대상이 아닌 경우 or 측정값이 0 이하인 경우')
              }}
            </span>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-checkbox
                :isFlag="true"
                falseLabel="미측정 배출구 포함"
                trueLabel="미측정 배출구 제외"
                name="existData"
                addClasses="tableCheckbox-top"
                v-model:value="existData"
                @update:value="getList"
              />
              <c-btn
                v-if="editable && updateMode"
                label="엑셀업로드"
                icon="upload"
                @btnClicked="excelUploadData"
              />
              <!-- <q-btn
                icon="help"
                color="deep-purple-6"
                text-color="white"
                class="custom-btn"
                align="center"
                round>
                <q-tooltip anchor="bottom left" self="top left">
                  <div class="tooltipCustomTop">
                    (주)
                  </div>
                  <div class="tooltipCustom">
                  법적기준 초과 : <i class="material-icons bg-red-6 text-red-6">check</i><br>
                  내부관리기준 초과 : <i class="material-icons bg-orange-4 text-orange-4">check</i>
                  </div>
                </q-tooltip>
              </q-btn> -->
            </q-btn-group>
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
import { measureType, resultType } from './airMeasure'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'selfAirMeasureManageDetail'
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
    envAirSelfMeasureMstId: stringNull
  }
  contentHeight: stringNull
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
      envAirSelfMeasureMstId: ''
    }
  },
  contentHeight: null
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
      name: 'measureDt',
      field: 'measureDt',
      label: '측정일',
      align: 'center',
      type: 'date',
      style: 'width: 120px',
      sortable: false,
      setHeader: true,
      fix: true
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구',
      align: 'center',
      style: 'width: 80px',
      sortable: false,
      fix: true
    },
    // {
    //   name: 'preventiveName',
    //   field: 'preventiveName',
    //   label: '방지시설',
    //   align: 'center',
    //   style: 'width: 120px',
    //   sortable: false,
    //   fix: true
    // },
    // {
    //   name: 'location',
    //   field: 'location',
    //   label: '위치',
    //   align: 'center',
    //   style: 'width: 100px',
    //   sortable: false,
    //   fix: true
    // },
    {
      name: 'actualTreatmentCapacity',
      field: 'actualTreatmentCapacity',
      label: '처리용량(㎥/분)',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'designTreatmentCapacity',
      field: 'designTreatmentCapacity',
      label: '설계(허가증)용량(㎥/분)',
      align: 'center',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'capacityPercent',
      field: 'capacityPercent',
      label: '허가증기준 유량(%)',
      align: 'center',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'dynamicPressure',
      field: 'dynamicPressure',
      label: '동압',
      align: 'center',
      type: 'number',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'staticPressure',
      field: 'staticPressure',
      label: '정압',
      align: 'center',
      type: 'number',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'gasQuantity',
      field: 'gasQuantity',
      label: '가스유량(S㎥/분)',
      align: 'center',
      type: 'number',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'quantity',
      field: 'quantity',
      label: '유량(%)',
      align: 'center',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'gasTemp',
      field: 'gasTemp',
      label: '가스온도(℃)',
      align: 'center',
      type: 'number',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'waterQuantity',
      field: 'waterQuantity',
      label: '수분량(%)',
      align: 'center',
      type: 'number',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'velocity',
      field: 'velocity',
      label: '유속(m/sec)',
      align: 'center',
      type: 'number',
      style: 'width: 90px',
      sortable: false
    }
  ],
  data: [],
  height: ''
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
  envAirSelfMeasureMstId: '', // 대기 자가측정 일련번호
  measureYear: '', // 대기 자가측정 년도
  airInspectTypeCd: null, // 대기 검사항목 구분
  envAirSelfMeasureMstName: '', // 대기 자가측정명
  airSelfMeasureInspectItems: [] // 대기 자가측정 검사항목
})
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const listUrl = ref('')
const saveUrl = ref(transactionConfig.env.air.self.measure.insert.url)
const deleteUrl = ref('')
const headerUrl = ref('')
const saveOutletUrl = ref('')
const existData = ref('Y')
const envAirMstInspectItemIds = ref<Array<resultType>>([])
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
  detailUrl.value = selectConfig.env.air.self.measure.get.url
  headerUrl.value = selectConfig.env.air.self.outlet.header.url
  listUrl.value = selectConfig.env.air.self.outlet.list.url
  deleteUrl.value = transactionConfig.env.air.self.measure.delete.url
  saveOutletUrl.value = transactionConfig.env.air.self.outlet.save.url
  // code setting
  grid.value.height = window.innerHeight - 240 + 'px'
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 해당 플랜에서의 검진업로드 결과 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envAirSelfMeasureMstId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        envAirSelfMeasureMstId: props.popupParam.envAirSelfMeasureMstId
      }
    }).then((_result: any) => {
      measure.value = _result.data
      emits('setRegInfo', _result.data)
      updateMode.value = true
      getHeader()
    })
  } else {
    measure.value.measureYear = getThisYear()
    updateMode.value = false
  }
}
/******************************
 * TODO (목적): 헤더 조회
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: {
      airInspectTypeCd: measure.value.airInspectTypeCd,
      plantCd: measure.value.plantCd
    }
  }).then((_result: any) => {
    let count = 7
    envAirMstInspectItemIds.value = []
    _.forEach(_result.data, (item: resultType) => {
      envAirMstInspectItemIds.value.push(item.envAirMstInspectItemId)
      grid.value.columns.splice(count, 0, {
        name: item.envAirMstInspectItemId,
        field: item.envAirMstInspectItemId,
        label:
          item.envAirMstInspectItemName +
          (item.airInspectUnitName ? ' (' + item.airInspectUnitName + ')' : ''),
        align: 'center',
        type: 'number',
        // fix: true,
        style: 'width: 90px',
        sortable: false,
        // disableTarget: item.envAirMstInspectItemId + '002',
        // disableCon: 'Y',
        disableData: '-',
        colorClass: ['R,bg-red-6 text-white', 'I,bg-orange-4 text-white'],
        colorTarget: item.envAirMstInspectItemId + '001',
        colorTarget2: item.envAirMstInspectItemId + 'MeasureFlag',
        colorTarget3: item.envAirMstInspectItemId + 'EditFlag',
        colorTarget4: item.envAirMstInspectItemId + '002',
        currentDay: true
        // helpcomment: '법적기준: ' + item.legalStandard + '<br>내부기준: ' + item.innerStandard
      })
      count++
    })
    getList()
  })
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      envAirSelfMeasureMstId: measure.value.envAirSelfMeasureMstId,
      plantCd: measure.value.plantCd,
      envAirMstInspectItemIds: envAirMstInspectItemIds.value,
      airInspectTypeCd: measure.value.airInspectTypeCd,
      existData: existData.value
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envAirSelfMeasureMstId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          measure.value.regUserId = user.value.userId
          measure.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.popupParam.envAirSelfMeasureMstId = result.data.envAirSelfMeasureMstId
  if (mappingType.value === 'PUT') saveRow()
  else {
    getDetail()
    message.requestSuccess()
  }
}
/******************************
 * TODO (목적): 테이블의 선택행 저장
 *******************************/
function saveRow() {
  const saveData = grid.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
  _.forEach(saveData, (item) => {
    item.regUserId = user.value.userId
    item.chgUserId = user.value.userId
  })
  if (saveData.length > 0 && validTable(grid.value.columns, grid.value.data!)) {
    _.forEach(grid.value.data, (item) => {
      const extracted = Object.entries(item)
        .filter(([key, _]) => key.startsWith('AMII') && key.length === 10)
        .map(([key, value]) => ({
          envAirSelfMeasureMstId: item.envAirSelfMeasureMstId,
          envAirMstOutletId: item.envAirMstOutletId,
          envAirMstInspectItemId: key,
          measure: Number(value),
          editFlag: item.editFlag,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        }))
      item.airSelfMeasureInspectItems = extracted
    })
    $http({
      url: saveOutletUrl.value,
      method: 'POST',
      data: grid.value.data
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
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
        url: $format(deleteUrl.value, props.popupParam.envAirSelfMeasureMstId),
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
 * TODO (목적): 엑셀업로드
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '대기-자가측정결과 업로드'
  popupOptions.value.param = { envAirSelfMeasureMstId: props.popupParam.envAirSelfMeasureMstId }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./selfAirMeasureExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelPopup
}
function closeExcelPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item) => !item.error_message)
    _.forEach(s_data, (item) => {
      item.plantCd = measure.value.plantCd
      item.envAirSelfMeasureMstId = props.popupParam.envAirSelfMeasureMstId
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID

      const AirSelfMeasureInspectItemLists = []
      const keys = Object.keys(item)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key.length == 10 && key.indexOf('AMII') > -1 && parseFloat(item[key]) !== undefined) {
          AirSelfMeasureInspectItemLists.push({
            envAirSelfMeasureMstId: item.envAirSelfMeasureMstId,
            envAirMstOutletName: item.envAirMstOutletName,
            envAirMstInspectItemId: key,
            measure: parseFloat(item[key])
          })
        }
      }
      item.airSelfMeasureInspectItems = AirSelfMeasureInspectItemLists
    })
    $http({
      url: saveOutletUrl.value + '/excel',
      method: 'POST',
      data: s_data
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}
// function getData() {
//   grid.value.data = [
//     {
//       col0: 'Y',
//       col1: 'G-10-02',
//       col2: 'G1A (저장~혼합)',
//       col3: '10층',
//       col4: '300',
//       col5: '181.61',
//       col6: '61%',
//       col72: 'Y', // 배출구별 검사항목 여부
//       col7: '0.146',
//       col71: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col82: 'Y', // 배출구별 검사항목 여부
//       col8: '2.12',
//       col81: 'R', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col92: 'Y', // 배출구별 검사항목 여부
//       col9: '불검출',
//       col91: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col102: 'N', // 배출구별 검사항목 여부
//       col10: '-',
//       col101: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col11: '171.17',
//       col12: '57%',
//       col13: '27',
//       col14: '2.7',
//       col15: '10.09',
//     },
//     {
//       col0: 'Y',
//       col1: 'G-10-03',
//       col2: 'G1C (저장~혼합)',
//       col3: '10층',
//       col4: '300',
//       col5: '137.59',
//       col6: '46%',
//       col72: 'Y', // 배출구별 검사항목 여부
//       col7: '0.059',
//       col71: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col82: 'Y', // 배출구별 검사항목 여부
//       col8: '0.68',
//       col81: 'I', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col92: 'Y', // 배출구별 검사항목 여부
//       col9: '불검출',
//       col91: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col102: 'N', // 배출구별 검사항목 여부
//       col10: '-',
//       col101: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col11: '150.4',
//       col12: '50%',
//       col13: '19',
//       col14: '2.7',
//       col15: '8.38',
//     },
//     {
//       col0: 'Y',
//       col1: 'G-07-07',
//       col2: 'G3A (소성)',
//       col3: '8층 옥외',
//       col4: '30',
//       col5: '26.37',
//       col6: '88%',
//       col72: 'Y', // 배출구별 검사항목 여부
//       col7: '0.19',
//       col71: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col82: 'N', // 배출구별 검사항목 여부
//       col8: '-',
//       col81: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col92: 'Y', // 배출구별 검사항목 여부
//       col9: '불검출',
//       col91: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col102: 'Y', // 배출구별 검사항목 여부
//       col10: '1.0',
//       col101: 'N', // N: 적정, R: 법적기준초과, I:내부기준초과
//       col11: '24.21',
//       col12: '81%',
//       col13: '56.0',
//       col14: '9.8',
//       col15: '10.21',
//     }
//   ]
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <q-form ref="editForm">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && updateMode"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="selfWaterMeasureData"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-3">
                <c-plant
                  :editable="editable && !updateMode"
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="selfWaterMeasureData.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-field
                  :required="true"
                  :editable="editable"
                  :data="selfWaterMeasureData"
                  deptValue="deptCd"
                  type="dept_user"
                  label="작성부서 & 작성자"
                  name="userId"
                  v-model:value="selfWaterMeasureData.userId"
                />
              </div>
              <div class="col-2">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  label="측정일"
                  name="measureDt"
                  v-model:value="selfWaterMeasureData.measureDt"
                />
              </div>
              <div class="col-2">
                <c-select
                  type="edit"
                  :editable="editable"
                  codeGroupCd="WEATHER_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="날씨"
                  name="weatherCd"
                  v-model:value="selfWaterMeasureData.weatherCd"
                />
              </div>
              <div class="col-2">
                <c-text
                  :editable="editable"
                  label="온도"
                  suffix="℃"
                  name="temperature"
                  v-model:value="selfWaterMeasureData.temperature"
                />
              </div>
              <div class="col-3">
                <c-select
                  type="edit"
                  :required="true"
                  :editable="editable"
                  codeGroupCd="WATER_MEASURE_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="측정구분"
                  name="waterMeasureTypeCd"
                  v-model:value="selfWaterMeasureData.waterMeasureTypeCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="환경기술인"
                  name="envUserName"
                  v-model:value="selfWaterMeasureData.envUserName"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  label="환경기술인 의견"
                  name="envRemark"
                  v-model:value="selfWaterMeasureData.envRemark"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
    <div
      class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
      v-show="popupParam.envWaterSelfMeasureMstId"
    >
      <c-table
        ref="table"
        title="측정위치별 검사결과"
        :columns="grid.columns"
        :data="grid.data"
        :gridHeight="gridHeight"
        :editable="editable"
        :columnSetting="false"
        :filtering="false"
        :pagePerRow="{ pageNumber: 20 }"
      >
        <!-- 버튼 영역 -->
        <template v-slot:suffixTitle>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 0.85em; font-weight: 300"
            ><i class="material-icons bg-red-6 text-red-6">check</i> 법적기준
            초과&nbsp;&nbsp;&nbsp;<i class="material-icons bg-orange-4 text-orange-4">check</i>
            내부관리기준 초과</span
          >
        </template>
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-checkbox
              :isFlag="true"
              falseLabel="미측정 위치 제외"
              trueLabel="미측정 위치 제외"
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
          </q-btn-group>
        </template>
      </c-table>
      <c-dialog :param="popupOptions" />
    </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'selfWaterMeasureManageDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envWaterSelfMeasureMstId: stringNull
    plantCd: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  columns: Array<tableColumnType>
  data?: Array<any>
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
      envWaterSelfMeasureMstId: '',
      plantCd: ''
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
const selfWaterMeasureData = ref<any>({
  plantCd: null, // 사업장코드
  envWaterSelfMeasureMstId: '', // 수질 자가측정 일련번호
  measureDt: '', // 측정일자
  userId: '', // 작성자
  deptCd: '', // 작성부서
  weatherCd: null, // 날씨
  temperature: '', // 온도
  waterMeasureTypeCd: null, // 수질 자가측정구분
  measureVendorName: '', // 측정업체 또는 측정자
  envUserName: '', // 환경기술인
  envRemark: '' // 환경기술인 의견
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'envWaterMstMeasurelocName',
      field: 'envWaterMstMeasurelocName',
      label: '측정위치 ',
      align: 'center',
      style: 'width: 200px',
      sortable: false,
      fix: true
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: null
})
const editable = ref(true)
const existData = ref('Y')
const editForm = ref<HTMLFormElement | null>(null)
const saveUrl = ref(transactionConfig.env.water.self.measure.insert.url)
const mappingType = ref('POST')
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const headerUrl = ref('')
const listUrl = ref('')
const saveMeasurelocUrl = ref('')
const isSave = ref(false)
const updateMode = ref(false)
const envWaterMstInspectItemIds = ref<any>([])
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 300 + 'px' : '500px'
)
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
  detailUrl.value = selectConfig.env.water.self.measure.get.url
  headerUrl.value = selectConfig.env.water.self.measureloc.header.url
  listUrl.value = selectConfig.env.water.self.measureloc.list.url
  insertUrl.value = transactionConfig.env.water.self.measure.insert.url
  updateUrl.value = transactionConfig.env.water.self.measure.update.url
  deleteUrl.value = transactionConfig.env.water.self.measure.delete.url
  saveMeasurelocUrl.value = transactionConfig.env.water.self.measureloc.save.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterSelfMeasureMstId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envWaterSelfMeasureMstId: props.popupParam.envWaterSelfMeasureMstId }
    }).then((_result: any) => {
      selfWaterMeasureData.value = _result.data
      updateMode.value = true
      getHeader()
    })
  } else {
    selfWaterMeasureData.value.measureDt = getToday()
    selfWaterMeasureData.value.userId = user.value.userId
    selfWaterMeasureData.value.deptCd = user.value.deptCd
    updateMode.value = false
  }
}

/******************************
 * TODO (목적): 측정위치별 검사결과
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: {
      envWaterSelfMeasureMstId: selfWaterMeasureData.value.envWaterSelfMeasureMstId,
      plantCd: selfWaterMeasureData.value.plantCd
    }
  }).then((_result: any) => {
    envWaterMstInspectItemIds.value = []
    _.forEach(_result.data, (item) => {
      envWaterMstInspectItemIds.value.push(item.envWaterMstInspectItemId)
      grid.value.columns.push({
        name: item.envWaterMstInspectItemId,
        field: item.envWaterMstInspectItemId,
        label: item.envWaterMstInspectItemName + '<br>',
        align: 'center',
        type: 'number',
        style: 'width: 90px',
        sortable: false,
        colorClass: ['R,bg-red-6 text-white', 'I,bg-orange-4 text-white'],
        colorTarget: item.envWaterMstInspectItemId + '001',
        helpcomment: '법적기준: ' + item.legalStandard + '<br>내부기준: ' + item.innerStandard
      })
    })
    getList()
  })
}

/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      envWaterSelfMeasureMstId: selfWaterMeasureData.value.envWaterSelfMeasureMstId,
      plantCd: selfWaterMeasureData.value.plantCd,
      envWaterMstInspectItemIds: envWaterMstInspectItemIds.value,
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
  if (props.popupParam.envWaterSelfMeasureMstId) {
    saveUrl.value = updateUrl.value
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    mappingType.value = 'POST'
  }

  editForm.value?.validate().then((_result: boolean) => {
    // 중복체크
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          selfWaterMeasureData.value.regUserId = user.value.userId
          selfWaterMeasureData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}

/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  props.popupParam.envWaterSelfMeasureMstId = result.data.envWaterSelfMeasureMstId
  if (mappingType.value == 'PUT') {
    saveRow()
  } else {
    getDetail()
    message.requestSuccess()
  }
}

/******************************
 * TODO (목적): 저장 실행
 *******************************/
function saveRow() {
  const saveData = grid.value.data!
  if (saveData.length > 0) {
    _.forEach(saveData, (_item) => {
      const WaterSelfMeasureInspectItemLists = []
      _item.regUserId = user.value.userId
      _item.chgUserId = user.value.userId
      const keys = Object.keys(_item)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key.length == 10 && key.indexOf('WMI') > -1 && parseFloat(_item[key]) > 0) {
          WaterSelfMeasureInspectItemLists.push({
            envWaterSelfMeasureMstId: _item.envWaterSelfMeasureMstId,
            envWaterMstMeasurelocId: _item.envWaterMstMeasurelocId,
            envWaterMstInspectItemId: key,
            measure: parseFloat(_item[key])
          })
        }
      }
      _item.waterSelfMeasureInspectItems = WaterSelfMeasureInspectItemLists
    })
    $http({
      url: saveMeasurelocUrl.value,
      method: 'POST',
      data: saveData
    }).then((_result: any) => {
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
    message: '삭제하시겠습니까?',
    type: 'warning',
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envWaterSelfMeasureMstId),
        method: 'DELETE'
      }).then((_result: any) => {
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
  popupOptions.value.title = '수질-자가측정결과 업로드'
  popupOptions.value.param = {
    envWaterSelfMeasureMstId: props.popupParam.envWaterSelfMeasureMstId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./selfWaterMeasureExcelUpload.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}

/******************************
 * TODO (목적): 엑셀업로드 팝업 닫기
 *******************************/
function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item) => {
      return !item.error_message
    })
    _.forEach(s_data, (item) => {
      item.plantCd = selfWaterMeasureData.value.plantCd
      item.envWaterSelfMeasureMstId = props.popupParam.envWaterSelfMeasureMstId
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID

      const WaterSelfMeasureInspectItemLists = []
      const keys = Object.keys(item)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key.length == 10 && key.indexOf('WMI') > -1 && parseFloat(item[key]) !== undefined) {
          WaterSelfMeasureInspectItemLists.push({
            envWaterSelfMeasureMstId: item.envWaterSelfMeasureMstId,
            envWaterMstMeasurelocName: item.envWaterMstMeasurelocName,
            envWaterMstInspectItemId: key,
            measure: parseFloat(item[key])
          })
        }
      }
      item.waterSelfMeasureInspectItems = WaterSelfMeasureInspectItemLists
    })
    $http({
      url: saveMeasurelocUrl.value + '/excel',
      method: 'POST',
      data: s_data
    }).then((_result: any) => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-card title="수질-자가측정 결과 업로드" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <!-- <div class="col-3">
          <c-plant
            :editable="false"
            type="edit"
            name="plantCd"
            v-model:value="selfWaterMeasureData.plantCd"
          />
        </div> -->
        <div class="col-3">
          <c-field
            :editable="false"
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
            :editable="false"
            label="측정일"
            name="measureDt"
            v-model:value="selfWaterMeasureData.measureDt"
          />
        </div>
        <div class="col-2">
          <c-select
            type="edit"
            :editable="false"
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
            :editable="false"
            label="온도"
            suffix="℃"
            name="temperature"
            v-model:value="selfWaterMeasureData.temperature"
          />
        </div>
        <div class="col-3">
          <c-select
            type="edit"
            :editable="false"
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
            :editable="false"
            label="환경기술인"
            name="envUserName"
            v-model:value="selfWaterMeasureData.envUserName"
          />
        </div>
        <div class="col-12">
          <c-text
            :editable="false"
            label="환경기술인 의견"
            name="envRemark"
            v-model:value="selfWaterMeasureData.envRemark"
          />
        </div>
      </template>
    </c-card>
    <c-excel-upload :editable="editable" :excelUploadInfo="excelUploadInfo" />
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
  name: 'selfWaterMeasureExcelUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
interface gridType {
  rowKeys?: Array<string>
  taskClassCd?: string
  sheetNum?: number
  columns: Array<tableColumnType>
  data: Array<any>
  deptCd?: stringNull
  processCd?: stringNull
  workplace?: stringNull
}
interface propType {
  popupParam: {
    envWaterSelfMeasureMstId: stringNull
  }
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
      envWaterSelfMeasureMstId: ''
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
const excelUploadInfo = ref<gridType>({
  rowKeys: ['envWaterMstMeasurelocName'], // 데이터들의 키 속성값
  taskClassCd: 'ENV_WATER_SELFMEASURE', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [
    [
      {
        name: 'envWaterMstMeasurelocName',
        field: 'envWaterMstMeasurelocName',
        label: '측정위치',
        align: 'center',
        style: 'width: 200px',
        sortable: false,
        fix: true
      }
    ]
  ],
  data: [],
  deptCd: '',
  processCd: '',
  workplace: ''
})
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
const headerUrl = ref('')
const editable = ref(true)
const envWaterMstInspectItemIds = ref<any>([])
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
  headerUrl.value = selectConfig.env.water.self.measureloc.header.url
  // code setting
  // list setting
  getDetail()
  getHeader()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterSelfMeasureMstId) {
    $http({
      url: selectConfig.env.water.self.measure.get.url,
      method: 'GET',
      params: { envWaterSelfMeasureMstId: props.popupParam.envWaterSelfMeasureMstId }
    }).then((_result: any) => {
      selfWaterMeasureData.value = _result.data
    })
  }
}

/******************************
 * TODO (목적): 헤더값 조회
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value + '/upload',
    method: 'GET'
  }).then((_result: any) => {
    envWaterMstInspectItemIds.value = []
    _.forEach(_result.data, (item) => {
      envWaterMstInspectItemIds.value.push(item.envWaterMstInspectItemId)
      excelUploadInfo.value.columns[0].push({
        name: item.envWaterMstInspectItemId,
        field: item.envWaterMstInspectItemId,
        type: 'number',
        label: item.envWaterMstInspectItemName,
        align: 'center',
        style: 'width: 90px',
        sortable: false
      })
    })
  })
}

/******************************
 * TODO (목적): 업로드한 데이터를 부모에게 전달
 *******************************/
function acceptData() {
  if (excelUploadInfo.value.data) {
    let dataCntCheck = true
    let errorDataCheck = false
    let duplcheck = false
    if (!excelUploadInfo.value.data[0] || excelUploadInfo.value.data[0].length === 0)
      dataCntCheck = false
    if (_.findIndex(excelUploadInfo.value.data[0], (item: any) => item.error_message) > -1)
      errorDataCheck = true

    const dupl = excelUploadInfo.value.data[0]
      .filter((_item: any) => _item && _item.envWaterMstMeasurelocName)
      .map((_item: any) => _item.envWaterMstMeasurelocName)
    const setCollection = new Set(dupl)
    duplcheck = setCollection.size < dupl.length

    if (!dataCntCheck) {
      message.alert({
        title: '안내',
        message:
          '업로드할 데이터가 없는 Sheet가 있습니다. 데이터 확인 또는 엑셀을 업로드 하였는지 확인바랍니다.',
        type: 'warning'
      })
    } else {
      if (errorDataCheck) {
        message.alert({
          title: '안내',
          message: '에러가 있는 데이터가 존재합니다. 데이터 확인 후 적용하시길 바랍니다.',
          type: 'warning'
        })
      } else if (duplcheck) {
        message.alert({
          title: '안내',
          message: '측정위치를 중복으로 입력할 수 없습니다.', // 업로드할 데이터가 없는 Sheet가 있습니다. 데이터 확인 또는 엑셀을 업로드 하였는지 확인바랍니다.
          type: 'warning' // success / info / warning / error
        })
      } else {
        message.confirm({
          title: '확인',
          message:
            '해당 엑셀데이터를 업로드하면,\n\r기존에 저장된 자가측정데이터를 초기화 한 후에 저장됩니다.\n\r그대로 적용하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            emits('closePopup', excelUploadInfo.value.data[0])
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

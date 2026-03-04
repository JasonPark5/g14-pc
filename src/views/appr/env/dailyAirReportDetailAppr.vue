<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="dailyReport"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-datepicker
                  :editable="editable"
                  label="등록일자"
                  name="dailyResultDt"
                  v-model:value="dailyReport.dailyResultDt"
                  @datachange="getTableData"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-field
                  :editable="editable"
                  :data="dailyReport"
                  deptValue="deptCd"
                  type="dept_user"
                  label="작성부서 & 작성자"
                  name="userId"
                  v-model:value="dailyReport.userId"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="dailyReport.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="WEATHER_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="weatherCd"
                  label="날씨"
                  v-model:value="dailyReport.weatherCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="온도"
                  suffix="℃"
                  name="temperature"
                  v-model:value="dailyReport.temperature"
                />
              </div>
            </template>
          </c-card>
          <c-table
            ref="table1"
            title="배출구별 가동시간"
            :columns="grid1.columns"
            :data="grid1.data"
            :usePaging="false"
            :columnSetting="false"
            :filtering="true"
            :isExcelDown="false"
            gridHeight="300px"
          />
          <c-table
            ref="table2"
            title="시설 운전사항"
            :columns="grid2.columns"
            :data="grid2.data"
            :usePaging="false"
            :columnSetting="false"
            :filtering="true"
            :isExcelDown="false"
            gridHeight="300px"
          />
          <c-table
            ref="table3"
            title="시설 보수사항"
            :columns="grid3.columns"
            :data="grid3.data"
            :usePaging="false"
            :columnSetting="false"
            :filtering="true"
            :isExcelDown="false"
            gridHeight="250px"
          />
          <c-table
            ref="table4"
            title="연료사용량"
            :columns="grid4.columns"
            :data="grid4.data"
            :usePaging="false"
            :columnSetting="false"
            :filtering="true"
            :isExcelDown="false"
            gridHeight="250px"
          />
          <c-table
            ref="table5"
            title="원료사용량"
            :columns="grid5.columns"
            :data="grid5.data"
            :usePaging="false"
            :columnSetting="false"
            :filtering="true"
            :isExcelDown="false"
            gridHeight="250px"
          />
        </div>
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
import { dailyReportType } from '../../env/air/airMeasure'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dailyAirReportDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  popupParam: {
    plantCd?: stringNull
    envAirDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
    approvalStatusCd?: stringNull
    approvalTarget?: boolean
  }
  contentHeight?: stringNull
}

interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
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
      plantCd: null,
      envAirDailyResultId: '',
      dailyResultDt: '',
      approvalStatusCd: null,
      approvalTarget: false
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
const dailyReport = ref<dailyReportType>({
  plantCd: null, // 사업장코드
  envAirDailyResultId: '', // 대기일지 일련번호
  dailyResultDt: '', // 작성일
  deptCd: '', // 작성부서
  userId: '', // 작성자
  weatherCd: null, // 날씨
  temperature: '', // 온도
  outletOpertimes: [],
  preventiveOperations: [],
  preventiveMaintenances: [],
  fuelUsages: [],
  materialUsages: []
})
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구일련번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '허가증상배출구번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'operationHour',
      field: 'operationHour',
      label: '배출구 가동시간(시간)',
      style: 'width:100px',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'operationMin',
      field: 'operationMin',
      label: '배출구 가동시간(분)',
      style: 'width:100px',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:200px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      style: 'width:110px',
      align: 'left',
      sortable: false,
      fix: true
    },
    {
      name: 'envAirMstWattmeterNo',
      field: 'envAirMstWattmeterNo',
      label: '전력계번호',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'wattmeterReading',
      field: 'wattmeterReading',
      label: '전력검침량(kWh)',
      style: 'width:80px',
      align: 'right',
      sortable: false
    },
    {
      name: 'envAirMstDrug1Name',
      field: 'envAirMstDrug1Name',
      label: '약품명1',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugVolume1',
      field: 'drugVolume1',
      label: '사용량1',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrugUnitName1',
      field: 'envAirMstDrugUnitName1',
      label: '단위1',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug2Name',
      field: 'envAirMstDrug2Name',
      label: '약품명2',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugVolume2',
      field: 'drugVolume2',
      label: '사용량2',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrugUnitName2',
      field: 'envAirMstDrugUnitName2',
      label: '단위2',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug3Name',
      field: 'envAirMstDrug3Name',
      label: '약품명3',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugVolume3',
      field: 'drugVolume3',
      label: '사용량3',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrugUnitName3',
      field: 'envAirMstDrugUnitName3',
      label: '단위3',
      style: 'width:40px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const grid3 = ref<gridType>({
  columns: [
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'period',
      field: 'period',
      label: '보수기간',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '보수자',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '보수명세',
      style: 'width:150px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const grid4 = ref<gridType>({
  columns: [
    {
      name: 'usageDt',
      field: 'usageDt',
      label: '일자',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설명',
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'envAirMstFuelName',
      field: 'envAirMstFuelName',
      label: '연료명',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'airFuelUnitName',
      field: 'airFuelUnitName',
      label: '단위',
      style: 'width:35px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume',
      field: 'usageVolume',
      label: '사용량',
      style: 'width:60px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const grid5 = ref<gridType>({
  columns: [
    {
      name: 'envAirMstMaterialName',
      field: 'envAirMstMaterialName',
      label: '원료명',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'airMaterialUnitName',
      field: 'airMaterialUnitName',
      label: '단위',
      style: 'width:35px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume',
      field: 'usageVolume',
      label: '사용량',
      style: 'width:60px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(false)
const editForm = ref<HTMLFormElement | null>(null)
const detailUrl = ref('')
const tableDataUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')

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
  detailUrl.value = selectConfig.env.air.daily.result.get.url
  tableDataUrl.value = selectConfig.env.air.daily.report.get.url
  saveUrl.value = transactionConfig.env.air.daily.result.insert.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 일지 기본정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envAirDailyResultId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        envAirDailyResultId: props.popupParam.envAirDailyResultId
      }
    }).then((_result: any) => {
      dailyReport.value = _result.data
      getTableData()
    })
  } else {
    dailyReport.value = {
      plantCd: user.value.plantCd, // 사업장코드
      envAirDailyResultId: uid(), // 대기일지 일련번호
      dailyResultDt: getToday(),
      userId: user.value.userId,
      deptCd: user.value.deptCd,
      weatherCd: null, // 날씨
      temperature: '', // 온도
      outletOpertimes: [],
      preventiveOperations: [],
      preventiveMaintenances: [],
      fuelUsages: [],
      materialUsages: []
    }
    getTableData()
  }
}

/******************************
 * TODO (목적): 일지 기본정보 조회
 *******************************/
function getTableData() {
  if (dailyReport.value.dailyResultDt) {
    $http({
      url: tableDataUrl.value,
      method: 'GET',
      params: {
        dailyResultDt: dailyReport.value.dailyResultDt
      }
    }).then((_result: any) => {
      console.log(_result.data)
      grid1.value.data = _result.data.outletOpertimes
      grid2.value.data = _result.data.preventiveOperations
      grid3.value.data = _result.data.preventiveMaintenances
      grid4.value.data = _result.data.fuelUsages
      grid5.value.data = _result.data.materialUsages
      _.forEach(grid3.value.data, (item) => {
        item.period = `${item.startDt} ~ ${item.endDt}`
      })
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envAirDailyResultId ? 'PUT' : 'POST'

  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          console.log(dailyReport.value)
          dailyReport.value.regUserId = user.value.userId
          dailyReport.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.popupParam.envAirDailyResultId = result.data.envAirDailyResultId
  message.requestSuccess()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                label="가동일자(월)"
                type="month"
                name="operationMonth"
                v-model:value="searchParam.operationMonth"
                @datachange="getList"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-task-target
                :required="true"
                label="방지시설"
                name="envAirMstPreventiveId"
                :customPopupParam="{ targetKey: 'airPreventive' }"
                v-model:value="searchParam.envAirMstPreventiveId"
                @dataChange="getWattmeter"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                :required="true"
                :editable="editable && searchParam.envAirMstPreventiveId !== ''"
                type="edit"
                :comboItems="wattmeterItems"
                label="적산전력계번호"
                itemText="codeName"
                itemValue="code"
                name="envAirMstWattmeterId"
                v-model:value="searchParam.envAirMstWattmeterId"
                @datachange="getList"
              />
            </div>
          </template>
        </c-card>
        <c-table
          ref="table"
          :title="`${searchParam.operationMonth ? searchParam.operationMonth : ''} 시설운전사항 목록`"
          :columns="grid.columns"
          :data="grid.data"
          :usePaging="true"
          :columnSetting="false"
          :filtering="true"
          :isExcelDown="false"
          gridHeight="598px"
          @table-data-change="tableDataChange"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="grid.data"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveOperation"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import moment from 'moment'

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
  name: 'airOutletOpertimeDetail02'
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
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
}
interface searchParamType {
  operationMonth: stringNull
  envAirMstWattmeterId: stringNull
  envAirMstPreventiveId: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref<searchParamType>({
  operationMonth: '',
  envAirMstWattmeterId: '',
  envAirMstPreventiveId: ''
})
const drugItems = ref<codeMasterType>([])
const grid = ref<gridType>({
  columns: [
    {
      name: 'operationDate',
      field: 'operationDate',
      label: '운전일자',
      style: 'width:80px',
      align: 'center',
      sortable: true,
      fix: true
    },
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구<br>일련번호',
      style: 'width:60px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      style: 'width:110px',
      align: 'left',
      sortable: false,
      fix: true
    },
    {
      name: 'preventiveSemsId',
      field: 'preventiveSemsId',
      label: '방지시설<br>일련번호',
      style: 'width:70px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'preventivePermitNo',
      field: 'preventivePermitNo',
      label: '허가증상<br>방지시설번호',
      style: 'width:90px',
      align: 'center',
      sortable: false,
      fix: true
    },
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
      type: 'text',
      style: 'width:80px',
      align: 'right',
      sortable: false,
      setHeader: true
    },
    {
      name: 'actualTreatmentCapacity',
      field: 'actualTreatmentCapacity',
      label: '처리용량(㎡/MIN)',
      style: 'width:80px',
      align: 'right',
      sortable: false
    },
    {
      name: 'treatItems',
      field: 'treatItems',
      label: '처리오염물질',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'actualTreatmentEfficiency',
      field: 'actualTreatmentEfficiency',
      label: '처리효율(%)',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug1Id',
      field: 'envAirMstDrug1Id',
      label: '약품명1',
      type: 'select',
      comboItems: drugItems.value,
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugVolume1',
      field: 'drugVolume1',
      label: '사용량1',
      style: 'width:60px',
      type: 'text',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'airDrugUnitName1',
      field: 'airDrugUnitName1',
      label: '단위1',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug2Id',
      field: 'envAirMstDrug2Id',
      label: '약품명2',
      type: 'select',
      comboItems: drugItems.value,
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugVolume2',
      field: 'drugVolume2',
      label: '사용량2',
      style: 'width:60px',
      type: 'text',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'airDrugUnitName2',
      field: 'airDrugUnitName2',
      label: '단위2',
      style: 'width:40px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDrug3Id',
      field: 'envAirMstDrug3Id',
      label: '약품명3',
      type: 'select',
      comboItems: drugItems.value,
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugVolume3',
      field: 'drugVolume3',
      label: '사용량3',
      style: 'width:60px',
      type: 'text',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'airDrugUnitName3',
      field: 'airDrugUnitName3',
      label: '단위3',
      style: 'width:40px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const editForm = ref<HTMLFormElement | null>(null)
const editable = ref(true)
const listUrl = ref('')
const wattmeterListUrl = ref('')
const drugListUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const wattmeterItems = ref<codeMasterType>([])

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
  listUrl.value = selectConfig.env.air.sems.preventiveOperation.preventive.url
  wattmeterListUrl.value = selectConfig.env.air.mst.preventive.wattmeter.list.url
  drugListUrl.value = selectConfig.env.air.mst.drug.list.url
  saveUrl.value = transactionConfig.env.air.sems.preventiveOperation.save.url
  // code setting
  searchParam.value.operationMonth = getThisMonth()
  // list setting
  getDrug()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (
    !searchParam.value.operationMonth ||
    !searchParam.value.envAirMstPreventiveId ||
    !searchParam.value.envAirMstWattmeterId
  ) {
    grid.value.data = []
    // message.alert({
    //   title: '안내',
    //   message: '사업장과 가동일자를 선택해주세요.',
    //   type: 'warning'
    // })
  } else {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      console.log(_result.data)
      const [year, month] = searchParam.value.operationMonth.split('-').map(Number)
      const dateList = getAllDatesInMonth(year, month)
      const outletList: any = _.uniqBy(_result.data, 'envAirMstOutletId')
      grid.value.data = []

      _.forEach(outletList, (item) => {
        _.forEach(dateList, (date) => {
          const found = _.find(_result.data, {
            operationDate: date,
            envAirMstOutletId: item.envAirMstOutletId
          })
          grid.value.data.push(
            found
              ? found
              : {
                  envAirSemsOutletOpertimeId: '',
                  operationDate: date,
                  envAirMstOutletId: item.envAirMstOutletId,
                  outletSemsId: item.outletSemsId,
                  outletName: item.outletName,
                  envAirMstPreventiveId: item.envAirMstPreventiveId,
                  preventiveSemsId: item.preventiveSemsId,
                  preventivePermitNo: item.preventivePermitNo,
                  preventiveName: item.preventiveName,
                  envAirMstWattmeterId: item.envAirMstWattmeterId,
                  envAirMstWattmeterNo: item.envAirMstWattmeterNo,
                  wattmeterReading: '',
                  actualTreatmentCapacity: item.actualTreatmentCapacity,
                  treatItems: item.treatItems,
                  actualTreatmentEfficiency: item.actualTreatmentEfficiency
                }
          )
        })

        if (item.envAirMstDrug1Id) {
          const drug = drugItems.value.find((d: any) => d.code === item.envAirMstDrug1Id)
          item.airDrugUnitName1 = drug ? drug.drugUnitName : ''
        }
        if (item.envAirMstDrug2Id) {
          const drug = drugItems.value.find((d: any) => d.code === item.envAirMstDrug2Id)
          item.airDrugUnitName2 = drug ? drug.drugUnitName : ''
        }
        if (item.envAirMstDrug3Id) {
          const drug = drugItems.value.find((d: any) => d.code === item.envAirMstDrug3Id)
          item.airDrugUnitName3 = drug ? drug.drugUnitName : ''
        }
      })
    })
  }
}
/******************************
 * TODO (목적): 적산전력계 조회
 *******************************/
function getWattmeter() {
  wattmeterItems.value = []
  searchParam.value.envAirMstWattmeterId = ''
  $http({
    url: wattmeterListUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      wattmeterItems.value.push({
        code: item.envAirMstWattmeterId,
        codeName: item.envAirMstWattmeterName
      })
    })
  })
}
/******************************
 * TODO (목적): 약품 조회
 *******************************/
function getDrug() {
  $http({
    url: drugListUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      drugItems.value.push({
        code: item.envAirMstDrugId,
        codeName: item.envAirMstDrugName,
        drugUnitName: item.airDrugUnitName
      })
    })
  })
}
/******************************
 * TODO (목적): 가동시간 데이터 변경에 따른 editFlag 설정
 *******************************/
function tableDataChange(_props: any, col: any) {
  _props.row.editFlag = 'U'

  if (col.name === 'envAirMstDrug1Id') {
    const drug = drugItems.value.find((d: any) => d.code === _props.row.envAirMstDrug1Id)
    _props.row.airDrugUnitName1 = drug ? drug.drugUnitName : ''
  }
  if (col.name === 'envAirMstDrug2Id') {
    const drug = drugItems.value.find((d: any) => d.code === _props.row.envAirMstDrug2Id)
    _props.row.airDrugUnitName2 = drug ? drug.drugUnitName : ''
  }
  if (col.name === 'envAirMstDrug3Id') {
    const drug = drugItems.value.find((d: any) => d.code === _props.row.envAirMstDrug3Id)
    _props.row.airDrugUnitName3 = drug ? drug.drugUnitName : ''
  }
}

/******************************
 * TODO (목적): 달력 리스트 생성
 *******************************/
function getAllDatesInMonth(year: number, month: number) {
  const start = moment([year, month - 1, 1])
  const end = moment(start).endOf('month')
  const result = []
  const current = start.clone()
  while (current.isSameOrBefore(end)) {
    result.push(current.format('YYYY-MM-DD'))
    current.add(1, 'day')
  }
  return result
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveOperation() {
  mappingType.value = 'PUT'
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          _.forEach(grid.value.data, (item) => {
            const hasInput =
              !!item.wattmeterReading ||
              !!item.drugVolume1 ||
              !!item.envAirMstDrug1Id ||
              !!item.drugVolume2 ||
              !!item.envAirMstDrug2Id ||
              !!item.drugVolume3 ||
              !!item.envAirMstDrug3Id

            if (!item.envAirSemsPreventiveOperationId && hasInput) {
              item.editFlag = 'C'
            }
            item.regUserId = user.value.userId
            item.chgUserId = user.value.userId
          })
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
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

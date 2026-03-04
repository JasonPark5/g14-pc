<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-description>
              <span style="font-size: 0.8em; font-weight: 500; color: tomato; margin-left: 10px">
                ※
                {{
                  $language(
                    '방지시설 기본정보는 SEMS(대기배출원관리시스템)와 IEPS(통합환경허가시스템)에 등록된 정보와 반드시 일치해야 합니다.'
                  )
                }}
              </span>
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="airPreventiveMst"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="airPreventiveMst.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="방지시설명"
                  name="preventiveName"
                  v-model:value="airPreventiveMst.preventiveName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="방지시설ID(SEMS)"
                  name="preventiveSemsFacilityId"
                  v-model:value="airPreventiveMst.preventiveSemsFacilityId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="방지시설 일련번호(SEMS)"
                  name="preventiveSemsId"
                  v-model:value="airPreventiveMst.preventiveSemsId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="허가증상 방지시설번호(SEMS)"
                  name="preventivePermitNo"
                  v-model:value="airPreventiveMst.preventivePermitNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="IEPS시설여부"
                  name="iepsFlag"
                  v-model:value="airPreventiveMst.iepsFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="방지시설 관리번호(IEPS)"
                  name="preventiveIepsNo"
                  v-model:value="airPreventiveMst.preventiveIepsNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="사업장 관리번호(IEPS)"
                  name="preventiveIepsPlantMgtNo"
                  v-model:value="airPreventiveMst.preventiveIepsPlantMgtNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="airPreventiveMst.deptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :editable="editable"
                  label="방지시설 분류"
                  name="preventiveTypeCd"
                  codeGroupCd="ENV_IEPS_PREVENTIVE_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  type="edit"
                  v-model:value="airPreventiveMst.preventiveTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  :editable="editable"
                  label="IEPS 공정"
                  name="processCd"
                  :customPopupParam="{ targetKey: 'envProcess' }"
                  v-model:value="airPreventiveMst.processCd"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  readonly
                  label="IEPS 공정번호"
                  name="processNo"
                  v-model:value="airPreventiveMst.processNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="IEPS방지시설명"
                  name="preventiveIepsName"
                  v-model:value="airPreventiveMst.preventiveIepsName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="설치위치"
                  name="location"
                  v-model:value="airPreventiveMst.location"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  suffix="㎥/hr"
                  type="number"
                  :editable="editable"
                  label="처리용량"
                  name="actualTreatmentCapacity"
                  v-model:value="airPreventiveMst.actualTreatmentCapacity"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="전력계부착여부"
                  name="wattmeterFlag"
                  v-model:value="airPreventiveMst.wattmeterFlag"
                  @update:value="changeWattmeterFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="airPreventiveMst.useFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="압력차 측정여부"
                  name="useFlag"
                  v-model:value="airPreventiveMst.pressureDiffFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="온도 측정여부"
                  name="useFlag"
                  v-model:value="airPreventiveMst.temperatureFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="PH 측정여부"
                  name="useFlag"
                  v-model:value="airPreventiveMst.phFlag"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="table1"
            title="처리오염물질"
            :columns="grid1.columns"
            :data="airPreventiveMst.treatItems"
            :isFullScreen="false"
            :columnSetting="false"
            :isExcelDown="false"
            :usePaging="false"
            gridHeight="395px"
            selection="multiple"
            rowKey="envAirMstInspectItemId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && airPreventiveMst.envAirMstPreventiveId"
                  label="추가"
                  icon="add"
                  @btnClicked="addItem(1)"
                />
                <c-btn
                  v-if="editable && !treatItemDisabled"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeItem(1)"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="table2"
            title="적산전력계"
            :columns="grid2.columns"
            :data="airPreventiveMst.wattmeters"
            :isFullScreen="false"
            :columnSetting="false"
            :isExcelDown="false"
            :usePaging="false"
            gridHeight="395px"
            selection="multiple"
            rowKey="envAirMstWattmeterId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !wattmeterDisabled"
                  label="추가"
                  icon="add"
                  @btnClicked="addItem(2)"
                />
                <c-btn
                  v-if="
                    editable &&
                    !wattmeterDisabled &&
                    airPreventiveMst.wattmeters &&
                    airPreventiveMst.wattmeters.length > 0
                  "
                  label="제외"
                  icon="remove"
                  @btnClicked="removeItem(2)"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="table3"
            title="연결 배출구 및 배출시설"
            :columns="grid3.columns"
            :data="grid3.data"
            :isFullScreen="false"
            :usePaging="false"
            :columnSetting="false"
            :isExcelDown="false"
            gridHeight="395px"
            @linkClick="linkClick"
          />
        </div>
      </div>
    </q-form>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { airPreventiveType } from './airMaster'

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
  name: 'airPreventiveInfo'
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
const emits = defineEmits(['insertPreventiveInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    envAirMstPreventiveId?: stringNull
    plantCd?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  columns: Array<tableColumnType>
  data?: any
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      envAirMstPreventiveId: '',
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
const airPreventiveMst = ref<airPreventiveType>({
  plantCd: null, // 사업장코드
  envAirMstPreventiveId: '', // 대기방지시설 시스템일련번호
  preventiveSemsFacilityId: '',
  preventiveName: '', // 대기방지시설명
  preventiveSemsId: '', // 대기방지시설 SEMS 일련번호
  preventivePermitNo: '', // 허가증상 방지시설번호
  preventiveIepsNo: '', // IEPS 방지시설 관리번호
  preventiveIepsPlantMgtNo: '', // IEPS 사업장 관리번호
  preventiveIepsName: '',
  preventiveTypeCd: '', // 방지시설분류코드
  location: '', // 위치
  designTreatmentCapacity: null, // 설계처리용량
  actualTreatmentCapacity: null, // 실제처리용량
  designTreatmentEfficiency: null, // 설계처리효율
  actualTreatmentEfficiency: null, // 실제처리효율
  handlingConcentration: '', // 처리농도
  wattmeterFlag: 'Y', // 전력계부착여부
  pressureDiffFlag: 'N',
  temperatureFlag: 'N',
  phFlag: 'N',
  deptCd: '', // 관리부서 코드
  processCd: '',
  processNo: '',
  processName: '',
  iepsFlag: 'Y',
  useFlag: 'Y', // 사용여부
  treatItems: [], // 처리오염물질
  deleteTreatItems: [],
  wattmeters: [], // 적산전력계
  deleteWattmeters: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'airInspectTypeName',
      field: 'airInspectTypeName',
      label: '구분',
      align: 'center',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'envAirMstInspectItemName',
      field: 'envAirMstInspectItemName',
      label: '처리오염물질',
      align: 'center',
      style: 'width:40%',
      sortable: false
    },
    {
      name: 'airInspectUnitName',
      field: 'airInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width:30%',
      sortable: false
    }
  ]
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'envAirMstWattmeterNo',
      field: 'envAirMstWattmeterNo',
      label: '적산전력계 번호',
      align: 'center',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'envAirMstWattmeterName',
      field: 'envAirMstWattmeterName',
      label: '적산전력계 구분명',
      align: 'center',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'wattmeterUnit',
      field: 'wattmeterUnit',
      label: '단위',
      align: 'center',
      style: 'width:20%',
      sortable: false
    },
    {
      name: 'wattmeterMagnification',
      field: 'wattmeterMagnification',
      label: '배율',
      align: 'center',
      style: 'width:20%',
      sortable: false
    }
  ]
})
const grid3 = ref<gridType>({
  columns: [
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구',
      align: 'center',
      type: 'link',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설',
      align: 'center',
      type: 'link',
      style: 'width:30%',
      sortable: false
    }
  ],
  data: []
})
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const detailUrl = ref('')
const structureLinkUrl = ref('')
const saveUrl = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const treatItemDisabled = computed(() => {
  return (
    !airPreventiveMst.value.envAirMstPreventiveId ||
    !(airPreventiveMst.value.treatItems && airPreventiveMst.value.treatItems.length > 0)
  )
})
const wattmeterDisabled = computed(() => {
  return (
    !airPreventiveMst.value.envAirMstPreventiveId || airPreventiveMst.value.wattmeterFlag === 'N'
  )
})
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
  detailUrl.value = selectConfig.env.air.mst.preventive.get.url
  structureLinkUrl.value = selectConfig.env.air.mst.preventive.link.url
  saveUrl.value = transactionConfig.env.air.mst.preventive.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.param.envAirMstPreventiveId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envAirMstPreventiveId: props.param.envAirMstPreventiveId }
    }).then((_result: any) => {
      airPreventiveMst.value = _result.data
      getStructureLink()
    })
  }
}

/******************************
 * TODO (목적): 연결 시설 조회
 *******************************/
function getStructureLink() {
  $http({
    url: structureLinkUrl.value,
    method: 'GET',
    params: { envAirMstPreventiveId: props.param.envAirMstPreventiveId }
  }).then((_result: any) => {
    grid3.value.data = _result.data
  })
}

function dataChange(_data1: any, _data2: any, _data3: any) {
  airPreventiveMst.value.processNo = _data3.processNo
}

/******************************
 * TODO (목적): 행 추가
 *******************************/
function addItem(num: number) {
  popupOptions.value = getPopupOptions(
    num === 1 ? 'airInspectItemMst' : 'airWattmeter',
    popupOptions.value,
    num === 1 ? closeInspectItem : closeWattmeter,
    {
      type: 'multiple',
      searchParam: { plantCd: airPreventiveMst.value.plantCd }
    }
  )
}
function closeInspectItem(_data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(airPreventiveMst.value.treatItems, {
          envAirMstInspectItemId: item.envAirMstInspectItemId
        }) === -1
      ) {
        airPreventiveMst.value.treatItems!.push({
          ...item,
          envAirMstPreventiveId: airPreventiveMst.value.envAirMstPreventiveId,
          editFlag: 'C',
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
  }
}
function closeWattmeter(_data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(airPreventiveMst.value.wattmeters, {
          envAirMstWattmeterId: item.envAirMstWattmeterId
        }) === -1
      ) {
        airPreventiveMst.value.wattmeters!.push({
          ...item,
          envAirMstPreventiveId: airPreventiveMst.value.envAirMstPreventiveId,
          editFlag: 'C',
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 행 삭제
 *******************************/
function removeItem(num: number) {
  if (num === 1) {
    const selectData = table1.value.getSelected()
    if (!selectData || selectData.length === 0) {
      message.alert({
        title: '안내',
        message: '선택된 항목이 없습니다.',
        type: 'warning' // success / info / warning / error
      })
    } else {
      if (!airPreventiveMst.value.deleteTreatItems) airPreventiveMst.value.deleteTreatItems = []
      _.forEach(selectData, (item) => {
        if (
          item.editFlag !== 'C' &&
          _.findIndex(airPreventiveMst.value.deleteTreatItems, {
            envAirMstInspectItemId: item.envAirMstInspectItemId
          }) === -1
        )
          airPreventiveMst.value.deleteTreatItems!.push(item)
        airPreventiveMst.value.treatItems = _.reject(airPreventiveMst.value.treatItems, item)
      })
      table2.value.compoTable.clearSelection()
    }
  }
  if (num === 2) {
    const selectData = table2.value.getSelected()
    if (!selectData || selectData.length === 0) {
      message.alert({
        title: '안내',
        message: '선택된 항목이 없습니다.',
        type: 'warning' // success / info / warning / error
      })
    } else {
      if (!airPreventiveMst.value.deleteWattmeters) airPreventiveMst.value.deleteWattmeters = []
      _.forEach(selectData, (item) => {
        if (
          item.editFlag !== 'C' &&
          _.findIndex(airPreventiveMst.value.deleteWattmeters, {
            envAirMstWattmeterId: item.envAirMstWattmeterId
          }) === -1
        )
          airPreventiveMst.value.deleteWattmeters!.push(item)
        airPreventiveMst.value.wattmeters = _.reject(airPreventiveMst.value.wattmeters, item)
      })
      table2.value.compoTable.clearSelection()
    }
  }
}
/******************************
 * TODO (목적): 적산전력계 부착여부 체크변경시
 *******************************/
function changeWattmeterFlag() {
  if (
    airPreventiveMst.value.wattmeterFlag == 'N' &&
    airPreventiveMst.value.wattmeters!.length > 0
  ) {
    message.confirm({
      title: '확인',
      message: '체크를 해제하면 입력된 전력계 정보가 삭제됩니다. 진행하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(airPreventiveMst.value.wattmeters, (item) => {
          if (!airPreventiveMst.value.deleteWattmeters) {
            airPreventiveMst.value.deleteWattmeters = []
          }
          if (
            _.findIndex(airPreventiveMst.value.deleteWattmeters, {
              envAirMstWattmeterId: item.envAirMstWattmeterId
            }) === -1
          ) {
            airPreventiveMst.value.deleteWattmeters!.push(item)
          }
        })
        airPreventiveMst.value.wattmeters = []
      },
      cancelCallback: () => {
        airPreventiveMst.value.wattmeterFlag = 'Y'
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.param.envAirMstPreventiveId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          airPreventiveMst.value.regUserId = user.value.userId
          airPreventiveMst.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  props.param.envAirMstPreventiveId = result.data.envAirMstPreventiveId
  message.requestSuccess()
  if (mappingType.value === 'POST') emits('insertPreventiveInfo', result.data.envAirMstPreventiveId)
  getDetail()
}

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row?: any, col?: any) {
  if (col.name === 'outletName') {
    popupOptions.value.title = '대기 배출구 상세'
    popupOptions.value.param = {
      envAirMstOutletId: row.envAirMstOutletId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/env/air/mst/airOutletDetail.vue`))
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '대기 배출시설 상세'
    popupOptions.value.param = {
      envAirMstDischargeId: row.envAirMstDischargeId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/env/air/mst/airDischargeDetail.vue`))
    )
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
  }

  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

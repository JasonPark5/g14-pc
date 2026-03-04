<template>
  <div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
          <q-form ref="editForm">
            <c-card title="기본정보" class="cardClassDetailForm">
              <template v-slot:card-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable"
                    :url="saveUrl"
                    :isSubmit="isSave"
                    :param="infoData"
                    :mappingType="mappingType"
                    label="저장"
                    icon="save"
                    @beforeAction="saveInfo"
                    @btnCallback="saveCallback"
                  />
                </q-btn-group>
              </template>
              <template v-slot:card-detail>
                <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-plant
                    :required="true"
                    :editable="editable"
                    type="edit"
                    name="plantCd"
                    v-model:value="infoData.plantCd"
                  />
                </div> -->
                <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                  <c-text
                    :required="true"
                    :editable="editable"
                    label="방지시설명"
                    name="envWaterMstPreventiveName"
                    v-model:value="infoData.envWaterMstPreventiveName"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-dept
                    type="edit"
                    :editable="editable"
                    label="관리부서"
                    name="deptCd"
                    v-model:value="infoData.deptCd"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-task-target
                    :editable="editable"
                    label="IEPS 공정"
                    name="processCd"
                    :customPopupParam="{ targetKey: 'envProcess' }"
                    v-model:value="infoData.processCd"
                    @dataChange="dataChange"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-text
                    readonly
                    label="IEPS 공정번호"
                    name="processNo"
                    v-model:value="infoData.processNo"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-text
                    :editable="editable"
                    label="방지시설 관리번호(IEPS)"
                    name="preventiveIepsNo"
                    v-model:value="infoData.preventiveIepsNo"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-text
                    :editable="editable"
                    label="사업장 관리번호(IEPS)"
                    name="preventiveIepsPlantMgtNo"
                    v-model:value="infoData.preventiveIepsPlantMgtNo"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-text
                    :editable="editable"
                    label="IEPS방지시설명"
                    name="preventiveIepsName"
                    v-model:value="infoData.preventiveIepsName"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    label="IEPS시설여부"
                    name="iepsFlag"
                    v-model:value="infoData.iepsFlag"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    label="전력계부착여부"
                    name="wattmeterFlag"
                    v-model:value="infoData.wattmeterFlag"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    label="사용여부"
                    name="useFlag"
                    v-model:value="infoData.useFlag"
                  />
                </div>
              </template>
            </c-card>
          </q-form>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-table
            ref="wattTable"
            title="전력량계"
            selection="multiple"
            :editable="editable"
            :columnSetting="false"
            :isFullScreen="false"
            :columns="wattmeterGrid.columns"
            :usePaging="false"
            :data="infoData.wattmeters"
            rowKey="envWaterMstWattmeterId"
            gridHeight="324px"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && infoData.wattmeterFlag === 'Y'"
                  label="추가"
                  icon="add"
                  @btnClicked="addData(1)"
                />
                <c-btn
                  v-if="
                    editable && infoData.wattmeters!.length > 0 && infoData.wattmeterFlag === 'Y'
                  "
                  label="제외"
                  icon="remove"
                  @btnClicked="removeData(1)"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
    </div>
    <!-- <c-table
      ref="table"
      title="기본 가동(조업)시간"
      :columns="checkTable.columns"
      :data="checkTable.data"
      :usePaging="false"
      :hideBottom="true"
      :columnSetting="false"
      :isFullScreen="false"
      :filtering="false"
      :isExcelDown="false"
      gridHeightAuto
    /> -->
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="preTable"
        title="방지시설 고장이력"
        selection="multiple"
        :editable="editable"
        :columnSetting="false"
        :isFullScreen="false"
        :columns="breakdownTable.columns"
        :data="infoData.breakdowns"
        rowKey="envWaterMstPreventiveBreakdownId"
        :gridHeight="gridHeight"
        @table-data-change="tableDataChange"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addData(2)" />
            <c-btn
              v-if="editable && infoData.breakdowns!.length > 0"
              label="제외"
              icon="remove"
              @btnClicked="removeData(2)"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <c-dialog :param="popupOptions" />
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
import { waterMasterDataType } from './waterMasterType'
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster01Detail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envWaterMstPreventiveId: stringNull
  }
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<waterMasterDataType>
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
      envWaterMstPreventiveId: ''
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
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const updateMode = ref(false)
const editForm = ref<any>(null)
const preTable = ref<any>(null)
const wattTable = ref<any>(null)
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const infoData = ref<waterMasterDataType>({
  plantCd: null, // 사업장코드
  envWaterMstPreventiveId: '', // 수질방지시설 일련번호
  envWaterMstPreventiveName: '', // 수질방지시설명
  envWaterMstPreventiveNo: '', // 수질방지시설 관리번호
  processCd: '',
  iepsFlag: 'Y',
  wattmeterFlag: 'Y',
  deptCd: '', // 관리부서 코드
  useFlag: 'Y', // 사용여부
  oprTime01: 'N', // 기본 가동시간 01시
  oprTime02: 'N', // 기본 가동시간 02시
  oprTime03: 'N', // 기본 가동시간 03시
  oprTime04: 'N', // 기본 가동시간 04시
  oprTime05: 'N', // 기본 가동시간 05시
  oprTime06: 'N', // 기본 가동시간 06시
  oprTime07: 'N', // 기본 가동시간 07시
  oprTime08: 'N', // 기본 가동시간 08시
  oprTime09: 'N', // 기본 가동시간 09시
  oprTime10: 'N', // 기본 가동시간 10시
  oprTime11: 'N', // 기본 가동시간 11시
  oprTime12: 'N', // 기본 가동시간 12시
  oprTime13: 'N', // 기본 가동시간 13시
  oprTime14: 'N', // 기본 가동시간 14시
  oprTime15: 'N', // 기본 가동시간 15시
  oprTime16: 'N', // 기본 가동시간 16시
  oprTime17: 'N', // 기본 가동시간 17시
  oprTime18: 'N', // 기본 가동시간 18시
  oprTime19: 'N', // 기본 가동시간 19시
  oprTime20: 'N', // 기본 가동시간 20시
  oprTime21: 'N', // 기본 가동시간 21시
  oprTime22: 'N', // 기본 가동시간 22시
  oprTime23: 'N', // 기본 가동시간 23시
  oprTime24: 'N', // 기본 가동시간 24시
  breakdowns: [],
  deleteBreakdowns: [],
  wattmeters: [],
  deleteWattmeters: []
})

// const checkTable = ref<gridType>({
//   columns: Array.from({ length: 24 }, (_, i) => ({
//     name: `oprTime${(i + 1).toString().padStart(2, '0')}`,
//     field: `oprTimee${(i + 1).toString().padStart(2, '0')}`,
//     label: `${i + 1}`,
//     align: 'center',
//     type: 'check',
//     true: 'Y',
//     false: 'N',
//     value: 'N',
//     sortable: false
//   })),
//   data: []
// })
const breakdownTable = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'breakdownDts',
      field: 'breakdownDts',
      label: '고장기간',
      align: 'center',
      style: 'width:15%',
      sortable: true,
      range: true,
      type: 'date'
    },
    {
      required: true,
      name: 'breakdownStatus',
      field: 'breakdownStatus',
      label: '고장상태',
      align: 'left',
      style: 'width:25%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'breakdownAction',
      field: 'breakdownAction',
      label: '조치사항',
      align: 'left',
      style: 'width:25%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '특기사항',
      align: 'left',
      style: 'width:20%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'bactionDt',
      field: 'bactionDt',
      label: '조치일',
      align: 'center',
      style: 'width:15%',
      sortable: true,
      type: 'date'
    }
  ],
  data: []
})
const wattmeterGrid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'envWaterMstWattmeterNo',
      field: 'envWaterMstWattmeterNo',
      label: '적산전력계번호',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      required: true,
      name: 'envWaterMstWattmeterName',
      field: 'envWaterMstWattmeterName',
      label: '전력계구분명',
      style: 'width:150px',
      align: 'left',
      sortable: true
    },
    {
      name: 'wattmeterUnit',
      field: 'wattmeterUnit',
      label: '단위',
      align: 'center',
      sortable: true,
      style: 'width:60px'
    },
    {
      name: 'wattmeterMagnification',
      field: 'wattmeterMagnification',
      label: '배율',
      align: 'center',
      sortable: true,
      style: 'width:60px'
    }
  ],
  data: []
})
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 320 + 'px' : '300px'
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
  detailUrl.value = selectConfig.env.water.mst.preventive.get.url
  saveUrl.value = transactionConfig.env.water.mst.preventive.insert.url
  // code setting

  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterMstPreventiveId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envWaterMstPreventiveId),
      method: 'GET'
    }).then((_result: any) => {
      updateMode.value = true
      infoData.value = _result.data
      // checkTable.value.data = [_result.data]
      _.forEach(infoData.value.breakdowns, (_item) => {
        _item['breakdownDts'] = [_item.breakdownStartDt, _item.breakdownEndDt]
      })
    })
  }
  // else if (checkTable.value.data.length === 0) {
  //   checkTable.value.data.push({
  //     plantCd: null,
  //     envWaterMstPreventiveId: null,
  //     envWaterMstPreventiveName: '',
  //     envWaterMstPreventiveNo: '',
  //     deptCd: '',
  //     useFlag: 'Y',
  //     oprTime01: 'N', // 기본 가동시간 01시
  //     oprTime02: 'N', // 기본 가동시간 02시
  //     oprTime03: 'N', // 기본 가동시간 03시
  //     oprTime04: 'N', // 기본 가동시간 04시
  //     oprTime05: 'N', // 기본 가동시간 05시
  //     oprTime06: 'N', // 기본 가동시간 06시
  //     oprTime07: 'N', // 기본 가동시간 07시
  //     oprTime08: 'N', // 기본 가동시간 08시
  //     oprTime09: 'N', // 기본 가동시간 09시
  //     oprTime10: 'N', // 기본 가동시간 10시
  //     oprTime11: 'N', // 기본 가동시간 11시
  //     oprTime12: 'N', // 기본 가동시간 12시
  //     oprTime13: 'N', // 기본 가동시간 13시
  //     oprTime14: 'N', // 기본 가동시간 14시
  //     oprTime15: 'N', // 기본 가동시간 15시
  //     oprTime16: 'N', // 기본 가동시간 16시
  //     oprTime17: 'N', // 기본 가동시간 17시
  //     oprTime18: 'N', // 기본 가동시간 18시
  //     oprTime19: 'N', // 기본 가동시간 19시
  //     oprTime20: 'N', // 기본 가동시간 20시
  //     oprTime21: 'N', // 기본 가동시간 21시
  //     oprTime22: 'N', // 기본 가동시간 22시
  //     oprTime23: 'N', // 기본 가동시간 23시
  //     oprTime24: 'N', // 기본 가동시간 24시
  //     breakdowns: [],
  //     deleteBreakdowns: []
  //   })
  // }
}

function dataChange(_data1: any, _data2: any, _data3: any) {
  infoData.value.processNo = _data3.processNo
}

function tableDataChange(bodyProps: any, col: tableColumnType) {
  if (
    col.name === 'breakdownDts' &&
    bodyProps.row.breakdownDts &&
    bodyProps.row.breakdownDts.length === 2
  ) {
    // 고장기간
    bodyProps.row.breakdownStartDt = bodyProps.row.breakdownDts[0]
    bodyProps.row.breakdownEndDt = bodyProps.row.breakdownDts[1]
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envWaterMstPreventiveId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: Boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          infoData.value.regUserId = user.value.userId
          infoData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}

function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envWaterMstPreventiveId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 등록
 *******************************/
function addData(num: number) {
  if (num === 1) {
    popupOptions.value = getPopupOptions('waterWattmeter', popupOptions.value, closePopup, {
      type: 'multiple'
    })
  }

  if (num === 2) {
    if (!infoData.value.breakdowns) infoData.value.breakdowns = []
    infoData.value.breakdowns.splice(0, 0, {
      envWaterMstPreventiveId: props.popupParam.envWaterMstPreventiveId, // 수질방지시설 일련번호
      envWaterMstPreventiveBreakdownId: '', // 수질방지시설 고장이력 일련번호
      breakdownStartDt: '', // 고장기간 시작일
      breakdownEndDt: '', // 고장기간 종료일
      breakdownDts: [],
      breakdownStatus: '', // 고장상태
      breakdownAction: '', // 조치사항
      remark: '', // 특기사항
      bactionDt: '', // 조치일
      regUserId: user.value.userId,
      editFlag: 'C'
    })
  }
}

function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(infoData.value.wattmeters, {
          envWaterMstWattmeterId: item.envWaterMstWattmeterId
        }) === -1
      ) {
        infoData.value.wattmeters?.push({
          ...item,
          envWaterMstPreventiveId: props.popupParam.envWaterMstPreventiveId,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function removeData(num: number) {
  const selectData = num === 1 ? wattTable.value.getSelected() : preTable.value.getSelected()

  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (num === 1) {
        if (!infoData.value.deleteWattmeters) infoData.value.deleteWattmeters = []
        if (
          item.editFlag !== 'C' &&
          _.findIndex(infoData.value.deleteWattmeters, {
            envWaterMstWattmeterId: item.envWaterMstWattmeterId
          }) === -1
        ) {
          infoData.value.deleteWattmeters.push(item)
        }
        infoData.value.wattmeters = _.reject(infoData.value.wattmeters, item)
      }
      if (num === 2) {
        if (!infoData.value.deleteBreakdowns) infoData.value.deleteBreakdowns = []
        if (
          item.editFlag !== 'C' &&
          _.findIndex(infoData.value.deleteBreakdowns, {
            envWaterMstPreventiveBreakdownId: item.envWaterMstPreventiveBreakdownId
          }) === -1
        ) {
          infoData.value.deleteBreakdowns.push(item)
        }
        infoData.value.breakdowns = _.reject(infoData.value.breakdowns, item)
      }
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

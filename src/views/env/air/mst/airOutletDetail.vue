<template>
  <div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-description>
            <span style="font-size: 0.9em; font-weight: 500; color: tomato; margin-left: 10px">
              ※
              {{
                $language(
                  '배출구 기본정보는 SEMS(대기배출원관리시스템)와 IEPS(통합환경허가시스템)에 등록된 정보와 반드시 일치해야 합니다.'
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
                :param="airOutletMst"
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
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="airOutletMst.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :required="true"
                :editable="editable"
                label="배출구명"
                name="outletName"
                v-model:value="airOutletMst.outletName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="배출구시설ID(SEMS)"
                name="outletSemsFacilityId"
                v-model:value="airOutletMst.outletSemsFacilityId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="배출구 일련번호(SEMS)"
                name="outletSemsId"
                v-model:value="airOutletMst.outletSemsId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="허가증상 배출구번호(SEMS)"
                name="outletPermitNo"
                v-model:value="airOutletMst.outletPermitNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="IEPS 시설여부"
                name="iepsFlag"
                v-model:value="airOutletMst.iepsFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="배출구번호(IEPS)"
                name="outletIepsNo"
                v-model:value="airOutletMst.outletIepsNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="사업장관리번호(IEPS)"
                name="outletIepsPlantMgtNo"
                v-model:value="airOutletMst.outletIepsPlantMgtNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-dept
                :editable="editable"
                label="관리부서"
                name="deptCd"
                v-model:value="airOutletMst.deptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-task-target
                :editable="editable"
                label="IEPS 공정"
                name="processCd"
                :customPopupParam="{ targetKey: 'envProcess' }"
                v-model:value="airOutletMst.processCd"
                @dataChange="dataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                readonly
                label="IEPS 공정번호"
                name="processNo"
                v-model:value="airOutletMst.processNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="자가측정면제여부"
                name="selfMeasureExemptionFlag"
                v-model:value="airOutletMst.selfMeasureExemptionFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="사용여부"
                name="useFlag"
                v-model:value="airOutletMst.useFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="배출구높이(m)"
                name="outletHeight"
                v-model:value="airOutletMst.outletHeight"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="상부굴뚝 내경(m)"
                name="outletUpperStackDiameter"
                v-model:value="airOutletMst.outletUpperStackDiameter"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="측정공 위치 내경(m)"
                name="outletInnerDiameter"
                v-model:value="airOutletMst.outletInnerDiameter"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="자가측정 검사항목"
          :columns="grid.columns"
          :data="airOutletMst.inspectItems"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          gridHeight="480px"
          selection="multiple"
          rowKey="envAirPlantInspectItemId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="추가"
                v-if="
                  editable &&
                  popupParam.envAirMstOutletId &&
                  airOutletMst.selfMeasureExemptionFlag === 'N'
                "
                icon="add"
                @btnClicked="addrow"
              />
              <c-btn
                label="제외"
                v-if="
                  editable &&
                  popupParam.envAirMstOutletId &&
                  airOutletMst.inspectItems!.length > 0 &&
                  airOutletMst.selfMeasureExemptionFlag === 'N'
                "
                icon="remove"
                @btnClicked="removeRow"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="연결 방지시설 및 배출시설"
          :columns="grid2.columns"
          :data="grid2.data"
          :merge="grid2.merge"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          gridHeight="480px"
          @linkClick="linkClick"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="props.row.preventiveName === '방지시설 면제'">
              <span>{{ props.row[col.name] }}</span>
            </template>
            <template v-else>
              <q-btn
                class="tableinnerBtn"
                flat
                :align="col.align"
                color="blue-6"
                :label="props.row[col.name]"
                @click.stop="linkClick(props, col)"
              />
            </template>
          </template>
        </c-table>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { airOutletType } from './airMaster'

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
  name: 'airOutletDetail'
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
const emits = defineEmits(['insertOutletInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envAirMstOutletId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
      envAirMstOutletId: ''
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
const airOutletMst = ref<airOutletType>({
  plantCd: null, // 사업장코드
  envAirMstOutletId: '',
  outletSemsId: '', // SEMS 대기배출구 일련번호
  outletPermitNo: '', // SEMS 허가증상 배출구번호
  outletSemsFacilityId: '', // IEPS 배출구시설ID
  outletIepsNo: '', // IEPS 배출구번호
  outletIepsPlantMgtNo: '', // IEPS 사업장 관리번호
  outletEmissionNo: '',
  tmsNo: '',
  outletName: '', // 배출구명
  outletHeight: 0, // 높이
  outletUpperStackDiameter: 0, // 상부굴뚝 내경
  outletInnerDiameter: 0, // 측정공 위치 내경
  iepsFlag: 'N', // IEPS 시설 여부
  selfMeasureExemptionFlag: 'N',
  envTmsMstId: '',
  processNo: '',
  deptCd: '', // 관리부서 코드
  useFlag: 'Y', // 사용여부
  inspectItems: [],
  deleteInspectItems: []
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'airInspectTypeName',
      field: 'airInspectTypeName',
      label: '검사구분',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'envAirMstInspectItemName',
      field: 'envAirMstInspectItemName',
      label: '검사항목',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'airInspectUnitName',
      field: 'airInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '법적기준',
      align: 'center',
      type: 'number',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'innerStandard',
      field: 'innerStandard',
      label: '내부기준',
      align: 'center',
      type: 'number',
      style: 'width: 100px',
      sortable: true
    }
  ]
})
const grid2 = ref<gridType>({
  merge: [{ index: 0, colName: 'preventiveName' }],
  columns: [
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      style: 'width:100px',
      type: 'custom',
      align: 'center',
      sortable: true
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설명',
      style: 'width:100px',
      type: 'link',
      align: 'center',
      sortable: true
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
const table = ref<any>(null)

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
  detailUrl.value = selectConfig.env.air.mst.outlet.get.url
  structureLinkUrl.value = selectConfig.env.air.mst.outlet.link.url
  saveUrl.value = transactionConfig.env.air.mst.outlet.insert.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envAirMstOutletId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envAirMstOutletId: props.popupParam.envAirMstOutletId }
    }).then((_result: any) => {
      airOutletMst.value = _result.data
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
    params: { envAirMstOutletId: props.popupParam.envAirMstOutletId }
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}

function dataChange(_data1: any, _data2: any, _data3: any) {
  airOutletMst.value.processNo = _data3.processNo
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  console.log(airOutletMst.value)
  mappingType.value = props.popupParam.envAirMstOutletId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          airOutletMst.value.regUserId = user.value.userId
          airOutletMst.value.chgUserId = user.value.userId
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
  props.popupParam.envAirMstOutletId = result.data
  message.requestSuccess()
  if (mappingType.value === 'POST') emits('insertOutletInfo', result.data.envAirMstOutletId)
  getDetail()
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addrow() {
  popupOptions.value = getPopupOptions('airInspectItem', popupOptions.value, closeInspectItem, {
    type: 'multiple',
    searchParam: { plantCd: airOutletMst.value.plantCd }
  })
}
function closeInspectItem(_data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(airOutletMst.value.inspectItems, {
          envAirMstInspectItemId: item.envAirMstInspectItemId
        }) === -1
      ) {
        airOutletMst.value.inspectItems!.push({
          ...item,
          envAirMstOutletId: airOutletMst.value.envAirMstOutletId,
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
function removeRow() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!airOutletMst.value.deleteInspectItems) airOutletMst.value.deleteInspectItems = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(airOutletMst.value.deleteInspectItems, {
          envAirMstOutletId: item.envAirMstOutletId,
          envAirPlantInspectItemId: item.envAirPlantInspectItemId
        }) === -1
      )
        airOutletMst.value.deleteInspectItems!.push(item)
      airOutletMst.value.inspectItems = _.reject(airOutletMst.value.inspectItems, item)
    })
    table.value.compoTable.clearSelection()
  }
}

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(_props?: any, col?: any) {
  if (col.name === 'preventiveName') {
    popupOptions.value.title = '대기 방지시설 상세'
    popupOptions.value.param = {
      envAirMstPreventiveId: _props.row.envAirMstPreventiveId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/env/air/mst/airPreventiveDetail.vue`))
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '대기 배출시설 상세'
    popupOptions.value.param = {
      envAirMstDischargeId: _props.envAirMstDischargeId
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

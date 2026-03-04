<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <q-form ref="editForm">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-description>
              <span style="font-size: 0.9em; font-weight: 500; color: tomato; margin-left: 10px">
                ※
                {{
                  $language(
                    '배출시설 기본정보는 SEMS(대기배출원관리시스템)와 IEPS(통합환경허가시스템)에 등록된 정보와 반드시 일치해야 합니다.'
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
                  :param="airDischargeMst"
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
                  v-model:value="airDischargeMst.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="배출시설명"
                  name="dischargeName"
                  v-model:value="airDischargeMst.dischargeName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="배출시설 일련번호(SEMS)"
                  name="dischargeSemsId"
                  v-model:value="airDischargeMst.dischargeSemsId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="허가증상 배출시설번호(SEMS)"
                  name="dischargePermitNo"
                  v-model:value="airDischargeMst.dischargePermitNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="airDischargeMst.deptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="IEPS시설여부"
                  name="iepsFlag"
                  v-model:value="airDischargeMst.iepsFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="배출시설 관리번호(IEPS)"
                  name="dischargeIepsNo"
                  v-model:value="airDischargeMst.dischargeIepsNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="사업장 관리번호(IEPS)"
                  name="dischargeIepsPlantMgtNo"
                  v-model:value="airDischargeMst.dischargeIepsPlantMgtNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="IEPS배출시설명"
                  name="dischargeIepsName"
                  v-model:value="airDischargeMst.dischargeIepsName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  :editable="editable"
                  label="IEPS 공정"
                  name="processCd"
                  :customPopupParam="{ targetKey: 'envProcess' }"
                  v-model:value="airDischargeMst.processCd"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  readonly
                  label="IEPS 공정번호"
                  name="processNo"
                  v-model:value="airDischargeMst.processNo"
                />
              </div>

              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="연결 배출구"
                  name="outletName"
                  v-model:value="airDischargeMst.outletName"
                />
              </div>
              <div v-if="airDischargeMst.preventExemptFlag !== 'Y'" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="연결 방지시설"
                  name="preventiveName"
                  v-model:value="airDischargeMst.preventiveName"
                />
              </div> -->

              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="배출가스 유량(㎥)"
                  type="number"
                  name="exhaustGasFlow"
                  v-model:value="airDischargeMst.exhaustGasFlow"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="연료사용여부"
                  name="fuelUsageFlag"
                  v-model:value="airDischargeMst.fuelUsageFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="방지시설면제여부"
                  name="preventExemptFlag"
                  v-model:value="airDischargeMst.preventExemptFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="airDischargeMst.useFlag"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table2"
          title="연결 배출구 및 방지시설"
          :columns="grid.columns"
          :data="grid.data"
          :isFullScreen="false"
          :usePaging="false"
          :columnSetting="false"
          :isExcelDown="false"
          gridHeight="350px"
          @linkClick="linkClick"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="props.row.envAirMstPreventiveId">
              <q-btn
                class="tableinnerBtn"
                flat
                :align="col.align"
                color="blue-6"
                :label="props.row[col.name]"
                @click.stop="linkClick(props, col)"
              />
            </template>
            <template v-else>
              <span>{{ props.row[col.name] }}</span>
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
import { airDischargeType } from './airMaster'

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
  name: 'airDischargeDetail'
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
    envAirMstDischargeId?: stringNull
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
  popupParam: () => {
    return {
      envAirMstDischargeId: ''
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
const airDischargeMst = ref<airDischargeType>({
  plantCd: null, // 사업장코드
  envAirMstDischargeId: '',
  dischargeSemsId: '', // SEMS 대기배출시설 일련번호
  dischargePermitNo: '', // SEMS 허가증상 배출시설번호
  dischargeIepsNo: '', // IEPS 배출구번호
  dischargeIepsPlantMgtNo: '', // IEPS 사업장 관리번호
  dischargeIepsName: '',
  dischargeName: '', // 배출구명
  processCd: '', // 작업장(공정)
  processNo: '',
  processName: '',
  deptCd: '', // 관리부서 코드
  preventExemptFlag: 'N',
  iepsFlag: 'Y',
  useFlag: 'Y', // 사용여부
  fuelUsageFlag: 'Y',
  preventiveName: '',
  outletName: ''
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
      name: 'outletName',
      field: 'outletName',
      label: '배출구',
      align: 'center',
      type: 'link',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설',
      align: 'center',
      type: 'custom',
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
const workplaceListUrl = ref('')
const structureLinkUrl = ref('')
const saveUrl = ref('')
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
  detailUrl.value = selectConfig.env.air.mst.discharge.get.url
  workplaceListUrl.value = selectConfig.env.procWork.list.url
  structureLinkUrl.value = selectConfig.env.air.mst.discharge.link.url
  saveUrl.value = transactionConfig.env.air.mst.discharge.insert.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envAirMstDischargeId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envAirMstDischargeId: props.popupParam.envAirMstDischargeId }
    }).then((_result: any) => {
      airDischargeMst.value = _result.data
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
    params: { envAirMstDischargeId: props.popupParam.envAirMstDischargeId }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

function dataChange(_data1: any, _data2: any, _data3: any) {
  airDischargeMst.value.processNo = _data3.processNo
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envAirMstDischargeId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          airDischargeMst.value.regUserId = user.value.userId
          airDischargeMst.value.chgUserId = user.value.userId
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
  message.requestSuccess()
  props.popupParam.envAirMstDischargeId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(_props?: any, col?: any) {
  if (col.name === 'outletName') {
    popupOptions.value.title = '대기 배출구 상세'
    popupOptions.value.param = {
      envAirMstOutletId: _props.envAirMstOutletId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/env/air/mst/airOutletDetail.vue`))
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '대기 방지시설 상세'
    popupOptions.value.param = {
      envAirMstPreventiveId: _props.row.envAirMstPreventiveId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/env/air/mst/airPreventiveDetail.vue`))
    )
    popupOptions.value.isFull = true
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

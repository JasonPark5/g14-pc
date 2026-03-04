<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <q-form ref="editForm">
          <c-card title="기본정보" class="cardClassDetailForm">
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
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="배출구명"
                  name="envAirMstOutletNm"
                  v-model:value="airOutletMst.envAirMstOutletNm"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="허가증상 일련번호"
                  name="envAirMstOutletSems"
                  v-model:value="airOutletMst.envAirMstOutletSems"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="배출구 일련번호"
                  name="envAirMstOutletName"
                  v-model:value="airOutletMst.envAirMstOutletName"
                />
              </div>
              <!-- <div class="col-3">
                  <c-text
                    :editable="editable"
                    label="위치"
                    name="location"
                    v-model:value="airOutletMst.location">
                  </c-text>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-text
                    suffix="㎥/분"
                    type="number"
                    :required="true"
                    :editable="editable"
                    label="처리용량"
                    name="handlingCapacity"
                    v-model:value="airOutletMst.handlingCapacity">
                  </c-text>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <c-text
                    suffix="㎥/분"
                    type="number"
                    :editable="editable"
                    label="설계(허가증)용량"
                    name="permitCapacity"
                    v-model:value="airOutletMst.permitCapacity">
                  </c-text>
                </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="airOutletMst.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="배출구직경 (m)"
                  name="outletWidth"
                  v-model:value="airOutletMst.outletWidth"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="배출구높이 (m)"
                  name="outletHeight"
                  v-model:value="airOutletMst.outletHeight"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  type="edit"
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="airOutletMst.deptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="airOutletMst.useFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="방지시설면제여부"
                  name="preventExemptionFlag"
                  v-model:value="airOutletMst.preventExemptionFlag"
                  @update:value="changePrevent"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  :editable="airOutletMst.preventExemptionFlag == 'N'"
                  label="대기방지시설"
                  name="envAirMstPreventiveId"
                  :customPopupParam="{ targetKey: 'airPreventive' }"
                  v-model:value="airOutletMst.envAirMstPreventiveId"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
      <div
        class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
        v-show="popupParam.envAirMstOutletId"
      >
        <c-table
          ref="table1"
          title="자가측정 검사항목"
          :columns="grid.columns"
          :data="grid.data"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          gridHeight="600px"
          selection="multiple"
          rowKey="envAirPlantInspectItemId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="저장"
                v-if="editable && popupParam.envAirMstOutletId && grid.data.length > 0"
                icon="save"
                @btnClicked="saverow"
              />
              <c-btn
                label="추가"
                v-if="editable && popupParam.envAirMstOutletId"
                icon="add"
                @btnClicked="addrow(1)"
              />
              <c-btn
                label="삭제"
                v-if="editable && popupParam.envAirMstOutletId && grid.data.length > 0"
                icon="remove"
                @btnClicked="removeRow(1)"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div
        class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
        v-show="popupParam.envAirMstOutletId"
      >
        <c-table
          ref="table2"
          title="연결 배출시설"
          :columns="grid2.columns"
          :data="grid2.data"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          gridHeight="600px"
          selection="multiple"
          :editable="editable"
          rowKey="envAirMstDischargeId"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="추가"
                v-if="editable && popupParam.envAirMstOutletId"
                icon="add"
                @btnClicked="addrow(2)"
              />
              <c-btn
                label="삭제"
                v-if="editable && popupParam.envAirMstOutletId && grid2.data.length > 0"
                icon="remove"
                @btnClicked="removeRow(2)"
              />
            </q-btn-group>
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
  name: 'airMaster01Detail'
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
  envAirMstOutletId: '', // 대기배출구 시스템 일련번호
  envAirMstOutletNm: '', // 배출구명
  envAirMstOutletName: '', // 배출구일련번호
  envAirMstOutletSems: '', // 허가증상 일련번호
  location: '', // 위치
  handlingCapacity: '', // 방지시설처리용량
  permitCapacity: '', // 방지시설처리용량
  outletWidth: '', // 직경
  outletHeight: '', // 높이
  deptCd: '', // 관리부서 코드
  useFlag: 'Y', // 사용여부
  envAirMstPreventiveId: '', // 언결방지시설
  preventExemptionFlag: 'N' // 방지시설면제여부
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
      align: 'center',
      sortable: true
    },
    {
      name: 'envAirMstInspectItemName',
      field: 'envAirMstInspectItemName',
      label: '검사항목',
      align: 'center',
      sortable: true
    },
    {
      name: 'airInspectUnitName',
      field: 'airInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 150px',
      sortable: true
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '법적기준',
      align: 'center',
      type: 'number',
      style: 'width: 120px',
      sortable: true
    },
    {
      name: 'innerStandard',
      field: 'innerStandard',
      label: '내부기준',
      align: 'center',
      type: 'number',
      style: 'width: 120px',
      sortable: true
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'envAirMstDischargeNo',
      field: 'envAirMstDischargeNo',
      label: '관리번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'envAirMstDischargeName',
      field: 'envAirMstDischargeName',
      label: '배출시설명',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const itemListUrl = ref('')
const itemInsertUrl = ref('')
const itemDeleteUrl = ref('')
const disListUrl = ref('')
const disInsertUrl = ref('')
const disDeleteUrl = ref('')
const saveUrl = ref(transactionConfig.env.air.mst.outlet.insert.url)
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)

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
  itemListUrl.value = selectConfig.env.air.mst.outlet.inspect.url
  itemInsertUrl.value = transactionConfig.env.air.mst.outlet.inspect.save.url
  itemDeleteUrl.value = transactionConfig.env.air.mst.outlet.inspect.delete.url
  disListUrl.value = selectConfig.env.air.mst.outlet.discharge.url
  disInsertUrl.value = transactionConfig.env.air.mst.outlet.discharge.save.url
  disDeleteUrl.value = transactionConfig.env.air.mst.outlet.discharge.delete.url
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
      updateMode.value = true
      getItemList()
      getDisList()
    })
  }
}
/******************************
 * TODO (목적): 검사항목 조회
 *******************************/
function getItemList() {
  if (props.popupParam.envAirMstOutletId) {
    $http({
      url: itemListUrl.value,
      method: 'GET',
      params: { envAirMstOutletId: props.popupParam.envAirMstOutletId }
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 배출시설 목록록 조회
 *******************************/
function getDisList() {
  if (props.popupParam.envAirMstOutletId) {
    $http({
      url: disListUrl.value,
      method: 'GET',
      params: { envAirMstOutletId: props.popupParam.envAirMstOutletId }
    }).then((_result: any) => {
      grid2.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
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
  props.popupParam.envAirMstOutletId = result.data.envAirMstOutletId
  message.requestSuccess()
  if (mappingType.value === 'POST') emits('insertOutletInfo', result.data.envAirMstOutletId)
  getDetail()
}
/******************************
 * TODO (목적): 검사항목 저장
 *******************************/
function saverow() {
  $http({
    url: itemInsertUrl.value,
    method: 'POST',
    data: grid.value.data
  }).then(() => {
    message.requestSuccess()
    getItemList()
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addrow(num?: number) {
  popupOptions.value = getPopupOptions(
    num === 1 ? 'airInspectItem' : 'airDischarge',
    popupOptions.value,
    num === 1 ? closeInspectItem : closeDischarge,
    {
      type: 'multiple',
      searchParam: { plantCd: airOutletMst.value.plantCd }
    }
  )
}
function closeInspectItem(_data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData = [] as Array<any>
    _.forEach(_data, (item) => {
      if (
        _.findIndex(grid.value.data, { envAirMstInspectItemId: item.envAirMstInspectItemId }) === -1
      ) {
        saveData.push({
          envAirPlantInspectItemId: item.envAirPlantInspectItemId, // 사업장별 대기 검사항목 일련번호
          envAirMstOutletId: props.popupParam.envAirMstOutletId, // 대기배출구(방지시설) 일련번호
          envAirMstInspectItemId: item.envAirMstInspectItemId,
          airInspectTypeName: item.airInspectTypeName,
          envAirMstInspectItemName: item.envAirMstInspectItemName,
          airInspectUnitName: item.airInspectUnitName,
          legalStandard: item.legalStandard,
          innerStandard: item.innerStandard,
          editFlag: 'C',
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
    $http({
      url: itemInsertUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getItemList()
    })
  }
}
function closeDischarge(_data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData = [] as Array<any>
    _.forEach(_data, (item) => {
      if (
        _.findIndex(grid2.value.data, { envAirMstDischargeId: item.envAirMstDischargeId }) === -1
      ) {
        saveData.push({
          plantCd: item.plantCd, // 사업장별 대기 검사항목 일련번호
          envAirMstOutletId: props.popupParam.envAirMstOutletId,
          envAirMstDischargeId: item.envAirMstDischargeId,
          editFlag: 'C',
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
    $http({
      url: disInsertUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getDisList()
    })
  }
}
/******************************
 * TODO (목적): 행 삭제
 *******************************/
function removeRow(num?: number) {
  const selectData = num === 1 ? table1.value.getSelected() : table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: num === 1 ? itemDeleteUrl.value : disDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          num === 1
            ? _.forEach(selectData, (item) => (grid.value.data = _.reject(grid.value.data, item)))
            : _.forEach(selectData, (item) => (grid2.value.data = _.reject(grid2.value.data, item)))
          num === 1
            ? table1.value.compoTable.clearSelection()
            : table2.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 대분류코드로 중분류 아이템 가져옴
 *******************************/
function changePrevent() {
  if (airOutletMst.value.preventExemptionFlag === 'Y') airOutletMst.value.envAirMstPreventiveId = ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

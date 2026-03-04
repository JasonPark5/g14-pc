<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled && popupParam.buyRequestId"
                :url="completeUrl"
                :isSubmit="isComplete"
                :param="safetyGear"
                :mappingType="completeType"
                label="구매신청완료"
                icon="save"
                @beforeAction="completeData"
                @btnCallback="completeCallback"
              />
              <c-btn
                v-if="editable && !disabled && popupParam.buyRequestId"
                label="삭제"
                :editable="editable"
                icon="delete_forever"
                @btnClicked="removeData"
              />
              <c-btn
                v-if="editable && !disabled"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="safetyGear"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-3">
              <c-plant
                :required="true"
                :disabled="disabled"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="safetyGear.plantCd"
              />
            </div> -->
            <div class="col-3">
              <c-datepicker
                :required="true"
                label="구매신청일"
                default="today"
                :disabled="disabled"
                :editable="editable"
                name="requestDate"
                v-model:value="safetyGear.requestDate"
              />
            </div>
            <div class="col-3">
              <c-dept
                :required="true"
                label="신청부서"
                :disabled="disabled"
                :editable="editable"
                name="requestDeptCd"
                v-model:value="safetyGear.requestDeptCd"
              />
            </div>
            <div class="col-3">
              <c-field
                :required="true"
                label="구매신청자"
                :disabled="disabled"
                :editable="editable"
                name="requestUserId"
                v-model:value="safetyGear.requestUserId"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="신규 보호구 구매 신청 목록"
        :columns="grid.columns"
        :data="safetyGear.detailList"
        :merge="grid.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="editable && !disabled"
        gridHeight="600px"
        selection="multiple"
        rowKey="buyRequestDetailId"
        :plantCd="safetyGear.plantCd"
        @table-data-change="tableDataChange"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addRow" />
              <c-btn
                v-if="editable && !disabled && safetyGear.detailList!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="removeRow"
              />
            </q-btn-group>
          </div>
        </template>
      </c-table>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { safetyGearType } from './safetyGear'

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
  name: 'safetyGearBuyRequestDetail'
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
    buyRequestId?: stringNull
  }
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
      buyRequestId: ''
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
const safetyGear = ref<safetyGearType>({
  plantCd: null,
  requestDate: '',
  requestDeptCd: '',
  requestUserId: '',
  statusCd: '',
  detailList: [],
  deleteDetailList: []
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'safetyGearName',
      field: 'safetyGearName',
      label: '보호구명',
      style: 'width:300px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'requestCount',
      field: 'requestCount',
      label: '신청수량',
      style: 'width:80px',
      align: 'right',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'safetyGearPrice',
      field: 'safetyGearPrice',
      label: '단가(원)',
      style: 'width:100px',
      align: 'right',
      type: 'number',
      sortable: false
    },
    {
      name: 'totalPrice',
      field: 'totalPrice',
      label: '총 금액(원)',
      style: 'width:80px',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      name: 'attach',
      field: 'attach',
      label: '보호구 사진',
      align: 'center',
      style: 'width:200px',
      type: 'attach',
      taskClassCd: 'NEW_SAFETY_GEAR',
      keyText: 'buyRequestDetailId',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      style: 'width:300px',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const disabled = ref(false)
const saveType = ref('POST')
const completeType = ref('PUT')
const saveUrl = ref(transactionConfig.sop.sas.buy.insert.url)
const completeUrl = ref(transactionConfig.sop.sas.buy.update.url)
const getUrl = ref('')
const deleteUrl = ref('')
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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  getUrl.value = selectConfig.sop.sas.buy.get.url
  deleteUrl.value = transactionConfig.sop.sas.buy.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.buyRequestId) {
    $http({
      url: $format(getUrl.value, props.popupParam.buyRequestId),
      method: 'GET'
    }).then((_result: any) => {
      safetyGear.value = _result.data
      if (_result.data.statusCd === 'SBS0000005') disabled.value = true
    })
  } else safetyGear.value.requestUserId = user.value.userId
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addRow() {
  safetyGear.value.detailList!.splice(0, 0, {
    buyRequestDetailId: uid(),
    buyRequestId: props.popupParam.buyRequestId,
    safetyGearName: '',
    requestCount: 0,
    safetyGearPrice: 0,
    remarks: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function saveData() {
  if (props.popupParam.buyRequestId) {
    safetyGear.value.chgUserId = user.value.userId
    saveType.value = 'PUT'
  } else {
    safetyGear.value.regUserId = user.value.userId
    saveType.value = 'POST'
  }
  if (!safetyGear.value.detailList || safetyGear.value.detailList.length === 0) {
    message.alert({
      title: '안내',
      message: '신규 구매 신청할 보호구를 추가하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      safetyGear.value.detailList &&
      validTable(grid.value.columns, safetyGear.value.detailList)
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          safetyGear.value.statusCd = 'SBS0000001'
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.popupParam.buyRequestId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.buyRequestId),
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
 * TODO (목적): 선택 row 삭제
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
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        if (!safetyGear.value.deleteDetailList) safetyGear.value.deleteDetailList = []
        _.forEach(selectData, (item) => {
          if (
            _.findIndex(safetyGear.value.deleteDetailList, {
              buyRequestDetailId: item.buyRequestDetailId
            }) === -1 &&
            item.editFlag !== 'C'
          )
            safetyGear.value.deleteDetailList!.push(item)
          safetyGear.value.detailList = _.reject(safetyGear.value.detailList, item)
        })
        table.value.compoTable.clearSelection()
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 완료 처리
 *******************************/
function completeData() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, safetyGear.value.detailList!)) {
      message.confirm({
        title: '확인',
        message: '신청완료 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          safetyGear.value.chgUserId = user.value.userId
          safetyGear.value.statusCd = 'SBS0000005'
          completeUrl.value = saveUrl.value
          completeType.value = 'PUT'
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback(result: any) {
  props.popupParam.buyRequestId = result.data
  message.requestSuccess()
  disabled.value = true
  getDetail()
}
/******************************
 * TODO (목적): 테이블 내 값 변경시 계산
 *******************************/
function tableDataChange(_props: any) {
  if (Number(_props.row.safetyGearPrice) > 0 && Number(_props.row.requestCount) > 0) {
    _props.row.totalPrice = Number(_props.row.requestCount) * Number(_props.row.safetyGearPrice)
  } else _props.row.totalPrice = 0
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="giveEditForm">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-3">
              <c-plant
                :disabled="true"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="param.giveEquipment.plantCd"
              />
            </div> -->
            <div class="col-3">
              <c-field
                label="신청자"
                :disabled="true"
                :editable="editable"
                :data="param.giveEquipment"
                type="dept_user"
                name="regUserId"
                v-model:value="param.giveEquipment.regUserId"
              />
            </div>
            <div class="col-3">
              <c-text
                :readonly="true"
                :disabled="true"
                :close="true"
                :editable="editable"
                label="밀폐공간"
                name="spaceNameName"
                v-model:value="param.giveEquipment.spaceNameName"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="giveTable"
        title="장비 대여/반납 목록"
        tableId="table"
        :editable="editable && !disabled"
        :columns="gridGive.columns"
        :data="param.giveEquipment.closedSpaceEquipmentReturnItemModels"
        rowKey="heaClosedSpaceEquipmentReturnItemId"
        checkDisableColumn="rowDisabled"
        :merge="gridGive.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        gridHeight="620px"
        selection="multiple"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
              <!-- <c-btn
                v-show="editable && !disabled"
                label="신청목록 선택"
                icon="save_alt"
                @btnClicked="addRequestEquips"
              /> -->
              <c-btn
                v-show="
                  editable &&
                  !disabled &&
                  param.giveEquipment.closedSpaceEquipmentReturnItemModels!.length > 0 &&
                  checkApply === true
                "
                label="대여"
                icon="check"
                @btnClicked="rentEquip"
              />
              <c-btn
                v-show="
                  editable &&
                  !disabled &&
                  param.giveEquipment.closedSpaceEquipmentReturnItemModels!.length > 0
                "
                label="반납"
                icon="check"
                @btnClicked="returnEquip"
              />
              <c-btn
                v-show="editable && !disabled"
                label="추가"
                icon="add"
                @btnClicked="addEquips"
              />
              <c-btn
                v-show="
                  editable &&
                  !disabled &&
                  param.giveEquipment.closedSpaceEquipmentReturnItemModels!.length > 0
                "
                label="저장"
                :url="saveUrl"
                :isSubmit="isSaveGive"
                :param="param.giveEquipment"
                mappingType="PUT"
                icon="save"
                @beforeAction="saveGive"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-show="
                  editable &&
                  !disabled &&
                  param.giveEquipment.closedSpaceEquipmentReturnItemModels!.length > 0
                "
                label="삭제"
                icon="remove"
                @btnClicked="removeGive"
              />
            </q-btn-group>
          </div>
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
import { giveEquipType } from './closedSpace'

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
  name: 'closedSpaceEquipGive'
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
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    heaClosedSpaceEquipmentGiveId: stringNull
    giveEquipment: giveEquipType
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
  param: () => {
    return {
      heaClosedSpaceEquipmentGiveId: '',
      giveEquipment: {
        heaClosedSpaceEquipmentGiveId: '',
        plantCd: '',
        requestDate: '',
        regUserId: '',
        spaceNameCd: null,
        spaceNameName: '',
        giveStatusCd: '',
        requestStepCd: '',
        closedSpaceEquipmentGiveItemModels: [],
        deleteClosedSpaceEquipmentGiveItemModels: [],
        closedSpaceEquipmentReturnItemModels: [],
        deleteClosedSpaceEquipmentReturnItemModels: []
      }
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridGive = ref<gridType>({
  columns: [
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '장비종류',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '장비명',
      style: 'width:120px',
      align: 'left',
      sortable: false
    },
    {
      name: 'equipmentNumber',
      field: 'equipmentNumber',
      label: '신청수량',
      style: 'width:60px',
      align: 'right',
      sortable: false
    },
    {
      name: 'equipmentRentNumber',
      field: 'equipmentRentNumber',
      label: '대여수량',
      style: 'width:60px',
      align: 'right',
      type: 'number',
      sortable: false,
      disableTarget: 'rentStatusCd',
      disableCon: 'HCSEGC0002'
    },
    {
      name: 'rentStatusName',
      field: 'rentStatusName',
      label: '진행단계',
      style: 'width:100px',
      align: 'center'
    },
    {
      required: true,
      name: 'rentPeriod',
      field: 'rentPeriod',
      label: '대여기간',
      style: 'width:120px',
      align: 'center',
      range: true,
      type: 'date',
      sortable: false,
      disableTarget: 'rentStatusCd',
      disableCon: 'HCSEGC0002'
    },
    {
      required: true,
      name: 'rentDate',
      field: 'rentDate',
      label: '대여일',
      style: 'width:120px',
      align: 'center',
      type: 'date',
      sortable: false,
      disableTarget: 'rentStatusCd',
      disableCon: 'HCSEGC0002'
    },
    {
      required: true,
      name: 'returnDate',
      field: 'returnDate',
      label: '반납일',
      style: 'width:120px',
      align: 'right',
      type: 'date',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      type: 'text',
      style: 'width:250px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSaveGive = ref(false)
const deleteItemUrl = ref('')
const saveUrl = ref('')
const rentUrl = ref('')
const returnUrl = ref('')
const rentStatusUrl = ref('')
const giveEditForm = ref<any>(null)
const giveTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => props.param.giveEquipment.giveStatusCd === 'CSE0000005')
const checkApply = computed(() => {
  const items = _.filter(props.param.giveEquipment.closedSpaceEquipmentReturnItemModels, {
    rentStatusCd: 'HCSEGC0002'
  })
  let checkApply = false
  if (items.length > 0) checkApply = true
  return checkApply
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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  saveUrl.value = transactionConfig.hea.cse.gives.returnUpdate.url
  rentUrl.value = transactionConfig.hea.cse.gives.rent.url
  returnUrl.value = transactionConfig.hea.cse.gives.return.url
  deleteItemUrl.value = transactionConfig.hea.cse.gives.deleteItem.url
  rentStatusUrl.value = transactionConfig.hea.cse.gives.status.rent.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 기본정보 (대여,반납 정보) 저장
 *******************************/
function saveGive() {
  giveEditForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.param.giveEquipment.regUserId = user.value.userId
          props.param.giveEquipment.chgUserId = user.value.userId
          _.forEach(props.param.giveEquipment.closedSpaceEquipmentReturnItemModels, (_item) => {
            if (_item.rentPeriod && _item.rentPeriod.length > 0) {
              _item.rentStartDate = _item.rentPeriod[0]
              _item.rentEndDate = _item.rentPeriod[1]
            }
          })
          isSaveGive.value = !isSaveGive.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.param.heaClosedSpaceEquipmentGiveId = result.data
  emits('emitStep', { name: 'getDetail' })
}
/******************************
 * TODO (목적): 대여. 대여중(1개라도 대여중이면 전체 대여중으로 변경). 전체 대여중으로 업데이트 API호출
 *******************************/
function rentEquip() {
  const selectData = giveTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (_.filter(selectData, { equipmentRentNumber: null }).length === 0) {
      message.confirm({
        title: '확인',
        message: '선택한 장비를 대여완료 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          _.forEach(props.param.giveEquipment.closedSpaceEquipmentReturnItemModels, (_item) => {
            if (_item.rentPeriod && _item.rentPeriod.length > 0) {
              _item.rentStartDate = _item.rentPeriod[0]
              _item.rentEndDate = _item.rentPeriod[1]
            }
          })
          $http({
            url: rentUrl.value,
            method: 'PUT',
            data: selectData
          }).then(() => {
            message.requestSuccess()
            emits('emitStep', {
              name: 'getDetail',
              param: { heaClosedSpaceEquipmentGiveId: props.param.heaClosedSpaceEquipmentGiveId }
            })
            $http({
              url: rentStatusUrl.value,
              method: 'PUT',
              data: props.param.giveEquipment
            }).then(() => {
              message.requestSuccess()
            })
            giveTable.value.compoTable.clearSelection()
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '대여수량을 확인해주세요!',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 반납. 반납완료(모든 반납이 끝나면 반납완료로 변경) -> service에서 처리하는 것으로 변경
 *******************************/
function returnEquip() {
  const selectData = giveTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (
      validTable(gridGive.value.columns, selectData) &&
      _.filter(selectData, { rentStatusCd: 'HCSEGC0002' }).length > 0
    ) {
      message.confirm({
        title: '확인',
        message: '선택한 장비 중 신청완료인 건이 존재합니다. 반납 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          $http({
            url: returnUrl.value,
            method: 'PUT',
            data: {
              heaClosedSpaceEquipmentGiveId:
                props.param.giveEquipment.heaClosedSpaceEquipmentGiveId,
              closedSpaceEquipmentReturnItemModels: selectData,
              chgUserId: user.value.userId
            }
          }).then(() => {
            message.requestSuccess()
            emits('emitStep', { name: 'getDetail' })
            giveTable.value.compoTable.clearSelection()
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.confirm({
        title: '안내',
        message: '선택한 장비를 반납 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          $http({
            url: returnUrl.value,
            method: 'PUT',
            data: {
              heaClosedSpaceEquipmentGiveId:
                props.param.giveEquipment.heaClosedSpaceEquipmentGiveId,
              closedSpaceEquipmentReturnItemModels: selectData,
              chgUserId: user.value.userId
            }
          }).then(() => {
            message.requestSuccess()
            emits('emitStep', { name: 'getDetail' })
            giveTable.value.compoTable.clearSelection()
          })
        },
        cancelCallback: () => {}
      })
    }
  }
}
/******************************
 * TODO (목적): 선택 row 삭제
 *******************************/
function removeGive() {
  const selectData = giveTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: deleteItemUrl.value,
      method: 'DELETE',
      data: Object.values(selectData)
    }).then(() => {
      message.requestSuccess()
      _.forEach(selectData, (item) => {
        props.param.giveEquipment.closedSpaceEquipmentReturnItemModels = _.reject(
          props.param.giveEquipment.closedSpaceEquipmentReturnItemModels,
          item
        )
      })
      giveTable.value.compoTable.clearSelection()
    })
  }
}
/******************************
 * TODO (목적): 행 추가 (장비 테이블에 row 추가)
 *******************************/
function addEquips() {
  popupOptions.value = getPopupOptions('closedEquip', popupOptions.value, closeEquip, {
    type: 'multiple'
  })
}
function closeEquip(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    if (!props.param.giveEquipment.closedSpaceEquipmentReturnItemModels)
      props.param.giveEquipment.closedSpaceEquipmentReturnItemModels = []
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.param.giveEquipment.closedSpaceEquipmentReturnItemModels, {
          heaClosedSpaceEquipmentId: item.heaClosedSpaceEquipmentId
        }) === -1
      ) {
        props.param.giveEquipment.closedSpaceEquipmentReturnItemModels!.push({
          heaClosedSpaceEquipmentGiveId: props.param.heaClosedSpaceEquipmentGiveId,
          heaClosedSpaceEquipmentReturnItemId: uid(),
          heaClosedSpaceEquipmentId: item.heaClosedSpaceEquipmentId,
          equipmentName: item.equipmentName,
          equipmentNumber: null,
          equipmentTypeName: item.equipmentTypeName,
          rentStatusCd: 'HCSEGC0002',
          rentStatusName: '',
          rentStartDate: '',
          rentEndDate: '',
          rentPeriod: [item.rentStartDate, item.rentEndDate],
          regUserId: user.value.userId,
          returnDate: '',
          editFlag: 'C'
        })
      }
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

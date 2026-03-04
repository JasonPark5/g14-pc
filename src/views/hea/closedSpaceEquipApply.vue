<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="requestEditForm">
        <c-card title="밀폐공간 작업장비 대여 신청" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="
                  editable &&
                  Boolean(param.giveEquipment.heaClosedSpaceEquipmentGiveId) &&
                  !disabled
                "
                :url="completeUrl"
                :isSubmit="isComplete"
                :param="param.giveEquipment"
                mappingType="PUT"
                label="대여 신청"
                icon="check"
                @beforeAction="saveRequest(2)"
                @btnCallback="completeCallback"
              />
              <c-btn
                v-show="editable && !disabled"
                label="저장"
                :url="saveUrl"
                :isSubmit="isSaveRequest"
                :param="param.giveEquipment"
                :mappingType="saveType"
                icon="save"
                @beforeAction="saveRequest(1)"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-show="
                  editable &&
                  Boolean(param.giveEquipment.heaClosedSpaceEquipmentGiveId) &&
                  !disabled
                "
                label="삭제"
                icon="delete_forever"
                @btnClicked="remove"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-3">
              <c-plant
                :required="true"
                :editable="editable && !disabled"
                type="edit"
                name="plantCd"
                v-model:value="param.giveEquipment.plantCd"
              />
            </div> -->
            <div class="col-3">
              <c-field
                :required="true"
                label="신청자"
                :editable="editable && !disabled"
                :data="param.giveEquipment"
                type="dept_user"
                name="regUserId"
                v-model:value="param.giveEquipment.regUserId"
              />
            </div>
            <!-- <div class="col-3">
              <c-select
                :required="true"
                :editable="editable && !disabled"
                codeGroupCd="CLOSED_SPACE_TYPE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                label="밀폐공간"
                name="spaceName"
                v-model:value="param.giveEquipment.spaceNameCd">
              </c-select>
            </div> -->
            <div class="col-3">
              <c-text
                :afterIcon="
                  disabled
                    ? null
                    : [
                        { name: 'search', click: true, callbackName: 'searchPop' }
                        //{ name: 'close', click: true, callbackName: 'removeClosedSpace' }
                      ]
                "
                :required="true"
                :readonly="true"
                :close="true"
                :editable="editable"
                label="밀폐공간"
                name="spaceNameName"
                @searchPop="searchPop"
                v-model:value="param.giveEquipment.spaceNameName"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="requestTable"
        :editable="editable && !disabled"
        title="장비 대여신청 목록"
        tableId="table"
        :columns="gridReceive.columns"
        :data="param.giveEquipment.closedSpaceEquipmentGiveItemModels"
        rowKey="heaClosedSpaceEquipmentGiveItemId"
        :merge="gridReceive.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        gridHeight="620px"
        selection="multiple"
      >
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
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
                  param.giveEquipment.closedSpaceEquipmentGiveItemModels!.length > 0
                "
                label="제외"
                icon="remove"
                @btnClicked="removeRequest"
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
  name: 'closedSpaceEquipApply'
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
const gridReceive = ref<gridType>({
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
      required: true,
      name: 'equipmentNumber',
      field: 'equipmentNumber',
      label: '신청수량',
      style: 'width:60px',
      align: 'right',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'requestDate',
      field: 'requestDate',
      label: '신청일',
      style: 'width:80px',
      align: 'center',
      type: 'date',
      sortable: false
    },
    {
      required: true,
      name: 'rentPeriod',
      field: 'rentPeriod',
      label: '대여예정기간',
      style: 'width:80px',
      align: 'center',
      range: true,
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
const isSaveRequest = ref(false)
const isComplete = ref(false)
const saveType = ref('POST')
const completeUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const requestEditForm = ref<any>(null)
const requestTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    props.param.giveEquipment.requestStepCd !== 'CSE0000001' &&
    Boolean(props.param.heaClosedSpaceEquipmentGiveId)
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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  saveUrl.value = transactionConfig.hea.cse.gives.insert.url
  deleteUrl.value = transactionConfig.hea.cse.gives.delete.url
  completeUrl.value = transactionConfig.hea.cse.gives.complete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 기본정보 저장 / 대여신청 완료
 *******************************/
function saveRequest(num?: number) {
  if (num === 1) saveType.value = props.param.heaClosedSpaceEquipmentGiveId ? 'PUT' : 'POST'
  requestEditForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      validTable(
        gridReceive.value.columns,
        props.param.giveEquipment.closedSpaceEquipmentGiveItemModels!
      )
    ) {
      message.confirm({
        title: '확인',
        message: num === 1 ? '저장하시겠습니까?' : '대여 신청하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          if (num === 1) props.param.giveEquipment.regUserId = user.value.userId
          props.param.giveEquipment.chgUserId = user.value.userId
          _.forEach(props.param.giveEquipment.closedSpaceEquipmentGiveItemModels, (_item) => {
            if (_item.rentPeriod && _item.rentPeriod.length > 0) {
              _item.rentStartDate = _item.rentPeriod[0]
              _item.rentEndDate = _item.rentPeriod[1]
            }
          })
          if (num === 1) isSaveRequest.value = !isSaveRequest.value
          else isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.param.heaClosedSpaceEquipmentGiveId) {
    props.param.heaClosedSpaceEquipmentGiveId = result.data
  }
  emits('emitStep', {
    name: 'setHeaClosedSpaceEquipmentGiveId',
    param: props.param.heaClosedSpaceEquipmentGiveId
  })
}
/******************************
 * TODO (목적): 대여신청 완료처리
 *******************************/
function completeCallback() {
  message.requestSuccess()
  emits('emitStep', {
    name: 'getDetail',
    param: { heaClosedSpaceEquipmentGiveId: props.param.heaClosedSpaceEquipmentGiveId }
  })
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.heaClosedSpaceEquipmentGiveId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('emitStep', {
          name: 'closePopup',
          param: {}
        })
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 선택 row 삭제
 *******************************/
function removeRequest() {
  const selectData = requestTable.value.getSelected()
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
        if (!props.param.giveEquipment.deleteClosedSpaceEquipmentGiveItemModels)
          props.param.giveEquipment.deleteClosedSpaceEquipmentGiveItemModels = []
        _.forEach(selectData, (item) => {
          if (
            _.findIndex(props.param.giveEquipment.deleteClosedSpaceEquipmentGiveItemModels, {
              heaClosedSpaceEquipmentGiveItemId: item.heaClosedSpaceEquipmentGiveItemId
            }) === -1 &&
            item.editFlag !== 'C'
          )
            props.param.giveEquipment.deleteClosedSpaceEquipmentGiveItemModels!.push(item)
          props.param.giveEquipment.closedSpaceEquipmentGiveItemModels = _.reject(
            props.param.giveEquipment.closedSpaceEquipmentGiveItemModels,
            item
          )
        })
      },
      cancelCallback: () => {}
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
    if (!props.param.giveEquipment.deleteClosedSpaceEquipmentGiveItemModels)
      props.param.giveEquipment.deleteClosedSpaceEquipmentGiveItemModels = []
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.param.giveEquipment.closedSpaceEquipmentGiveItemModels, {
          heaClosedSpaceEquipmentId: item.heaClosedSpaceEquipmentId
        }) === -1
      ) {
        props.param.giveEquipment.closedSpaceEquipmentGiveItemModels!.push({
          heaClosedSpaceEquipmentGiveId: props.param.heaClosedSpaceEquipmentGiveId,
          heaClosedSpaceEquipmentGiveItemId: uid(),
          heaClosedSpaceEquipmentId: item.heaClosedSpaceEquipmentId, // 재고번호
          equipmentName: item.equipmentName,
          equipmentNumber: null, // 신청수량
          requestDate: getToday(),
          equipmentTypeName: item.equipmentTypeName,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 밀폐공간 종류 팝업에서 가져오기
 *******************************/
function searchPop() {
  popupOptions.value.title = '밀폐공간 상세'
  popupOptions.value.param = {
    type: 'single',
    isPopup: true
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./closedSpaceMap.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '90%'
  popupOptions.value.closeCallback = closeMap
}
function closeMap(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    props.param.giveEquipment.spaceNameCd = _data[0].closedSpaceTypeCd
    props.param.giveEquipment.spaceNameName = _data[0].closedSpaceTypeName
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

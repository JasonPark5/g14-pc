<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card title="보호구 지급 상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled && param.requestGiveInfoId"
                :url="completeUrl"
                :isSubmit="isComplete"
                :param="safetyGear"
                :mappingType="completeType"
                label="지급완료"
                icon="check"
                @beforeAction="completeData"
                @btnCallback="completeCallback"
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
            <div class="col-3">
              <c-datepicker
                :required="true"
                label="지급일"
                :disabled="disabled"
                :editable="editable"
                name="giveDate"
                v-model:value="safetyGear.giveDate"
              />
            </div>
            <div class="col-3">
              <c-dept
                :required="true"
                label="지급부서"
                :disabled="disabled"
                :editable="editable"
                name="giveDeptCd"
                v-model:value="safetyGear.giveDeptCd"
              />
            </div>
            <div class="col-3">
              <c-field
                :required="true"
                label="불출담당자"
                :disabled="disabled"
                :editable="editable"
                name="giveUserId"
                v-model:value="safetyGear.giveUserId"
              />
            </div>
            <!-- <div class="col-3">
              <c-plant
                v-if="param.isRequest === 'N'"
                type="edit"
                :required="true"
                label="사업장"
                :disabled="disabled"
                :editable="editable"
                name="plantCd"
                v-model:value="safetyGear.plantCd"
              />
            </div> -->
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="보호구 지급 목록"
        :columns="grid.columns"
        :data="safetyGear.detailList2"
        :merge="grid.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="editable && !disabled"
        gridHeight="630px"
        selection="multiple"
        rowKey="giveListId"
      >
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
              <!-- <c-btn
                v-if="editable && !disabled && param.isRequest === 'Y'"
                label="신청한 보호구 선택"
                icon="save_alt"
                @btnClicked="addGearRequest"
              /> -->
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addGear" />
              <c-btn
                v-if="editable && !disabled && safetyGear.detailList2!.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="removeGear"
              />
            </q-btn-group>
          </div>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'userArray'">
            <c-multi-field
              :editable="editable"
              :disabled="disabled"
              :userInfo="userInfo"
              isArray
              type="user"
              label=""
              :name="`userArray${props.rowIndex}`"
              v-model:value="props.row[col.name]"
              @dataChange="dataChange(props)"
            />
          </template>
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
  name: 'safetyGearGiveInfo'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    requestGiveInfoId?: stringNull
    stepCd?: stringNull
    plantCd?: stringNull
    giveTypeCd?: stringNull
    isRequest?: stringNull
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
      requestGiveInfoId: '',
      stepCd: '',
      plantCd: '',
      giveTypeCd: '',
      isRequest: 'Y'
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
const safetyGear = ref<safetyGearType>({
  plantCd: null,
  requestDate: '',
  requestDeptCd: '',
  requestUserId: '',
  giveDate: '',
  giveTypeCd: '',
  giveDeptCd: '',
  giveUserId: '',
  sysApprovalRequestId: '',
  detailList: [],
  deleteDetailList: [],
  detailList2: [],
  deleteDetailList2: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'safetyTypeName',
      field: 'safetyTypeName',
      label: '보호구종류',
      style: 'width:120px',
      align: 'center',
      setHeader: true,
      sortable: false
    },
    {
      name: 'safetyGearName',
      field: 'safetyGearName',
      label: '보호구명',
      style: 'width:200px',
      align: 'left',
      setHeader: true,
      sortable: false
    },
    {
      name: 'requestCount',
      field: 'requestCount',
      label: '신청수량',
      style: 'width:80px',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      required: true,
      name: 'giveCount',
      field: 'giveCount',
      label: '지급수량',
      style: 'width:80px',
      align: 'right',
      type: 'number',
      setHeader: true,
      sortable: false
    },
    {
      required: true,
      setHeader: true,
      headType: 'multiUser',
      name: 'userArray',
      field: 'userArray',
      label: '수령인',
      style: 'width:300px',
      align: 'left',
      type: 'custom',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '지급보호구 비고',
      style: 'width:250px',
      align: 'left',
      type: 'text',
      setHeader: true,
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
const getUrl = ref('')
const saveUrl = ref(transactionConfig.sop.sas.give.insert.url)
const completeUrl = ref(transactionConfig.sop.sas.give.update.url)
const completeType = ref('PUT')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const userInfo = computed(() => {
  return {
    userItems: [],
    userText: 'userName',
    userValue: 'userId'
  }
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
  getUrl.value = selectConfig.sop.sas.give.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.param.requestGiveInfoId) {
    $http({
      url: $format(getUrl.value, props.param.requestGiveInfoId),
      method: 'GET'
    }).then((_result: any) => {
      safetyGear.value = _result.data
      if (safetyGear.value.giveUserId === '') safetyGear.value.giveUserId = user.value.userId
      if (_result.data.statusCd === 'SSC0000015') disabled.value = true
      if (!_result.data.detailList2 || _result.data.detailList2.length === 0) {
        _.forEach(_result.data.detailList, (item) => {
          safetyGear.value.detailList2!.push({
            giveListId: uid(),
            requestGiveInfoId: props.param.requestGiveInfoId,
            safetyGearId: item.safetyGearId,
            safetyTypeName: item.safetyTypeName,
            safetyGearName: item.safetyGearName,
            requestCount: item.requestCount,
            giveCount: item.requestCount,
            remarks: '',
            regUserId: user.value.userId,
            editFlag: 'C',
            userArray: []
          })
        })
      } else {
        _.forEach(_result.data.detailList2, (item) => {
          if (!item.userArray) item.userArray = []
          _.forEach(item.userList, (_item) => item.userArray.push(_item.giveUserId))
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function saveData() {
  if (safetyGear.value.requestGiveInfoId) {
    safetyGear.value.chgUserId = user.value.userId
    saveType.value = 'PUT'
  } else {
    safetyGear.value.regUserId = user.value.userId
    safetyGear.value.giveTypeCd = props.param.giveTypeCd
    saveType.value = 'POST'
  }
  if (!safetyGear.value.detailList2 || safetyGear.value.detailList2.length === 0) {
    message.alert({
      title: '안내',
      message: '지급할 보호구를 하나 이상 등록하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  } else {
    editForm.value.validate().then((_result: boolean) => {
      if (
        _result &&
        safetyGear.value.detailList2 &&
        validTable(grid.value.columns, safetyGear.value.detailList2)
      ) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            safetyGear.value.statusCd = 'SSC0000010'
            isSave.value = !isSave.value
          },
          cancelCallback: () => {}
        })
      } else message.validError()
    })
  }
}
function saveCallback(result: any) {
  props.param.requestGiveInfoId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 지급 완료 처리
 *******************************/
function completeData() {
  if (!safetyGear.value.detailList2 || safetyGear.value.detailList2.length === 0) {
    message.alert({
      title: '안내',
      message: '지급할 보호구를 하나 이상 등록하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      safetyGear.value.detailList2 &&
      validTable(grid.value.columns, safetyGear.value.detailList2)
    ) {
      message.confirm({
        title: '확인',
        message: '지급완료 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          safetyGear.value.chgUserId = user.value.userId
          safetyGear.value.statusCd = 'SSC0000015'
          completeUrl.value = saveUrl.value
          completeType.value = 'PUT'
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback(result?: any) {
  props.param.requestGiveInfoId = result.data
  message.requestSuccess()
  disabled.value = true
  getDetail()
}
/******************************
 * TODO (목적): 행 추가 (보호구 신청 팝업)
 *******************************/
// function addGearRequest() {
//   popupOptions.value = getPopupOptions('safetyGearRequest', popupOptions.value, closeRequestPopup, {
//     type: 'multiple',
//     searchParam: {
//       requestGiveInfoId: props.param.requestGiveInfoId,
//       isFormat: true
//     }
//   })
// }
// function closeRequestPopup(_data: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (_data && _data.length > 0) {
//     _.forEach(_data, (item) => {
//       if (_.findIndex(safetyGear.value.detailList2, { safetyGearId: item.safetyGearId }) === -1) {
//         safetyGear.value.detailList2!.push({
//           giveListId: uid(),
//           requestGiveInfoId: props.param.requestGiveInfoId,
//           safetyGearId: item.safetyGearId,
//           safetyTypeName: item.safetyTypeName,
//           safetyGearName: item.safetyGearName,
//           giveCount: item.requestCount,
//           userArray: [],
//           remarks: '',
//           regUserId: user.value.userId,
//           editFlag: 'C'
//         })
//       }
//     })
//   }
// }
/******************************
 * TODO (목적): 행 추가 (보호구 팝업)
 *******************************/
function addGear() {
  popupOptions.value = getPopupOptions('safetyGear', popupOptions.value, closePopup, {
    type: 'multiple',
    searchParam: { plantCd: safetyGear.value.plantCd }
  })
}
function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(safetyGear.value.detailList2, { safetyGearId: item.safetyGearId }) === -1) {
        safetyGear.value.detailList2!.push({
          giveListId: uid(),
          requestGiveInfoId: props.param.requestGiveInfoId,
          safetyGearId: item.safetyGearId,
          safetyTypeName: item.safetyTypeName,
          safetyGearName: item.safetyGearName,
          giveCount: '',
          userArray: [],
          remarks: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 선택 삭제
 *******************************/
function removeGear() {
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
        if (!safetyGear.value.deleteDetailList2) safetyGear.value.deleteDetailList2 = []
        _.forEach(selectData, (item) => {
          if (
            _.findIndex(safetyGear.value.deleteDetailList2, {
              giveListId: item.giveListId
            }) === -1 &&
            item.editFlag !== 'C'
          )
            safetyGear.value.deleteDetailList2!.push(item)
          safetyGear.value.detailList2 = _.reject(safetyGear.value.detailList2, item)
        })
        table.value.compoTable.clearSelection()
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): type='custom' 컬럼 값 변경시마다 반영
 *******************************/
function dataChange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

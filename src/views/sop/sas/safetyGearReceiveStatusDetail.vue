<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card title="보호구 기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant
                :disabled="true"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="safetyGear.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-task-target
                :customPopupParam="{ targetKey: 'safetyGear' }"
                :editable="editable"
                :readonly="true"
                :plantCd="safetyGear.plantCd"
                label="보호구"
                name="safetyGearName"
                v-model:value="safetyGear.safetyGearName"
                @dataChange="dataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                :disabled="true"
                label="보호구종류"
                name="safetyTypeName"
                v-model:value="safetyGear.safetyTypeName"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div v-if="isNew" class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
      <c-table
        ref="table1"
        title="보호구 입고 이력"
        :columns="grid.columns"
        :data="safetyGear.recepitList"
        :merge="grid.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        :gridHeight="gridHeight"
        selection="multiple"
        rowKey="safetyGearReceiptId"
        :plantCd="safetyGear.plantCd"
        @table-data-change="tableDataChange"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
              <c-btn
                v-if="editable && safetyGear.recepitList!.length > 0"
                :url="updateUrl"
                :isSubmit="isSave"
                :param="safetyGear.recepitList"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveRow"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-if="editable && safetyGear.recepitList!.length > 0"
                label="삭제"
                icon="remove"
                @btnClicked="removeRow"
              />
            </q-btn-group>
          </div>
        </template>
      </c-table>
    </div>
    <div v-if="isNew" class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
      <c-table
        ref="table2"
        title="보호구 출고 이력"
        :columns="grid2.columns"
        :data="safetyGear.deliverList"
        :merge="grid2.merge"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="false"
        :gridHeight="gridHeight"
        selection="multiple"
        rowKey="giveListId"
      >
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'userArray'">
            <c-multi-field
              :editable="editable"
              :disabled="true"
              :userInfo="userInfo"
              isArray
              type="user"
              label=""
              :name="`userArray${props.rowIndex}`"
              v-model:value="props.row[col.name]"
            />
          </template>
        </template>
      </c-table>
    </div>
    <div v-if="!isNew" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div>
        <q-chip outline square class="text-h5">
          <q-icon name="error" color="red" size="sm" style="margin-right: 6px" />
          {{ $language('보호구를 선택하세요.') }}
        </q-chip>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { safetyGearDetail } from './safetyGear'

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
  name: 'safetyGearReceiveStatusDetail'
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
  popupParam: {
    safetyGearId?: stringNull
    plantCd?: stringNull
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
      safetyGearId: '',
      plantCd: ''
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
const safetyGear = ref<safetyGearDetail>({
  plantCd: null,
  safetyGearId: '',
  safetyGearName: '',
  safetyTypeName: '',
  recepitList: [],
  deliverList: []
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'recepitDate',
      field: 'recepitDate',
      label: '입고일',
      style: 'width:120px',
      align: 'left',
      type: 'date',
      sortable: false
    },
    {
      required: true,
      name: 'recepitCount',
      field: 'recepitCount',
      label: '입고수량',
      style: 'width:100px',
      align: 'right',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'recepitPrice',
      field: 'recepitPrice',
      label: '단가',
      style: 'width:100px',
      align: 'right',
      type: 'number',
      sortable: false
    },
    {
      name: 'totalPrice',
      field: 'totalPrice',
      label: '총 금액(원)',
      style: 'width:100px',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      style: 'width:250px',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'giveDate',
      field: 'giveDate',
      label: '출고일',
      style: 'width:120px',
      align: 'center',
      setHeader: true,
      sortable: false
    },
    {
      name: 'giveCount',
      field: 'giveCount',
      label: '출고수량',
      style: 'width:70px',
      align: 'right',
      sortable: false
    },
    {
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
      label: '비고',
      style: 'width:120px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const updateUrl = ref(transactionConfig.sop.sas.recepit.update.url)
const getUrl = ref('')
const deleteUrl = ref('')
const gridHeight = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isNew = computed(() => Boolean(props.popupParam.safetyGearId))
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
  getUrl.value = selectConfig.sop.sas.recepit.get.url
  deleteUrl.value = transactionConfig.sop.sas.recepit.delete.url
  // code setting
  gridHeight.value = window.innerHeight - 250 + 'px'
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (props.popupParam.safetyGearId) {
    $http({
      url: $format(getUrl.value, props.popupParam.safetyGearId),
      method: 'GET'
    }).then((_result: any) => {
      safetyGear.value = _result.data
      _.forEach(_result.data.deliverList, (item) => {
        if (!item.userArray) item.userArray = []
        _.forEach(item.userList, (_item) => item.userArray.push(_item.giveUserId))
      })
    })
  }
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addRow() {
  safetyGear.value.recepitList!.splice(0, 0, {
    safetyGearReceiptId: uid(),
    safetyGearId: props.popupParam.safetyGearId,
    vendorCd: '',
    recepitUserId: '',
    recepitDate: getToday(),
    recepitCount: '',
    recepitPrice: '',
    remarks: '',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 좌측 입고이력 저장
 *******************************/
function saveRow() {
  if (validTable(grid.value.columns, safetyGear.value.recepitList!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 좌측 입고이력 선택 row 삭제
 *******************************/
function removeRow() {
  const selectData = table1.value.getSelected()
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
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table1.value.compoTable.clearSelection()
          getList()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 보호구 명 변경 시 발생 로직
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  props.popupParam.safetyGearId = data3.safetyGearId || ''
  safetyGear.value.safetyGearId = data3.safetyGearId || ''
  safetyGear.value.safetyTypeName = data3.safetyTypeName || ''
  if (data3.safetyGearId && data3.safetyGearId.length > 0) {
    $http({
      url: $format(getUrl.value, data3.safetyGearId),
      method: 'GET'
    }).then((_result: any) => {
      safetyGear.value = _result.data
      _.forEach(_result.data.deliverList, (item) => {
        if (!item.userArray) item.userArray = []
        _.forEach(item.userList, (_item) => item.userArray.push(_item.giveUserId))
      })
    })
  }
}
/******************************
 * TODO (목적): 테이블 내 값 변경시 계산
 *******************************/
function tableDataChange(_props: any) {
  if (Number(_props.row.recepitPrice) > 0 && Number(_props.row.recepitCount) > 0) {
    _props.row.totalPrice = Number(_props.row.recepitCount) * Number(_props.row.recepitPrice)
  } else _props.row.totalPrice = 0
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.text-h5
  font-size: 1.2em !important
  font-weight: bolder !important
</style>

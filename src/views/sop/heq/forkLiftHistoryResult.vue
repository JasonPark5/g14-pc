<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <q-form ref="editForm">
        <c-card title="기계/장비 이력 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !isReadOnly"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="data"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="save"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-if="props.popupParam.heqForkLiftHistoryId && !isReadOnly"
                label="삭제"
                :editable="editable && !isReadOnly"
                icon="delete_forever"
                @btnClicked="remove"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-task-target
                :required="true"
                :disabled="isReadOnly"
                :customPopupParam="{ targetKey: 'heqfork' }"
                label="중장비명"
                name="heqForkLiftId"
                @getName="
                  (name: string) => {
                    data.facilityName = name
                    dataChange()
                  }
                "
                v-model:value="data.heqForkLiftId"
                @getDetailTask="heqfork"
              />
            </div>
            <div class="col-2">
              <c-field
                required
                :disabled="disabled || isReadOnly"
                :editable="editable"
                :plantCd="popupParam.plantCd"
                :vendorCd="popupParam.vendorCd"
                label="점검자"
                userName="inspectionUserName"
                name="inspectionUserId"
                v-model:value="data.inspectionUserId"
                @username="
                  (val: any) => {
                    data.inspectionUserName = val
                  }
                "
                @dataChange="dataChange"
              />
            </div>
            <div class="col-2">
              <c-datepicker
                required
                :disabled="disabled || isReadOnly"
                type="date"
                :editable="editable"
                label="점검일"
                name="inspectionDate"
                v-model:value="data.inspectionDate"
                @datachange="dataChange"
              />
            </div>
            <div class="col-3">
              <c-text
                :editable="editable"
                :disabled="disabled || isReadOnly"
                label="특이사항"
                name="inspectionResultDetail"
                v-model:value="data.inspectionResultDetail"
              />
            </div>
            <div class="col-3">
              <c-text
                :disabled="disabled || isReadOnly"
                :editable="editable"
                :required="true"
                label="점검명"
                name="selfCheckName"
                v-model:value="data.selfCheckName"
              />
            </div>
          </template>
        </c-card>
        <div class="col-lg-12 col-md-12 col-sm-12">
          <c-table
            ref="table"
            title="점검항목 목록"
            :columns="grid.columns"
            :gridHeight="gridHeight"
            :data="data.forkLiftHistoryResultList"
            :filtering="false"
            :isExcelDown="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable && !disabled && !isReadOnly"
            rowKey="heqForkLiftHistoryResultId"
            selection="multiple"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'safetyMeasure'">
                <c-text-column
                  v-if="props.row['checkValue'] === 'N'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row['safetyMeasure']"
                />
                <span v-else />
              </template>
              <template v-else-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="editable && !disabled && !isReadOnly"
                  :isImmShow="true"
                  :requestContentsCols="requestContentsCols"
                  tableKey="heqForkLiftHistoryResultId"
                  ibmTaskTypeCd="ITT0000200"
                  ibmTaskUnderTypeCd="ITTU000225"
                  @imprChange="imprChange"
                />
              </template>
            </template>
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !isReadOnly"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult"
                />
                <c-btn
                  v-if="editable && !isReadOnly"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeResult"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </q-form>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { forkLiftHistoryResultType } from './forkLift'
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
  name: 'forkLiftHistoryResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heqForkLiftHistoryId: stringNull
    heqForkLiftId: stringNull
    facilityTypeCd: stringNull
    facilityTypeName: stringNull
    facilityName: stringNull
    checkValidPeriod: stringNull
    vendorCd: stringNull
    plantCd: stringNull
    readOnly: Boolean
  }
  contentHeight: stringNull
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
      heqForkLiftHistoryId: '',
      heqForkLiftId: '',
      facilityTypeCd: '',
      facilityTypeName: '',
      facilityName: '',
      checkValidPeriod: '',
      vendorCd: '',
      plantCd: '',
      readOnly: false
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const data = ref<forkLiftHistoryResultType>({
  heqForkLiftId: '',
  heqForkLiftHistoryId: '',
  heqForkLiftHistoryResultId: uid(),
  inspectionUserId: '',
  inspectionUserName: '',
  inspectionDate: '',
  inspectionResultDetail: '',
  regUserId: '',
  facilityName: '',
  chgUserId: '',
  selfCheckName: '',
  forkLiftHistoryResultList: [],
  deleteforkResultList: []
})
const saveUrl = ref('')
const saveType = ref('POST')
const insertUrl = ref('')
const disabled = ref(false)
const isSave = ref(false)
const grid = ref<any>({
  merge: [{ index: 0, colName: 'typeName' }],
  columns: [],
  data: []
})
const deleteUrl = ref('')
const updateUrl = ref('')
const getUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['resultName']
})
const isReadOnly = computed(() => Boolean(props.popupParam.readOnly))
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 150 + 'px' : '500px'
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
  getUrl.value = selectConfig.sop.heq.forkLift.result.get.url
  saveUrl.value = transactionConfig.sop.heq.forkLift.result.insert.url
  insertUrl.value = transactionConfig.sop.heq.forkLift.result.insert.url
  updateUrl.value = transactionConfig.sop.heq.forkLift.result.update.url
  deleteUrl.value = transactionConfig.sop.heq.forkLift.result.delete2.url
  // code setting
  // list setting
  getDetail()
  setHeader()
}
function getDetail() {
  if (props.popupParam.heqForkLiftHistoryId) {
    $http({
      url: $format(getUrl.value, props.popupParam.heqForkLiftHistoryId),
      method: 'GET'
    }).then((_result: any) => {
      data.value = _.clone(_result.data)
    })
  }
}
function stdInfo(_data: any) {
  $http({
    url: selectConfig.sop.heq.inspectitem.list.url,
    method: 'GET',
    params: {
      heqTypeCd: _data.facilityTypeCd
    }
  }).then((_result: any) => {
    data.value.forkLiftHistoryResultList = []
    _.forEach(_result.data, (_item) => {
      data.value.forkLiftHistoryResultList!.push({
        heqForkLiftHistoryId: props.popupParam.heqForkLiftHistoryId
          ? props.popupParam.heqForkLiftHistoryId
          : '',
        heqForkLiftHistoryResultId: uid(),
        typeName: _item.typeName,
        resultName: _item.inspectItem,
        checkValue: 'NE',
        safetyMeasure: '',
        editFlag: 'C'
      })
    })
  })
}
function setHeader() {
  grid.value.columns = [
    {
      name: 'typeName',
      field: 'typeName',
      label: '구분',
      style: 'width:10%',
      align: 'center',
      sortable: false,
      type: 'text'
    },
    {
      required: true,
      name: 'resultName',
      field: 'resultName',
      label: '점검항목',
      style: 'width:50%',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      setHeader: true,
      name: 'checkValue',
      field: 'checkValue',
      label: '점검결과',
      style: 'width:10%',
      align: 'center',
      type: 'select',
      sortable: false,
      comboItems: [
        { code: 'Y', codeName: '적정' },
        { code: 'N', codeName: '부적정' },
        { code: 'NE', codeName: '해당없음' }
      ]
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선진행',
      align: 'center',
      child: [
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:30%',
          type: 'custom',
          sortable: false
        }
      ]
    }
  ]
}
function save() {
  saveType.value = props.popupParam.heqForkLiftHistoryId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          data.value.heqForkLiftId = props.popupParam.heqForkLiftId
          data.value.heqForkLiftHistoryId = props.popupParam.heqForkLiftHistoryId
          data.value.regUserId = user.value.userId
          data.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.heqForkLiftHistoryId = _result.data
  getDetail()
}
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.heqForkLiftHistoryId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
// 개선창 닫기 후
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
function dataChange() {
  if (data.value.facilityName && data.value.inspectionUserName && data.value.inspectionDate) {
    data.value.selfCheckName =
      data.value.facilityName +
      ' ' +
      data.value.inspectionUserName +
      ' ' +
      data.value.inspectionDate
  }
}
function heqfork(data: any) {
  if (props.popupParam.heqForkLiftId === data.heqForkLiftId) return
  props.popupParam.heqForkLiftId = data.heqForkLiftId
  props.popupParam.facilityName = data.facilityName

  stdInfo(data)
}
const addResult = () => {
  data.value.forkLiftHistoryResultList?.unshift({
    heqForkLiftHistoryId: props.popupParam.heqForkLiftHistoryId,
    heqForkLiftHistoryResultId: uid(),
    typeName: '',
    resultName: '',
    checkValue: 'NE',
    safetyMeasure: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
const removeResult = () => {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!data.value.deleteforkResultList) data.value.deleteforkResultList = []
      if (
        _.findIndex(data.value.deleteforkResultList, {
          heqForkLiftHistoryResultId: item.heqForkLiftHistoryResultId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        data.value.deleteforkResultList.push(item)
      }
      data.value.forkLiftHistoryResultList = _.reject(data.value.forkLiftHistoryResultList, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !disabled && isOld"
              label="삭제"
              icon="delete"
              @btnClicked="deleteInfo"
            />
            <c-btn
              v-show="editable && !disabled"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="check"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-show="editable && !disabled && isOld"
              :url="completeUrl"
              :isSubmit="isComplete"
              :param="check"
              mappingType="PUT"
              label="완료"
              icon="check"
              @beforeAction="completeInfo"
              @btnCallback="completeCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-text
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="점검명"
              name="checkName"
              v-model:value="check.checkName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-select
              :required="true"
              :disabled="disabled"
              :editable="editable"
              codeGroupCd="SOP_FIRE_FIGHTING_CHECK_TYPE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              label="점검유형"
              name="sopFireFightingCheckTypeCd"
              v-model:value="check.sopFireFightingCheckTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-datepicker
              :required="true"
              :disabled="disabled"
              :editable="editable"
              range
              default="today"
              label="점검기간"
              name="period"
              v-model:value="check.period"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-plant
              :required="true"
              :disabled="disabled"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="check.plantCd"
            />
          </div> -->
        </template>
      </c-card>
    </q-form>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-table
          ref="table1"
          class="q-mt-sm"
          title="점검 대상"
          :columns="grid.columns"
          :data="check.targets"
          :gridHeight="gridHeight"
          :editable="editable && !disabled"
          :filtering="false"
          :columnSetting="false"
          :isExcelDown="false"
          selection="multiple"
          rowKey="sopFireFightingCheckTargetId"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled && check.targets!.length > 0"
                label="제외"
                icon="delete"
                @btnClicked="deleteTarget"
              />
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addTarget" />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name !== 'custom'">
              {{ props.row[col.name] }}
              <div style="font-size: 0.8em">
                <template v-if="col.name === 'sopFireFightingTypeName'">
                  ({{ props.row['sopFireFightingKindName'] }})
                </template>
                <template v-if="col.name === 'fireFightingName'">
                  ({{ props.row['manageNo'] }})
                </template>
              </div>
            </template>
            <!-- <template v-else-if="col.name === 'custom'">
              <q-icon
                name="arrow_forward_ios"
                size="sm"
                color="blue"
                class="cursor-pointer"
                @click.stop="rowClick(props.row)"
              />
            </template> -->
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-table
          ref="table2"
          class="q-mt-sm"
          :title="select.sopFireFightingId ? `[${select.fireFightingName}] 점검항목` : '점검항목'"
          :columns="gridResult.columns"
          :data="select.results"
          :gridHeight="gridHeight"
          :editable="editable && !disabled"
          :filtering="false"
          :columnSetting="false"
          :isExcelDown="false"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'customCol'">
              <component
                :is="imprComponent"
                :col="col"
                :props="props"
                :inputEditable="editable && !disabled"
                :isImmShow="true"
                :requestContentsCols="['itemName']"
                tableKey="sopFireFightingCheckTargetResultId"
                ibmTaskTypeCd="ITT0000180"
                ibmTaskUnderTypeCd="ITTU000210"
                @imprChange="imprChange"
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
import { checkType, selectType } from './fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingCheckInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopFireFightingCheckId?: stringNull
  }
  contentHeight?: stringNull
  isOld?: boolean
  disabled?: boolean
  check?: checkType
  select?: selectType
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
      sopFireFightingCheckId: ''
    }
  },
  check: () => {
    return {
      sopFireFightingCheckId: '', // 소방설비 점검 일련번호
      plantCd: '', // 사업장
      sopFireFightingCheckTypeCd: null, // 점검유형
      checkName: '', // 점검명
      sopFireFightingCheckStepCd: '', // 점검진행상태
      checkStartDate: '', // 점검시작일
      checkEndDate: '', // 점검종료일
      period: [],
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      targets: [],
      deleteTargets: [],
      imprs: []
    }
  },
  select: () => {
    return {
      sopFireFightingId: '',
      sopFireFightingKindCd: '',
      fireFightingName: '',
      editFlag: '',
      results: []
    }
  },
  isOld: false,
  disabled: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      name: 'sopFireFightingTypeName',
      field: 'sopFireFightingTypeName',
      label: '설비유형(종류)',
      align: 'center',
      sortable: false,
      style: 'width: 130px',
      type: 'custom'
    },
    {
      name: 'fireFightingName',
      field: 'fireFightingName',
      label: '소방설비(관리번호)',
      align: 'center',
      sortable: false,
      style: 'width: 130px',
      type: 'custom'
    },
    // {
    //   required: true,
    //   name: 'checkScheduleDate',
    //   field: 'checkScheduleDate',
    //   label: '점검예정일',
    //   style: 'width:100px',
    //   align: "center",
    //   sortable: false,
    //   type: 'date',
    //   value: '',
    //   setHeader: true,
    // },
    // {
    //   required: true,
    //   name: "deptName",
    //   field: "deptName",
    //   style: 'width:100px',
    //   label: "점검부서",
    //   align: "center",
    //   sortable: false,
    //   type: 'dept',
    //   deptCd: 'deptCd',
    //   value: '',
    //   setHeader: true,
    // },
    // {
    //   name: "checkDate",
    //   field: "checkDate",
    //   style: 'width:100px',
    //   label: "점검일",
    //   align: "center",
    //   sortable: false,
    //   type: 'date',
    //   value: '',
    //   setHeader: true,
    // },
    {
      name: 'checkResult',
      field: 'checkResult',
      style: 'width:350px',
      label: '점검결과',
      align: 'left',
      sortable: false,
      type: 'text'
    }
    // {
    //   name: "custom",
    //   field: "custom",
    //   style: 'width:50px',
    //   label: "항목",
    //   align: "center",
    //   sortable: false,
    //   type: 'custom',
    // }
  ],
  data: []
})
const gridResult = ref<gridType>({
  columns: [
    {
      name: 'itemName',
      field: 'itemName',
      label: '점검항목',
      align: 'left',
      style: 'width:350px',
      sortable: false
    },
    {
      name: 'sopFireFightingCheckResultCd',
      field: 'sopFireFightingCheckResultCd',
      label: '점검결과',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'SOP_FIRE_FIGHTING_CHECK_RESULT_CD',
      value: '',
      setHeader: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const mappingType = ref('PUT')
const listItemUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const selectedRow = ref<object>({})
const items = ref<Array<any>>([])

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 180 + 'px' : '530px'
)
// 개선요청 Component
const imprComponent = computed(() => {
  return markRaw(defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`)))
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
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  listItemUrl.value = selectConfig.fft.base.item.list.url
  saveUrl.value = transactionConfig.fft.fireFightingCheck.update.url
  deleteUrl.value = transactionConfig.fft.fireFightingCheck.delete.url
  completeUrl.value = transactionConfig.fft.fireFightingCheck.complete.url
  // code setting
  // list setting
  if (editable.value && !props.disabled) getItems()
}
/******************************
 * TODO (목적): 항목 조회
 *******************************/
function getItems() {
  $http({
    url: listItemUrl.value,
    method: 'GET',
    params: {
      plantCd: props.check.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) items.value = _result.data
  })
}
/******************************
 * TODO (목적): 행클릭시 실행
 *******************************/
function rowClick(row: any) {
  selectedRow.value = row
  props.select.sopFireFightingId = row.sopFireFightingId
  props.select.sopFireFightingKindCd = row.sopFireFightingKindCd
  props.select.fireFightingName = row.fireFightingName
  props.select.editFlag = row.editFlag
  props.select.results = row.results
}
/******************************
 * TODO (목적): 점검대상 row 제외
 *******************************/
function deleteTarget() {
  const selectData = table1.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.check.deleteTargets) props.check.deleteTargets = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.check.deleteTargets, { sopFireFightingId: item.sopFireFightingId }) === -1
      )
        props.check.deleteTargets!.push(item)
      props.check.targets = _.reject(props.check.targets, item)
    })
    table1.value.compoTable.clearSelection()
    selectedRow.value = {}
  }
}
/******************************
 * TODO (목적): 점검대상 추가
 *******************************/
function addTarget() {
  popupOptions.value = getPopupOptions('fireFightingEquip', popupOptions.value, closeTarget, {
    type: 'multiple',
    plantCd: props.check.plantCd
  })
}
function closeTarget(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(props.check.targets, { sopFireFightingId: item.sopFireFightingId }) === -1) {
        const _sopFireFightingCheckTargetId = uid()
        const _results = [] as Array<any>
        _.forEach(
          _.filter(items.value, {
            plantCd: item.plantCd,
            sopFireFightingKindCd: item.sopFireFightingKindCd
          }),
          (_item) => {
            _results.push({
              sopFireFightingCheckTargetResultId: uid(), // 소방설비 점검결과 일련번호
              sopFireFightingCheckTargetId: _sopFireFightingCheckTargetId, // 소방설비 점검대상 일련번호
              sopFireFightingCheckId: props.popupParam.sopFireFightingCheckId, // 소방설비 점검 일련번호
              sopFireFightingCheckItemId: _item.sopFireFightingCheckItemId, // 소방설비 점검항목 일련번호
              sopFireFightingTypeCd: _item.sopFireFightingTypeCd,
              sopFireFightingTypeName: _item.sopFireFightingTypeName,
              itemName: _item.itemName,
              sopFireFightingCheckResultCd: 'FFCR000001', // 점검결과
              remarks: '', // 비고
              regUserId: user.value.userId, // 등록자 ID
              editFlag: 'C'
            })
          }
        )
        props.check.targets!.push({
          sopFireFightingCheckTargetId: _sopFireFightingCheckTargetId, // 소방설비 점검대상 일련번호
          sopFireFightingCheckId: props.popupParam.sopFireFightingCheckId, // 소방설비 점검 일련번호
          sopFireFightingId: item.sopFireFightingId, // 소방설비 일련번호
          fireFightingName: item.fireFightingName, // 소방설비 일련번호
          sopFireFightingTypeName: item.sopFireFightingTypeName, // 소방설비 일련번호
          sopFireFightingKindName: item.sopFireFightingKindName, // 소방설비 일련번호
          manageNo: item.manageNo, // 소방설비 일련번호
          // deptCd: user.value.deptCd,  // 점검부서
          // checkScheduleDate: getToday(),  // 점검예정일
          // checkDate: '',  // 점검일
          checkResult: '', // 점검결과
          results: _results,
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.isOld ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.check.regUserId = user.value.userId
          props.check.chgUserId = user.value.userId
          props.check.checkStartDate = props.check.period![0]
          props.check.checkEndDate = props.check.period![1]
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.sopFireFightingCheckId = _result.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 점검플랜 삭제
 *******************************/
function deleteInfo() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopFireFightingCheckId),
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
 * TODO (목적): 완료 처리. 체크 1. 점검대상이 하나 이상있는지? > 2. 점검대상에 점검일이 입력되어 있는지?
 *******************************/
function completeInfo() {
  if (!props.check.targets || props.check.targets.length === 0) {
    message.alert({
      title: '안내',
      message: '점검대상이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // else {
  //   let _filter = _.filter(props.check.targets, (item) => !item.checkDate)
  //   if (_filter && _filter.length > 0) {
  //     message.alert({
  //       title: '안내',
  //       message: '점검일이 입력되지 않은 점검대상이 있습니다..',
  //       type: 'warning', // success / info / warning / error
  //     })
  //     return
  //   }
  // }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.check.regUserId = user.value.userId
          props.check.chgUserId = user.value.userId
          props.check.checkStartDate = props.check.period![0]
          props.check.checkEndDate = props.check.period![1]
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopFireFightingCheckId = result.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  // emits('getDetail');
  // rowClick(selectedRow.value)
  table2.value.compoTable.resetVirtualScroll()
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

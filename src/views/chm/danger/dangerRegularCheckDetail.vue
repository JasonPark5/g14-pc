<template>
  <q-form ref="editForm" class="q-pb-lg">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="
              Boolean(check.chmDangerRegularCheckId) && !disabled && editable && !popupParam.isView
            "
            :url="completeUrl"
            :isSubmit="isComplete"
            :param="check"
            mappingType="PUT"
            label="완료"
            icon="check"
            @beforeAction="completeRegularCheck"
            @btnCallback="completeCallback"
          />
          <c-btn
            v-if="
              Boolean(check.chmDangerRegularCheckId) && !disabled && editable && !popupParam.isView
            "
            label="삭제"
            icon="delete_forever"
            @btnClicked="remove"
          />
          <c-btn
            v-if="editable && !disabled && !popupParam.isView"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="check"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveRegularCheck"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            required
            :editable="editable"
            :disabled="disabled || popupParam.isView"
            label="위험물저장소명"
            name="chmDangerMstId"
            :customPopupParam="{ targetKey: 'hazardStorage' }"
            v-model:value="check.chmDangerMstId"
            @dataChange="dataChange"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :disabled="true"
            type="edit"
            codeGroupCd="CHM_DANGER_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="chmDangerTypeCd"
            label="구분"
            v-model:value="check.chmDangerTypeCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :disabled="true"
            :editable="editable"
            label="품명"
            name="chmDangerMstName"
            v-model:value="check.chmDangerMstName"
          />
        </div> -->
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="true"
            :editable="editable"
            label="지정수량배수 (품목별 배수의 합계)"
            name="chmDangerCount"
            type="number"
            v-model:value="check.chmDangerCount"
          />
        </div>
        <!-- <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            required
            :editable="editable"
            :disabled="disabled || popupParam.isView"
            type="edit"
            name="plantCd"
            v-model:value="check.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            required
            :editable="editable"
            :disabled="disabled || popupParam.isView"
            :data="check"
            label="점검자"
            type="user"
            name="chmDangerInspectorUserId"
            v-model:value="check.chmDangerInspectorUserId"
            @user="gridchange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :editable="editable"
            :disabled="disabled || popupParam.isView"
            :range="true"
            label="점검기간"
            name="period"
            v-model:value="check.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            required
            :editable="editable"
            :disabled="disabled || popupParam.isView"
            label="점검명"
            name="chmDangerCheckName"
            v-model:value="check.chmDangerCheckName"
          />
        </div>
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="tableType"
          title="취급품목"
          :columns="grid2.columns"
          gridHeight="200px"
          :data="check.checkitems"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          noDataLabel="저장품목을 추가하세요."
          rowKey="chmDangerRegularCheckItemId"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'calcuMethod'">
              {{
                toThousandFilter(Number(props.row.calcuOriginal) * Number(props.row.calcuMultiple))
              }}
            </template>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="fireTable"
          title="소방시설"
          :columns="gridFire.columns"
          :data="check.fireFightings"
          gridHeight="200px"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          noDataLabel="소방시설을 추가하세요."
          :editable="editable"
          rowKey="sopFireFightingId"
        />
      </div>
    </div>
    <c-table
      ref="table"
      title="정기점검항목 목록"
      :columns="grid.columns"
      gridHeight="580px"
      :data="check.checkResults"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      noDataLabel="점검항목을 추가하세요."
      :editable="editable && !disabled && !popupParam.isView"
      rowKey="chmDangerRegularCheckResultId"
      selection="multiple"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled && !popupParam.isView"
            :isImmShow="true"
            :requestContentsCols="['dangerCheckItem']"
            tableKey="chmDangerRegularCheckResultId"
            ibmTaskTypeCd="ITT0000205"
            ibmTaskUnderTypeCd="ITTU000235"
            @imprChange="imprChange"
          />
        </template>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !popupParam.isView"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addResult"
          />
          <c-btn
            v-if="
              editable && !popupParam.isView && check.checkResults && check.checkResults.length > 0
            "
            :showLoading="false"
            label="제외"
            icon="remove"
            @btnClicked="removeResult"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </q-form>
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
import { dangerCheckType } from './dangerStorage'
import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerRegularCheckDetail'
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
    chmDangerRegularCheckId?: stringNull
    chmDangerMstTypeId?: stringNull
    chmStatusDangerRegularCheckCd?: stringNull
    isView?: boolean
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
  contentHeight: null,
  popupParam: () => {
    return {
      chmDangerRegularCheckId: '',
      chmStatusDangerRegularCheckCd: '',
      chmDangerMstTypeId: '',
      isView: false
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
const check = ref<dangerCheckType>({
  chmDangerRegularCheckId: '',
  chmDangerMstId: '',
  chmDangerMstName: '',
  chmDangerMstTypeId: '',
  plantCd: '',
  chmDangerTypeCd: null,
  chmDangerLocation: '',
  chmDangerCheckName: '',
  chmDangerPermitNo: '',
  chmDangerUserId: '',
  chmDangerManageUserId: '',
  chmDangerSafetyUserId: '',
  chmDangerInspectorUserId: '',
  chmStatusDangerRegularCheckCd: '',
  chmDangerCount: '',
  installPermitDate: '',
  chmDangerHandlingOverview: '',
  chmDangerStartDate: '',
  chmDangerEndDate: '',
  checkitems: [],
  deletecheckitems: [],
  period: [],
  checkResults: [],
  deleteCheckResults: [],
  types: [],
  fireFightings: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'dangerCheckItem',
      field: 'dangerCheckItem',
      label: '점검항목',
      type: 'text',
      style: 'width:180px',
      align: 'left',
      sortable: false
    },
    {
      required: true,
      name: 'dangerCheckContent',
      field: 'dangerCheckContent',
      label: '점검내용',
      type: 'text',
      // style: 'width:240px',
      align: 'left',
      sortable: false
    },
    {
      name: 'dangerCheckMethod',
      field: 'dangerCheckMethod',
      label: '점검방법',
      type: 'text',
      style: 'width:180px',
      align: 'left',
      sortable: false
    },
    {
      required: true,
      name: 'dangerCheckResult',
      field: 'dangerCheckResult',
      label: '점검결과',
      setHeader: true,
      align: 'center',
      style: 'width:100px',
      type: 'select',
      codeGroupCd: 'CHM_DANGER_REGULAR_CHECK_RESULT_CD',
      isChip: true,
      sortable: false
    },
    {
      setHeader: true,
      name: 'dangerCheckRemark',
      field: 'dangerCheckRemark',
      label: '비고',
      align: 'left',
      type: 'textarea',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      type: 'custom',
      style: 'width:280px',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'dangerItemName',
      field: 'dangerItemName',
      label: '품목',
      // style: 'width:300px',
      align: 'left',
      sortable: false
    },
    {
      name: 'chmDangerTypeName',
      field: 'chmDangerTypeName',
      label: '품목명',
      // style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      // style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'calcuOriginal',
      field: 'calcuOriginal',
      label: '품목별 지정수량 (L/KG)',
      // style: 'width:150px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'calcuMultiple',
      field: 'calcuMultiple',
      label: '배수(사업장 허가)',
      // style: 'width:150px',
      sortable: false
    },
    {
      name: 'calcuMethod',
      field: 'calcuMethod',
      label: '적용 지정수량 (L/KG)',
      // style: 'width:150px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const gridFire = ref<gridType>({
  columns: [
    {
      name: 'manageNo',
      field: 'manageNo',
      label: '관리번호',
      align: 'center',
      sortable: true
      // style: 'width: 100px'
    },
    {
      name: 'fireFightingName',
      field: 'fireFightingName',
      label: '소화설비',
      align: 'left',
      sortable: true
      // style: 'width: 200px'
    },
    {
      name: 'sopFireFightingTypeName',
      field: 'sopFireFightingTypeName',
      label: '유형',
      align: 'center',
      sortable: true
      // style: 'width: 100px'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '관리부서',
      align: 'left',
      sortable: true
      // style: 'width: 100px'
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const saveType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)
const userNames = ref('')

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => check.value.chmStatusDangerRegularCheckCd === 'CSDRCC0002')
const imprComponent = computed(() =>
  markRaw(defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`)))
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [check.value.chmDangerLocation, check.value.chmDangerInspectorUserId, check.value.period],
  () => {
    if (
      !props.popupParam.chmDangerRegularCheckId &&
      check.value.chmDangerLocation &&
      check.value.chmDangerInspectorUserId &&
      check.value.period &&
      check.value.period.length === 2
    ) {
      check.value.chmDangerCheckName = `${check.value.chmDangerLocation} / ${userNames.value} / ${check.value.period[0]}~${check.value.period[1]}`
    }
  }
)

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
  detailUrl.value = selectConfig.chm.danger.regularChecks.get.url
  saveUrl.value = transactionConfig.chm.danger.regularCheck.insert.url
  completeUrl.value = transactionConfig.chm.danger.regularCheck.complete.url
  deleteUrl.value = transactionConfig.chm.danger.regularCheck.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.chmDangerRegularCheckId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.chmDangerRegularCheckId),
      method: 'GET'
    }).then((_result: any) => {
      check.value = _result.data
      check.value.period = [_result.data.chmDangerStartDate, _result.data.chmDangerEndDate]
    })
  }
}
/******************************
 * TODO (목적): 품명 변경시 반영 로직
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  if (data3.chmDangerMstId!.length > 0) {
    $http({
      url: $format(selectConfig.chm.danger.master.get.url, data3.chmDangerMstId),
      method: 'GET'
    }).then((_result: any) => {
      if (!props.popupParam.chmDangerRegularCheckId) {
        _result.data = _.extend(_result.data, {
          chmDangerLocation: _result.data.chmDangerArea,
          chmDangerMstName: _result.data.chmDangerMstName,
          chmDangerMstId: _result.data.chmDangerMstId,
          chmDangerTypeCd: _result.data.chmDangerTypeCd,
          chmDangerCount: _result.data.chmDangerCount,
          chmDangerManageUserId: _result.data.chmDangerManageUserId,
          chmDangerUserId: _result.data.chmDangerUserId
        })
        _result.data.checkitems = _.map(_result.data.typeList, (item) =>
          _.extend(item, {
            regUserId: user.value.userId,
            editFlag: 'C'
          })
        )
        _result.data.checkResults = _.map(_result.data.itemList, (item) =>
          _.extend(item, {
            dangerCheckResult: 'CDRCRC0001',
            regUserId: user.value.userId,
            editFlag: 'C'
          })
        )
      } else {
        _result.data.checkitems = _.map(_result.data.typeList, (item) =>
          _.extend(item, {
            regUserId: user.value.userId,
            editFlag: 'C'
          })
        )
      }
      _.extend(check.value, _result.data)
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveRegularCheck() {
  saveType.value = props.popupParam.chmDangerRegularCheckId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      (check.value.checkResults!.length === 0 ||
        validTable(grid.value.columns, check.value.checkResults))
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          if (check.value.period && check.value.period.length > 0) {
            check.value.chmDangerStartDate = check.value.period[0]
            check.value.chmDangerEndDate = check.value.period[1]
          }
          check.value.regUserId = user.value.userId
          check.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.popupParam.chmDangerRegularCheckId)
    props.popupParam.chmDangerRegularCheckId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 완료처리
 *******************************/
function completeRegularCheck() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          check.value.regUserId = user.value.userId
          check.value.chgUserId = user.value.userId
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback() {
  message.requestSuccess()
  props.popupParam.chmStatusDangerRegularCheckCd = 'CSDRCC0002'
  getDetail()
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
        url: $format(deleteUrl.value, props.popupParam.chmDangerRegularCheckId),
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
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
  getDetail()
}
function gridchange(_data?: any) {
  userNames.value = Array.isArray(_data) ? _data.map((d: any) => d.userName).join(',') : ''
}
/******************************
 * TODO (목적): 점검항목 추가
 *******************************/
const addResult = () => {
  check.value.checkResults?.splice(0, 0, {
    chmDangerRegularCheckId: props.popupParam.chmDangerRegularCheckId,
    chmDangerRegularCheckResultId: uid(),
    dangerCheckItem: '',
    dangerCheckContent: '',
    dangerCheckMethod: '',
    dangerCheckResult: 'CDRCRC0001',
    dangerCheckRemark: '',
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
      if (!check.value.deleteCheckResults) check.value.deleteCheckResults = []
      if (
        _.findIndex(check.value.deleteCheckResults, {
          chmDangerRegularCheckResultId: item.chmDangerRegularCheckResultId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        check.value.deleteCheckResults.push(item)
      }
      check.value.checkResults = _.reject(check.value.checkResults, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

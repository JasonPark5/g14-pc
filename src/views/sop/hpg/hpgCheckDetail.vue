<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <q-form ref="editForm">
        <c-card title="시설점검 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-appr-btn
                ref="apprBtn"
                name="apprBtn"
                :approvalInfo="approvalInfo"
                @beforeApprAction="approval"
                @callbackApprAction="apprBtn.apprRequestPop()"
                @requestAfterAction="getDetail"
              />
              <c-btn
                v-if="editable && !disabled && isOld"
                label="삭제"
                icon="delete_forever"
                @btnClicked="remove"
              />
              <c-btn
                v-if="editable && !disabled"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="hpgCheck"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="save"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="false"
                label="시설명"
                name="hpgName"
                v-model:value="hpgCheck.hpgName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                required
                type="edit"
                :editable="editable && !disabled && !isOld"
                :comboItems="checkTypeItems"
                itemText="codeName"
                itemValue="code"
                label="점검종류"
                name="checkTypeCd"
                v-model:value="hpgCheck.checkTypeCd"
                @update:value="getItemList"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                required
                :editable="editable && !disabled"
                type="date"
                label="점검일"
                name="checkDate"
                v-model:value="hpgCheck.checkDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-dept
                :required="true"
                :editable="editable && !disabled"
                :isFirstValue="false"
                label="점검대상부서"
                name="targetDeptCd"
                v-model:value="hpgCheck.targetDeptCd"
                @setDeptName="(val: any) => (hpgCheck.targetDeptName = val)"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-multi-field
                :editable="editable && !disabled"
                :deptCd="hpgCheck.targetDeptCd"
                label="점검대상자"
                type="user"
                name="targetIds"
                v-model:value="hpgCheck.targetIds"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                required
                :editable="editable && !disabled"
                label="점검자"
                name="checkerId"
                v-model:value="hpgCheck.checkerId"
                @username="(val: any) => (hpgCheck.checkerName = val)"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                required
                :editable="editable && !disabled"
                label="점검명"
                name="checkName"
                v-model:value="hpgCheck.checkName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="editable && !disabled"
                autogrow
                label="특이사항"
                name="checkDetail"
                v-model:value="hpgCheck.checkDetail"
              />
            </div>
          </template>
        </c-card>
        <div class="col-lg-12 col-md-12 col-sm-12">
          <c-table
            ref="table"
            title="점검항목 목록"
            :columns="grid.columns"
            :data="hpgCheck.results"
            gridHeightAuto
            :filtering="false"
            :isExcelDown="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable && !disabled"
            rowKey="hpgCheckResultId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult"
                />
                <c-btn
                  v-if="editable && !disabled && hpgCheck.results!.length > 0"
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
import { hpgCheckType } from './hpgCheck'

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
  name: 'hpgCheckDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const route = useRoute()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hpgCheckId: stringNull
  }
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
      hpgCheckId: ''
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const hpgCheck = ref<hpgCheckType>({
  hpgCheckId: '',
  hpgName: '고압가스 저장소',
  checkTypeCd: 'D',
  checkTypeName: '일간',
  checkName: '',
  checkDate: getToday(),
  checkerId: user.value.userId,
  checkerName: user.value.userName,
  checkDetail: '',
  completeFlag: 'N',
  targetIds: '',
  targetDeptCd: null,
  targetDeptName: '',
  results: [],
  delResults: []
})
const grid = ref<any>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      type: 'number',
      style: 'width:3%',
      sortable: false
    },
    {
      required: true,
      name: 'divisionName',
      field: 'divisionName',
      label: '구분',
      style: 'width:12%',
      align: 'left',
      sortable: false,
      type: 'text'
    },
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '점검항목',
      // style: 'width:50%',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'checkResultCd',
      field: 'checkResultCd',
      label: '점검결과',
      style: 'width:8%',
      align: 'center',
      sortable: false,
      type: 'select',
      codeGroupCd: 'SAFETY_RESULT_CD',
      isChip: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:20%',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const saveType = ref('POST')
const isSave = ref(false)
const saveUrl = ref('')
const deleteUrl = ref('')
const getUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)
const checkTypeItems = ref<Array<codeMasterType>>([])
const isApproval = ref(false)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.hpgCheckId))
const disabled = computed(
  () => hpgCheck.value.completeFlag === 'Y' || Boolean(hpgCheck.value.sysApprovalRequestId)
)
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: hpgCheck.value.sysApprovalRequestId, // 결재요청번호
    approvalStatusCd: hpgCheck.value.approvalStatusCd,
    apprEditable: editable && isOld.value && hpgCheck.value.completeFlag !== 'Y', // 결재버튼 활성화 기준
    param: hpgCheck.value, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000033', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      hpgCheckId: hpgCheck.value.hpgCheckId,
      isApprContent: true
    },
    approvalRequestName: '[시설점검] ' + hpgCheck.value.checkName, // 결재요청명 (문서 title)
    approvalConnId: hpgCheck.value.hpgCheckId // 결재연결용 업무일련번호 (문서 key)
  }
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [hpgCheck.value.checkDate, hpgCheck.value.checkTypeCd, hpgCheck.value.targetDeptName],
  () => {
    hpgCheck.value.checkName = `고압가스 저장소 시설점검_${hpgCheck.value.checkTypeCd === 'D' ? '일간' : hpgCheck.value.checkTypeCd === 'W' ? '주간' : '월간'}_${hpgCheck.value.targetDeptName}_${hpgCheck.value.checkDate}`
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
  getUrl.value = selectConfig.sop.heq.hpg.check.get.url
  saveUrl.value = transactionConfig.sop.heq.hpg.check.insert.url
  deleteUrl.value = transactionConfig.sop.heq.hpg.check.delete.url
  // code setting
  // list setting
  getComboItems('CHECK_CYCLE_CD').then((_result: any) => {
    checkTypeItems.value = _.filter(_result, (row: any) => row.attrVal3 === 'Y')
  })
  getDetail()
}
function getDetail() {
  if (props.popupParam.hpgCheckId) {
    $http({
      url: getUrl.value,
      method: 'GET',
      params: { hpgCheckId: props.popupParam.hpgCheckId }
    }).then((_result: any) => {
      hpgCheck.value = _result.data
      emits('setRegInfo', _result.data)
    })
  } else {
    hpgCheck.value.checkTypeCd = 'D'
    hpgCheck.value.checkTypeName = '일간'
    hpgCheck.value.checkDate = getToday()
    hpgCheck.value.checkerId = user.value.userId
    hpgCheck.value.checkerName = user.value.userName
    hpgCheck.value.targetDeptCd = user.value.deptCd
    hpgCheck.value.targetDeptName = user.value.deptName
    hpgCheck.value.completeFlag = 'N'
    hpgCheck.value.checkName = `고압가스 저장소 시설점검 일간_${user.value.deptName}_${getToday()}`
    getItemList()
  }
}
function getItemList() {
  $http({
    url: selectConfig.sop.heq.hpg.item.list.url,
    method: 'GET',
    params: {
      useFlag: 'Y',
      checkTypeCd: hpgCheck.value.checkTypeCd
    }
  }).then((_result: any) => {
    _.forEach(_result.data, (row: any) => {
      row.checkResultCd = 'SRC0000002'
      row.regUserId = user.value.userId
      row.editFlag = 'C'
      row.hpgCheckId = null
      row.hpgCheckResultId = uid()
    })
    hpgCheck.value.results = _result.data
  })
}
function save() {
  saveType.value = props.popupParam.hpgCheckId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, hpgCheck.value.results)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          hpgCheck.value.regUserId = user.value.userId
          hpgCheck.value.chgUserId = user.value.userId
          _.forEach(hpgCheck.value.results, (row: any) => {
            row.regUserId = user.value.userId
            row.chgUserId = user.value.userId
          })
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!isOld.value) props.popupParam.hpgCheckId = _result.data
  getDetail()
}
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.hpgCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
function addResult() {
  hpgCheck.value.results?.push({
    hpgCheckId: props.popupParam.hpgCheckId,
    hpgCheckResultId: uid(),
    hpgCheckItemId: null,
    divisionName: '',
    itemName: '',
    checkResultCd: 'SRC0000002',
    remark: '',
    sortOrder: hpgCheck.value.results?.length + 1,
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeResult() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!hpgCheck.value.delResults) hpgCheck.value.delResults = []
      if (
        _.findIndex(hpgCheck.value.delResults, { hpgCheckResultId: item.hpgCheckResultId }) ===
          -1 &&
        item.editFlag !== 'C'
      )
        hpgCheck.value.delResults.push(item)
      hpgCheck.value.results = _.reject(hpgCheck.value.results, item)
    })
  }
}
/******************************
 * TODO (목적): 결재관리
 *******************************/
function approval() {
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, hpgCheck.value.results)) {
      message.confirm({
        title: '확인',
        message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          hpgCheck.value.chgUserId = user.value.userId
          _.forEach(hpgCheck.value.results, (row: any) => {
            row.chgUserId = user.value.userId
          })
          isApproval.value = !isApproval.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

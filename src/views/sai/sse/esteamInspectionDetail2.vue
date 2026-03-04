<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="EHS팀 반기점검 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <c-appr-btn
                  ref="apprBtn"
                  name="appr-btn"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalEHS"
                  @callbackApprAction="approvalEHSCallback"
                  @requestAfterAction="emits('getDetail')"
                />
                <c-btn
                  v-if="editable && !disabled && isOld && !apprMode"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-show="editable && !disabled"
                  label="저장"
                  icon="save"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="inspection"
                  :mappingType="saveType"
                  @beforeAction="saveCheck"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  type="edit"
                  name="plantCd"
                  label="사업장"
                  :disabled="disabled"
                  :editable="editable"
                  v-model:value="inspection.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :editable="false"
                  label="점검년도"
                  type="year"
                  name="checkYear"
                  v-model:value="inspection.checkYear"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :editable="false"
                  codeGroupCd="HALF_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="상/하반기"
                  name="checkSemiAnnualCd"
                  v-model:value="inspection.checkSemiAnnualCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable && !disabled"
                  label="점검일시"
                  type="datetime"
                  :minuteStep="10"
                  name="checkDate"
                  v-model:value="inspection.checkDate"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  :editable="editable && !disabled"
                  label="부서"
                  name="deptCd"
                  v-model:value="inspection.deptCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  :required="true"
                  :editable="editable && !disabled"
                  :data="inspection"
                  deptValue="deptCd"
                  type="dept_user"
                  label="점검자"
                  name="checkUserId"
                  v-model:value="inspection.checkUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable && !disabled"
                  label="점검명"
                  name="checkTitle"
                  v-model:value="inspection.checkTitle"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && !disabled"
                  label="점검방법"
                  name="checkMethod"
                  v-model:value="inspection.checkMethod"
                />
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-12">
          <c-table
            ref="checklist1"
            class="sapaEsteamCheck table_vt_top"
            :title="
              (inspection.results?.find((row: any) => row.attrVal3 === '4')?.attrVal2 || '') +
              ' 점검항목'
            "
            :columns="grid.columns"
            :data="inspection.results?.filter((row: any) => row.attrVal3 === '4')"
            gridHeightAuto
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            :filtering="false"
            :customTrClass="customTrClass"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="editable && !disabled && isOld && props.row.level === 2"
                  :isImmShow="true"
                  :requestContentsCols="['requirement']"
                  tableKey="saiSapaEsResultId"
                  ibmTaskTypeCd="ITT0000240"
                  ibmTaskUnderTypeCd="ITTU000260"
                  @imprChange="checklist1.compoTable.resetVirtualScroll()"
                />
              </template>
              <template v-else-if="col.name === 'remark' && props.row.level === 2">
                <c-textarea-column
                  :editable="editable && !disabled"
                  :props="props"
                  :col="col"
                  v-model:value="props.row[col.name]"
                  @datachange="datachange(props.row)"
                />
              </template>
              <template v-else-if="col.name === 'checkResultCd' && props.row.level === 2">
                <c-select
                  isChip
                  class="no-label-control"
                  type="edit"
                  :editable="editable && !disabled"
                  codeGroupCd="CHECK_RESULT_CD"
                  itemText="codeName"
                  itemValue="code"
                  v-model:value="props.row[col.name]"
                  @datachange="datachange(props.row)"
                />
              </template>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            ref="checklist2"
            class="sapaEsteamCheck table_vt_top"
            :title="
              (inspection.results?.find((row: any) => row.attrVal3 === '5')?.attrVal2 || '') +
              ' 점검항목'
            "
            :columns="grid.columns"
            :data="inspection.results?.filter((row: any) => row.attrVal3 === '5')"
            gridHeightAuto
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            :filtering="false"
            :customTrClass="customTrClass"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="editable && !disabled && isOld && props.row.level === 2"
                  :isImmShow="true"
                  :requestContentsCols="['requirement']"
                  tableKey="saiSapaEsResultId"
                  ibmTaskTypeCd="ITT0000240"
                  ibmTaskUnderTypeCd="ITTU000260"
                  @imprChange="checklist1.compoTable.resetVirtualScroll()"
                />
              </template>
              <template v-else-if="col.name === 'remark' && props.row.level === 2">
                <c-textarea-column
                  :editable="editable && !disabled"
                  :props="props"
                  :col="col"
                  v-model:value="props.row[col.name]"
                  @datachange="datachange(props.row)"
                />
              </template>
              <template v-else-if="col.name === 'checkResultCd' && props.row.level === 2">
                <c-select
                  isChip
                  class="no-label-control"
                  type="edit"
                  :editable="editable && !disabled"
                  codeGroupCd="CHECK_RESULT_CD"
                  itemText="codeName"
                  itemValue="code"
                  v-model:value="props.row[col.name]"
                  @datachange="datachange(props.row)"
                />
              </template>
            </template>
          </c-table>
        </div>
      </div>
    </q-form>
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
import { sapaInspectionType } from './selfEvaluation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'esteamInspectionDetail2'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    saiSapaEsCheckId: stringNull
  }
  inspection: sapaInspectionType
  isOld: boolean
  disabled: boolean
  contentHeight?: stringNull
  apprMode?: boolean
}
interface gridType {
  columns?: tableColumnType[]
  data?: any[]
  height?: string
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
      saiSapaEsCheckId: ''
    }
  },
  inspection: () => {
    return {
      saiSapaEsCheckId: '',
      plantCd: '1000',
      deptCd: null,
      completeFlag: '',
      checkDate: '',
      checkYear: '',
      checkSemiAnnualCd: '',
      checkUserId: '',
      checkMethod: '',
      results: [],
      delResults: []
    }
  },
  isOld: false,
  disabled: false,
  contentHeight: null,
  apprMode: false
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
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    // {
    //   name: 'sortOrder',
    //   field: 'sortOrder',
    //   label: '순번',
    //   align: 'center',
    //   style: 'width:50px',
    //   type: 'custom',
    //   sortable: true
    // },
    {
      name: 'requirement',
      field: 'requirement',
      label: '세부 요구사항',
      align: 'left',
      type: 'html',
      sortable: true,
      style: 'width:50%'
    },
    // {
    //   name: 'details',
    //   field: 'details',
    //   label: '상세',
    //   align: 'left',
    //   type: 'html',
    //   sortable: false
    // },
    // {
    //   name: 'relatedLaw',
    //   field: 'relatedLaw',
    //   label: '관계법령',
    //   align: 'left',
    //   type: 'html',
    //   sortable: false,
    //   style: 'width:200px'
    // },
    // {
    //   name: 'cycle',
    //   field: 'cycle',
    //   label: '점검주기',
    //   align: 'center',
    //   type: 'custom',
    //   style: 'width:70px',
    //   sortable: false
    // },
    // {
    //   name: 'action',
    //   field: 'action',
    //   label: '활동사항',
    //   align: 'left',
    //   type: 'custom',
    //   sortable: false,
    //   style: 'width:300px'
    // },
    // {
    //   name: 'actionCycle',
    //   field: 'actionCycle',
    //   label: '이행주기',
    //   align: 'center',
    //   type: 'custom',
    //   style: 'width:70px',
    //   sortable: false
    // },
    {
      name: 'docu',
      field: 'docu',
      label: '참고자료',
      align: 'left',
      type: 'attach',
      disableTarget: 'level',
      disableCon: 2,
      sortable: false,
      style: 'width:15%',
      taskClassCd: 'EHS_HALF_CHECK',
      keyText: 'saiSapaEsResultId'
    },
    {
      name: 'checkResultCd',
      field: 'checkResultCd',
      label: '점검결과',
      align: 'center',
      sortable: false,
      style: 'width: 6%',
      type: 'custom'
      // type: 'select',
      // codeGroupCd: 'CHECK_RESULT_CD',
      // disableTarget: 'level',
      // disableCon: 2,
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      type: 'custom',
      sortable: false,
      style: 'width:15%'
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
const editForm = ref<HTMLFormElement | null>(null)
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isApproval = ref(false)
const checklist1 = ref<any>(null)
const checklist2 = ref<any>(null)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  const components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  return components
})
// const gridHeight = computed(() => {
//   let height =
//     props.contentHeight && !Number.isNaN(Number(props.contentHeight.replace('px', '')))
//       ? Number(props.contentHeight.replace('px', '')) - 264
//       : 400
//   if (height < 400) height = 400
//   return height + 'px'
// })
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: props.inspection.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: props.inspection.approvalStatusCd,
    apprEditable: props.isOld && props.inspection.completeFlag !== 'Y' && !props.apprMode, // 결재버튼 활성화 기준
    param: props.inspection, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000030', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiSapaEsCheckId: props.inspection.saiSapaEsCheckId,
      isApprContent: true
    },
    approvalRequestName: props.inspection.checkTitle, // 결재요청명 (문서 title)
    approvalConnId: props.inspection.saiSapaEsCheckId // 결재연결용 업무일련번호 (문서 key)
  }
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.inspection.checkDate,
  () => {
    props.inspection.checkSemiAnnualCd =
      Number(props.inspection.checkDate.split('-')[1]) < 7 ? 'CSAC00001' : 'CSAC00002'
    props.inspection.checkYear = props.inspection.checkDate.split('-')[0]
    props.inspection.checkTitle = `${props.inspection.checkYear}년 ${props.inspection.checkSemiAnnualCd === 'CSAC00001' ? '상반기' : '하반기'} EHS팀 반기점검`
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
  saveUrl.value = transactionConfig.sai.sse.es.insert.url
  deleteUrl.value = transactionConfig.sai.sse.es.delete.url
  // code setting
  // list setting
}
function saveCheck() {
  if (props.popupParam.saiSapaEsCheckId) {
    saveType.value = 'PUT'
    props.inspection.chgUserId = user.value.userId
  } else {
    saveType.value = 'POST'
    props.inspection.regUserId = user.value.userId
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, props.inspection.results)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          _.forEach(props.inspection.results, (_item) => {
            if (_item.level === 1) _item.saiSapaEsMstId = _item.groupId
            _item.regUserId = user.value.userId
            _item.chgUserId = user.value.userId
          })
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.popupParam.saiSapaEsCheckId) props.popupParam.saiSapaEsCheckId = _result?.data
  emits('getDetail')
}
function approvalEHS() {
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '결재요청 하기 전 입력된 값을 저장합니다.<br> 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.inspection.regUserId = user.value.userId
          props.inspection.chgUserId = user.value.userId
          isApproval.value = !isApproval.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function approvalEHSCallback() {
  apprBtn.value.apprRequestPop()
}
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiSapaEsCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
function customTrClass(_props: any) {
  return _props.row.level === 1 ? 'bg-forth-color text-bold' : ''
}
// function imprChange() {
//   table.value.compoTable.resetVirtualScroll()
// }

function datachange(row: any) {
  if (row.editFlag !== 'C') {
    row.editFlag = 'U'
    row.chgUserId = user.value.userId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.sapaEsteamCheck
  .q-table
    tbody.q-virtual-scroll__content
      td:not(.bg-forth-color)
        padding: 8px !important
      td.bg-forth-color
        padding: 10px 16px !important
      tr
        td:not(.bg-forth-color):first-child
          padding-left: 20px !important

    tbody.q-virtual-scroll__padding td
      padding: 0 !important
</style>

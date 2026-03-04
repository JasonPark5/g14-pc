<template>
  <q-form ref="editForm">
    <c-card title="상세" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <!-- <c-btn v-show="printable" label="출력" icon="print" @btnClicked="printSelfCheck" /> -->
          <!-- [S]결재관련 버튼 -->
          <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
          <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
          <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
          <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
          <c-appr-btn
            v-if="!popupParam.isApprContent"
            ref="apprBtn"
            name="work-permit-appr-btn"
            :approvalInfo="approvalInfo"
            @beforeApprAction="approvalSelfCheck"
            @callbackApprAction="approvalSelfCheckCallback"
            @requestAfterAction="getDetail"
          />
          <c-btn
            v-show="isOld && !disabled && editable && !popupParam.isApprContent"
            label="삭제"
            icon="remove"
            @btnClicked="removeSelfCheck"
          />
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :param="selfCheck"
            :mappingType="saveType"
            :url="saveUrl"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="editable"
            :disabled="disabled"
            :required="true"
            :customPopupParam="{ targetKey: 'facility' }"
            label="시설"
            name="facilityCd"
            v-model:value="selfCheck.facilityCd"
            @dataChange="
              (data1: any, data2: any, data3: any) => {
                selfCheck.facilityName = data3.facilityName
                selfCheck.materialNames = data3.materialNames
              }
            "
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="false"
            label="취급자재"
            name="materialNames"
            v-model:value="selfCheck.materialNames"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :disabled="disabled"
            :editable="editable"
            default="today"
            type="date"
            label="자체점검일"
            name="selfCheckDate"
            v-model:value="selfCheck.selfCheckDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :range="true"
            :minuteStep="10"
            label="점검시간"
            type="time"
            name="time"
            v-model:value="selfCheck.time"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            :required="true"
            :disabled="disabled"
            :editable="editable"
            label="주관부서"
            name="deptCd"
            v-model:value="selfCheck.deptCd"
            @setDeptName="(val: any) => (selfCheck.deptName = val)"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :required="true"
            :editable="editable"
            :disabled="disabled"
            type="user"
            label="점검자"
            name="selfCheckUserId"
            v-model:value="selfCheck.selfCheckUserId"
            @userInfo="
              (val: any) => {
                selfCheck.selfCheckUserName = val.userName
                selfCheck.deptCd = val.deptCd
                selfCheck.deptName = val.deptNam
              }
            "
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="true"
            :editable="editable"
            label="시설관리번호"
            name="facilityNo"
            v-model:value="selfCheck.facilityNo">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="true"
            :editable="editable"
            label="시설유형"
            name="hcfFacilityTypeName"
            v-model:value="selfCheck.hcfFacilityTypeName">
          </c-text>
        </div> -->
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :required="true"
            :disabled="disabled || isReadOnly"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="selfCheck.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="editable && !disabled"
            :required="true"
            label="점검명"
            name="selfCheckName"
            v-model:value="selfCheck.selfCheckName"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      class="q-mt-sm"
      title="점검결과 목록"
      :editable="editable && !disabled"
      :columns="grid.columns"
      :data="selfCheck.selfCheckItemResults"
      :gridHeight="gridHeight"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      rowKey="hcfHazardFacilitySelfCheckResultId"
      selection="multiple"
      @table-data-change="tableDataChange"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled"
            :isImmShow="true"
            :requestContentsCols="['selfCheckItemName', 'hcfAbnormalityCdName']"
            tableKey="hcfHazardFacilitySelfCheckResultId"
            ibmTaskTypeCd="ITT0000245"
            ibmTaskUnderTypeCd="ITTU000275"
            @imprChange="imprChange"
          />
        </template>
      </template>
      <template v-slot:suffixTitle>
        <span style="font-size: 0.8em; font-weight: 500" class="text-grey-7">
          {{
            $language(
              '1. 비고란에는 자체점검 시 조치완료된 사항 또는 재점검이 필요한 사항을 적습니다.'
            )
          }}<br />
          {{
            $language(
              '2. 유해화학물질 취급시설 자체점검을 하려는 자는 양식의 점검 항목이 모두 포함된 별도의 서식을 사용할 수 있으며, 점검 항목이 모두 포함되어 있음을 명확하게 알 수 있도록 표기해야 합니다.'
            )
          }}
        </span>
      </template>
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
            v-if="editable && !disabled"
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
import { selfcheck } from './hazardFacility'
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
  name: 'hazardFacilitySelfCheckDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hcfHazardFacilitySelfCheckId: stringNull
    isApprContent: boolean
  }
  isOld: boolean
  disabled: boolean
  selfCheck: selfcheck
  height: stringNull | numberNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      hcfHazardFacilitySelfCheckId: '',
      isApprContent: false
    }
  },
  selfCheck: () => {
    return {
      hcfHazardFacilitySelfCheckId: '', // 유해화학자재 취급시설 자체점검 번호
      hcfHazardFacilitySelfCheckResultId: uid(),
      plantCd: null, // 사업장코드
      selfCheckName: '', // 점검명(전체)
      facilityCd: '', // 시설 코드
      facilityNo: '', // 시설관리번호
      facilityName: '', // 시설명
      hcfFacilityTypeName: '', // 시설유형
      selfCheckDate: '', // 자체점검일
      startTime: '', // 점검시작시간
      endTime: '', // 점검종료시간
      time: [] as Array<string>, // 점검시간
      deptCd: '', // 주관부서 코드
      deptName: '', // 주관부서명
      selfCheckUserId: '', // 점검자id
      selfCheckUserName: '', // 점검자
      hcfSelfCheckCompleteFlag: '', // 점검완료여부
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      selfCheckItemResults: [], // 자체점검 항목 결과
      materialNames: '',
      deleteCheckResults: [],
      hcfSelfCheckProgressCompleteFlag: '', // 개선진행상태
      approvalStatusCd: '', // 결재관련 결재상태
      hcfApprovalRequestId: '', // 결재관련 결재요청코드
      sysApprovalRequestId: ''
    }
  },
  disabled: false,
  height: 'auto'
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
const grid = ref({
  columns: [
    {
      name: 'selfCheckItemName',
      field: 'selfCheckItemName',
      label: '점검항목',
      align: 'left',
      type: 'text',
      // style: 'width:300px',
      required: true,
      sortable: false
    },
    {
      name: 'hcfAbnormalityCd',
      field: 'hcfAbnormalityCd',
      label: '이상유무',
      align: 'center',
      style: 'width:160px',
      type: 'select',
      codeGroupCd: 'HCF_ABNORMALITY_CD',
      required: true,
      isChip: true,
      setHeader: true,
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      style: 'width:200px',
      align: 'center',
      type: 'custom',
      sortable: false
    }
  ] as any,
  data: [],
  height: '415px'
})

// const selfCheck = ref<selfcheck>({
//   hcfHazardFacilitySelfCheckId: '', // 유해화학자재 취급시설 자체점검 번호
//   hcfHazardFacilitySelfCheckItemId: uid(),
//   plantCd: null, // 사업장코드
//   selfCheckName: '', // 점검명
//   facilityCd: '', // 시설 코드
//   facilityNo: '', // 시설관리번호
//   facilityName: '', // 시설명
//   hcfFacilityTypeName: '', // 시설유형
//   selfCheckDate: '', // 자체점검일
//   startTime: '', // 점검시작시간
//   endTime: '', // 점검종료시간
//   time: [] as Array<string>, // 점검시간
//   deptCd: '', // 주관부서 코드
//   deptName: '', // 주관부서명
//   selfCheckUserId: '', // 점검자id
//   selfCheckUserName: '', // 점검자
//   hcfSelfCheckCompleteFlag: 'N', // 점검완료여부
//   regUserId: '', // 등록자 ID
//   chgUserId: '', // 수정자 ID
//   selfCheckItemResults: [], // 자체점검 항목 결과
//   materialNames: '',
//   deleteCheckResults: [],
//   selfCheckItemType: 'SCP0000001' // 1: 주차, 2: 반기
// })

// const isComplete = ref(false)
// const completeUrl = ref('')
const isSave = ref(false)
// const printUrl = ref('')
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const itemResultUrl = ref('')
const detailUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)
const isApproval = ref(false)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.height && !Number.isNaN(Number(props.height.replace('px', '')))
      ? Number(props.height.replace('px', '')) - 240
      : 200
  if (height < 200) height = 200
  return height + 'px'
})
const imprComponent = computed(() => {
  const components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  return components
})
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: props.selfCheck.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: props.selfCheck.approvalStatusCd,
    apprEditable: editable && props.isOld && props.selfCheck.hcfSelfCheckCompleteFlag !== 'Y', // 결재버튼 활성화 기준
    param: props.selfCheck, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000028', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      hcfHazardFacilitySelfCheckId: props.selfCheck.hcfHazardFacilitySelfCheckId,
      isApprContent: true
    },
    approvalRequestName: '[유해화학물질 취급시설 자체점검] ' + props.selfCheck.selfCheckName, // 결재요청명 (문서 title)
    approvalConnId: props.selfCheck.hcfHazardFacilitySelfCheckId // 결재연결용 업무일련번호 (문서 key)
  }
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [props.selfCheck.facilityCd, props.selfCheck.selfCheckDate, props.selfCheck.deptCd],
  () => {
    if (props.selfCheck.facilityCd && props.selfCheck.selfCheckDate && props.selfCheck.deptCd)
      props.selfCheck.selfCheckName = `${props.selfCheck.facilityName} / ${props.selfCheck.deptName} / ${props.selfCheck.selfCheckDate}`
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
  // printUrl.value = selectConfig.env.facilitySelfCheck.print.url
  detailUrl.value = selectConfig.env.facilitySelfCheck.get.url
  itemResultUrl.value = selectConfig.env.facilitySelfCheck.item.url
  saveUrl.value = transactionConfig.env.facilitySelfCheck.insert.url
  deleteUrl.value = transactionConfig.env.facilitySelfCheck.delete.url
  // completeUrl.value = transactionConfig.env.facilitySelfCheck.complete.url
  // code setting
  // list setting
}
function getDetail() {
  emits('getDetail')
}
/******************************
 * TODO (목적): 시설현황표 저장 전 처리
 *******************************/
function save() {
  saveType.value = props.popupParam.hcfHazardFacilitySelfCheckId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      (props.selfCheck.selfCheckItemResults!.length === 0 ||
        validTable(grid.value.columns, props.selfCheck.selfCheckItemResults))
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'warning', // success / info / warning / error
        confirmCallback: () => {
          props.selfCheck.regUserId = user.value.userId
          props.selfCheck.chgUserId = user.value.userId
          props.selfCheck.startTime = props.selfCheck.time[0]
          props.selfCheck.endTime = props.selfCheck.time[1]
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 저장 후 처리
 *******************************/
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.isOld) {
    props.popupParam.hcfHazardFacilitySelfCheckId = _result.data
  }
  emits('getDetail')
}

/******************************
 * TODO (목적): 완료 함수
 *******************************/
// function complete() {
//   editForm.value.validate().then((_result: boolean) => {
//     if (_result && validTable(grid.value.columns, selfCheck.value.selfCheckItemResults)) {
//       message.confirm({
//         title: '확인',
//         message: '완료하시겠습니까?',
//         type: 'info', // success / info / warning / error
//         // 확인 callback 함수
//         confirmCallback: () => {
//           selfCheck.value.regUserId = user.value.userId
//           selfCheck.value.chgUserId = user.value.userId
//           selfCheck.value.startTime = selfCheck.value.time[0]
//           selfCheck.value.endTime = selfCheck.value.time[1]
//           selfCheck.value.hcfSelfCheckCompleteFlag = 'Y'
//           isComplete.value = !isComplete.value
//         },
//         // 취소 callback 함수
//         cancelCallback: () => {}
//       })
//     } else {
//       selfCheck.value.hcfSelfCheckCompleteFlag = 'N'
//       message.validError()
//     }
//   })
// }
// function completeCallback(result: any) {
//   props.popupParam.hcfHazardFacilitySelfCheckId = result.data
//   message.requestSuccess()
//   getDetail()
// }
/******************************
 * TODO (목적):  삭제
 *******************************/
function removeSelfCheck() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.hcfHazardFacilitySelfCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
// /******************************
//  * TODO (목적): 출력
//  *******************************/
// function printSelfCheck() {
//   $http({
//     url: $format(printUrl.value, props.popupParam.hcfHazardFacilitySelfCheckId),
//     method: 'GET'
//   }).then((_result: any) => {
//     const fileOrgNm =
//       $language('시설 자체점검') +
//       '_' +
//       props.selfCheck.selfCheckItemName +
//       '_' +
//       props.selfCheck.selfCheckDate +
//       '.docx'
//     const blob = base64ToBlob(_result.data)
//     const nav = window.navigator as any
//     if (nav && nav.msSaveOrOpenBlob) {
//       nav.msSaveOrOpenBlob(blob, fileOrgNm)
//     } else {
//       const link = document.createElement('a')
//       link.href = window.URL.createObjectURL(blob)
//       link.download = fileOrgNm
//       link.click()
//     }
//   })
// }

/******************************
 * TODO (목적):
 *******************************/
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}

// function facilityInfo(_data: any) {
//   if (_data) {
//     props.selfCheck.facilityCd = _data.facilityCd
//     props.selfCheck.facilityNo = _data.facilityNo
//     props.selfCheck.facilityName = _data.facilityName
//     props.selfCheck.hcfFacilityTypeName = _data.hcfFacilityTypeName
//     props.selfCheck.materialNames = _data.materialNames?.replace('\n', '')
//     setTitle()
//   } else {
//     props.selfCheck.facilityCd = ''
//     props.selfCheck.facilityNo = ''
//     props.selfCheck.facilityName = ''
//     props.selfCheck.hcfFacilityTypeName = ''
//     props.selfCheck.materialNames = ''
//   }
// }
// function userInfo(_user: any) {
//   props.selfCheck.selfCheckUserId = _user.userId
//   props.selfCheck.selfCheckUserName = _user.userName
//   props.selfCheck.deptCd = _user.deptCd
//   props.selfCheck.deptName = _user.deptName
// }
/***********************************************
 * TODO (목적): 자체점검 항목 결과(selfCheckItemResults)에 새로운 점검 항목을 추가하는 기능
 ************************************************/
function addResult() {
  props.selfCheck.selfCheckItemResults?.unshift({
    hcfHazardFacilitySelfCheckId: props.popupParam.hcfHazardFacilitySelfCheckId,
    hcfHazardFacilitySelfCheckResultId: uid(),
    selfCheckItemName: '',
    hcfAbnormalityCd: 'HA00000001', // 이상유무 - 문제없음(코드그룹마스터)
    remark: '',
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
      if (!props.selfCheck.deleteCheckResults) props.selfCheck.deleteCheckResults = []
      if (
        _.findIndex(props.selfCheck.deleteCheckResults, {
          hcfHazardFacilitySelfCheckId: item.hcfHazardFacilitySelfCheckId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.selfCheck.deleteCheckResults.push(item)
      }
      props.selfCheck.selfCheckItemResults = _.reject(props.selfCheck.selfCheckItemResults, item)
    })
  }
}

/******************************
 * TODO (목적): 결재 관리
 *******************************/
function approvalSelfCheck() {
  if (!props.selfCheck.selfCheckItemResults || props.selfCheck.selfCheckItemResults.length === 0) {
    message.alert({
      title: '안내',
      message: '점검결과를 등록바랍니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    editForm.value?.validate().then((_result: boolean) => {
      if (_result) {
        message.confirm({
          title: '확인',
          message: '결재요청 하기 전 입력된 값을 저장합니다.<br> 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            props.selfCheck.regUserId = user.value.userId
            props.selfCheck.chgUserId = user.value.userId
            isApproval.value = !isApproval.value
          },
          cancelCallback: () => {}
        })
      } else {
        message.validError()
      }
    })
  }
}
function approvalSelfCheckCallback() {
  apprBtn.value.apprRequestPop()
}
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'hcfAbnormalityCd' && _props.row.hcfAbnormalityCd) {
    getCodeName('HCF_ABNORMALITY_CD', _props.row.hcfAbnormalityCd).then((codeName) => {
      _props.row.hcfAbnormalityCdName = codeName
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

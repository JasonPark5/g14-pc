<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <!-- [S]결재관련 버튼 -->
          <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
          <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
          <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
          <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
          <c-appr-btn
            ref="apprBtn"
            name="danger-journal-appr-btn"
            :editable="editable"
            :approvalInfo="approvalInfo"
            @beforeApprAction="saveDataAppr"
            @callbackApprAction="approvalCallback"
            @requestAfterAction="getDetail"
          />
          <c-btn
            v-if="editable && !disabled && isRemove"
            label="삭제"
            :editable="editable"
            icon="delete_forever"
            @btnClicked="removeData"
          />
          <c-btn
            v-if="editable && !disabled"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="journal"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveJournal"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            required
            :editable="editable"
            :disabled="disabled"
            label="취급일지명"
            name="chmDangerTitle"
            v-model:value="journal.chmDangerTitle"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :disabled="true"
            codeGroupCd="CHM_DANGER_TYPE_CD"
            label="구분"
            itemText="codeName"
            itemValue="code"
            name="chmDangerTypeCd"
            type="edit"
            v-model:value="journal.chmDangerTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            required
            :editable="editable"
            :disabled="Boolean(popupParam.chmDangerJournalId)"
            label="위험물저장소"
            name="chmDangerMstId"
            :customPopupParam="{ targetKey: 'hazardStorage' }"
            v-model:value="journal.chmDangerMstId"
            @dataChange="dataChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :disabled="true"
            :editable="editable"
            label="품명"
            name="chmDangerMstName"
            v-model:value="journal.chmDangerMstName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            :range="true"
            name="period"
            :disabled="disabled || updateMode"
            defaultStart="-6d"
            defaultEnd="0d"
            label="기간"
            v-model:value="period"
            @datachange="gridchange"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            required
            :editable="editable"
            :disabled="disabled"
            type="edit"
            name="plantCd"
            v-model:value="journal.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="true"
            label="지정수량배수 (품목별 배수의 합계)"
            name="chmDangerCount"
            type="number"
            v-model:value="journal.chmDangerCount"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            :disabled="true"
            label="주용도"
            name="chmDangerMainUse"
            v-model:value="journal.chmDangerMainUse"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            :editable="editable"
            :data="journal"
            :disabled="disabled"
            label="안전관리자"
            type="user"
            name="chmDangerManageUserId"
            v-model:value="journal.chmDangerManageUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            :editable="editable"
            :data="journal"
            :disabled="disabled"
            label="담당자"
            type="user"
            name="chmDangerUserId"
            v-model:value="journal.chmDangerUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            :editable="editable"
            :data="journal"
            :disabled="disabled"
            label="안전대리자"
            type="user"
            name="chmDangerSafetyUserId"
            v-model:value="journal.chmDangerSafetyUserId"
          />
        </div>
      </template>
    </c-card>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-tab
        type="tabcard"
        :tabItems="tabItems"
        :inlineLabel="true"
        v-model:value="tab"
        height="560px"
        align="left"
      >
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :journal="journal"
            :itemGrid="itemGrid"
            :prevList="prevList"
            :resultGrid="resultGrid"
            :contentHeight="contentHeight"
            @getDetail="getDetail"
          />
        </template>
      </c-tab>
    </div>
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
import { dangerJournalType } from './dangerStorage'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerJournalDetail,'
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
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    chmDangerJournalId: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  prevData?: Array<any>
  height?: stringNull
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
      chmDangerJournalId: ''
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
const journal = ref<dangerJournalType>({
  chmDangerJournalId: '',
  plantCd: '',
  chmDangerMstId: '',
  chmDangerTitle: '',
  chmDangerStartDate: '',
  chmDangerEndDate: '',
  chmDangerArea: '',
  chmDangerManageUserId: '',
  chmDangerMstName: '',
  chmDangerUserId: '',
  chmDangerSafetyUserId: '',
  chmDangerCount: '',
  chmDangerMainUse: '',
  chmDangerCompleteFlag: '',
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '', // 결재관련 결재요청코드
  itemList: [],
  resultList: [],
  imprList: [],
  chmDangerTypeCd: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const itemGrid = ref<gridType>({
  columns: []
})
const resultGrid = ref<gridType>({
  merge: [
    { index: 0, colName: 'chmDangerResultDate' },
    { index: 7, colName: 'chmDangerResultDate' }
  ],
  columns: [
    {
      name: 'chmDangerResultDate',
      field: 'chmDangerResultDate',
      label: '일자',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      fix: true
    },
    {
      name: 'chmDangerResultName',
      field: 'chmDangerResultName',
      label: '저장품목',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      fix: true
    },
    {
      name: 'chmDangerIn',
      field: 'chmDangerIn',
      label: '입고량(L/KG)',
      align: 'right',
      type: 'number',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'chmDangerOut',
      field: 'chmDangerOut',
      label: '사용량(L/KG)',
      align: 'right',
      type: 'number',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'chmDangerStock',
      field: 'chmDangerStock',
      label: '재고량(L/KG)',
      align: 'right',
      style: 'width:150px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'calcuMethod',
      field: 'calcuMethod',
      label: '지정수량(L/KG)',
      align: 'right',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'chmDangerQuan',
      field: 'chmDangerQuan',
      label: '지정수량배수<br/>(재고량 / 지정수량)',
      align: 'right',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'chmDangerQuanSum',
      field: 'chmDangerQuanSum',
      label: '저장소 지정수량 배수(합계)',
      align: 'center',
      type: 'custom',
      style: 'width:150px',
      sortable: false
    },
    // {
    //   name: 'calcuMethod',
    //   field: 'calcuMethod',
    //   label: '계산방식',
    //   align: 'center',
    //   style: 'width:100px',
    //   sortable: false,
    // },
    {
      setHeader: true,
      name: 'chmDangerConfirmUserName',
      field: 'chmDangerConfirmUserName',
      label: '확인자',
      align: 'center',
      type: 'user',
      userId: 'chmDangerConfirmUserId',
      style: 'width:150px',
      sortable: false
    },
    {
      setHeader: true,
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'center',
      type: 'textarea',
      style: 'width:200px',
      sortable: false
    }
  ],
  prevData: [],
  height: '450px'
})
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'dangerJournalResult',
    icon: 'list',
    label: '취급일지 결과',
    component: markRaw(defineAsyncComponent(() => import(`./dangerJournalResult.vue`)))
  },
  {
    name: 'dangerJournalItem',
    icon: 'list',
    label: '점검항목',
    component: markRaw(defineAsyncComponent(() => import(`./dangerJournalItem.vue`)))
  },
  {
    name: 'dangerJournalImpr',
    icon: 'health_and_safety',
    label: '개선관리',
    component: markRaw(defineAsyncComponent(() => import(`./dangerJournalImpr.vue`)))
  }
])
const editable = ref(true)
const isSave = ref(false)
const isApproval = ref(false)
const updateMode = ref(false)
const period = ref<Array<stringNull>>([])
const tab = ref('dangerJournalResult')
const saveUrl = ref(transactionConfig.chm.danger.journal.insert.url)
const deleteUrl = ref('')
const getUrl = ref('')
const listUrl = ref('')
const saveType = ref('POST')
const prevList = ref<Array<any>>([])
const resDate = ref<Array<any>>([])
const editForm = ref<any>(null)
const apprBtn = ref<any>(null)
const getMasterUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    journal.value.chmDangerCompleteFlag === 'Y' || journal.value.approvalStatusCd === 'ASC0000001'
)
const isRemove = computed(
  () => props.popupParam.chmDangerJournalId && Boolean(!journal.value.sysApprovalRequestId)
)
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: journal.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: journal.value.approvalStatusCd,
    apprEditable:
      journal.value.chmDangerCompleteFlag && journal.value.chmDangerCompleteFlag !== 'Y', // 결재버튼 활성화 기준
    param: journal.value, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000009', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      chmDangerJournalId: journal.value.chmDangerJournalId,
      isApprContent: true
    },
    approvalRequestName: $language('위험물 취급일지') + ' [' + journal.value.chmDangerTitle + ']', // 결재요청명 (문서 title)
    approvalConnId: props.popupParam.chmDangerJournalId // 결재연결용 업무일련번호 (문서 key)
  }
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  () => {
    let height = props.contentHeight - 240
    if (height < 400) height = 500
    itemGrid.value.height = height + 'px'
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
  getUrl.value = selectConfig.chm.danger.journal.get.url
  listUrl.value = selectConfig.chm.danger.journal.result.url
  deleteUrl.value = transactionConfig.chm.danger.journal.delete.url
  getMasterUrl.value = selectConfig.chm.danger.master.get.url
  // code setting
  if (!props.popupParam.chmDangerJournalId) {
    journal.value.chmDangerManageUserId = user.value.userId
    journal.value.chmDangerUserId = user.value.userId
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.chmDangerJournalId) {
    $http({
      url: $format(getUrl.value, props.popupParam.chmDangerJournalId),
      method: 'GET'
    }).then((_result: any) => {
      updateMode.value = true
      journal.value = _result.data
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
      period.value = [_result.data.chmDangerStartDate, _result.data.chmDangerEndDate]
      if (_result.data.itemList) {
        _.forEach(_result.data.itemList, (_item) => {
          _.forEach(_item.itemResultList, (__item) => {
            _item[__item.chmDangerItemDate] = __item.chmDangerEvalCd
          })
        })
      }
      gridchange()
      getPrevDetail()
    })
  }
}
/******************************
 * TODO (목적): 자식 탭으로 넘겨주는 prevList 결과리스트 값 세팅
 *******************************/
function getPrevDetail() {
  if (!period.value) return
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      prevDate: period.value[0],
      chmDangerMstId: journal.value.chmDangerMstId
    }
  }).then((_result: any) => {
    prevList.value = []
    if (journal.value.resultList) {
      _.forEach(_result.data, (_item) => {
        if (
          _.findIndex(journal.value.resultList, {
            chmDangerResultName: _item.chmDangerResultName
          }) >= 0
        )
          prevList.value.push(_item)
      })
    }
  })
}
/******************************
 * TODO (목적): itemList, imprList, resultList 조회 (기간변경시, 상세조회시)
 *******************************/
function gridchange() {
  const _columns = [
    {
      name: 'chmDangerItemName',
      field: 'chmDangerItemName',
      label: '점검항목',
      style: 'width:300px',
      align: 'left',
      sortable: false,
      fix: true
    }
  ]
  resDate.value = []
  const sDate = new Date(period.value[0])
  const eDate = new Date(period.value[1])
  while (sDate.getTime() <= eDate.getTime()) {
    const _mon = String(sDate.getMonth() + 1).padStart(2, '0')
    const _day_ = String(sDate.getDate()).padStart(2, '0')
    resDate.value.push(sDate.getFullYear() + '-' + _mon + '-' + _day_)
    sDate.setDate(sDate.getDate() + 1)
  }
  const itemColumns = [] as any
  _.forEach(resDate.value, (_item) => {
    itemColumns.push({
      name: _item,
      field: _item,
      align: 'center',
      label: _item,
      type: 'select',
      isChip: true,
      none: true,
      // style: `width:${50 / resDate.value.length}%`,
      codeGroupCd: 'DANGER_RESULT_CD',
      sortable: false
    })
  })
  itemColumns.push({
    name: 'remark',
    field: 'remark',
    label: '비고',
    style: 'width:160px',
    type: 'textarea',
    align: 'left',
    sortable: false
  })
  itemGrid.value.columns = _.concat(_columns, itemColumns)
  if (!props.popupParam.chmDangerJournalId) {
    getPrevDetail()
    if (journal.value.chmDangerMstId && period.value) allDataChange(journal.value.chmDangerMstId)
  }
}
/******************************
 * TODO (목적): 선택값을 모든 탭의 데이터에 반영
 *******************************/
function allDataChange(_chmDangerMstId: stringNull) {
  journal.value.itemList = []
  journal.value.resultList = []
  $http({
    url: $format(getMasterUrl.value, _chmDangerMstId),
    method: 'GET'
  }).then((_result: any) => {
    if (_result.data.itemList) {
      _.forEach(_result.data.itemList, (_item) => {
        journal.value.itemList!.push({
          chmDangerJournalId: props.popupParam.chmDangerJournalId,
          chmDangerJournalItemId: uid(),
          chmDangerItemName:
            _item.dangerCheckItem +
            ' - ' +
            _item.dangerCheckContent +
            ' - ' +
            _item.dangerCheckMethod,
          sortOrder: _item.sortOrder,
          remark: _item.remark,
          itemResultList: [],
          editFlag: 'C'
        })
      })
      _.forEach(resDate.value, (_item) => {
        _.forEach(_result.data.typeList, (__item) => {
          journal.value.resultList!.push({
            chmDangerJournalId: props.popupParam.chmDangerJournalId,
            chmDangerJournalResultId: uid(),
            chmDangerResultDate: _item,
            chmDangerResultName: __item.chmDangerTypeName,
            calcuMethod: __item.calcuMethod,
            chmDangerIn: 0,
            chmDangerOut: 0,
            chmDangerStock: 0,
            chmDangerQuan: 0,
            chmDangerQuanSum: null,
            chmDangerConfirmUserId: '',
            chmDangerConfirmUserName: '',
            editFlag: 'C'
          })
        })
        _.forEach(journal.value.itemList, (__item) => {
          // 데이터에 표시하기 위함.
          __item[_item] = 'DR00000001'
          // 날짜별 list
          __item.itemResultList.push({
            chmDangerJournalId: props.popupParam.chmDangerJournalId,
            chmDangerJournalItemId: __item.chmDangerJournalItemId,
            chmDangerJournalItemResultId: uid(),
            chmDangerItemDate: _item,
            chmDangerEvalCd: null,
            editFlag: 'C'
          })
        })
      })
      journal.value.imprList = _.cloneDeep(journal.value.itemList)
    }
    getPrevDetail()
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveJournal() {
  saveType.value = props.popupParam.chmDangerJournalId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(resultGrid.value.columns, journal.value.resultList)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          beforeSave()
          if (saveType.value === 'POST') journal.value.chmDangerCompleteFlag = 'N'
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.popupParam.chmDangerJournalId = result.data
  message.requestSuccess()
  getDetail()
}
function beforeSave() {
  journal.value.regUserId = user.value.userId
  journal.value.chgUserId = user.value.userId
  if (period.value!.length > 0) {
    journal.value.chmDangerStartDate = period.value[0]
    journal.value.chmDangerEndDate = period.value[1]
  }
  _.forEach(journal.value.itemList, (_item) => {
    _.forEach(_item.itemResultList, (__item) => {
      __item.chmDangerEvalCd = _item[__item.chmDangerItemDate]
      if (_item.editFlag === 'U') __item.editFlag = 'U'
    })
  })
}
/******************************
 * TODO (목적): 결재요청 및 결재관련 결재요청버튼 callback
 *******************************/
function saveDataAppr() {
  message.confirm({
    title: '확인',
    message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      beforeSave()
      isApproval.value = !isApproval.value
    },
    cancelCallback: () => {}
  })
}
function approvalCallback() {
  apprBtn.value.apprRequestPop()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.chmDangerJournalId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 품명 변경시 반영 로직
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  if (data3.chmDangerMstId && data3.chmDangerMstId.length > 0) {
    journal.value.chmDangerMstId = data3.chmDangerMstId
    journal.value.chmDangerMstName = data3.chmDangerMstName
    journal.value.chmDangerArea = data3.chmDangerArea
    journal.value.chmDangerTypeCd = data3.chmDangerTypeCd
    journal.value.chmDangerCount = data3.chmDangerCount
    journal.value.chmDangerMainUse = data3.chmDangerMainUse
    journal.value.chmDangerManageUserId = data3.chmDangerManageUserId || user.value.userId
    journal.value.chmDangerUserId = data3.chmDangerUserId || user.value.userId
    journal.value.chmDangerSafetyUserId = data3.chmDangerSafetyUserId
    journal.value.plantCd = data3.plantCd
    if (period.value) allDataChange(data3.chmDangerMstId)
  } else {
    journal.value.chmDangerMstId = ''
    journal.value.chmDangerMstName = ''
    journal.value.chmDangerArea = ''
    journal.value.chmDangerTypeCd = ''
    journal.value.chmDangerCount = ''
    journal.value.chmDangerMainUse = ''
    journal.value.chmDangerManageUserId = user.value.userId
    journal.value.chmDangerUserId = user.value.userId
    journal.value.chmDangerSafetyUserId = ''
    journal.value.plantCd = ''
    journal.value.itemList = []
    journal.value.resultList = []
    journal.value.imprList = []
    prevList.value = []
    itemGrid.value.columns = []
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

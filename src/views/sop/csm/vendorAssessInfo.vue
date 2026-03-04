<template>
  <div>
    <q-form ref="editForm">
      <c-card title="협력업체 평가 기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <!-- [S]결재관련 버튼 -->
            <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
            <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
            <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
            <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
            <c-appr-btn
              ref="apprBtn"
              name="vendor-assess-appr-btn"
              :approvalInfo="approvalInfo"
              @beforeApprAction="saveVendorAssess('appr')"
              @callbackApprAction="approvalCallback"
              @requestAfterAction="getDetail"
            />
            <c-btn
              v-if="editable && isOld && !disabled"
              label="삭제"
              icon="remove"
              @btnClicked="deleteData"
            />
            <c-btn
              v-show="editable && !disabled"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="evaluation"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveVendorAssess('save')"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-description>
          <q-chip
            v-if="isOld && evaluation.evaluationGradeName"
            :color="evaluationGradeInfo.attrVal3"
            dense
            style="vertical-align: baseline; margin-left: 20px"
            outline
            square
          >
            평가등급 : {{ evaluation.evaluationGradeName }}
          </q-chip>
        </template>
        <template v-slot:card-detail>
          <div class="col-2">
            <c-task-target
              :disabled="disabled"
              :editable="editable"
              :required="true"
              label="평가대상업체"
              name="vendorCd"
              :customPopupParam="{ targetKey: 'vendor' }"
              v-model:value="evaluation.vendorCd"
            />
          </div>
          <div class="col-2">
            <c-select
              :required="true"
              :editable="editable && !disabled && !isOld"
              codeGroupCd="VENDOR_EVALUATION_KIND_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="vendorEvaluationKindCd"
              label="평가구분"
              v-model:value="evaluation.vendorEvaluationKindCd"
              @update:value="getItemResults"
            />
          </div>
          <div class="col-2">
            <c-datepicker
              :editable="false"
              type="year"
              label="평가년도"
              name="evaluationYear"
              v-model:value="evaluation.evaluationYear"
            />
          </div>
          <div class="col-2">
            <c-datepicker
              :required="true"
              :disabled="disabled"
              :editable="editable"
              :range="true"
              default="today"
              label="평가기간"
              name="period"
              v-model:value="evaluation.evaluationPeriod"
            />
          </div>
          <div class="col-2">
            <c-field
              :required="true"
              :editable="editable && !disabled"
              type="dept_user"
              label="평가자"
              name="assessUserId"
              v-model:value="evaluation.assessUserId"
            />
          </div>
          <div class="col-4">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label="관련공사"
              name="sopConstructionId"
              v-model:value="evaluation.sopConstructionId"
            />
          </div>
          <div class="col-6">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label="평가결과 종합"
              name="remarks"
              v-model:value="evaluation.remarks"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <c-table
      ref="table1"
      class="va"
      title="평가 항목 합계"
      :editable="editable && !disabled"
      :columns="gridSubTotal.columns"
      :data="evaluation.itemResultSubTotals"
      gridHeightAuto
      isDescriptionFrontTr
      :columnSetting="false"
      :usePaging="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
      :hideBottom="true"
    >
      <template v-slot:description-front-tr="props">
        <template v-if="props.rowIndex === 0">
          <q-tr
            :props="props"
            :key="`e_front_${props.rowIndex}`"
            class="bg-default"
            style="line-height: 28px; font-weight: 700"
          >
            <q-td class="text-white">{{ $language('합계') }}</q-td>
            <q-td class="text-white text-right">{{ evaluation.totalScore }}</q-td>
            <q-td class="text-white text-right">{{ evaluation.score }}</q-td>
          </q-tr>
        </template>
      </template>
    </c-table>
    <c-table
      ref="table2"
      class="va"
      title="평가항목 목록"
      :editable="editable && !disabled"
      :columns="grid.columns"
      :data="gridItemResults"
      gridHeightAuto
      :columnSetting="false"
      :usePaging="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
      :hideBottom="true"
      :customTrClass="customTrClass"
    >
      <template v-slot:suffixTitle>
        <span class="q-ml-md">
          <q-badge
            v-for="(score, idx) in scoreItems"
            :key="idx"
            :class="score.attrVal1"
            class="q-mr-sm"
            style="padding: 3px 6px"
            :label="$language(score.codeName)"
          />
        </span>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="!props.row.subtotal">
          <c-number-column
            :editable="editable && !disabled"
            :col="col"
            :props="props"
            class="verticalM"
            :colorClass="checkColorClass(props.row)"
            v-model:value="props.row[col.name]"
            @datachange="(val: number) => datachange(props, col, val)"
          />
        </template>
        <template v-else>
          <span class="text-right">{{ props.row[col.name] }}</span>
        </template>
      </template>
    </c-table>
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
import { evalType } from './portalIdChange'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'vendorAssessInfo'
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
const emits = defineEmits(['setRegInfo', 'deleteAssess'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmVendorEvaluationId?: stringNull
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
  popupParam: () => {
    return {
      mdmVendorEvaluationId: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const evaluation = ref<evalType>({
  mdmVendorEvaluationId: '', // 업체평가 일련번호
  vendorCd: null, // 업체코드
  vendorName: '',
  plantCd: null, // 사업장코드
  vendorEvaluationKindCd: 'VEKC000001', // 협력업체 평가구분
  evaluationStartDate: '', // 평가시작일
  evaluationEndDate: '', // 평가종료일
  evaluationPeriod: [],
  evaluationYear: '', // 평가 년도
  score: null, // 득점
  totalScore: null, // 총점
  evaluationGradeCd: null, // 평가등급
  evaluationGradeName: '',
  remarks: '', // 비고
  assessUserId: '',
  evaluationCompleteFlag: 'N', // 결재완료 후 평가완료 처리
  sopConstructionId: '',
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '', // 결재관련 결재요청코드
  itemResults: [],
  itemResultSubTotals: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'itemNm',
      field: 'itemNm',
      label: '평가항목',
      align: 'left',
      sortable: false
    },
    {
      name: 'scoring',
      field: 'scoring',
      label: '배점',
      style: 'width:80px',
      align: 'right',
      sortable: false
    },
    {
      name: 'evaluationScore',
      field: 'evaluationScore',
      label: '득점',
      style: 'width:80px',
      type: 'custom',
      align: 'right',
      setHeader: true,
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      type: 'text',
      align: 'left',
      style: 'width:300px',
      sortable: false
    }
  ],
  data: []
})
const gridSubTotal = ref<gridType>({
  columns: [
    {
      name: 'vendorEvaluationTypeName',
      field: 'vendorEvaluationTypeName',
      label: '구분',
      align: 'left',
      sortable: false
    },
    {
      name: 'scoring',
      field: 'scoring',
      label: '배점',
      style: 'width:80px',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      name: 'evaluationScore',
      field: 'evaluationScore',
      label: '득점',
      style: 'width:80px',
      align: 'right',
      type: 'cost',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const isApproval = ref(false)
const saveType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const itemListUrl = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const apprBtn = ref<any>(null)
const gradeItems = ref<Array<codeMasterType>>([])
const scoreItems = ref<Array<codeMasterType>>([])

/******************************
 * @Computed_선언
 *******************************/
// const gridHeight = computed(() =>
//   !isNaN(props.contentHeight) ? props.contentHeight - 460 + 'px' : '360px'
// ) // 이중스크롤없애기위해 사용안함
const isOld = computed(() => Boolean(props.popupParam.mdmVendorEvaluationId))
// 결재중인 경우 비활성화
const disabled = computed(
  () =>
    evaluation.value.evaluationCompleteFlag === 'Y' ||
    Boolean(evaluation.value.sysApprovalRequestId)
)
const evaluationGradeInfo = computed(() => {
  let info = {
    code: '',
    codeName: '',
    attrVal1: '',
    attrVal2: '',
    attrVal3: '',
    description: ''
  }
  if (evaluation.value.evaluationGradeCd && gradeItems.value.length > 0) {
    info = _.find(gradeItems.value, { code: evaluation.value.evaluationGradeCd })
  }
  return info
})
const gridItemResults = computed(() => {
  let _itemResults: any[] = []
  if (evaluation.value.itemResults!.length > 0) {
    const subTotals = _.map(evaluation.value.itemResultSubTotals, (item) =>
      _.extend(item, {
        itemNm: item.vendorEvaluationTypeName,
        disable: true,
        subtotal: true
      })
    )
    _.forEach(subTotals, (item) => {
      _itemResults.push(item)
      _itemResults = _itemResults.concat(
        _.filter(evaluation.value.itemResults, {
          vendorEvaluationTypeCd: item.vendorEvaluationTypeCd
        })
      )
    })
  }
  return _itemResults
})
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: evaluation.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: evaluation.value.approvalStatusCd,
    apprEditable: editable.value && isOld.value && !disabled.value, // 결재버튼 활성화 기준
    param: evaluation.value, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000002', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      mdmVendorEvaluationId: evaluation.value.mdmVendorEvaluationId,
      isApprContent: true
    },
    approvalRequestName: '협력업체 평가 [' + evaluation.value.vendorName + ']', // 결재요청명 (문서 title)
    approvalConnId: evaluation.value.mdmVendorEvaluationId // 결재연결용 업무일련번호 (문서 key)
  }
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => evaluation.value.evaluationPeriod,
  () => {
    evaluation.value.evaluationYear = evaluation.value.evaluationPeriod![0].split('-')[0]
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
  detailUrl.value = selectConfig.mdm.cim.vendor.evaluation.result.get.url
  itemListUrl.value = selectConfig.mdm.cim.vendor.evaluation.result.item.url
  saveUrl.value = transactionConfig.mdm.cim.vendor.result.update.url
  deleteUrl.value = transactionConfig.mdm.cim.vendor.result.delete.url
  // code setting
  getComboItems('EVALUATION_GRADE_CD').then((_result: any) => {
    gradeItems.value = _result
  })
  getComboItems('VENDOR_EVALUATION_SCORE_CD').then((_result: any) => {
    scoreItems.value = _result
  })
  // list setting
  getDetail()
  if (!evaluation.value.assessUserId) evaluation.value.assessUserId = user.value.userId
  if (!evaluation.value.evaluationYear) evaluation.value.evaluationYear = getThisYear()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.mdmVendorEvaluationId),
      method: 'GET'
    }).then((_result: any) => {
      _result.data.evaluationPeriod = [
        _result.data.evaluationStartDate,
        _result.data.evaluationEndDate
      ]
      _.extend(evaluation.value, _result.data)
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  } else getItemResults()
}
function getItemResults() {
  if (evaluation.value.vendorEvaluationKindCd) {
    $http({
      url: itemListUrl.value,
      method: 'GET',
      params: { vendorEvaluationKindCd: evaluation.value.vendorEvaluationKindCd }
    }).then((_result: any) => {
      // vendorEvaluationTypeCd 평가항목 구분코드
      if (_result.data.results.length > 0) {
        evaluation.value.itemResults = _result.data.results
        evaluation.value.itemResultSubTotals = _result.data.subTotals

        let [_totalscore, _score, _grade, _gradeNm] = [0, 0, '', '']
        _.forEach(evaluation.value.itemResultSubTotals, (item) => {
          _totalscore += Number(item.scoring)
          _score += Number(item.evaluationScore)
        })
        _.forEach(gradeItems.value, (item) => {
          if (_score >= Number(item.attrVal1) && _score <= Number(item.attrVal2)) {
            _grade = item.code
            _gradeNm = item.codeName
          }
        })
        evaluation.value.totalScore = _totalscore
        evaluation.value.score = _score
        evaluation.value.evaluationGradeCd = _grade
        evaluation.value.evaluationGradeName = _gradeNm
      } else {
        evaluation.value.itemResults = []
        evaluation.value.itemResultSubTotals = []
      }
    })
  }
}
/******************************
 * TODO (목적): 득점 변경시 반영
 *******************************/
function datachange(_props: any, col: any, val: number) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
  // ✅ 소수점 제거
  _props.row[col.name] = Math.floor(val)
  // 배점 초과 방지
  if (val > _props.row.scoring || val < 0) _props.row[col.name] = _props.row.scoring
  // ✅ 소계 업데이트
  const relatedRows = _.filter(evaluation.value.itemResults, {
    vendorEvaluationTypeCd: _props.row.vendorEvaluationTypeCd
  })
  const sum = _.sumBy(relatedRows, (r) => Number(r.evaluationScore) || 0)
  const subtotalRow = _.find(evaluation.value.itemResultSubTotals, {
    vendorEvaluationTypeCd: _props.row.vendorEvaluationTypeCd
  })
  if (subtotalRow) subtotalRow.evaluationScore = sum

  let [_score, _grade, _grageNm] = [0, '', '']
  _.forEach(
    evaluation.value.itemResultSubTotals,
    (item) => (_score += Number(item.evaluationScore) || 0)
  )
  _.forEach(gradeItems.value, (item) => {
    if (_score >= Number(item.attrVal1) && _score <= Number(item.attrVal2)) {
      _grade = item.code
      _grageNm = item.codeName
    }
  })
  evaluation.value.score = _score
  evaluation.value.evaluationGradeCd = _grade
  evaluation.value.evaluationGradeName = _grageNm
}
/******************************
 * TODO (목적): 색상 반영
 *******************************/
function checkColorClass(row: any) {
  let colorClass = ''
  if (row.evaluationScore >= row.scoreGreat) {
    colorClass = _.find(scoreItems.value, { code: 'VESC000001' }).attrVal1 // 우수
  } else if (row.evaluationScore < row.scoreGreat && row.evaluationScore >= row.scoreCommonly)
    colorClass = _.find(scoreItems.value, { code: 'VESC000005' }).attrVal1 // 보통
  else if (row.evaluationScore < row.scoreCommonly && row.evaluationScore >= row.scoreInadequate)
    colorClass = _.find(scoreItems.value, { code: 'VESC000010' }).attrVal1 // 미흡
  return colorClass
}
function customTrClass(_props: any) {
  return _props.row.subtotal ? 'bg-default text-white text-bold' : ''
}
/******************************
 * TODO (목적): 저장. 중복체크 > 평가항목 총점에 따른 등급 산정
 *******************************/
function saveVendorAssess(flag: any) {
  saveType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      const saveItemResults = evaluation.value.itemResults
      // _.reject(evaluation.value.itemResults, { subtotal: true })
      let isValidOver = false
      _.forEach(saveItemResults, (item) => {
        if (Number(item.scoring) < Number(item.evaluationScore)) {
          isValidOver = true
          return false
        }
      })
      if (isValidOver) {
        message.alert({
          title: '안내',
          message: '배점보다 높은 득점을 입력하셨습니다. 다시한번 확인하시기 바랍니다.',
          type: 'warning' // success / info / warning / error
        })
      } else {
        message.confirm({
          title: '확인',
          message:
            flag === 'appr'
              ? '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?'
              : '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            evaluation.value.regUserId = user.value.userId
            evaluation.value.chgUserId = user.value.userId
            evaluation.value.evaluationStartDate = evaluation.value.evaluationPeriod![0]
            evaluation.value.evaluationEndDate = evaluation.value.evaluationPeriod![1]
            if (flag === 'save') isSave.value = !isSave.value
            else isApproval.value = !isApproval.value
          },
          cancelCallback: () => {}
        })
      }
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  if (saveType.value === 'POST') props.popupParam.mdmVendorEvaluationId = _result.data
  getDetail()
  message.requestSuccess()
}
/******************************
 * TODO (목적): 결재관련 결재요청버튼 callback
 *******************************/
function approvalCallback() {
  apprBtn.value.apprRequestPop()
}
/******************************
 * TODO (목적): 평가 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.mdmVendorEvaluationId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('deleteAssess')
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.va .q-table
  tbody.q-virtual-scroll__content tr
    td:first-child
      padding-left: 20px !important
.verticalM .pad-txt-label .pr-5
  border-radius: 5px
  line-height: 28px !important
  min-height: 28px
  padding-right: 10px !important
</style>

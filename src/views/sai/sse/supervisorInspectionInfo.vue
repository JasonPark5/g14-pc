<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-appr-btn
                  ref="apprBtn"
                  name="apprBtn"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalSuper"
                  @callbackApprAction="apprBtn.apprRequestPop()"
                  @requestAfterAction="getDetail"
                />
                <c-btn
                  v-if="editable && !disabled && isOld"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <!-- <c-btn
                  v-show="editable && !disabled && isOld"
                  mappingType="PUT"
                  label="완료"
                  icon="check"
                  color="grey-8"
                  :url="saveUrl"
                  :param="supervisor"
                  :isSubmit="isComplete"
                  @beforeAction="complete"
                  @btnCallback="saveCallback"
                /> -->
                <c-btn
                  v-show="!disabled && editable"
                  label="저장"
                  icon="save"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="supervisor"
                  :mappingType="saveType"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  required
                  type="edit"
                  :editable="editable && !disabled && !isOld"
                  codeGroupCd="MA_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="평가구분"
                  name="typeCd"
                  v-model:value="supervisor.typeCd"
                  @update:value="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :editable="false"
                  label="평가년도"
                  type="year"
                  name="checkYear"
                  v-model:value="supervisor.checkYear"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :editable="false"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  label="상/하반기"
                  name="checkSemiAnnualCd"
                  codeGroupCd="HALF_CD"
                  v-model:value="supervisor.checkSemiAnnualCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable && !disabled"
                  label="평가일"
                  type="date"
                  name="checkDate"
                  v-model:value="supervisor.checkDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  required
                  :editable="editable && !disabled"
                  label="평가대상자"
                  :customPopupParam="{ targetKey: 'seniorStatus' }"
                  name="evaluateeId"
                  v-model:value="supervisor.evaluateeId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-field
                  required
                  :editable="editable && !disabled"
                  type="dept_spot_user"
                  label="평가자"
                  name="evaluator1"
                  v-model:value="supervisor.evaluator1"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable && !disabled"
                  label="평가명"
                  name="checkName"
                  v-model:value="supervisor.checkName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && !disabled"
                  label="비고"
                  name="remark"
                  v-model:value="supervisor.remark"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-12">
          <c-table
            ref="table"
            title="평가항목"
            class="super"
            :editable="editable && !disabled"
            :columns="grid.columns"
            :data="supervisor.results"
            :merge="grid.merge"
            :gridHeight="gridHeight"
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            :filtering="false"
            :customTrClass="(props: any) => (props.row.editYn === 'Y' ? '' : 'bg-blue-1 text-bold')"
          >
            <template v-slot:table-chip>
              <b class="text-electric q-ml-lg"> ※ 평가점수 70점 미만은 30일 이내 재평가 실시 </b>
              <b v-if="supervisor.typeCd === 'C'" class="q-ml-xl text-electric">
                ※ 사무직 이외의 자는 11번 미평가, 미대상시 만점 적용
              </b>
            </template>
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'rating1'">
                <c-number-column
                  v-if="
                    props.row.saiSuperEvaluationMstId &&
                    (supervisor.evaluator1 === user.userId || auths!.indexOf('SAGI000007') > -1)
                  "
                  :editable="editable && !disabled"
                  :col="col"
                  :props="props"
                  v-model:value="props.row[col.name]"
                  @datachange="datachange(props, col)"
                />
                <span v-else>{{ props.row[col.name] }}</span>
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
import { supervisorInspectionType } from './selfEvaluation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'supervisorInspectionInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user, auths } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiSuperEvaluationId: stringNull
    typeCd: stringNull
  }
  contentHeight?: stringNull
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
      saiSuperEvaluationId: '',
      typeCd: 'A'
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const supervisor = ref<supervisorInspectionType>({
  saiSuperEvaluationId: '',
  checkName: '',
  checkYear: getThisYear(),
  checkDate: '',
  evaluatorId: '',
  evaluateeId: '',
  evaluateeName: '',
  evaluateeDept: '',
  evaluator1: user.value.userId,
  checkSemiAnnualCd: '',
  completeFlag: '',
  typeCd: null,
  remark: '',
  results: [],
  deleteResults: [],
  approvalStatusCd: '',
  sysApprovalRequestId: ''
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'details' },
    { index: 1, colName: 'details' }
  ],
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: 'NO',
      style: 'width:40px',
      sortable: false
    },
    {
      name: 'details',
      field: 'details',
      label: '평가항목',
      align: 'left',
      style: 'width:220px'
    },
    {
      name: 'evaluationStandard',
      field: 'evaluationStandard',
      label: '평가사항',
      align: 'left',
      style: 'width:500px',
      type: 'html'
    },
    // {
    //   name: 'base',
    //   field: 'base',
    //   label: '평가내용',
    //   align: 'left',
    //   style: 'width:500px',
    //   type: 'custom',
    //   sortable: false
    // },
    {
      name: 'score',
      field: 'score',
      label: '배점',
      align: 'right',
      style: 'width:80px'
    },
    {
      name: 'rating1',
      field: 'rating1',
      label: '득점',
      align: 'right',
      style: 'width:80px',
      type: 'custom',
      // type: 'number',
      // disableTarget: 'editYn',
      // disableCon: 'Y',
      sortable: false
    }
  ],
  data: []
})
const editForm = ref<HTMLFormElement | null>(null)
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const detailUrl = ref('')
const resultItemUrl = ref('')
const isSave = ref(false)
// const isComplete = ref(false)
const table = ref<any>(null)
const isApproval = ref(false)
const apprBtn = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiSuperEvaluationId))
const disabled = computed(
  () => supervisor.value.completeFlag === 'Y' || Boolean(supervisor.value.sysApprovalRequestId)
)
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(Number(props.contentHeight.replace('px', '')))
      ? Number(props.contentHeight.replace('px', '')) - 200
      : 400
  if (height < 400) height = 400
  return height + 'px'
})
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: supervisor.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: supervisor.value.approvalStatusCd,
    apprEditable: editable && isOld.value && supervisor.value.completeFlag !== 'Y', // 결재버튼 활성화 기준
    param: supervisor.value, // 결재 param
    approvalUrl: saveUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000031', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      saiSuperEvaluationId: supervisor.value.saiSuperEvaluationId,
      isApprContent: true
    },
    approvalRequestName: '[관리감독자 평가] ' + supervisor.value.checkName, // 결재요청명 (문서 title)
    approvalConnId: supervisor.value.saiSuperEvaluationId // 결재연결용 업무일련번호 (문서 key)
  }
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [supervisor.value.checkDate, supervisor.value.typeCd],
  () => {
    if (!supervisor.value.checkYear)
      supervisor.value.checkYear = supervisor.value.checkDate.split('-')[0]
    if (!supervisor.value.checkName)
      supervisor.value.checkName = `${supervisor.value.checkYear}년 ${supervisor.value.typeCd === 'A' ? '안전보건총괄책임자' : supervisor.value.typeCd === 'B' ? '안전보건관리책임자' : '관리감독자'} 업무 수행 평가표`
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
  detailUrl.value = selectConfig.sai.sse.superInspection.get.url
  resultItemUrl.value = selectConfig.sai.sse.supervisor.mst.item.url
  saveUrl.value = transactionConfig.sai.sse.superInspection.insert.url
  deleteUrl.value = transactionConfig.sai.sse.superInspection.delete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.saiSuperEvaluationId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiSuperEvaluationId),
      method: 'GET'
    }).then((_result: any) => {
      supervisor.value = _result.data
      emits('setRegInfo', _result.data)
      const sums = supervisor.value.results?.reduce(
        (acc: any, item: any) => {
          if (item.saiSuperEvaluationMstId) {
            acc.score += Number(item.score) || 0
            acc.rating1 += Number(item.rating1) || 0
          }
          return acc
        },
        { score: 0, rating1: 0 }
      )
      // 합계 행 push
      supervisor.value.results?.push({
        saiSuperEvaluationId: null,
        saiSuperEvaluationResultId: null,
        saiSuperEvaluationMstId: null,
        rating1: sums?.rating1 || 0,
        details: '합계',
        evaluationStandard: '',
        score: sums?.score || 0,
        editYn: 'N'
      })
    })
  } else {
    supervisor.value.checkDate = getToday()
    supervisor.value.typeCd = props.popupParam.typeCd
    dataChange(props.popupParam.typeCd)
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function savePlan() {
  saveType.value = isOld.value ? 'PUT' : 'POST'
  supervisor.value.typeCd = props.popupParam.typeCd
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, supervisor.value.results)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          supervisor.value.regUserId = user.value.userId
          supervisor.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.popupParam.saiSuperEvaluationId) props.popupParam.saiSuperEvaluationId = _result?.data
  getDetail()
}
/******************************
 * TODO (목적): 결재관리
 *******************************/
function approvalSuper() {
  if (supervisor.value.results?.[supervisor.value.results.length - 1].rating1 === 0) {
    message.alert({
      title: '안내',
      message: '평가점수를 모두 입력하세요.',
      type: 'info' // success / info / warning / error
    })
    return
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, supervisor.value.results)) {
      message.confirm({
        title: '확인',
        message: '완료 처리하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          supervisor.value.chgUserId = user.value.userId
          isApproval.value = !isApproval.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
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
        url: $format(deleteUrl.value, props.popupParam.saiSuperEvaluationId),
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
 * TODO (목적): 합계 계산
 *******************************/
function datachange(_props: any, col: any) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
  if (_props.row[col.name] > _props.row.score || _props.row[col.name] < 0) {
    message.alert({
      title: '안내',
      message: '0 점 이상, 배점 이하의 점수를 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
    _props.row[col.name] = 0
  }
  let [sumScore, sum1] = [0, 0]
  supervisor.value.results?.forEach((item: any) => {
    if (item.editYn === 'Y') {
      sumScore += Number(item.score) || 0
      sum1 += Number(item.rating1) || 0
    }
  })
  // 무조건 마지막 행을 찾아서 업데이트
  const lastRow = supervisor.value.results?.[supervisor.value.results.length - 1]
  if (lastRow) {
    lastRow.score = sumScore
    lastRow.rating1 = sum1
  }
}
function dataChange(_data: any) {
  supervisor.value.results = []
  $http({
    url: resultItemUrl.value,
    method: 'GET',
    params: { useFlag: 'Y', typeCd: _data }
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      supervisor.value.results?.push({
        sortOrder: _item.sortOrder,
        saiSuperEvaluationId: '',
        saiSuperEvaluationResultId: '',
        saiSuperEvaluationMstId: _item.saiSuperEvaluationMstId || '',
        rating1: 0,
        regUserId: user.value.userId,
        editFlag: 'C',
        details: _item.details,
        evaluationStandard: _item.evaluationStandard,
        score: _item.score,
        editYn: 'Y'
      })
    })
    supervisor.value.results?.push({
      saiSuperEvaluationId: null,
      saiSuperEvaluationResultId: null,
      saiSuperEvaluationMstId: null,
      rating1: 0,
      details: '합계',
      evaluationStandard: '',
      score: 100,
      editYn: 'N'
    })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.super
  .q-table
    tbody.q-virtual-scroll__content tr td
      padding: 8px 15px !important
</style>

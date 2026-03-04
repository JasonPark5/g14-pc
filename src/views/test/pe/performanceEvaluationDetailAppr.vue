<template>
  <q-form ref="editForm">
    <div>
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              label="저장"
              icon="save"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="evaluation"
              :mappingType="mappingType"
              @beforeAction="saveEvaluation"
              @btnCallback="saveEvaluationCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-plant
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="사업장"
              name="plantCd"
              v-model:value="evaluation.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="평가명"
              name="evaluationName"
              v-model:value="evaluation.evaluationName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="평가일자"
              name="evaluationDate"
              v-model:value="evaluation.evaluationDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-field
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="작성자"
              name="evaluationUserId"
              v-model:value="evaluation.evaluationUserId"
            />
          </div>
        </template>
      </c-card>
    </div>
    <c-tab
      type="vertical"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :evaluation="evaluation"
          :contentHeight="contentHeight"
          :popupParam="popupParam"
          :itemList="evaluationItemList"
          :disabled="disabled"
          :imprTabInfo="imprTabInfo"
          :attachResultInfo="attachResultInfo"
          @getDetail="getDetail"
        />
      </template>
    </c-tab>
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
import {
  performanceEvaluationResultType,
  resultCdType,
  performanceEvaluationType
} from './performanceEvaluationType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'performanceEvaluationDetailAppr'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    evaluationId: stringNull
  }
  contentHeight: stringNull | numberNull
}

interface gridType {
  columns?: Array<tableColumnType>
  data?: Array<performanceEvaluationResultType>
  merge?: Array<tableMergeType>
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
      evaluationId: ''
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
const editForm = ref<any>(null)
const tab = ref('evaluation')
const tabItems = ref<Array<tabItemsType>>([
  {
    key: uid(),
    name: 'evaluation',
    icon: 'info',
    label: '평가결과',
    component: markRaw(defineAsyncComponent(() => import(`./performanceEvaluationResult.vue`)))
  },
  {
    key: uid(),
    name: 'improvement',
    icon: 'info',
    label: '감소대책 및<br>시정조치',
    component: markRaw(defineAsyncComponent(() => import(`@/views/common/ibm/imprTab.vue`)))
  },
  {
    key: uid(),
    name: 'result',
    icon: 'info',
    label: '결과/첨부',
    component: markRaw(defineAsyncComponent(() => import(`./evaluationResultAttach.vue`)))
  }
])
const research = ref<any>({
  impr: '',
  item: ''
})
const attachResultInfo = ref({
  isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
  taskClassCd: 'EVALUATION_RESULT',
  taskKey: ''
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'evaluationItemTypeCd',
      field: 'evaluationItemTypeCd',
      label: '평가영역',
      align: 'center',
      style: 'width: 80px',
      codeGroupCd: 'PERFORMANCE_EVALUATION_TYPE_CD',
      type: 'select',
      sortable: false
    },
    {
      required: true,
      name: 'evaluationItem',
      field: 'evaluationItem',
      label: '평가항목',
      align: 'left',
      style: 'width: 200px',
      type: 'text',
      sortable: false
    },
    {
      name: 'evaluationItemDetail',
      field: 'evaluationItemDetail',
      label: '세부평가항목',
      align: 'left',
      style: 'width: 200px',
      type: 'text',
      sortable: false
    },
    {
      name: 'evaluationResult',
      field: 'evaluationResult',
      label: '평가결과',
      child: [
        {
          name: 'perc000001',
          field: 'perc000001',
          label: '적합',
          align: 'center',
          style: 'width:30px',
          type: 'check',
          sortable: false,
          checkIcon: 'task_alt',
          uncheckIcon: 'radio_button_unchecked',
          true: 'Y',
          false: 'N',
          color: 'green'
        },
        {
          name: 'perc000005',
          field: 'perc000005',
          label: '부적합',
          align: 'center',
          style: 'width:30px',
          type: 'check',
          sortable: false,
          checkIcon: 'task_alt',
          uncheckIcon: 'radio_button_unchecked',
          true: 'Y',
          false: 'N',
          color: 'green'
        }
      ]
    },
    {
      name: 'achievementRate',
      field: 'achievementRate',
      label: '달성률(%)',
      align: 'right',
      style: 'width: 40px',
      maxLength: 3,
      sortable: false,
      type: 'text'
    },
    {
      name: 'evaluationContents',
      field: 'evaluationContents',
      label: '내용',
      align: 'left',
      style: 'width: 200px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      style: 'width: 100px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      type: 'custom'
    }
  ]
})
const evaluation = ref<performanceEvaluationType>({
  evaluationId: '', // 성과평가 일련번호
  plantCd: '', // 사업장 코드
  evaluationStatusCd: '', // 성과평가 진행상태
  targetDeptCds: '',
  evaluationName: '', // 평가명
  evaluationDate: '', // 평가일자
  evaluationUserId: '', // 작성자
  resultRemark: '', // 결과요약약
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  evaluationResultList: [],
  deleteEvaluationResultList: [],
  targetDeptList: [],
  deleteTargetDeptList: [],
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '' // 결재관련 결재요청코드
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})

const evaluationItemList = ref<any>([])
const detailUrl = ref('')
const itemUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.evaluationId)
})

const disabled = computed(() => Boolean(evaluation.value.sysApprovalRequestId))

const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 810
    ? Number(props.contentHeight) + 'px'
    : '700px'
)

const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.evaluationId,
    ibmTaskTypeCd: 'ITT0000230',
    ibmTaskUnderTypeCd: 'ITTU000260',
    requestContents: evaluation.value.evaluationName,
    disabled: disabled.value,
    isOld: true,
    gridItem: {
      listUrl: '',
      param: null,
      title: '평가항목 별 개선사항 목록',
      merge: [
        { index: 0, colName: 'deptCd' },
        { index: 1, colName: 'evaluationItemTypeCd' },
        { index: 2, colName: 'evaluationItem' }
      ],
      data: _.sortBy(
        _.filter(evaluation.value.evaluationResultList, (result) =>
          Boolean(result?.sopImprovementIds)
        ),
        'deptCd'
      ),
      columns: [
        {
          name: 'deptName',
          field: 'deptName',
          label: '평가대상부서',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'evaluationItemTypeName',
          field: 'evaluationItemTypeName',
          label: '평가영역',
          align: 'center',
          style: 'width: 80px',
          sortable: false
        },
        {
          name: 'evaluationItem',
          field: 'evaluationItem',
          label: '평가항목',
          align: 'left',
          style: 'width: 200px',
          sortable: false
        },
        {
          name: 'evaluationItemDetail',
          field: 'evaluationItemDetail',
          label: '세부평가항목',
          align: 'left',
          style: 'width: 200px',
          sortable: false
        },
        {
          name: 'evaluationResult',
          field: 'evaluationResult',
          label: '평가결과',
          child: [
            {
              name: 'perc000001',
              field: 'perc000001',
              label: '적합',
              align: 'center',
              style: 'width:30px',
              type: 'check',
              sortable: false,
              checkIcon: 'task_alt',
              uncheckIcon: 'radio_button_unchecked',
              true: 'Y',
              false: 'N',
              color: 'green'
            },
            {
              name: 'perc000005',
              field: 'perc000005',
              label: '부적합',
              align: 'center',
              style: 'width:30px',
              type: 'check',
              sortable: false,
              checkIcon: 'task_alt',
              uncheckIcon: 'radio_button_unchecked',
              true: 'Y',
              false: 'N',
              color: 'green'
            }
          ]
        },
        {
          name: 'achievementRate',
          field: 'achievementRate',
          label: '달성률(%)',
          align: 'right',
          style: 'width: 40px',
          sortable: false
        },
        {
          name: 'evaluationContents',
          field: 'evaluationContents',
          label: '내용',
          align: 'left',
          style: 'width: 200px',
          sortable: false
        },
        {
          name: 'remarks',
          field: 'remarks',
          label: '비고',
          align: 'left',
          style: 'width: 100px',
          sortable: false
        }
      ],
      research: research.value
    },
    gridOther: {
      title: '항목외 개선목록'
    }
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
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  itemUrl.value = selectConfig.pe.base.list.url
  detailUrl.value = selectConfig.pe.evaluation.get.url
  saveUrl.value = transactionConfig.pe.evaluation.save.url
  // code setting
  // list setting
  getDetail()
  getItem()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.evaluationId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(evaluation.value, _result.data)
      attachResultInfo.value.taskKey = props.popupParam.evaluationId
    })
  } else {
    evaluation.value.evaluationUserId = user.value.userId
    evaluation.value.evaluationDate = getToday()
    evaluation.value.editFlag = 'C'
  }
}

function getItem() {
  $http({
    url: itemUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    evaluationItemList.value = _result.data
  })
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveEvaluation() {
  if (isOld.value) {
    mappingType.value = 'PUT'
  } else {
    mappingType.value = 'POST'
  }

  editForm.value?.validate().then((_result: any) => {
    if (_result) {
      // 평가결과가 있을 때만 validTable 체크
      if (
        Array.isArray(evaluation.value.evaluationResultList) &&
        evaluation.value.evaluationResultList.length > 0
      ) {
        if (!validTable(grid.value.columns, evaluation.value.evaluationResultList)) {
          message.validError()
          return
        }
      }
      // 달성률 유효성 체크
      if (
        Array.isArray(evaluation.value.evaluationResultList) &&
        evaluation.value.evaluationResultList.length > 0 &&
        !validAchieveRate(evaluation.value.evaluationResultList)
      ) {
        message.alert({
          title: '달성률 형식 오류',
          message: '100 이하의 숫자(최대 소수점 둘째자리)만\n입력할 수 있습니다.',
          type: 'warning'
        })
        return
      }

      // 저장 컨펌 및 실제 저장
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          const resultList: Array<resultCdType> = ['perc000001', 'perc000005', 'perc000010']
          _.forEach(evaluation.value.evaluationResultList, (result) => {
            _.forEach(resultList, (_item) => {
              if (result[_item] === 'Y') {
                result.evaluationResultCd = _.toUpper(_item)
                return false
              }
            })
          })
          evaluation.value.regUserId = user.value.userId
          evaluation.value.chgUserId = user.value.userId

          isSave.value = !isSave.value
        }
      })
    } else {
      message.validError()
    }
  })
}

function saveEvaluationCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.evaluationId = _result.data
  getDetail()
}

/******************************
 * TODO (목적): 달성률 검증
 *******************************/
function validAchieveRate(evaluationResultList: Array<performanceEvaluationResultType>) {
  const decimalRegex = /^\d+(\.\d{1,2})?$/
  for (const _result of evaluationResultList) {
    if (_result.achievementRate) {
      if (
        !decimalRegex.test(_result.achievementRate) ||
        Number(_result.achievementRate < 0) ||
        Number(_result.achievementRate) > 100
      )
        return false
    }
  }
  return true
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

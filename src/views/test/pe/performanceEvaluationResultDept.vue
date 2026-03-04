<template>
  <q-form ref="editForm">
    <div>
      <c-table
        ref="table"
        title="성과평가 결과"
        :columns="grid.columns"
        :data="props.deptResultData"
        :editable="editable && !disabled"
        :gridHeight="gridHeight"
        :usePaging="false"
        :isExcelDown="false"
        :filtering="false"
        rowKey="evaluationResultId"
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
              :requestContentsCols="requestContentsCols"
              tableKey="evaluationResultId"
              ibmTaskTypeCd="ITT0000230"
              ibmTaskUnderTypeCd="ITTU000260"
            />
          </template>
        </template>
      </c-table>
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
import {
  performanceEvaluationResultType,
  performanceEvaluationType
} from './performanceEvaluationType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'performanceEvaluationResultDept'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  evaluation: performanceEvaluationType
  contentHeight?: stringNull | numberNull
  disabled: boolean
  selectedDeptCd: stringNull
  itemList: performanceEvaluationResultType[]
  deptResultData: Array<any>
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
  evaluation: () => {
    return {
      evaluationId: '', // 성과평가 일련번호
      plantCd: '', // 사업장 코드
      evaluationStatusCd: '', // 성과평가 진행상태
      targetDeptCds: '',
      evaluationName: '', // 평가명
      evaluationDate: '', // 평가일자
      evaluationUserId: '', // 작성자
      resultRemark: '',
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      evaluationResultList: [],
      deleteEvaluationResultList: [],
      targetDeptList: [],
      deleteTargetDeptList: [],
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '' // 결재관련 결재요청코드
    }
  },
  disabled: false,
  selectedDeptCd: '',
  itemList: () => [],
  deptResultData: () => []
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
const table = ref<any>(null)
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'evaluationItemTypeName',
      field: 'evaluationItemTypeName',
      label: '평가영역',
      align: 'center',
      style: 'width: 80px',
      codeGroupCd: 'PERFORMANCE_EVALUATION_TYPE_CD',
      sortable: false
    },
    {
      required: true,
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
        },
        {
          name: 'perc000010',
          field: 'perc000010',
          label: '해당없음',
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
      label: '달성(%)',
      align: 'right',
      style: 'width: 40px',
      sortable: false,
      type: 'text',
      setHeader: true
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

const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const saveUrl = ref('')
const deleteUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const requestContentsCols = computed(() => {
  return ['evaluationItemTypeName', 'evaluationItem']
})

const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})

const gridHeight = computed(() => {
  const height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 470
      : 618
  return height + 'px'
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
  saveUrl.value = transactionConfig.pe.evaluation.save.url
  deleteUrl.value = transactionConfig.pe.evaluation.delete.url
  // code setting
  // list setting
}

/******************************
 * TODO (목적): 테이블 내 데이터 변경 반영
 *******************************/
function tableDataChange(_props: any, _col: any) {
  const resultList = ['perc000001', 'perc000005', 'perc000010']
  if (resultList.indexOf(_col.name) > -1 && _props.row[_col.name] === 'Y') {
    _.forEach(resultList, (item) => {
      if (item !== _col.name) _props.row[item] = 'N'
    })
  } else if (resultList.indexOf(_col.name) > -1 && _props.row[_col.name] === 'N') {
    // 사용자가 'Y'를 'N'으로 바꾸려 할 때, 다른 값이 이미 'Y'인지 확인
    const otherKey = resultList.find((item) => item !== _col.name)!
    // 만약 다른 값도 'N'이면, 현재 값을 다시 'Y'로 되돌림 (둘 다 'N' 방지)
    if (_props.row[otherKey] !== 'Y') {
      _props.row[_col.name] = 'Y'
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

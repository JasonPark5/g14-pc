<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          title="관리대상군 부서"
          :columns="grid1.columns"
          :data="deptsFilter"
          :gridHeight="gridHeight"
          :usePaging="false"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="관리대상군 근로자"
          :columns="grid2.columns"
          :data="usersFilter"
          :gridHeight="gridHeight"
          :usePaging="false"
        />
      </div>
    </div>
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
import { evalPlanType } from './jobStress'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jobStressAssessmentResultDeptUser'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
interface propType {
  contentHeight?: stringNull
  popupParam: {
    heaJobStressPlanId: stringNull
  }
  plan: evalPlanType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: 'auto',
  popupParam: () => {
    return {
      heaJobStressPlanId: ''
    }
  },
  plan: () => {
    return {
      heaJobStressPlanId: '', // 직무스트레스 계획 일련번호
      plantCd: null, // 사업장
      planYear: '', // 년도
      jobStressPlanName: '', // 평가계획명
      assessmentStartDate: '', // 평가 시작일
      assessmentEndDate: '', // 평가 종료일
      period: [], // 평가기간
      remarks: '', // 비고
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      users: [], // 평가자
      centers: [], // 중앙값
      depts: [], // 중앙값
      imprs: [], // 중앙값
      resultTable: []
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
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: true,
      style: 'width: 150px'
    },
    {
      name: 'scope',
      field: 'scope',
      label: '점수',
      child: [
        {
          name: 'physicalEnv',
          field: 'physicalEnv',
          label: '물리적환경',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'jobDemand',
          field: 'jobDemand',
          label: '직무요구',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'jobAutonomy',
          field: 'jobAutonomy',
          label: '직무자율',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'relationship',
          field: 'relationship',
          label: '관계갈등',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'jobInsecurity',
          field: 'jobInsecurity',
          label: '직무불안정',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'organizational',
          field: 'organizational',
          label: '조직체계',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'inadequate',
          field: 'inadequate',
          label: '보상부적절',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'workplace',
          field: 'workplace',
          label: '직장문화',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        }
      ]
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'userName',
      field: 'userName',
      label: '평가자',
      align: 'center',
      sortable: true,
      style: 'width: 150px'
    },
    {
      name: 'scope',
      field: 'scope',
      label: '점수',
      child: [
        {
          name: 'physicalEnv',
          field: 'physicalEnv',
          label: '물리적환경',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'jobDemand',
          field: 'jobDemand',
          label: '직무요구',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'jobAutonomy',
          field: 'jobAutonomy',
          label: '직무자율',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'relationship',
          field: 'relationship',
          label: '관계갈등',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'jobInsecurity',
          field: 'jobInsecurity',
          label: '직무불안정',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'organizational',
          field: 'organizational',
          label: '조직체계',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'inadequate',
          field: 'inadequate',
          label: '보상부적절',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'workplace',
          field: 'workplace',
          label: '직장문화',
          style: 'width:50px',
          align: 'right',
          sortable: true,
          type: 'cost'
        }
      ]
    }
  ],
  data: []
})

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 500
    ? Number(props.contentHeight) - 60 + 'px'
    : 'auto'
)
const deptsFilter = computed(() =>
  props.plan.depts!.length > 0 ? _.filter(props.plan.depts, { manageTargetGroupFlag: 'Y' }) : []
)
const usersFilter = computed(() =>
  props.plan.users!.length > 0 ? _.filter(props.plan.users, { manageTargetGroupFlag: 'Y' }) : []
)

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
  // code setting
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

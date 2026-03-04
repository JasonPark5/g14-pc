<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-radio
            codeGroupCd="SEARCH_CD"
            label="비교대상"
            name="searchCd"
            v-model:value="searchCd"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="none"
            codeGroupCd="HEA_STRESS_CHECK_CLASS_CD"
            itemText="codeName"
            itemValue="code"
            label="평가구분"
            name="heaStressCheckClassCd"
            v-model:value="searchParam.heaStressCheckClassCd"
            @update:value="dataChange"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="평가결과표"
          :columns="grid.columns"
          :data="grid.data"
          :gridHeight="gridHeight"
          :usePaging="false"
        />
        <div class="q-ma-lg text-grey-7" style="font-size: 0.95em !important; line-height: 1.9em">
          <b>[직무스트레스 평가결과 해석]</b>
          <ul style="list-style-type: disc; margin-left: -20px">
            <li><b>물리적환경</b> : 한국 근로자 중앙값보다 클수록 물리환경이 상대적으로 나쁘다.</li>
            <li><b>직무요구</b> : 한국 근로자 중앙값보다 클수록 직무요구도가 상대적으로 높다.</li>
            <li><b>직무자율</b> : 한국 근로자 중앙값보다 클수록 직무자율성이 상대적으로 낮다.</li>
            <li><b>관계갈등</b> : 한국 근로자 중앙값보다 클수록 관계갈등이 상대적으로 높다.</li>
            <li>
              <b>직무 불안정</b> : 한국 근로자 중앙값보다 클수록 직업이 상대적으로 불안정하다.
            </li>
            <li>
              <b>조직체계</b> : 한국 근로자 중앙값보다 클수록 조직이 상대적으로 체계적이지 않다.
            </li>
            <li>
              <b>보상부적절</b> : 한국 근로자 중앙값보다 클수록 보상체계가 상대적으로 부적절하다.
            </li>
            <li>
              <b>직장문화</b> : 한국 근로자 중앙값보다 클수록 직장문화에 상대적으로 문제가 있다.
            </li>
          </ul>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <apexchart
          ref="chartHTML"
          class="q-ml-xl"
          type="bar"
          height="600"
          width="90%"
          :options="chart.options"
          :series="chart.series"
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
import { apexChartType } from '@/types/apexChart'
import { evalPlanType } from './jobStress'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jobStressAssessmentResultStatus2'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

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
  searchParam: {
    groupByDept?: boolean
    groupByUpDept?: boolean
    groupByJobclass?: boolean
    deptCd?: stringNull
    upDeptCd?: stringNull
    jobClassCd?: stringNull
    heaStressCheckClassCd?: stringNull
  }
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
  },
  searchParam: () => {
    return {
      groupByDept: false,
      groupByUpDept: false,
      groupByJobclass: false,
      deptCd: null,
      upDeptCd: null,
      jobClassCd: null,
      heaStressCheckClassCd: null
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false,
      style: 'width: 120px'
    },
    {
      name: 'rank',
      field: 'rank',
      label: '순위',
      align: 'center',
      sortable: false,
      style: 'width: 50px'
    },
    {
      name: 'score',
      field: 'score',
      label: '점수',
      align: 'right',
      sortable: false,
      style: 'width: 50px'
    },
    {
      name: 'c',
      field: 'c',
      label: '회사중앙값',
      child: [
        {
          name: 'companyMale',
          field: 'companyMale',
          label: '남성',
          align: 'right',
          sortable: false,
          style: 'width: 50px'
        },
        {
          name: 'companyFemale',
          field: 'companyFemale',
          label: '여성',
          align: 'right',
          sortable: false,
          style: 'width: 50px'
        },
        {
          name: 'company',
          field: 'company',
          label: '전체',
          align: 'right',
          sortable: false,
          style: 'width: 50px'
        }
      ]
    },
    {
      name: 'k',
      field: 'k',
      label: '한국 근로자 중앙값',
      child: [
        {
          name: 'koreaMale',
          field: 'koreaMale',
          label: '남성',
          align: 'right',
          sortable: false,
          style: 'width: 50px'
        },
        {
          name: 'koreaFemale',
          field: 'koreaFemale',
          label: '여성',
          align: 'right',
          sortable: false,
          style: 'width: 50px'
        },
        {
          name: 'korea',
          field: 'korea',
          label: '전체',
          align: 'right',
          sortable: false,
          style: 'width: 50px'
        }
      ]
    }
  ],
  data: []
})
const chartHTML = ref<any>(null)
const chart = ref<apexChartType>({
  options: {
    chart: {
      height: 350,
      type: 'bar'
    },
    plotOptions: {
      bar: {
        columnWidth: '60%'
      }
    },
    colors: ['#4CAF50'],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ['부서', '회사 중앙값(전체)', '한국 근로자 중앙값(전체)'],
      markers: {
        fillColors: ['#4CAF50', '#607D8B', 'tomato']
      }
    }
  },
  series: [
    {
      name: '부서',
      data: []
    }
  ]
})
const searchCd = ref<stringNull>(null)
const filter = ref<any[]>([])

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 500
    ? Number(props.contentHeight) - 150 + 'px'
    : 'auto'
)
/******************************
 * @Watch_선언
 *******************************/
// watch(
//   () => props.plan.depts,
//   (newDepts) => {
//     deptCd.value = newDepts![0].deptCd
//     dataChange(deptCd.value)
//   }
// )
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
 * TODO (목적): select 선택값 변경
 *******************************/
function dataChange(_data?: stringNull) {
  if (_data && props.plan.resultTable) {
    let lastScore: numberNull = null
    let lastRank = 0
    filter.value = _.map(
      _.orderBy(
        _.filter(props.plan.resultTable, { heaStressCheckClassCd: _data }),
        ['score'],
        ['desc']
      ),
      (item: any, idx: number) => {
        if (item.score !== lastScore) {
          lastRank = idx + 1 // 점수가 다르면 현재 index+1 → 새로운 순위
          lastScore = item.score
        }
        return { ...item, rank: lastRank }
      }
    )
    const items = filter.value.map((item) => ({
      x:
        searchCd.value === 'DEPTCD'
          ? item.deptName
          : searchCd.value === 'UPDEPTCD'
            ? item.upDeptNm
            : item.jobClassNm,
      y: item.score,
      goals: [
        {
          name: $language('회사 중앙값(전체)'),
          value: item.company,
          strokeHeight: 5,
          strokeColor: '#607D8B'
        },
        {
          name: $language('한국 근로자 중앙값(전체)'),
          value: item.korea,
          strokeHeight: 5,
          strokeColor: 'tomato'
        }
      ]
    }))
    chart.value.series = [
      {
        name:
          searchCd.value === 'DEPTCD' ? '부서' : searchCd.value === 'UPDEPTCD' ? '본부' : '직종',
        data: items
      }
    ]
    grid.value.data = filter.value
  }
}
/******************************
 * TODO (목적): radio 선택값 변경
 *******************************/
function datachange() {
  if (searchCd.value === 'DEPTCD') {
    props.searchParam.groupByDept = true
    props.searchParam.groupByUpDept = false
    props.searchParam.groupByJobclass = false
    props.searchParam.deptCd = null
    props.searchParam.upDeptCd = null
    props.searchParam.jobClassCd = null
    grid.value.columns.splice(0, 1, {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false,
      style: 'width: 120px'
    })
    chart.value.options.legend.customLegendItems[0] = '부서'
    props.searchParam.heaStressCheckClassCd = null
    grid.value.data = []
    chart.value.series = [
      {
        name: '',
        data: []
      }
    ]
  } else if (searchCd.value === 'UPDEPTCD') {
    props.searchParam.groupByDept = false
    props.searchParam.groupByUpDept = true
    props.searchParam.groupByJobclass = false
    props.searchParam.deptCd = null
    props.searchParam.upDeptCd = null
    props.searchParam.jobClassCd = null
    grid.value.columns.splice(0, 1, {
      name: 'upDeptNm',
      field: 'upDeptNm',
      label: '본부',
      align: 'center',
      sortable: false,
      style: 'width: 120px'
    })
    chart.value.options.legend.customLegendItems[0] = '본부'
    props.searchParam.heaStressCheckClassCd = null
    grid.value.data = []
    chart.value.series = [
      {
        name: '',
        data: []
      }
    ]
  } else if (searchCd.value === 'JOBCLASSCD') {
    props.searchParam.groupByDept = false
    props.searchParam.groupByUpDept = false
    props.searchParam.groupByJobclass = true
    props.searchParam.deptCd = null
    props.searchParam.upDeptCd = null
    props.searchParam.jobClassCd = null
    grid.value.columns.splice(0, 1, {
      name: 'jobClassNm',
      field: 'jobClassNm',
      label: '직종',
      align: 'center',
      sortable: false,
      style: 'width: 120px'
    })
    chart.value.options.legend.customLegendItems[0] = '직종'
    props.searchParam.heaStressCheckClassCd = null
    grid.value.data = []
    chart.value.series = [
      {
        name: '',
        data: []
      }
    ]
  }
  emits('getDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.apexcharts-tooltip
  .apexcharts-tooltip-series-group
    .apexcharts-tooltip-marker
      position: relative
      top: -20px !important
    .apexcharts-tooltip-text
      position: relative
      left: -20px !important
      .apexcharts-tooltip-y-group
        padding: 6px 0 5px 22px !important
      .apexcharts-tooltip-goals-group
        .apexcharts-tooltip-marker
          position: relative
          top: 8px !important
</style>

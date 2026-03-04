<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="평가결과 환산표"
        tableId="table"
        :columns="grid.columns"
        :data="grid.data"
        :usePaging="false"
        :columnSetting="false"
        :gridHeight="gridheight"
      />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'auditResultTable'
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

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
  }
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
      selfInspectionResultId: '',
      sysRevision: ''
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '항목',
      align: 'left',
      sortable: false
    },
    {
      name: 'maxRealScoring',
      field: 'maxRealScoring',
      label: '최고실배점',
      align: 'center',
      style: 'width:200px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'changeCalculation',
      field: 'changeCalculation',
      label: '환산계수',
      align: 'center',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'maxChangeScoring',
      field: 'maxChangeScoring',
      label: '최고환산점수',
      align: 'center',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'totalScore',
      field: 'totalScore',
      label: '실배점',
      align: 'center',
      color: 'blue',
      type: 'cost',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'score',
      field: 'score',
      label: '평가점수',
      align: 'center',
      color: 'blue',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')
const gridheight = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

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
  // url setting
  listUrl.value = selectConfig.sop.pca.item.revs.result
  // code setting
  gridheight.value = window.innerHeight - 208 + 'px'
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      sysRevision: props.popupParam.sysRevision,
      selfInspectionResultId: props.popupParam.selfInspectionResultId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
    let total_maxRealScoring = 0
    let total_maxChangeScoring = 0
    let total_totalScore = 0
    let total_score = 0
    _.forEach(grid.value.data, (item) => {
      total_maxRealScoring += parseFloat(item.maxRealScoring ? item.maxRealScoring : '0')
      total_maxChangeScoring += parseFloat(item.maxChangeScoring ? item.maxChangeScoring : '0')
      total_totalScore += parseFloat(item.totalScore ? item.totalScore : '0')
      total_score += parseFloat(item.score ? item.score : '0')
    })
    grid.value.data.push({
      itemMstName: '합계',
      maxRealScoring: total_maxRealScoring,
      maxChangeScoring: total_maxChangeScoring,
      totalScore: total_totalScore,
      score: total_score.toFixed(2)
    })
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

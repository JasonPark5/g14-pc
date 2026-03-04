<template>
  <div class="row bg-white">
    <div class="col-12">
      <c-table
        ref="table"
        customClass="main-dashboard-table"
        :columns="grid.columns"
        :data="grid.data"
        :isTop="false"
        :hideBottom="true"
        gridHeight="300px"
      >
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'risk'">
            <span class="text-red" style="font-size: 1em; font-weight: 500; line-height: 2.1em">{{
              props.row['risk']
            }}</span>
          </template>
        </template>
      </c-table>
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
  name: 'riskAssessmentPortlet'
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
interface propType {
  commonSearchParam: {
    plantCd: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  commonSearchParam: () => {
    return {
      plantCd: null
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
const listUrl = ref('')
const grid = ref({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      // 공정
      label: '공정',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      // 작업
      label: '작업',
      align: 'left',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'hazardCause',
      field: 'hazardCause',
      // 유해위험요인
      label: '유해위험요인 - 원인',
      align: 'left',
      style: 'width:170px',
      sortable: false
    },
    {
      name: 'frequency',
      field: 'frequency',
      // 빈도
      label: '빈도',
      align: 'center',
      style: 'width:45px',
      sortable: false
    },
    {
      name: 'strength',
      field: 'strength',
      // 강도
      label: '강도',
      align: 'center',
      style: 'width:45px',
      sortable: false
    },
    {
      name: 'risk',
      field: 'risk',
      // 위험도
      label: '위험도',
      type: 'custom',
      align: 'center',
      style: 'width:50px',
      sortable: false
    }
  ],
  data: []
})

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
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.monitor.krasRiskRegistry.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: props.commonSearchParam
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

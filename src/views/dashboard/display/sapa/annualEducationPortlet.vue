<template>
  <div>
    <c-table
      ref="table"
      customClass="main-dashboard-table"
      gridHeight="230px"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :checkClickFlag="false"
      :isExcelDown="true"
      :hideBottom="true"
      :isTop="false"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="Number(props.row[`educationPlanMonth${col.month}`]) > 0">
          <template
            v-if="
              props.row[`educationPlanMonth${col.month}`] ===
              props.row[`educationResultMonth${col.month}`]
            "
          >
            <span class="text-primary" style="font-weight: 700">
              {{ props.row[`educationPlanMonth${col.month}`] }}/{{
                props.row[`educationResultMonth${col.month}`]
              }}
            </span>
          </template>
          <template v-else>
            {{ props.row[`educationPlanMonth${col.month}`] }}/{{
              props.row[`educationResultMonth${col.month}`]
            }}
          </template>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationPortlet'
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
const $language = inject('$language') as GetTranLanguageFunction

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
const grid = ref({
  columns: [
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      align: 'left',
      style: 'width:200px',
      sortable: true
    },
    {
      label:
        `${$language('연간교육일정')} <span class="text-red" style="font-size:0.9em;font-weight:500;">` +
        `(계획/결과)</span> `,
      align: 'center',
      sortable: false,
      child: Array.from({ length: 12 }, (_, index) => {
        return {
          name: 'educationMonth' + (index + 1),
          field: 'educationMonth' + (index + 1),
          label: $language(index + 1 + '월'),
          month: index + 1,
          type: 'custom',
          align: 'center',
          sortable: false
        }
      })
    }
  ],
  data: []
})
const listUrl = ref('')

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
  listUrl.value = selectConfig.monitor.educationSchedultTable.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 연간교육계획 목록 조회
 *******************************/
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

<template>
  <c-card
    class="cardClassDetailForm"
    title="상세"
    style="width: 1000px; max-width: 1000px !important"
  >
    <template v-slot:card-button>
      <q-btn-group outline>
        <c-btn v-if="props.editable" label="적용" icon="check" @btnClicked="accept" />
      </q-btn-group>
    </template>
    <template v-slot:card-detail>
      <div class="col-12">
        <c-text :disabled="true" label="총점수 (A x B)" name="total" v-model:value="total" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <c-table
          ref="table1"
          :columns="grid1.columns"
          :data="grid1.data"
          gridHeight="250px"
          :isTitle="false"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          @rowClick="rowClick1"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <c-table
          ref="table2"
          :columns="grid2.columns"
          :data="grid2.data"
          gridHeight="250px"
          :isTitle="false"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          @rowClick="rowClick2"
        />
      </div>
    </template>
  </c-card>
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
  name: 'jobRiskPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['callback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  props: {
    row: Array<any>
  }
  col: object
  editable: boolean
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
  props: () => {
    return {
      row: []
    }
  },
  col: () => {
    return {}
  },
  editable: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '작업부하(A)',
      align: 'center',
      sortable: false
    },
    {
      name: 'code',
      field: 'code',
      label: '점수',
      align: 'center',
      style: 'width:50px',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '작업빈도(B)',
      align: 'center',
      sortable: false
    },
    {
      name: 'code',
      field: 'code',
      label: '점수',
      align: 'center',
      style: 'width:50px',
      sortable: false
    }
  ],
  data: []
})
const strength = ref(0)
const frequency = ref(0)
const total = ref('0')

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
  // code setting
  getComboItems('HEA_MUSCLE_STRENGTH').then((_result: any) => {
    grid1.value.data = _result
  })
  getComboItems('HEA_MUSCLE_FREQUENCY').then((_result: any) => {
    grid2.value.data = _result
  })
  // list setting
}
/******************************
 * TODO (목적): 행클릭시 실행되는 함수
 *******************************/
function rowClick1(row: any) {
  strength.value = Number(row.code)
  if (frequency.value) total.value = String(strength.value * frequency.value)
}
function rowClick2(row: any) {
  frequency.value = Number(row.code)
  if (strength.value) total.value = String(strength.value * frequency.value)
}
/******************************
 * TODO (목적): 부모에게 값 전달하고 창닫기기
 *******************************/
function accept() {
  emits('callback', {
    total: total.value,
    strength: strength.value,
    frequency: frequency.value
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

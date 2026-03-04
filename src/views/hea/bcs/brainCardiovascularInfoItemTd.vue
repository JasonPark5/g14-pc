<template>
  <q-td
    v-if="Boolean(result) && Boolean(result.riskFactors)"
    class="text-center th-td-style td-style"
    :rowspan="1"
    :colspan="colspan"
  >
    <div class="container-area">
      <div class="header-area">
        {{ result.riskFactors }}
        <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
      </div>
      <div class="value-area">
        <template v-if="type === 'number'">
          <c-number-column
            :required="required"
            :editable="editable"
            :col="{ name: 'riskFactorsResult' }"
            :props="{ row: result }"
            dense
            type="number"
            class="tableHeaderText"
            v-model:value="result.riskFactorsResult"
            @datachange="datachange"
          />
        </template>
        <template v-else-if="type === 'radio'">
          <c-radio
            :required="required"
            :editable="editable"
            :codeGroupCd="codeGroupCd"
            itemText="codeName"
            itemValue="code"
            label=""
            v-model:value="result.riskFactorsResult"
            @datachange="datachange"
          />
        </template>
        <template v-else-if="type === 'check'">
          <q-checkbox
            :required="required"
            :disable="!editable"
            :true-value="trueValue ? trueValue : 'Y'"
            :false-value="falseValue ? falseValue : 'N'"
            :rules="[checkboxRule]"
            dense
            color="orange-custom"
            class="tableCheckBox"
            v-model="result.riskFactorsResult"
            @datachange="datachange"
          />
        </template>
        <template v-else-if="type === 'text'">
          <c-text-column
            :required="required"
            :editable="editable"
            v-model:value="result.riskFactorsResult"
            @datachange="datachange"
          />
        </template>
      </div>
    </div>
  </q-td>
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
import { resultType } from './brainSurvey'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'brainCardiovascularInfoItemTd'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['datachange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  result: resultType
  colspan?: numberNull
  codeGroupCd?: stringNull
  type?: stringNull
  trueValue?: stringNull
  falseValue?: stringNull
  trueLabel?: stringNull
  falseLabel?: stringNull
  editable?: boolean
  required?: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  result: () => {
    return {
      heaBrainCardiovascularEvalResultId: '', // 뇌심혈관계 평가결과 일련번호
      heaBrainCardiovascularSurveyId: '', // 뇌심혈관계 일련번호
      heaBrainCardiovascularEvalItemId: '', // 뇌심혈관계 평가항목 일련번호
      workSuitEvalItemClassCd: '', // 위험요인 구분코드
      workSuitEvalItemClassName: '', // 위험요인 구분코드
      riskFactors: '', // 위험요인
      riskFactorsResult: '', // 위험요인 평가결과(현재상태)
      riskFactorsGoalResult: '', // 목표상태
      healthConditionCd: '', // 건강신호등
      regUserId: '', //
      editFlag: null
    }
  },
  colspan: 1,
  codeGroupCd: '',
  type: '',
  trueValue: '',
  falseValue: '',
  trueLabel: '',
  falseLabel: '',
  editable: false,
  required: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/

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
  // list setting
}
/******************************
 * TODO (목적): 평가항목 응답값 변경시
 *******************************/
function datachange() {
  if (props.result.editFlag !== 'C') {
    props.result.editFlag = 'U'
    props.result.chgUserId = user.value.userId
  }
  emits('datachange', props.result)
}
/******************************
 * TODO (목적): 유효성 검사
 *******************************/
function checkboxRule(val: any) {
  return !props.required || (val && val.length > 0) || ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <c-card class="cardClassDetailForm" title="상세">
      <template v-slot:card-detail>
        <div class="col-12">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :rows="10"
            :maxlength="1000"
            :counter="true"
            label="결과요약"
            name="resultRemark"
            v-model:value="props.evaluation.resultRemark"
          />
        </div>
        <div class="col-12 q-mt-md">
          <c-upload
            label="결과보고서"
            :attachInfo="attachResultInfo"
            :editable="editable && !disabled"
          />
        </div>
      </template>
    </c-card>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { performanceEvaluationType } from './performanceEvaluationType'

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
  name: 'evaluationResultAttach'
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
  popupParam: {
    evaluationId: stringNull
  }
  searchFlag?: {
    value: stringNull
  }
  evaluation: performanceEvaluationType
  disabled?: boolean
  attachResultInfo?: attachSettingType
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
      DeleteTargetDeptList: [],
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '' // 결재관련 결재요청코드
    }
  },
  attachResultInfo: () => {
    return {
      isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
      taskClassCd: 'EVALUATION_RESULT',
      taskKey: ''
    }
  },
  searchFlag: () => {
    return {
      value: ''
    }
  },
  disabled: false,
  apprMode: false,
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
  // code setting
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

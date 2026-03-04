<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-card title="개선 전 사진" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-12 risk">
            <c-upload-picture
              height="500px"
              :attachInfo="attachBeforeInfo"
              :editable="editable && !popupParam.disabled"
            />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-card title="개선 후 사진" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-12 risk">
            <c-upload-picture
              height="500px"
              isMultiTask
              :attachInfo="attachAfterInfo"
              :editable="editable && !popupParam.disabled"
            />
          </div>
        </template>
      </c-card>
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
  name: '4mScenarioImprPicture'
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
    ram4mAssessScenarioId: stringNull // 평가 일련번호
    sopImprovementIds: stringNull
    ram4mAssessImprIds: stringNull
    disabled: boolean
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
  popupParam: () => {
    return {
      ram4mAssessScenarioId: '', // 평가 일련번호
      sopImprovementIds: '',
      ram4mAssessImprIds: '',
      disabled: false
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
const attachBeforeInfo = ref({
  isSubmit: '',
  taskClassCd: '4M_SCENARIO_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref<any>({
  isSubmit: '',
  task: []
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
  // code setting
  attachBeforeInfo.value.taskKey = props.popupParam.ram4mAssessScenarioId
  if (props.popupParam.sopImprovementIds) {
    attachAfterInfo.value.task = _.map(_.split(props.popupParam.sopImprovementIds, ','), (item) => {
      return {
        taskClassCd: 'IBM_AFTER',
        taskKey: item
      }
    })
  } else if (props.popupParam.ram4mAssessImprIds) {
    attachAfterInfo.value.task = _.map(
      _.split(props.popupParam.ram4mAssessImprIds, ','),
      (item) => {
        return {
          taskClassCd: '4M_IMPR_AFTER',
          taskKey: item
        }
      }
    )
  }
  // list setting
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

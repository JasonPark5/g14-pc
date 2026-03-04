<template>
  <div class="row">
    <!-- <div class="col-12" style="padding: 0 5px !important">
      <q-btn-group outline class="float-right" style="padding: 0 !important">
        <c-btn
          v-show="editable && !disabled && !btnEditable"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="saveProcess"
          mappingType="PUT"
          label="공정 평가완료"
          icon="check"
          @beforeAction="completeProcess"
          @btnCallback="completeProcessCallback"
        />
      </q-btn-group>
    </div> -->
    <div class="col-12">
      <c-tab
        type="tabcard"
        align="left"
        title="도면명"
        :tabItems="processData.draws"
        :inlineLabel="true"
        :height="tabHeight"
        v-model:value="tab"
      >
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :key="tab.componentKey"
            :draw="tab.draw"
            :processData="processData"
            :param="param"
            :disabled="disabled"
            @research="research"
          />
        </template>
      </c-tab>
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
import { processDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazopActionDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
// const message = useMessageStore()
// const userStore = useUserStore()
// const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['assessComplete', 'research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  processData: processDataType
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    ramTechniqueCd: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/
// const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  processData: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정명
      ramProcessAssessStepCd: '', // 평가진행상태
      processExplainFeature: '', // 공정 특징 설명
      assessDeptCd: '', // 평가 부서 코드
      assessUserId: '', // 평가 담당자
      assessUserName: '', // 평가 담당자
      workCycleCd: null, // 작업발생주기코드
      workingTime: 0, // 작업시간(1회)
      vendorFlag: 0,
      temperature: null,
      workMeasurementPlanId: '',
      measPlanContent: '',
      workCycleName: '',
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      jobs: [],
      sops: [],
      drawNodes: [],
      draws: [],
      fmScenarios: [],
      hazopScenarios: [],
      scenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: [],
      reCheckedCnt: 0
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      ramTechniqueCd: ''
    }
  },
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
// const isComplete = ref(false)
// const saveProcess = ref<any>({
//   ramRiskAssessmentPlanId: '', // 평가 일련번호
//   processCd: '', // 단위공정 코드
//   processName: '', // 단위공정명
//   ramProcessAssessStepCd: '', // 평가진행상태
//   processExplainFeature: '', // 공정 특징 설명
//   assessDeptCd: '', // 평가 부서 코드
//   assessUserId: '', // 평가 담당자
//   draws: []
// })

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return (
    !(props.param.ramStepCd === 'RRS0000005' || props.param.ramStepCd == 'RRS0000010') ||
    props.processData.ramProcessAssessStepCd === 'RPA0000005'
  )
})
// const btnEditable = computed(() => {
//   return (
//     editable.value &&
//     props.param.ramStepCd === 'RRS0000010' &&
//     props.processData.ramProcessAssessStepCd === 'RPA0000005'
//   )
// })
const tabHeight = computed(() => {
  return String(window.innerHeight - 310) + 'px'
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
  deleteUrl.value = transactionConfig.ram.assessPlan.delete.url
  completeUrl.value = transactionConfig.ram.assessProcess.complete.url
  // code setting
  // list setting
  setDraw()
}
function setDraw() {
  if (props.processData && props.processData.draws && props.processData.draws.length > 0) {
    tab.value = props.processData.draws[0].psiDiagramId
  } else {
    tab.value = ''
  }
}
// function completeProcess() {
//   // 도면 별 노드에 시나리오가 하나 이상 등록되었는지?
//   // 화면에서 추가는 하고 저장을 하지 않았을 시에 해당 데이터도 일괄 저장 처리
//   // 저장 처리 후 callback에서 process 목록 재조회
//   let isProgress = true
//   _.forEach(props.processData.draws, (draw) => {
//     _.forEach(draw.nodes, (node) => {
//       if (!node.hazopScenarios || node.hazopScenarios.length === 0) {
//         isProgress = false
//         message.alert({
//           title: '안내',
//           message:
//             $language('도면 / 노드에 등록된 시나리오가 없습니다.') +
//             '[' +
//             draw.diagramTitle +
//             ' / ' +
//             node.nodeTitle +
//             ']',
//           type: 'warning' // success / info / warning / error
//         })
//         return false
//       }
//     })
//     if (!isProgress) {
//       return false
//     }
//   })

//   if (isProgress) {
//     message.confirm({
//       title: '확인',
//       message: '완료하시겠습니까?',
//       type: 'info', // success / info / warning / error
//       // 확인 callback 함수
//       confirmCallback: () => {
//         props.processData.chgUserId = user.value.userId
//         props.processData.ramProcessAssessStepCd = 'RPA0000005'

//         saveProcess.value = _.cloneDeep(props.processData)
//         _.forEach(saveProcess.value.draws, (_draw: any) => {
//           delete _draw.draw

//           _.forEach(_draw.nodes, (_node: any) => {
//             _.forEach(_node.hazopScenarios, (_scenario: any) => {
//               if (_scenario.editFlag === 'C') _scenario.editFlag = null
//             })
//           })
//         })

//         isComplete.value = !isComplete.value
//       },
//       // 취소 callback 함수
//       cancelCallback: () => {}
//     })
//   }
// }
// function completeProcessCallback(_result: any) {
//   message.requestSuccess()
//   emits('assessComplete', _result.data)
// }
/**
 * 재조회
 * 목적 : 돌아가기전 데이터를 저장 했을 수도 있지만
 *        입력만 하고 돌아가는 경우를 대비하기 위함
 */
function research() {
  emits('research', 'scenario')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

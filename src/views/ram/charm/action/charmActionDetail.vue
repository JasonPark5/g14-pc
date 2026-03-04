<template>
  <div class="row">
    <div v-show="editable && !disabled" class="col-12" style="padding: 0 5px 5px 5px !important">
      <q-btn-group outline class="float-right">
        <c-btn
          v-show="processData.estimationFlag !== 'Y' && !btnEditable"
          :isSubmit="isEstimationComplete"
          :url="estimationCompleteUrl"
          :param="saveProcess"
          mappingType="PUT"
          :label="$language('공정 추정완료 ' + processData.processName)"
          icon="check"
          @beforeAction="estimationCompleteProcess"
          @btnCallback="estimationCompleteProcessCallback"
        />
        <c-btn
          v-show="processData.estimationFlag === 'Y' && !btnEditable"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="saveProcess"
          mappingType="PUT"
          label="평가완료"
          icon="check"
          @beforeAction="completeProcess"
          @btnCallback="completeProcessCallback"
        />
      </q-btn-group>
    </div>
    <c-card title="대상공정 상세" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <c-label-text title="단위공정" :value="processData.processName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <c-label-text
            :title="processData.vendorFlag === '0' ? '평가부서' : '평가업체'"
            :value="processData.assessDeptName"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <c-label-text title="평가담당자" :value="processData.assessUserName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <c-label-text title="작업환경측정" :value="processData.measPlanContent || ''" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <c-label-text title="사용온도(℃)" :value="processData.temperature" />
        </div>
      </template>
    </c-card>
    <div class="col-12">
      <c-tab
        type="tabcard"
        align="left"
        :tabItems="tabItems"
        :height="tabHeight"
        :inlineLabel="true"
        v-model:value="tabs1"
      >
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :key="tab.componentKey"
            :processData="processData"
            :param="param"
            :height="height"
            :btnEditable="btnEditable"
            :estimationUpdateBtnData="estimationUpdateBtnData"
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
  name: 'charmActionDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  }
  height: stringNull
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
      reCheckedCnt: 0,
      estimationReCheckedCnt: 0,
      resultReCheckedCnt: 0
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: ''
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
const estimationCompleteUrl = ref('')
const completeUrl = ref('')
const isComplete = ref(false)
const isEstimationComplete = ref(false)
const saveProcess = ref<any>({
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  processCd: '', // 단위공정 코드
  processName: '', // 단위공정명
  ramProcessAssessStepCd: '', // 평가진행상태
  processExplainFeature: '', // 공정 특징 설명
  assessDeptCd: '', // 평가 부서 코드
  assessUserId: '', // 평가 담당자
  charmResultScenarios: [],
  charmEstimationScenarios: []
})
const estimationUpdateBtnData = ref<any>({
  title: '추정',
  flag: false,
  research: ''
})

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return (
    !(props.param.ramStepCd === 'RRS0000005' || props.param.ramStepCd == 'RRS0000010') ||
    props.processData.ramProcessAssessStepCd === 'RPA0000005'
  )
})
const btnEditable = computed(() => {
  return (
    editable.value &&
    props.param.ramStepCd === 'RRS0000010' &&
    props.processData.ramProcessAssessStepCd === 'RPA0000005'
  )
})
const tabHeight = computed(() => {
  const margin = 230
  let _height = Number(_.replace(props.height, 'px', ''))
  if (editable.value && !disabled.value && !btnEditable.value) {
    _height = _height - 20
  }
  return String(_height - margin) + 'px'
})
const tabs1 = ref('')
const tab = computed(() => {
  return props.processData.estimationFlag === 'Y' ? '2' : '1'
})
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: '1',
      icon: 'calculate',
      label: '위험도 추정',
      component: defineAsyncComponent(() => import(`./charmRiskEstimation.vue`))
    },
    {
      name: '2',
      icon: 'gavel',
      label: '위험도 결정',
      component: defineAsyncComponent(() => import(`./charmScenario.vue`)),
      disabled: props.processData.estimationFlag !== 'Y'
    }
  ]
  return _items
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
  estimationCompleteUrl.value = transactionConfig.ram.assessProcess.estimationComplete.url
  completeUrl.value = transactionConfig.ram.assessProcess.complete.url
  // code setting
  tabs1.value = tab.value
  // list setting
}
function estimationCompleteProcess() {
  let isProgress = true
  _.forEach(props.processData.charmEstimationScenarios, (sc) => {
    if (!sc.riskEstimation) {
      isProgress = false
      message.alert({
        title: '안내',
        message: $language(
          '화학자재[' +
            sc.materialName +
            ']/구성물질[' +
            sc.chemName +
            ']에 위험도 추정이 되지 않았습니다.',
          { s1: sc.materialName, s2: sc.chemName }
        ),
        type: 'warning' // success / info / warning / error
      })
      return false
    }
  })

  if (isProgress) {
    message.confirm({
      title: '확인',
      message: '완료하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        props.processData.chgUserId = user.value.userId

        saveProcess.value = _.cloneDeep(props.processData)
        isEstimationComplete.value = !isEstimationComplete.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function estimationCompleteProcessCallback(_result: any) {
  message.requestSuccess()
  emits('assessComplete', _result.data)
}
function completeProcess() {
  let isProgress = true
  _.forEach(props.processData.charmResultScenarios, (sc) => {
    if (!sc.afterRamMatrixRiskId || !sc.assessDate || !sc.assessUserName) {
      isProgress = false
      message.alert({
        title: '안내',
        message: $language(
          '화학자재[' + sc.materialName + ']에 개선 후 위험도/평가자/평가일이 입력되지 않았습니다.'
        ),
        type: 'warning' // success / info / warning / error
      })
      return false
    }
  })

  if (isProgress) {
    message.confirm({
      title: '확인',
      message: '완료하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        props.processData.chgUserId = user.value.userId
        props.processData.ramProcessAssessStepCd = 'RPA0000005'

        saveProcess.value = _.cloneDeep(props.processData)
        isComplete.value = !isComplete.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function completeProcessCallback(_result: any) {
  message.requestSuccess()
  emits('assessComplete', _result.data)
}
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

<template>
  <div>
    <div class="col float-right">
      <q-btn-group outline>
        <c-btn
          v-show="completeBtnEditable"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="{
            heaInvestigationPlanId: props.param.heaInvestigationPlanId,
            heaInvestigationStepCd: props.param.stepCd
          }"
          mappingType="PUT"
          label="유해요인조사 완료"
          icon="check"
          @beforeAction="completeInvestigation"
          @btnCallback="completeInvestigationCallback"
        />
      </q-btn-group>
    </div>
    <c-tab
      ref="ctomissTab2"
      type="tabcard"
      title="단위작업"
      :dense="true"
      :inlineLabel="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :disabled="disabled"
          :height="props.height"
          :popupParam="tab.popupParam"
          @getDetail="getDetail"
        />
      </template>
    </c-tab>
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
  name: 'hazardInvestigationDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  height?: stringNull
  param: {
    heaInvestigationPlanId: stringNull
    searchProcess: any | null | undefined
    stepCd: stringNull
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
  height: null,
  param: () => {
    return {
      heaInvestigationPlanId: '',
      stepCd: '',
      searchProcess: {
        flag: '',
        isSearch: false
      }
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
const hazardListUrl = ref('')
const editable = ref(true)
const tab = ref('work')
const tabItems = ref<any>([])
const isComplete = ref(true)
const completeUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.param.heaInvestigationPlanId))
const completeDisabled = computed(() => props.param.stepCd !== 'HI00000005')
const disabled = computed(() => props.param.stepCd === 'HI00000010')
const detailInfoComponent = computed(() => {
  return markRaw(defineAsyncComponent(() => import(`./hazardInvestigationDetailInfo.vue`)))
})

const tabHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 40 + 'px' : '680px'
)
const completeBtnEditable = computed(() => editable.value && !completeDisabled.value && isOld.value)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.searchProcess.flag,
  () => {
    getDetail()
  }
)

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
  hazardListUrl.value = selectConfig.hea.muscleSystem.muscleSop.list.url
  completeUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.complete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 설문조사 결과 상세조회
 *******************************/
function getDetail() {
  $http({
    url: hazardListUrl.value,
    method: 'GET',
    params: {
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  }).then((_result: any) => {
    tabItems.value = []
    _.forEach(_result.data, (_item) => {
      tabItems.value.push({
        key: uid(),
        name: _item.heaMuscleSopId,
        icon: 'work_outline',
        label: _item.processName + '/' + _item.sopName,
        component: detailInfoComponent.value,
        popupParam: _item
      })
    })
    tab.value = _result.data[0].heaMuscleSopId
  })
}
/******************************
 * TODO (목적): 유해요인 조사 완료 처리
 *******************************/
function completeInvestigation() {
  message.confirm({
    title: '확인',
    message: '유해요인 조사완료하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function completeInvestigationCallback() {
  message.requestSuccess()
  emits('emitStep', {
    name: 'currentStep',
    param: {
      stepCd: 'HI00000007',
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  })
}
</script>

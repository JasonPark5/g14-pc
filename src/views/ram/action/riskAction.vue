<template>
  <div>
    <div class="col-12 float-right">
      <q-btn-group outline>
        <c-btn
          v-show="param.vendorFlag && isVendorRequest"
          label="업체요청 반려"
          icon="front_hand"
          color="red-3"
          @btnClicked="returnDialogOpen"
        />
        <c-btn
          v-show="!deleteDisabled"
          label="위험성평가 삭제"
          icon="remove"
          @btnClicked="removePlan"
        />
        <c-btn
          v-show="completeFlag"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="assessPlan"
          mappingType="PUT"
          label="평가완료"
          icon="check"
          @beforeAction="completeAction"
          @btnCallback="completeActionCallback"
        />
      </q-btn-group>
    </div>
    <c-tab
      ref="riskActionTab"
      type="vertical"
      :tabItems="tabItems"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :height="tabHeight"
          :processData="tab.process"
          :param="props.param"
          :planUpdateBtnData="props.param.planUpdateBtnData"
          @assessComplete="assessComplete"
          @research="research"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
    <q-dialog v-model="returnDialog.show" persistent>
      <q-card style="min-width: 450px">
        <q-form ref="editForm2">
          <c-card title="반려 사유" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable"
                  :isSubmit="isReturn"
                  :url="returnUrl"
                  :param="returnData"
                  mappingType="PUT"
                  label="반려"
                  icon="front_hand"
                  color="red-3"
                  @beforeAction="returnAssess"
                  @btnCallback="returnAssessCallback"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  :rows="5"
                  label=""
                  name="returnRemark"
                  v-model:value="returnData.returnRemark"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
    <c-dialog :param="popupOptions" />
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
  name: 'riskAction'
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
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    vendorFlag: boolean
    ramTechniqueCd: stringNull
    searchRiskReduce: {
      flag: stringNull
      isSearch: boolean
    }
    searchScenario: {
      flag: stringNull
      isSearch: boolean
    }
    planUpdateBtnData: {
      title: stringNull
      flag: boolean
      research: stringNull
      planResearch: stringNull
    }
  }
  height: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      vendorFlag: false,
      ramTechniqueCd: '',
      teams: [], // 평가팀 목록
      delTeams: [],
      searchRiskReduce: {
        flag: '',
        isSearch: false
      },
      searchScenario: {
        flag: '',
        isSearch: false
      },
      planUpdateBtnData: {
        title: '계획',
        flag: false,
        research: '',
        planResearch: ''
      }
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
const tabItems = ref<any>([])
const returnData = ref({
  ramRiskAssessmentPlanId: '',
  ramStepCd: '',
  returnRemark: '',
  chgUserId: ''
})
const returnDialog = ref({
  show: false
}) as any
const isVendorRequest = ref(false)
const isComplete = ref(false)
const isReturn = ref(false)
const listUrl = ref('')
const completeUrl = ref('')
const returnUrl = ref('')
const deletePlanUrl = ref('')
const recheckSaveUrl = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const riskActionTab = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const completeFlag = computed(() => {
  return (
    tabItems.value &&
    tabItems.value.length > 0 &&
    // _.findIndex(tabItems.value, (_item: any) => {
    //   return _item.process.ramProcessAssessStepCd !== 'RPA0000005'
    // }) === -1 &&
    props.param.ramStepCd === 'RRS0000010'
  )
})
const assessPlan = computed(() => {
  return {
    ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId,
    ramStepCd: props.param.ramStepCd,
    chgUserId: user.value.userId
  }
})
const deleteDisabled = computed(() => {
  return props.param.ramStepCd === 'RRS0000015'
})
const scenarioComponent = computed(() => {
  let components = null
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/hazop/action/hazopActionDetail.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/kpsr/action/kpsrActionDetail.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000010') {
    // Check-list
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/checklist/action/checklistActionDetail.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000015') {
    // JRA
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/jsa/action/jsaActionDetail.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000020') {
    // KRAS
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/kras/action/krasScenario.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000025') {
    // 4M
    components = shallowRef(
      defineAsyncComponent(() => import('@views/ram/4m/action/4mScenario.vue'))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000030') {
    // CHARM
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/charm/action/charmActionDetail.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/third/action/thirdScenario.vue`))
    )
  }
  return components
})
const drawComponent = computed(() => {
  let components = null
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/hazop/action/hazopScenario.vue`))
    )
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR
    components = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/kpsr/action/kpsrScenario.vue`))
    )
  }
  return components
})
const tabHeight = computed(() =>
  !isNaN(Number(props.height)) && Number(props.height) > 600 ? props.height - 100 + 'px' : '850px'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.searchScenario.flag,
  () => {
    getList()
  }
)
watch(
  () => props.param.planUpdateBtnData.research,
  () => {
    getList()
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
  listUrl.value = selectConfig.ram.targetProcess.list.url
  completeUrl.value = transactionConfig.ram.assessPlan.complete.url
  returnUrl.value = transactionConfig.ram.assessPlan.return.url
  deletePlanUrl.value = transactionConfig.ram.assessPlan.delete.url
  recheckSaveUrl.value = transactionConfig.ram.assessPlan.recheck.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramTechniqueCd: props.param.ramTechniqueCd,
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    tabItems.value = []
    _.forEach(_result.data, (item: any) => {
      if (item && item.draws) {
        _.forEach(item.draws, (draw: any) => {
          draw.name = draw.psiDiagramId
          draw.icon = 'architecture'
          draw.label = draw.diagramTitle + ' (' + draw.diagramNo + ')'
          draw.componentKey = uid()
          draw.component = drawComponent.value
          draw.draw = draw
        })
        tabItems.value.push({
          key: uid(),
          name: item.processCd,
          icon: 'work_outline',
          label: item.processName,
          process: item,
          component: scenarioComponent.value
        })
      } else if (item && item.sops) {
        _.forEach(item.sops, (sop: any) => {
          sop.name = sop.ramJsaAssessJobId
          sop.icon = 'architecture'
          sop.label = sop.jobName
          sop.componentKey = uid()
          sop.component = shallowRef(
            defineAsyncComponent(() => import(`@views/ram/jsa/action/jsaScenario.vue`))
          )
          sop.sop = sop
        })
        tabItems.value.push({
          key: uid(),
          name: item.processCd,
          icon: 'work_outline',
          label: item.processName,
          process: item,
          component: scenarioComponent.value
        })
      } else if (item && item.targets) {
        _.forEach(item.targets, (target) => {
          target.name = target.ramAssessChecklistTargetId
          target.icon = 'architecture'
          target.label = `(${target.ramCheckItemClassName}) ${target.checkItemName}`
          target.componentKey = uid()
          target.component = shallowRef(
            defineAsyncComponent(() => import(`@views/ram/checklist/action/checklistScenario.vue`))
          )
          target.target = target
        })
        tabItems.value.push({
          key: uid(),
          name: item.processCd,
          icon: 'work_outline',
          label: item.processName,
          process: item,
          component: scenarioComponent.value
        })
      } else {
        tabItems.value.push({
          key: uid(),
          name: item.processCd,
          icon: 'work_outline',
          label: item.processName,
          process: item,
          component: scenarioComponent.value
        })
      }
      isVendorRequest.value = item.vendorRequestFlag === 'Y'
    })
    tab.value = _result.data[0].processCd
    // riskActionTab.value.setValue(tab.value)
  })
}
function assessComplete(_stepCd: any) {
  getList()
  // stepper 이동
  if (_stepCd === 'RRS0000015') {
    emits('emitStep', {
      name: 'stepBystep',
      param: _stepCd
    })
  }
}
function research(_place: any) {
  emits('emitStep', {
    name: 'research',
    param: {
      place: _place
    }
  })
}
function completeAction() {
  message.confirm({
    title: '확인',
    message: '완료하시겠습니까?',
    // TODO : 필요시 추가하세요.
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      assessPlan.value.chgUserId = user.value.userId
      assessPlan.value.ramStepCd = 'RRS0000015'

      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function completeActionCallback() {
  message.requestSuccess()
  // 계획 상세 조회
  getList()
  // stepper 이동
  emits('emitStep', {
    name: 'stepBystep',
    param: assessPlan.value.ramStepCd
  })
}
function returnDialogOpen() {
  returnDialog.value.show = true
}
function closeDialog() {
  returnDialog.value.show = false
}
function returnAssess() {
  if (!returnData.value.returnRemark) {
    message.alert({
      title: '안내',
      message: '반려사유를 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }

  message.confirm({
    title: '확인',
    message: '업체요청 반려하시겠습니까?',
    // TODO : 필요시 추가하세요.
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      _.extend(returnData.value, assessPlan.value)

      isReturn.value = !isReturn.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function returnAssessCallback() {
  message.requestSuccess()
  closeDialog()
  // 계획 상세 조회
  getList()
}
function removePlan() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    // TODO : 필요시 추가하세요.
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deletePlanUrl.value, props.param.ramRiskAssessmentPlanId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        closePopup()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function closePopup() {
  emits('emitStep', {
    name: 'closePopup'
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<template>
  <div>
    <div class="col float-right">
      <q-btn-group outline>
        <c-btn
          v-show="editable && !planDisabled && isOld"
          label="삭제"
          icon="delete"
          @btnClicked="deleteInvestigation"
        />
        <c-btn
          v-show="completeBtnEditable"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="investigation"
          mappingType="PUT"
          label="유해요인조사 요청"
          icon="check"
          @beforeAction="completeInvestigation"
          @btnCallback="completeInvestigationCallback"
        />
      </q-btn-group>
    </div>
    <c-tab
      type="vertical"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <!-- :key="tab.key" -->
        <component
          :is="tab.component"
          :popupParam="param"
          :investigation="investigation"
          :heavyWorks="heavyWorks"
          :attachInfo="attachInfo"
          :contentHeight="height"
          :disabled="disabled"
          :isOld="isOld"
          @keySetting="keySetting"
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
import { investigationType } from './investigation'

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
  name: 'investigationPlanDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
    stepCd: stringNull
    searchProcess: any | null | undefined
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
const investigation = ref<investigationType>({
  heaInvestigationPlanId: '',
  plantCd: '',
  investigationPlanName: '',
  year: '',
  heaInvestigationStepCd: '',
  investigationStartDate: '',
  investigationEndDate: '',
  period: [],
  deptCd: '',
  userId: '',
  investigationDeptCd: '',
  agency: '',
  remark: '',
  regUserId: '',
  chgUserId: '',
  sops: [],
  sopTable: []
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'HEA_INVESTIGATION_PLAN',
  taskKey: ''
})
const detailUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const heavyWorkUrl = ref('')
const isComplete = ref(true)
const editable = ref(true)
const heavyWorks = ref([])
const tab = ref('info')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.param.heaInvestigationPlanId))
const planDisabled = computed(() => investigation.value.heaInvestigationStepCd !== 'HI00000001')
const disabled = computed(() => investigation.value.heaInvestigationStepCd === 'HI00000010')
const tabItems = computed(() => {
  return [
    {
      key: uid(),
      name: 'info',
      icon: 'edit',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./investigationPlanInfo.vue`)),
      disabled: false
    },
    {
      key: uid(),
      name: 'job',
      icon: 'build',
      label: '부담작업<br>분류표',
      component: defineAsyncComponent(() => import(`./musculoskeletalSystemJob.vue`)),
      disabled: props.param.heaInvestigationPlanId ? false : true
    }
  ]
})
const tabHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 30 + 'px' : '680px'
)
const completeBtnEditable = computed(() => editable.value && !planDisabled.value && isOld.value)
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => investigation.value.plantCd,
  () => {
    getHeavyWorks()
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
  detailUrl.value = selectConfig.hea.muscleSystem.investigationPlan.get.url
  deleteUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.delete.url
  completeUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.complete.url
  heavyWorkUrl.value = selectConfig.hea.heavyWork.list.url
  // code setting
  // list setting
  getDetail()
  getHeavyWorks()
}

/******************************
 * TODO (목적): 근골격계 조사계획 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.param.heaInvestigationPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(investigation.value, _result.data)
      investigation.value.period = [
        investigation.value.investigationStartDate,
        investigation.value.investigationEndDate
      ]
      attachInfo.value.taskKey = props.param.heaInvestigationPlanId
    })
  } else {
    investigation.value.heaInvestigationStepCd = 'HI00000001'
    investigation.value.userId = user.value.userId
    investigation.value.deptCd = user.value.deptCd
    investigation.value.year = getThisYear()
  }
}
/******************************
 * TODO (목적): 근골격계 부담작업 조회
 *******************************/
function getHeavyWorks() {
  $http({
    url: heavyWorkUrl.value,
    method: 'GET',
    params: {
      plantCd: investigation.value.plantCd ? investigation.value.plantCd : user.value.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    heavyWorks.value = _result.data
  })
}

/******************************
 * TODO (목적): 근골격계 조사계획 완료 처리
 *******************************/
function completeInvestigation() {
  /**
   * 1. 단위작업이 하나 이상인지?
   * 2. 단위작업별 부담작업이 하나 이상 등록되었는지?
   * 3. 부담작업 조사가 이루어졌는지 확인
   * (* 부담작업의 평가결과가 O인 것이 있는지? (일단은 체크하지 않음))
   */
  if (!investigation.value.sops || investigation.value.sops.length === 0) {
    message.alert({
      title: '안내',
      message: '단위작업을 하나 이상 등록하시기 바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  } else {
    // const _data = _.filter(investigation.value.sops, (sop) => {
    //   return !sop.heavyWorks || sop.heavyWorks.length === 0
    // })
    // if (_data && _data.length > 0) {
    //   const _sops = _.map(_data, 'sopName')
    //   message.alert({
    //     title: '안내',
    //     message: `부담작업이 입력되지 않은 단위작업이 존재합니다.\n(* ${_sops.toString()})`,
    //     type: 'warning' // success / info / warning / error
    //   })
    //   return
    // }
    // const _investigationData = _.filter(investigation.value.sops, (sop) => {
    //   return (
    //     _.findIndex(sop.heavyWorks, (heavyWork) => {
    //       return !(heavyWork.detailJobContents && heavyWork.assessResult)
    //     }) > -1
    //   )
    // })
    // if (_investigationData && _investigationData.length > 0) {
    //   const _sops = _.map(_investigationData, 'sopName')
    //   message.alert({
    //     title: '안내',
    //     message: `부담작업 중 조사가 되지 않은 단위작업이 존재합니다.\n(* ${_sops.toString()})`,
    //     type: 'warning' // success / info / warning / error
    //   })
    //   return
    // }
  }
  message.confirm({
    title: '확인',
    message: '유해요인 조사하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      investigation.value.chgUserId = user.value.userId
      investigation.value.investigationStartDate = investigation.value.period![0]
      investigation.value.investigationEndDate = investigation.value.period![1]
      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function completeInvestigationCallback() {
  message.requestSuccess()
  getDetail()
  emits('emitStep', {
    name: 'currentStep',
    param: {
      stepCd: 'HI00000005',
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  })
}

/******************************
 * TODO (목적): 근골격계 조사계획 삭제
 *******************************/
function deleteInvestigation() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.heaInvestigationPlanId),
        method: 'DELETE'
      }).then(() => {
        emits('emitStep', {
          name: 'closePopup'
        })
        message.requestSuccess()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}

function keySetting(_data: any) {
  props.param.heaInvestigationPlanId = _data
  emits('emitStep', {
    name: 'keySetting',
    param: _data
  })
  tabItems.value[1].disabled = false
  getDetail()
}
</script>

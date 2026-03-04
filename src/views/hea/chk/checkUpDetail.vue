<template>
  <div>
    <!-- <c-step
    stepperGrpCd="HEA_CHECKUP_STEP_CD"
    :currentStepCd="popupParam.stepCd"
    :param="popupParam"
    v-model:value="popupParam.stepCd"
    @currentStep="currentStep"
    >
  </c-step> -->
    <c-tab
      type="horizon"
      :dense="true"
      :tabItems="tabItems"
      :inlineLabel="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :checkUp="checkUp"
          :temp="temp"
          :contentHeight="props.contentHeight"
          @changeStatus="changeStatus"
          @getDetail="getDetail"
          @closePopup="closePopup"
          @update="update"
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
import { checkupType } from './checkupType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkUpDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaCheckupPlanId: stringNull
    hospitalId: stringNull
  }
  contentHeight: stringNull
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
      heaCheckupPlanId: '',
      hospitalId: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const checkUp = ref<checkupType>({
  heaCheckupPlanId: '',
  plantCd: '',
  checkupName: '',
  checkupTypeCd: null,
  uploadFlag: 'N',
  checkupStartDate: '',
  checkupEndDate: '',
  checkupDateArray: [],
  regUserId: '',
  chgUserId: '',
  hospitalId: null,
  hospitalName: '',
  hospitalLocation: '',
  typeFlag: 'Y'
})
const getUrl = ref('')
const temp = ref('')
const tab = ref('plan')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 2 + 'px' : '620px'
)
const tabItems = computed(() => {
  let _items: Array<tabItemsType> = [
    {
      name: 'plan',
      icon: 'edit',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./checkUpPlan.vue`))
    }
  ]
  if (props.popupParam.heaCheckupPlanId) {
    _items = _.concat(_items, [
      {
        name: 'result',
        icon: 'assignment',
        label: '건강진단 결과',
        component: defineAsyncComponent(() => import(`./checkUpResult.vue`))
      }
      // { name: 'suspect', icon: 'sick', label: '유소견자 처리', component: defineAsyncComponent(() => import(`./checkupSuspectRegister.vue`)) }
    ])
  }
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
  // url setting
  getUrl.value = selectConfig.hea.checkup.plan.get.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 검진결과 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.heaCheckupPlanId) {
    $http({
      url: $format(getUrl.value, props.popupParam.heaCheckupPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(checkUp.value, _result.data)
      if (checkUp.value.checkupStartDate && checkUp.value.checkupEndDate) {
        checkUp.value.checkupDateArray = [
          checkUp.value.checkupStartDate,
          checkUp.value.checkupEndDate
        ]
      }
    })
  }
}

/******************************
 * TODO (목적): 상태감지
 *******************************/
function changeStatus(_heaCheckupPlanId: any) {
  props.popupParam.heaCheckupPlanId = _heaCheckupPlanId
  getDetail()
}
function closePopup() {
  emits('closePopup')
}

/******************************
 * TODO (목적): 다른 탭에서 기존 업로드한 검진결과 데이터삭제시 부모 및 다른자식에도 반영
 *******************************/
function update(key: any) {
  temp.value = key
}
</script>

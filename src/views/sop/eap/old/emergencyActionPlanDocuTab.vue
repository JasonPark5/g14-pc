<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 tabvertical">
    <c-tab
      ref="plantDocuTab"
      type="vertical"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :emerActPlanDocu="emerActPlanDocu"
          @closePopup="closePopup"
          @transInfo="transInfo"
          @changeStatus="changeStatus"
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
  name: 'emergencyActionPlanDocuTab'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['transInfo', 'closePopup', 'changeStatus'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    sopEmergencyPlanId: stringNull
  }
  contentHeight: stringNull | numberNull
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
      sopEmergencyPlanId: ''
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
const editable = ref(true)
const emerActPlanDocu = ref<any>({
  sopEmergencyPlanId: '',
  plantCd: '',
  documentNo: '',
  emergencyPlanName: '',
  emergencyTypeCd: null,
  emergencyClassCd: '',
  damageTypeExpectPeopleNumber: '',
  expectDamageRange: '',
  expectCause: '',
  processActionMatter: '',
  damageTypeEquip: [],
  mdmChemMaterialIds: [],
  emergencyReactNotice: '',
  evacuationProcedures: '',
  evacuationAfterAction: '',
  processAccidents: [],
  edus: [],
  managerId: '',
  mobileNo: '',
  useFlag: 'Y',
  regUserId: '',
  chgUserId: ''
})
const getUrl = ref('')
const tab = ref('info')
const updateMode = ref(false)

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'edit',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./emergencyActionPlanDocuBase.vue`))
    },
    {
      name: 'equipment',
      icon: 'groups',
      label: '관련 설비 및 물질',
      component: defineAsyncComponent(() => import(`./emergencyActionRelation.vue`)),
      disabled: props.param.sopEmergencyPlanId ? false : true
    },
    {
      name: 'edu',
      icon: 'school',
      label: '관련 교육',
      component: defineAsyncComponent(() => import(`./emergencyEdu.vue`)),
      disabled: props.param.sopEmergencyPlanId ? false : true
    },
    {
      name: 'accident',
      icon: 'assessment',
      label: '관련 사고',
      component: defineAsyncComponent(() => import(`./emergencyActionAccident.vue`)),
      disabled: props.param.sopEmergencyPlanId ? false : true
    },
    {
      name: 'file',
      icon: 'perm_media',
      label: '첨부',
      component: defineAsyncComponent(() => import(`./emergencyActionPlanDocuFile.vue`)),
      disabled: props.param.sopEmergencyPlanId ? false : true
    }
  ]

  return items
})
const tabHeight = computed(() =>
  props.contentHeight && !isNaN(props.contentHeight) ? props.contentHeight - 10 + 'px' : '815px'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => emerActPlanDocu.value,
  () => {
    emits('transInfo', emerActPlanDocu.value)
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
  getUrl.value = selectConfig.sop.eap.planDocu.get.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.param.sopEmergencyPlanId) {
    $http({
      url: $format(getUrl.value, props.param.sopEmergencyPlanId),
      method: 'GET'
    }).then((_result: any) => {
      emerActPlanDocu.value = _result.data
      updateMode.value = true
    })
  }
}
function closePopup(data: any) {
  emits('closePopup', data)
}
function transInfo(data: any) {
  emits('transInfo', data)
}
function changeStatus(data: any) {
  emits('changeStatus')
  props.param.sopEmergencyPlanId = data
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

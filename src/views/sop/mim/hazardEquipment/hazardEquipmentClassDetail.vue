<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <c-tab
        :dense="true"
        :tabItems="tabItems"
        :height="tabHeight"
        :inlineLabel="true"
        v-model:value="tab"
        @tabClick="tabClick"
      >
        <template v-slot:default="tab">
          <component
            :popupParam="popupParam"
            :equipInfo="equipInfo"
            :contentHeight="contentHeight"
            :is="tab.component"
            :attachInfo="attachInfo"
            @closePopup="closePopup"
            @saveCallback="saveCallback"
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
import { equipInfoType } from './hazardEquipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardEquipmentClassDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hhmHazardousMachineryId: stringNull
  }
  contentHeight: numberNull | stringNull
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
      hhmHazardousMachineryId: ''
    }
  },
  contentHeight: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('hazardEquipmentInfo')
const equipInfo = ref<equipInfoType>({
  hhmHazardousMachineryId: '',
  equipmentTypeCd: '',
  equipmentCd: '',
  equipmentNo: '',
  equipmentTypeName: '',
  equipmentName: '',
  plantCd: null,
  plantName: '',
  machineryClassification: null,
  machineryClassificationName: '',
  itemNo: '',
  inspectionKindCd: null,
  manufacturer: '',
  manufactDate: '',
  emplacementPlace: '',
  emplacementMonth: '',
  demolitionMonth: '',
  passNumber: '',
  ewrNo: '',
  amount: '',
  esignBasisRatedLoad: '',
  esignBasisKind: '',
  inspCertificateIssuanceDate: '',
  lastInspectionDate: '',
  inspectionSubjectFlag: null,
  inspectionCycle: null,
  nextInspectionDate: '',
  reasonExemptionInspection: '',
  machineryName: '',
  gradeCd: null,
  departmentDeptCd: '',
  departmentUserId: '',
  relatedLaws: '',
  remark: '',
  regUserId: '',
  chgUserId: '',
  subProcessCd: '',
  useFlag: 'Y',
  protectDevice: '',
  volume: '',
  validStartDate: '',
  validEndDate: '',
  possibleDisaster: '',
  hazardEquipmentHistoryModels: [],
  equipmentImproveModels: []
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'HAZARD_EQUIPMENT_INFO',
  taskKey: ''
})
const getUrl = ref('')
const validPeriod = ref<any>([])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  return String(props.contentHeight - 14) + 'px'
})
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'hazardEquipmentInfo',
      icon: 'info',
      label: '유해위험기계기구 정보',
      component: defineAsyncComponent(() => import(`./hazardEquipmentInfo.vue`)),
      key: uid()
    }
  ]
  if (props.popupParam.hhmHazardousMachineryId) {
    _items.push(
      {
        name: 'hazardEquipmentHistory',
        icon: 'history',
        label: '점검이력',
        component: defineAsyncComponent(() => import(`./hazardEquipmentHistory.vue`)),
        key: uid()
      },
      {
        name: 'hazardCausePrevention',
        icon: 'construction',
        label: '개선관리',
        component: defineAsyncComponent(() => import(`./hazardCausePrevention.vue`)),
        key: uid()
      }
    )
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  getUrl.value = selectConfig.sop.hhm.hazard.check.get.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.hhmHazardousMachineryId) {
    $http({
      url: $format(getUrl.value, props.popupParam.hhmHazardousMachineryId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(equipInfo.value, _result.data)
      emits('setRegInfo', _result.data)

      if (_result.data.validStartDate && _result.data.validEndDate) {
        validPeriod.value = [_result.data.validStartDate, _result.data.validEndDate]
      }
      attachInfo.value.taskKey = props.popupParam.hhmHazardousMachineryId
    })
  }
}
function closePopup() {
  emits('closePopup')
}
function tabClick() {
  getDetail()
}
function saveCallback(data: any) {
  props.popupParam.hhmHazardousMachineryId = data
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

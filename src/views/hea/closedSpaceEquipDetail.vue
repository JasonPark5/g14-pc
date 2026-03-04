<template>
  <!-- 
  Stepper에서 제외할 항목
  CSE0000002 : 신청중
  CSE0000003 : 신청완료
  CSE0000004 : 대여중
  CSE0000005 : 반납완료
-->
  <c-step
    stepperGrpCd="HEA_CLOSED_SPACE_EQUIP_STEP_CD"
    :stepRejectItems="stepRejectItems"
    :currentStepCd="requestStepCd"
    :param="param"
    v-model:value="requestStepCd"
    @getDetail="getDetail"
    @setHeaClosedSpaceEquipmentGiveId="setHeaClosedSpaceEquipmentGiveId"
    @closePopup="closePopup"
  />
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { giveEquipType } from './closedSpace'

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
  name: 'closedSpaceEquipDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
    heaClosedSpaceEquipmentGiveId?: stringNull
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
  popupParam: () => ({
    heaClosedSpaceEquipmentGiveId: ''
  })
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const requestStepCd = ref('CSE0000001')
const editable = ref(true)
const detailUrl = ref('')
const giveEquipment = ref<giveEquipType>({
  heaClosedSpaceEquipmentGiveId: '',
  plantCd: '',
  requestDate: '',
  regUserId: '',
  spaceNameCd: null,
  spaceNameName: '',
  giveStatusCd: '',
  requestStepCd: '',
  closedSpaceEquipmentGiveItemModels: [],
  deleteClosedSpaceEquipmentGiveItemModels: [],
  closedSpaceEquipmentReturnItemModels: [],
  deleteClosedSpaceEquipmentReturnItemModels: []
})

/******************************
 * @Computed_선언
 *******************************/
const param = computed(() => {
  return {
    heaClosedSpaceEquipmentGiveId: props.popupParam.heaClosedSpaceEquipmentGiveId,
    giveEquipment: giveEquipment.value
  }
})
const stepRejectItems = computed(() => ['CSE0000002', 'CSE0000003', 'CSE0000004', 'CSE0000005'])
const isOld = computed(() => Boolean(props.popupParam.heaClosedSpaceEquipmentGiveId))

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
 * TODO (목적): 초기 스테퍼 세팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.hea.cse.gives.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.heaClosedSpaceEquipmentGiveId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(giveEquipment.value, _result.data)
      if (giveEquipment.value.closedSpaceEquipmentGiveItemModels!.length > 0) {
        _.forEach(giveEquipment.value.closedSpaceEquipmentGiveItemModels, (item) => {
          item.rentPeriod = [item.rentStartDate, item.rentEndDate]
        })
      }
      if (giveEquipment.value.closedSpaceEquipmentReturnItemModels!.length > 0) {
        _.forEach(giveEquipment.value.closedSpaceEquipmentReturnItemModels, (item) => {
          item.rentPeriod = [item.rentStartDate, item.rentEndDate]
        })
      }
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
      setStep()
    })
  } else giveEquipment.value.regUserId = user.value.userId
}
/******************************
 * TODO (목적): 스텝 설정
 *******************************/
function setStep() {
  requestStepCd.value = giveEquipment.value.requestStepCd
  if (!isOld.value) requestStepCd.value = 'CSE0000001'
  else if (giveEquipment.value.requestStepCd === 'CSE0000006') requestStepCd.value = 'CSE0000006'
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * TODO (목적): id 설정
 *******************************/
function setHeaClosedSpaceEquipmentGiveId(heaClosedSpaceEquipmentGiveId?: stringNull) {
  props.popupParam.heaClosedSpaceEquipmentGiveId = heaClosedSpaceEquipmentGiveId
  getDetail()
}
</script>

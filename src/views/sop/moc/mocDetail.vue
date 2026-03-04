<template>
  <c-step
    :stepperGrpCd="stepperGrpCd"
    :currentStepCd="popupParam.mocStepCd"
    :param="param"
    :stepDisabledItems="stepDisabledItems"
    v-model:value="mocStepCd"
    @stepBystep="stepBystep"
    @keySetting="keySetting"
    @changePreStartup="changePreStartup"
    @closePopup="closePopup"
  />
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
  name: 'mocDetail'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopMocId: stringNull
    mocTypeCd: stringNull
    mocStepCd: stringNull
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
      sopMocId: '',
      mocTypeCd: '',
      mocStepCd: ''
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
const mocStepCd = ref('')
const detailUrl = ref('')
const param = ref({
  sopMocId: '',
  mocTypeCd: '',
  mocStepCd: '',
  committeeHold: {
    sopMocId: '', // MOC 일련번호
    changeApprovalFlag: '', // 변경 승인 여부
    changeApprovalReason: '', // 변경 승인 사유
    changeApprovalDate: '' // 승인일
  },
  changePreStartup: ''
})
const stepDisabledItems = ref<Array<string>>([])

/******************************
 * @Computed_선언
 *******************************/
const stepperGrpCd = computed(() =>
  props.popupParam.mocTypeCd === 'MT00000001'
    ? 'MOC_NORMAL_STEP_CD'
    : props.popupParam.mocTypeCd === 'MT00000005'
      ? 'MOC_TEMP_STEP_CD'
      : 'MOC_EMERGENCY_STEP_CD'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.popupParam.mocStepCd,
  () => {
    setStep()
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
  detailUrl.value = selectConfig.sop.moc.change.approvalFlag.get.url
  // url setting
  // code setting
  // list setting
  setStep()
  getDetail()
}
/******************************
 * TODO (목적): 변경관리 승인여부 판단 정보 조회
 *******************************/
function getDetail() {
  _.extend(param.value, props.popupParam)
  if (props.popupParam.sopMocId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopMocId),
      method: 'GET'
    }).then((_result: any) => {
      // 변경관리 승인여부 판단
      _.extend(param.value.committeeHold, _result.data)
      stepDisabledItems.value = []
      if (param.value.committeeHold.changeApprovalFlag !== 'Y') {
        if (props.popupParam.mocTypeCd === 'MT00000001') {
          stepDisabledItems.value = ['MS00000010', 'MS00000015']
        } else {
          stepDisabledItems.value = ['MT00000010', 'MT00000015']
        }
      }
    })
  }
}
/******************************
 * TODO (목적): CStep에 맞는 진행상태 setting
 *******************************/
function setStep() {
  /**
   * ## 정상 변경
   * MS00000010 MS00000015 단계는 같은 단계로 취급
   * MS00000010으로 데이터가 저장되지 않고 MS00000015으로 저장
   * MS00000015인 경우 팝업에서는 '평가실행'으로 표시되도록 MS00000010으로 셋팅
   *
   * ## 임시 변경
   * MT00000010 MT00000015 MT00000020 단계는 같은 단계로 취급
   * MT00000010으로 데이터가 저장되지 않고 MT00000020으로 저장
   * MT00000020인 경우 팝업에서는 '평가실행'으로 표시되도록 MT00000010으로 셋팅
   *
   * ## 비상 변경
   * ME00000008 ME00000010 단계는 같은 단계로 취급
   * ME00000008으로 데이터가 저장되지 않고 ME00000010으로 저장
   * ME00000010인 경우 팝업에서는 '실시'으로 표시되도록 ME00000008으로 셋팅
   *  */
  if (props.popupParam.mocStepCd === 'MS00000015') {
    mocStepCd.value = 'MS00000010'
  } else if (props.popupParam.mocStepCd === 'MT00000020') {
    mocStepCd.value = 'MT00000010'
  } else if (props.popupParam.mocStepCd === 'ME00000010') {
    mocStepCd.value = 'ME00000008'
  } else {
    // 신규등록인 경우 진행상태 셋팅
    const mocStepCdTemp =
      props.popupParam.mocTypeCd === 'MT00000001'
        ? 'MS00000000'
        : props.popupParam.mocTypeCd === 'MT00000005'
          ? 'MT00000000'
          : 'ME00000001'

    // 보고자 하는 상태 표시
    mocStepCd.value = props.popupParam.mocStepCd
      ? _.clone(props.popupParam.mocStepCd)
      : mocStepCdTemp
  }
}
/******************************
 * TODO (목적): step 변경 후 상세 조회
 * @param (1): 변경할 상태코드
 *******************************/
function stepBystep(stepCd: string) {
  props.popupParam.mocStepCd = stepCd
  getDetail()
}
/******************************
 * TODO (목적): id 셋팅
 * @param (1): id
 *******************************/
function keySetting(key: stringNull) {
  props.popupParam.sopMocId = key
}
/******************************
 * TODO (목적): 가동전 점검 정보 변경
 *******************************/
function changePreStartup() {
  param.value.changePreStartup = uid()
}
/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

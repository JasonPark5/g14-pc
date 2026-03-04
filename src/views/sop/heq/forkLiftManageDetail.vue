<template>
  <div>
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
          :forkLiftData="forkLiftData"
          @getDetail="getDetail"
          :contentHeight="contentHeight"
          :height="tabHeight"
          @closePopup="closePopup"
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
import { forkLiftPopupParamType, forkLiftType } from './forkLift'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'forkLiftManageDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'getDetail', 'datachange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam?: forkLiftPopupParamType
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
      heqForkLiftId: ''
    }
  },
  forkLiftData: () => {
    return {
      heqForkLiftId: '',
      plantCd: '',
      processCd: '',
      vendorCd: '',
      facilityTypeId: '',
      facilityTypeCd: '',
      facilityTypeName: '',
      facilityName: '',
      deviceNo: '',
      installLocation: '',
      carryinDate: '',
      useStartYmd: '',
      useEndYmd: '',
      safetyDate: '',
      safetyResultFlag: 'Y',
      checkAction: '',
      managerNo: '',
      managerUserId: '',
      managerUserName: '',
      regUserId: '',
      chgUserId: '',
      validFlagName: '일 남음',
      specifications: '',
      operationAtor: '',
      checkValidPeriod: '',

      forkLiftSafetyMeasureList: [],
      deleteForkLiftSafetyMeasureList: [],
      forkLiftHistoryList: [],
      deleteForkLiftHistoryList: []
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'FORKLIFT_INFO',
      taskKey: ''
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
const forkLiftData = ref<forkLiftType>({
  heqForkLiftId: '',
  plantCd: '',
  processCd: '',
  vendorCd: '',
  facilityTypeId: '',
  facilityTypeCd: '',
  facilityTypeName: '',
  facilityName: '',
  deviceNo: '',
  installLocation: '',
  carryinDate: '',
  useStartYmd: '',
  useEndYmd: '',
  safetyDate: '',
  safetyResultFlag: 'Y',
  checkAction: '',
  managerNo: '',
  managerUserId: '',
  managerUserName: '',
  regUserId: '',
  chgUserId: '',
  validFlagName: '',
  specifications: '',
  operationAtor: '',
  checkValidPeriod: '',

  forkLiftSafetyMeasureList: [],
  deleteForkLiftSafetyMeasureList: [],
  forkLiftHistoryList: [],
  deleteForkLiftHistoryList: []
})
const useDate = ref<any>([])
const attachInfo = ref<attachSettingType>({})
const getUrl = ref('')
const tab = ref('forkLiftManageInfo')
/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 1 + 'px' : '635px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'forkLiftManageInfo',
      icon: 'info',
      label: '상세정보',
      component: defineAsyncComponent(() => import(`./forkLiftManageInfo.vue`))
    }
  ]
  if (props.popupParam.heqForkLiftId) {
    _items.push({
      name: 'forkLiftManageHistory',
      icon: 'construction',
      label: '점검이력',
      component: defineAsyncComponent(() => import(`./forkLiftManageHistory.vue`))
    })
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
  getUrl.value = selectConfig.sop.heq.forkLift.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 중장비 조회
 *******************************/
function getDetail() {
  if (props.popupParam.heqForkLiftId) {
    $http({
      url: $format(getUrl.value, props.popupParam.heqForkLiftId),
      method: 'GET'
    }).then((_result: any) => {
      forkLiftData.value = _.clone(_result.data)
      if (_result.data.useStartYmd && _result.data.useEndYmd) {
        useDate.value = [forkLiftData.value.useStartYmd, forkLiftData.value.useEndYmd]
      }
      datachange()
      attachInfo.value.taskKey = props.popupParam.heqForkLiftId
    })
  }
}
function datachange() {
  if (forkLiftData.value.checkValidPeriod && forkLiftData.value.safetyDate) {
    forkLiftData.value.validFlagName = getAddYear(
      forkLiftData.value.safetyDate,
      Number(forkLiftData.value.checkValidPeriod)
    )
  }
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

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
          :param="popupParam"
          :facility="facility"
          :height="tabHeight"
          :disabled="disabled"
          :isOld="isOld"
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
import { hazardFacilityType } from './hazardFacility'

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
  name: 'hazardFacilityDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    facilityCd: stringNull
    search: boolean
    isApprContent: boolean
  }
  contentHeight?: stringNull
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
  contentHeight: null,
  popupParam: () => {
    return {
      facilityCd: '',
      search: false,
      isApprContent: false
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
const facility = ref<hazardFacilityType>({
  plantCd: '', // 사업장코드
  facilityCd: '', // 시설 코드
  facilityNo: '', // 시설 관리번호
  facilityName: '', // 시설명
  processCd: '', // 공정코드
  hcfFacilityTypeCd: null, // 시설유형 코드
  hcfInspectionCycleCd: null, // 정기검사주기 코드
  lastRemunerationDate: '', // 최종보수일
  nextInspectionDate: '', // 차기검사일
  lastSelfCheckDate: '', // 최종자체점검일
  nextSelfCheckDate: '', // 차기자체점검일

  installationPlace: '', // 설치장소
  annualHandling: null, // 연간취급량(톤/년)
  facilityCapacity: null, // 시설용량(㎥)
  installationDate: '', // 설치일
  disasterPreventionEquipment: '', // 방재설비
  remarks: '', // 비고
  modeOfTransport: '', // 운송방식
  transportMethod: '', // 운반방식
  tankSpecifications: null, // 탱크 사양(재질 및 용량(㎥, ton)등)
  carryingCapacity: null, // 운반용량(㎥, ton)
  distance: null, // 거리(km)
  pipeMaterial: '', // 배관재질

  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  hazardChems: [], // 빈도
  deleteHazardChems: [], // [삭제] 빈도
  selfCheckHistory: [] // 점검이력
})
const useFlagItems = ref<Array<codeMasterType>>([])
const detailUrl = ref('')
const saveUrl = ref('')
const tab = ref('hazardFacilityInfo')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 1 + 'px' : '635px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'hazardFacilityInfo',
      icon: 'info',
      label: '상세정보',
      component: defineAsyncComponent(() => import(`./hazardFacilityInfo.vue`))
    }
  ]
  if (props.popupParam.facilityCd) {
    _items.push({
      name: 'hazardFacilityHistory',
      icon: 'construction',
      label: '점검이력',
      component: defineAsyncComponent(() => import(`./hazardFacilityHistory.vue`))
    })
  }
  return _items
})
const isOld = computed(() => Boolean(props.popupParam.facilityCd))
const disabled = computed(() => {
  return (
    // facility.value.approvalStatusCd === 'ASC0000001' && !props.popupParam.isApprContent
    false
  )
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
  detailUrl.value = selectConfig.env.facility.get.url
  saveUrl.value = transactionConfig.env.facility.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getDetail()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getDetail() {
  if (props.popupParam.facilityCd) {
    $http({
      url: $format(detailUrl.value, props.popupParam.facilityCd),
      method: 'GET'
    }).then((_result: any) => {
      facility.value = _result.data
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

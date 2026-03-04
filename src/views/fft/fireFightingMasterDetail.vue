<template>
  <div>
    <c-tab
      type="horizon"
      :dense="true"
      :inlineLabel="true"
      :tabItems="tabItems"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :fireFighting="fireFighting"
          :isOld="isOld"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
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
import { fireFightingType } from './fireFighting'

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
  name: 'fireFightingMasterDetail'
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
  contentHeight?: stringNull
  popupParam: {
    sopFireFightingId?: stringNull
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
  contentHeight: null,
  popupParam: () => {
    return {
      sopFireFightingId: ''
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
const tab = ref('info')
const editable = ref(true)
const detailUrl = ref('')
const fireFighting = ref<fireFightingType>({
  sopFireFightingId: '', // 소방설비 일련번호
  plantCd: null, // 사업장
  plantName: null, // 사업장
  sopFireFightingTypeCd: null, // 유형
  sopFireFightingTypeName: null, // 유형
  sopFireFightingKindCd: null, // 점검 소방시설 종류
  sopFireFightingKindName: '', // 점검 소방시설 종류
  manageNo: '', // 관리번호
  fireFightingName: '', // 소방설비명
  deptCd: '', // 관리부서
  processCd: '', // 관련공정
  sopFireFightinhReplacementCycleCd: '', // 소방설비 교체 주기
  amount: '', // 수량
  chmDangerMstId: '', // 관련 위험물 저장소 일련번호
  location: '', // 설비위치
  installDate: '', // 설치일
  disposeFlag: 'N', // 폐기여부
  disposeDate: '', // 폐기일
  deleteFlag: 'N', // 삭제여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  replacementHistroies: [],
  deleteReplacementHistroies: [],
  checks: [],
  history: []
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.sopFireFightingId))
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight + 'px' : '500px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'info',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./fireFightingInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'history',
      icon: 'construction',
      label: '점검이력',
      component: defineAsyncComponent(() => import(`./fireFightingHistory.vue`))
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
  detailUrl.value = selectConfig.fft.fireFighting.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopFireFightingId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(fireFighting.value, _result.data)
    })
  }
}
/******************************
 * TODO (목적): emit
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

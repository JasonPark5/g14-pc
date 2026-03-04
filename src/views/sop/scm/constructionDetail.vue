<template>
  <div>
    <c-tab
      type="horizon"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :construction="construction"
          :isOld="isOld"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
          @closePopup="closePopup"
          @changeStatus="changeStatus"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { constructionPopupParamType, constructionType } from './construction'

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
  name: 'constructionDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: constructionPopupParamType
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
      sopConstructionId: ''
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
const tab = ref('base')
const construction = ref<constructionType>({
  sopConstructionId: '', // 공사 일련번호
  constructionName: '', // 공사명
  constructionDetails: '', // 공사내역
  constructionStartDate: '', // 공사 시작일
  constructionEndDate: '', // 공사 종료일
  period: [],
  constructionFinishFlag: 'N', // 공사 종료 여부
  safetyHealthManageCost: 0, // 안전보건관리비(총 액)
  costCenter: '', // 코스트센터
  onSiteManager: '', // 현장 총괄
  safetyManager: '', // 안전책임자
  vendorCd: '', // 주 공사업체
  sopMocId: '', // MOC 일련번호
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  vendors: [], // 참영업체
  deleteVendors: [], // 참영업체 [삭제]
  entryVendors: [], // 업체출입 명단
  deleteEntryVendors: [], // 업체출입 명단 [삭제]
  entryUsers: [], // 출입자 명단
  deleteEntryUsers: [], // 출입자 명단 [삭제]
  equipments: [], // 장비 명세표
  deleteEquipments: [] // 장비 명세표 [삭제]
})
const detailUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => String(props.contentHeight - 3))
const isOld = computed(() => Boolean(props.popupParam.sopConstructionId))
const tabItems = ref([
  {
    name: 'base',
    icon: 'info',
    label: '공사정보',
    component: defineAsyncComponent(() => import(`./constructionInfo.vue`))
  }
])
const addTabItems = ref<any>([
  {
    name: 'entryExit',
    icon: 'exit_to_app',
    label: '업체 출입현황',
    component: defineAsyncComponent(() => import(`./constructionEntryExitStatus.vue`))
  },
  {
    name: 'status',
    icon: 'info',
    label: '공사관련 작업 현황',
    component: defineAsyncComponent(() => import(`./constructionRelactionTask.vue`))
  }
])
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
  detailUrl.value = selectConfig.sop.scm.construction.get.url
  // code setting
  // list setting
  getDetail()
  if (props.popupParam.sopConstructionId) {
    tabItems.value = tabItems.value.concat(addTabItems.value)
  }
}
/******************************
 * TODO (목적): 공사 상세 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        sopConstructionId: props.popupParam.sopConstructionId
      }
    }).then((_result: any) => {
      _.extend(construction.value, _result.data)
      construction.value.period = [
        construction.value.constructionStartDate,
        construction.value.constructionEndDate
      ]
      if (construction.value.vendors && construction.value.vendors.length > 0) {
        _.forEach(construction.value.vendors, (item: any) => {
          item.period = [item.participationStartDate, item.participationEndDate]
        })
      }
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  } else {
    // 신규등록인 경우
    // nothing...
  }
}
/******************************
 * TODO (목적): 창닫기 콜백
 *******************************/
function closePopup() {
  emits('closePopup')
}
function changeStatus(data: string) {
  props.popupParam.sopConstructionId = data
  tabItems.value = tabItems.value.concat(addTabItems.value)
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

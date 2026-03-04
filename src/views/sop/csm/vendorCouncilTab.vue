<template>
  <div>
    <c-tab
      type="horizon"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :tabParam="tabParam"
          :attachInfo="attachInfo"
          :contentHeight="contentHeight"
          @changeStatus="changeStatus"
          @getDetail="getDetail"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
import { vendorCoucilPopupParamType, vendorCoucilType } from './vendorCoucil'

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
  name: 'vendorCouncilTab'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  popupParam: vendorCoucilPopupParamType
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
      councilId: ''
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
const tabParam = ref<vendorCoucilType>({
  councilId: '',
  plantCd: '',
  councilDate: '',
  councilContents: '',
  councilTypeCd: null,
  councilTitle: '',
  regUserId: '',
  chgUserId: '',

  attendeeInModels: [],
  attendeeOutModels: [],
  coucilVendorModels: [],
  deletecoucilVendorModels: [],
  deleteAttendeeInModels: [],
  deleteAttendeeOutModels: [],
  improveList: [],

  imprImmData: '',
  imprData: ''
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SOP_COUNCIL',
  taskKey: ''
})
const detailUrl = ref('')
const tab = ref('councilInfo')
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.councilId))
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'councilInfo',
      icon: 'edit',
      label: '기본정보 및 참석자',
      component: defineAsyncComponent(() => import(`./vendorCouncilInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'councilImpr',
      icon: 'auto_fix_normal',
      label: '개선/진행상태',
      disabled: props.popupParam.councilId ? false : true,
      component: defineAsyncComponent(() => import(`./vendorCouncilImpr.vue`))
    })
  }
  return _items
})

const tabHeight = computed(() => String(props.contentHeight - 15))

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
  detailUrl.value = selectConfig.mdm.cim.vendor.council.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 협의체 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.councilId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.councilId),
      method: 'GET'
    }).then((_result: any) => {
      tabParam.value.imprImmData = []
      tabParam.value.imprData = []
      tabParam.value = _result.data
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
      attachInfo.value.taskKey = props.popupParam.councilId

      if (tabParam.value.improveList && tabParam.value.improveList.length > 0) {
        // 즉시조치
        tabParam.value.imprImmData = _.filter(tabParam.value.improveList, {
          ibmClassCd: 'IC00000005'
        })
        // 개선요청
        tabParam.value.imprData = _.filter(tabParam.value.improveList, {
          ibmClassCd: 'IC00000001'
        })
      }
    })
  } else {
    tabParam.value.councilDate = getToday()
  }
}
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function closePopup(data: any) {
  emits('closePopup', data)
}
function changeStatus(data: string) {
  props.popupParam.councilId = data
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

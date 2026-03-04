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
          :popupParam="popupParam"
          :proceeding="proceeding"
          :attachInfo="attachInfo"
          :isOld="isOld"
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
import { proceedingsType } from './proceedings'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'proceedingsDetail'
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
    proceedingsId: stringNull
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
      proceedingsId: ''
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
const proceeding = ref<proceedingsType>({
  proceedingsId: '',
  plantCd: '',
  proceedingsDate: '',
  proceedingsContents: '',
  proceedingsTitle: '',
  regUserId: '',
  chgUserId: '',
  attendeeInModels: [],
  attendeeOutModels: [],
  deleteAttendeeInModels: [],
  deleteAttendeeOutModels: [],
  imprs: [],
  imprImms: []
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'OSH_PROCEEDINGS',
  taskKey: ''
})
const tab = ref('info')
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.proceedingsId))
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'edit',
      label: '기본정보 및 참석자',
      component: defineAsyncComponent(() => import(`./proceedingsInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'impr',
      icon: 'auto_fix_normal',
      label: '개선상황',
      component: defineAsyncComponent(() => import(`./proceedingsImpr.vue`))
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
  detailUrl.value = selectConfig.sai.osh.proceedings.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 산업안전보건협의체 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.proceedingsId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(proceeding.value, _result.data)
      attachInfo.value.taskKey = props.popupParam.proceedingsId
      emits('setRegInfo', _result.data)
    })
  } else {
    proceeding.value.proceedingsDate = getToday()
  }
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

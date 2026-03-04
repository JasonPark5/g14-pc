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
          :govSchedule="govSchedule"
          :attachInfo="attachInfo"
          @getDetail="getDetail"
          :contentHeight="contentHeight"
          :height="tabHeight"
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
import { govScheduleType } from './schedule'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'govScheduleDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

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
    govScheduleMstId?: stringNull
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
      govScheduleMstId: ''
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
const tab = ref('govScheduleInfo')
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'GOV_SCHEDULE_MST',
  taskKey: ''
})
const govSchedule = ref<govScheduleType>({
  govScheduleMstId: '', // 대관업무 마스터 일련번호
  govScheduleTypeCd: null, // 대관업무구분
  plantCd: null, // 사업장코드
  govScheduleName: '', // 대관업무명
  govScheduleCycleCd: null, // 법정 주기
  remarks: '', // 내용
  useFlag: 'Y', // 사용여부
  inspType: null, // 검사-종류
  relatedLawsCd: null, // 검사-관련법규
  inspTarget: '', // 검사-대상 시설
  contStatus: null, // 계약-상태
  contType: null, // 계약-구분
  contVendor: '', // 계약-업체
  users: [],
  deleteUsers: []
})
const editable = ref(true)
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 1 + 'px' : '635px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'govScheduleInfo',
      icon: 'info',
      label: '대관업무 기본정보',
      component: defineAsyncComponent(() => import(`./govScheduleInfo.vue`))
    }
  ]
  if (props.popupParam.govScheduleMstId) {
    _items.push({
      name: 'govScheduleHistory',
      icon: 'construction',
      label: '대관업무 실시이력',
      component: defineAsyncComponent(() => import(`./govScheduleHistory.vue`))
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
  // code setting
  detailUrl.value = selectConfig.env.gov.mst.get.url
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.govScheduleMstId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { govScheduleMstId: props.popupParam.govScheduleMstId }
    }).then((_result: any) => {
      govSchedule.value = _result.data
      attachInfo.value.taskKey = props.popupParam.govScheduleMstId
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

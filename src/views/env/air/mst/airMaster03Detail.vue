<template>
  <div>
    <c-tab
      type="horizon"
      :dense="true"
      :tabItems="tabItems"
      :inlineLabel="true"
      v-model:value="tab"
      :height="tabHeight"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :param="popupParam"
          @insertPreventiveInfo="updateMode"
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'airMaster03Detail'
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

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  contentHeight?: stringNull
  popupParam: {
    envAirMstPreventiveId?: stringNull
    plantCd?: stringNull
    tabName?: stringNull
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
      envAirMstPreventiveId: '',
      plantCd: '',
      tabName: ''
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
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 6 + 'px' : '620px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'govScheduleInfo',
      icon: 'info',
      label: '대기 방지시설 기본정보',
      component: defineAsyncComponent(() => import(`./airMaster03Info.vue`))
    }
  ]
  if (props.popupParam.envAirMstPreventiveId) {
    _items.push(
      {
        name: 'govScheduleHistory',
        icon: 'construction',
        label: '방지시설 부품/이력 관리',
        component: defineAsyncComponent(() => import(`./airMaster03Part.vue`))
      },
      {
        name: 'govScheduleHistory2',
        icon: 'construction',
        label: '방지시설 보수이력',
        component: defineAsyncComponent(() => import(`./airMaster03History.vue`))
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
  // url setting
  // code setting
  if (props.popupParam.tabName) tab.value = props.popupParam.tabName
  // if (props.popupParam.envAirMstPreventiveId != '')
  //   tabItems.value = tabItems.value.concat(addTabItems.value)
  // list setting
}
/******************************
 * TODO (목적): 모드 업데이트
 *******************************/
function updateMode(envAirMstPreventiveId?: stringNull) {
  props.popupParam.envAirMstPreventiveId = envAirMstPreventiveId
  // tabItems.value = tabItems.value.concat(addTabItems.value)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

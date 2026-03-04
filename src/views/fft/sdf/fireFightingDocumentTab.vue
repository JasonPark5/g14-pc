<template>
  <div>
    <c-tab
      :dense="true"
      :tabItems="tabItems"
      :height="tabHeight"
      type="vertical"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :sopFireFightingDocumentClassCd="tab.sopFireFightingDocumentClassCd"
          :label="tab.label"
          :innerTab="true"
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
  name: 'fireFightingDocumentTab'
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
  gubun?: stringNull
  contentHeight?: stringNull
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  gubun: '',
  contentHeight: null,
  height: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(false)
const tab = ref('tab1')

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => {
  let items = [] as Array<tabItemsType>
  if (props.gubun === 'simulation') {
    items = [
      {
        name: 'tab1',
        label: '지도',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000004'
      },
      {
        name: 'tab2',
        label: '화재발생시 행동요령',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000005'
      },
      {
        name: 'tab3',
        label: '활동예시',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000006'
      },
      {
        name: 'tab4',
        label: '본관 1층 평면도',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000007'
      }
    ]
  } else if (props.gubun === 'self') {
    items = [
      {
        name: 'tab1',
        label: '조직도<br/>(본관)',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentOrg.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000008'
      },
      {
        name: 'tab2',
        label: '조직도<br/>(가공공장)',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentOrg.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000009'
      },
      {
        name: 'tab3',
        label: '조직도<br/>(조립공장)',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentOrg.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000010'
      },
      {
        name: 'tab4',
        label: '조직도<br/>(엔진공장)',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentOrg.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000011'
      },
      {
        name: 'tab5',
        label: '조직도<br/>(서비스/<br/>물류반/<br/>판금공장동/<br/>폐수처리장',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentOrg.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000012'
      },
      {
        name: 'tab6',
        label: '야간 조직도',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentOrg.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000013'
      },
      {
        name: 'tab7',
        label: '행동요령',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000014'
      },
      {
        name: 'tab8',
        label: '업무분장',
        component: markRaw(defineAsyncComponent(() => import(`./fireFightingDocumentEditor.vue`))),
        sopFireFightingDocumentClassCd: 'FFDC000015'
      }
    ]
  }
  return items
})
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 680
    ? Number(props.contentHeight) - 1 + 'px'
    : '790px'
)
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
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

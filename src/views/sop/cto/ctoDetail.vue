<template>
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
        :cto="cto"
        :imprTabInfo="imprTabInfo"
        :contentHeight="contentHeight"
        :isOld="isOld"
        :disabled="disabled"
        @getDetail="getDetail"
        @closePopup="closePopup"
      />
    </template>
  </c-tab>
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
import { ctoType } from './cto'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'ctoDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    sopCtoId: stringNull
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
      sopCtoId: ''
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
const cto = ref<ctoType>({
  sopCtoId: '',
  plantCd: '',
  ctoDate: '',
  ctoTime: '',
  observeUserId: '',
  observeCount: '',
  mdmSopId: '',
  workArea: '',
  ctoCompleteFlag: 'N',
  improveContents: '',
  priorityContents: '',
  managerUserId: '',
  sopName: '',
  processName: '',
  regUserId: '',
  chgUserId: '',
  workCharacteristics: '',
  humanFactors: '',
  coreActionItems: '',
  activityModels: [],
  ctoChecklistModels: [],
  ctoImproveModels: []
})
const tab = ref('info')
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.sopCtoId)
})
const disabled = computed(() => {
  return cto.value.ctoCompleteFlag === 'Y'
})
const tabHeight = computed(() => String(props.contentHeight - 1))
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'edit',
      label: '행동관찰 정보',
      component: defineAsyncComponent(() => import(`./ctoTab.vue`)),
      key: uid()
    }
  ]
  if (isOld.value) {
    items.push({
      name: 'impr',
      icon: 'construction',
      label: '개선관리',
      component: defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)),
      key: uid()
    })
  }
  return items
})
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.sopCtoId,
    ibmTaskTypeCd: 'ITT0000060',
    ibmTaskUnderTypeCd: 'ITTU000095',
    requestContents: cto.value.sopName + ' / ' + cto.value.processName,
    disabled: disabled.value,
    isOld: isOld.value,
    isTable: false,
    gridItem: {
      listUrl: '',
      param: null,
      title: '체크리스트 항목별 개선목록',
      merge: [],
      data: _.filter(cto.value.ctoChecklistModels, (result: any) => {
        return result.ibmTooltip
      }),
      columns: [
        {
          name: 'checklistName',
          field: 'checklistName',
          label: '체크리스트 항목',
          align: 'left',
          style: 'width:400px',
          sortable: false
        },
        {
          name: 'selectValueName',
          field: 'selectValueName',
          label: '양호/불량/해당없음',
          style: 'width:130px',
          align: 'center',
          sortable: false
        },
        {
          name: 'remarks',
          field: 'remarks',
          label: '비고',
          align: 'center',
          style: 'width: 250px',
          sortable: false
        }
      ],
      research: {}
    },
    gridOther: {
      title: '항목외 개선 목록'
    }
  }
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
  detailUrl.value = selectConfig.sop.cto.get.url
  // code setting
  // list setting
  getDetail()
}
const getDetail = () => {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopCtoId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(cto.value, _result.data)
    })
  } else {
    cto.value.ctoDate = getToday()
    cto.value.ctoTime = '03:00'
    cto.value.observeUserId = user.value.userId
  }
}
const closePopup = (data: object | any) => {
  emits('closePopup', data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
